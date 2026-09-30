/**
 * Chhandas (Sanskrit Prosody) & Metrical Verification Engine
 * Implements classical Pingala Chhandahsutra & Kedara Bhatta's Vrttaratnakara standards.
 * Deterministic, zero-dependency engine for syllabification, Laghu/Guru weighting,
 * Gana identification, and automated metrical proofreading.
 */

export type SyllableWeight = 'L' | 'G'; // L = Laghu (। = 1 matra), G = Guru (ऽ = 2 matras)

export interface AnalyzedSyllable {
  text: string;          // Syllable surface text (e.g. "धर्", "म", "क्षे", "त्रे")
  weight: SyllableWeight; // 'L' (। = 1) or 'G' (ऽ = 2)
  matra: 1 | 2;
  vowel: string;
  hasAnusvara: boolean;
  hasVisarga: boolean;
  isFollowedByConjunct: boolean;
  isPadanta: boolean;
}

export type LineCategory = 'verse' | 'header' | 'invocation' | 'colophon' | 'karmakanda_vidhi' | 'uvacha';

export interface PadaAnalysis {
  padaIndex: number;
  rawText: string;
  category: LineCategory;
  categoryLabel: string;
  localMeter?: string; // e.g. "अनुष्टुप् (८ अक्षर)", "शार्दूलविक्रीडितम् (१९ अक्षर)"
  syllables: AnalyzedSyllable[];
  syllableCount: number;
  totalMatras: number;
  weightString: string; // e.g. "GGLLLGLL"
  ganaNotation: string; // e.g. "म स ज"
}

export interface ChhandasDefinition {
  name: string;
  nameDevanagari: string;
  syllablesPerPada: number | number[]; // e.g. 8 for Anushtubh, 11 for Indravajra
  type: 'samavrtta' | 'ardhasamavrtta' | 'vishama' | 'anushtubh';
  signature?: string; // Standard weight pattern (e.g. "GGLLLGLL")
  patternMatcher?: (padas: PadaAnalysis[]) => { matches: boolean; confidence: number; notes?: string };
  description: string;
}

// Canonical Gana Lookup (यमाताराजभानसलगाम्)
export const GANA_PATTERNS: Record<string, string> = {
  'LGG': 'य', // य-गण (यमाता)
  'GGG': 'म', // म-गण (मातारा)
  'GGL': 'त', // त-गण (ताराज)
  'GLG': 'र', // र-गण (राजभा)
  'LGL': 'ज', // ज-गण (जभान)
  'GLL': 'भ', // भ-गण (भानस)
  'LLL': 'न', // न-गण (नसल)
  'LLG': 'स', // स-गण (सलगा)
};

// Sanskrit vowels classification
const SHORT_VOWELS = new Set(['अ', 'इ', 'उ', 'ऋ', 'ऌ', 'ि', 'ु', 'ृ', 'ॢ']);
const LONG_VOWELS = new Set(['आ', 'ई', 'ऊ', 'ॠ', 'ॡ', 'ए', 'ऐ', 'ओ', 'औ', 'ा', 'ी', 'ू', 'ॄ', 'ॣ', 'े', 'ै', 'ो', 'ौ']);
const VIRAMA = '\u094D'; // ्
const ANUSVARA = '\u0902'; // ं
const CANDRABINDU = '\u0901'; // ँ
const VISARGA = '\u0903'; // ः
const AVAGRAHA = '\u093D'; // ऽ

// Devanagari Consonants
const CONSONANT_START = 0x0915; // क
const CONSONANT_END = 0x0939;   // ह
const VEDIC_LLA = 0x0933;       // ळ

function isConsonant(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return (code >= CONSONANT_START && code <= CONSONANT_END) || code === VEDIC_LLA;
}

function isShortVowel(char: string): boolean {
  return SHORT_VOWELS.has(char);
}

function isLongVowel(char: string): boolean {
  return LONG_VOWELS.has(char);
}

/**
 * Clean text from punctuation, danda, verse numbers, but retain Sanskrit letters and accents.
 */
