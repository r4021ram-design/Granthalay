/**
 * Scripture Typography & Liturgical Classification Engine
 * Implements the Vedic vs Pauranik Script Typography Standard
 */

export type ScriptureBlockType =
  | 'VEDIC_MANTRA'
  | 'PAURANIK_SHLOKA'
  | 'NAMAVALI'
  | 'VIDHI_INSTRUCTION'
  | 'RITUAL_STEP_HEADER'
  | 'SAMARPANA_MANTRA'
  | 'SANKALPA'
  | 'SECTION_HEADING'
  | 'INVOCATION_HEADING'
  | 'REGULAR_TEXT';

export interface ScriptureBlockConfig {
  type: ScriptureBlockType;
  fontFamily: string;
  lineHeightClass: string;
  badgeLabel?: string;
  badgeIcon?: string;
  containerClass: string;
  textClass: string;
}

// Canonical Vedic Hymn and Mantra patterns
const VEDIC_INCIPITS: RegExp[] = [
  // Swasti Vachan & Shanti Path (Rigveda 1.89 / Shukla Yajurveda 25 & 36)
  /आ\s*नो\s*भद्राः\s*क्रतवो/u,
  /देवा\s*नो\s*यथा\s*सदमिद्वृधे/u,
  /देवानां\s*भद्रा\s*सुमति/u,
  /देवानाꣳ\s*सख्य/u,
  /तान्\s*पूर्वया\s*निविदा/u,
  /अर्यमणं\s*वरुणं/u,
  /तन्नो\s*वातो/u,
  /तद्ग्रावाणः\s*सोमसुतो/u,
  /तमीशानं\s*जगत/u,
  /पूषा\s*नो\s*यथा/u,
  /स्वस्ति\s*न\s*इन्द्रो/u,
  /स्वस्ति\s*नः\s*पूषा/u,
  /स्वस्तिनस्तार्क्ष्यो/u,
  /स्वस्ति\s*नो\s*बृहस्पति/u,
  /पृषदश्वा\s*मरुतः/u,
  /अग्निजिह्वा\s*मनवः/u,
  /भद्रं\s*कर्णेभिः/u,
  /भद्रं\s*पश्येमाक्षभि/u,
  /स्थिरैरङ्गै/u,
  /व्यशेम\s*देवहितं/u,
  /शतमिन्नु\s*शरदो/u,
  /पुत्रासो\s*यत्र\s*पितरो/u,
  /अदितिर्द्यौ/u,
  /विश्वे\s*देवा\s*अदितिः/u,
  /द्यौः\s*शान्ति/u,
  /वनस्पतयः\s*शान्ति/u,
  /शान्तिः\s*सा\s*मा\s*शान्तिरेधि/u,
  /यतो\s*यतः\s*समीहसे/u,
  /शं\s*नः\s*कुरु\s*प्रजाभ्यो/u,
  /ॐ\s*शान्तिः\s*शान्तिः\s*शान्तिः/u,

  // Atharvashirsha Upanishad (Atharvaveda - all sections)
  /हरिः\s*ॐ\s*नमस्ते\s*गणपतये/u,
  /त्वमेव\s*प्रत्यक्षं\s*तत्त्वमसि/u,
  /त्वमेव\s*केवलं\s*कर्ता/u,
  /त्वमेव\s*केवलं\s*धर्ता/u,
  /त्वमेव\s*केवलं\s*हर्ता/u,
  /त्वमेव\s*सर्वं\s*खल्विदं/u,
  /त्वं\s*साक्षादात्मा/u,
  /ऋतं\s*वच्मि/u,
  /सत्यं\s*वच्मि/u,
  /अव\s*त्वं\s*माम्/u,
  /अव\s*वक्तारम्/u,
  /अव\s*श्रोतारम्/u,
  /अव\s*दातारम्/u,
  /अवानूचानमव/u,
  /अव\s*पश्चात्तात्/u,
  /अव\s*पुरस्तात्/u,
  /अव\s*दक्षिणात्तात्/u,
  /अवोत्तरात्तात्/u,
  /अव\s*चोध्वात्तात्/u,
  /अवाधरात्तात्/u,
  /सर्वतो\s*मां\s*पाहि/u,
  /त्वं\s*वाङ्मयस्त्वं/u,
  /त्वमानन्दमयस्त्वं/u,
  /त्वं\s*प्रत्यक्षं\s*ब्रह्मासि/u,
  /त्वं\s*ज्ञानमयो/u,
  /सर्वं\s*जगदिदं/u,
  /त्वं\s*भूमिरापो/u,
  /त्वं\s*गुणत्रयातीतः/u,
  /त्वमवस्थात्रयातीतः/u,
  /त्वं\s*देहत्रयातीतः/u,
  /त्वं\s*कालत्रयातीतः/u,
  /त्वं\s*मूलाधारस्थितोऽसि/u,
  /त्वं\s*शक्तित्रयात्मकः/u,
  /त्वां\s*योगिनो\s*ध्यायन्ति/u,
  /त्वं\s*ब्रह्मा\s*त्वं\s*विष्णु/u,
  /गणादिं\s*पूर्वमुच्चार्य/u,
  /वर्णादिं\s*तदनन्तरम्/u,
  /अनुस्वारः\s*परतरः/u,
  /अर्धेन्दुलसितम्/u,
  /तारेण\s*ऋद्धम्/u,
  /एतत्तव\s*मनुस्वरूपम्/u,
  /गकारः\s*पूर्वरूपम्/u,
  /अकारो\s*मध्यमरूपम्/u,
  /बिन्दुरुत्तररूपम्/u,
  /नादः\s*सन्धानम्/u,
  /संहिता\s*सन्धिः/u,
  /सैषा\s*गणेशविद्या/u,
  /गणक\s*ऋषिः/u,
  /निचृद्गायत्रीच्छन्दः/u,
  /गणपतिर्देवता/u,
  /ॐ\s*गं\s*गणपतये\s*नमः/u,
  /एकदन्ताय\s*विद्महे/u,
  /वक्रतुण्डाय\s*धीमहि/u,
  /तन्नो\s*दन्ती\s*प्रचोदयात्/u,
  /एकदन्तं\s*चतुर्हस्तं/u,
  /पाशमङ्कुशधारिणम्/u,
  /रदं\s*च\s*वरदं/u,
  /रक्तं\s*लम्बोदरं/u,
  /शूर्पकर्णकं/u,
  /रक्तवाससम्/u,
  /रक्तगन्धानुलिप्ताङ्ग/u,
  /रक्तपुष्पैः\s*सुपूजितम्/u,
  /भक्तानुकम्पिनं\s*देवं/u,
  /जगत्कारणमच्युतम्/u,
  /आविर्भूतं\s*च\s*सृष्ट्यादौ/u,
  /प्रकृतेः\s*पुरुषात्परम्/u,
  /एवं\s*ध्यायति\s*यो\s*नित्यं/u,
  /स\s*योगी\s*योगिनां\s*वरः/u,
  /नमो\s*व्रातपतये/u,
  /नमो\s*गणपतये/u,
  /नमः\s*प्रमथपतये/u,
  /नमस्तेऽस्तु\s*लम्बोदराय/u,
  /विघ्ननाशिने\s*शिवसुताय/u,
  /श्रीवरदमूर्तये\s*नमो\s*नमः/u,

  // Vedic Samhita Hymns in Karmakanda
  /सहस्रशीर्षा\s*पुरुषः/u,
  /हिरण्यगर्भः/u,
  /जातवेदसे\s*सुनवाम/u,
  /नमस्ते\s*रुद्र\s*मन्यव/u,
  /ईशा\s*वास्यमिदं/u,
  /हꣳसः\s*शुचिषद/u,
  /त्र्यम्बकं\s*यजामहे/u,
  /शं\s*नो\s*मित्रः/u,
  /मधु\s*वाता\s*ऋतायते/u,
  /वरुणस्योत्तम्भनमसि/u,
  /भूरसि\s*भूमिरस्यदितिरसि/u,
  /ओषधयः\s*संवदन्ते/u,
  /आ\s*जिघ्र\s*कलशं/u,
  /पवित्रे\s*स्त्थो/u,
  /पयः\s*पृथिव्यां/u,
  /दधिक्राव्णो\s*अकारिषं/u,
  /घृतं\s*घृतपावानः/u,
  /स्वादुः\s*पवस्व/u,
  /पञ्च\s*नद्यः\s*सरस्वती/u,
  /आपो\s*हि\s*ष्ठा/u,
  /युवा\s*सुवासाः/u,
  /बृहस्पते\s*अति\s*यदर्यो/u,
  /नमो\s*बिल्मिने\s*च/u,
  /नाभ्या\s*आसीदन्तरिक्ष/u,
  /यज्ञेन\s*यज्ञमयजन्त/u,
  /ते\s*ह\s*नाकं\s*महिमानः/u,
  /राजाधिराजाय\s*प्रसह्यसाहिने/u,
  /स\s*मे\s*कामान्/u,
  /कुबेराय\s*वैश्रवणाय/u,
  /साम्राज्यं\s*भौज्यं/u,
  /श्रीर्वर्चस्वमायुष्यम्/u,
  /सफलाः\s*सन्तु\s*पूर्णाः/u,
  /मनो\s*जूतिर्जुषताम्/u,
  /तत्त्वा\s*यामि\s*ब्रह्मणा/u,
  /तत्वा\s*यामि/u,
  /अस्यै\s*प्राणाः\s*प्रतिष्ठन्तु/u,
  /रसस्तं\s*वो\s*गृह्णामि/u,
  /समन्तपर्यायी\s*स्यात्/u,
  /अनुष्वधमा\s*वह/u,
  /सरस्वती\s*तु\s*पञ्चधा/u,
  /अम्बे\s*अम्बिके/u,
  /स्योना\s*पृथिवि|श्योना\s*पृथिवि/u,
  /काण्डात्काण्डात्/u,
  /याः\s*फलिनीर्या/u,
  /अपाꣳ\s*रस/u,
  /ये\s*तीर्थानि\s*प्रचरन्ति/u,
  /तेषाꣳ\s*सहस्र/u,
];



