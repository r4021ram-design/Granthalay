import path from 'path';
import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import { db } from './db.js';
import { chanakyaToUnicode } from './chanakyaConverter.js';
import { GITA_SECTIONS, TOTAL_GITA_PAGES } from '../src/data/bhagavadGitaIndex.js';

const GITA_PDF_PATH = path.resolve(process.cwd(), 'Docs/bhagvad gita.pdf');
const BOOK_ID = 'granth-bhagavad-gita';

export async function ingestBhagvadGita() {
  console.log('--- Starting Srimad Bhagavad Gita (18 Adhyayas + Aarti) Ingestion ---');
  if (!fs.existsSync(GITA_PDF_PATH)) {
    throw new Error(`File not found: ${GITA_PDF_PATH}`);
  }

  const pdfBytes = fs.readFileSync(GITA_PDF_PATH);
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBytes),
    useSystemFonts: true,
    disableFontFace: true,
    isEvalSupported: false,
    useWorkerFetch: false,
  });
  const doc = await loadingTask.promise;

  // 1. Insert or update the Book record in DB with pure title "श्रीमद्भगवद्गीता"
  const existingBook = db.prepare('SELECT id FROM books WHERE id = ?').get(BOOK_ID);
  const title = 'श्रीमद्भगवद्गीता';
  const author = 'महर्षि वेदव्यास';
  const description = 'सम्पूर्ण १८ अध्याय, ७०० श्लोक एवं श्रीगीताजी की आरती (शुद्ध देवनागरी पाठ व हिन्दी अनुवाद)';

  if (existingBook) {
    db.prepare(`
      UPDATE books SET
        title = ?, author = ?, description = ?, language = 'sa',
        page_count = ?, status = 'FULLY_VERIFIED', source_type = 'pdf',
        original_filename = 'bhagvad gita.pdf', original_file_path = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, author, description, TOTAL_GITA_PAGES, GITA_PDF_PATH, BOOK_ID);
    console.log('Updated existing Bhagavad Gita book record.');
  } else {
    db.prepare(`
      INSERT INTO books (
        id, title, author, description, language, page_count,
        status, source_type, original_filename, original_file_path,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'sa', ?, 'FULLY_VERIFIED', 'pdf', 'bhagvad gita.pdf', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(BOOK_ID, title, author, description, TOTAL_GITA_PAGES, GITA_PDF_PATH);
    console.log('Inserted new Bhagavad Gita book record.');
  }

  // Delete previous pages for clean state
  db.prepare('DELETE FROM pages WHERE book_id = ?').run(BOOK_ID);

  // 2. Prepare page insert statement
  const insertPageStmt = db.prepare(`
    INSERT INTO pages (
      id, book_id, page_number, original_image_path, preprocessed_image_path,
      status, ocr_confidence, unresolved_issue_count, ocr_text, verified_text,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, 'VERIFIED', 99.5, 0, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  // Target PDF pages:
  // 18 Chapters: PDF Page 14 to 245 (232 pages)
  // Aarti: PDF Page 246 (1 page)
  // Total = 233 pages
  const targetPdfPages: number[] = [];
  for (let p = 14; p <= 245; p++) targetPdfPages.push(p);
  targetPdfPages.push(246); // Aarti

  console.log(`Extracting and converting ${targetPdfPages.length} canonical pages into pure Devanagari...`);

  const pageData: Array<{
    pageId: string;
    pageNum: number;
    imagePath: string;
    rawText: string;
    verifiedText: string;
  }> = [];

  for (let idx = 0; idx < targetPdfPages.length; idx++) {
    const pdfPageNum = targetPdfPages[idx];
    const bookPageNum = idx + 1; // Sequential 1 to 233

    const page = await doc.getPage(pdfPageNum);
    const textContent = await page.getTextContent();

    const rawLines: string[] = [];
    let currentLine = '';
    let lastY: number | null = null;

    for (const item of textContent.items as any[]) {
      if (!item.str) continue;
      const y = Math.round(item.transform[5]);
      if (lastY !== null && Math.abs(y - lastY) > 5) {
        if (currentLine.trim()) rawLines.push(currentLine.trim());
        currentLine = item.str;
      } else {
        currentLine += (currentLine ? ' ' : '') + item.str;
      }
      lastY = y;
    }
    if (currentLine.trim()) rawLines.push(currentLine.trim());

    // Convert to Unicode
    const convertedLines = rawLines.map(line => chanakyaToUnicode(line).trim());

    // Strip running headers like "श्रीमद्भगवद्गीता 18", "अध्याय 1" etc.
    const filteredLines = convertedLines.filter(line => {
      if (!line) return false;
      // Strip book running headers with numbers
      if (/^\*?\s*श्रीमद्भगवद्गीता\s*\d*\s*\*?$/u.test(line)) return false;
      if (/^श्रीमद्भगवद्गीता\s+\d+$/u.test(line)) return false;
      if (/^\d+\s*श्रीमद्भगवद्गीता/u.test(line)) return false;
      if (/^अध्याय\s*\d+$/u.test(line)) return false;
      if (/^\\+\s*\\+$/u.test(line)) return false;
      return true;
    });

    let convertedText = filteredLines.join('\n');

    // Add chapter heading if this is the start page of a section
    const section = GITA_SECTIONS.find(s => s.startPage === bookPageNum);
    let formattedText = convertedText;

    if (section) {
      const headerTitle = section.chapterNumber
        ? `॥ ${section.titleSa} • ${section.nameSa} ॥\n`
        : `॥ ${section.titleSa} ॥\n`;
      formattedText = `${headerTitle}\n${formattedText}`;
    }

    const pageId = `${BOOK_ID}-page-${bookPageNum}`;
    const imagePath = `/api/books/${BOOK_ID}/pdf-page/${pdfPageNum}`;

    pageData.push({
      pageId,
      pageNum: bookPageNum,
      imagePath,
      rawText: rawLines.join('\n'),
      verifiedText: formattedText.trim()
    });

    if (bookPageNum % 50 === 0 || bookPageNum === targetPdfPages.length) {
      console.log(`Extracted ${bookPageNum} / ${targetPdfPages.length} pages...`);
    }
  }

  console.log('Saving all pages to database...');
  const insertBatch = db.transaction((items: typeof pageData) => {
    for (const item of items) {
      insertPageStmt.run(
        item.pageId,
        BOOK_ID,
        item.pageNum,
        item.imagePath,
        item.imagePath,
        item.rawText,
        item.verifiedText
      );
    }
  });

  insertBatch(pageData);
  console.log(`--- Bhagavad Gita Ingestion Finished! Total ${targetPdfPages.length} Pages Ingested. ---`);
}

// Execute directly if run via CLI
if (process.argv[1]?.endsWith('ingestBhagvadGita.ts') || process.argv[1]?.endsWith('ingestBhagvadGita.js')) {
  ingestBhagvadGita()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Ingestion failed:', err);
      process.exit(1);
    });
}
