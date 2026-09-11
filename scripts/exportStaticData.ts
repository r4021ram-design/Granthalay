import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const db = new Database('./storage/granth.db');
const publicDataDir = path.resolve(process.cwd(), 'public/data');
const publicBooksDir = path.resolve(publicDataDir, 'books');

fs.mkdirSync(publicBooksDir, { recursive: true });

// 1. Fetch valid canonical books
const books = db.prepare(`
  SELECT b.*,
    (SELECT COUNT(*) FROM pages p WHERE p.book_id = b.id AND p.status = 'VERIFIED') as verified_pages,
    (SELECT COUNT(*) FROM issues i JOIN pages p ON i.page_id = p.id WHERE p.book_id = b.id AND i.status = 'OPEN') as total_issues,
    (SELECT COUNT(*) FROM issues i JOIN pages p ON i.page_id = p.id WHERE p.book_id = b.id AND i.status = 'OPEN' AND i.severity = 'CRITICAL') as critical_issues
  FROM books b
  WHERE b.title NOT LIKE '%Test%' AND b.title NOT LIKE '%परीक्षण%' AND b.author != 'Author'
  ORDER BY b.created_at DESC
`).all() as any[];

console.log(`Exporting ${books.length} canonical books...`);
fs.writeFileSync(path.join(publicDataDir, 'books.json'), JSON.stringify(books, null, 2), 'utf-8');

// 2. Compute stats
const totalBooks = books.length;
const totalPages = books.reduce((acc, b) => acc + (b.page_count || 0), 0);
const verifiedPages = books.reduce((acc, b) => acc + (b.verified_pages || 0), 0);
const totalIssues = books.reduce((acc, b) => acc + (b.total_issues || 0), 0);
const criticalIssues = books.reduce((acc, b) => acc + (b.critical_issues || 0), 0);
const accuracyPercentage = totalPages > 0 ? Math.round((verifiedPages / totalPages) * 100) : 100;

const stats = {
  totalBooks,
  totalPages,
  verifiedPages,
  totalIssues,
  criticalIssues,
  accuracyPercentage,
};

fs.writeFileSync(path.join(publicDataDir, 'stats.json'), JSON.stringify(stats, null, 2), 'utf-8');
console.log('Exported stats:', stats);

// 3. Export each book with its pages
for (const book of books) {
  const pages = db.prepare(`
    SELECT * FROM pages
    WHERE book_id = ?
    ORDER BY page_number ASC
  `).all(book.id) as any[];

  const bookData = {
    book,
    pages,
  };

  fs.writeFileSync(path.join(publicBooksDir, `${book.id}.json`), JSON.stringify(bookData, null, 2), 'utf-8');
  console.log(`Exported book ${book.id} (${pages.length} pages)`);
}

console.log('✅ Static scripture data export complete!');
