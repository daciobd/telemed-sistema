#!/usr/bin/env node
const fs = require('fs'), path = require('path');
const PUB = path.join(__dirname, '..', 'public');
const PREVIEW = path.join(PUB, 'preview');

const EXPECTED = {
  '/agenda':          ['agenda-medica.html','agenda.html'],
  '/consulta':        ['enhanced-teste.html','consulta.html','enhanced.html'],
  '/dashboard':       ['dashboard.html','dashboard-teste.html','dashboard-test.html'],
  '/medico':          ['perfil-medico.html','perfildomedico.html','medico.html'],
  '/paciente':        ['mobile.html','paciente.html'],
  '/como-funciona':   ['como-funciona.html','como funciona.html'],
  '/dr-ai':           ['DR.AI-CORRIGIDO.HTML','dr-ai-static.html','dr-ai.html'],
  '/cadastro':        ['cadastro.html'],
  '/login':          ['login.html'],
  '/registro-saude':  ['registro-saude.html','phr.html','ph-record.html'],
  '/privacidade':     ['politadeprivacidade.html','privacidade.html'],
  '/precos':          ['precos.html','planos.html'],
  '/recuperar-senha': ['recuperar-senha.html','recovery.html'],
  '/feedback-medico': ['feedback-medico.html']
};

function listHtml(dir) {
  const out = [];
  function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d,f);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else if (/\.html?$/i.test(f)) out.push(p);
    }
  }
  if (fs.existsSync(dir)) walk(dir);
  return out;
}

const all = [...listHtml(PUB), ...listHtml(PREVIEW)];
function hasAny(cands) {
  for (const c of cands) {
    const paths = [
      path.join(PUB, c),
      path.join(PREVIEW, c),
      path.join(PUB, c.toLowerCase()),
      path.join(PREVIEW, c.toLowerCase())
    ];
    if (paths.some(p => fs.existsSync(p))) return 'OK: ' + paths.find(p=>fs.existsSync(p));
  }
  return 'MISSING';
}

console.log('📂 public files:\n', all.map(p=>p.replace(PUB,'public')).sort().join('\n'));
console.log('\n🔎 Expected canonical targets:\n');
for (const [route, cands] of Object.entries(EXPECTED)) {
  console.log(route.padEnd(18), '→', cands.join(', '), '::', hasAny(cands));
}