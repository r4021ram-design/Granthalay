import fs from 'fs';
import path from 'path';

const book = JSON.parse(fs.readFileSync('public/data/books/granth-brihat-stotra-ratnakar.json', 'utf8'));

interface PageIssue {
  pageNum: number;
  type: string;
  detail: string;
  snippet: string;
}

const issues: PageIssue[] = [];

for (const p of book.pages) {
  const text = p.verified_text || '';
  const lines = text.split('\n').map((l: string) => l.trim()).filter(Boolean);

  // 1. Check for running header noise
  if (/बृहत्स्तोत्ररत्नाकर/u.test(text)) {
    issues.push({
      pageNum: p.page_number,
      type: 'RUNNING_HEADER_LEAK',
      detail: 'Contains running header text "बृहत्स्तोत्ररत्नाकर"',
      snippet: text.slice(0, 100)
    });
  }

  // 2. Check for pipe character '|' or exclamation '!'
  if (/[|!]/.test(text)) {
    const match = text.match(/[^\n]{0,30}[|!][^\n]{0,30}/);
    issues.push({
      pageNum: p.page_number,
      type: 'BROKEN_DANDA_CHAR',
      detail: 'Contains ASCII pipe or exclamation mark instead of Devanagari danda',
      snippet: match ? match[0] : ''
    });
  }

  // 3. Check for broken OCR dandas with digits (e.g. "1!", "11", "॥ 1")
  if (/[॥।]\s*1|1\s*[॥।]|1!|!1|11/u.test(text)) {
    const match = text.match(/[^\n]{0,25}(?:[॥।]\s*1|1\s*[॥।]|1!|!1|11)[^\n]{0,25}/u);
    issues.push({
      pageNum: p.page_number,
      type: 'OCR_DIGIT_DANDA',
      detail: 'Contains digit 1 used as danda',
      snippet: match ? match[0] : ''
    });
  }

  // 4. Check for OCR typos like लमः, नसः
  if (/[^\u0900-\u097F]?(?:लमः|नसः)[^\u0900-\u097F]?/u.test(text)) {
    const match = text.match(/[^\n]{0,25}(?:लमः|नसः)[^\n]{0,25}/u);
    issues.push({
      pageNum: p.page_number,
      type: 'NAMAH_TYPO',
      detail: 'Misread "नमः" as "लमः" or "नसः"',
      snippet: match ? match[0] : ''
    });
  }

  // 5. Check if page has unformatted huge lines (>120 Devanagari chars without newline)
  for (const line of lines) {
    if (line.length > 130 && !line.startsWith('【')) {
      issues.push({
        pageNum: p.page_number,
        type: 'LONG_UNFORMATTED_LINE',
        detail: `Line too long (${line.length} chars), likely merged stanzas`,
        snippet: line.slice(0, 80) + '...'
      });
      break;
    }
  }

  // 6. Check for hyphenated line-endings
  if (/-$/.test(text) || /-\s*\n/.test(text)) {
    issues.push({
      pageNum: p.page_number,
      type: 'BROKEN_HYPHEN',
      detail: 'Broken hyphen across line break',
      snippet: text.slice(0, 60)
    });
  }
}

console.log(`=== AUDIT REPORT ACROSS ALL ${book.pages.length} FOLIOS ===`);
console.log(`Total potential issue detections: ${issues.length}`);

// Group by issue type
const byType: Record<string, number> = {};
for (const iss of issues) {
  byType[iss.type] = (byType[iss.type] || 0) + 1;
}

for (const [t, count] of Object.entries(byType)) {
  console.log(`• ${t}: ${count} folios`);
}

console.log('\n--- First 15 Sample Issues Detected ---');
for (const iss of issues.slice(0, 15)) {
  console.log(`Page ${iss.pageNum} [${iss.type}]: ${iss.detail} => "${iss.snippet}"`);
}
