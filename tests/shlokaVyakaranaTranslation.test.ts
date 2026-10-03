import { describe, it, expect } from 'vitest';
import { findCanonicalTranslation } from '../src/data/translations/canonicalTranslations.js';
import { analyzeShlokaLinguistics } from '../src/utils/paninianLinguisticEngine.js';

describe('Shloka Bhavartha & Paninian Vyakarana Engine', () => {
  it('should find pre-indexed canonical translations and grammatical breakdowns', () => {
    // 1. Ganapati Atharvashirsha
    const ganeshaTest = findCanonicalTranslation('ॐ नमस्ते गणपतये। त्वमेव प्रत्यक्षं तत्त्वमसि।');
    expect(ganeshaTest).toBeDefined();
    expect(ganeshaTest?.hindiMeaning).toContain('गणपति! आपको सादर नमस्कार है');
    expect(ganeshaTest?.padaccheda).toContain('नमः । ते । गणपतये');
    expect(ganeshaTest?.padaList.length).toBeGreaterThan(0);
    expect(ganeshaTest?.padaList.some(p => p.grammaticalType === 'tinganta')).toBe(true);

    // 2. Rudrashtakam
    const rudraTest = findCanonicalTranslation('नमामीशमीशान निर्वाणरूपं विभुं व्यापकं ब्रह्मवेदस्वरूपम्');
    expect(rudraTest).toBeDefined();
    expect(rudraTest?.chhandas?.name).toContain('भुजङ्गप्रयात');
    expect(rudraTest?.samasaList && rudraTest.samasaList.length).toBeGreaterThan(0);
    expect(rudraTest?.padaList.some(p => p.word.includes('नमामि'))).toBe(true);

    // 3. Shiva Tandava
    const tandavaTest = findCanonicalTranslation('जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्');
    expect(tandavaTest).toBeDefined();
    expect(tandavaTest?.chhandas?.name).toContain('पञ्चचामर');
    expect(tandavaTest?.samasaList && tandavaTest.samasaList.length).toBeGreaterThan(0);

    // 4. Bhagavad Gita 4.7
    const gitaTest = findCanonicalTranslation('यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।');
    expect(gitaTest).toBeDefined();
    expect(gitaTest?.chhandas?.name).toContain('अनुष्टुप्');
    expect(gitaTest?.hindiMeaning).toContain('हे भारत (अर्जुन)! जब-जब धर्म की हानि');

    // 5. Devi Stuti
    const deviTest = findCanonicalTranslation('सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥');
    expect(deviTest).toBeDefined();
    expect(deviTest?.chhandas?.name).toContain('अनुष्टुप्');
    expect(deviTest?.padaccheda).toContain('नमः । अस्तु । ते');

    // 6. Durga Saptashati - Devi Kavacham Verse 1
    const saptashatiKavacha = findCanonicalTranslation(
      'यद्गुह्यं परमं लोके सर्वरक्षाकरं नृणाम् । यन्न कस्यचिदाख्यातं तन्मे ब्रूहि पितामह'
    );
    expect(saptashatiKavacha).toBeDefined();
    expect(saptashatiKavacha?.hindiMeaning).toContain('मार्कण्डेय जी ने कहा');
    expect(saptashatiKavacha?.hindiMeaning).toContain('परम गोपनीय');
    expect(saptashatiKavacha?.padaccheda).toContain('सर्व-रक्षा-करम्');
    expect(saptashatiKavacha?.samasaList && saptashatiKavacha.samasaList.length).toBeGreaterThan(0);
  });

  it('should dynamically analyze arbitrary Sanskrit shlokas on-the-fly with Paninian heuristics', () => {
    const customShloka = 'सत्यं वद धर्मं चर न हि प्रमादः।';
    const analysis = analyzeShlokaLinguistics(customShloka, 'taittiriya-upanishad', 1);

    expect(analysis).toBeDefined();
    expect(analysis.shlokaText).toBe(customShloka);
    expect(analysis.padaccheda).toBeDefined();
    expect(analysis.padaccheda.length).toBeGreaterThan(0);
    expect(analysis.dandanvaya).toBeDefined();
    expect(analysis.padaList.length).toBeGreaterThan(0);

    // Check that Avyaya 'न' is correctly identified
    const naAvyaya = analysis.padaList.find(p => p.word === 'न');
    expect(naAvyaya).toBeDefined();
    expect(naAvyaya?.grammaticalType).toBe('avyaya');

    // Check that Avyaya 'हि' is correctly identified
    const hiAvyaya = analysis.padaList.find(p => p.word === 'हि');
    expect(hiAvyaya).toBeDefined();
    expect(hiAvyaya?.grammaticalType).toBe('avyaya');

    // Chhandas details should be generated
    expect(analysis.chhandas).toBeDefined();
    expect(analysis.chhandas?.syllableWeight).toBeDefined();
  });

  it('should preserve cache for repeated queries', () => {
    const text = 'वसुधैव कुटुम्बकम् उदारचरितानाम्';
    const firstCall = analyzeShlokaLinguistics(text);
    const secondCall = analyzeShlokaLinguistics(text);

    expect(firstCall).toBe(secondCall); // Exact same cached object reference
  });

  it('should provide authentic translations across the entirety of Sri Durga Saptashati', () => {
    const saptashatiPassages = [
      {
        section: 'कवच (दशदिक् रक्षा)',
        text: 'प्राच्यां रक्षतु मामैन्द्री आग्नेय्यामग्निदेवता । दक्षिणेऽवतु वाराही नैर्ऋत्यां खड्गधारिणी',
        expectedKeyword: 'इन्द्राणी'
      },
      {
        section: 'अर्गला स्तोत्र (रूपं देहि जयं देहि)',
        text: 'महिषासुरनिर्णाशि भक्तानां सुखदे नमः । रूपं देहि जयं देहि यशो देहि द्विषो जहि',
        expectedKeyword: 'महिषासुर'
      },
      {
        section: 'अपराजिता स्तुति (या देवी सर्वभूतेषु)',
        text: 'या देवी सर्वभूतेषु मातृरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः',
        expectedKeyword: 'माता'
      },
      {
        section: 'नारायणी स्तुति (शरणागतदीनार्त)',
        text: 'शरणागतदीनार्तपरित्राणपरायणे । सर्वस्यार्तिहरे देवि नारायणि नमोऽस्तु ते',
        expectedKeyword: 'नारायणी'
      },
      {
        section: 'सिद्धकुञ्जिका स्तोत्र',
        text: 'ऐंकारी सृष्टिरूपायै ह्रींकारी प्रतिपालिका । क्लींकारी कामरूपिण्यै बीजरूपे नमोऽस्तु ते',
        expectedKeyword: 'सृष्टि'
      },
      {
        section: 'अपराध क्षमापन स्तोत्र',
        text: 'अपराधसहस्राणि क्रियन्तेऽहर्निशं मया । दासोऽयमिति मां मत्वा क्षमस्व परमेश्वरि',
        expectedKeyword: 'अपराध'
      },
      {
        section: 'प्रथम चरित (मधुकैटभवध आख्यान)',
        text: 'सावर्णिः सूर्यतनयो यो मनुः कथ्यतेऽष्टमः । निशामय तदुत्पत्तिं विस्तराद् गदतो मम',
        expectedKeyword: 'मधु-कैटभ'
      },
      {
        section: 'मध्यम चरित (महिषासुर सैन्यवध)',
        text: 'ततो देवानां शरीरेभ्यो महत्तेजः समुद्गतम् । तच्चैक्यं समगच्छत',
        expectedKeyword: 'महिषासुर'
      },
      {
        section: 'उत्तर चरित (शुम्भ-निशुम्भ वध)',
        text: 'धूम्रलोचने निहते दैत्ये चण्डमुण्डयोश्च विनाशिते । रक्तबीजे च संहृते',
        expectedKeyword: 'रक्तबीज'
      },
      {
        section: 'रहस्यत्रयम् - १. प्राधानिकं रहस्यम्',
        text: 'त्रिगुणा तामसी देवी सात्त्विकी या त्रिधोदिता । सा शर्वा चण्डिका दुर्गा भद्रा भगवती स्मृता',
        expectedKeyword: 'प्राधानिकं रहस्यम्'
      },
      {
        section: 'रहस्यत्रयम् - २. वैकृतिकं रहस्यम्',
        text: 'शालिहोत्रेण संयुक्तं पायसं घृतसंप्लुतम् । बलिं दद्यान्महादेव्यै सर्वोपद्रवशान्तये',
        expectedKeyword: 'वैकृतिकं रहस्यम्'
      },
      {
        section: 'रहस्यत्रयम् - ३. मूर्तिरहस्यम्',
        text: 'नन्दा भगवती नाम या भविष्यति नन्दजा । स्तुता सा पूजिता भक्ता वशीकुर्याज्जगत्त्रयम्',
        expectedKeyword: 'मूर्तिरहस्यम्'
      }
    ];

    saptashatiPassages.forEach(({ section, text, expectedKeyword }) => {
      const result = findCanonicalTranslation(text, 'granth-durga-saptashati');
      expect(result, `Expected to find translation for ${section}`).toBeDefined();
      expect(result?.hindiMeaning, `Hindi meaning for ${section} should contain '${expectedKeyword}'`).toContain(expectedKeyword);
      expect(result?.padaccheda.length, `Padaccheda for ${section} should not be empty`).toBeGreaterThan(0);
    });
  });

  it('should accurately translate Mahishasuramardini Stotram verses without getting hijacked by Saptashati story summaries', () => {
    const shloka3Text = `अयि जगदम्ब मदम्ब कदम्बवनप्रियवासिनि हासरते
शिखरि शिरोमणि तुङ्गहिमालय शृङ्गिनिजालय मध्यगते ।
मधुमधुरे मधुकैटभगञ्जिनि कैटभभञ्जिनि रासरते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते ॥ ३ ॥`;

    const result = analyzeShlokaLinguistics(shloka3Text, 'supp-devi-mahishasura-mardini', 3);
    expect(result).toBeDefined();
    // Must NOT be the generic Durga Saptashati chapter story summary
    expect(result.hindiMeaning).not.toContain('॥ मध्यम चरित्र (महिषासुर संहार) ॥');
    expect(result.hindiMeaning).not.toContain('जब महिषासुर के अत्याचारों से पीड़ित होकर');
    // Must be the authentic Shloka 3 translation
    expect(result.hindiMeaning).toContain('जगदम्ब');
    expect(result.hindiMeaning).toContain('कदम्ब');
    expect(result.hindiMeaning).toContain('हिमालय');
    expect(result.shlokaNumber).toBe(3);
    expect(result.padaccheda).toContain('कदम्ब-वन-प्रिय-वासिनि');
    expect(result.samasaList.length).toBeGreaterThan(0);
  });

  it('should accurately translate Sri Chandika Stotram verses without getting hijacked by Saptashati story summaries', () => {
    const chandikaDhyanam = `चामुण्डा प्रेतगा विकृता चाऽस्थिभूषणा ।
दंष्ट्रालि क्षीणदेहा च गर्ताक्षी कामरूपिणी ॥`;

    const result = analyzeShlokaLinguistics(chandikaDhyanam, 'supp-chandika-stotram', 1);
    expect(result).toBeDefined();
    // Must NOT be the generic Durga Saptashati chapter story summary
    expect(result.hindiMeaning).not.toContain('॥ उत्तर चरित्र (शुम्भ-निशुम्भ व रक्तबीज संहार) ॥');
    expect(result.hindiMeaning).not.toContain('भगवती चण्डिका के भाल-प्रदेश से विकराल वदना महाकाली का प्राकट्य हुआ');
    // Must be the authentic Chandika Stotram Dhyanam translation
    expect(result.hindiMeaning).toContain('चण्डमुण्डा');
    expect(result.hindiMeaning).toContain('कामरूपिणी');
    expect(result.shlokaNumber).toBe(1);
    expect(result.sourceReference).toContain('तीव्रचण्डिकास्तोत्रम्');
  });
});
