---
name: granth-folio-page-healing
description: Comprehensive standard and deterministic operational engine for inspecting original high-resolution folio scans, proofreading Sanskrit scriptures with 100% liturgical fidelity, and synchronizing verified texts across SQLite and JSON databases in Granthalay. Incorporates empirical error models and cross-page split typologies from Pages 1 to 202+ of Brihat Stotra Ratnakar.
---

# Granth Folio Page Healing & Scripture Verification Standard
*(Empirically Codified from Full-Grantha Audits: Pages 1 to 202+)*

## 1. Core Purpose & Absolute Axioms

This skill is the master operational standard for digitizing, proofreading, and verifying Sanskrit and Vedic scriptures in **ग्रन्थालय (Granthalay)**. It incorporates the empirical wisdom, error patterns, and layout quirks discovered across all healed sections of *बृहत्स्तोत्ररत्नाकर* (Venkateshwar Press / Khemraj Shrikrishnadas edition), including:
- **गणेशस्तोत्राणि** (Pages 1–21)
- **विष्णुस्तोत्राणि** (Pages 22–63)
- **शिवस्तोत्राणि** (Pages 64–95)
- **सूर्यस्तोत्राणि व देवीस्तोत्राणि** (Pages 96–126)
- **लक्ष्मीस्तोत्राणि व गायत्रीस्तोत्राणि** (Pages 127–144)
- **दत्तात्रेयस्तोत्राणि** (Pages 145–160)
- **रामस्तोत्राणि** (Pages 161–190)
- **हनुमत्स्तोत्राणि** (Pages 191–196)
- **कृष्णस्तोत्राणि** (Pages 197–202+)

### The 3 Absolute Axioms:
1. **Original Scan Supremacy (पोथी-स्कैन सर्वोच्चता)**:
   The physical book scan in `storage/pages/<book_id>/page-<XYZ>.png` is the **sole ground truth**.
   - External websites (Wikisource, SanskritDocuments, Gita Press editions, blogs) frequently use different recensions, regional variants, altered verses, or different verse numbering.
   - They may be consulted **strictly to disambiguate unreadable/broken ink**, NEVER to overwrite the book's printed words or alter its numbering.
2. **Cross-Page Folio Continuity (पृष्ठ-सन्धि अखण्डता)**:
   Traditional Indian scriptures continuously print texts across folio pages.
   - When a compound, sentence, or shloka splits mid-line across page boundaries, the trailing fragment belongs to page $N$, and the starting fragment belongs to page $N+1$.
   - The closing danda and verse number must remain exactly where the book prints them.
3. **Dual Persistence Synchronization (द्विविध डेटा समक्रमण)**:
   Every healed page must be atomically updated in **both**:
   - SQLite Database: `storage/granth.db` (`pages` table: `verified_text`, `status = 'VERIFIED'`, `unresolved_issue_count = 0`).
   - Book JSON File: `public/data/books/<book_id>.json` (`verified_text`, `status = 'VERIFIED'`, `unresolved_issue_count = 0`).

---

## 2. Empirical Cross-Page Split Typology (Discovered across Pages 1–202)

Across the 200+ pages healed in this project, cross-page boundaries fall into 6 distinct structural categories. The healing script must handle each category deterministically:

### Category A: Compound Hyphenation Split (सामासिक पद-विभाजन)
A long Sanskrit Samasa is hyphenated at the bottom margin of page $N$ and completed at the top of page $N+1$:
- **Page 66 $\to$ 67**: `...भस्मोद्धूलित-` (p. 66 end) $\to$ `विग्रहम्...` (p. 67 start).
- **Page 149 $\to$ 150**: `स्थितं मूलाधारे कनक-` (p. 149 end) $\to$ `रुचिरम्...` (p. 150 start).
- **Page 158 $\to$ 159**: `दुरापारसंसार-` (p. 158 end) $\to$ `समुद्रतारणम्...` (p. 159 start).
- **Page 166 $\to$ 167**: `नमामि यज्ञफलदं यज्ञकर्म-` (p. 166 end) $\to$ `फलप्रदम्...` (p. 167 start).
- **Page 174 $\to$ 175**: `विज्ञानमज्ञान-` (p. 174 end) $\to$ `ध्वान्तभास्करम्...` (p. 175 start).
- **Rule**: Retain the trailing hyphen `-` at the end of page $N$. Start page $N+1$ directly with the continuation word without adding an artificial danda at the bottom of page $N$.

