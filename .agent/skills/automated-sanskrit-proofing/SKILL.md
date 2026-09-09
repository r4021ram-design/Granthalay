---
name: automated-sanskrit-proofing
description: Comprehensive standard, rules, and algorithmic engine for automated proofreading, OCR post-processing, conjunct healing, Vedic accent preservation, and liturgical normalization of Sanskrit, Vedic, and Hindi scriptures.
---

# Automated Sanskrit Proofreading & Scripture Normalization Engine

## 1. Overview & Theoretical Foundation

This skill defines the gold standard for automated and assisted proofreading of digitized Sanskrit, Vedic, and Hindi scriptures. It integrates computational linguistics, Paninian grammar, and classical typographical standards from three international Sanskrit authorities:
1. **SanskritWeb (Ulrich Stiehl)**: Comprehensive Devanagari ligature matrix (800+ ligatures) and Vedic accent (Svara) codification.
2. **University of Hyderabad (UoHyd) Sanskrit Computational Linguistics Corpus**: Paninian Sandhi rules (सन्धि), Padachheda (पदच्छेद) segmentation, and morpho-syntactic normalization.
3. **Lalitaalaalitah**: Authentic classical Stotra prosody, Chhandas (छन्द), and devotional text proofing.

When digitizing scriptures from scanned manuscripts, lithographs, or PDFs, raw OCR engines (Tesseract, Cloud Vision) inevitably generate systematic errors in complex Sanskrit conjuncts (संयुक्ताक्षर), Vedic accents, liturgical symbols, and formatting. This engine heals, proofreads, and verifies sacred texts with absolute source fidelity.

---

## 2. Ulrich Stiehl's SanskritWeb Vedic Svara & Ligature Standards

### 2.1 Vedic Accents (वैदिक स्वर-विधान)

In Vedic recitation (Ṛgveda, Yajurveda, Sāmaveda, Atharvaveda), pitch accents convey grammatical and theological meaning. Raw OCR often misreads accents as stray scratches, apostrophes, quotation marks, or commas.

| Vedic Svara | Unicode Codepoint | Visual Form | Typographical Name | OCR Misread Pattern | Canonical Correction Rule |
|---|---|---|---|---|---|
| **Anudātta (अनुदात्त)** | `\u0952` (`॒`) | `क॒` (Horizontal bar below) | COMBINING DEVANAGARI STRESS SIGN ANUDATTA | `क_`, `क -`, `क_`, underline artifacts | Restore `\u0952` attached to preceding base syllable |
| **Svarita (स्वरित)** | `\u0951` (`॑`) | `क॑` (Vertical line above) | COMBINING DEVANAGARI STRESS SIGN UDATTA | `क'`, `क"`, `क|`, `क’`, `क’` | Restore `\u0951` directly above preceding vowel/syllable |
| **Dvisvarita / Dīrgha Svarita (द्विस्वरित)** | `\u1CDA` / `\u0951\u0951` | `क᳚` (Double vertical stroke above) | VEDIC TONE DOUBLE SVARITA | `क''`, `क""` | Map to `\u1CDA` or normalized double svarita |
| **Avagraha (अवग्रह)** | `\u093D` (`ऽ`) | `सोऽहम्` | DEVANAGARI SIGN AVAGRAHA | `सो'हम्`, `सो5हम्`, `सो ह्म्`, `सोहम्` | Restore `ऽ` (`\u093D`) across Purvarupa sandhi |
| **Jihvāmūlīya (जिह्वामूलीय)** | `\u1CF5` (`ᳵ`) | `ᳵक`, `ᳵख` | VEDIC SIGN JIHVAMULIYA | `(क`, `Xक`, `ःक` | Archaic voiceless velar spirant before `क/ख` |
| **Upadhmānīya (उपध्मानीय)** | `\u1CF6` (`ᳶ`) | `ᳶप`, `ᳶफ` | VEDIC SIGN UPADHMANIYA | `(प`, `Xप`, `ःप` | Archaic voiceless bilabial spirant before `प/फ` |
| **Vedic Anusvāra (गुं / गूँ)** | `\u0901` (`ँ`) / `\uA8E0`–`\uA8F1` | `य॒ज्ञं᳐` / `ॐ॒` | COMBINING DEVANAGARI SIGN CANDRABINDU VIRAMA | Dropped or rendered as simple `ं` | Preserved in Vedic chants (e.g. *अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑*) |

### 2.2 SanskritWeb 800+ Devanagari Ligature Matrix (संयुक्ताक्षर)

Devanagari scripts from classical presses (Nirnaya Sagar Press, Motilal Banarsidass, Gita Press) utilize specialized ligatures. Modern OCR engines decompose them or substitute incorrect phonetic approximations:

1. **Ha-Conjuncts (ह-कार संयुक्ताक्षर):**
   - `ह्` + `ण` = **`ह्ण`** (e.g. *अपराह्ण* — OCR often renders `अपरान्ह` or `अपराहण`)
   - `ह्` + `न` = **`ह्न`** (e.g. *वह्नि*, *जह्नु* — OCR often renders `वहिन`, `वहनी`, `वहनि`)
   - `ह्` + `म` = **`ह्म`** (e.g. *ब्रह्म*, *ब्राह्मण* — OCR renders `ब्रम्ह`, `ब्रम`, `ब्रह्म`)
   - `ह्` + `य` = **`ह्य`** (e.g. *सह्य*, *गृह्य* — OCR renders `सहय`, `साह्य`, `ग्राह्म` ➔ `ग्राह्य`)
   - `ह्` + `ल` = **`ह्ल`** (e.g. *प्रह्लाद*, *आह्लाद* — OCR renders `प्रल्हाद`, `प्रहलाद`)
   - `ह्` + `व` = **`ह्व`** (e.g. *आह्वान*, *जिह्वा* — OCR renders `आहवान`, `जिव्हा`)
   - `ह्` + `ऋ` = **`हृ`** (e.g. *हृदय*, `हृषीकेश` — OCR renders `ह्रदय`, `हदिय`, `हिदय`)

