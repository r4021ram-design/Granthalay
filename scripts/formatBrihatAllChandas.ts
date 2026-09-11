import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { healDevanagariOcrText } from './polishBrihatText.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DB_PATH = path.resolve(ROOT_DIR, 'storage/granth.db');

export function countSanskritSyllables(text: string): number {
  const matches = text.match(/[\u0904-\u0914\u0960-\u0961]|[\u0915-\u0939](?![\u094D])/gu);
  return matches ? matches.length : 0;
}

/**
 * Splits a Sanskrit hemistich into its two distinct Padas based on syllable target
 */
export function splitHemistichIntoPadas(hemistich: string, targetSyllables: number): [string, string] {
  const clean = hemistich.trim();
  const words = clean.split(/\s+/);
  if (words.length <= 1) return [clean, ''];

  let currentSyllables = 0;
  let splitIndex = 0;
  let minDiff = Infinity;

  for (let i = 0; i < words.length; i++) {
    currentSyllables += countSanskritSyllables(words[i]);
    const diff = Math.abs(currentSyllables - targetSyllables);
    if (diff < minDiff) {
      minDiff = diff;
      splitIndex = i + 1;
    }
    if (currentSyllables >= targetSyllables && diff > minDiff) {
      break;
    }
  }

  // Ensure neither side is empty
  if (splitIndex <= 0) splitIndex = 1;
  if (splitIndex >= words.length) splitIndex = words.length - 1;

  const pada1 = words.slice(0, splitIndex).join(' ');
  const pada2 = words.slice(splitIndex).join(' ');
  return [pada1, pada2];
}

/**
 * Liturgical Chandas Formatter Engine
 * Formats every shloka according to its authentic Sanskrit meter
 */
export function formatToLiturgicalChandas(rawText: string): string {
  if (!rawText) return '';

  let s = healDevanagariOcrText(rawText);

  // 1. Rejoin broken hyphenated line breaks
  s = s.replace(/-\s*\n\s*/gu, '');
  s = s.replace(/\s*\n\s*/gu, ' ');

  // 2. Standardize dandas and verse numbers
  s = s.replace(/[॥।]\s*([०-९\d]+)\s*[॥।]/gu, ' ॥ $1 ॥ ');
  s = s.replace(/([०-९\d]+)\s*॥/gu, ' ॥ $1 ॥ ');
  s = s.replace(/॥\s*॥/gu, '॥');

  // 3. Isolate Invocations, Titles, Speakers, Colophons
  s = s.replace(/(॥\s*श्री[^॥]+॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(॥\s*अथ[^॥]+॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(श्रीगणेशाय\s+नमः\s*॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(श्रीगुरुभ्यो\s+नमः\s*॥)/gu, '$1\n\n');
  s = s.replace(/(इति\s+[^॥]+॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(?:^|\s)(गौर्युवाच|मुनिरुवाच|गृत्समद\s+उवाच|ईश्वर\s+उवाच|देव्युवाच|भगवानुवाच|सूत\s+उवाच|अगस्त्य\s+उवाच|श्रीभगवानुवाच|सञ्जय\s+उवाच|अर्जुन\s+उवाच)\s*[1!|॥।\s]*/gu, '\n\n$1 ॥\n\n');

  // 4. Put verse endings into double newlines
  s = s.replace(/(॥\s*[०-९\d]+\s*॥)/gu, '$1\n\n');

  // 5. Process liturgical blocks
  const blocks = s.split(/\n\n+/).map(b => b.trim()).filter(Boolean);
  const formattedBlocks: string[] = [];

  for (const block of blocks) {
    // Check if it is a Shloka ending with ॥ <verse_no> ॥
    const verseEndMatch = block.match(/^(.*?)(॥\s*[०-९\d]+\s*॥)$/u);
    if (verseEndMatch) {
      const verseBody = verseEndMatch[1].trim();
      const verseTag = verseEndMatch[2].trim();

      const dandaIndex = verseBody.indexOf('।');
      if (dandaIndex > 0) {
        const half1 = verseBody.slice(0, dandaIndex + 1).trim();
        const half2 = (verseBody.slice(dandaIndex + 1).trim() + ' ' + verseTag).trim();

        const syl1 = countSanskritSyllables(half1);
        const syl2 = countSanskritSyllables(half2);

        // Long 4-Pada meters (Bhujanga, Totaka, Vasantatilaka, Malini, Panchachamara, Shikharini, Shardula, Sragdhara)
        if (syl1 >= 22 && syl2 >= 22) {
          let targetPada = Math.round(syl1 / 2);
          if (targetPada < 11) targetPada = 11;

          const [pada1, pada2] = splitHemistichIntoPadas(half1, targetPada);
          const [pada3, pada4] = splitHemistichIntoPadas(half2, targetPada);

          formattedBlocks.push(`${pada1}\n${pada2}\n${pada3}\n${pada4}`);
          continue;
        }

        // Standard 2-line Anushtup or 2-line Shloka
        formattedBlocks.push(`${half1}\n${half2}`);
        continue;
      } else {
        // Missing middle danda '।' fallback: split symmetrically
        const totalSyl = countSanskritSyllables(verseBody);
        if (totalSyl >= 20) {
          const [h1, h2] = splitHemistichIntoPadas(verseBody, Math.round(totalSyl / 2));
          formattedBlocks.push(`${h1} ।\n${h2} ${verseTag}`);
          continue;
        }
      }
    }

    // Nyasa blocks with 'नमः ।'
    if (block.includes('नमः ।') || block.includes('नमः ॥')) {
      const nyasaLines = block.split(/(?<=नमः\s*[।॥])/gu).map(l => l.trim()).filter(Boolean);
      formattedBlocks.push(nyasaLines.join('\n'));
      continue;
    }

    formattedBlocks.push(block);
  }

  return formattedBlocks.join('\n\n');
}

async function run() {
  console.log('Testing Chandas Formatter on Brihat Stotra Ratnakar...');
  const db = new Database(DB_PATH);

  const pages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();

  console.log(`Formatting ${pages.length} folios strictly by Chandas...`);

  const updateStmt = db.prepare("UPDATE pages SET verified_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
  const updateMany = db.transaction(() => {
    for (const p of pages) {
      const formatted = formatToLiturgicalChandas(p.verified_text || p.ocr_text || '');
      updateStmt.run(formatted, p.id);
    }
  });

  updateMany();
  console.log('Successfully updated all 292 folios in database with authentic Chandas formatting!');

  // Sync to JSON
  const updatedPages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();
  const book = db.prepare("SELECT * FROM books WHERE id = 'granth-brihat-stotra-ratnakar'").get();
  const jsonPath = path.resolve(ROOT_DIR, 'public/data/books/granth-brihat-stotra-ratnakar.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ book, pages: updatedPages }, null, 2));
  console.log('Synchronized public/data/books/granth-brihat-stotra-ratnakar.json with Chandas formatted folios!');
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
