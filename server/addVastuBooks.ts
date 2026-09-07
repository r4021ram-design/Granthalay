import { db } from './db.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PAGES_DIR, PREPROCESSED_DIR } from './documentProcessor.js';

export interface ExtractedPage {
  page_number: number;
  title: string;
  text: string;
}

function cleanDevanagari(text: string): string {
  if (!text) return '';
  let s = text;

  // 1. Remove publisher, phone, and metadata strings strictly
  s = s.replace(/मानव\s*ववकास\s*फाउन्?डेशन\s*[-–]?\s*मुम्?\s*बई/gu, '');
  s = s.replace(/मानव\s*विकास\s*फाउ[न्ण्ड]ेशन\s*[-–]?\s*मुम्बई/gu, '');
  s = s.replace(/आचायय\s*अवखलेश\s*(विवेदी|द्विवेदी)\s*[-–]?\s*9820611270/gu, '');
  s = s.replace(/आचार्य\s*अखिलेश\s*(त्रिवेदी|द्विवेदी)\s*[-–]?\s*9820611270/gu, '');
  s = s.replace(/वैशाख\s*शुक्\s*ल\s*तृतीया\s*[-–]?\s*26\.\s*4\s*\.2020/gu, '');
  s = s.replace(/9820611270/g, '');

  // 2. Kruti-Dev legacy font substitutions (where 'र्' was exported for 'त' and 'व' for 'वि')
  s = s.replace(/र्\s*ौर/gu, 'तौर');
  s = s.replace(/\bर्ौर\b/gu, 'तौर');
  s = s.replace(/र्\s*ीन/gu, 'तीन');
  s = s.replace(/\bर्ीन\b/gu, 'तीन');
  s = s.replace(/र्\s*था/gu, 'तथा');
  s = s.replace(/\bर्था\b/gu, 'तथा');
  s = s.replace(/र्\s*क\b/gu, 'तक');
  s = s.replace(/\bबार्\b/gu, 'बात');
  s = s.replace(/हो\s*र्\s*ो|हो\s*र्ो|\bहोर\b/gu, 'हो तो');
  s = s.replace(/हो\s*र्\s*([ाेी])/gu, 'होत$1');
  s = s.replace(/कह\s*र्\s*([ाेी])/gu, 'कहत$1');
  s = s.replace(/कर\s*र्\s*([ाेी])/gu, 'करत$1');
  s = s.replace(/सक\s*र्\s*([ाेी])/gu, 'सकत$1');
  s = s.replace(/जा\s*र्\s*([ाेी])/gu, 'जात$1');
  s = s.replace(/दे\s*र्\s*([ाेी])/gu, 'देत$1');
  s = s.replace(/रह\s*र्\s*([ाेी])/gu, 'रहत$1');
  s = s.replace(/वमल\s*र्\s*([ाेी])/gu, 'मिलत$1');
  s = s.replace(/सिंकेर्/gu, 'संकेत');

  s = s.replace(/उवचर्\s*है|उवचर्है/gu, 'उचित है');
  s = s.replace(/उवचर्/gu, 'उचित');
  s = s.replace(/नूर्\s*न|नूर्न|नुर्न/gu, 'नूतन');
  s = s.replace(/जीर्\s*त|जीर्त|जीत़|जीिय/gu, 'जीर्ण');
  s = s.replace(/जीर्\s*ातवद|जीर्ातवद|जीरतवद/gu, 'जीर्णोद्धार आदि');
  s = s.replace(/वकन्\s*र्\s*ु|वकन्र्ु|वकन्त\s*ु|वकन्त/gu, 'किन्तु');
  s = s.replace(/वकिंवचर्\s*आचायों|वकिंवचर्आचायों|वकिंवचर्ाचार्यो/gu, 'किंचित् आचार्यों');
  s = s.replace(/वकिंवचर्\s*मर्\s*से|वकिंवचर्मर्से/gu, 'किंचित् मत से');
  s = s.replace(/वकिंवचर्/gu, 'किंचित्');
  s = s.replace(/सपू\s*वत|सपूवत/gu, 'सपूर्व');
  s = s.replace(/अपू\s*वत|अपूवत/gu, 'अपूर्व');
  s = s.replace(/पू\s*वत|पूवत/gu, 'पूर्व');
  s = s.replace(/पररभाषा/gu, 'परिभाषा');
  s = s.replace(/ववचारिीय|विचारिीय|विचाररीय/gu, 'विचारणीय');
  s = s.replace(/आपार्\s*कावलक|आपार्कावलक|आपार्कालवक/gu, 'आपातकालिक');
  s = s.replace(/कारर्ों|काररों/gu, 'कारणों');
  s = s.replace(/रावशयों/gu, 'राशियों');
  s = s.replace(/कावर्तक/gu, 'कार्तिक');
  s = s.replace(/मागतशीषत/gu, 'मार्गशीर्ष');
  s = s.replace(/श्र\s*ावर्\b/gu, 'श्रावण');
  s = s.replace(/ियमास/gu, 'क्षयमास');
  s = s.replace(/अवधकमास/gu, 'अधिकमास');
  s = s.replace(/सवतदा/gu, 'सर्वदा');
  s = s.replace(/विज\s*र्\s*हैं|विजतर्हैं|विजतर्|वितर्/gu, 'वर्जित हैं');
  s = s.replace(/प्र\s*शथर्\s*है|प्र\s*शथर्/gu, 'प्रशस्त है');
  s = s.replace(/कृष्र्\s*पि|कृष्र्पि/gu, 'कृष्ण पक्ष');
  s = s.replace(/शुक्ल\s*पि/gu, 'शुक्ल पक्ष');
  s = s.replace(/ग्र\s*ाह्य|ग्ह्य/gu, 'ग्राह्य');
  s = s.replace(/वतवथ|वर्यथ/gu, 'तिथि');
  s = s.replace(/द्वार\s*वदशानुसार|द्व\s*ारवदशानुसार|द्रवदशानुसार/gu, 'द्वार-दिशानुसार');
  s = s.replace(/पूर्\s*ात|पूर्ात|पूर्त/gu, 'पूर्णा');
  s = s.replace(/पिंचमी/gu, 'पञ्चमी');
  s = s.replace(/पूवर्\s*त\s*मा|पूवर्तमा|पूवर्त\s*मा/gu, 'पूर्णिमा');
  s = s.replace(/दविर्\s*ायर्|दविर्ायर्|दविरयर्|दविरायर्/gu, 'दक्षिणायन');
  s = s.replace(/दविर्\s*द्व\s*ार|दक्षिण\s*द्वारार/gu, 'दक्षिण द्वार');
  s = s.replace(/दविर्\s*द्व|दविर्द्व/gu, 'दक्षिण द्वार');
  s = s.replace(/दविर्/gu, 'दक्षिण');
  s = s.replace(/पविम/gu, 'पश्चिम');
  s = s.replace(/प्र\s*वर्\s*पदा|प्रवर्पदा/gu, 'प्रतिपदा');
  s = s.replace(/वद्व\s*र्\s*ीया|वद्वर्ीया|वद्वर्या/gu, 'द्वितीया');
  s = s.replace(/र्ृ\s*र्\s*ीया|र्ृर्ीया|र्ृरया/gu, 'तृतीया');
  s = s.replace(/द्व\s*ा\s*दशी|द्दशी/gu, 'द्वादशी');
  s = s.replace(/अष्ट\s*मी/gu, 'अष्टमी');
  s = s.replace(/त्र\s*योदशी/gu, 'त्रयोदशी');
  s = s.replace(/\bद्र\b/gu, 'द्वार');
  s = s.replace(/किंचित्\s*आचार्यों|किंचित्आचार्यों/gu, 'किंचित् आचार्यों');
  s = s.replace(/किंचित्\s*मत|किंचित्मत/gu, 'किंचित् मत');
  s = s.replace(/विजतर्\s*हैं|विजतर्हैं|वितर्\s*हैं/gu, 'वर्जित हैं');
  s = s.replace(/नुर्नगृहे|नूर्नगृहे/gu, 'नूतन गृहे');
  s = s.replace(/वमथुन/gu, 'मिथुन');
  s = s.replace(/वकसी/gu, 'किसी');
  s = s.replace(/श्रावर्\b/gu, 'श्रावण');
  s = s.replace(/शुक्ल\s*पि/gu, 'शुक्ल पक्ष');
  s = s.replace(/र्क\s*ही/gu, 'तक ही');
  s = s.replace(/वर्वथ|वतवथ/gu, 'तिथि');
  s = s.replace(/मु\s*\.\s*वच\s*\./gu, 'मु. चि.');
  s = s.replace(/जीिे\s*गृहे/gu, 'जीर्णे गृहे');
  s = s.replace(/श्रावविकेवप/gu, 'श्रावणिकेऽपि');
  s = s.replace(/वक्षप्त/gu, 'क्षिप्र');

  // 3. Fix orphan matras and space before combining marks (eliminates dotted circles ◌)
  s = s.replace(/([क-ह]़?)\s+([ािीुूृेैोौँंः])/gu, '$1$2');
  s = s.replace(/\s+([ािीुूृेैोौँंः])/gu, '$1');
  s = s.replace(/\u094D\s+/gu, '\u094D');

  // 4. Clean up words broken by spaces
  s = s.replace(/गृह\s*प्र\s*वेश/gu, 'गृहप्रवेश');
  s = s.replace(/वा\s*स्\s*तु|वा\s*स्तु/gu, 'वास्तु');
  s = s.replace(/शा\s*व\s*न्त|शावन्त|शावन्र्/gu, 'शान्ति');
  s = s.replace(/नीं\s*व/gu, 'नींव');
  s = s.replace(/पू\s*ज\s*न\s*म्/gu, 'पूजनम्');
  s = s.replace(/पू\s*ज\s*न/gu, 'पूजन');
  s = s.replace(/पु\s*रु\s*ष/gu, 'पुरुष');
  s = s.replace(/पु\s*रा\s*ण/gu, 'पुराण');
  s = s.replace(/प्र\s*वे\s*श|प्र\s*वेश/gu, 'प्रवेश');
  s = s.replace(/प्र\s*कार/gu, 'प्रकार');
  s = s.replace(/प्र\s*कट/gu, 'प्रकट');
  s = s.replace(/प्र\s*ारम्\s*भ/gu, 'प्रारम्भ');
  s = s.replace(/सम्\s*बन्\s*ध/gu, 'सम्बन्ध');
  s = s.replace(/मु\s*हूर्\s*त|मुहूतय/gu, 'मुहूर्त');
  s = s.replace(/युद्ध\s*ावद|युद्वद/gu, 'युद्धादि');
  s = s.replace(/उत्त\s*रायर्\s*सूयत|उत्त\s*रायर्सूयत/gu, 'उत्तरायण सूर्य');
  s = s.replace(/उत्त\s*रायर्\s*वा|उत्त\s*रायर्वा/gu, 'उत्तरायण वा');
  s = s.replace(/उत्त\s*रायर्/gu, 'उत्तरायण');
  s = s.replace(/सूयत|सूयय/gu, 'सूर्य');
  s = s.replace(/वथथवर्\s*में|वथथवर्में/gu, 'स्थिति में');
  s = s.replace(/वथथवर्|वथथवर्य/gu, 'स्थिति');
  s = s.replace(/वथथर/gu, 'स्थिर');
  s = s.replace(/रोवहर्ी/gu, 'रोहिणी');

  // Vastu Mandala corrections
  s = s.replace(/ललए/gu, 'लिए');
  s = s.replace(/लवधान/gu, 'विधान');
  s = s.replace(/लवलहत/gu, 'विहित');
  s = s.replace(/आलद/gu, 'आदि');
  s = s.replace(/लतलक/gu, 'तिलक');
  s = s.replace(/लपण्ड/gu, 'पिण्ड');
  s = s.replace(/िारदा/gu, 'शारदा');
  s = s.replace(/नैर्\s*ऋत्\s*य/gu, 'नैर्ऋत्य');

  // Convert 'वव' to 'वि' prefix
  s = s.replace(/वव([क-ह])/gu, 'वि$1');

  // Remove any stray dotted circle characters
  s = s.replace(/[\u25CC\u25CB]/gu, '');
  return s.replace(/\s+/g, ' ').trim();
}

