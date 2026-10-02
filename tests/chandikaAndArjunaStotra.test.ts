import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getScriptureAudioTrack,
  DURGA_SAPTASHLOKI_AUDIO_TRACKS,
  ARJUNA_DURGA_AUDIO_TRACKS,
} from '../src/data/durgaSaptashatiAudio.js';
import { EXPANDED_DEVI_STOTRAS } from '../src/data/stotras/deviStotras.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('सप्तश्लोकी दुर्गा, सम्पूर्ण तीव्रचण्डिकास्तोत्रम् एवं अर्जुनकृत दुर्गास्तोत्रम् Suite', () => {
  it('१. श्रीदुर्गासप्तश्लोकी: पृथक् ग्रन्थ, ७ मूल मन्त्र एवं प्रामाणिक ऑडियो', () => {
    const filePath = path.join(ROOT_DIR, 'public', 'data', 'books', 'granth-durga-saptashloki.json');
    expect(fs.existsSync(filePath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(data.book.id).toBe('granth-durga-saptashloki');
    expect(data.book.title).toContain('श्रीदुर्गासप्तश्लोकी');
    expect(data.pages.length).toBe(1);

    const text = data.pages[0].verified_text;
    expect(text).toContain('शिव उवाच —');
    expect(text).toContain('देवि त्वं भक्तसुलभे सर्वकार्यविधायिनी');
    expect(text).toContain('ज्ञानिनामपि चेतांसि देवी भगवती हि सा');
    expect(text).toContain('दुर्गे स्मृता हरसि भीतिमशेषजन्तोः');
    expect(text).toContain('सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके');
    expect(text).toContain('शरणागतदीनार्तपरित्राणपरायणे');
    expect(text).toContain('सर्वस्वरूपे सर्वेशे सर्वशक्तिसमन्विते');
    expect(text).toContain('रोगानशेषानपहंसि तुष्टा');
    expect(text).toContain('सर्वाबाधाप्रशमनं त्रैलोक्यस्याखिलेश्वरि');
    expect(text).toContain('॥ इति श्रीसप्तश्लोकी दुर्गा सम्पूर्णा ॥');

    // Audio verification
    const audioTrack = getScriptureAudioTrack('granth-durga-saptashloki', 1);
    expect(audioTrack).toBeDefined();
    expect(audioTrack?.audioUrl).toContain('22%20Anubandam-1-Durga%20Saptashloki.mp3');
    expect(audioTrack?.durationLabel).toBe('०२:४४');
  });

  it('२. श्रीचण्डिकास्तोत्रम्: मार्कण्डेयपुराणोक्त सम्पूर्ण १२ श्लोक, ध्यान व फलश्रुति', () => {
    const filePath = path.join(ROOT_DIR, 'public', 'data', 'books', 'granth-chandika-stotram.json');
    expect(fs.existsSync(filePath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(data.book.id).toBe('granth-chandika-stotram');
    expect(data.book.title).toContain('तीव्रचण्डिकास्तोत्रम्');
    expect(data.pages.length).toBe(1);

    const text = data.pages[0].verified_text;
    // Dhyana & Shloka 1
    expect(text).toContain('चामुण्डा प्रेतगा विकृता चाऽहिभूषणा');
    expect(text).toContain('या देवी खड्गहस्ता सकलजनपदव्यापिनी विश्वदुर्गा');
    expect(text).toContain('सा देवी दिव्यमूर्तिः प्रदहतु दुरितं चण्डमुण्डा प्रचण्डा ॥ १ ॥');

    // Shlokas 2 - 8
    expect(text).toContain('ॐ ह्रां ह्रीं ह्रूं चर्ममुण्डे शवगमनहते भीषणे भीमवक्त्रे');
    expect(text).toContain('ॐ ह्रां ह्रीं ह्रूं रुद्ररूपे त्रिभुवननमिते पाशहस्ते त्रिनेत्रे');
    expect(text).toContain('लां लीं लूं लम्बजिह्वे हसति कहकहाशुद्ध घोराट्टहासैः');
    expect(text).toContain('ॐ घ्रां घ्रीं घ्रूं घोररूपे');
    expect(text).toContain('ॐ भ्रां भ्रीं भ्रूं चण्डवर्गे हरिहरनमिते');
    expect(text).toContain('ॐ खं खं खं खड्गहस्ते वरकनकनिभे सूर्यकान्ते');
    expect(text).toContain('ॐ हुं हुं हुं फट् कालरात्रिः');
    expect(text).toContain('ॐ भृङ्गी कालीकपाली परिजनसहिते');

    // Shlokas 9 - 12
    expect(text).toContain('उच्चैशैत्याट्टहासैः घरुघरितरवा त्वं चण्डमुण्डा प्रचण्डा ॥ ९ ॥');
    expect(text).toContain('ॐ त्वं ब्राह्मी त्वं च रौद्री');
    expect(text).toContain('नमस्ते नमस्ते नमः ॐ रक्ष त्वं मुण्डधारी');
    expect(text).toContain('इत्येवं बीजमन्त्रैः स्तवनमति शिवं पातकं व्याधिनाशं');
    expect(text).toContain('मन्त्राणां स्तोत्रकं यः पठति स लभते प्रार्थितां मन्त्रसिद्धिम् ॥ १२ ॥');
    expect(text).toContain('॥ इति श्रीमार्कण्डेयपुराणोक्तं तीव्रचण्डिकास्तोत्रं सम्पूर्णम् ॥');
  });

  it('३. श्रीअर्जुनकृत दुर्गास्तोत्रम् (महाभारत भीष्मपर्व अध्याय २३): २६ श्लोक व ऑडियो', () => {
    const filePath = path.join(ROOT_DIR, 'public', 'data', 'books', 'granth-arjuna-durga-stuti.json');
    expect(fs.existsSync(filePath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(data.book.id).toBe('granth-arjuna-durga-stuti');
    expect(data.pages.length).toBe(1);

    const text = data.pages[0].verified_text;
    expect(text).toContain('॥ श्रीअर्जुनकृतं दुर्गास्तोत्रम् ॥');
    expect(text).toContain('भीष्मपर्वणि त्रयोविंशोऽध्यायः');
    expect(text).toContain('श्रीभगवानुवाच —');
    expect(text).toContain('शुचिर्भूत्वा महाबाहो संग्रामाभिमुखे स्थितः');
    expect(text).toContain('पराजयाय शत्रूणां दुर्गास्तोत्रमुदीरय');
    expect(text).toContain('॥ अर्जुन उवाच ॥');
    expect(text).toContain('नमस्ते सिद्धसेनानि आर्ये मन्दरवासिनि');
    expect(text).toContain('भद्रकालि नमस्तुभ्यं महाकालि नमोऽस्तु ते');
    expect(text).toContain('देव्युवाच —');
    expect(text).toContain('स्वल्पेनैव तु कालेन शत्रूञ्जेष्यसि पाण्डव');
    expect(text).toContain('यतो धर्मस्ततः कृष्णो यतः कृष्णस्ततो जयः');

    // Audio verification
    const audioTrack = getScriptureAudioTrack('granth-arjuna-durga-stuti', 1);
    expect(audioTrack).toBeDefined();
    expect(audioTrack?.audioUrl).toContain('23%20Anubandam-2-Durga%20Suktham%20Devi.mp3');
    expect(audioTrack?.durationLabel).toBe('०१:५६');
  });

  it('४. Stotra Darshan Registry: तीनों स्तोत्र पृथक्-पृथक् रूप से उपलब्ध होने चाहिए', () => {
    const saptashloki = EXPANDED_DEVI_STOTRAS.find((s) => s.id === 'supp-durga-saptashloki');
    expect(saptashloki).toBeDefined();
    expect(saptashloki?.title).toContain('श्रीदुर्गासप्तश्लोकी');

    const chandika = EXPANDED_DEVI_STOTRAS.find((s) => s.id === 'supp-chandika-stotram');
    expect(chandika).toBeDefined();
    expect(chandika?.title).toContain('तीव्रचण्डिकास्तोत्रम्');

    const arjuna = EXPANDED_DEVI_STOTRAS.find((s) => s.id === 'supp-arjuna-durga-stuti');
    expect(arjuna).toBeDefined();
    expect(arjuna?.title).toContain('श्रीअर्जुनकृत दुर्गास्तोत्रम्');
  });
});
