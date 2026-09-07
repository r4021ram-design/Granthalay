import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Repository } from './repository.js';
import { DocumentProcessor, UPLOADS_DIR, PAGES_DIR, PREPROCESSED_DIR, EXPORTS_DIR, STORAGE_ROOT } from './documentProcessor.js';
import { OCRService } from './ocrService.js';
import { analyzeDevanagariText } from './devanagariSafety.js';
import { ExportEngine } from './exportEngine.js';
import { getCanonicalScripturesList, getCanonicalScriptureById, matchCanonicalScripture } from './canonicalReferences.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Serve storage directory statically for image access
app.use('/storage', express.static(STORAGE_ROOT));

// Multer upload config - 2GB limit to handle high-resolution scanned puja granth books
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const safeName = DocumentProcessor.sanitizeFilename(file.originalname);
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2048 * 1024 * 1024 }, // 2GB limit for scanned PDF granth books
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/tiff',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: PDF, PNG, JPG, WEBP, TIFF`));
    }
  },
});

// Health & System Diagnostic
app.get('/api/health', async (_req, res) => {
  const ocrProviders = OCRService.listProviders();
  res.json({
    status: 'ok',
    product: 'Puja Granth Digitizer',
    version: '1.0.0',
    nodeVersion: process.version,
    ocrProviders,
    storageRoot: STORAGE_ROOT,
  });
});

// Stats
app.get('/api/stats', (_req, res) => {
  const stats = Repository.getBookStats();
  res.json(stats);
});

// Books List
app.get('/api/books', (_req, res) => {
  const books = Repository.getBooks();
  res.json(books);
});

// Book Details
app.get('/api/books/:id', (req, res) => {
  const book = Repository.getBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  const pages = Repository.getPagesByBookId(book.id);
  res.json({ book, pages });
});

// Delete Book
app.delete('/api/books/:id', (req, res) => {
  Repository.deleteBook(req.params.id);
  res.json({ success: true });
});

// Upload Book (PDF or Image)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, author, language } = req.body;
    let book;

    if (req.file.mimetype === 'application/pdf') {
      book = await DocumentProcessor.processPdfUpload(
        req.file,
        title,
        author,
        language || 'sa'
      );
    } else {
      book = await DocumentProcessor.processImageUpload(
        req.file,
        title,
        author,
        language || 'sa'
      );
    }

    res.json({ success: true, book });
  } catch (error: any) {
    console.error('Upload processing error:', error);
    res.status(500).json({ error: error.message || 'Failed to process upload' });
  }
});

// Download original PDF file for rendering
app.get('/api/books/:id/pdf', (req, res) => {
  const book = Repository.getBookById(req.params.id);
  if (!book || !fs.existsSync(book.original_file_path)) {
    return res.status(404).json({ error: 'Original PDF file not found' });
  }
  res.sendFile(path.resolve(book.original_file_path));
});

// Serve/Render PDF page on demand (with automatic disk caching)
app.get('/api/books/:id/pdf-page/:pageNumber', async (req, res) => {
  try {
    const { id, pageNumber } = req.params;
    const pageNum = parseInt(pageNumber, 10);
    const book = Repository.getBookById(id);
    if (!book || !fs.existsSync(book.original_file_path)) {
      return res.status(404).json({ error: 'Book or PDF file not found' });
    }

    // Check if already rendered on disk
    const renderedDiskPath = path.join(PAGES_DIR, id, `page-${pageNum}.png`);
    if (fs.existsSync(renderedDiskPath)) {
      return res.sendFile(path.resolve(renderedDiskPath));
    }

    // Render on demand using pdfjs-dist & canvas
    const outputPath = await DocumentProcessor.renderPdfPageToDisk(id, book.original_file_path, pageNum);
    res.sendFile(path.resolve(outputPath));
  } catch (error: any) {
    console.error(`Error rendering PDF page ${req.params.pageNumber}:`, error);
    res.status(500).json({ error: `Failed to render PDF page: ${error.message}` });
  }
});

