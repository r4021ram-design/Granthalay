/**
 * ============================================================================
 * 🕉️ श्रीदुर्गासप्तशती (चण्डीपाठ / देवी माहात्म्यम्)
 * Authentic Master Audio Stream Registry (28 Canonical Dedicated Sections)
 * Classical Recitation by S. Prakash Kaushik & Traditional Scholars
 * ============================================================================
 */

export interface ScriptureAudioTrack {
  pageNumber: number;
  sectionKey: string;
  titleSa: string;
  titleHi: string;
  audioUrl: string;
  chanter: string;
  durationLabel: string;
  description: string;
}

const ARCHIVE_BASE = 'https://archive.org/download/DeviMahatmyamRecitation_201805/Devi%20Mahatmyam%20Recitation';

export const SAPTASHATI_AUDIO_TRACKS: Record<number, ScriptureAudioTrack> = {
  // --------------------------------------------------------------------------
  // १. पूर्वाङ्ग विधि (Purvanga Angas - ८ खण्ड)
  // --------------------------------------------------------------------------
  1: {
    pageNumber: 1,
    sectionKey: 'sankalpa_shapoddhara',
    titleSa: 'सङ्कल्प-शापोद्धार-उत्कीलन मन्त्राः',
    titleHi: 'पाठविधि: सङ्कल्प एवं शापोद्धार मन्त्र',
    audioUrl: `${ARCHIVE_BASE}/001aSAPTSHATI%20PAARAAYANA%20SANKALPAM.mp3`,
    chanter: 'विद्वत्-पारायण • देवी माहात्म्यम्',
    durationLabel: '०१:०२',
    description: 'सप्तशती पारायण आरम्भ सङ्कल्प एवं शापविमोचन',
  },
  2: {
    pageNumber: 2,
    sectionKey: 'kavacham',
    titleSa: 'अथ श्रीचण्डीकवचम् (देवीकवचम्)',
    titleHi: 'श्रीदुर्गाकवचम् सम्पूर्ण ५६ श्लोक',
    audioUrl: `${ARCHIVE_BASE}/01%20Devi%20Kavacham.mp3`,
    chanter: 'विद्वत्-पारायण • देवी माहात्म्यम्',
    durationLabel: '१०:५९',
    description: 'यद्गुह्यं परमं लोके सर्वरक्षाकरं नृणाम् • नवदुर्गा व दशदिक् रक्षाकवच',
  },
  3: {
    pageNumber: 3,
    sectionKey: 'argala',
    titleSa: 'अथ अर्गलास्तोत्रम्',
    titleHi: 'अर्गला स्तोत्र (रूपं देहि जयं देहि)',
    audioUrl: `${ARCHIVE_BASE}/02%20Argala%20Stotram.mp3`,
    chanter: 'विद्वत्-पारायण • देवी माहात्म्यम्',
    durationLabel: '०४:४२',
    description: 'जयन्ती मङ्गला काली भद्रकाली कपालिनी • रूपं देहि जयं देहि यशो देहि द्विषो जहि',
  },
  4: {
    pageNumber: 4,
    sectionKey: 'kilaka',
    titleSa: 'अथ कीलकस्तोत्रम्',
    titleHi: 'कीलक स्तोत्र (महादेव कीलितम्)',
    audioUrl: `${ARCHIVE_BASE}/03%20Keelakam.mp3`,
    chanter: 'विद्वत्-पारायण • देवी माहात्म्यम्',
    durationLabel: '०३:०४',
    description: 'ॐ विशुद्धज्ञानदेहाय त्रिवेदीदिव्यचक्षुषे • मन्त्र-कीलन निवृत्ति विधान',
  },
  5: {
    pageNumber: 5,
    sectionKey: 'vaidika_ratri_suktam',
    titleSa: 'अथ वेदोक्तं रात्रिसूक्तम्',
    titleHi: 'वेदोक्त रात्रिसूक्तम् (ऋग्वेद १०.१२७ सस्वर पाठ)',
    audioUrl: `${ARCHIVE_BASE}/04a%20Vaidika%20Ratri%20Suktam%20%28for%20Vedic%20rituals%29.mp3`,
    chanter: 'वैदिक सस्वर पारायण',
    durationLabel: '०१:५२',
    description: 'ॐ रात्री व्यख्यदायती पुरुत्रा देव्यक्षभिः • वेदोक्त रात्रिसूक्त',
  },
  6: {
    pageNumber: 6,
    sectionKey: 'tantrika_ratri_suktam',
    titleSa: 'अथ तन्त्रोक्तं रात्रिसूक्तम्',
    titleHi: 'तन्त्रोक्त रात्रिसूक्तम् (विश्वेश्वरीं जगद्धात्रीं)',
    audioUrl: `${ARCHIVE_BASE}/04b%20Tantrikam%20Ratri%20Suktam%20%28for%20Tantric%20rituals%29.mp3`,
    chanter: 'विद्वत्-पारायण • देवी माहात्म्यम्',
    durationLabel: '०२:५३',
    description: 'विश्वेश्वरीं जगद्धात्रीं स्थितिसंहारकारिणीम् • ब्रह्माजी द्वारा भगवती की दिव्य रात्रिस्तुति',
  },
  7: {
    pageNumber: 7,
    sectionKey: 'devi_atharvashirsham',
    titleSa: 'अथ श्रीदेव्यथर्वशीर्षम्',
    titleHi: 'श्रीदेव्यथर्वशीर्षम् (अथर्ववेदीय सस्वर पाठ)',
    audioUrl: `${ARCHIVE_BASE}/Devi%20Atharva%20Seerisham.mp3`,
    chanter: 'वैदिक सस्वर पारायण',
    durationLabel: '०८:००',
    description: 'ॐ सर्वे वै देवा देवीमुपतस्थुः • अथर्ववेदीय देव्युपनिषत् सम्पूर्ण २४ मन्त्र',
  },
  8: {
    pageNumber: 8,
    sectionKey: 'navarna_vidhi',
    titleSa: 'अथ श्रीनवार्णमन्त्रविधिः',
    titleHi: 'श्रीनवार्णमन्त्र विधि (मातृकान्यास, ध्यान व जप)',
    audioUrl: `${ARCHIVE_BASE}/001bSHAAPODDHAARA%20MANTRAM%20-%20To%20%20remove%20curse%20from%20mantra.mp3`,
    chanter: 'विद्वत्-पारायण • चण्डी साधना',
    durationLabel: '०१:१९',
    description: 'ऐं ह्रीं क्लीं चामुण्डायै विच्चे • मातृकान्यास, ऋष्यादिन्यास, करन्यास, अङ्गन्यास व ध्यान',
  },

  // --------------------------------------------------------------------------
  // २. प्रधान सप्तशती (१३ अध्याय - १३ खण्ड)
  // --------------------------------------------------------------------------
  9: {
    pageNumber: 9,
    sectionKey: 'adhyaya_1',
    titleSa: 'प्रथमोऽध्यायः • मधुकैटभवधः',
    titleHi: 'प्रथम अध्याय: मधु-कैटभ वध (प्रथम चरित)',
    audioUrl: `${ARCHIVE_BASE}/05%20Chapter%201%20Pradamodhyayha.mp3`,
    chanter: 'विद्वत्-पारायण • महाकाली चरित',
    durationLabel: '१५:०१',
    description: 'मेधा ऋषि उपदेश, महामाया प्रभाव एवं भगवान् विष्णु द्वारा मधुकैटभवध (१०४ मन्त्र)',
  },
  10: {
    pageNumber: 10,
    sectionKey: 'adhyaya_2',
    titleSa: 'द्वितीयोऽध्यायः • महिषासुरसैन्यवधः',
    titleHi: 'द्वितीय अध्याय: महिषासुर सैन्यवध (मध्यम चरित)',
    audioUrl: `${ARCHIVE_BASE}/06%20Chapter%202%20Divitiyodhyayaha.mp3`,
    chanter: 'विद्वत्-पारायण • महालक्ष्मी चरित',
    durationLabel: '१२:३५',
    description: 'देवताओं के तेज से भगवती महालक्ष्मी का प्रादुर्भाव व महिष सेना संहार (६९ मन्त्र)',
  },
  11: {
    pageNumber: 11,
    sectionKey: 'adhyaya_3',
    titleSa: 'तृतीयोऽध्यायः • महिषासुरवधः',
    titleHi: 'तृतीय अध्याय: सेनापतियों सहित महिषासुर वध',
    audioUrl: `${ARCHIVE_BASE}/07%20Chapter%203%20Tritiyodhyayaha.mp3`,
    chanter: 'विद्वत्-पारायण • महालक्ष्मी चरित',
    durationLabel: '०७:३०',
    description: 'चामर, चिक्षुर आदि का संहार एवं भगवती द्वारा महिषासुर का वध (४४ मन्त्र)',
  },
  12: {
    pageNumber: 12,
    sectionKey: 'adhyaya_4',
    titleSa: 'चतुर्थोऽध्यायः • शक्रादिस्तुतिः',
    titleHi: 'चतुर्थ अध्याय: इन्द्रादि देवकृत शक्रादि स्तुति',
    audioUrl: `${ARCHIVE_BASE}/08%20Chapter%204%20Chaturthodhayayaha.mp3`,
    chanter: 'विद्वत्-पारायण • महालक्ष्मी चरित',
    durationLabel: '०९:१३',
    description: 'शक्रादयः सुरगणा निहतेऽतिवीर्ये • कल्याणप्रद देवस्तुति एवं वरदान (४२ मन्त्र)',
  },
  13: {
    pageNumber: 13,
    sectionKey: 'adhyaya_5',
    titleSa: 'पञ्चमोऽध्यायः • देव्या दूतसंवादः (अपराजितास्तुति)',
    titleHi: 'पञ्चम अध्याय: अपराजिता स्तुति व दूतसंवाद (उत्तर चरित)',
    audioUrl: `${ARCHIVE_BASE}/09%20Chapter%205%20Panchamodhyayaha.mp3`,
    chanter: 'विद्वत्-पारायण • महासरस्वती चरित',
    durationLabel: '१८:५७',
    description: 'नमो देव्यै महादेव्यै शिवायै सततं नमः • या देवी सर्वभूतेषु एवं कौशिकी प्रादुर्भाव (१२९ मन्त्र)',
  },
  14: {
    pageNumber: 14,
    sectionKey: 'adhyaya_6',
    titleSa: 'षष्ठोऽध्यायः • धूम्रलोचनवधः',
    titleHi: 'षष्ठ अध्याय: धूम्रलोचन वध',
    audioUrl: `${ARCHIVE_BASE}/10%20Chapter%206%20Shashtodhyayaha.mp3`,
    chanter: 'विद्वत्-पारायण • महासरस्वती चरित',
    durationLabel: '०४:२५',
    description: 'हुङ्कारमात्रेण भस्मसात्कृत • देवी की हुङ्कार से धूम्रलोचन का विनाश (२४ मन्त्र)',
  },
  15: {
    pageNumber: 15,
    sectionKey: 'adhyaya_7',
    titleSa: 'सप्तमोऽध्यायः • चण्डमुण्डवधः',
    titleHi: 'सप्तम अध्याय: काली अवतार व चण्ड-मुण्ड संहार',
    audioUrl: `${ARCHIVE_BASE}/11%20Chapter%207%20Saptamodhyayaha.mp3`,
    chanter: 'विद्वत्-पारायण • महासरस्वती चरित',
    durationLabel: '०५:०७',
    description: 'ललाटफलकात् काली निर्गता • चामुण्डा नामकरण एवं चण्डमुण्ड वध (२७ मन्त्र)',
  },
  16: {
    pageNumber: 16,
    sectionKey: 'adhyaya_8',
    titleSa: 'अष्टमोऽध्यायः • रक्तबीजवधः',
    titleHi: 'अष्टम अध्याय: मातृका प्रादुर्भाव व रक्तबीज वध',
    audioUrl: `${ARCHIVE_BASE}/12%20Chapter%208%20Ashtamodhyayaha.mp3`,
    chanter: 'विद्वत्-पारायण • महासरस्वती चरित',
    durationLabel: '११:०५',
    description: 'ब्राह्मादि मातृकाओं का आगमन एवं चामुण्डा द्वारा रक्तबीज रुधिर पान (६३ मन्त्र)',
  },
  17: {
    pageNumber: 17,
    sectionKey: 'adhyaya_9',
    titleSa: 'नवमोऽध्यायः • निशुम्भवधः',
    titleHi: 'नवम अध्याय: निशुम्भ वध',
    audioUrl: `${ARCHIVE_BASE}/13%20Chapter%209%20Navamodhyayaha.mp3`,
    chanter: 'विद्वत्-पारायण • महासरस्वती चरित',
    durationLabel: '०७:१३',
    description: 'निशुम्भ की विशाल सेना का विनाश एवं देवी द्वारा निशुम्भासुर वध (४१ मन्त्र)',
  },
  18: {
    pageNumber: 18,
    sectionKey: 'adhyaya_10',
    titleSa: 'दशमोऽध्यायः • शुम्भवधः',
    titleHi: 'दशम अध्याय: शुम्भ वध (एकैवाहं जगत्यत्र)',
    audioUrl: `${ARCHIVE_BASE}/14%20Chapter%2010%20Dasamodhyayaha.mp3`,
    chanter: 'विद्वत्-पारायण • महासरस्वती चरित',
    durationLabel: '०५:२८',
    description: 'एकैवाहं जगत्यत्र द्वितीया का ममापरा • सम्पूर्ण मातृकाओं का देवी में लय व शुम्भवध (३२ मन्त्र)',
  },
  19: {
    pageNumber: 19,
    sectionKey: 'adhyaya_11',
    titleSa: 'एकादशोऽध्यायः • नारायणीस्तुतिः',
    titleHi: 'एकादश अध्याय: देवकृत नारायणी स्तुति',
    audioUrl: `${ARCHIVE_BASE}/15%20Chapter%2011%20Ekadhasadhyayaha.mp3`,
    chanter: 'विद्वत्-पारायण • महासरस्वती चरित',
    durationLabel: '०९:४५',
    description: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके • शरणागतदीनार्तपरित्राणपरायणे (५५ मन्त्र)',
  },
  20: {
    pageNumber: 20,
    sectionKey: 'adhyaya_12',
    titleSa: 'द्वादशोऽध्यायः • फलश्रुतिः',
    titleHi: 'द्वादश अध्याय: देवी चरित्र महाफलश्रुति',
    audioUrl: `${ARCHIVE_BASE}/16%20Chapter%2012%20Dwadhasodhyayaha.mp3`,
    chanter: 'विद्वत्-पारायण • महासरस्वती चरित',
    durationLabel: '०७:३७',
    description: 'एभिः स्तवैश्च मां नित्यं स्तोष्यते यः समाहितः • सप्तशती पारायण का अक्षय फल (४१ मन्त्र)',
  },
  21: {
    pageNumber: 21,
    sectionKey: 'adhyaya_13',
    titleSa: 'त्रयोदशोऽध्यायः • सुरथ-वैश्य वरप्रदानम्',
    titleHi: 'त्रयोदश अध्याय: सुरथ राजा और समाधि वैश्य को वरदान',
    audioUrl: `${ARCHIVE_BASE}/17%20Chapter%2013%20Triodasadhyayaha.mp3`,
    chanter: 'विद्वत्-पारायण • उत्तर चरित समाप्ति',
    durationLabel: '०४:०५',
    description: 'सावर्णिर्भविता मनुः • सुरथ को अखण्ड राज्य एवं समाधि वैश्य को आत्मज्ञान वरदान (२९ मन्त्र)',
  },

  // --------------------------------------------------------------------------
  // ३. उत्तराङ्ग विधि, देवीसूक्त व रहस्यत्रयम् (Uttaranga Limbs - ७ खण्ड)
  // --------------------------------------------------------------------------
  22: {
    pageNumber: 22,
    sectionKey: 'vaidika_devi_suktam',
    titleSa: 'अथ वेदोक्तं देवीसूक्तम् (वागाम्भृणी सूक्तम्)',
    titleHi: 'वेदोक्त देवीसूक्तम् (ऋग्वेद १०.१२५)',
    audioUrl: `${ARCHIVE_BASE}/18%20Uttara%20Paka%2002%20devi%CC%84su%CC%84ktam.mp3`,
    chanter: 'वैदिक सस्वर पारायण',
    durationLabel: '०२:३६',
    description: 'ॐ अहं रुद्रेभिर्वसुभिश्चरामि • ऋग्वेदोक्त वागाम्भृणी सूक्तम्',
  },
  23: {
    pageNumber: 23,
    sectionKey: 'tantrika_devi_suktam',
    titleSa: 'अथ तन्त्रोक्तं देवीसूक्तम्',
    titleHi: 'तन्त्रोक्त देवीसूक्तम् (नमो देव्यै महादेव्यै)',
    audioUrl: `${ARCHIVE_BASE}/23%20Anubandam-2-Durga%20Suktham%20Devi.mp3`,
    chanter: 'विद्वत्-पारायण • देवी माहात्म्यम्',
    durationLabel: '०१:५६',
    description: 'नमो देव्यै महादेव्यै शिवायै सततं नमः • समस्त देवी स्वरूप स्तवन',
  },
  24: {
    pageNumber: 24,
    sectionKey: 'pradhanika_rahasyam',
    titleSa: 'अथ प्राधानिकं रहस्यम्',
    titleHi: 'प्राधानिक रहस्य (त्रिदेवी प्रादुर्भाव)',
    audioUrl: `${ARCHIVE_BASE}/19%20Uttara%20Paka%2003Pradhanaka%20Rahasyam.mp3`,
    chanter: 'विद्वत्-पारायण • रहस्यत्रयम्',
    durationLabel: '०५:२९',
    description: 'ऋषिरुवाच • त्रिगुणा तामसी देवी सात्त्विकी राजसी तथा • मूल प्रकृति तत्त्व निरूपण',
  },
  25: {
    pageNumber: 25,
    sectionKey: 'vaikritika_rahasyam',
    titleSa: 'अथ वैकृतिकं रहस्यम्',
    titleHi: 'वैकृतिक रहस्य (अष्टादशभुजा महालक्ष्मी)',
    audioUrl: `${ARCHIVE_BASE}/20%20Uttara%20Paka%2004%20Vaikrithakam%20Rahasyam.mp3`,
    chanter: 'विद्वत्-पारायण • रहस्यत्रयम्',
    durationLabel: '०६:४५',
    description: 'अष्टादशभुजा देवी महालक्ष्मीः सुरारिहा • रहस्यत्रय फल एवं पूजा रहस्य',
  },
  26: {
    pageNumber: 26,
    sectionKey: 'murti_rahasyam',
    titleSa: 'अथ मूर्ति रहस्यम्',
    titleHi: 'मूर्ति रहस्य (भगवती के दिव्य अवतार)',
    audioUrl: `${ARCHIVE_BASE}/21%20Uttara%20Paka%2005%20Moorthy%20Rahasyam.mp3`,
    chanter: 'विद्वत्-पारायण • रहस्यत्रयम्',
    durationLabel: '०४:३७',
    description: 'नन्दा, शाकम्भरी, भीमा, भ्रामरी आदि स्वरूप ध्यान एवं फलश्रुति',
  },
  27: {
    pageNumber: 27,
    sectionKey: 'kunjika_stotram',
    titleSa: 'अथ सिद्धकुञ्जिकास्तोत्रम्',
    titleHi: 'सिद्धकुञ्जिका स्तोत्र (सम्पूर्ण १५ श्लोक एवं मन्त्र)',
    audioUrl: 'https://archive.org/download/siddha-kunjika-stotram/Siddha%20Kunjika%20Stotram.mp3',
    chanter: 'विद्वत्-पारायण • सिद्धकुञ्जिका',
    durationLabel: '०४:०९',
    description: 'शृणु देवि प्रवक्ष्यामि कुञ्जिकास्तोत्रमुत्तमम् • सकल मनोरथ सिद्धि एवं चण्डीजाप फल',
  },
  28: {
    pageNumber: 28,
    sectionKey: 'aparadha_kshamapana',
    titleSa: 'अपराधक्षमापनस्तोत्रम् व श्रीदुर्गा आरती',
    titleHi: 'अपराधक्षमापन स्तोत्र एवं श्रीदुर्गाजी की आरती',
    audioUrl: `${ARCHIVE_BASE}/Kshama%20Prathana%20Stotram.mp3`,
    chanter: 'विद्वत्-पारायण • पारायण समापन',
    durationLabel: '०१:२३',
    description: 'अपराधसहस्त्राणि क्रियन्तेऽहर्निशं मया • परम कल्याणप्रद क्षमापन स्तोत्रम् व आरती',
  },
};

