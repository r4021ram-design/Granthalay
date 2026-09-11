export interface GaneshPujanTopic {
  id: string;
  topicNumber: number;
  titleHi: string;
  titleSa: string;
  startPage: number;
  endPage: number;
  icon: string;
  description: string;
}

export interface GaneshPujanFolio {
  pageNumber: number;
  title: string;
  category: string;
  badge: string;
}

/**
 * 11 Canonical Topics from Page 1 (विषय सूची) of Sri Ganesh Pujan Paddhati:
 * १. गणेश मंत्र (पृष्ठ १)
 * २. कलश पूजनम् (पृष्ठ ७)
 * ३. षोडश मातृका पूजनम् (पृष्ठ ९)
 * ४. नवग्रह मण्डल पूजनम् (पृष्ठ ९)
 * ५. गणेश पूजन प्रारम्भ (पृष्ठ १०)
 * ६. गणेश जी की आरती (पृष्ठ १७)
 * ७. अष्टविनायक अवतार (पृष्ठ २१)
 * ८. गणेश स्तुति (पृष्ठ २१)
 * ९. संकटनाशन गणेश स्तोत्रम् (पृष्ठ २२)
 * १०. गणपत्यथर्वशीर्ष स्तोत्रम् (पृष्ठ २३)
 * ११. गणेश अष्टोत्तरशत नामावली (पृष्ठ २४)
 */
