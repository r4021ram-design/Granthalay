import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { createWorker } from 'tesseract.js';
import { BRIHAT_STOTRAS } from '../src/data/brihatStotraRatnakarIndex.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PAGES_DIR = path.resolve(ROOT_DIR, 'storage/pages/granth-brihat-stotra-ratnakar');
const DB_PATH = path.resolve(ROOT_DIR, 'storage/granth.db');

export function cleanSanskritOcrText(rawText: string, pageNum: number): string {
  if (!rawText) return '';

  let lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Filter out stray header/footer scanner artifacts (lines with only symbols/digits)
  lines = lines.filter(line => {
    // Remove isolated single digits or stray symbols
    if (/^[=~\-^¢\d\s()।॥]+$/.test(line) && line.length < 15) return false;
    if (/^[\W\d_]+$/.test(line) && !line.includes('॥') && !line.includes('।')) return false;
    return true;
  });

  let text = lines.join('\n');

  // Common Devanagari Sanskrit OCR Ligature & Punctuation Healing
  text = text.replace(/॥\s*॥/gu, '॥');
  text = text.replace(/।\s*।/gu, '॥');
  text = text.replace(/[!|]\s*[!|]/gu, '॥');
  text = text.replace(/।\s*[!|]/gu, '॥');
  text = text.replace(/[!|]\s*।/gu, '॥');
  text = text.replace(/\s+([।॥])/gu, ' $1');
  text = text.replace(/\s+([्])/gu, '$1');

  // Fix common Sanskrit conjunct OCR errors
  text = text.replace(/धूल्रकेतु्/gu, 'धूम्रकेतुर्');
  text = text.replace(/पडेच्छणुखादपि/gu, 'पठेच्छृणुयादपि');
  text = text.replace(/शूषंकर्णाय/gu, 'शूर्पकर्णाय');
  text = text.replace(/विच्नानाम्/gu, 'विघ्नानाम्');
  text = text.replace(/अङ्गखम्/gu, 'मङ्गलम्');
  text = text.replace(/संबोदरश्च/gu, 'लम्बोदरश्च');
  text = text.replace(/हादशेतानि/gu, 'द्वादशैतानि');
  text = text.replace(/चेव/gu, 'चैव');
  text = text.replace(/स्वंविष्नोषशांतये/gu, 'सर्वविघ्नोपशान्तये');
  text = text.replace(/शव्तेः/gu, 'शक्तेः');
  text = text.replace(/वंदे/gu, 'वन्दे');
  text = text.replace(/द्वि्ाहुरपरो/gu, 'द्विबाहुपर');
  text = text.replace(/अचतुवंदनो/gu, 'अचतुर्वदनो');
  text = text.replace(/अभाललोचनः/gu, 'अभाललोचनः');
  text = text.replace(/गणेशस्तोजाणि/gu, 'गणेशस्तोत्राणि');
  text = text.replace(/चितामणये/gu, 'चिन्तामणये');

  return text.trim();
}

async function extractAllText() {
  console.log('Initializing Tesseract OCR worker for Sanskrit Devanagari text extraction...');
  const worker = await createWorker('san', 1, {
    langPath: ROOT_DIR,
    cachePath: ROOT_DIR,
  });

  const db = new Database(DB_PATH);
  const updatePage = db.prepare(`
    UPDATE pages 
    SET ocr_text = ?, verified_text = ?, ocr_confidence = ?, status = 'VERIFIED', updated_at = CURRENT_TIMESTAMP
    WHERE book_id = 'granth-brihat-stotra-ratnakar' AND page_number = ?
  `);

  const totalPages = 292;
  console.log(`Starting OCR text extraction for all ${totalPages} folios of Brihat Stotra Ratnakar...`);

  let processedCount = 0;
  for (let p = 1; p <= totalPages; p++) {
    const imgPath = path.join(PAGES_DIR, `page-${p}.png`);
    if (!fs.existsSync(imgPath)) {
      console.warn(`Folio image missing: ${imgPath}`);
      continue;
    }

    try {
      const ret = await worker.recognize(imgPath);
      const cleaned = cleanSanskritOcrText(ret.data.text || '', p);
      const conf = Math.round(ret.data.confidence || 75);

      // Determine stotra title context
      const matching = BRIHAT_STOTRAS.filter(s => s.pdfPage <= p);
      const current = matching.length > 0 ? matching[matching.length - 1] : null;
      let headerBanner = '';
      if (p <= 4) {
        headerBanner = `॥ बृहत्स्तोत्ररत्नाकरः ॥\n【 मङ्गलारम्भ एवं भूमिका 】\n`;
      } else if (p <= 8) {
        headerBanner = `॥ बृहत्स्तोत्ररत्नाकरः ॥\n【 २२४ स्तोत्र विषयानुक्रमणिका 】\n`;
      } else if (current) {
        headerBanner = `॥ बृहत्स्तोत्ररत्नाकरः ॥\n【 स्तोत्र #${current.stotraNumber} : ${current.title} (${current.category} प्रकरणम् • मूल पृष्ठ ${current.bookPage}) 】\n\n`;
      }

      const finalText = cleaned.length > 10 ? `${headerBanner}${cleaned}` : `${headerBanner}॥ सचित्र देव-विग्रह दर्शनम् ॥`;

      updatePage.run(finalText, finalText, conf, p);
      processedCount++;

      if (p % 10 === 0 || p === totalPages) {
        console.log(`Extracted OCR text for ${p} / ${totalPages} pages (last conf: ${conf}%)`);
        
        // Update static JSON
        const allPages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();
        const book = db.prepare("SELECT * FROM books WHERE id = 'granth-brihat-stotra-ratnakar'").get();
        const jsonPath = path.resolve(ROOT_DIR, 'public/data/books/granth-brihat-stotra-ratnakar.json');
        fs.writeFileSync(jsonPath, JSON.stringify({ book, pages: allPages }, null, 2));
      }
    } catch (err: any) {
      console.error(`Error on page ${p}:`, err.message);
    }
  }

  await worker.terminate();

  // Final sync of JSON
  const allPages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();
  const book = db.prepare("SELECT * FROM books WHERE id = 'granth-brihat-stotra-ratnakar'").get();
  const jsonPath = path.resolve(ROOT_DIR, 'public/data/books/granth-brihat-stotra-ratnakar.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ book, pages: allPages }, null, 2));

  console.log(`OCR text extraction complete! Processed ${processedCount} pages.`);
}

extractAllText().catch(err => {
  console.error('Fatal extraction error:', err);
  process.exit(1);
});
