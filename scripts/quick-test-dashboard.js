#!/usr/bin/env node

/**
 * Teste rápido do dashboard para verificar acesso
 */

const BASE_URL = 'https://84622708-9db0-420a-a1f1-6a7a55403590-00-2d2fgen7wjybm.picard.replit.dev';

async function testDashboard() {
  console.log('🔍 Testando acesso ao dashboard...\n');

  const routes = [
    '/dashboard-teste-fixed.html',
    '/public/dashboard-teste-fixed.html',
    '/dashboard-premium-fixed.html',
    '/public/dashboard-premium-fixed.html',
    '/dashboard-minimo.html',
    '/public/dashboard-minimo.html'
  ];

  for (const route of routes) {
    try {
      const response = await fetch(BASE_URL + route);
      const status = response.status;
      const emoji = status === 200 ? '✅' : status === 404 ? '❌' : '⚠️';
      
      console.log(`${emoji} ${route} - Status: ${status}`);
      
      if (status === 200) {
        console.log(`   🔗 Acesse: ${BASE_URL}${route}`);
      }
      
    } catch (error) {
      console.log(`❌ ${route} - Erro: ${error.message}`);
    }
  }

  console.log('\n📊 Teste concluído!');
}

testDashboard().catch(console.error);