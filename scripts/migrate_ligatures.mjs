import Database from 'better-sqlite3';

export function healChanakyaLigatures(text) {
  if (!text) return text;
  let s = text;

  // 1. Specific multi-char or contextual fixes
  s = s.replace(/उÀलंघान/g, 'उल्लङ्घन');
  s = s.replace(/उÀलंघन/g, 'उल्लङ्घन');
  s = s.replace(/बिÀाकुल/g, 'बिल्कुल');
  s = s.replace(/मि\^ी/g, 'मिट्टी');
  s = s.replace(/ख\^े/g, 'खट्टे');
  s = s.replace(/चि_े/g, 'चिट्ठे');
  s = s.replace(/लड़Âँगा/g, 'लड़ूँगा');
  s = s.replace(/कीÏत/g, 'कीर्तिं');
  s = s.replace(/अकीÏत/g, 'अकीर्तिं');
  s = s.replace(/बढ∏/g, 'बढ़');
  s = s.replace(/जड़∏/g, 'जड़');
  s = s.replace(/∏/g, '');

  // 2. ® fixes
  s = s.replace(/बु®द्ध/g, 'बुद्धिं');
  s = s.replace(/सि®द्ध/g, 'सिद्धिं');
  s = s.replace(/प्रकृ®त/g, 'प्रकृतिं');
  s = s.replace(/अ®हसा/g, 'अहिंसा');
  s = s.replace(/शा®न्त/g, 'शान्तिं');
  s = s.replace(/ग®त/g, 'गतिं');
  s = s.replace(/दुर्ग®त/g, 'दुर्गतिं');
  s = s.replace(/रा®त्र/g, 'रात्रिं');
  s = s.replace(/आवृ®त्त/g, 'आवृत्तिं');
  s = s.replace(/प्रवृ®त्त/g, 'प्रवृत्तिं');
  s = s.replace(/निवृ®त्त/g, 'निवृत्तिं');
  s = s.replace(/भ®क्त/g, 'भक्तिं');
  s = s.replace(/®/g, '•');

  // 3. ˆ (U+02C6) -> ह्ण
  s = s.replace(/गृˆ/g, 'गृह्ण');
  s = s.replace(/निगृˆ/g, 'निगृह्ण');
  s = s.replace(/ˆ/g, 'ह्ण');

  // 4. ´ (U+00B4) -> ऋ
  s = s.replace(/´क्साम/g, 'ऋक्साम');
  s = s.replace(/´ग्यवेद/g, 'ऋग्वेद');
  s = s.replace(/देव´णरूप/g, 'देवऋणरूप');
  s = s.replace(/´षि/g, 'ऋषि');
  s = s.replace(/´तु/g, 'ऋतु');
  s = s.replace(/´तेऽपि/g, 'ऋतेऽपि');
  s = s.replace(/´/g, 'ऋ');

  // 5. ‰ (U+2030) -> ु
  s = s.replace(/द्रष्ट‰/g, 'द्रष्टु');
  s = s.replace(/प्रवेष्ट‰/g, 'प्रवेष्टुं');
  s = s.replace(/श्र‰/g, 'श्रु');
  s = s.replace(/क्षणभङ्‰र/g, 'क्षणभङ्गुर');
  s = s.replace(/‰/g, 'ु');

  // 6. @ -> ञ्च
  s = s.replace(/@/g, 'ञ्च');

  // 7. % -> त्न
  s = s.replace(/([\u0900-\u097F])%([\u0900-\u097F])/gu, '$1त्न$2');
  s = s.replace(/प्रय%/g, 'प्रयत्न');
  s = s.replace(/असप%/g, 'असपत्न');
  s = s.replace(/प%ी/g, 'पत्नी');
  s = s.replace(/य%/g, 'यत्न');

  // 8. À -> ल्
  s = s.replace(/À/g, 'ल्');

  // 9. ^ alone -> •
  s = s.replace(/\^/g, '•');

  // 10. Common OCR spelling fixes in Gita
  s = s.replace(/मामाश्रिात्य/g, 'मामाश्रित्य');
  s = s.replace(/भावमाश्रिाताः/g, 'भावमाश्रिताः');
  s = s.replace(/चर्तुवधा/g, 'चतुर्विधा');
  s = s.replace(/साधियज्ञां/g, 'साधियज्ञं');
  s = s.replace(/अधियज्ञाके/g, 'अधियज्ञके');
  s = s.replace(/श्रीमानोंके घारमें/g, 'श्रीमानोंके घरमें');
  s = s.replace(/आर्कषत किया/g, 'आकर्षित किया');
  s = s.replace(/छ्ूटनेके/g, 'छूटनेके');

  return s;
}

const db = new Database('storage/granth.db');

console.log('Beginning database ligature healing migration on storage/granth.db...');

const selectPages = db.prepare('SELECT id, page_number, ocr_text, verified_text FROM pages');
const updatePage = db.prepare('UPDATE pages SET ocr_text = ?, verified_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');

const pages = selectPages.all();
let updatedCount = 0;

const runMigration = db.transaction(() => {
  for (const p of pages) {
    const origOcr = p.ocr_text || '';
    const origVer = p.verified_text || '';

    const healedOcr = healChanakyaLigatures(origOcr);
    const healedVer = healChanakyaLigatures(origVer);

    if (origOcr !== healedOcr || origVer !== healedVer) {
      updatePage.run(healedOcr, healedVer, p.id);
      updatedCount++;
    }
  }
});

runMigration();

console.log(`Successfully migrated and healed ${updatedCount} pages in storage/granth.db!`);
db.close();
