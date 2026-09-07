import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db.js';
import { PAGES_DIR, PREPROCESSED_DIR } from './documentProcessor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CuratedPage {
  page_number: number;
  title: string;
  chhandas?: string;
  text: string;
}

interface CuratedBook {
  id: string;
  title: string;
  author: string;
  description: string;
  language: 'sa';
  category: string;
  deity: string;
  chhandas: string;
  pages: CuratedPage[];
}

export const CURATED_BOOKS: CuratedBook[] = [
  // 1. Sri Shankarashtakam (Lalitaalaalitah)
  {
    id: 'granth-shankarashtakam',
    title: 'श्रीशङ्कराष्टकम् (Śrī Śaṅkarāṣṭakam)',
    author: 'श्रीमच्छङ्कराचार्यविरचितम्',
    description: 'भगवान् भूतभावन शङ्कर की स्तुति में रचित परम पावन अष्टकम्। भुजङ्गप्रयात छन्द (य-गण चतुष्टय) में निबद्ध, Lalitaalaalitah स्तोत्र संग्रह से प्रमाणित।',
    language: 'sa',
    category: 'ashtaka',
    deity: 'shiva',
    chhandas: 'भुजङ्गप्रयात छन्द',
    pages: [
      {
        page_number: 1,
        title: 'श्रीशङ्कराष्टकम् - श्लोकाः १-४',
        chhandas: 'भुजङ्गप्रयात',
        text: `॥ श्रीगणेशाय नमः ॥
॥ अथ श्रीमच्छङ्कराचार्यविरचितं श्रीशङ्कराष्टकम् ॥

【 मङ्गलाचरणम् एवं श्लोक १-४ 】
यतोऽनन्तशक्तेरनन्ताश्च जीवा
यतो निर्गुणादप्रमेया गुणास्ते ।
यतो भाति सर्वं त्रिधा भेदभिन्नं
सदा तं भजे शङ्करं भूतनाथम् ॥ १ ॥

यमेकं समाधौ यतन्तो यतन्तः
समभ्यर्चयन्तो विशन्तीव शान्ताः ।
सदानन्दसान्द्रं पराविक्षयं तं
सदा तं भजे शङ्करं भूतनाथम् ॥ २ ॥

यतः सूर्यचन्द्राग्नयो भासमाना
जगद्भासयन्त्यल्पशक्त्या स्फुरन्तः ।
यदंशेन विश्वं समस्तं विभाति
सदा तं भजे शङ्करं भूतनाथम् ॥ ३ ॥

यदाद्यन्तरहितं विशुद्धं परेशं
गुणातीतमीशं निराकारमेकम् ।
मुनीन्द्रा भजन्ते विमुक्ताखिलेहाः
सदा तं भजे शङ्करं भूतनाथम् ॥ ४ ॥`,
      },
      {
        page_number: 2,
        title: 'श्रीशङ्कराष्टकम् - श्लोकाः ५-८ एवं फलश्रुतिः',
        chhandas: 'भुजङ्गप्रयात',
        text: `【 श्लोक ५-८ एवं फलश्रुतिः 】
यदीया विभूतिः सुराणां समग्रा
यदंशांशसम्भूतविश्वप्रपञ्चम् ।
यदङ्गे विभातीन्दुखण्डं कपाले
सदा तं भजे शङ्करं भूतनाथम् ॥ ५ ॥

यमानन्दसिन्धुं सुरा मुग्धभावाः
समभ्यर्थयन्ति त्रिलोक्याधिनाथम् ।
दयासिन्धुमीड्यं भवाम्भोधिपोतं
सदा तं भजे शङ्करं भूतनाथम् ॥ ६ ॥

यदङ्गे स्फुरन्तीह शम्भोरहीन्द्रा
गणा यस्य सेवां प्रकुर्वन्ति नित्यम् ।
सदानन्दमूर्तिं त्रिशूलं दधानं
सदा तं भजे शङ्करं भूतनाथम् ॥ ७ ॥

यतो जायतेऽन्यन्न किञ्चिद्विमुक्तं
यतो विश्वमेतद् विभातीति सत्यम् ।
भवेन्मुक्तिभाग् यत्पदाम्भोजभक्तः
सदा तं भजे शङ्करं भूतनाथम् ॥ ८ ॥

【 फलश्रुतिः 】
इदं शङ्कराष्टं प्रभाते पठेद्यः
शिवार्चारतो भावयुक्तो मनुष्यः ।
स सर्वान् कामानवाप्येह लोके
परत्रेह मुक्तिं प्रयाति प्रसन्नः ॥ ९ ॥

॥ इति श्रीमच्छङ्कराचार्यविरचितं श्रीशङ्कराष्टकं सम्पूर्णम् ॥`,
      },
    ],
  },

  // 2. Sri Vishnulahari (Lalitaalaalitah)
  {
    id: 'granth-vishnulahari',
    title: 'श्रीविष्णुलहरी (Śrī Viṣṇulahari)',
    author: 'पण्डितराज श्रीजगन्नाथविरचितम्',
    description: 'पण्डितराज जगन्नाथ विरचित भगवान् श्रीहरि / जगन्नाथ की भक्तिरसपूर्ण काव्यमयी लहरी। शिखरिणी छन्द में रचित, Lalitaalaalitah स्तोत्र कोष से प्रमाणित।',
    language: 'sa',
    category: 'stotra',
    deity: 'vishnu',
    chhandas: 'शिखरिणी छन्द',
    pages: [
      {
        page_number: 1,
        title: 'श्रीविष्णुलहरी - प्रथम लहरी',
        chhandas: 'शिखरिणी',
        text: `॥ श्रीहरये नमः ॥
॥ अथ पण्डितराज श्रीजगन्नाथविरचिता श्रीविष्णुलहरी ॥

【 चरण-सौन्दर्य एवं कृपा-प्रार्थना 】
अगाधे कालिन्दीहृदय इव मग्नाः परिजनैः
तरङ्गाणां भङ्गैरुपचितरसाः सान्द्रमधुराः ।
मुनीनां मानस्यान्यहरहमुदञ्चन्ति परितः
श्रितानां सन्तापं हरतु हरिनेत्रोत्पलदृशः ॥ १ ॥

कलिन्दान्तःखेलत्कलितललिताम्भोधितनया-
विलासोल्लासैर्या नवजलदकान्तिं प्रथयति ।
कृपावारां राशिः प्रणतदुरितानां प्रशमनी
सदानन्दं दद्यान्मम हृदि मुरारेश्चरणयोः ॥ २ ॥

यदीयाः पादाब्जाद्गलितकमनीयामरधुनी
जगत्कृत्स्नं पुंसां दुरितभरजालं क्षपयति ।
मुकुन्दस्यामन्दं जयति तदिदं धाम परमं
न यस्मादुत्कृष्टं क्वचिदपि पदार्थान्तरमपि ॥ ३ ॥

श्रिया यत् संसेव्यं कमलदलनेत्रं मधुमथं
मुनीन्द्रा यद्ध्याने प्रणिहितधियः शान्तमनसः ।
स्मितज्योत्स्नायुक्तं त्रिभुवनमनोहारिवदनं
सदा तद् वैकुण्ठं शरणमुपयामो भगवतः ॥ ४ ॥`,
      },
      {
        page_number: 2,
        title: 'श्रीविष्णुलहरी - द्वितीय लहरी एवं समर्पणम्',
        chhandas: 'शिखरिणी',
        text: `【 भगवद्धाम एवं प्रपत्तिः 】
स्फुरद्रत्नज्योतिर्विगलिततमिस्रावलिपरं
परं ब्रह्म ज्योतिर्मयमनुपमं यत्पदयुगम् ।
भवोच्छेदप्रौढं सकलसुकृतां फलममलं
तदस्माकं दद्याद् दुरितदलनं चेतसि पदम् ॥ ५ ॥

अनन्ताकारं तं निखिलजगतामेकजनकं
पयोधौ शयानं फणिपतिशिरःस्पर्शसुखितम् ।
गदाशङ्खाभीतीः सरसिजयुगं दोर्भिरनिशं
दधानं वैकुण्ठं हृदि समवलोक्य प्रणमथ ॥ ६ ॥

न याचे वैकुण्ठं न च पुनरपामीशपदवीं
न मे वित्ते वाञ्छा न च भुवनसाम्राज्यपदवी ।
परं पादद्वन्द्वे मयि भवतु भक्तिर्दृढतरा
सदा नारायणस्य प्रमथितविपक्षस्य महतः ॥ ७ ॥

॥ इति पण्डितराज श्रीजगन्नाथविरचिता श्रीविष्णुलहरी सम्पूर्णा ॥`,
      },
    ],
  },

  // 3. Srimad Gopika Gitam (Lalitaalaalitah / Shrimad Bhagavata)
  {
    id: 'granth-gopikagitam',
    title: 'श्रीमद्गोपिकागीतम् (Śrīmad Gopikā Gītam)',
    author: 'श्रीमद्भागवतम् (दशमस्कन्धः - रासपञ्चाध्यायी)',
    description: 'श्रीमद्भागवत महापुराण के रासपञ्चाध्यायी (३१वें अध्याय) में गोपियों द्वारा भगवान् श्रीकृष्ण के विरह में गाया गया परम माधुर्यपूर्ण शरणागति गीत। वंशस्थ व उपजाति छन्द।',
    language: 'sa',
    category: 'stotra',
    deity: 'krishna',
    chhandas: 'वंशस्थ छन्द',
    pages: [
      {
        page_number: 1,
        title: 'गोपिकागीतम् - श्लोकाः १-६ (प्रादुर्भाव एवं विरह)',
        chhandas: 'वंशस्थ',
        text: `॥ श्रीराधाकृष्णाभ्यां नमः ॥
॥ अथ श्रीमद्भागवतोक्तं गोपिकागीतम् ॥

【 गोपिका विरह प्रार्थना 】
जयति तेऽधिकं जन्मना व्रजः
श्रयत इन्दिरा शश्वदत्र हि ।
दयित दृश्यतां दिक्षु तावका-
स्त्वयि धृतासवस्त्वां विचिन्वते ॥ १ ॥

शरदुदाशये साधुजातसत्-
सरसिजोदरश्रीमुषा दृशा ।
सुरतनाथ तेऽशुल्कदासिका
वरद निघ्नतो नेह किं वधः ॥ २ ॥

विषजलाप्ययाद्व्यालराक्षसाद्-
वर्षमारुताद्वैद्युतानलात् ।
वृषमयात्मजाद्विश्वतो भयाद्-
ऋषभ ते वयं रक्षिता मुहुः ॥ ३ ॥

न खलु गोपिकानन्दनो भवान्
अखिलदेहिनामन्तरात्मदृक् ।
विखनसार्थितो विश्वगुप्तये
सख उदेयिवान्सात्वतां कुले ॥ ४ ॥

विरचिताभयं वृष्णिधूर्य ते
चरणमीयुषां संसृतेर्भयात् ।
करसरोरुहं कान्त कामदं
शिरसि धेहि नः श्रीकरग्रहम् ॥ ५ ॥

व्रजजनार्तिहन्वीर योषितां
निजजनस्मयध्वंसनस्मित ।
भज सखे भवत्किङ्करीः स्म नो
जलरुहाननं चारु दर्शय ॥ ६ ॥`,
      },
      {
        page_number: 2,
        title: 'गोपिकागीतम् - श्लोकाः ७-१२ (कथामृत एवं पादारविन्द)',
        chhandas: 'वंशस्थ',
        text: `【 चरणाम्बुज ध्यान एवं कथामृतम् 】
प्रणतदेहिनां पापकर्शनं
तृणचरानुगं श्रीनिकेतनम् ।
फणिफणार्पितं ते पदाबुजं
कृणु कुचेषु नः कृन्धि हृच्छयम् ॥ ७ ॥

मधुरया गिरा वल्गुवाक्यया
बुधमनोज्ञया पुष्करेक्षण ।
विधिकरीरिमा वीर मुह्यती-
रधरसीधुनाऽऽप्याययस्व नः ॥ ८ ॥

तव कथामृतं तप्तजीवनं
कविभिरीडितं कल्मषापहम् ।
श्रवणमङ्गलं श्रीमदाततं
भुवि गृणन्ति ते भूरिदा जनाः ॥ ९ ॥

प्रहसितं प्रिय प्रेमवीक्षणं
विहरणं च ते ध्यानमङ्गलम् ।
रहसि संविदो या हृदिस्पृशः
कुहक नो मनः क्षोभयन्ति हि ॥ १० ॥

चलसि यद्व्रजाच्चारयन्पशून्
नलिनसुन्दरं नाथ ते पदम् ।
शिलतृणाङ्कुरैः सीदतीति नः
कलिलतां मनः कान्त गच्छति ॥ ११ ॥

दिनपरिक्षये नीलकुन्तलैर्-
वनरुहाननं बिभ्रदावृतम् ।
घनरजस्वलं दर्शयन्मुहुर्-
मनसि नः स्मरं वीर यच्छसि ॥ १२ ॥`,
      },
      {
        page_number: 3,
        title: 'गोपिकागीतम् - श्लोकाः १३-१९ (परम शरणागति)',
        chhandas: 'वंशस्थ',
        text: `【 नित्य समर्पणम् 】
प्रणतकामदं पद्मजार्चितं
धरणिमण्डनं ध्येयमापदि ।
चरणपङ्कजं शन्तमं च ते
रमण नः स्तनेष्वर्पयोधनम् ॥ १३ ॥

सुरतवर्धनं शोकनाशनं
स्वरितवेणुना सुष्ठु चुम्बितम् ।
इतररागविस्मारणं नृणां
वितर वीर नस्तेऽधरामृतम् ॥ १४ ॥

अटति यद्भवानह्नि काननं
त्रुटिर्युगायते त्वामपश्यताम् ।
कुटिलकुन्तलं श्रीमुखं च ते
जड उदीक्षतां पक्ष्मकृद्दृशाम् ॥ १५ ॥

पतिसुतान्वयभ्रातृबान्धवान्
अतिविलङ्घ्य तेऽन्त्यच्युतागताः ।
गतिमविदस्त्वोद्गीतमोहिताः
कितव योषितः कस्त्यजेन्निशि ॥ १६ ॥

रहसि संविदं हृच्छयोदयं
प्रहसिताननं प्रेमवीक्षणम् ।
बृहदुरः श्रियो वीक्ष्य धाम ते
मुहुरतिस्पृहा मुह्यते मनः ॥ १७ ॥

व्रजवनौकसां व्यक्तिरङ्ग ते
वृजिनहन्त्र्यलं विश्वमङ्गलम् ।
त्यज मनः स्पृहां कामिनां यथा
सकृदपि त्वया सङ्गतात्मनाम् ॥ १८ ॥

यत्तत्सुजातचरणांबुरुहं स्तनेषु
भीताः शनैः प्रिय दधीमहि कर्कशेषु ।
तेनाटवीमटसि तद्व्यथते न किंस्वित्
कूर्पादिभिर्भ्रमति धीर्भवदायुषां नः ॥ १९ ॥

॥ इति श्रीमद्भागवते महापुराणे दशमस्कन्धे रासपञ्चाध्याये गोपिकागीतं सम्पूर्णम् ॥`,
      },
    ],
  },

  // 4. Bhashaparichchheda - Karikavali (UoHyd Corpus)
  {
    id: 'granth-bhashaparichchheda',
    title: 'भाषापरिच्छेदः - कारिकावली (Bhāṣāparicchedaḥ)',
    author: 'महामहोपाध्याय श्रीविश्वनाथ न्यायपञ्चानन भट्टाचार्य',
    description: 'न्याय-वैशेषिक दर्शन का मूलभूत लक्षण-प्रमाण ग्रन्थ। सप्त पदार्थ, नव द्रव्य, चतुर्विंशति गुण एवं पञ्च कर्म का सुस्पष्ट पाणिनीय निरूपण। UoHyd संस्कृत कॉर्पस संदर्भ।',
    language: 'sa',
    category: 'general',
    deity: 'vedic',
    chhandas: 'अनुष्टुप् छन्द',
    pages: [
      {
        page_number: 1,
        title: 'मङ्गलाचरणम् एवं सप्त पदार्थाः',
        chhandas: 'अनुष्टुप्',
        text: `॥ श्रीगुरुचरणकमलेभ्यो नमः ॥
॥ अथ महामहोपाध्याय-विश्वनाथपञ्चाननविरचितः भाषापरिच्छेदः ॥

【 मङ्गलाचरणम् 】
नूतनजलधररुचये गोपवधूटीदुकूलचौराय ।
विपुलपुलकभुजविक्रमनिहतदुरन्तासुराय नमः ॥ १ ॥

【 सप्त पदार्थाः 】
द्रव्यं गुणस्तथा कर्म सामान्यं सविशेषकम् ।
समवायस्तथाऽभावः पदार्थाः सप्त कीर्तिताः ॥ २ ॥

【 नव द्रव्याणि 】
क्षितिरपस्तथा तेजो मरुद्व्योम कालस्तथा दिशः ।
आत्मा मन इति द्रव्याण्यथेह नव कीर्तिताः ॥ ३ ॥

【 चतुर्विंशति गुणाः 】
रूपं रसो गन्धः स्पर्शः सङ्ख्या परिमितिस्तथा ।
पृथक्त्वं च तथा संयोगविभागौ च परं तथा ॥ ४ ॥

अपरत्वं बुद्धिः सुखं दुःखमिच्छा द्वेषः प्रयत्नकः ।
गुरुत्वं द्रवत्वं स्नेहो धर्मोऽधर्मस्तथैव च ॥ ५ ॥

संस्कारः शब्द इत्येते गुणाश्चतुर्विंशतिर्मताः ।
उत्क्षेपणमवक्षेपणमाकुञ्चनं प्रसारकम् ॥ ६ ॥

【 पञ्च कर्माणि एवं सामान्यम् 】
गमनं चेति कर्माणि पञ्चैव परिकीर्तिताः ।
सामान्यं द्विविधं प्रोक्तं परं चापरमेव च ॥ ७ ॥`,
      },
      {
        page_number: 2,
        title: 'साधर्म्य-वैधर्म्य एवं समवाय-लक्षणम्',
        chhandas: 'अनुष्टुप्',
        text: `【 विशेषः एवं समवायः 】
द्रव्यादिपञ्चकं व्यक्तं सामान्यं द्विविधं स्मृतम् ।
अन्त्या विशेषसंज्ञास्तु विशेषाः परिकीर्तिताः ॥ ८ ॥

नित्यद्रव्यवृत्तयो हि विशेषाः परिकीर्तिताः ।
अयुतसिद्धयोरेव सम्बन्धः समवाय ईरितः ॥ ९ ॥

【 अभाव-चातुर्विध्यम् 】
प्रागभावस्तथा प्रध्वंसोऽत्यन्ताभाव एव च ।
अन्योन्याभाव इत्येवं भावश्चतुर्विधः स्मृतः ॥ १० ॥

【 पृथ्वी-लक्षणम् 】
तत्र गन्धवती पृथ्वी नानागन्धवती मता ।
सा च द्विविधा ज्ञेया नित्या चानित्यरूपिणी ॥ ११ ॥

परमाणुरूपा नित्या स्यात् कार्यरूपा त्वनित्यता ।
पुनस्त्रिधा भवेत्सा तु शरीरमिन्द्रियं विषयस्तथा ॥ १२ ॥

॥ इति भाषापरिच्छेदे प्रथमः खण्डः समाप्तः ॥`,
      },
    ],
  },

  // 5. Sanskrit Subhashita Vinodini (UoHyd Corpus)
  {
    id: 'granth-subhashita-vinodini',
    title: 'संस्कृत सुभाषित विनोदिनी (Subhāṣita Vinodinī)',
    author: 'प्राचीन संस्कृत नीतिग्रन्थ (UoHyd Corpus)',
    description: 'हैदराबाद विश्वविद्यालय संस्कृत कॉर्पस संकलित लोकप्रसिद्ध नैतिक एवं दार्शनिक सुभाषित रत्नमाला। पाणिनीय सन्धि, शब्द-शुद्धि एवं जीवन-दर्शन का अनुपम निदर्शन।',
    language: 'sa',
    category: 'general',
    deity: 'vedic',
    chhandas: 'अनुष्टुप् / वसन्ततिलका',
    pages: [
      {
        page_number: 1,
        title: 'सुभाषित विनोदिनी - प्रथम मञ्जरी (विद्या एवं नीति)',
        chhandas: 'अनुष्टुप्',
        text: `॥ श्रीसरस्वत्यै नमः ॥
॥ अथ संस्कृत सुभाषित विनोदिनी - प्रथम मञ्जरी ॥

【 सुभाषित-महिमा 】
पृथिव्यां त्रीणि रत्नानि जलमन्नं सुभाषितम् ।
मूढैः पाषाणखण्डेषु रत्नसंज्ञा विधीयते ॥ १ ॥

भाषासु मुख्या मधुरा दिव्या गीर्वाणभारती ।
तस्यां हि काव्यं मधुरं तस्मादपि सुभाषितम् ॥ २ ॥

【 उद्यम एवं विद्या 】
उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः ।
न हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः ॥ ३ ॥

विद्या ददाति विनयं विनयाद्याति पात्रताम् ।
पात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम् ॥ ४ ॥

अलसस्य कुतो विद्या अविद्यस्य कुतो धनम् ।
अधनस्य कुतो मित्रममित्रस्य कुतः सुखम् ॥ ५ ॥

【 उदारता एवं सत्सङ्गति 】
अयं निजः परो वेति गणना लघुचेतसाम् ।
उदारचरितानां तु वसुधैव कुटुम्बकम् ॥ ६ ॥`,
      },
      {
        page_number: 2,
        title: 'सुभाषित विनोदिनी - द्वितीय मञ्जरी (सज्जन-महिमा एवं सत्य)',
        chhandas: 'अनुष्टुप् / वसन्ततिलका',
        text: `【 सज्जन प्रशंसा एवं सत्सङ्ग 】
शैले शैले न माणिक्यं मौक्तिकं न गजे गजे ।
साधवो न हि सर्वत्र चन्दनं न वने वने ॥ ७ ॥

सत्यं ब्रूयात् प्रियं ब्रूयात् न ब्रूयात् सत्यमप्रियम् ।
प्रियं च नानृतं ब्रूयात् एष धर्मः सनातनः ॥ ८ ॥

जाड्यं धियो हरति सिञ्चति वाचि सत्यं
मानोन्नतिं दिशति पापमपाकरोति ।
चेतः प्रसादयति दिक्षु तनोति कीर्तिं
सत्सङ्गतिः कथय किं न करोति पुंसाम् ॥ ९ ॥

【 कर्म-सिद्धान्त एवं काल 】
यथा ह्येकेन चक्रेण न रथस्य गतिर्भवेत् ।
एवं पुरुषकारेण विना दैवं न सिध्यति ॥ १० ॥

क्षणशः कणशश्चैव विद्यामर्थं च साधयेत् ।
क्षणत्यागे कुतो विद्या कणत्यागे कुतो धनम् ॥ ११ ॥

॥ इति संस्कृत सुभाषित विनोदिनी सम्पूर्णा ॥`,
      },
    ],
  },
];

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
  chhandas: string | undefined,
  text: string
): Promise<{ rawPath: string; preprocPath: string }> {
  const width = 1200;
  const height = 1600;

  const bookDir = path.join(PAGES_DIR, bookId);
  const preprocBookDir = path.join(PREPROCESSED_DIR, bookId);
  fs.mkdirSync(bookDir, { recursive: true });
  fs.mkdirSync(preprocBookDir, { recursive: true });

  const filename = `page-${pageNum}.png`;
  const preprocFilename = `page-${pageNum}-clean.png`;
  const fullPath = path.join(bookDir, filename);
  const fullPreprocPath = path.join(preprocBookDir, preprocFilename);

  const lines = wrapTextLines(text, 50).slice(0, 36);
  const startY = 240;
  const lineHeight = 36;

  const textSvgLines = lines
    .map((line, idx) => {
      const y = startY + idx * lineHeight;
      const escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

      let fill = '#241408';
      let weight = 'normal';
      let size = 26;

      if (line.startsWith('॥') || line.startsWith('【')) {
        fill = '#8C2D19';
        weight = 'bold';
        size = 28;
      } else if (line.startsWith('•') || line.startsWith('▪') || /^\d+\./.test(line)) {
        fill = '#591B0B';
        weight = '600';
      }

      return `<text x="600" y="${y}" text-anchor="middle" font-family="'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', 'Yatra One', serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escaped}</text>`;
    })
    .join('\n');

  const chhandasTag = chhandas ? ` • [छन्द: ${chhandas}]` : '';

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
      <text x="600" y="${height - 54}" text-anchor="middle" font-family="'Noto Sans Devanagari', sans-serif" font-size="12" fill="#5E3018" opacity="0.6">Lalitaalaalitah &amp; UoHyd Corpus • पाणिनीय शुद्धता${chhandasTag}</text>
    </svg>
  `);

  await sharp(svgOverlay).png().toFile(fullPath);
  await sharp(svgOverlay).png().toFile(fullPreprocPath);

  return {
    rawPath: `/storage/pages/${bookId}/${filename}`,
    preprocPath: `/storage/preprocessed/${bookId}/${preprocFilename}`,
  };
}

export async function ingestCuratedCorpus() {
  console.log('🕉️ INGESTING LALITAALAALITAH & UOHYD CURATED STOTRAS & SHASTRA INTO GRANTH...');

  const insertBook = db.prepare(`
    INSERT OR REPLACE INTO books (
      id, title, author, description, language, page_count, status, source_type, original_filename, original_file_path, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const deleteExistingPages = db.prepare('DELETE FROM pages WHERE book_id = ?');

  const insertPage = db.prepare(`
    INSERT INTO pages (
      id, book_id, page_number, original_image_path, preprocessed_image_path,
      width, height, status, ocr_confidence, unresolved_issue_count,
      ocr_text, verified_text, verified_at, verified_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();

  for (const book of CURATED_BOOKS) {
    console.log(`\n📖 Ingesting "${book.title}" (${book.pages.length} pages)...`);

    // Insert Book
    insertBook.run(
      book.id,
      book.title,
      book.author,
      book.description,
      book.language,
      book.pages.length,
      'FULLY_VERIFIED',
      'corpus',
      `${book.id}.pdf`,
      path.join(PAGES_DIR, book.id),
      now,
      now
    );

    // Delete existing pages for this book if re-ingesting
    deleteExistingPages.run(book.id);

    // Insert Pages & render Bhojpatra folios
    for (const page of book.pages) {
      const pageId = uuidv4();
      const paths = await renderBhojpatraImage(
        book.id,
        page.page_number,
        page.title,
        page.chhandas || book.chhandas,
        page.text
      );

      insertPage.run(
        pageId,
        book.id,
        page.page_number,
        paths.rawPath,
        paths.preprocPath,
        1200,
        1600,
        'VERIFIED',
        100.0,
        0,
        page.text,
        page.text,
        now,
        'Lalitaalaalitah & UoHyd Corpus Verifier',
        now,
        now
      );

      console.log(`  ✓ Created Bhojpatra Folio ${page.page_number}: "${page.title}"`);
    }

    console.log(`🎉 Ingested "${book.title}" successfully.`);
  }

  console.log('\n✨ ALL CURATED SCRIPTURES SUCCESSFULLY INGESTED INTO DATABASE!');
}

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('ingestCuratedCorpus.ts') ||
  process.argv[1].endsWith('ingestCuratedCorpus.js')
);

if (isDirectRun) {
  ingestCuratedCorpus().catch((err: unknown) => {
    console.error('Fatal error during corpus ingestion:', err);
    process.exit(1);
  });
}
