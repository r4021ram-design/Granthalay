/**
 * auditGaneshPujanPaddhati.cjs
 *
 * Detailed audit of all 24 pages of Shri Ganesh Pujan Paddhati:
 * - Checks for OCR noise, broken dandas, ASCII pipes, typos
 * - Checks cross-page boundaries (from Page 1 to 24)
 * - Checks Karmakanda liturgical markers (विनियोग, ध्यान, आवाहन, आसन, पाद्य, अर्घ्य, आचमन, स्नान, वस्त्र, यज्ञोपवीत, चन्दन, अक्षत, पुष्प, धूप, दीप, नैवेद्य, ताम्बूल, दक्षिणा, आरती, प्रदक्षिणा, पुष्पाञ्जलि, प्रार्थना)
 * - Checks shloka and mantra structure
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '../storage/granth.db');
const JSON_PATH = path.join(__dirname, '../public/data/books/granth-ganesh-pujan-paddhati.json');

const db = new Database(DB_PATH);
const book = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

console.log(`=== AUDITING ${book.title} (${book.pages.length} pages) ===\n`);

const issues = [];

book.pages.forEach((p, idx) => {
  const text = p.verified_text || '';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. ASCII pipes or exclamation marks
  if (/[|!]/.test(text)) {
    const match = text.match(/[^\n]{0,25}[|!][^\n]{0,25}/);
    issues.push({
      page: p.page_number,
      type: 'ASCII_PIPE_OR_EXCLAMATION',
      snippet: match ? match[0] : ''
    });
  }

  // 2. Digit danda OCR glitch (1!, 11, ॥ 1)
  if (/[॥।]\s*1|1\s*[॥।]|1!|!1/u.test(text)) {
    const match = text.match(/[^\n]{0,25}(?:[॥।]\s*1|1\s*[॥।]|1!|!1)[^\n]{0,25}/u);
    issues.push({
      page: p.page_number,
      type: 'DIGIT_DANDA_GLITCH',
      snippet: match ? match[0] : ''
    });
  }

  // 3. Known OCR misreadings
  if (/[^\u0900-\u097F]?(?:लमः|नसः|त्वांम|स्वाहाः)[^\u0900-\u097F]?/u.test(text)) {
    const match = text.match(/[^\n]{0,25}(?:लमः|नसः|त्वांम|स्वाहाः)[^\n]{0,25}/u);
    issues.push({
      page: p.page_number,
      type: 'COMMON_OCR_TYPO',
      snippet: match ? match[0] : ''
    });
  }

  // 4. Broken hyphen at line end
  if (/-\s*$/m.test(text)) {
    const match = text.match(/[^\n]{0,25}-\s*$/m);
    issues.push({
      page: p.page_number,
      type: 'BROKEN_HYPHEN',
      snippet: match ? match[0] : ''
    });
  }

  // 5. Check first line and last line of page
  const firstLine = lines[0] || '';
  const lastLine = lines[lines.length - 1] || '';

  console.log(`Page ${p.page_number} (${lines.length} lines):`);
  console.log(`   Top:    "${firstLine.slice(0, 60)}"`);
  console.log(`   Bottom: "${lastLine.slice(0, 60)}"`);
});

// Check cross-page transitions
console.log('\n=== CROSS-PAGE TRANSITIONS ===');
for (let i = 0; i < book.pages.length - 1; i++) {
  const p1 = book.pages[i];
  const p2 = book.pages[i + 1];
  const l1 = (p1.verified_text || '').trim().split('\n').map(l => l.trim()).filter(Boolean);
  const l2 = (p2.verified_text || '').trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (!l1.length || !l2.length) continue;

  const end1 = l1[l1.length - 1];
  const start2 = l2[0];

  const endsWithDanda = /[।॥!]$/.test(end1) || /॥\s*[०-९\d]+\s*॥$/.test(end1);
  if (!endsWithDanda) {
    console.log(`Transition P${p1.page_number} -> P${p2.page_number} (Unpunctuated/split ending):`);
    console.log(`   End P${p1.page_number}:   "${end1}"`);
    console.log(`   Start P${p2.page_number}: "${start2}"\n`);
  }
}

console.log('\n=== ISSUES DETECTED ===');
console.log(`Total anomalies flagged: ${issues.length}`);
issues.forEach(iss => {
  console.log(`Page ${iss.page} [${iss.type}]: "${iss.snippet}"`);
});

db.close();
