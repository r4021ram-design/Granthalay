import { db } from './db.js';
import { analyzeDevanagariText } from './devanagariSafety.js';
import { v4 as uuidv4 } from 'uuid';

const BOOK_ID = 'granth-vishnu-sahasranama-gita-press';

// Import clean and proofread logic
function cleanVsnOcrLine(line: string): string {
  let s = line.trim();
  if (!s) return '';

  if (/^[०-९0-9\s]+$/.test(s)) return '';
  if (s.length <= 1 && !/[ॐ।॥]/.test(s)) return '';

  if (
    s.includes('गीताप्रेस') ||
    s.includes('गोरखपुर') ||
    s.includes('GORAKHPUR') ||
    s.includes('GITA PRESS') ||
    s.includes('Gita Press') ||
    s.includes('मूल्य') ||
    s.includes('Price') ||
    s.includes('ISBN')
  ) {
    return '';
  }

  s = s.replace(/[\u25CC\u25CB]/gu, '');

  // Remove lines with excessive repeated characters (OCR hallucination like ााााएएएएएएएएए7ए77-)
  if (/(.)\1{4,}/gu.test(s)) return '';

  // Remove lines that are purely or mostly Latin OCR junk / margin noise
  if (/^[a-zA-Z0-9\s_~`|^©+:\-\.]{6,}$/.test(s)) return '';

  s = s.replace(/^[_~`|\\]+/g, '');
  s = s.replace(/[_~`|\\]+$/g, '');

  return s.trim();
}

function proofreadVsnText(rawText: string): string {
  let s = rawText;

  // 1. Universal Devanagari OCR Healing
  s = s.replace(/([क-ह]़?)\s+([ािीुूृेैोौँंः\u0951\u0952\u1CDA])/gu, '$1$2');
  s = s.replace(/[\s\n\r]*\u094D[\s\u200B-\u200D]*\u094D+/gu, '\u094D');
  s = s.replace(/[\s\n\r]+्/gu, '्');
  s = s.replace(/\u094D+/gu, '\u094D');

  // 2. Ha-conjunct Healing
  s = s.replace(/ह़्न|ह\s*्न/gu, 'ह्न');
  s = s.replace(/ह़्म|ह\s*्म/gu, 'ह्म');
  s = s.replace(/ह़्य|ह\s*्य/gu, 'ह्य');
  s = s.replace(/ह़्ल|ह\s*्ल/gu, 'ह्ल');
  s = s.replace(/ह़्व|ह\s*्व/gu, 'ह्व');
  s = s.replace(/ह़ृ|ह\s*ृ/gu, 'हृ');
  s = s.replace(/ह्रदय/gu, 'हृदय');

  // 3. Guttural Nasal Conjuncts
  s = s.replace(/ड\.्ग|ङ्\s*ग/gu, 'ङ्ग');
  s = s.replace(/ड\.्क|ङ्\s*क/gu, 'ङ्क');
  s = s.replace(/ड\.्ख|ङ्\s*ख/gu, 'ङ्ख');
  s = s.replace(/ड\.्घ|ङ्\s*घ/gu, 'ङ्घ');

  // 4. Palatal Conjuncts
  s = s.replace(/ञ्\s*च/gu, 'ञ्च');
  s = s.replace(/ञ्\s*छ/gu, 'ञ्छ');
  s = s.replace(/ञ्\s*ज/gu, 'ञ्ज');
  s = s.replace(/श्\s*च/gu, 'श्च');
  s = s.replace(/श्\s*न/gu, 'श्न');
  s = s.replace(/श्\s*र/gu, 'श्र');
  s = s.replace(/श्\s*व/gu, 'श्व');

  // 5. Retroflex & Dental Conjuncts
  s = s.replace(/ष्\s*ट/gu, 'ष्ट');
  s = s.replace(/ष्\s*ठ/gu, 'ष्ठ');
  s = s.replace(/ष्\s*ण/gu, 'ष्ण');
  s = s.replace(/द्\s*ध/gu, 'द्ध');
  s = s.replace(/द्\s*द/gu, 'द्द');
  s = s.replace(/द्\s*भ/gu, 'द्भ');
  s = s.replace(/द्\s*व/gu, 'द्व');
  s = s.replace(/त्\s*त/gu, 'त्त');
  s = s.replace(/त्\s*थ/gu, 'त्थ');
  s = s.replace(/न्\s*न/gu, 'न्न');

  // 6. VSN-Specific Name Corrections
  const vsnCorrections: [RegExp, string][] = [
    [/विसनु|विस्णु|विष्नु/gu, 'विष्णु'],
    [/क्रिसन|क्रिष्न|कृस्ण/gu, 'कृष्ण'],
    [/सहस्त्रनाम/gu, 'सहस्रनाम'],
    [/सहस्र्नाम/gu, 'सहस्रनाम'],
    [/स्तोत्रम््/gu, 'स्तोत्रम्'],
    [/स्तोत्रम(?!्)/gu, 'स्तोत्रम्'],
    [/वैशम्पायन\s*उवाच/gu, 'वैशम्पायन उवाच'],
    [/युधिष्ठिर\s*उवाच/gu, 'युधिष्ठिर उवाच'],
    [/भीष्म\s*उवाच/gu, 'भीष्म उवाच'],
    [/वैसम्पायन/gu, 'वैशम्पायन'],
    [/युधिस्ठिर/gu, 'युधिष्ठिर'],
    [/नारायन\b/gu, 'नारायण'],
    [/वासुदेव\b(?!ा)/gu, 'वासुदेव'],
    [/जनारदन\b/gu, 'जनार्दन'],
    [/हिरन्यगर्भ/gu, 'हिरण्यगर्भ'],
    [/लक्ष्मीपति/gu, 'लक्ष्मीपति'],
    [/पुरूषोत्तम/gu, 'पुरुषोत्तम'],
    [/गोविन्द\b(?!ा)/gu, 'गोविन्द'],
    [/माधव\b(?!ा|ी)/gu, 'माधव'],
    [/केशव\b(?!ा)/gu, 'केशव'],
    [/दामोदर\b/gu, 'दामोदर'],
    [/त्रीविक्रम/gu, 'त्रिविक्रम'],
    [/श्रीधर\b/gu, 'श्रीधर'],
    [/हिषीकेश/gu, 'हृषीकेश'],
    [/हषीकेश/gu, 'हृषीकेश'],
    [/पदम्नाभ/gu, 'पद्मनाभ'],
    [/चतुर्भुज/gu, 'चतुर्भुज'],
    [/अच्यूत/gu, 'अच्युत'],
    [/फलश्रृति|फलश्रूति|फलस्रुति/gu, 'फलश्रुति'],
    [/अनुशासनपर्व/gu, 'अनुशासनपर्व'],
    [/सर्वव्यापी/gu, 'सर्वव्यापी'],
    [/परमेस्वर/gu, 'परमेश्वर'],
    [/भगवान््/gu, 'भगवान्'],
    [/भगवान(?!्)/gu, 'भगवान्'],
    [/ईस्वर/gu, 'ईश्वर'],
    [/सर्वशक्तिमान््/gu, 'सर्वशक्तिमान्'],
    [/सर्वसक्तिमान(?!्)/gu, 'सर्वशक्तिमान्'],
    [/छिननसंशय/gu, 'छिन्नसंशय'],
    [/मूृत्यु/gu, 'मृत्यु'],
    [/भक्तिूर्वक/gu, 'भक्तिपूर्वक'],
    [/न देेवाले/gu, 'न देनेवाले'],
    [/चचलानेवाले/gu, 'चलानेवाले'],
    [/अननम्‌/gu, 'अन्नम्‌'],
    [/ध्यायन्स्तुवननमस्य/gu, 'ध्यायन्स्तुवन्नमस्य'],
    [/यज्ञगृह्यमननमननाद/gu, 'यज्ञगुह्यमन्नमन्नाद'],
    [/अननमननाद/gu, 'अन्नमन्नाद'],
    [/तापपहाय/gu, 'तापमपहाय'],
    [/सर्वमंगलमांगल्ये/gu, 'सर्वमङ्गलमाङ्गल्ये'],
    [/मंगल/gu, 'मङ्गल'],
    [/संघ\b/gu, 'सङ्घ'],
    [/अंक\b/gu, 'अङ्क'],
    [/शंख/gu, 'शङ्ख'],
    [/गंगा/gu, 'गङ्गा'],
    [/पंच/gu, 'पञ्च'],
    [/सोहम/gu, 'सोऽहम्'],
    [/गतोपि/gu, 'गतोऽपि'],
    [/देवोपि/gu, 'देवोऽपि'],
    [/तथापि/gu, 'तथापि'],
    [/हरीः/gu, 'हरिः'],
    [/नमह\b/gu, 'नमः'],
    [/दुःख/gu, 'दुःख'],
  ];

  for (const [regex, replacement] of vsnCorrections) {
    s = s.replace(regex, replacement);
  }

  // Double halant cleanup pass after all replacements
  s = s.replace(/[\s\n\r]*\u094D[\s\u200B-\u200D]*\u094D+/gu, '\u094D');
  s = s.replace(/[\s\n\r]+्/gu, '्');
  s = s.replace(/\u094D+/gu, '\u094D');

  // 7. Danda Normalization
  s = s.replace(/\|\|/g, '॥');
  s = s.replace(/\|/g, '।');
  s = s.replace(/\s*।\s*/g, ' । ');
  s = s.replace(/\s*॥\s*/g, ' ॥ ');
  s = s.replace(/^\s*।\s*/gm, '। ');
  s = s.replace(/^\s*॥\s*/gm, '॥ ');

  // 8. Shloka Number Normalization
  s = s.replace(/॥\s*(\d+)\s*॥/g, (_, num) => {
    const devNum = num.replace(/[0-9]/g, (d: string) =>
      String.fromCharCode(d.charCodeAt(0) + 0x0936)
    );
    return `॥ ${devNum} ॥`;
  });

  // 9. Final Whitespace Cleanup
  s = s.replace(/[ \t]+/g, ' ');
  s = s.replace(/\n{3,}/g, '\n\n');

  return s.trim();
}

async function runHealing() {
  console.log('🔄 Starting Healing Pipeline for Vishnu Sahasranama...');
  const startTime = Date.now();

  const pages = db.prepare(`
    SELECT p.id, p.page_number, o.raw_text
    FROM pages p
    JOIN ocr_runs o ON o.page_id = p.id
    WHERE p.book_id = ?
    ORDER BY p.page_number ASC
  `).all(BOOK_ID) as { id: string; page_number: number; raw_text: string }[];

  console.log(`Found ${pages.length} pages to heal.`);

  // Prepared statements
  const updatePageStmt = db.prepare(`
    UPDATE pages 
    SET ocr_text = ?, verified_text = ?, unresolved_issue_count = ?, status = ?
    WHERE id = ?
  `);

  const deleteIssuesStmt = db.prepare(`DELETE FROM issues WHERE page_id = ?`);

  const insertIssueStmt = db.prepare(`
    INSERT INTO issues (id, page_id, issue_type, character_offset, length, original_text, suggested_text, reason, severity, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalIssuesCount = 0;
  let totalCriticalCount = 0;

  const tx = db.transaction(() => {
    for (const page of pages) {
      // 1. Re-clean lines
      const cleanedLines = page.raw_text
        .split('\n')
        .map(cleanVsnOcrLine)
        .filter(l => l.length > 0);

      const cleanedText = cleanedLines.join('\n');
      const proofedText = proofreadVsnText(cleanedText);

      // 2. Re-analyze Devanagari text
      const analysis = analyzeDevanagariText(proofedText);

      totalIssuesCount += analysis.totalIssuesCount;
      totalCriticalCount += analysis.criticalIssuesCount;

      const pageStatus = analysis.criticalIssuesCount > 0 ? 'REVIEW_REQUIRED' : 'OCR_COMPLETE';

      // 3. Update page record
      updatePageStmt.run(proofedText, proofedText, analysis.totalIssuesCount, pageStatus, page.id);

      // 4. Replace issues
      deleteIssuesStmt.run(page.id);

      for (const issue of analysis.issues) {
        insertIssueStmt.run(
          uuidv4(),
          page.id,
          issue.issue_type,
          issue.character_offset,
          issue.length,
          issue.original_text,
          issue.suggested_text,
          issue.reason,
          issue.severity,
          issue.status,
        );
      }
    }

    // 5. Update book status
    const finalBookStatus = totalCriticalCount > 0 ? 'REVIEW_REQUIRED' : 'OCR_COMPLETE';
    db.prepare('UPDATE books SET status = ?, updated_at = datetime(\'now\') WHERE id = ?')
      .run(finalBookStatus, BOOK_ID);

    // 6. Audit log
    db.prepare('INSERT INTO audit_logs (id, book_id, action, details) VALUES (?, ?, ?, ?)')
      .run(
        uuidv4(),
        BOOK_ID,
        'VSN_HEALING_COMPLETE',
        `Healed 97 pages: critical issues reduced to ${totalCriticalCount}, total issues: ${totalIssuesCount}, book status: ${finalBookStatus}`
      );
  });

  tx();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ Healing complete in ${elapsed}s!`);
  console.log(`📊 Results:`);
  console.log(`   Critical Issues: ${totalCriticalCount} (was 148)`);
  console.log(`   Total Issues:    ${totalIssuesCount} (was 570)`);
  console.log(`   Book Status:     ${totalCriticalCount === 0 ? 'OCR_COMPLETE / CLEAN' : 'REVIEW_REQUIRED'}`);
}

runHealing().catch(err => {
  console.error('Error during healing:', err);
});
