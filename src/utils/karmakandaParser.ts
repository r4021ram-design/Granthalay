/**
 * Karmakanda Liturgical Parser & Structural Engine
 * (कर्मकाण्ड विधि-निर्देश: गहन अनुसंधान एवं संरचनात्मक विश्लेषण)
 * 
 * References:
 * - Paraskara / Ashvalayana Grihyasutra
 * - Shardatilaka Tantram
 * - Mantramahodadhi
 * - Nirnayasindhu & Samskara Bhaskara
 * - Karmakanda Pradipa & Sri Vidyarnava Tantram
 */

export type UpacharaTier =
  | 'panchopachara'
  | 'dashopachara'
  | 'shodashopachara'
  | 'rajopachara'
  | 'visheshopachara';

export interface UpacharaItem {
  id: string;
  name: string;
  tier: UpacharaTier;
  sacredIcon: string;
  tattva?: string;
  bija?: string;
  dravya?: string;
  vidhiInstruction?: string;
  mantrantaPada?: string;
  rawText: string;
}

export interface SankalpaVariable {
  label: string;
  value: string;
  isCustomizable: boolean;
}

export interface SankalpaBlock {
  fullText: string;
  temporal?: string[];
  spatial?: string[];
  panchanga?: {
    samvatsara?: string;
    ayana?: string;
    ritu?: string;
    masa?: string;
    paksha?: string;
    tithi?: string;
    vara?: string;
    nakshatra?: string;
  };
  doer?: {
    gotra?: string;
    name?: string;
    varnaSuffix?: string;
  };
  purpose?: string;
  resolution?: string;
  actionInstruction?: string;
  variables: SankalpaVariable[];
}

export interface ViniyogaComponent {
  label: string;
  name: string;
  touchPoint: string;
  icon: string;
  gesture: string;
}

export interface ViniyogaBlock {
  fullText: string;
  rishi?: ViniyogaComponent;
  chhandas?: ViniyogaComponent;
  devata?: ViniyogaComponent;
  bija?: ViniyogaComponent;
  shakti?: ViniyogaComponent;
  kilaka?: ViniyogaComponent;
  prayojana?: ViniyogaComponent;
  components: ViniyogaComponent[];
}

export interface NyasaStep {
  mantra: string;
  angam: string;
  gestureTarget: string;
  instruction: string;
  icon: string;
}

export interface NyasaBlock {
  nyasaType: 'karanyasa' | 'shadanganyasa' | 'combined' | 'other';
  title: string;
  steps: NyasaStep[];
}

export type KarmakandaBlockType =
  | 'SANKALPA'
  | 'VINIYOGA'
  | 'NYASA'
  | 'PANCHOPOCHARA'
  | 'SHODASHOPOCHARA'
  | 'RAJOPOCHARA'
  | 'VISHESHOPOCHARA'
  | 'VIDHI_INSTRUCTION'
  | 'MANTRA'
  | 'REGULAR';

export interface KarmakandaSegment {
  type: KarmakandaBlockType;
  rawText: string;
  sankalpaData?: SankalpaBlock;
  viniyogaData?: ViniyogaBlock;
  nyasaData?: NyasaBlock;
  upacharaItems?: UpacharaItem[];
  vidhiInstruction?: string;
}

// ============================================================================
// 1. सङ्कल्प विज्ञान (Anatomy of Sankalpa)
// ============================================================================

export function isSankalpaText(text: string): boolean {
  const norm = text.replace(/\s+/g, ' ');
  return (
    /अद्य\s*ब्रह्मणो/u.test(norm) ||
    /श्वेतवाराहकल्पे/u.test(norm) ||
    /वैवस्वतमन्वन्तरे/u.test(norm) ||
    /जम्बूद्वीपे\s*भारतवर्षे/u.test(norm) ||
    /(?:गोत्रोऽहं|गोत्रोत्पन्नः|शर्माऽहं|वर्माऽहं).*पूजनमहं\s*करिष्ये/u.test(norm) ||
    /(?:अमुकगोत्र|अमुकनामा).*करिष्ये/u.test(norm) ||
    /सङ्कल्पः?[।॥]?$/u.test(norm)
  );
}

