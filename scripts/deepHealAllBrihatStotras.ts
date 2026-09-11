import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { countSanskritSyllables, splitHemistichIntoPadas } from './formatBrihatAllChandas.js';
import { stripRunningHeaderNoise } from './reconstructAllBrihatFolios.js';

const CANONICAL_PAGE_2 = `लम्बोदराय नमः ।
वामपादे एकदंताय नमः ।
शिरसि एकदंताय नमः ।
चिबुके ब्रह्मणस्पतये नमः ।
दक्षिणनासिकायां विनायकाय नमः ।
वामनासिकायां ज्येष्ठराजाय नमः ।
दक्षिणनेत्रे विकटाय नमः ।
वामनेत्रे कपिलाय नमः ।
दक्षिणकर्णे धरणीधराय नमः ।
वामकर्णे आशापूरकाय नमः ।
नाभौ महोदराय नमः ।
हृदये धूम्रकेतवे नमः ।
ललाटे मयूरेशाय नमः ।
दक्षिणबाहौ स्वानंदवासकारकाय नमः ।
वामबाहौ सच्चित्सुखधाम्ने नमः ॥

इति गणेशन्यासः ॥

॥ श्रीगणेशाय नमः ॥

गौर्युवाच ॥

एषोऽतिचपलो दैत्यान्बाल्येऽपि नाशयत्यहो ।
अग्रे किं कर्म कर्तेति न जाने मुनिसत्तम ॥ १ ॥

दैत्या नानाविधा दुष्टाः साधुदेवद्रुहः खलाः ।
अतोऽस्य कंठे किंचित्त्वं रक्षार्थं बद्धुमर्हसि ॥ २ ॥

मुनिरुवाच ॥

ध्यायेत् सिंहगतं विनायकममुं दिग्बाहुमाद्ये युगे
त्रेतायां तु मयूरवाहनममुं षड्बाहुकं सिद्धिदम् ।
द्वापरे तु गजाननं युगभुजं रक्तांगरागं विभुं
तुर्ये तु द्विभुजं सितांगरुचिरं सर्वार्थदं सर्वदा ॥ ३ ॥

विनायकः शिखां पातु परमात्मा परात्परः ।
अतिसुन्दरकायस्तु मस्तकं सुमहोत्कटः ॥ ४ ॥

ललाटं कश्यपः पातु भ्रूयुगं तु महोदरः ।
नयने भालचंद्रस्तु गजास्यस्त्वोष्ठपल्लवौ ॥ ५ ॥

जिह्वां पातु गणक्रीडश्चिबुकं गिरिजासुतः ।
वाचं विनायकः पातु दंतान् रक्षतु दुर्मुखः ॥ ६ ॥

श्रवणौ पाशपाणिस्तु नासिकां चिंतितार्थदः ।
गणेशस्तु मुखं कंठं पातु देवो गणंजयः ॥ ७ ॥

स्कंधौ पातु गजस्कंधः स्तनौ विघ्नविनाशनः ।
हृदयं गणनायस्तु हेरंबो जठरं महान् ॥ ८ ॥

धराधरः पातु पार्श्वौ पृष्ठं विघ्नहरः शुभः ।
लिंगं गुह्यं सदा पातु वक्रतुण्डो महाबलः ॥ ९ ॥

गणक्रीडो जानुजंघे ऊरू मंगलमूर्तिमान् ।
एकदंतो महाबुद्धिः पादौ गुल्फौ सदाऽवतु ॥ १० ॥

क्षिप्रप्रसादनो बाहू पाणी आशाप्रपूरकः ।
अङ्गुलीश्च नखान्पातु पद्महस्तोऽरिनाशनः ॥ ११ ॥

सर्वाङ्गाणि मयूरेशो विश्वव्यापी सदाऽवतु ।
अनुक्तमपि यत्स्थानं धूम्रकेतुः सदाऽवतु ॥ १२ ॥

आमोदस्त्वग्रतः पातु प्रमोदः पृष्ठतोऽवतु । प्राच्यां रक्षतु`;

