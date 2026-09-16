const fs = require('fs');

const jsonPath = 'public/data/books/granth-brihat-stotra-ratnakar.json';
const book = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

for (let p = 179; p <= 184; p++) {
  console.log(`\n==================== PAGE ${p} ====================`);
  const page = book.pages.find(pg => pg.page_number === p);
  if (page) {
    console.log(page.content);
  } else {
    console.log('PAGE NOT FOUND');
  }
}