export function parseSankalpa(text: string): SankalpaBlock {
  const variables: SankalpaVariable[] = [];

  // Temporal extraction
  const temporal: string[] = [];
  if (/द्वितीये\s*परार्धे/u.test(text)) temporal.push('द्वितीये परार्धे');
  if (/श्वेतवाराहकल्पे/u.test(text)) temporal.push('श्वेतवाराह कल्प');
  if (/वैवस्वतमन्वन्तरे/u.test(text)) temporal.push('वैवस्वत मन्वन्तर');
  if (/अष्टाविंशतितमे\s*कलियुगे/u.test(text)) temporal.push('२८वाँ कलियुग');
  if (/कलिप्रथमचरणे/u.test(text)) temporal.push('कलि प्रथम चरण');

  // Spatial extraction
  const spatial: string[] = [];
  if (/जम्बूद्वीपे/u.test(text)) spatial.push('जम्बूद्वीप');
  if (/भारतवर्षे/u.test(text)) spatial.push('भारतवर्ष');
  if (/आर्यावर्तैकदेशे/u.test(text)) spatial.push('आर्यावर्त');
  const nagaraMatch = text.match(/(?:अमुक|पुण्य|काशी|प्रयाग|हरिद्वार|अयोध्या|[A-Za-z\u0900-\u097F]+)\s*(?:नगरे|ग्रामे|क्षेत्रे|तीरे)/u);
  if (nagaraMatch) {
    spatial.push(nagaraMatch[0]);
    variables.push({ label: 'स्थान / नगर', value: nagaraMatch[0], isCustomizable: true });
  }

  // Panchanga extraction
  const panchanga: SankalpaBlock['panchanga'] = {};
  const samvatMatch = text.match(/([^\s,।॥]+)\s*नाम\s*संवत्सरे/u) || text.match(/संवत्सरे/u);
  if (samvatMatch) {
    panchanga.samvatsara = samvatMatch[1] || 'अमुक';
    variables.push({ label: 'संवत्सर', value: panchanga.samvatsara, isCustomizable: true });
  }
  const ayanaMatch = text.match(/(उत्तरायणे|दक्षिणायने)/u);
  if (ayanaMatch) panchanga.ayana = ayanaMatch[1];
  const rituMatch = text.match(/(वसन्त|ग्रीष्म|वर्षा|शरद्|हेमन्त|शिशिर)\s*ऋतौ/u);
  if (rituMatch) panchanga.ritu = rituMatch[1];
  const masaMatch = text.match(/(चैत्र|वैशाख|ज्येष्ठ|आषाढ|श्रावण|भाद्रपद|आश्विन|कार्तिक|मार्गशीर्ष|पौष|माघ|फाल्गुन|अमुक)\s*मासे/u);
  if (masaMatch) {
    panchanga.masa = masaMatch[1];
    variables.push({ label: 'मास', value: masaMatch[1], isCustomizable: true });
  }
  const pakshaMatch = text.match(/(शुक्ल|कृष्ण)\s*पक्षे/u);
  if (pakshaMatch) panchanga.paksha = pakshaMatch[1];
  const tithiMatch = text.match(/(प्रतिपदा|द्वितीया|तृतीया|चतुर्थी|पञ्चमी|षष्ठी|सप्तमी|अष्टमी|नवमी|दशमी|एकादशी|द्वादशी|त्रयोदशी|चतुर्दशी|पूर्णिमा|अमावास्या|अमुक)\s*(?:तिथौ|तिथ्याम्)/u);
  if (tithiMatch) {
    panchanga.tithi = tithiMatch[1];
    variables.push({ label: 'तिथि', value: tithiMatch[1], isCustomizable: true });
  }
  const varaMatch = text.match(/(भानु|रवि|सोम|भौम|मङ्गल|बुध|गुरु|बृहस्पति|शुक्र|शनि|स्थिर)\s*वासरे/u);
  if (varaMatch) panchanga.vara = varaMatch[1];

  // Doer (Yajamana Identity)
  const doer: SankalpaBlock['doer'] = {};
  const gotraMatch = text.match(/([^\s,।॥]+)\s*गोत्रोत्पन्न[ः:]?/u) || text.match(/गोत्रः?\s*([^\s,।॥]+)/u);
  if (gotraMatch) {
    doer.gotra = gotraMatch[1].replace(/अमुक/g, 'काश्यप / यजमान');
    variables.push({ label: 'गोत्र', value: doer.gotra, isCustomizable: true });
  }
  const nameMatch = text.match(/([^\s,।॥]+)\s*(?:शर्मा|वर्मा|गुप्त|दास|नामा|अहम्)/u);
  if (nameMatch) {
    doer.name = nameMatch[1].replace(/अमुक/g, 'यजमान');
    variables.push({ label: 'यजमान नाम', value: doer.name, isCustomizable: true });
  }

  // Purpose
  const purposeMatch = text.match(/(?:मम\s+)?(?:कायिक-वाचिक|सकल-दुरित|धर्मार्थकाममोक्ष|श्री\s*[^\s]+\s*प्रीत्यर्थम्)[^।॥]*?(?:अर्थम्|प्रीत्यर्थम्)/u);
  const purpose = purposeMatch ? purposeMatch[0] : 'धर्मार्थकाममोक्ष-चतुर्विध-पुरुषार्थ-सिद्धये, देवताप्रीत्यर्थम्';

  // Resolution
  const resMatch = text.match(/(?:पूजनमहं|जपमहं|पाठमहं|कर्म)\s*(?:करिष्ये|विधास्ये|प्रारभे)/u);
  const resolution = resMatch ? resMatch[0] : 'पूजनमहं करिष्ये';

  // Physical Action Instruction
  let actionInstruction = 'दाहिने हाथ की हथेली में जल, गन्ध, अक्षत, पुष्प, कुश और दक्षिणा लेकर सङ्कल्प वाक्य पढ़ें और जल ताम्रपात्र में छोड़ें।';
  const customAction = text.match(/(?:हाथ\s*में\s*जल|ताम्रपात्र\s*में|जल\s*छोड़ें)[^।॥]*[।॥]?/u);
  if (customAction) {
    actionInstruction = customAction[0].trim();
  }

  return {
    fullText: text,
    temporal: temporal.length ? temporal : undefined,
    spatial: spatial.length ? spatial : undefined,
    panchanga,
    doer,
    purpose,
    resolution,
    actionInstruction,
    variables,
  };
}