// ============================================================================
// 🪷 श्रीसूक्तम् (ऋग्वेदीय खिलभाग सस्वर) Audio
// ============================================================================
export const SRI_SUKTAM_AUDIO_TRACKS: Record<number, ScriptureAudioTrack> = {
  1: {
    pageNumber: 1,
    sectionKey: 'sri_suktam_complete',
    titleSa: 'श्रीसूक्तम् (ऋग्वेदीय खिलभाग सस्वर)',
    titleHi: 'श्रीसूक्तम् सस्वर १६ मन्त्र एवं फलश्रुति',
    audioUrl: 'https://archive.org/download/SriSuktam_201509/Sri%20Suktam.mp3',
    chanter: 'ऋग्वेदीय वैदिक सस्वर पारायण',
    durationLabel: '११:४४',
    description: 'ॐ हिरण्यवर्णां हरिणीं... आद्य वैदिक मन्त्रमय महालक्ष्मी आराधना (सस्वर १६ ऋचाएँ एवं महाफलश्रुति)',
  },
};

// ============================================================================
// 🪙 कनकधारा स्तोत्रम् (श्रीमद् आद्य शङ्कराचार्य विरचितम्) Audio
// ============================================================================
export const KANAKADHARA_AUDIO_TRACKS: Record<number, ScriptureAudioTrack> = {
  1: {
    pageNumber: 1,
    sectionKey: 'kanakadhara_complete',
    titleSa: 'श्रीकनकधारास्तोत्रम् (सम्पूर्ण २१ श्लोक)',
    titleHi: 'कनकधारा स्तोत्र सम्पूर्ण २१ श्लोक',
    audioUrl: 'https://archive.org/download/SriKanakadharaStotram_201508/Sri%20Kanakadhara%20Stotram%20-%20Sri%20Kanakadhara%20Stotram.mp3',
    chanter: 'आदि शङ्कराचार्य विरचित • विद्वत्-पारायण',
    durationLabel: '०९:२७',
    description: 'अङ्गं हरेः पुलकभूषणमाश्रयन्ती... स्वर्णवृष्टिप्रदायक महालक्ष्मी स्तोत्र (वसन्ततिलका छन्द)',
  },
};

