import type { CanonicalScripture } from '../shared/types.js';

export const CANONICAL_SCRIPTURES: Record<string, CanonicalScripture> = {
  atharvashirsha: {
    id: 'atharvashirsha',
    title_sa: 'श्रीगणपत्यथर्वशीर्षोपनिषत्',
    title_iast: 'Śrī Gaṇapatyatharvaśīrṣopaniṣat',
    category: 'upanishad',
    deity: 'ganesha',
    rishi: 'गणक ऋषिः',
    chhandas: 'निचृद्गायत्रीच्छन्दः',
    viniyoga: 'ॐ अस्य श्रीगणपत्यथर्वशीर्षोपनिषन्मन्त्रस्य गणक ऋषिः, निचृद्गायत्रीच्छन्दः, श्रीमहागणपतिर्देवता, ॐ गं बीजम्, ॐ नमः शक्तिः, ॐ गं कीलकम्, श्रीमहागणपतिप्रीत्यर्थे जपे विनियोगः।',
    shanti_patha: `ॐ भद्रं कर्णेभिः श‍ृणुयाम देवाः ।
भद्रं पश्येमाक्षभिर्यजत्राः ॥
स्थिरैरङ्गैस्तुष्टुवांसस्तनूभिः ।
व्यशेम देवहितं यदायुः ॥

ॐ स्वस्ति न इन्द्रो वृद्धश्रवाः ।
स्वस्ति नः पूषा विश्ववेदाः ॥
स्वस्तिनस्तार्क्ष्यो अरिष्टनेमिः ।
स्वस्ति नो बृहस्पतिर्दधातु ॥
ॐ शान्तिः शान्तिः शान्तिः ॥`,
    mula_text: `ॐ नमस्ते गणपतये । त्वमेव प्रत्यक्षं तत्त्वमसि ।
त्वमेव केवलं कर्ताऽसि । त्वमेव केवलं धर्ताऽसि । त्वमेव केवलं हर्ताऽसि ।
त्वमेव सर्वं खल्विदं ब्रह्मासि । त्वं साक्षादात्माऽसि नित्यम् ॥ १॥

ऋतं वच्मि । सत्यं वच्मि ॥ २॥

अव त्वं माम् । अव वक्तारम् । अव श्रोतारम् । अव दातारम् । अव धातारम् ।
अवानूचानमव शिष्यम् । अव पश्चात्तात् । अव पुरस्तात् । अवोत्तरात्तात् ।
अव दक्षिणात्तात् । अव चोर्ध्वात्तात् । अवाधरात्तात् ।
सर्वतो मां पाहि पाहि समन्तात् ॥ ३॥

त्वं वाङ्मयस्त्वं चिन्मयः । त्वमानन्दमयस्त्वं ब्रह्ममयः ।
त्वं सच्चिदानन्दाऽद्वितीयोऽसि ।
त्वं प्रत्यक्षं ब्रह्मासि । त्वं ज्ञानमयो विज्ञानमयोऽसि ॥ ४॥

सर्वं जगदिदं त्वत्तो जायते । सर्वं जगदिदं त्वत्तस्तिष्ठति ।
सर्वं जगदिदं त्वयि लयमेष्यति । सर्वं जगदिदं त्वयि प्रत्येति ।
त्वं भूमिरापोऽनलोऽनिलो नभः । त्वं चत्वारि वाक्पदानि ॥ ५॥

त्वं गुणत्रयातीतः । त्वं अवस्थात्रयातीतः । त्वं देहत्रयातीतः ।
त्वं कालत्रयातीतः । त्वं मूलाधारस्थितोऽसि नित्यम् । त्वं शक्तित्रयात्मकः ।
त्वां योगिनो ध्यायन्ति नित्यम् ।
त्वं ब्रह्मा त्वं विष्णुस्त्वं रुद्रस्त्वमिन्द्रस्त्वमग्निस्त्वं
वायुस्त्वं सूर्यस्त्वं चन्द्रमास्त्वं ब्रह्म भूर्भुवः स्वरोम् ॥ ६॥

गणादिं पूर्वमुच्चार्य वर्णादिंस्तदनन्तरम् ।
अनुस्वारः परतरः । अर्धेन्दुलसितम् ।
तारेण ऋद्धम् । एतत्तव मनुस्वरूपम् ।
गकारः पूर्वरूपम् । अकारो मध्यमरूपम् ।
अनुस्वारश्चान्त्यरूपम् । बिन्दुरुत्तररूपम् । नादः सन्धानम् । संहिता सन्धिः ।
सैषा गणेशविद्या । गणक ऋषिः । निचृद्गायत्रीच्छन्दः ।
गणपतिर्देवता । ॐ गं गणपतये नमः ॥ ७॥

एकदन्ताय विद्महे वक्रतुण्डाय धीमहि । तन्नो दन्तिः प्रचोदयात् ॥ ८॥

एकदन्तं चतुर्हस्तं पाशमङ्कुशधारिणम् ।
रदं च वरदं हस्तैर्बिभ्राणं मूषकध्वजम् ।
रक्तं लम्बोदरं शूर्पकर्णकं रक्तवाससम् ।
रक्तगन्धानुलिप्ताङ्गं रक्तपुष्पैः सुपूजितम् ।
भक्तानुकम्पिनं देवं जगत्कारणमच्युतम् ।
आविर्भूतं च सृष्ट्यादौ प्रकृतेः पुरुषात्परम् ।
एवं ध्यायति यो नित्यं स योगी योगिनां वरः ॥ ९॥

नमो व्रातपतये । नमो गणपतये । नमः प्रमथपतये ।
नमस्तेऽस्तु लम्बोदरायैकदन्ताय विघ्नविनाशिने शिवसुताय श्रीवरदमूर्तये नमः ॥ १०॥

एतदथर्वशीर्षं योऽधीते । स ब्रह्मभूयाय कल्पते । स सर्वविघ्नैर्न बाध्यते ।
स सर्वतः सुखमेधते । स पञ्चमहापापात् प्रमुच्यते ।
सायमधीयानो दिवसकृतं पापं नाशयति । प्रातरधीयानो रात्रिकृतं पापं नाशयति ।
सायं प्रातः प्रयुञ्जानो पापोऽपापो भवति । सर्वत्राधीयानोऽपविघ्नो भवति ।
धर्मार्थकाममोक्षं च विन्दति ॥ ११॥`,
    verses: [
      {
        verse_number: 1,
        devanagari: 'ॐ नमस्ते गणपतये । त्वमेव प्रत्यक्षं तत्त्वमसि । त्वमेव केवलं कर्ताऽसि । त्वमेव केवलं धर्ताऽसि । त्वमेव केवलं हर्ताऽसि । त्वमेव सर्वं खल्विदं ब्रह्मासि । त्वं साक्षादात्माऽसि नित्यम् ॥ १॥',
        svara: 'ॐ नम॑स्ते ग॒णप॑तये । त्वमे॒व प्र॒त्यक्षं॒ तत्त्व॑मसि । त्वमे॒व के॒वलं॒ कर्ता॑ऽसि । त्वमे॒व के॒वलं॒ धर्ता॑ऽसि । त्वमे॒व के॒वलं॒ हर्ता॑ऽसि । त्वमेव सर्वं खल्विदं॑ ब्रह्मा॒सि । त्वं साक्षादात्मा॑ऽसि नि॒त्यम् ॥ १॥',
        iast: 'oṃ namaste gaṇapataye | tvameva pratyakṣaṃ tattvamasi | tvameva kevalaṃ kartā\'si | tvameva kevalaṃ dhartā\'si | tvameva kevalaṃ hartā\'si | tvameva sarvaṃ khalvidaṃ brahmāsi | tvaṃ sākṣādātmā\'si nityam || 1||',
        meaning_hi: 'हे गणपति! आपको नमस्कार है। आप ही प्रत्यक्ष तत्त्व हैं। आप ही केवल कर्ता हैं, आप ही केवल धर्ता हैं, और आप ही संहारकर्ता हैं। निश्चय ही आप ही यह सब ब्रह्म हैं। आप साक्षात् नित्य आत्मस्वरूप हैं।',
      },
      {
        verse_number: 2,
        devanagari: 'ऋतं वच्मि । सत्यं वच्मि ॥ २॥',
        svara: 'ऋ॑तं व॒च्मि । स॑त्यं व॒च्मि ॥ २॥',
        iast: 'ṛtaṃ vacmi | satyaṃ vacmi || 2||',
        meaning_hi: 'मैं ऋत (यथार्थ मानसिक सत्य) कहता हूँ। मैं सत्य (वचनबद्ध सत्य) कहता हूँ।',
      },
      {
        verse_number: 3,
        devanagari: 'अव त्वं माम् । अव वक्तारम् । अव श्रोतारम् । अव दातारम् । अव धातारम् । अवानूचानमव शिष्यम् । अव पश्चात्तात् । अव पुरस्तात् । अवोत्तरात्तात् । अव दक्षिणात्तात् । अव चोर्ध्वात्तात् । अवाधरात्तात् । सर्वतो मां पाहि पाहि समन्तात् ॥ ३॥',
        svara: 'अ॒व त्वं॒ माम् । अव॑ व॒क्तारम्᳚ । अव॑ श्रो॒तारम्᳚ । अव॑ दा॒तारम्᳚ । अव॑ धा॒तारम्᳚ । अवानूचानम॑व शि॒ष्यम् । अव॑ प॒श्चात्ता᳚त् । अव॑ पु॒रस्ता᳚त् । अवोत्त॒रात्ता᳚त् । अव॑ दक्षि॒णात्ता᳚त् । अव॑ चो॒र्ध्वात्ता᳚त् । अवाध॒रात्ता᳚त् । सर्वतो मां पाहि पाहि॑ सम॒न्तात् ॥ ३॥',
        iast: 'ava tvaṃ mām | ava vaktāram | ava śrotāram | ava dātāram | ava dhātāram | avānūcānamava śiṣyam | ava paścāttāt | ava purastāt | avottarāttāt | ava dakṣiṇāttāt | ava cordhvāttāt | avādharāttāt | sarvato māṃ pāhi pāhi samantāt || 3||',
        meaning_hi: 'आप मेरी रक्षा करें। वक्ता की रक्षा करें। श्रोता की रक्षा करें। दाता और विधाता की रक्षा करें। गुरु और शिष्य की रक्षा करें। पीछे से, आगे से, उत्तर से, दक्षिण से, ऊपर से और नीचे से मेरी रक्षा करें। सब ओर से मेरी रक्षा करें।',
      },
      {
        verse_number: 7,
        devanagari: 'गणादिं पूर्वमुच्चार्य वर्णादिंस्तदनन्तरम् । अनुस्वारः परतरः । अर्धेन्दुलसितम् । तारेण ऋद्धम् । एतत्तव मनुस्वरूपम् । गकारः पूर्वरूपम् । अकारो मध्यमरूपम् । अनुस्वारश्चान्त्यरूपम् । बिन्दुरुत्तररूपम् । नादः सन्धानम् । संहिता सन्धिः । सैषा गणेशविद्या । गणक ऋषिः । निचृद्गायत्रीच्छन्दः । गणपतिर्देवता । ॐ गं गणपतये नमः ॥ ७॥',
        svara: 'ग॒णादिं᳚ पूर्व॑मुच्चा॒र्य॒ व॒र्णादिं᳚स्तदन॒न्तरम् । अनुस्वारः प॑रत॒रः । अर्धे᳚न्दुल॒सितम् । तारे॑ण ऋ॒द्धम् । एतत्तव मनु॑स्वरू॒पम् । गकारः पू᳚र्वरू॒पम् । अकारो मध्य॑मरू॒पम् । अनुस्वारश्चा᳚न्त्यरू॒पम् । बिन्दुरुत्त॑ररू॒पम् । नादः॑ सन्धा॒नम् । सꣳहि॑ता स॒न्धिः । सैषा गणे॑शवि॒द्या । गण॑क ऋ॒षिः । निचृद्गाय॑त्रीच्छ॒न्दः । गणपति॑र्देव॒ता । ॐ गं ग॒णप॑तये नमः ॥ ७॥',
        iast: 'gaṇādiṃ pūrvamuccārya varṇādiṃstadanantaram | anusvāraḥ parataraḥ | ardhendulasitam | tāreṇa ṛddham | etattava manusvarūpam | gakāraḥ pūrvarūpam | akāro madhyamarūpam | anusvāraścāntyarūpam | binduruttararūpam | nādaḥ sandhānam | saṃhitā sandhiḥ | saiṣā gaṇeśavidyā | gaṇaka ṛṣiḥ | nicṛdgāyatrīcchandaḥ | gaṇapatirdevatā | oṃ gaṃ gaṇapataye namaḥ || 7||',
        meaning_hi: 'गण का आदि वर्ण (ग्) पहले उच्चारण करें, फिर वर्णों का आदि (अ), उसके बाद अनुस्वार (ं) और अर्धचन्द्र सहित तारक मन्त्र (ॐ) से युक्त करें। यह आपका मन्त्र स्वरूप (ॐ गं) है। यह गणेशविद्या है। इसके गणक ऋषि, निचृद्गायत्री छन्द और गणपति देवता हैं। ॐ गं गणपतये नमः।',
      },
      {
        verse_number: 8,
        devanagari: 'एकदन्ताय विद्महे वक्रतुण्डाय धीमहि । तन्नो दन्तिः प्रचोदयात् ॥ ८॥',
        svara: 'एकद॒न्ताय॑ वि॒द्महे॑ वक्रतु॒ण्डाय॑ धीमहि । तन्नो॑ दन्तिः प्रचो॒दया᳚त् ॥ ८॥',
        iast: 'ekadantāya vidmahe vakratuṇḍāya dhīmahi | tanno dantiḥ pracodayāt || 8||',
        meaning_hi: 'हम एकदन्त को जानते हैं, वक्रतुण्ड का ध्यान करते हैं; वे दन्ती (गणेश) हमें सन्मार्ग में प्रेरित करें। (गणेश गायत्री)',
      },
    ],
    sanskrit_documents_url: 'https://sanskritdocuments.org/doc_ganesha/atharva.html',
  },

  purushasuktam: {
    id: 'purushasuktam',
    title_sa: 'पुरुषसूक्तम् (ऋग्वेद १०.९०)',
    title_iast: 'Puruṣasūktam (Ṛgveda 10.90)',
    category: 'sukta',
    deity: 'vedic',
    rishi: 'नारायण ऋषिः',
    chhandas: 'अनुष्टुप् त्रिष्टुप् च',
    viniyoga: 'ॐ अस्य श्रीपुरुषसूक्तस्य नारायण ऋषिः, अनुष्टुप् त्रिष्टुप् छन्दः, श्रीपुरुषो देवता, पुरुषप्रीत्यर्थे जपे विनियोगः।',
    mula_text: `सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात् ।
स भूमिं विश्वतो वृत्वात्यतिष्ठद्दशाङ्गुलम् ॥ १॥

पुरुष एवेदं सर्वं यद्भूतं यच्च भव्यम् ।
उतामृतत्वस्येशानो यदन्नेनातिरोहति ॥ २॥

एतावानस्य महिमातो ज्यायांश्च पूरुषः ।
पादोऽस्य विश्वा भूतानि त्रिपादस्यामृतं दिवि ॥ ३॥`,
    verses: [
      {
        verse_number: 1,
        devanagari: 'सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात् । स भूमिं विश्वतो वृत्वात्यतिष्ठद्दशाङ्गुलम् ॥ १॥',
        svara: 'स॒हस्र॑शीर्षा॒ पुरु॑षः सहस्रा॒क्षः स॒हस्र॑पात् । स भूमिं॑ वि॒श्वतो॑ वृ॒त्वात्य॑तिष्ठद्दशाङ्गु॒लम् ॥ १॥',
        iast: 'sahasraśīrṣā puruṣaḥ sahasrākṣaḥ sahasrapāt | sa bhūmiṃ viśvato vṛtvātyatiṣṭhaddaśāṅgulam || 1||',
        meaning_hi: 'उस विराट् परम पुरुष के सहस्रों (असंख्य) सिर, सहस्रों नेत्र और सहस्रों चरण हैं। वह सम्पूर्ण ब्रह्माण्ड को सब ओर से व्याप्त करके दस अंगुल और विस्तृत रहता है।',
      },
    ],
    sanskrit_documents_url: 'https://sanskritdocuments.org/doc_veda/purush.html',
  },

  shrisuktam: {
    id: 'shrisuktam',
    title_sa: 'श्रीसूक्तम् (ऋग्वेद परिशिष्ट)',
    title_iast: 'Śrīsūktam',
    category: 'sukta',
    deity: 'devi',
    rishi: 'आनन्द कर्दम चिक्लीत इन्दिरासुता ऋषयः',
    chhandas: 'अनुष्टुप् प्रस्तारपंक्तिश्च',
    viniyoga: 'ॐ अस्य श्रीसूक्तस्य आनन्दकर्दमचिक्लीतेन्दिरासुता ऋषयः, अग्निर्देवता, अनुष्टुप् छन्दः, श्रीलक्ष्मीप्रीत्यर्थे जपे विनियोगः।',
    mula_text: `ॐ हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम् ।
चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह ॥ १॥

तां म आवह जातवेदो लक्ष्मीमनपगामिनीम् ।
यस्यां हिरण्यं विन्देयं गामश्वं पुरुषानहम् ॥ २॥`,
    verses: [
      {
        verse_number: 1,
        devanagari: 'ॐ हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम् । चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह ॥ १॥',
        svara: 'हिर॑ण्यवर्णां॒ हरि॑णीं सु॒वर्ण॑रज॒तस्र॑जाम् । च॒न्द्रां हि॒रण्म॑यीं ल॒क्ष्मीं जात॑वेदो म॒ आव॑ह ॥ १॥',
        iast: 'oṃ hiraṇyavarṇāṃ hariṇīṃ suvarṇarajatasrajām | candrāṃ hiraṇmayīṃ lakṣmīṃ jātavedo ma āvaha || 1||',
        meaning_hi: 'हे अग्निदेव (जातवेदा)! सुवर्ण के समान कान्ति वाली, शुभ्र रूपिणी, सोने और चांदी की माला धारण करने वाली, चन्द्रमुखी एवं हिरण्मयी महालक्ष्मी को हमारे लिए यहाँ बुलाइए।',
      },
    ],
    sanskrit_documents_url: 'https://sanskritdocuments.org/doc_veda/shriisukta.html',
  },

  shivatandava: {
    id: 'shivatandava',
    title_sa: 'शिवताण्डवस्तोत्रम्',
    title_iast: 'Śivatāṇḍavastotram',
    category: 'stotra',
    deity: 'shiva',
    rishi: 'रावण विरचितम्',
    chhandas: 'पञ्चचामर छन्दः',
    mula_text: `जटाटवीगलज्जलप्रवाहपावितस्थले
गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं
चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥ १॥

जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी-
विलोलवीचिवल्लरीविराजमानमूर्धनि ।
धगद्धगद्धगज्ज्वलल्ललाटपट्टपावके
किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम ॥ २॥`,
    verses: [
      {
        verse_number: 1,
        devanagari: 'जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् । डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥ १॥',
        iast: 'jaṭāṭavīgalajjalapravāhapāvitasthale gale\'valambya lambitāṃ bhujaṅgatuṅgamālikām | ḍamaḍḍamaḍḍamaḍḍamanninādavaḍḍamarvayaṃ cakāra caṇḍatāṇḍavaṃ tanotu naḥ śivaḥ śivam || 1||',
        meaning_hi: 'सघन जटारूप वन से प्रवाहित गंगा की पवित्र धारा से जिनका कण्ठ-प्रदेश पावन है, जिनके गले में सर्पों की विशाल माला लटक रही है और जो डम-डम डमरू बजाकर प्रचण्ड ताण्डव नृत्य कर रहे हैं, वे भगवान शिव हमारा कल्याण करें।',
      },
    ],
    sanskrit_documents_url: 'https://sanskritdocuments.org/doc_shiva/shivataandava.html',
  },

  adityahridayam: {
    id: 'adityahridayam',
    title_sa: 'आदित्यहृदयस्तोत्रम् (वाल्मीकि रामायण)',
    title_iast: 'Ādityahṛdayastotram',
    category: 'stotra',
    deity: 'surya',
    rishi: 'अगस्त्य ऋषिः',
    chhandas: 'अनुष्टुप् छन्दः',
    viniyoga: 'ॐ अस्य आदित्यहृदयस्तोत्रस्य अगस्त्य ऋषिः, अनुष्टुप् छन्दः, भगवान् सूर्यनारायणो देवता, सर्वशत्रुविजयार्थे जपे विनियोगः।',
    mula_text: `ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् ।
रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥ १॥

दैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम् ।
उपागम्याब्रवीद्राममगस्त्यो भगवानृषिः ॥ २॥`,
    verses: [
      {
        verse_number: 1,
        devanagari: 'ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् । रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥ १॥',
        iast: 'tato yuddhaparidhrāntaṃ samare cintayā sthitam | rāvaṇaṃ cāgrato dṛṣṭvā yuddhāya samupasthitam || 1||',
        meaning_hi: 'तदनन्तर युद्ध से थककर रणभूमि में चिन्तातुर खड़े हुए और सामने युद्ध के लिए तैयार रावण को देखकर भगवान् अगस्त्य ऋषि ने वहाँ उपस्थित होकर श्रीराम से कहा।',
      },
    ],
    sanskrit_documents_url: 'https://sanskritdocuments.org/doc_surya/adityahriday.html',
  },
};

