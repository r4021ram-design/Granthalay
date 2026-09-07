/**
 * Sanskrit Transliteration Engine: Devanagari <-> IAST & ITRANS
 * Standardized to international Indological Sanskrit transcription
 */

const VOWEL_MARKS: Record<string, string> = {
  'ा': 'ā',
  'ि': 'i',
  'ी': 'ī',
  'ु': 'u',
  'ू': 'ū',
  'ृ': 'ṛ',
  'ॄ': 'ṝ',
  'ॢ': 'ḷ',
  'ॣ': 'ḹ',
  'े': 'e',
  'ै': 'ai',
  'ो': 'o',
  'ौ': 'au',
};

const INDEPENDENT_VOWELS: Record<string, string> = {
  'अ': 'a',
  'आ': 'ā',
  'इ': 'i',
  'ई': 'ī',
  'उ': 'u',
  'ऊ': 'ū',
  'ऋ': 'ṛ',
  'ॠ': 'ṝ',
  'ऌ': 'ḷ',
  'ॡ': 'ḹ',
  'ए': 'e',
  'ऐ': 'ai',
  'ओ': 'o',
  'औ': 'au',
};

const CONSONANTS: Record<string, string> = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ṅ',
  'च': 'c', 'छ': 'ch', 'ज': 'j', 'झ': 'jh', 'ञ': 'ñ',
  'ट': 'ṭ', 'ठ': 'ṭh', 'ड': 'ḍ', 'ढ': 'ḍh', 'ण': 'ṇ',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'ś', 'ष': 'ṣ', 'स': 's', 'ह': 'h',
  'ळ': 'ḻ',
};

const MODIFIERS: Record<string, string> = {
  'ं': 'ṃ',
  'ः': 'ḥ',
  'ँ': 'm̐',
  'ऽ': "'",
  'ॐ': 'oṃ',
  '।': ' |',
  '॥': ' ||',
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
};

export function devanagariToIast(text: string): string {
  if (!text) return '';

  let out = '';
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const ch = text[i];

    if (INDEPENDENT_VOWELS[ch]) {
      out += INDEPENDENT_VOWELS[ch];
      continue;
    }

    if (CONSONANTS[ch]) {
      const base = CONSONANTS[ch];
      const next = i + 1 < len ? text[i + 1] : '';

      if (next === '्') {
        // Halant suppresses inherent 'a'
        out += base;
        i++; // skip halant
      } else if (VOWEL_MARKS[next]) {
        out += base + VOWEL_MARKS[next];
        i++; // skip vowel matra
      } else {
        // Inherent 'a'
        out += base + 'a';
      }
      continue;
    }

    if (MODIFIERS[ch]) {
      out += MODIFIERS[ch];
      continue;
    }

    // Pass through punctuation, whitespace, Vedic accents or latin characters
    if (ch === '॑') {
      out += '´'; // Vedic udatta
    } else if (ch === '॒') {
      out += '_'; // Vedic anudatta
    } else if (ch === '᳚') {
      out += '˝'; // Vedic svarita
    } else if (ch === 'ꣳ') {
      out += 'g̃';
    } else {
      out += ch;
    }
  }

  return out.replace(/\s+/g, ' ').replace(/\s+\|/g, ' |').trim();
}
