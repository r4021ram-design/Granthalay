import fs from 'fs';

const book = JSON.parse(fs.readFileSync('public/data/books/granth-brihat-stotra-ratnakar.json', 'utf8'));

console.log('=== PAGE 10 (GANESH KAVACHAM) ===');
console.log(book.pages[9].verified_text.slice(0, 1200));
