import fs from 'fs';
import { countSanskritSyllables, splitHemistichIntoPadas } from './formatBrihatAllChandas.js';

const book = JSON.parse(fs.readFileSync('public/data/books/granth-brihat-stotra-ratnakar.json', 'utf8'));
let rawP10 = book.pages[9].ocr_text || book.pages[9].verified_text;

export function healPunctuationAndDandas(raw: string): string {
  let s = raw;

  // Specific OCR words healing
  s = s.replace(/श्रीगणेशायः/gu, 'श्रीगणेशाय');
  s = s.replace(/सुनिरुवाच|शुनिरुवाच/gu, 'मुनिरुवाच');
  s = s.replace(/(लमः|नसः)(?=\s*[।!|1॥])/gu, 'नमः');
  s = s.replace(/नमः\s*[!|1]/gu, 'नमः ।');
  s = s.replace(/चिबुके\s*ब्रह्मणस्पतये\s*नमः\s*!/gu, 'चिबुके ब्रह्मणस्पतये नमः ।');
  s = s.replace(/दक्षिणनेत्रे\s*विकटाय(?!\s*नमः)/gu, 'दक्षिणनेत्रे विकटाय नमः ।');
  s = s.replace(/बद्धुमहंसि/gu, 'बद्धुमर्हसि');
  s = s.replace(/सहगतं\s*विनायक/gu, 'सिंहगतं विनायक');
  s = s.replace(/सवेदा/gu, 'सर्वदा');
  s = s.replace(/सुमहोतकटः/gu, 'सुमहोत्कटः');
  s = s.replace(/ध्ूयुगं|धूयुगं/gu, 'भ्रूयुगं');
  s = s.replace(/दंतान्‌/gu, 'दन्तान्‌');
  s = s.replace(/कठं\s*पातु/gu, 'कण्ठं पातु');
  s = s.replace(/स्कंधौ/gu, 'स्कन्धौ');
  s = s.replace(/गजस्कंधः/gu, 'गजस्कन्धः');
  s = s.replace(/हेरंबो/gu, 'हेरम्बो');
  s = s.replace(/चिन्तिताथप्रदः/gu, 'चिन्तितार्थप्रदः');
  s = s.replace(/धराधरः\s*पातु\s*पाश्वे/gu, 'धराधरः पातु पार्श्वे');
  s = s.replace(/विष्नहरः/gu, 'विघ्नहरः');
  s = s.replace(/लिगं\s*गुह्यं/gu, 'लिङ्गं गुह्यं');
  s = s.replace(/जानुजंघे\s*ऊरू\s*मंगलमूतिमान्/gu, 'जानुजङ्घे ऊरू मङ्गलमूर्तिमान्');
  s = s.replace(/एकदंतो/gu, 'एकदन्तो');
  s = s.replace(/पादौ\s*गुल्फो/gu, 'पादौ गुल्फौ');
  s = s.replace(/पाणी/gu, 'पाणी');
  s = s.replace(/अड-?\s*गुलीश्च/gu, 'अङ्गुलीश्च');
  s = s.replace(/पद्महस्तोऽरिनाशनः/gu, 'पद्महस्तोऽरिनाशनः');
  s = s.replace(/परात्परः!/gu, 'परात्परः ।');

  // Multi-danda and broken OCR verse number normalization
  // e.g. "॥*८ ॥" -> "॥ ८ ॥"
  s = s.replace(/॥\s*[\*]\s*([०-९\d]+)\s*॥/gu, ' ॥ $1 ॥ ');
  
  // e.g. "॥1 ७ 11" -> "॥ ७ ॥"
  s = s.replace(/[॥।1!|]+\s*([०-९\d]+)\s*[॥।1!|]+/gu, ' ॥ $1 ॥ ');

  // e.g. "॥ ५ " followed by Devanagari letter without closing danda
  s = s.replace(/॥\s*([०-९\d]+)\s*(?=[\u0905-\u0939])/gu, ' ॥ $1 ॥ ');

  // Speakers: गौर्युवाच 1! -> गौर्युवाच ॥
  s = s.replace(/(गौर्युवाच|मुनिरुवाच|ईश्वर\s+उवाच|देव्युवाच|सूत\s+उवाच)\s*[1!|॥।]+/gu, '\n\n$1 ॥\n\n');

  // Standardize single and double dandas
  s = s.replace(/[!|]/gu, '।');
  s = s.replace(/।\s*।/gu, '॥');
  s = s.replace(/॥\s*॥/gu, '॥');

  return s;
}

export function formatPageLiturgical(raw: string): string {
  let s = healPunctuationAndDandas(raw);

  // Rejoin hyphens across lines
  s = s.replace(/-\s*\n\s*/gu, '');
  s = s.replace(/\s*\n\s*/gu, ' ');

  // Put newlines around verse endings
  s = s.replace(/(॥\s*[०-९\d]+\s*॥)/gu, '$1\n\n');

  // Invocations & colophons
  s = s.replace(/(॥\s*श्री[^॥]+॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(श्रीगणेशाय\s+नमः\s*॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(इति\s+[^॥]+॥)/gu, '\n\n$1\n\n');

  const blocks = s.split(/\n\n+/).map(b => b.trim()).filter(Boolean);
  const formattedBlocks: string[] = [];

  for (const block of blocks) {
    // If verse ends with ॥ no ॥
    if (/॥\s*[०-९\d]+\s*॥$/u.test(block)) {
      const dandaIndex = block.indexOf('।');
      if (dandaIndex > 0) {
        const half1 = block.slice(0, dandaIndex + 1).trim();
        const half2 = block.slice(dandaIndex + 1).trim();

        const syl1 = countSanskritSyllables(half1);
        const syl2 = countSanskritSyllables(half2);

        if (syl1 >= 22 && syl2 >= 22) {
          const targetPada = Math.round(syl1 / 2);
          const [p1, p2] = splitHemistichIntoPadas(half1, targetPada);
          const [p3, p4] = splitHemistichIntoPadas(half2, targetPada);
          formattedBlocks.push(`${p1}\n${p2}\n${p3}\n${p4}`);
          continue;
        }

        formattedBlocks.push(`${half1}\n${half2}`);
        continue;
      }
    }

    // Nyasa lines
    if (block.includes('नमः ।') || block.includes('नमः ॥')) {
      const nyasaLines = block.split(/(?<=नमः\s*[।॥])/gu).map(l => l.trim()).filter(Boolean);
      formattedBlocks.push(nyasaLines.join('\n'));
      continue;
    }

    formattedBlocks.push(block);
  }

  return formattedBlocks.join('\n\n');
}

console.log('=== HEALED & FORMATTED PAGE 10 ===\n');
const result = formatPageLiturgical(rawP10);
console.log(result);
