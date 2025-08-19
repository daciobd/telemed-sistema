#!/usr/bin/env node

// Teste específico para verificar redirects do frontend React
const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:5000';

const testRoutes = [
  { 
    path: '/enhanced',
    expectedRedirect: '/consulta',
    description: 'Enhanced redirect'
  },
  { 
    path: '/enhanced-consultation',
    expectedRedirect: '/consulta',
    description: 'Enhanced consultation redirect'
  },
  { 
    path: '/doctor-dashboard',
    expectedRedirect: '/dashboard',
    description: 'Doctor dashboard redirect'
  },
  { 
    path: '/dashboard-teste',
    expectedRedirect: '/dashboard',
    description: 'Dashboard teste redirect'
  }
];

async function testFrontendRedirects() {
  console.log('🧪 Testando redirects frontend React + servidor...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    for (const test of testRoutes) {
      try {
        console.log(`🔍 Testando ${test.path}...`);
        
        await page.goto(BASE_URL + test.path, { 
          waitUntil: 'networkidle0',
          timeout: 10000
        });
        
        const finalUrl = page.url();
        const expectedUrl = BASE_URL + test.expectedRedirect;
        
        if (finalUrl === expectedUrl || finalUrl.startsWith(expectedUrl)) {
          console.log(`✅ ${test.description}: OK`);
          console.log(`   ${test.path} → ${finalUrl.replace(BASE_URL, '')}`);
        } else {
          console.log(`❌ ${test.description}: FALHOU`);
          console.log(`   Esperado: ${test.expectedRedirect}`);
          console.log(`   Atual: ${finalUrl.replace(BASE_URL, '')}`);
        }
        
      } catch (error) {
        console.log(`❌ ${test.description}: ERRO - ${error.message}`);
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Erro ao executar testes:', error.message);
    console.log('💡 Verifique se o servidor está rodando e o Puppeteer está instalado');
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Fallback se Puppeteer não estiver disponível
async function testWithCurl() {
  console.log('🔄 Testando com curl (fallback)...\n');
  
  for (const test of testRoutes) {
    try {
      const { execSync } = require('child_process');
      const result = execSync(`curl -s -I -L "${BASE_URL}${test.path}"`, { 
        encoding: 'utf8',
        timeout: 5000
      });
      
      if (result.includes('200 OK') && result.includes(test.expectedRedirect)) {
        console.log(`✅ ${test.description}: OK (curl)`);
      } else {
        console.log(`⚠️  ${test.description}: Verificação manual necessária`);
      }
      
    } catch (error) {
      console.log(`❌ ${test.description}: ${error.message}`);
    }
  }
}

async function main() {
  try {
    await testFrontendRedirects();
  } catch (error) {
    console.log('ℹ️  Puppeteer não disponível, usando fallback...');
    await testWithCurl();
  }
  
  console.log('\n📊 Teste de redirects frontend concluído');
  console.log('💡 Para teste completo, acesse as URLs manualmente no navegador');
}

main().catch(console.error);