// ============================================================================
// २. विनियोग विज्ञान (Anatomy of Viniyoga)
// ============================================================================

export function isViniyogaText(text: string): boolean {
  const norm = text.replace(/\s+/g, ' ');
  return (
    /अस्य\s*श्री/u.test(norm) ||
    /विनियोग[ः:]?/u.test(norm) ||
    /(?:ऋषि[ः:]|छन्द[ः:]|देवता|बीजं|शक्ति[ः:]|कीलकं).*विनियोग/u.test(norm) ||
    /(?:शिरसि\s*ऋषि|मुखे\s*छन्द|हृदि\s*देवता)/u.test(norm)
  );
}

export function parseViniyoga(text: string): ViniyogaBlock {
  const components: ViniyogaComponent[] = [];

  // 1. Rishi (Head/Crown)
  const rishiMatch =
    text.match(/([^\s,।॥]+)\s*(?:ऋषि[ः:]|ऋषये|मुनि[ः:]|मुनि)/u) ||
    text.match(/(?:ऋषि[ः:]|ऋषये)\s*([^\s,।॥]+)/u);
  const rishiName = rishiMatch
    ? (rishiMatch[1] || rishiMatch[0]).replace(/(?:ऋषि[ः:]?|ऋषये|मुनि[ः:]?)/g, '').trim()
    : 'गणक';
  const rishiComp: ViniyogaComponent = {
    label: 'ऋषि (Rishi)',
    name: rishiName || 'ऋषि',
    touchPoint: 'शिरसि (मस्तिष्क)',
    icon: '🧠',
    gesture: 'दाहिने हाथ से सिर का स्पर्श करें',
  };
  components.push(rishiComp);

  // 2. Chhandas (Mouth/Speech)
  const chhandasMatch =
    text.match(/([^\s,।॥]+)\s*(?:च्छन्द[ः:]|छन्द[ः:]|छन्द)/u) ||
    text.match(/(?:च्छन्द[ः:]|छन्द[ः:]|छन्द)\s*([^\s,।॥]+)/u);
  let chhandasName = chhandasMatch
    ? (chhandasMatch[1] || chhandasMatch[0]).replace(/(?:च्छन्द[ः:]?|छन्द[ः:]?)/g, '').trim()
    : 'निचृद्गायत्री';
  if (chhandasName.endsWith('च्')) chhandasName = chhandasName.slice(0, -1);
  const chhandasComp: ViniyogaComponent = {
    label: 'छन्द (Chhandas)',
    name: chhandasName,
    touchPoint: 'मुखे (मुख/जिह्वा)',
    icon: '👄',
    gesture: 'दाहिने हाथ से मुख का स्पर्श करें',
  };
  components.push(chhandasComp);

  // 3. Devata (Heart)
  const devataMatch =
    text.match(/([^\s,।॥]+)\s*देवता/u) ||
    text.match(/देवता[ः:]\s*([^\s,।॥]+)/u);
  let devataName = devataMatch
    ? (devataMatch[1] || devataMatch[0]).replace(/देवता[ः:]?/g, '').trim()
    : 'श्रीमहागणपति';
  if (devataName.endsWith('र्')) devataName = devataName.slice(0, -1);
  else if (devataName.endsWith('र')) devataName = devataName.slice(0, -1);
  const devataComp: ViniyogaComponent = {
    label: 'देवता (Devata)',
    name: devataName,
    touchPoint: 'हृदये (हृदय चक्र)',
    icon: '❤️',
    gesture: 'दाहिने हाथ की पाँचों अँगुलियों से हृदय का स्पर्श करें',
  };
  components.push(devataComp);

  // 4. Bija (Root/Muladhara)
  const bijaMatch =
    text.match(/(?:ॐ\s+)?([^\s,।॥]+)\s*(?:बीजम्|बीजं|बीज)/u) ||
    text.match(/(?:बीजम्|बीजं|बीज)[ः:]\s*(?:ॐ\s+)?([^\s,।॥]+)/u);
  if (bijaMatch) {
    const rawBija = (bijaMatch[1] || bijaMatch[0]).replace(/(?:बीजम्|बीजं|बीज)[ः:]?/g, '').trim();
    const finalBija = rawBija.startsWith('ॐ') ? rawBija : `ॐ ${rawBija}`.trim();
    components.push({
      label: 'बीज (Bija)',
      name: finalBija || 'ॐ गं',
      touchPoint: 'गुह्ये / मूलाधारे',
      icon: '⚡',
      gesture: 'गुह्य स्थान अथवा नाभि का ध्यान/स्पर्श करें',
    });
  }

  // 5. Shakti (Feet)
  const shaktiMatch =
    text.match(/(?:ॐ\s+)?([^\s,।॥]+)\s*(?:शक्ति[ः:]|शक्ति)/u) ||
    text.match(/(?:शक्ति[ः:]|शक्ति)\s*(?:ॐ\s+)?([^\s,।॥]+)/u);
  if (shaktiMatch) {
    const rawShakti = (shaktiMatch[1] || shaktiMatch[0]).replace(/(?:शक्ति[ः:]?)/g, '').trim();
    const finalShakti = rawShakti.startsWith('ॐ') ? rawShakti : `ॐ ${rawShakti}`.trim();
    components.push({
      label: 'शक्ति (Shakti)',
      name: finalShakti || 'ॐ नमः',
      touchPoint: 'पादयोः (दोनों चरण)',
      icon: '✨',
      gesture: 'दोनों चरणों का स्पर्श करें',
    });
  }

  // 6. Kilaka (Navel)
  const kilakaMatch =
    text.match(/(?:ॐ\s+)?([^\s,।॥]+)\s*(?:कीलकम्|कीलकं|कीलक)/u) ||
    text.match(/(?:कीलकम्|कीलकं|कीलक)[ः:]\s*(?:ॐ\s+)?([^\s,।॥]+)/u);
  if (kilakaMatch) {
    const rawKilaka = (kilakaMatch[1] || kilakaMatch[0]).replace(/(?:कीलकम्|कीलकं|कीलक)[ः:]?/g, '').trim();
    const finalKilaka = rawKilaka.startsWith('ॐ') ? rawKilaka : `ॐ ${rawKilaka}`.trim();
    components.push({
      label: 'कीलक (Kilaka)',
      name: finalKilaka || 'ॐ गं',
      touchPoint: 'नाभौ (नाभि मण्डल)',
      icon: '🗝️',
      gesture: 'नाभि का स्पर्श करें',
    });
  }

  // 7. Prayojana / Viniyoga (Water release)
  const prayojanaMatch =
    text.match(/([^\n।॥,]+)\s*विनियोग[ः:]?/u) ||
    text.match(/विनियोग[ः:]\s*([^\n।॥]+)/u);
  let prayojanaName = prayojanaMatch
    ? prayojanaMatch[0].replace(/विनियोग[ः:]?/g, '').trim()
    : 'श्रीमहागणपतिप्रीत्यर्थे जपे विनियोगः';
  const preParts = prayojanaName.split(',');
  if (preParts.length > 1) {
    prayojanaName = preParts[preParts.length - 1].trim();
  }
  const prayojanaComp: ViniyogaComponent = {
    label: 'विनियोग (Prayojana)',
    name: prayojanaName || 'प्रीत्यर्थे जपे विनियोगः',
    touchPoint: 'जल-त्याग (भूमि/पात्र)',
    icon: '💧',
    gesture: 'दाहिने हाथ से जल भूमि पर या ताम्रपात्र में छोड़ें',
  };
  components.push(prayojanaComp);

  return {
    fullText: text,
    rishi: rishiComp,
    chhandas: chhandasComp,
    devata: devataComp,
    components,
  };
}

