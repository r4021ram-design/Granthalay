const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../public/data/books');
const bookFiles = fs.readdirSync(booksDir).filter(f => f.endsWith('.json') && f.startsWith('granth-') && f.includes('pujan'));

function devanagariToNumber(str) {
  const devDigits = '०१२३४५६७८९';
  let numStr = '';
  for (const ch of str) {
    const idx = devDigits.indexOf(ch);
    if (idx !== -1) numStr += idx;
    else if (/[0-9]/.test(ch)) numStr += ch;
  }
  return parseInt(numStr, 10);
}

for (const file of bookFiles) {
  const filePath = path.join(booksDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const bookId = data.id || (data.book && data.book.id);
  const title = data.title || (data.book && data.book.title);
  const pages = data.pages || [];

  console.log(`\n============================================================`);
  console.log(`📘 [${bookId}] ${title} (${pages.length} पृष्ठ)`);
  console.log(`============================================================`);

  pages.forEach(p => {
    const text = p.verified_text || '';
    const pageNum = p.page_number;
    const pageTitle = p.page_title || '';

    // 1. English artifacts check
    const eng = text.match(/[A-Za-z]{3,}/g);
    if (eng) {
      console.log(`❌ पृष्ठ ${pageNum}: English artifact -> ${eng.join(', ')}`);
    }

    // 2. 108 Namavali check (only on the actual namavali page)
    if (pageNum >= 17 && (text.includes('नामावली') || text.includes('नामावलि') || text.includes('१०८'))) {
      const names = text.match(/ॐ\s+[^\n।॥]+?नमः/gu) || [];
      if (names.length !== 108) {
        console.log(`⚠️ पृष्ठ ${pageNum} (${pageTitle}): १०८ नामावली संख्या = ${names.length} (१०८ होने चाहिए)`);
      } else {
        console.log(`✅ पृष्ठ ${pageNum} (${pageTitle}): १०८ नामावली पूर्ण (१०८/१०८)`);
      }
    }

    // 3. Shrisuktam check
    if (text.includes('हिरण्यवर्णां') || text.includes('हिर॑ण्यवर्णां')) {
      const verses = text.match(/॥\s*[०-९0-9]+\s*॥/gu) || [];
      console.log(`ℹ️ पृष्ठ ${pageNum} (${pageTitle}): श्रीसूक्त ऋचा संख्या = ${verses.length}`);
    }

    // 4. Mahalakshmyashtakam check
    if (text.includes('नमस्तेऽस्तु महामाये') && text.includes('महालक्ष्म्यष्टक')) {
      const verses = text.match(/॥\s*[०-९0-9]+\s*॥/gu) || [];
      console.log(`ℹ️ पृष्ठ ${pageNum} (${pageTitle}): श्रीमहालक्ष्म्यष्टकम् श्लोक संख्या = ${verses.length}`);
    }

    // 5. Atharvashirsha check
    if (text.includes('गणपत्यथर्वशीर्ष') && pageNum >= 10) {
      const hasGanaadi = text.includes('गणादिं पूर्वमुच्चार्य');
      const hasPhalasruti = text.includes('ब्रह्मभूयाय कल्पते') || text.includes('फलश्रुति');
      const verses = text.match(/॥\s*[०-९0-9]+\s*॥/gu) || [];
      console.log(`ℹ️ पृष्ठ ${pageNum} (${pageTitle}): गणपत्यथर्वशीर्ष खण्ड = ${verses.length}, गणादि=${hasGanaadi}, फलश्रुति=${hasPhalasruti}`);
    }

    // 6. Aditya Hridaya check
    if (text.includes('आदित्यहृदय') && pageNum >= 10) {
      const verses = text.match(/॥\s*[०-९0-9]+\s*॥/gu) || [];
      console.log(`ℹ️ पृष्ठ ${pageNum} (${pageTitle}): आदित्यहृदय श्लोक = ${verses.length} (अपेक्षित: ३१)`);
    }

    // 7. Satyanarayan chapters check
    if (pageTitle.includes('कथा') && pageTitle.includes('अध्याय')) {
      const verses = text.match(/॥\s*[०-९0-9]+\s*॥/gu) || [];
      console.log(`ℹ️ पृष्ठ ${pageNum} (${pageTitle}): कथा श्लोक संख्या = ${verses.length}`);
    }
  });
}
