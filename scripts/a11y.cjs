const { execSync } = require('node:child_process');
const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT||5000}`;
const pages = [
  '/', 
  '/video-consultation?consultationId=demo',
  '/enhanced-consultation?consultationId=demo',
  '/doctor-dashboard',
  '/ai-console'
];
for (const p of pages) {
  console.log("\n== A11y @", p);
  execSync(`npx pa11y "${BASE}${p}" --threshold 5`, { stdio: 'inherit' });
}
console.log("\n✓ A11y checks done");