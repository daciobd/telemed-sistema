#!/usr/bin/env node

/**
 * Fix Dependencies - Resolve conflitos entre TeleMed e Health Connect
 * Identifica e corrige incompatibilidades sem quebrar o sistema
 */

const fs = require('fs');

console.log('🔧 Corrigindo conflitos de dependências...\n');

// Ler package.json original antes da fusão
const packageBackup = JSON.parse(fs.readFileSync('package.json.backup', 'utf8'));
const packageCurrent = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Preservar versões críticas do TeleMed que funcionam
const criticalDeps = {
  'date-fns': packageBackup.dependencies['date-fns'], // Manter versão do TeleMed
  'react': packageBackup.dependencies['react'],
  'react-dom': packageBackup.dependencies['react-dom'],
  'zod': packageBackup.dependencies['zod'],
  '@tanstack/react-query': packageBackup.dependencies['@tanstack/react-query'],
  'drizzle-orm': packageBackup.dependencies['drizzle-orm'],
  'vite': packageBackup.devDependencies['vite']
};

// Atualizar apenas as versões necessárias
let fixed = 0;
Object.keys(criticalDeps).forEach(dep => {
  if (packageCurrent.dependencies[dep] && packageCurrent.dependencies[dep] !== criticalDeps[dep]) {
    packageCurrent.dependencies[dep] = criticalDeps[dep];
    console.log(`✅ Corrigido: ${dep} → ${criticalDeps[dep]}`);
    fixed++;
  }
  if (packageCurrent.devDependencies[dep] && packageCurrent.devDependencies[dep] !== criticalDeps[dep]) {
    packageCurrent.devDependencies[dep] = criticalDeps[dep];
    console.log(`✅ Corrigido (dev): ${dep} → ${criticalDeps[dep]}`);
    fixed++;
  }
});

// Salvar package.json corrigido
fs.writeFileSync('package.json.fixed', JSON.stringify(packageCurrent, null, 2));

console.log(`\n📊 Correções aplicadas: ${fixed}`);
console.log('📁 Arquivo corrigido salvo em: package.json.fixed');
console.log('⚠️ Para aplicar: cp package.json.fixed package.json && npm install --legacy-peer-deps');

// Criar resolução de conflitos manual
const resolutionStrategy = {
  timestamp: new Date().toISOString(),
  conflicts_resolved: fixed,
  strategy: 'Manter versões estáveis do TeleMed, integrar novas libs do Health Connect',
  critical_versions_preserved: criticalDeps,
  next_steps: [
    '1. Substituir package.json pelo corrigido',
    '2. Instalar com --legacy-peer-deps',
    '3. Testar funcionalidades críticas',
    '4. Atualizar gradualmente se necessário'
  ]
};

fs.writeFileSync('DEPENDENCY_RESOLUTION.json', JSON.stringify(resolutionStrategy, null, 2));
console.log('📋 Estratégia salva em: DEPENDENCY_RESOLUTION.json');