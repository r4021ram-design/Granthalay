export type ScriptureLanguage = 'sa' | 'hi' | 'mixed' | 'devanagari';

export type ScriptureCategory =
  | 'upanishad'
  | 'sukta'
  | 'stotra'
  | 'kavacha'
  | 'sahasranama'
  | 'ashtottarashata'
  | 'ashtaka'
  | 'gita'
  | 'puja_vidhi'
  | 'veda'
  | 'general';

export type ScriptureDeity =
  | 'ganesha'
  | 'shiva'
  | 'devi'
  | 'vishnu'
  | 'rama'
  | 'krishna'
  | 'surya'
  | 'hanuman'
  | 'vedic'
  | 'general';

export interface CanonicalVerse {
  verse_number: number;
  devanagari: string;
  svara?: string;
  iast?: string;
  meaning_hi?: string;
}

export interface CanonicalScripture {
  id: string;
  title_sa: string;
  title_iast: string;
  category: ScriptureCategory;
  deity: ScriptureDeity;
  rishi?: string;
  chhandas?: string;
  viniyoga?: string;
  shanti_patha?: string;
  mula_text: string;
  verses: CanonicalVerse[];
  sanskrit_documents_url?: string;
}

export type BookStatus =
  | 'UPLOADED'
  | 'PROCESSING'
  | 'OCR_COMPLETE'
  | 'REVIEW_REQUIRED'
  | 'PARTIALLY_VERIFIED'
  | 'FULLY_VERIFIED'
  | 'EXPORTED';

export type PageStatus =
  | 'UNPROCESSED'
  | 'PROCESSING'
  | 'OCR_COMPLETE'
  | 'REVIEW_REQUIRED'
  | 'IN_REVIEW'
  | 'VERIFIED';

export type SectionType =
  | 'title'
  | 'subtitle'
  | 'chapter'
  | 'invocation'
  | 'dhyana'
  | 'viniyoga'
  | 'nyasa'
  | 'mantra'
  | 'shloka'
  | 'stotra'
  | 'kavacha'
  | 'commentary'
  | 'meaning'
  | 'phalashruti'
  | 'notes'
  | 'page_number'
  | 'main_text';

export type IssueSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type IssueType =
  | 'missing_matra'
  | 'extra_matra'
  | 'wrong_matra'
  | 'anusvara_confusion'
  | 'chandrabindu_confusion'
  | 'visarga_confusion'
  | 'halant_anomaly'
  | 'suspicious_consonant'
  | 'danda_corruption'
  | 'latin_character'
  | 'digit_corruption'
  | 'duplicated_character'
  | 'unreadable'
  | 'low_confidence';

export type IssueStatus = 'OPEN' | 'ACCEPTED' | 'REJECTED' | 'MANUALLY_RESOLVED';

export interface BoundingBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface OCRWordInfo {
  text: string;
  confidence: number;
  bbox?: BoundingBox;
}

export interface OCRLineInfo {
  text: string;
  confidence: number;
  bbox?: BoundingBox;
  words?: OCRWordInfo[];
}

export interface OCRBlockInfo {
  id: string;
  type: SectionType;
  text: string;
  confidence: number;
  bbox?: BoundingBox;
  lines?: OCRLineInfo[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  language: ScriptureLanguage;
  category?: ScriptureCategory;
  deity?: ScriptureDeity;
  page_count: number;
  status: BookStatus;
  source_type: 'pdf' | 'images';
  original_filename: string;
  original_file_path: string;
  created_at: string;
  updated_at: string;
  verified_pages?: number;
  total_issues?: number;
  critical_issues?: number;
}

export interface Page {
  id: string;
  book_id: string;
  page_number: number;
  original_image_path: string;
  preprocessed_image_path?: string;
  width?: number;
  height?: number;
  status: PageStatus;
  ocr_confidence: number;
  unresolved_issue_count: number;
  ocr_text?: string;
  verified_text?: string;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface OCRRun {
  id: string;
  page_id: string;
  provider: string;
  language: string;
  raw_text: string;
  confidence: number;
  blocks: OCRBlockInfo[];
  error_message?: string;
  created_at: string;
}

export interface ScripturalIssue {
  id: string;
  page_id: string;
  issue_type: IssueType;
  character_offset: number;
  length: number;
  original_text: string;
  suggested_text: string;
  reason: string;
  severity: IssueSeverity;
  status: IssueStatus;
  created_at: string;
}

export interface PageRevision {
  id: string;
  page_id: string;
  previous_text: string;
  updated_text: string;
  reason: string;
  author: string;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  book_id?: string;
  page_id?: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface BookStats {
  total_books: number;
  total_pages: number;
  verified_pages: number;
  verification_percentage: number;
  unresolved_issues: number;
  critical_issues: number;
  average_ocr_confidence: number;
}

export interface SearchResult {
  book_id: string;
  book_title: string;
  page_id: string;
  page_number: number;
  matched_text: string;
  surrounding_context: string;
  is_verified: boolean;
  status: PageStatus;
}