// ============================================================================
// ३. न्यास विधान (Anatomy of Nyasa)
// ============================================================================

export function isNyasaText(text: string): boolean {
  const norm = text.replace(/\s+/g, ' ');
  return (
    /अङ्गुष्ठाभ्यां\s*नमः/u.test(norm) ||
    /तर्जनीभ्यां\s*नमः/u.test(norm) ||
    /हृदयाय\s*नमः/u.test(norm) ||
    /शिरसे\s*स्वाहा/u.test(norm) ||
    /शिखायै\s*वषट्/u.test(norm) ||
    /कवचाय\s*हुम्/u.test(norm) ||
    /नेत्रत्रयाय\s*वौषट्/u.test(norm) ||
    /अस्त्राय\s*फट्/u.test(norm) ||
    /करन्यास[ः:]?/u.test(norm) ||
    /षडङ्गन्यास[ः:]?/u.test(norm)
  );
}

export function parseNyasa(text: string): NyasaBlock {
  const isKara = /अङ्गुष्ठाभ्यां|तर्जनीभ्यां|मध्यमाभ्यां|अनामिकाभ्यां|कनिष्ठिकाभ्यां|करतल/u.test(text);
  const isShadanga = /हृदयाय|शिरसे|शिखायै|कवचाय|नेत्रत्रयाय|अस्त्राय/u.test(text);

  let nyasaType: NyasaBlock['nyasaType'] = 'other';
  let title = 'न्यास विधान';

  if (isKara && isShadanga) {
    nyasaType = 'combined';
    title = 'करन्यास एवं षडङ्गन्यास';
  } else if (isKara) {
    nyasaType = 'karanyasa';
    title = 'करन्यास (अङ्गुली संस्कार)';
  } else if (isShadanga) {
    nyasaType = 'shadanganyasa';
    title = 'षडङ्गन्यास (हृदयादि रक्षा कवच)';
  }

  const steps: NyasaStep[] = [];

  // Karanyasa step recognition
  if (isKara) {
    const karaMap = [
      { key: 'अङ्गुष्ठाभ्यां', name: 'अङ्गुष्ठ (Thumb)', target: 'दोनों अँगूठे', instr: 'तर्जनी से अँगूठों के मूल से अग्र तक स्पर्श करें', icon: '👍' },
      { key: 'तर्जनीभ्यां', name: 'तर्जनी (Index)', target: 'दोनों तर्जनी', instr: 'अँगूठे से तर्जनी अँगुलियों का स्पर्श करें', icon: '☝️' },
      { key: 'मध्यमाभ्यां', name: 'मध्यमा (Middle)', target: 'दोनों मध्यमा', instr: 'अँगूठे से मध्यमा अँगुलियों का स्पर्श करें', icon: '🖕' },
      { key: 'अनामिकाभ्यां', name: 'अनामिका (Ring)', target: 'दोनों अनामिका', instr: 'अँगूठे से अनामिका (अनामिका) अँगुलियों का स्पर्श करें', icon: '💍' },
      { key: 'कनिष्ठिकाभ्यां', name: 'कनिष्ठिका (Little)', target: 'दोनों कनिष्ठिका', instr: 'अँगूठे से कनिष्ठिका अँगुलियों का स्पर्श करें', icon: '🤙' },
      { key: 'करतल', name: 'करतल-करपृष्ठ', target: 'हथेली व पृष्ठ भाग', instr: 'दाहिनी हथेली से बाएँ हाथ की हथेली व दोनों पृष्ठ भाग फेरें', icon: '🤲' },
    ];
    for (const item of karaMap) {
      if (text.includes(item.key)) {
        const regex = new RegExp(`([^।॥\n]*${item.key}[^।॥\n]*[।॥]?)`, 'u');
        const match = text.match(regex);
        steps.push({
          mantra: match ? match[0].trim() : `${item.key} नमः`,
          angam: item.name,
          gestureTarget: item.target,
          instruction: item.instr,
          icon: item.icon,
        });
      }
    }
  }

  // Shadanganyasa step recognition
  if (isShadanga) {
    const shadangaMap = [
      { key: 'हृदयाय नमः', name: 'हृदय (Heart)', target: 'हृदय मण्डल', instr: 'पाँचों अँगुलियों से हृदय का स्पर्श करें', icon: '❤️' },
      { key: 'शिरसे स्वाहा', name: 'शिर (Crown)', target: 'सिर (मस्तिष्क)', instr: 'दाहिने हाथ की अँगुलियों से सिर का स्पर्श करें', icon: '🧠' },
      { key: 'शिखायै वषट्', name: 'शिखा (Tuft)', target: 'शिखा स्थान', instr: 'दाहिने अँगूठे से चोटी के स्थान का स्पर्श करें', icon: '💈' },
      { key: 'कवचाय हुम्', name: 'कवच (Armor)', target: 'दोनों कन्धे (Cross)', instr: 'हाथों को छाती पर स्वस्तिकवत् क्रॉस कर कन्धों को छुएँ', icon: '🛡️' },
      { key: 'नेत्रत्रयाय वौषट्', name: 'नेत्रत्रय (3 Eyes)', target: 'दोनों नेत्र व भृकुटि', instr: 'तर्जनी, मध्यमा, अनामिका से दोनों नेत्र व त्रिनेत्र छुएँ', icon: '👁️' },
      { key: 'अस्त्राय फट्', name: 'अस्त्र (Digbandha)', target: 'तालिका वादन', instr: 'सिर के ऊपर हाथ घुमाकर बाएँ हाथ पर ३ बार ताली बजाएँ', icon: '👏' },
    ];
    for (const item of shadangaMap) {
      if (text.includes(item.key.split(' ')[0])) {
        const regex = new RegExp(`([^।॥\n]*${item.key.split(' ')[0]}[^।॥\n]*[।॥]?)`, 'u');
        const match = text.match(regex);
        steps.push({
          mantra: match ? match[0].trim() : item.key,
          angam: item.name,
          gestureTarget: item.target,
          instruction: item.instr,
          icon: item.icon,
        });
      }
    }
  }

  return {
    nyasaType,
    title,
    steps,
  };
}