### Category B: Sandhi Splitting Mid-Word (सन्धि पद-विभाजन)
Classical typesetting splits words mid-sandhi across folios:
- **Page 194 $\to$ 195**: `यस्तु पठे-` (p. 194 end) $\to$ `न्नित्यं...` (p. 195 start) [from `पठेन्नित्यं`].
- **Page 201 $\to$ 202**: `तव प्रीत्यै भूया-` (p. 201 end) $\to$ `दहमपि च दासस्तव...` (p. 202 start) [from `भूयादहमपि` = `भूयात्` + `अहमपि`].
- **Rule**: Never reconstruct the un-sandhied root if the scan shows the hyphenated sandhi ligature. Preserve the exact visual break so reading continuity matches the printed folio.

### Category C: Hemistich Split (अर्धश्लोक-विभाजन)
The first half (पूर्वार्ध) of an Anushtubh or Upajati appears at the bottom of page $N$, and the second half (उत्तरार्ध) with `॥ N ॥` appears at the top of page $N+1$:
- **Page 145 $\to$ 146**: `त्वया सृष्टं चादौ हृतमथ पुनर्विहितमधुना` (p. 145 end) $\to$ `तदेव त्वं शम्भो... ॥ १ ॥` (p. 146 start).
- **Page 151 $\to$ 152**: `भृङ्गालीगृहमिदमभूद्भासितमिति त्वदीये` (p. 151 end) $\to$ `... ॥ २ ॥` (p. 152 start).
- **Page 171 $\to$ 172**: `निरञ्जनं निष्प्रतिमं निरीहं निराधयं निष्कलमप्रपञ्चम् । नित्यं` (p. 171 end) $\to$ `... ॥ ५ ॥` (p. 172 start).
- **Page 197 $\to$ 198**: `गोपीजनपदवल्लभाय स्वाहाननं मम । अष्टादशाक्षरो मन्त्रः कण्ठं` (p. 197 end) $\to$ `पातु दशाक्षरः ॥ १२ ॥` (p. 198 start).
- **Rule**: Page $N$ ends with the single danda `।` (or unpunctuated hemistich). Page $N+1$ line 1 contains the second hemistich ending in `॥ <Verse_Number> ॥`. **Do not** add `॥ <Verse_Number> ॥` to both pages!

### Category D: Viniyoga & Sankalpa Split (विनियोग-सङ्कल्प विभाजन)
Ritual introductory prose or Viniyoga splitting at folio turn:
- **Page 154 $\to$ 155**: `अस्य श्रीदत्तात्रेयस्तोत्र-` (p. 154 end) $\to$ `मन्त्रस्य भगवान् नारद ऋषिः...` (p. 155 start).
- **Page 192 $\to$ 193**: `ॐ नमो भगवते पञ्चवदनाय` (p. 192 end) $\to$ `पूर्वकपिमुखाय...` (p. 193 start).
- **Rule**: Check whether the trailing line is an introductory label or part of the Viniyoga sentence. Ensure no Viniyoga phrase is lost between pages.

### Category E: Prose / Gadya / Churna Continuous Flow (गद्य / चूर्णिका प्रवाह)
Long Tantrik or Pauranic prose passages without metrical line stops:
- **Page 66 $\to$ 67 (Shiva Kavacham)**: Continuous enumeration of 40+ divine names and weapons (`खट्वाङ्गखड्गचर्मपाशाङ्कुशडमरुशूल...`).
- **Rule**: Maintain unbroken single spaces between prose words. Only insert line breaks where logical pause dandas `।` or section breaks exist in the original print.

