const fs = require('fs');
const book = JSON.parse(fs.readFileSync('public/data/books/granth-brihat-stotra-ratnakar.json', 'utf8'));

console.log("=== PAGE 144 ===");
console.log(book.pages.find(x => x.page_number === 144)?.verified_text);

console.log("\n=== PAGE 145 ===");
console.log(book.pages.find(x => x.page_number === 145)?.ocr_text || book.pages.find(x => x.page_number === 145)?.verified_text);