const ROOT_DIR = path.resolve();
const DB_PATH = path.resolve(ROOT_DIR, 'storage/granth.db');
const db = new Database(DB_PATH);

export function deepLiturgicalHeal(rawText: string): string {
  if (!rawText) return '';

  let s = stripRunningHeaderNoise(rawText);

  // 1. Repair broken hyphens across lines & words
  s = s.replace(/([\u0900-\u097F]+)-\s*\n\s*([\u0900-\u097F]+)/gu, '$1$2');
  s = s.replace(/-\s*\n\s*/gu, '');
  s = s.replace(/\s*\n\s*/gu, ' ');

  // 2. Common Sanskrit OCR vocabulary healing
  s = s.replace(/श्रीगणेशायः/gu, 'श्रीगणेशाय');
  s = s.replace(/(?:सुनिरुवाच|शुनिरुवाच)/gu, 'मुनिरुवाच');
  s = s.replace(/(?:^|\s)(?:लमः|नसः)(?=\s*[।!|1॥\s])/gu, ' नमः');
  s = s.replace(/नमः\s*[!|1]/gu, 'नमः ।');
  s = s.replace(/विच्ना/gu, 'विघ्ना');
  s = s.replace(/विच्ने/gu, 'विघ्ने');
  s = s.replace(/विष्न/gu, 'विघ्न');
  s = s.replace(/संबोदर/gu, 'लम्बोदर');
  s = s.replace(/कठं\s*पातु/gu, 'कण्ठं पातु');
  s = s.replace(/स्कंध/gu, 'स्कन्ध');
  s = s.replace(/हेरंब/gu, 'हेरम्ब');
  s = s.replace(/अड-?\s*गुली/gu, 'अङ्गुली');
  s = s.replace(/मंगल/gu, 'मङ्गल');
  s = s.replace(/दंतान्/gu, 'दन्तान्');
  s = s.replace(/पडेच्छणु/gu, 'पठेच्छृणु');
  s = s.replace(/हादशेतानि/gu, 'द्वादशैतानि');
  s = s.replace(/स्वंविष्नोषशांतये/gu, 'सर्वविघ्नोपशान्तये');
  s = s.replace(/शशिवर्णं\s*चतुभुजम्/gu, 'शशिवर्णं चतुर्भुजम्');
  s = s.replace(/पराशरात्मजं\s*वंदे/gu, 'पराशरात्मजं वन्दे');
  s = s.replace(/धूं\s*स्रकंतवे|धू\s*स्रकंतवे/gu, 'धूम्रकेतवे');
  s = s.replace(/गौयुंवाच/gu, 'गौर्युवाच');

  // 3. Danda & Verse Number Healing
  // e.g. "समाप्ता 11", "उवाच 1।", "उवाच 1!"
  s = s.replace(/(समाप्ता|समाप्तम्|उवाच|ऊचुः)\s*[1!|॥।]+/gu, '$1 ॥');

  // e.g. "॥ ६.॥", "॥ २.॥" (verse numbers with dot)
  s = s.replace(/॥\s*([०-९\d]+)\.[\s॥।]*/gu, ' ॥ $1 ॥ ');

  // e.g. "॥। १२१", "॥ ३११" (trailing 1 instead of closing danda)
  s = s.replace(/[॥।]{1,2}\s*([०-९\d]+)१(?=[\s\u0900-\u097F]|$)/gu, ' ॥ $1 ॥ ');

  // e.g. "1) ६ ।१" -> "॥ ६ ॥"
  s = s.replace(/[1।॥\)]+\s*([०-९\d]+)\s*[1।॥\)]+/gu, ' ॥ $1 ॥ ');

  // e.g. "।1 ६७ ", "॥1 ६७ ", "।1 ३४ "
  s = s.replace(/[॥।]\s*1\s*([०-९\d]+)\s*(?=[\u0900-\u097F]|$)/gu, ' ॥ $1 ॥ ');

  // e.g. "११ २६ " -> "॥ २६ ॥ " (double digit 1 OCR for double danda)
  s = s.replace(/(?:^|\s)११\s*([०-९\d]+)\s*(?=[\u0900-\u097F])/gu, ' ॥ $1 ॥ ');

  // e.g. "॥ १३१)" -> "॥ १३ ॥"
  s = s.replace(/॥\s*([०-९\d]+)\s*[\)\]]/gu, ' ॥ $1 ॥ ');

  // e.g. "। 1३ " -> "॥ १३ ॥"
  s = s.replace(/[।॥]\s*1([०-९\d]+)\s*/gu, ' ॥ $1 ॥ ');

  // e.g. "॥ ३४1 ॥" -> "॥ ३४ ॥", "॥ ५३1 ॥" -> "॥ ५३ ॥", "॥ ८1 ॥" -> "॥ ८ ॥"
  s = s.replace(/[॥।]\s*([०-९\d]+)\s*[1!|]\s*[॥।]/gu, ' ॥ $1 ॥ ');
  s = s.replace(/([०-९\d]+)[1!|]\s*[॥।]/gu, ' ॥ $1 ॥ ');

  // Verse number following danda without closing danda: "। १५ दामोदर" -> "। ॥ १५ ॥ दामोदर"
  s = s.replace(/([।॥])\s*([०-९\d]+)\s+(?=[\u0905-\u0939])/gu, '$1\n\n॥ $2 ॥ ');

  // e.g. "॥ 1२७ ॥" -> "॥ २७ ॥" (extraneous leading 1)
  s = s.replace(/[॥।]\s*1\s*([०-९]{2,})\s*[॥।]/gu, ' ॥ $1 ॥ ');

  // e.g. "॥ 1 ॥" where English 1 was read instead of Sanskrit १
  s = s.replace(/[॥।]\s*1\s*[॥।]/gu, ' ॥ १ ॥ ');

  // e.g. "॥1 ७ 11" -> "॥ ७ ॥"
  s = s.replace(/[॥।1!|]{2,}\s*([०-९\d]+)\s*[॥।1!|]{2,}/gu, ' ॥ $1 ॥ ');

  // Unclosed verse number before text: "॥ ५ जिह्वां" -> "॥ ५ ॥ जिह्वां"
  s = s.replace(/॥\s*([०-९\d]+)\s*(?=[\u0905-\u0939])/gu, ' ॥ $1 ॥ ');

  // Solitary '1' or '!' between words converted to danda
  s = s.replace(/\s+1\s+/gu, ' । ');
  s = s.replace(/\s+!\s+/gu, ' । ');
  s = s.replace(/[!|]/gu, '।');
  s = s.replace(/।\s*।/gu, '॥');
  s = s.replace(/॥\s*॥/gu, '॥');
  s = s.replace(/\s+([।॥])/gu, ' $1');

  // 4. Liturgical Dissection: Invocations, Titles, Speakers
  s = s.replace(/(॥\s*श्री[^॥]+॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(॥\s*अथ[^॥]+॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(श्रीगणेशाय\s+नमः\s*॥)/gu, '\n\n$1\n\n');
  s = s.replace(/(श्रीगुरुभ्यो\s+नमः\s*॥)/gu, '$1\n\n');
  s = s.replace(/(इति\s+[^॥]+॥)/gu, '\n\n$1\n\n');

  // Speaker lines
  s = s.replace(/(?:^|\s)(श्रीभगवानुवाच|भगवानुवाच|सञ्जय\s+उवाच|संजय\s+उवाच|अर्जुन\s+उवाच|धृतराष्ट्र\s+उवाच|भीष्म\s+उवाच|युधिष्ठिर\s+उवाच|गौर्युवाच|मुनिरुवाच|ईश्वर\s+उवाच|देव्युवाच|सूत\s+उवाच|अगस्त्य\s+उवाच|सनत्कुमार\s+उवाच|ब्रह्मोवाच|विष्णुरुवाच|ऋषय\s+ऊचुः|नारद\s+उवाच)\s*[1!|॥।\s]*/gu, '\n\n$1 ॥\n\n');

  // Viniyoga limbs on their own lines
  s = s.replace(/(इति\s+विनियोगः\s*[।॥]|विनियोगः\s*[।॥])/gu, '$1\n\n');
  s = s.replace(/(?<=[।॥])\s*(?=ॐ\s+अस्य)/gu, '\n\n');
  s = s.replace(/(?<=[।॥])\s*(?=(?:ऋषिः|छन्दः|देवता|बीजम्|शक्तिः|कीलकम्)\s*[।॥])/gu, '\n');
  s = s.replace(/(ऋषिः|छन्दः|देवता|बीजम्|शक्तिः|कीलकम्)\s*[।॥]/gu, '$1 ।\n');

  // Nyasa limbs on their own lines
  s = s.replace(/(?<=(?:नमः|स्वाहा|वौषट्|हुम्|फट्)\s*[।॥])\s+/gu, '\n');

  // Verse boundary double newline
  s = s.replace(/(॥\s*[०-९\d]+\s*॥)\s*/gu, '$1\n\n');

  // 5. Metric Shloka Structuring (Anushtup & Long Chhandas)
  const blocks = s.split(/\n\n+/).map(b => b.trim()).filter(Boolean);
  const formattedBlocks: string[] = [];

  for (const block of blocks) {
    const verseMatch = block.match(/^(.*?)(॥\s*[०-९\d]+\s*॥)$/u);
    if (verseMatch) {
      const verseBody = verseMatch[1].trim();
      const verseTag = verseMatch[2].trim();

      const dandaIndex = verseBody.indexOf('।');
      if (dandaIndex > 0) {
        const half1 = verseBody.slice(0, dandaIndex + 1).trim();
        const half2 = (verseBody.slice(dandaIndex + 1).trim() + ' ' + verseTag).trim();

        const syl1 = countSanskritSyllables(half1);
        const syl2 = countSanskritSyllables(half2);

        // Long meters (Shikharini, Shardula, Vasantatilaka, Bhujanga, Totaka, Panchachamara)
        if (syl1 >= 22 && syl2 >= 22) {
          let targetPada = Math.round(syl1 / 2);
          if (targetPada < 11) targetPada = 11;

          const [pada1, pada2] = splitHemistichIntoPadas(half1, targetPada);
          const [pada3, pada4] = splitHemistichIntoPadas(half2, targetPada);

          formattedBlocks.push(`${pada1}\n${pada2}\n${pada3}\n${pada4}`);
          continue;
        }

        // Standard Anushtup or 2-hemistich Shloka
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

    // Nyasa lines inside unrolled block
    if (block.includes('नमः ।') || block.includes('नमः ॥')) {
      const nyasaLines = block.split(/(?<=(?:नमः|स्वाहा)\s*[।॥])/gu).map(l => l.trim()).filter(Boolean);
      formattedBlocks.push(nyasaLines.join('\n'));
      continue;
    }

    formattedBlocks.push(block);
  }

  return formattedBlocks.join('\n\n');
}

async function runDeepHeal() {
  console.log('=== Deep Healing all 284 Scripture Folios ===');

  const pages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();
  console.log(`Processing ${pages.length} folios in database...`);

  const updateStmt = db.prepare("UPDATE pages SET ocr_text = ?, verified_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");

  const updateTx = db.transaction(() => {
    for (const p of pages) {
      if (p.page_number === 2) {
        // Keep pristine Page 2 verified from high-res scan
        updateStmt.run(CANONICAL_PAGE_2, CANONICAL_PAGE_2, p.id);
        continue;
      }

      const raw = p.verified_text || p.ocr_text || '';
      const healed = deepLiturgicalHeal(raw);
      updateStmt.run(healed, healed, p.id);
    }
  });

  updateTx();
  console.log(`Deeply healed all ${pages.length} folios in database!`);

  // Synchronize JSON files
  const updatedPages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();
  const book = db.prepare("SELECT * FROM books WHERE id = 'granth-brihat-stotra-ratnakar'").get();

  const bookJsonPath = path.resolve(ROOT_DIR, 'public/data/books/granth-brihat-stotra-ratnakar.json');
  fs.writeFileSync(bookJsonPath, JSON.stringify({ book, pages: updatedPages }, null, 2));
  console.log('Synchronized public/data/books/granth-brihat-stotra-ratnakar.json!');
}

runDeepHeal().catch(console.error);
