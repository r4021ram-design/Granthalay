import { describe, it, expect } from 'vitest';
import { Repository } from '../server/repository.js';

describe('Repository, Audit Logs & Non-Destructive Revision Tracking (Section 24 & Section 47)', () => {
  it('creates book and preserves immutable metadata', () => {
    const book = Repository.createBook({
      title: 'अथर्वशीर्ष परीक्षण ग्रन्थ',
      author: 'ऋषि अथर्वा',
      description: 'Test Scripture',
      language: 'sa',
      page_count: 5,
      status: 'UPLOADED',
      source_type: 'images',
      original_filename: 'test.png',
      original_file_path: '/storage/uploads/test.png',
    });

    expect(book.id).toBeDefined();
    expect(book.title).toBe('अथर्वशीर्ष परीक्षण ग्रन्थ');

    const fetched = Repository.getBookById(book.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe('अथर्वशीर्ष परीक्षण ग्रन्थ');
  });

  it('records revisions when text is edited without destroying original OCR', () => {
    const book = Repository.createBook({
      title: 'Revision Test Book',
      author: 'Author',
      description: 'Desc',
      language: 'sa',
      page_count: 1,
      status: 'UPLOADED',
      source_type: 'images',
      original_filename: 'sample.png',
      original_file_path: '/path/to/sample.png',
    });

    const page = Repository.createPage({
      book_id: book.id,
      page_number: 1,
      original_image_path: '/storage/pages/sample.png',
      status: 'OCR_COMPLETE',
      ocr_confidence: 85,
      unresolved_issue_count: 1,
      ocr_text: 'नमस्ते gणपतये',
    });

    expect(page.ocr_text).toBe('नमस्ते gणपतये');

    // Create a revision
    const correctedText = 'नमस्ते गणपतये';
    Repository.createRevision({
      page_id: page.id,
      previous_text: page.ocr_text!,
      updated_text: correctedText,
      reason: 'Corrected accidental Latin character g -> ग',
      author: 'Examiner',
    });

    Repository.updatePageVerification(page.id, correctedText, 'VERIFIED', 'Examiner');

    const updatedPage = Repository.getPageById(page.id)!;
    expect(updatedPage.verified_text).toBe('नमस्ते गणपतये');
    // Original OCR text is STILL preserved
    expect(updatedPage.ocr_text).toBe('नमस्ते gणपतये');
    expect(updatedPage.status).toBe('VERIFIED');

    // Verify revision history is recorded
    const revisions = Repository.getRevisionsByPageId(page.id);
    expect(revisions.length).toBe(1);
    expect(revisions[0].previous_text).toBe('नमस्ते gणपतये');
    expect(revisions[0].updated_text).toBe('नमस्ते गणपतये');
  });

  it('searches Devanagari text accurately', () => {
    const results = Repository.searchScripture('गणपतये');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].matched_text).toBe('गणपतये');
  });
});