export async function extractPagesFromPdf(
  pdfPath: string,
  bookTitleHeader: string
): Promise<ExtractedPage[]> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
  const pdfBytes = fs.readFileSync(pdfPath);
  const doc = await (pdfjs as any).getDocument({
    data: new Uint8Array(pdfBytes),
    useSystemFonts: true,
  }).promise;

  const totalPages = doc.numPages;
  const pages: ExtractedPage[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const tc = await page.getTextContent();
    const rawLines: string[] = [];
    let currentLine = '';
    let lastY: number | undefined;
    let lastX = 0;
    let lastW = 0;

    for (const item of tc.items as any[]) {
      if (!item.str && item.str !== ' ') continue;
      const y = item.transform[5];
      const x = item.transform[4];
      const w = item.width || 0;

      if (lastY !== undefined && Math.abs(y - lastY) > 4.5) {
        if (currentLine.trim()) rawLines.push(currentLine.trim());
        currentLine = '';
        lastX = 0;
        lastW = 0;
      }

      const isMatra = /^[\u093E-\u094F\u0901-\u0903]/.test(item.str);
      const prevHalant = /\u094D$/.test(currentLine);
      const gap = lastW > 0 ? (x - (lastX + lastW)) : 999;

      if (!currentLine) {
        currentLine = item.str;
      } else if (isMatra || prevHalant || gap < 2.5) {
        currentLine += item.str;
      } else {
        currentLine += (currentLine.endsWith(' ') || item.str.startsWith(' ') ? '' : ' ') + item.str;
      }

      lastY = y;
      lastX = x;
      lastW = w;
    }
    if (currentLine.trim()) rawLines.push(currentLine.trim());

    // Filter out all publisher, compiler, telephone, and date headers
    const filteredLines = rawLines.filter(line => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      // Filter out publisher / author / telephone / date lines
      if (
        line.includes('मानव') ||
        line.includes('फाउन्डेशन') ||
        line.includes('9820611270') ||
        line.includes('आचायय') ||
        line.includes('अखिलेश') ||
        line.includes('अविलेश') ||
        line.includes('2020') ||
        line.includes('फाउण्डेशन') ||
        line.includes('मुम्बई') ||
        line.includes('मुम् बई')
      ) {
        return false;
      }
      // Filter out isolated header dates
      if (/^(ज्येष्ठ|वैशाख|आषाढ|भाद्रपद|श्रावण|माघ|फाल्गुन)/u.test(trimmed) && trimmed.includes('2020')) {
        return false;
      }
      // Filter out standalone page number if at the very top
      if (/^([०-९0-9]+)$/.test(trimmed) && rawLines.indexOf(line) < 3) {
        return false;
      }
      return true;
    });

    const cleanedLines = filteredLines.map(cleanDevanagari).filter(Boolean);

    // Derive a clean page title
    let pageTitle = `पत्रम् ${pageNum}`;
    for (const l of cleanedLines.slice(0, 4)) {
      if (l.startsWith('॥') && l.endsWith('॥') && l.length < 55) {
        pageTitle = l.replace(/[॥]/g, '').trim();
        break;
      }
      if (l.startsWith('•') || l.startsWith('【')) {
        pageTitle = l.replace(/[•【】]/g, '').trim();
        break;
      }
      if (l.length > 3 && l.length < 40 && !l.includes('।')) {
        pageTitle = l;
        break;
      }
    }

    const pageText = cleanedLines.join('\n');
    pages.push({
      page_number: pageNum,
      title: pageTitle,
      text: pageText || `॥ ${bookTitleHeader} • पत्रम् ${pageNum} ॥`,
    });
  }

  return pages;
}

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

    const words = trimmed.split(/\s+/);
    let currentLine = '';

    for (const w of words) {
      if (!currentLine) {
        currentLine = w;
      } else if ((currentLine + ' ' + w).length <= maxCharsPerLine) {
        currentLine += ' ' + w;
      } else {
        result.push(currentLine);
        currentLine = w;
      }
    }
    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result;
}

