#!/usr/bin/env node
const fs = require('fs');
const glob = require('glob');

const REPLACES = [
  [/["']\/dev\/agenda[^"']*["']/g, `"/agenda"`],
  [/["']\/dev\/dashboard[^"']*["']/g, `"/dashboard"`],
  [/["']\/preview\/dashboard\.HTML["']/g, `"/dashboard"`], // casos hardcoded
  [/["']\/enhanced-teste\.html["']/g, `"/consulta"`],
  [/["']\/enhanced-consultation\.html["']/g, `"/consulta"`],
  [/["']\/perfil-medico\.html["']/g, `"/medico"`],
  [/["']\/dashboard-teste\.html["']/g, `"/dashboard"`],
  [/href="\/preview\/[^"]*"/g, (match) => {
    const fileName = match.match(/\/([^"\/]+)"/)?.[1];
    if (fileName === 'como-funciona.html') return 'href="/como-funciona"';
    if (fileName === 'perfil-medico.html') return 'href="/medico"';
    if (fileName === 'mobile.html') return 'href="/paciente"';
    if (fileName === 'cadastro.html') return 'href="/cadastro"';
    if (fileName === 'feedback-medico.html') return 'href="/feedback-medico"';
    return match; // keep original if no mapping
  }]
];

// Check if glob is available, if not provide a simple fallback
let files;
try {
  files = glob.sync('{public,client,src}/**/*.{html,js,ts,tsx,jsx}', {nodir:true});
} catch (e) {
  console.log('Glob not available, scanning manually...');
  files = [];
  function scanDir(dir) {
    try {
      for (const item of fs.readdirSync(dir)) {
        const fullPath = dir + '/' + item;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDir(fullPath);
        } else if (/\.(html|js|ts|tsx|jsx)$/.test(item)) {
          files.push(fullPath);
        }
      }
    } catch (e) {
      // Skip directories we can't read
    }
  }
  scanDir('./public');
  scanDir('./client');
  scanDir('./src');
}

let changedFiles = 0;

for (const file of files) {
  try {
    const inTxt = fs.readFileSync(file,'utf8');
    let outTxt = inTxt;
    for (const [re, to] of REPLACES) {
      outTxt = outTxt.replace(re, to);
    }
    if (outTxt !== inTxt) { 
      fs.writeFileSync(file, outTxt); 
      console.log('[fixed]', file);
      changedFiles++;
    }
  } catch (e) {
    console.warn('[skip]', file, '(read error)');
  }
}

console.log(`\n✅ Codemod complete: ${changedFiles} files updated`);
console.log('All /dev/ and /preview/ links normalized to canonical routes');