### Category F: Multi-Stotra Interleaving on a Single Page (एके पृष्ठे अनेकस्तोत्राणि)
A stotra completes at the top or middle of a page, and the next stotra begins immediately below it:
- **Page 199**: Ends *१. त्रैलोक्यमङ्गलकवचम्* (Verse 41 + colophon), then immediately begins *२. श्रीबालरक्षा* (Viniyoga + Verses 1–7).
- **Page 200**: Completes *२. श्रीबालरक्षा* (Verse 8 + colophon), then begins *३. श्रीकृष्णस्तवराजः* (Verses 1–17 + half of 18).
- **Page 201**: Completes *३. श्रीकृष्णस्तवराजः* (Verses 18–20 + colophon), then begins *४. भगवन्मानसपूजा* (Verses 1–8 + half of 9).
- **Rule**: Each stotra must have its clear title, Mangalacharana (`श्रीगणेशाय नमः ॥`), Uvacha headings, and independent verse numbering starting from `॥ १ ॥`.

---

## 3. Venkateshwar Press / Khemraj Lithograph OCR Confusion Matrix

Raw OCR engines systematically misread early 20th-century Devanagari typesets. Use this empirical lookup matrix when verifying difficult words:

| Category | OCR Corruption | Authentic Sanskrit | Context & Real Example |
|---|---|---|---|
| **Consonant Confusion** | `वित` | `क्ति` | `सुवित षितदः` $\to$ `भुक्तिमुक्तिदः` (p. 197) |
| | `तत` | `त्त` | `ततत्वमसि` $\to$ `तत्त्वमसि` (p. 1) |
| | `जित्यम्` | `नित्यम्` | Confusion of dental `न` with palatal `ज` (p. 1) |
| | `च` vs `व` | `चेद` $\leftrightarrow$ `वेद` | `यदि चेत्` misread as `यदि वेत्` |
| | `ध` vs `घ` vs `द` | `अघौघं` $\leftrightarrow$ `अधौधं` | `हरत्येवाघौघं` (p. 147) |
| | `ब` vs `व` | `बन्ध` $\leftrightarrow$ `वन्ध` | Classical texts distinguish `ब` and `व` |
| **Conjunct Ligatures** | `गल्लं` | `कङ्कालं` | `कृष्णकं गल्लं` $\to$ `कृष्णकङ्कालं` (p. 198) |
| | `मणितते` | `अजित ते` | `पुष्पाञ्जलिरजित ते` misread as `मणितते` (p. 201) |
| | `ह्य` vs `ह्म` | `ब्रह्म` $\leftrightarrow$ `ब्रह्य` | `ब्रह्ममन्त्रौघ` misread as `ब्रह्यमन्त्रौघ` |
| | `ह्न` vs `ह्ण` | `चिह्न` $\leftrightarrow$ `चिह्ण` | `सुचिह्नौ ते पादौ` (p. 201) |
| | `ष्ट` vs `ष्ठ` | `वरदृप्तान्` vs `वरदृष्ठान्` | Misreading retroflex sibilant conjuncts |
| **Sibilants (श/ष/स)** | `स` for `श` | `शठाय` $\leftrightarrow$ `सठाय` | `शठाय परशिष्याय` (p. 197) |
| | `ष` for `श` | `विशाल` $\leftrightarrow$ `विषाल` | Adjective forms |
| | `श` for `स` | `सकल` $\leftrightarrow$ `शकल` | `सकलदुरितध्वंसन` (p. 201) |
| **Anusvara & Nasals** | Dropped Anusvara | `ं` lost over `ी/े/ै` | `कवचं प्रपठेत्ततः` OCR read `कवच प्रपठेत्ततः` |
| | `ङ्क / ङ्ख / ङ्ग` | `अङ्क / शङ्ख / अङ्ग` | Book alternates between Anusvara and class nasal |
| **Avagraha (`ऽ`)** | `5`, `'`, `s`, `s` | `ऽ` | `कोऽपि`, `सदाऽवतु`, `नरोऽपि`, `सोऽहम्` |
| **Visarga (`ः`)** | `:`, `!`, `8`, `;` | `ः` | `नम:` or `नम!` $\to$ `नमः` |
| **Punctuation & Danda** | `||`, `11`, `। ।` | `॥` | Standard double danda around verse numbers `॥ N ॥` |