// Client uploads a rendered page image (e.g. from PDF.js Canvas)
app.post('/api/books/:id/page/:pageNumber/rendered', async (req, res) => {
  try {
    const { id, pageNumber } = req.params;
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 required' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const page = await DocumentProcessor.saveRenderedPage(id, parseInt(pageNumber, 10), buffer);
    res.json({ success: true, page });
  } catch (error: any) {
    console.error('Save rendered page error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Run OCR on a single page
app.post('/api/pages/:id/ocr', async (req, res) => {
  try {
    const page = Repository.getPageById(req.params.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    // Determine disk image path to process
    let imageDiskPath = '';
    if (page.original_image_path.startsWith('/storage/')) {
      imageDiskPath = path.join(STORAGE_ROOT, page.original_image_path.replace('/storage/', ''));
    } else if (page.original_image_path.includes('/pdf-page/')) {
      // If PDF page has not been rendered to disk yet, render it now!
      const book = Repository.getBookById(page.book_id);
      if (book && fs.existsSync(book.original_file_path)) {
        imageDiskPath = await DocumentProcessor.renderPdfPageToDisk(
          page.book_id,
          book.original_file_path,
          page.page_number
        );
      }
    }

    if (!imageDiskPath || !fs.existsSync(imageDiskPath)) {
      return res.status(400).json({
        error: 'Page image has not been rendered to disk yet. Please ensure page canvas is rendered.',
      });
    }

    // Set page to PROCESSING in accordance with state machine
    Repository.updatePageStatus(page.id, 'PROCESSING');

    // Check preprocessed version
    const preprocessedDiskPath = path.join(PREPROCESSED_DIR, page.book_id, `page-${page.page_number}.png`);
    const inputForOCR = fs.existsSync(preprocessedDiskPath) ? preprocessedDiskPath : imageDiskPath;

    const book = Repository.getBookById(page.book_id);
    const bookLanguage = book ? book.language : 'sa';

    const provider = OCRService.getProvider();
    const result = await provider.processImage(inputForOCR, bookLanguage);

    // Analyze Devanagari safety & OCR issue patterns
    const analysis = analyzeDevanagariText(result.text);

    // Clear old open issues for this page
    Repository.clearPageIssues(page.id);

    // Persist identified issues
    for (const issue of analysis.issues) {
      Repository.createIssue({
        page_id: page.id,
        issue_type: issue.issue_type,
        character_offset: issue.character_offset,
        length: issue.length,
        original_text: issue.original_text,
        suggested_text: issue.suggested_text,
        reason: issue.reason,
        severity: issue.severity,
        status: issue.status,
      });
    }

    // Determine page status: if issues or low confidence, REVIEW_REQUIRED; otherwise OCR_COMPLETE.
    // Automated jobs NEVER mark a page as VERIFIED.
    const pageStatus = (analysis.criticalIssuesCount > 0 || analysis.totalIssuesCount > 0 || result.confidence < 80)
      ? 'REVIEW_REQUIRED'
      : 'OCR_COMPLETE';

    // Update page (never populates verified_text without human verification)
    Repository.updatePageOCR(
      page.id,
      result.text,
      result.confidence,
      pageStatus,
      analysis.totalIssuesCount
    );

    // Save OCR Run record
    Repository.createOCRRun({
      page_id: page.id,
      provider: result.provider,
      language: result.language,
      raw_text: result.text,
      confidence: result.confidence,
      blocks: result.blocks,
    });

    Repository.addAuditLog({
      page_id: page.id,
      book_id: page.book_id,
      action: 'OCR_EXECUTED',
      details: `OCR completed for page ${page.page_number}. Confidence: ${result.confidence}%, Status: ${pageStatus}, Issues found: ${analysis.totalIssuesCount}`,
    });

    const updatedPage = Repository.getPageById(page.id);
    const issues = Repository.getIssuesByPageId(page.id);

    res.json({
      success: true,
      page: updatedPage,
      issues,
      analysis,
    });
  } catch (error: any) {
    console.error('Page OCR error:', error);
    res.status(500).json({ error: error.message || 'OCR processing failed' });
  }
});

// Start Review on Page (transitions OCR_COMPLETE or REVIEW_REQUIRED to IN_REVIEW)
app.post('/api/pages/:id/start-review', (req, res) => {
  const page = Repository.getPageById(req.params.id);
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }

  if (page.status === 'OCR_COMPLETE' || page.status === 'REVIEW_REQUIRED') {
    Repository.updatePageStatus(page.id, 'IN_REVIEW');
    Repository.addAuditLog({
      page_id: page.id,
      book_id: page.book_id,
      action: 'REVIEW_STARTED',
      details: `Reviewer started verification workspace inspection for page ${page.page_number}`,
    });
  }

  res.json({ success: true, page: Repository.getPageById(page.id) });
});

// Get Single Page with Issues and Revisions
app.get('/api/pages/:id', (req, res) => {
  const page = Repository.getPageById(req.params.id);
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }

  const issues = Repository.getIssuesByPageId(page.id);
  const revisions = Repository.getRevisionsByPageId(page.id);
  const ocrRuns = Repository.getOCRRunsByPageId(page.id);

  res.json({
    page,
    issues,
    revisions,
    ocrRuns,
  });
});

// Human Verification & Edit Saving with Strict Verification Gate
app.post('/api/pages/:id/verify', (req, res) => {
  try {
    const { verifiedText, reason, author, markFullyVerified } = req.body;
    if (typeof verifiedText !== 'string') {
      return res.status(400).json({ error: 'verifiedText must be provided as a string' });
    }

    const page = Repository.getPageById(req.params.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    // Pre-verification safety analysis
    const analysis = analyzeDevanagariText(verifiedText);

    // CRITICAL ISSUE GATE: Prevent CRITICAL ISSUE -> VERIFIED without resolution
    if (markFullyVerified) {
      if (analysis.criticalIssuesCount > 0) {
        return res.status(400).json({
          error: `Cannot mark page as VERIFIED: ${analysis.criticalIssuesCount} unresolved critical scriptural issue(s) detected. All critical issues must be resolved before verification.`,
          criticalIssues: analysis.issues.filter(i => i.severity === 'CRITICAL'),
        });
      }

      if (!page.original_image_path) {
        return res.status(400).json({
          error: 'Cannot mark page as VERIFIED: Missing original source scan reference.',
        });
      }
    }

    const previousText = page.verified_text || page.ocr_text || '';

    // Create non-destructive revision snapshot if text changed
    if (previousText !== verifiedText) {
      Repository.createRevision({
        page_id: page.id,
        previous_text: previousText,
        updated_text: verifiedText,
        reason: reason || (markFullyVerified ? 'Human verification and approval against source scan' : 'Manual revision edit'),
        author: author || 'Human Reviewer',
      });
    }

    const newStatus = markFullyVerified ? 'VERIFIED' : 'IN_REVIEW';
    Repository.updatePageVerification(page.id, verifiedText, newStatus, author || 'Human Reviewer');

    // Update remaining issue records
    Repository.clearPageIssues(page.id);
    for (const issue of analysis.issues) {
      Repository.createIssue({
        page_id: page.id,
        issue_type: issue.issue_type,
        character_offset: issue.character_offset,
        length: issue.length,
        original_text: issue.original_text,
        suggested_text: issue.suggested_text,
        reason: issue.reason,
        severity: issue.severity,
        status: issue.status,
      });
    }

    Repository.addAuditLog({
      page_id: page.id,
      book_id: page.book_id,
      action: markFullyVerified ? 'PAGE_VERIFIED' : 'PAGE_SAVED',
      details: `Page ${page.page_number} ${markFullyVerified ? 'verified by ' + (author || 'Human Reviewer') : 'updated'}`,
    });

    // Check if entire book is verified
    const allPages = Repository.getPagesByBookId(page.book_id);
    const allVerified = allPages.every(p => p.id === page.id ? newStatus === 'VERIFIED' : p.status === 'VERIFIED');
    if (allVerified) {
      Repository.updateBookStatus(page.book_id, 'FULLY_VERIFIED');
    } else {
      Repository.updateBookStatus(page.book_id, 'PARTIALLY_VERIFIED');
    }

    const updatedPage = Repository.getPageById(page.id);
    const updatedIssues = Repository.getIssuesByPageId(page.id);
    const updatedRevisions = Repository.getRevisionsByPageId(page.id);

    res.json({
      success: true,
      page: updatedPage,
      issues: updatedIssues,
      revisions: updatedRevisions,
    });
  } catch (error: any) {
    console.error('Page verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Resolve or dismiss an issue
app.post('/api/issues/:id/status', (req, res) => {
  const { status } = req.body;
  Repository.updateIssueStatus(req.params.id, status);
  res.json({ success: true });
});

// Library-Wide Search
app.get('/api/search', (req, res) => {
  const query = (req.query.q as string) || '';
  const results = Repository.searchScripture(query);
  res.json({ query, results, count: results.length });
});

// Audit logs
app.get('/api/audit-logs', (_req, res) => {
  const logs = Repository.getAuditLogs(100);
  res.json(logs);
});

// Export endpoints
app.get('/api/books/:id/export/txt', async (req, res) => {
  try {
    const downloadUrl = await ExportEngine.exportToTxt(req.params.id);
    res.json({ success: true, downloadUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/books/:id/export/docx', async (req, res) => {
  try {
    const downloadUrl = await ExportEngine.exportToDocx(req.params.id);
    res.json({ success: true, downloadUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/books/:id/export/pdf', async (req, res) => {
  try {
    const downloadUrl = await ExportEngine.exportToPdf(req.params.id);
    res.json({ success: true, downloadUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Canonical Scripture Reference Library (inspired by SanskritDocuments.org)
app.get('/api/canonical-references', (_req, res) => {
  res.json(getCanonicalScripturesList());
});

app.get('/api/canonical-references/:id', (req, res) => {
  const scripture = getCanonicalScriptureById(req.params.id);
  if (!scripture) {
    return res.status(404).json({ error: 'Canonical scripture not found' });
  }
  res.json(scripture);
});

app.post('/api/canonical-references/match', (req, res) => {
  const { text } = req.body;
  const matchResult = matchCanonicalScripture(text || '');
  let scriptureDetails = null;
  if (matchResult.matched && matchResult.scriptureId) {
    scriptureDetails = getCanonicalScriptureById(matchResult.scriptureId);
  }
  res.json({
    ...matchResult,
    scripture: scriptureDetails,
  });
});

// Global Express error handler (handles Multer errors, file size limits, etc.)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Express request error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'फ़ाइल का आकार अत्यधिक है (अधिकतम 2GB स्वीकृत है)।' });
    }
    return res.status(400).json({ error: `अपलोड त्रुटि: ${err.message}` });
  }
  if (err) {
    return res.status(500).json({ error: err.message || 'आंतरिक सर्वर त्रुटि' });
  }
});

app.listen(PORT, () => {
  console.log(`🕉️ Puja Granth Digitizer server running on http://localhost:${PORT}`);
});