2. **Guttural Nasal Conjuncts (ङ्-कार संयुक्ताक्षर):**
   - `ङ्` + `क` = **`ङ्क`** (e.g. *अङ्क* — OCR often renders `अंक`, `अड.्क`, `अङ् क`)
   - `ङ्` + `ख` = **`ङ्ख`** (e.g. *शङ्ख* — OCR renders `शंख`, `शङख`, `शड.्ख`)
   - `ङ्` + `ग` = **`ङ्ग`** (e.g. *गङ्गा*, *मङ्गळ* — OCR renders `गंगा`, `गङगा`, `गंग`)
   - `ङ्` + `घ` = **`ङ्घ`** (e.g. *सङ्घ* — OCR renders `संघ`, `सङघ`)

3. **Palatal Conjuncts (ञ् / श् संयुक्ताक्षर):**
   - `ञ्` + `च` = **`ञ्च`** (e.g. *पञ्च* — OCR renders `पांच`, `पन्च`, `पंच`)
   - `ञ्` + `छ` = **`ञ्छ`** (e.g. *वाञ्छा* — OCR renders `वांछा`, `वाच्छा`)
   - `ञ्` + `ज` = **`ञ्ज`** (e.g. *कुञ्ज* — OCR renders `कुंज`, `कुन्ज`)
   - `श्` + `च` = **`श्च`** (e.g. *निश्चय*, *कश्चित्* — OCR renders `निश्‍चय`, `कस्चित्`)
   - `श्` + `न` = **`श्न`** (e.g. *प्रश्न* — OCR renders `प्रस्न`, `प्रशन`)
   - `श्` + `र` = **`श्र`** (e.g. *श्री*, *विश्राम* — OCR renders `स्री`, `श्री`)
   - `श्` + `व` = **`श्व`** (e.g. *विश्व*, *अश्व* — OCR renders `विस्व`, `अस्व`, `विश्चैवेदाः` ➔ `विश्ववेदाः`)

4. **Lingual / Retroflex Conjuncts (ष् / ट् / ठ् / ड् संयुक्ताक्षर):**
   - `ष्` + `ट` = **`ष्ट`** (e.g. *कष्ट*, *दृष्ट* — OCR renders `कस्ट`, `द्रष्ट`)
   - `ष्` + `ठ` = **`ष्ठ`** (e.g. *श्रेष्ठ*, *प्रतिष्ठा* — OCR renders `श्रेष्ट`, `प्रतिस्टा`)
   - `ष्` + `ण` = **`ष्ण`** (e.g. *कृष्ण*, *विष्णु* — OCR renders `क्रिसन`, `विसनु`)
   - `द्` + `द` = **`द्द`** (e.g. *उद्देश्य* — OCR renders `उद्देश`, `उद्रेश`)
   - `द्` + `ध` = **`द्ध`** (e.g. *शुद्ध*, *सिद्धि* — OCR renders `सुद्ध`, `सिद्वि`)
   - `द्` + `भ` = **`द्भ`** (e.g. *अद्भुत* — OCR renders `अदभुत`, `अद्भुत`)
   - `द्` + `व` = **`द्व`** (e.g. *द्वार*, *द्वन्द्व* — OCR renders `द्रार`, `द्रदरामय`, `द्वन्द्र`)


### 2.3 Legacy DTP Font Conversion & Unicode Normalization (Chanakya / Kruti-Dev / Walkman)

Classical Indian presses (Gita Press Gorakhpur, Chaukhamba, Motilal Banarsidass) originally set digital texts in legacy 8-bit non-Unicode DTP fonts (Chanakya, Kruti-Dev, Walkman-Chanakya, Shusha). When these legacy encodings are converted or OCR-extracted, they produce predictable phonetic corruptions, broken ligatures, and illegal combining sequences.

#### 1. The Dotted Circle (`◌` U+25CC / U+25CB) Root Cause
In 8-bit fonts, composite vowels were keyed by combining independent vowel glyphs with combining matras. For example, the sacred syllable `ओं` was keyed as `अ` + `ो` + `ं` (`अों`).
In modern Unicode OpenType text shapers (HarfBuzz, Uniscribe, CoreText), attaching a combining matra (e.g. `ो` `\u094B`) to an independent vowel (e.g. `अ` `\u0905`) is structurally illegal. Because an independent vowel is not a consonant, the shaper cannot apply a vowel matra to it, forcing font engines to render a **Dotted Circle (`◌`)** placeholder artifact.

**Mandatory Canonical Normalization Table:**
| Illegal Vowel Sequence | Unicode Codepoint Error | Canonical Unicode Glyphs | Correct Sacred Character |
|---|---|---|---|
| `अों` | `\u0905\u094B\u0902` | `ओं` (`\u0913\u0902`) | **ओं** (Pranava / Om) |
| `अो` | `\u0905\u094B` | `ओ` (`\u0913`) | **ओ** (Independent O) |
| `अौ` | `\u0905\u094C` | `औ` (`\u0914`) | **औ** (Independent Au) |
| `अै` | `\u0905\u0948` | `ऐ` (`\u0910`) | **ऐ** (Independent Ai) |
| `अे` | `\u0905\u0947` | `ए` (`\u090F`) | **ए** (Independent E) |
| `अा` | `\u0905\u093E` | `आ` (`\u0906`) | **आ** (Independent Aa) |
| `अी` | `\u0905\u0940` | `ई` (`\u0908`) | **ई** (Independent Ii) |
| `अि` | `\u0905\u093F` | `इ` (`\u0907`) | **इ** (Independent I) |
| `अू` | `\u0905\u0942` | `ऊ` (`\u090A`) | **ऊ** (Independent Uu) |
| `अु` | `\u0905\u0941` | `उ` (`\u0909`) | **उ** (Independent U) |
| `अृ` | `\u0905\u0943` | `ऋ` (`\u090B`) | **ऋ** (Independent Vocalic R) |