---

## 4. Standard Operating Procedure (SOP) Step-by-Step

Whenever assigned a batch of pages (e.g. `healPages203to208`):

### Step 1: Query Database for Image Paths & Initial State
```bash
node -e "const db = require('better-sqlite3')('storage/granth.db'); console.log(db.prepare(\"SELECT page_number, original_image_path, status FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' AND page_number BETWEEN <START> AND <END>\").all());"
```

### Step 2: Inspect Scans Visually with `view_file`
Call `view_file` directly on each image path:
- Inspect header: e.g. `(२०९) बृहत्स्तोत्ररत्नाकरे` or `कृष्णस्तोत्राणि (२१०)`.
- Inspect previous page ending: does it split into line 1 of current page?
- Inspect current page ending: does it split into next page?
- Note exact verse numbers, stotra transitions, and colophons (`इति...`).

### Step 3: Proofread Sanskrit Text Against the Image
- Ensure Anushtubh shlokas have 32 syllables ($8 \times 4$).
- Preserve book-specific readings (e.g. if book says `वदामि वै`, do not alter to `वदामि ते`).
- Verify Avagraha `ऽ`, Halanta `्`, and Visarga `ः` throughout.

### Step 4: Write & Execute Dual-Sync Healing Script
Create `scripts/healPages<Start>to<End>.cjs` following the repository pattern:
```javascript
const fs = require('fs');
const Database = require('better-sqlite3');

const jsonPath = 'public/data/books/granth-brihat-stotra-ratnakar.json';
const dbPath = 'storage/granth.db';

const book = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const db = new Database(dbPath);

const healedPages = {
  <PAGE_NUM>: `(फॉलिओ_शीर्षक)
...
श्लोक_पाठ
...`,
  // Next pages in sequence...
};

const updateStmt = db.prepare(`
  UPDATE pages 
  SET verified_text = ?, 
      status = 'VERIFIED',
      unresolved_issue_count = 0,
      updated_at = datetime('now')
  WHERE book_id = 'granth-brihat-stotra-ratnakar' AND page_number = ?
`);

for (const [pageNumStr, text] of Object.entries(healedPages)) {
  const pageNum = parseInt(pageNumStr, 10);
  const info = updateStmt.run(text, pageNum);
  const pageObj = book.pages.find(p => p.page_number === pageNum);
  if (pageObj) {
    pageObj.verified_text = text;
    pageObj.status = 'VERIFIED';
    pageObj.unresolved_issue_count = 0;
    pageObj.updated_at = new Date().toISOString();
  }
  console.log(`Page ${pageNum}: SQLite updated (${info.changes} rows affected), JSON updated.`);
}

fs.writeFileSync(jsonPath, JSON.stringify(book, null, 2), 'utf8');
db.close();
console.log("Database and JSON successfully synchronized.");
```

### Step 5: Execute and Run Regression Checks
```bash
node scripts/healPages<Start>to<End>.cjs
npm test
```

---

## 5. Verification Checklist Before Finalizing
- [ ] Direct scan visual inspection performed via `view_file` for all pages in batch.
- [ ] Cross-page continuity verified with previous page ($N-1$) and next page ($N+1$).
- [ ] No verse numbers shifted or duplicated.
- [ ] No external text substituted for printed folio text.
- [ ] Both SQLite database and JSON file verified updated with matching text.
- [ ] Test suite passes without regression.
