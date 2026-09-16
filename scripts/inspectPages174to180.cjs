const fs = require('fs');
const book = JSON.parse(fs.readFileSync('public/data/books/granth-brihat-stotra-ratnakar.json', 'utf8'));

for (let p = 174; p <= 180; p++) {
  const page = book.pages.find(x => x.page_number === p);
  console.log(`\n=================== PAGE ${p} ===================`);
  console.log(page ? (page.raw_text || page.ocr_text || page.verified_text) : "MISSING");
}
