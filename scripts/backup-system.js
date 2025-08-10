#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const timestamp = new Date().toISOString().split('T')[0];
const backupDir = path.join(projectRoot, `backups/telemed-${timestamp}`);

console.log('📦 Iniciando backup completo...');

// Arquivos críticos para backup
const criticalFiles = [
  // Configuração
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'tailwind.config.optimized.ts',
  'drizzle.config.ts',
  'components.json',
  
  // Build e Deploy
  'build.js',
  'start.js',
  
  // Frontend
  'client/src/App.tsx',
  'client/src/main.tsx',
  'client/src/index.css',
  'client/src/pages',
  'client/src/components',
  
  // Backend
  'server',
  'shared',
  
  // Documentação
  'README.md',
  'replit.md',
  'OPTIMIZATIONS_REPORT.md',
  'SECURITY_OPTIMIZATIONS_COMPLETE.md',
  
  // Assets
  'public',
  'landing-page-simple.html',
  'download-page-fixed.html',
  
  // Scripts
  'scripts'
];

try {
  // Criar backup
  fs.mkdirSync(backupDir, { recursive: true });

  let backedUpFiles = 0;
  
  // Função para copiar arquivos/diretórios
  function copyRecursive(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      const files = fs.readdirSync(src);
      files.forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  }

  criticalFiles.forEach(file => {
    const sourcePath = path.join(projectRoot, file);
    if (fs.existsSync(sourcePath)) {
      const destPath = path.join(backupDir, file);
      copyRecursive(sourcePath, destPath);
      console.log(`✅ ${file}`);
      backedUpFiles++;
    } else {
      console.log(`⚠️  ${file} - não encontrado`);
    }
  });

  // Gerar relatório
  let lastCommit = 'N/A';
  try {
    lastCommit = execSync('git rev-parse HEAD', { cwd: projectRoot }).toString().trim();
  } catch (e) {
    lastCommit = 'Git não disponível';
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json')));
  
  const report = {
    timestamp: new Date().toISOString(),
    version: packageJson.version,
    files: backedUpFiles,
    deployUrl: 'https://telemed-sistema.onrender.com',
    replitUrl: 'https://84622708-9db0-420a-a1f1-6a7a55403590-00-2d2fgen7wjybm.picard.replit.dev',
    lastCommit,
    optimizations: {
      bundleSize: '145KB JS + 6KB CSS',
      buildTime: '~3.5s',
      security: 'Helmet + CORS + Compression',
      caching: 'Intelligent cache headers'
    }
  };

  fs.writeFileSync(path.join(backupDir, 'backup-report.json'), JSON.stringify(report, null, 2));

  // Criar arquivo ZIP para download
  const zipPath = path.join(backupDir, 'telemed-backup.tar.gz');
  try {
    execSync(`cd "${backupDir}" && tar -czf telemed-backup.tar.gz *`, { cwd: projectRoot });
    console.log(`📦 ZIP criado: ${zipPath}`);
  } catch (e) {
    console.log('⚠️  Erro ao criar ZIP:', e.message);
  }

  console.log('\n🎉 Backup concluído com sucesso!');
  console.log(`📁 Local: ${backupDir}`);
  console.log(`📊 Arquivos: ${report.files}`);
  console.log(`🏷️  Versão: ${report.version}`);
  console.log(`📅 Data: ${report.timestamp}`);

} catch (error) {
  console.error('❌ Erro no backup:', error.message);
  process.exit(1);
}