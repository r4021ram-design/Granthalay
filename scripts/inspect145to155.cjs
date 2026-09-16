const fs = require('fs');

const book = JSON.parse(fs.readFileSync('public/data/books/granth-brihat-stotra-ratnakar.json', 'utf8'));

for (let p = 145; p <= 155; p++) {
  const page = book.pages.find(x => x.page_number === p);
  console.log(`\n=================== PAGE ${p} ===================`);
  if (page) {
    console.log(page.raw_text || page.verified_text);
  } else {
    console.log('MISSING');
  }
}
