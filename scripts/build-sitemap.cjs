#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE = process.env.CANONICAL_BASE_URL || 'http://localhost:5000';
const routes = [
  '/','/agenda','/consulta','/dashboard',
  '/medico','/paciente','/como-funciona','/dr-ai',
  '/cadastro','/login','/registro-saude','/privacidade',
  '/precos','/recuperar-senha','/feedback-medico'
];

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url><loc>${BASE}${r}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname,'../public/sitemap.xml'), body, 'utf8');
console.log('→ public/sitemap.xml atualizado com', routes.length, 'URLs');