// Pauranika & Classical Stotra markers
const PAURANIK_MARKERS: RegExp[] = [
  /सुमुखश्चैकदन्तश्च/u,
  /द्वादशैतानि\s*नामानि/u,
  /विद्यारम्भे\s*विवाहे/u,
  /शुक्लाम्बरधरं\s*देवं/u,
  /प्रसन्नवदनं\s*ध्यायेत्/u,
  /सर्वमङ्गलमाङ्गल्ये/u,
  /शान्ताकारं\s*भुजगशयनं/u,
  /कस्तूरीतिलकं\s*ललाटपटले/u,
  /करारविन्देन\s*पदारविन्दं/u,
  /ध्यायेत्/u,
  /उवाच[ः:]?/u,
  /यः\s*पठेच्छृणुयादपि/u,
  /विघ्नस्तस्य\s*न\s*जायते/u,
];

// Karmakanda liturgical Hindi action verbs
const VIDHI_ACTION_VERBS: RegExp[] = [
  /करें[\s।॥\)]*$/u,
  /रखें[\s।॥\)]*$/u,
  /रख\s*दें[\s।॥\)]*$/u,
  /छोड़ें[\s।॥\)]*$/u,
  /लगावें[\s।॥\)]*$/u,
  /लगायें[\s।॥\)]*$/u,
  /लगाएँ[\s।॥\)]*$/u,
  /चढ़ावें[\s।॥\)]*$/u,
  /चढ़ाएँ[\s।॥\)]*$/u,
  /छिड़कें[\s।॥\)]*$/u,
  /फेंकें[\s।॥\)]*$/u,
  /घुमाएँ[\s।॥\)]*$/u,
  /दिखाएँ[\s।॥\)]*$/u,
  /दिखावें[\s।॥\)]*$/u,
  /पहनें[\s।॥\)]*$/u,
  /पूजा\s*करें/u,
  /पूजन\s*करें/u,
  /अर्पण\s*करें/u,
  /आवाहन\s*करें/u,
  /हाथ\s*में\s*लेकर/u,
  /आचमन\s*करें/u,
  /तिलक\s*लगा/u,
  /चावल\s*भर\s*कर/u,
  /प्रणाम\s*करें/u,
  /स्पर्श\s*करें/u,
  /जल\s*(?:छोड़ें|डालें|छिड़कें)/u,
  /मुद्रा\s*से/u,
];

/**
 * Classifies an individual scripture line into its liturgical category
 */
