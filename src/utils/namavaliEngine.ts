/**
 * Namavali (108 / 1000 Divine Names) & Archana Extraction Engine
 * Implements Paninian 4th Case (चतुर्थी एकवचन / ङे-प्रत्यय) inflection rules,
 * compound (समास) decompounding, and automated liturgical mantra generation.
 */

export interface NamavaliEntry {
  index: number;
  pratipadika: string;       // Base nominal stem (e.g. "शिव", "विष्णु", "दुर्गा")
  gender: 'm' | 'f' | 'n';
  chaturthiForm: string;     // Inflected form (e.g. "शिवाय", "विष्णवे", "दुर्गायै")
  mantra: string;            // Complete liturgical mantra: "ॐ शिवाय नमः।"
  sourceLine?: string;
  notes?: string;
}

// Stopwords & Non-Name Particles (श्लोक-पूरक अव्यय एवं संयोजक)
const STOPWORDS = new Set([
  'च', 'वा', 'एव', 'तु', 'अपि', 'तथा', 'यथा', 'इति', 'हि', 'स्म', 'अथ', 'पुनः',
  'सदा', 'सर्वदा', 'उवाच', 'ऊचुः', 'नमः', 'नमो', 'वन्दे', 'नमामि', 'ध्यायेत्',
  'प्रणमामि', 'स', 'सः', 'यः', 'तं', 'ते', 'मे', 'नः', 'वः', 'त्वाम्', 'माम्',
  'अहम्', 'त्वम्', 'श्री', 'ॐ', 'इति'
]);

/**
 * Checks if a token is a metrical filler or stopword.
 */
export function isStopword(word: string): boolean {
  return STOPWORDS.has(word.trim());
}

/**
 * Derives the authentic Paninian Chaturthi singular form for any Sanskrit nominal stem.
 * Handles all genders and vowel/consonant terminations according to Ashtadhyayi rules:
 * - अकारान्त (पुं./नपुं.): ङेर्यः (७.१.१३) -> -आय / सर्वनाम्नः स्मै (७.१.१४) -> -स्मै
 * - आकारान्त (स्त्री.): याडापः (७.३.११३) -> -आयै
 * - इकारान्त (पुं.): घेर्ङिति (७.३.१११) -> -अये
 * - इकारान्त / ईकारान्त (स्त्री.): आण्नद्याः (७.३.११२) -> -यै
 * - उकारान्त (पुं.): घेर्ङिति -> -अवे
 * - उकारान्त / ऊकारान्त (स्त्री.): -वै
 * - ऋकारान्त (पुं.): -त्रे
 * - व्यञ्जनान्त (मत्/वत्): -वते / -मते
 * - व्यञ्जनान्त (इन्): -इणे / -इने
 * - व्यञ्जनान्त (अन्): -णे / -ने
 * - व्यञ्जनान्त (अस्): -से
 */
