#!/usr/bin/env node
const fs = require('fs'), path = require('path');
const root = path.join(__dirname,'..','public','preview');

const pages = [
  ['consulta-por-valor-corrigida.html', '/precos'],
  ['faq.html',                         '/faq'],
  ['feedback-medico.html',             '/feedback-medico'],
  ['privacidade.html',                 '/privacidade'],
  ['registro-saude.html',              '/registro-saude'],
  ['sobre-themed.html',                '/sobre'],
  ['termos-de-uso.html',               '/termos-de-uso'],
  ['triagem-psiquiatrica.html',        '/triagem-psiquiatrica'],
  // 'como-funciona.html' já está ok e canônica
];

for (const [file, route] of pages) {
  const fp = path.join(root, file);
  if (!fs.existsSync(fp)) { console.warn('! não achei', file); continue; }
  let html = fs.readFileSync(fp,'utf8');

  // injeta link CSS
  if (!html.includes('theme-telemed.css')) {
    html = html.replace(/<\/head>/i,
      `  <link rel="stylesheet" href="/css/theme-telemed.css">\n</head>`);
  }

  // injeta canonical
  const canTag = `<link rel="canonical" href="${route}">`;
  if (!html.includes('rel="canonical"')) {
    html = html.replace(/<\/head>/i, `  ${canTag}\n</head>`);
  } else {
    html = html.replace(/<link[^>]+rel="canonical"[^>]*>/i, canTag);
  }

  // teste-bid → noindex
  if (route === '/teste-bid' && !html.includes('name="robots"')) {
    html = html.replace(/<\/head>/i,
      `  <meta name="robots" content="noindex,nofollow">\n</head>`);
  }

  // garante wrappers leve (sem quebrar páginas)
  if (!/class="container"/.test(html)) {
    html = html.replace(/<body([^>]*)>/i, `<body$1>\n<div class="container">`);
    html = html.replace(/<\/body>/i, `</div>\n</body>`);
  }

  fs.writeFileSync(fp, html, 'utf8');
  console.log('→ aplicado tema e canonical em', file, '->', route);
}