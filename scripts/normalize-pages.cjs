#!/usr/bin/env node
const fs = require('fs'), path = require('path');
const DRY = !!process.env.DRY_RUN;
const PUB = path.join(__dirname, '..', 'public');
const PREVIEW = path.join(PUB, 'preview');
if (!fs.existsSync(PREVIEW)) fs.mkdirSync(PREVIEW, { recursive: true });

const PLAN = {
  '/agenda':        'agenda-medica.html',
  '/consulta':      'enhanced-teste.html',
  '/dashboard':     'dashboard.html',
  '/medico':        'perfil-medico.html',
  '/paciente':      'mobile.html',
  '/como-funciona': 'como-funciona.html',
  '/dr-ai':         'dr-ai.html',           // será sobrescrito se já houver DR.AI-CORRIGIDO.HTML
  '/cadastro':      'cadastro.html',
  '/login':         'login.html',
  '/registro-saude':'registro-saude.html',
  '/privacidade':   'privacidade.html',
  '/precos':        'precos.html',
  '/recuperar-senha':'recuperar-senha.html',
  '/feedback-medico':'feedback-medico.html'
};

const CANDIDATES = {
  '/dashboard': ['dashboard.html','dashboard-teste.html','dashboard-test.html','dashboard.HTML','dashboard-teste.HTML'],
  '/agenda': ['agenda-medica.html','agenda.html'],
  '/consulta': ['enhanced-teste.html','consulta.html','enhanced.html'],
  '/medico': ['perfil-medico.html','perfildomedico.html','medico.html'],
  '/paciente': ['mobile.html','paciente.html'],
  '/como-funciona': ['como-funciona.html','como funciona.html'],
  '/dr-ai': ['DR.AI-CORRIGIDO.HTML','dr-ai-static.html','dr-ai.html'],
  '/registro-saude': ['registro-saude.html','phr.html','ph-record.html'],
  '/privacidade': ['politadeprivacidade.html','privacidade.html'],
  '/precos': ['precos.html','planos.html'],
  '/recuperar-senha': ['recuperar-senha.html','recovery.html'],
  '/feedback-medico': ['feedback-medico.html']
};

function findExisting(name) {
  const tries = [
    path.join(PREVIEW, name),
    path.join(PUB, name),
    path.join(PREVIEW, name.toLowerCase()),
    path.join(PUB, name.toLowerCase())
  ];
  return tries.find(p => fs.existsSync(p));
}

function moveToPreview(currentPath, targetFile) {
  const dest = path.join(PREVIEW, targetFile.toLowerCase());
  if (currentPath === dest) return;
  if (DRY) return console.log('[dry-move]', currentPath, '→', dest);
  fs.renameSync(currentPath, dest);
  console.log('[move]', currentPath, '→', dest);
}

for (const [route, target] of Object.entries(PLAN)) {
  const cands = CANDIDATES[route] || [target];
  const found = cands.map(findExisting).find(Boolean);
  if (!found) { console.log('[MISS]', route, '→', target, '(nenhum candidato encontrado)'); continue; }
  moveToPreview(found, target);
}