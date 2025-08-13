#!/usr/bin/env node
import fs from 'fs';
import { glob } from 'glob';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
const file = args.file;

const files = file ? [file] : glob.sync('perf/*-baseline.json');
if (!files.length) { 
  console.error('no perf json found'); 
  process.exit(1); 
}

let okAll = true;
console.log('📊 Performance Budget Validation:');
console.log('');

for (const f of files) {
  try {
    const r = JSON.parse(fs.readFileSync(f, 'utf8'));
    const s = r.categories.performance.score;
    const a = r.audits;
    const LCP = a['largest-contentful-paint'].numericValue;
    const TBT = a['total-blocking-time'].numericValue;
    const TTI = a['interactive'].numericValue;
    const TRANS = a['total-byte-weight'].numericValue;
    
    const checks = {
      score: s >= 0.80,
      LCP: LCP <= 3500,
      TBT: TBT <= 300,
      TTI: TTI <= 4000,
      TRANS: TRANS <= 1_500_000
    };
    
    const ok = Object.values(checks).every(Boolean);
    const pageName = f.split('/').pop().replace('-baseline.json', '');
    
    console.log(`${ok ? '✅' : '❌'} ${pageName.toUpperCase()}`);
    console.log(`   Score: ${Math.round(s * 100)}% ${checks.score ? '✅' : '❌'}`);
    console.log(`   LCP: ${Math.round(LCP)}ms ${checks.LCP ? '✅' : '❌'}`);
    console.log(`   TBT: ${Math.round(TBT)}ms ${checks.TBT ? '✅' : '❌'}`);
    console.log(`   TTI: ${Math.round(TTI)}ms ${checks.TTI ? '✅' : '❌'}`);
    console.log(`   Transfer: ${Math.round(TRANS/1024)}KB ${checks.TRANS ? '✅' : '❌'}`);
    console.log('');
    
    okAll = okAll && ok;
  } catch (err) {
    console.error(`❌ Error reading ${f}:`, err.message);
    okAll = false;
  }
}

console.log(`🎯 Overall Status: ${okAll ? 'PASSING ✅' : 'FAILING ❌'}`);

if (!okAll) {
  console.log('');
  console.log('🔧 Budget Targets:');
  console.log('   • Performance Score: ≥ 80%');
  console.log('   • LCP: ≤ 3,500ms');
  console.log('   • TBT: ≤ 300ms');
  console.log('   • TTI: ≤ 4,000ms');
  console.log('   • Transfer: ≤ 1,500KB');
  process.exit(1);
}