#### 3. Complete Chanakya DTP Font Ligature Matrix & Healing Rules
When parsing raw Chanakya PDF glyph streams or OCR transcripts, unmapped ASCII artifacts must be healed corpus-wide:

| Legacy Character / Artifact | Canonical Scripture Glyph | Example Corrupted Words | Healed Canonical Scripture Form | Grammatical / Shastra Context |
|---|---|---|---|---|
| `@` | **`ञ्च`** | `च@ल`, `मनश्च@ल`, `पा@जन्य`, `प@म`, `का@न`, `कि@ित्`, `स@य`, `विमु@ति` | **`चञ्चल`**, **`मनश्चञ्चल`**, **`पाञ्चजन्य`**, **`पञ्चम`**, **`काञ्चन`**, **`किञ्चित्`**, **`सञ्चय`**, **`विमुञ्चति`** | Palatal nasal-stop conjunct (ञ् + च) |
| `%` | **`त्न`** | `प्रय%ा`, `असप%`, `प%ी`, `य%` | **`प्रयत्न`**, **`असपत्न`**, **`पत्नी`**, **`यत्न`** | Retroflex/dental conjunct (त् + न) |
| `À` | **`ल्`** | `किÀबषः`, `अकÀमषम्`, `उÀलंघन`, `कÀप`, `स्वÀप`, `बÀकि`, `सङ्कÀप`, `अÀप` | **`किल्बिषः`**, **`अकल्मषम्`**, **`उल्लङ्घन`**, **`कल्प`**, **`स्वल्प`**, **`बल्कि`**, **`सङ्कल्प`**, **`अल्प`** | Half-la (ल्) conjunct |
| `®` | **`िं`** / **`•`** | `बुद्धि®`, `सिद्धि®`, `प्रकृति®`, `शान्ति®`, `गति®`, `दुर्गति®`, `रात्रि®`, `आवृत्ति®`, `प्रवृत्ति®`, `निवृत्ति®`, `भक्ति®`, `अहिंसा®` | **`बुद्धिं`**, **`सिद्धिं`**, **`प्रकृतिं`**, **`शान्तिं`**, **`गतिं`**, **`दुर्गतिं`**, **`रात्रिं`**, **`आवृत्तिं`**, **`प्रवृत्तिं`**, **`निवृत्तिं`**, **`भक्तिं`**, **`अहिंसा`** | Accusative singular feminine `-इम्` / trailing bullet |
| `ˆ` | **`ह्ण`** | `गृह्ˆाति`, `गृह्ˆन्`, `निगृह्ˆामि` | **`गृह्णाति`**, **`गृह्णन्`**, **`निगृह्णामि`** | Ha-conjunct (ह् + ण) |
| `´` | **`ऋ`** | `´क्साम`, `´ग्वेद`, `देव´णरूप`, `´षि`, `´तु`, `´तेऽपि` | **`ऋक्साम`**, **`ऋग्वेद`**, **`देवऋणरूप`**, **`ऋषि`**, **`ऋतु`**, **`ऋतेऽपि`** | Independent Vocalic R (`\u090B`) |
| `‰` | **`ु`** | `द्रष्ट‰म्`, `प्रवेष्ट‰ं`, `श्र‰त्वा`, `क्षणभङ्ग‰र` | **`द्रष्टुम्`**, **`प्रवेष्टुं`**, **`श्रुत्वा`**, **`क्षणभङ्गुर`** | Chhoti u matra after retroflex conjuncts |
| `∏` | **`ढ़`** / nukta | `ब∏कर`, `ज∏ें` | **`बढ़कर`**, **`जड़ें`** | Hindi nukta conjuncts (ढ़/ड़) |
| `Ï` | **`र्तिं`** | `कीÏ`, `अकीÏ` | **`कीर्तिं`**, **`अकीर्तिं`** | Repha + ti + anusvara |
| `^` | **`ट्ट`** | `मि^ी`, `ख^े` | **`मिट्टी`**, **`खट्टे`** | Retroflex geminate |
| `_` | **`ट्ठ`** | `चि_े` | **`चिट्ठे`** | Retroflex aspirate geminate |
| `Â` | **`ू`** | `लड़Âँगा`, `करÂँगा` | **`लड़ूँगा`**, **`करूँगा`** | Badi uu matra before candrabindu |
| `÷˝` | **`भ्र`** | `÷˝ंशते`, `वि÷˝मः` | **`भ्रंशते`**, **`विभ्रमः`** | Bha + ra-phala |
| `d` (before vowel) | **`स्र`** | `dंसते` | **`स्रंसते`** | BG 1.30: *गाण्डीवं स्रंसते हस्तात्* |
| `([क-ह])[˝]` | **`$1्र`** | `भ˝ातृ`, `वि˝म` | **`भ्रातृ`**, **`विभ्रम`** | Consonant + `˝` ➔ ra-phala |
| `भोगान्रुधिरप्रदिग्यधान्` | **`भोगान्रुधिरप्रदिग्धान्`** | BG 2.5 OCR error | **`भोगान्रुधिरप्रदिग्धान्`** | Digdhan |
| `अस्वग्यर्यमर्कीतकरमर्जुन` | **`अस्वर्ग्यमकीर्तिकरमर्जुन`** | BG 2.2 OCR error | **`अस्वर्ग्यमकीर्तिकरमर्जुन`** | Asvargyamakirtikaramarjuna |
| `अृ` | `\u0905\u0943` | `ऋ` (`\u090B`) | **ऋ** (Independent Vocalic R) |

#### 2. Double Vocalic R (`ॄ` U+0944) Ligature Healing
Legacy fonts could not represent the long vocalic R sign (`ॄ`), so compositors typed two short vocalic R signs sequentially: `ृृ` or `ÎÎ`.
- `भ[˝]ातृृन्` ➔ **`भ्रातॄन्`** (Bhagavad Gita 1.26: *भ्रातॄंस्तथैव च*)
- `पितृृन्` / `पितृृनथ` ➔ **`पितॄनथ`** (Bhagavad Gita 1.26: *पितॄनथ पितामहान्*)
- Normalization Rule: `text.replace(/ृ\s*ृ/gu, 'ॄ')`

