import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import { fileURLToPath } from 'url';
import { Repository } from './repository.js';
import type { Book, Page } from '../shared/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const STORAGE_ROOT = path.resolve(__dirname, '../storage');
export const UPLOADS_DIR = path.join(STORAGE_ROOT, 'uploads');
export const PAGES_DIR = path.join(STORAGE_ROOT, 'pages');
export const PREPROCESSED_DIR = path.join(STORAGE_ROOT, 'preprocessed');
export const EXPORTS_DIR = path.join(STORAGE_ROOT, 'exports');

// Ensure all storage directories exist
[STORAGE_ROOT, UPLOADS_DIR, PAGES_DIR, PREPROCESSED_DIR, EXPORTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export interface PreprocessingOptions {
  grayscale?: boolean;
  normalize?: boolean;
  threshold?: boolean;
  thresholdValue?: number;
  sharpen?: boolean;
}

export const DocumentProcessor = {
  // Safe path validation to prevent directory traversal
  sanitizeFilename(name: string): string {
    const base = path.basename(name);
    return base.replace(/[^a-zA-Z0-9_.-]/g, '_');
  },

  // Image preprocessing pipeline that NEVER modifies the original source
  async preprocessPageImage(
    inputPath: string,
    outputPath: string,
    options: PreprocessingOptions = { grayscale: true, normalize: true }
  ): Promise<{ width: number; height: number; format: string }> {
    let pipeline = sharp(inputPath);

    // Auto-orient based on EXIF
    pipeline = pipeline.rotate();

    if (options.grayscale !== false) {
      pipeline = pipeline.grayscale();
    }

    if (options.normalize !== false) {
      pipeline = pipeline.normalize();
    }

    if (options.sharpen) {
      pipeline = pipeline.sharpen();
    }

    if (options.threshold && options.thresholdValue !== undefined) {
      pipeline = pipeline.threshold(options.thresholdValue);
    }

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const info = await pipeline.png().toFile(outputPath);
    return {
      width: info.width,
      height: info.height,
      format: info.format,
    };
  },

  // Process uploaded image file directly
  async processImageUpload(
    file: { originalname: string; path: string; mimetype: string },
    bookTitle: string,
    author: string,
    language: 'sa' | 'hi' | 'mixed' | 'devanagari' = 'sa'
  ): Promise<Book> {
    const book = Repository.createBook({
      title: bookTitle || file.originalname.replace(/\.[^/.]+$/, ''),
      author: author || 'अज्ञात',
      description: `Uploaded image scripture document: ${file.originalname}`,
      language,
      page_count: 1,
      status: 'UPLOADED',
      source_type: 'images',
      original_filename: file.originalname,
      original_file_path: file.path,
    });

    const bookPageDir = path.join(PAGES_DIR, book.id);
    fs.mkdirSync(bookPageDir, { recursive: true });

    const pageImageName = `page-1.png`;
    const destOriginalPath = path.join(bookPageDir, pageImageName);

    // Convert/copy original image to standard PNG in pages dir
    const meta = await sharp(file.path).rotate().png().toFile(destOriginalPath);

    // Create preprocessed version
    const preprocessedPath = path.join(PREPROCESSED_DIR, book.id, `page-1.png`);
    await this.preprocessPageImage(destOriginalPath, preprocessedPath);

    // Save page record
    Repository.createPage({
      book_id: book.id,
      page_number: 1,
      original_image_path: `/storage/pages/${book.id}/${pageImageName}`,
      preprocessed_image_path: `/storage/preprocessed/${book.id}/page-1.png`,
      width: meta.width,
      height: meta.height,
      status: 'UNPROCESSED',
      ocr_confidence: 0,
      unresolved_issue_count: 0,
    });

    return Repository.getBookById(book.id)!;
  },

  // Process uploaded PDF document
  async processPdfUpload(
    file: { originalname: string; path: string; mimetype: string },
    bookTitle: string,
    author: string,
    language: 'sa' | 'hi' | 'mixed' | 'devanagari' = 'sa'
  ): Promise<Book> {
    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    const book = Repository.createBook({
      title: bookTitle || file.originalname.replace(/\.[^/.]+$/, ''),
      author: author || 'अज्ञात',
      description: `Scanned PDF scripture document: ${file.originalname}`,
      language,
      page_count: pageCount,
      status: 'UPLOADED',
      source_type: 'pdf',
      original_filename: file.originalname,
      original_file_path: file.path,
    });

    const bookPageDir = path.join(PAGES_DIR, book.id);
    const bookPreprocessedDir = path.join(PREPROCESSED_DIR, book.id);
    fs.mkdirSync(bookPageDir, { recursive: true });
    fs.mkdirSync(bookPreprocessedDir, { recursive: true });

    // Initialize page records for each page in PDF using batch transaction
    const pageRecords: Array<Omit<Page, 'id' | 'created_at' | 'updated_at'>> = [];
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      pageRecords.push({
        book_id: book.id,
        page_number: pageNum,
        original_image_path: `/api/books/${book.id}/pdf-page/${pageNum}`,
        preprocessed_image_path: `/storage/preprocessed/${book.id}/page-${pageNum}.png`,
        status: 'UNPROCESSED',
        ocr_confidence: 0,
        unresolved_issue_count: 0,
      });
    }
    Repository.createPagesBatch(pageRecords);

    // Pre-render the first page in the background so it is instantly viewable
    this.renderPdfPageToDisk(book.id, file.path, 1).catch(err => {
      console.warn(`Background pre-render of page 1 failed for book ${book.id}:`, err);
    });

    return Repository.getBookById(book.id)!;
  },

  // Render a specific page of a PDF document to PNG on disk using pdfjs-dist and canvas
  async renderPdfPageToDisk(
    bookId: string,
    pdfFilePath: string,
    pageNumber: number,
    scale: number = 2.0
  ): Promise<string> {
    const bookPageDir = path.join(PAGES_DIR, bookId);
    fs.mkdirSync(bookPageDir, { recursive: true });
    const outputFilename = `page-${pageNumber}.png`;
    const outputPath = path.join(bookPageDir, outputFilename);

    if (fs.existsSync(outputPath)) {
      return outputPath;
    }

    const pdfBytes = fs.readFileSync(pdfFilePath);
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
    const { createCanvas } = await import('@napi-rs/canvas');

    const canvasFactory = {
      create(w: number, h: number) {
        const c = createCanvas(w, h);
        return { canvas: c, context: c.getContext('2d') };
      },
      reset(c: any, w: number, h: number) {
        c.canvas.width = w;
        c.canvas.height = h;
      },
      destroy(c: any) {
        c.canvas = null;
        c.context = null;
      }
    };

    const loadingTask = (pdfjs as any).getDocument({
      data: new Uint8Array(pdfBytes),
      canvasFactory,
      useSystemFonts: true,
      disableFontFace: false,
    });
    const doc = await loadingTask.promise;
    const pdfPage = await doc.getPage(pageNumber);
    const viewport = pdfPage.getViewport({ scale });

    const width = Math.floor(viewport.width);
    const height = Math.floor(viewport.height);

    const { canvas, context } = canvasFactory.create(width, height);

    await pdfPage.render({
      canvasContext: context as any,
      viewport,
      canvasFactory,
    } as any).promise;

    const pngBuffer = canvas.toBuffer('image/png');
    await sharp(pngBuffer).png().toFile(outputPath);

    // Also generate high-contrast preprocessed version for OCR
    const bookPreprocessedDir = path.join(PREPROCESSED_DIR, bookId);
    fs.mkdirSync(bookPreprocessedDir, { recursive: true });
    const preprocessedPath = path.join(bookPreprocessedDir, outputFilename);
    await this.preprocessPageImage(outputPath, preprocessedPath);

    // Update database page record
    const page = Repository.getPageByBookAndNumber(bookId, pageNumber);
    if (page) {
      Repository.updatePageImages(
        page.id,
        `/storage/pages/${bookId}/${outputFilename}`,
        `/storage/preprocessed/${bookId}/${outputFilename}`,
        width,
        height
      );
    }

    return outputPath;
  },

  // Save a client-rendered PDF page canvas to server disk
  async saveRenderedPage(
    bookId: string,
    pageNumber: number,
    imageBuffer: Buffer
  ): Promise<Page> {
    const bookPageDir = path.join(PAGES_DIR, bookId);
    fs.mkdirSync(bookPageDir, { recursive: true });

    const originalFilename = `page-${pageNumber}.png`;
    const originalDiskPath = path.join(bookPageDir, originalFilename);
    const meta = await sharp(imageBuffer).rotate().png().toFile(originalDiskPath);

    // Also create preprocessed version
    const preprocessedPath = path.join(PREPROCESSED_DIR, bookId, `page-${pageNumber}.png`);
    await this.preprocessPageImage(originalDiskPath, preprocessedPath);

    const page = Repository.getPageByBookAndNumber(bookId, pageNumber);
    if (page) {
      Repository.updatePageImages(
        page.id,
        `/storage/pages/${bookId}/${originalFilename}`,
        `/storage/preprocessed/${bookId}/page-${pageNumber}.png`,
        meta.width,
        meta.height
      );
    } else {
      Repository.createPage({
        book_id: bookId,
        page_number: pageNumber,
        original_image_path: `/storage/pages/${bookId}/${originalFilename}`,
        preprocessed_image_path: `/storage/preprocessed/${bookId}/page-${pageNumber}.png`,
        width: meta.width,
        height: meta.height,
        status: 'UNPROCESSED',
        ocr_confidence: 0,
        unresolved_issue_count: 0,
      });
    }

    return Repository.getPageByBookAndNumber(bookId, pageNumber)!;
  },
};