export function sanitizeVerseText(text: string): string {
  return text
    .replace(/[०-९0-9॥।|\-,.;:"'()\[\]{}!?\/\\~`_+=*&^%$#@<>°•]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits a single verse line into two padas at the word boundary
 * closest to 8 syllables (standard half-verse quarter mark) if it is around 14-18 syllables.
 */
function splitLineIntoTwoPadas(line: string): string[] {
  // Quick syllable check of entire line
  const totalCount = analyzePada(line).syllableCount;
  // If line is not a half-verse (14-18 syllables), do not split
  if (totalCount < 14 || totalCount > 18) {
    return [line];
  }

  const words = line.split(/\s+/).filter(w => w.length > 0);
  if (words.length > 1) {
    let bestSplitIdx = Math.ceil(words.length / 2);
    let minDiff = 999;

    const startIdx = Math.max(1, Math.floor(words.length / 2) - 2);
    const endIdx = Math.min(words.length - 1, Math.ceil(words.length / 2) + 2);

    for (let i = startIdx; i <= endIdx; i++) {
      const firstHalf = words.slice(0, i).join(' ');
      const count = analyzePada(firstHalf).syllableCount;
      const diff = Math.abs(count - 8);
      if (diff < minDiff) {
        minDiff = diff;
        bestSplitIdx = i;
      }
    }

    const firstHalf = words.slice(0, bestSplitIdx).join(' ');
    const secondHalf = words.slice(bestSplitIdx).join(' ');
    const firstCount = analyzePada(firstHalf).syllableCount;
    const secondCount = analyzePada(secondHalf).syllableCount;

    if (firstCount >= 7 && firstCount <= 9 && secondCount >= 7 && secondCount <= 9) {
      return [firstHalf, secondHalf];
    }
  }

  // Fallback: If whitespace splitting failed (e.g. halanta sandhi fused words like 'दैत्यान्बाल्येऽपि'),
  // find the exact character split point where first half is 8 syllables!
  for (let i = 5; i < line.length - 5; i++) {
    // 1. Cannot split right before a virama (cuts off consonant from virama)
    if (line[i] === VIRAMA) continue;
    // 2. Cannot split right before a vowel matra or anusvara/visarga
    if (/[\u093E-\u094C\u0902\u0903]/.test(line[i])) continue;
    // 3. Second half cannot start with a halanta consonant (e.g. 'न्बा...')
    if (i + 1 < line.length && line[i + 1] === VIRAMA) continue;

    const firstHalf = line.slice(0, i).trim();
    const secondHalf = line.slice(i).trim();
    if (firstHalf && secondHalf) {
      const c1 = analyzePada(firstHalf).syllableCount;
      if (c1 === 8) {
        const c2 = analyzePada(secondHalf).syllableCount;
        if (c2 >= 7 && c2 <= 9) {
          return [firstHalf, secondHalf];
        }
      }
    }
  }

  return [line];
}

/**
 * Split a verse into individual padas (lines / quarters).
 * Preserves liturgical non-verse lines (titles, salutations, uvacha) intact,
 * and breaks 16-syllable Anushtubh half-verses into individual 8-syllable quarters.
 */
export function splitIntoPadas(verse: string): string[] {
  const rawLines = verse
    .split(/\r?\n/)
    .map(line => sanitizeVerseText(line))
    .filter(line => line.length > 0);

  const resultPadas: string[] = [];

  for (const rawLine of rawLines) {
    const { category } = categorizeLine(rawLine);
    // Non-verse lines (शीर्षक, वक्ता-उवाच, नमस्कारोक्ति, पुष्पिका, कर्मकाण्ड) are preserved as single units
    if (category !== 'verse') {
      resultPadas.push(rawLine);
      continue;
    }

    // Split on danda first if present
    const dandaChunks = rawLine
      .split(/[।॥]/)
      .map(p => sanitizeVerseText(p))
      .filter(p => p.length > 0);

    const chunksToProcess = dandaChunks.length > 0 ? dandaChunks : [rawLine];

    for (const chunk of chunksToProcess) {
      const splitResult = splitLineIntoTwoPadas(chunk);
      resultPadas.push(...splitResult);
    }
  }

  return resultPadas;
}

/**
 * Classifies a line of scripture text to distinguish metered poetic verses (पद्य)
 * from section headers (शीर्षक), invocations (नमस्कारोक्ति), colophons (पुष्पिका),
 * ritual instructions (कर्मकाण्ड विधि/न्यास), and speaker tags (उवाच/ऊचुः).
 */
export function categorizeLine(line: string): { category: LineCategory; label: string } {
  const sanitized = line.replace(/[०-९0-9॥।|\-,.;:"'()\[\]{}!?\/\\~`_+=*&^%$#@<>°•]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!sanitized) return { category: 'header', label: 'रिक्त' };

  const words = sanitized.split(/\s+/).filter(w => w.length > 0);

  // 0. Speaker Tags (वक्ता / उवाच / ऊचुः)
  // Handles both standalone and Sandhi-fused forms:
  // e.g. "गौरीरुवाच", "देव्युवाच", "श्रीभगवानुवाच", "ब्रह्मोवाच", "ऋषय ऊचुः", "सूत उवाच", "शिव उवाच", "अर्जुन उवाच"
  if (/(उवाच|ऊचुः|[ुो]वाच|[ूो]चुः)$/.test(sanitized) && words.length <= 4) {
    return { category: 'uvacha', label: 'वक्ता-कथन (Speaker / Uvacha)' };
  }

  // 1. Headers / Titles (शीर्षक / मङ्गलम् / स्तोत्र नाम)
  // e.g. "गणेशकवचम्", "अथ श्रीगणेशकवचम्", "अथ गणेशकवचप्रारम्भः", "शिवकवचम्", "विष्णुसहस्रनामस्तोत्रम्", "मङ्गलम्"
  if (/^(मङ्गलम्|मङ्गल|अथ|प्रस्तावना|अध्याय|सर्ग|काण्ड|पर्व|स्तोत्रम्|स्तोत्र|कवचम्|कवच|हृदयम्|नामावली|अष्टोत्तरशत|सहस्रनाम|न्यासः|पटल)$/.test(sanitized)) {
    return { category: 'header', label: 'शीर्षक (Header)' };
  }
  if (words.length <= 5 && /(कवचम्|कवच|स्तोत्रम्|स्तोत्र|हृदयम्|माहात्म्यम्|माहात्म्य|नामावली|अष्टकम्|शतकम्|पटलम्|पटल|चालीसा|पद्धतिः|विधानम्|सूक्तम्|उपनिषत्|उपनिषद|प्रारम्भः|प्रारम्भ|वर्णनम्|वर्णन)$/.test(sanitized)) {
    return { category: 'header', label: 'शीर्षक (Header)' };
  }
  if (/^अथ\s+.*(स्तोत्र|प्रारम्भ|कवच|माहात्म्य|वर्णन|पूजा|न्यास)/.test(sanitized)) {
    return { category: 'header', label: 'शीर्षक (Header)' };
  }

  // 2. Colophons (पुष्पिका / इति)
  if (/^इति\s+.*(समाप्तम्|सम्पूर्णम्|अध्यायः|सर्गः|नाम|शतकम्)/.test(sanitized) || sanitized.endsWith('समाप्तम्') || sanitized.endsWith('सम्पूर्णम्') || sanitized.endsWith('इति शुभम्')) {
    return { category: 'colophon', label: 'पुष्पिका (Colophon)' };
  }

  // 3. Invocations / Salutations (नमस्कारोक्ति - गद्यात्मक)
  // e.g. "श्रीगणेशाय नमः", "श्रीगुरुभ्यो नमः", "ॐ नमः शिवाय", "श्रीसरस्वत्यै नमः", "मङ्गलम् श्रीगणेशाय नमः श्रीगुरुभ्यो नमः"
  if (words.length <= 8 && (/(श्री.*नमः|नमः\s*श्री.*|ॐ.*नमः|नमो\s+नमः|नमस्तस्मै)/.test(sanitized) || (sanitized.includes('मङ्गलम्') && sanitized.includes('नमः')))) {
    return { category: 'invocation', label: 'नमस्कारोक्ति (Invocational Salutation)' };
  }

  // 4. Karmakanda ritual action cues (e.g. आचम्य प्राणायामं कृत्वा, ध्यानम्, विनियोगः)
  if (/^(आचम्य|प्राणायामं?\s*कृत्वा|इति\s*पठेत्|इति\s*ध्यायेत्|ध्यानम्|अथ\s*ध्यानम्|विनियोगः|अथ\s*विनियोगः|करन्यासः|अङ्गन्यासः|हृदयादिन्यासः)$/.test(sanitized)) {
    return { category: 'karmakanda_vidhi', label: 'कर्मकाण्ड विधि / निर्देश' };
  }

  // 5. Short Nyasa mantras (e.g. दक्षिणहस्ते वक्रतुण्डाय नमः)
  if (words.length <= 4 && (sanitized.endsWith('नमः') || sanitized.endsWith('नमः।') || sanitized.endsWith('नमः॥')) && /(हस्ते|नेत्रे|कर्णे|पादे|ओष्ठे|शिरसि|नाभौ|हृदये|ललाटे|मुखे|कण्ठे)/.test(sanitized)) {
    return { category: 'karmakanda_vidhi', label: 'न्यास मन्त्र (Nyasa Mantra)' };
  }

  return { category: 'verse', label: 'पद्य (Verse Foot)' };
}

/**
 * Syllabifies a single Sanskrit pada and calculates Laghu/Guru weights
 * strictly adhering to Pingala's rules:
 * - सानुस्वारश्च दीर्घश्च विसर्गी च गुरुर्भवेत्।
 * - वर्णः संयोगपूर्वश्च तथा पादान्तगोऽपि वा॥
 */
export function analyzePada(rawText: string, padaIndex: number = 0): PadaAnalysis {
  const { category, label: categoryLabel } = categorizeLine(rawText);
  const sanitized = sanitizeVerseText(rawText).replace(/\s+/g, '');
  if (!sanitized) {
    return {
      padaIndex,
      rawText,
      category,
      categoryLabel,
      syllables: [],
      syllableCount: 0,
      totalMatras: 0,
      weightString: '',
      ganaNotation: '',
    };
  }

  interface RawSyllable {
    startIndex: number;
    endIndex: number;
    text: string;
    vowelChar: string;
    hasAnusvara: boolean;
    hasVisarga: boolean;
    consonantsFollowing: number; // Consonants immediately following before next vowel
  }

  const rawSyllables: RawSyllable[] = [];
  const chars = Array.from(sanitized);
  let i = 0;

  while (i < chars.length) {
    // Collect leading consonants of the syllable
    let syllableStart = i;
    let syllableStr = '';

    while (i < chars.length && isConsonant(chars[i])) {
      syllableStr += chars[i];
      i++;
      if (i < chars.length && chars[i] === VIRAMA) {
        syllableStr += chars[i];
        i++;
      } else {
        // An inherent 'अ' follows this consonant if no explicit matra/virama
        break;
      }
    }

    // Now identify the vowel
    let vowelChar = 'अ'; // Default inherent short 'a'
    if (i < chars.length) {
      const ch = chars[i];
      if (isShortVowel(ch) || isLongVowel(ch)) {
        vowelChar = ch;
        syllableStr += ch;
        i++;
      } else if (ch === AVAGRAHA) {
        // Avagraha typically merges with previous vowel or skipped in metrics
        i++;
      }
    }

    // Check for Anusvara / Visarga / Candrabindu
    let hasAnusvara = false;
    let hasVisarga = false;

    while (i < chars.length && (chars[i] === ANUSVARA || chars[i] === CANDRABINDU || chars[i] === VISARGA)) {
      if (chars[i] === ANUSVARA || chars[i] === CANDRABINDU) {
        hasAnusvara = true;
      }
      if (chars[i] === VISARGA) {
        hasVisarga = true;
      }
      syllableStr += chars[i];
      i++;
    }

    // If syllable ends with halanta consonants at word boundary (e.g. 'त्' in 'ध्यायेत्')
    while (i < chars.length && isConsonant(chars[i]) && i + 1 < chars.length && chars[i + 1] === VIRAMA) {
      // Check if this is truly the end of pada or preceding the next syllable's consonants
      // If next next is also a consonant followed by vowel, this consonant belongs to sanyoga
      syllableStr += chars[i] + chars[i + 1];
      i += 2;
    }

    if (syllableStr.length > 0) {
      rawSyllables.push({
        startIndex: syllableStart,
        endIndex: i,
        text: syllableStr,
        vowelChar,
        hasAnusvara,
        hasVisarga,
        consonantsFollowing: 0,
      });
    }

    // CRITICAL: Guarantee forward progress to prevent infinite loop on unhandled symbols
    if (i === syllableStart) {
      i++;
    }
  }

  // Second pass: Calculate whether a syllable is followed by a conjunct (संयोगपूर्व)
  for (let s = 0; s < rawSyllables.length - 1; s++) {
    const current = rawSyllables[s];
    const next = rawSyllables[s + 1];
    
    // Count consonants in next syllable before its vowel
    let nextConsonantCount = 0;
    const nextChars = Array.from(next.text);
    for (let c = 0; c < nextChars.length; c++) {
      if (isConsonant(nextChars[c])) {
        nextConsonantCount++;
      }
      if (isShortVowel(nextChars[c]) || isLongVowel(nextChars[c])) {
        break;
      }
    }

    // If current syllable ends in a halanta (virama), or next syllable starts with a conjunct
    const currentHasHalantaEnd = current.text.endsWith(VIRAMA);
    if (currentHasHalantaEnd || nextConsonantCount >= 2) {
      current.consonantsFollowing = nextConsonantCount + (currentHasHalantaEnd ? 1 : 0);
    }
  }

  // Build AnalyzedSyllables with canonical Laghu / Guru determination
  const analyzedSyllables: AnalyzedSyllable[] = [];
  let weightString = '';
  let totalMatras = 0;

  for (let s = 0; s < rawSyllables.length; s++) {
    const item = rawSyllables[s];
    const isPadanta = s === rawSyllables.length - 1;

    let isGuru = false;

    // 1. सानुस्वारश्च (Anusvara makes it Guru)
    if (item.hasAnusvara) {
      isGuru = true;
    }
    // 2. विसर्गी च (Visarga makes it Guru)
    else if (item.hasVisarga) {
      isGuru = true;
    }
    // 3. दीर्घश्च (Long vowel makes it Guru)
    else if (isLongVowel(item.vowelChar)) {
      isGuru = true;
    }
    // 4. वर्णः संयोगपूर्वश्च (Followed by conjunct consonants makes it Guru)
    else if (item.consonantsFollowing >= 2) {
      isGuru = true;
    }
    // 5. Halanta consonant attachment in current syllable makes it Guru
    else if (item.text.includes(VIRAMA)) {
      isGuru = true;
    }
    // 6. पादान्तगोऽपि वा (End of pada can be treated as Guru if long/visargi, or default long)
    else if (isPadanta && (item.hasVisarga || item.hasAnusvara || isLongVowel(item.vowelChar))) {
      isGuru = true;
    }

    const weight: SyllableWeight = isGuru ? 'G' : 'L';
    const matra: 1 | 2 = isGuru ? 2 : 1;

    analyzedSyllables.push({
      text: item.text,
      weight,
      matra,
      vowel: item.vowelChar,
      hasAnusvara: item.hasAnusvara,
      hasVisarga: item.hasVisarga,
      isFollowedByConjunct: item.consonantsFollowing >= 2,
      isPadanta,
    });

    weightString += weight;
    totalMatras += matra;
  }

  // Derive Gana notation (triplet grouping: य, म, त, र, ज, भ, न, स)
  const ganas: string[] = [];
  for (let g = 0; g < weightString.length; g += 3) {
    const triplet = weightString.slice(g, g + 3);
    if (triplet.length === 3) {
      ganas.push(GANA_PATTERNS[triplet] || triplet);
    } else {
      // Remainder 1 or 2 syllables
      for (const char of triplet) {
        ganas.push(char === 'G' ? 'ग' : 'ल');
      }
    }
  }

  return {
    padaIndex,
    rawText,
    category,
    categoryLabel,
    syllables: analyzedSyllables,
    syllableCount: analyzedSyllables.length,
    totalMatras,
    weightString,
    ganaNotation: ganas.join(' '),
  };
}

/**
 * Standard Sanskrit Classical & Vedic Metres Registry
 */
export const CANONICAL_METRES: ChhandasDefinition[] = [
  // 1. अनुष्टुप् (श्लोक) — 8 syllables per pada
  {
    name: 'Anushtubh',
    nameDevanagari: 'अनुष्टुप् (श्लोक)',
    syllablesPerPada: 8,
    type: 'anushtubh',
    description: '८-अक्षरीय श्लोक: ५वाँ वर्ण सर्वत्र लघु (।), ६ठा गुरु (ऽ), विषम पादों में ७वाँ गुरु (य-गण) एवं सम पादों में ७वाँ लघु (ज-गण)।',
    patternMatcher: (padas: PadaAnalysis[]) => {
      if (padas.length < 2) return { matches: false, confidence: 0 };
      let allPadasHave8 = true;
      let score = 0;
      let totalTests = 0;

      for (let p = 0; p < padas.length; p++) {
        const pada = padas[p];
        if (pada.syllableCount !== 8) {
          allPadasHave8 = false;
        }
        totalTests += 3;
        // Check 5th syllable (Index 4): should be Laghu ('L')
        if (pada.weightString[4] === 'L') score++;
        // Check 6th syllable (Index 5): should be Guru ('G')
        if (pada.weightString[5] === 'G') score++;

        // Check 7th syllable (Index 6):
        // Odd padas (1, 3 -> index 0, 2) should be Guru ('G') [Pathya form]
        // Even padas (2, 4 -> index 1, 3) should be Laghu ('L') [Pathya form]
        if (p % 2 === 0) {
          if (pada.weightString[6] === 'G') score++;
        } else {
          if (pada.weightString[6] === 'L') score++;
        }
      }

      const testRatio = totalTests > 0 ? score / totalTests : 0;
      // In Sanskrit prosody, 8 syllables per pada uniquely signifies Anushtubh (Pathya or Vipula)
      const matches = allPadasHave8 && testRatio >= 0.4;
      const confidence = allPadasHave8 ? Math.max(0.75, Math.min(0.98, 0.6 + 0.4 * testRatio)) : testRatio * 0.5;

      return {
        matches,
        confidence,
        notes: !allPadasHave8 
          ? 'अनुष्टुप् में पाद अक्षरों की संख्या ८ नहीं है।' 
          : (testRatio < 0.9 ? 'अनुष्टुप् का कुछ पादों में विपुला भेद (म/र/भ/न-विपुला) उपस्थित है।' : undefined),
      };
    },
  },
  // 2. इन्द्रवज्रा — 11 syllables (त त ज ग ग -> ऽऽ। ऽऽ। ।ऽ। ऽ ऽ)
  {
    name: 'Indravajra',
    nameDevanagari: 'इन्द्रवज्रा',
    syllablesPerPada: 11,
    type: 'samavrtta',
    signature: 'GGLLGLGLGGG', // त (GGL) त (GGL) ज (LGL) ग (G) ग (G)
    description: 'स्यादिन्द्रवज्रा यदि तौ जगौ गः (त, त, ज, गुरु, गुरु)',
  },
  // 3. उपेन्द्रवज्रा — 11 syllables (ज त ज ग ग -> ।ऽ। ऽऽ। ।ऽ। ऽ ऽ)
  {
    name: 'Upendravajra',
    nameDevanagari: 'उपेन्द्रवज्रा',
    syllablesPerPada: 11,
    type: 'samavrtta',
    signature: 'LGLGGLGLGGG', // ज (LGL) त (GGL) ज (LGL) ग (G) ग (G)
    description: 'उपेन्द्रवज्रा जतजास्ततो गौ (ज, त, ज, गुरु, गुरु)',
  },
  // 4. भुजङ्गप्रयातम् — 12 syllables (य य य य -> ।ऽऽ ।ऽऽ ।ऽऽ ।ऽऽ)
  {
    name: 'Bhujangaprayata',
    nameDevanagari: 'भुजङ्गप्रयातम्',
    syllablesPerPada: 12,
    type: 'samavrtta',
    signature: 'LGGLGGLGGLGG', // ४ य-गण
    description: 'भुजङ्गप्रयातं भवेद् यैश्चतुर्भिः (४ य-गण)',
  },
  // 5. तोटकम् — 12 syllables (स स स स -> ।।ऽ ।।ऽ ।।ऽ ।।ऽ)
  {
    name: 'Totaka',
    nameDevanagari: 'तोटकम्',
    syllablesPerPada: 12,
    type: 'samavrtta',
    signature: 'LLGLLGLLGLLG', // ४ स-गण
    description: 'इह तोटकमम्बुधिसैः प्रमितम् (४ स-गण)',
  },
  // 6. वंशस्थ — 12 syllables (ज त ज र -> ।ऽ। ऽऽ। ।ऽ। ऽ।ऽ)
  {
    name: 'Vamsastha',
    nameDevanagari: 'वंशस्थम्',
    syllablesPerPada: 12,
    type: 'samavrtta',
    signature: 'LGLGGLGLGLGL', // ज त ज र
    description: 'जतौ तु वंशस्थमुदीरितं जरौ (ज, त, ज, र)',
  },
  // 7. वसन्ततिलका — 14 syllables (त भ ज ज ग ग -> ऽऽ। ऽ।। ।ऽ। ।ऽ। ऽ ऽ)
  {
    name: 'Vasantatilaka',
    nameDevanagari: 'वसन्ततिलका',
    syllablesPerPada: 14,
    type: 'samavrtta',
    signature: 'GGLGLLLGLLGLGG',
    description: 'उक्ता वसन्ततिलका तभजा जगौ गः (त, भ, ज, ज, ग, ग)',
  },
  // 8. मालिनी — 15 syllables (न न म य य -> ।।।।।। ऽऽऽ ।ऽऽ ।ऽऽ)
  {
    name: 'Malini',
    nameDevanagari: 'मालिनी',
    syllablesPerPada: 15,
    type: 'samavrtta',
    signature: 'LLLLLLGGGLGGLGG',
    description: 'ननमयययुतेयं मालिनी भोगिलोकैः (न, न, म, य, य - यति ८ व ७ पर)',
  },
  // 9. शिखरिणी — 17 syllables (य म न स भ ल ग)
  {
    name: 'Shikharini',
    nameDevanagari: 'शिखरिणी',
    syllablesPerPada: 17,
    type: 'samavrtta',
    signature: 'LGGGGGGLLLLLGGLG',
    description: 'रसै रुद्रैश्छिन्ना यमनसभला गः शिखरिणी (य, म, न, स, भ, ल, ग - यति ६ व ११ पर)',
  },
  // 10. मन्दाक्रान्ता — 17 syllables (म भ न त त ग ग)
  {
    name: 'Mandakranta',
    nameDevanagari: 'मन्दाक्रान्ता',
    syllablesPerPada: 17,
    type: 'samavrtta',
    signature: 'GGGGLLLLLLGGLGGLGG',
    description: 'मन्दाक्रान्ता जलधिषडगैर्भौ नतौ ताद्गुरू चेत् (म, भ, न, त, त, ग, ग - यति ४, ६, ७ पर)',
  },
  // 11. शार्दूलविक्रीडितम् — 19 syllables (म स ज स त त ग)
  {
    name: 'Shardulavikridita',
    nameDevanagari: 'शार्दूलविक्रीडितम्',
    syllablesPerPada: 19,
    type: 'samavrtta',
    signature: 'GGGLLGLGLLLGGGLGGLG',
    description: 'सूर्याश्वैर्मसजस्तथाः सगुरवः शार्दूलविक्रीडितम् (म, स, ज, स, त, त, ग - यति १२ व ७ पर)',
  },
  // 12. स्रग्धरा — 21 syllables (म र भ न य य य)
  {
    name: 'Sragdhara',
    nameDevanagari: 'स्रग्धरा',
    syllablesPerPada: 21,
    type: 'samavrtta',
    signature: 'GGGGGLGGLLLLLLGLGGLGG',
    description: 'म्रभ्नैर्यानां त्रयेण त्रिमुनियतियुता स्रग्धरा कीर्तितेयम् (म, र, भ, न, य, य, य - यति ७, ७, ७ पर)',
  },
];

export interface MeterVerificationReport {
  meterName: string;
  meterNameDevanagari: string;
  confidence: number;
  totalPadas: number;
  padas: PadaAnalysis[];
  isStandardMeter: boolean;
  diagnostics: string[];
}

/**
 * Main verification entrypoint: Takes an entire verse, analyzes all padas,
 * and matches against Pingala's classical meters.
 */
export function identifyVerseMeter(verse: string): MeterVerificationReport {
  const rawPadas = splitIntoPadas(verse).slice(0, 64);
  const padas = rawPadas.map((pada, idx) => analyzePada(pada, idx));
  const diagnostics: string[] = [];

  if (padas.length === 0) {
    return {
      meterName: 'Unknown',
      meterNameDevanagari: 'अज्ञात',
      confidence: 0,
      totalPadas: 0,
      padas: [],
      isStandardMeter: false,
      diagnostics: ['श्लोक पाठ रिक्त अथवा अमान्य है।'],
    };
  }

  // Filter out non-verse lines (शीर्षक, नमस्कारोक्ति, कर्मकाण्ड विधि, पुष्पिका)
  const actualVersePadas = padas.filter(p => p.category === 'verse');

  if (actualVersePadas.length === 0) {
    return {
      meterName: 'Liturgical Prose / Invocations',
      meterNameDevanagari: 'गद्य / नमस्कारोक्ति / न्यास-विधि',
      confidence: 1.0,
      totalPadas: padas.length,
      padas,
      isStandardMeter: false,
      diagnostics: [
        'यह पाठ पद्य (छन्दोबद्ध श्लोक) नहीं है, अपितु ग्रन्थ का शीर्षक, मङ्गलाचरण-नमस्कार अथवा कर्मकाण्ड न्यास-मन्त्र है (अतः छन्द लागू नहीं होता)।',
      ],
    };
  }

  // Tag localMeter for each pada based on its syllable count and characteristics
  for (const pada of padas) {
    if (pada.category !== 'verse') {
      pada.localMeter = pada.categoryLabel;
    } else if (pada.syllableCount === 8) {
      pada.localMeter = 'अनुष्टुप् (८ अक्षर)';
    } else if (pada.syllableCount === 11) {
      pada.localMeter = 'त्रिष्टुप् (११ अक्षर)';
    } else if (pada.syllableCount === 12) {
      pada.localMeter = 'जगती (१२ अक्षर)';
    } else if (pada.syllableCount === 14) {
      pada.localMeter = 'वसन्ततिलका (१४ अक्षर)';
    } else if (pada.syllableCount === 15) {
      pada.localMeter = 'मालिनी (१५ अक्षर)';
    } else if (pada.syllableCount === 17) {
      pada.localMeter = 'शिखरिणी/मन्दाक्रान्ता (१७ अक्षर)';
    } else if (pada.syllableCount === 19) {
      pada.localMeter = 'शार्दूलविक्रीडितम् (१९ अक्षर)';
    } else if (pada.syllableCount === 21) {
      pada.localMeter = 'स्रग्धरा (२१ अक्षर)';
    } else {
      pada.localMeter = `${pada.syllableCount} अक्षर`;
    }
  }

  // Diagnostics for anomaly / OCR corruption (strictly on actual verse padas)
  actualVersePadas.forEach((p) => {
    if (p.syllableCount === 7) {
      diagnostics.push(`पद्य चरण ${p.padaIndex + 1} में केवल ७ अक्षर मिले हैं। संभवतः कोई संयुक्ताक्षर विखण्डित हुआ है अथवा १ अक्षर लुप्त है।`);
    } else if (p.syllableCount === 9) {
      diagnostics.push(`पद्य चरण ${p.padaIndex + 1} में ९ अक्षर मिले हैं। संभवतः किसी संयुक्ताक्षर को OCR ने दो अलग अक्षरों में तोड़ दिया है।`);
    }
  });

  const count8 = actualVersePadas.filter(p => p.syllableCount === 8).length;
  const count19 = actualVersePadas.filter(p => p.syllableCount === 19).length;
  const totalVersePadas = actualVersePadas.length;

  // 1. Dominant Anushtubh (श्लोक) (if >= 55% of verse padas have 8 syllables)
  if (count8 >= Math.ceil(totalVersePadas * 0.55)) {
    const anushtubhDef = CANONICAL_METRES.find(m => m.name === 'Anushtubh')!;
    const eightPadas = actualVersePadas.filter(p => p.syllableCount === 8);
    const check = anushtubhDef.patternMatcher ? anushtubhDef.patternMatcher(eightPadas) : { matches: true, confidence: 0.95 };
    const percentage = Math.round((count8 / totalVersePadas) * 100);

    let devanagariTitle = 'अनुष्टुप् (श्लोक)';
    if (percentage < 100) {
      devanagariTitle = `अनुष्टुप् (श्लोक) — प्रधान छन्द (${percentage}%)`;
      diagnostics.push(`ग्रन्थ के ${percentage}% श्लोक-चरण (${count8}/${totalVersePadas} पाद) अनुष्टुप् छन्द में हैं।`);
      if (count19 > 0) {
        diagnostics.push(`ध्यान मन्त्र (${count19} पाद): १९-अक्षरीय शार्दूलविक्रीडितम् छन्द में विरचित है ('सूर्याश्वैर्मसजस्तथाः सगुरवः शार्दूलविक्रीडितम्')।`);
      }
    } else {
      diagnostics.push(anushtubhDef.description);
    }

    return {
      meterName: 'Anushtubh',
      meterNameDevanagari: devanagariTitle,
      confidence: Math.max(0.85, Math.min(0.98, check.confidence || 0.92)),
      totalPadas: padas.length,
      padas,
      isStandardMeter: true,
      diagnostics,
    };
  }

  // 2. Dominant Shardulavikridita (if >= 55% of verse padas have 19 syllables)
  if (count19 >= Math.ceil(totalVersePadas * 0.55)) {
    const shardulaDef = CANONICAL_METRES.find(m => m.name === 'Shardulavikridita')!;
    return {
      meterName: 'Shardulavikridita',
      meterNameDevanagari: 'शार्दूलविक्रीडितम्',
      confidence: 0.95,
      totalPadas: padas.length,
      padas,
      isStandardMeter: true,
      diagnostics: [shardulaDef.description],
    };
  }

  // 3. Check for other classical Samavrtta meters on actual verse padas
  let bestMatch: ChhandasDefinition | null = null;
  let highestConfidence = 0;

  for (const def of CANONICAL_METRES) {
    if (def.type === 'anushtubh') continue;

    const expectedCount = typeof def.syllablesPerPada === 'number' ? def.syllablesPerPada : def.syllablesPerPada[0];
    const matchingPadaCounts = actualVersePadas.filter(p => p.syllableCount === expectedCount).length;
    
    if (matchingPadaCounts >= Math.ceil(actualVersePadas.length / 2)) {
      if (def.signature) {
        let totalCharMatches = 0;
        let totalTestedChars = 0;

        for (const pada of actualVersePadas) {
          const testLen = Math.min(pada.weightString.length, def.signature.length);
          for (let c = 0; c < testLen; c++) {
            totalTestedChars++;
            if (c === testLen - 1 || pada.weightString[c] === def.signature[c]) {
              totalCharMatches++;
            }
          }
        }

        const confidence = totalTestedChars > 0 ? totalCharMatches / totalTestedChars : 0;
        if (confidence > highestConfidence) {
          highestConfidence = confidence;
          bestMatch = def;
        }
      }
    }
  }

  if (bestMatch && highestConfidence >= 0.7) {
    return {
      meterName: bestMatch.name,
      meterNameDevanagari: bestMatch.nameDevanagari,
      confidence: highestConfidence,
      totalPadas: padas.length,
      padas,
      isStandardMeter: true,
      diagnostics: [bestMatch.description],
    };
  }

  // Check for Upajati (Mixture of Indravajra and Upendravajra)
  const isAll11 = padas.every(p => p.syllableCount === 11);
  if (isAll11 && padas.length >= 2) {
    return {
      meterName: 'Upajati',
      meterNameDevanagari: 'उपजाति (इन्द्रवज्रा-उपेन्द्रवज्रा मिश्रण)',
      confidence: 0.85,
      totalPadas: padas.length,
      padas,
      isStandardMeter: true,
      diagnostics: ['प्रत्येक पाद में ११ अक्षर हैं। इन्द्रवज्रा और उपेन्द्रवज्रा का शास्त्रसम्मत मिश्रण।'],
    };
  }

  return {
    meterName: 'Mixed / Unclassified',
    meterNameDevanagari: 'मिश्रित / अनिर्दिष्ट छन्द',
    confidence: 0.3,
    totalPadas: padas.length,
    padas,
    isStandardMeter: false,
    diagnostics: diagnostics.length > 0 ? diagnostics : ['छन्द का कोई निश्चित समवृत्त लक्षण प्राप्त नहीं हुआ।'],
  };
}
