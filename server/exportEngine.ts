import fs from 'fs';
import path from 'path';
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { Repository } from './repository.js';
import { EXPORTS_DIR, PAGES_DIR } from './documentProcessor.js';
import type { Book, Page } from '../shared/types.js';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export const ExportEngine = {
  // 1. Export as Plain Unicode TXT
  async exportToTxt(bookId: string): Promise<string> {
    const book = Repository.getBookById(bookId);
    if (!book) throw new Error('Book not found');

    const pages = Repository.getPagesByBookId(bookId);

    const lines: string[] = [];
    lines.push(`॥ ${book.title} ॥`);
    if (book.author) lines.push(`रचयिता / सम्पादक: ${book.author}`);
    lines.push(`दिनांक: ${new Date().toLocaleDateString('hi-IN')}`);
    lines.push('═'.repeat(40));
    lines.push('');

    for (const p of pages) {
      lines.push(`--- [ पृष्ठ संख्या: ${p.page_number} ] ---`);
      const content = p.verified_text || p.ocr_text || '[असंपादित / रिक्त पृष्ठ]';
      lines.push(content);
      lines.push('');
    }

    lines.push('═'.repeat(40));
    lines.push('॥ इति शुभम् ॥');

    const filename = `${book.title.replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')}_${Date.now()}.txt`;
    const outputPath = path.join(EXPORTS_DIR, filename);
    fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');

    Repository.addAuditLog({
      book_id: bookId,
      action: 'EXPORT_TXT',
      details: `Book exported to TXT: ${filename}`,
    });

    return `/storage/exports/${filename}`;
  },

  // 2. Export as DOCX (Word document with Devanagari formatting)
  async exportToDocx(bookId: string): Promise<string> {
    const book = Repository.getBookById(bookId);
    if (!book) throw new Error('Book not found');

    const pages = Repository.getPagesByBookId(bookId);

    const docChildren: Paragraph[] = [
      new Paragraph({
        text: `॥ ${book.title} ॥`,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: book.author ? `रचयिता / सम्पादक: ${book.author}` : '',
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: `Digitized & Verified via Puja Granth Digitizer • ${new Date().toLocaleDateString()}`,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ text: '' }),
    ];

    for (const p of pages) {
      docChildren.push(
        new Paragraph({
          text: `[ पृष्ठ संख्या: ${p.page_number} • स्थिति: ${p.status === 'VERIFIED' ? 'प्रमाणित (Verified)' : 'समीक्षाधीन (In Review)'} ]`,
          heading: HeadingLevel.HEADING_2,
        })
      );

      const content = p.verified_text || p.ocr_text || '[पृष्ठ सामग्री उपलब्ध नहीं है]';
      const contentLines = content.split('\n');

      for (const line of contentLines) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                font: 'Noto Sans Devanagari',
                size: 26, // 13pt
              }),
            ],
            spacing: {
              after: 120,
              line: 320,
            },
          })
        );
      }
      docChildren.push(new Paragraph({ text: '' }));
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docChildren,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `${book.title.replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')}_${Date.now()}.docx`;
    const outputPath = path.join(EXPORTS_DIR, filename);
    fs.writeFileSync(outputPath, buffer);

    Repository.addAuditLog({
      book_id: bookId,
      action: 'EXPORT_DOCX',
      details: `Book exported to DOCX: ${filename}`,
    });

    return `/storage/exports/${filename}`;
  },

  // 3. Export as Formatted PDF (Preserving Devanagari Unicode Typography & Scans)
  async exportToPdf(bookId: string): Promise<string> {
    const book = Repository.getBookById(bookId);
    if (!book) throw new Error('Book not found');

    const pages = Repository.getPagesByBookId(bookId);
    const pdfDoc = await PDFDocument.create();

    // 1. High-fidelity Title Page rendered with Devanagari typography
    const titleSvg = `
      <svg width="1200" height="1700" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#FFFDF8"/>
        <rect x="40" y="40" width="1120" height="1620" fill="none" stroke="#C2410C" stroke-width="4"/>
        <rect x="50" y="50" width="1100" height="1600" fill="none" stroke="#9A3412" stroke-width="1.5"/>
        <text x="600" y="240" font-family="Noto Serif Devanagari, Mangal, Nirmala UI, sans-serif" font-size="42" font-weight="bold" fill="#7C2D12" text-anchor="middle">॥ पूजा ग्रन्थ डिजिटाइज़र ॥</text>
        <text x="600" y="380" font-family="Noto Serif Devanagari, Mangal, Nirmala UI, sans-serif" font-size="48" font-weight="bold" fill="#9A3412" text-anchor="middle">${escapeXml(book.title)}</text>
        ${book.author ? `<text x="600" y="480" font-family="Noto Sans Devanagari, Mangal, Nirmala UI, sans-serif" font-size="30" fill="#44403C" text-anchor="middle">रचयिता / सम्पादक: ${escapeXml(book.author)}</text>` : ''}
        <line x1="300" y1="560" x2="900" y2="560" stroke="#C2410C" stroke-width="2"/>
        <text x="600" y="660" font-family="Noto Sans Devanagari, sans-serif" font-size="28" fill="#78716C" text-anchor="middle">कुल पृष्ठ: ${pages.length}</text>
        <text x="600" y="720" font-family="Noto Sans Devanagari, sans-serif" font-size="24" fill="#A8A29E" text-anchor="middle">निर्यात दिनांक: ${new Date().toLocaleDateString('hi-IN')}</text>
        <text x="600" y="1500" font-family="Noto Serif Devanagari, sans-serif" font-size="32" font-weight="bold" fill="#7C2D12" text-anchor="middle">॥ ॐ तत्सत् ॥</text>
      </svg>
    `;
    const titlePng = await sharp(Buffer.from(titleSvg)).png().toBuffer();
    const embeddedTitle = await pdfDoc.embedPng(titlePng);
    const titlePdfPage = pdfDoc.addPage([595.28, 841.89]);
    titlePdfPage.drawImage(embeddedTitle, { x: 0, y: 0, width: 595.28, height: 841.89 });

    // 2. Content pages (Verified scripture text + Original source scans)
    for (const p of pages) {
      const content = p.verified_text || p.ocr_text || '[असंपादित / रिक्त पृष्ठ]';
      const contentLines = content.split('\n');

      const linesSvg = contentLines.slice(0, 30).map((line, idx) => {
        const y = 200 + (idx * 45);
        return `<text x="100" y="${y}" font-family="Noto Sans Devanagari, Mangal, Nirmala UI, sans-serif" font-size="26" fill="#1C1917">${escapeXml(line)}</text>`;
      }).join('\n');

      const pageSvg = `
        <svg width="1200" height="1700" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#FFFDF8"/>
          <rect x="40" y="40" width="1120" height="1620" fill="none" stroke="#E7E5E4" stroke-width="2"/>
          <text x="100" y="100" font-family="Noto Sans Devanagari, Mangal, Nirmala UI, sans-serif" font-size="24" font-weight="bold" fill="#7C2D12">पृष्ठ ${p.page_number} • स्थिति: ${p.status === 'VERIFIED' ? 'प्रमाणित (VERIFIED)' : 'समीक्षाधीन (IN REVIEW)'}</text>
          <line x1="80" y1="130" x2="1120" y2="130" stroke="#C2410C" stroke-width="1.5"/>
          ${linesSvg}
        </svg>
      `;
      const pagePng = await sharp(Buffer.from(pageSvg)).png().toBuffer();
      const embeddedTextPage = await pdfDoc.embedPng(pagePng);
      const textPdfPage = pdfDoc.addPage([595.28, 841.89]);
      textPdfPage.drawImage(embeddedTextPage, { x: 0, y: 0, width: 595.28, height: 841.89 });

      // Embed original scan on facing page if exists on disk
      const diskImagePath = path.join(PAGES_DIR, book.id, `page-${p.page_number}.png`);
      if (fs.existsSync(diskImagePath)) {
        try {
          const imageBytes = fs.readFileSync(diskImagePath);
          const embeddedImage = await pdfDoc.embedPng(imageBytes);
          const scanPdfPage = pdfDoc.addPage([595.28, 841.89]);
          const imgDims = embeddedImage.scaleToFit(500, 750);
          scanPdfPage.drawImage(embeddedImage, {
            x: (595.28 - imgDims.width) / 2,
            y: (841.89 - imgDims.height) / 2,
            width: imgDims.width,
            height: imgDims.height,
          });
        } catch {
          // If PNG embedding encounters format issues, ignore
        }
      }
    }

    const pdfBytes = await pdfDoc.save();
    const filename = `${book.title.replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')}_${Date.now()}.pdf`;
    const outputPath = path.join(EXPORTS_DIR, filename);
    fs.writeFileSync(outputPath, pdfBytes);

    Repository.addAuditLog({
      book_id: bookId,
      action: 'EXPORT_PDF',
      details: `Book exported to PDF: ${filename}`,
    });

    return `/storage/exports/${filename}`;
  },
};
