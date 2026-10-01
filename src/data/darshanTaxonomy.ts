/**
 * ============================================================================
 * 🕉️ ग्रन्थालयः - दर्शन-केन्द्रित देवतोपासना एवं पवित्र वास्तुकला
 * (Canonical Darshan Taxonomy & Publisher-Agnostic Scripture Engine)
 * ============================================================================
 */

import { BRIHAT_STOTRAS, BrihatStotraItem } from './brihatStotraRatnakarIndex.js';
import { SUPPLEMENTAL_CANONICAL_STOTRAS } from './supplementalStotrasData.js';

export type DarshanId = 'stotra' | 'pujavidhi' | 'tantra' | 'veda-purana';

export interface DarshanSphere {
  id: DarshanId;
  name: string;
  sanskritName: string;
  icon: string;
  description: string;
  mantra: string;
}

export interface DeitySphere {
  id: string;
  name: string;
  sanskritTitle: string;
  icon: string;
  badge: string;
  gradient: string;
  border: string;
  mantra: string;
}

export type StotraGenreId =
  | 'all'
  | 'kavacha'     // कवचम् 🛡️
  | 'ashtaka'     // अष्टकम् 🪷
  | 'panchaka'    // पञ्चकम् 🖐️
  | 'manasapuja'  // मानसपूजा 🧘
  | 'namavali'    // शतनाम / सहस्रनाम 📿
  | 'hridaya'     // हृदयम् 💖
  | 'stotra';     // स्तोत्र व महिम्न 📖

export interface StotraGenre {
  id: StotraGenreId;
  name: string;
  sanskritName: string;
  icon: string;
  badge: string;
}