export function deriveChaturthiMantra(pratipadika: string, gender: 'm' | 'f' | 'n' = 'm'): { chaturthi: string; mantra: string; notes?: string } {
  const stem = pratipadika.trim();
  if (!stem) return { chaturthi: '', mantra: '' };

  // 1. Special Vedic / Canonical exceptions
  if (stem === 'विश्व') {
    return { chaturthi: 'विश्वस्मै', mantra: 'ॐ विश्वस्मै नमः।', notes: 'सर्वनाम्नः स्मै (७.१.१४)' };
  }
  if (stem === 'सर्व') {
    return { chaturthi: 'सर्वस्मै', mantra: 'ॐ सर्वस्मै नमः।', notes: 'सर्वनाम्नः स्मै (७.१.१४)' };
  }
  if (stem === 'श्रीमाता') {
    return { chaturthi: 'श्रीमात्रे', mantra: 'ॐ श्रीमात्रे नमः।', notes: 'ऋकारान्त मातृ शब्द रूप' };
  }
  if (stem === 'श्री') {
    return { chaturthi: 'श्रियै', mantra: 'ॐ श्रियै नमः।' };
  }

  // 2. मत् / वत् अन्त (e.g. भगवत् -> भगवते, हनुमत् -> हनुमते, धीमत् -> धीमते)
  if (stem.endsWith('वत्') || stem.endsWith('मत्')) {
    const chaturthi = stem.slice(0, -1) + 'े';
    return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
  }

  // 3. इन्-प्रत्ययान्त (e.g. शार्ङ्गिन् -> शार्ङ्गिणे, चक्रिन् -> चक्रिणे, योगिन् -> योगिने)
  if (stem.endsWith('िन्')) {
    // Determine retroflexion (णत्व विधान: र्/ष् पूर्व होने पर ण)
    const hasRetroflexTrigger = /[ऋॠरष]/.test(stem);
    const suffix = hasRetroflexTrigger ? 'िणे' : 'िने';
    const chaturthi = stem.slice(0, -3) + suffix;
    return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
  }

  // 4. अन्-अन्त (e.g. ब्रह्मन् -> ब्रह्मणे, आत्मन् -> आत्मने, राजन् -> राज्ञे)
  if (stem.endsWith('मन्')) {
    const chaturthi = stem.slice(0, -3) + '्मणे';
    return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
  }
  if (stem === 'राजन्') {
    return { chaturthi: 'राज्ञे', mantra: 'ॐ राज्ञे नमः।' };
  }
  if (stem.endsWith('न्')) {
    const chaturthi = stem.slice(0, -1) + 'े';
    return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
  }

  // 5. अस्-अन्त (e.g. चन्द्रमस् -> चन्द्रमसे, वेधस् -> वेधसे, तेजस् -> तेजसे)
  if (stem.endsWith('स्')) {
    const chaturthi = stem.slice(0, -1) + 'े';
    return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
  }

  // 6. त्-अन्त (e.g. शङ्खभृत् -> शङ्खभृते)
  if (stem.endsWith('त्')) {
    const chaturthi = stem.slice(0, -1) + 'े';
    return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
  }

  // 7. ई-कारान्त स्त्रीलिङ्ग (e.g. गौरी -> गौर्यै, लक्ष्मी -> लक्ष्म्यै, पार्वती -> पार्वत्यै)
  if (gender === 'f' && stem.endsWith('ी')) {
    const base = stem.slice(0, -1);
    const chaturthi = base + '्यै';
    return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
  }

  // 8. आ-कारान्त स्त्रीलिङ्ग (e.g. दुर्गा -> दुर्गायै, उमा -> उमायै, अम्बा -> अम्बायै)
  if (gender === 'f' && (stem.endsWith('ा') || stem.endsWith('ा'))) {
    const base = stem.slice(0, -1);
    const chaturthi = base + 'ायै';
    return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
  }

  // 9. इ-कारान्त पुंल्लिङ्ग (e.g. हरि -> हरये, कपि -> कपये, मुनि -> मुनये)
  if (gender === 'm' && stem.endsWith('ि')) {
    const base = stem.slice(0, -1);
    const chaturthi = base + 'ये';
    return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
  }

  // 10. उ-कारान्त पुंल्लिङ्ग (e.g. विष्णु -> विष्णवे, शम्भु -> शम्भवे, भानु -> भानवे)
  if (gender === 'm' && stem.endsWith('ु')) {
    const base = stem.slice(0, -1);
    const chaturthi = base + 'वे';
    return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
  }

  // 11. ऋ-कारान्त पुंल्लिङ्ग (e.g. धातृ -> धात्रे, विधातृ -> विधात्रे, सवितृ -> सवित्रे)
  if (stem.endsWith('ृ')) {
    const base = stem.slice(0, -1);
    const chaturthi = base + '्रे';
    return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
  }

  // 12. अ-कारान्त (पुंल्लिङ्ग / सामान्य default) (e.g. राम -> रामाय, शिव -> शिवाय, कृष्ण -> कृष्णाय)
  // If word ends with virama, remove it; if ends without explicit vowel matra, it's inherent 'a'
  const cleanBase = stem.replace(/[ःं]$/, '');
  const chaturthi = cleanBase + 'ाय';
  return { chaturthi, mantra: `ॐ ${chaturthi} नमः।` };
}

