#!/usr/bin/env node

/**
 * Teste completo de todas as rotas do sistema integrado
 */

const BASE_URL = 'https://84622708-9db0-420a-a1f1-6a7a55403590-00-2d2fgen7wjybm.picard.replit.dev';

async function testAllRoutes() {
  console.log('🔍 Testando todas as rotas do sistema integrado...\n');

  const routes = [
    { path: '/', name: 'Sistema Principal' },
    { path: '/telemed', name: 'TeleMed IA' },
    { path: '/health', name: 'Health Connect Original' },
    { path: '/health-connect', name: 'Health Connect Novo' },
    { path: '/complete', name: 'Sistema Integrado' },
    { path: '/video-consultation?consultationId=demo', name: 'VideoConsultation' },
    { path: '/enhanced-consultation?consultationId=demo', name: 'Enhanced Consultation' },
    { path: '/public/dashboard-teste-fixed.html', name: 'Dashboard Teste' },
    { path: '/public/dashboard-premium-fixed.html', name: 'Dashboard Premium' },
    { path: '/public/demo-ativo/area-medica.html', name: 'Área Médica Demo' }
  ];

  const results = [];

  for (const route of routes) {
    try {
      const response = await fetch(BASE_URL + route.path);
      const status = response.status;
      const emoji = status === 200 ? '✅' : status === 302 ? '🔄' : status === 404 ? '❌' : '⚠️';
      
      const result = {
        name: route.name,
        path: route.path,
        status,
        emoji,
        url: BASE_URL + route.path
      };
      
      results.push(result);
      console.log(`${emoji} ${route.name} - Status: ${status}`);
      
      if (status === 200 || status === 302) {
        console.log(`   🔗 ${BASE_URL}${route.path}`);
      }
      
    } catch (error) {
      console.log(`❌ ${route.name} - Erro: ${error.message}`);
      results.push({
        name: route.name,
        path: route.path,
        status: 'ERROR',
        emoji: '💥',
        error: error.message
      });
    }
  }

  console.log('\n📊 Resumo dos Testes:');
  console.log('================================');
  
  const working = results.filter(r => r.status === 200 || r.status === 302).length;
  const total = results.length;
  
  console.log(`✅ Funcionando: ${working}/${total}`);
  console.log(`❌ Com problemas: ${total - working}/${total}`);
  
  console.log('\n🎯 Links Funcionais:');
  results.filter(r => r.status === 200 || r.status === 302).forEach(r => {
    console.log(`   ${r.emoji} ${r.name}: ${r.url}`);
  });
  
  if (results.some(r => r.status !== 200 && r.status !== 302)) {
    console.log('\n⚠️ Problemas encontrados:');
    results.filter(r => r.status !== 200 && r.status !== 302).forEach(r => {
      console.log(`   ${r.emoji} ${r.name}: Status ${r.status}`);
    });
  }

  console.log('\n🚀 Teste completo finalizado!');
}

testAllRoutes().catch(console.error);