export const CANONICAL_STOTRA_GENRES: StotraGenre[] = [
  { id: 'all', name: 'सभी विधाएँ', sanskritName: 'समस्त विधा', icon: '✨', badge: 'bg-neutral-900 text-neutral-300 border-neutral-800' },
  { id: 'kavacha', name: 'कवच', sanskritName: 'कवचम्', icon: '🛡️', badge: 'bg-amber-950/80 text-amber-300 border-amber-800' },
  { id: 'ashtaka', name: 'अष्टकम्', sanskritName: 'अष्टकम्', icon: '🪷', badge: 'bg-rose-950/80 text-rose-300 border-rose-800' },
  { id: 'panchaka', name: 'पञ्चकम्', sanskritName: 'पञ्चकम्', icon: '🖐️', badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
  { id: 'manasapuja', name: 'मानसपूजा', sanskritName: 'मानसपूजा', icon: '🧘', badge: 'bg-sky-950/80 text-sky-300 border-sky-800' },
  { id: 'namavali', name: 'शतनाम/सहस्रनाम', sanskritName: 'नाम-संग्रह', icon: '📿', badge: 'bg-purple-950/80 text-purple-300 border-purple-800' },
  { id: 'hridaya', name: 'हृदयम्', sanskritName: 'हृदयम्', icon: '💖', badge: 'bg-pink-950/80 text-pink-300 border-pink-800' },
  { id: 'stotra', name: 'स्तोत्र व महिम्न', sanskritName: 'स्तोत्रम्', icon: '📖', badge: 'bg-amber-950/60 text-amber-200 border-amber-900' },
];

export function classifyStotraGenre(title: string): StotraGenreId {
  const t = title.trim().toLowerCase();
  if (t.includes('कवच') || t.includes('कवचम्')) return 'kavacha';
  if (t.includes('अष्टक') || t.includes('अष्टकम्') || t.includes('अष्टकः')) return 'ashtaka';
  if (t.includes('पञ्चक') || t.includes('पञ्चकम्') || t.includes('पञ्चरत्न') || t.includes('पंचक')) return 'panchaka';
  if (t.includes('मानसपूजा') || t.includes('मानस पूजा') || t.includes('मानसिक')) return 'manasapuja';
  if (
    t.includes('सहस्रनाम') ||
    t.includes('शतनाम') ||
    t.includes('नामावली') ||
    t.includes('अष्टोत्तर') ||
    t.includes('द्वादशनाम') ||
    t.includes('नामावलि')
  ) return 'namavali';
  if (t.includes('हृदय') || t.includes('हृदयम्')) return 'hridaya';
  return 'stotra';
}

export interface ScriptureItem {
  id: string | number;
  darshanId: DarshanId;
  deityId: string;
  genre?: StotraGenreId;
  title: string;
  bookPage?: number;
  pdfPage?: number;
  author?: string;
  description?: string;
  isCustom?: boolean;
  content?: string;
}

export const CANONICAL_DARSHANS: DarshanSphere[] = [
  {
    id: 'stotra',
    name: 'स्तोत्र दर्शन',
    sanskritName: '॥ स्तोत्र दर्शनम् ॥',
    icon: '🕉️',
    description: 'समस्त देवताओं के पावन स्तोत्र, कवच, सहस्रनाम एवं अष्टक। विशुद्ध देवतोपासना।',
    mantra: '॥ यस्य स्मरणमात्रेण जन्मसंसारबन्धनात् । विमुच्यते नमस्तस्मै विष्णवे प्रभविष्णवे ॥',
  },
  {
    id: 'pujavidhi',
    name: 'पूजाविधि दर्शन',
    sanskritName: '॥ पूजाविधि दर्शनम् ॥',
    icon: '🪔',
    description: 'नित्यकर्म, सन्ध्यावन्दन, पञ्चोपचार, षोडशोपचार देवपूजा, संकल्प, अभिषेक एवं हवन विधान।',
    mantra: '॥ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा । यः स्मरेत्पुण्डरीकाक्षं स बाह्याभ्यन्तरः शुचिः ॥',
  },
  {
    id: 'tantra',
    name: 'तन्त्र दर्शन',
    sanskritName: '॥ तन्त्र दर्शनम् ॥',
    icon: '🔱',
    description: 'आगम, महाविद्या, श्रीविद्या, यन्त्र-उपासना, मन्त्र-न्यास एवं पारम्परिक साधना ग्रन्थ।',
    mantra: '॥ सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥',
  },
  {
    id: 'veda-purana',
    name: 'वेद-पुराण दर्शन',
    sanskritName: '॥ वेद-पुराण दर्शनम् ॥',
    icon: '📜',
    description: 'श्रुति, उपनिषदः, श्रीमद्भगवद्गीता, महाभारत एवं अष्टादश महापुराण।',
    mantra: '॥ ॐ असतो मा सद्गमय तमसो मा ज्योतिर्गमय मृत्योर्मा अमृतं गमय ॥',
  },
];

export const CANONICAL_DEITIES: DeitySphere[] = [
  {
    id: 'ganesha',
    name: 'श्रीगणेश',
    sanskritTitle: 'श्रीगणेशस्तोत्राणि',
    icon: '🐘',
    badge: 'bg-orange-950 text-orange-400 border-orange-800',
    gradient: 'from-orange-950/90 via-amber-950/60 to-neutral-900',
    border: 'border-orange-800/60 hover:border-orange-500',
    mantra: '॥ ॐ गं गणपतये नमः ॥',
  },
  {
    id: 'shiva',
    name: 'देवाधिदेव शिव',
    sanskritTitle: 'शिवस्तोत्राणि',
    icon: '🔱',
    badge: 'bg-sky-950 text-sky-300 border-sky-800',
    gradient: 'from-sky-950/90 via-indigo-950/60 to-neutral-900',
    border: 'border-sky-800/60 hover:border-sky-500',
    mantra: '॥ ॐ नमः शिवाय ॥',
  },
  {
    id: 'vishnu',
    name: 'भगवान् विष्णु',
    sanskritTitle: 'विष्णुस्तोत्राणि',
    icon: '🪷',
    badge: 'bg-amber-950 text-amber-300 border-amber-800',
    gradient: 'from-amber-950/90 via-yellow-950/50 to-neutral-900',
    border: 'border-amber-700/60 hover:border-amber-400',
    mantra: '॥ ॐ नमो भगवते वासुदेवाय ॥',
  },
  {
    id: 'devi',
    name: 'भगवती दुर्गा / शक्ति',
    sanskritTitle: 'देवीस्तोत्राणि',
    icon: '🌺',
    badge: 'bg-rose-950 text-rose-300 border-rose-800',
    gradient: 'from-rose-950/90 via-red-950/60 to-neutral-900',
    border: 'border-rose-800/60 hover:border-rose-500',
    mantra: '॥ ॐ दुं दुर्गायै नमः ॥',
  },
  {
    id: 'rama',
    name: 'मर्यादा पुरुषोत्तम श्रीराम',
    sanskritTitle: 'रामस्तोत्राणि',
    icon: '🏹',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    gradient: 'from-emerald-950/90 via-teal-950/60 to-neutral-900',
    border: 'border-emerald-800/60 hover:border-emerald-500',
    mantra: '॥ ॐ रां रामाय नमः ॥',
  },
  {
    id: 'krishna',
    name: 'योगेश्वर श्रीकृष्ण',
    sanskritTitle: 'कृष्णस्तोत्राणि',
    icon: '🦚',
    badge: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    gradient: 'from-cyan-950/90 via-blue-950/60 to-neutral-900',
    border: 'border-cyan-800/60 hover:border-cyan-500',
    mantra: '॥ ॐ क्लीं कृष्णाय नमः ॥',
  },
  {
    id: 'maruti',
    name: 'श्रीहनुमत् / मारुति',
    sanskritTitle: 'मारुतिस्तोत्राणि',
    icon: '🚩',
    badge: 'bg-red-950 text-orange-300 border-red-800',
    gradient: 'from-red-950/90 via-amber-950/60 to-neutral-900',
    border: 'border-red-800/60 hover:border-red-500',
    mantra: '॥ ॐ हं हनुमते नमः ॥',
  },
  {
    id: 'surya',
    name: 'भगवान् सूर्य',
    sanskritTitle: 'सूर्यस्तोत्राणि',
    icon: '☀️',
    badge: 'bg-amber-950 text-yellow-300 border-amber-800',
    gradient: 'from-amber-900/90 via-orange-950/60 to-neutral-900',
    border: 'border-amber-600/60 hover:border-yellow-500',
    mantra: '॥ ॐ सूर्याय नमः ॥',
  },
  {
    id: 'avatara',
    name: 'अवतार व गुरु परम्परा',
    sanskritTitle: 'अवतार व गुरु स्तोत्राणि',
    icon: '✨',
    badge: 'bg-purple-950 text-purple-300 border-purple-800',
    gradient: 'from-purple-950/90 via-indigo-950/60 to-neutral-900',
    border: 'border-purple-800/60 hover:border-purple-500',
    mantra: '॥ गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः ॥',
  },
  {
    id: 'ganga',
    name: 'गङ्गादि तीर्थ',
    sanskritTitle: 'गङ्गादि तीर्थस्तोत्राणि',
    icon: '🌊',
    badge: 'bg-blue-950 text-blue-300 border-blue-800',
    gradient: 'from-blue-950/90 via-cyan-950/60 to-neutral-900',
    border: 'border-blue-800/60 hover:border-blue-500',
    mantra: '॥ ॐ गङ्गायै नमः ॥',
  },
  {
    id: 'navagraha',
    name: 'नवग्रह मण्डल',
    sanskritTitle: 'नवग्रहस्तोत्राणि',
    icon: '🪐',
    badge: 'bg-violet-950 text-violet-300 border-violet-800',
    gradient: 'from-violet-950/90 via-neutral-950/60 to-neutral-900',
    border: 'border-violet-800/60 hover:border-violet-500',
    mantra: '॥ ॐ ब्रह्मा मुरारिस्त्रिपुरान्तकारी भानुः शशी भूमिसुतो बुधश्च ॥',
  },
  {
    id: 'vedanta',
    name: 'वेदान्त एवं आत्मज्ञान',
    sanskritTitle: 'वेदान्तस्तोत्राणि',
    icon: '📜',
    badge: 'bg-neutral-900 text-neutral-300 border-neutral-700',
    gradient: 'from-stone-950/90 via-neutral-950/60 to-neutral-900',
    border: 'border-stone-700/60 hover:border-stone-500',
    mantra: '॥ अहं ब्रह्मास्मि । अयमात्मा ब्रह्म ॥',
  },
  {
    id: 'sankeerna',
    name: 'संकीर्ण / अन्य स्तुतियाँ',
    sanskritTitle: 'संकीर्णस्तोत्राणि',
    icon: '🪔',
    badge: 'bg-amber-950 text-amber-200 border-amber-900',
    gradient: 'from-stone-900/90 via-orange-950/40 to-neutral-900',
    border: 'border-amber-900/60 hover:border-amber-700',
    mantra: '॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥',
  },
];

// Local storage key for user-added custom stotras
const CUSTOM_STOTRAS_STORAGE_KEY = 'granthalay_custom_stotras_v1';

export function getCustomStotras(): ScriptureItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_STOTRAS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load custom stotras', e);
    return [];
  }
}

