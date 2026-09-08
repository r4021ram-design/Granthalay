/**
 * Scripture Typography & Liturgical Classification Engine
 * Implements the Vedic vs Pauranik Script Typography Standard
 */

export type ScriptureBlockType =
  | 'VEDIC_MANTRA'
  | 'PAURANIK_SHLOKA'
  | 'NAMAVALI'
  | 'VIDHI_INSTRUCTION'
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
  /स्वस्ति\s*न\s*इन्द्रो/u,
  /स्वस्ति\s*नः\s*पूषा/u,
  /स्वस्तिनस्तार्क्ष्यो/u,
  /स्वस्ति\s*नो\s*बृहस्पति/u,
  /भद्रं\s*कर्णेभिः/u,
  /भद्रं\s*पश्येमाक्षभि/u,
  /स्थिरैरङ्गै/u,
  /व्यशेम\s*देवहितं/u,
  /तन्मामवतु/u,
  /तद्वक्तारमवतु/u,
  /अवतु\s*माम्/u,
  /अवतु\s*वक्तारम्/u,
  /ॐ\s*शान्तिः\s*शान्तिः\s*शान्तिः/u,
  /द्यौः\s*शान्ति/u,
  /यतो\s*यतः\s*समीहसे/u,
  /तन्नो\s*वातो/u,
  /तमीशानं\s*जगतस्तस्थुषस्पतिं/u,
  /अग्निमीळे/u,
  /पृषदश्वा\s*मरुतः/u,
  /शतमिन्नु\s*शरदो/u,
  /अदितिर्द्यौ/u,
  /सहस्रशीर्षा\s*पुरुषः/u,
  /हिरण्यगर्भः\s*समवर्तताग्रे/u,
  /जातवेदसे\s*सुनवाम/u,
  /नमस्ते\s*रुद्र\s*मन्यव/u,
  /ईशा\s*वास्यमिदं/u,
  /हꣳसः\s*शुचिषद/u,
  /त्र्यम्बकं\s*यजामहे/u,
  /शं\s*नो\s*मित्रः/u,
  /मधु\s*वाता\s*ऋतायते/u,
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
const VIDHI_VERBS: RegExp[] = [
  /करें[।\s]?$/u,
  /रखें[।\s]?$/u,
  /छोड़ें[।\s]?$/u,
  /लगावें[।\s]?$/u,
  /अर्पण\s*करें/u,
  /आवाहन\s*करें/u,
  /हाथ\s*में\s*लेकर/u,
  /पूजन\s*करें/u,
  /आचमन\s*करें/u,
  /तिलक\s*लगायें/u,
  /चावल\s*भर\s*कर/u,
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

  // 2. Sacred Invocations: ॥ श्री... ॥
  if (line.startsWith('॥') && line.endsWith('॥') && line.length < 55) {
    return 'INVOCATION_HEADING';
  }

  // 3. Devata Namavali: 1. ॐ ... नमः । or १. ॐ ... नमः ।
  if (/^[०-९0-9]+\.\s*ॐ?.+नम[ः:]?\s*[।॥]?$/u.test(line)) {
    return 'NAMAVALI';
  }

  // 4. Karmakanda Vidhi Instructions (Hindi ritual directives)
  if (VIDHI_VERBS.some(v => v.test(line)) || (/^[•▪\*\-]\s*/.test(line) && (line.includes('करें') || line.includes('रखें') || line.includes('बनाकर')))) {
    return 'VIDHI_INSTRUCTION';
  }

  // 5. Vedic Mantra (Svara accents or Canonical Vedic Hymns)
  // Check for Vedic Svara Unicode range: \u0951 (Svarita), \u0952 (Anudatta), \u1CDA (Dirgha Svarita), \uA8E0-\uA8F1 (Vedic tones)
  const hasVedicAccents = /[\u0951\u0952\u1CDA\uA8E0-\uA8F1\u0933\u0934]/u.test(line);
  const isVedicIncipit = VEDIC_INCIPITS.some(re => re.test(line));

  if (hasVedicAccents || isVedicIncipit) {
    return 'VEDIC_MANTRA';
  }

  // 6. Pauranika Shloka & Classical Stotra
  if (PAURANIK_MARKERS.some(re => re.test(line)) || (line.includes('॥') && !hasVedicAccents && !isVedicIncipit)) {
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
          'relative my-3.5 px-4 py-3 rounded-2xl bg-[#8C2D19]/[0.06] dark:bg-amber-950/20 border-l-4 border-sacred-600 shadow-sm transition-all hover:bg-[#8C2D19]/[0.09]',
        textClass:
          'font-tiro text-center font-medium select-text font-feature-settings-vedic text-[#261208] dark:text-amber-100',
      };

    case 'PAURANIK_SHLOKA':
      return {
        type,
        fontFamily: '"Noto Serif Devanagari", "Yatra One", serif',
        lineHeightClass: 'leading-[1.8] tracking-normal',
        badgeLabel: 'पौराणिक स्तोत्र / ध्यान',
        badgeIcon: '📿',
        containerClass:
          'my-3 px-4 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-amber-900/10 dark:border-amber-500/15',
        textClass:
          'font-notoSerif text-center select-text text-[#2A150A] dark:text-amber-200',
      };

    case 'NAMAVALI':
      return {
        type,
        fontFamily: '"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-[1.6]',
        badgeLabel: 'देवता नमस्कार',
        badgeIcon: '🙏',
        containerClass:
          'px-3 py-1.5 rounded-xl bg-amber-500/[0.08] dark:bg-amber-400/[0.07] border border-amber-600/20 flex items-center shadow-xs transition-transform hover:scale-[1.01]',
        textClass:
          'font-tiro text-xs sm:text-sm font-semibold text-[#6E2211] dark:text-sacred-300 w-full text-left',
      };

    case 'VIDHI_INSTRUCTION':
      return {
        type,
        fontFamily: '"Noto Sans Devanagari", "Yantramanav", sans-serif',
        lineHeightClass: 'leading-[1.6]',
        badgeLabel: 'विधि निर्देश',
        badgeIcon: '📜',
        containerClass:
          'my-2 px-3.5 py-1.5 rounded-lg bg-neutral-500/[0.05] dark:bg-neutral-400/[0.05] border-l-2 border-neutral-400/40 text-left',
        textClass:
          'font-devanagari text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 italic',
      };

    case 'SECTION_HEADING':
      return {
        type,
        fontFamily: '"Rozha One", "Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-tight',
        containerClass: 'my-4 text-center select-none',
        textClass: 'font-serifDevanagari font-bold text-xs sm:text-sm text-sacred-700 dark:text-sacred-300',
      };

    case 'INVOCATION_HEADING':
      return {
        type,
        fontFamily: '"Tiro Devanagari Sanskrit", "Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-tight',
        containerClass: 'my-3 text-center select-none',
        textClass: 'font-tiro font-bold text-sm sm:text-base text-[#8C2D19] dark:text-sacred-400 tracking-wider',
      };

    case 'REGULAR_TEXT':
    default:
      return {
        type,
        fontFamily: '"Noto Serif Devanagari", serif',
        lineHeightClass: 'leading-[1.7]',
        containerClass: 'my-1 text-center',
        textClass: 'font-notoSerif text-[#2C1810] dark:text-amber-100',
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

  const flushNamavali = () => {
    if (pendingNamavali.length > 0) {
      units.push({ kind: 'namavali_grid', items: [...pendingNamavali] });
      pendingNamavali = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const type = classifyScriptureLine(trimmed);

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
