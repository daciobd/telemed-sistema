#!/usr/bin/env node

// Test script para validar implementação canônica completa
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

console.log('🔍 Testando implementação de rotas canônicas TeleMed...\n');

const tests = [
  {
    name: 'Raiz redireciona para agenda',
    url: '/',
    expectedStatus: 301,
    expectedLocation: '/agenda'
  },
  {
    name: 'Agenda canônica funciona',
    url: '/agenda',
    expectedStatus: 200
  },
  {
    name: 'Consulta canônica funciona',
    url: '/consulta',
    expectedStatus: 200
  },
  {
    name: 'Dashboard canônico funciona',  
    url: '/dashboard',
    expectedStatus: 200
  },
  {
    name: 'Enhanced redireciona com query string',
    url: '/enhanced?patient=123&test=1',
    expectedStatus: 301,
    expectedLocation: '/consulta?patient=123&test=1'
  },
  {
    name: 'Dashboard-teste redireciona com query string',
    url: '/dashboard-teste?view=analytics&period=month',
    expectedStatus: 301,
    expectedLocation: '/dashboard?view=analytics&period=month'
  }
];

async function runTest(test) {
  try {
    const response = await fetch(BASE_URL + test.url, { 
      redirect: 'manual',
      method: 'HEAD'
    });
    
    const status = response.status;
    const location = response.headers.get('location');
    
    let passed = status === test.expectedStatus;
    
    if (test.expectedLocation) {
      passed = passed && location === test.expectedLocation;
    }
    
    console.log(passed ? '✅' : '❌', test.name);
    console.log(`   Status: ${status} (esperado: ${test.expectedStatus})`);
    if (test.expectedLocation || location) {
      console.log(`   Redirect: ${location} (esperado: ${test.expectedLocation || 'nenhum'})`);
    }
    console.log('');
    
    return passed;
    
  } catch (error) {
    console.log('❌', test.name);
    console.log('   Erro:', error.message);
    console.log('');
    return false;
  }
}

async function main() {
  const results = [];
  
  for (const test of tests) {
    const passed = await runTest(test);
    results.push(passed);
  }
  
  const totalPassed = results.filter(r => r).length;
  const totalTests = results.length;
  
  console.log(`\n📊 Resultados: ${totalPassed}/${totalTests} testes passaram`);
  
  if (totalPassed === totalTests) {
    console.log('✅ Todas as rotas canônicas estão funcionando corretamente!');
    process.exit(0);
  } else {
    console.log('❌ Alguns testes falharam. Verifique a implementação.');
    process.exit(1);
  }
}

main().catch(console.error);