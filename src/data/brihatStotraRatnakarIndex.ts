/**
 * ============================================================================
 * 🕉️ बृहत्स्तोत्ररत्नाकरः (सचित्र २२४ स्तोत्र संग्रह)
 * Canonical Liturgical Index & Folio Taxonomy
 * Total Folios: 284 | Total Stotras: 224
 * ============================================================================
 */

export interface BrihatStotraCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface BrihatStotraItem {
  id: number;
  stotraNumber: number;
  title: string;
  category: string;
  bookPage: number;
  pdfPage: number;
}

export const BRIHAT_CATEGORIES: BrihatStotraCategory[] = [
  { id: 'all', name: 'सम्पूर्ण २२४ स्तोत्र', icon: '🕉️', count: 224 },
  { id: 'ganesha', name: 'गणेशस्तोत्राणि', icon: '🐘', count: 10 },
  { id: 'vishnu', name: 'विष्णुस्तोत्राणि', icon: '🪷', count: 28 },
  { id: 'shiva', name: 'शिवस्तोत्राणि', icon: '🔱', count: 30 },
  { id: 'surya', name: 'सूर्यस्तोत्राणि', icon: '☀️', count: 8 },
  { id: 'devi', name: 'देवीस्तोत्राणि', icon: '🌺', count: 27 },
  { id: 'avatara', name: 'अवतार व गुरु स्तोत्राणि', icon: '✨', count: 15 },
  { id: 'rama', name: 'रामस्तोत्राणि', icon: '🏹', count: 13 },
  { id: 'maruti', name: 'मारुतिस्तोत्राणि', icon: '🚩', count: 5 },
  { id: 'krishna', name: 'कृष्णस्तोत्राणि', icon: '🦚', count: 26 },
  { id: 'ganga', name: 'गङ्गादि तीर्थस्तोत्राणि', icon: '🌊', count: 15 },
  { id: 'vedanta', name: 'वेदान्तस्तोत्राणि', icon: '📜', count: 14 },
  { id: 'navagraha', name: 'नवग्रहस्तोत्राणि', icon: '🪐', count: 14 },
  { id: 'sankeerna', name: 'संकीर्णस्तोत्राणि', icon: '🪔', count: 19 },
];

export const BRIHAT_TOTAL_PAGES = 284;

