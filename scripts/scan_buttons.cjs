const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        results = results.concat(walk(fullPath));
      }
    } else if (file.endsWith('.jsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('src');
console.log('Scanning ' + files.length + ' JSX files...');

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match <button ... > tags
  const btnRegex = /<button\b([^>]*)>/gs;
  let match;
  while ((match = btnRegex.exec(content)) !== null) {
    const attrs = match[1];
    const beforeMatch = content.slice(0, match.index);
    const lineNum = beforeMatch.split('\n').length;
    
    // Check if it has onClick, type="submit", or disabled
    const hasOnClick = /onClick\s*=/i.test(attrs);
    const isSubmit = /type\s*=\s*['"]submit['"]/i.test(attrs);
    
    if (!hasOnClick && !isSubmit) {
      // get surrounding text to identify
      const snippet = content.slice(match.index, match.index + Math.min(120, match[0].length + 40)).replace(/\n\s*/g, ' ');
      console.log(`${f}:${lineNum} -> ${snippet.slice(0, 100)}`);
    }
  }
});
