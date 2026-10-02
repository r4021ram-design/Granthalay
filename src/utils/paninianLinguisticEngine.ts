/**
 * ============================================================================
 * 🕉️ ग्रन्थालयः - पाणिनीय संस्कृत व्याकरण एवं अनुवाद विश्लेषक इंजन
 * (Paninian Linguistic Parser, Dynamic Padaccheda & Meaning Synthesizer)
 * ============================================================================
 */

import type { ShlokaLinguisticData, PadaAnalysisEntry, SamasaEntry } from '../types/translation.js';
import { findCanonicalTranslation } from '../data/translations/canonicalTranslations.js';
import { generatePadachheda } from './padachheda.js';
import { identifyVerseMeter } from './chhandasEngine.js';

// Common grammatical suffix heuristics for Sanskrit Subanta/Tinganta parsing
const VIBHAKTI_PATTERNS: { regex: RegExp; type: 'subanta'; details: string; karaka: string }[] = [
  { regex: /स्य$/u, type: 'subanta', details: 'षष्ठी विभक्ति, एकवचन', karaka: 'सम्बन्ध पद (का/के/की)' },
  { regex: /ेभ्यः$/u, type: 'subanta', details: 'चतुर्थी/पञ्चमी विभक्ति, बहुवचन', karaka: 'सम्प्रदान/अपादान कारक' },
  { regex: /ेण$/u, type: 'subanta', details: 'तृतीया विभक्ति, एकवचन', karaka: 'करण कारक (से/द्वारा)' },
  { regex: /ाभ्याम्$/u, type: 'subanta', details: 'तृतीया/चतुर्थी/पञ्चमी, द्विवचन', karaka: 'करण/सम्प्रदान/अपादान' },
  { regex: /ेषु$/u, type: 'subanta', details: 'सप्तमी विभक्ति, बहुवचन', karaka: 'अधिकरण कारक (में/पर)' },
  { regex: /ात्$/u, type: 'subanta', details: 'पञ्चमी विभक्ति, एकवचन', karaka: 'अपादान कारक (से पृथक्)' },
  { regex: /ये$/u, type: 'subanta', details: 'चतुर्थी विभक्ति, एकवचन', karaka: 'सम्प्रदान कारक (के लिए)' },
  { regex: /ाय$/u, type: 'subanta', details: 'चतुर्थी विभक्ति, एकवचन', karaka: 'सम्प्रदान कारक (के लिए)' },
  { regex: /ौ$/u, type: 'subanta', details: 'प्रथमा/द्वितीया द्विवचन अथवा सप्तमी एकवचन', karaka: 'कर्ता/कर्म/अधिकरण' },
  { regex: /म्$/u, type: 'subanta', details: 'द्वितीया विभक्ति, एकवचन', karaka: 'कर्म कारक (को)' },
  { regex: /ः$/u, type: 'subanta', details: 'प्रथमा विभक्ति, एकवचन', karaka: 'कर्ता कारक (ने)' },
];

const TINGANTA_PATTERNS: { regex: RegExp; type: 'tinganta'; details: string }[] = [
  { regex: /ति$/u, type: 'tinganta', details: 'लट् लकार (वर्तमान), प्रथम पुरुष, एकवचन' },
  { regex: /न्ति$/u, type: 'tinganta', details: 'लट् लकार (वर्तमान), प्रथम पुरुष, बहुवचन' },
  { regex: /सि$/u, type: 'tinganta', details: 'लट् लकार (वर्तमान), मध्यम पुरुष, एकवचन' },
  { regex: /मि$/u, type: 'tinganta', details: 'लट् लकार (वर्तमान), उत्तम पुरुष, एकवचन' },
  { regex: /तु$/u, type: 'tinganta', details: 'लोट् लकार (आशीर्वाद/आज्ञा), प्रथम पुरुष, एकवचन' },
  { regex: /ताम्$/u, type: 'tinganta', details: 'लोट् लकार, प्रथम पुरुष, द्विवचन' },
  { regex: /न्तु$/u, type: 'tinganta', details: 'लोट् लकार, प्रथम पुरुष, बहुवचन' },
  { regex: /ते$/u, type: 'tinganta', details: 'आत्मनेपद, लट् लकार, प्रथम पुरुष, एकवचन' },
  { regex: /न्ते$/u, type: 'tinganta', details: 'आत्मनेपद, लट् लकार, प्रथम पुरुष, बहुवचन' },
  { regex: /े$/u, type: 'tinganta', details: 'आत्मनेपद, लट् लकार, उत्तम पुरुष, एकवचन' },
];

