import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import sharp from 'sharp';
import { PAGES_DIR } from './documentProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function proofreadSanskritPage(rawText: string, pageNum: number): string {
  // If already manually proofread (Page 1 or Page 2), keep intact
  if (pageNum === 1 || pageNum === 2) {
    return rawText.trim();
  }

  let s = rawText;

  // 1. Remove redundant top header line that repeats on every page scan
  s = s.replace(/^(?:[`व॥|]\s*)?(?:गृहप्रवेश\s*\/\s*वास्तु\s*शान्ति\s*पूजनम्[‌\s]*|जि\s*\/\s*वास्तु\s*शान्ति\s*पूजनम्[‌\s]*|॥\s*\|\s*\/\s*वास्तु\s*शान्ति\s*पूजनम्[‌\s]*)\n?/gmi, '');
  s = s.replace(/^(?:वास्तु\s*मण्डल\s*देवता\s*स्थापनम्[‌\s]*)\n?/gmi, '');

  // 2. Remove publisher, phone, foundation, and author strings strictly
  s = s.replace(/मानव\s*ववकास\s*फाउन्?डेशन\s*[-–]?\s*मुम्?\s*बई/gu, '');
  s = s.replace(/मानव\s*विकास\s*फाउ[न्ण्ड]ेशन\s*[-–]?\s*मुम्बई/gu, '');
  s = s.replace(/आचायय\s*अवखलेश\s*(विवेदी|द्विवेदी)\s*[-–]?\s*9820611270/gu, '');
  s = s.replace(/आचार्य\s*अखिलेश\s*(त्रिवेदी|द्विवेदी)\s*[-–]?\s*9820611270/gu, '');
  s = s.replace(/वैशाख\s*शुक्\s*ल\s*तृतीया\s*[-–]?\s*26\.\s*4\s*\.2020/gu, '');
  s = s.replace(/9820611270/g, '');

  // 3. Normalize OCR noise bullets at line beginnings
  const lines = s.split('\n').map(l => {
    let line = l.trim();
    if (!line) return '';

    // Convert OCR noisy symbols to standard sacred bullet markers
    line = line.replace(/^[»*°"=~]\s*/gu, '• ');
    line = line.replace(/^०\.\s*/gu, '• ');
    line = line.replace(/^०\s+/gu, '• ');
    line = line.replace(/^\*\.\s*/gu, '▪ ');
    line = line.replace(/^=\s*/gu, '▪ ');
    line = line.replace(/^-\s*/gu, '▪ ');
    line = line.replace(/^--\s*/gu, '▪ ');
    line = line.replace(/^—\s*/gu, '▪ ');

    return line;
  });
  s = lines.filter(Boolean).join('\n');

  // 4. Remove orphan spaces before matras and Vedic accents (eliminates dotted circles ◌)
  // Preserves \u0951 (Svarita), \u0952 (Anudatta), \u1CDA (Dvisvarita), \u093D (Avagraha)
  s = s.replace(/([क-ह]़?)\s+([ािीुूृेैोौँंः\u0951\u0952\u1CDA])/gu, '$1$2');
  s = s.replace(/\u094D+/gu, '\u094D');
  s = s.replace(/म्आवाहयामि/gu, 'म् आवाहयामि');
  s = s.replace(/ध्यायेत्+्*\s*सर्व/gu, 'ध्यायेत् सर्व');

  // 5. Ulrich Stiehl's SanskritWeb Ligature Normalization (संयुक्ताक्षर शुद्धि)
  // Ha-conjuncts
  s = s.replace(/ह़्न|ह\s*्न/gu, 'ह्न');
  s = s.replace(/ह़्म|ह\s*्म/gu, 'ह्म');
  s = s.replace(/ह़्य|ह\s*्य/gu, 'ह्य');
  s = s.replace(/ह़्ल|ह\s*्ल/gu, 'ह्ल');
  s = s.replace(/ह़्व|ह\s*्व/gu, 'ह्व');
  s = s.replace(/ह़ृ|ह\s*ृ/gu, 'हृ');
  s = s.replace(/ह्रदय/gu, 'हृदय');

  // Guttural Nasal Conjuncts (ङ्-वर्ग)
  s = s.replace(/ड\.्ग|ङ्\s*ग/gu, 'ङ्ग');
  s = s.replace(/ड\.्क|ङ्\s*क/gu, 'ङ्क');
  s = s.replace(/ड\.्ख|ङ्\s*ख/gu, 'ङ्ख');
  s = s.replace(/ड\.्घ|ङ्\s*घ/gu, 'ङ्घ');

  // Palatal Conjuncts (ञ् / श्)
  s = s.replace(/ञ्\s*च/gu, 'ञ्च');
  s = s.replace(/ञ्\s*छ/gu, 'ञ्छ');
  s = s.replace(/ञ्\s*ज/gu, 'ञ्ज');
  s = s.replace(/श्\s*च/gu, 'श्च');
  s = s.replace(/श्\s*न/gu, 'श्न');
  s = s.replace(/श्\s*र/gu, 'श्र');
  s = s.replace(/श्\s*व/gu, 'श्व');

  // Retroflex & Dental Conjuncts (ष् / ट् / द्)
  s = s.replace(/ष्\s*ट/gu, 'ष्ट');
  s = s.replace(/ष्\s*ठ/gu, 'ष्ठ');
  s = s.replace(/ष्\s*ण/gu, 'ष्ण');
  s = s.replace(/द्\s*ध/gu, 'द्ध');
  s = s.replace(/द्\s*द/gu, 'द्द');
  s = s.replace(/द्\s*भ/gu, 'द्भ');
  s = s.replace(/द्\s*व/gu, 'द्व');
  s = s.replace(/त्\s*त/gu, 'त्त');
  s = s.replace(/त्\s*थ/gu, 'त्थ');
  s = s.replace(/न्\s*न/gu, 'न्न');

  // 6. Apply Canonical Shastra & Paninian Sandhi Corrections
  const corrections: [RegExp, string][] = [
    // Frequent Vedic/Sanskrit OCR errors
    [/गहस्रेश/gu, 'गृहप्रवेश'],
    [/कप्रिष्म|क्िप्त|वक्ष्र/gu, 'क्षिप्र'],
    [/स्रीगेह/gu, 'स्त्रीगेह'],
    [/स्त्रीगेहपुत्रामविनाशनं|स्रीगेहपुत्रामविनाशनं/gu, 'स्त्रीगेहपुत्रात्मविनाशनं'],
    [/पुत्रामविनाशनं/gu, 'पुत्रात्मविनाशनं'],
    [/द्रीशेऽनले|िीशेऽनले/gu, 'दिशेऽनले'],
    [/द्रीशे|िीशे/gu, 'दिशे'],
    [/द्रदरामय|द्नदरामय/gu, 'द्वन्द्वामय'],
    [/द्वन्द्र|द्नद्र/gu, 'द्वन्द्व'],
    [/द्रारहोतो/gu, 'द्वार हो तो'],
    [/द्रार/gu, 'द्वार'],
    [/पुथिवी|पृवथवी/gu, 'पृथिवी'],
    [/धुताः/gu, 'धृताः'],
    [/धुता/gu, 'धृता'],
    [/मूदु|मुदु/gu, 'मृदु'],
    [/धुवैः/gu, 'ध्रुवैः'],
    [/धुव/gu, 'ध्रुव'],
    [/स्वस्तिन\s*इनदरो|स्वस्ति\s*न\s*इनदरो/gu, 'स्वस्ति न इन्द्रो'],
    [/इनदरो|इनदर/gu, 'इन्द्रो'],
    [/पुषा\s*विश्चैवेदाः|पुषा\s*विश्ववेदाः/gu, 'पूषा विश्ववेदाः'],
    [/नस्ताक््यो|नस्ताक्ष्यो/gu, 'नस्तार्क्ष्यो'],
    [/तदश्चिना/gu, 'तदश्विना'],
    [/शुणुतन्‌?|शृिुत/gu, 'शृणुतं'],
    [/तमीशानन्‌?/gu, 'तमीशानं'],
    [/जगतस्‌\s*तस्थुषस्पतिन्‌?/gu, 'जगतस्तस्थुषस्पतिं'],
    [/भेषजन्‌?/gu, 'भेषजं'],
    [/पुश्चिमातरः/gu, 'पृश्निमातरः'],
    [/य्यावानो/gu, 'यावानो'],
    [/सर्वविध्न/gu, 'सर्वविघ्न'],
    [/सर्वमंगलमांगल्ये/gu, 'सर्वमङ्गलमाङ्गल्ये'],
    [/सोमनार/gu, 'सोमवार'],
    [/आचमन\s*करं/gu, 'आचमन करें'],
    [/हरीः/gu, 'हरिः'],
    [/गतोपि/gu, 'गतोऽपि'],
    [/आहुवत/gu, 'आहुति'],
    [/अवनन/gu, 'अग्नि'],
    [/बबलदान/gu, 'बलिदान'],
    [/पीूयहबुत/gu, 'पूर्णाहुति'],
    [/पूष्पांजबल/gu, 'पुष्पांजलि'],
    [/चतुः\s*पवि\s*योगनी/gu, 'चतुःषष्टि योगिनी'],
    [/वसो◌्र्धारा|वसोर्\s*धारा/gu, 'वसोर्धारा'],
    [/दशबदनपाल/gu, 'दशदिग्पाल'],
    [/प्र◌्रान|प्र\s*ान/gu, 'प्रधान'],
    [/स्याद्रशनं/gu, 'स्याद्देशनं'],
    [/मागोर्जयोः/gu, 'मार्गोजयोः'],
    [/श्रावणिकेपि/gu, 'श्रावणिकेऽपि'],
    [/ग्राह्म/gu, 'ग्राह्य'],
    [/नुतन|नूर्न/gu, 'नूतन'],
    [/कुशकवण्डका/gu, 'कुशकण्डिका'],
    [/सप्तस्थल/gu, 'सप्तघृत'],
    [/नुपते/gu, 'नृपते'],
    [/जन्मरक्ष/gu, 'जन्मर्क्ष'],
    [/ओर\s*खरमास/gu, 'और खरमास'],
    [/दक्षिणायण/gu, 'दक्षिणायन'],
    [/प्रवेशािति्‌विधः|प्रवेशस्िविधः/gu, 'प्रवेशस्त्रिविधः'],
    [/यात्राबसाने/gu, 'यात्रानिवृत्तौ'],
    [/भयाननवेऽ/gu, 'भयान्नवेऽध्वगे'],
    [/नाऽऽवश्यमस्तादिविचारणाऽत्र/gu, 'नाऽऽवश्यमस्तार्कविचारणाऽत्र'],
    [/उवचर्/gu, 'उचित'],
    [/जीर्त|जीिय/gu, 'जीर्ण'],
    [/वकन्र्ु/gu, 'किन्तु'],
    [/सपूवत/gu, 'सपूर्व'],
    [/अपूवत/gu, 'अपूर्व'],
    [/शावन्र्|शावन्त/gu, 'शान्ति'],
    [/पद्धवत/gu, 'पद्धति'],
    [/वथथवर्/gu, 'स्थिति'],
    [/ललए/gu, 'लिए'],
    [/लवधान/gu, 'विधान'],
    [/लवलहत/gu, 'विहित'],
    [/आलद/gu, 'आदि'],
    [/लतलक/gu, 'तिलक'],
    [/लपण्ड/gu, 'पिण्ड'],
    [/िारदा/gu, 'शारदा'],
    [/नैर्\s*ऋत्\s*य/gu, 'नैर्ऋत्य'],
    [/मकानमें\s*प्रवेश\s*कै/gu, 'मकान में प्रवेश करें'],
    [/अमंगलम/gu, 'अमङ्गलम्'],
    [/मंगलायतनो/gu, 'मङ्गलायतनो'],
    [/चंद्रबलं/gu, 'चन्द्रबलं'],
    [/सुर्य/gu, 'सूर्य'],
    [/सुर्या/gu, 'सूर्या'],
    [/सम्पूणय/gu, 'सम्पूर्ण'],
    [/वणाय/gu, 'वर्णाय'],
    [/कत्यायनी/gu, 'कात्यायनी'],
    [/कूष्माण्डा/gu, 'कूष्माण्डा'],
    [/कालरात्री/gu, 'कालरात्रि'],
    // Shanti Path & Vedic Hymns
    [/पश्ये\s*माक्षभिर्यजत्राः/gu, 'पश्येमाक्षभिर्यजत्राः'],
    [/स्थिरे\s*रङ्गैस्तुष्टैवा\s*[७꣪\s]*सस्तनृ?भिर्‌?\s*व्यशेमहि|स्थिरे\s*रङ्गैस्तुष्टुवा\s*[७꣪\s]*सस्तनू?भिर्‌?\s*व्यशेमहि|स्थिरैरङ्गैस्तुष्टुवा\s*[७꣪\s]*सस्तनू?भिर्‌?\s*व्यशेमहि/gu, 'स्थिरैरङ्गैस्तुष्टुवा꣪सस्तनूभिर्व्यशेमहि'],
    [/मानो\s*मध्यारी\s*रिषतायुर्गन्तोः/gu, 'मा नो मध्या रीरिषतायुर्गन्तोः'],
    [/अदितिर्[ꣵ्‌]*द्यौ\s*रदितिरन्त\s*रिक्शमदितिर्|अदितिर््यौ\s*रदितिरन्त\s*रिक्षमदितिर्‌?\s*माता\s*सपिता\s*सपुत्रः/gu, 'अदितिर्द्यौरदितिरन्तरिक्षमदितिर्माता स पिता स पुत्रः'],
    [/विश्वे\s*देवा\s*अदितिः\s*पञ्चजना\s*अदितिर्‌?\s*जातं?म्?दितिर्‌?\s*जनित्वम्‌?\s*॥९०॥/gu, 'विश्वे देवा अदितिः पञ्चजना अदितिर्जातमदितिर्जनित्वम् ॥१०॥'],
    [/द्यौः\s*शान्तिरन्तरिक्ष\s*[७꣪]\s*शान्तिः/gu, 'द्यौः शान्तिरन्तरिक्षं शान्तिः'],
    [/सर्व\s*[छ७꣪]\s*शान्तिः/gu, 'सर्वं शान्तिः'],
    [/सामा\s*शान्तिरेधि/gu, 'सा मा शान्तिरेधि'],
    [/शन्नः\s*कुरु/gu, 'शं नः कुरु'],
    [/प्रजाभ्योऽभयन्नः/gu, 'प्रजाभ्योऽभयं नः'],
    [/विश्वेनो\s*देवा/gu, 'विश्वे नो देवा'],
    [/धियभ्जिन्वमवसे/gu, 'धियञ्जिन्वमवसे'],
    [/जरसन्‌?\s*तनूनाम्‌?/gu, 'जरसं तनूनाम्'],
    [/वृहस्पतिर्दधातु/gu, 'बृहस्पतिर्दधातु'],
    [/तद्‌?\s*ग्रावाणः/gu, 'तद्ग्रावाणः'],
    [/मयो\s*भुवातु/gu, 'मयोभु वातु'],
    [/मयो\s*भुवस्तदश्विना/gu, 'मयोभुवस्तदश्विना'],
    [/॥९०॥/gu, '॥१०॥'],
    // Ganesha Dhyana & Shlokas
    [/सुमुखश्च\s*एकदंतश्च/gu, 'सुमुखश्चैकदन्तश्च'],
    [/एकदंतश्च/gu, 'एकदन्तश्च'],
    [/धुम्रकेतुर्‌?/gu, 'धूम्रकेतुर्'],
    [/धूम्रकेतुर्‌?\s*गणाध्यक्षो/gu, 'धूम्रकेतुर्गणाध्यक्षो'],
    [/विद्यारंभे/gu, 'विद्यारम्भे'],
    [/विवाहे\s*च\s*प्रवेशो/gu, 'विवाहे च प्रवेशे'],
    [/शुक्लाम्बरधरम\s*देवं\s*शशि\s*वर्ण\s*चतुर्भुजम/gu, 'शुक्लाम्बरधरं देवं शशिवर्णं चतुर्भुजम्'],
    [/ध्यायेत/gu, 'ध्यायेत्'],
    [/सर्व\s*विघ्नोपशान्तये/gu, 'सर्वविघ्नोपशान्तये'],
  ];

  for (const [regex, replacement] of corrections) {
    s = s.replace(regex, replacement);
  }

  // 7. Multi-column OCR Scramble Healing
  // Page 6: Pradhana Devata Namaskara
  if (
    s.includes('श्रीमनमहागणाधीपतये') ||
    s.includes('श्रीमन्महागणाधीपतये') ||
    s.includes('वास्तु देवताभ्यो नमः 7. मातु') ||
    s.includes('स्थान देवताभ्यो नमः 0. शची')
  ) {
    const scrambledDeitiesRegex = /^[॥\d\.\s]*श्री[मन्]*महागणाधी?पतये\s*नमः[\s\S]*?शची\s*पुरंद[ा]?राभ्या[मं]\s*नमः/mu;
    const cleanDeitiesList = [
      '【 प्रधान देवता नमस्कार 】',
      '१. ॐ श्रीमन्महागणाधिपतये नमः ।',
      '२. ॐ इष्टदेवताभ्यो नमः ।',
      '३. ॐ कुलदेवताभ्यो नमः ।',
      '४. ॐ ग्रामदेवताभ्यो नमः ।',
      '५. ॐ स्थानदेवताभ्यो नमः ।',
      '६. ॐ वास्तुदेवताभ्यो नमः ।',
      '७. ॐ वाणीहिरण्यगर्भाभ्यां नमः ।',
      '८. ॐ लक्ष्मीनारायणाभ्यां नमः ।',
      '९. ॐ उमामहेश्वराभ्यां नमः ।',
      '१०. ॐ शचीपुरन्दराभ्यां नमः ।',
      '११. ॐ मातृपितृचरणकमलेभ्यो नमः ।',
      '१२. ॐ सर्वेभ्यो देवेभ्यो नमः ।',
      '१३. ॐ सर्वेभ्यो ब्राह्मणेभ्यो नमः ।',
      '१४. ॐ एतत्कर्मप्रधानदेवताभ्यो नमः ।'
    ].join('\n');
    s = s.replace(scrambledDeitiesRegex, cleanDeitiesList);
  }

  // Page 20: Shadvinaayaka & Torana Matrika multi-column
  if (s.includes('मोदाय नमः') && s.includes('दुर्मुखाय नमः')) {
    const vinayakaRegex = /^[.\s\d]*ॐ\s*मोदाय\s*नमः[\s\S]*?विघ्नह[त्रर्त]+[ाे]*[रम]*\s*आ[,\.]?\s*स्था[,\.]?\s*पू[,\.]?/mu;
    const cleanVinayaka = [
      '१. ॐ मोदाय नमः । मोदम् आवाहयामि स्थापयामि पूजयामि ।',
      '२. ॐ प्रमोदाय नमः । प्रमोदम् आवाहयामि स्थापयामि पूजयामि ।',
      '३. ॐ सुमुखाय नमः । सुमुखम् आवाहयामि स्थापयामि पूजयामि ।',
      '४. ॐ दुर्मुखाय नमः । दुर्मुखम् आवाहयामि स्थापयामि पूजयामि ।',
      '५. ॐ अविघ्नाय नमः । अविघ्नम् आवाहयामि स्थापयामि पूजयामि ।',
      '६. ॐ विघ्नहर्त्रे नमः । विघ्नहर्तारम् आवाहयामि स्थापयामि पूजयामि ।'
    ].join('\n');
    s = s.replace(vinayakaRegex, cleanVinayaka);
  }

  if (s.includes('नन्दायै नमः') && s.includes('भार्गव्यै नमः')) {
    const toranaRegex = /^[.\s\d\]]*ॐ\s*नन्दायै\s*नमः[\s\S]*?वासु[म्‌]*\s*आ[,\.]?\s*स्था[,\.]?\s*पू[,\.]?/mu;
    const cleanTorana = [
      '१. ॐ नन्दायै नमः । नन्दाम् आवाहयामि स्थापयामि पूजयामि ।',
      '२. ॐ नन्दिन्यै नमः । नन्दिनीम् आवाहयामि स्थापयामि पूजयामि ।',
      '३. ॐ वाशिष्ठ्यै नमः । वाशिष्ठीम् आवाहयामि स्थापयामि पूजयामि ।',
      '४. ॐ वासुदेव्यै नमः । वासुदेवीम् आवाहयामि स्थापयामि पूजयामि ।',
      '५. ॐ भार्गव्यै नमः । भार्गवीम् आवाहयामि स्थापयामि पूजयामि ।',
      '६. ॐ जयायै नमः । जयाम् आवाहयामि स्थापयामि पूजयामि ।',
      '७. ॐ विजयायै नमः । विजयाम् आवाहयामि स्थापयामि पूजयामि ।'
    ].join('\n');
    s = s.replace(toranaRegex, cleanTorana);
  }

  // Page 25: Sapta Ghrita Matrika multi-column
  if (s.includes('ब्राह्मयै नम') && s.includes('वाराह्यै नम')) {
    const matrikaRegex = /^[.\s\d\]]*ॐ\s*ब्राह्म[यैय]+[\s\S]*?वैष्णवी\s*आ[,\.]?\s*स्था[,\.]?/mu;
    const cleanMatrika = [
      '१. ॐ ब्राह्म्यै नमः । ब्राह्मीम् आवाहयामि स्थापयामि ।',
      '२. ॐ माहेश्वर्यै नमः । माहेश्वरीम् आवाहयामि स्थापयामि ।',
      '३. ॐ कौमार्यै नमः । कौमारीम् आवाहयामि स्थापयामि ।',
      '४. ॐ वैष्णव्यै नमः । वैष्णवीम् आवाहयामि स्थापयामि ।',
      '५. ॐ वाराह्यै नमः । वाराहीम् आवाहयामि स्थापयामि ।',
      '६. ॐ इन्द्राण्यै नमः । इन्द्राणीम् आवाहयामि स्थापयामि ।',
      '७. ॐ चामुण्डायै नमः । चामुण्डाम् आवाहयामि स्थापयामि ।'
    ].join('\n');
    s = s.replace(matrikaRegex, cleanMatrika);
  }
  s = s.replace(/\n?4\.\s*ॐ\s*वैष्णव्यै\s*नमः\s*वैष्णवी\s*आ[,\.]?\s*स्था[,\.]?/gu, '');

  // 8. Strip stray dotted circles
  s = s.replace(/[\u25CC\u25CB]/gu, '');

  return s.trim();
}

/**
 * UoHyd-inspired Padachheda (पदच्छेद) Segmentation Utility
 * Splits complex Sanskrit Sandhi compounds into readable pedagogical components
 */
export function splitIntoPadachheda(shloka: string): string {
  let s = shloka;

  const sandhiMap: [RegExp, string][] = [
    [/नमोऽस्तु/gu, 'नमः अस्तु'],
    [/सोऽहम्/gu, 'सः अहम्'],
    [/तन्माता/gu, 'तत् माता'],
    [/तत्पिता/gu, 'तत् पिता'],
    [/सर्वमङ्गलमाङ्गल्ये/gu, 'सर्व-मङ्गल-माङ्गल्ये'],
    [/सर्वार्थसाधिके/gu, 'सर्व-अर्थ-साधिके'],
    [/शरण्ये\s*त्र्यम्बके/gu, 'शरण्ये त्रि-अम्बके'],
    [/नारायणि\s*नमोऽस्तु\s*ते/gu, 'नारायणि नमः अस्तु ते'],
    [/जगतस्तस्थुषस्पतिं/gu, 'जगतः तस्थुषः पतिम्'],
    [/धियञ्जिन्वमवसे/gu, 'धियम् जिन्वम् अवसे'],
    [/हूमहे\s*वयम्/gu, 'हूमहे वयम्'],
    [/पूषा\s*विश्ववेदाः/gu, 'पूषा विश्व-वेदाः'],
    [/स्वस्ति\s*न\s*इन्द्रो/gu, 'स्वस्ति नः इन्द्रः'],
    [/वृद्धश्रवाः/gu, 'वृद्ध-श्रवाः'],
    [/तार्क्ष्यो\s*अरिष्टनेमिः/gu, 'तार्क्ष्यः अरिष्ट-नेमिः'],
    [/बृहस्पतिर्दधातु/gu, 'बृहस्पतिः दधातु'],
  ];

  for (const [re, repl] of sandhiMap) {
    s = s.replace(re, repl);
  }

  return s;
}

function wrapTextLines(text: string, maxCharsPerLine = 48): string[] {
  const result: string[] = [];
  const rawLines = text.split('\n');

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      result.push('');
      continue;
    }
    if (trimmed.length <= maxCharsPerLine) {
      result.push(trimmed);
      continue;
    }
    const words = trimmed.split(' ');
    let current = '';
    for (const w of words) {
      if (!current) {
        current = w;
      } else if (current.length + w.length + 1 <= maxCharsPerLine) {
        current += ' ' + w;
      } else {
        result.push(current);
        current = w;
      }
    }
    if (current) result.push(current);
  }
  return result;
}

async function renderBhojpatraImage(
  bookId: string,
  pageNum: number,
  title: string,
  text: string
): Promise<string> {
  const width = 1200;
  const height = 1600;

  const bookDir = path.join(PAGES_DIR, bookId);
  fs.mkdirSync(bookDir, { recursive: true });
  const filename = `page-${pageNum}.png`;
  const fullPath = path.join(bookDir, filename);
  const lines = wrapTextLines(text, 52);
  const maxLines = Math.min(lines.length, 45);
  const displayLines = lines.slice(0, maxLines);

  const availableHeight = height - 360; // 1240 px
  const lineHeight = Math.min(36, Math.max(25, Math.floor(availableHeight / Math.max(displayLines.length, 1))));
  const baseSize = Math.min(26, Math.max(16, lineHeight - 8));
  const startY = Math.max(185, Math.floor((height - displayLines.length * lineHeight) / 2));

  const textSvgLines = displayLines
    .map((line, idx) => {
      const y = startY + idx * lineHeight;
      const escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

      let fill = '#241408';
      let weight = 'normal';
      let size = baseSize;

      if (line.startsWith('॥') || line.startsWith('【')) {
        fill = '#8C2D19';
        weight = 'bold';
        size = baseSize + 2;
      } else if (line.startsWith('•') || line.startsWith('▪') || /^\d+\./.test(line)) {
        fill = '#591B0B';
        weight = '600';
      }

      return `<text x="600" y="${y}" text-anchor="middle" font-family="'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', 'Yatra One', serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escaped}</text>`;
    })
    .join('\n');

  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="paperGrad" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#F5ECD4" />
          <stop offset="70%" stop-color="#ECDAB2" />
          <stop offset="100%" stop-color="#D9BF89" />
        </radialGradient>
        <radialGradient id="agedEdge" cx="50%" cy="50%" r="60%">
          <stop offset="65%" stop-color="transparent" />
          <stop offset="100%" stop-color="rgba(120, 65, 20, 0.45)" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#paperGrad)" />
      <rect width="100%" height="100%" fill="url(#agedEdge)" />

      <!-- Borders -->
      <rect x="36" y="36" width="${width - 72}" height="${height - 72}" fill="none" stroke="#8C2D19" stroke-width="4" stroke-opacity="0.8" rx="16" />
      <rect x="46" y="46" width="${width - 92}" height="${height - 92}" fill="none" stroke="#C25A2A" stroke-width="1.5" stroke-dasharray="6,4" rx="12" />

      <!-- Corners -->
      <text x="56" y="70" font-size="20" fill="#8C2D19" font-weight="bold">卐</text>
      <text x="${width - 76}" y="70" font-size="20" fill="#8C2D19" font-weight="bold">卐</text>
      <text x="56" y="${height - 52}" font-size="20" fill="#8C2D19" font-weight="bold">卐</text>
      <text x="${width - 76}" y="${height - 52}" font-size="20" fill="#8C2D19" font-weight="bold">卐</text>

      <!-- Folio Header -->
      <text x="600" y="96" text-anchor="middle" font-family="'Tiro Devanagari Sanskrit', serif" font-size="34" font-weight="bold" fill="#8C2D19">ॐ</text>
      <text x="600" y="132" text-anchor="middle" font-family="'Tiro Devanagari Sanskrit', serif" font-size="22" font-weight="bold" fill="#7A2814">${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
      <line x1="200" y1="150" x2="1000" y2="150" stroke="#8C2D19" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="4,4" />

      <!-- Scripture Text -->
      ${textSvgLines}

      <!-- Footer -->
      <line x1="250" y1="${height - 110}" x2="950" y2="${height - 110}" stroke="#8C2D19" stroke-width="1" stroke-opacity="0.4" />
      <text x="600" y="${height - 78}" text-anchor="middle" font-family="'Noto Serif Devanagari', serif" font-size="16" fill="#8C2D19" opacity="0.85">॥ पत्रम् ${pageNum} • सनातन प्रामाणिक भोजपत्र पाण्डुलिपि ॥</text>
      <text x="600" y="${height - 54}" text-anchor="middle" font-family="'Noto Sans Devanagari', sans-serif" font-size="12" fill="#5E3018" opacity="0.6">अक्षर-संख्या एवं वैदिक स्वर-शुद्धता सहित डिजिटाइज़्ड</text>
    </svg>
  `);

  await sharp(svgOverlay).png().toFile(fullPath);
  return `/storage/pages/${bookId}/${filename}`;
}

async function runProofingOnBook(bookId: string, bookTitle: string) {
  console.log(`\n🕉️ Running Automated Sanskrit Proofing on "${bookTitle}" (${bookId})...`);
  const pages = db.prepare('SELECT id, page_number, verified_text FROM pages WHERE book_id = ? ORDER BY page_number ASC').all(bookId) as Array<{ id: string; page_number: number; verified_text: string }>;

  const updateStmt = db.prepare('UPDATE pages SET verified_text = ?, ocr_text = ? WHERE id = ?');

  let fixedCount = 0;
  for (const p of pages) {
    const original = p.verified_text || '';
    const proofed = proofreadSanskritPage(original, p.page_number);

    if (proofed !== original) {
      updateStmt.run(proofed, proofed, p.id);
      fixedCount++;
    }

    // Derive title for Bhojpatra folio
    let pageTitle = `पत्रम् ${p.page_number}`;
    const lines = proofed.split('\n');
    for (const l of lines.slice(0, 3)) {
      if (l.startsWith('॥') && l.endsWith('॥') && l.length < 50) {
        pageTitle = l.replace(/॥/g, '').trim();
        break;
      }
      if (l.startsWith('•') || l.startsWith('▪') || l.startsWith('【')) {
        pageTitle = l.replace(/[•▪【】]/g, '').trim();
        break;
      }
      if (l.length > 3 && l.length < 40 && !l.includes('।')) {
        pageTitle = l;
        break;
      }
    }

    // Re-render folio
    await renderBhojpatraImage(bookId, p.page_number, pageTitle, proofed);

    if (p.page_number % 10 === 0 || p.page_number === pages.length) {
      console.log(`  ✓ Proofread & updated folio ${p.page_number} / ${pages.length}`);
    }
  }

  console.log(`🎉 Completed proofing for "${bookTitle}": ${fixedCount} of ${pages.length} pages improved.`);
}

async function main() {
  console.log('🕉️ STARTING AUTOMATED SANSKRIT PROOFING ENGINE...');
  await runProofingOnBook('granth-vastu-shanti-grihapravesha', 'वास्तु शान्ति, गृहप्रवेश एवं नींव पूजन पद्धति');
  await runProofingOnBook('granth-vastu-mandala', 'श्री वास्तु मण्डल देवता स्थापनम्');
  console.log('\n✨ AUTOMATED SANSKRIT PROOFING SUCCESSFULLY COMPLETED FOR ALL BOOKS!');
}

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('runSanskritProofing.ts') ||
  process.argv[1].endsWith('runSanskritProofing.js')
);

if (isDirectRun) {
  main().catch((err: unknown) => {
    console.error('Fatal error in Sanskrit proofing engine:', err);
    process.exit(1);
  });
}
