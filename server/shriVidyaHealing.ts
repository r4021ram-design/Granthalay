/**
 * Sri Vidya Tantra Liturgical Proofing & Bija Healing Engine
 * Specialized algorithms for the Śrī Vidyārṇava Tantram and Shakta literature.
 */

// Canonical Bija and Tantrik substitutions
const TANTRIK_BIJA_CORRECTIONS: [RegExp, string][] = [
  // Hreem (Maya Bija)
  [/ह़ीं?/gu, 'ह्रीं'],
  [/(?<=^|[\s(\[{])(?:ह्ी|ह़ी|ह्नीं)(?=[\s)\]}।,।॥]|$)/gu, 'ह्रीं'],
  [/([क-ह]़?)\s*ह़ीं/gu, '$1 ह्रीं'],

  // Shreem (Lakshmi Bija)
  [/श़/gu, 'श'],
  [/(?<=^|[\s(\[{])(?:श्री\s*ं|शीं)(?=[\s)\]}।,।॥]|$)/gu, 'श्रीं'],

  // Kleem (Kamaraja Bija)
  [/(?<=^|[\s(\[{])(?:कलीं|क्ल़ीं|क्ली\s*ं)(?=[\s)\]}।,।॥]|$)/gu, 'क्लीं'],

  // Aim (Vagbhava Bija)
  [/एैं/gu, 'ऐं'],
  [/(?<=^|[\s(\[{])(?:ऐ\s*ं)(?=[\s)\]}।,।॥]|$)/gu, 'ऐं'],

  // Sauh (Para Bija)
  [/सौ\s*[:ः]/gu, 'सौः'],
  [/(?<=^|[\s(\[{])(?:सोः)(?=[\s)\]}।,।॥]|$)/gu, 'सौः'],

  // Hsauh (Prasada Bija)
  [/हसौ[:ः]/gu, 'ह्सौः'],
  [/(?<=^|[\s(\[{])(?:ह्सौ)(?=[\s)\]}।,।॥]|$)/gu, 'ह्सौः'],

  // Panchadashi Kutas
  [/क\s*ए\s*ई\s*ल\s*ह़?ीं?/gu, 'क ए ई ल ह्रीं'],
  [/ह\s*स\s*क\s*ह\s*ल\s*ह़?ीं?/gu, 'ह स क ह ल ह्रीं'],
  [/स\s*क\s*ल\s*ह़?ीं?/gu, 'स क ल ह्रीं'],

  // Navarna & Anandabhairava Bija
  [/हसक्षमलवरयुं|हसक्षमलवरयूँ|हसक्षमलवरयूं/gu, 'हसक्षमलवरयूँ'],
  [/सहक्षमलवरयीं|सहक्षमलवरयिं/gu, 'सहक्षमलवरयीं'],

  // Divine Names in Sri Vidya Tantra
  [/विपुरसुन्दरी|त्रिपुरसुन्दरी/gu, 'त्रिपुरसुन्दरी'],
  [/लवलता|ललीता/gu, 'ललिता'],
  [/कामेश्र्वर|कामेशवर/gu, 'कामेश्वर'],
  [/कामेश्र्वरी|कामेशवरी/gu, 'कामेश्वरी'],
  [/महाविपुरसुन्दरी/gu, 'महात्रिपुरसुन्दरी'],
  [/त्रैलोक्य\s*मोहन/gu, 'त्रैलोक्यमोहन'],
  [/सर्व\s*संक्षोभण|सर्वसंक्षोभन/gu, 'सर्वसंक्षोभण'],
  [/सर्व\s*सौभाग्य\s*दायक/gu, 'सर्वसौभाग्यदायक'],
  [/सर्व\s*सिद्धि\s*प्रद/gu, 'सर्वसिद्धिप्रद'],
  [/सर्वारोग्य\s*कर|सर्वरोग\s*हर/gu, 'सर्वरोगहर'],
  [/सर्वानन्द\s*मय/gu, 'सर्वानन्दमय'],
  [/षोढा\s*न्यास/gu, 'षोढान्यास'],
  [/मातृका\s*न्यास/gu, 'मातृकान्यास'],
  [/अन्तर्याग|अन्तयाग/gu, 'अन्तर्याग'],
  [/बहिर्याग|बहिियाग/gu, 'बहिर्याग'],
  [/खड्ग\s*माला|खडगमाला/gu, 'खड्गमाला'],
  [/पुरश्चरण|पुरशचरण/gu, 'पुरश्चरण'],
  [/पञ्चदशी|पंचदशी/gu, 'पञ्चदशी'],
  [/षोडशी|षोडसी/gu, 'षोडशी'],
  [/विद्यार्णव|विद्याणव/gu, 'विद्यार्णव'],
];

