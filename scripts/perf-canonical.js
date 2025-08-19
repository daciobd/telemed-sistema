#!/usr/bin/env node

// Performance testing para rotas canônicas
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const OUTPUT_DIR = 'perf';

const canonicalRoutes = [
  { path: '/agenda', name: 'agenda' },
  { path: '/consulta', name: 'consulta' }, 
  { path: '/dashboard', name: 'dashboard' }
];

// Ensure perf directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('⚡ Executando testes de performance para rotas canônicas...\n');

async function runLighthouse(route) {
  try {
    const url = BASE_URL + route.path;
    const outputFile = path.join(OUTPUT_DIR, `${route.name}-report.json`);
    
    console.log(`🔍 Testando ${route.path}...`);
    
    const cmd = `npx lighthouse ${url} --output=json --output-path=${outputFile} --chrome-flags="--headless --no-sandbox" --quiet`;
    
    execSync(cmd, { stdio: 'pipe' });
    
    const reportData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    const scores = {
      performance: Math.round(reportData.lhr.categories.performance.score * 100),
      accessibility: Math.round(reportData.lhr.categories.accessibility.score * 100),
      'best-practices': Math.round(reportData.lhr.categories['best-practices'].score * 100),
      seo: Math.round(reportData.lhr.categories.seo.score * 100)
    };
    
    console.log(`   📊 Performance: ${scores.performance}/100`);
    console.log(`   ♿ Accessibility: ${scores.accessibility}/100`);
    console.log(`   ✅ Best Practices: ${scores['best-practices']}/100`);
    console.log(`   🔍 SEO: ${scores.seo}/100`);
    
    const averageScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 4);
    console.log(`   📈 Média: ${averageScore}/100\n`);
    
    return {
      route: route.path,
      scores,
      averageScore,
      passed: averageScore >= 80
    };
    
  } catch (error) {
    console.log(`❌ Erro ao testar ${route.path}: ${error.message}\n`);
    return {
      route: route.path,
      scores: {},
      averageScore: 0,
      passed: false,
      error: error.message
    };
  }
}

async function generateSummary(results) {
  const summaryPath = path.join(OUTPUT_DIR, 'canonical-summary.json');
  const htmlPath = path.join(OUTPUT_DIR, 'canonical-report.html');
  
  const summary = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    results: results,
    overall: {
      totalRoutes: results.length,
      passedRoutes: results.filter(r => r.passed).length,
      averageScore: Math.round(
        results.reduce((sum, r) => sum + r.averageScore, 0) / results.length
      )
    }
  };
  
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  // Generate HTML report
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TeleMed - Relatório de Performance Canônico</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .overall { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .route { border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .route.passed { border-color: #28a745; }
    .route.failed { border-color: #dc3545; }
    .scores { display: flex; gap: 15px; flex-wrap: wrap; }
    .score { padding: 10px; border-radius: 4px; text-align: center; min-width: 100px; }
    .score.excellent { background: #d4edda; color: #155724; }
    .score.good { background: #d1ecf1; color: #0c5460; }
    .score.needs-improvement { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 TeleMed - Performance das Rotas Canônicas</h1>
    <p>Relatório gerado em: ${new Date().toLocaleString('pt-BR')}</p>
  </div>
  
  <div class="overall">
    <h2>📊 Resumo Geral</h2>
    <p><strong>Pontuação Média:</strong> ${summary.overall.averageScore}/100</p>
    <p><strong>Rotas Aprovadas:</strong> ${summary.overall.passedRoutes}/${summary.overall.totalRoutes}</p>
    <p><strong>URL Base:</strong> ${BASE_URL}</p>
  </div>
  
  ${results.map(result => `
  <div class="route ${result.passed ? 'passed' : 'failed'}">
    <h3>${result.route} ${result.passed ? '✅' : '❌'}</h3>
    <p><strong>Pontuação Média:</strong> ${result.averageScore}/100</p>
    
    ${result.error ? `<p style="color: #dc3545;">Erro: ${result.error}</p>` : `
    <div class="scores">
      <div class="score ${result.scores.performance >= 90 ? 'excellent' : result.scores.performance >= 70 ? 'good' : 'needs-improvement'}">
        <div><strong>Performance</strong></div>
        <div>${result.scores.performance}/100</div>
      </div>
      <div class="score ${result.scores.accessibility >= 90 ? 'excellent' : result.scores.accessibility >= 70 ? 'good' : 'needs-improvement'}">
        <div><strong>Accessibility</strong></div>
        <div>${result.scores.accessibility}/100</div>
      </div>
      <div class="score ${result.scores['best-practices'] >= 90 ? 'excellent' : result.scores['best-practices'] >= 70 ? 'good' : 'needs-improvement'}">
        <div><strong>Best Practices</strong></div>
        <div>${result.scores['best-practices']}/100</div>
      </div>
      <div class="score ${result.scores.seo >= 90 ? 'excellent' : result.scores.seo >= 70 ? 'good' : 'needs-improvement'}">
        <div><strong>SEO</strong></div>
        <div>${result.scores.seo}/100</div>
      </div>
    </div>
    `}
  </div>
  `).join('')}
  
</body>
</html>`;
  
  fs.writeFileSync(htmlPath, html);
  
  console.log(`📋 Relatório salvo em: ${htmlPath}`);
  console.log(`📊 Resumo JSON salvo em: ${summaryPath}`);
}

async function main() {
  const results = [];
  
  for (const route of canonicalRoutes) {
    const result = await runLighthouse(route);
    results.push(result);
  }
  
  await generateSummary(results);
  
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  
  console.log(`\n📊 Resultados Finais: ${passedCount}/${totalCount} rotas aprovadas`);
  
  if (passedCount === totalCount) {
    console.log('✅ Todas as rotas canônicas atendem aos padrões de performance!');
    process.exit(0);
  } else {
    console.log('⚠️  Algumas rotas precisam de otimização.');
    process.exit(1);
  }
}

main().catch(console.error);