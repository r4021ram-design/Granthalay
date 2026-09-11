import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/brihatStotraRatnakarIndex.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove publisher line
content = content.replace(/ \* Publisher: खेमराज श्रीकृष्णदास[^\n]*\n/gu, '');
content = content.replace(/Total Folios: 292/gu, 'Total Folios: 284');
content = content.replace(/export const BRIHAT_TOTAL_PAGES = 292;/gu, 'export const BRIHAT_TOTAL_PAGES = 284;');

// 2. Adjust each "pdfPage": N -> "pdfPage": Math.max(1, N - 8)
content = content.replace(/"pdfPage":\s*(\d+)/gu, (match, p1) => {
  const oldPage = parseInt(p1, 10);
  const newPage = Math.max(1, oldPage - 8);
  return `"pdfPage": ${newPage}`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated src/data/brihatStotraRatnakarIndex.ts with 284 folios and adjusted pdfPage numbers!');
