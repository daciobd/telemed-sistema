#!/usr/bin/env node

/**
 * Fusão Automática TeleMed + Health Connect
 * Executa a integração completa dos dois projetos
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Iniciando fusão TeleMed + Health Connect...\n');

class ProjectMerger {
  constructor() {
    this.mergeLog = [];
    this.conflicts = [];
    this.merged = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, type };
    this.mergeLog.push(logEntry);
    
    const emoji = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : '📋';
    console.log(`${emoji} ${message}`);
  }

  async step1_organizarEstrutura() {
    this.log('Reorganizando estrutura do Health Connect...', 'info');
    
    // Mover arquivos para estrutura mais limpa
    const moves = [
      {
        from: 'health-connect/config/health-connect/config/',
        to: 'health-connect/config/',
        files: ['package.json', 'tsconfig.json', 'vite.config.ts', '.env.example']
      },
      {
        from: 'health-connect/database/database/',
        to: 'health-connect/database/',
        files: ['shared/schema.ts', 'server/db.ts']
      },
      {
        from: 'health-connect/api/api/',
        to: 'health-connect/api/',
        files: ['server/index.ts', 'server/storage.ts', 'server/routes.ts']
      },
      {
        from: 'health-connect/components/components/client/src/',
        to: 'health-connect/src/',
        recursive: true
      }
    ];

    for (const move of moves) {
      try {
        if (move.recursive) {
          await this.moveRecursive(move.from, move.to);
        } else {
          for (const file of move.files || []) {
            await this.moveFile(path.join(move.from, file), path.join(move.to, file));
          }
        }
      } catch (error) {
        this.log(`Erro ao mover ${move.from}: ${error.message}`, 'warning');
      }
    }

    this.log('Estrutura reorganizada', 'success');
  }

  async moveFile(from, to) {
    if (fs.existsSync(from)) {
      const dir = path.dirname(to);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.copyFileSync(from, to);
      this.log(`Movido: ${from} → ${to}`);
    }
  }

  async moveRecursive(from, to) {
    if (!fs.existsSync(from)) return;
    
    const copyRecursive = (source, target) => {
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
      }
      
      const items = fs.readdirSync(source);
      items.forEach(item => {
        const sourcePath = path.join(source, item);
        const targetPath = path.join(target, item);
        
        if (fs.statSync(sourcePath).isDirectory()) {
          copyRecursive(sourcePath, targetPath);
        } else {
          fs.copyFileSync(sourcePath, targetPath);
        }
      });
    };

    copyRecursive(from, to);
    this.log(`Copiado recursivamente: ${from} → ${to}`);
  }

  async step2_analisarCompatibilidade() {
    this.log('Analisando compatibilidade entre projetos...', 'info');
    
    // Comparar package.json
    const healthPackage = JSON.parse(fs.readFileSync('health-connect/config/package.json', 'utf8'));
    const telemedPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Verificar diferenças críticas
    const healthDeps = { ...healthPackage.dependencies, ...healthPackage.devDependencies };
    const telemedDeps = { ...telemedPackage.dependencies, ...telemedPackage.devDependencies };
    
    const conflicts = [];
    Object.keys(healthDeps).forEach(pkg => {
      if (telemedDeps[pkg] && telemedDeps[pkg] !== healthDeps[pkg]) {
        conflicts.push({
          package: pkg,
          health: healthDeps[pkg],
          telemed: telemedDeps[pkg]
        });
      }
    });

    if (conflicts.length > 0) {
      this.log(`${conflicts.length} conflitos de dependências encontrados`, 'warning');
      conflicts.forEach(conflict => {
        this.log(`${conflict.package}: Health(${conflict.health}) vs TeleMed(${conflict.telemed})`, 'warning');
      });
    } else {
      this.log('Nenhum conflito de dependências detectado', 'success');
    }

    this.conflicts = conflicts;
    return conflicts;
  }

  async step3_integrarDependencias() {
    this.log('Integrando dependências...', 'info');
    
    const healthPackage = JSON.parse(fs.readFileSync('health-connect/config/package.json', 'utf8'));
    const telemedPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Merge dependências do Health Connect no TeleMed
    const newDeps = { ...telemedPackage.dependencies };
    const newDevDeps = { ...telemedPackage.devDependencies };
    
    Object.keys(healthPackage.dependencies || {}).forEach(pkg => {
      if (!newDeps[pkg]) {
        newDeps[pkg] = healthPackage.dependencies[pkg];
        this.log(`Adicionando dependência: ${pkg}@${healthPackage.dependencies[pkg]}`);
      }
    });

    Object.keys(healthPackage.devDependencies || {}).forEach(pkg => {
      if (!newDevDeps[pkg]) {
        newDevDeps[pkg] = healthPackage.devDependencies[pkg];
        this.log(`Adicionando dev dependency: ${pkg}@${healthPackage.devDependencies[pkg]}`);
      }
    });

    // Criar backup e atualizar package.json
    fs.copyFileSync('package.json', 'package.json.backup');
    
    const mergedPackage = {
      ...telemedPackage,
      dependencies: newDeps,
      devDependencies: newDevDeps
    };

    fs.writeFileSync('package.json', JSON.stringify(mergedPackage, null, 2));
    this.log('package.json atualizado com dependências do Health Connect', 'success');
  }

  async step4_integrarSchemas() {
    this.log('Integrando schemas de banco de dados...', 'info');
    
    const healthSchemaPath = 'health-connect/database/shared/schema.ts';
    const telemedSchemaPath = 'shared/schema.ts';
    
    if (fs.existsSync(healthSchemaPath) && fs.existsSync(telemedSchemaPath)) {
      const healthSchema = fs.readFileSync(healthSchemaPath, 'utf8');
      const telemedSchema = fs.readFileSync(telemedSchemaPath, 'utf8');
      
      // Criar backup
      fs.copyFileSync(telemedSchemaPath, 'shared/schema.ts.backup');
      
      // Criar schema integrado
      const integratedSchema = `// TeleMed + Health Connect - Schema Integrado
// Generated on ${new Date().toISOString()}

${telemedSchema}

// === Health Connect Schema Integration ===
${healthSchema.replace(/^.*import.*$/gm, '').replace(/^.*export.*$/gm, '')}
`;

      fs.writeFileSync('shared/schema-integrated.ts', integratedSchema);
      this.log('Schemas integrados em shared/schema-integrated.ts', 'success');
    }
  }

  async step5_integrarComponentes() {
    this.log('Integrando componentes do Health Connect...', 'info');
    
    const healthComponentsDir = 'health-connect/src/components';
    const telemedComponentsDir = 'client/src/components';
    
    if (fs.existsSync(healthComponentsDir)) {
      const targetDir = path.join(telemedComponentsDir, 'health-connect');
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Copiar componentes
      const copyComponents = (source, target) => {
        const items = fs.readdirSync(source);
        items.forEach(item => {
          const sourcePath = path.join(source, item);
          const targetPath = path.join(target, item);
          
          if (fs.statSync(sourcePath).isDirectory()) {
            if (!fs.existsSync(targetPath)) {
              fs.mkdirSync(targetPath, { recursive: true });
            }
            copyComponents(sourcePath, targetPath);
          } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
            fs.copyFileSync(sourcePath, targetPath);
            this.log(`Componente integrado: ${item}`);
          }
        });
      };

      copyComponents(healthComponentsDir, targetDir);
      this.log('Componentes do Health Connect integrados', 'success');
    }
  }

  async step6_integrarAPIs() {
    this.log('Integrando APIs do Health Connect...', 'info');
    
    const healthApiDir = 'health-connect/api/server';
    const telemedRoutesPath = 'server/routes.ts';
    
    if (fs.existsSync(path.join(healthApiDir, 'routes.ts'))) {
      const healthRoutes = fs.readFileSync(path.join(healthApiDir, 'routes.ts'), 'utf8');
      
      // Criar arquivo de rotas específico para Health Connect
      const healthConnectRoutesPath = 'server/routes-health-connect.ts';
      fs.writeFileSync(healthConnectRoutesPath, healthRoutes);
      
      this.log('Rotas do Health Connect criadas em server/routes-health-connect.ts', 'success');
      
      // TODO: Integrar no router principal
      this.log('Necessário integrar manualmente no router principal', 'warning');
    }
  }

  async step7_criarNavegacaoUnificada() {
    this.log('Criando navegação unificada...', 'info');
    
    const navigationComponent = `
import React from 'react';
import { Link, useLocation } from 'wouter';

export const UnifiedNavigation = () => {
  const [location] = useLocation();
  
  const menuItems = [
    // TeleMed Original
    { path: '/', label: 'Home TeleMed', section: 'telemed' },
    { path: '/video-consultation', label: 'Video Consulta', section: 'telemed' },
    { path: '/enhanced-consultation', label: 'Consulta Avançada', section: 'telemed' },
    
    // Health Connect
    { path: '/health-connect/patients', label: 'Pacientes HC', section: 'health-connect' },
    { path: '/health-connect/consultation', label: 'Consulta HC', section: 'health-connect' },
    { path: '/health-connect/exam-request', label: 'Exames HC', section: 'health-connect' },
  ];

  return (
    <nav className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold mb-4">TeleMed + Health Connect</h1>
        <div className="grid grid-cols-2 gap-4">
          
          <div>
            <h3 className="font-semibold mb-2">TeleMed Sistema</h3>
            {menuItems.filter(item => item.section === 'telemed').map(item => (
              <Link key={item.path} href={item.path}>
                <div className={\`block p-2 rounded hover:bg-white/20 \${location === item.path ? 'bg-white/30' : ''}\`}>
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Health Connect</h3>
            {menuItems.filter(item => item.section === 'health-connect').map(item => (
              <Link key={item.path} href={item.path}>
                <div className={\`block p-2 rounded hover:bg-white/20 \${location === item.path ? 'bg-white/30' : ''}\`}>
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
          
        </div>
      </div>
    </nav>
  );
};
`;

    fs.writeFileSync('client/src/components/UnifiedNavigation.tsx', navigationComponent);
    this.log('Navegação unificada criada', 'success');
  }

  async step8_gerarRelatorio() {
    this.log('Gerando relatório de fusão...', 'info');
    
    const report = {
      timestamp: new Date().toISOString(),
      merge_summary: {
        status: 'completed',
        conflicts: this.conflicts.length,
        merged_files: this.merged.length,
        health_connect_components: fs.existsSync('health-connect/src/components') ? 
          fs.readdirSync('health-connect/src/components').length : 0
      },
      next_steps: [
        '1. Instalar novas dependências: npm install',
        '2. Revisar schemas integrados',
        '3. Testar componentes do Health Connect',
        '4. Atualizar rotas principais',
        '5. Testar sistema unificado'
      ],
      log: this.mergeLog
    };

    fs.writeFileSync('MERGE_COMPLETE.json', JSON.stringify(report, null, 2));
    this.log('Relatório de fusão salvo em MERGE_COMPLETE.json', 'success');
    
    return report;
  }

  async execute() {
    try {
      await this.step1_organizarEstrutura();
      await this.step2_analisarCompatibilidade();
      await this.step3_integrarDependencias();
      await this.step4_integrarSchemas();
      await this.step5_integrarComponentes();
      await this.step6_integrarAPIs();
      await this.step7_criarNavegacaoUnificada();
      const report = await this.step8_gerarRelatorio();
      
      console.log('\n🎉 Fusão TeleMed + Health Connect concluída!');
      console.log('\n📋 Próximos passos:');
      report.next_steps.forEach(step => console.log(`   ${step}`));
      
      return report;
      
    } catch (error) {
      this.log(`Erro na fusão: ${error.message}`, 'error');
      throw error;
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const merger = new ProjectMerger();
  merger.execute().catch(console.error);
}

module.exports = ProjectMerger;