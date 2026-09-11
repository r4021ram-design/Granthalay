import fs from 'fs';

const book = JSON.parse(fs.readFileSync('public/data/books/granth-brihat-stotra-ratnakar.json', 'utf8'));

console.log('=== PAGE 1 (मङ्गलम् एवं गणेशन्यासः) ===');
console.log(book.pages[0].verified_text.slice(0, 450));

console.log('\n=== PAGE 2 (गणेशकवचम्) ===');
console.log(book.pages[1].verified_text.slice(0, 600));

console.log('\n=== PAGE 3 (गणेशकवचम् पूर्णता एवं गणेशमानसपूजा) ===');
console.log(book.pages[2].verified_text.slice(0, 450));
