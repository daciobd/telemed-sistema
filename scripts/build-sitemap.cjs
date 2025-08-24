#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE = process.env.CANONICAL_BASE_URL || 'http://localhost:5000';
const routes = [
  '/','/lp','/agenda','/consulta','/dashboard',
  '/medico','/paciente','/centro-de-testes','/triagem-psiquiatrica',
  '/precos','/dr-ai','/faq','/sobre','/privacidade','/termos-de-uso',
  '/cadastro','/login','/registro-saude','/recuperar-senha','/feedback-medico',
  '/como-funciona'
];

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url><loc>${BASE}${r}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname,'../public/sitemap.xml'), body, 'utf8');
console.log('→ public/sitemap.xml atualizado com', routes.length, 'URLs');
