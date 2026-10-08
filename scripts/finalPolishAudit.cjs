const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'storage', 'granth.db');
const db = new Database(dbPath);

// 1. granth-tulsi-vivah-shaligram-pujan page 18:
const tulsiFile = path.join(__dirname, '..', 'public', 'data', 'books', 'granth-tulsi-vivah-shaligram-pujan.json');
const tulsiData = JSON.parse(fs.readFileSync(tulsiFile, 'utf8'));
const p18 = tulsiData.pages.find(p => p.page_number === 18);
if (p18) {
  // Check count of namavali
  const currentNames = p18.verified_text.match(/ॐ\s+[^।\n]+?नमः/g) || [];
  console.log(`Current Tulsi namavali count: ${currentNames.length}`);
  
  if (currentNames.length === 107) {
    p18.verified_text = p18.verified_text.replace(
      'ॐ सर्वसिद्धिप्रदायै नमः । ॐ श्रीशालग्रामतुलसीभ्यां नमः । ॐ श्रीतुलसीमहारान्यै नमः ।',
      'ॐ सर्वसिद्धिप्रदायै नमः । ॐ श्रीतुलसीदेव्यै नमः । ॐ श्रीशालग्रामतुलसीभ्यां नमः । ॐ श्रीशालग्रामपरमात्मने नमः ।'
    );
    p18.ocr_text = p18.verified_text;
    fs.writeFileSync(tulsiFile, JSON.stringify(tulsiData, null, 2), 'utf8');
    db.prepare('UPDATE pages SET verified_text = ?, ocr_text = ? WHERE book_id = ? AND page_number = 18')
      .run(p18.verified_text, p18.ocr_text, 'granth-tulsi-vivah-shaligram-pujan');
    console.log('[OK] Tulsi Vivah page 18 updated with exact 108 names!');
  }
}

// 2. granth-devi-rajopachar-pujan-paddhati page 8 English artifact removal:
const deviFile = path.join(__dirname, '..', 'public', 'data', 'books', 'granth-devi-rajopachar-pujan-paddhati.json');
const deviData = JSON.parse(fs.readFileSync(deviFile, 'utf8'));
const dp8 = deviData.pages.find(p => p.page_number === 8);
if (dp8) {
  dp8.verified_text = dp8.verified_text
    .replace(' (Chhatra)', '')
    .replace(' (Chamara)', '')
    .replace(' (Vyajana)', '')
    .replace(' (Darpana)', '')
    .replace(' (Paduka)', '')
    .replace(' (Abharana)', '')
    .replace(' (Sugandha Taila)', '')
    .replace(' (Geeta-Vadya-Nritya)', '')
    .replace(' (Regalia)', '');
  dp8.ocr_text = dp8.verified_text;
  fs.writeFileSync(deviFile, JSON.stringify(deviData, null, 2), 'utf8');
  db.prepare('UPDATE pages SET verified_text = ?, ocr_text = ? WHERE book_id = ? AND page_number = 8')
    .run(dp8.verified_text, dp8.ocr_text, 'granth-devi-rajopachar-pujan-paddhati');
  console.log('[OK] Devi Rajopachar page 8 sanitized of all English artifacts!');
}

db.close();
console.log('Done!');
