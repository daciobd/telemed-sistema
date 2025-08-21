// Gerador de Sitemap e Meta Tags Canônicas para TeleMed Pro
const fs = require('fs');
const path = require('path');

const CANONICAL_ROUTES = {
  '/': { 
    title: 'TeleMed Pro - Telemedicina Profissional', 
    description: 'Plataforma completa de telemedicina com consultas online, gestão médica e sistema de lances.',
    priority: '1.0',
    changefreq: 'weekly'
  },
  '/landing': { 
    title: 'TeleMed Pro - Início', 
    description: 'Conecte-se com médicos especializados através da nossa plataforma de telemedicina.',
    priority: '1.0',
    changefreq: 'weekly'
  },
  '/agenda': { 
    title: 'Agenda Médica - TeleMed Pro', 
    description: 'Gerencie sua agenda médica, consultas e horários disponíveis.',
    priority: '0.9',
    changefreq: 'daily'
  },
  '/consulta': { 
    title: 'Consulta Online - TeleMed Pro', 
    description: 'Realize consultas médicas online com vídeo em alta qualidade.',
    priority: '0.9',
    changefreq: 'weekly'
  },
  '/dashboard': { 
    title: 'Dashboard - TeleMed Pro', 
    description: 'Painel de controle para médicos e pacientes.',
    priority: '0.8',
    changefreq: 'daily'
  },
  '/dr-ai': { 
    title: 'Dr. AI - Triagem Inteligente', 
    description: 'Triagem psiquiátrica automatizada com inteligência artificial.',
    priority: '0.7',
    changefreq: 'weekly'
  },
  '/login': { 
    title: 'Login - TeleMed Pro', 
    description: 'Acesse sua conta TeleMed Pro - médicos e pacientes.',
    priority: '0.6',
    changefreq: 'monthly'
  },
  '/cadastro': { 
    title: 'Cadastro - TeleMed Pro', 
    description: 'Crie sua conta na TeleMed Pro para médicos e pacientes.',
    priority: '0.6',
    changefreq: 'monthly'
  },
  '/medico': { 
    title: 'Área Médica - TeleMed Pro', 
    description: 'Área exclusiva para médicos cadastrados na plataforma.',
    priority: '0.8',
    changefreq: 'weekly'
  },
  '/paciente': { 
    title: 'Área do Paciente - TeleMed Pro', 
    description: 'Área exclusiva para pacientes da TeleMed Pro.',
    priority: '0.8',
    changefreq: 'weekly'
  },
  '/como-funciona': { 
    title: 'Como Funciona - TeleMed Pro', 
    description: 'Entenda como usar a plataforma TeleMed Pro passo a passo.',
    priority: '0.5',
    changefreq: 'monthly'
  },
  '/privacidade': { 
    title: 'Política de Privacidade - TeleMed Pro', 
    description: 'Nossa política de privacidade e proteção de dados pessoais.',
    priority: '0.3',
    changefreq: 'yearly'
  }
};

function generateSitemap(baseUrl = 'https://app.telemed.pro') {
  const urls = Object.entries(CANONICAL_ROUTES).map(([path, meta]) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function generateMetaTags(path, baseUrl = 'https://app.telemed.pro') {
  const meta = CANONICAL_ROUTES[path];
  if (!meta) return '';

  return `
  <!-- Canonical & Open Graph -->
  <link rel="canonical" href="${baseUrl}${path}">
  <meta property="og:url" content="${baseUrl}${path}">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="TeleMed Pro">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  
  <!-- SEO -->
  <meta name="description" content="${meta.description}">
  <title>${meta.title}</title>`;
}

function generateRobotsTxt(baseUrl = 'https://app.telemed.pro') {
  return `User-agent: *
Allow: /
Disallow: /demo-ativo/
Disallow: /preview/
Disallow: /attached_assets/
Disallow: /backup*/
Disallow: /*backup*/

Sitemap: ${baseUrl}/sitemap.xml

# TeleMed Pro - Telemedicina Profissional
# Crawl-delay: 1`;
}

// Exportar para uso no servidor
module.exports = {
  CANONICAL_ROUTES,
  generateSitemap,
  generateMetaTags,
  generateRobotsTxt
};

// Uso direto do script
if (require.main === module) {
  const baseUrl = process.argv[2] || 'https://app.telemed.pro';
  
  // Gerar sitemap
  fs.writeFileSync('public/sitemap.xml', generateSitemap(baseUrl));
  console.log('✅ Sitemap gerado: public/sitemap.xml');
  
  // Gerar robots.txt
  fs.writeFileSync('public/robots.txt', generateRobotsTxt(baseUrl));
  console.log('✅ Robots.txt gerado: public/robots.txt');
  
  // Exemplo de meta tags
  console.log('\n📄 Exemplo meta tags para /agenda:');
  console.log(generateMetaTags('/agenda', baseUrl));
}