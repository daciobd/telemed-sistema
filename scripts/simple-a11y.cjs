// Teste de acessibilidade simplificado sem pa11y
// Verifica elementos básicos de WCAG 2.1 AA

const https = require('https');
const http = require('http');

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

async function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const module = url.startsWith('https:') ? https : http;
    module.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function checkA11y(url, html) {
  const issues = [];
  
  // Verificações básicas WCAG 2.1 AA
  if (!html.includes('lang=')) {
    issues.push('Falta atributo lang no HTML');
  }
  
  if (!html.includes('<title>')) {
    issues.push('Falta elemento title');
  }
  
  // Contar imagens sem alt
  const imgMatches = html.match(/<img[^>]*>/g) || [];
  const imgsWithoutAlt = imgMatches.filter(img => !img.includes('alt=')).length;
  if (imgsWithoutAlt > 0) {
    issues.push(`${imgsWithoutAlt} imagens sem atributo alt`);
  }
  
  // Verificar se há headings
  if (!html.match(/<h[1-6][^>]*>/)) {
    issues.push('Nenhum heading encontrado (h1-h6)');
  }
  
  // Verificar botões sem aria-label em casos suspeitos
  const buttonMatches = html.match(/<button[^>]*>/g) || [];
  const buttonsWithoutLabel = buttonMatches.filter(btn => 
    !btn.includes('aria-label=') && 
    !btn.includes('>') && 
    btn.includes('×') // botões de fechar
  ).length;
  
  if (buttonsWithoutLabel > 0) {
    issues.push(`${buttonsWithoutLabel} botões suspeitos sem aria-label`);
  }
  
  return issues;
}

(async () => {
  const pages = [
    '/',
    '/video-consultation?consultationId=demo',
    '/enhanced-consultation?consultationId=demo'
  ];
  
  let totalIssues = 0;
  
  for (const page of pages) {
    const url = BASE + page;
    console.log(`\n🔍 Verificando: ${page}`);
    
    try {
      const html = await fetchPage(url);
      const issues = await checkA11y(url, html);
      
      if (issues.length === 0) {
        console.log('✅ Nenhum problema de acessibilidade encontrado');
      } else {
        console.log('⚠️ Problemas encontrados:');
        issues.forEach(issue => console.log(`   • ${issue}`));
        totalIssues += issues.length;
      }
      
    } catch (error) {
      console.log(`❌ Erro ao verificar ${page}: ${error.message}`);
      totalIssues++;
    }
  }
  
  console.log(`\n📊 Resumo: ${totalIssues} problemas de acessibilidade encontrados`);
  
  if (totalIssues > 10) {
    console.log('❌ Muitos problemas de acessibilidade - revisar implementação');
    process.exit(1);
  } else if (totalIssues > 0) {
    console.log('⚠️ Alguns problemas encontrados - considerar correções');
  } else {
    console.log('✅ Verificação básica de acessibilidade passou');
  }
})();