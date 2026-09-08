export interface GitaChapter {
  id: number;
  sectionType: 'adhyaya' | 'concluding';
  chapterNumber?: number;
  titleSa: string;
  titleHi: string;
  nameSa: string;
  nameHi: string;
  shlokaCount: number;
  startPage: number;
  endPage: number;
  description: string;
}

export const GITA_SECTIONS: GitaChapter[] = [
  {
    id: 1,
    sectionType: 'adhyaya',
    chapterNumber: 1,
    titleSa: 'अथ प्रथमोऽध्यायः',
    titleHi: 'प्रथम अध्याय: अर्जुनविषादयोग',
    nameSa: 'अर्जुनविषादयोग',
    nameHi: 'सैन्य-निरीक्षण एवं विषाद',
    shlokaCount: 47,
    startPage: 1,
    endPage: 12,
    description: 'दोनों सेनाओं के शूरवीरों की गणना, शंखध्वनि, अर्जुन द्वारा सैन्य-निरीक्षण एवं विषाद'
  },
  {
    id: 2,
    sectionType: 'adhyaya',
    chapterNumber: 2,
    titleSa: 'अथ द्वितीयोऽध्यायः',
    titleHi: 'द्वितीय अध्याय: सांख्ययोग',
    nameSa: 'सांख्ययोग',
    nameHi: 'ज्ञानयोग, निष्काम कर्मयोग व स्थितप्रज्ञ लक्षण',
    shlokaCount: 72,
    startPage: 13,
    endPage: 34,
    description: 'अर्जुन की कायरता पर उपालम्भ, आत्मा की अमरता, स्वधर्म-पालन, कर्मयोग एवं स्थितप्रज्ञ'
  },
  {
    id: 3,
    sectionType: 'adhyaya',
    chapterNumber: 3,
    titleSa: 'अथ तृतीयोऽध्यायः',
    titleHi: 'तृतीय अध्याय: कर्मयोग',
    nameSa: 'कर्मयोग',
    nameHi: 'यज्ञार्थ कर्म, लोकसंग्रह एवं काम-विजय',
    shlokaCount: 43,
    startPage: 35,
    endPage: 48,
    description: 'कर्म की आवश्यकता, यज्ञ-चक्र, महापुरुषों का लोकसंग्रह, काम और क्रोध पर विजय'
  },
  {
    id: 4,
    sectionType: 'adhyaya',
    chapterNumber: 4,
    titleSa: 'अथ चतुर्थोऽध्यायः',
    titleHi: 'चतुर्थ अध्याय: ज्ञानकर्मसंन्यासयोग',
    nameSa: 'ज्ञानकर्मसंन्यासयोग',
    nameHi: 'अवतार रहस्य, कर्म-अकर्म-विकर्म एवं ज्ञान-यज्ञ',
    shlokaCount: 42,
    startPage: 49,
    endPage: 61,
    description: 'भगवान् के अवतार का रहस्य, विभिन्न प्रकार के यज्ञ और तत्त्वज्ञान की महिमा'
  },
  {
    id: 5,
    sectionType: 'adhyaya',
    chapterNumber: 5,
    titleSa: 'अथ पञ्चमोऽध्यायः',
    titleHi: 'पञ्चम अध्याय: कर्मसंन्यासयोग',
    nameSa: 'कर्मसंन्यासयोग',
    nameHi: 'संन्यास व कर्मयोग की एकता, ब्रह्मनिर्वाण',
    shlokaCount: 29,
    startPage: 62,
    endPage: 70,
    description: 'सांख्य और निष्काम कर्मयोग का एक फल, निष्काम कर्म का आचरण एवं परमानन्द'
  },
  {
    id: 6,
    sectionType: 'adhyaya',
    chapterNumber: 6,
    titleSa: 'अथ षष्ठोऽध्यायः',
    titleHi: 'षष्ठ अध्याय: आत्मसंयमयोग',
    nameSa: 'आत्मसंयमयोग (ध्यानयोग)',
    nameHi: 'मन-निग्रह, ध्यान-विधि एवं योगभ्रष्ट की गति',
    shlokaCount: 47,
    startPage: 71,
    endPage: 85,
    description: 'योगारूढ़ के लक्षण, मन को वश में करने का उपाय, ध्यान का स्वरूप एवं योगी की श्रेष्ठता'
  },
  {
    id: 7,
    sectionType: 'adhyaya',
    chapterNumber: 7,
    titleSa: 'अथ सप्तमोऽध्यायः',
    titleHi: 'सप्तम अध्याय: ज्ञानविज्ञानयोग',
    nameSa: 'ज्ञानविज्ञानयोग',
    nameHi: 'परा-अपरा प्रकृति, माया एवं चार प्रकार के भक्त',
    shlokaCount: 30,
    startPage: 86,
    endPage: 94,
    description: 'भगवान् की दोनों प्रकृतियां, माया-तरण, चार प्रकार के भक्त (आर्त, जिज्ञासु, अर्थार्थी, ज्ञानी)'
  },
  {
    id: 8,
    sectionType: 'adhyaya',
    chapterNumber: 8,
    titleSa: 'अथाष्टमोऽध्यायः',
    titleHi: 'अष्टम अध्याय: अक्षरब्रह्मयोग',
    nameSa: 'अक्षरब्रह्मयोग',
    nameHi: 'अन्तकाल का स्मरण, शुक्ल-कृष्ण गति एवं परम धाम',
    shlokaCount: 28,
    startPage: 95,
    endPage: 104,
    description: 'ब्रह्म-अध्यात्म-कर्म का स्वरूप, प्रयाण-काल में भगवान् का स्मरण और दोनों दिव्य गतियां'
  },
  {
    id: 9,
    sectionType: 'adhyaya',
    chapterNumber: 9,
    titleSa: 'अथ नवमोऽध्यायः',
    titleHi: 'नवम अध्याय: राजविद्याराजगुह्ययोग',
    nameSa: 'राजविद्याराजगुह्ययोग',
    nameHi: 'परम गुह्य ज्ञान, जगत-उत्पत्ति एवं अनन्य भक्ति',
    shlokaCount: 34,
    startPage: 105,
    endPage: 115,
    description: 'राजविद्या, सृष्टि की उत्पत्ति और लय, सकाम-निष्काम उपासना, पत्रं पुष्पं फलं तोयं'
  },
  {
    id: 10,
    sectionType: 'adhyaya',
    chapterNumber: 10,
    titleSa: 'अथ दशमोऽध्यायः',
    titleHi: 'दशम अध्याय: विभूतियोग',
    nameSa: 'विभूतियोग',
    nameHi: 'भगवान् की दिव्य विभूतियों का विस्तार',
    shlokaCount: 42,
    startPage: 116,
    endPage: 122,
    description: 'चतुःश्लोकी गीता (१०.८-११), अर्जुन की स्तुति, भगवान् की मुख्य दिव्य विभूतियों का वर्णन'
  },
  {
    id: 11,
    sectionType: 'adhyaya',
    chapterNumber: 11,
    titleSa: 'अथैकादशोऽध्यायः',
    titleHi: 'एकादश अध्याय: विश्वरूपदर्शनयोग',
    nameSa: 'विश्वरूपदर्शनयोग',
    nameHi: 'विराट रूप का साक्षात्कार, भय-विस्मय एवं चतुर्भुज दर्शन',
    shlokaCount: 55,
    startPage: 123,
    endPage: 148,
    description: 'दिव्य चक्षु प्रदान, सहस्र सूर्यों के समान तेज, कालोऽस्मि लोकक्षयकृत्प्रवृद्धो, सौम्य रूप'
  },
  {
    id: 12,
    sectionType: 'adhyaya',
    chapterNumber: 12,
    titleSa: 'अथ द्वादशोऽध्यायः',
    titleHi: 'द्वादश अध्याय: भक्तियोग',
    nameSa: 'भक्तियोग',
    nameHi: 'सगुण-निर्गुण उपासना एवं प्रिय भक्त के ३६ लक्षण',
    shlokaCount: 20,
    startPage: 149,
    endPage: 155,
    description: 'सगुणोपासक और निर्गुणोपासक की तुलना, भक्ति-प्राप्ति के उपाय, भगवान् के अतिप्रिय भक्तों के सद्गुण'
  },
  {
    id: 13,
    sectionType: 'adhyaya',
    chapterNumber: 13,
    titleSa: 'अथ त्रयोदशोऽध्यायः',
    titleHi: 'त्रयोदश अध्याय: क्षेत्रक्षेत्रज्ञविभागयोग',
    nameSa: 'क्षेत्रक्षेत्रज्ञविभागयोग',
    nameHi: 'शरीर (क्षेत्र), आत्मा (क्षेत्रज्ञ), ज्ञान के २० साधन',
    shlokaCount: 34,
    startPage: 156,
    endPage: 167,
    description: 'क्षेत्र और क्षेत्रज्ञ का विवेक, ज्ञान के साधन, ज्ञेय परमात्मा का स्वरूप एवं मोक्ष'
  },
  {
    id: 14,
    sectionType: 'adhyaya',
    chapterNumber: 14,
    titleSa: 'अथ चतुर्दशोऽध्यायः',
    titleHi: 'चतुर्दश अध्याय: गुणत्रयविभागयोग',
    nameSa: 'गुणत्रयविभागयोग',
    nameHi: 'सत्त्व-रज-तम गुण, बन्धन के कारण एवं गुणातीत के लक्षण',
    shlokaCount: 27,
    startPage: 168,
    endPage: 177,
    description: 'तीनों गुणों का स्वरूप, उनका फल, मृत्यु के बाद की गतियाँ एवं गुणातीत होने का उपाय'
  },
  {
    id: 15,
    sectionType: 'adhyaya',
    chapterNumber: 15,
    titleSa: 'अथ पञ्चदशोऽध्यायः',
    titleHi: 'पञ्चदश अध्याय: पुरुषोत्तमयोग',
    nameSa: 'पुरुषोत्तमयोग',
    nameHi: 'संसार-वृक्ष, क्षर-अक्षर एवं उत्तम पुरुष',
    shlokaCount: 20,
    startPage: 178,
    endPage: 187,
    description: 'अश्वत्थ संसार-वृक्ष का छेदन, भगवद्धाम की महिमा, जीवात्मा का स्वरूप एवं पुरुषोत्तम'
  },
  {
    id: 16,
    sectionType: 'adhyaya',
    chapterNumber: 16,
    titleSa: 'अथ षोडशोऽध्यायः',
    titleHi: 'षोडश अध्याय: दैवासुरसम्पद्विभागयोग',
    nameSa: 'दैवासुरसम्पद्विभागयोग',
    nameHi: 'दैवी एवं आसुरी सम्पदा, नरक के तीन द्वार',
    shlokaCount: 24,
    startPage: 188,
    endPage: 195,
    description: 'दैवी गुणों का फल, आसुरी प्रकृति के लक्षण, काम-क्रोध-लोभ का त्याग एवं शास्त्र-प्रमाण'
  },
  {
    id: 17,
    sectionType: 'adhyaya',
    chapterNumber: 17,
    titleSa: 'अथ सप्तदशोऽध्यायः',
    titleHi: 'सप्तदश अध्याय: श्रद्धात्रयविभागयोग',
    nameSa: 'श्रद्धात्रयविभागयोग',
    nameHi: 'त्रिविध श्रद्धा, आहार, यज्ञ, तप, दान एवं ॐ तत्सत्',
    shlokaCount: 28,
    startPage: 196,
    endPage: 204,
    description: 'श्रद्धा, भोजन, यज्ञ, तप और दान के तीन-तीन भेद तथा ॐ तत्सत् का दिव्य अर्थ'
  },
  {
    id: 18,
    sectionType: 'adhyaya',
    chapterNumber: 18,
    titleSa: 'अथाष्टादशोऽध्यायः',
    titleHi: 'अष्टादश अध्याय: मोक्षसंन्यासयोग',
    nameSa: 'मोक्षसंन्यासयोग',
    nameHi: 'त्याग-संन्यास, वर्णधर्म, शरणागति एवं गीता-उपसंहार',
    shlokaCount: 78,
    startPage: 205,
    endPage: 232,
    description: 'त्याग के तीन प्रकार, कर्म के पांच हेतु, वर्ण-स्वधर्म, सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज'
  },
  {
    id: 19,
    sectionType: 'concluding',
    titleSa: 'आरती श्रीगीताजी की',
    titleHi: 'आरती: जय भगवद्गीते, जय भगवद्गीते',
    nameSa: 'आरती',
    nameHi: 'श्रीगीता आरती',
    shlokaCount: 0,
    startPage: 233,
    endPage: 233,
    description: 'जय भगवद्गीते, जय भगवद्गीते । हरि-हिय-कमल-विहारिणि, सुन्दर सुपनीते ॥'
  }
];

export const TOTAL_GITA_PAGES = 233;
