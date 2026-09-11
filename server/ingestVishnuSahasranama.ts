/**
 * ============================================================================
 * 🕉️ श्रीविष्णुसहस्रनामस्तोत्रम् — Full OCR Ingestion Pipeline
 * ============================================================================
 * 
 * Source: Vishnu Sahasranama - Gita Press, Gorakhpur (Code 206)
 * Pages:  97 (image-only scanned PDF, no text layer)
 * Lang:   Sanskrit + Hindi (mixed Devanagari)
 * 
 * Pipeline Steps:
 *   1. PDF → High-res PNG rendering (pdfjs-dist, scale 2.5)
 *   2. Image preprocessing (sharp: grayscale, normalize, sharpen)
 *   3. Tesseract OCR (san+hin, reusable worker)
 *   4. VSN-specific Sanskrit proofing & OCR error healing
 *   5. Section classification (shloka, meaning, title, phala-shruti, etc.)
 *   6. Bhojpatra folio image generation (SVG → PNG via sharp)
 *   7. SQLite DB insertion (book, pages, ocr_runs, audit_logs)
 *   8. Quality report generation
 * 
 * Run:  npx tsx server/ingestVishnuSahasranama.ts
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';
import { createCanvas } from '@napi-rs/canvas';
import { PAGES_DIR, PREPROCESSED_DIR } from './documentProcessor.js';
import { classifyBlockType } from './ocrService.js';
import { analyzeDevanagariText } from './devanagariSafety.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// ═══════════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════════

const CONFIG = {
  bookId: 'granth-vishnu-sahasranama-gita-press',
  pdfPath: path.resolve(ROOT_DIR, 'Vishnu Sahasranama - Gita Press.pdf'),
  title: 'श्रीविष्णुसहस्रनामस्तोत्रम् (हिन्दी-अनुवाद-सहित)',
  author: 'गीताप्रेस, गोरखपुर',
  description: 'भगवान् श्रीविष्णु के सहस्र (1000) दिव्य नामों का महाभारत अनुशासनपर्व से उद्धृत सुप्रसिद्ध स्तोत्र — प्रत्येक नाम के हिन्दी अर्थ सहित। गीताप्रेस गोरखपुर प्रकाशन (पुस्तक कोड: 206)।',
  language: 'mixed' as const,
  category: 'sahasranama',
  deity: 'vishnu',
  sourceType: 'pdf' as const,
  originalFilename: 'Vishnu Sahasranama - Gita Press.pdf',

  // OCR Settings
  renderScale: 2.5,          // Higher scale for better OCR accuracy on Gita Press font
  tesseractLanguages: ['san', 'hin'] as string[],
  
  // Image preprocessing for better OCR
  preprocessing: {
    grayscale: true,
    normalize: true,
    sharpen: true,
    // No hard threshold — Gita Press pages have good contrast already
  },
};

// ═══════════════════════════════════════════════════════════════════
// Canvas Factory for pdfjs-dist (Node.js server-side rendering)
// ═══════════════════════════════════════════════════════════════════

class NapiCanvasFactory {
  create(w: number, h: number) {
    const canvas = createCanvas(w, h);
    return { canvas, context: canvas.getContext('2d') };
  }
  reset(c: any, w: number, h: number) {
    c.canvas.width = w;
    c.canvas.height = h;
  }
  destroy(c: any) {
    c.canvas = null;
    c.context = null;
  }
}

// ═══════════════════════════════════════════════════════════════════
// VSN-Specific OCR Post-Processing & Sanskrit Proofing
// ═══════════════════════════════════════════════════════════════════

/**
 * VSN-specific line cleaner — removes publisher metadata, page numbers,
 * and OCR artifacts specific to the Gita Press edition.
 */
