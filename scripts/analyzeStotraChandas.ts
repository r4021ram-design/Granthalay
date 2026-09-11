import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const bookPath = path.resolve(ROOT_DIR, 'public/data/books/granth-brihat-stotra-ratnakar.json');
const book = JSON.parse(fs.readFileSync(bookPath, 'utf8'));

export function countSanskritSyllables(text: string): number {
  const matches = text.match(/[\u0904-\u0914\u0960-\u0961]|[\u0915-\u0939](?![\u094D])/gu);
  return matches ? matches.length : 0;
}

const samplePages = [24, 78, 81, 86, 122];
for (const p of samplePages) {
  const page = book.pages.find((x: any) => x.page_number === p);
  if (page) {
    console.log(`\n================ PAGE ${p} ================`);
    console.log(page.verified_text.slice(0, 600));
  }
}
