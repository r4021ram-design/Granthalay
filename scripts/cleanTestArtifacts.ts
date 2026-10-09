import { db } from '../server/db.ts';

console.log('--- Cleaning Test Artifacts from Database ---');

const initialBooks = db.prepare('SELECT count(*) as count FROM books').get() as any;
const initialPages = db.prepare('SELECT count(*) as count FROM pages').get() as any;
console.log(`Initial Books: ${initialBooks.count}, Initial Pages: ${initialPages.count}`);

db.transaction(() => {
  // Delete non-canonical audit logs
  const auditRes = db.prepare("DELETE FROM audit_logs WHERE book_id IS NOT NULL AND book_id NOT LIKE 'granth-%'").run();
  console.log(`Deleted audit logs: ${auditRes.changes}`);

  // Delete non-canonical books (cascades pages, issues, revisions, ocr_runs)
  const bookRes = db.prepare("DELETE FROM books WHERE id NOT LIKE 'granth-%'").run();
  console.log(`Deleted test books: ${bookRes.changes}`);
})();

// Reclaim space
db.pragma('vacuum');

const finalBooks = db.prepare('SELECT count(*) as count FROM books').get() as any;
const finalPages = db.prepare('SELECT count(*) as count FROM pages').get() as any;
console.log(`Final Canonical Books: ${finalBooks.count}, Final Canonical Pages: ${finalPages.count}`);
