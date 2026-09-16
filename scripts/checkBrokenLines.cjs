const fs = require('fs');
const path = require('path');

const bookPath = path.resolve('public/data/books/granth-brihat-stotra-ratnakar.json');
const book = JSON.parse(fs.readFileSync(bookPath, 'utf8'));

console.log('Total pages in book:', book.pages.length);

const broken = [];

for (let i = 0; i < book.pages.length - 1; i++) {
  const p1 = book.pages[i];
  const p2 = book.pages[i + 1];
  const lines1 = (p1.verified_text || p1.ocr_text || '').trim().split('\n').map(l => l.trim()).filter(Boolean);
  const lines2 = (p2.verified_text || p2.ocr_text || '').trim().split('\n').map(l => l.trim()).filter(Boolean);

  if (lines1.length === 0 || lines2.length === 0) continue;

  const lastLine = lines1[lines1.length - 1];
  const firstLine = lines2[0];

  const endsWithDanda = /[।॥!]$/.test(lastLine);
  if (!endsWithDanda) {
    broken.push({
      pageFrom: i + 1,
      pageTo: i + 2,
      lastLine,
      firstLine,
    });
  }
}

console.log('Total page transitions with non-danda endings:', broken.length);
broken.forEach(b => {
  console.log(`P${b.pageFrom} -> P${b.pageTo}:`);
  console.log(`   P${b.pageFrom} end:   ${b.lastLine}`);
  console.log(`   P${b.pageTo} start: ${b.firstLine}\n`);
});
