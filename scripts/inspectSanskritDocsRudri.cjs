const fs = require('fs');
const text = fs.readFileSync('scratch_rudri_extracted.txt', 'utf8');
const lines = text.split('\n');

console.log('Total lines:', lines.length);
lines.forEach((l, i) => {
  const line = l.trim();
  if (line.includes('अध्याय') || line.includes('सूक्त') || line.includes('शान्ति') || line.includes('इति') || line.includes('ध्यानम्') || line.includes('मङ्गलाचरणम्')) {
    if (line.length < 80) {
      console.log(`${i}: ${line}`);
    }
  }
});
