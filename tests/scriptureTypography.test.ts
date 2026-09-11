import { describe, it, expect } from 'vitest';
import {
  classifyScriptureLine,
  classifyGitaScriptureLine,
  getScriptureBlockConfig,
  groupScriptureFolio,
  parseGitaFolio,
} from '../src/utils/scriptureTypography.js';

describe('Scripture Typography & Classification Standard', () => {
  describe('classifyScriptureLine', () => {
    it('accurately identifies Vaidika Mantras by Svara accents or canonical incipits', () => {
      // With explicit Svara accents
      const accentedVedic = 'अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म्';
      expect(classifyScriptureLine(accentedVedic)).toBe('VEDIC_MANTRA');

      // Canonical Shanti Path mantras (Rigveda & Yajurveda)
      const shantiMantra = 'द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः ।';
      expect(classifyScriptureLine(shantiMantra)).toBe('VEDIC_MANTRA');

      const swastiMantra = 'स्वस्ति न इन्द्रो वृद्धश्रवाः स्वस्ति नः पूषा विश्ववेदाः ।';
      expect(classifyScriptureLine(swastiMantra)).toBe('VEDIC_MANTRA');

      const bhadramMantra = 'भद्रं कर्णेभिः शृणुयाम देवा भद्रं पश्येमाक्षभिर्यजत्राः ।';
      expect(classifyScriptureLine(bhadramMantra)).toBe('VEDIC_MANTRA');
    });

    it('accurately identifies Pauranika Shlokas and Stotras', () => {
      const ganeshaDhyana = 'शुक्लाम्बरधरं देवं शशिवर्णं चतुर्भुजम् । प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥';
      expect(classifyScriptureLine(ganeshaDhyana)).toBe('PAURANIK_SHLOKA');

      const dwadashaNama = 'सुमुखश्चैकदन्तश्च कपिलो गजकर्णकः । लम्बोदरश्च विकटो विघ्ननाशो विनायकः ॥';
      expect(classifyScriptureLine(dwadashaNama)).toBe('PAURANIK_SHLOKA');

      const stotraEnding = 'द्वादशैतानि नामानि यः पठेच्छृणुयादपि ॥';
      expect(classifyScriptureLine(stotraEnding)).toBe('PAURANIK_SHLOKA');
    });

    it('accurately identifies Devata Namavali items', () => {
      expect(classifyScriptureLine('१. ॐ श्रीमन्महागणाधिपतये नमः ।')).toBe('NAMAVALI');
      expect(classifyScriptureLine('६. ॐ वास्तुदेवताभ्यो नमः ।')).toBe('NAMAVALI');
      expect(classifyScriptureLine('१४. ॐ एतत्कर्मप्रधानदेवताभ्यो नमः ।')).toBe('NAMAVALI');
      expect(classifyScriptureLine('2. इष्ट देवताभ्यो नमः')).toBe('NAMAVALI');
    });

    it('accurately identifies Karmakanda Vidhi instructions', () => {
      const vidhi1 = '• ऊपर लिखे देवताओं का पंचोपचार या षोडशोपचार से पूजा करें ।';
      expect(classifyScriptureLine(vidhi1)).toBe('VIDHI_INSTRUCTION');

      const vidhi2 = 'एक मिट्टी के प्याले में चावल भर कर उसपर हल्दी से अष्टदल बनाकर रखें ।';
      expect(classifyScriptureLine(vidhi2)).toBe('VIDHI_INSTRUCTION');
    });

    it('accurately identifies Sacred Section Headings and Invocations', () => {
      expect(classifyScriptureLine('【 प्रधान देवता नमस्कार 】')).toBe('SECTION_HEADING');
      expect(classifyScriptureLine('【 शान्ति पाठः 】')).toBe('SECTION_HEADING');
      expect(classifyScriptureLine('॥ श्रीगणेशाय नमः ॥')).toBe('INVOCATION_HEADING');
      expect(classifyScriptureLine('॥ कलश पूजनम् ॥')).toBe('INVOCATION_HEADING');
    });

    it('accurately identifies Ritual Step Headers and stage directions', () => {
      expect(classifyScriptureLine('• पवित्रीकरणम्:')).toBe('RITUAL_STEP_HEADER');
      expect(classifyScriptureLine('• आचम्य (आचमन करें):')).toBe('RITUAL_STEP_HEADER');
      expect(classifyScriptureLine('• सप्तधान्य प्रक्षेप (भूमि पर सप्तधान्य रखें):')).toBe('RITUAL_STEP_HEADER');
      expect(classifyScriptureLine('• दुग्ध स्नानम्:')).toBe('RITUAL_STEP_HEADER');
      expect(classifyScriptureLine('* नारद उवाच *')).toBe('RITUAL_STEP_HEADER');
    });

    it('accurately identifies Upachara Samarpana Mantras', () => {
      expect(classifyScriptureLine('▪ ॐ भूर्भुवः स्वः गणेशाय नमः । दुग्धस्नानं समर्पयामि ।')).toBe('SAMARPANA_MANTRA');
      expect(classifyScriptureLine('ॐ अपां पतये वरुणाय नमः । सर्वोपचारार्थे गन्धाक्षत पुष्पाणि समर्पयामि । नमस्करोमि ।')).toBe('SAMARPANA_MANTRA');
      expect(classifyScriptureLine('दध्यानीतं मया देव स्नानार्थं प्रतिगृह्यताम् ॥')).toBe('SAMARPANA_MANTRA');
    });

    it('accurately identifies canonical Vedic prose without explicit accents', () => {
      expect(classifyScriptureLine('ॐ वरुणस्योत्तम्भनमसि वरुणस्य स्कम्भसर्जनीस्थो वरुणस्य ऋतसदन्न्यसि')).toBe('VEDIC_MANTRA');
      expect(classifyScriptureLine('ॐ भूरसि भूमिरस्यदितिरसि विश्वधाया विश्वस्य भुवनस्य धर्त्री ।')).toBe('VEDIC_MANTRA');
      expect(classifyScriptureLine('हरिः ॐ नमस्ते गणपतये । त्वमेव प्रत्यक्षं तत्त्वमसि ।')).toBe('VEDIC_MANTRA');
    });

    it('accurately identifies Sankalpa GPS text', () => {
      expect(classifyScriptureLine('ॐ विष्णुर्विष्णुर्विष्णुः, ॐ तत्सत् श्रीमद्भगवतो महापुरुषस्य... ध्यान आवाहनादि षोडशोपचार पूजनमहं करिष्ये ।')).toBe('SANKALPA');
    });

    it('accurately classifies single-danda odd shloka lines as PAURANIK_SHLOKA', () => {
      expect(classifyScriptureLine('प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम् ।')).toBe('PAURANIK_SHLOKA');
      expect(classifyScriptureLine('ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा ।')).toBe('PAURANIK_SHLOKA');
    });
  });

  describe('groupScriptureFolio', () => {
    it('groups contiguous Namavali lines into a single namavali_grid unit', () => {
      const sampleFolio = [
        '【 प्रधान देवता नमस्कार 】',
        '१. ॐ श्रीमन्महागणाधिपतये नमः ।',
        '२. ॐ इष्टदेवताभ्यो नमः ।',
        '३. ॐ कुलदेवताभ्यो नमः ।',
        '४. ॐ ग्रामदेवताभ्यो नमः ।',
        '• सुमुखश्चैकदन्तश्च कपिलो गजकर्णकः ।',
      ].join('\n');

      const units = groupScriptureFolio(sampleFolio);
      expect(units.length).toBe(3);
      expect(units[0]).toEqual({ kind: 'single', line: '【 प्रधान देवता नमस्कार 】', type: 'SECTION_HEADING' });
      expect(units[1].kind).toBe('namavali_grid');
      if (units[1].kind === 'namavali_grid') {
        expect(units[1].items.length).toBe(4);
        expect(units[1].items[0]).toBe('१. ॐ श्रीमन्महागणाधिपतये नमः ।');
      }
      expect(units[2].kind).toBe('single');
      if (units[2].kind === 'single') {
        expect(units[2].type).toBe('PAURANIK_SHLOKA');
      }
    });

    it('classifies all lines under Swasti Vachan as VEDIC_MANTRA with couplet continuity', () => {
      const swastiFolio = [
        '• स्वस्ति वाचन:',
        'ॐ आ नो भद्राः क्रतवो यन्तु विश्वतोऽदब्धासो अपरीतास उद्भिदः ।',
        'देवा नो यथा सदमिद्वृधे असन्नप्रायुवो रक्षितारो दिवे दिवे ॥ १ ॥',
        '▪ देवानां भद्रा सुमतिर्ऋजूयतां देवानाꣳ रातिरभिनो निवर्तताम् ।',
        'देवानाꣳ सख्यमुपसेदिमा वयं देवा न आयुः प्र तिरन्तु जीवसे ॥ २ ॥',
        '▪ तान् पूर्वया निविदा हूमहे वयं भगं मित्रमदितिं दक्षमस्रिधम् ।',
        'अर्यमणं वरुणं सोममश्विना सरस्वती नः सुभगा मयस्करत् ॥ ३ ॥',
      ].join('\n');

      const units = groupScriptureFolio(swastiFolio);
      expect(units[0]).toEqual({ kind: 'single', line: '• स्वस्ति वाचन:', type: 'RITUAL_STEP_HEADER' });
      // All verses must be VEDIC_MANTRA
      for (let i = 1; i < units.length; i++) {
        const u = units[i];
        expect(u.kind).toBe('single');
        if (u.kind === 'single') {
          expect(u.type).toBe('VEDIC_MANTRA');
        }
      }
    });

    it('classifies all lines in Ganapatyatharvashirsha as VEDIC_MANTRA', () => {
      const atharvaFolio = [
        '॥ गणपत्यथर्वशीर्ष स्तोत्रम् ॥',
        'हरिः ॐ नमस्ते गणपतये । त्वमेव प्रत्यक्षं तत्त्वमसि ।',
        'त्वं साक्षादात्माऽसि नित्यम् ॥ १ ॥',
        'ऋतं वच्मि । सत्यं वच्मि ॥ २ ॥',
        'एवं ध्यायति यो नित्यं स योगी योगिनां वरः ॥ ९ ॥',
      ].join('\n');

      const units = groupScriptureFolio(atharvaFolio);
      expect(units[0]).toEqual({ kind: 'single', line: '॥ गणपत्यथर्वशीर्ष स्तोत्रम् ॥', type: 'INVOCATION_HEADING' });
      for (let i = 1; i < units.length; i++) {
        const u = units[i];
        expect(u.kind).toBe('single');
        if (u.kind === 'single') {
          expect(u.type).toBe('VEDIC_MANTRA');
        }
      }
    });
  });


  describe('getScriptureBlockConfig', () => {
    it('provides Tiro Sanskrit with loose leading for Vaidika Mantras', () => {
      const config = getScriptureBlockConfig('VEDIC_MANTRA');
      expect(config.fontFamily).toContain('Tiro Devanagari Sanskrit');
      expect(config.lineHeightClass).toContain('leading-[2.2]');
      expect(config.badgeLabel).toBe('वैदिक सस्वर मन्त्र');
    });

    it('provides Noto Serif for Pauranika Shlokas', () => {
      const config = getScriptureBlockConfig('PAURANIK_SHLOKA');
      expect(config.fontFamily).toContain('Noto Serif Devanagari');
      expect(config.lineHeightClass).toContain('leading-[1.8]');
      expect(config.badgeLabel).toBe('पौराणिक स्तोत्र / ध्यान');
    });

    it('provides Noto Sans for Vidhi Instructions', () => {
      const config = getScriptureBlockConfig('VIDHI_INSTRUCTION');
      expect(config.fontFamily).toContain('Noto Sans Devanagari');
      expect(config.badgeLabel).toBe('विधि निर्देश');
    });
  });

  describe('Gita Dual-Layer Verse vs Anuvad Boundary Integrity', () => {
    it('does NOT falsely classify Sanskrit verses containing syllables like था, का, ते as Hindi anuvad', () => {
      const HINDI_VERB_BOUNDARY = /(?:^|[\s.,!?—–\-])(?:किया|किये|किए|कहा|कहते|बोले|बोला|बोली|उठे|उठा|बजाया|बजाये|बजाए|दिये|दिया|दिए|लिये|लिया|लिए|देखा|देखते|हुए|हुआ|हुई|है|हैं|हूँ|था|थी|थे|होता|होते|होती|सकते|सकता|सकती|चाहिए|लगे|लगा|लगी|पड़े|पड़ा|पड़ी|गये|गया|गयी|गए|गई|बतलाता|बतलाते|बतलाती)(?:$|[\s.,!?—–।॥\-])/u;
      const HINDI_INTERROGATIVE = /(?:^|[\s.,!?—–\-])(?:क्या|क्यों|कैसे|किसने|किसको|किसके|कहाँ|कब)(?:$|[\s.,!?—–।॥\-])/u;
      const HINDI_OBLIQUE_PLURAL = /[क-ह]+(?:ोंमें|ोंने|ोंको|ोंके|ोंकी|ोंपर|ोंसे|ोंवाले)(?:$|[\s.,!?—–।॥\-])/u;

      const isSanskritShlokaLine = (text: string): boolean => {
        const trimmed = text.trim();
        if (!/[।॥]/.test(trimmed)) return false;
        if (/[?？]/.test(trimmed)) return false;
        if (HINDI_VERB_BOUNDARY.test(trimmed)) return false;
        if (HINDI_INTERROGATIVE.test(trimmed)) return false;
        if (HINDI_OBLIQUE_PLURAL.test(trimmed)) return false;
        if (/^(?:इसके\s*(?:बाद|अनन्तर|पश्चात्)|संजय\s*बोले|अर्जुन\s*बोले|श्रीभगवान्\s*बोले|धृतराष्ट्र\s*बोले|कौरवोंमें|भीष्मपितामहद्वारा|इसलिये|और\s*भी|आप-)/u.test(trimmed)) {
          return false;
        }
        return true;
      };

      // Crucial lines with potential false-positive syllables:
      // 'सौभद्रो द्रौपदेयाश्च सर्व एव महारथाः ॥' contains 'महारथाः' (था)
      expect(isSanskritShlokaLine('सौभद्रो द्रौपदेयाश्च सर्व एव महारथाः ॥')).toBe(true);

      // 'नायका मम सैन्यस्य संज्ञार्थं तान् ब्रवीमि ते ॥' contains 'नायका' (का) and 'ते'
      expect(isSanskritShlokaLine('नायका मम सैन्यस्य संज्ञार्थं तान् ब्रवीमि ते ॥')).toBe(true);

      // 'अश्वत्थामा विकर्णश्च सौमदत्तिस्तथैव च ॥' contains 'अश्वत्थामा' (था) and 'तथैव'
      expect(isSanskritShlokaLine('अश्वत्थामा विकर्णश्च सौमदत्तिस्तथैव च ॥')).toBe(true);

      // True Hindi translation lines ending with ॥
      expect(isSanskritShlokaLine('...पुत्रोंने क्या किया? ॥ १ ॥')).toBe(false);
      expect(isSanskritShlokaLine('...पाँचों पुत्र-ये सभी महारथी हैं ॥ ४-६ ॥')).toBe(false);
      expect(isSanskritShlokaLine('...उनको बतलाता हूँ ॥ ७ ॥')).toBe(false);
    });

    it('correctly parses multi-line anuvad ending with verse 11 into ANUVAD block, not SHLOKA', () => {
      const page3Lines = [
        'अयनेषु च सर्वेषु यथाभागमवस्थिताः ।',
        'भीष्ममेवाभिरक्षन्तु भवन्तः सर्व एव हि ॥',
        'इसलिये सब मोर्चोपर अपनी-अपनी जगह',
        'स्थित रहते हुए आपलोग सभी निःसन्देह',
        'भीष्मपितामहकी ही सब ओरसे रक्षा करें ॥ ११ ॥',
        'तस्य सञ्जनयन् हर्ष कुरुवृद्धः पितामहः ।',
        'सिंहनादं विनद्योच्चैः शङ्खं दध्मौ प्रतापवान् ॥',
      ];

      type GitaBlock = { type: 'SHLOKA' | 'ANUVAD'; lines: string[] };
      const blocks: GitaBlock[] = [];
      let currentShloka: string[] = [];
      let currentAnuvad: string[] = [];
      const flushShloka = () => {
        if (currentShloka.length > 0) {
          blocks.push({ type: 'SHLOKA', lines: [...currentShloka] });
          currentShloka = [];
        }
      };
      const flushAnuvad = () => {
        if (currentAnuvad.length > 0) {
          blocks.push({ type: 'ANUVAD', lines: [...currentAnuvad] });
          currentAnuvad = [];
        }
      };

      let parsingState: 'SHLOKA' | 'ANUVAD' = 'SHLOKA';
      for (const line of page3Lines) {
        if (parsingState === 'ANUVAD') {
          currentAnuvad.push(line);
          if (/॥\s*[०-९\d\-]+\s*॥/.test(line)) {
            flushAnuvad();
            parsingState = 'SHLOKA';
          }
        } else {
          const isHindiStart =
            !/[।॥]/.test(line) ||
            /[?？]/.test(line) ||
            /^(?:इसके\s*(?:बाद|अनन्तर|पश्चात्)|संजय\s*बोले|अर्जुन\s*बोले|श्रीभगवान्\s*बोले|धृतराष्ट्र\s*बोले|इसलिये|और\s*भी|आप-)/u.test(line) ||
            /(?:^|[\s.,!?—–\-])(?:और|भी|ही|तो|कि|अपने|अपनी|इस|उस|इन|उन|हम|आप|नहीं|लिये|लिए|समान|करें|है|हैं|था|थी|थे|दिये|बजाया|कहा)(?:$|[\s.,!?—–।॥\-])/u.test(line);

          if (isHindiStart) {
            flushShloka();
            currentAnuvad.push(line);
            if (/॥\s*[०-९\d\-]+\s*॥/.test(line)) {
              flushAnuvad();
              parsingState = 'SHLOKA';
            } else {
              parsingState = 'ANUVAD';
            }
          } else {
            currentShloka.push(line);
          }
        }
      }
      flushShloka();
      flushAnuvad();

      expect(blocks.length).toBe(3);
      expect(blocks[0].type).toBe('SHLOKA');
      expect(blocks[0].lines.length).toBe(2);
      expect(blocks[0].lines[0]).toBe('अयनेषु च सर्वेषु यथाभागमवस्थिताः ।');

      expect(blocks[1].type).toBe('ANUVAD');
      expect(blocks[1].lines.length).toBe(3);
      expect(blocks[1].lines[2]).toContain('भीष्मपितामहकी ही सब ओरसे रक्षा करें ॥ ११ ॥');

      expect(blocks[2].type).toBe('SHLOKA');
      expect(blocks[2].lines.length).toBe(2);
      expect(blocks[2].lines[0]).toBe('तस्य सञ्जनयन् हर्ष कुरुवृद्धः पितामहः ।');
    });

    it('accurately identifies श्रीभगवानुवाच as SPEAKER and separates Shloka 2 on Page 13', () => {
      const isSpeaker = (line: string): boolean => {
        return (
          /(?:[उु]वाच|ऊचु[ः:]?)[॥ः:\s]*$/u.test(line) ||
          /^[॥\s]*(?:धृतराष्ट्र|सञ्जय|संजय|अर्जुन|श्रीभगवान्?|भगवान्?)\s*[उु]?वाच[॥ः:\s]*$/u.test(line)
        );
      };

      expect(isSpeaker('श्रीभगवानुवाच')).toBe(true);
      expect(isSpeaker('भगवानुवाच')).toBe(true);
      expect(isSpeaker('सञ्जय उवाच')).toBe(true);
      expect(isSpeaker('धृतराष्ट्र उवाच')).toBe(true);
      expect(isSpeaker('अर्जुन उवाच')).toBe(true);

      // Shloka line containing 'उवाच' inside should NOT match speaker
      expect(isSpeaker('विषीदन्तमिदं वाक्यमुवाच मधुसूदनः ॥')).toBe(false);
    });

    it('accurately parses 4-pada Tristup meter verses with hyphens on Gita Page 14 into unified Shloka cards', () => {
      const page14Raw = `
अर्जुन उवाच
कथं भीष्ममहं सङ्ख्ये द्रोणं च मधुसूदन ।
इषुभिः प्रतियोत्स्यामि पूजार्हावरिसूदन ॥
अर्जुन बोले-हे मधुसूदन! मैं रणभूमिमें किस प्रकार
बाणोंसे भीष्मपितामह और द्रोणाचार्यके विरुद्ध लडूंगा?
क्योंकि हे अरिसूदन! वे दोनों ही पूजनीय हैं ॥ ४ ॥
गुरूनहत्वा हि महानुभावा-
ञ्छ्रेयो भोक्तुं भैक्ष्यमपीह लोके ।
हत्वार्थकामांस्तु गुरूनिहैव
भुञ्जीय भोगान्रुधिरप्रदिग्धान् ॥
इसलिये इन महानुभाव गुरुजनोंको न मारकर मैं
इस लोकमें भिक्षाका अन्न भी खाना कल्याणकारक
समझता हूँ; क्योंकि गुरुजनोंको मारकर भी इस
लोकमें रुधिरसे सने हुए अर्थ और कामरूप
भोगोंको ही तो भोगूँगा ॥ ५ ॥
न चैतद्विद्मः कतरन्नो गरीयो-
यद्वा जयेम यदि वा नो जयेयुः ।
यानेव हत्वा न जिजीविषाम-
स्तेऽवस्थिताः प्रमुखे धार्तराष्ट्राः ॥
हम यह भी नहीं जानते कि हमारे लिये युद्ध
करना और न करना-इन दोनोंमेंसे कौन-सा श्रेष्ठ
      `.trim();

      const blocks = parseGitaFolio(page14Raw);

      // Block 0: SPEAKER अर्जुन उवाच
      expect(blocks[0].type).toBe('SPEAKER');
      expect(blocks[0].speaker).toBe('अर्जुन उवाच');

      // Block 1: SHLOKA 4
      expect(blocks[1].type).toBe('SHLOKA');
      expect(blocks[1].lines.length).toBe(2);
      expect(blocks[1].lines[0]).toContain('कथं भीष्ममहं');

      // Block 2: ANUVAD 4
      expect(blocks[2].type).toBe('ANUVAD');
      expect(blocks[2].lines[0]).toContain('अर्जुन बोले');

      // Block 3: SHLOKA 5 (Tristup 4-pada verse unified, NOT split!)
      expect(blocks[3].type).toBe('SHLOKA');
      expect(blocks[3].lines.length).toBe(4);
      expect(blocks[3].lines[0]).toBe('गुरूनहत्वा हि महानुभावा-');
      expect(blocks[3].lines[1]).toBe('ञ्छ्रेयो भोक्तुं भैक्ष्यमपीह लोके ।');
      expect(blocks[3].lines[2]).toBe('हत्वार्थकामांस्तु गुरूनिहैव');
      expect(blocks[3].lines[3]).toContain('भुञ्जीय भोगान्रुधिरप्रदिग्धान्');

      // Block 4: ANUVAD 5
      expect(blocks[4].type).toBe('ANUVAD');
      expect(blocks[4].lines[0]).toContain('इसलिये इन महानुभाव गुरुजनोंको');

      // Block 5: SHLOKA 6 (Tristup 4-pada verse unified, NOT split!)
      expect(blocks[5].type).toBe('SHLOKA');
      expect(blocks[5].lines.length).toBe(4);
      expect(blocks[5].lines[0]).toBe('न चैतद्विद्मः कतरन्नो गरीयो-');
      expect(blocks[5].lines[1]).toBe('यद्वा जयेम यदि वा नो जयेयुः ।');
      expect(blocks[5].lines[2]).toBe('यानेव हत्वा न जिजीविषाम-');
      expect(blocks[5].lines[3]).toContain('स्तेऽवस्थिताः प्रमुखे धार्तराष्ट्राः');

      // Block 6: ANUVAD 6 (Cross-page start)
      expect(blocks[6].type).toBe('ANUVAD');
      expect(blocks[6].lines[0]).toContain('हम यह भी नहीं जानते कि');
    });

    it('accurately parses cross-page Hindi continuation and following verses on Page 15', () => {
      const page15Raw = `
है, अथवा यह भी नहीं जानते कि उन्हें हम जीतेंगे
या हमको वे जीतेंगे । और जिनको मारकर हम
जीना भी नहीं चाहते, वे ही हमारे आत्मीय
धृतराष्ट्रके पुत्र हमारे मुकाबलेमें खड़े हैं ॥ ६ ॥
कार्पण्यदोषोपहतस्वभावः
पृच्छामि त्वां धर्मसम्मूढचेताः ।
यच्छ्रेयः स्यान्निश्चितं ब्रूहि तन्मे
शिष्यस्तेऽहं शाधि मां त्वां प्रपन्नम् ॥
इसलिये कायरतारूप दोषसे उपहत हुए स्वभाववाला
तथा धर्मके विषयमें मोहितचित्त हुआ मैं आपसे पूछ्ता
हूँ कि जो साधन निश्चित कल्याणकारक हो, वह मेरे
लिये कहिये; क्योंकि मैं आपका शिष्य हूँ, इसलिये
आपके शरण हुए मुझको शिक्षा दीजिये ॥ ७ ॥
      `.trim();

      const blocks = parseGitaFolio(page15Raw);

      // Block 0: Anuvad 6 continuation
      expect(blocks[0].type).toBe('ANUVAD');
      expect(blocks[0].lines[0]).toContain('है, अथवा यह भी नहीं जानते');
      expect(blocks[0].lines[3]).toContain('॥ ६ ॥');

      // Block 1: Shloka 7 (4-line Tristup)
      expect(blocks[1].type).toBe('SHLOKA');
      expect(blocks[1].lines.length).toBe(4);
      expect(blocks[1].lines[0]).toBe('कार्पण्यदोषोपहतस्वभावः');
      expect(blocks[1].lines[3]).toContain('शिष्यस्तेऽहं शाधि मां त्वां प्रपन्नम्');

      // Block 2: Anuvad 7
      expect(blocks[2].type).toBe('ANUVAD');
      expect(blocks[2].lines[0]).toContain('इसलिये कायरतारूप दोषसे');
    });

    it('accurately parses Shloka 14 on Page 4 where स्यन्दने is Sanskrit Saptami and not Hindi', () => {
      const page4Raw = `
ततः शङ्खाश्च भेर्यश्च पणवानकगोमुखाः ।
सहसैवाभ्यहन्यन्त स शब्दस्तुमुलोऽभवत् ॥ १३ ॥
इसके पश्चात् शंख और नगारे तथा ढोल,
मृदंग और नरसिंघे आदि बाजे एक साथ ही बज
उठे । उनका वह शब्द बड़ा भयंकर हुआ ॥ १३ ॥
ततः श्वेतैर्हयैर्युक्ते महति स्यन्दने स्थितौ ।
माधवः पाण्डवश्चैव दिव्यौ शङ्खौ प्रदध्मतुः ॥ १४ ॥
इसके अनन्तर सफेद घोड़ोंसे युक्त उत्तम रथमें
बैठे हुए श्रीकृष्ण महाराज और अर्जुनने भी अलौकिक
शंख बजाये ॥ १४ ॥
      `.trim();

      const blocks = parseGitaFolio(page4Raw);

      // Block 0: Shloka 13
      expect(blocks[0].type).toBe('SHLOKA');
      expect(blocks[0].lines.length).toBe(2);

      // Block 1: Anuvad 13
      expect(blocks[1].type).toBe('ANUVAD');
      expect(blocks[1].lines[0]).toContain('इसके पश्चात् शंख');

      // Block 2: Shloka 14 (MUST BE UNIFIED SHLOKA, NOT SPLIT!)
      expect(blocks[2].type).toBe('SHLOKA');
      expect(blocks[2].lines.length).toBe(2);
      expect(blocks[2].lines[0]).toBe('ततः श्वेतैर्हयैर्युक्ते महति स्यन्दने स्थितौ ।');
      expect(blocks[2].lines[1]).toContain('माधवः पाण्डवश्चैव दिव्यौ शङ्खौ प्रदध्मतुः');

      // Block 3: Anuvad 14
      expect(blocks[3].type).toBe('ANUVAD');
      expect(blocks[3].lines[0]).toContain('इसके अनन्तर सफेद');
    });

    it('accurately attaches sequential verse number ॥ २२ ॥ to Shloka 22 on Page 19 when translation is on Page 20', () => {
      const page19Raw = `
न जायते म्रियते वा कदाचि-
न्नायं भूत्वा भविता वा न भूयः ।
अजो नित्यः शाश्वतोऽयं पुराणो-
न हन्यते हन्यमाने शरीरे ॥
यह आत्मा किसी कालमें भी न तो जन्मता है
और न मरता ही है तथा न यह उत्पन्न होकर फिर
होनेवाला ही है; क्योंकि यह अजन्मा, नित्य,
सनातन और पुरातन है; शरीरके मारे जानेपर भी
यह नहीं मारा जाता ॥ २० ॥
वेदाविनाशिनं नित्यं य एनमजमव्ययम् ।
कथं स पुरुषः पार्थ कं घातयति हन्ति कम् ॥
हे पृथापुत्र अर्जुन! जो पुरुष इस आत्माको नाशरहित,
नित्य, अजन्मा और अव्यय जानता है, वह पुरुष कैसे
किसको मरवाता है और कैसे किसको मारता है? ॥ २१ ॥
वासांसि जीर्णानि यथा विहाय
नवानि गृह्णाति नरोऽपराणि ।
तथा शरीराणि विहाय जीर्णा-
न्यन्यानि संयाति नवानि देही ॥
      `.trim();

      const blocks = parseGitaFolio(page19Raw);

      // Shloka 20: gets ॥ २० ॥ from translation
      expect(blocks[0].lines[3]).toContain('॥ २० ॥');

      // Shloka 21: gets ॥ २१ ॥ from translation
      expect(blocks[2].lines[1]).toContain('॥ २१ ॥');

      // Shloka 22 (at bottom of page): infers ॥ २२ ॥ sequentially!
      const lastShloka = blocks[blocks.length - 1];
      expect(lastShloka.type).toBe('SHLOKA');
      expect(lastShloka.lines[3]).toContain('॥ २२ ॥');
    });

    it('accurately parses Gita Page 24 Shloka 39 without generating fake shloka cards for footnote numbers 1 and 2', () => {
      const page24Raw = `
सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ ।
ततो युद्धाय युज्यस्व नैवं पापमवाप्स्यसि ॥ ३८ ॥
जय-पराजय, लाभ-हानि और सुख-दुःखको समान समझकर, उसके बाद युद्धके लिये तैयार हो जा; इस प्रकार युद्ध करनेसे तू पापको नहीं प्राप्त होगा ॥ ३८ ॥
एषा तेऽभिहिता साङ्ख्ये बुद्धिर्योगे त्विमां शृणु ।
बुद्ध्या युक्तो यया पार्थ कर्मबन्धं प्रहास्यसि ॥
हे पार्थ! यह बुद्धि तेरे लिये ज्ञानयोगके
1
विषयमें कही गयी और अब तू इसको कर्मयोगके
2
विषयमें सुन-जिस बुद्धिसे युक्त हुआ तू कर्मोंके 1-2 अध्याय 3 श्लोक 3 की टिप्पणीमें इसका विस्तार देखना चाहिये ।
      `.trim();

      const blocks = parseGitaFolio(page24Raw);

      // Block 0: Shloka 38
      expect(blocks[0].type).toBe('SHLOKA');
      expect(blocks[0].lines.length).toBe(2);
      expect(blocks[0].lines[0]).toBe('सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ ।');
      expect(blocks[0].lines[1]).toContain('॥ ३८ ॥');

      // Block 1: Anuvad 38
      expect(blocks[1].type).toBe('ANUVAD');
      expect(blocks[1].lines[0]).toContain('जय-पराजय, लाभ-हानि');

      // Block 2: Shloka 39 (MUST NOT be followed by fake shlokas 1 or 2!)
      expect(blocks[2].type).toBe('SHLOKA');
      expect(blocks[2].lines.length).toBe(2);
      expect(blocks[2].lines[0]).toBe('एषा तेऽभिहिता साङ्ख्ये बुद्धिर्योगे त्विमां शृणु ।');
      expect(blocks[2].lines[1]).toContain('बुद्ध्या युक्तो यया पार्थ कर्मबन्धं प्रहास्यसि ॥ ३९ ॥');

      // Block 3: Anuvad 39 (Single unified card containing the full translation + footnotes)
      expect(blocks[3].type).toBe('ANUVAD');
      expect(blocks[3].lines.join(' ')).toContain('हे पार्थ! यह बुद्धि तेरे लिये ज्ञानयोगके');
      expect(blocks[3].lines.join(' ')).toContain('विषयमें कही गयी और अब तू इसको कर्मयोगके');
      expect(blocks[3].lines.join(' ')).toContain('टिप्पणीमें इसका विस्तार देखना चाहिये');

      // Crucial: Total blocks must be 4, NO fake shlokas!
      expect(blocks.length).toBe(4);
      const shlokaBlocks = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokaBlocks.length).toBe(2);
    });

    it('classifies isolated footnote numbers, symbols and citation lines as HINDI and never SANSKRIT', () => {
      expect(classifyGitaScriptureLine('1')).toBe('HINDI');
      expect(classifyGitaScriptureLine('2')).toBe('HINDI');
      expect(classifyGitaScriptureLine('1-2')).toBe('HINDI');
      expect(classifyGitaScriptureLine('*')).toBe('HINDI');
      expect(classifyGitaScriptureLine('1-2 अध्याय 3 श्लोक 3 की टिप्पणीमें इसका विस्तार देखना चाहिये ।')).toBe('HINDI');
      expect(classifyGitaScriptureLine('एषा तेऽभिहिता साङ्ख्ये बुद्धिर्योगे त्विमां शृणु ।')).toBe('SANSKRIT');
      expect(classifyGitaScriptureLine('प्रकारकी निष्ठा')).toBe('HINDI');
      expect(classifyGitaScriptureLine('-क्षेमको')).toBe('HINDI');
      expect(classifyGitaScriptureLine('कामरूप दुर्जय शत्रुको मार डाल ॥ ४३ ॥')).toBe('HINDI');
      expect(classifyGitaScriptureLine('सरलतापूर्वक प्रश्न करनेसे वे परमात्मतत्त्वको')).toBe('HINDI');
    });

    it('accurately parses Gita Page 26 with NO fake shloka blocks for -क्षेमको or footnote numbers', () => {
      const page26Snippet = `
त्रैगुण्यविषया वेदा निस्त्रैगुण्यो भवार्जुन ।
निर्द्वन्द्वो नित्यसत्त्वस्थो निर्योगक्षेम आत्मवान् ॥ ४५ ॥
हे अर्जुन! वेद उपर्युक्त प्रकारसे तीनों गुणोंके कार्यरूप समस्त भोगों एवं उनके साधनोंका प्रतिपादन करनेवाले हैं; इसलिये तू उन भोगों एवं उनके साधनोंमें आसक्तिहीन, हर्ष-शोकादि द्वन्द्वोंसे
रहित, नित्यवस्तु परमात्मामें स्थित, योग
1
-क्षेमको
2 1. अप्राप्तकी प्राप्तिका नाम "योग" है । 2. प्राप्त वस्तुकी रक्षाका नाम "क्षेम" है ।
      `.trim();

      const blocks = parseGitaFolio(page26Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(1);
      expect(shlokas[0].lines[0]).toContain('त्रैगुण्यविषया वेदा');
      expect(shlokas[0].lines[1]).toContain('॥ ४५ ॥');

      const anuvads = blocks.filter(b => b.type === 'ANUVAD');
      expect(anuvads.length).toBe(1);
      expect(anuvads[0].lines.join(' ')).toContain('-क्षेमको');
    });

    it('accurately parses Gita Page 36 with NO fake shlokas for प्रकारकी निष्ठा or footnotes', () => {
      const page36Snippet = `
श्रीभगवानुवाच
लोकेऽस्मिन्द्विविधा निष्ठा पुरा प्रोक्ता मयानघ ।
ज्ञानयोगेन साङ्ख्यानां कर्मयोगेन योगिनाम् ॥
श्रीभगवान् बोले-हे निष्पाप! इस लोकमें दो
प्रकारकी निष्ठा
1
मेरेद्वारा पहले कही गयी है ।
उनमेंसे सांख्ययोगियोंकी निष्ठा तो ज्ञानयोगसे
2
और योगियोंकी निष्ठा कर्मयोगसे
3
होती है ॥ ३ ॥
1. साधनकी परिपक्व अवस्था अर्थात् पराकाष्ठाका नाम "निष्ठा" है ।
2. मायासे उत्पन्न हुए सम्पूर्ण गुण ही गुणोंमें बरतते हैं...
3. फल और आसक्तिको त्यागकर भगवदाज्ञानुसार केवल...
      `.trim();

      const blocks = parseGitaFolio(page36Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(1);
      expect(shlokas[0].lines[0]).toContain('लोकेऽस्मिन्द्विविधा निष्ठा');
      expect(shlokas[0].lines[1]).toContain('॥ ३ ॥');

      const anuvads = blocks.filter(b => b.type === 'ANUVAD');
      expect(anuvads.length).toBe(1);
      expect(anuvads[0].lines.join(' ')).toContain('प्रकारकी निष्ठा');
    });

    it('accurately parses Gita Page 37 with NO fake shlokas for सारा मनुष्यसमुदाय...', () => {
      const page37Snippet = `
न हि कश्चित्क्षणमपि जातु तिष्ठत्यकर्मकृत् ।
कार्यते ह्यवशः कर्म सर्वः प्रकृतिजैर्गुणैः ॥
निःसन्देह कोई भी मनुष्य किसी भी कालमें
क्षणमात्र भी बिना कर्म किये नहीं रहता; क्योंकि
सारा मनुष्यसमुदाय प्रकृतिजनित गुणोंद्वारा परवश
हुआ कर्म करनेके लिये बाध्य किया जाता है ॥ ५ ॥
      `.trim();

      const blocks = parseGitaFolio(page37Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(1);
      expect(shlokas[0].lines[0]).toContain('न हि कश्चित्क्षणमपि');
      expect(shlokas[0].lines[1]).toContain('॥ ५ ॥');

      const anuvads = blocks.filter(b => b.type === 'ANUVAD');
      expect(anuvads.length).toBe(1);
      expect(anuvads[0].lines.join(' ')).toContain('सारा मनुष्यसमुदाय प्रकृतिजनित गुणोंद्वारा परवश');
    });

    it('accurately parses Gita Page 48 with NO fake shlokas for कामरूप दुर्जय शत्रुको मार डाल and colophons', () => {
      const page48Snippet = `
एवं बुद्धेः परं बुद्ध्वा संस्तभ्यात्मानमात्मना ।
जहि शत्रुं महाबाहो कामरूपं दुरासदम् ॥
इस प्रकार बुद्धिसे पर अर्थात् सूक्ष्म, बलवान्
और अत्यन्त श्रेष्ठ आत्माको जानकर और बुद्धिके
द्वारा मनको वशमें करके हे महाबाहो! तू इस
कामरूप दुर्जय शत्रुको मार डाल ॥ ४३ ॥
ॐ तत्सदिति श्रीमद्भगवद्गीतासूपनिषत्सु ब्रह्मविद्यायां
योगशास्त्रे श्रीकृष्णार्जुनसंवादे कर्मयोगो
नाम तृतीयोऽध्यायः ॥ ३ ॥
      `.trim();

      const blocks = parseGitaFolio(page48Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(1);
      expect(shlokas[0].lines[0]).toContain('एवं बुद्धेः परं बुद्ध्वा');
      expect(shlokas[0].lines[1]).toContain('॥ ४३ ॥');

      const anuvads = blocks.filter(b => b.type === 'ANUVAD');
      expect(anuvads.length).toBe(1);
      expect(anuvads[0].lines.join(' ')).toContain('कामरूप दुर्जय शत्रुको मार डाल ॥ ४३ ॥');

      const headings = blocks.filter(b => b.type === 'HEADING');
      expect(headings.length).toBe(3);
    });

    it('accurately parses Gita Page 59 with NO fake shlokas for सरलतापूर्वक प्रश्न करनेसे...', () => {
      const page59Snippet = `
तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया ।
उपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस्तत्त्वदर्शिनः ॥
उस ज्ञानको तू तत्त्वदर्शी ज्ञानियोंके पास जाकर समझ,
उनको भलीभाँति दण्डवत्-प्रणाम करनेसे, उनकी सेवा करनेसे
और कपट छोड़कर सरलतापूर्वक प्रश्न करनेसे वे परमात्मतत्त्वको
भलीभाँति जाननेवाले ज्ञानी महात्मा तुझको उस तत्त्वज्ञानका उपदेश करेंगे ॥ ३४ ॥
      `.trim();

      const blocks = parseGitaFolio(page59Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(1);
      expect(shlokas[0].lines[0]).toContain('तद्विद्धि प्रणिपातेन');
      expect(shlokas[0].lines[1]).toContain('॥ ३४ ॥');

      const anuvads = blocks.filter(b => b.type === 'ANUVAD');
      expect(anuvads.length).toBe(1);
      expect(anuvads[0].lines.join(' ')).toContain('सरलतापूर्वक प्रश्न करनेसे');
    });

    it('accurately parses Gita Page 79 with healed चञ्चल and कल्मष ligatures', () => {
      const page79Snippet = `
यतो यतो निश्चरति मनश्चञ्चलमस्थिरम् ।
ततस्ततो नियम्यैतदात्मन्येव वशं नयेत् ॥
यह स्थिर न रहनेवाला और चञ्चल मन जिस-जिस शब्दादि विषयके निमित्तसे संसारमें विचरता है, उस-उस विषयसे रोककर यानी हटाकर इसे बार-बार परमात्मामें ही निरुद्ध करे ॥ २६ ॥
प्रशान्तमनसं ह्येनं योगिनं सुखमुत्तमम् ।
उपैति शान्तरजसं ब्रह्मभूतमकल्मषम् ॥
क्योंकि जिसका मन भली प्रकार शान्त है, जो पापसे रहित है और जिसका रजोगुण शान्त हो गया है, ऐसे इस सच्चिदानन्दघन ब्रह्मके साथ एकीभाव हुए योगीको उत्तम आनन्द प्राप्त होता है ॥ २७ ॥
      `.trim();

      const blocks = parseGitaFolio(page79Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(2);
      expect(shlokas[0].lines[0]).toContain('मनश्चञ्चलमस्थिरम्');
      expect(shlokas[0].lines[1]).toContain('॥ २६ ॥');
      expect(shlokas[1].lines[0]).toContain('प्रशान्तमनसं ह्येनं');
      expect(shlokas[1].lines[1]).toContain('ब्रह्मभूतमकल्मषम् ॥ २७ ॥');
    });

    it('accurately parses Gita Page 81 with चञ्चलत्वात् and चञ्चलं हि मनः कृष्ण', () => {
      const page81Snippet = `
अर्जुन उवाच
योऽयं योगस्त्वया प्रोक्तः साम्येन मधुसूदन ।
एतस्याहं न पश्यामि चञ्चलत्वात्स्थितिं स्थिराम् ॥
अर्जुन बोले-हे मधुसूदन! जो यह योग आपने समभावसे कहा है, मनके चञ्चल होनेसे मैं इसकी नित्य स्थितिको नहीं देखता हूँ ॥ ३३ ॥
चञ्चलं हि मनः कृष्ण प्रमाथि बलवद्दृढम् ।
तस्याहं निग्रहं मन्ये वायोरिव सुदुष्करम् ॥
क्योंकि हे श्रीकृष्ण! यह मन बड़ा चञ्चल, प्रमथन स्वभाववाला, बड़ा दृढ़ और बलवान् है । इसलिये उसका वशमें करना मैं वायुको रोकनेकी भाँति अत्यन्त दुष्कर मानता हूँ ॥ ३४ ॥
      `.trim();

      const blocks = parseGitaFolio(page81Snippet);
      const speakers = blocks.filter(b => b.type === 'SPEAKER');
      expect(speakers.length).toBe(1);
      expect(speakers[0].speaker).toContain('अर्जुन उवाच');

      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(2);
      expect(shlokas[0].lines[0]).toContain('योऽयं योगस्त्वया प्रोक्तः');
      expect(shlokas[0].lines[1]).toContain('चञ्चलत्वात्स्थितिं स्थिराम् ॥ ३३ ॥');
      expect(shlokas[1].lines[0]).toContain('चञ्चलं हि मनः कृष्ण');
      expect(shlokas[1].lines[1]).toContain('वायोरिव सुदुष्करम् ॥ ३४ ॥');
    });

    it('accurately parses Gita Page 85 with प्रयत्न and किल्बिष healed', () => {
      const page85Snippet = `
प्रयत्नाद्यतमानस्तु योगी संशुद्धकिल्बषः ।
अनेकजन्मसंसिद्धस्ततो याति परां गतिम् ॥
परन्तु प्रयत्नपूर्वक अभ्यास करनेवाला योगी तो पिछले अनेक जन्मोंके संस्कारबलसे इसी जन्ममें संसिद्ध होकर सम्पूर्ण पापोंसे रहित हो फिर तत्काल ही परमगतिको प्राप्त हो जाता है ॥ ४५ ॥
      `.trim();

      const blocks = parseGitaFolio(page85Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(1);
      expect(shlokas[0].lines[0]).toContain('प्रयत्नाद्यतमानस्तु योगी संशुद्धकिल्बषः');
      expect(shlokas[0].lines[1]).toContain('परां गतिम् ॥ ४५ ॥');
    });

    it('accurately parses Gita Page 90 preserving Shloka 14 with both padas (मामेव ये प्रपद्यन्ते...)', () => {
      const page90Snippet = `
त्रिभिर्गुणमयैर्भावैरेभिः सर्वमिदं जगत् ।
मोहितं नाभिजानाति मामेभ्यः परमव्ययम् ॥
गुणोंके कार्यरूप सात्त्विक, राजस और तामस- इन तीनों प्रकारके भावोंसे यह सारा संसार मोहित हो रहा है, इसीलिये इन तीनों गुणोंसे परे मुझ अविनाशीको नहीं जानता ॥ १३ ॥
दैवी ह्येषा गुणमयी मम माया दुरत्यया ।
मामेव ये प्रपद्यन्ते मायामेतां तरन्ति ते ॥
क्योंकि यह अलौकिक अर्थात् अति अद्भुत त्रिगुणमयी मेरी माया बड़ी दुस्तर है; परन्तु जो पुरुष केवल मुझको ही निरन्तर भजते हैं, वे इस मायाको उल्लङ्घन कर जाते हैं अर्थात् संसारसे तर जाते हैं ॥ १४ ॥
      `.trim();

      const blocks = parseGitaFolio(page90Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(2);

      // Shloka 13
      expect(shlokas[0].lines.length).toBe(2);
      expect(shlokas[0].lines[0]).toContain('त्रिभिर्गुणमयैर्भावैरेभिः');
      expect(shlokas[0].lines[1]).toContain('मामेभ्यः परमव्ययम् ॥ १३ ॥');

      // Shloka 14 must have BOTH lines, not swallowed into Hindi
      expect(shlokas[1].lines.length).toBe(2);
      expect(shlokas[1].lines[0]).toContain('दैवी ह्येषा गुणमयी मम माया दुरत्यया ।');
      expect(shlokas[1].lines[1]).toContain('मामेव ये प्रपद्यन्ते मायामेतां तरन्ति ते ॥ १४ ॥');

      const anuvads = blocks.filter(b => b.type === 'ANUVAD');
      expect(anuvads.length).toBe(2);
      expect(anuvads[1].lines.join(' ')).not.toContain('मामेव ये प्रपद्यन्ते');
      expect(anuvads[1].lines.join(' ')).toContain('क्योंकि यह अलौकिक');
    });

    it('accurately parses Gita Page 94 preserving Shlokas 29 and 30 with both padas containing "ये"', () => {
      const page94Snippet = `
येषां त्वन्तगतं पापं जनानां पुण्यकर्मणाम् ।
ते द्वन्द्वमोहनिर्मुक्ता भजन्ते मां दृढव्रताः ॥
परन्तु निष्कामभावसे श्रेष्ठ कर्मोंका आचरण करनेवाले जिन पुरुषोंका पाप नष्ट हो गया है, वे राग-द्वेषजनित द्वन्द्वरूप मोहसे मुक्त दृढ़निश्चयी भक्त मुझको सब प्रकारसे भजते हैं ॥ २८ ॥
जरामरणमोक्षाय मामाश्रित्य यतन्ति ये ।
ते ब्रह्म तद्विदुः कृत्स्नमध्यात्मं कर्म चाखिलम् ॥
जो मेरे शरण होकर जरा और मरणसे छूटनेके लिये यत्न करते हैं, वे पुरुष उस ब्रह्मको, सम्पूर्ण अध्यात्मको, सम्पूर्ण कर्मको जानते हैं ॥ २९ ॥
साधिभूताधिदैवं मां साधियज्ञं च ये विदुः ।
प्रयाणकालेऽपि च मां ते विदुर्युक्तचेतसः ॥
जो पुरुष अधिभूत और अधिदैवके सहित तथा अधियज्ञके सहित मुझको अन्तकालमें भी जानते हैं, वे युक्तचित्तवाले पुरुष मुझे ही प्राप्त होते हैं ॥ ३० ॥
      `.trim();

      const blocks = parseGitaFolio(page94Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(3);

      // Shloka 28
      expect(shlokas[0].lines.length).toBe(2);
      expect(shlokas[0].lines[0]).toContain('येषां त्वन्तगतं पापं');
      expect(shlokas[0].lines[1]).toContain('॥ २८ ॥');

      // Shloka 29
      expect(shlokas[1].lines.length).toBe(2);
      expect(shlokas[1].lines[0]).toContain('जरामरणमोक्षाय मामाश्रित्य यतन्ति ये ।');
      expect(shlokas[1].lines[1]).toContain('ते ब्रह्म तद्विदुः कृत्स्नमध्यात्मं कर्म चाखिलम् ॥ २९ ॥');

      // Shloka 30
      expect(shlokas[2].lines.length).toBe(2);
      expect(shlokas[2].lines[0]).toContain('साधिभूताधिदैवं मां साधियज्ञं च ये विदुः ।');
      expect(shlokas[2].lines[1]).toContain('प्रयाणकालेऽपि च मां ते विदुर्युक्तचेतसः ॥ ३० ॥');

      const anuvads = blocks.filter(b => b.type === 'ANUVAD');
      expect(anuvads.length).toBe(3);
      expect(anuvads[0].lines.join(' ')).not.toContain('जरामरणमोक्षाय');
      expect(anuvads[1].lines.join(' ')).not.toContain('साधिभूताधिदैवं');
    });

    it('accurately parses Gita Page 100 preserving Shloka 18 with both padas (तत्रैवाव्यक्तसञ्ज्ञके)', () => {
      const page100Snippet = `
अव्यक्ताद्व्यक्तयः सर्वाः प्रभवन्त्यहरागमे ।
रात्र्यागमे प्रलीयन्ते तत्रैवाव्यक्तसञ्ज्ञके ॥
सम्पूर्ण चराचर भूतगण ब्रह्माके दिनके प्रवेशकालमें अव्यक्तसे अर्थात् ब्रह्माके सूक्ष्म शरीरसे उत्पन्न होते हैं और ब्रह्माकी रातके प्रवेशकालमें उस अव्यक्तनामक ब्रह्माके सूक्ष्म शरीरमें ही लीन होते हैं ॥ १८ ॥
      `.trim();

      const blocks = parseGitaFolio(page100Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(1);
      expect(shlokas[0].lines.length).toBe(2);
      expect(shlokas[0].lines[0]).toContain('अव्यक्ताद्व्यक्तयः सर्वाः प्रभवन्त्यहरागमे ।');
      expect(shlokas[0].lines[1]).toContain('रात्र्यागमे प्रलीयन्ते तत्रैवाव्यक्तसञ्ज्ञके ॥ १८ ॥');

      const anuvads = blocks.filter(b => b.type === 'ANUVAD');
      expect(anuvads.length).toBe(1);
      expect(anuvads[0].lines.join(' ')).not.toContain('रात्र्यागमे');
    });

    it('accurately parses Gita Page 110 half-verse without premature extrapolation', () => {
      const page110Snippet = `
तपाम्यहमहं वर्षं निगृह्णाम्युत्सृजामि च ।
अमृतं चैव मृत्युश्च सदसच्चाहमर्जुन ॥
मैं ही सूर्यरूपसे तपता हूँ, वर्षाका आकर्षण करता हूँ और उसे बरसाता हूँ। हे अर्जुन! मैं ही अमृत और मृत्यु हूँ और सत्-असत् भी मैं ही हूँ ॥ १९ ॥
त्रैविद्या मां सोमपाः पूतपापा-
यज्ञैरिष्ट्वा स्वर्गतिं प्रार्थयन्ते ।
1. गीता अध्याय 13 श्लोक 12 से 17 तकमें देखना चाहिये ।
2. प्रलयकालमें सम्पूर्ण भूत सूक्ष्मरूपसे जिसमें लय होते हैं, उसका नाम "निधान" है ।
      `.trim();

      const blocks = parseGitaFolio(page110Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(2);

      // Shloka 19 is complete with ॥ १९ ॥
      expect(shlokas[0].lines.length).toBe(2);
      expect(shlokas[0].lines[1]).toContain('॥ १९ ॥');

      // Shloka 20 half-verse ends with single danda and NO premature verse number
      expect(shlokas[1].lines.length).toBe(2);
      expect(shlokas[1].lines[1]).toBe('यज्ञैरिष्ट्वा स्वर्गतिं प्रार्थयन्ते ।');
      expect(shlokas[1].lines[1]).not.toContain('॥ १९ ॥');
      expect(shlokas[1].lines[1]).not.toContain('॥ २० ॥');
    });

    it('accurately parses Gita Page 130 preserving Shloka 8 (न तु मां शक्यसे द्रष्टुमनेनैव स्वचक्षुषा)', () => {
      const page130Snippet = `
इहैकस्थं जगत्कृत्स्नं पश्याद्य सचराचरम् ।
मम देहे गुडाकेश यच्चान्यद्द्रष्टुमिच्छसि ॥
हे अर्जुन! अब इस मेरे शरीरमें एक जगह स्थित चराचरसहित सम्पूर्ण जगत्को देख तथा और भी जो कुछ देखना चाहता हो सो देख ॥ ७ ॥
न तु मां शक्यसे द्रष्टुमनेनैव स्वचक्षुषा ।
दिव्यं ददामि ते चक्षुः पश्य मे योगमैश्वरम् ॥
परन्तु मुझको तू इन अपने प्राकृत नेत्रोंद्वारा देखनेमें निःसन्देह समर्थ नहीं है; इसीसे मैं तुझको दिव्य अर्थात् अलौकिक चक्षु देता हूँ; इससे तू मेरी ईश्वरीय योगशक्तिको देख ॥ ८ ॥
निद्राको जीतनेवाला होनेसे अर्जुनका नाम "गुडाकेश" हुआ था ।
      `.trim();

      const blocks = parseGitaFolio(page130Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(2);

      // Shloka 7
      expect(shlokas[0].lines.length).toBe(2);
      expect(shlokas[0].lines[0]).toContain('इहैकस्थं जगत्कृत्स्नं');
      expect(shlokas[0].lines[1]).toContain('॥ ७ ॥');

      // Shloka 8
      expect(shlokas[1].lines.length).toBe(2);
      expect(shlokas[1].lines[0]).toContain('न तु मां शक्यसे द्रष्टुमनेनैव स्वचक्षुषा ।');
      expect(shlokas[1].lines[1]).toContain('दिव्यं ददामि ते चक्षुः पश्य मे योगमैश्वरम् ॥ ८ ॥');

      const anuvads = blocks.filter(b => b.type === 'ANUVAD');
      expect(anuvads.length).toBe(2);
      expect(anuvads[0].lines.join(' ')).not.toContain('न तु मां शक्यसे');
    });

    it('accurately parses Gita Page 134 preserving 4-line Shloka 20 starting with (द्यावापृथिव्योरिदमन्तरं हि)', () => {
      const page134Snippet = `
अनादिमध्यान्तमनन्तवीर्य-
मनन्तबाहुं शशिसूर्यनेत्रम् ।
पश्यामि त्वां दीप्तहुताशवक्त्रं-
स्वतेजसा विश्वमिदं तपन्तम् ॥
आपको आदि, अन्त और मध्यसे रहित, अनन्त सामर्थ्यसे युक्त, अनन्त भुजावाले, चन्द्र-सूर्यरूप नेत्रोंवाले, प्रज्वलित अग्निरूप मुखवाले और अपने तेजसे इस जगत्को संतप्त करते हुए देखता हूँ ॥ १९ ॥
द्यावापृथिव्योरिदमन्तरं हि
व्याप्तं त्वयैकेन दिशश्च सर्वाः ।
दृष्ट्वाद्भुतं रूपमुग्रं तवेदं-
लोकत्रयं प्रव्यथितं महात्मन् ॥
हे महात्मन्! यह स्वर्ग और पृथ्वीके बीचका सम्पूर्ण आकाश तथा सब दिशाएँ एक आपसे ही परिपूर्ण हैं तथा आपके इस अलौकिक और भयंकर रूपको देखकर तीनों लोक अति व्यथाको प्राप्त हो रहे हैं ॥ २० ॥
      `.trim();

      const blocks = parseGitaFolio(page134Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(2);

      // Shloka 19
      expect(shlokas[0].lines.length).toBe(4);
      expect(shlokas[0].lines[3]).toContain('॥ १९ ॥');

      // Shloka 20
      expect(shlokas[1].lines.length).toBe(4);
      expect(shlokas[1].lines[0]).toContain('द्यावापृथिव्योरिदमन्तरं हि');
      expect(shlokas[1].lines[1]).toContain('व्याप्तं त्वयैकेन दिशश्च सर्वाः ।');
      expect(shlokas[1].lines[2]).toContain('दृष्ट्वाद्भुतं रूपमुग्रं तवेदं-');
      expect(shlokas[1].lines[3]).toContain('लोकत्रयं प्रव्यथितं महात्मन् ॥ २० ॥');

      const anuvads = blocks.filter(b => b.type === 'ANUVAD');
      expect(anuvads.length).toBe(2);
      expect(anuvads[0].lines.join(' ')).not.toContain('द्यावापृथिव्योरिदमन्तरं');
    });

    it('correctly recognizes Sanskrit locative चान्तिके in Shloka 13.15 and does not dump line into Hindi translation', () => {
      const page170Snippet = `
वह संसारमें सबको व्याप्त करके स्थित है
1
॥ १३ ॥
सर्वेन्द्रियगुणाभासं सर्वेन्द्रियविवर्जितम् ।
असक्तं सर्वभृच्चैव निर्गुणं गुणभोक्तृ च ॥
वह सम्पूर्ण इन्द्रियोंके विषयोंको जाननेवाला है, परन्तु वास्तवमें सब इन्द्रियोंसे रहित है तथा आसक्ति-रहित होनेपर भी सबका धारण-पोषण करनेवाला और निर्गुण होनेपर भी गुणोंको भोगनेवाला है ॥ १४ ॥
बहिरन्तश्च भूतानामचरं चरमेव च ।
सूक्ष्मत्वात्तदविज्ञेयं दूरस्थं चान्तिके च तत् ॥
वह चराचर सब भूतोंके बाहर-भीतर परिपूर्ण है और चर-अचर भी वही है ॥ १५ ॥
      `.trim();

      const blocks = parseGitaFolio(page170Snippet);
      const shlokas = blocks.filter(b => b.type === 'SHLOKA');
      expect(shlokas.length).toBe(2);

      // Shloka 14
      expect(shlokas[0].lines.length).toBe(2);
      expect(shlokas[0].lines[0]).toContain('सर्वेन्द्रियगुणाभासं');
      expect(shlokas[0].lines[1]).toContain('असक्तं सर्वभृच्चैव');

      // Shloka 15
      expect(shlokas[1].lines.length).toBe(2);
      expect(shlokas[1].lines[0]).toContain('बहिरन्तश्च भूतानामचरं चरमेव च ।');
      expect(shlokas[1].lines[1]).toContain('सूक्ष्मत्वात्तदविज्ञेयं दूरस्थं चान्तिके च तत् ॥ १५ ॥');

      // Standalone ॥ १३ ॥ should not create a fake heading
      const headings = blocks.filter(b => b.type === 'HEADING');
      expect(headings.length).toBe(0);

      // Hindi translation of 15 should NOT contain Sanskrit line 2
      const anuvads = blocks.filter(b => b.type === 'ANUVAD');
      expect(anuvads.length).toBe(3);
      expect(anuvads[2].lines.join(' ')).not.toContain('सूक्ष्मत्वात्तदविज्ञेयं');
      expect(anuvads[2].lines.join(' ')).toContain('वह चराचर सब भूतोंके बाहर-भीतर परिपूर्ण है');
    });
  });
});


