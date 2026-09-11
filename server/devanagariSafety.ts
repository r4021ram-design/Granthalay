import type { ScripturalIssue, IssueSeverity, IssueType } from '../shared/types.js';

export interface DevanagariAnalysisResult {
  issues: Omit<ScripturalIssue, 'id' | 'page_id' | 'created_at'>[];
  advisoryLanguage: 'sa' | 'hi' | 'mixed' | 'devanagari';
  criticalIssuesCount: number;
  totalIssuesCount: number;
  qualityScore: number;
}

const MATRA_CHARS = new Set([
  'ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'ॄ', 'ॢ', 'ॣ', 'े', 'ै', 'ो', 'ौ'
]);

export function analyzeDevanagariText(text: string): DevanagariAnalysisResult {
  const issues: Omit<ScripturalIssue, 'id' | 'page_id' | 'created_at'>[] = [];
  if (!text) {
    return {
      issues: [],
      advisoryLanguage: 'devanagari',
      criticalIssuesCount: 0,
      totalIssuesCount: 0,
      qualityScore: 100,
    };
  }

  let match: RegExpExecArray | null;

  // 1. Check for Latin characters erroneously interspersed in Devanagari text (CRITICAL)
  const latinRegex = /[\p{Script=Devanagari}][a-zA-Z]+|([a-zA-Z]+)[\p{Script=Devanagari}]/gu;
  while ((match = latinRegex.exec(text)) !== null) {
    issues.push({
      issue_type: 'latin_character',
      character_offset: match.index,
      length: match[0].length,
      original_text: match[0],
      suggested_text: match[0].replace(/[a-zA-Z]/g, ''),
      reason: 'Accidental Latin character detected embedded within Devanagari word',
      severity: 'CRITICAL',
      status: 'OPEN',
    });
  }

  // 2. Halant Anomaly: multiple consecutive halants (् ्) or halant after space (CRITICAL)
  const halantAnomalyRegex = /्{2,}|(\s्)/g;
  while ((match = halantAnomalyRegex.exec(text)) !== null) {
    issues.push({
      issue_type: 'halant_anomaly',
      character_offset: match.index,
      length: match[0].length,
      original_text: match[0],
      suggested_text: '्',
      reason: 'Malformed halanta (virama) sequence detected',
      severity: 'CRITICAL',
      status: 'OPEN',
    });
  }

  // 3. Check for dangling matras (matra at start of text, after space, or without base consonant) (CRITICAL)
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (MATRA_CHARS.has(char)) {
      if (i === 0 || text[i - 1] === ' ' || text[i - 1] === '\n' || text[i - 1] === '\t') {
        issues.push({
          issue_type: 'missing_matra',
          character_offset: i,
          length: 1,
          original_text: char,
          suggested_text: '',
          reason: `Dangling matra '${char}' found without preceding consonant`,
          severity: 'CRITICAL',
          status: 'OPEN',
        });
      } else if (MATRA_CHARS.has(text[i - 1])) {
        // Consecutive matras on the same character
        issues.push({
          issue_type: 'extra_matra',
          character_offset: i - 1,
          length: 2,
          original_text: text.substring(i - 1, i + 1),
          suggested_text: text[i - 1],
          reason: `Illegal consecutive vowel signs '${text.substring(i - 1, i + 1)}'`,
          severity: 'CRITICAL',
          status: 'OPEN',
        });
      }
    }
  }

  // 4. Check for un-halanted duplicated base consonants followed by another consonant (CRITICAL)
  // e.g. "ततत्व" in "ततत्वमसि" where OCR failed to produce conjunct "त्त"
  const dupConsonantRegex = /([\u0915-\u0939])\1(?=[\u0915-\u0939])/gu;
  const VALID_DUP_CONSONANT_PATTERNS = /(?:अव्यय|व्यय|प्यय|अप्यय|शश|जनन|धर्ममय|आनन्दमय|चिन्मय|स्ववश|नैककर्म|सहित|पाण्डववधू|धर्ममर्थ|कलङ्ककल|ससहित)/u;
  while ((match = dupConsonantRegex.exec(text)) !== null) {
    const char = match[1];
    const surrounding = text.substring(Math.max(0, match.index - 8), Math.min(text.length, match.index + 12));
    if (VALID_DUP_CONSONANT_PATTERNS.test(surrounding)) {
      continue; // Skip legitimate Sanskrit/Hindi words
    }
    issues.push({
      issue_type: 'duplicated_character',
      character_offset: match.index,
      length: 2,
      original_text: match[0],
      suggested_text: `${char}्${char}`,
      reason: `Suspicious un-halanted duplicated consonant sequence '${match[0]}' detected (probable missed conjunct ligature)`,
      severity: 'CRITICAL',
      status: 'OPEN',
    });
  }

  // 5. Critical Scripture / Liturgical OCR Misread Detection (CRITICAL)
  // 5a. Retroflex stop misread before repha: 'ठर्ता' or 'ढर्ता' where 'धर्ता' or 'हर्ता' is expected
  const retroflexRephaRegex = /(?:ठ|ढ)र्ता(?:ऽ(?:सि|यि))?/gu;
  while ((match = retroflexRephaRegex.exec(text)) !== null) {
    issues.push({
      issue_type: 'suspicious_consonant',
      character_offset: match.index,
      length: match[0].length,
      original_text: match[0],
      suggested_text: match[0].replace(/^[ठढ]/, 'ध').replace(/यि$/, 'सि'),
      reason: `Suspicious retroflex consonant in '${match[0]}' (probable OCR misread of 'ध' or 'ह')`,
      severity: 'CRITICAL',
      status: 'OPEN',
    });
  }

  // 5b. Sibilant 'सि' misread as 'यि' after avagraha: 'ऽयि' (e.g. 'कर्ताऽयि', 'ढर्ताऽयि')
  const avagrahaYiRegex = /ऽयि/gu;
  while ((match = avagrahaYiRegex.exec(text)) !== null) {
    issues.push({
      issue_type: 'suspicious_consonant',
      character_offset: match.index,
      length: match[0].length,
      original_text: match[0],
      suggested_text: 'ऽसि',
      reason: "Suspicious copular ending 'ऽयि' (probable OCR confusion of स with य for 'ऽसि')",
      severity: 'CRITICAL',
      status: 'OPEN',
    });
  }

  // 5c. Initial 'न' misread as 'ज' before 'ित्यम्': 'जित्यम्' (where 'नित्यम्' is expected)
  const jityamRegex = /जित्यम्(?:‌|्)?/gu;
  while ((match = jityamRegex.exec(text)) !== null) {
    issues.push({
      issue_type: 'suspicious_consonant',
      character_offset: match.index,
      length: match[0].length,
      original_text: match[0],
      suggested_text: 'नित्यम्',
      reason: 'Probable OCR confusion of dental न with palatal ज in "जित्यम्" (expected: नित्यम्)',
      severity: 'CRITICAL',
      status: 'OPEN',
    });
  }

  // 6. Check for punctuation corruption: | or || or : instead of । or ॥ or ः (WARNING)
  const asciiDandaRegex = /\|\||\|/g;
  while ((match = asciiDandaRegex.exec(text)) !== null) {
    const isDouble = match[0] === '||';
    issues.push({
      issue_type: 'danda_corruption',
      character_offset: match.index,
      length: match[0].length,
      original_text: match[0],
      suggested_text: isDouble ? '॥' : '।',
      reason: `ASCII pipe '${match[0]}' used instead of sacred danda '${isDouble ? '॥' : '।'}'`,
      severity: 'WARNING',
      status: 'OPEN',
    });
  }

  // Check for colon ':' immediately following Devanagari letters which might be corrupted Visarga 'ः' (WARNING)
  const colonVisargaRegex = /([\p{Script=Devanagari}]):/gu;
  while ((match = colonVisargaRegex.exec(text)) !== null) {
    issues.push({
      issue_type: 'visarga_confusion',
      character_offset: match.index + match[1].length,
      length: 1,
      original_text: ':',
      suggested_text: 'ः',
      reason: "ASCII colon ':' detected where Visarga 'ः' may have been intended",
      severity: 'WARNING',
      status: 'OPEN',
    });
  }

  // 7. Check for Anusvara vs Chandrabindu vs Visarga ambiguities / duplicates (WARNING)
  const doubleModifierRegex = /[ंँः]{2,}/g;
  while ((match = doubleModifierRegex.exec(text)) !== null) {
    issues.push({
      issue_type: 'anusvara_confusion',
      character_offset: match.index,
      length: match[0].length,
      original_text: match[0],
      suggested_text: match[0][0],
      reason: `Duplicated or conflicting svara modifiers '${match[0]}'`,
      severity: 'WARNING',
      status: 'OPEN',
    });
  }

  // 8. Check for digits accidentally embedded in Devanagari words (WARNING)
  const digitInWordRegex = /([\p{Script=Devanagari}])([0-9०-९]+)([\p{Script=Devanagari}])/gu;
  while ((match = digitInWordRegex.exec(text)) !== null) {
    issues.push({
      issue_type: 'digit_corruption',
      character_offset: match.index + match[1].length,
      length: match[2].length,
      original_text: match[2],
      suggested_text: '',
      reason: `Digit '${match[2]}' embedded within Devanagari word`,
      severity: 'WARNING',
      status: 'OPEN',
    });
  }

  // 9. Advisory Language Classification
  let sanskritIndicators = 0;
  let hindiIndicators = 0;

  // Sanskrit markers
  if (text.includes('ः')) sanskritIndicators += 3;
  if (text.includes('ऽ')) sanskritIndicators += 3;
  if (text.includes('॥')) sanskritIndicators += 2;
  if (/स्य|आत्|एभ्यः|आनि|अन्त|अति|इति|उवाच/gu.test(text)) sanskritIndicators += 4;
  if (/ॐ\s*नम/gu.test(text)) sanskritIndicators += 5;

  // Hindi markers
  const hindiWordsRegex = /(?:^|[\s,।॥!?])(का|के|की|में|पर|से|को|ने|है|हैं|था|थी|थीं|थे|होगा|होगी|होने)(?:$|[\s,।॥!?])/gu;
  const hindiMatches = text.match(hindiWordsRegex);
  if (hindiMatches) {
    hindiIndicators += hindiMatches.length * 3;
  }
  if (/[क़ख़ग़ज़फ़ड़ढ़]/gu.test(text)) hindiIndicators += 3;

  let advisoryLanguage: 'sa' | 'hi' | 'mixed' | 'devanagari' = 'devanagari';
  if (sanskritIndicators >= 4 && hindiIndicators >= 4) {
    advisoryLanguage = 'mixed';
  } else if (sanskritIndicators >= 4) {
    advisoryLanguage = 'sa';
  } else if (hindiIndicators >= 4) {
    advisoryLanguage = 'hi';
  }

  const criticalIssuesCount = issues.filter(i => i.severity === 'CRITICAL').length;
  const warningIssuesCount = issues.filter(i => i.severity === 'WARNING').length;
  const totalIssuesCount = issues.length;

  const textLength = text.trim().length;
  let qualityScore = 100;
  if (textLength > 0) {
    const penalty = (criticalIssuesCount * 15) + (warningIssuesCount * 3);
    qualityScore = Math.max(10, Math.min(100, Math.round(100 - penalty)));
  }

  return {
    issues,
    advisoryLanguage,
    criticalIssuesCount,
    totalIssuesCount,
    qualityScore,
  };
}