export const GANESH_PUJAN_TOPICS: GaneshPujanTopic[] = [
  {
    id: 'topic-mantra',
    topicNumber: 1,
    titleHi: 'गणेश मंत्र एवं गायत्री',
    titleSa: 'गणपतिमन्त्र-गायत्रीविधानम्',
    startPage: 1,
    endPage: 6,
    icon: '🕉️',
    description: 'एकाक्षरी, षडाक्षरी, अष्टाक्षरी मंत्र, गणेश गायत्री, शुद्धि, पवित्रीकरण, स्वस्तिवाचन एवं संकल्प।'
  },
  {
    id: 'topic-kalash-puja',
    topicNumber: 2,
    titleHi: 'कलश पूजनम्',
    titleSa: 'कलशस्थापन-पूजनविधानम्',
    startPage: 7,
    endPage: 8,
    icon: '🏺',
    description: 'वरुण देवता आवाहन, कलश प्रतिष्ठा, तीर्थ आवाहन, मुद्रा प्रदर्शन एवं चतुर्वेद पूजनम्।'
  },
  {
    id: 'topic-matrika',
    topicNumber: 3,
    titleHi: 'षोडश मातृका पूजनम्',
    titleSa: 'षोडशमातृका-पूजनम्',
    startPage: 9,
    endPage: 9,
    icon: '🌺',
    description: 'गौरी, पद्मा, शची, मेधा आदि १६ दिव्य मातृकाओं का आवाहन एवं गन्धाक्षत-पुष्प अर्चन।'
  },
  {
    id: 'topic-navagraha',
    topicNumber: 4,
    titleHi: 'नवग्रह मण्डल पूजनम्',
    titleSa: 'नवग्रहमण्डल-स्थापनम्',
    startPage: 9,
    endPage: 9,
    icon: '🪐',
    description: 'सूर्य, चन्द्र, भौम, बुध, गुरु, शुक्र, शनि, राहु, केतु का मण्डल स्थापन एवं शान्ति अर्चन।'
  },
  {
    id: 'topic-ganesh-puja',
    topicNumber: 5,
    titleHi: 'गणेश षोडशोपचार पूजन',
    titleSa: 'श्रीगणेश-षोडशोपचार-पूजनम्',
    startPage: 10,
    endPage: 16,
    icon: '🐘',
    description: 'ध्यान, आवाहन, आसन, पाद्य, अर्घ्य, पञ्चामृत स्नान, वस्त्र, यज्ञोपवीत, सिन्दूर, दूर्वा, अङ्गपूजा व नैवेद्य समर्पण।'
  },
  {
    id: 'topic-aarti',
    topicNumber: 6,
    titleHi: 'श्री गणेश जी की आरती',
    titleSa: 'नीराजन-कर्पूरारार्तिक्यम्',
    startPage: 17,
    endPage: 17,
    icon: '🪔',
    description: 'जय गणेश जय गणेश देवा, सुखकर्ता दुःखहर्ता (मराठी) एवं कर्पूर नीराजन आरती।'
  },
  {
    id: 'topic-ashtavinayak',
    topicNumber: 7,
    titleHi: 'अष्टविनायक अवतार पद',
    titleSa: 'अष्टविनायकावतार-स्मरणम्',
    startPage: 21,
    endPage: 21,
    icon: '🚩',
    description: 'मयूरेश्वर, सिद्धिविनायक, बल्लाळेश्वर, वरदविनायक आदि अष्टविनायक अवतारों का पावन स्मरण।'
  },
  {
    id: 'topic-stuti',
    topicNumber: 8,
    titleHi: 'पञ्चश्लोकी गणेश स्तुति',
    titleSa: 'श्रीगणेशपञ्चरत्न-स्तुतिः',
    startPage: 21,
    endPage: 21,
    icon: '📜',
    description: 'मुदाकरात्तमोदकं सदा विमुक्तिसाधकं कलाधरावतंसकं विलासिलोकरक्षकम्।'
  },
  {
    id: 'topic-sankatnashan',
    topicNumber: 9,
    titleHi: 'संकटनाशन गणेश स्तोत्रम्',
    titleSa: 'संकटनाशन-गणेशस्तोत्रम्',
    startPage: 22,
    endPage: 22,
    icon: '🛡️',
    description: 'नारदपुराणोक्त द्वादश नाम स्तोत्र — प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम्।'
  },
  {
    id: 'topic-atharvashirsha',
    topicNumber: 10,
    titleHi: 'गणपत्यथर्वशीर्ष स्तोत्रम्',
    titleSa: 'श्रीगणपत्यथर्वशीर्षोपनिषत्',
    startPage: 23,
    endPage: 23,
    icon: '⚡',
    description: 'वैदिक अथर्ववेदीय उपनिषद् — त्वमेव केवलं कर्तासि, त्वमेव केवलं धर्तासि, त्वमेव प्रत्यक्षं तत्त्वमसि।'
  },
  {
    id: 'topic-ashtottarashata',
    topicNumber: 11,
    titleHi: 'गणेश अष्टोत्तरशत नामावली',
    titleSa: 'श्रीगणेशाष्टोत्तरशत-नामावलिः',
    startPage: 24,
    endPage: 24,
    icon: '📿',
    description: '१०८ दिव्य सिद्ध नामावली (ॐ गजाननाय नमः, ॐ गणाध्यक्षाय नमः, ॐ विघ्नराजाय नमः...)।'
  }
];

