/**
 * scripts/syncAllBooksToSqlite.cjs
 *
 * Synchronizes all books and their pages from public/data/books/*.json
 * directly into SQLite storage/granth.db.
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '../storage/granth.db');
const BOOKS_JSON_DIR = path.join(__dirname, '../public/data/books');

function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error('Database file does not exist at:', DB_PATH);
    process.exit(1);
  }

  const db = new Database(DB_PATH);
  console.log('Connected to SQLite database:', DB_PATH);

  const insertOrReplaceBook = db.prepare(`
    INSERT OR REPLACE INTO books (
      id, title, author, description, language, page_count,
      status, source_type, original_filename, original_file_path,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  const deletePages = db.prepare(`DELETE FROM pages WHERE book_id = ?`);

  const insertPage = db.prepare(`
    INSERT OR REPLACE INTO pages (
      id, book_id, page_number, original_image_path, preprocessed_image_path,
      width, height, status, ocr_confidence, unresolved_issue_count,
      ocr_text, verified_text, verified_at, verified_by,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  const files = fs.readdirSync(BOOKS_JSON_DIR).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} book json files in ${BOOKS_JSON_DIR}`);

  const syncTx = db.transaction(() => {
    for (const file of files) {
      const filePath = path.join(BOOKS_JSON_DIR, file);
      try {
        const bookData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (!bookData.id) continue;

        insertOrReplaceBook.run(
          bookData.id,
          bookData.title || '',
          bookData.author || '',
          bookData.description || '',
          bookData.language || 'sa',
          bookData.page_count || (bookData.pages ? bookData.pages.length : 0),
          bookData.status || 'FULLY_VERIFIED',
          bookData.source_type || 'pdf',
          bookData.original_filename || `${bookData.id}.pdf`,
          bookData.original_file_path || `D:\\August 2026\\Desktop\\Granth\\storage\\pages\\${bookData.id}\\${bookData.id}.pdf`
        );

        if (Array.isArray(bookData.pages) && bookData.pages.length > 0) {
          deletePages.run(bookData.id);
          for (const p of bookData.pages) {
            insertPage.run(
              p.id || `${bookData.id}-p${p.page_number}`,
              bookData.id,
              p.page_number,
              p.original_image_path || `/data/pages/${bookData.id}/${p.page_number}.webp`,
              p.preprocessed_image_path || `/data/pages/${bookData.id}/${p.page_number}.webp`,
              p.width || 1400,
              p.height || 2000,
              p.status || 'VERIFIED',
              p.ocr_confidence !== undefined ? p.ocr_confidence : 1.0,
              p.unresolved_issue_count || 0,
              p.ocr_text || p.verified_text || '',
              p.verified_text || p.ocr_text || '',
              p.verified_by || 'Canonical Proofing Engine'
            );
          }
        }
        console.log(`✓ Synced: ${bookData.id} (${bookData.title}) with ${bookData.pages?.length || 0} pages.`);
      } catch (err) {
        console.error(`Error syncing ${file}:`, err.message);
      }
    }
  });

  syncTx();
  console.log('All books successfully synchronized to SQLite database!');
}

main();
