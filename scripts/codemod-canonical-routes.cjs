'use strict';
/**
 * Reescreve rotas legadas para as canônicas:
 *  - /video-consultation(s) → /consulta
 *  - /enhanced(-consultation|-teste|-v3|-clone|-original)? → /consulta
 *  - /doctor-dashboard, /dashboard-teste(.html)? → /dashboard
 *  - /schedule → /agenda
 *
 * DRY_RUN=1 node scripts/codemod-canonical-routes.cjs  (mostra o que mudaria)
 * node scripts/codemod-canonical-routes.cjs            (aplica)
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = 'client/src';
const EXTS = new Set(['.ts','.tsx','.js','.jsx']);
const DRY = process.env.DRY_RUN === '1';

const REPLACERS = [
  { name:'video-consultation → /consulta',
    re: /\/video-consultation(s)?(?=[/?"'])/g, to: '/consulta' },
  { name:'enhanced* → /consulta',
    re: /\/enhanced(?:-consultation|-teste|-v3|-clone|-original)?(?=[/?"'])/g, to: '/consulta' },
  { name:'doctor-dashboard → /dashboard',
    re: /\/doctor-dashboard(?=[/?"'])/g, to: '/dashboard' },
  { name:'dashboard-teste(.html)? → /dashboard',
    re: /\/dashboard-teste(?:\.html)?(?=[/?"'])/g, to: '/dashboard' },
  { name:'schedule → /agenda',
    re: /\/schedule(?=[/?"'])/g, to: '/agenda' },
];

function* walk(dir){
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) {
      if (['node_modules','.git','dist','.output','.next','.vercel'].includes(d.name)) continue;
      yield* walk(p);
    } else {
      if (EXTS.has(path.extname(d.name))) yield p;
    }
  }
}

let changed = 0, scanned = 0;
for (const f of walk(ROOT)) {
  scanned++;
  const src = fs.readFileSync(f,'utf8');
  let out = src; const local = new Set();
  for (const r of REPLACERS) {
    const before = out;
    out = out.replace(r.re, r.to);
    if (out !== before) local.add(r.name);
  }
  if (local.size) {
    changed++;
    if (!DRY) fs.writeFileSync(f, out, 'utf8');
    console.log(`${DRY?'[dry]':'[write]'} ${f}  ←  ${[...local].join(' | ')}`);
  }
}
console.log(`Scanned ${scanned} file(s); ${changed} file(s) ${DRY?'would change.':'updated.'}`);
