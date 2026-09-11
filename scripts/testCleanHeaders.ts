import fs from 'fs';
import path from 'path';

const ROOT_DIR = path.resolve();
const data = JSON.parse(fs.readFileSync(path.resolve(ROOT_DIR, 'public/data/books/granth-brihat-stotra-ratnakar.json'), 'utf8'));

// Pattern to catch any variant of:
// Left header: (digits/letters) [वब]ृह[त्ृ]*...
// Right header: [anything]स्तो... (digits/letters)
export function stripAnyRunningHeader(line: string): { isHeader: boolean; remainder: string } {
  let s = line.trim();
  if (!s) return { isHeader: false, remainder: '' };

  // 1. Left page header:
  // e.g. (१८) ९ वृहत्स्तोत्ररत्नाकरे वा गजानन ।
  // e.g. बहतस्तोचरत्नाकरे 1११\ उदरे तु...
  // e.g. वृहतस्तोत्रलनाकरे नम खुसर...
  // e.g. , बृहत्स्तोत्ररल्ाकरं विच्य शास्त्रतो ।
  const leftMatch = s.match(/^\s*(?:[^A-Za-z\u0900-\u097F\s]*\s*(?:\([^\)]+\)|[०-९\d\s\(\)रष`'"~=\-]+)\s*)?[`'"~=,\-]*\s*(?:[वब][ृु][^\s]*\s*स्तो[^\s]*|स्तोत्रर[त्लतन][^\s]*)\s*(?:[\[\(1][०-९\d१-९]+[\]\)\\])?\s*(.*)$/u);
  if (leftMatch) {
    const remainder = (leftMatch[1] || '').trim();
    // Verify it's not a title like "बृहत्स्तोत्ररत्नाकरः" standalone or section header if no content
    return { isHeader: true, remainder };
  }

  // 2. Right page header:
  // Matches e.g. -शिवस्तोत्राणि' (७५), शिवसतोनाभि (८१), संगादिस्तोकाथि (२३१), संकीर्णसतोतायि (२८३)
  const rightMatch = s.match(/^\s*(?:[^A-Za-z\u0900-\u097F\s]*\s*)?(?:[^\s\(\)\[]+)?\s*(?:[स्शष][्ततलोकव][^\s\(\)\[]*)\s*[`'"~]*\s*[\(\[1][०-९\d१-९\s]+[\)\]\\]\s*[`'"~]*\s*(.*)$/u);
  if (rightMatch) {
    return { isHeader: true, remainder: (rightMatch[1] || '').trim() };
  }

  // 3. Isolated page number or bracket line
  if (/^\s*[\[\(][०-९\d१-९\s]+[\]\)]\s*(?:॥\s*[०-९\d]+\s*॥)?\s*$/u.test(s)) {
    return { isHeader: true, remainder: '' };
  }

  return { isHeader: false, remainder: s };
}

let strippedCount = 0;
let remaining = 0;

for (let i = 10; i < data.pages.length; i++) {
  const p = data.pages[i];
  const lines = (p.verified_text || '').trim().split('\n');
  const first = lines[0] || '';
  const res = stripAnyRunningHeader(first);
  if (res.isHeader) {
    strippedCount++;
  } else if (/\([०-९\d]+\)|स्तोत्र|रत्नाकर/u.test(first)) {
    remaining++;
    console.log(`Page ${i + 1}: "${first}"`);
  }
}

console.log(`Successfully identified headers on ${strippedCount} pages. Remaining suspected: ${remaining}`);
