/**
 * removeRunningHeaders.cjs
 *
 * Removes physical running headers (e.g. "(१३५) बृहत्स्तोत्ररत्नाकरे", "रामस्तोत्राणि (१८१)")
 * from line 0 of pages in SQLite and JSON.
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '../storage/granth.db');
const JSON_PATH = path.join(__dirname, '../public/data/books/granth-brihat-stotra-ratnakar.json');

const db = new Database(DB_PATH);
const bookData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

function isRunningHeader(line) {
  const t = line.trim();
  if (/^\([०-९\d]+\)\s*बृहत्स्तोत्ररत्नाकरे$/.test(t)) return true;
  if (/^बृहत्स्तोत्ररत्नाकरे\s*\([०-९\d]+\)$/.test(t)) return true;
  if (/^[^\n॥।]+स्तोत्राणि\s*\([०-९\d]+\)$/.test(t)) return true;
  if (/^\([०-९\d]+\)$/.test(t)) return true;
  return false;
}

let removedCount = 0;
const updateStmt = db.prepare(`
  UPDATE pages
  SET verified_text = ?
  WHERE book_id = 'granth-brihat-stotra-ratnakar' AND page_number = ?
`);

for (const page of bookData.pages) {
  const text = page.verified_text || '';
  if (!text) continue;

  const lines = text.split('\n');
  if (lines.length > 0 && isRunningHeader(lines[0])) {
    const header = lines[0].trim();
    // Remove the first line and any following empty line
    lines.shift();
    if (lines.length > 0 && lines[0].trim() === '') {
      lines.shift();
    }
    const newText = lines.join('\n').trim();

    // 1. Update SQLite
    updateStmt.run(newText, page.page_number);

    // 2. Update JSON
    page.verified_text = newText;

    removedCount++;
    console.log(`Page ${page.page_number}: Removed header "${header}"`);
  }
}

fs.writeFileSync(JSON_PATH, JSON.stringify(bookData, null, 2), 'utf8');
db.close();

console.log(`\nSuccessfully removed running headers from ${removedCount} pages.`);