#### 3. Unmapped Chanakya Ligatures & Trailing Repha/Ra-phala Glyphs
When parsing raw Chanakya PDF glyph streams, unmapped ASCII artifacts must be healed:
| Legacy Glyph / Artifact | Corrupted Output | Canonical Scripture Form | Example Context |
|---|---|---|---|
| `÷˝` | `÷˝` / `˝` | **`भ्र`** | *भ्रंशते*, *विभ्रमः* |
| `d` (isolated before vowel) | `dंसते` | **`स्रंसते`** | Bhagavad Gita 1.30: *गाण्डीवं स्रंसते हस्तात्* |
| `@` | `रोमा@` / `@` | **`ञ्च`** / **`रोमाञ्च`** | Bhagavad Gita 1.29: *रोमहर्षश्च जायते* / *रोमाञ्च* |
| `Âँ` / `Â` | `लड़Âँगा` / `Â` | **`ूँ`** / **`ू`** | Bhagavad Gita 2.4 translation: *लड़ूँगा?* |
| `Mँ` / `mँ` | `कMँगा` | **`रूँ`** / **`करूँगा`** | Bhagavad Gita 2.9 translation: *युद्ध नहीं करूँगा* |
| `सङ्ख्यये` | Unneeded ya-shruti | **`सङ्ख्ये`** | Bhagavad Gita 2.4: *कथं भीष्ममहं सङ्ख्ये* |
| `भोगान्रुधिरप्रदिग्यधान्` | `ग्यध` ligature OCR corruption | **`भोगान्रुधिरप्रदिग्धान्`** | Bhagavad Gita 2.5: *भुञ्जीय भोगान्रुधिरप्रदिग्धान्* |
| `अस्वग्यर्यमर्कीतकरमर्जुन` | Broken repha placement | **`अस्वर्ग्यमकीर्तिकरमर्जुन`** | Bhagavad Gita 2.2: *अनार्यजुष्टमस्वर्ग्यमकीर्तिकरमर्जुन* |
| `अश्राु` / `श्राु` | Stray aa-matra before ra-phala | **`अश्रु`** / **`श्रु`** | *अश्रुपूर्णाकुलेक्षणम्*, *श्रुत्वा* |
| `श्ृ` | Halanta sha + vocalic r | **`शृ`** | *शृणोति* |
| `àSÕ` | `àSÕ` | **`त्स्थ`** | *अन्तस्थ*, *हृत्स्थ* |
| `ÁˇÊ` | `ÁˇÊ` | **`क्षि`** | *क्षीर*, *क्षिति* |
| `NU` | `NU` | **`हृ`** | *हृदय*, *हृषीकेश* |
| `ÛÊ` | `ÛÊ` | **`न्न`** | *प्रसन्न*, *अन्न* |
| `•Ù¥` / `•Ù¢` / `•Ê¥` | Stray bullets/vowels | **`ओं`** | Mangalacharana invocation |
| `([क-ह])[˝]` | Consonant + `˝` | **`$1्र`** | `भ˝ातृ` ➔ `भ्रातृ`, `वि˝म` ➔ `विभ्रम` |

---

## 3. UoHyd Paninian Sandhi & Padachheda Engine Standards

The Department of Sanskrit Studies, University of Hyderabad (UoHyd) establishes computational models for Paninian Sandhi (सन्धि) and Padachheda (पदच्छेद).

### 3.1 Paninian Sandhi Classification & Healing Rules

1. **Svara Sandhi (स्वर सन्धि):**
   - **Savarna Dīrgha (सकः सवर्णे दीर्घः):** `अ/आ + अ/आ` ➔ `आ`; `इ/ई + इ/ई` ➔ `ई`; `उ/ऊ + उ/ऊ` ➔ `ऊ`; `ऋ + ऋ` ➔ `ॠ`.
     - *OCR Repair:* Fix spurious shortened vowels in mantras (e.g. `हरीः` ➔ `हरिः`, `नुतन` ➔ `नूतन`, `ववकास` ➔ `विकास`).
   - **Guṇa Sandhi (आद्गुणः):** `अ/आ + इ/ई` ➔ `ए`; `अ/आ + उ/ऊ` ➔ `ओ`; `अ/आ + ऋ` ➔ `अर्`.
     - *OCR Repair:* `सूर्योदय` (not `सूर्य्योदय` or `सूर्यउदय`).
   - **Vṛddhi Sandhi (वृद्धिरेचि):** `अ/आ + ए/ऐ` ➔ `ऐ`; `अ/आ + ओ/औ` ➔ `औ`.
     - *OCR Repair:* `एकैकम्` (not `एकएकम्`), `तथैव` (not `तथाएव`).
   - **Yaṇ Sandhi (इको यणचि):** `इ/ई` + असमान स्वर ➔ `य्`; `उ/ऊ` + असमान स्वर ➔ `व्`; `ऋ` + असमान स्वर ➔ `र्`.
     - *OCR Repair:* `इत्यादि` (not `इतीआदि`), `स्वस्ति` (not `सुअस्ति`).
   - **Pūrvarūpa Sandhi (एङः पदान्तादति):** `ए/ओ + अ` ➔ `एऽ/ओऽ` (indicated by Avagraha `ऽ`).
     - *OCR Repair:* When OCR omits the avagraha (`गतोपि` ➔ `गतोऽपि`, `सोहम्` ➔ `सोऽहम्`, `श्रावणिकेपि` ➔ `श्रावणिकेऽपि`).

