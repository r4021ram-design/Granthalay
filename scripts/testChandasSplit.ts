export function countSanskritSyllables(text: string): number {
  const matches = text.match(/[\u0904-\u0914\u0960-\u0961]|[\u0915-\u0939](?![\u094D])/gu);
  return matches ? matches.length : 0;
}

/**
 * Splits a Sanskrit hemistich into its two distinct Padas based on syllable target
 */
export function splitHemistichIntoPadas(hemistich: string, targetSyllables: number): [string, string] {
  const words = hemistich.trim().split(/\s+/);
  if (words.length <= 1) return [hemistich, ''];

  let currentSyllables = 0;
  let splitIndex = 0;
  let minDiff = Infinity;

  for (let i = 0; i < words.length; i++) {
    currentSyllables += countSanskritSyllables(words[i]);
    const diff = Math.abs(currentSyllables - targetSyllables);
    if (diff < minDiff) {
      minDiff = diff;
      splitIndex = i + 1;
    }
    // If we passed target and diff is getting worse, stop
    if (currentSyllables >= targetSyllables && diff > minDiff) {
      break;
    }
  }

  const pada1 = words.slice(0, splitIndex).join(' ');
  const pada2 = words.slice(splitIndex).join(' ');
  return [pada1, pada2];
}

console.log('=== TEST HEMISTICH SPLIT ALGORITHM ===\n');

// 1. Shikharini (17 + 17 = 34 syllables)
const shikhariniHalf = 'शिवः शक्त्या युक्तो यदि भवति शक्तः प्रभवितुं न चेदेवं देवो न खलु कुशलः स्पन्दितुमपि ।';
const [shikPada1, shikPada2] = splitHemistichIntoPadas(shikhariniHalf, 17);
console.log('• शिखरिणी (लक्ष्य: १७ अक्षर):');
console.log('  पाद १:', shikPada1, `(${countSanskritSyllables(shikPada1)} अक्षर)`);
console.log('  पाद २:', shikPada2, `(${countSanskritSyllables(shikPada2)} अक्षर)`);

// 2. Panchachamara (16 + 16 = 32 syllables)
const panchachamaraHalf = 'जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।';
const [panchPada1, panchPada2] = splitHemistichIntoPadas(panchachamaraHalf, 16);
console.log('\n• पञ्चचामरम् (लक्ष्य: १६ अक्षर):');
console.log('  पाद १:', panchPada1, `(${countSanskritSyllables(panchPada1)} अक्षर)`);
console.log('  पाद २:', panchPada2, `(${countSanskritSyllables(panchPada2)} अक्षर)`);

// 3. Bhujangaprayata (12 + 12 = 24 syllables)
const bhujangaHalf = 'कृपासमुद्रं सुमुखं त्रिनेत्रं जटाधरं पार्वतीवामभागम् ।';
const [bhujPada1, bhujPada2] = splitHemistichIntoPadas(bhujangaHalf, 12);
console.log('\n• भुजङ्गप्रयातम् (लक्ष्य: १२ अक्षर):');
console.log('  पाद १:', bhujPada1, `(${countSanskritSyllables(bhujPada1)} अक्षर)`);
console.log('  पाद २:', bhujPada2, `(${countSanskritSyllables(bhujPada2)} अक्षर)`);

// 4. Shardulavikridita (19 + 19 = 38 syllables)
const shardulaHalf = 'कस्तूरीतिलकं ललाटपटले वक्षःस्थले कौस्तुभं नासाग्रे नवमौक्तिकं करतले वेणुं करे कङ्कणम् ।';
const [sharPada1, sharPada2] = splitHemistichIntoPadas(shardulaHalf, 19);
console.log('\n• शार्दूलविक्रीडितम् (लक्ष्य: १९ अक्षर):');
console.log('  पाद १:', sharPada1, `(${countSanskritSyllables(sharPada1)} अक्षर)`);
console.log('  पाद २:', sharPada2, `(${countSanskritSyllables(sharPada2)} अक्षर)`);