export function getCanonicalScripturesList(): Array<Omit<CanonicalScripture, 'verses' | 'mula_text'>> {
  return Object.values(CANONICAL_SCRIPTURES).map(s => ({
    id: s.id,
    title_sa: s.title_sa,
    title_iast: s.title_iast,
    category: s.category,
    deity: s.deity,
    rishi: s.rishi,
    chhandas: s.chhandas,
    viniyoga: s.viniyoga,
    shanti_patha: s.shanti_patha,
    sanskrit_documents_url: s.sanskrit_documents_url,
  }));
}

export function getCanonicalScriptureById(id: string): CanonicalScripture | null {
  return CANONICAL_SCRIPTURES[id] || null;
}

// Heuristic matching against canonical scripture library
export function matchCanonicalScripture(text: string): {
  matched: boolean;
  scriptureId?: string;
  title_sa?: string;
  confidence: number;
} {
  if (!text || !text.trim()) {
    return { matched: false, confidence: 0 };
  }

  const normalized = text.replace(/\s+/g, ' ');

  // 1. Check Atharvashirsha indicators
  if (
    /गणपत्यथर्व|अथर्वशीर्ष|गणपतये|ततत्वमसि|तत्त्वमसि|धर्ताऽसि|हर्ताऽसि|खल्विदं ब्रह्मासि|गणादिं पूर्वमुच्चार्य/u.test(
      normalized
    )
  ) {
    return {
      matched: true,
      scriptureId: 'atharvashirsha',
      title_sa: CANONICAL_SCRIPTURES.atharvashirsha.title_sa,
      confidence: 95,
    };
  }

  // 2. Check Purusha Suktam indicators
  if (/सहस्रशीर्षा पुरुष|विश्वतो वृत्वा|त्रिपादस्यामृतं दिवि/u.test(normalized)) {
    return {
      matched: true,
      scriptureId: 'purushasuktam',
      title_sa: CANONICAL_SCRIPTURES.purushasuktam.title_sa,
      confidence: 95,
    };
  }

  // 3. Check Shri Suktam indicators
  if (/हिरण्यवर्णां हरिणीं|जातवेदो म आवह|अश्वपूर्वां रथमध्यां/u.test(normalized)) {
    return {
      matched: true,
      scriptureId: 'shrisuktam',
      title_sa: CANONICAL_SCRIPTURES.shrisuktam.title_sa,
      confidence: 95,
    };
  }

  // 4. Check Shiva Tandava indicators
  if (/जटाटवीगलज्जल|डमड्डमड्डमड्डमन्निनाद|जटाकटाहसम्भ्रम/u.test(normalized)) {
    return {
      matched: true,
      scriptureId: 'shivatandava',
      title_sa: CANONICAL_SCRIPTURES.shivatandava.title_sa,
      confidence: 95,
    };
  }

  // 5. Check Aditya Hridaya indicators
  if (/आदित्यहृदयं|युद्धपरिश्रान्तं|अगस्त्यो भगवानृषिः/u.test(normalized)) {
    return {
      matched: true,
      scriptureId: 'adityahridayam',
      title_sa: CANONICAL_SCRIPTURES.adityahridayam.title_sa,
      confidence: 95,
    };
  }

  return { matched: false, confidence: 0 };
}