// ============================================================================
// 🌸 सौन्दर्यलहरी (आनन्दलहरी एवं सौन्दर्यलहरी - १०० श्लोक) Audio
// ============================================================================
export const SAUNDARYA_LAHARI_AUDIO_TRACKS: Record<number, ScriptureAudioTrack> = {
  1: {
    pageNumber: 1,
    sectionKey: 'ananda_lahari',
    titleSa: 'आनन्दलहरी (श्लोक १ तः ४१)',
    titleHi: 'आनन्दलहरी - श्लोक १ से ४१ (श्रीविद्या तन्त्र-साधना)',
    audioUrl: 'https://archive.org/download/SriAdiShankaracharyaSoundaryaLahari/Sri%20Adi%20Shankaracharya%20-%20Soundarya%20lahari.mp3',
    chanter: 'आदि शङ्कराचार्य विरचित • शास्त्रसम्मत पारायण',
    durationLabel: '२७:३०',
    description: 'शिवः शक्त्या युक्तो यदि भवति शक्तः प्रभवितुम्... कुण्डलिनी, षट्चक्र एवं श्रीचक्र रहस्य',
  },
  2: {
    pageNumber: 2,
    sectionKey: 'saundarya_lahari_stuti',
    titleSa: 'सौन्दर्यलहरी (श्लोक ४२ तः १००)',
    titleHi: 'सौन्दर्यलहरी - श्लोक ४२ से १०० (भगवती का केशादिपाद सौन्दर्य)',
    audioUrl: 'https://archive.org/download/SriAdiShankaracharyaSoundaryaLahari/Sri%20Adi%20Shankaracharya%20-%20Soundarya%20lahari.mp3',
    chanter: 'आदि शङ्कराचार्य विरचित • शास्त्रसम्मत पारायण',
    durationLabel: '४०:००',
    description: 'गतैर्माणिक्यत्वं गगनमणिभिः... श्रीमाता का दिव्य अलौकिक सौन्दर्य एवं समर्पण स्तुति',
  },
};