2. **Visarga Sandhi (विसर्ग सन्धि):**
   - **Sattva (विसर्जनीयस्य सः):** Visarga before `च्/छ्` ➔ `श्`; before `ट्/ठ्` ➔ `ष्`; before `त्/थ्` ➔ `स्`.
     - *Examples:* `कः + चित्` = `कश्चित्`; `धनुः + टङ्कारः` = `धनुष्टङ्कारः`; `नमः + ते` = `नमस्ते`.
   - **Utva (अतो रोरप्लुतादप्लुते):** `अः + अ` ➔ `ओऽ`; `अः + हश्` (voiced consonants) ➔ `ओ`.
     - *Examples:* `शिवः + अहम्` = `शिवोऽहम्`; `मनः + हरः` = `मनोहरः`.
   - **Ropa / Rutva (ससजुषो रुः):** Visarga becomes `र्` after any vowel other than `अ/आ`.
     - *Examples:* `मुनिः + अयम्` = `मुनिरयम्`; `हरिः + ॐ` = `हरिर्यथा`.
   - **Visarga Lopa (भोभगोअघोअपूर्वस्य योऽशि):** Visarga dropped before vowels or voiced consonants.
     - *Examples:* `देवाः + आगताः` = `देवा आगताः`.

3. **Vyañjana Sandhi (व्यञ्जन सन्धि):**
   - **Schutva (स्तोः श्चुना श्चुः):** `स्/त्-वर्ग` + `श्/च्-वर्ग` ➔ `श्/च्-वर्ग`. (e.g. `सत् + चित्` = `सच्चित्`).
   - **Jaśtva (झलां जशोऽन्ते):** Stop consonants become voiced non-aspirates (e.g. `वाक् + ईशः` = `वागीशः`, `जगत् + ईशः` = `जगदीशः`).
   - **Anunāsika (यरोऽनुनासिकेऽनुनासिको वा):** `सत् + मतिः` = `सन्मतिः`; `वाक् + मयम्` = `वाङ्मयम्`.

### 3.2 Padachheda (पदच्छेद) Engine Protocol

For students, pujaris, and liturgical practitioners, Granth supports interactive **Padachheda (पदच्छेद)** mode:
- **Compounded Shloka:** `सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥`
- **Padachheda Representation:** `सर्व-मङ्गल-माङ्गल्ये शिवे सर्व-अर्थ-साधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमः अस्तु ते ॥`
- **Rules for Padachheda Separation:**
  1. Separate samasa elements using a thin hyphen (`-`) or space.
  2. Restore underlying un-sandhied words (e.g. `नमोऽस्तु` ➔ `नमः अस्तु`, `सर्वार्थ` ➔ `सर्व-अर्थ`).
  3. Keep case endings (विभक्ति) attached to the final noun stem.

### 3.3 The JavaScript Unicode Regex Word Boundary Trap (`\b` Pitfall)

In JavaScript's `RegExp` engine (V8, JavaScriptCore, SpiderMonkey), `\b` strictly checks for an ASCII word boundary (i.e., a transition between `[A-Za-z0-9_]` and non-ASCII/non-word characters).
Because **all Devanagari characters (`\u0900`–`\u097F`) are non-word characters in JS regexes**, `\b` fails completely on Devanagari text:
- `/\bकहा\b/u.test("अर्जुन ने कहा ।")` ➔ `false`! (Because space is non-word, and `क` is non-word; two non-words have NO `\b` boundary between them!)
- `/\bबजाये\b/u.test("शंख बजाये ॥")` ➔ `false`!

**MANDATORY CODING AXIOM:**
**NEVER use `\b` for Devanagari script matching in JavaScript/TypeScript.**
Always use explicit boundary capture groups or Lookbehinds/Lookaheads:
```typescript
// Pattern 1: Boundary character class
const DEVANAGARI_BOUNDARY = '(?:^|[\\s.,!?-।॥])';
const hindiVerbRegex = new RegExp(`${DEVANAGARI_BOUNDARY}(किया|कहा|बोले|उठे|बजाया|दिये|देखा|हुए|है|था|थी|थे|होता|होते|सकते|चाहिए|लगे|पड़े|गये)${DEVANAGARI_BOUNDARY}`, 'u');

// Pattern 2: Lookbehind and Lookahead (ES2018+)
const safeWordRegex = /(?<=^|[\s.,!?-।॥])(कहा|बोले|उठे|बजाया)(?=$|[\s.,!?-।॥])/gu;
```

---

## 4. Master Shastra Conjunct Healing Dictionaries

### 4.1 Vedic Liturgical & Karmakanda Dictionary

