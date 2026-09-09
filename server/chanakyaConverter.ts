export function chanakyaToUnicode(text: string): string {
  if (!text) return '';

  let str = text;

  // 1. Standard punctuation & markers
  str = str.replace(/H/g, ' ॥ ');
  str = str.replace(/–/g, ' । ');
  str = str.replace(/ó/g, '-');
  str = str.replace(/˙/g, 'ॐ ');
  str = str.replace(/\*/g, ' ');
  str = str.replace(/“/g, '"');
  str = str.replace(/”/g, '"');

  // 2. Chanakya Anusvara & Chandrabindu
  str = str.replace(/¥/g, 'ं');
  str = str.replace(/¢/g, 'ं');
  str = str.replace(/°/g, 'ँ');
  str = str.replace(/—/g, 'ः');
  str = str.replace(/˘/g, 'ऽ');

  // Common Hindi words with '•ı' and whole vowels with matras
  str = str.replace(/•ı⁄U/g, 'और');
  str = str.replace(/•ı⁄/g, 'और');
  str = str.replace(/•ı/g, 'औ');
  str = str.replace(/•Ù¥/g, 'ओं');
  str = str.replace(/•Ù¢/g, 'ओं');
  str = str.replace(/•Ù/g, 'ओ');
  str = str.replace(/•Ê¥/g, 'ओं');
  str = str.replace(/•Ê¢/g, 'ओं');
  str = str.replace(/•Ê/g, 'ओ');
  str = str.replace(/•ÊÒ/g, 'औ');
  str = str.replace(/•Ê/g, 'आ');
  str = str.replace(/•Ò/g, 'ऐ');
  str = str.replace(/•/g, 'ए');
  str = str.replace(/•/g, 'अ');
  str = str.replace(/ß¸/g, 'ई');
  str = str.replace(/ß/g, 'इ');
  str = str.replace(/™U/g, 'ऊ');
  str = str.replace(/™/g, 'ऊ');
  str = str.replace(/©U/g, 'उ');
  str = str.replace(/©/g, 'उ');
  str = str.replace(/ÖÊ/g, 'ऋ');
  str = str.replace(/∞/g, 'ऐ');
  str = str.replace(/∞/g, 'ए');

  // 4. 'H' (ह) Ligature Family (U is ligature container)
  str = str.replace(/„ÒU/g, 'है');
  str = str.replace(/„Ò/g, 'है');
  str = str.replace(/„UÊ/g, 'हो');
  str = str.replace(/„UÊÒ/g, 'हौ');
  str = str.replace(/„UÊ/g, 'हा');
  str = str.replace(/„UË/g, 'ही');
  str = str.replace(/„ÈU/g, 'हु');
  str = str.replace(/„ÍU/g, 'हू');
  str = str.replace(/„U/g, 'हे');
  str = str.replace(/„U/g, 'ह');
  str = str.replace(/„/g, 'ह');

  // 5. Special title & known compound words
  str = str.replace(/üÊË◊jªfleËÃÊ/g, 'श्रीमद्भगवद्गीता');
  str = str.replace(/◊jªfleËÃÊ/g, 'मद्भगवद्गीता');
  str = str.replace(/◊j/g, 'म्द');
  str = str.replace(/fleË/g, 'द्गी');

  // 6. Subjoined ra-phala on K: ∑˝§ = क्र
  str = str.replace(/∑˝§Ê/g, 'क्रो');
  str = str.replace(/∑˝§ÊÒ/g, 'क्रौ');
  str = str.replace(/∑˝§Ê/g, 'क्रा');
  str = str.replace(/∑˝§Ë/g, 'क्री');
  str = str.replace(/∑˝§È/g, 'क्रु');
  str = str.replace(/∑˝§Í/g, 'क्रू');
  str = str.replace(/∑˝§/g, 'क्रे');
  str = str.replace(/∑˝§Ò/g, 'क्रै');
  str = str.replace(/∑˝§/g, 'क्र');
  str = str.replace(/∑˝/g, 'क्र');

  // 7. Special conjuncts & ligatures
  str = str.replace(/œÎCÔUlÈ◊AmÊ⁄UÊ/g, 'धृष्टद्युम्नद्वारा');
  str = str.replace(/œÎCÔUlÈ◊A/g, 'धृष्टद्युम्न');
  str = str.replace(/œÎCÔlÈÈ◊AÙ/g, 'धृष्टद्युम्नो');
  str = str.replace(/‚ÜôÊÊÕZ/g, 'संज्ञार्थं');
  str = str.replace(/®‚„U/g, 'सिंह');
  str = str.replace(/®‚/g, 'सिंह');
  str = str.replace(/®∑§/g, 'किं');
  str = str.replace(/ÁflŸlÙìı—/g, 'विनद्योच्चैः');
  str = str.replace(/ìı—/g, 'च्चैः');
  str = str.replace(/ìı/g, 'च्चै');
  str = str.replace(/ì/g, 'च्च');
  str = str.replace(/‚È‚ÁîÊÃ/g, 'सुसज्जित');
  str = str.replace(/îÊ/g, 'ज्जि');
  str = str.replace(/î/g, 'ज्ज');
  str = str.replace(/•¬ÿÊ¸#¢/g, 'अपर्याप्तं');
  str = str.replace(/¬ÿÊ¸#¢/g, 'पर्याप्तं');
  str = str.replace(/#/g, 'प्त');
  str = str.replace(/‡ÊW¢/g, 'शङ्खं');
  str = str.replace(/W/g, 'ङ्ख');
  str = str.replace(/ä◊ı/g, 'ध्मौ');
  str = str.replace(/ä◊/g, 'ध्म');
  str = str.replace(/Xêÿ/g, 'ङ्गम्य');
  str = str.replace(/Xfl/g, 'ङ्गव');
  str = str.replace(/Xê/g, 'ङ्गम');

  // Glyph å = प्
  str = str.replace(/åÃ/g, 'प्त');
  str = str.replace(/åÿ/g, 'प्य');
  str = str.replace(/åŸ/g, 'प्न');
  str = str.replace(/å/g, 'प्');

  // Glyph ä = ध्
  str = str.replace(/äÿ/g, 'ध्य');
  str = str.replace(/ä/g, 'ध्');

  // Glyph ë = च्
  str = str.replace(/ë¿/g, 'च्छ');
  str = str.replace(/ë/g, 'च्');

  // Glyph æ = ङ्
  str = str.replace(/æ˜U/g, 'ङ्');
  str = str.replace(/æ/g, 'ङ्');

  // Glyph ƒ = य्य
  str = str.replace(/ƒ/g, 'य्य');

  // Glyph ∂ in ‡∂ = श्ल
  str = str.replace(/‡∂/g, 'श्ल');
  str = str.replace(/∂/g, 'ल');

  // Lingual ra-phala ˛ = ्र
  str = str.replace(/«˛U/g, 'ड्र');
  str = str.replace(/«˛/g, 'ड्र');
  str = str.replace(/˛/g, '्र');

  // Subjoined A (n)
  str = str.replace(/¬AÊ/g, 'प्नो');
  str = str.replace(/¬AÊ/g, 'प्ना');
  str = str.replace(/¬A/g, 'प्न');
  str = str.replace(/◊AÙ/g, 'म्नो');
  str = str.replace(/◊AÊ/g, 'म्ना');
  str = str.replace(/◊A/g, 'म्न');
  str = str.replace(/ÉÊAÊ/g, 'घ्ना');
  str = str.replace(/ÉÊA/g, 'घ्न');
  str = str.replace(/ªAÊ/g, 'ग्ना');
  str = str.replace(/ªA/g, 'ग्न');
  str = str.replace(/oAÈ/g, 'श्नु');
  str = str.replace(/oA/g, 'श्न');
  str = str.replace(/o/g, 'श्');
  str = str.replace(/A/g, '्न');

  // 'p' family = श्च (p in Chanakya is ligature sh-cha)
  str = str.replace(/pÒ/g, 'श्चै');
  str = str.replace(/p/g, 'श्चे');
  str = str.replace(/pÊ/g, 'श्चा');
  str = str.replace(/p/g, 'श्च');

  // 'E' family = श्व
  str = str.replace(/EÊ/g, 'श्वो');
  str = str.replace(/EÊÒ/g, 'श्वौ');
  str = str.replace(/EÊ/g, 'श्वा');
  str = str.replace(/EË/g, 'श्वी');
  str = str.replace(/EÈ/g, 'श्वु');
  str = str.replace(/EÍ/g, 'श्वू');
  str = str.replace(/E/g, 'श्वे');
  str = str.replace(/EÒ/g, 'श्वै');
  str = str.replace(/Eà/g, 'श्वत्');
  str = str.replace(/E/g, 'श्व');
  str = str.replace(/‡fl/g, 'श्व');

  // 'Û' family = न्न
  str = str.replace(/ÁÛÊ/g, 'न्नि');
  str = str.replace(/ÁÛ/g, 'न्नि');
  str = str.replace(/ÛÊ/g, 'न्न');
  str = str.replace(/Û/g, 'न्न');

  // 'ü' family = श्र
  str = str.replace(/üÊË/g, 'श्री');
  str = str.replace(/üÊ/g, 'श्रे');
  str = str.replace(/üÙ/g, 'श्रे');
  str = str.replace(/üÊÒ/g, 'श्रै');
  str = str.replace(/üÊÊ/g, 'श्रा');
  str = str.replace(/üÊ/g, 'श्रा');
  str = str.replace(/üÈ/g, 'श्रु');
  str = str.replace(/üÍ/g, 'श्रू');
  str = str.replace(/ü/g, 'श्र');

  // 'ô' and 'Ü' family
  str = str.replace(/ÜôÊ/g, 'ज्ञा');
  str = str.replace(/Üô/g, 'ज्ञ');
  str = str.replace(/Ü¿˛/g, 'न्छ्र');
  str = str.replace(/ôÊ/g, 'ज्ञे');
  str = str.replace(/ôÊÒ/g, 'ज्ञै');
  str = str.replace(/ôÊÊ/g, 'ज्ञा');
  str = str.replace(/ôÊ/g, 'ज्ञा');
  str = str.replace(/ô/g, 'ज्ञ्');
  str = str.replace(/Ü/g, 'ञ्');

  // Bar-consonants
  str = str.replace(/ˇÊ/g, 'क्षे');
  str = str.replace(/ˇÊÒ/g, 'क्षै');
  str = str.replace(/ˇÊÊ/g, 'क्षा');
  str = str.replace(/ˇÊ/g, 'क्ष');
  str = str.replace(/ˇ/g, 'क्ष्');

  str = str.replace(/òÊ/g, 'त्रे');
  str = str.replace(/òÊÒ/g, 'त्रै');
  str = str.replace(/òÊÊ/g, 'त्रा');
  str = str.replace(/òÊ/g, 'त्र');
  str = str.replace(/ò/g, 'त्र्');

  str = str.replace(/áÊ/g, 'णे');
  str = str.replace(/áÊÒ/g, 'णै');
  str = str.replace(/áÊÊ/g, 'णा');
  str = str.replace(/áÊ/g, 'ण');
  str = str.replace(/á/g, 'ण्');

  str = str.replace(/‡Ê/g, 'शे');
  str = str.replace(/‡ÊÒ/g, 'शै');
  str = str.replace(/‡ÊÊ/g, 'शा');
  str = str.replace(/‡Ê/g, 'श');
  str = str.replace(/‡/g, 'श्');

  str = str.replace(/‚Ê/g, 'सो');
  str = str.replace(/‚ÊÒ/g, 'सौ');
  str = str.replace(/‚Ê/g, 'सा');
  str = str.replace(/‚/g, 'स');
  str = str.replace(/S/g, 'स्');

  // Letter K (क) variations with embedded matras
  str = str.replace(/∑§Ê/g, 'को');
  str = str.replace(/∑§ÊÒ/g, 'कौ');
  str = str.replace(/∑§Ê/g, 'का');
  str = str.replace(/∑§Ë/g, 'की');
  str = str.replace(/∑È§/g, 'कु');
  str = str.replace(/∑Í§/g, 'कू');
  str = str.replace(/∑Î§/g, 'कृ');
  str = str.replace(/∑§/g, 'के');
  str = str.replace(/∑Ò§/g, 'कै');
  str = str.replace(/∑¢§/g, 'कं');
  str = str.replace(/∑§/g, 'क');
  str = str.replace(/∑/g, 'क्');

  // Letter V (व) variations
  str = str.replace(/flÊ/g, 'वो');
  str = str.replace(/flÊÒ/g, 'वौ');
  str = str.replace(/flÊ/g, 'वा');
  str = str.replace(/flË/g, 'वी');
  str = str.replace(/flÈ/g, 'वु');
  str = str.replace(/flÍ/g, 'वू');
  str = str.replace(/flÎ/g, 'वृ');
  str = str.replace(/fl/g, 'वे');
  str = str.replace(/flÒ/g, 'वै');
  str = str.replace(/fl˝/g, 'व्र');
  str = str.replace(/fl/g, 'व');

  // Double matras
  str = str.replace(/Ê/g, 'ो');
  str = str.replace(/ÊÒ/g, 'ौ');
  str = str.replace(/Ù/g, 'ो');
  str = str.replace(/ı/g, 'ौ');

  // Complex ligatures & conjuncts: CÔU is ष्ट, DÔU is ष्ठ!
  str = str.replace(/CÔU˛/g, 'ष्ट्र');
  str = str.replace(/CÔ˛/g, 'ष्ट्र');
  str = str.replace(/CÔU/g, 'ष्ट');
  str = str.replace(/CÔÊ/g, 'ष्टा');
  str = str.replace(/CÔ/g, 'ष्ट');
  str = str.replace(/DÔU/g, 'ष्ठ');
  str = str.replace(/DÔÊ/g, 'ष्ठा');
  str = str.replace(/DÔ/g, 'ष्ठ');
  str = str.replace(/¶/g, 'ष्ट्वा');

  str = str.replace(/ë¿/g, 'च्छ');
  str = str.replace(/¿ÊÊ/g, 'छा');
  str = str.replace(/¿Ê/g, 'छ');
  str = str.replace(/¿/g, 'छ्');

  str = str.replace(/Àÿ/g, 'ल्य');
  str = str.replace(/Öÿ/g, 'ज्य');
  str = str.replace(/Ö/g, 'ज्');

  str = str.replace(/’˝rÊ/g, 'ब्रह्म');
  str = str.replace(/’˝/g, 'ब्र');
  str = str.replace(/’ãœ/g, 'बन्ध');
  str = str.replace(/’/g, 'ब');

  str = str.replace(/Äÿ/g, 'क्य');
  str = str.replace(/Ä/g, 'क्');
  str = str.replace(/ûÊ/g, 'त्त');
  str = str.replace(/û/g, 'त्त्');
  str = str.replace(/k/g, 'द्म');
  str = str.replace(/h/g, 'द्ध');
  str = str.replace(/l/g, 'द्य');
  str = str.replace(/m/g, 'द्व');
  str = str.replace(/rÊ/g, 'ह्म');
  str = str.replace(/r/g, 'ह्म');
  str = str.replace(/s/g, 'ह्य');
  str = str.replace(/j/g, 'द्');
  str = str.replace(/e/g, 'द्');

  str = str.replace(/NU/g, 'हृ');
  str = str.replace(/äÿ/g, 'ध्य');
  str = str.replace(/√ÿ/g, 'व्य');
  str = str.replace(/Sfl/g, 'स्व');
  str = str.replace(/àfl/g, 'त्व');

  str = str.replace(/ê◊/g, 'म्म');
  str = str.replace(/ê¬/g, 'म्प');
  str = str.replace(/ê’/g, 'म्ब');
  str = str.replace(/ê÷/g, 'म्भ');
  str = str.replace(/ê/g, 'म्');

  str = str.replace(/ãœ/g, 'न्ध');
  str = str.replace(/ãÃ/g, 'न्त');
  str = str.replace(/ãŒ/g, 'न्द');
  str = str.replace(/ãŸ/g, 'न्न');
  str = str.replace(/ãÿ/g, 'न्य');
  str = str.replace(/ã/g, 'न्');

  str = str.replace(/L§/g, 'रु');
  str = str.replace(/M§/g, 'रू');
  str = str.replace(/»§/g, 'फ');
  str = str.replace(/»/g, 'फ');

  str = str.replace(/÷˝Ê/g, 'भ्रा');
  str = str.replace(/÷˝/g, 'भ्र');
  str = str.replace(/º˝/g, 'द्र');
  str = str.replace(/ª˝/g, 'ग्र');
  str = str.replace(/¬˝/g, 'प्र');
  str = str.replace(/Ã˝/g, 'त्र');
  str = str.replace(/‡Ê˝/g, 'श्र');
  str = str.replace(/ø˝/g, 'च्र');
  str = str.replace(/d/g, 'स्र');
  str = str.replace(/@/g, 'ञ्च');
  str = str.replace(/ÎÎ/g, 'ॄ');
  str = str.replace(/L§/g, 'रु');
  str = str.replace(/NU/g, 'हृ');
  str = str.replace(/ÛÊ/g, 'न्न');
  str = str.replace(/àSÕ/g, 'त्स्थ');
  str = str.replace(/ÁˇÊ/g, 'क्षि');

  str = str.replace(/ÁQ§/g, 'क्ति');
  str = str.replace(/Q§/g, 'क्त');
  str = str.replace(/Q/g, 'क्त');
  str = str.replace(/T/g, 'ञ्ज');
  str = str.replace(/X/g, 'ङ्');

  // Letter R
  str = str.replace(/⁄UÊ/g, 'रो');
  str = str.replace(/⁄UÊÒ/g, 'रौ');
  str = str.replace(/⁄UÊ/g, 'रा');
  str = str.replace(/⁄UË/g, 'री');
  str = str.replace(/⁄U/g, 'रे');
  str = str.replace(/⁄UÒ/g, 'रै');
  str = str.replace(/⁄U/g, 'र');
  str = str.replace(/⁄/g, 'र');

  // Other consonants
  str = str.replace(/÷Ê/g, 'भा');
  str = str.replace(/÷/g, 'भ');
  str = str.replace(/è/g, 'भ्');

  str = str.replace(/œÊ/g, 'धा');
  str = str.replace(/œ/g, 'ध');

  str = str.replace(/ÕÊ/g, 'था');
  str = str.replace(/Õ/g, 'थ');

  str = str.replace(/ªÊ/g, 'गा');
  str = str.replace(/ª/g, 'ग');

  str = str.replace(/ÃÊ/g, 'ता');
  str = str.replace(/Ã/g, 'त');
  str = str.replace(/à/g, 'त्');

  str = str.replace(/ŸÊ/g, 'ना');
  str = str.replace(/Ÿ/g, 'न');

  str = str.replace(/¬Ê/g, 'पा');
  str = str.replace(/¬/g, 'प');

  str = str.replace(/◊Ê/g, 'मा');
  str = str.replace(/◊/g, 'म');

  str = str.replace(/ÿÊ/g, 'या');
  str = str.replace(/ÿ/g, 'य');

  str = str.replace(/‹Ê/g, 'ला');
  str = str.replace(/‹/g, 'ल');

  str = str.replace(/ŒÊ/g, 'दा');
  str = str.replace(/Œ/g, 'द');

  str = str.replace(/·Ê/g, 'षा');
  str = str.replace(/·/g, 'ष');
  str = str.replace(/c/g, 'ष्');

  str = str.replace(/â/g, 'थ्');

  str = str.replace(/¤ÊÊ/g, 'झा');
  str = str.replace(/¤Ê/g, 'झ');
  str = str.replace(/¤/g, 'झ्');

  str = str.replace(/øÊ/g, 'चा');
  str = str.replace(/ø/g, 'च');

  str = str.replace(/¡Ê/g, 'जा');
  str = str.replace(/¡/g, 'ज');

  str = str.replace(/Çÿ/g, 'ग्य');
  str = str.replace(/Åÿ/g, 'ख्य');
  str = str.replace(/Ç/g, 'ग्य');
  str = str.replace(/Å/g, 'ख्य');
  str = str.replace(/कुछ्/g, 'कुछ');
  str = str.replace(/∑¢§/g, 'कं');
  str = str.replace(/∑¢/g, 'कं');
  str = str.replace(/क्ं§/g, 'कं');
  str = str.replace(/अौर/g, 'और');
  str = str.replace(/भगद्गीते/g, 'भगवद्गीते');

  const charMap: [RegExp, string][] = [
    [/π/g, 'ख'],
    [/É/g, 'घ'],
    [/≈/g, 'ट'],
    [/∆/g, 'ठ'],
    [/«∏/g, 'ड़'],
    [/«/g, 'ड'],
    [/…∏/g, 'ढ़'],
    [/…/g, 'ढ'],
    [/√/g, 'व्'],
    [/é/g, 'ब्'],
    [/Ê/g, 'ा'],
    [/Ë/g, 'ी'],
    [/È/g, 'ु'],
    [/Í/g, 'ू'],
    [/Î/g, 'ृ'],
    [//g, 'े'],
    [/Ò/g, 'ै'],
    [/˜/g, '्'],
  ];

  for (const [pattern, repl] of charMap) {
    str = str.replace(pattern, repl);
  }

  // Handle 'Á' (prefixed 'chhoti i' matra in Chanakya)
  str = str.replace(/Á([क-ह](?:्[क-ह])*)/g, '$1ि');
  str = str.replace(/Á/g, 'ि');

  // Handle Reph 'Z', '¸' and 'Ì'
  str = str.replace(/((?:[क-ह]्)*[क-ह][ा-ौ]*)Z/g, 'र्$1');
  str = str.replace(/Z/g, 'र्');
  str = str.replace(/((?:[क-ह]्)*[क-ह][ा-ौ]*)¸/g, 'र्$1');
  str = str.replace(/¸/g, 'र्');
  str = str.replace(/((?:[क-ह]्)*[क-ह][ा-ौ]*)Ì/g, 'र्$1');
  str = str.replace(/Ì/g, 'र्');

  // Clean trailing artifacts
  str = str.replace(/Ô/g, '');
  str = str.replace(/U/g, '');
  str = str.replace(/§/g, '');
  str = str.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

  // Fix anomalous vowel ordering
  str = str.replace(/्ा/g, '');
  str = str.replace(/्ि/g, 'ि');
  str = str.replace(/्ी/g, 'ी');
  str = str.replace(/्े/g, 'े');
  str = str.replace(/्ै/g, 'ै');
  str = str.replace(/्ो/g, 'ो');
  str = str.replace(/्ौ/g, 'ौ');

  // Halant and duplicate vowels deduplication
  str = str.replace(/्+/g, '्');
  str = str.replace(/ा+/g, 'ा');
  str = str.replace(/ि+/g, 'ि');
  str = str.replace(/ी+/g, 'ी');
  str = str.replace(/ु+/g, 'ु');
  str = str.replace(/ू+/g, 'ू');
  str = str.replace(/े+/g, 'े');
  str = str.replace(/ै+/g, 'ै');
  str = str.replace(/ो+/g, 'ो');
  str = str.replace(/ौ+/g, 'ौ');
  str = str.replace(/ं+/g, 'ं');

  // Contextual word-level fixes
  str = str.replace(/ब्राह्माण/g, 'ब्राह्मण');
  str = str.replace(/औरर/g, 'और');
  str = str.replace(/सिंहह/g, 'सिंह');
  str = str.replace(/विनद्योच्चौः/g, 'विनद्योच्चैः');

  // Devanagari Unicode Canonical Normalization & Dotted Circle Prevention
  str = str.replace(/अ\s*ों/g, 'ओं');
  str = str.replace(/अों/g, 'ओं');
  str = str.replace(/अ\s*ो/g, 'ओ');
  str = str.replace(/अ\s*ौ/g, 'औ');
  str = str.replace(/अ\s*ै/g, 'ऐ');
  str = str.replace(/अ\s*े/g, 'ए');
  str = str.replace(/अ\s*ा/g, 'आ');
  str = str.replace(/अ\s*ी/g, 'ई');
  str = str.replace(/अ\s*ि/g, 'इ');
  str = str.replace(/अ\s*ू/g, 'ऊ');
  str = str.replace(/अ\s*ु/g, 'उ');
  str = str.replace(/अ\s*ृ/g, 'ऋ');
  str = str.replace(/आ\s*ों/g, 'ओं');
  str = str.replace(/आ\s*ें/g, 'ओं');
  str = str.replace(/ृृ/g, 'ॄ');
  str = str.replace(/पितृृनथ/g, 'पितॄनथ');
  str = str.replace(/पितृृन्/g, 'पितॄन्');
  str = str.replace(/भ[˝\u02DD]ातृृन्/g, 'भ्रातॄन्');
  str = str.replace(/भ[˝\u02DD]ातॄन्/g, 'भ्रातॄन्');
  str = str.replace(/भ[˝\u02DD]ा/g, 'भ्रा');
  str = str.replace(/भ[˝\u02DD]म/g, 'भ्रम');
  str = str.replace(/([क-ह])[˝\u02DD]/g, '$1्र');
  str = str.replace(/[˝\u02DD]/g, '्र');
  str = str.replace(/दृष्ट्वाेमं/g, 'दृष्ट्वेमं');
  str = str.replace(/रोमा@/g, 'रोमाञ्च');
  str = str.replace(/\bdंसते\b/g, 'स्रंसते');
  str = str.replace(/dंसते/g, 'स्रंसते');

  // Chanakya unmapped characters and ligature healing
  str = str.replace(/उÀलंघान/g, 'उल्लङ्घन');
  str = str.replace(/उÀलंघन/g, 'उल्लङ्घन');
  str = str.replace(/बिÀाकुल/g, 'बिल्कुल');
  str = str.replace(/मि\^ी/g, 'मिट्टी');
  str = str.replace(/ख\^े/g, 'खट्टे');
  str = str.replace(/चि_े/g, 'चिट्ठे');
  str = str.replace(/लड़Âँगा/g, 'लड़ूँगा');
  str = str.replace(/कीÏत/g, 'कीर्तिं');
  str = str.replace(/अकीÏत/g, 'अकीर्तिं');
  str = str.replace(/बढ∏/g, 'बढ़');
  str = str.replace(/जड़∏/g, 'जड़');
  str = str.replace(/∏/g, '');

  str = str.replace(/बु®द्ध/g, 'बुद्धिं');
  str = str.replace(/सि®द्ध/g, 'सिद्धिं');
  str = str.replace(/प्रकृ®त/g, 'प्रकृतिं');
  str = str.replace(/अ®हसा/g, 'अहिंसा');
  str = str.replace(/शा®न्त/g, 'शान्तिं');
  str = str.replace(/ग®त/g, 'गतिं');
  str = str.replace(/दुर्ग®त/g, 'दुर्गतिं');
  str = str.replace(/रा®त्र/g, 'रात्रिं');
  str = str.replace(/आवृ®त्त/g, 'आवृत्तिं');
  str = str.replace(/प्रवृ®त्त/g, 'प्रवृत्तिं');
  str = str.replace(/निवृ®त्त/g, 'निवृत्तिं');
  str = str.replace(/भ®क्त/g, 'भक्तिं');
  str = str.replace(/®/g, '•');

  str = str.replace(/गृˆ/g, 'गृह्ण');
  str = str.replace(/निगृˆ/g, 'निगृह्ण');
  str = str.replace(/ˆ/g, 'ह्ण');

  str = str.replace(/´क्साम/g, 'ऋक्साम');
  str = str.replace(/´ग्यवेद/g, 'ऋग्वेद');
  str = str.replace(/देव´णरूप/g, 'देवऋणरूप');
  str = str.replace(/´षि/g, 'ऋषि');
  str = str.replace(/´तु/g, 'ऋतु');
  str = str.replace(/´तेऽपि/g, 'ऋतेऽपि');
  str = str.replace(/´/g, 'ऋ');

  str = str.replace(/द्रष्ट‰/g, 'द्रष्टु');
  str = str.replace(/प्रवेष्ट‰/g, 'प्रवेष्टुं');
  str = str.replace(/श्र‰/g, 'श्रु');
  str = str.replace(/क्षणभङ्‰र/g, 'क्षणभङ्गुर');
  str = str.replace(/‰/g, 'ु');

  str = str.replace(/@/g, 'ञ्च');
  str = str.replace(/([\u0900-\u097F])%([\u0900-\u097F])/gu, '$1त्न$2');
  str = str.replace(/प्रय%/g, 'प्रयत्न');
  str = str.replace(/असप%/g, 'असपत्न');
  str = str.replace(/प%ी/g, 'पत्नी');
  str = str.replace(/य%/g, 'यत्न');
  str = str.replace(/À/g, 'ल्');
  str = str.replace(/\^/g, '•');

  str = str.replace(/K/g, '्य');
  str = str.replace(/F/g, 'स्न');
  str = str.replace(/V/g, 'ङ्क');
  str = str.replace(/d/g, 'स्र');
  str = str.replace(/u/g, 'ह्व');
  str = str.replace(/g/g, 'द्द');
  str = str.replace(/O/g, 'ह्र');
  str = str.replace(/G/g, 'त्र');
  str = str.replace(/Y/g, 'ङ्घ');
  str = str.replace(/P/g, 'क्क');
  str = str.replace(/t/g, 'ह्ला');
  str = str.replace(/जाqवी/g, 'जाह्नवी');
  str = str.replace(/विq/g, 'वह्नि');
  str = str.replace(/q/g, 'ह्न');
  str = str.replace(/Mँ/g, 'रूँ');
  str = str.replace(/कMँ/g, 'करूँ');
  str = str.replace(/M/g, 'रू');
  str = str.replace(/तैNर्त/g, 'तैर्हृत');
  str = str.replace(/N/g, 'र्हृ');
  str = str.replace(/साङ्ख्यये/g, 'साङ्ख्ये');
  str = str.replace(/श्ृणु/g, 'शृणु');

  return str;
}