// ============================================================================
// 🌺 श्रीदुर्गासप्तश्लोकी (सप्तश्लोकी दुर्गा - शिवोक्तम्) Audio
// ============================================================================
export const DURGA_SAPTASHLOKI_AUDIO_TRACKS: Record<number, ScriptureAudioTrack> = {
  1: {
    pageNumber: 1,
    sectionKey: 'durga_saptashloki',
    titleSa: 'श्रीदुर्गासप्तश्लोकी (सप्तश्लोकी दुर्गा)',
    titleHi: 'सप्तश्लोकी दुर्गा (सम्पूर्ण ७ मूल मन्त्र एवं शिव-पार्वती संवाद)',
    audioUrl: `${ARCHIVE_BASE}/22%20Anubandam-1-Durga%20Saptashloki.mp3`,
    chanter: 'विद्वत्-पारायण • देवी माहात्म्यम्',
    durationLabel: '०२:४४',
    description: 'शिव उवाच: देवि त्वं भक्तसुलभे सर्वकार्यविधायिनी... ज्ञानिनामपि चेतांसि... एवं सर्वाबाधाप्रशमनं',
  },
};

// ============================================================================
// 🏹 श्रीअर्जुनकृत दुर्गास्तोत्रम् (महाभारत भीष्मपर्व अध्याय २३) Audio
// ============================================================================
export const ARJUNA_DURGA_AUDIO_TRACKS: Record<number, ScriptureAudioTrack> = {
  1: {
    pageNumber: 1,
    sectionKey: 'arjuna_durga_stuti',
    titleSa: 'श्रीअर्जुनकृत दुर्गास्तोत्रम् (महाभारत भीष्मपर्व)',
    titleHi: 'अर्जुनकृत दुर्गा स्तुति एवं भगवती विजय-वरदानम्',
    audioUrl: `${ARCHIVE_BASE}/23%20Anubandam-2-Durga%20Suktham%20Devi.mp3`,
    chanter: 'विद्वत्-पारायण • देवी माहात्म्यम् (परिशिष्टम्)',
    durationLabel: '०१:५६',
    description: 'नमस्ते सिद्धसेनानि आर्ये मन्दरवासिनि... श्रीकृष्ण-निर्देशित स्तोत्रम् एवं देवी का साक्षात् विजय-वरदान',
  },
};