const KRIDANTA_PATTERNS: { regex: RegExp; type: 'kridanta'; details: string; meaningSuffix: string }[] = [
  { regex: /त्वा$/u, type: 'kridanta', details: 'क्त्वा प्रत्यय (पूर्वकालिक क्रिया)', meaningSuffix: 'करके' },
  { regex: /[पत्य]्य$/u, type: 'kridanta', details: 'ल्यप् प्रत्यय (उपसर्गयुक्त पूर्वकालिक)', meaningSuffix: 'करके' },
  { regex: /तुम्$/u, type: 'kridanta', details: 'तुमुन् प्रत्यय (हेत्वर्थक क्रिया)', meaningSuffix: 'करने के लिए' },
  { regex: /तः$/u, type: 'kridanta', details: 'क्त प्रत्यय (भूतकालिक कृदन्त)', meaningSuffix: 'हुआ / किया गया' },
  { regex: /ता$/u, type: 'kridanta', details: 'क्त प्रत्यय (स्त्रीलिङ्ग भूतकालिक)', meaningSuffix: 'हुई' },
];

const KNOWN_AVYYAS: Record<string, string> = {
  'च': 'और',
  'वा': 'अथवा / या',
  'एव': 'ही',
  'हि': 'निश्चय ही',
  'तु': 'तो / किन्तु',
  'इति': 'इस प्रकार',
  'न': 'नहीं',
  'मा': 'मत / नहीं',
  'सदा': 'हमेशा',
  'सर्वदा': 'सब समय',
  'यथा': 'जैसे',
  'तथा': 'वैसे',
  'यदा': 'जब',
  'तदा': 'तब',
  'नमः': 'प्रणाम / नमन',
  'स्वाहा': 'आहुति मन्त्र',
  'खलु': 'निश्चयपूर्वक / वास्तव में',
  'अपि': 'भी',
};

// In-memory cache for on-the-fly generated analyses
const DYNAMIC_CACHE = new Map<string, ShlokaLinguisticData>();

/**
 * Main linguistic processor for any Sanskrit Shloka or Selection
 */
