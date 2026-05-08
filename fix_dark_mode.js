const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'src', 'styles');

const colorMap = {
  '#000000': '#020617', // slate-950
  '#050505': '#0f172a', // slate-900
  '#111111': '#1e293b', // slate-800
  '#FAFAFA': '#f8fafc', // slate-50
  '#E5E5E5': '#cbd5e1', // slate-300
  '#A3A3A3': '#94a3b8', // slate-400
  '#737373': '#64748b'  // slate-500
};

// Also replace RGB values that might have been hardcoded
const replaceMap = [
  ...Object.entries(colorMap).map(([oldVal, newVal]) => ({ old: new RegExp(oldVal, 'gi'), new: newVal })),
  { old: /background-color:\s*#020617;/gi, new: 'background-color: #020617;' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const { old, new: newVal } of replaceMap) {
        content = content.replace(old, newVal);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

console.log('Applying professional Slate dark mode palette...');
processDirectory(stylesDir);
// Also apply to pages just in case there are inline styles
processDirectory(path.join(__dirname, 'src', 'pages'));
processDirectory(path.join(__dirname, 'src', 'components'));
console.log('Done!');