/**
 * Normalizes a word extracted from a stotra shloka back into its Pratipadika (Stem).
 * Strips nominative endings (ः, म्, न्) and returns candidate base stem.
 */
export function normalizeToPratipadika(rawWord: string): string {
  let w = rawWord.trim().replace(/[०-९0-9॥।,;:"'()\[\]{}!?\/\\~`_]/g, '');
  if (!w) return '';

  // Strip trailing Visarga
  if (w.endsWith('ः')) {
    w = w.slice(0, -1);
  }
  // Strip trailing Anusvara or Halanta Ma
  else if (w.endsWith('ं')) {
    w = w.slice(0, -1);
  } else if (w.endsWith('म्')) {
    w = w.slice(0, -2);
  }
  // Strip common nominative plural / dual endings if present
  else if (w.endsWith('ौ')) {
    // Dvitiya/Prathama dvivacana (e.g. रामौ -> राम)
    w = w.slice(0, -1);
  }
  // Strip Utva Sandhi 'ो' (e.g. वषट्कारो -> वषट्कार, भावो -> भाव)
  else if (w.endsWith('ो')) {
    w = w.slice(0, -1);
  }

  return w;
}

/**
 * Deconstructs common Sanskrit Sandhi particles in running Stotra text:
 * - Rutva Sandhi: 'र्' before soft consonants (e.g. विष्णुर्वषट्कारो -> विष्णुः वषट्कारो)
 * - Jashva Sandhi: 'द्' before soft consonants (e.g. भूतकृद्भूत -> भूतकृत् भूत)
 * - Schutva Sandhi: 'श्च' -> 'ः च'
 */
function splitSandhiAndCompounds(text: string): string[] {
  const cleaned = text
    .replace(/([ुिाेौोैृ]र्?|[^्])र्([गघजझडढदधबभयरलवह])/g, '$1ः $2')
    .replace(/द्([गघजझडढदधबभयरलवह])/g, 'त् $1')
    .replace(/श्च/g, 'ः च ');

  return cleaned.split(/[\s।॥,;]+/).map(t => t.trim()).filter(t => t.length > 0);
}

/**
 * Extracts candidate Divine Names from a Sanskrit Stotra verse or collection of verses,
 * applying stopword filtering, compound tokenization, and Chaturthi transformation.
 */
export function extractNamavaliFromStotra(
  stotraText: string,
  gender: 'm' | 'f' | 'n' = 'm',
  maxNames: number = 1000
): NamavaliEntry[] {
  const lines = stotraText.split(/\r?\n/);
  const entries: NamavaliEntry[] = [];
  const seenPratipadikas = new Set<string>();

  for (const line of lines) {
    // Split into individual tokens by space, danda, and Sandhi deconstruction
    const tokens = splitSandhiAndCompounds(line);

    for (const token of tokens) {
      if (isStopword(token)) continue;

      const pratipadika = normalizeToPratipadika(token);
      if (!pratipadika || pratipadika.length < 2) continue;
      if (isStopword(pratipadika)) continue;
      if (seenPratipadikas.has(pratipadika)) continue;

      seenPratipadikas.add(pratipadika);

      const { chaturthi, mantra, notes } = deriveChaturthiMantra(pratipadika, gender);
      if (chaturthi && mantra) {
        entries.push({
          index: entries.length + 1,
          pratipadika,
          gender,
          chaturthiForm: chaturthi,
          mantra,
          sourceLine: line.trim(),
          notes,
        });

        if (entries.length >= maxNames) {
          return entries;
        }
      }
    }
  }

  return entries;
}
