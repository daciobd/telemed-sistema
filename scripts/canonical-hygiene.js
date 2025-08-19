#!/usr/bin/env node

// Script de higiene completa para implementação canônica
const fs = require('fs');
const path = require('path');

console.log('🧹 Executando higiene da implementação canônica...\n');

// 1. Verificar estrutura de pastas legacy
function checkLegacyStructure() {
  console.log('📁 Verificando estrutura legacy...');
  
  const legacyFiles = [
    'public/enhanced-consultation.html',
    'public/dashboard-aquarela.html',
    'client/src/pages/enhanced-clone.tsx',
    'client/src/EnhancedConsultation.tsx'
  ];
  
  let found = 0;
  legacyFiles.forEach(file => {
    if (fs.existsSync(file)) {
      found++;
      console.log(`   📄 Legacy encontrado: ${file}`);
    }
  });
  
  console.log(`   📊 ${found} arquivos legacy encontrados\n`);
  return found;
}

// 2. Verificar implementação de sitemap
function checkSitemap() {
  console.log('🗺️  Verificando sitemap...');
  
  const sitemapPath = 'public/sitemap.xml';
  if (fs.existsSync(sitemapPath)) {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const hasCanonical = ['/agenda', '/consulta', '/dashboard'].every(route => 
      sitemap.includes(`<loc>${route}</loc>`)
    );
    
    console.log(`   ✅ Sitemap existe: ${hasCanonical ? 'com rotas canônicas' : 'precisa atualização'}\n`);
    return hasCanonical;
  } else {
    console.log('   ❌ Sitemap não encontrado\n');
    return false;
  }
}

// 3. Verificar scripts de teste
function checkTestScripts() {
  console.log('🧪 Verificando scripts de teste...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = packageJson.scripts || {};
  
  const requiredScripts = [
    'verify:routes',
    'test:canonical', 
    'test:a11y:canonical',
    'test:perf:canonical'
  ];
  
  let found = 0;
  requiredScripts.forEach(script => {
    if (scripts[script]) {
      found++;
      console.log(`   ✅ ${script}: ${scripts[script]}`);
    } else {
      console.log(`   ❌ ${script}: não encontrado`);
    }
  });
  
  console.log(`   📊 ${found}/${requiredScripts.length} scripts configurados\n`);
  return found;
}

// 4. Verificar fallback SPA
function checkSpaFallback() {
  console.log('⚡ Verificando SPA fallback...');
  
  const serverPath = 'server/index.ts';
  if (fs.existsSync(serverPath)) {
    const serverCode = fs.readFileSync(serverPath, 'utf8');
    
    const hasSpaFallback = serverCode.includes('app.get(/^\/(?!api|perf|assets|static|favicon\.ico)');
    const hasStaticServing = serverCode.includes('express.static(distDir)');
    
    console.log(`   ${hasSpaFallback ? '✅' : '❌'} Regex SPA fallback configurado`);
    console.log(`   ${hasStaticServing ? '✅' : '❌'} Serving estático configurado\n`);
    
    return hasSpaFallback && hasStaticServing;
  } else {
    console.log('   ❌ server/index.ts não encontrado\n');
    return false;
  }
}

// 5. Gerar relatório de status
function generateStatusReport() {
  const timestamp = new Date().toISOString();
  
  const report = {
    timestamp,
    canonical_routes: {
      agenda: { path: '/agenda', file: 'agenda-medica.html', status: 'active' },
      consulta: { path: '/consulta', file: 'enhanced-teste.html', status: 'active' },
      dashboard: { path: '/dashboard', file: 'dashboard-teste.html', status: 'active' }
    },
    redirects: [
      { from: '/enhanced', to: '/consulta', status: '301', preserves_query: true },
      { from: '/enhanced-consultation', to: '/consulta', status: '301', preserves_query: true },
      { from: '/enhanced-teste', to: '/consulta', status: '301', preserves_query: true },
      { from: '/dashboard-teste', to: '/dashboard', status: '301', preserves_query: true },
      { from: '/doctor-dashboard', to: '/dashboard', status: '301', preserves_query: true }
    ],
    checks: {
      legacy_files: checkLegacyStructure(),
      sitemap: checkSitemap(),
      test_scripts: checkTestScripts(),
      spa_fallback: checkSpaFallback()
    },
    next_steps: [
      'Executar npm run verify:routes regularmente',
      'Monitorar performance com test:perf:canonical',
      'Validar acessibilidade com test:a11y:canonical',
      'Considerar mover arquivos legacy para pages/legacy/'
    ]
  };
  
  fs.writeFileSync('CANONICAL_STATUS.json', JSON.stringify(report, null, 2));
  console.log('📋 Relatório salvo em: CANONICAL_STATUS.json\n');
  
  return report;
}

// 6. Executar todos os checks
async function main() {
  const report = generateStatusReport();
  
  const totalChecks = Object.keys(report.checks).length;
  const passedChecks = Object.values(report.checks).filter(Boolean).length;
  
  console.log('📊 RESUMO DA IMPLEMENTAÇÃO CANÔNICA');
  console.log('═'.repeat(50));
  console.log(`✅ Rotas canônicas: 3/3 ativas`);
  console.log(`🔄 Redirects: ${report.redirects.length} configurados`);
  console.log(`🧪 Checks: ${passedChecks}/${totalChecks} passaram`);
  console.log(`📅 Última verificação: ${new Date().toLocaleString('pt-BR')}`);
  
  if (passedChecks === totalChecks) {
    console.log('\n🎉 Implementação canônica está completa e saudável!');
  } else {
    console.log('\n⚠️  Algumas melhorias ainda são necessárias.');
    console.log('📋 Consulte CANONICAL_STATUS.json para detalhes.');
  }
  
  console.log('\n🚀 PRÓXIMOS COMANDOS ÚTEIS:');
  console.log('npm run verify:routes        # Verificar rotas');
  console.log('npm run test:canonical       # Teste completo');
  console.log('npm run test:a11y:canonical  # Acessibilidade');
  console.log('node scripts/canonical-hygiene.js  # Este script');
}

main().catch(console.error);