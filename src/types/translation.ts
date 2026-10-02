/**
 * ============================================================================
 * 🕉️ ग्रन्थालयः - श्लोक भावार्थ एवं पाणिनीय व्याकरण डेटा मॉडल्स
 * (Canonical Shloka Translation & Paninian Linguistics Types)
 * ============================================================================
 */

export interface SamasaEntry {
  compoundWord: string;     // समस्त पद (उदा. "कमलपत्राक्षः")
  vigraha: string;          // विग्रह वाक्य (उदा. "कमलस्य पत्रमिव अक्षिणी यस्य सः")
  samasaType: string;       // समास भेद (उदा. "बहुव्रीहि समास")
  meaningHindi: string;     // समास का सरल अर्थ
}

export interface PadaAnalysisEntry {
  word: string;             // पद (उदा. "गणपतये")
  pratipadikaOrDhatu: string;// मूल प्रातिपदिक / धातु (उदा. "गणपति")
  grammaticalType: 'subanta' | 'tinganta' | 'kridanta' | 'avyaya'; // पद स्वरूप
  details: string;          // विभक्ति, वचन / लकार, पुरुष (उदा. "पुंल्लिङ्ग, चतुर्थी, एकवचन")
  karakaOrPrayoga?: string; // कारक / प्रयोग (उदा. "सम्प्रदान कारक")
  meaningHindi: string;     // शब्दार्थ
  sutraRef?: string;        // पाणिनीय सूत्र (उदा. "१.४.३२ नमःस्वस्ति...")
}

export interface ChhandasLinguisticInfo {
  name: string;             // छन्द नाम (उदा. "अनुष्टुप्", "शार्दूलविक्रीडितम्")
  syllableWeight: string;   // लघु-गुरु संकेत (उदा. "ऽ ऽ ऽ । ऽ ऽ । ऽ")
  ganaPattern: string;      // गण स्वरूप (उदा. "म-य-र-स-त-ज-भ-न")
  totalMatras: number;      // कुल मात्रा संख्या
  totalAksharas: number;    // प्रति चरण अक्षर संख्या
  description: string;      // छन्द लक्षण व यति
}

export interface ShlokaLinguisticData {
  stotraId: string;
  shlokaNumber: number;
  shlokaText: string;
  hindiMeaning: string;     // १. सरल भावार्थ
  dandanvaya: string;       // २. दण्डान्वय (गद्य क्रम)
  khandanvaya?: { question: string; answer: string }[]; // ३. खण्डान्वय (आकांक्षा पद्धति)
  padaccheda: string;       // ४. पदच्छेद
  samasaList: SamasaEntry[];// ५. समास-विग्रह सूची
  padaList: PadaAnalysisEntry[]; // ६. सुबन्त/तिङन्त पद-परिचय
  chhandas?: ChhandasLinguisticInfo; // ७. छन्द व मात्रा विश्लेषण
  sourceReference?: string; // ग्रन्थ/पुराण सन्दर्भ
}
