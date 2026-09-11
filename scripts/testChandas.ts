import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { healDevanagariOcrText } from './polishBrihatText.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export function countSanskritSyllables(text: string): number {
  const matches = text.match(/[\u0904-\u0914\u0960-\u0961]|[\u0915-\u0939](?![\u094D])/gu);
  return matches ? matches.length : 0;
}

/**
 * Liturgical Chandas Formatter
 * Formats classical Sanskrit stotras into authentic metered stanzas:
 * - Anushtup (अनुष्टुप्): 2 symmetrical hemistichs (पूर्वार्ध । / उत्तरार्ध ॥ n ॥)
 * - 4-Pada meters (चतुष्पदी: शिखरिणी, शार्दूलविक्रीडित, तोटक, भुजङ्गप्रयात): 4 balanced lines
 * - Nyasa / Viniyoga / Namavali: individual liturgical lines
 */
export function formatToLiturgicalChandas(rawText: string): string {
  if (!rawText) return '';

  let s = healDevanagariOcrText(rawText);

  // Rejoin broken hyphenated words across lines
  s = s.replace(/-\s*\n\s*/gu, '');
  s = s.replace(/\s*\n\s*/gu, ' ');

  // Standardize double dandas with verse numbers
  s = s.replace(/[॥।]\s*([०-९\d]+)\s*[॥।]/gu, ' ॥ $1 ॥ ');
  s = s.replace(/([०-९\d]+)\s*॥/gu, ' ॥ $1 ॥ ');
  s = s.replace(/॥\s*॥/gu, '॥');

  // 1. Separate Invocations
  s = s.replace(/(॥\s*श्री[^॥]+॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(॥\s*अथ[^॥]+॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(श्रीगणेशाय\s+नमः\s*॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(श्रीगुरुभ्यो\s+नमः\s*॥)/gu, '$1\n\n');
  s = s.replace(/(इति\s+[^॥]+॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(गौर्युवाच\s*॥|मुनिरुवाच\s*॥|गृत्समद\s+उवाच\s*॥|ईश्वर\s+उवाच\s*॥|देव्युवाच\s*॥)/gu, '\n\n$1\n\n');

  // 2. Put newline after verse numbers (end of stanza)
  s = s.replace(/(॥\s*[०-९\d]+\s*॥)/gu, '$1\n\n');

  // Process blocks
  const blocks = s.split(/\n\n+/).map(b => b.trim()).filter(Boolean);
  const formattedBlocks: string[] = [];

  for (const block of blocks) {
    // If it's a verse ending with ॥ number ॥
    if (/॥\s*[०-९\d]+\s*॥$/u.test(block)) {
      // Check if it has a mid-verse danda '।'
      const dandaIndex = block.indexOf('।');
      if (dandaIndex > 0) {
        const half1 = block.slice(0, dandaIndex + 1).trim();
        const half2 = block.slice(dandaIndex + 1).trim();

        const syl1 = countSanskritSyllables(half1);
        const syl2 = countSanskritSyllables(half2);

        // Long meters (like Shikharini 17 syllables/pada, Shardula 19, Vasantatilaka 14, Bhujangaprayata 12)
        // If half1 has >= 22 syllables, it is a 4-line meter! Split each half into 2 padas
        if (syl1 >= 22 && syl2 >= 22) {
          const splitHalf = (half: string) => {
            const words = half.split(/\s+/);
            const mid = Math.ceil(words.length / 2);
            return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
          };
          const [p1, p2] = splitHalf(half1);
          const [p3, p4] = splitHalf(half2);
          formattedBlocks.push(`${p1}\n${p2}\n${p3}\n${p4}`);
          continue;
        }

        // Standard Anushtup (अनुष्टुप्) or 2-hemistich verse: exactly 2 lines
        formattedBlocks.push(`${half1}\n${half2}`);
        continue;
      }
    }

    // If it's a Nyasa sequence with multiple 'नमः ।'
    if (block.includes('नमः ।') || block.includes('नमः ॥')) {
      const nyasaLines = block.split(/(?<=नमः\s*[।॥])/gu).map(l => l.trim()).filter(Boolean);
      formattedBlocks.push(nyasaLines.join('\n'));
      continue;
    }

    // Default: format line
    formattedBlocks.push(block);
  }

  return formattedBlocks.join('\n\n');
}

const bookPath = path.resolve(ROOT_DIR, 'public/data/books/granth-brihat-stotra-ratnakar.json');
const book = JSON.parse(fs.readFileSync(bookPath, 'utf8'));

console.log('=== TEST CHANDAS FORMATTING ON PAGE 9 ===\n');
console.log(formatToLiturgicalChandas(book.pages[8].verified_text));

console.log('\n=== TEST CHANDAS FORMATTING ON PAGE 10 (GANESH KAVACHAM) ===\n');
console.log(formatToLiturgicalChandas(book.pages[9].verified_text).slice(0, 1000));
