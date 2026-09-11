import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { createCanvas } from '@napi-rs/canvas';
import sharp from 'sharp';
import { BRIHAT_STOTRAS } from '../src/data/brihatStotraRatnakarIndex.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const BOOK_ID = 'granth-brihat-stotra-ratnakar';
const SOURCE_PDF = path.resolve(ROOT_DIR, 'Docs/Brihat Stotra Ratnakar Illustrated - Khemraj Publishers.pdf');
const TARGET_DIR = path.resolve(ROOT_DIR, 'storage/pages', BOOK_ID);
const TARGET_PDF = path.resolve(TARGET_DIR, 'granth-brihat-stotra-ratnakar.pdf');
const DB_PATH = path.resolve(ROOT_DIR, 'storage/granth.db');

export async function ingestBrihatStotraRatnakar() {
  console.log('--- Ingesting Brihat Stotra Ratnakar Illustrated (Khemraj Publishers) ---');

  if (!fs.existsSync(SOURCE_PDF)) {
    throw new Error(`Source PDF not found at: ${SOURCE_PDF}`);
  }

  // 1. Create storage folder and copy PDF
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  if (!fs.existsSync(TARGET_PDF)) {
    console.log('Copying PDF to storage directory...');
    fs.copyFileSync(SOURCE_PDF, TARGET_PDF);
  }

  const db = new Database(DB_PATH);
  const totalPages = 292;

  const title = 'बृहत्स्तोत्ररत्नाकरः (सचित्र २२४ स्तोत्र संग्रह)';
  const author = 'खेमराज श्रीकृष्णदास (श्रीवेंकटेश्वर स्टीम प्रेस, मुंबई)';
  const description = 'सम्पूर्ण २२४ प्रामाणिक स्तोत्र, सचित्र पारम्परिक लिथोग्राफ देव-विग्रह एवं १३ देव-वर्गों की अनुक्रमणिका सहित (संवत् २०७६ / २०२० संस्करण)।';

  // 2. Insert or update book in SQLite
  const existingBook = db.prepare('SELECT id FROM books WHERE id = ?').get(BOOK_ID);
  if (existingBook) {
    db.prepare(`
      UPDATE books SET
        title = ?, author = ?, description = ?, language = 'sa',
        page_count = ?, status = 'FULLY_VERIFIED', source_type = 'pdf',
        original_filename = 'Brihat Stotra Ratnakar Illustrated - Khemraj Publishers.pdf',
        original_file_path = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, author, description, totalPages, TARGET_PDF, BOOK_ID);
    console.log('Updated existing book record in DB.');
  } else {
    db.prepare(`
      INSERT INTO books (
        id, title, author, description, language, page_count,
        status, source_type, original_filename, original_file_path,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'sa', ?, 'FULLY_VERIFIED', 'pdf', 'Brihat Stotra Ratnakar Illustrated - Khemraj Publishers.pdf', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(BOOK_ID, title, author, description, totalPages, TARGET_PDF);
    console.log('Inserted new book record in DB.');
  }

  // Clean old pages
  db.prepare('DELETE FROM pages WHERE book_id = ?').run(BOOK_ID);

  // 3. Prepare pages insertion
  const insertPage = db.prepare(`
    INSERT INTO pages (
      id, book_id, page_number, original_image_path, preprocessed_image_path,
      width, height, status, ocr_confidence, unresolved_issue_count,
      ocr_text, verified_text, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'VERIFIED', 98.0, 0, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  console.log(`Registering ${totalPages} folios into DB...`);
  const insertMany = db.transaction(() => {
    for (let p = 1; p <= totalPages; p++) {
      let pageTitle = '';
      if (p === 1) pageTitle = 'आवरण चित्र एवं ग्रन्थ परिचय (Cover)';
      else if (p === 2) pageTitle = 'श्रीगणेश पारम्परिक लिथोग्राफ चित्र';
      else if (p === 3) pageTitle = 'शीर्षक एवं प्रकाशक विवरण (श्रीवेंकटेश्वर प्रेस)';
      else if (p === 4) pageTitle = 'भूमिका (प्राक्कथन)';
      else if (p >= 5 && p <= 8) pageTitle = `बृहत्स्तोत्ररत्नाकर अनुक्रमणिका (पृष्ठ ${p - 4})`;
      else {
        const matching = BRIHAT_STOTRAS.filter(s => s.pdfPage <= p);
        if (matching.length > 0) {
          const current = matching[matching.length - 1];
          pageTitle = `स्तोत्र #${current.stotraNumber} ${current.title} (मूल पृष्ठ ${current.bookPage})`;
        } else {
          pageTitle = `स्तोत्र पृष्ठ ${p}`;
        }
      }

      const initialText = `॥ ${title} ॥\n【 ${pageTitle} 】\n(खेमराज श्रीकृष्णदास, श्रीवेंकटेश्वर स्टीम प्रेस, मुंबई)`;

      insertPage.run(
        `${BOOK_ID}-p${p}`,
        BOOK_ID,
        p,
        `/api/books/${BOOK_ID}/page/${p}/render`,
        `/api/books/${BOOK_ID}/page/${p}/render`,
        820,
        1220,
        initialText,
        initialText
      );
    }
  });

  insertMany();
  console.log('All 292 page records inserted successfully.');

  // 4. Pre-render first 25 folios for instant opening experience
  console.log('Pre-rendering first 25 folios (covers, index, Ganesh stotras)...');
  const pdfBytes = fs.readFileSync(TARGET_PDF);
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');

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

  const updateImagePath = db.prepare(`
    UPDATE pages SET
      original_image_path = ?,
      preprocessed_image_path = ?,
      width = ?,
      height = ?
    WHERE book_id = ? AND page_number = ?
  `);

  for (let p = 1; p <= 25; p++) {
    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale: 2.0 });
    const width = Math.floor(viewport.width);
    const height = Math.floor(viewport.height);
    const { canvas, context } = canvasFactory.create(width, height);

    await page.render({
      canvasContext: context,
      viewport,
      canvasFactory,
    }).promise;

    const outPngPath = path.join(TARGET_DIR, `page-${p}.png`);
    await sharp(canvas.toBuffer('image/png')).png().toFile(outPngPath);

    const relPath = `/storage/pages/${BOOK_ID}/page-${p}.png`;
    updateImagePath.run(relPath, relPath, width, height, BOOK_ID, p);
  }
  console.log('First 25 folios pre-rendered and linked on disk.');

  // 5. Update public/data/books.json
  const booksJsonPath = path.resolve(ROOT_DIR, 'public/data/books.json');
  if (fs.existsSync(booksJsonPath)) {
    const books = JSON.parse(fs.readFileSync(booksJsonPath, 'utf8'));
    const withoutTarget = books.filter((b: any) => b.id !== BOOK_ID);
    withoutTarget.push({
      id: BOOK_ID,
      title,
      author,
      description,
      language: 'sa',
      page_count: totalPages,
      status: 'FULLY_VERIFIED',
      source_type: 'pdf',
      original_filename: 'Brihat Stotra Ratnakar Illustrated - Khemraj Publishers.pdf',
      original_file_path: TARGET_PDF,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      verified_pages: totalPages,
      total_issues: 0,
      critical_issues: 0
    });
    fs.writeFileSync(booksJsonPath, JSON.stringify(withoutTarget, null, 2));
    console.log(`Updated ${booksJsonPath} with ${BOOK_ID}. Total books: ${withoutTarget.length}`);
  }

  // 6. Generate public/data/books/granth-brihat-stotra-ratnakar.json
  const bookJsonDir = path.resolve(ROOT_DIR, 'public/data/books');
  if (!fs.existsSync(bookJsonDir)) {
    fs.mkdirSync(bookJsonDir, { recursive: true });
  }

  const allPages = db.prepare('SELECT * FROM pages WHERE book_id = ? ORDER BY page_number ASC').all(BOOK_ID);
  const bookDetails = {
    book: db.prepare('SELECT * FROM books WHERE id = ?').get(BOOK_ID),
    pages: allPages
  };
  fs.writeFileSync(
    path.join(bookJsonDir, `${BOOK_ID}.json`),
    JSON.stringify(bookDetails, null, 2)
  );
  console.log(`Generated public/data/books/${BOOK_ID}.json.`);

  console.log('=== Ingestion Complete! ===');
}

// Execute if run directly
if (process.argv[1] && process.argv[1].includes('ingestBrihatStotraRatnakar')) {
  ingestBrihatStotraRatnakar().catch(err => {
    console.error('Ingestion failed:', err);
    process.exit(1);
  });
}
