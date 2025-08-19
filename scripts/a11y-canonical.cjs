#!/usr/bin/env node

// Testes de acessibilidade para rotas canônicas
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const canonicalRoutes = [
  '/agenda',
  '/consulta', 
  '/dashboard'
];

console.log('♿ Verificando acessibilidade das rotas canônicas...\n');

async function checkA11y(route) {
  try {
    const response = await fetch(BASE_URL + route);
    const html = await response.text();
    
    const checks = {
      hasTitle: /<title[^>]*>([^<]+)<\/title>/i.test(html),
      hasLang: /<html[^>]*lang=['""][^''"]*['""][^>]*>/i.test(html),
      hasMetaCharset: /<meta[^>]*charset=['""][^''"]*['""][^>]*>/i.test(html),
      hasMetaViewport: /<meta[^>]*name=['""]viewport['""][^>]*>/i.test(html),
      hasH1: /<h1[^>]*>([^<]+)<\/h1>/i.test(html),
      hasSkipLinks: /skip[- ]to[- ](?:main|content)/i.test(html),
      hasAriaLabels: /aria-label/i.test(html),
      hasAltText: /<img[^>]*alt=['""][^''"]*['""][^>]*>/i.test(html)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    const percentage = Math.round((score / total) * 100);
    
    console.log(`📊 ${route}`);
    console.log(`   Pontuação A11y: ${score}/${total} (${percentage}%)`);
    
    const failed = Object.entries(checks)
      .filter(([key, passed]) => !passed)
      .map(([key]) => key);
    
    if (failed.length > 0) {
      console.log(`   ⚠️  Melhorias: ${failed.join(', ')}`);
    }
    
    console.log('');
    return percentage >= 75; // Pass threshold
    
  } catch (error) {
    console.log(`❌ ${route}: ${error.message}\n`);
    return false;
  }
}

async function main() {
  const results = [];
  
  for (const route of canonicalRoutes) {
    const passed = await checkA11y(route);
    results.push(passed);
  }
  
  const totalPassed = results.filter(r => r).length;
  const totalRoutes = results.length;
  
  console.log(`\n📊 Resultados A11y: ${totalPassed}/${totalRoutes} rotas passaram`);
  
  if (totalPassed === totalRoutes) {
    console.log('✅ Todas as rotas canônicas têm acessibilidade adequada!');
    process.exit(0);
  } else {
    console.log('⚠️  Algumas rotas precisam de melhorias de acessibilidade.');
    process.exit(1);
  }
}

main().catch(console.error);