export function analyzeShlokaLinguistics(
  rawText: string,
  stotraId: string = 'general-stotra',
  shlokaNum?: number
): ShlokaLinguisticData {
  const clean = rawText.trim();

  // 1. Check Canonical Pre-Indexed Knowledge Base first
  const canonical = findCanonicalTranslation(clean, stotraId, shlokaNum);
  if (canonical) {
    return canonical;
  }

  // 2. Check Dynamic Cache
  if (DYNAMIC_CACHE.has(clean)) {
    return DYNAMIC_CACHE.get(clean)!;
  }

  // 3. Dynamic Paninian Prosody & Chhandas calculation
  const chhandasResult = identifyVerseMeter(clean);

  // 4. Padaccheda (Sandhi splitting)
  const padacchedaObj = generatePadachheda(clean);
  const splitText = padacchedaObj.padachheda;

  // 5. Morphological Word Breakdown (Subanta / Tinganta / Avyaya)
  const rawWords = splitText
    .replace(/[॥।०-९\d,.!?"'—\-]/gu, ' ')
    .split(/\s+/)
    .filter((w: string) => w.length > 0);

  const padaList: PadaAnalysisEntry[] = [];
  const samasaList: SamasaEntry[] = [];

  for (const word of rawWords) {
    // If it contains a hyphen, it was identified as a compound (Samasa)
    if (word.includes('-')) {
      const parts = word.split('-');
      samasaList.push({
        compoundWord: parts.join(''),
        vigraha: parts.join(' + '),
        samasaType: 'समस्त पद (समास)',
        meaningHindi: `संयुक्त पद: ${parts.join(' - ')}`,
      });
      continue;
    }

    // Check Avyayas
    if (KNOWN_AVYYAS[word]) {
      padaList.push({
        word,
        pratipadikaOrDhatu: word,
        grammaticalType: 'avyaya',
        details: 'अव्यय पद',
        meaningHindi: KNOWN_AVYYAS[word],
      });
      continue;
    }

    // Check Kridantas
    let matchedKridanta = false;
    for (const kp of KRIDANTA_PATTERNS) {
      if (kp.regex.test(word)) {
        padaList.push({
          word,
          pratipadikaOrDhatu: word.replace(kp.regex, ''),
          grammaticalType: 'kridanta',
          details: kp.details,
          meaningHindi: `${word} (${kp.meaningSuffix})`,
        });
        matchedKridanta = true;
        break;
      }
    }
    if (matchedKridanta) continue;

    // Check Tingantas (Verbs)
    let matchedTinganta = false;
    for (const tp of TINGANTA_PATTERNS) {
      if (tp.regex.test(word)) {
        padaList.push({
          word,
          pratipadikaOrDhatu: word.replace(tp.regex, ''),
          grammaticalType: 'tinganta',
          details: tp.details,
          meaningHindi: `क्रिया: ${word}`,
        });
        matchedTinganta = true;
        break;
      }
    }
    if (matchedTinganta) continue;

    // Check Subantas (Nouns/Adjectives)
    let matchedSubanta = false;
    for (const vp of VIBHAKTI_PATTERNS) {
      if (vp.regex.test(word)) {
        padaList.push({
          word,
          pratipadikaOrDhatu: word.replace(vp.regex, ''),
          grammaticalType: 'subanta',
          details: vp.details,
          karakaOrPrayoga: vp.karaka,
          meaningHindi: `${word} (${vp.karaka})`,
        });
        matchedSubanta = true;
        break;
      }
    }
    if (matchedSubanta) continue;

    // Default entry
    padaList.push({
      word,
      pratipadikaOrDhatu: word,
      grammaticalType: 'subanta',
      details: 'पद (प्रातिपदिक)',
      meaningHindi: word,
    });
  }

  // 6. Synthesize Dandanvaya and Context-Aware Hindi Meaning
  const dandanvaya = rawWords.join(' ') + '।';

  // Context-aware intent detection
  let intentSummary = 'प्रस्तुत शास्त्रीय श्लोक में भगवत्स्वरूप का पावन स्मरण एवं चिन्तन किया गया है।';
  if (/ब्रूहि|वद|कथय|पृच्छामि/u.test(clean)) {
    intentSummary = 'जिज्ञासा एवं संवाद: वक्ता द्वारा सम्बोधन पूर्वक ज्ञान, परम रहस्य अथवा रक्षा-साधन का उपदेश देने हेतु विनम्र प्रार्थना।';
  } else if (/शृणु|शृणुष्व|प्रवक्ष्यामि|पठेत्|जपेत्/u.test(clean)) {
    intentSummary = 'विधि एवं उपदेश: पवित्र स्तोत्र अथवा मन्त्र को श्रद्धापूर्वक श्रवण करने, धारण करने एवं नित्य पारायण करने का शास्त्रीय निर्देश।';
  } else if (/रक्ष|रक्षतु|पातु|अवतु/u.test(clean)) {
    intentSummary = 'कवच-रक्षा प्रार्थना: समस्त अङ्गों, दसों दिशाओं एवं संकटों से सर्वतोभावेन रक्षा करने की मंगलमयी याचना।';
  } else if (/नमः|नमामि|भजे|वन्दे|प्रणमामि/u.test(clean)) {
    intentSummary = 'नमन एवं शरणागति: देवाधिदेव/भगवती के पावन स्वरूप को सादर नमन करते हुए अनन्य शरणागति एवं कल्याण की प्रार्थना।';
  } else if (/देहि|जयं|शुभं|प्रसीद/u.test(clean)) {
    intentSummary = 'अनुग्रह याचना: रूप (आत्मज्ञान), जय, यश, आरोग्य एवं अभीष्ट सिद्धि प्रदान करने हेतु मंगलमय वरदान की प्रार्थना।';
  } else if (/नामानि|प्रकीर्तिताः|उक्तानि/u.test(clean)) {
    intentSummary = 'दिव्य नामावली कीर्तन: परम शक्ति के पावन नामों, रूपों एवं उनकी अनन्त महिमा का श्रद्धापूर्वक कीर्तन।';
  }

  // Detect speaker prefix if uvacha exists
  let speakerPrefix = '';
  if (/मार्कण्डेय\s*उवाच/u.test(clean)) speakerPrefix = 'मार्कण्डेय जी ने कहा — ';
  else if (/ब्रह्मोवाच/u.test(clean)) speakerPrefix = 'ब्रह्मा जी ने कहा — ';
  else if (/शिव\s*उवाच/u.test(clean)) speakerPrefix = 'भगवान् शिव ने कहा — ';
  else if (/श्रीभगवानुवाच/u.test(clean)) speakerPrefix = 'श्रीभगवान् ने कहा — ';
  else if (/अर्जुन\s*उवाच/u.test(clean)) speakerPrefix = 'अर्जुन ने कहा — ';
  else if (/सञ्जय\s*उवाच/u.test(clean)) speakerPrefix = 'सञ्जय ने कहा — ';

  // Build pedagogical word-by-word padartha summary
  const padarthaItems = padaList
    .slice(0, 8)
    .map((p) => `• ${p.word} (${p.details}) : ${p.meaningHindi}`)
    .join('\n');

  const hindiMeaning = `॥ भावार्थ ॥\n${speakerPrefix}${intentSummary}\n\n॥ पद-सार (शब्दार्थ) ॥\n${padarthaItems}`;

  const result: ShlokaLinguisticData = {
    stotraId,
    shlokaNumber: shlokaNum || 1,
    shlokaText: clean,
    hindiMeaning,
    dandanvaya,
    padaccheda: splitText,
    samasaList,
    padaList: padaList.slice(0, 10), // Limit top parsed tokens for clean display
    chhandas: {
      name: chhandasResult.meterNameDevanagari,
      syllableWeight: chhandasResult.padas[0]?.weightString || '। ऽ । ऽ',
      ganaPattern: chhandasResult.padas[0]?.ganaNotation || 'गण-विश्लेषण',
      totalMatras: chhandasResult.padas[0]?.totalMatras || 16,
      totalAksharas: chhandasResult.padas[0]?.syllableCount || 8,
      description: chhandasResult.diagnostics[0] || 'छन्द-लक्षण',
    },
    sourceReference: 'शास्त्रसम्मत संस्कृत वाङ्मय',
  };

  DYNAMIC_CACHE.set(clean, result);
  return result;
}
