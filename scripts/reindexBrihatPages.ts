import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const ROOT_DIR = path.resolve();
const DB_PATH = path.resolve(ROOT_DIR, 'storage/granth.db');
const db = new Database(DB_PATH);

console.log('=== Step 1: Remove first 8 pages and re-index Brihat Stotra Ratnakar ===');

// 1. Delete pages 1-8 of granth-brihat-stotra-ratnakar from database
const deleteStmt = db.prepare("DELETE FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' AND page_number <= 8");
const delResult = deleteStmt.run();
console.log(`Deleted ${delResult.changes} preamble/index pages (1-8).`);

// 2. Fetch remaining pages ordered by page_number
const remainingPages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();
console.log(`Remaining scripture pages: ${remainingPages.length}`);

// 3. Re-index remaining pages from 1 to remainingPages.length
const updatePageStmt = db.prepare("UPDATE pages SET page_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
const reindexTx = db.transaction(() => {
  for (let i = 0; i < remainingPages.length; i++) {
    const newPageNum = i + 1;
    updatePageStmt.run(newPageNum, remainingPages[i].id);
  }
});
reindexTx();
console.log(`Successfully re-indexed ${remainingPages.length} scripture pages from 1 to ${remainingPages.length}.`);

// 4. Update book metadata: page_count = remainingPages.length, remove publisher name
const canonicalAuthor = 'पारम्परिक ऋषि-महर्षि एवं आद्य शङ्कराचार्य';
const updateBookStmt = db.prepare("UPDATE books SET page_count = ?, author = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 'granth-brihat-stotra-ratnakar'");
updateBookStmt.run(remainingPages.length, canonicalAuthor);
console.log(`Updated book metadata: page_count = ${remainingPages.length}, author = '${canonicalAuthor}'`);

// 5. Synchronize public/data/books/granth-brihat-stotra-ratnakar.json
const updatedPages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();
const book = db.prepare("SELECT * FROM books WHERE id = 'granth-brihat-stotra-ratnakar'").get();
const bookJsonPath = path.resolve(ROOT_DIR, 'public/data/books/granth-brihat-stotra-ratnakar.json');
fs.writeFileSync(bookJsonPath, JSON.stringify({ book, pages: updatedPages }, null, 2));
console.log('Synchronized public/data/books/granth-brihat-stotra-ratnakar.json!');

// 6. Synchronize public/data/books.json
const booksListPath = path.resolve(ROOT_DIR, 'public/data/books.json');
if (fs.existsSync(booksListPath)) {
  const booksList = JSON.parse(fs.readFileSync(booksListPath, 'utf8'));
  const brihatEntry = booksList.find((b: any) => b.id === 'granth-brihat-stotra-ratnakar');
  if (brihatEntry) {
    brihatEntry.total_pages = remainingPages.length;
    brihatEntry.author = canonicalAuthor;
    brihatEntry.original_filename = 'Brihat Stotra Ratnakar Illustrated.pdf';
    fs.writeFileSync(booksListPath, JSON.stringify(booksList, null, 2));
    console.log('Synchronized public/data/books.json!');
  }
}