/**
 * Heals raw OCR text from Sri Vidya tantrik folios
 */
export function healShriVidyaText(rawText: string): string {
  let s = rawText;

  // 1. Remove publisher, phone, and page header noise
  s = s.replace(/^(?:श्रीविद्यार्णव\s*तंत्रम्|श्रीविद्यार्णव\s*तन्त्रम्|श्री\s*विद्यार्णव\s*तंत्रम्)[‌\s\d\(\)]*\n?/gmi, '');
  s = s.replace(/^\([०-९0-9]+\)\s*\n?/gmu, ''); // Header page numbers like (६६) or (२३)
  s = s.replace(/चौखम्भा\s*संस्कृत\s*संस्थान[^\n]*/gu, '');
  s = s.replace(/खेमराज\s*श्रीकृष्णदास[^\n]*/gu, '');

  // 2. Remove stray noise bullets and clean line begins
  const lines = s.split('\n').map(l => {
    let line = l.trim();
    if (!line) return '';

    // Convert stray OCR bullets
    line = line.replace(/^[»*°"=~]\s*/gu, '• ');
    line = line.replace(/^[०-९0-9]+\s*\|\s*/gu, '');

    return line;
  });
  s = lines.filter(Boolean).join('\n');

  // 3. Remove orphan spaces before Devanagari matras
  s = s.replace(/([क-ह]़?)\s+([ािीुूृेैोौँंः])/gu, '$1$2');
  s = s.replace(/\s+([ािीुूृेैोौँंः])/gu, '$1');

  // 4. Ulrich Stiehl Ligature Normalizations
  s = s.replace(/ह़्न|ह\s*्न/gu, 'ह्न');
  s = s.replace(/ह़्म|ह\s*्म/gu, 'ह्म');
  s = s.replace(/ह़्य|ह\s*्य/gu, 'ह्य');
  s = s.replace(/ह़्व|ह\s*्व/gu, 'ह्व');
  s = s.replace(/ड\.्ग|ङ्\s*ग/gu, 'ङ्ग');
  s = s.replace(/ड\.्क|ङ्\s*क/gu, 'ङ्क');
  s = s.replace(/ञ्\s*च/gu, 'ञ्च');
  s = s.replace(/श्\s*च/gu, 'श्च');
  s = s.replace(/द्\s*ध/gu, 'द्ध');
  s = s.replace(/द्\s*द/gu, 'द्द');
  s = s.replace(/द्\s*व/gu, 'द्व');
  s = s.replace(/ष्\s*ट/gu, 'ष्ट');
  s = s.replace(/ष्\s*ठ/gu, 'ष्ठ');
  s = s.replace(/ष्\s*ण/gu, 'ष्ण');

  // 5. Apply Tantrik Bija & Sri Vidya Name Corrections
  for (const [re, rep] of TANTRIK_BIJA_CORRECTIONS) {
    s = s.replace(re, rep);
  }

  // 6. Format Hindi Tika Commentary intro
  s = s.replace(/(?<=^|[\s(\[{])अर्थात(?=[\s)\]}।,।॥]|$)/gu, 'अर्थात्');
  s = s.replace(/(?<=^|[\s(\[{])भावार्थ\s*[:ः]/gu, 'भावार्थ:');
  s = s.replace(/(?<=^|[\s(\[{])टीका\s*[:ः]/gu, 'टीका:');

  // 7. Strip stray dotted circles
  s = s.replace(/[\u25CC\u25CB]/gu, '');

  return s.trim();
}
