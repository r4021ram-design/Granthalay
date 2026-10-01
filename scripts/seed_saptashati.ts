import fs from 'fs';
import Database from 'better-sqlite3';

const dbPath = 'storage/granth.db';
if (fs.existsSync(dbPath)) {
  const db = new Database(dbPath);
  const bookData = JSON.parse(fs.readFileSync('public/data/books/granth-durga-saptashati.json', 'utf8'));
  const b = bookData.book;

  // Insert or replace book
  const insertBook = db.prepare(`
    INSERT OR REPLACE INTO books (id, title, author, description, language, page_count, status, source_type, original_filename, original_file_path, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertBook.run(
    b.id,
    b.title,
    b.author,
    b.description,
    b.language,
    b.page_count,
    b.status,
    b.source_type,
    b.original_filename,
    b.original_file_path,
    b.created_at,
    b.updated_at
  );

  // Insert or replace pages
  const insertPage = db.prepare(`
    INSERT OR REPLACE INTO pages (id, book_id, page_number, original_image_path, preprocessed_image_path, width, height, status, ocr_confidence, unresolved_issue_count, ocr_text, verified_text, verified_at, verified_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((pages) => {
    for (const p of pages) {
      insertPage.run(
        p.id,
        p.book_id,
        p.page_number,
        p.original_image_path,
        p.preprocessed_image_path,
        p.width,
        p.height,
        p.status,
        p.ocr_confidence,
        p.unresolved_issue_count,
        p.ocr_text,
        p.verified_text,
        p.verified_at,
        p.verified_by,
        p.created_at,
        p.updated_at
      );
    }
  });

  tx(bookData.pages);
  console.log('Successfully seeded granth-durga-saptashati into SQLite DB storage/granth.db!');
} else {
  console.log('storage/granth.db does not exist, static fallback JSON will be used.');
}