export function classifyScriptureLine(rawLine: string): ScriptureBlockType {
  const line = rawLine.trim();
  if (!line) return 'REGULAR_TEXT';

  // 1. Sacred Section Headings: 【 ... 】
  if (line.startsWith('【') && line.endsWith('】')) {
    return 'SECTION_HEADING';
  }

  // 2. Sacred Invocations & Chapter Titles: ॥ श्री... ॥
  if (
    line.startsWith('॥') &&
    line.endsWith('॥') &&
    line.length < 75 &&
    !/^[॥\s]*[०-९\d\-]+[॥\s]*$/u.test(line)
  ) {
    return 'INVOCATION_HEADING';
  }

  // 3. Stage directions: * नारद उवाच *
  if (/^\*\s*[^\*]+\s*\*$/u.test(line)) {
    return 'RITUAL_STEP_HEADER';
  }

  // 4. Ritual Step Headers: • पवित्रीकरणम्: or • आचम्य (आचमन करें):
  if (/^[•▪]\s*[^:—–]+[:—–]/u.test(line)) {
    return 'RITUAL_STEP_HEADER';
  }

  // 5. Sankalpa (Living Cosmic GPS)
  if (
    line.startsWith('ॐ विष्णुर्विष्णुर्विष्णुः') ||
    /पूजनमहं\s*करिष्ये/u.test(line) ||
    /कृतस्य\s*गणेशपूजनकर्मणः/u.test(line)
  ) {
    return 'SANKALPA';
  }

  // 6. Parenthetical Karmakanda Vidhi Directives: (हाथ धो लें): or (पीली सरसों लेकर...)
  if (
    /^\([^\)]+\)[:]?$/u.test(line) ||
    (/^\([^\)]+\)/u.test(line) &&
      (line.includes('करें') ||
        line.includes('रखें') ||
        line.includes('लगायें') ||
        line.includes('मुद्रा') ||
        line.includes('जल')))
  ) {
    return 'VIDHI_INSTRUCTION';
  }

  // 7. Karmakanda Vidhi Instructions by action verbs
  if (VIDHI_ACTION_VERBS.some(v => v.test(line))) {
    return 'VIDHI_INSTRUCTION';
  }

  // 8. Devata Namavali & List Items:
  if (/^[०-९0-9]+\.\s*ॐ?.+[।॥]?$/u.test(line) && line.length < 80) {
    return 'NAMAVALI';
  }

  // 9. Upachara Samarpana Mantras (Liturgical offerings):
  if (
    /(?:समर्पयामि|प्रतिगृह्यताम्|आवाहयामि\s*स्थापयामि|पूजयामि\s*मम\s*पूजां|दर्शयामि|निवेदयामि|अर्घ्यं\s*समर्पयामि|पाद्यं\s*समर्पयामि|पुष्पं\s*समर्पयामि|चन्दनं\s*समर्पयामि|स्वाहाकृतं|स्वाहा\s*[।॥])/u.test(
      line
    )
  ) {
    return 'SAMARPANA_MANTRA';
  }

  // 10. Vedic Mantras (Explicit Svara accents, Gomukha nasal ꣳ, or canonical incipits)
  // Check for Vedic Svara Unicode range: \u0951 (Svarita), \u0952 (Anudatta), \u1CDA (Dirgha Svarita), \uA8E0-\uA8F1 (Vedic tones), ꣳ (Gomukha)
  const hasVedicAccents = /[\u0951\u0952\u1CDA\uA8E0-\uA8F1\u0933\u0934ꣳ]/u.test(line);
  const isVedicIncipit = VEDIC_INCIPITS.some(re => re.test(line));

  if (hasVedicAccents || isVedicIncipit) {
    return 'VEDIC_MANTRA';
  }

  // 11. Pauranika Shloka, Classical Stotra, Aartis & Stutis
  if (
    PAURANIK_MARKERS.some(re => re.test(line)) ||
    /[।॥]/.test(line) ||
    /^[•▪\*]\s*/.test(line) ||
    line.startsWith('जय देव') ||
    line.startsWith('जय गणेश') ||
    line.length > 10
  ) {
    return 'PAURANIK_SHLOKA';
  }

  // Default
  return 'REGULAR_TEXT';
}

/**
 * Returns style configurations tailored for each liturgical block type
 */
export function getScriptureBlockConfig(type: ScriptureBlockType): ScriptureBlockConfig {
  switch (type) {
    case 'VEDIC_MANTRA':
      return {
        type,
        fontFamily: '"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-[2.2] tracking-wide',
        badgeLabel: 'वैदिक सस्वर मन्त्र',
        badgeIcon: '🕉️',
        containerClass:
          'relative my-3.5 px-4 py-3 rounded-2xl bg-[#8C2D19]/[0.06] border-l-4 border-sacred-600 shadow-sm transition-all hover:bg-[#8C2D19]/[0.09]',
        textClass:
          'font-tiro text-center font-medium select-text font-feature-settings-vedic text-[#261208]',
      };

    case 'PAURANIK_SHLOKA':
      return {
        type,
        fontFamily: '"Noto Serif Devanagari", "Yatra One", serif',
        lineHeightClass: 'leading-[1.8] tracking-normal',
        badgeLabel: 'पौराणिक स्तोत्र / ध्यान',
        badgeIcon: '📿',
        containerClass:
          'my-3 px-4 py-2.5 rounded-xl bg-black/[0.03] border border-amber-900/10',
        textClass:
          'font-notoSerif text-center select-text text-[#7A1505] font-bold',
      };

    case 'NAMAVALI':
      return {
        type,
        fontFamily: '"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-[1.6]',
        badgeLabel: 'देवता नमस्कार',
        badgeIcon: '🙏',
        containerClass:
          'px-3 py-1.5 rounded-xl bg-amber-500/[0.08] border border-amber-600/20 flex items-center shadow-xs transition-transform hover:scale-[1.01]',
        textClass:
          'font-tiro text-xs sm:text-sm font-semibold text-[#7A1505] w-full text-left',
      };

    case 'VIDHI_INSTRUCTION':
      return {
        type,
        fontFamily: '"Noto Sans Devanagari", "Yantramanav", sans-serif',
        lineHeightClass: 'leading-[1.6]',
        badgeLabel: 'विधि निर्देश',
        badgeIcon: '📜',
        containerClass:
          'my-2 px-3.5 py-1.5 rounded-lg bg-neutral-500/[0.05] border-l-2 border-neutral-400/40 text-left',
        textClass:
          'font-devanagari text-xs sm:text-sm text-[#8C2D19] italic',
      };

    case 'RITUAL_STEP_HEADER':
      return {
        type,
        fontFamily: '"Rozha One", "Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-snug',
        badgeLabel: 'पूजा उपचार क्रम',
        badgeIcon: '🪔',
        containerClass:
          'my-3 px-4 py-2 rounded-2xl bg-amber-500/[0.08] border border-amber-600/25 shadow-2xs text-center select-none',
        textClass:
          'font-serifDevanagari font-bold text-sm sm:text-base text-[#8C2D19] tracking-wide',
      };

    case 'SAMARPANA_MANTRA':
      return {
        type,
        fontFamily: '"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-[2.0]',
        badgeLabel: 'उपचार समर्पण',
        badgeIcon: '🌸',
        containerClass:
          'my-2 px-3.5 py-2 rounded-xl bg-amber-500/[0.06] border border-amber-600/20 text-center shadow-2xs transition-all hover:bg-amber-500/[0.1]',
        textClass:
          'font-tiro font-semibold text-sm sm:text-base text-[#7A1505]',
      };

    case 'SANKALPA':
      return {
        type,
        fontFamily: '"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-[2.0]',
        badgeLabel: 'सङ्कल्प विधान',
        badgeIcon: '🧭',
        containerClass:
          'my-3.5 p-4 rounded-2xl bg-amber-500/[0.07] border border-amber-600/30 text-center shadow-xs',
        textClass:
          'font-tiro font-medium text-xs sm:text-sm text-[#261208]',
      };

    case 'SECTION_HEADING':
      return {
        type,
        fontFamily: '"Rozha One", "Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-tight',
        containerClass: 'my-4 text-center select-none',
        textClass: 'font-serifDevanagari font-bold text-xs sm:text-sm text-[#8C2D19]',
      };

    case 'INVOCATION_HEADING':
      return {
        type,
        fontFamily: '"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-tight',
        containerClass: 'my-3 text-center select-none',
        textClass: 'font-tiro font-bold text-sm sm:text-base text-[#7A1505] tracking-wider',
      };

    case 'REGULAR_TEXT':
    default:
      return {
        type,
        fontFamily: '"Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-[1.7]',
        containerClass: 'my-1 text-center',
        textClass: 'font-notoSerif text-[#1C120C]',
      };
  }
}

