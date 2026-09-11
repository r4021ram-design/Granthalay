import { db } from './db.js';
import { v4 as uuidv4 } from 'uuid';
import type {
  Book,
  Page,
  OCRRun,
  ScripturalIssue,
  PageRevision,
  AuditLogEntry,
  BookStats,
  SearchResult,
  PageStatus,
  BookStatus,
} from '../shared/types.js';

export const Repository = {
  // Books
  createBook(data: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Book {
    const id = uuidv4();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO books (id, title, author, description, language, page_count, status, source_type, original_filename, original_file_path, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.title,
      data.author,
      data.description,
      data.language,
      data.page_count,
      data.status,
      data.source_type,
      data.original_filename,
      data.original_file_path,
      now,
      now
    );

    this.addAuditLog({
      book_id: id,
      action: 'BOOK_CREATED',
      details: `Book created: "${data.title}" with ${data.page_count} pages`,
    });

    return this.getBookById(id)!;
  },

  getBooks(): Book[] {
    const rows = db.prepare(`
      SELECT b.*,
        (SELECT COUNT(*) FROM pages p WHERE p.book_id = b.id AND p.status = 'VERIFIED') as verified_pages,
        (SELECT COUNT(*) FROM issues i JOIN pages p ON i.page_id = p.id WHERE p.book_id = b.id AND i.status = 'OPEN') as total_issues,
        (SELECT COUNT(*) FROM issues i JOIN pages p ON i.page_id = p.id WHERE p.book_id = b.id AND i.status = 'OPEN' AND i.severity = 'CRITICAL') as critical_issues
      FROM books b
      WHERE b.id LIKE 'granth-%'
      ORDER BY b.created_at DESC
    `).all() as any[];

    return rows;
  },

  getBookById(id: string): Book | null {
    const row = db.prepare(`
      SELECT b.*,
        (SELECT COUNT(*) FROM pages p WHERE p.book_id = b.id AND p.status = 'VERIFIED') as verified_pages,
        (SELECT COUNT(*) FROM issues i JOIN pages p ON i.page_id = p.id WHERE p.book_id = b.id AND i.status = 'OPEN') as total_issues,
        (SELECT COUNT(*) FROM issues i JOIN pages p ON i.page_id = p.id WHERE p.book_id = b.id AND i.status = 'OPEN' AND i.severity = 'CRITICAL') as critical_issues
      FROM books b
      WHERE b.id = ?
    `).get(id) as any;

    return row || null;
  },

  updateBookStatus(id: string, status: BookStatus): void {
    db.prepare('UPDATE books SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
    this.addAuditLog({
      book_id: id,
      action: 'BOOK_STATUS_UPDATED',
      details: `Book status changed to: ${status}`,
    });
  },

  updateBookPageCount(id: string, pageCount: number): void {
    db.prepare('UPDATE books SET page_count = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(pageCount, id);
  },

  deleteBook(id: string): void {
    db.prepare('DELETE FROM books WHERE id = ?').run(id);
    this.addAuditLog({
      book_id: id,
      action: 'BOOK_DELETED',
      details: `Book deleted with ID: ${id}`,
    });
  },

  // Pages
  createPage(data: Omit<Page, 'id' | 'created_at' | 'updated_at'>): Page {
    const id = uuidv4();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO pages (id, book_id, page_number, original_image_path, preprocessed_image_path, width, height, status, ocr_confidence, unresolved_issue_count, ocr_text, verified_text, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.book_id,
      data.page_number,
      data.original_image_path,
      data.preprocessed_image_path || null,
      data.width || null,
      data.height || null,
      data.status,
      data.ocr_confidence || 0,
      data.unresolved_issue_count || 0,
      data.ocr_text || null,
      data.verified_text || null,
      now,
      now
    );
    return this.getPageById(id)!;
  },

  createPagesBatch(pages: Array<Omit<Page, 'id' | 'created_at' | 'updated_at'>>): void {
    if (!pages.length) return;
    const insert = db.prepare(`
      INSERT INTO pages (id, book_id, page_number, original_image_path, preprocessed_image_path, width, height, status, ocr_confidence, unresolved_issue_count, ocr_text, verified_text, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertMany = db.transaction((list: typeof pages) => {
      const now = new Date().toISOString();
      for (const data of list) {
        insert.run(
          uuidv4(),
          data.book_id,
          data.page_number,
          data.original_image_path,
          data.preprocessed_image_path || null,
          data.width || null,
          data.height || null,
          data.status || 'UNPROCESSED',
          data.ocr_confidence || 0,
          data.unresolved_issue_count || 0,
          data.ocr_text || null,
          data.verified_text || null,
          now,
          now
        );
      }
    });
    insertMany(pages);
  },

  getPagesByBookId(bookId: string): Page[] {
    return db.prepare('SELECT * FROM pages WHERE book_id = ? ORDER BY page_number ASC').all(bookId) as Page[];
  },

  getPageById(id: string): Page | null {
    const row = db.prepare('SELECT * FROM pages WHERE id = ?').get(id) as Page | undefined;
    return row || null;
  },

  getPageByBookAndNumber(bookId: string, pageNumber: number): Page | null {
    const row = db.prepare('SELECT * FROM pages WHERE book_id = ? AND page_number = ?').get(bookId, pageNumber) as Page | undefined;
    return row || null;
  },

  updatePageOCR(pageId: string, ocrText: string, confidence: number, status: PageStatus, issueCount: number): void {
    db.prepare(`
      UPDATE pages
      SET ocr_text = ?,
          ocr_confidence = ?,
          status = ?,
          unresolved_issue_count = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(ocrText, confidence, status, issueCount, pageId);
  },

  updatePageStatus(pageId: string, status: PageStatus): void {
    db.prepare('UPDATE pages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, pageId);
  },

  updatePageImages(pageId: string, originalPath: string, preprocessedPath?: string, width?: number, height?: number): void {
    db.prepare(`
      UPDATE pages
      SET original_image_path = ?,
          preprocessed_image_path = COALESCE(?, preprocessed_image_path),
          width = COALESCE(?, width),
          height = COALESCE(?, height),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(originalPath, preprocessedPath || null, width || null, height || null, pageId);
  },

  updatePageVerification(pageId: string, verifiedText: string, status: PageStatus, verifiedBy: string = 'User'): void {
    db.prepare(`
      UPDATE pages
      SET verified_text = ?,
          status = ?,
          verified_at = CURRENT_TIMESTAMP,
          verified_by = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(verifiedText, status, verifiedBy, pageId);
  },

  // OCR Runs
  createOCRRun(data: Omit<OCRRun, 'id' | 'created_at'>): OCRRun {
    const id = uuidv4();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO ocr_runs (id, page_id, provider, language, raw_text, confidence, blocks_json, error_message, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.page_id,
      data.provider,
      data.language,
      data.raw_text,
      data.confidence,
      JSON.stringify(data.blocks || []),
      data.error_message || null,
      now
    );

    return {
      id,
      ...data,
      created_at: now,
    };
  },

  getOCRRunsByPageId(pageId: string): OCRRun[] {
    const rows = db.prepare('SELECT * FROM ocr_runs WHERE page_id = ? ORDER BY created_at DESC').all(pageId) as any[];
    return rows.map(r => ({
      ...r,
      blocks: r.blocks_json ? JSON.parse(r.blocks_json) : [],
    }));
  },

  // Issues
  createIssue(data: Omit<ScripturalIssue, 'id' | 'created_at'>): ScripturalIssue {
    const id = uuidv4();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO issues (id, page_id, issue_type, character_offset, length, original_text, suggested_text, reason, severity, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.page_id,
      data.issue_type,
      data.character_offset,
      data.length,
      data.original_text,
      data.suggested_text,
      data.reason,
      data.severity,
      data.status,
      now
    );
    return {
      id,
      ...data,
      created_at: now,
    };
  },

  getIssuesByPageId(pageId: string): ScripturalIssue[] {
    return db.prepare('SELECT * FROM issues WHERE page_id = ? ORDER BY character_offset ASC').all(pageId) as ScripturalIssue[];
  },

  updateIssueStatus(issueId: string, status: string): void {
    db.prepare('UPDATE issues SET status = ? WHERE id = ?').run(status, issueId);
  },

  clearPageIssues(pageId: string): void {
    db.prepare('DELETE FROM issues WHERE page_id = ?').run(pageId);
  },

  // Revisions
  createRevision(data: Omit<PageRevision, 'id' | 'created_at'>): PageRevision {
    const id = uuidv4();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO revisions (id, page_id, previous_text, updated_text, reason, author, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.page_id,
      data.previous_text,
      data.updated_text,
      data.reason,
      data.author,
      now
    );
    return {
      id,
      ...data,
      created_at: now,
    };
  },

  getRevisionsByPageId(pageId: string): PageRevision[] {
    return db.prepare('SELECT * FROM revisions WHERE page_id = ? ORDER BY created_at DESC, rowid DESC').all(pageId) as PageRevision[];
  },

  // Audit Logs
  addAuditLog(entry: { book_id?: string; page_id?: string; action: string; details: string }): void {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO audit_logs (id, book_id, page_id, action, details)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, entry.book_id || null, entry.page_id || null, entry.action, entry.details);
  },

  getAuditLogs(limit: number = 50): AuditLogEntry[] {
    return db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?').all(limit) as AuditLogEntry[];
  },

  // Search Engine
  searchScripture(query: string): SearchResult[] {
    if (!query || !query.trim()) return [];
    const trimmed = query.trim().normalize('NFC');

    const rows = db.prepare(`
      SELECT
        p.id as page_id,
        p.page_number,
        p.status,
        COALESCE(p.verified_text, p.ocr_text) as content,
        b.id as book_id,
        b.title as book_title
      FROM pages p
      JOIN books b ON p.book_id = b.id
      WHERE (p.verified_text LIKE ? OR p.ocr_text LIKE ?)
      ORDER BY b.title ASC, p.page_number ASC
      LIMIT 100
    `).all(`%${trimmed}%`, `%${trimmed}%`) as any[];

    const results: SearchResult[] = [];

    for (const r of rows) {
      const text = (r.content || '').normalize('NFC');
      const index = text.toLowerCase().indexOf(trimmed.toLowerCase());
      if (index !== -1) {
        const start = Math.max(0, index - 40);
        const end = Math.min(text.length, index + trimmed.length + 40);
        const snippet = (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');

        results.push({
          book_id: r.book_id,
          book_title: r.book_title,
          page_id: r.page_id,
          page_number: r.page_number,
          matched_text: trimmed,
          surrounding_context: snippet,
          is_verified: r.status === 'VERIFIED',
          status: r.status,
        });
      }
    }

    return results;
  },

  // Stats
  getBookStats(): BookStats {
    const counts = db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM books WHERE id LIKE 'granth-%') as total_books,
        (SELECT COUNT(*) FROM pages WHERE book_id LIKE 'granth-%') as total_pages,
        (SELECT COUNT(*) FROM pages WHERE book_id LIKE 'granth-%' AND status = 'VERIFIED') as verified_pages,
        (SELECT COUNT(*) FROM issues WHERE page_id IN (SELECT id FROM pages WHERE book_id LIKE 'granth-%') AND status = 'OPEN') as unresolved_issues,
        (SELECT COUNT(*) FROM issues WHERE page_id IN (SELECT id FROM pages WHERE book_id LIKE 'granth-%') AND status = 'OPEN' AND severity = 'CRITICAL') as critical_issues,
        (SELECT AVG(ocr_confidence) FROM pages WHERE book_id LIKE 'granth-%' AND ocr_confidence > 0) as avg_confidence
    `).get() as any;

    const totalPages = counts.total_pages || 0;
    const verifiedPages = counts.verified_pages || 0;
    const percentage = totalPages > 0 ? Math.round((verifiedPages / totalPages) * 100) : 0;

    return {
      total_books: counts.total_books || 0,
      total_pages: totalPages,
      verified_pages: verifiedPages,
      verification_percentage: percentage,
      unresolved_issues: counts.unresolved_issues || 0,
      critical_issues: counts.critical_issues || 0,
      average_ocr_confidence: Math.round((counts.avg_confidence || 0) * 10) / 10,
    };
  },
};
