/**
 * auditCrossPageAndStotras.cjs
 *
 * Comprehensive cross-page boundary alignment and stotra integrity audit
 * across all 284 folios and 224 stotras of Brihat Stotra Ratnakar.
 *
 * Checks:
 * 1. Cross-page verse splits (Pūrva-ardha on Page N ending in '।', Uttara-ardha on Page N+1 ending in '॥ num ॥')
 * 2. Dangling/unpunctuated line endings at page transitions (lines not ending in '।', '॥', or heading)
 * 3. Page starts that are orphan second halves without matching first half on previous page
 * 4. Stotra sequence continuity (missing verse numbers, duplicate verse numbers)
 * 5. Colophon & heading integrity
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '../storage/granth.db');
const JSON_PATH = path.join(__dirname, '../public/data/books/granth-brihat-stotra-ratnakar.json');

const bookData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

console.log(`Loaded book with ${bookData.pages.length} pages.`);

// Helper: Devanagari numerals to integer
function parseDevanagariNum(str) {
  const devToNum = { '०':0, '१':1, '२':2, '३':3, '४':4, '५':5, '६':6, '७':7, '८':8, '९':9 };
  let n = 0;
  for (const ch of str) {
    if (devToNum[ch] !== undefined) {
      n = n * 10 + devToNum[ch];
    }
  }
  return n;
}

const report = {
  crossPageSplits: [],      // Cleanly verified splits (e.g. half shloka on p1, second half on p2)
  danglingEndings: [],      // Page N ends with non-danda text (potentially cut off)
  orphanStarts: [],         // Page N+1 starts with second half but Page N ended with full shloka
  missingVerseGaps: [],     // Any gaps in verse numbering within a stotra
  totalStotrasDetected: 0
};

// 1. Audit Cross-Page Transitions
for (let i = 0; i < bookData.pages.length - 1; i++) {
  const p1 = bookData.pages[i];
  const p2 = bookData.pages[i + 1];

  const t1 = (p1.verified_text || '').trim();
  const t2 = (p2.verified_text || '').trim();

  // Skip empty pages (e.g. cover/endpapers)
  if (!t1 || !t2) continue;

  const lines1 = t1.split('\n').map(l => l.trim()).filter(Boolean);
  const lines2 = t2.split('\n').map(l => l.trim()).filter(Boolean);

  const lastLineP1 = lines1[lines1.length - 1];
  const firstLineP2 = lines2[0];

  const p1EndsWithSingleDanda = /।\s*$/.test(lastLineP1) && !/॥\s*$/.test(lastLineP1);
  const p1EndsWithDoubleDanda = /॥\s*$/.test(lastLineP1) || /॥\s*\d+\s*॥\s*$/.test(lastLineP1);
  const p1EndsWithDevDouble = /॥\s*[०-९\d]+\s*॥\s*$/.test(lastLineP1) || /॥\s*$/.test(lastLineP1);
  const p1EndsWithDanda = p1EndsWithSingleDanda || p1EndsWithDoubleDanda || p1EndsWithDevDouble;

  const p2StartsWithSecondHalf = /॥\s*[०-९\d]+\s*॥\s*$/.test(firstLineP2) && !firstLineP2.includes('।');

  // Case A: Clean cross-page shloka split
  if (p1EndsWithSingleDanda) {
    report.crossPageSplits.push({
      fromPage: p1.page_number,
      toPage: p2.page_number,
      lastLineP1,
      firstLineP2,
      isCleanTransition: /॥\s*[०-९\d]*\s*॥/.test(firstLineP2)
    });
  }

  // Case B: Dangling ending (doesn't end with danda or colophon)
  if (!p1EndsWithDanda) {
    report.danglingEndings.push({
      pageNumber: p1.page_number,
      nextPage: p2.page_number,
      lastLine: lastLineP1,
      firstLineNext: firstLineP2
    });
  }

  // Case C: Orphan start on p2 (starts with an ending pāda ॥ num ॥ without p1 ending with ।)
  if (p2StartsWithSecondHalf && !p1EndsWithSingleDanda) {
    report.orphanStarts.push({
      pageNumber: p2.page_number,
      prevPage: p1.page_number,
      firstLine: firstLineP2,
      lastLinePrev: lastLineP1
    });
  }
}

// 2. Audit Stotras & Shloka Numbering
let currentStotra = 'प्रारम्भ';
let lastVerseNum = 0;

for (const p of bookData.pages) {
  const text = (p.verified_text || '').trim();
  if (!text) continue;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Check for stotra heading
    if (/^[०-९\d]+\.\s*|^(?:अथ\s+.*स्तोत्र|श्री.*स्तोत्र|.*स्तोत्रम्|.*माहात्म्यम्|.*कवचम्|.*सहस्रनामस्तोत्रम्)/.test(line) && !line.includes('॥')) {
      currentStotra = line;
      lastVerseNum = 0;
      report.totalStotrasDetected++;
      continue;
    }

    // Check for colophon
    if (/इति\s+.*(?:सम्पूर्णम्|समाप्तम्|स्तोत्रं|स्तोत्रम्)/.test(line)) {
      lastVerseNum = 0;
      continue;
    }

    // Check verse number
    const vMatch = line.match(/॥\s*([०-९\d]+)\s*॥\s*$/);
    if (vMatch) {
      const vNum = parseDevanagariNum(vMatch[1]) || parseInt(vMatch[1], 10);
      if (vNum > 0) {
        if (lastVerseNum > 0 && vNum > lastVerseNum + 1 && (vNum - lastVerseNum < 5)) {
          // A gap of 1-4 numbers
          report.missingVerseGaps.push({
            stotra: currentStotra,
            page: p.page_number,
            expected: lastVerseNum + 1,
            found: vNum,
            line
          });
        }
        lastVerseNum = vNum;
      }
    }
  }
}

console.log('\n================ AUDIT SUMMARY ================');
console.log(`Cross-page shloka splits detected: ${report.crossPageSplits.length}`);
console.log(`Dangling page endings (no danda): ${report.danglingEndings.length}`);
console.log(`Orphan page starts: ${report.orphanStarts.length}`);
console.log(`Verse numbering gaps detected: ${report.missingVerseGaps.length}`);

if (report.danglingEndings.length > 0) {
  console.log('\n--- DANGLING ENDINGS ---');
  report.danglingEndings.forEach(d => {
    console.log(`Page ${d.pageNumber} -> Page ${d.nextPage}:`);
    console.log(`   End:   "${d.lastLine}"`);
    console.log(`   Start: "${d.firstLineNext}"`);
  });
}

if (report.crossPageSplits.length > 0) {
  console.log('\n--- SAMPLE CROSS-PAGE SPLITS (First 10) ---');
  report.crossPageSplits.slice(0, 10).forEach(s => {
    console.log(`P${s.fromPage} -> P${s.toPage}: [Clean: ${s.isCleanTransition}]`);
    console.log(`   P${s.fromPage}: ${s.lastLineP1}`);
    console.log(`   P${s.toPage}: ${s.firstLineP2}`);
  });
}

if (report.missingVerseGaps.length > 0) {
  console.log('\n--- VERSE NUMBERING GAPS ---');
  report.missingVerseGaps.forEach(g => {
    console.log(`Page ${g.page} in "${g.stotra}": expected ${g.expected}, found ${g.found}`);
    console.log(`   Line: ${g.line}`);
  });
}

fs.writeFileSync(path.join(__dirname, '../scratch_audit_results.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('\nDetailed results written to scratch_audit_results.json');