export type GroupedScriptureUnit =
  | { kind: 'single'; line: string; type: ScriptureBlockType }
  | { kind: 'namavali_grid'; items: string[] };

/**
 * Groups consecutive Namavali lines into cohesive grid units
 * while leaving other verses as standalone blocks.
 */
export function groupScriptureFolio(rawText: string): GroupedScriptureUnit[] {
  const lines = rawText.split('\n');
  const units: GroupedScriptureUnit[] = [];
  let pendingNamavali: string[] = [];

  let isVedicSection = false;
  let inVedicCouplet = false;

  const flushNamavali = () => {
    if (pendingNamavali.length > 0) {
      units.push({ kind: 'namavali_grid', items: [...pendingNamavali] });
      pendingNamavali = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let type = classifyScriptureLine(trimmed);

    // Track header boundaries and set Vedic context accordingly
    if (
      type === 'SECTION_HEADING' ||
      type === 'RITUAL_STEP_HEADER' ||
      type === 'INVOCATION_HEADING'
    ) {
      if (
        trimmed.includes('स्वस्ति वाचन') ||
        trimmed.includes('स्वस्तिवाचन') ||
        trimmed.includes('शान्ति पाठ') ||
        trimmed.includes('शान्तिपाठ') ||
        trimmed.includes('गणपत्यथर्वशीर्ष') ||
        trimmed.includes('मन्त्रपुष्पाञ्जलि')
      ) {
        isVedicSection = true;
      } else {
        isVedicSection = false;
      }
      inVedicCouplet = false;
    }

    // Apply Vedic section inheritance to verses inside a Vedic hymn/section
    if (isVedicSection) {
      if (
        type !== 'SECTION_HEADING' &&
        type !== 'RITUAL_STEP_HEADER' &&
        type !== 'INVOCATION_HEADING' &&
        type !== 'VIDHI_INSTRUCTION' &&
        type !== 'NAMAVALI'
      ) {
        type = 'VEDIC_MANTRA';
      }
    }


    // Apply Vedic Couplet continuity (Rigvedic/Yajurvedic couplet where line 1 is Vedic and line 2 completes it)
    if (type === 'VEDIC_MANTRA') {
      // If line ends with double danda ॥, couplet ends here
      if (/[॥]\s*(?:[०-९\d\-]+[॥\s]*)?$/u.test(trimmed)) {
        inVedicCouplet = false;
      } else {
        inVedicCouplet = true;
      }
    } else if (inVedicCouplet) {
      if (
        type !== 'SECTION_HEADING' &&
        type !== 'RITUAL_STEP_HEADER' &&
        type !== 'INVOCATION_HEADING' &&
        type !== 'VIDHI_INSTRUCTION' &&
        type !== 'NAMAVALI'
      ) {
        type = 'VEDIC_MANTRA';
        if (/[॥]\s*(?:[०-९\d\-]+[॥\s]*)?$/u.test(trimmed)) {
          inVedicCouplet = false;
        }
      } else {
        inVedicCouplet = false;
      }
    }

    if (type === 'NAMAVALI') {
      pendingNamavali.push(trimmed);
    } else {
      flushNamavali();
      units.push({ kind: 'single', line: trimmed, type });
    }
  }

  flushNamavali();
  return units;
}


// ---------------------------------------------------------------------------
// Comprehensive Sanskrit vs Hindi Liturgical Engine (Gita & Commentary Folios)
// ---------------------------------------------------------------------------

export interface GitaFolioBlock {
  type: 'HEADING' | 'SPEAKER' | 'SHLOKA' | 'ANUVAD';
  text?: string;
  speaker?: string;
  lines: string[];
}

// 100% Unambiguous Hindi Vocabulary (NEVER occurring in classical Sanskrit poetry)
export const EXCLUSIVE_HINDI_VOCABULARY = new Set([
  // Auxiliary & finite verbs (Sanskrit uses inflections like अस्ति, भवति, आसीत्)
  'है', 'हैं', 'हूँ', 'हो', 'था', 'थी', 'थे',
  'होगा', 'होगी', 'होंगे', 'हुए', 'हुआ', 'हुई', 'होने',
  'सकता', 'सकती', 'सकते', 'सके', 'सकें', 'सकूँगा', 'सकेंगे',
  'चाहिए', 'चाहिये',
  'किया', 'किये', 'किए', 'करे', 'करें', 'करो', 'करेंगे', 'करेगा', 'करेगी', 'करती', 'करता', 'करते', 'करना', 'करूँ', 'करूँगा',
  'कहा', 'कहे', 'कहता', 'कहती', 'कहते', 'कहना',
  'बोला', 'बोले', 'बोली', 'बोलता', 'बोलते', 'बोलना',
  'दिया', 'दिये', 'दिए', 'देगा', 'देगी', 'देंगे', 'देता', 'देती', 'देते', 'देना', 'दूँ', 'दूँगा',
  'लिया', 'लिये', 'लिए', 'लेगा', 'लेगी', 'लेंगे', 'लेता', 'लेती', 'लेते', 'लेना',
  'गया', 'गये', 'गए', 'गयी', 'गई', 'जाना', 'जाएगा', 'जाएगी', 'जाएंगे', 'जाओ', 'जायें',
  'रहा', 'रही', 'रहे', 'रहता', 'रहती', 'रहते', 'रहना',
  'आया', 'आये', 'आए', 'आई', 'आता', 'आती', 'आते', 'आना',
  'देखा', 'देखे', 'देखी', 'देखता', 'देखते', 'देखना', 'देखूँ', 'देखूँगा',
  'सुना', 'सुने', 'सुनी', 'सुनता', 'सुनते', 'सुनना',
  'बजाया', 'बजाये', 'बजाए', 'बजाते', 'बजाना',
  'जाकर', 'आकर', 'देखकर', 'सुनकर', 'मारकर', 'खाकर', 'पीकर', 'रहकर', 'होकर', 'करके', 'उठाकर', 'बाँधकर', 'त्यागकर',
  'भोगूँगा', 'लड़ूँगा', 'समझता', 'जानता', 'जानते', 'मानता', 'मानते', 'कहलाता', 'डटे', 'खड़ा', 'खड़े', 'खड़ी',
  // Hindi Pronouns (Sanskrit pronouns: अहम्, माम्, मया, त्वम्, सः, अयम्, इदम्)
  'मैं', 'मुझे', 'मुझको', 'मुझसे', 'मुझमें', 'मेरा', 'मेरी', 'मेरे',
  'हम', 'हमें', 'हमको', 'हमसे', 'हममें', 'हमारा', 'हमारी', 'हमारे',
  'तू', 'तुझे', 'तुझको', 'तुझसे', 'तेरा', 'तेरी', 'तेरे',
  'तुम', 'तुम्हें', 'तुमको', 'तुमसे', 'तुम्हारा', 'तुम्हारी', 'तुम्हारे',
  'आप', 'आपको', 'आपसे', 'आपमें', 'आपका', 'आपकी', 'आपके', 'आपलोग', 'आपलोगों',
  'यह', 'इस', 'इसे', 'इसको', 'इससे', 'इसमें', 'इसका', 'इसकी', 'इसके', 'इसलिये', 'इसलिए',
  'वह', 'उस', 'उसे', 'उसको', 'उससे', 'उसमें', 'उसका', 'उसकी', 'उसके',
  'इन', 'इन्हें', 'इनको', 'इनसे', 'इनमें', 'इनका', 'इनकी', 'इनके',
  'उन', 'उन्हें', 'उनको', 'उनसे', 'उनमें', 'उनका', 'उनकी', 'उनके',
  'जिस', 'जिसे', 'जिसको', 'जिससे', 'जिसमें', 'जिसका', 'जिसकी', 'जिसके',
  'जिन्हें', 'जिनको', 'जिनसे', 'जिनमें', 'जिनका', 'जिनकी', 'जिनके',
  'किस', 'किसे', 'किसको', 'किससे', 'किसका', 'किसकी', 'किसके', 'किन्हें', 'किनका',
  'क्या', 'क्यों', 'कहाँ', 'कब', 'कैसे', 'कैसा', 'कैसी',
  'यहाँ', 'वहाँ', 'जहाँ', 'तहाँ', 'इधर', 'उधर',
  'जो', 'सो', 'कोई', 'कुछ', 'सबके', 'सबको', 'सबका', 'सबकी', 'सबमें', 'सबसे',
  // Exclusively Hindi Postpositions & Connectives (standalone 'को' is excluded as it is the Sanskrit interrogative pronoun 'कः' in Visarga Sandhi e.g. 'को धर्मः')
  'में', 'ने', 'से', 'पर', 'लिये', 'लिए', 'तक', 'द्वारा',
  'और', 'भी', 'ही', 'तो', 'कि', 'क्योंकि', 'नहीं', 'नही',
  'समान', 'तरह', 'जैसा', 'जैसे', 'जैसी', 'वैसा', 'वैसे', 'वैसी',
  'बड़ा', 'बड़े', 'बड़ी', 'बहुत', 'ओर', 'तरफ'
]);

// 1. Oblique Plural Postpositions (100% exclusively Hindi: पुत्रोंने, कौरवोंमें, मनुष्योंमें, धनुषोंवाले, बाणोंसे, राजाओंका)
const HINDI_OBLIQUE_PLURAL_REGEX = /[\u0900-\u097F]+(?:ोंमें|ोंने|ोंको|ोंके|ोंकी|ोंपर|ोंसे|ोंका|ोंवाले|ोंवाली)/u;

// 2. Attached locative 'में' (with bindu: बीचमें, हृदयमें, लोकमें, रणभूमिमें, सेनामें, मुकाबलेमें)
const HINDI_ATTACHED_MEIN_REGEX = /[\u0900-\u097F]+में$/u;

// 3. Ergative 'ने' attached to agent names in traditional Hindi translations (महाराजने, अर्जुनने, भीष्मने, श्रीकृष्णने, युधिष्ठिरने)
const HINDI_ATTACHED_NE_REGEX = /(?:अर्जुन|भीष्म|श्रीकृष्ण|कृष्ण|महाराज|भगवान्?|संजय|सञ्जय|धृतराष्ट्र|युधिष्ठिर|भीमसेन|भीम|द्रोण|नकुल|सहदेव|राजा|पितामह)ने$/u;

// 4. Attached possessive/qualifier '-वाला / -वाले / -पूर्वक' (धनुषोंवाले, इच्छावाले, करनेवाले, प्रेमपूर्वक, अन्तःकरणवाला)
const HINDI_ATTACHED_VALE_REGEX = /[\u0900-\u097F]+(?:वाला|वाले|वाली|वालों|वालेको|वालीको|वालोंको|पूर्वक)$/u;

// Sanskrit morphological signatures (vibhaktis and verbal conjugations)
const SANSKRIT_SIGNATURE_REGEX = /(?:[\u0900-\u097F]+(?:स्य|योः|नाम्|णाम्|ेषु|ुषु|ाय|ेभ्यः|ात्|ेन|भिः|ैः|त्वम्|ताम्|तुम्|त्वा|य|न्ति|न्ते|थः|ब्रवीमि|पृच्छामि|विद्मः|जयेम|जयेयुः|अर्हसि|भाषसे|मन्यसे|शक्यसे|पण्डिताः|धार्तराष्ट्राः)[\s.,!?—–।॥\-]|(?:^|[\s])(?:चैव|चापि|तथैव|यथैव|अहम्|त्वम्|सञ्जय|उवाच|हृषीकेश|परन्तप|माधव|कौन्तेय|भारत|विभो|तात|प्रभो|भो|एवम्|तथापि|अथ|ततः|यतः|तत्र|यत्र|कदाचित्|कश्चित्|मामेव|तमेव|विदुः|चेतसः|हि|तु|च|वा|एव|अपि)[\s.,!?—–।॥\-])/u;

// Comprehensive Hindi Auxiliary & Finite Verbs
const HINDI_VERB_REGEX = /(?:^|[\s.,!?—–:;।॥\-()])(?:है|हैं|था|थी|थे|हो|हूँ|होगा|होगी|होंगे|होता|होती|होते|हुआ|हुए|हुई|गया|गये|गए|गयी|गई|जाना|जाएगा|जाएगी|जाएंगे|जाता\s*(?:है|था|हो|हुआ|हुए)|जाती\s*(?:है|थी|हो|हुई)|जाते\s*(?:हैं|थे|हो|हुए)|करना|करते|करता|करती|करने|करके|करनेसे|करूँगा|करेंगे|करेगा|करेगी|कहा|कहे|कहते|कहता|कहना|बोले|बोला|बोली|बोलते|दिये|दिए|दिया|देता|देते|देना|डाल|मार|चाहिये|चाहिए|सकते|सकता|सकती|सकेंगे|पाता|पाते|रहता|रहते|रहती|बरतते|जानता|जानते|मानता|मानते|त्यागकर|रखकर|रोककर|लेकर|होकर|देखकर|सुनकर|कहकर|होइये|देखूँगा|लगावे)[\s.,!?—–:;।॥\-()]/u;

// Comprehensive Hindi Pronouns, Connectives & Adverbs (Note: 'ये' is intentionally excluded as it is the Sanskrit relative pronoun plural masc. 'यः यौ ये')
const HINDI_PRONOUNS_ADVERBS_REGEX = /(?:^|[\s.,!?—–:;।॥\-()])(?:यह|वह|इस|उस|इन|उन|हम|आप|तू|मुझ|तुझ|मुझे|तुझे|मुझको|तुझको|वे|हमारे|तुम्हारे|जिसको|जिससे|जिसमें|जिसका|जिसकी|जिसके|जिनको|जिनसे|जिनमें|जिनका|जिनकी|जिनके|किसको|किससे|किसमें|किसका|किसकी|किसके|यहाँ|वहाँ|जहाँ|तहाँ|इधर|उधर|और|भी|ही|तो|कि|क्योंकि|नहीं|नही|इसलिये|इसलिए|जैसे|वैसे|तैसे|अर्थात्|यानी|टिप्पणी|दोनों|तीनों|चारों|सब|सम्पूर्ण|सारे|सारा|केवल|पहले|दूसरे|तीसरे|भलीभाँति|प्रकट)[\s.,!?—–:;।॥\-()]/u;

export function isHindiScriptureLine(trimmed: string): boolean {
  if (!trimmed) return false;

  // 1. Commas in traditional scripture editions are strictly in vernacular prose translations, NEVER in classical Sanskrit shlokas
  if (trimmed.includes(',')) {
    return true;
  }

  // 2. Footnotes, numbered lists, citations, isolated numbers or symbols
  if (
    /^[०-९\d\s\-–—\.\*†‡()]+$/u.test(trimmed) ||
    /^[०-९\d]+[\.\-]\s/u.test(trimmed) ||
    /^[०-९\d]+[\-\s]+[०-९\d]*\s*(?:अध्याय|श्लोक|टिप्पणी|देख|अर्थात्)/u.test(trimmed) ||
    trimmed.includes('टिप्पणी') ||
    trimmed.includes('अर्थात्')
  ) {
    return true;
  }

  // 3. Contains quotation marks (theological commentary definitions like "निष्ठा", "ज्ञानयोग")
  if (/["“”]/.test(trimmed)) {
    return true;
  }

  // 4. Question mark
  if (/[?？]/.test(trimmed)) {
    return true;
  }

  // 5. Starts with definite Hindi start phrases
  if (/^(?:इसके\s*(?:बाद|अनन्तर|पश्चात्)|संजय\s*बोले|अर्जुन\s*बोले|श्रीभगवान्\s*बोले|धृतराष्ट्र\s*बोले|इसलिये|इसलिए|और\s*भी|आप-)/u.test(trimmed)) {
    return true;
  }

  // 6. Explicit Hindi verbs or pronouns
  if (HINDI_VERB_REGEX.test(trimmed) || HINDI_PRONOUNS_ADVERBS_REGEX.test(trimmed)) {
    return true;
  }

  // 7. Word-level attached Hindi postpositions (oblique plurals in -ों, attached 'में', attached 'ने', attached '-वाले')
  const words = trimmed.split(/[\s.,!?—–:;।॥\-()]+/).filter(Boolean);
  for (const w of words) {
    if (EXCLUSIVE_HINDI_VOCABULARY.has(w)) {
      return true;
    }
    if (HINDI_OBLIQUE_PLURAL_REGEX.test(w)) {
      return true;
    }
    if (HINDI_ATTACHED_MEIN_REGEX.test(w)) {
      return true;
    }
    if (HINDI_ATTACHED_NE_REGEX.test(w)) {
      return true;
    }
    if (HINDI_ATTACHED_VALE_REGEX.test(w)) {
      return true;
    }
    // Attached Hindi -की (प्रकारकी, भगवान्की, भक्तिकी - NEVER occurring as a Sanskrit declension)
    if (/[\u0900-\u097F]{2,}की$/u.test(w)) {
      return true;
    }
    // Attached Hindi -को (शत्रुको, मनुष्यको, क्षेमको - excluding Sanskrit एको/लोको/कोऽ)
    if (/[\u0900-\u097F]{2,}को$/u.test(w) && !/^(?:एको|लोको|कोऽ)/u.test(w)) {
      return true;
    }
    // Attached Hindi -के (excluding Sanskrit locative a-stems: सञ्ज्ञके, लोके, नरके, पुस्तके, मस्तके, कुरुके, एकके, वृके, बालके)
    if (/[\u0900-\u097F]{2,}के$/u.test(w) && !/(?:लोके|नरके|सञ्ज्ञके|पुस्तके|मस्तके|कुरुके|एकके|वृके|बालके|न्तिके|त्रिके|एके)$/u.test(w)) {
      return true;
    }
    // Attached Hindi -से (excluding Sanskrit Atmanepada verbs: भाषसे, मन्यसे, लभसे, अर्हसे, शक्यसे, कुरुषे, रोचसे, वर्तसे, पश्यसे, जायसे)
    if (/[\u0900-\u097F]{2,}से$/u.test(w) && !/(?:भाषसे|मन्यसे|लभसे|अर्हसे|शक्यसे|कुरुषे|रोचसे|वर्तसे|पश्यसे|जायसे)$/u.test(w)) {
      return true;
    }
  }

  return false;
}

/**
 * Classifies an individual line within a Gita folio
 */
/**
 * Classifies an individual line within a Gita / Vishnu Sahasranama / bilingual folio
 */
export function classifyGitaScriptureLine(line: string): 'HEADER' | 'SPEAKER' | 'HEADING' | 'HINDI' | 'SANSKRIT' {
  const trimmed = line.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if (!trimmed) return 'HEADER';

  // 0. Standalone Dandās, OCR punctuation remnants, or solitary punctuation noise
  if (/^[।॥\s]+$/.test(trimmed) || /^विन[\s.]*लि$/u.test(trimmed)) {
    return 'HEADER';
  }

  // 1. Running headers & folio numbers (Gita, Vishnu Sahasranama, etc.)
  if (
    /(?:श्रीमद्भगवद्गीता|(?:श्री|भ्री)?\s*विष्णु.*नाम|सह[स्श].*नाम)/u.test(trimmed) &&
    trimmed.length < 60 &&
    !/^[॥\s]*(?:अथ\s+|इति\s+|ॐ\s*तत्सदिति)/u.test(trimmed)
  ) {
    return 'HEADER';
  }

  if (
    /^अध्याय\s*[०-९\d]+$/u.test(trimmed) ||
    /^[\\/\s_—\-]+$/.test(trimmed) ||
    /^[०-९\d\s\._—\-~*]*म[ययो०\.\s]+$/u.test(trimmed)
  ) {
    return 'HEADER';
  }

  // 2. Speaker tags (सञ्जय उवाच, अर्जुन उवाच, श्रीभगवानुवाच, भीष्म उवाच, युधिष्ठिर उवाच, वैशम्पायन उवाच)
  if (
    /(?:[उु]वाच|ऊचु[ः:]?)[॥ः:\s]*$/u.test(trimmed) ||
    /^[॥\s]*(?:धृतराष्ट्र|सञ्जय|संजय|अर्जुन|श्रीभगवान्?|भगवान्?|भीष्म|युधिष्ठिर|वैशम्पायन)\s*[उु]?वाच[॥ः:\s]*$/u.test(trimmed)
  ) {
    return 'SPEAKER';
  }

  // 2.5 Standalone Verse Number (e.g. ॥ १३ ॥) belongs to translation or shloka
  if (/^[॥\s]*[०-९\d\s\-]+[॥\s]*$/u.test(trimmed)) {
    return 'HINDI';
  }

  // 3. Sacred Invocations, Section Titles & Colophons
  if (
    trimmed === 'ॐ' ||
    /^[॥\s]*(?:ॐ\s*)?(?:श्रीपरमात्मने\s*नमः|अथ\s*[^\n]+|इति\s*[^\n]+|ॐ\s*तत्सदिति)[॥\s]*/u.test(trimmed) ||
    /^(?:योगशास्त्रे|नाम\s*[^\n]+ऽध्यायः)/u.test(trimmed) ||
    (trimmed.startsWith('॥') && trimmed.endsWith('॥') && trimmed.length < 65 && trimmed.length > 2 && !/[०-९\d]/.test(trimmed))
  ) {
    return 'HEADING';
  }

  // 4. Definite Hindi translation or commentary line
  if (isHindiScriptureLine(trimmed)) {
    return 'HINDI';
  }

  // 5. Sanskrit morphological signatures or metrical caesura (। / ॥ / trailing hyphen / candidate)
  if (trimmed.endsWith('-') || /[।॥]/.test(trimmed) || isGenuineSanskritShlokaCandidate(trimmed)) {
    return 'SANSKRIT';
  }

  // 6. Default to HINDI for unmarked commentary lines
  return 'HINDI';
}

export function isGenuineSanskritShlokaCandidate(line: string): boolean {
  const trimmed = line.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if (!trimmed) return false;
  if (/^[।॥\s]+$/.test(trimmed)) return false;
  if (isHindiScriptureLine(trimmed)) return false;
  if (trimmed.endsWith('-') || /[।॥]/.test(trimmed) || /ः$/.test(trimmed)) return true;
  const devCount = (trimmed.match(/[\u0900-\u097F]/g) || []).length;
  if (devCount >= 14) return true;
  return false;
}

/**
 * Parses and groups a full Srimad Bhagavad Gita / Vishnu Sahasranama folio into structured liturgical blocks:
 * Headings, Speakers, multi-line Sanskrit Shlokas (Anustubh & Tristup), and Hindi Anuvad.
 * Uses robust state-machine tracking to guarantee that Hindi translation paragraphs
 * and footnotes are never split into fake shlokas.
 */
export function parseGitaFolio(cleanedText: string): GitaFolioBlock[] {
  const rawLines = cleanedText
    .split('\n')
    .map(l => l.replace(/[\u200B-\u200D\uFEFF]/g, '').trim())
    .filter(l => Boolean(l) && !/^[।॥\s]+$/.test(l));

  const blocks: GitaFolioBlock[] = [];
  let currentShloka: string[] = [];
  let currentAnuvad: string[] = [];
  let state: 'NEUTRAL' | 'IN_SHLOKA' | 'IN_ANUVAD' = 'NEUTRAL';
  let anuvadCompletedVerse = false;

  const flushShloka = () => {
    if (currentShloka.length > 0) {
      blocks.push({ type: 'SHLOKA', lines: [...currentShloka] });
      currentShloka = [];
    }
  };

  const flushAnuvad = () => {
    if (currentAnuvad.length > 0) {
      blocks.push({ type: 'ANUVAD', lines: [...currentAnuvad] });
      currentAnuvad = [];
    }
    anuvadCompletedVerse = false;
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const kind = classifyGitaScriptureLine(line);

    if (kind === 'HEADER') continue;

    if (kind === 'SPEAKER') {
      flushShloka();
      flushAnuvad();
      blocks.push({
        type: 'SPEAKER',
        speaker: line.replace(/[॥ः:\s]+/g, ' ').trim(),
        lines: [line],
      });
      state = 'NEUTRAL';
      continue;
    }

    if (kind === 'HEADING') {
      flushShloka();
      flushAnuvad();
      blocks.push({ type: 'HEADING', text: line, lines: [line] });
      state = 'NEUTRAL';
      continue;
    }

    if (state === 'IN_SHLOKA') {
      if (!isHindiScriptureLine(line)) {
        currentShloka.push(line);
        if (/॥\s*[०-९\d\-]*\s*॥/.test(line) || line.endsWith('॥')) {
          flushShloka();
          state = 'IN_ANUVAD';
          anuvadCompletedVerse = false;
        }
      } else {
        flushShloka();
        currentAnuvad.push(line);
        state = 'IN_ANUVAD';
        if (/॥\s*[०-९\d\-]+\s*॥/.test(line)) {
          anuvadCompletedVerse = true;
        }
      }
    } else if (state === 'IN_ANUVAD') {
      const isCandidate = isGenuineSanskritShlokaCandidate(line);
      const isHindi = isHindiScriptureLine(line);

      // Kulaka handling: If no translation lines have accumulated yet in currentAnuvad
      // and this line is genuine Sanskrit, it is a consecutive shloka in a Kulaka (e.g. verses 10, 11, 12)
      if (currentAnuvad.length === 0 && isCandidate && !isHindi) {
        currentShloka.push(line);
        state = 'IN_SHLOKA';
        if (/॥\s*[०-९\d\-]*\s*॥/.test(line) || line.endsWith('॥')) {
          flushShloka();
          state = 'IN_ANUVAD';
          anuvadCompletedVerse = false;
        }
        continue;
      }

      // While in Hindi translation, a genuine Sanskrit candidate line starts a new Shloka if:
      // 1) The previous verse completed with a verse number (anuvadCompletedVerse === true), OR
      // 2) The previous translation line completed a sentence with punctuation (। / ॥ / . / ! / —)
      const lastAnuvadLine = currentAnuvad.length > 0 ? currentAnuvad[currentAnuvad.length - 1] : '';
      const prevAnuvadEndedSentence = /[।॥.!?—–\s]$/.test(lastAnuvadLine);

      if ((anuvadCompletedVerse && isCandidate) || (prevAnuvadEndedSentence && isCandidate && !isHindi)) {
        flushAnuvad();
        currentShloka.push(line);
        state = 'IN_SHLOKA';
        if (/॥\s*[०-९\d\-]*\s*॥/.test(line) || line.endsWith('॥')) {
          flushShloka();
          state = 'IN_ANUVAD';
          anuvadCompletedVerse = false;
        }
      } else {
        currentAnuvad.push(line);
        if (/॥\s*[०-९\d\-]+\s*॥/.test(line)) {
          anuvadCompletedVerse = true;
        }
      }
    } else {
      // NEUTRAL state (beginning of page or after heading/speaker)
      if (isGenuineSanskritShlokaCandidate(line)) {
        currentShloka.push(line);
        state = 'IN_SHLOKA';
        if (/॥\s*[०-९\d\-]*\s*॥/.test(line) || line.endsWith('॥')) {
          flushShloka();
          state = 'IN_ANUVAD';
          anuvadCompletedVerse = false;
        }
      } else {
        currentAnuvad.push(line);
        state = 'IN_ANUVAD';
        if (/॥\s*[०-९\d\-]+\s*॥/.test(line)) {
          anuvadCompletedVerse = true;
        }
      }
    }
  }

  flushShloka();
  flushAnuvad();

  // Synchronize and canonicalize verse numbers for Sanskrit Shloka blocks
  let lastKnownVerseNumber = 0;
  for (let i = 0; i < blocks.length; i++) {
    const curBlock = blocks[i];
    if (curBlock.type === 'SHLOKA') {
      const lastLineIdx = curBlock.lines.length - 1;
      const lastLine = curBlock.lines[lastLineIdx];

      // 1. If lastLine already has verse number at the end (e.g. "। ४ ।", "॥ ४ ॥", "। ४ ॥", "॥ ४")
      const existingNumMatch = lastLine.match(/[।॥]\s*([०-९\d\-]+)\s*[।॥]?\s*$/);
      if (existingNumMatch) {
        const rawNum = existingNumMatch[1];
        const devNum = rawNum.replace(/\d/g, (d: string) => ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'][parseInt(d, 10)]);
        curBlock.lines[lastLineIdx] = lastLine.replace(/[।॥]\s*[०-९\d\-]+\s*[।॥]?\s*$/, `॥ ${devNum} ॥`);
        const parsed = parseInt(devNum.replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d).toString()), 10);
        if (!isNaN(parsed) && parsed > 0) {
          lastKnownVerseNumber = parsed;
        }
      } else {
        // 2. Look for verse number in the following translation block
        const nextBlock = i + 1 < blocks.length ? blocks[i + 1] : null;
        let synced = false;
        if (nextBlock && nextBlock.type === 'ANUVAD') {
          const nextAnuvad = nextBlock.lines.join(' ');
          const match = nextAnuvad.match(/॥\s*([०-९\d\-]+(?:\s*और\s*[०-९\d\-]+)?)\s*॥/);
          if (match) {
            const rawNum = match[1].replace(/वेंका[^\n]*/g, '').trim();
            const devNum = rawNum.replace(/\d/g, (d: string) => ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'][parseInt(d, 10)]);
            curBlock.lines[lastLineIdx] = lastLine.replace(/[।॥\s]+$/, '').trim() + ` ॥ ${devNum} ॥`;
            const parsed = parseInt(devNum.replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d).toString()), 10);
            if (!isNaN(parsed) && parsed > 0) lastKnownVerseNumber = parsed;
            synced = true;
          }
        }
        // If shloka finishes at page boundary without following anuvad on same page, infer sequential verse number
        // CRITICAL GUARD: Only complete shlokas that end with double danda ॥ (NOT half-verses ending with single danda ।)
        const totalDevanagari = curBlock.lines.join(' ').match(/[\u0900-\u097F]/g)?.length || 0;
        const endsWithDoubleDanda = /॥\s*$/.test(lastLine) || (lastLine.includes('॥') && !/।\s*$/.test(lastLine));
        if (!synced && lastKnownVerseNumber > 0 && curBlock.lines.length >= 2 && totalDevanagari >= 30 && endsWithDoubleDanda) {
          const nextNum = lastKnownVerseNumber + 1;
          const devNum = nextNum.toString().replace(/\d/g, (d: string) => ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'][parseInt(d, 10)]);
          curBlock.lines[lastLineIdx] = lastLine.replace(/[।॥\s]+$/, '').trim() + ` ॥ ${devNum} ॥`;
          lastKnownVerseNumber = nextNum;
        }
      }
    }
  }

  return blocks;
}

