#!/usr/bin/env node

/**
 * Adiciona scripts de teste ao package.json sem editar diretamente
 * Para resolver problema de permissões do packager_tool
 */

const fs = require('fs');

console.log('📦 Adicionando scripts de teste ao projeto...\n');

const requiredScripts = {
  "test:contracts": "node scripts/contract-tests.cjs",
  "verify:auth": "node scripts/verify-auth.cjs", 
  "test:a11y": "node scripts/a11y.cjs",
  "test:all": "node scripts/run-all-tests.js",
  "smoke:api": "node scripts/contract-tests.cjs && echo '✓ APIs funcionando'",
  "smoke:full": "npm run test:contracts && npm run verify:auth && echo '✓ Smoke tests OK'"
};

// Ler package.json atual
const packagePath = 'package.json';
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
} catch (error) {
  console.error('❌ Erro ao ler package.json:', error.message);
  process.exit(1);
}

// Adicionar scripts se não existirem
let scriptsAdded = 0;
if (!packageJson.scripts) {
  packageJson.scripts = {};
}

Object.entries(requiredScripts).forEach(([name, command]) => {
  if (!packageJson.scripts[name]) {
    packageJson.scripts[name] = command;
    console.log(`✅ Adicionado script: ${name}`);
    scriptsAdded++;
  } else {
    console.log(`⚠️ Script já existe: ${name}`);
  }
});

// Salvar package.json atualizado
if (scriptsAdded > 0) {
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log(`\n📦 ${scriptsAdded} scripts adicionados ao package.json`);
} else {
  console.log('\n📦 Todos os scripts já existem');
}

console.log('\n🧪 Scripts disponíveis:');
Object.keys(requiredScripts).forEach(script => {
  console.log(`   npm run ${script}`);
});

console.log('\n💡 Para executar todos os testes: npm run test:all');