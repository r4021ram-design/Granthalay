const fs = require('fs');

const book = JSON.parse(fs.readFileSync('public/data/books/granth-brihat-stotra-ratnakar.json', 'utf8'));

for (let p = 145; p <= 150; p++) {
  const page = book.pages.find(x => x.page_number === p);
  console.log(`\n=================== PAGE ${p} ===================`);
  if (page) {
    console.log(Object.keys(page));
    console.log("has raw_text:", !!page.raw_text, "has verified_text:", !!page.verified_text, "has text:", !!page.text);
    console.log(((page.raw_text || page.verified_text || page.text || "")).substring(0, 300));
  }
}
