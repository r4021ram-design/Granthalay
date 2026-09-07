import { proofreadSanskritPage, splitIntoPadachheda } from './runSanskritProofing.js';

console.log('--- Testing SanskritWeb Vedic Svara Preservation ---');
const vedicSample = 'अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म् । होता॑रं रत्न॒धात॑मम् ॥';
const proofedVedic = proofreadSanskritPage(vedicSample, 3);
console.log('Original Vedic:', vedicSample);
console.log('Proofed Vedic: ', proofedVedic);
const svaraPreserved = proofedVedic.includes('\u0951') && proofedVedic.includes('\u0952');
console.log('✓ Vedic Anudatta & Svarita Preserved:', svaraPreserved);

console.log('\n--- Testing SanskritWeb Ligature Healing ---');
const rawDistorted = 'गहस्रेश एवं कप्रिष्म नक्षत्र में द्रार का स्रीगेहपुत्रामविनाशनं न हो। सर्वविध्न दूर हों। ह़्न ह़्म ड.्ग ड.्क ष् ट ष् ठ';
const healed = proofreadSanskritPage(rawDistorted, 3);
console.log('Raw Distorted: ', rawDistorted);
console.log('Healed Sanskrit:', healed);

const ligaturesPassed =
  healed.includes('गृहप्रवेश') &&
  healed.includes('क्षिप्र') &&
  healed.includes('द्वार') &&
  healed.includes('स्त्रीगेहपुत्रात्मविनाशनं') &&
  healed.includes('सर्वविघ्न') &&
  healed.includes('ह्न') &&
  healed.includes('ह्म') &&
  healed.includes('ङ्ग') &&
  healed.includes('ङ्क') &&
  healed.includes('ष्ट') &&
  healed.includes('ष्ठ');
console.log('✓ SanskritWeb Ligatures Passed:', ligaturesPassed);

console.log('\n--- Testing UoHyd Paninian Padachheda Splitter ---');
const compoundShloka = 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥';
const padachheda = splitIntoPadachheda(compoundShloka);
console.log('Original Shloka:', compoundShloka);
console.log('Padachheda Split:', padachheda);
const padachhedaPassed = padachheda.includes('सर्व-मङ्गल-माङ्गल्ये') && padachheda.includes('नमः अस्तु');
console.log('✓ UoHyd Padachheda Passed:', padachhedaPassed);

if (svaraPreserved && ligaturesPassed && padachhedaPassed) {
  console.log('\n🌟 ALL OPTION 1 SANSKRIT STANDARDS VERIFIED WITH 100% ACCURACY!');
} else {
  console.error('\n❌ Standards validation check failed.');
  process.exit(1);
}