| Raw OCR Distortion | Canonical Scripture Form | Category | Canonical Shastra Context |
|---|---|---|---|
| `गहस्रेश` / `गृहप्र वेश` | **`गृहप्रवेश`** | Vastushastra | Grihapravesha ceremonies |
| `कप्रिष्म` / `क्िप्त` / `वक्ष्र` | **`क्षिप्र`** | Jyotisha | Kshipra nakshatras (Ashvini, Pushya, Hasta) |
| `स्री` / `स्रीगेह` / `स्रीगेहपुत्राम` | **`स्त्री`** / **`स्त्रीगेह`** / **`स्त्रीगेहपुत्रात्म`** | Shloka | Muhurta Chintamani |
| `द्रीशेऽनले` / `िीशेऽनले` | **`दिशेऽनले`** | Shloka | Vastu Shanti Muhurta |
| `द्रदरामय` / `द्नदरामय` | **`द्वन्द्वामय`** | Shloka | Dvandvamaya (quarrel and illness) |
| `द्वन्द्र` / `द्नद्र` | **`द्वन्द्व`** | Grammar / Shloka | Dvandva |
| `द्रार` / `द्रारहोतो` | **`द्वार`** / **`द्वार हो तो`** | Vastushastra | Door orientation |
| `पुथिवी` / `पृवथवी` | **`पृथिवी`** | Vedic Mantra | Prithvi Sukta & Swasti Vachana |
| `धुताः` / `धुता` | **`धृताः`** / **`धृता`** | Vedic Mantra | *धृता मनसो...* |
| `मूदु` / `मुदु` | **`मृदु`** | Jyotisha | Mridu nakshatras (Mrigashira, Citra, Anuradha, Revati) |
| `धुवैः` / `धुव` | **`ध्रुवैः`** / **`ध्रुव`** | Jyotisha | Dhruva / Sthira nakshatras (Rohini, Uttaras) |
| `इनदरो` / `स्वस्तिन इनदरो` | **`इन्द्रो`** / **`स्वस्ति न इन्द्रो`** | Rigveda 1.89.6 | Swasti Sukta |
| `पुषा विश्चैवेदाः` | **`पूषा विश्ववेदाः`** | Rigveda 1.89.6 | Swasti Sukta |
| `नस्ताक््यो` / `तस्ताक््यो` | **`तार्क्ष्यो`** / **`नस्तार्क्ष्यो`** | Rigveda 1.89.6 | Tarkshya (Garuda) |
| `तदश्चिना` | **`तदश्विना`** | Rigveda | Ashvini Kumaras |
| `शुणुतन्` / `शृिुत` | **`शृणुतं`** | Vedic Imperative | *देवाः शृणुतं यद् भद्रम्* |
| `तमीशानन्` | **`तमीशानं`** | Vedic Mantra | *तमीशानं जगतस्तस्थुषस्पतिम्* |
| `जगतस् तस्थुषस्पतिन्` | **`जगतस्तस्थुषस्पतिं`** | Vedic Mantra | *जगतस्तस्थुषस्पतिं धियञ्जिन्वमवसे हूमहे वयं* |
| `भेषजन्` | **`भेषजं`** | Vedic Mantra | Medicine / Healing |
| `पुश्चिमातरः` | **`पृश्निमातरः`** | Rigveda | Maruts |
| `सर्वविध्न` | **`सर्वविघ्न`** | Mangalacharana | All obstacles |
| `सर्वमंगलमांगल्ये` | **`सर्वमङ्गलमाङ्गल्ये`** | Devi Mahatmya | Standard Sanskrit orthography |
| `अमंगलम` | **`अमङ्गलम्`** | Shloka | Inauspicious |
| `मंगलायतनो` | **`मङ्गलायतनो`** | Shloka | Mangalayatan |
| `सोमनार` | **`सोमवार`** | Panchanga | Monday |
| `हरीः` | **`हरिः`** | Shanti Mantra | *हरिः ॐ* |
| `गतोपि` / `श्रावणिकेपि` | **`गतोऽपि`** / **`श्रावणिकेऽपि`** | Sandhi | Avagraha restoration |
| `आहुवत` / `पीूयहबुत` | **`आहुति`** / **`पूर्णाहुति`** | Karmakanda | Purnahuti |
| `अवनन` / `बबलदान` | **`अग्नि`** / **`बलिदान`** | Karmakanda | Fire / Balidana |
| `पूष्पांजबल` | **`पुष्पांजलि`** | Karmakanda | Pushpanjali |
| `चतुः पवि योगनी` | **`चतुःषष्टि योगिनी`** | Mandala | 64 Yoginis |
| `वसो◌्र्धारा` / `वसोर् धारा` | **`वसोर्धारा`** | Karmakanda | Vasordhara |
| `दशबदनपाल` | **`दशदिग्पाल`** | Mandala | 10 Directional Guardians |
| `कुशकवण्डका` | **`कुशकण्डिका`** | Havan Vidhi | Foundation ritual of Havan |
| `सप्तस्थल` | **`सप्तघृत`** | Matrika | Sapta Ghrita Matrika |
| `प्रवेशािति्‌विधः` | **`प्रवेशस्त्रिविधः`** | Shloka | Three kinds of Grihapravesha |
| `यात्राबसाने` | **`यात्रानिवृत्तौ`** | Shloka | Muhurta Chintamani verse |
| `भयाननवेऽ` | **`भयान्नवेऽध्वगे`** | Shloka | Muhurta Chintamani verse |
| `नाऽऽवश्यमस्तादिविचारणाऽत्र` | **`नाऽऽवश्यमस्तार्कविचारणाऽत्र`** | Shloka | Muhurta Chintamani verse |
| `जीर्त` / `जीिय` | **`जीर्ण`** | Shloka | Jirna (renovated house) |
| `सपूवत` / `अपूवत` | **`सपूर्व`** / **`अपूर्व`** | Shloka | Apoorva & Sapurva Grihapravesha |
| `शावन्र्` / `शावन्त` | **`शान्ति`** | Term | Shanti |
| `पद्धवत` | **`पद्धति`** | Book Title | Paddhati |
| `वथथवर्` | **`स्थिति`** | Term | Sthiti |
| `ललए` / `लवधान` / `लवलहत` | **`लिए`** / **`विधान`** / **`विहित`** | Hindi / Sanskrit | `ि`-matra OCR shift |
| `िारदा` | **`शारदा`** | Deity | Sharada Devi |
| `नैर् ऋत् य` | **`नैर्ऋत्य`** | Direction | South-West Direction |
| `चंद्रबलं` | **`चन्द्रबलं`** | Jyotisha | Lunar strength |

---

## 5. Algorithmic Implementation in TypeScript

---

## 5. Canonical Verse Numbering & Recension Authority Standards

### 5.1 The Zero-Arbitrary-Numbering Axiom (प्रमाणीकृत श्लोक संख्याङ्कन नियम)
In sacred literature, verse numbers are not decorative indices—they are liturgical coordinates and theological anchors referenced across millennia of commentaries (*Bhashyas* by Adi Shankara, Ramanuja, Madhva, Abhinavagupta, etc.).
- **STRICT PROTOCOL:** **NEVER invent, skip, or guess verse numbering arbitrarily ("अपने हिसाब से नंबरिंग नहीं करना").**
- Verse numbering must always be cross-verified against authoritative recensions (SanskritDocuments.org, VedicScriptures API, Gita Press Gorakhpur, Mahabharata Critical Edition).

