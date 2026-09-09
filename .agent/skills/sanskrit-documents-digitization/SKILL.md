---
name: sanskrit-documents-digitization
description: "Master standard for digitizing, verifying, classifying, and transliterating Sanskrit and Vedic scriptures based on SanskritDocuments.org principles. Covers Vedic accents (svara), Grantha taxonomy, liturgical anatomy (Viniyoga, Nyasa, Dhyana), and source-fidelity verification."
---

# Sanskrit Documents & Vedic Scripture Digitization Standard

## Overview

This skill establishes the comprehensive methodology for high-fidelity digitization, verification, and structural classification of Hindu scriptures, Puja Granthas, Vedic suktas, upanishads, and stotras, inspired by the gold-standard architecture of [SanskritDocuments.org](https://sanskritdocuments.org/).

---

## 1. Scripture Classification & Taxonomy (शास्त्र वर्ग एवं देवता)

When digitizing Puja books and religious texts, categorize every text systematically:

### Deity Taxonomy (देवता):
- **गणेश (Ganesha)**: अथर्वशीर्ष, संकटनाशन स्तोत्र, सहस्रनाम, अष्टक, पञ्चरत्न
- **शिव (Shiva)**: रुद्राभिषेक (रुद्राष्टाध्यायी), शिवताण्डव, शिवमहिम्न, रुद्राष्टक, मृत्युञ्जय मन्त्र
- **देवी (Devi)**: दुर्गा सप्तशती, देव्यथर्वशीर्ष, श्रीसूक्त, ललिता सहस्रनाम, महिषासुरमर्दिनी, भवानी अष्टक
- **विष्णु / कृष्ण / राम (Vishnu/Krishna/Rama)**: विष्णु सहस्रनाम, पुरुषसूक्त, नारायणोपनिषद्, भगवद्गीता, गोपालसहस्रनाम, रामरक्षा स्तोत्र
- **सूर्य (Surya)**: आदित्यहृदय स्तोत्र, सौर सूक्त
- **हनुमान (Hanuman)**: हनुमान चालीसा, बजरंग बाण, हनुमानाष्टक, मारुति स्तोत्र
- **वैदिक / दार्शनिक (Vedic/Darshana)**: उपनिषद्, ब्रह्मसूत्र, शान्तिमन्त्र

### Grantha Types (ग्रन्थ वर्ग):
1. **वेद एवं उपनिषद् (Veda & Upanishat)**: वैदिक संहिता, ब्राह्मण, आरण्यक, १०८ उपनिषदें
2. **सूक्त (Sukta)**: ऋग्वैदिक/अथर्ववैदिक सूक्त (पुरुषसूक्त, श्रीसूक्त, नासदीय, मेधा, आयुष्)
3. **स्तोत्र (Stotra)**: महिम्न, स्तुति, प्रार्थना
4. **कवच (Kavacha)**: रक्षात्मक मन्त्र-कवच (नारायणकवच, गणेशकवच, दुर्गाकवच)
5. **सहस्रनाम / अष्टोत्तरशत (Sahasranama / Ashtottarashatanama)**: १००० एवं १०८ नाममाला
6. **गीता (Gita)**: भगवद्गीता, अवधूतगीता, अष्टावक्रगीता, ऋभुगीता
7. **पूजाविधि एवं अनुष्ठान (Puja Vidhi & Rituals)**: षोडशोपचार पूजा, हवन, तर्पण, अभिषेक

---

## 2. Liturgical Anatomy & Structure (पूजा ग्रन्थ की संरचना)

Every complete Puja Granth or Stotra follows a sacred anatomical order:

```text
1. मङ्गलाचरण / शान्ति पाठ (Mangalacharana / Shanti Patha)
        ↓
2. विनियोग (Viniyoga): ऋषि, छन्द, देवता, बीज, शक्ति, कीलक, प्रयोजन
        ↓
3. करन्यास एवं अङ्गन्यास (Karanyasa & Anganyasa)
        ↓
4. ध्यानम् (Dhyanam)
        ↓
5. मूल पाठ (Mula Shloka / Mantra with verse numbers ॥ १ ॥)
        ↓
6. फलश्रुति (Phala-shruti): पाठ करने का पुण्य, लाभ एवं विधि
        ↓
7. समर्पणम् / मङ्गलम् (Samarpanam: ॥ इति शुभम् ॥ / ॐ तत्सत्)
```

### Viniyoga Parsing Standard:
- **ऋषि (Rishi)**: दृष्टा ऋषि (उदा. गणक ऋषि, वाल्मीकि, वेदव्यास)
- **छन्द (Chhandas)**: गायत्री, अनुष्टुप्, त्रिष्टुप्, जगती, पंक्ति
- **देवता (Devata)**: उपास्य देव (उदा. श्रीमहागणपति, पराम्बा भगवती)
- **बीज / शक्ति / कीलक (Bija / Shakti / Kilaka)**: तान्त्रिक/वैदिक आधार

---

## 3. Vedic Svara Accents (सस्वर वैदिक पाठ एवं यूनिकोड)

Standard OCR drops or garbles Vedic accents. This standard enforces exact Unicode preservation:

| स्वर चिह्न | नाम | Unicode | विवरण एवं उदाहरण |
|---|---|---|---|
| `॑` | उदात्त / स्वरित (Udatta / Svarita) | `U+0951` | वर्ण के ऊपर खड़ी रेखा (उदा. `अ॒ग्निमी॑ळे`) |
| `॒` | अनुदात्त (Anudatta) | `U+0952` | वर्ण के नीचे आड़ी रेखा (उदा. `ॐ न॒मो`) |
| `᳚` | अतिस्वरित / दीर्घ स्वरित | `U+1CDA` | ऊपर दोहरी खड़ी रेखा (उदा. `पा॒हि सम॒न्ता᳚त्`) |
| `ꣳ` | वैदिक गुं-कार / अनुनासिक | `U+A8E3` | `सꣳहि॑ता` जैसे वैदिक सन्धि रूपों में प्रयुक्त |
| `ऽ` | अवग्रह (Avagraha) | `U+093D` | पूर्वरूप सन्धि में लुप्त 'अ' का सूचक (`सोऽहम्`, `कर्ताऽसि`) |
| `।` | एक दण्ड (Purna Virama) | `U+0964` | अर्ध-श्लोक विराम |
| `॥` | द्वि-दण्ड (Dirgha Virama) | `U+0965` | पूर्ण-श्लोक विराम |

---

## 4. Transliteration Rules (लिप्यन्तरण मानक)

The digitizer supports three synchronized representations:

1. **देवनागरी (Devanagari)**: `त्वमेव प्रत्यक्षं तत्त्वमसि`
2. **IAST (International Alphabet of Sanskrit Transliteration)**:
   - Vowels: `a, ā, i, ī, u, ū, ṛ, ṝ, ḷ, e, ai, o, au`
   - Modifiers: `ṃ` (anusvāra), `ḥ` (visarga), `'` (avagraha)
   - Consonants:
     - Guttural: `k, kh, g, gh, ṅ`
     - Palatal: `c, ch, j, jh, ñ`
     - Retroflex: `ṭ, ṭh, ḍ, ḍh, ṇ`
     - Dental: `t, th, d, dh, n`
     - Labial: `p, ph, b, bh, m`
     - Semivowels: `y, r, l, v`
     - Sibilants: `ś` (talavya), `ṣ` (murdhanya), `s` (dantya)
     - Aspirate: `h`
   - Example: *tvameva pratyakṣaṃ tattvamasi*
3. **ITRANS (ASCII-friendly format used by SanskritDocuments.org)**:
   - Example: `tvameva pratyakShaM tattvamasi`

---

## 5. Source-Fidelity Verification Principles

1. **Original Scan is Sovereign**:
   - Digital transcriptions, reference texts, and OCR engines are subordinate to the physical scanned printed page.
   - If the scan reads an archaic lithographic spelling (e.g. `लक्ष्मी` vs `लक्ष्मि`), transcribe exactly what is printed.
2. **No Silent Normalization or Auto-Correction**:
   - Canonical databases (like SanskritDocuments.org) are used **strictly as reference benchmarks for the reviewer**, never for automated silent text overwrite.
3. **Conjunct Ligature Integrity**:
   - Double consonants must always retain their virama/conjunct form (e.g. `तत्त्व` with `त्त`, never `ततत्व`).
4. **Zero-Noise Alert Philosophy**:
   - Do not flag ordinary, valid Sanskrit letters (`त`, `स`, `द`) indiscriminately.
   - Flag specific high-risk OCR error signatures:
     - Missed conjuncts (`ततत्व`)
     - Retroflex stops replacing aspirates (`ठर्ता`, `ढर्ता` for `धर्ता`)
     - Palatal stop replacing dental nasal (`जित्यम्` for `नित्यम्`)
     - Copular ending corruption (`ऽयि` for `ऽसि`)
     - ASCII pipes (`|`, `||`) replacing sacred dandas (`।`, `॥`)
     - Latin letters or digits embedded in Devanagari words

5. **Zero-Arbitrary-Numbering Axiom**:
   - Never guess or fabricate verse numbering arbitrarily ("अपने हिसाब से नंबरिंग नहीं करना").
   - Cross-verify verse counts against authentic recension standards (e.g., Śrīmad Bhagavad Gītā has exactly 700 verses across 18 chapters).
6. **Unicode Shaper Cleanliness & DTP Font Healing**:
   - Eliminate all legacy DTP font artifacts (`अों` ➔ `ओं`, `अो` ➔ `ओ`, `ृृ` ➔ `ॄ`).
   - Text must be 100% free of Unicode Dotted Circles (`◌` U+25CC).

---

## 6. Verification Checklist for Digitizers

- [ ] Original page scan clearly visible and high-resolution.
- [ ] Viniyoga, Rishi, Chhandas, and Devata clearly segmented.
- [ ] Mula verses numbered with verified canonical double dandas (`॥ १ ॥`), strictly conforming to recension counts without arbitrary numbering.
- [ ] Zero Unicode Dotted Circles (`◌`) or illegal independent vowel + matra sequences (`अों`, `अो`, `अै`).
- [ ] Double vocalic R ligatures normalized (`ॄ`, e.g. `भ्रातॄन्`, `पितॄन्`).
- [ ] Vedic accents (`॑`, `॒`) preserved if present in the printed grantha.
- [ ] No ASCII pipes (`|`) or colons (`:`) substituting sacred dandas or visargas.
- [ ] Devanagari and IAST transliterations verified for diacritical correctness.
- [ ] Reference comparison performed against SanskritDocuments.org canonical text.