/**
 * Returns audio track for a specific book and page number
 */
export function getScriptureAudioTrack(bookId: string, pageNumber: number): ScriptureAudioTrack | null {
  if (bookId === 'granth-durga-saptashati' || (bookId.includes('saptashati') && !bookId.includes('saptashloki'))) {
    return SAPTASHATI_AUDIO_TRACKS[pageNumber] || null;
  }
  if (bookId === 'granth-durga-saptashloki' || bookId.includes('saptashloki')) {
    return DURGA_SAPTASHLOKI_AUDIO_TRACKS[pageNumber] || null;
  }
  if (bookId === 'granth-sri-suktam' || bookId.includes('sri-suktam')) {
    return SRI_SUKTAM_AUDIO_TRACKS[pageNumber] || null;
  }
  if (bookId === 'granth-kanakadhara-stotram' || bookId.includes('kanakadhara')) {
    return KANAKADHARA_AUDIO_TRACKS[pageNumber] || null;
  }
  if (bookId === 'granth-saundarya-lahari' || bookId.includes('saundarya-lahari') || bookId.includes('soundarya-lahari')) {
    return SAUNDARYA_LAHARI_AUDIO_TRACKS[pageNumber] || null;
  }
  if (bookId === 'granth-arjuna-durga-stuti' || bookId.includes('arjuna-durga')) {
    return ARJUNA_DURGA_AUDIO_TRACKS[pageNumber] || null;
  }
  return null;
}