export const BRIHAT_STOTRAS: BrihatStotraItem[] = [
  {
    "id": 1,
    "stotraNumber": 1,
    "title": "गणेशन्यासः",
    "category": "ganesha",
    "bookPage": 7,
    "pdfPage": 1
  },
  {
    "id": 2,
    "stotraNumber": 2,
    "title": "गणेशकवचम्",
    "category": "ganesha",
    "bookPage": 8,
    "pdfPage": 2
  },
  {
    "id": 3,
    "stotraNumber": 3,
    "title": "गणेशमानसपूजा",
    "category": "ganesha",
    "bookPage": 9,
    "pdfPage": 3
  },
  {
    "id": 4,
    "stotraNumber": 4,
    "title": "गणेशबाह्यपूजा",
    "category": "ganesha",
    "bookPage": 15,
    "pdfPage": 9
  },
  {
    "id": 5,
    "stotraNumber": 5,
    "title": "गणेशमहिम्नः स्तोत्रम्",
    "category": "ganesha",
    "bookPage": 19,
    "pdfPage": 13
  },
  {
    "id": 6,
    "stotraNumber": 6,
    "title": "गणेशाष्टोत्तरशतनामस्तोत्रम्",
    "category": "ganesha",
    "bookPage": 21,
    "pdfPage": 15
  },
  {
    "id": 7,
    "stotraNumber": 7,
    "title": "संकष्टनाशनगणेशस्तोत्रम्",
    "category": "ganesha",
    "bookPage": 22,
    "pdfPage": 16
  },
  {
    "id": 8,
    "stotraNumber": 8,
    "title": "गणेशाष्टकम्",
    "category": "ganesha",
    "bookPage": 23,
    "pdfPage": 17
  },
  {
    "id": 9,
    "stotraNumber": 9,
    "title": "एकदन्तस्तोत्रम्",
    "category": "ganesha",
    "bookPage": 25,
    "pdfPage": 19
  },
  {
    "id": 10,
    "stotraNumber": 10,
    "title": "महागणपतिस्तोत्रम्",
    "category": "ganesha",
    "bookPage": 26,
    "pdfPage": 20
  },
  {
    "id": 11,
    "stotraNumber": 11,
    "title": "नारायणवर्म (नारायणकवचम्)",
    "category": "vishnu",
    "bookPage": 28,
    "pdfPage": 22
  },
  {
    "id": 12,
    "stotraNumber": 12,
    "title": "विष्णुपञ्जरस्तोत्रम्",
    "category": "vishnu",
    "bookPage": 31,
    "pdfPage": 25
  },
  {
    "id": 13,
    "stotraNumber": 13,
    "title": "श्रीमदच्युताष्टकम्",
    "category": "vishnu",
    "bookPage": 32,
    "pdfPage": 26
  },
  {
    "id": 14,
    "stotraNumber": 14,
    "title": "अच्युताष्टकम् (२)",
    "category": "vishnu",
    "bookPage": 33,
    "pdfPage": 27
  },
  {
    "id": 15,
    "stotraNumber": 15,
    "title": "शङ्कराचार्यकृतषट्पदी",
    "category": "vishnu",
    "bookPage": 33,
    "pdfPage": 27
  },
  {
    "id": 16,
    "stotraNumber": 16,
    "title": "विष्णुस्तवराजः",
    "category": "vishnu",
    "bookPage": 34,
    "pdfPage": 28
  },
  {
    "id": 17,
    "stotraNumber": 17,
    "title": "विष्णुस्तोत्रम्",
    "category": "vishnu",
    "bookPage": 35,
    "pdfPage": 29
  },
  {
    "id": 18,
    "stotraNumber": 18,
    "title": "विष्णोरष्टाविंशतिनामस्तोत्रम्",
    "category": "vishnu",
    "bookPage": 37,
    "pdfPage": 31
  },
  {
    "id": 19,
    "stotraNumber": 19,
    "title": "मुकुन्दमाला",
    "category": "vishnu",
    "bookPage": 37,
    "pdfPage": 31
  },
  {
    "id": 20,
    "stotraNumber": 20,
    "title": "श्रीविष्णोः षोडशनामस्तोत्रम्",
    "category": "vishnu",
    "bookPage": 39,
    "pdfPage": 33
  },
  {
    "id": 21,
    "stotraNumber": 21,
    "title": "विष्णुशतनामस्तोत्रम्",
    "category": "vishnu",
    "bookPage": 39,
    "pdfPage": 33
  },
  {
    "id": 22,
    "stotraNumber": 22,
    "title": "परमेश्वरस्तुतिसारस्तोत्रम्",
    "category": "vishnu",
    "bookPage": 40,
    "pdfPage": 34
  },
  {
    "id": 23,
    "stotraNumber": 23,
    "title": "भगवच्छरणस्तोत्रम्",
    "category": "vishnu",
    "bookPage": 41,
    "pdfPage": 35
  },
  {
    "id": 24,
    "stotraNumber": 24,
    "title": "हरिनाममालास्तोत्रम्",
    "category": "vishnu",
    "bookPage": 43,
    "pdfPage": 37
  },
  {
    "id": 25,
    "stotraNumber": 25,
    "title": "शालग्रामस्तोत्रम्",
    "category": "vishnu",
    "bookPage": 45,
    "pdfPage": 39
  },
  {
    "id": 26,
    "stotraNumber": 26,
    "title": "अच्युतनामाष्टकम्",
    "category": "vishnu",
    "bookPage": 46,
    "pdfPage": 40
  },
  {
    "id": 27,
    "stotraNumber": 27,
    "title": "विष्णुपादादिकेशान्तवर्णनस्तोत्रम्",
    "category": "vishnu",
    "bookPage": 46,
    "pdfPage": 40
  },
  {
    "id": 28,
    "stotraNumber": 28,
    "title": "विष्णुमहिम्नः स्तोत्रम्",
    "category": "vishnu",
    "bookPage": 52,
    "pdfPage": 46
  },
  {
    "id": 29,
    "stotraNumber": 29,
    "title": "श्रीहरिस्तोत्रम्",
    "category": "vishnu",
    "bookPage": 55,
    "pdfPage": 49
  },
  {
    "id": 30,
    "stotraNumber": 30,
    "title": "श्रीहरिनामाष्टकम्",
    "category": "vishnu",
    "bookPage": 56,
    "pdfPage": 50
  },
  {
    "id": 31,
    "stotraNumber": 31,
    "title": "श्रीहरिशरणाष्टकम्",
    "category": "vishnu",
    "bookPage": 57,
    "pdfPage": 51
  },
  {
    "id": 32,
    "stotraNumber": 32,
    "title": "श्रीदीनबन्ध्वष्टकम्",
    "category": "vishnu",
    "bookPage": 57,
    "pdfPage": 51
  },
  {
    "id": 33,
    "stotraNumber": 33,
    "title": "श्रीगोविन्दाष्टकम्",
    "category": "vishnu",
    "bookPage": 58,
    "pdfPage": 52
  },
  {
    "id": 34,
    "stotraNumber": 34,
    "title": "रमापत्यष्टकम्",
    "category": "vishnu",
    "bookPage": 59,
    "pdfPage": 53
  },
  {
    "id": 35,
    "stotraNumber": 35,
    "title": "कमलापत्यष्टकम्",
    "category": "vishnu",
    "bookPage": 60,
    "pdfPage": 54
  },
  {
    "id": 36,
    "stotraNumber": 36,
    "title": "संकष्टनाशनविष्णुस्तोत्रम्",
    "category": "vishnu",
    "bookPage": 60,
    "pdfPage": 54
  },
  {
    "id": 37,
    "stotraNumber": 37,
    "title": "पाण्डवगीता (प्रपन्नगीता)",
    "category": "vishnu",
    "bookPage": 61,
    "pdfPage": 55
  },
  {
    "id": 38,
    "stotraNumber": 38,
    "title": "हरिस्तुतिः (हरिमीडे स्तोत्रम्)",
    "category": "vishnu",
    "bookPage": 66,
    "pdfPage": 60
  },
  {
    "id": 39,
    "stotraNumber": 39,
    "title": "शिवकवचम्",
    "category": "shiva",
    "bookPage": 72,
    "pdfPage": 66
  },
  {
    "id": 40,
    "stotraNumber": 40,
    "title": "शिवमानसपूजा",
    "category": "shiva",
    "bookPage": 75,
    "pdfPage": 69
  },
  {
    "id": 41,
    "stotraNumber": 41,
    "title": "शिवमहिम्नः स्तोत्रम्",
    "category": "shiva",
    "bookPage": 76,
    "pdfPage": 70
  },
  {
    "id": 42,
    "stotraNumber": 42,
    "title": "शिवभुजङ्गप्रयातस्तोत्रम्",
    "category": "shiva",
    "bookPage": 79,
    "pdfPage": 73
  },
  {
    "id": 43,
    "stotraNumber": 43,
    "title": "शिवषडक्षरस्तोत्रम्",
    "category": "shiva",
    "bookPage": 80,
    "pdfPage": 74
  },
  {
    "id": 44,
    "stotraNumber": 44,
    "title": "शिवपञ्चाक्षरस्तोत्रम्",
    "category": "shiva",
    "bookPage": 81,
    "pdfPage": 75
  },
  {
    "id": 45,
    "stotraNumber": 45,
    "title": "उपमन्युकृतशिवस्तोत्रम्",
    "category": "shiva",
    "bookPage": 81,
    "pdfPage": 75
  },
  {
    "id": 46,
    "stotraNumber": 46,
    "title": "शिवापराधक्षमापनस्तोत्रम्",
    "category": "shiva",
    "bookPage": 82,
    "pdfPage": 76
  },
  {
    "id": 47,
    "stotraNumber": 47,
    "title": "रावणकृतशिवताण्डवस्तोत्रम्",
    "category": "shiva",
    "bookPage": 84,
    "pdfPage": 78
  },
  {
    "id": 48,
    "stotraNumber": 48,
    "title": "द्वादशज्योतिर्लिङ्गस्तोत्रम्",
    "category": "shiva",
    "bookPage": 85,
    "pdfPage": 79
  },
  {
    "id": 49,
    "stotraNumber": 49,
    "title": "शिवस्तुतिः",
    "category": "shiva",
    "bookPage": 86,
    "pdfPage": 80
  },
  {
    "id": 50,
    "stotraNumber": 50,
    "title": "पशुपत्यष्टकम्",
    "category": "shiva",
    "bookPage": 88,
    "pdfPage": 82
  },
  {
    "id": 51,
    "stotraNumber": 51,
    "title": "लिङ्गाष्टकम्",
    "category": "shiva",
    "bookPage": 88,
    "pdfPage": 82
  },
  {
    "id": 52,
    "stotraNumber": 52,
    "title": "वेदसारशिवस्तवः",
    "category": "shiva",
    "bookPage": 89,
    "pdfPage": 83
  },
  {
    "id": 53,
    "stotraNumber": 53,
    "title": "विश्वनाथाष्टकम्",
    "category": "shiva",
    "bookPage": 90,
    "pdfPage": 84
  },
  {
    "id": 54,
    "stotraNumber": 54,
    "title": "शिवनामावल्यष्टकम्",
    "category": "shiva",
    "bookPage": 91,
    "pdfPage": 85
  },
  {
    "id": 55,
    "stotraNumber": 55,
    "title": "प्रदोषस्तोत्राष्टकम्",
    "category": "shiva",
    "bookPage": 91,
    "pdfPage": 85
  },
  {
    "id": 56,
    "stotraNumber": 56,
    "title": "चन्द्रशेखराष्टकम्",
    "category": "shiva",
    "bookPage": 92,
    "pdfPage": 86
  },
  {
    "id": 57,
    "stotraNumber": 57,
    "title": "निर्वाणदशकम्",
    "category": "shiva",
    "bookPage": 93,
    "pdfPage": 87
  },
  {
    "id": 58,
    "stotraNumber": 58,
    "title": "निर्वाणषट्कम् (आत्मषट्कम्)",
    "category": "shiva",
    "bookPage": 94,
    "pdfPage": 88
  },
  {
    "id": 59,
    "stotraNumber": 59,
    "title": "कालभैरवाष्टकम्",
    "category": "shiva",
    "bookPage": 94,
    "pdfPage": 88
  },
  {
    "id": 60,
    "stotraNumber": 60,
    "title": "असितकृतशिवस्तोत्रम्",
    "category": "shiva",
    "bookPage": 95,
    "pdfPage": 89
  },
  {
    "id": 61,
    "stotraNumber": 61,
    "title": "हिमालयकृतशिवस्तोत्रम्",
    "category": "shiva",
    "bookPage": 96,
    "pdfPage": 90
  },
  {
    "id": 62,
    "stotraNumber": 62,
    "title": "शिवाष्टकम्",
    "category": "shiva",
    "bookPage": 97,
    "pdfPage": 91
  },
  {
    "id": 63,
    "stotraNumber": 63,
    "title": "द्वादशज्योतिर्लिङ्गस्मरणम्",
    "category": "shiva",
    "bookPage": 97,
    "pdfPage": 91
  },
  {
    "id": 64,
    "stotraNumber": 64,
    "title": "दारिद्रयदहनशिवस्तोत्रम्",
    "category": "shiva",
    "bookPage": 98,
    "pdfPage": 92
  },
  {
    "id": 65,
    "stotraNumber": 65,
    "title": "कल्किकृतशिवस्तोत्रम्",
    "category": "shiva",
    "bookPage": 98,
    "pdfPage": 92
  },
  {
    "id": 66,
    "stotraNumber": 66,
    "title": "शिवस्तुतिः (२)",
    "category": "shiva",
    "bookPage": 99,
    "pdfPage": 93
  },
  {
    "id": 67,
    "stotraNumber": 67,
    "title": "शङ्कराष्टकम्",
    "category": "shiva",
    "bookPage": 100,
    "pdfPage": 94
  },
  {
    "id": 68,
    "stotraNumber": 68,
    "title": "शिवरक्षास्तोत्रम्",
    "category": "shiva",
    "bookPage": 101,
    "pdfPage": 95
  },
  {
    "id": 69,
    "stotraNumber": 69,
    "title": "सूर्यकवचम्",
    "category": "surya",
    "bookPage": 104,
    "pdfPage": 98
  },
  {
    "id": 70,
    "stotraNumber": 70,
    "title": "सूर्यमण्डलस्तोत्रम्",
    "category": "surya",
    "bookPage": 106,
    "pdfPage": 100
  },
  {
    "id": 71,
    "stotraNumber": 71,
    "title": "आदित्यहृदयस्तोत्रम् (वाल्मीकीय)",
    "category": "surya",
    "bookPage": 107,
    "pdfPage": 101
  },
  {
    "id": 72,
    "stotraNumber": 72,
    "title": "आदित्यहृदयस्तोत्रम् (भविष्यपुराण)",
    "category": "surya",
    "bookPage": 114,
    "pdfPage": 108
  },
  {
    "id": 73,
    "stotraNumber": 73,
    "title": "सूर्याष्टकम् (१)",
    "category": "surya",
    "bookPage": 116,
    "pdfPage": 110
  },
  {
    "id": 74,
    "stotraNumber": 74,
    "title": "सूर्याष्टकम् (२)",
    "category": "surya",
    "bookPage": 116,
    "pdfPage": 110
  },
  {
    "id": 75,
    "stotraNumber": 75,
    "title": "सूर्यार्यास्तोत्रम्",
    "category": "surya",
    "bookPage": 117,
    "pdfPage": 111
  },
  {
    "id": 76,
    "stotraNumber": 76,
    "title": "सूर्यस्तोत्रम्",
    "category": "surya",
    "bookPage": 118,
    "pdfPage": 112
  },
  {
    "id": 77,
    "stotraNumber": 77,
    "title": "देव्यपराधक्षमापनस्तोत्रम्",
    "category": "devi",
    "bookPage": 119,
    "pdfPage": 113
  },
  {
    "id": 78,
    "stotraNumber": 78,
    "title": "आनन्दलहरी",
    "category": "devi",
    "bookPage": 120,
    "pdfPage": 114
  },
  {
    "id": 79,
    "stotraNumber": 79,
    "title": "महालक्ष्म्यष्टकम् (इन्द्रकृतम्)",
    "category": "devi",
    "bookPage": 122,
    "pdfPage": 116
  },
  {
    "id": 80,
    "stotraNumber": 80,
    "title": "देवकृतलक्ष्मीस्तोत्रम्",
    "category": "devi",
    "bookPage": 123,
    "pdfPage": 117
  },
  {
    "id": 81,
    "stotraNumber": 81,
    "title": "त्रिपुरसुन्दरीस्तोत्रम्",
    "category": "devi",
    "bookPage": 124,
    "pdfPage": 118
  },
  {
    "id": 82,
    "stotraNumber": 82,
    "title": "वाराहीनिग्रहाष्टकम्",
    "category": "devi",
    "bookPage": 125,
    "pdfPage": 119
  },
  {
    "id": 83,
    "stotraNumber": 83,
    "title": "वाराह्यनुग्रहाष्टकम्",
    "category": "devi",
    "bookPage": 126,
    "pdfPage": 120
  },
  {
    "id": 84,
    "stotraNumber": 84,
    "title": "ताराष्टकम्",
    "category": "devi",
    "bookPage": 126,
    "pdfPage": 120
  },
  {
    "id": 85,
    "stotraNumber": 85,
    "title": "शीतलाष्टकम् (स्कन्दपुराणोक्तम्)",
    "category": "devi",
    "bookPage": 127,
    "pdfPage": 121
  },
  {
    "id": 86,
    "stotraNumber": 86,
    "title": "अन्नपूर्णास्तोत्रम्",
    "category": "devi",
    "bookPage": 128,
    "pdfPage": 122
  },
  {
    "id": 87,
    "stotraNumber": 87,
    "title": "राधाकवचम्",
    "category": "devi",
    "bookPage": 129,
    "pdfPage": 123
  },
  {
    "id": 88,
    "stotraNumber": 88,
    "title": "भगवत्यष्टकम्",
    "category": "devi",
    "bookPage": 131,
    "pdfPage": 125
  },
  {
    "id": 89,
    "stotraNumber": 89,
    "title": "संकटनामाष्टकम्",
    "category": "devi",
    "bookPage": 132,
    "pdfPage": 126
  },
  {
    "id": 90,
    "stotraNumber": 90,
    "title": "लक्ष्मीलहरी",
    "category": "devi",
    "bookPage": 133,
    "pdfPage": 127
  },
  {
    "id": 91,
    "stotraNumber": 91,
    "title": "अम्बाष्टकम्",
    "category": "devi",
    "bookPage": 137,
    "pdfPage": 131
  },
  {
    "id": 92,
    "stotraNumber": 92,
    "title": "श्रीस्तोत्रम्",
    "category": "devi",
    "bookPage": 138,
    "pdfPage": 132
  },
  {
    "id": 93,
    "stotraNumber": 93,
    "title": "इन्द्राक्षीस्तोत्रम्",
    "category": "devi",
    "bookPage": 139,
    "pdfPage": 133
  },
  {
    "id": 94,
    "stotraNumber": 94,
    "title": "भवानीभुजङ्गप्रयातस्तोत्रम्",
    "category": "devi",
    "bookPage": 141,
    "pdfPage": 135
  },
  {
    "id": 95,
    "stotraNumber": 95,
    "title": "श्रेयस्करीस्तोत्रम्",
    "category": "devi",
    "bookPage": 142,
    "pdfPage": 136
  },
  {
    "id": 96,
    "stotraNumber": 96,
    "title": "देवीषट्कम्",
    "category": "devi",
    "bookPage": 143,
    "pdfPage": 137
  },
  {
    "id": 97,
    "stotraNumber": 97,
    "title": "दुर्गापदुद्धारस्तोत्रम्",
    "category": "devi",
    "bookPage": 143,
    "pdfPage": 137
  },
  {
    "id": 98,
    "stotraNumber": 98,
    "title": "गायत्रीस्तोत्रम् (१)",
    "category": "devi",
    "bookPage": 144,
    "pdfPage": 138
  },
  {
    "id": 99,
    "stotraNumber": 99,
    "title": "गायत्रीस्तोत्रम् (२)",
    "category": "devi",
    "bookPage": 146,
    "pdfPage": 140
  },
  {
    "id": 100,
    "stotraNumber": 100,
    "title": "सरस्वतीस्तोत्रम् (१)",
    "category": "devi",
    "bookPage": 147,
    "pdfPage": 141
  },
  {
    "id": 101,
    "stotraNumber": 101,
    "title": "सरस्वतीस्तोत्रम् (२)",
    "category": "devi",
    "bookPage": 149,
    "pdfPage": 143
  },
  {
    "id": 102,
    "stotraNumber": 102,
    "title": "नीलसरस्वतीस्तोत्रम्",
    "category": "devi",
    "bookPage": 150,
    "pdfPage": 144
  },
  {
    "id": 103,
    "stotraNumber": 103,
    "title": "कालीस्तोत्रम्",
    "category": "devi",
    "bookPage": 151,
    "pdfPage": 145
  },
  {
    "id": 104,
    "stotraNumber": 104,
    "title": "दत्तात्रेयस्तोत्रम् (घोरकष्टोद्धारणम्)",
    "category": "avatara",
    "bookPage": 160,
    "pdfPage": 154
  },
  {
    "id": 105,
    "stotraNumber": 105,
    "title": "शङ्कराचार्यकृतगुर्वाष्टकम्",
    "category": "avatara",
    "bookPage": 161,
    "pdfPage": 155
  },
  {
    "id": 106,
    "stotraNumber": 106,
    "title": "गुरुवरप्रार्थनापञ्चरत्नस्तोत्रम्",
    "category": "avatara",
    "bookPage": 162,
    "pdfPage": 156
  },
  {
    "id": 107,
    "stotraNumber": 107,
    "title": "दक्षिणामूर्तिस्तोत्रम्",
    "category": "avatara",
    "bookPage": 163,
    "pdfPage": 157
  },
  {
    "id": 108,
    "stotraNumber": 108,
    "title": "दशावतारस्तोत्रम्",
    "category": "avatara",
    "bookPage": 164,
    "pdfPage": 158
  },
  {
    "id": 109,
    "stotraNumber": 109,
    "title": "आर्तत्राणनारायणाष्टादशकम्",
    "category": "avatara",
    "bookPage": 165,
    "pdfPage": 159
  },
  {
    "id": 110,
    "stotraNumber": 110,
    "title": "पञ्चमहायुधस्तोत्रम्",
    "category": "avatara",
    "bookPage": 166,
    "pdfPage": 160
  },
  {
    "id": 111,
    "stotraNumber": 111,
    "title": "श्रीबलरामस्तोत्रम्",
    "category": "avatara",
    "bookPage": 167,
    "pdfPage": 161
  },
  {
    "id": 112,
    "stotraNumber": 112,
    "title": "मत्स्यस्तोत्रम्",
    "category": "avatara",
    "bookPage": 167,
    "pdfPage": 161
  },
  {
    "id": 113,
    "stotraNumber": 113,
    "title": "कूर्मस्तोत्रम्",
    "category": "avatara",
    "bookPage": 168,
    "pdfPage": 162
  },
  {
    "id": 114,
    "stotraNumber": 114,
    "title": "वराहस्तोत्रम्",
    "category": "avatara",
    "bookPage": 169,
    "pdfPage": 163
  },
  {
    "id": 115,
    "stotraNumber": 115,
    "title": "नृसिंहस्तोत्रम्",
    "category": "avatara",
    "bookPage": 169,
    "pdfPage": 163
  },
  {
    "id": 116,
    "stotraNumber": 116,
    "title": "लक्ष्मीनृसिंहस्तोत्रम्",
    "category": "avatara",
    "bookPage": 171,
    "pdfPage": 165
  },
  {
    "id": 117,
    "stotraNumber": 117,
    "title": "वामनस्तोत्रम् (१)",
    "category": "avatara",
    "bookPage": 172,
    "pdfPage": 166
  },
  {
    "id": 118,
    "stotraNumber": 118,
    "title": "वामनस्तोत्रम् (२)",
    "category": "avatara",
    "bookPage": 172,
    "pdfPage": 166
  },
  {
    "id": 119,
    "stotraNumber": 119,
    "title": "रामहृदयम् (अध्यात्मरामायणे)",
    "category": "rama",
    "bookPage": 174,
    "pdfPage": 168
  },
  {
    "id": 120,
    "stotraNumber": 120,
    "title": "रामस्तवराजः (सनत्कुमारसंहिता)",
    "category": "rama",
    "bookPage": 175,
    "pdfPage": 169
  },
  {
    "id": 121,
    "stotraNumber": 121,
    "title": "रामगीता (उत्तरकाण्डे)",
    "category": "rama",
    "bookPage": 180,
    "pdfPage": 174
  },
  {
    "id": 122,
    "stotraNumber": 122,
    "title": "श्रीरामरक्षास्तोत्रम् (बुधकौशिक)",
    "category": "rama",
    "bookPage": 185,
    "pdfPage": 179
  },
  {
    "id": 123,
    "stotraNumber": 123,
    "title": "ब्रह्मदेवकृतरामस्तुतिः",
    "category": "rama",
    "bookPage": 187,
    "pdfPage": 181
  },
  {
    "id": 124,
    "stotraNumber": 124,
    "title": "जटायुकृतरामस्तोत्रम्",
    "category": "rama",
    "bookPage": 188,
    "pdfPage": 182
  },
  {
    "id": 125,
    "stotraNumber": 125,
    "title": "रामाष्टकम् (१)",
    "category": "rama",
    "bookPage": 189,
    "pdfPage": 183
  },
  {
    "id": 126,
    "stotraNumber": 126,
    "title": "श्रीरामाष्टकम् (२)",
    "category": "rama",
    "bookPage": 189,
    "pdfPage": 183
  },
  {
    "id": 127,
    "stotraNumber": 127,
    "title": "श्रीमहादेवकृतरामस्तुतिः",
    "category": "rama",
    "bookPage": 190,
    "pdfPage": 184
  },
  {
    "id": 128,
    "stotraNumber": 128,
    "title": "अहल्याकृतरामस्तोत्रम्",
    "category": "rama",
    "bookPage": 191,
    "pdfPage": 185
  },
  {
    "id": 129,
    "stotraNumber": 129,
    "title": "इन्द्रकृतरामस्तोत्रम्",
    "category": "rama",
    "bookPage": 192,
    "pdfPage": 186
  },
  {
    "id": 130,
    "stotraNumber": 130,
    "title": "रामचन्द्राष्टकम्",
    "category": "rama",
    "bookPage": 193,
    "pdfPage": 187
  },
  {
    "id": 131,
    "stotraNumber": 131,
    "title": "श्रीसीतारामाष्टकम्",
    "category": "rama",
    "bookPage": 194,
    "pdfPage": 188
  },
  {
    "id": 132,
    "stotraNumber": 132,
    "title": "मारुतिस्तोत्रम् (समर्थ रामदासकृतम्)",
    "category": "maruti",
    "bookPage": 195,
    "pdfPage": 189
  },
  {
    "id": 133,
    "stotraNumber": 133,
    "title": "हनुमत्स्तोत्रम्",
    "category": "maruti",
    "bookPage": 196,
    "pdfPage": 190
  },
  {
    "id": 134,
    "stotraNumber": 134,
    "title": "श्रीहनुमत्ताण्डवस्तोत्रम्",
    "category": "maruti",
    "bookPage": 197,
    "pdfPage": 191
  },
  {
    "id": 135,
    "stotraNumber": 135,
    "title": "पञ्चमुखहनुमत्कवचम्",
    "category": "maruti",
    "bookPage": 198,
    "pdfPage": 192
  },
  {
    "id": 136,
    "stotraNumber": 136,
    "title": "एकादशमुखहनुमत्कवचम्",
    "category": "maruti",
    "bookPage": 201,
    "pdfPage": 195
  },
  {
    "id": 137,
    "stotraNumber": 137,
    "title": "त्रैलोक्यमङ्गलकवचम्",
    "category": "krishna",
    "bookPage": 203,
    "pdfPage": 197
  },
  {
    "id": 138,
    "stotraNumber": 138,
    "title": "श्रीबालरक्षा (श्रीमद्भागवते)",
    "category": "krishna",
    "bookPage": 205,
    "pdfPage": 199
  },
  {
    "id": 139,
    "stotraNumber": 139,
    "title": "श्रीकृष्णस्तवराजः",
    "category": "krishna",
    "bookPage": 206,
    "pdfPage": 200
  },
  {
    "id": 140,
    "stotraNumber": 140,
    "title": "भगवन्मानसपूजा",
    "category": "krishna",
    "bookPage": 207,
    "pdfPage": 201
  },
  {
    "id": 141,
    "stotraNumber": 141,
    "title": "देवकृतगर्भस्तुतिः",
    "category": "krishna",
    "bookPage": 208,
    "pdfPage": 202
  },
  {
    "id": 142,
    "stotraNumber": 142,
    "title": "वसुदेवकृतश्रीकृष्णस्तोत्रम्",
    "category": "krishna",
    "bookPage": 208,
    "pdfPage": 202
  },
  {
    "id": 143,
    "stotraNumber": 143,
    "title": "श्रीवेङ्कटेश्वरमङ्गलस्तोत्रम्",
    "category": "krishna",
    "bookPage": 209,
    "pdfPage": 203
  },
  {
    "id": 144,
    "stotraNumber": 144,
    "title": "बालकृतकृष्णस्तोत्रम्",
    "category": "krishna",
    "bookPage": 210,
    "pdfPage": 204
  },
  {
    "id": 145,
    "stotraNumber": 145,
    "title": "गोपालस्तोत्रम्",
    "category": "krishna",
    "bookPage": 210,
    "pdfPage": 204
  },
  {
    "id": 146,
    "stotraNumber": 146,
    "title": "कृष्णाष्टकम् (१)",
    "category": "krishna",
    "bookPage": 211,
    "pdfPage": 205
  },
  {
    "id": 147,
    "stotraNumber": 147,
    "title": "जगन्नाथाष्टकम्",
    "category": "krishna",
    "bookPage": 212,
    "pdfPage": 206
  },
  {
    "id": 148,
    "stotraNumber": 148,
    "title": "मोहिनीकृतश्रीकृष्णस्तोत्रम्",
    "category": "krishna",
    "bookPage": 213,
    "pdfPage": 207
  },
  {
    "id": 149,
    "stotraNumber": 149,
    "title": "ब्रह्मदेवकृतकृष्णस्तोत्रम्",
    "category": "krishna",
    "bookPage": 214,
    "pdfPage": 208
  },
  {
    "id": 150,
    "stotraNumber": 150,
    "title": "श्रीकृष्णस्तोत्रम् (नारदपञ्चरात्रे)",
    "category": "krishna",
    "bookPage": 214,
    "pdfPage": 208
  },
  {
    "id": 151,
    "stotraNumber": 151,
    "title": "श्रीकृष्णाष्टोत्तरशतनामस्तोत्रम्",
    "category": "krishna",
    "bookPage": 215,
    "pdfPage": 209
  },
  {
    "id": 152,
    "stotraNumber": 152,
    "title": "इन्द्रकृतकृष्णस्तोत्रम्",
    "category": "krishna",
    "bookPage": 217,
    "pdfPage": 211
  },
  {
    "id": 153,
    "stotraNumber": 153,
    "title": "विप्रपत्नीकृतकृष्णस्तोत्रम्",
    "category": "krishna",
    "bookPage": 218,
    "pdfPage": 212
  },
  {
    "id": 154,
    "stotraNumber": 154,
    "title": "गोकुलविंशतिस्तोत्रम्",
    "category": "krishna",
    "bookPage": 218,
    "pdfPage": 212
  },
  {
    "id": 155,
    "stotraNumber": 155,
    "title": "गोविन्दाष्टकम्",
    "category": "krishna",
    "bookPage": 220,
    "pdfPage": 214
  },
  {
    "id": 156,
    "stotraNumber": 156,
    "title": "श्रीगोपालाष्टकम्",
    "category": "krishna",
    "bookPage": 221,
    "pdfPage": 215
  },
  {
    "id": 157,
    "stotraNumber": 157,
    "title": "श्रीकृष्णाष्टकम् (भज हुंकारकृतम्)",
    "category": "krishna",
    "bookPage": 222,
    "pdfPage": 216
  },
  {
    "id": 158,
    "stotraNumber": 158,
    "title": "सत्यव्रतोक्तदामोदरस्तोत्रम् (दामोदराष्टकम्)",
    "category": "krishna",
    "bookPage": 223,
    "pdfPage": 217
  },
  {
    "id": 159,
    "stotraNumber": 159,
    "title": "ज्वरकृतकृष्णस्तोत्रम्",
    "category": "krishna",
    "bookPage": 224,
    "pdfPage": 218
  },
  {
    "id": 160,
    "stotraNumber": 160,
    "title": "श्रीकृष्णकवचम्",
    "category": "krishna",
    "bookPage": 225,
    "pdfPage": 219
  },
  {
    "id": 161,
    "stotraNumber": 161,
    "title": "कार्तवीर्यस्तोत्रम्",
    "category": "krishna",
    "bookPage": 227,
    "pdfPage": 221
  },
  {
    "id": 162,
    "stotraNumber": 162,
    "title": "कार्तवीर्यकवचम्",
    "category": "krishna",
    "bookPage": 228,
    "pdfPage": 222
  },
  {
    "id": 163,
    "stotraNumber": 163,
    "title": "गङ्गास्तुतिः",
    "category": "ganga",
    "bookPage": 229,
    "pdfPage": 223
  },
  {
    "id": 164,
    "stotraNumber": 164,
    "title": "शङ्कराचार्यकृतगङ्गाष्टकम्",
    "category": "ganga",
    "bookPage": 230,
    "pdfPage": 224
  },
  {
    "id": 165,
    "stotraNumber": 165,
    "title": "वाल्मीकिकृतगङ्गाष्टकम्",
    "category": "ganga",
    "bookPage": 231,
    "pdfPage": 225
  },
  {
    "id": 166,
    "stotraNumber": 166,
    "title": "कालिदासकृतगङ्गाष्टकम्",
    "category": "ganga",
    "bookPage": 232,
    "pdfPage": 226
  },
  {
    "id": 167,
    "stotraNumber": 167,
    "title": "गङ्गाष्टकम्",
    "category": "ganga",
    "bookPage": 233,
    "pdfPage": 227
  },
  {
    "id": 168,
    "stotraNumber": 168,
    "title": "गङ्गास्तवः (सत्यज्ञानानन्दतीर्थ)",
    "category": "ganga",
    "bookPage": 234,
    "pdfPage": 228
  },
  {
    "id": 169,
    "stotraNumber": 169,
    "title": "सत्यज्ञानानन्दतीर्थकृतगङ्गाष्टकम्",
    "category": "ganga",
    "bookPage": 235,
    "pdfPage": 229
  },
  {
    "id": 170,
    "stotraNumber": 170,
    "title": "प्रयागाष्टकम्",
    "category": "ganga",
    "bookPage": 236,
    "pdfPage": 230
  },
  {
    "id": 171,
    "stotraNumber": 171,
    "title": "काशीपञ्चकम्",
    "category": "ganga",
    "bookPage": 236,
    "pdfPage": 230
  },
  {
    "id": 172,
    "stotraNumber": 172,
    "title": "यमुनाष्टकम् (श्रीमद्वल्लभाचार्यकृतम्)",
    "category": "ganga",
    "bookPage": 237,
    "pdfPage": 231
  },
  {
    "id": 173,
    "stotraNumber": 173,
    "title": "यमुनाष्टकम् (शङ्कराचार्यकृतम्)",
    "category": "ganga",
    "bookPage": 238,
    "pdfPage": 232
  },
  {
    "id": 174,
    "stotraNumber": 174,
    "title": "नर्मदाष्टकम्",
    "category": "ganga",
    "bookPage": 239,
    "pdfPage": 233
  },
  {
    "id": 175,
    "stotraNumber": 175,
    "title": "पुष्कराष्टकम्",
    "category": "ganga",
    "bookPage": 239,
    "pdfPage": 233
  },
  {
    "id": 176,
    "stotraNumber": 176,
    "title": "श्रीमणिकर्णिकाष्टकम्",
    "category": "ganga",
    "bookPage": 240,
    "pdfPage": 234
  },
  {
    "id": 177,
    "stotraNumber": 177,
    "title": "सरस्वत्यष्टकम्",
    "category": "ganga",
    "bookPage": 241,
    "pdfPage": 235
  },
  {
    "id": 178,
    "stotraNumber": 178,
    "title": "आत्मपञ्चकम्",
    "category": "vedanta",
    "bookPage": 242,
    "pdfPage": 236
  },
  {
    "id": 179,
    "stotraNumber": 179,
    "title": "वैराग्यपञ्चकम्",
    "category": "vedanta",
    "bookPage": 242,
    "pdfPage": 236
  },
  {
    "id": 180,
    "stotraNumber": 180,
    "title": "धनाष्टकम्",
    "category": "vedanta",
    "bookPage": 243,
    "pdfPage": 237
  },
  {
    "id": 181,
    "stotraNumber": 181,
    "title": "विज्ञाननौका",
    "category": "vedanta",
    "bookPage": 243,
    "pdfPage": 237
  },
  {
    "id": 182,
    "stotraNumber": 182,
    "title": "द्वादशपञ्जरिकास्तोत्रम्",
    "category": "vedanta",
    "bookPage": 244,
    "pdfPage": 238
  },
  {
    "id": 183,
    "stotraNumber": 183,
    "title": "चर्पटपञ्जरिका (भज गोविन्दम्)",
    "category": "vedanta",
    "bookPage": 245,
    "pdfPage": 239
  },
  {
    "id": 184,
    "stotraNumber": 184,
    "title": "हस्तामलकस्तोत्रम्",
    "category": "vedanta",
    "bookPage": 246,
    "pdfPage": 240
  },
  {
    "id": 185,
    "stotraNumber": 185,
    "title": "आत्मबोधः",
    "category": "vedanta",
    "bookPage": 247,
    "pdfPage": 241
  },
  {
    "id": 186,
    "stotraNumber": 186,
    "title": "साधनपञ्चकम् (सोपानपञ्चकम्)",
    "category": "vedanta",
    "bookPage": 251,
    "pdfPage": 245
  },
  {
    "id": 187,
    "stotraNumber": 187,
    "title": "मनीषापञ्चकम्",
    "category": "vedanta",
    "bookPage": 251,
    "pdfPage": 245
  },
  {
    "id": 188,
    "stotraNumber": 188,
    "title": "वाक्यवृत्तिः",
    "category": "vedanta",
    "bookPage": 252,
    "pdfPage": 246
  },
  {
    "id": 189,
    "stotraNumber": 189,
    "title": "परापूजा",
    "category": "vedanta",
    "bookPage": 255,
    "pdfPage": 249
  },
  {
    "id": 190,
    "stotraNumber": 190,
    "title": "संक्षिप्त (मूल) रामायणम्",
    "category": "vedanta",
    "bookPage": 256,
    "pdfPage": 250
  },
  {
    "id": 191,
    "stotraNumber": 191,
    "title": "प्रश्नोत्तररत्नमालिका",
    "category": "vedanta",
    "bookPage": 260,
    "pdfPage": 254
  },
  {
    "id": 192,
    "stotraNumber": 192,
    "title": "सूर्यस्तोत्रम् (नवग्रहे)",
    "category": "navagraha",
    "bookPage": 263,
    "pdfPage": 257
  },
  {
    "id": 193,
    "stotraNumber": 193,
    "title": "चन्द्राष्टाविंशतिनामस्तोत्रम्",
    "category": "navagraha",
    "bookPage": 263,
    "pdfPage": 257
  },
  {
    "id": 194,
    "stotraNumber": 194,
    "title": "अङ्गारकस्तोत्रम्",
    "category": "navagraha",
    "bookPage": 264,
    "pdfPage": 258
  },
  {
    "id": 195,
    "stotraNumber": 195,
    "title": "ऋणमोचक मङ्गलस्तोत्रम्",
    "category": "navagraha",
    "bookPage": 264,
    "pdfPage": 258
  },
  {
    "id": 196,
    "stotraNumber": 196,
    "title": "बुधपञ्चविंशतिनामस्तोत्रम्",
    "category": "navagraha",
    "bookPage": 264,
    "pdfPage": 258
  },
  {
    "id": 197,
    "stotraNumber": 197,
    "title": "बृहस्पतिस्तोत्रम्",
    "category": "navagraha",
    "bookPage": 265,
    "pdfPage": 259
  },
  {
    "id": 198,
    "stotraNumber": 198,
    "title": "शुक्रस्तोत्रम्",
    "category": "navagraha",
    "bookPage": 265,
    "pdfPage": 259
  },
  {
    "id": 199,
    "stotraNumber": 199,
    "title": "शनैश्चरस्तोत्रम् (दशरथकृतम्)",
    "category": "navagraha",
    "bookPage": 265,
    "pdfPage": 259
  },
  {
    "id": 200,
    "stotraNumber": 200,
    "title": "शनैश्चरस्तोत्रम् (२)",
    "category": "navagraha",
    "bookPage": 267,
    "pdfPage": 261
  },
  {
    "id": 201,
    "stotraNumber": 201,
    "title": "शनिस्तोत्रम्",
    "category": "navagraha",
    "bookPage": 267,
    "pdfPage": 261
  },
  {
    "id": 202,
    "stotraNumber": 202,
    "title": "राहुस्तोत्रम्",
    "category": "navagraha",
    "bookPage": 268,
    "pdfPage": 262
  },
  {
    "id": 203,
    "stotraNumber": 203,
    "title": "केतुपञ्चविंशतिनामस्तोत्रम्",
    "category": "navagraha",
    "bookPage": 268,
    "pdfPage": 262
  },
  {
    "id": 204,
    "stotraNumber": 204,
    "title": "नवग्रहपीडाहरस्तोत्रम्",
    "category": "navagraha",
    "bookPage": 268,
    "pdfPage": 262
  },
  {
    "id": 205,
    "stotraNumber": 205,
    "title": "नवग्रहस्तोत्रम् (व्यासकृतम्)",
    "category": "navagraha",
    "bookPage": 269,
    "pdfPage": 263
  },
  {
    "id": 206,
    "stotraNumber": 206,
    "title": "शिवरामाष्टकस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 270,
    "pdfPage": 264
  },
  {
    "id": 207,
    "stotraNumber": 207,
    "title": "भगवत्प्रातःस्मरणस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 270,
    "pdfPage": 264
  },
  {
    "id": 208,
    "stotraNumber": 208,
    "title": "प्रातःस्मरणस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 271,
    "pdfPage": 265
  },
  {
    "id": 209,
    "stotraNumber": 209,
    "title": "अश्वत्थस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 271,
    "pdfPage": 265
  },
  {
    "id": 210,
    "stotraNumber": 210,
    "title": "नवनागस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 273,
    "pdfPage": 267
  },
  {
    "id": 211,
    "stotraNumber": 211,
    "title": "तुलसीकवचम्",
    "category": "sankeerna",
    "bookPage": 273,
    "pdfPage": 267
  },
  {
    "id": 212,
    "stotraNumber": 212,
    "title": "तुलसीस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 274,
    "pdfPage": 268
  },
  {
    "id": 213,
    "stotraNumber": 213,
    "title": "वेदव्यासाष्टकस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 275,
    "pdfPage": 269
  },
  {
    "id": 214,
    "stotraNumber": 214,
    "title": "अभिलाषाष्टकस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 275,
    "pdfPage": 269
  },
  {
    "id": 215,
    "stotraNumber": 215,
    "title": "चतुःश्लोकी भागवतम्",
    "category": "sankeerna",
    "bookPage": 276,
    "pdfPage": 270
  },
  {
    "id": 216,
    "stotraNumber": 216,
    "title": "सप्तश्लोकी गीता",
    "category": "sankeerna",
    "bookPage": 277,
    "pdfPage": 271
  },
  {
    "id": 217,
    "stotraNumber": 217,
    "title": "हयग्रीवपटलम्",
    "category": "sankeerna",
    "bookPage": 277,
    "pdfPage": 271
  },
  {
    "id": 218,
    "stotraNumber": 218,
    "title": "हयग्रीवकवचम्",
    "category": "sankeerna",
    "bookPage": 279,
    "pdfPage": 273
  },
  {
    "id": 219,
    "stotraNumber": 219,
    "title": "हयग्रीवाष्टोत्तरशतनामस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 280,
    "pdfPage": 274
  },
  {
    "id": 220,
    "stotraNumber": 220,
    "title": "कर्णस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 281,
    "pdfPage": 275
  },
  {
    "id": 221,
    "stotraNumber": 221,
    "title": "महामारीस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 283,
    "pdfPage": 277
  },
  {
    "id": 222,
    "stotraNumber": 222,
    "title": "मृतसंजीवनकवचम्",
    "category": "sankeerna",
    "bookPage": 285,
    "pdfPage": 279
  },
  {
    "id": 223,
    "stotraNumber": 223,
    "title": "अश्विनीकुमारस्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 286,
    "pdfPage": 280
  },
  {
    "id": 224,
    "stotraNumber": 224,
    "title": "पञ्चदेवतास्तोत्रम्",
    "category": "sankeerna",
    "bookPage": 287,
    "pdfPage": 281
  }
];