export const GANESH_PUJAN_FOLIOS: GaneshPujanFolio[] = [
  { pageNumber: 1, title: 'विषय सूची एवं गणेश मंत्र व गायत्री', category: 'पूर्वपीठिका', badge: 'विषय सूची' },
  { pageNumber: 2, title: 'गणेश पूजन प्रारम्भ एवं शुद्धि विधान', category: 'शुद्धि विधान', badge: 'पवित्रीकरण' },
  { pageNumber: 3, title: 'कलश जल पूरण एवं स्वस्ति वाचन (भाग १)', category: 'मङ्गल वाचन', badge: 'स्वस्ति वाचन' },
  { pageNumber: 4, title: 'स्वस्ति वाचन (भाग २) एवं सर्वदेव नमस्कार', category: 'मङ्गल वाचन', badge: 'देव नमस्कार' },
  { pageNumber: 5, title: 'मङ्गलाचरण (शेष) एवं संकल्प विधान', category: 'सङ्कल्प', badge: 'महा सङ्कल्प' },
  { pageNumber: 6, title: 'रक्षा विधान, दीप, शङ्ख, घण्टा, गणेश-गौरी ध्यान', category: 'पीठ पूजा', badge: 'ध्यानम्' },
  { pageNumber: 7, title: 'कलश पूजनम् (भाग १)', category: 'कलश पूजा', badge: 'वरुण प्रतिष्ठा' },
  { pageNumber: 8, title: 'कलश पूजनम् (भाग २) एवं चतुर्वेद पूजन', category: 'कलश पूजा', badge: 'वेद पूजन' },
  { pageNumber: 9, title: 'षोडश मातृका एवं नवग्रह मण्डल पूजनम्', category: 'मण्डल पूजा', badge: 'मातृका व नवग्रह' },
  { pageNumber: 10, title: 'गणेश षोडशोपचार — ध्यान, प्रतिष्ठा, आसन, पाद्य, अर्घ्य', category: 'षोडशोपचार', badge: 'उपचार १-५' },
  { pageNumber: 11, title: 'पञ्चामृत एवं षड्रस स्नान विधान', category: 'षोडशोपचार', badge: 'पञ्चामृत स्नान' },
  { pageNumber: 12, title: 'पञ्चामृत, गन्धोदक, अभिषेक, वस्त्र व यज्ञोपवीत', category: 'षोडशोपचार', badge: 'वस्त्रोपवीत' },
  { pageNumber: 13, title: 'चन्दन, सिन्दूर, अक्षत, पुष्पमाला, दूर्वा समर्पण', category: 'षोडशोपचार', badge: 'दूर्वा व सिन्दूर' },
  { pageNumber: 14, title: 'पत्र, सुगन्ध, धूप, दीप एवं अङ्ग पूजनम् (भाग १)', category: 'षोडशोपचार', badge: 'अङ्ग पूजन' },
  { pageNumber: 15, title: 'अङ्ग पूजन (शेष), आवरण पूजन एवं गणेश न्यास', category: 'षोडशोपचार', badge: 'आवरण व न्यास' },
  { pageNumber: 16, title: 'नैवेद्य, ऋतुफल, ताम्बूल एवं दक्षिणा समर्पण', category: 'षोडशोपचार', badge: 'नैवेद्य व फल' },
  { pageNumber: 17, title: 'श्री गणेश जी की आरती — मराठी व हिन्दी एवं कर्पूर आरती', category: 'आरती', badge: 'नीराजन' },
  { pageNumber: 18, title: 'मन्त्रपुष्पाञ्जलि, प्रदक्षिणा, विशेषार्घ्य एवं साष्टाङ्ग प्रणाम', category: 'उत्तर पूजा', badge: 'पुष्पाञ्जलि' },
  { pageNumber: 19, title: 'क्षमा प्रार्थना, समर्पण, विसर्जन एवं प्रार्थना', category: 'उत्तर पूजा', badge: 'विसर्जन' },
  { pageNumber: 20, title: 'वेदोक्त आशीर्वाद, तीर्थग्रहण, उच्छिष्टगन्ध व अष्टविनायक', category: 'आशीर्वाद', badge: 'तीर्थ व रक्षा' },
  { pageNumber: 21, title: 'अष्टविनायक अवतार पद एवं पञ्चश्लोकी श्री गणेश स्तुति', category: 'स्तोत्र व स्तुति', badge: 'अष्टविनायक' },
  { pageNumber: 22, title: 'संकटनाशन गणेश स्तोत्रम् (नारदपुराणोक्त)', category: 'स्तोत्र व स्तुति', badge: 'संकटनाशन' },
  { pageNumber: 23, title: 'गणपत्यथर्वशीर्ष स्तोत्रम्', category: 'वैदिक उपनिषद्', badge: 'अथर्वशीर्ष' },
  { pageNumber: 24, title: 'श्री गणेश अष्टोत्तरशत नामावलिः', category: 'नामावली', badge: '१०८ नामावली' },
];
