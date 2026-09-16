/**
 * healCrossPageTransitions.cjs
 *
 * Deterministically aligns and heals cross-page transitions, broken/hyphenated words,
 * stranded verse numbers, and numbering sequence gaps across all 284 folios of
 * Brihat Stotra Ratnakar.
 *
 * Synchronizes SQLite (storage/granth.db) and JSON (public/data/books/granth-brihat-stotra-ratnakar.json).
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '../storage/granth.db');
const JSON_PATH = path.join(__dirname, '../public/data/books/granth-brihat-stotra-ratnakar.json');

const db = new Database(DB_PATH);
const bookData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// Helper to get page text from bookData
function getPage(num) {
  return bookData.pages.find(p => p.page_number === num);
}

const pageReplacements = {};

function replaceInPage(pageNum, searchStr, replaceStr) {
  const p = getPage(pageNum);
  if (!p) throw new Error(`Page ${pageNum} not found`);
  let text = pageReplacements[pageNum] !== undefined ? pageReplacements[pageNum] : (p.verified_text || '');
  if (!text.includes(searchStr)) {
    console.warn(`[WARN] Page ${pageNum}: Search string not found: "${searchStr.slice(0, 40)}..."`);
    return false;
  }
  pageReplacements[pageNum] = text.replace(searchStr, replaceStr);
  return true;
}

console.log('Applying targeted cross-page alignments and word reunifications...\n');

// 1. P149 -> P150: कनकरुचिरे
replaceInPage(149, 'स्थितं मूलाधारे कनक-', 'स्थितं मूलाधारे');
replaceInPage(150, '-रुचिरे वह्निवसतेः', 'कनकरुचिरे वह्निवसतेः');

// 2. P158 -> P159: दुरापारसंसारपयोधिं
replaceInPage(158, 'दुरापारसंसार-', '');
replaceInPage(159, '-पयोधिं तरन्तो भजन्त्यच्युतं ये कलौ कल्किनं तम् ।', 'दुरापारसंसारपयोधिं तरन्तो भजन्त्यच्युतं ये कलौ कल्किनं तम् ।');

// 3. P163 -> P164: सन्दधतेऽव्ययात्मने
replaceInPage(164, '-ऽव्ययात्मने ॥ १ ॥', 'ऽव्ययात्मने ॥ १ ॥');

// 4. P166 -> P167: यज्ञकर्मप्रबोधकम्
replaceInPage(166, 'नमामि यज्ञफलदं यज्ञकर्म-', 'नमामि यज्ञफलदं');
replaceInPage(167, '-प्रबोधकम् ॥ ९ ॥', 'यज्ञकर्मप्रबोधकम् ॥ ९ ॥');

// 5. P172 -> P173: श्रीरामस्तवराजः missing ॥ ७३ ॥ and colophon alignment
replaceInPage(173, `दानवानां तथैव च ।
माता पिता तथा भ्राता त्वमेव रघुपूङ्गव ।
सर्वेषां त्वं परं ब्रह्म त्वन्मयं सर्वमेव हि ॥ ७४ ॥`,
`दानवानां तथैव च ॥ ७३ ॥

माता पिता तथा भ्राता त्वमेव रघुवल्लभ ।
सर्वेषां त्वं परं ब्रह्म त्वन्मयं सर्वमेव हि ॥ ७४ ॥`);

// 6. P173 -> P174: Remove catchword (श्रीरामचन्द्र रघुपुङ्गव...)
replaceInPage(173, '\n\n(श्रीरामचन्द्र रघुपुङ्गव...)', '');

// 7. P174 -> P175: विज्ञानमज्ञानतमःप्रशान्तये
replaceInPage(174, 'विज्ञानमज्ञान-', '');
replaceInPage(175, '-तमःप्रशान्तये', 'विज्ञानमज्ञानतमःप्रशान्तये');

// 8. P194 -> P195: यस्तु पठेन्नित्यं
replaceInPage(194, 'यस्तु पठे-', 'यस्तु');
replaceInPage(195, 'न्नित्यं सर्वसिद्धिर्भवेद् ध्रुवम् ॥ २० ॥', 'पठेन्नित्यं सर्वसिद्धिर्भवेद् ध्रुवम् ॥ २० ॥');

// 9. P201 -> P202: भूयादहमपि
replaceInPage(201, 'तव प्रीत्यै भूया-', 'तव प्रीत्यै');
replaceInPage(202, 'दहमपि च दासस्तव विभो', 'भूयादहमपि च दासस्तव विभो');

// 10. P204 -> P205: किरीटोज्ज्वलविग्रहम्
replaceInPage(204, 'हेमाङ्गदतुलाकोटिकिरीटोज्ज्वल-', 'हेमाङ्गदतुलाकोटि-');
replaceInPage(205, 'विग्रहम् ।', 'किरीटोज्ज्वलविग्रहम् ।');

// 11. P211 -> P212: जन्ममृत्युजराव्याधिशोकेभ्यो
replaceInPage(211, 'जन्म-', '');
replaceInPage(212, 'मृत्युजराव्याधिशोकेभ्यो मुच्यते नरः ॥ २१ ॥', 'जन्ममृत्युजराव्याधिशोकेभ्यो मुच्यते नरः ॥ २१ ॥');

// 12. P213 -> P214: गोपवेषस्य
replaceInPage(213, 'अखिलभुवनरक्षागोपवेष-', 'अखिलभुवनरक्षा-');
replaceInPage(214, 'स्य विष्णोरधरमणिसुधाया वंशवान्वंशनालः ॥ १७ ॥', 'गोपवेषस्य विष्णोरधरमणिसुधाया वंशवान्वंशनालः ॥ १७ ॥');

// 13. P214 -> P215: गोभिर्निगदितगोविन्द
replaceInPage(214, 'गोभिर्नि-', '');
replaceInPage(215, 'गदितगोविन्दस्फुटनामानं बहुनामानं गोपिकरदूरं प्रणमत गोविन्दं परमानन्दम् ॥ ४ ॥', 'गोभिर्निगदितगोविन्दस्फुटनामानं बहुनामानं गोपिकरदूरं प्रणमत गोविन्दं परमानन्दम् ॥ ४ ॥');

// 14. P216 -> P217: राधिकाधिपम्
replaceInPage(216, 'धराभरावतारणं नमामि राधि-', 'धराभरावतारणं नमामि');
replaceInPage(217, 'काधिपम् ॥ ६ ॥', 'राधिकाधिपम् ॥ ६ ॥');

// 15. P224 -> P225: पावनम्
replaceInPage(224, 'पादोदकं पाव-', 'पादोदकं');
replaceInPage(225, 'नम् ।', 'पावनम् ।');

// 16. P226 -> P227: विमुक्तिगणिकासङ्गाय
replaceInPage(226, 'गङ्गाम्भःकणिका विमुक्ति-', 'गङ्गाम्भःकणिका');
replaceInPage(227, 'गणिकासङ्गाय संभाव्यते ॥ ५ ॥', 'विमुक्तिगणिकासङ्गाय संभाव्यते ॥ ५ ॥');

// 17. P227 -> P228: जह्नुपुत्र्यास्त्रिकालं
replaceInPage(227, 'इदं यः पठे्राष्टकं जह्नु-', 'इदं यः पठे्राष्टकं');
replaceInPage(228, 'पुत्र्यास्त्रिकालं कृतं कालिदासेन रम्यम् ।', 'जह्नुपुत्र्यास्त्रिकालं कृतं कालिदासेन रम्यम् ।');

// 18. P228 -> P229: सेवनेकनिपुणो
replaceInPage(228, 'गंगे मे तव सेवने-', 'गंगे मे तव');
replaceInPage(229, 'कनिपुणोऽप्यानंदितश्चादृतः', 'सेवनेकनिपुणोऽप्यानंदितश्चादृतः');

// 19. P230 -> P231: मनोविलासम्
replaceInPage(230, 'चराचरं भाति मनो-', 'चराचरं भाति');
replaceInPage(231, 'विलासम् ।', 'मनोविलासम् ।');

// 20. P234 -> P235: Move stranded ॥ ५ ॥ to P234
replaceInPage(234, 'काशी मुक्तिपुरी सदा शिवकरी धर्मार्थकामोत्तरा', 'काशी मुक्तिपुरी सदा शिवकरी धर्मार्थकामोत्तरा ॥ ५ ॥');
replaceInPage(235, '॥ ५ ॥\n\n', '');

// 21. P238 -> P239: विग्रहसंधौ
replaceInPage(238, 'मा कुरु यत्नं विग्रह-', 'मा कुरु यत्नं');
replaceInPage(239, 'संधौ । भव समचित्तः', 'विग्रहसंधौ । भव समचित्तः');

// 22. P239 -> P240: जननीजठरे
replaceInPage(239, 'पुनरपि जननं पुनरपि मरणं पुनरपि जननी-', 'पुनरपि जननं पुनरपि मरणं पुनरपि');
replaceInPage(240, 'जठरे शयनम् ।', 'जननीजठरे शयनम् ।');

// 23. P240 -> P241: नित्योपलब्धिस्वरूपोऽह०
replaceInPage(240, 'प्रवर्तंत आश्रित्य निष्कंपमेकं स नित्योपलब्धि-', 'प्रवर्तंत आश्रित्य निष्कंपमेकं स');
replaceInPage(241, 'स्वरूपोऽह० ॥ ४ ॥', 'नित्योपलब्धिस्वरूपोऽह० ॥ ४ ॥');

// 24. P242 -> P243: रज्जुसर्पवदात्मानं
replaceInPage(242, 'रज्जुसर्पवदा-', 'रज्जुसर्पवत्');
replaceInPage(243, 'त्मानं जीवं ज्ञात्वा भयं वहेत् ।', 'आत्मानं जीवं ज्ञात्वा भयं वहेत् ।');

// 25. P243 -> P244: सम्यग्विज्ञानवान्योगी
replaceInPage(243, 'सम्यग्वि-', '');
replaceInPage(244, 'ज्ञानवान्योगी स्वात्मन्येवाखिलं स्थितम् ।', 'सम्यग्विज्ञानवान्योगी स्वात्मन्येवाखिलं स्थितम् ।');

// 26. P244 -> P245: बोधभानुस्तमोऽपहृत्
replaceInPage(244, 'हृदाकाशोदितो ह्यात्मा बोधभानु-', 'हृदाकाशोदितो ह्यात्मा');
replaceInPage(245, 'स्तमोऽपहृत् । सर्वव्यापी', 'बोधभानुस्तमोऽपहृत् । सर्वव्यापी');

// 27. P245 -> P246: अन्त्यवेषधरं
replaceInPage(245, 'अन्त्य-', '');
replaceInPage(246, 'वेषधरं दृष्ट्वा गच्छ गच्छेति चाब्रवीत् ।', 'अन्त्यवेषधरं दृष्ट्वा गच्छ गच्छेति चाब्रवीत् ।');

// 28. P246 -> P247: कश्चिदुद्विग्नमानसः
replaceInPage(246, 'तापत्रयार्कसंतप्तः कश्चि-', 'तापत्रयार्कसंतप्तः');
replaceInPage(247, 'दुद्विग्नमानसः ।', 'कश्चिदुद्विग्नमानसः ।');

// 29. P247 -> P248: सोऽहमित्यवधारय
replaceInPage(247, 'यो वेत्त्यविक्रियः साक्षात्सोऽहमित्य-', 'यो वेत्त्यविक्रियः साक्षात्');
replaceInPage(248, 'वधारय ॥ २२ ॥', 'सोऽहमित्यवधारय ॥ २२ ॥');

// 30. P250 -> P251: Move stranded ॥ २० ॥ to P250
replaceInPage(250, 'प्रकृतीनां हितैर्युक्तं प्रकृतिप्रियकाम्यया', 'प्रकृतीनां हितैर्युक्तं प्रकृतिप्रियकाम्यया ॥ २० ॥');
replaceInPage(251, '॥ २० ॥\n\n', '');

// 31. P253 -> P254: राघवस्य महात्मनः
replaceInPage(253, 'सदेवर्षिगणं तुष्टं राघवस्य महा-', 'सदेवर्षिगणं तुष्टं राघवस्य');
replaceInPage(254, 'त्मनः । बभौ रामः संप्रहृष्टः पूजितः सर्वदैवतैः ॥ ८४ ॥', 'महात्मनः । बभौ रामः संप्रहृष्टः पूजितः सर्वदैवतैः ॥ ८४ ॥');

// 32. P254 -> P255: अधिगततत्त्वः
replaceInPage(254, 'को गुरुरधि-', 'को गुरुः');
replaceInPage(255, 'गततत्त्वः शिष्यहितायोद्यतः सततम् ॥ २ ॥', 'अधिगततत्त्वः शिष्यहितायोद्यतः सततम् ॥ २ ॥');

// 33. P256 -> P257: कमलाकर आत्मभूः
replaceInPage(256, 'कोकशोकापहर्ता च कम-', 'कोकशोकापहर्ता च');
replaceInPage(257, 'लाकर आत्मभूः ॥ ११ ॥', 'कमलाकर आत्मभूः ॥ ११ ॥');

// 34. P258 -> P259: बुधपञ्चविंशतिनामस्तोत्रम् ॥ ४ ॥ and ॥ ५ ॥
replaceInPage(258, 'पञ्चविंशति नामानि बुधस्यैतानि यः पठेत्', 'पञ्चविंशति नामानि बुधस्यैतानि यः पठेत् ॥ ४ ॥');
replaceInPage(259, '॥ ४ ॥ स्मृत्वा बुधं सदा तस्य पीडा सर्वा विनश्यति ।', 'स्मृत्वा बुधं सदा तस्य पीडा सर्वा विनश्यति ।');

// 35. P260 -> P261: भयाद्विमुच्येत
replaceInPage(260, 'भीतो भयाद्वि-', 'भीतो');
replaceInPage(261, 'मुच्येत बद्धो मुच्येत बन्धनात् ।', 'भयाद्विमुच्येत बद्धो मुच्येत बन्धनात् ।');

// 36. P261 -> P262: नीलवर्णोऽञ्जनद्युतिः
replaceInPage(261, 'ब्रह्मण्योऽक्रूरधर्मज्ञो नील-', 'ब्रह्मण्योऽक्रूरधर्मज्ञो');
replaceInPage(262, 'वर्णोऽञ्जनद्युतिः ।', 'नीलवर्णोऽञ्जनद्युतिः ।');

// 37. P268 -> P269: लक्ष्मीप्रियसखी
replaceInPage(268, 'लक्ष्मी-', '');
replaceInPage(269, 'प्रियसखी देवी द्यौर्भूमिरचला चला ।', 'लक्ष्मीप्रियसखी देवी द्यौर्भूमिरचला चला ।');

// 38. P270 -> P271: Move stranded ॥ ६ ॥ to P270
replaceInPage(270, 'अन्वयव्यतिरेकाभ्यां यत्स्यात्सर्वत्र सर्वदा', 'अन्वयव्यतिरेकाभ्यां यत्स्यात्सर्वत्र सर्वदा ॥ ६ ॥');
replaceInPage(271, '॥ ६ ॥\n\n', '');

// 39. P271 -> P272: मुक्तामयैराभरणैः
replaceInPage(271, 'शरच्छशांकप्रभमश्ववक्त्रमुक्ताम-', 'शरच्छशांकप्रभमश्ववक्त्र-');
replaceInPage(272, 'यैराभरणैः प्रदीप्तम् ।', 'मुक्तामयैराभरणैः प्रदीप्तम् ।');

// 40. P278 -> P279: सोऽपि
replaceInPage(278, 'पुस्तकं पूजयेद्यस्तु श्रद्धया परया मुदा । सोऽपि', 'पुस्तकं पूजयेद्यस्तु श्रद्धया परया मुदा ।');
replaceInPage(279, 'माङ्गल्यमाप्नोति इहामुत्र परां गतिम् ॥ २७ ॥', 'सोऽपि माङ्गल्यमाप्नोति इहामुत्र परां गतिम् ॥ २७ ॥');

// 41. P279 -> P280: नाभिं
replaceInPage(279, 'पञ्चवक्त्रः स्तनौ पातु उदरं जगदीश्वरः । नाभिं', 'पञ्चवक्त्रः स्तनौ पातु उदरं जगदीश्वरः ।');
replaceInPage(280, 'पातु विरूपाक्षः पार्श्वौ मे पार्वतीपतिः ॥ १६ ॥', 'नाभिं पातु विरूपाक्षः पार्श्वौ मे पार्वतीपतिः ॥ १६ ॥');

console.log(`\nPersisting updates to SQLite and JSON for ${Object.keys(pageReplacements).length} pages...`);

const updateStmt = db.prepare(`
  UPDATE pages
  SET verified_text = ?
  WHERE book_id = 'granth-brihat-stotra-ratnakar' AND page_number = ?
`);

for (const [pageNumStr, newText] of Object.entries(pageReplacements)) {
  const pageNum = parseInt(pageNumStr, 10);
  const trimmed = newText.trim();

  // 1. SQLite
  updateStmt.run(trimmed, pageNum);

  // 2. JSON
  const p = getPage(pageNum);
  p.verified_text = trimmed;

  console.log(`Updated Page ${pageNum}`);
}

fs.writeFileSync(JSON_PATH, JSON.stringify(bookData, null, 2), 'utf8');
db.close();

console.log('\nAll updates saved successfully to SQLite and JSON.');
