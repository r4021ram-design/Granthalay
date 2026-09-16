const fs = require('fs');
const book = JSON.parse(fs.readFileSync('public/data/books/granth-brihat-stotra-ratnakar.json', 'utf8'));

const startPage = parseInt(process.argv[2] || '145', 10);
const endPage = parseInt(process.argv[3] || '146', 10);

for (let p = startPage; p <= endPage; p++) {
  const page = book.pages.find(x => x.page_number === p);
  console.log(`\n################### PAGE ${p} ###################`);
  const lines = (page?.verified_text || page?.raw_text || "").split('\n');
  lines.forEach((l, i) => console.log(`${i+1}: ${l}`));
}