export function saveCustomStotra(item: Omit<ScriptureItem, 'id' | 'isCustom'>): ScriptureItem {
  const customList = getCustomStotras();
  const newItem: ScriptureItem = {
    ...item,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    isCustom: true,
  };
  const updated = [newItem, ...customList];
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_STOTRAS_STORAGE_KEY, JSON.stringify(updated));
  }
  return newItem;
}

export function normalizeStotraTitleForDedup(title: string): string {
  return title
    .replace(/^श्री/g, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/स्तोत्रम्?$/g, '')
    .replace(/अष्टकम्?$/g, '')
    .replace(/षट्कम्?$/g, '')
    .replace(/पञ्चकम्?$/g, '')
    .replace(/पञ्चरत्नम्?$/g, '')
    .replace(/सहस्रनामम्?$/g, '')
    .replace(/कवचम्?$/g, '')
    .replace(/हृदयम्?$/g, '')
    .replace(/म्$/g, '')
    .replace(/्$/g, '')
    .replace(/ङ्/g, 'ं')
    .replace(/ञ्/g, 'ं')
    .replace(/ण्/g, 'ं')
    .replace(/न्(?=[क-ह])/g, 'ं')
    .replace(/म्(?=[क-ह])/g, 'ं')
    .replace(/\s+/g, '')
    .trim();
}