### 5.2 Canonical Recension Benchmark: Śrīmad Bhagavad Gītā (700 Verses)
Every authentic recension of the Bhagavad Gita contains exactly **700 verses** distributed across 18 Adhyayas (Mahabharata Bhishma Parva, chapters 25–42):

| Adhyaya | Yoga / Chapter Title | Canonical Verse Count | Canonical End Verse Marker |
|---|---|---|---|
| **1** | अर्जुनविषादयोग | **47** | `॥ ४७ ॥` |
| **2** | सांख्ययोग | **72** | `॥ ७२ ॥` |
| **3** | कर्मयोग | **43** | `॥ ४३ ॥` |
| **4** | ज्ञानकर्मसंन्यासयोग | **42** | `॥ ४२ ॥` |
| **5** | कर्मसंन्यासयोग | **29** | `॥ २९ ॥` |
| **6** | आत्मसंयमयोग (ध्यानयोग) | **47** | `॥ ४७ ॥` |
| **7** | ज्ञानविज्ञानयोग | **30** | `॥ ३० ॥` |
| **8** | अक्षरब्रह्मयोग | **28** | `॥ २८ ॥` |
| **9** | राजविद्याराजगुह्ययोग | **34** | `॥ ३४ ॥` |
| **10** | विभूतियोग | **42** | `॥ ४२ ॥` |
| **11** | विश्वरूपदर्शनयोग | **55** | `॥ ५५ ॥` |
| **12** | भक्तियोग | **20** | `॥ २० ॥` |
| **13** | क्षेत्रक्षेत्रज्ञविभागयोग | **35** (or 34 without opening query) | `॥ ३५ ॥` |
| **14** | गुणत्रयविभागयोग | **27** | `॥ २७ ॥` |
| **15** | पुरुषोत्तमयोग | **20** | `॥ २० ॥` |
| **16** | दैवासुरसम्पद्विभागयोग | **24** | `॥ २४ ॥` |
| **17** | श्रद्धात्रयविभागयोग | **28** | `॥ २८ ॥` |
| **18** | मोक्षसंन्यासयोग | **78** | `॥ ७८ ॥` |
| **Total** | **सकल श्रीमद्भगवद्गीता** | **700** | **सप्तशती पूर्णम्** |

### 5.3 Verse-Translation Number Synchronization (श्लोक-अनुवाद संख्याङ्कन सामञ्जस्य)
Traditional Indian prints (especially Gita Press editions) format shlokas with interleaved Hindi translation, often splitting a verse across paragraphs:
1. **The Scanned Layout Pattern:**
   ```text
   धृतराष्ट्र उवाच
   धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।
   मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥
   धृतराष्ट्र बोले—हे सञ्जय! धर्मभूमि कुरुक्षेत्रमें एकत्रित, युद्धकी इच्छावाले मेरे और पाण्डुके पुत्रोंने क्या किया? ॥ १ ॥
   ```
2. **The Digitizer / Shaper Problem:**
   The Sanskrit verse terminates with an open danda (`॥`) without a verse number, while the verse number (`॥ १ ॥`) is placed at the end of the Hindi translation.
3. **Canonical Synchronization Protocol:**
   - The engine must extract the verified verse number from the Hindi line (e.g. `॥ १ ॥`) and attach it to the Sanskrit verse:
     `धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः । मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥ १ ॥`
   - The Hindi translation retains its number or is synchronized cleanly:
     `धृतराष्ट्र बोले—हे सञ्जय! धर्मभूमि कुरुक्षेत्रमें एकत्रित, युद्धकी इच्छावाले मेरे और पाण्डुके पुत्रोंने क्या किया? ॥ १ ॥`
   - If a multi-verse group occurs (e.g. verses 4–6 spoken together), number the group canonically: `॥ ४-६ ॥`.

---

## 6. Algorithmic Implementation in TypeScript

The proofreading engine implements these rules with complete DTP font healing, illegal vowel normalization, and boundary-safe regexes:

