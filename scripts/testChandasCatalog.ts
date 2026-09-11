import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export function countSanskritSyllables(text: string): number {
  const matches = text.match(/[\u0904-\u0914\u0960-\u0961]|[\u0915-\u0939](?![\u094D])/gu);
  return matches ? matches.length : 0;
}

export interface ChandasInfo {
  name: string;
  syllablesPerPada: number;
  totalSyllables: number;
  linesPerStanza: number;
  description: string;
}

export function identifyChandas(line: string, isHemistich: boolean = false): ChandasInfo {
  const syl = countSanskritSyllables(line);

  if (isHemistich) {
    if (syl >= 14 && syl <= 18) {
      return {
        name: 'अनुष्टुप् (Anuṣṭubh)',
        syllablesPerPada: 8,
        totalSyllables: 32,
        linesPerStanza: 2,
        description: '८-८ अक्षरों के ४ चरण (२ पंक्तियों में: पूर्वार्ध १६ अक्षर + उत्तरार्ध १६ अक्षर)'
      };
    }
    if (syl >= 22 && syl <= 26) {
      return {
        name: 'भुजङ्गप्रयातम् / तोटकम् / उपजाति (चतुष्पदी)',
        syllablesPerPada: 12,
        totalSyllables: 48,
        linesPerStanza: 4,
        description: '११-१२ अक्षरों के ४ चरण (४ पंक्तियों में)'
      };
    }
    if (syl >= 27 && syl <= 29) {
      return {
        name: 'वसन्ततिलका (चतुष्पदी)',
        syllablesPerPada: 14,
        totalSyllables: 56,
        linesPerStanza: 4,
        description: '१४ अक्षरों के ४ चरण (४ पंक्तियों में)'
      };
    }
    if (syl >= 30 && syl <= 31) {
      return {
        name: 'मालिनी (चतुष्पदी)',
        syllablesPerPada: 15,
        totalSyllables: 60,
        linesPerStanza: 4,
        description: '१५ अक्षरों के ४ चरण (४ पंक्तियों में)'
      };
    }
    if (syl >= 32 && syl <= 33) {
      return {
        name: 'पञ्चचामरम् (चतुष्पदी - शिवताण्डव)',
        syllablesPerPada: 16,
        totalSyllables: 64,
        linesPerStanza: 4,
        description: '१६ अक्षरों के ४ चरण (४ पंक्तियों में)'
      };
    }
    if (syl >= 34 && syl <= 35) {
      return {
        name: 'शिखरिणी / मन्दाक्रान्ता (चतुष्पदी - शिवमहिम्न / आनन्दलहरी)',
        syllablesPerPada: 17,
        totalSyllables: 68,
        linesPerStanza: 4,
        description: '१७ अक्षरों के ४ चरण (४ पंक्तियों में)'
      };
    }
    if (syl >= 37 && syl <= 39) {
      return {
        name: 'शार्दूलविक्रीडितम् (चतुष्पदी - कस्तूरीतिलकम्)',
        syllablesPerPada: 19,
        totalSyllables: 76,
        linesPerStanza: 4,
        description: '१९ अक्षरों के ४ चरण (४ पंक्तियों में)'
      };
    }
    if (syl >= 41 && syl <= 43) {
      return {
        name: 'स्रग्धरा (चतुष्पदी - सूर्यमहिम्नः)',
        syllablesPerPada: 21,
        totalSyllables: 84,
        linesPerStanza: 4,
        description: '२१ अक्षरों के ४ चरण (४ पंक्तियों में)'
      };
    }
  }

  // Single Pada (एक चरण)
  if (syl === 8) {
    return {
      name: 'अनुष्टुप् (Anuṣṭubh - चरण)',
      syllablesPerPada: 8,
      totalSyllables: 32,
      linesPerStanza: 2,
      description: '८ अक्षरों का एक पाद'
    };
  }
  if (syl === 11) {
    return {
      name: 'इन्द्रवज्रा / उपेन्द्रवज्रा / उपजाति',
      syllablesPerPada: 11,
      totalSyllables: 44,
      linesPerStanza: 4,
      description: '११ अक्षरों का एक पाद'
    };
  }
  if (syl === 12) {
    return {
      name: 'भुजङ्गप्रयातम् / तोटकम् / द्रुतविलम्बितम्',
      syllablesPerPada: 12,
      totalSyllables: 48,
      linesPerStanza: 4,
      description: '१२ अक्षरों का एक पाद'
    };
  }
  if (syl === 14) {
    return {
      name: 'वसन्ततिलका',
      syllablesPerPada: 14,
      totalSyllables: 56,
      linesPerStanza: 4,
      description: '१४ अक्षरों का एक पाद'
    };
  }
  if (syl === 15) {
    return {
      name: 'मालिनी',
      syllablesPerPada: 15,
      totalSyllables: 60,
      linesPerStanza: 4,
      description: '१५ अक्षरों का एक पाद'
    };
  }
  if (syl === 16) {
    return {
      name: 'पञ्चचामरम्',
      syllablesPerPada: 16,
      totalSyllables: 64,
      linesPerStanza: 4,
      description: '१६ अक्षरों का एक पाद'
    };
  }
  if (syl === 17) {
    return {
      name: 'शिखरिणी / मन्दाक्रान्ता',
      syllablesPerPada: 17,
      totalSyllables: 68,
      linesPerStanza: 4,
      description: '१७ अक्षरों का एक पाद'
    };
  }
  if (syl === 19) {
    return {
      name: 'शार्दूलविक्रीडितम्',
      syllablesPerPada: 19,
      totalSyllables: 76,
      linesPerStanza: 4,
      description: '१९ अक्षरों का एक पाद'
    };
  }
  if (syl === 21) {
    return {
      name: 'स्रग्धरा',
      syllablesPerPada: 21,
      totalSyllables: 84,
      linesPerStanza: 4,
      description: '२१ अक्षरों का एक पाद'
    };
  }

  return {
    name: 'सदाचार / मुक्तक / गद्य',
    syllablesPerPada: syl,
    totalSyllables: syl,
    linesPerStanza: 2,
    description: `अक्षर संख्या: ${syl}`
  };
}