// ============================================================================
// ४. उपचार चक्र (Panchopachara, Shodashopachara, Rajopachara, Visheshopachara)
// ============================================================================

export const PANCHOPOCHARA_MATRIX: Array<Omit<UpacharaItem, 'id' | 'rawText'>> = [
  {
    name: 'गन्ध (चन्दन)',
    tier: 'panchopachara',
    sacredIcon: '🪵',
    tattva: 'पृथ्वी तत्त्व',
    bija: 'लं',
    dravya: 'अष्टगन्ध / श्वेत चन्दन',
    vidhiInstruction: 'अनामिका अँगुली से देवता के चरणों/भाल पर चन्दन लगाएँ।',
    mantrantaPada: 'गन्धं समर्पयामि',
  },
  {
    name: 'पुष्प (सुमन)',
    tier: 'panchopachara',
    sacredIcon: '🌸',
    tattva: 'आकाश तत्त्व',
    bija: 'हं',
    dravya: 'ऋतुपुष्प, बिल्वपत्र, तुलसी',
    vidhiInstruction: 'दोनों हाथों की अञ्जलि से श्रद्धापूर्वक पुष्प अर्पित करें।',
    mantrantaPada: 'पुष्पं समर्पयामि',
  },
  {
    name: 'धूप (सुगन्ध)',
    tier: 'panchopachara',
    sacredIcon: '💨',
    tattva: 'वायु तत्त्व',
    bija: 'यं',
    dravya: 'गुग्गुल, दशाङ्ग धूपबत्ती',
    vidhiInstruction: 'बाएँ हाथ से घण्टा बजाते हुए दाहिने हाथ से धूप आघ्रापित कराएँ।',
    mantrantaPada: 'धूपमाघ्रापयामि',
  },
  {
    name: 'दीप (प्रकाश)',
    tier: 'panchopachara',
    sacredIcon: '🪔',
    tattva: 'तेज/अग्नि तत्त्व',
    bija: 'रं',
    dravya: 'गोघृत का दीपक',
    vidhiInstruction: 'दीपक देवता के सम्मुख घुमाकर दिखाएँ व हाथ धोएँ।',
    mantrantaPada: 'दीपं दर्शयामि',
  },
  {
    name: 'नैवेद्य (भोग)',
    tier: 'panchopachara',
    sacredIcon: '🥥',
    tattva: 'जल/अमृत तत्त्व',
    bija: 'वं',
    dravya: 'मिष्ठान्न, पञ्चामृत, फल',
    vidhiInstruction: 'जल का घेरा लगाकर ग्रास-मुद्रा से ५ बार भोग अर्पित करें।',
    mantrantaPada: 'नैवेद्यं निवेदयामि',
  },
  {
    name: 'ताम्बूल व सर्वोपचार',
    tier: 'panchopachara',
    sacredIcon: '🍃',
    tattva: 'सर्व तत्त्व',
    bija: 'सं',
    dravya: 'ताम्बूल (पान-सुपारी) व दक्षिणा',
    vidhiInstruction: 'ताम्बूल, दक्षिणा अर्पित कर साष्टाङ्ग प्रणाम करें।',
    mantrantaPada: 'सर्वोपचारान् समर्पयामि',
  },
];

