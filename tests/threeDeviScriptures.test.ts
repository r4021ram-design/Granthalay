import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getScriptureAudioTrack,
  SRI_SUKTAM_AUDIO_TRACKS,
  KANAKADHARA_AUDIO_TRACKS,
  SAUNDARYA_LAHARI_AUDIO_TRACKS
} from '../src/data/durgaSaptashatiAudio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('त्रिविध देवी ग्रन्थ (श्रीसूक्तम्, कनकधारा, सौन्दर्यलहरी) Verification Suite', () => {
  it('१. श्रीसूक्तम्: should verify JSON, 16 Vedic mantras with accents, and master audio track', () => {
    const filePath = path.join(ROOT_DIR, 'public', 'data', 'books', 'granth-sri-suktam.json');
    expect(fs.existsSync(filePath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(data.book.id).toBe('granth-sri-suktam');
    expect(data.book.page_count).toBe(1);
    expect(data.pages.length).toBe(1);

    const pageText = data.pages[0].verified_text;
    expect(pageText).toContain('हिर॑ण्यवर्णां॒');
    expect(pageText).toContain('जात॑वेदो म॒ आव॑ह');
    expect(pageText).toContain('॥ फलश्रुतिः ॥');
    expect(pageText).toContain('॥ इति ऋग्वेदीयं श्रीसूक्तं सम्पूर्णम् ॥');

    // Audio verification
    const audioTrack = getScriptureAudioTrack('granth-sri-suktam', 1);
    expect(audioTrack).toBeDefined();
    expect(audioTrack?.audioUrl).toContain('Sri%20Suktam.mp3');
    expect(audioTrack?.durationLabel).toBe('११:४४');
  });

  it('२. कनकधारा स्तोत्रम्: should verify JSON, complete 21 Vasantatilaka shlokas, and master audio track', () => {
    const filePath = path.join(ROOT_DIR, 'public', 'data', 'books', 'granth-kanakadhara-stotram.json');
    expect(fs.existsSync(filePath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(data.book.id).toBe('granth-kanakadhara-stotram');
    expect(data.book.page_count).toBe(1);
    expect(data.pages.length).toBe(1);

    const pageText = data.pages[0].verified_text;
    expect(pageText).toContain('अङ्गं हरेः पुलकभूषणमाश्रयन्ती');
    expect(pageText).toContain('दद्याद्दयानुपवनो द्रविणाम्बुधारां');
    expect(pageText).toContain('गीर्देवतेति गरुडध्वजसुन्दरीति');
    expect(pageText).toContain('कनकधारास्तोत्रं सम्पूर्णम्');

    // Audio verification
    const audioTrack = getScriptureAudioTrack('granth-kanakadhara-stotram', 1);
    expect(audioTrack).toBeDefined();
    expect(audioTrack?.audioUrl).toContain('Sri%20Kanakadhara%20Stotram');
    expect(audioTrack?.durationLabel).toBe('०९:२७');
  });

  it('३. सौन्दर्यलहरी: should verify 2 dedicated pages (1-41 Ananda Lahari, 42-100 Saundarya Lahari) and audio', () => {
    const filePath = path.join(ROOT_DIR, 'public', 'data', 'books', 'granth-saundarya-lahari.json');
    expect(fs.existsSync(filePath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(data.book.id).toBe('granth-saundarya-lahari');
    expect(data.book.page_count).toBe(2);
    expect(data.pages.length).toBe(2);

    // Page 1: Anandalahari (1-41)
    const p1 = data.pages[0];
    expect(p1.page_number).toBe(1);
    expect(p1.verified_text).toContain('शिवः शक्त्या युक्तो यदि भवति शक्तः प्रभवितुं');
    expect(p1.verified_text).toContain('तवाधारे मूले सह समयया लास्यपरया');
    expect(p1.verified_text).toContain('आनन्दलहरी सम्पूर्णा');

    // Page 2: Saundaryalahari (42-100)
    const p2 = data.pages[1];
    expect(p2.page_number).toBe(2);
    expect(p2.verified_text).toContain('गतैर्माणिक्यत्वं गगनमणिभिः सान्द्रघटितं');
    expect(p2.verified_text).toContain('प्रदीपज्वालाभिर्दिवसकरनीराजनविधिः');
    expect(p2.verified_text).toContain('सौन्दर्यलहरी सम्पूर्णा');

    // Audio verification for both pages
    const audioP1 = getScriptureAudioTrack('granth-saundarya-lahari', 1);
    expect(audioP1).toBeDefined();
    expect(audioP1?.durationLabel).toBe('२७:३०');

    const audioP2 = getScriptureAudioTrack('granth-saundarya-lahari', 2);
    expect(audioP2).toBeDefined();
    expect(audioP2?.durationLabel).toBe('४०:००');
  });

  it('४. Catalog: should have all 3 entries present in public/data/books.json', () => {
    const catPath = path.join(ROOT_DIR, 'public', 'data', 'books.json');
    const catalog = JSON.parse(fs.readFileSync(catPath, 'utf-8'));

    const sriSuktam = catalog.find((b: any) => b.id === 'granth-sri-suktam');
    const kanakadhara = catalog.find((b: any) => b.id === 'granth-kanakadhara-stotram');
    const saundaryalahari = catalog.find((b: any) => b.id === 'granth-saundarya-lahari');

    expect(sriSuktam).toBeDefined();
    expect(kanakadhara).toBeDefined();
    expect(saundaryalahari).toBeDefined();
  });
});
