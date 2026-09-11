import type {
  Book,
  Page,
  BookStats,
  SearchResult,
  AuditLogEntry,
  ScripturalIssue,
  PageRevision,
  OCRRun,
  CanonicalScripture,
} from '../shared/types.js';

const API_BASE = '/api';

async function fetchWithFallback<T>(apiEndpoint: string, staticFallbackUrl: string): Promise<T> {
  try {
    const res = await fetch(apiEndpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Received HTML SPA fallback instead of JSON');
    }
    return (await res.json()) as T;
  } catch {
    // Graceful fallback to static pre-rendered dataset on Vercel
    const fallbackRes = await fetch(staticFallbackUrl);
    if (!fallbackRes.ok) throw new Error(`Fallback failed: ${fallbackRes.status}`);
    return (await fallbackRes.json()) as T;
  }
}

export const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'ok', environment: 'production-static' };
    }
  },

  async getStats(): Promise<BookStats> {
    return fetchWithFallback<BookStats>(`${API_BASE}/stats`, '/data/stats.json');
  },

  async getBooks(): Promise<Book[]> {
    return fetchWithFallback<Book[]>(`${API_BASE}/books`, '/data/books.json');
  },

  async getBook(id: string): Promise<{ book: Book; pages: Page[] }> {
    return fetchWithFallback<{ book: Book; pages: Page[] }>(
      `${API_BASE}/books/${id}`,
      `/data/books/${id}.json`
    );
  },


  async deleteBook(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete book');
  },

  async uploadBook(formData: FormData): Promise<{ success: boolean; book: Book }> {
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Upload failed');
    }
    return res.json();
  },

  async getPage(id: string): Promise<{
    page: Page;
    issues: ScripturalIssue[];
    revisions: PageRevision[];
    ocrRuns: OCRRun[];
  }> {
    const res = await fetch(`${API_BASE}/pages/${id}`);
    if (!res.ok) throw new Error('Page not found');
    return res.json();
  },

  async runPageOCR(pageId: string): Promise<{
    success: boolean;
    page: Page;
    issues: ScripturalIssue[];
    analysis: any;
  }> {
    const res = await fetch(`${API_BASE}/pages/${pageId}/ocr`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'OCR failed' }));
      throw new Error(err.error || 'OCR failed');
    }
    return res.json();
  },

  async saveRenderedPageCanvas(bookId: string, pageNumber: number, imageBase64: string): Promise<{ page: Page }> {
    const res = await fetch(`${API_BASE}/books/${bookId}/page/${pageNumber}/rendered`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    });
    if (!res.ok) throw new Error('Failed to save rendered page canvas');
    return res.json();
  },

  async startPageReview(pageId: string): Promise<{ page: Page }> {
    const res = await fetch(`${API_BASE}/pages/${pageId}/start-review`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to start page review');
    return res.json();
  },

  async verifyPage(
    pageId: string,
    data: {
      verifiedText: string;
      reason?: string;
      author?: string;
      markFullyVerified?: boolean;
    }
  ): Promise<{
    success: boolean;
    page: Page;
    issues: ScripturalIssue[];
    revisions: PageRevision[];
  }> {
    const res = await fetch(`${API_BASE}/pages/${pageId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Verification save failed' }));
      throw new Error(err.error || 'Verification save failed');
    }
    return res.json();
  },

  async resolveIssue(issueId: string, status: 'ACCEPTED' | 'REJECTED' | 'MANUALLY_RESOLVED'): Promise<void> {
    const res = await fetch(`${API_BASE}/issues/${issueId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update issue status');
  },

  async search(query: string): Promise<{ query: string; results: SearchResult[]; count: number }> {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    return res.json();
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    const res = await fetch(`${API_BASE}/audit-logs`);
    return res.json();
  },

  async exportBook(bookId: string, format: 'txt' | 'docx' | 'pdf'): Promise<string> {
    const res = await fetch(`${API_BASE}/books/${bookId}/export/${format}`);
    if (!res.ok) throw new Error(`Export failed for format ${format}`);
    const data = await res.json();
    return data.downloadUrl;
  },

  async getCanonicalReferences(): Promise<Array<Omit<CanonicalScripture, 'verses' | 'mula_text'>>> {
    const res = await fetch(`${API_BASE}/canonical-references`);
    return res.json();
  },

  async getCanonicalReference(id: string): Promise<CanonicalScripture> {
    const res = await fetch(`${API_BASE}/canonical-references/${id}`);
    if (!res.ok) throw new Error('Canonical scripture not found');
    return res.json();
  },

  async matchCanonicalReference(text: string): Promise<{
    matched: boolean;
    scriptureId?: string;
    title_sa?: string;
    confidence: number;
    scripture?: CanonicalScripture;
  }> {
    const res = await fetch(`${API_BASE}/canonical-references/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return res.json();
  },
};
