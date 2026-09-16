const fs = require('fs');
const book = JSON.parse(fs.readFileSync('public/data/books/granth-brihat-stotra-ratnakar.json', 'utf8'));

for (let p = 155; p <= 160; p++) {
  const page = book.pages.find(x => x.page_number === p);
  console.log(`\n=================== PAGE ${p} ===================`);
  const lines = (page?.raw_text || page?.ocr_text || page?.verified_text || "").split('\n');
  lines.forEach((l, i) => console.log(`${i+1}: ${l}`));
}
