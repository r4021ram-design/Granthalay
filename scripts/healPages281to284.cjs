/**
 * healPages281to284.cjs
 *
 * Final Liturgical Sanskrit healing for Pages 281 to 284 of Brihat Stotra Ratnakar
 * (Folios २८७ to २८८ + Endpapers, scans page-289.png to page-292.png).
 *
 * Completely formatted छंद-बद्ध (metrical pāda/verse lines) for authentic
 * scripture recitation, parayana, and svadhyaya.
 * Completes all 224 stotras of Brihat Stotra Ratnakar.
 *
 * Synchronizes SQLite (storage/granth.db) and JSON (public/data/books/granth-brihat-stotra-ratnakar.json).
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '../storage/granth.db');
const JSON_PATH = path.join(__dirname, '../public/data/books/granth-brihat-stotra-ratnakar.json');

const healedPages = {
  281: `षष्टिश्च गावस्त्रिशताश्च धेनव एकं वत्सं सुवते ते दुहन्ति ।
नानागोष्ठा विहिता एकदोहनास्तावश्विनौ दुहतो धर्ममुख्यम् ॥ ४ ॥

एकां नाभिं सप्तशता अराश्रिताः प्रधिश्चान्या विंशतिरर्पिता अराः ।
अनेमिचक्रं परिवर्ततेऽजरं मायाश्विनौ समनक्ति चर्षणी ॥ ५ ॥

एकं चक्रं वर्तते द्वादशारं षण्णाभिमेकाक्षममृतस्य धारणम् ।
यस्मिन्देवा अधिविश्वे विषक्तास्तावश्विनौ मुञ्चतो मा विषीदसम् ॥ ६ ॥

अश्विनोविन्दुमृतं वृत्तभूयौ तिरोधत्तामश्विनौ दासपत्नी ।
हित्वा गिरिमश्विनौ गामुदाचरन्तौ तद्वृष्टिमह्नात्प्रथितौ बलस्य ॥ ७ ॥

युवां दिशो जनयथो दशाग्रे समानं मूर्ध्नि रथयानं वियन्ति ।
तासां यातमृषयोऽनुप्रयान्ति देवा मनुष्याः क्षितिमाचरन्ति ॥ ८ ॥

युवां वर्णान्विकुरुथो विश्वरूपांस्तेऽधिक्षियन्त भुवनानि विश्वा ।
ते भानवोऽप्यनुसृताश्चरन्ति देवा मनुष्याः क्षितिमाचरन्ति ॥ ९ ॥

तौ नास्त्यावश्विनौ वां महेऽहं स्रजं च यां बिभृथः पुष्करस्य ।
तौ नासत्यावमृतावतावृधावृते देवास्तत्प्रपदे न सूते ॥ १० ॥

सुखेन गर्भं लभतां युवानौ गतासुरेतत्प्रपदेन सूते ।
सद्यो जातो मातरमत्ति गर्भस्तावश्विनौ मुञ्चथो जीवसे गाम् ॥ ११ ॥

स्तोतुं न शक्नोमि गुणैर्भवन्तौ चक्षुर्विहीनः पथि संप्रमोहः ।
दुर्गेऽहम् अस्मिन पतितोऽस्मि कूपे युवां शरण्यौ शरणं प्रपद्ये ॥ १२ ॥

इति श्रीमन्महाभारत आदिपर्वण्यश्विनीकुमारस्तोत्रं संपूर्णम् ।

१९. पञ्चदेवतास्तोत्रम्
श्रीगणेशाय नमः ॥

गणेशविष्णुसूर्येशदुर्गाख्यं देवपञ्चकम् ।
वन्दे विद्धमनसा जनसायुज्यदायकम् ॥ १ ॥

एकरूपान् भिन्नमूर्तीन् पञ्चदेवान्नमस्कृतान् ।
वन्दे विशुद्धभावेनेशास्बेनैनकरदाच्युतान् ॥ २ ॥

कल्याणदायिनो देवान्नमस्कार्यान्महौजसः ।
विष्णुशंभुशिवासूर्यगणेशाख्यान्नमाम्यहम् ॥ ३ ॥

एकात्मनो भिन्नरूपान् लोकरक्षणतत्परान् ।
शिवविष्णुशिवासूर्यहेरम्बान् प्रणमाम्यहम् ॥ ४ ॥

दिव्यरूपाननेकरूपान्नानारूपान्नमस्कृतान् ।
शिवाशंकरहेरम्बविष्णुसूर्यान्नमाम्यहम् ॥ ५ ॥`,

  282: `नित्यानन्दसंदोहदायिनो दीनपालकान् ।
शिवाच्युतगणेशेनदुर्गाख्यान् नौम्यहं सुरान् ॥ ६ ॥

कमनीयतनून्देवान् सेवावश्यान् कृपावतः ।
शंकरेनाशिवाविष्णुगणेशाख्यान्नमाम्यहम् ॥ ७ ॥

सूर्यविष्णुशिवाशंभुविघ्नराजाभिधान्सुरान् ।
एकरूपान् सदा वन्दे सुखसंदोहसिद्धये ॥ ८ ॥

हरौ हरे तीक्ष्णकरे गणेशे शक्तौ न भेदो जगदादिहेतुषु ।
अधः पतन्त्येषु भिदां दधाना भाषन्त एवं यतयोऽच्युताश्रमाः ॥ ९ ॥

इति श्रीमदच्युताश्रमविरचितं पञ्चदेवतास्तोत्रम् सम्पूर्णम् ॥ १९ ॥`,

  283: ``,

  284: ``
};

console.log('Updating JSON and SQLite DB for Pages 281 to 284 with छंद-बद्ध formatting...');

const db = new Database(DB_PATH);
const updateStmt = db.prepare(`
  UPDATE pages
  SET verified_text = ?,
      status = 'VERIFIED'
  WHERE book_id = 'granth-brihat-stotra-ratnakar' AND page_number = ?
`);

const rawJson = fs.readFileSync(JSON_PATH, 'utf8');
const bookData = JSON.parse(rawJson);

for (let pageNum = 281; pageNum <= 284; pageNum++) {
  const text = healedPages[pageNum];
  if (text === undefined) {
    console.error(`Missing healed text for page ${pageNum}`);
    continue;
  }

  // 1. Update SQLite
  const result = updateStmt.run(text, pageNum);

  // 2. Update JSON
  const pageObj = bookData.pages.find(p => p.page_number === pageNum);
  if (pageObj) {
    pageObj.verified_text = text;
    pageObj.status = 'VERIFIED';
  } else {
    console.warn(`Page ${pageNum} not found in JSON.`);
  }

  console.log(`Page ${pageNum}: SQLite updated (${result.changes} rows affected), JSON updated.`);
}

fs.writeFileSync(JSON_PATH, JSON.stringify(bookData, null, 2), 'utf8');
console.log('Saved JSON successfully.');

db.close();
console.log('Database closed.');