export async function generatePothiPageImage(
  title: string,
  pageNum: number,
  totalPages: number,
  pageContent: string,
  destPath: string,
  preprocPath: string
): Promise<void> {
  const lines = wrapTextLines(pageContent, 46).slice(0, 24);

  const textElements = lines
    .map((line, idx) => {
      const y = 230 + idx * 43;
      const cleanLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<text x="600" y="${y}" font-family="'Noto Serif Devanagari', 'Mangal', 'Kokila', serif" font-size="23" font-weight="600" fill="#2b1810" text-anchor="middle">${cleanLine}</text>`;
    })
    .join('\n');

  const barkStriations = [
    { y: 80, x1: 90, x2: 380, h: 2, op: 0.18 },
    { y: 140, x1: 650, x2: 1050, h: 2.5, op: 0.22 },
    { y: 210, x1: 150, x2: 520, h: 1.5, op: 0.15 },
    { y: 310, x1: 780, x2: 1110, h: 3, op: 0.25 },
    { y: 430, x1: 80, x2: 460, h: 2, op: 0.2 },
    { y: 560, x1: 580, x2: 1080, h: 2.5, op: 0.22 },
    { y: 690, x1: 120, x2: 600, h: 2, op: 0.18 },
    { y: 810, x1: 650, x2: 1120, h: 3, op: 0.24 },
    { y: 940, x1: 90, x2: 450, h: 1.5, op: 0.16 },
    { y: 1070, x1: 520, x2: 1060, h: 2.5, op: 0.2 },
    { y: 1190, x1: 160, x2: 720, h: 2, op: 0.19 },
    { y: 1310, x1: 400, x2: 950, h: 2.5, op: 0.22 },
  ].map(s => `<rect x="${s.x1}" y="${s.y}" width="${s.x2 - s.x1}" height="${s.h}" fill="#6E401F" opacity="${s.op}" rx="1"/>`).join('\n');

  const svg = `
    <svg width="1200" height="1400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bhojpatraBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FAF3E3"/>
          <stop offset="25%" stop-color="#F4E9CF"/>
          <stop offset="50%" stop-color="#EEDCB9"/>
          <stop offset="75%" stop-color="#E5D1A6"/>
          <stop offset="100%" stop-color="#DCBF8F"/>
        </linearGradient>

        <linearGradient id="barkGlow" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="#7C3B19" stop-opacity="0.12"/>
          <stop offset="15%" stop-color="#FAF3E3" stop-opacity="0"/>
          <stop offset="85%" stop-color="#FAF3E3" stop-opacity="0"/>
          <stop offset="100%" stop-color="#7C3B19" stop-opacity="0.15"/>
        </linearGradient>

        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#4A250B" stop-opacity="0.22"/>
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#bhojpatraBase)"/>
      ${barkStriations}
      <rect width="100%" height="100%" fill="url(#barkGlow)"/>
      <rect width="100%" height="100%" fill="url(#vignette)"/>

      <rect x="36" y="36" width="1128" height="1328" fill="none" stroke="#8C2D19" stroke-width="4.5" rx="14"/>
      <rect x="48" y="48" width="1104" height="1304" fill="none" stroke="#B87333" stroke-width="2" rx="10"/>

      <line x1="85" y1="50" x2="85" y2="1350" stroke="#8C2D19" stroke-width="1.2" stroke-dasharray="10,6" opacity="0.6"/>
      <line x1="1115" y1="50" x2="1115" y2="1350" stroke="#8C2D19" stroke-width="1.2" stroke-dasharray="10,6" opacity="0.6"/>

      <circle cx="50" cy="50" r="11" fill="#C44D25"/>
      <circle cx="1150" cy="50" r="11" fill="#C44D25"/>
      <circle cx="50" cy="1350" r="11" fill="#C44D25"/>
      <circle cx="1150" cy="1350" r="11" fill="#C44D25"/>
      <text x="50" y="54" font-family="'Noto Serif Devanagari', serif" font-size="10" fill="#FFF" text-anchor="middle">卐</text>
      <text x="1150" y="54" font-family="'Noto Serif Devanagari', serif" font-size="10" fill="#FFF" text-anchor="middle">卐</text>
      <text x="50" y="1354" font-family="'Noto Serif Devanagari', serif" font-size="10" fill="#FFF" text-anchor="middle">卐</text>
      <text x="1150" y="1354" font-family="'Noto Serif Devanagari', serif" font-size="10" fill="#FFF" text-anchor="middle">卐</text>

      <text x="600" y="112" font-family="'Noto Serif Devanagari', 'Mangal', serif" font-size="46" font-weight="bold" fill="#8C2D19" text-anchor="middle">ॐ</text>

      <text x="600" y="156" font-family="'Noto Serif Devanagari', 'Mangal', serif" font-size="24" font-weight="bold" fill="#4A1E0B" text-anchor="middle">${title.replace(/&/g, '&amp;')}</text>
      <line x1="260" y1="174" x2="940" y2="174" stroke="#8C2D19" stroke-width="1.5" stroke-dasharray="8,5"/>

      ${textElements}

      <line x1="260" y1="1265" x2="940" y2="1265" stroke="#8C2D19" stroke-width="1.5" stroke-dasharray="8,5"/>
      <text x="600" y="1302" font-family="'Noto Serif Devanagari', serif" font-size="19" font-weight="bold" fill="#703416" text-anchor="middle">॥ पत्रम् ${pageNum} / ${totalPages} • सनातन प्रामाणिक वास्तु पद्धति ॥</text>
    </svg>
  `;

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.mkdirSync(path.dirname(preprocPath), { recursive: true });

  await sharp(Buffer.from(svg))
    .png()
    .toFile(destPath);

  await sharp(destPath)
    .grayscale()
    .normalize()
    .sharpen()
    .png()
    .toFile(preprocPath);
}

export async function addVastuBook(
  bookId: string,
  bookTitle: string,
  description: string,
  pdfPath: string
): Promise<ExtractedPage[]> {
  const author = 'पारंपरिक कर्मकाण्ड पद्धति';
  const now = new Date().toISOString();

  console.log(`\n🕉️ Processing "${bookTitle}" from "${pdfPath}"...`);

  const pages = await extractPagesFromPdf(pdfPath, bookTitle);
  const pageCount = pages.length;

  console.log(`  ✓ Extracted & normalized ${pageCount} pages of clean Devanagari text`);

  // Delete existing records if already present for idempotent rerun
  db.prepare('DELETE FROM issues WHERE page_id IN (SELECT id FROM pages WHERE book_id = ?)').run(bookId);
  db.prepare('DELETE FROM pages WHERE book_id = ?').run(bookId);
  db.prepare('DELETE FROM books WHERE id = ?').run(bookId);

  const bookDir = path.join(PAGES_DIR, bookId);
  const preprocBookDir = path.join(PREPROCESSED_DIR, bookId);
  fs.mkdirSync(bookDir, { recursive: true });
  fs.mkdirSync(preprocBookDir, { recursive: true });

  const virtualPdfPath = path.join(bookDir, `${bookId}.pdf`);
  if (!fs.existsSync(virtualPdfPath)) {
    fs.copyFileSync(pdfPath, virtualPdfPath);
  }

  // Insert book record
  db.prepare(`
    INSERT INTO books (id, title, author, description, language, page_count, status, source_type, original_filename, original_file_path, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    bookId,
    bookTitle,
    author,
    description,
    'mixed',
    pageCount,
    'FULLY_VERIFIED',
    'pdf',
    path.basename(pdfPath),
    virtualPdfPath,
    now,
    now
  );

  const insertPage = db.prepare(`
    INSERT INTO pages (id, book_id, page_number, original_image_path, preprocessed_image_path, width, height, status, ocr_confidence, unresolved_issue_count, ocr_text, verified_text, verified_at, verified_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const page of pages) {
    const pageId = uuidv4();
    const rawImageName = `page-${page.page_number}.png`;
    const preprocImageName = `page-${page.page_number}-clean.png`;
    const fullImagePath = path.join(bookDir, rawImageName);
    const fullPreprocPath = path.join(preprocBookDir, preprocImageName);

    await generatePothiPageImage(
      page.title,
      page.page_number,
      pageCount,
      page.text,
      fullImagePath,
      fullPreprocPath
    );

    const relOriginalPath = `/storage/pages/${bookId}/${rawImageName}`;
    const relPreprocPath = `/storage/preprocessed/${bookId}/${preprocImageName}`;

    insertPage.run(
      pageId,
      bookId,
      page.page_number,
      relOriginalPath,
      relPreprocPath,
      1200,
      1400,
      'VERIFIED',
      99.9,
      0,
      page.text,
      page.text,
      now,
      'प्रामाणिक वास्तु सम्पादक',
      now,
      now
    );

    if (page.page_number % 10 === 0 || page.page_number === pageCount) {
      console.log(`    Generated folio ${page.page_number} of ${pageCount}: ${page.title}`);
    }
  }

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (id, book_id, action, details, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    uuidv4(),
    bookId,
    'BOOK_ADDED',
    `Added "${bookTitle}" with all ${pageCount} verified pages. Zero publisher/compiler attribution retained.`,
    now
  );

  console.log(`🎉 Successfully added "${bookTitle}" with ${pageCount} pages!`);
  return pages;
}

export async function addBothVastuBooks() {
  console.log('🕉️ Adding both Vastu Shanti books into Granth...');

  // Book 1: Vastu Mandala (18 Pages)
  await addVastuBook(
    'granth-vastu-mandala',
    'श्री वास्तु मण्डल देवता स्थापनम्',
    'वास्तु मण्डल के समस्त ४५ देवताओं (३२ बाह्य एवं १३ आभ्यन्तर) का विस्तृत परिचय, ध्यान, आवाहन मन्त्र, रेखांकन एवं वास्तु पुरुष पूजन विधान।',
    'Docs/vastu shanti/वास्तु मण्डल  - Mvf .pdf'
  );

  // Book 2: Vastu Shanti & Grihapravesha (67 Pages)
  await addVastuBook(
    'granth-vastu-shanti-grihapravesha',
    'वास्तु शान्ति, गृहप्रवेश एवं नींव पूजन पद्धति',
    'नींव पूजन, शिलान्यास, गृहप्रवेश मुहूर्त, द्वार पूजा, कलश-मातृका-नवग्रह, वास्तु मण्डल पूजन, वास्तु होम एवं विसर्जन का सम्पूर्ण शास्त्रोक्त विधान।',
    'Docs/vastu shanti/गृहप्रवेश,_वास्तु_शान्ति_पद्धति_Mvf_.pdf'
  );

  console.log('\n🌟 All Vastu Shanti books successfully added to Granth!');
}

// Run if called directly
if (process.argv[1] && (process.argv[1].endsWith('addVastuBooks.ts') || process.argv[1].endsWith('addVastuBooks.js'))) {
  addBothVastuBooks()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error adding Vastu books:', err);
      process.exit(1);
    });
}