export const SHODASHOPOCHARA_MATRIX: Array<Omit<UpacharaItem, 'id' | 'rawText'>> = [
  { name: 'आवाहनम्', tier: 'shodashopachara', sacredIcon: '🙏', dravya: 'अक्षत, पुष्प', vidhiInstruction: 'आवाहन मुद्रा बनाकर हाथ जोड़ें और अक्षत छोड़ें', mantrantaPada: 'आवाहयामि' },
  { name: 'आसनम्', tier: 'shodashopachara', sacredIcon: '🪑', dravya: 'पुष्प, दूर्वा, कुश', vidhiInstruction: 'देवता के चरणों में आसन हेतु पुष्प छोड़ें', mantrantaPada: 'आसनं समर्पयामि' },
  { name: 'पाद्यम्', tier: 'shodashopachara', sacredIcon: '🦶', dravya: 'सुगन्धित जल', vidhiInstruction: 'आचमनी से चरण प्रक्षालन हेतु पात्र में जल छोड़ें', mantrantaPada: 'पाद्यं समर्पयामि' },
  { name: 'अर्घ्यम्', tier: 'shodashopachara', sacredIcon: '💧', dravya: 'गन्ध, अक्षत, पुष्पयुक्त जल', vidhiInstruction: 'अर्घ्यपात्र में जल अर्पित करें', mantrantaPada: 'अर्घ्यं समर्पयामि' },
  { name: 'आचमनीयम्', tier: 'shodashopachara', sacredIcon: '🫗', dravya: 'कर्पूर-लौंग युक्त जल', vidhiInstruction: 'मुख शुद्धि हेतु आचमनी से जल छोड़ें', mantrantaPada: 'आचमनीयं समर्पयामि' },
  { name: 'स्नानम्', tier: 'shodashopachara', sacredIcon: '🚿', dravya: 'शुद्ध जल, गङ्गाजल, पञ्चामृत', vidhiInstruction: 'शङ्ख या आचमनी से अभिषेक स्नान कराएँ', mantrantaPada: 'स्नानं समर्पयामि' },
  { name: 'वस्त्र एवं यज्ञोपवीत', tier: 'shodashopachara', sacredIcon: '👘', dravya: 'मौली, पीत वस्त्र, जनेऊ', vidhiInstruction: 'दिव्य वस्त्र व यज्ञोपवीत अर्पित करें', mantrantaPada: 'वस्त्रोपवस्त्रं समर्पयामि' },
  { name: 'गन्ध / चन्दन', tier: 'shodashopachara', sacredIcon: '🪵', dravya: 'अष्टगन्ध, श्वेत चन्दन, रोली', vidhiInstruction: 'अनामिका अँगुली से तिलक लगाएँ', mantrantaPada: 'गन्धं समर्पयामि' },
  { name: 'अक्षत', tier: 'shodashopachara', sacredIcon: '🌾', dravya: 'अखण्ड अक्षत (चावल)', vidhiInstruction: 'चन्दन के ऊपर अक्षत चढ़ाएँ', mantrantaPada: 'अक्षतान् समर्पयामि' },
  { name: 'पुष्प एवं बिल्वपत्र', tier: 'shodashopachara', sacredIcon: '🌸', dravya: 'ऋतुपुष्प, माला, तुलसी/दूर्वा', vidhiInstruction: 'दोनों हाथों से पुष्पाञ्जलि अर्पण करें', mantrantaPada: 'पुष्पं समर्पयामि' },
  { name: 'धूपम्', tier: 'shodashopachara', sacredIcon: '💨', dravya: 'गुग्गुल, धूपबत्ती', vidhiInstruction: 'घण्टी बजाते हुए धूप दिखाएँ', mantrantaPada: 'धूपमाघ्रापयामि' },
  { name: 'दीपम्', tier: 'shodashopachara', sacredIcon: '🪔', dravya: 'गोघृत का दीपक', vidhiInstruction: 'दीपक दिखाएँ और हस्त प्रक्षालन करें', mantrantaPada: 'दीपं दर्शयामि' },
  { name: 'नैवेद्य एवं ताम्बूल', tier: 'shodashopachara', sacredIcon: '🥥', dravya: 'मिष्ठान्न, फल, पान-सुपारी', vidhiInstruction: 'जल छिड़ककर ग्रास-मुद्रा से भोग लगाएँ', mantrantaPada: 'नैवेद्यं निवेदयामि' },
  { name: 'नीराजन / आरती', tier: 'shodashopachara', sacredIcon: '🔔', dravya: 'कर्पूर, पञ्चमुखी घृत दीप', vidhiInstruction: 'शङ्ख-घण्टा ध्वनि के साथ आरती घुमाएँ', mantrantaPada: 'नीराजनं दर्शयामि' },
  { name: 'प्रदक्षिणा / पुष्पाञ्जलि', tier: 'shodashopachara', sacredIcon: '🔄', dravya: 'पुष्पाञ्जलि मन्त्र, पुष्प', vidhiInstruction: 'स्वस्थान पर ३ बार परिक्रमा कर पुष्प छोड़ें', mantrantaPada: 'प्रदक्षिणां समर्पयामि' },
  { name: 'क्षमा-प्रार्थना व समर्पण', tier: 'shodashopachara', sacredIcon: '🙇', dravya: 'जल, पुष्प', vidhiInstruction: 'साष्टाङ्ग दण्डवत् प्रणाम कर पूजा समर्पण करें', mantrantaPada: 'समर्पणं करोमि' },
];

