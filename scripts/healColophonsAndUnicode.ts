import { db } from '../server/db.ts';

console.log('--- HEALING COLOPHONS AND UNICODE ARTIFACTS ---');

db.transaction(() => {
  // 1. Sanitize Brihat Stotra Ratnakar in colophons
  const colophonPages = db.prepare(`
    SELECT id, page_number, verified_text, ocr_text 
    FROM pages 
    WHERE verified_text LIKE '%श्रीबृहत्स्तोत्ररत्नाकरे%' OR ocr_text LIKE '%श्रीबृहत्स्तोत्ररत्नाकरे%'
  `).all() as any[];

  console.log(`Found ${colophonPages.length} pages with 'श्रीबृहत्स्तोत्ररत्नाकरे'. Healing...`);
  for (const p of colophonPages) {
    const vText = (p.verified_text || '').replace(/श्रीबृहत्स्तोत्ररत्नाकरे/g, 'स्तोत्र दर्शने');
    const oText = (p.ocr_text || '').replace(/श्रीबृहत्स्तोत्ररत्नाकरे/g, 'स्तोत्र दर्शने');
    db.prepare('UPDATE pages SET verified_text = ?, ocr_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(vText, oText, p.id);
    console.log(`  - Healed Page #${p.page_number}`);
  }

  // 2. Sanitize Pipe symbols (| and ||) in Sanskrit text to Danda (। and ॥)
  const pipePages = db.prepare(`
    SELECT id, page_number, verified_text, ocr_text
    FROM pages
    WHERE book_id LIKE 'granth-%' AND (verified_text LIKE '%|%' OR ocr_text LIKE '%|%')
  `).all() as any[];

  console.log(`Found ${pipePages.length} pages with ASCII pipe (|). Healing to Devanagari Danda...`);
  for (const p of pipePages) {
    let vText = p.verified_text || '';
    let oText = p.ocr_text || '';

    // || -> ॥
    vText = vText.replace(/\|\|/g, '॥');
    oText = oText.replace(/\|\|/g, '॥');

    // | -> ।
    vText = vText.replace(/\|/g, '।');
    oText = oText.replace(/\|/g, '।');

    db.prepare('UPDATE pages SET verified_text = ?, ocr_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(vText, oText, p.id);
  }

  // 3. Fix Sanskrit ASCII colons to Visarga
  // Specifically: Sanskrit words ending in : before whitespace, danda, or end-of-line
  // Exclude Hindi helper words like 'है:', 'हो:', 'था:', 'थे:', 'थी:'
  const colonPages = db.prepare(`
    SELECT id, page_number, verified_text, ocr_text
    FROM pages
    WHERE book_id LIKE 'granth-%' AND (verified_text LIKE '%:%' OR ocr_text LIKE '%:%')
  `).all() as any[];

  console.log(`Found ${colonPages.length} pages with colons. Healing Sanskrit Visargas...`);
  let totalColonsFixed = 0;
  for (const p of colonPages) {
    let vText = p.verified_text || '';
    let oText = p.ocr_text || '';

    const replaceVisarga = (text: string) => {
      return text.replace(/([क-ह][ा-ौ]?):(?=[\s।॥\n\r]|$)/g, (match, prefix) => {
        // Skip Hindi verbs
        if (prefix === 'है' || prefix === 'हो' || prefix === 'था' || prefix === 'थे' || prefix === 'थी') {
          return match;
        }
        totalColonsFixed++;
        return prefix + 'ः';
      });
    };

    const newVText = replaceVisarga(vText);
    const newOText = replaceVisarga(oText);

    if (newVText !== vText || newOText !== oText) {
      db.prepare('UPDATE pages SET verified_text = ?, ocr_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(newVText, newOText, p.id);
    }
  }

  console.log(`Successfully healed ${totalColonsFixed} Sanskrit colons to true Visarga (ः)!`);
})();

// Verification
const remainingColophon = db.prepare("SELECT count(*) as count FROM pages WHERE verified_text LIKE '%बृहत्स्तोत्ररत्नाकर%'").get() as any;
const remainingPipe = db.prepare("SELECT count(*) as count FROM pages WHERE book_id LIKE 'granth-%' AND verified_text LIKE '%|%'").get() as any;
console.log(`Remaining Colophons with 'बृहत्स्तोत्ररत्नाकर': ${remainingColophon.count}`);
console.log(`Remaining Pages with '|': ${remainingPipe.count}`);
