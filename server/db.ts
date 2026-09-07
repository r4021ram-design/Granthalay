import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../storage');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'granth.db');
export const db = new Database(dbPath);

// Enable WAL mode for high performance concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT DEFAULT '',
      description TEXT DEFAULT '',
      language TEXT DEFAULT 'sa',
      page_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'UPLOADED',
      source_type TEXT DEFAULT 'pdf',
      original_filename TEXT NOT NULL,
      original_file_path TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      original_image_path TEXT NOT NULL,
      preprocessed_image_path TEXT,
      width INTEGER,
      height INTEGER,
      status TEXT DEFAULT 'UNPROCESSED',
      ocr_confidence REAL DEFAULT 0,
      unresolved_issue_count INTEGER DEFAULT 0,
      ocr_text TEXT,
      verified_text TEXT,
      verified_at DATETIME,
      verified_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
      UNIQUE(book_id, page_number)
    );

    CREATE TABLE IF NOT EXISTS ocr_runs (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      language TEXT NOT NULL,
      raw_text TEXT NOT NULL,
      confidence REAL NOT NULL,
      blocks_json TEXT,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS issues (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      issue_type TEXT NOT NULL,
      character_offset INTEGER NOT NULL,
      length INTEGER NOT NULL,
      original_text TEXT NOT NULL,
      suggested_text TEXT NOT NULL,
      reason TEXT NOT NULL,
      severity TEXT DEFAULT 'WARNING',
      status TEXT DEFAULT 'OPEN',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS revisions (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      previous_text TEXT NOT NULL,
      updated_text TEXT NOT NULL,
      reason TEXT NOT NULL,
      author TEXT DEFAULT 'User',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      book_id TEXT,
      page_id TEXT,
      action TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_pages_book_id ON pages (book_id);
    CREATE INDEX IF NOT EXISTS idx_pages_page_number ON pages (page_number);
    CREATE INDEX IF NOT EXISTS idx_issues_page_id ON issues (page_id);
    CREATE INDEX IF NOT EXISTS idx_revisions_page_id ON revisions (page_id);
    CREATE INDEX IF NOT EXISTS idx_audit_book_id ON audit_logs (book_id);
  `);
}

// Initialize on module load
initDatabase();
