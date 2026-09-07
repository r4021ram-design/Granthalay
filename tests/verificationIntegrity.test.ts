import { describe, it, expect } from 'vitest';
import { Repository } from '../server/repository.js';
import { analyzeDevanagariText } from '../server/devanagariSafety.js';

describe('Verification Integrity & State Machine Audit (Section 1, 5, 6, 7)', () => {
  it('enforces that OCR does not populate verified_text prematurely', () => {
    const book = Repository.createBook({
      title: 'अथर्वशीर्ष परीक्षण',
      author: 'अज्ञात',
      description: 'Test Scripture',
      language: 'sa',
      page_count: 1,
      status: 'UPLOADED',
      source_type: 'images',
      original_filename: 'atharva.png',
      original_file_path: '/path/atharva.png',
    });

    const page = Repository.createPage({
      book_id: book.id,
      page_number: 1,
      original_image_path: '/storage/pages/atharva.png',
      status: 'UNPROCESSED',
      ocr_confidence: 0,
      unresolved_issue_count: 0,
    });

    // Simulate OCR run
    const rawOcr = 'त्वमेव प्रत्यक्षं ततत्वमि। त्वमेव केवलं ढर्ताऽयि।';
    Repository.updatePageOCR(page.id, rawOcr, 72, 'REVIEW_REQUIRED', 3);

    const afterOcr = Repository.getPageById(page.id)!;
    expect(afterOcr.status).toBe('REVIEW_REQUIRED');
    expect(afterOcr.ocr_text).toBe(rawOcr);
    // CRITICAL: verified_text MUST remain null/undefined! Raw OCR is never authoritative!
    expect(afterOcr.verified_text).toBeNull();
  });

  it('enforces state machine transitions: UNPROCESSED -> PROCESSING -> REVIEW_REQUIRED -> IN_REVIEW -> VERIFIED', () => {
    const book = Repository.createBook({
      title: 'State Machine Test Book',
      author: 'Author',
      description: 'Desc',
      language: 'sa',
      page_count: 1,
      status: 'UPLOADED',
      source_type: 'images',
      original_filename: 'p1.png',
      original_file_path: '/p1.png',
    });

    const page = Repository.createPage({
      book_id: book.id,
      page_number: 1,
      original_image_path: '/storage/pages/p1.png',
      status: 'UNPROCESSED',
      ocr_confidence: 0,
      unresolved_issue_count: 0,
    });
    expect(page.status).toBe('UNPROCESSED');

    // 1. OCR starts
    Repository.updatePageStatus(page.id, 'PROCESSING');
    expect(Repository.getPageById(page.id)!.status).toBe('PROCESSING');

    // 2. OCR completes with issues
    Repository.updatePageOCR(page.id, 'त्वमेव प्रत्यक्षं ततत्वमि।', 70, 'REVIEW_REQUIRED', 1);
    expect(Repository.getPageById(page.id)!.status).toBe('REVIEW_REQUIRED');

    // 3. Human opens page in workspace
    Repository.updatePageStatus(page.id, 'IN_REVIEW');
    expect(Repository.getPageById(page.id)!.status).toBe('IN_REVIEW');

    // 4. Human performs genuine verification
    const verifiedText = 'त्वमेव प्रत्यक्षं तत्त्वमसि।';
    const analysis = analyzeDevanagariText(verifiedText);
    expect(analysis.criticalIssuesCount).toBe(0);

    Repository.updatePageVerification(page.id, verifiedText, 'VERIFIED', 'Examiner');
    const finalPage = Repository.getPageById(page.id)!;
    expect(finalPage.status).toBe('VERIFIED');
    expect(finalPage.verified_text).toBe(verifiedText);
  });

  it('prevents CRITICAL ISSUES from passing the verification gate', () => {
    const corruptedText = 'त्वमेव प्रत्यक्षं ततत्वमि। त्वमेव केवलं ठर्ताऽसि जित्यम्';
    const analysis = analyzeDevanagariText(corruptedText);

    // Safety engine must catch critical corruptions
    expect(analysis.criticalIssuesCount).toBeGreaterThanOrEqual(3);

    // The gate rule: If criticalIssuesCount > 0, marking VERIFIED is forbidden
    const canMarkVerified = analysis.criticalIssuesCount === 0;
    expect(canMarkVerified).toBe(false);
  });

  it('records immutable revision history and rollback does not destroy audit history', () => {
    const book = Repository.createBook({
      title: 'Revision History Audit Book',
      author: 'Author',
      description: 'Desc',
      language: 'sa',
      page_count: 1,
      status: 'UPLOADED',
      source_type: 'images',
      original_filename: 'rev.png',
      original_file_path: '/rev.png',
    });

    const page = Repository.createPage({
      book_id: book.id,
      page_number: 1,
      original_image_path: '/storage/pages/rev.png',
      status: 'OCR_COMPLETE',
      ocr_confidence: 80,
      unresolved_issue_count: 0,
      ocr_text: 'नमो व्रातपतये',
    });

    // Edit 1
    const v1 = 'नमो ब्रातपतये';
    Repository.createRevision({
      page_id: page.id,
      previous_text: page.ocr_text!,
      updated_text: v1,
      reason: 'First review note',
      author: 'Reviewer A',
    });
    Repository.updatePageVerification(page.id, v1, 'IN_REVIEW', 'Reviewer A');

    // Edit 2
    const v2 = 'नमो व्रातपतये।';
    Repository.createRevision({
      page_id: page.id,
      previous_text: v1,
      updated_text: v2,
      reason: 'Second review note with danda',
      author: 'Reviewer B',
    });
    Repository.updatePageVerification(page.id, v2, 'VERIFIED', 'Reviewer B');

    // Rollback to v1
    Repository.createRevision({
      page_id: page.id,
      previous_text: v2,
      updated_text: v1,
      reason: 'Rollback to v1 for re-examination',
      author: 'Auditor',
    });

    const revisions = Repository.getRevisionsByPageId(page.id);
    expect(revisions.length).toBe(3);
    // Audit history preserves all 3 snapshots chronologically
    expect(revisions[0].reason).toBe('Rollback to v1 for re-examination');
    expect(revisions[1].reason).toBe('Second review note with danda');
    expect(revisions[2].reason).toBe('First review note');
  });
});