export const RAJOPOCHARA_ITEMS = [
  { key: 'छत्र', name: 'छत्रम् (Royal Umbrella)', icon: '☂️', mantrantaPada: 'छत्रं समर्पयामि', instr: 'देवता के ऊपर श्वेत छत्र लगाएँ' },
  { key: 'चामर', name: 'चामरम् (Royal Whisks)', icon: '🪶', mantrantaPada: 'चामरयुगलं समर्पयामि', instr: 'दोनों हाथों से चामर झुलाएँ' },
  { key: 'व्यजन', name: 'व्यजनम् (Sacred Fan)', icon: '🪭', mantrantaPada: 'व्यजनं समर्पयामि', instr: 'तालवृन्त या मयूरपङ्ख पंखा झलें' },
  { key: 'दर्पण', name: 'दर्पणम् (Sacred Mirror)', icon: '🪞', mantrantaPada: 'दर्पणं दर्शयामि', instr: 'दिव्य दर्पण सामने दिखाएँ' },
  { key: 'गीत', name: 'गीतम् (Sacred Singing)', icon: '🎶', mantrantaPada: 'गीतं समर्पयामि', instr: 'सामगान व स्तोत्र गायन प्रस्तुत करें' },
  { key: 'वाद्य', name: 'वाद्यम् (Instruments)', icon: '🥁', mantrantaPada: 'वाद्यं समर्पयामि', instr: 'शङ्ख, घण्टा, मृदङ्ग वाद्य बजाएँ' },
  { key: 'नृत्य', name: 'नृत्यम् (Devotional Dance)', icon: '💃', mantrantaPada: 'नृत्यं दर्शयामि', instr: 'शास्त्रीय भाव-नृत्य हस्तमुद्रा दिखाएँ' },
  { key: 'पादुका', name: 'पादुके (Divine Sandals)', icon: '👡', mantrantaPada: 'पादुके समर्पयामि', instr: 'चरणों में स्वर्ण पादुका अर्पित करें' },
  { key: 'सिंहासन', name: 'सिंहासन / दोलोत्सव', icon: '👑', mantrantaPada: 'दोलारोहणं समर्पयामि', instr: 'मङ्गल झूलन या सिंहासन आरोहण कराएँ' },
];

export const VISHESHOPOCHARA_ITEMS = [
  { key: 'विशेषार्घ्य', name: 'विशेषार्घ्य स्थापन', icon: '🐚', instr: 'शङ्ख प्रक्षालन, तीर्थ आवाहन, मत्स्य-धेनु-योनि मुद्रा' },
  { key: 'मधुपर्क', name: 'मधुपर्क समर्पण', icon: '🍯', instr: 'कांस्य पात्र में दधि, मधु, घृत मिलाकर अर्पित करें' },
  { key: 'पञ्चामृत', name: 'पञ्चामृत महास्नान', icon: '🥛', instr: 'दूध, दही, घी, शहद, शर्करा का पृथक्-पृथक् वैदिक स्नान' },
  { key: 'आभरण', name: 'दिव्य आभरण / अलङ्कार', icon: '💎', instr: 'मुकुट, कुण्डल, कण्ठहार, नूपुर अर्पण करें' },
  { key: 'अङ्गपूजा', name: 'अङ्गपूजा (चरण से मस्तक)', icon: '🌿', instr: 'पादौ पूजयामि, जानुनी पूजयामि, कटिं पूजयामि...' },
  { key: 'आवरण', name: 'आवरण पूजा', icon: '🔯', instr: 'श्रीचक्र अथवा मण्डल के ९ आवरण देवताओं का पूजन' },
  { key: 'अष्टोत्तरशत', name: '१०८ / १००० नामावली अर्चन', icon: '🌺', instr: 'कुङ्कुम/तुलसी/बिल्वपत्र से प्रत्येक नाम पर अर्चन' },
  { key: 'बलि', name: 'महाहविः / क्षेत्रपाल बलि', icon: '🥣', instr: 'दिक्पाल व क्षेत्रपाल को पवित्र बलि अर्पण' },
];

