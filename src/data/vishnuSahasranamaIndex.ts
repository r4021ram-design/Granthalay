export interface VsnSection {
  id: number;
  sectionKey: string;
  titleSa: string;
  titleHi: string;
  nameSa: string;
  nameHi: string;
  startPage: number;
  endPage: number;
  description: string;
  icon: string;
}

export const VSN_SECTIONS: VsnSection[] = [
  {
    id: 1,
    sectionKey: 'cover',
    titleSa: 'आवरण पृष्ठम्',
    titleHi: 'आवरण पृष्ठ (मुखपृष्ठ)',
    nameSa: 'आवरणम्',
    nameHi: 'मूल पोथी मुखपृष्ठ',
    startPage: 1,
    endPage: 1,
    description: 'भगवान् श्रीविष्णु के चतुर्भुज स्वरूप का पावन दर्शन एवं ग्रन्थ परिचय',
    icon: '🕉️',
  },
  {
    id: 2,
    sectionKey: 'mangalacharan',
    titleSa: 'अथ मङ्गलाचरणम्',
    titleHi: 'मङ्गलाचरण एवं ध्यानम्',
    nameSa: 'मङ्गलाचरणम्',
    nameHi: 'प्रारम्भिक स्तुति एवं ध्यान श्लोक',
    startPage: 2,
    endPage: 3,
    description: 'यस्य स्मरणमात्रेण जन्मसंसारबन्धनात्... भगवान् विष्णु को पावन प्रणाम',
    icon: '📿',
  },
  {
    id: 3,
    sectionKey: 'parvopakrama',
    titleSa: 'पर्वोपक्रमः (भीष्म-युधिष्ठिर-संवादः)',
    titleHi: 'पर्वोपक्रम: भीष्म-युधिष्ठिर संवाद',
    nameSa: 'भीष्म-युधिष्ठिर संवाद',
    nameHi: 'किमेकं दैवतं लोके... धर्मराज के षट् प्रश्न',
    startPage: 4,
    endPage: 6,
    description: 'महाभारत अनुशासनपर्व से युधिष्ठिर के 6 गूढ़ प्रश्न एवं पितामह भीष्म का उत्तर',
    icon: '🚩',
  },
  {
    id: 4,
    sectionKey: 'nama-vyakhya',
    titleSa: 'श्रीविष्णुसहस्रनामस्तोत्रम् (मूल सहस्र नाम)',
    titleHi: 'सहस्र नाम एवं हिन्दी सार्थ व्याख्या',
    nameSa: '1000 दिव्य नाम',
    nameHi: 'विश्वं विष्णुर्वषट्कारो... (नाम 1 से 1000)',
    startPage: 7,
    endPage: 76,
    description: 'भगवान् श्रीविष्णु के 1000 दिव्य नामों के श्लोक एवं प्रत्येक नाम का सरल हिन्दी अर्थ',
    icon: '☸',
  },
  {
    id: 5,
    sectionKey: 'phalashruti',
    titleSa: 'अथ फलश्रुतिः',
    titleHi: 'फलश्रुति: स्तोत्र माहात्म्य व पुण्य फल',
    nameSa: 'फलश्रुतिः',
    nameHi: 'इतीदं कीर्तनीयस्य... पाठ का फल',
    startPage: 77,
    endPage: 82,
    description: 'सहस्रनाम स्तोत्र के नित्य पाठ, श्रवण एवं कीर्तन का दिव्य फल व रोग-भय नाश',
    icon: '✨',
  },
  {
    id: 6,
    sectionKey: 'supplementary',
    titleSa: 'परिशिष्ट स्तोत्राणि',
    titleHi: 'परिशिष्ट: मङ्गलगीतम् व प्रार्थना',
    nameSa: 'परिशिष्ट स्तोत्र',
    nameHi: 'मङ्गलगीतम्, दीनबन्ध्वष्टकम् आदि',
    startPage: 83,
    endPage: 97,
    description: 'जय जगदीश हरे, मङ्गलगीतम्, दीनबन्ध्वष्टकम् एवं नारायण स्तुति',
    icon: '🌸',
  },
];