// Map all stotras into the unified, deduplicated deity taxonomy (एक स्तोत्र दो बार नहीं आना चाहिए)
export function getAllStotrasForDarshan(deityId?: string, genreId?: StotraGenreId): ScriptureItem[] {
  const baseItems: ScriptureItem[] = BRIHAT_STOTRAS.map((s) => ({
    id: s.id,
    darshanId: 'stotra',
    deityId: s.category,
    genre: classifyStotraGenre(s.title),
    title: s.title,
    bookPage: s.bookPage,
    pdfPage: s.pdfPage,
  }));

  const supplementalItems: ScriptureItem[] = SUPPLEMENTAL_CANONICAL_STOTRAS.map((s) => ({
    ...s,
    genre: s.genre || classifyStotraGenre(s.title),
  }));

  const customItems = getCustomStotras().filter((c) => c.darshanId === 'stotra').map((c) => ({
    ...c,
    genre: c.genre || classifyStotraGenre(c.title),
  }));

  // Canonical Deduplication: Supplemental (verified full text) takes priority & merges folio page refs
  const mergedList: ScriptureItem[] = [];
  const matchedBaseIds = new Set<string | number>();

  for (const supp of supplementalItems) {
    const normS = normalizeStotraTitleForDedup(supp.title);
    const match = baseItems.find((b) => {
      if (b.deityId !== supp.deityId && supp.deityId !== 'sankeerna' && b.deityId !== 'sankeerna') return false;
      const normB = normalizeStotraTitleForDedup(b.title);
      return normB === normS || (normS.length >= 4 && normB.includes(normS)) || (normB.length >= 4 && normS.includes(normB));
    });

    if (match) {
      matchedBaseIds.add(match.id);
      mergedList.push({
        ...supp,
        bookPage: match.bookPage,
        pdfPage: match.pdfPage,
      });
    } else {
      mergedList.push(supp);
    }
  }

  for (const custom of customItems) {
    const normC = normalizeStotraTitleForDedup(custom.title);
    const alreadyExists = mergedList.some((m) => normalizeStotraTitleForDedup(m.title) === normC);
    if (!alreadyExists) {
      mergedList.push(custom);
    }
  }

  for (const base of baseItems) {
    if (!matchedBaseIds.has(base.id)) {
      mergedList.push(base);
    }
  }

  let all = mergedList;

  if (deityId && deityId !== 'all') {
    all = all.filter((item) => item.deityId === deityId);
  }
  if (genreId && genreId !== 'all') {
    all = all.filter((item) => (item.genre || classifyStotraGenre(item.title)) === genreId);
  }
  return all;
}

export function getDeityById(id: string): DeitySphere | undefined {
  return CANONICAL_DEITIES.find((d) => d.id === id);
}

export function getDarshanById(id: DarshanId): DarshanSphere | undefined {
  return CANONICAL_DARSHANS.find((d) => d.id === id);
}

export function findStotraById(id: string | number): ScriptureItem | undefined {
  const all = getAllStotrasForDarshan();
  return all.find((s) => String(s.id) === String(id));
}