export function isUpacharaText(text: string): boolean {
  const norm = text.replace(/\s+/g, ' ');
  return (
    /(?:समर्पयामि|आवाहयामि|दर्शयामि|निवेदयामि|समर्पित\s*करें|भोग\s*लगावें|स्नान\s*करावें)/u.test(norm) ||
    /लं\s*पृथिव्यात्मने|हं\s*आकाशात्मने|यं\s*वाय्वात्मने|रं\s*वह्न्यात्मने|वं\s*अमृतात्मने/u.test(norm) ||
    /छत्रं|चामरं|दर्पणं|मधुपर्कं|पञ्चामृत/u.test(norm)
  );
}

export function parseUpachara(text: string): UpacharaItem[] {
  const items: UpacharaItem[] = [];

  // Check Panchopachara elements
  for (const p of PANCHOPOCHARA_MATRIX) {
    if (text.includes(p.bija!) || text.includes(p.mantrantaPada!)) {
      items.push({
        ...p,
        id: `pancho_${p.bija}`,
        rawText: text,
      });
    }
  }

  // Check Rajopachara elements
  for (const r of RAJOPOCHARA_ITEMS) {
    if (text.includes(r.key) || text.includes(r.mantrantaPada)) {
      items.push({
        id: `rajo_${r.key}`,
        name: r.name,
        tier: 'rajopachara',
        sacredIcon: r.icon,
        vidhiInstruction: r.instr,
        mantrantaPada: r.mantrantaPada,
        rawText: text,
      });
    }
  }

  // Check Visheshopachara elements
  for (const v of VISHESHOPOCHARA_ITEMS) {
    if (text.includes(v.key)) {
      items.push({
        id: `vishesha_${v.key}`,
        name: v.name,
        tier: 'visheshopachara',
        sacredIcon: v.icon,
        vidhiInstruction: v.instr,
        rawText: text,
      });
    }
  }

  // Check Shodashopachara offerings if items are still empty or specific
  if (items.length === 0) {
    for (const s of SHODASHOPOCHARA_MATRIX) {
      if ((s.mantrantaPada && text.includes(s.mantrantaPada)) || text.includes(s.name)) {
        items.push({
          ...s,
          id: `shodasha_${s.name}`,
          rawText: text,
        });
      }
    }
  }

  return items;
}

// ============================================================================
// ५. विधि-निर्देश पहचान (Linguistic Action Signatures)
// ============================================================================

export function isVidhiInstruction(text: string): boolean {
  const norm = text.trim();
  if (!norm) return false;

  // Exact Hindi action verbs commonly found in ritual paddhatis
  const actionRegex = /(?:छोड़ें|छोड़े|करें|करावें|रखें|रखे|लगावें|लगायें|स्पर्श\s*करें|दिखावें|दिखाएँ|डुलावें|झलें|पवित्री\s*धारण|हाथ\s*धोएँ|प्रणाम\s*करें|जल\s*छोड़ें|अक्षत\s*चढ़ाएँ|भोग\s*लगावें)[।\s]?$/u;
  const instructionPrefix = /^(?:दाहिने\s*हाथ|बाएँ\s*हाथ|ताम्रपात्र|आचमनी|दोनों\s*हाथ|अब\s+|तदनन्तर|इसके\s*बाद|यजमान)/u;

  return actionRegex.test(norm) || instructionPrefix.test(norm);
}

// ============================================================================
// ६. सर्वाङ्ग खण्ड विश्लेषक (Segment Classifier)
// ============================================================================

export function parseKarmakandaSegment(rawText: string): KarmakandaSegment {
  const text = rawText.trim();

  // 1. Check Sankalpa
  if (isSankalpaText(text)) {
    return {
      type: 'SANKALPA',
      rawText: text,
      sankalpaData: parseSankalpa(text),
    };
  }

  // 2. Check Viniyoga
  if (isViniyogaText(text)) {
    return {
      type: 'VINIYOGA',
      rawText: text,
      viniyogaData: parseViniyoga(text),
    };
  }

  // 3. Check Nyasa
  if (isNyasaText(text)) {
    return {
      type: 'NYASA',
      rawText: text,
      nyasaData: parseNyasa(text),
    };
  }

  // 4. Check Upachara
  if (isUpacharaText(text)) {
    const items = parseUpachara(text);
    if (items.length > 0) {
      let upTier: KarmakandaBlockType = 'SHODASHOPOCHARA';
      if (items.some(i => i.tier === 'panchopachara')) upTier = 'PANCHOPOCHARA';
      else if (items.some(i => i.tier === 'rajopachara')) upTier = 'RAJOPOCHARA';
      else if (items.some(i => i.tier === 'visheshopachara')) upTier = 'VISHESHOPOCHARA';

      return {
        type: upTier,
        rawText: text,
        upacharaItems: items,
      };
    }
  }

  // 5. Check Vidhi Action
  if (isVidhiInstruction(text)) {
    return {
      type: 'VIDHI_INSTRUCTION',
      rawText: text,
      vidhiInstruction: text,
    };
  }

  // 6. Check Sacred Mantra / Shloka
  if (text.includes('नमः') || text.includes('स्वाहा') || text.includes('वौषट्') || text.startsWith('ॐ')) {
    return {
      type: 'MANTRA',
      rawText: text,
    };
  }

  return {
    type: 'REGULAR',
    rawText: text,
  };
}
