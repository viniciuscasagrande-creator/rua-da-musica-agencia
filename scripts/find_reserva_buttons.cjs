const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        results = results.concat(walk(full));
      }
    } else if (file.endsWith('.jsx')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    const lower = l.toLowerCase();
    if ((lower.includes('reserva') || lower.includes('booking') || lower.includes('excurs')) && (lower.includes('button') || lower.includes('nova') || lower.includes('onclick'))) {
      console.log(`${f}:${i+1} -> ${l.trim()}`);
    }
  });
});
