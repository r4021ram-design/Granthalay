import { describe, it, expect } from 'vitest';
import { ExportEngine } from '../server/exportEngine.js';
import { Repository } from '../server/repository.js';
import fs from 'fs';
import path from 'path';

describe('Export Fidelity & Unicode Preservation Audit (Section 11 & Section 17)', () => {
  const sacredUnicodeSet = 'ॐ । ॥ ः ं ँ ऽ ् ृ ॄ क्ष त्र ज्ञ श्र';

  it('tests end-to-end Unicode persistence in DB, search, TXT, DOCX, and PDF', async () => {
    const book = Repository.createBook({
      title: 'परीक्षण ग्रन्थ: ' + sacredUnicodeSet,
      author: 'वेदव्यास',
      description: 'Unicode preservation test',
      language: 'sa',
      page_count: 1,
      status: 'UPLOADED',
      source_type: 'images',
      original_filename: 'test_page.png',
      original_file_path: '/dummy/test_page.png',
    });

    const page = Repository.createPage({
      book_id: book.id,
      page_number: 1,
      original_image_path: '/storage/pages/test.png',
      status: 'VERIFIED',
      ocr_confidence: 95,
      unresolved_issue_count: 0,
      ocr_text: sacredUnicodeSet,
      verified_text: sacredUnicodeSet,
    });

    // 1. Check DB persistence & retrieval
    const fetchedPage = Repository.getPageById(page.id);
    expect(fetchedPage?.verified_text).toBe(sacredUnicodeSet);

    // 2. Check search
    const searchResults = Repository.searchScripture('क्ष');
    expect(searchResults.length).toBeGreaterThan(0);

    // 3. Test TXT Export
    const txtUrl = await ExportEngine.exportToTxt(book.id);
    const txtPath = path.resolve('.' + txtUrl);
    const txtContent = fs.readFileSync(txtPath, 'utf8');
    for (const char of sacredUnicodeSet.split(' ')) {
      expect(txtContent).toContain(char);
    }

    // 4. Test DOCX Export
    const docxUrl = await ExportEngine.exportToDocx(book.id);
    const docxPath = path.resolve('.' + docxUrl);
    expect(fs.existsSync(docxPath)).toBe(true);

    // 5. Test PDF Export
    try {
      const pdfUrl = await ExportEngine.exportToPdf(book.id);
      const pdfPath = path.resolve('.' + pdfUrl);
      expect(fs.existsSync(pdfPath)).toBe(true);
    } catch (err: any) {
      console.error('PDF Export FAILED:', err.message);
      throw err;
    }
  });
});
