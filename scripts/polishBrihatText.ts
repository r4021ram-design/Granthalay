import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DB_PATH = path.resolve(ROOT_DIR, 'storage/granth.db');

export function healDevanagariOcrText(raw: string): string {
  if (!raw) return '';

  let s = raw;

  // 1. Remove redundant injected headers
  s = s.replace(/^\s*॥\s*बृहत्स्तोत्ररत्नाकरः\s*॥\s*\n【[^】]+】\s*\n+/u, '');
  s = s.replace(/^\s*॥\s*बृहत्स्तोत्ररत्नाकरः\s*॥\s*\n+/u, '');

  // 2. Normalize danda punctuation and broken OCR delimiters
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
  s = s.replace(/अड-?\s*गुलीश्च/gu, 'अङ्गुलीश्च');
  s = s.replace(/पद्महस्तोऽरिनाशनः/gu, 'पद्महस्तोऽरिनाशनः');
  s = s.replace(/परात्परः!/gu, 'परात्परः ।');

  // Normalize broken OCR verse numbers (e.g. "॥*८ ॥", "॥1 ७ 11", "॥ २ 1!", "॥ ५ ")
  s = s.replace(/॥\s*[\*]\s*([०-९\d]+)\s*॥/gu, ' ॥ $1 ॥ ');
  s = s.replace(/[॥।1!|]+\s*([०-९\d]+)\s*[॥।1!|]+/gu, ' ॥ $1 ॥ ');
  s = s.replace(/॥\s*([०-९\d]+)\s*(?=[\u0905-\u0939])/gu, ' ॥ $1 ॥ ');

  // Standardize single and double dandas
  s = s.replace(/[!|]/gu, '।');
  s = s.replace(/।\s*।/gu, '॥');
  s = s.replace(/॥\s*॥/gu, '॥');
  s = s.replace(/\s+([।॥])/gu, ' $1');

  // 3. Heal common Sanskrit OCR conjuncts and typos
  const replacements: [RegExp, string][] = [
    [/श्नीगेशाय/gu, 'श्रीगणेशाय'],
    [/श्रीगुरुभ्यो\s*नसः/gu, 'श्रीगुरुभ्यो नमः'],
    [/पसिुरवदनो/gu, 'सिन्दूरवदनो'],
    [/यत्यादयंकजस्मरणम्/gu, 'यत्पादपङ्कजस्मरणम्'],
    [/राशील्लाशयति/gu, 'राशीन्नाशयति'],
    [/सुमुखश्चेकदंतश्च/gu, 'सुमुखश्चैकदन्तश्च'],
    [/संबोदरश्च/gu, 'लम्बोदरश्च'],
    [/विच्नानाम्/gu, 'विघ्नानाम्'],
    [/धूख्रकेतु्गणाध्यक्चो/gu, 'धूम्रकेतुर्गणाध्यक्षो'],
    [/पडेच्छणुखादपि/gu, 'पठेच्छृणुयादपि'],
    [/हादशेतानि/gu, 'द्वादशैतानि'],
    [/स्वंविष्नोषशांतये/gu, 'सर्वविघ्नोपशान्तये'],
    [/शशिवर्णं\s*चतुभुजम्/gu, 'शशिवर्णं चतुर्भुजम्'],
    [/शव्तेः/gu, 'शक्तेः'],
    [/पराशरात्मजं\s*वंदे/gu, 'पराशरात्मजं वन्दे'],
    [/नमो\s*वे\s*ब्रह्मनिधये/gu, 'नमो वै ब्रह्मनिधये'],
    [/द्वि्ाहुरपरो/gu, 'द्विबाहुरपरो'],
    [/अचतुवंदनो/gu, 'अचतुर्वदनो'],
    [/अभाललोचनः/gu, 'अभाललोचनः'],
    [/श्नगणेशाय/gu, 'श्रीगणेशाय'],
    [/प्राणायामं\s*हृत्वा/gu, 'प्राणायामं कृत्वा'],
    [/शूषंकर्णाय/gu, 'शूर्पकर्णाय'],
    [/विध्नशाय/gu, 'विघ्ननाशाय'],
    [/चितामणये/gu, 'चिन्तामणये'],
    [/एकदंताय/gu, 'एकदन्ताय'],
    [/आशापुरकाय/gu, 'आशापूरकाय'],
    [/धूं\s*स्रकंतवे|धू\s*स्रकंतवे/gu, 'धूम्रकेतवे'],
    [/वानबाहौ/gu, 'वामबाहौ'],
    [/हृदे/gu, 'हृदये'],
    [/वामकणं/gu, 'वामकर्णे'],
    [/गौयुंवाच/gu, 'गौर्युवाच'],
    [/क्म॑कर्तेति/gu, 'कर्म कर्तेति'],
    [/सयूरवाहनमम्‌ं|सयूरवाहनममुं/gu, 'मयूरवाहनममुं'],
    [/दिग्बाहुमाये/gu, 'दिग्बाहुमाद्ये'],
    [/तरेतायां/gu, 'त्रेतायां'],
    [/ध्रूयुगं/gu, 'भ्रूयुगं'],
    [/भालचंगरस्तु/gu, 'भालचन्द्रस्तु'],
    [/गजास्यस्त्वोष्ठ/gu, 'गजास्यस्त्वोष्ठ'],
    [/पाशपणिस्तु/gu, 'पाशपाणिस्तु'],
    [/चितिता्थंदः/gu, 'चिन्तिताथप्रदः'],
    [/गणंजयः/gu, 'गणञ्जयः'],
    [/विष्नहरः/gu, 'विघ्नहरः'],
    [/क्षप्रप्रसादनो/gu, 'क्षिप्रप्रसादनो'],
    [/जआशाप्रपुरकः/gu, 'आशाप्रपूरकः'],
    [/अडगुलीश्च/gu, 'अङ्गुलीश्च'],
    [/सर्वागाणि/gu, 'सर्वाङ्गानि'],
    [/धूखकेतुः/gu, 'धूम्रकेतुः'],
    [/राक्तसासुर/gu, 'राक्षसासुर'],
    [/निविष्नेन/gu, 'निर्विघ्नेन'],
    [/भरणोच्चाटनाकर्ष/gu, 'मारणोच्चाटनाकर्ष'],
    [/स्तंभमोहनकर्मणि/gu, 'स्तम्भमोहनकर्मणि'],
    [/सप्तवारं\s*जपेदेतहिनानासेकविशतिम्/gu, 'सप्तवारं जपेदेतद्दिनानामेकविंशतिम्'],
    [/मुद्गलाय\s*च\s*तेनाथ\s*सांडव्याय\s*महये/gu, 'मुद्गलाय च तेनाथ माण्डव्याय महर्षये'],
    [/कपया/gu, 'कृपया'],
    [/श्नद्रावते/gu, 'श्रद्धावते'],
    [/संपुणेम्/gu, 'सम्पूर्णम्'],
    [/श्नीस्ेप्रदाय/gu, 'श्रीस्कन्दाय'],
    [/विच्नेशवीर्याणि/gu, 'विघ्नेशवीर्याणि'],
    [/बंदीजन्मागिधकंः/gu, 'वन्दिजन्मागधकैः'],
    [/शरुत्वा/gu, 'श्रुत्वा'],
    [/या\s*प्राथितविष्नराजश्चित्तेन/gu, 'एवं सम्प्रार्थितो विघ्नराजश्चित्तेन'],
    [/चोत्थाय\s*बहि्गणेशः/gu, 'चोत्थाय बहिर्गणेशः'],
    [/निगेतं/gu, 'निर्गतं'],
    [/टहेरंन/gu, 'हेरम्ब'],
    [/अङ्गखम्/gu, 'मङ्गलम्'],
    [/अङ्खम्/gu, 'मङ्गलम्'],
  ];

  for (const [regex, replacement] of replacements) {
    s = s.replace(regex, replacement);
  }

  return s.trim();
}

async function polishDatabase() {
  console.log('Polishing Brihat Stotra Ratnakar Devanagari text in database...');
  const db = new Database(DB_PATH);

  const pages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();
  const updateStmt = db.prepare("UPDATE pages SET ocr_text = ?, verified_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");

  const updateMany = db.transaction(() => {
    for (const p of pages) {
      const cleaned = healDevanagariOcrText(p.ocr_text || p.verified_text || '');
      updateStmt.run(cleaned, cleaned, p.id);
    }
  });

  updateMany();
  console.log(`Polished all ${pages.length} folios in database.`);

  // Sync JSON
  const updatedPages = db.prepare("SELECT * FROM pages WHERE book_id = 'granth-brihat-stotra-ratnakar' ORDER BY page_number ASC").all();
  const book = db.prepare("SELECT * FROM books WHERE id = 'granth-brihat-stotra-ratnakar'").get();
  const jsonPath = path.resolve(ROOT_DIR, 'public/data/books/granth-brihat-stotra-ratnakar.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ book, pages: updatedPages }, null, 2));
  console.log('Synchronized public/data/books/granth-brihat-stotra-ratnakar.json!');
}

polishDatabase().catch(err => {
  console.error('Polish error:', err);
  process.exit(1);
});