```typescript
/**
 * Canonical Devanagari Normalization Engine
 * Eliminates DTP font artifacts, resolves dotted circles, and repairs ligatures.
 */
export function normalizeDevanagariUnicode(text: string): string {
  if (!text) return '';
  let s = text;

  // 1. DTP Illegal Vowel Combinations (Eliminating Dotted Circle \u25CC artifacts)
  s = s.replace(/अ\s*ों/gu, 'ओं');
  s = s.replace(/अ\s*ो/gu, 'ओ');
  s = s.replace(/अ\s*ौ/gu, 'औ');
  s = s.replace(/अ\s*ै/gu, 'ऐ');
  s = s.replace(/अ\s*े/gu, 'ए');
  s = s.replace(/अ\s*ा/gu, 'आ');
  s = s.replace(/अ\s*ी/gu, 'ई');
  s = s.replace(/अ\s*ि/gu, 'इ');
  s = s.replace(/अ\s*ू/gu, 'ऊ');
  s = s.replace(/अ\s*ु/gu, 'उ');
  s = s.replace(/अ\s*ृ/gu, 'ऋ');

  // 2. Double Vocalic R Ligatures (ृृ -> ॄ)
  s = s.replace(/ृ\s*ृ/gu, 'ॄ');
  s = s.replace(/भ[˝]?ातृ\s*ृन्/gu, 'भ्रातॄन्');
  s = s.replace(/पितृ\s*ृन्/gu, 'पितॄन्');
  s = s.replace(/पितृ\s*ृनथ/gu, 'पितॄनथ');

  // 3. Unmapped Chanakya DTP Font Ligatures
  s = s.replace(/÷˝/gu, 'भ्र');
  s = s.replace(/dंसते/gu, 'स्रंसते');
  s = s.replace(/(?:^|\s)d(?=[ािीुूेैोौंः])/gu, 'स्र');
  s = s.replace(/रोमा@/gu, 'रोमाञ्च');
  s = s.replace(/@/gu, 'ञ्च');
  s = s.replace(/àSÕ/gu, 'त्स्थ');
  s = s.replace(/ÁˇÊ/gu, 'क्षि');
  s = s.replace(/NU/gu, 'हृ');
  s = s.replace(/ÛÊ/gu, 'न्न');
  s = s.replace(/•Ù[¥¢]|•Ê¥/gu, 'ओं');
  s = s.replace(/•Ù/gu, 'ओ');
  s = s.replace(/•ı/gu, 'औ');

  // 4. Trailing ra-phala healing (e.g. भ˝ातृ -> भ्रातृ)
  s = s.replace(/([क-ह])\s*˝/gu, '$1्र');

  // 5. Strip any stray Dotted Circle characters directly
  s = s.replace(/[\u25CC\u25CB]/gu, '');

  return s;
}

/**
 * Liturgical Line Separator: Distinguishes Sanskrit Shlokas from Hindi Anuvad
 * Note:
 * 1. Must use whole-word boundary wrappers so that Sanskrit words containing
 *    syllables like 'था' (महारथाः, अश्वत्थामा), 'ते' (ब्रवीमि ते), or 'का' (नायका)
 *    are NEVER falsely flagged as Hindi!
 * 2. 'ये' (\u092F\u0947) is a fundamental SANSKRIT relative pronoun (यद्: यः यौ ये,
 *    e.g. 'मामेव ये प्रपद्यन्ते', 'यतन्ति ये', 'ये विदुः'). It must NEVER be treated as Hindi!
 * 3. Sanskrit locatives (लोके, नरके) and Atmanepada verbs (भाषसे, मन्यसे, लभसे)
 *    must be protected from attached Hindi suffix matching.
 * 4. Consonant-plus-matra ranges must use [\u0900-\u097F] instead of [क-ह] so
 *    inflected nouns (रूपोंको, कर्मोके) are correctly recognized without breaking.
 */
export function isHindiAnuvadLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;

  // Lines with question marks are Hindi translation/commentary
  if (/[?？]/.test(trimmed)) return true;

  // Complete Hindi verbs, copulas, and auxiliaries as distinct words
  const HINDI_VERB_BOUNDARY = /(?:^|[\s.,!?—–\-])(?:किया|किये|किए|कहा|कहते|बोले|बोला|बोली|उठे|उठा|बजाया|बजाये|बजाए|दिये|दिया|दिए|लिये|लिया|लिए|देखा|देखते|हुए|हुआ|हुई|है|हैं|हूँ|था|थी|थे|होता|होते|होती|सकते|सकता|सकती|चाहिए|लगे|लगा|लगी|पड़े|पड़ा|पड़ी|गये|गया|गयी|गए|गई|बतलाता|बतलाते|बतलाती)(?:$|[\s.,!?—–।॥\-])/u;
  if (HINDI_VERB_BOUNDARY.test(trimmed)) return true;

  // Distinct Hindi interrogative words
  const HINDI_INTERROGATIVE = /(?:^|[\s.,!?—–\-])(?:क्या|क्यों|कैसे|किसने|किसको|किसके|कहाँ|कब)(?:$|[\s.,!?—–।॥\-])/u;
  if (HINDI_INTERROGATIVE.test(trimmed)) return true;

  // Plural Hindi oblique postposition suffixes with full Unicode range
  const HINDI_OBLIQUE_PLURAL = /[\u0900-\u097F]+(?:ोंमें|ोंने|ोंको|ोंके|ोंकी|ोंपर|ोंसे|ोंवाले)(?:$|[\s.,!?—–।॥\-])/u;
  if (HINDI_OBLIQUE_PLURAL.test(trimmed)) return true;

  // Attached Hindi postposition suffixes (protecting Sanskrit: लोके, नरके, भाषसे, etc.)
  const HINDI_ATTACHED_SUFFIX = /(?<!\b(?:लो|नर|वृ|बाल|पुस्त))[\u0900-\u097F]{2,}(?:में|ने|को|का|की|के)(?:$|[\s.,!?—–।॥\-])/u;
  const HINDI_ATTACHED_SE = /(?<!\b(?:भाष|मन्य|लभ|अर्ह|य))[\u0900-\u097F]{2,}से(?:$|[\s.,!?—–।॥\-])/u;
  if (HINDI_ATTACHED_SUFFIX.test(trimmed) || HINDI_ATTACHED_SE.test(trimmed)) return true;

  // Obvious Hindi narrative openers
  if (/^(?:इसके\s*(?:बाद|अनन्तर|पश्चात्)|संजय\s*बोले|अर्जुन\s*बोले|श्रीभगवान्\s*बोले|धृतराष्ट्र\s*बोले|कौरवोंमें|भीष्मपितामहद्वारा|इसलिये|और\s*भी|आप-)/u.test(trimmed)) {
    return true;
  }

  return false;
}
```

---

## 7. Quality & Verification Protocol

A scripture folio or digital edition is certified **GOLD STANDARD** only when:
1. **Recension Integrity Verified:** Verse counts strictly match canonical standards (e.g. Gita 700 verses across 18 chapters) without arbitrary numbering.
2. **Zero Dotted Circles (`◌` U+25CC):** No illegal combining vowel sequences (`अों`, `अो`, `अै`, etc.) exist anywhere in the text.
3. **Conjunct & Ligature Fidelity:**
   - Double vocalic R (`ॄ`) correctly normalized (e.g. `भ्रातॄन्`, `पितॄन्`).
   - Legacy DTP ligatures (`भ्र`, `स्र`, `ञ्च`, `त्स्थ`, `क्षि`, `हृ`, `न्न`) fully restored.
4. **Zero Commercial Noise:** Completely purged of modern publisher names, telephone numbers, and publication dates.
5. **Vedic Accent Integrity:** Svarita (`॑`), Anudatta (`॒`), and Dvisvarita (`᳚`) remain correctly unified with their base syllables.
6. **Liturgical Formatting:** Speaker attributions (`... उवाच`) are badged, sacred invocations (`ॐ`, `॥ श्रीपरमात्मने नमः ॥`) are centered headlines, and verses and translations have synchronized canonical numbers.
