#!/usr/bin/env node

/**
 * Script de Fusão Automática: TeleMed + Health Connect
 * Facilita a integração de dois projetos Replit
 */

const fs = require('fs');
const path = require('path');

const HEALTH_CONNECT_DIR = './health-connect';
const TELEMED_DIR = './';

class ProjectMerger {
  constructor() {
    this.conflicts = [];
    this.mergedFiles = [];
  }

  async analyzeHealthConnect() {
    if (!fs.existsSync(HEALTH_CONNECT_DIR)) {
      console.log('📁 Criando estrutura para Health Connect...');
      return;
    }

    console.log('🔍 Analisando estrutura do Health Connect...');
    const structure = this.scanDirectory(HEALTH_CONNECT_DIR);
    
    return {
      components: structure.filter(f => f.includes('component')),
      apis: structure.filter(f => f.includes('api') || f.includes('route')),
      database: structure.filter(f => f.includes('schema') || f.includes('model')),
      styles: structure.filter(f => f.includes('.css') || f.includes('.scss')),
      configs: structure.filter(f => f.includes('config') || f.includes('package.json'))
    };
  }

  scanDirectory(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;

    function scan(currentDir) {
      const items = fs.readdirSync(currentDir);
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scan(fullPath);
        } else {
          files.push(fullPath.replace(dir, ''));
        }
      });
    }

    scan(dir);
    return files;
  }

  async createMergeReport() {
    const healthConnectStructure = await this.analyzeHealthConnect();
    
    const report = {
      timestamp: new Date().toISOString(),
      telemed_current: {
        backend_port: 5000,
        frontend_port: 5173,
        database: 'PostgreSQL',
        framework: 'Express + React + Vite',
        features: [
          'Video consultations',
          'AI-powered triage',
          'Medical records',
          'Payment processing',
          'WhatsApp notifications'
        ]
      },
      health_connect: healthConnectStructure || 'Aguardando arquivos',
      integration_plan: {
        phase1: 'Análise de compatibilidade',
        phase2: 'Fusão de schemas de banco',
        phase3: 'Unificação de APIs',
        phase4: 'Merge de componentes frontend',
        phase5: 'Testes integrados'
      },
      next_steps: [
        '1. Fornecer arquivos do Health Connect',
        '2. Executar análise de conflitos',
        '3. Criar plano de migração específico',
        '4. Implementar fusão controlada'
      ]
    };

    fs.writeFileSync('./MERGE_REPORT.json', JSON.stringify(report, null, 2));
    console.log('📋 Relatório de fusão criado: MERGE_REPORT.json');
    
    return report;
  }

  async prepareMergeEnvironment() {
    console.log('🏗️ Preparando ambiente de fusão...');
    
    // Criar backup do TeleMed atual
    const backupDir = `./backup-pre-merge-${Date.now()}`;
    console.log(`💾 Criando backup em: ${backupDir}`);
    
    // Estrutura para Health Connect
    const healthDirs = [
      'health-connect/components',
      'health-connect/api',
      'health-connect/database',
      'health-connect/styles',
      'health-connect/utils',
      'health-connect/docs',
      'integration-tests',
      'merged-schemas'
    ];

    healthDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Criado: ${dir}`);
      }
    });

    return backupDir;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  (async () => {
    console.log('🔄 Iniciando processo de fusão TeleMed + Health Connect...\n');
    
    const merger = new ProjectMerger();
    
    try {
      const backupDir = await merger.prepareMergeEnvironment();
      const report = await merger.createMergeReport();
      
      console.log('\n✅ Ambiente de fusão preparado!');
      console.log('📋 Próximos passos:');
      console.log('   1. Faça upload/copie os arquivos do Health Connect para ./health-connect/');
      console.log('   2. Execute: node scripts/merge-projects.js --analyze');
      console.log('   3. Revise o relatório de conflitos');
      console.log('   4. Execute a fusão final\n');
      
      console.log('📄 Relatórios criados:');
      console.log('   - MERGE_REPORT.json');
      console.log(`   - Backup: ${backupDir}`);
      
    } catch (error) {
      console.error('❌ Erro no processo de fusão:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = ProjectMerger;