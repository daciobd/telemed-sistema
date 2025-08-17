#!/usr/bin/env node

/**
 * Análise Automática do Health Connect
 * Detecta estrutura, dependências e conflitos potenciais
 */

const fs = require('fs');
const path = require('path');

class HealthConnectAnalyzer {
  constructor() {
    this.healthConnectDir = './health-connect';
    this.analysisDir = './analysis';
    this.results = {
      structure: {},
      dependencies: {},
      conflicts: [],
      integration_plan: {}
    };
  }

  analyzeStructure() {
    console.log('🔍 Analisando estrutura do Health Connect...');
    
    const structure = {
      components: this.scanFiles('health-connect/components', ['.js', '.jsx', '.ts', '.tsx', '.vue']),
      api_files: this.scanFiles('health-connect/api', ['.js', '.ts', '.py']),
      database_files: this.scanFiles('health-connect/database', ['.sql', '.js', '.ts']),
      style_files: this.scanFiles('health-connect/styles', ['.css', '.scss', '.sass', '.less']),
      config_files: this.scanFiles('health-connect/config', ['.json', '.js', '.ts', '.env'])
    };

    this.results.structure = structure;
    return structure;
  }

  scanFiles(directory, extensions) {
    const files = [];
    if (!fs.existsSync(directory)) return files;

    const scan = (dir) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scan(fullPath);
        } else {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            files.push({
              path: fullPath,
              name: item,
              size: stat.size,
              extension: ext
            });
          }
        }
      });
    };

    scan(directory);
    return files;
  }

  analyzePackageJson() {
    console.log('📦 Analisando dependências...');
    
    const healthPackagePath = './health-connect/config/package.json';
    const telemedPackagePath = './package.json';
    
    let healthDeps = {};
    let telemedDeps = {};

    if (fs.existsSync(healthPackagePath)) {
      const healthPackage = JSON.parse(fs.readFileSync(healthPackagePath, 'utf8'));
      healthDeps = {
        ...healthPackage.dependencies || {},
        ...healthPackage.devDependencies || {}
      };
    }

    if (fs.existsSync(telemedPackagePath)) {
      const telemedPackage = JSON.parse(fs.readFileSync(telemedPackagePath, 'utf8'));
      telemedDeps = {
        ...telemedPackage.dependencies || {},
        ...telemedPackage.devDependencies || {}
      };
    }

    this.results.dependencies = {
      health_connect: healthDeps,
      telemed: telemedDeps,
      conflicts: this.detectDependencyConflicts(healthDeps, telemedDeps)
    };

    return this.results.dependencies;
  }

  detectDependencyConflicts(healthDeps, telemedDeps) {
    const conflicts = [];
    
    Object.keys(healthDeps).forEach(pkg => {
      if (telemedDeps[pkg] && telemedDeps[pkg] !== healthDeps[pkg]) {
        conflicts.push({
          package: pkg,
          health_connect_version: healthDeps[pkg],
          telemed_version: telemedDeps[pkg],
          severity: this.assessConflictSeverity(pkg)
        });
      }
    });

    return conflicts;
  }

  assessConflictSeverity(packageName) {
    const criticalPackages = ['react', 'next', 'express', 'typescript'];
    const majorPackages = ['webpack', 'vite', 'babel', 'eslint'];
    
    if (criticalPackages.includes(packageName)) return 'critical';
    if (majorPackages.includes(packageName)) return 'major';
    return 'minor';
  }

  generateIntegrationPlan() {
    console.log('📋 Gerando plano de integração...');
    
    const plan = {
      phase1_analysis: {
        status: 'completed',
        findings: {
          components_found: this.results.structure.components.length,
          api_files_found: this.results.structure.api_files.length,
          conflicts_detected: this.results.dependencies.conflicts.length
        }
      },
      phase2_dependency_resolution: {
        status: 'pending',
        critical_conflicts: this.results.dependencies.conflicts.filter(c => c.severity === 'critical'),
        recommended_action: this.results.dependencies.conflicts.length > 0 
          ? 'Resolver conflitos de dependências primeiro'
          : 'Prosseguir para fase 3'
      },
      phase3_database_merge: {
        status: 'pending',
        database_files: this.results.structure.database_files.length,
        action_required: 'Analisar schemas e criar plano de migração'
      },
      phase4_api_integration: {
        status: 'pending',
        api_files: this.results.structure.api_files.length,
        action_required: 'Unificar rotas e endpoints'
      },
      phase5_frontend_merge: {
        status: 'pending',
        components: this.results.structure.components.length,
        action_required: 'Integrar componentes e resolver conflitos de UI'
      }
    };

    this.results.integration_plan = plan;
    return plan;
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      health_connect_analysis: this.results,
      recommendations: this.generateRecommendations(),
      next_steps: this.generateNextSteps()
    };

    // Salvar relatório
    fs.writeFileSync(
      './analysis/health-connect-analysis.json', 
      JSON.stringify(report, null, 2)
    );

    // Criar relatório visual
    this.createVisualReport(report);

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.dependencies.conflicts.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'dependencies',
        message: `Resolver ${this.results.dependencies.conflicts.length} conflitos de dependências`,
        action: 'Atualizar versões conflitantes ou usar aliasing'
      });
    }

    if (this.results.structure.components.length > 20) {
      recommendations.push({
        priority: 'medium',
        category: 'components',
        message: 'Grande número de componentes detectado',
        action: 'Planejar integração incremental por módulos'
      });
    }

    return recommendations;
  }

  generateNextSteps() {
    return [
      '1. Revisar relatório de conflitos de dependências',
      '2. Executar: node scripts/resolve-conflicts.js',
      '3. Fazer backup completo do TeleMed atual',
      '4. Iniciar integração por fases',
      '5. Testar cada fase antes de prosseguir'
    ];
  }

  createVisualReport(report) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Health Connect Analysis Report</title>
    <style>
        body { font-family: -apple-system, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 6px; }
        .conflict { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 10px 0; }
        .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 10px 0; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: white; border-radius: 6px; text-align: center; min-width: 120px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #10b981; }
        .metric-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔗 Health Connect Analysis Report</h1>
            <p>Generated: ${report.timestamp}</p>
        </div>

        <div class="section">
            <h2>📊 Structure Overview</h2>
            <div class="metric">
                <div class="metric-value">${report.health_connect_analysis.structure.components.length}</div>
                <div class="metric-label">Components</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.health_connect_analysis.structure.api_files.length}</div>
                <div class="metric-label">API Files</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.health_connect_analysis.structure.database_files.length}</div>
                <div class="metric-label">DB Files</div>
            </div>
            <div class="metric">
                <div class="metric-value">${report.health_connect_analysis.dependencies.conflicts.length}</div>
                <div class="metric-label">Conflicts</div>
            </div>
        </div>

        <div class="section">
            <h2>⚠️ Dependency Conflicts</h2>
            ${report.health_connect_analysis.dependencies.conflicts.map(conflict => `
                <div class="conflict">
                    <strong>${conflict.package}</strong> - ${conflict.severity} severity<br>
                    Health Connect: ${conflict.health_connect_version}<br>
                    TeleMed: ${conflict.telemed_version}
                </div>
            `).join('')}
            ${report.health_connect_analysis.dependencies.conflicts.length === 0 ? '<div class="success">✅ No dependency conflicts detected!</div>' : ''}
        </div>

        <div class="section">
            <h2>📋 Next Steps</h2>
            <ol>
                ${report.next_steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync('./analysis/health-connect-report.html', html);
  }

  async run() {
    try {
      console.log('🚀 Iniciando análise do Health Connect...\n');
      
      this.analyzeStructure();
      this.analyzePackageJson();
      this.generateIntegrationPlan();
      const report = this.generateReport();
      
      console.log('\n✅ Análise concluída!');
      console.log(`📁 Arquivos encontrados:`);
      console.log(`   - Componentes: ${report.health_connect_analysis.structure.components.length}`);
      console.log(`   - APIs: ${report.health_connect_analysis.structure.api_files.length}`);
      console.log(`   - Database: ${report.health_connect_analysis.structure.database_files.length}`);
      console.log(`   - Estilos: ${report.health_connect_analysis.structure.style_files.length}`);
      
      console.log(`\n⚠️ Conflitos detectados: ${report.health_connect_analysis.dependencies.conflicts.length}`);
      
      console.log('\n📋 Relatórios gerados:');
      console.log('   - ./analysis/health-connect-analysis.json');
      console.log('   - ./analysis/health-connect-report.html');
      
      if (report.health_connect_analysis.dependencies.conflicts.length > 0) {
        console.log('\n🔧 Próximo passo: Resolver conflitos de dependências');
        console.log('Execute: node scripts/resolve-conflicts.js');
      } else {
        console.log('\n🎉 Pronto para integração!');
        console.log('Execute: node scripts/merge-projects.js --start');
      }
      
    } catch (error) {
      console.error('❌ Erro na análise:', error.message);
      process.exit(1);
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const analyzer = new HealthConnectAnalyzer();
  analyzer.run();
}

module.exports = HealthConnectAnalyzer;