function cleanVsnOcrLine(line: string): string {
  let s = line.trim();
  if (!s) return '';

  // Remove pure page numbers (Devanagari or Arabic)
  if (/^[०-९0-9\s]+$/.test(s)) return '';
  // Remove stray single characters / OCR noise
  if (s.length <= 1 && !/[ॐ।॥]/.test(s)) return '';

  // Remove publisher header/footer lines
  if (
    s.includes('गीताप्रेस') ||
    s.includes('गोरखपुर') ||
    s.includes('GORAKHPUR') ||
    s.includes('GITA PRESS') ||
    s.includes('Gita Press') ||
    s.includes('मूल्य') ||
    s.includes('Price') ||
    s.includes('ISBN')
  ) {
    return '';
  }

  // Clean dotted circle artifacts from OCR
  s = s.replace(/[\u25CC\u25CB]/gu, '');

  // Remove lines with excessive repeated characters (OCR hallucination like ााााएएएएएएएएए7ए77-)
  if (/(.)\1{4,}/gu.test(s)) return '';

  // Remove lines that are purely or mostly Latin OCR junk / margin noise
  if (/^[a-zA-Z0-9\s_~`|^©+:\-\.]{6,}$/.test(s)) return '';

  // Remove trailing/leading garbage ASCII
  s = s.replace(/^[_~`|\\]+/g, '');
  s = s.replace(/[_~`|\\]+$/g, '');

  return s.trim();
}

/**
 * Comprehensive Sanskrit proofing tailored for VSN Gita Press edition.
 * Handles common Tesseract OCR errors in Devanagari conjuncts, matras,
 * and Vishnu-nama specific terms.
 */
function proofreadVsnText(rawText: string): string {
  let s = rawText;

  // ─── 1. Universal Devanagari OCR Healing ─────────────────────

  // Fix orphan spaces before matras (cause of dotted circles ◌)
  s = s.replace(/([क-ह]़?)\s+([ािीुूृेैोौँंः\u0951\u0952\u1CDA])/gu, '$1$2');

  // Fix duplicate halants and halant after whitespace
  s = s.replace(/[\s\n\r]*\u094D[\s\u200B-\u200D]*\u094D+/gu, '\u094D');
  s = s.replace(/[\s\n\r]+्/gu, '्');
  s = s.replace(/\u094D+/gu, '\u094D');

  // ─── 2. Ha-conjunct Healing (ह-कार संयुक्ताक्षर) ───────────

  s = s.replace(/ह़्न|ह\s*्न/gu, 'ह्न');
  s = s.replace(/ह़्म|ह\s*्म/gu, 'ह्म');
  s = s.replace(/ह़्य|ह\s*्य/gu, 'ह्य');
  s = s.replace(/ह़्ल|ह\s*्ल/gu, 'ह्ल');
  s = s.replace(/ह़्व|ह\s*्व/gu, 'ह्व');
  s = s.replace(/ह़ृ|ह\s*ृ/gu, 'हृ');
  s = s.replace(/ह्रदय/gu, 'हृदय');

  // ─── 3. Guttural Nasal Conjuncts (ङ्-वर्ग) ─────────────────

  s = s.replace(/ड\.्ग|ङ्\s*ग/gu, 'ङ्ग');
  s = s.replace(/ड\.्क|ङ्\s*क/gu, 'ङ्क');
  s = s.replace(/ड\.्ख|ङ्\s*ख/gu, 'ङ्ख');
  s = s.replace(/ड\.्घ|ङ्\s*घ/gu, 'ङ्घ');

  // ─── 4. Palatal Conjuncts (ञ् / श्) ─────────────────────────

  s = s.replace(/ञ्\s*च/gu, 'ञ्च');
  s = s.replace(/ञ्\s*छ/gu, 'ञ्छ');
  s = s.replace(/ञ्\s*ज/gu, 'ञ्ज');
  s = s.replace(/श्\s*च/gu, 'श्च');
  s = s.replace(/श्\s*न/gu, 'श्न');
  s = s.replace(/श्\s*र/gu, 'श्र');
  s = s.replace(/श्\s*व/gu, 'श्व');

  // ─── 5. Retroflex & Dental Conjuncts (ष् / ट् / द्) ────────

  s = s.replace(/ष्\s*ट/gu, 'ष्ट');
  s = s.replace(/ष्\s*ठ/gu, 'ष्ठ');
  s = s.replace(/ष्\s*ण/gu, 'ष्ण');
  s = s.replace(/द्\s*ध/gu, 'द्ध');
  s = s.replace(/द्\s*द/gu, 'द्द');
  s = s.replace(/द्\s*भ/gu, 'द्भ');
  s = s.replace(/द्\s*व/gu, 'द्व');
  s = s.replace(/त्\s*त/gu, 'त्त');
  s = s.replace(/त्\s*थ/gu, 'त्थ');
  s = s.replace(/न्\s*न/gu, 'न्न');

  // ─── 6. VSN-Specific Name Corrections ───────────────────────
  // Common OCR misreads of Vishnu names and VSN-specific terms

  const vsnCorrections: [RegExp, string][] = [
    // Key VSN terms
    [/विसनु|विस्णु|विष्नु/gu, 'विष्णु'],
    [/क्रिसन|क्रिष्न|कृस्ण/gu, 'कृष्ण'],
    [/सहस्त्रनाम/gu, 'सहस्रनाम'],
    [/सहस्र्नाम/gu, 'सहस्रनाम'],
    [/स्तोत्रम््/gu, 'स्तोत्रम्'],
    [/स्तोत्रम(?!्)/gu, 'स्तोत्रम्'],
    
    // Dialogue speakers
    [/वैशम्पायन\s*उवाच/gu, 'वैशम्पायन उवाच'],
    [/युधिष्ठिर\s*उवाच/gu, 'युधिष्ठिर उवाच'],
    [/भीष्म\s*उवाच/gu, 'भीष्म उवाच'],
    [/वैसम्पायन/gu, 'वैशम्पायन'],
    [/युधिस्ठिर/gu, 'युधिष्ठिर'],
    
    // Common Vishnu epithets OCR corrections
    [/नारायन\b/gu, 'नारायण'],
    [/वासुदेव\b(?!ा)/gu, 'वासुदेव'],
    [/जनारदन\b/gu, 'जनार्दन'],
    [/हिरन्यगर्भ/gu, 'हिरण्यगर्भ'],
    [/लक्ष्मीपति/gu, 'लक्ष्मीपति'],
    [/पुरूषोत्तम/gu, 'पुरुषोत्तम'],
    [/गोविन्द\b(?!ा)/gu, 'गोविन्द'],
    [/माधव\b(?!ा|ी)/gu, 'माधव'],
    [/केशव\b(?!ा)/gu, 'केशव'],
    [/दामोदर\b/gu, 'दामोदर'],
    [/त्रीविक्रम/gu, 'त्रिविक्रम'],
    [/श्रीधर\b/gu, 'श्रीधर'],
    [/हिषीकेश/gu, 'हृषीकेश'],
    [/हषीकेश/gu, 'हृषीकेश'],
    [/पदम्नाभ/gu, 'पद्मनाभ'],
    [/चतुर्भुज/gu, 'चतुर्भुज'],
    [/अच्यूत/gu, 'अच्युत'],

    // Phala Shruti terms
    [/फलश्रृति|फलश्रूति|फलस्रुति/gu, 'फलश्रुति'],
    [/अनुशासनपर्व/gu, 'अनुशासनपर्व'],

    // Common Hindi translation terms in VSN vyakhya
    [/सर्वव्यापी/gu, 'सर्वव्यापी'],
    [/परमेस्वर/gu, 'परमेश्वर'],
    [/भगवान््/gu, 'भगवान्'],
    [/भगवान(?!्)/gu, 'भगवान्'],
    [/ईस्वर/gu, 'ईश्वर'],
    [/सर्वशक्तिमान््/gu, 'सर्वशक्तिमान्'],
    [/सर्वसक्तिमान(?!्)/gu, 'सर्वशक्तिमान्'],
    
    // Specific conjunct OCR heals
    [/छिननसंशय/gu, 'छिन्नसंशय'],
    [/मूृत्यु/gu, 'मृत्यु'],
    [/भक्तिूर्वक/gu, 'भक्तिपूर्वक'],
    [/न देेवाले/gu, 'न देनेवाले'],
    [/चचलानेवाले/gu, 'चलानेवाले'],
    [/अननम्‌/gu, 'अन्नम्‌'],
    [/ध्यायन्स्तुवननमस्य/gu, 'ध्यायन्स्तुवन्नमस्य'],
    [/यज्ञगृह्यमननमननाद/gu, 'यज्ञगुह्यमन्नमन्नाद'],
    [/अननमननाद/gu, 'अन्नमन्नाद'],
    [/तापपहाय/gu, 'तापमपहाय'],

    // Fix anusvara/chandrabindu in common words
    [/सर्वमंगलमांगल्ये/gu, 'सर्वमङ्गलमाङ्गल्ये'],
    [/मंगल/gu, 'मङ्गल'],
    [/संघ\b/gu, 'सङ्घ'],
    [/अंक\b/gu, 'अङ्क'],
    [/शंख/gu, 'शङ्ख'],
    [/गंगा/gu, 'गङ्गा'],
    [/पंच/gu, 'पञ्च'],
    
    // Avagraha recovery
    [/सोहम/gu, 'सोऽहम्'],
    [/गतोपि/gu, 'गतोऽपि'],
    [/देवोपि/gu, 'देवोऽपि'],
    [/तथापि/gu, 'तथापि'],

    // Visarga fixes
    [/हरीः/gu, 'हरिः'],
    [/नमह\b/gu, 'नमः'],
    [/दुःख/gu, 'दुःख'],
  ];

  for (const [regex, replacement] of vsnCorrections) {
    s = s.replace(regex, replacement);
  }

  // Double halant cleanup pass after all replacements
  s = s.replace(/[\s\n\r]*\u094D[\s\u200B-\u200D]*\u094D+/gu, '\u094D');
  s = s.replace(/[\s\n\r]+्/gu, '्');
  s = s.replace(/\u094D+/gu, '\u094D');

  // ─── 7. Danda/Double-Danda Normalization ────────────────────

  // Fix broken dandas from OCR
  s = s.replace(/\|\|/g, '॥');
  s = s.replace(/\|/g, '।');
  // Ensure consistent spacing around dandas
  s = s.replace(/\s*।\s*/g, ' । ');
  s = s.replace(/\s*॥\s*/g, ' ॥ ');
  // But not at line boundaries
  s = s.replace(/^\s*।\s*/gm, '। ');
  s = s.replace(/^\s*॥\s*/gm, '॥ ');

  // ─── 8. Shloka Number Normalization ─────────────────────────
  // Gita Press uses Devanagari numerals in shloka numbers like ॥ ३ ॥
  // Ensure they are preserved properly
  s = s.replace(/॥\s*(\d+)\s*॥/g, (_, num) => {
    // Convert Arabic to Devanagari numerals
    const devNum = num.replace(/[0-9]/g, (d: string) =>
      String.fromCharCode(d.charCodeAt(0) + 0x0936)
    );
    return `॥ ${devNum} ॥`;
  });

  // ─── 9. Final Whitespace Cleanup ────────────────────────────
  s = s.replace(/[ \t]+/g, ' ');
  s = s.replace(/\n{3,}/g, '\n\n');

  return s.trim();
}

/**
 * Classify VSN page sections — special handling for the bilingual
 * shloka/vyakhya format of the Gita Press edition.
 */
function classifyVsnPageType(text: string, pageNum: number): string {
  if (pageNum === 1) return 'cover';
  if (pageNum <= 3) return 'mangalacharan';
  if (pageNum <= 6) return 'parvopakrama';
  if (pageNum >= 77 && pageNum <= 82) return 'phalashruti';
  if (pageNum >= 83) return 'supplementary-stotra';

  // Content pages (7-76): Core 1000 names with vyakhya
  if (/वैशम्पायन\s*उवाच/u.test(text)) return 'vaishampayan-uvacha';
  if (/युधिष्ठिर\s*उवाच/u.test(text)) return 'yudhishthira-uvacha';
  if (/भीष्म\s*उवाच/u.test(text)) return 'bhishma-uvacha';
  if (/मङ्गलगीतम्|मंगलगीतम्/u.test(text)) return 'mangalagitam';
  if (/दीनबन्ध्वष्टकम्|दीनबन्धु/u.test(text)) return 'deenanatha-ashtakam';

  return 'nama-vyakhya'; // Default for core name-explanation pages
}

// ═══════════════════════════════════════════════════════════════════
// Bhojpatra Folio Renderer
// ═══════════════════════════════════════════════════════════════════

function wrapTextLines(text: string, maxCharsPerLine = 48): string[] {
  const result: string[] = [];
  const rawLines = text.split('\n');

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      result.push('');
      continue;
    }
    if (trimmed.length <= maxCharsPerLine) {
      result.push(trimmed);
      continue;
    }
    const words = trimmed.split(' ');
    let current = '';
    for (const w of words) {
      if (!current) {
        current = w;
      } else if (current.length + w.length + 1 <= maxCharsPerLine) {
        current += ' ' + w;
      } else {
        result.push(current);
        current = w;
      }
    }
    if (current) result.push(current);
  }
  return result;
}

async function renderBhojpatraFolio(
  bookId: string,
  pageNum: number,
  title: string,
  text: string
): Promise<string> {
  const width = 1200;
  const height = 1600;

  const bookDir = path.join(PAGES_DIR, bookId);
  fs.mkdirSync(bookDir, { recursive: true });
  const filename = `page-${pageNum}.png`;
  const fullPath = path.join(bookDir, filename);

  const lines = wrapTextLines(text, 50).slice(0, 36);
  const startY = 240;
  const lineHeight = 36;

  const textSvgLines = lines
    .map((line, idx) => {
      const y = startY + idx * lineHeight;
      const escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

      let fill = '#241408';
      let weight = 'normal';
      let size = 26;

      // Shloka lines (contain ॥ number ॥)
      if (/॥\s*[०-९0-9]+\s*॥/.test(line) || line.startsWith('॥')) {
        fill = '#8C2D19';
        weight = 'bold';
        size = 28;
      }
      // Bold header/title lines
      else if (line.startsWith('【') || line.startsWith('अथ ') || line.includes('उवाच')) {
        fill = '#7A2814';
        weight = 'bold';
        size = 28;
      }
      // Name definitions (bold name — meaning pattern)
      else if (/^[अ-ह].+—/.test(line) || /^[अ-ह].+[-–]/.test(line)) {
        fill = '#591B0B';
        weight = '600';
      }

      return `<text x="600" y="${y}" text-anchor="middle" font-family="'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', 'Yatra One', serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escaped}</text>`;
    })
    .join('\n');

  const escapedTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="paperGrad" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#F5ECD4" />
          <stop offset="70%" stop-color="#ECDAB2" />
          <stop offset="100%" stop-color="#D9BF89" />
        </radialGradient>
        <radialGradient id="agedEdge" cx="50%" cy="50%" r="60%">
          <stop offset="65%" stop-color="transparent" />
          <stop offset="100%" stop-color="rgba(120, 65, 20, 0.45)" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#paperGrad)" />
      <rect width="100%" height="100%" fill="url(#agedEdge)" />

      <!-- Ornamental Borders -->
      <rect x="36" y="36" width="${width - 72}" height="${height - 72}" fill="none" stroke="#1A3A6A" stroke-width="4" stroke-opacity="0.8" rx="16" />
      <rect x="46" y="46" width="${width - 92}" height="${height - 92}" fill="none" stroke="#2E5DA0" stroke-width="1.5" stroke-dasharray="6,4" rx="12" />

      <!-- Corner Chakras (Vishnu symbol) -->
      <text x="56" y="70" font-size="20" fill="#1A3A6A" font-weight="bold">☸</text>
      <text x="${width - 76}" y="70" font-size="20" fill="#1A3A6A" font-weight="bold">☸</text>
      <text x="56" y="${height - 52}" font-size="20" fill="#1A3A6A" font-weight="bold">☸</text>
      <text x="${width - 76}" y="${height - 52}" font-size="20" fill="#1A3A6A" font-weight="bold">☸</text>

      <!-- Folio Header -->
      <text x="600" y="96" text-anchor="middle" font-family="'Tiro Devanagari Sanskrit', serif" font-size="34" font-weight="bold" fill="#1A3A6A">ॐ नमो भगवते वासुदेवाय</text>
      <text x="600" y="132" text-anchor="middle" font-family="'Tiro Devanagari Sanskrit', serif" font-size="22" font-weight="bold" fill="#1A3A6A">${escapedTitle}</text>
      <line x1="200" y1="150" x2="1000" y2="150" stroke="#1A3A6A" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="4,4" />

      <!-- Scripture Text -->
      ${textSvgLines}

      <!-- Footer -->
      <line x1="250" y1="${height - 110}" x2="950" y2="${height - 110}" stroke="#1A3A6A" stroke-width="1" stroke-opacity="0.4" />
      <text x="600" y="${height - 78}" text-anchor="middle" font-family="'Noto Serif Devanagari', serif" font-size="16" fill="#1A3A6A" opacity="0.85">॥ पत्रम् ${pageNum} • श्रीविष्णुसहस्रनामस्तोत्रम् — गीताप्रेस गोरखपुर ॥</text>
      <text x="600" y="${height - 54}" text-anchor="middle" font-family="'Noto Sans Devanagari', sans-serif" font-size="12" fill="#3A5A20" opacity="0.6">ग्रन्थालय — अक्षर-संख्या एवं संयुक्ताक्षर-शुद्धता सहित डिजिटाइज़्ड</text>
    </svg>
  `);

  await sharp(svgOverlay).png().toFile(fullPath);
  return `/storage/pages/${bookId}/${filename}`;
}

// ═══════════════════════════════════════════════════════════════════
// Main Ingestion Pipeline
// ═══════════════════════════════════════════════════════════════════

interface PageReport {
  pageNum: number;
  ocrConfidence: number;
  charCount: number;
  lineCount: number;
  sectionType: string;
  issueCount: number;
  criticalIssues: number;
}

async function main() {
  const startTime = Date.now();

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`🕉️  श्रीविष्णुसहस्रनामस्तोत्रम् — Full OCR Ingestion Pipeline`);
  console.log(`${'═'.repeat(70)}`);
  console.log(`📂 Source PDF: ${CONFIG.pdfPath}`);
  console.log(`📖 Book ID:    ${CONFIG.bookId}`);
  console.log(`🔤 Languages:  ${CONFIG.tesseractLanguages.join(' + ')}`);
  console.log(`${'─'.repeat(70)}\n`);

  // ─── Step 0: Validate PDF exists ────────────────────────────

  if (!fs.existsSync(CONFIG.pdfPath)) {
    console.error(`❌ FATAL: PDF not found at: ${CONFIG.pdfPath}`);
    process.exit(1);
  }

  // ─── Step 1: Load PDF ───────────────────────────────────────

  console.log(`📄 Loading PDF...`);
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
  const pdfBytes = fs.readFileSync(CONFIG.pdfPath);
  const canvasFactory = new NapiCanvasFactory();

  const doc = await (pdfjs as any).getDocument({
    data: new Uint8Array(pdfBytes),
    canvasFactory,
  }).promise;

  const totalPages = doc.numPages;
  console.log(`✅ PDF loaded: ${totalPages} pages\n`);

  // ─── Step 2: Register Book in DB ────────────────────────────

  console.log(`📚 Registering book in database...`);
  const existingBook = db.prepare('SELECT id FROM books WHERE id = ?').get(CONFIG.bookId);

  if (existingBook) {
    console.log(`⚠️  Book already exists in DB — cleaning previous data for re-ingest...`);
    db.prepare('DELETE FROM ocr_runs WHERE page_id IN (SELECT id FROM pages WHERE book_id = ?)').run(CONFIG.bookId);
    db.prepare('DELETE FROM issues WHERE page_id IN (SELECT id FROM pages WHERE book_id = ?)').run(CONFIG.bookId);
    db.prepare('DELETE FROM revisions WHERE page_id IN (SELECT id FROM pages WHERE book_id = ?)').run(CONFIG.bookId);
    db.prepare('DELETE FROM pages WHERE book_id = ?').run(CONFIG.bookId);
    db.prepare('UPDATE books SET page_count = ?, status = ?, updated_at = datetime(\'now\') WHERE id = ?')
      .run(totalPages, 'PROCESSING', CONFIG.bookId);
    console.log(`🗑️  Cleaned old pages, ocr_runs, issues, revisions for re-ingest.`);
  } else {
    db.prepare(`
      INSERT INTO books (id, title, author, description, language, page_count, status, source_type, original_filename, original_file_path, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      CONFIG.bookId,
      CONFIG.title,
      CONFIG.author,
      CONFIG.description,
      CONFIG.language,
      totalPages,
      'PROCESSING',
      CONFIG.sourceType,
      CONFIG.originalFilename,
      CONFIG.pdfPath,
    );
    console.log(`✅ Book registered: "${CONFIG.title}"`);
  }

  // Audit log
  db.prepare(`INSERT INTO audit_logs (id, book_id, action, details) VALUES (?, ?, ?, ?)`)
    .run(uuidv4(), CONFIG.bookId, 'VSN_OCR_INGESTION_STARTED', `Starting OCR ingestion for ${totalPages} pages`);

  // ─── Step 3: Initialize Tesseract Worker ────────────────────

  console.log(`\n⚙️  Initializing Tesseract worker (${CONFIG.tesseractLanguages.join(' + ')})...`);
  const worker = await createWorker(CONFIG.tesseractLanguages, 1, {
    langPath: ROOT_DIR,
    gzip: false,
  });
  console.log(`✅ Tesseract worker ready.\n`);

  // ─── Step 4: Process Each Page ──────────────────────────────

  const pageReports: PageReport[] = [];
  const insertPageStmt = db.prepare(`
    INSERT INTO pages (
      id, book_id, page_number, original_image_path, preprocessed_image_path,
      width, height, status, ocr_confidence, ocr_text, verified_text,
      unresolved_issue_count, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const insertOcrRunStmt = db.prepare(`
    INSERT INTO ocr_runs (id, page_id, provider, language, raw_text, confidence, blocks_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const insertIssueStmt = db.prepare(`
    INSERT INTO issues (id, page_id, issue_type, character_offset, length, original_text, suggested_text, reason, severity, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  console.log(`${'─'.repeat(70)}`);
  console.log(`  # │ Conf │ Chars │ Lines │ Issues │ Section`);
  console.log(`${'─'.repeat(70)}`);

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    try {
      // 4a. Render PDF page to high-res PNG
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale: CONFIG.renderScale });
      const { canvas, context } = canvasFactory.create(
        Math.floor(viewport.width),
        Math.floor(viewport.height)
      );

      await page.render({
        canvasContext: context,
        viewport,
        canvasFactory,
      }).promise;

      const rawImgBuffer = canvas.toBuffer('image/png');

      // 4b. Preprocess image for OCR (grayscale + normalize + sharpen)
      const preprocessedDir = path.join(PREPROCESSED_DIR, CONFIG.bookId);
      fs.mkdirSync(preprocessedDir, { recursive: true });
      const preprocessedPath = path.join(preprocessedDir, `page-${pageNum}.png`);

      let pipeline = sharp(rawImgBuffer);
      if (CONFIG.preprocessing.grayscale) pipeline = pipeline.grayscale();
      if (CONFIG.preprocessing.normalize) pipeline = pipeline.normalize();
      if (CONFIG.preprocessing.sharpen) pipeline = pipeline.sharpen();
      await pipeline.png().toFile(preprocessedPath);

      // 4c. Run Tesseract OCR on preprocessed image
      const ret = await worker.recognize(preprocessedPath);
      const rawOcrText = ret.data.text || '';
      const ocrConfidence = Math.round(ret.data.confidence || 0);

      // 4d. Clean and proofread OCR text
      const cleanedLines = rawOcrText
        .split('\n')
        .map(cleanVsnOcrLine)
        .filter(l => l.length > 0);

      const cleanedText = cleanedLines.join('\n');
      const proofedText = proofreadVsnText(cleanedText);

      // 4e. Classify section type
      const sectionType = classifyVsnPageType(proofedText, pageNum);

      // 4f. Analyze text for remaining issues
      const analysis = analyzeDevanagariText(proofedText);

      // 4g. Derive page title from content
      let pageTitle = `पत्रम् ${pageNum}`;
      if (pageNum === 1) {
        pageTitle = 'श्रीविष्णुसहस्रनामस्तोत्रम् — आवरण पृष्ठ';
      } else {
        for (const l of cleanedLines.slice(0, 5)) {
          if (/उवाच/.test(l)) {
            pageTitle = l.trim();
            break;
          }
          if (l.startsWith('अथ ') || l.startsWith('॥ अथ')) {
            pageTitle = l.replace(/॥/g, '').trim();
            break;
          }
          if (/॥\s*[०-९]+\s*॥/.test(l) && l.length < 60) {
            pageTitle = l.trim();
            break;
          }
          if (l.length > 5 && l.length < 50 && !l.includes('।')) {
            pageTitle = l;
            break;
          }
        }
      }

      // 4h. Generate Bhojpatra folio image
      const folioImagePath = await renderBhojpatraFolio(CONFIG.bookId, pageNum, pageTitle, proofedText);

      // 4i. Insert page into DB
      const pageId = uuidv4();
      insertPageStmt.run(
        pageId,
        CONFIG.bookId,
        pageNum,
        folioImagePath,
        `/storage/preprocessed/${CONFIG.bookId}/page-${pageNum}.png`,
        Math.floor(viewport.width),
        Math.floor(viewport.height),
        'OCR_COMPLETE',
        ocrConfidence,
        proofedText,
        proofedText,
        analysis.totalIssuesCount,
      );

      // 4j. Insert OCR run record
      const blocks = ret.data.blocks || [];
      const classifiedBlocks = blocks.map((b: any, i: number) => ({
        id: `b-${i}`,
        type: classifyBlockType(b.text || ''),
        text: b.text || '',
        confidence: Math.round(b.confidence || 0),
        bbox: b.bbox ? { x0: b.bbox.x0, y0: b.bbox.y0, x1: b.bbox.x1, y1: b.bbox.y1 } : undefined,
      }));

      insertOcrRunStmt.run(
        uuidv4(),
        pageId,
        'local-tesseract',
        CONFIG.tesseractLanguages.join('+'),
        rawOcrText,
        ocrConfidence,
        JSON.stringify(classifiedBlocks),
      );

      // 4k. Insert detected issues
      for (const issue of analysis.issues) {
        insertIssueStmt.run(
          uuidv4(),
          pageId,
          issue.issue_type,
          issue.character_offset,
          issue.length,
          issue.original_text,
          issue.suggested_text,
          issue.reason,
          issue.severity,
          issue.status,
        );
      }

      // Track report
      const report: PageReport = {
        pageNum,
        ocrConfidence,
        charCount: proofedText.length,
        lineCount: cleanedLines.length,
        sectionType,
        issueCount: analysis.totalIssuesCount,
        criticalIssues: analysis.criticalIssuesCount,
      };
      pageReports.push(report);

      // Log progress
      const confEmoji = ocrConfidence >= 80 ? '🟢' : ocrConfidence >= 60 ? '🟡' : '🔴';
      const issueEmoji = analysis.criticalIssuesCount > 0 ? '⚠️' : '✅';
      console.log(
        `${confEmoji} ${String(pageNum).padStart(3)} │ ${String(ocrConfidence).padStart(3)}% │ ${String(proofedText.length).padStart(5)} │ ${String(cleanedLines.length).padStart(5)} │ ${issueEmoji} ${String(analysis.totalIssuesCount).padStart(4)}  │ ${sectionType}`
      );

    } catch (err: any) {
      console.error(`❌ ERROR on page ${pageNum}: ${err.message}`);
      // Insert a placeholder page so the book is complete
      const pageId = uuidv4();
      insertPageStmt.run(
        pageId,
        CONFIG.bookId,
        pageNum,
        `/storage/pages/${CONFIG.bookId}/page-${pageNum}.png`,
        null,
        0, 0,
        'REVIEW_REQUIRED',
        0,
        `[OCR ERROR: ${err.message}]`,
        null,
        1,
      );
      pageReports.push({
        pageNum,
        ocrConfidence: 0,
        charCount: 0,
        lineCount: 0,
        sectionType: 'error',
        issueCount: 1,
        criticalIssues: 1,
      });
    }
  }

  // ─── Step 5: Cleanup ────────────────────────────────────────

  await worker.terminate();
  console.log(`\n${'─'.repeat(70)}`);

  // ─── Step 6: Update Book Status ─────────────────────────────

  const totalIssues = pageReports.reduce((s, r) => s + r.issueCount, 0);
  const criticalIssues = pageReports.reduce((s, r) => s + r.criticalIssues, 0);
  const avgConfidence = Math.round(pageReports.reduce((s, r) => s + r.ocrConfidence, 0) / totalPages);

  const finalStatus = criticalIssues > 0 ? 'REVIEW_REQUIRED' : 'OCR_COMPLETE';
  db.prepare('UPDATE books SET status = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .run(finalStatus, CONFIG.bookId);

  // Final audit log
  db.prepare(`INSERT INTO audit_logs (id, book_id, action, details) VALUES (?, ?, ?, ?)`)
    .run(
      uuidv4(),
      CONFIG.bookId,
      'VSN_OCR_INGESTION_COMPLETE',
      `Completed OCR ingestion: ${totalPages} pages, avg confidence: ${avgConfidence}%, total issues: ${totalIssues}, critical: ${criticalIssues}`
    );

  // ─── Step 7: Print Quality Report ───────────────────────────

  const durationSec = Math.round((Date.now() - startTime) / 1000);
  const durationMin = Math.floor(durationSec / 60);
  const durationRemSec = durationSec % 60;

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`📊 QUALITY REPORT — श्रीविष्णुसहस्रनामस्तोत्रम्`);
  console.log(`${'═'.repeat(70)}`);
  console.log(`  📖 Total Pages:        ${totalPages}`);
  console.log(`  🎯 Avg OCR Confidence: ${avgConfidence}%`);
  console.log(`  📝 Total Characters:   ${pageReports.reduce((s, r) => s + r.charCount, 0).toLocaleString()}`);
  console.log(`  📏 Total Lines:        ${pageReports.reduce((s, r) => s + r.lineCount, 0).toLocaleString()}`);
  console.log(`  ⚠️  Total Issues:       ${totalIssues}`);
  console.log(`  🔴 Critical Issues:    ${criticalIssues}`);
  console.log(`  📋 Book Status:        ${finalStatus}`);
  console.log(`  ⏱️  Duration:           ${durationMin}m ${durationRemSec}s`);
  console.log(`${'─'.repeat(70)}`);

  // Section breakdown
  const sectionCounts = new Map<string, number>();
  for (const r of pageReports) {
    sectionCounts.set(r.sectionType, (sectionCounts.get(r.sectionType) || 0) + 1);
  }
  console.log(`\n  📑 Section Breakdown:`);
  for (const [section, count] of sectionCounts.entries()) {
    console.log(`     ${section.padEnd(25)} ${count} pages`);
  }

  // Low confidence pages
  const lowConfPages = pageReports.filter(r => r.ocrConfidence < 60);
  if (lowConfPages.length > 0) {
    console.log(`\n  🔴 Low Confidence Pages (< 60%):`);
    for (const p of lowConfPages) {
      console.log(`     Page ${p.pageNum}: ${p.ocrConfidence}%`);
    }
  }

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`🎉 श्रीविष्णुसहस्रनामस्तोत्रम् — OCR Ingestion Complete!`);
  console.log(`   ॐ नमो भगवते वासुदेवाय ॥`);
  console.log(`${'═'.repeat(70)}\n`);
}

// ═══════════════════════════════════════════════════════════════════

main().catch(err => {
  console.error('\n❌ FATAL ERROR during VSN OCR ingestion:', err);
  process.exit(1);
});