console.log('=== CHANDAS VERIFICATION SAMPLES ===');

const samples = [
  {
    title: 'संकटनाशनगणेशस्तोत्रम् (पूर्वार्ध - १६ अक्षर)',
    text: 'प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम्',
    isHemistich: true
  },
  {
    title: 'गणेशद्वादशनामस्तोत्रम् (पूर्वार्ध - १६ अक्षर)',
    text: 'सुमुखश्चैकदन्तश्च कपिलो गजकर्णकः',
    isHemistich: true
  },
  {
    title: 'शिवभुजङ्गप्रयातस्तोत्रम् (चरण १ - १२ अक्षर)',
    text: 'कृपासमुद्रं सुमुखं त्रिनेत्रं',
    isHemistich: false
  },
  {
    title: 'शिवताण्डवस्तोत्रम् (चरण १ - १६ अक्षर)',
    text: 'जटाटवीगलज्जलप्रवाहपावितस्थले',
    isHemistich: false
  },
  {
    title: 'शिवमहिम्नस्तोत्रम् (चरण १ - १७ अक्षर)',
    text: 'महिम्नः पारं ते परमविदुषो यद्यसदृशी',
    isHemistich: false
  },
  {
    title: 'आनन्दलहरी (चरण १ - १७ अक्षर)',
    text: 'शिवः शक्त्या युक्तो यदि भवति शक्तः प्रभवितुम्',
    isHemistich: false
  },
  {
    title: 'गोपालचूडामणिः / श्रीकृष्णस्तोत्रम् (चरण १ - १९ अक्षर)',
    text: 'कस्तूरीतिलकं ललाटपटले वक्षःस्थले कौस्तुभम्',
    isHemistich: false
  },
  {
    title: 'तोटकाष्टकम् (चरण १ - १२ अक्षर)',
    text: 'विदिताखिलशास्त्रसुधाजलधे',
    isHemistich: false
  },
  {
    title: 'वसन्ततिलका (चरण १ - १४ अक्षर)',
    text: 'हेरम्बमर्कशतमण्डलमण्डिताङ्गम्',
    isHemistich: false
  }
];

for (const s of samples) {
  const syl = countSanskritSyllables(s.text);
  const ch = identifyChandas(s.text, s.isHemistich);
  console.log(`\n• ${s.title}`);
  console.log(`  मूल पाठ: "${s.text}"`);
  console.log(`  अक्षर संख्या: ${syl} | छन्द: ${ch.name}`);
  console.log(`  पाद संरचना: ${ch.description}`);
}

