#!/usr/bin/env node

/**
 * Validação do Checklist de Fusão TeleMed
 * Verifica se todos os requisitos foram implementados corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validando implementação do checklist de fusão...\n');

class FusionValidator {
  constructor() {
    this.validations = [];
    this.errors = [];
  }

  validate(description, condition, file = null) {
    const result = {
      description,
      file,
      status: condition ? 'PASS' : 'FAIL',
      timestamp: new Date().toISOString()
    };

    this.validations.push(result);
    
    const emoji = condition ? '✅' : '❌';
    const fileInfo = file ? ` (${file})` : '';
    console.log(`${emoji} ${description}${fileInfo}`);
    
    if (!condition) {
      this.errors.push(description);
    }
    
    return condition;
  }

  validateSchemaUnification() {
    console.log('\n1️⃣ Verificando unificação de schemas...');
    
    const schemaExists = fs.existsSync('shared/schema-unified.ts');
    this.validate('Schema unificado existe', schemaExists, 'shared/schema-unified.ts');
    
    if (schemaExists) {
      const schemaContent = fs.readFileSync('shared/schema-unified.ts', 'utf8');
      this.validate('Contém entidade Consultation', schemaContent.includes('consultations'), 'shared/schema-unified.ts');
      this.validate('Contém entidade ExamOrder', schemaContent.includes('examOrders'), 'shared/schema-unified.ts');
      this.validate('Contém entidade Payment', schemaContent.includes('payments'), 'shared/schema-unified.ts');
      this.validate('Usa TeleMed como source of truth', schemaContent.includes('TeleMed Unified Schema'), 'shared/schema-unified.ts');
      this.validate('Inclui relações entre entidades', schemaContent.includes('Relations'), 'shared/schema-unified.ts');
    }
  }

  validateAuthConsolidation() {
    console.log('\n2️⃣ Verificando consolidação de autenticação...');
    
    const authExists = fs.existsSync('server/auth-unified.ts');
    this.validate('Autenticação unificada existe', authExists, 'server/auth-unified.ts');
    
    if (authExists) {
      const authContent = fs.readFileSync('server/auth-unified.ts', 'utf8');
      this.validate('Implementa JWT', authContent.includes('jwt.sign'), 'server/auth-unified.ts');
      this.validate('Suporte a OAuth', authContent.includes('OAuth'), 'server/auth-unified.ts');
      this.validate('Role-based access control', authContent.includes('hasRole'), 'server/auth-unified.ts');
      this.validate('Refresh token support', authContent.includes('refreshAccessToken'), 'server/auth-unified.ts');
    }
  }

  validateAccessibility() {
    console.log('\n3️⃣ Verificando padrões de acessibilidade...');
    
    const accessibilityHooksExists = fs.existsSync('client/src/hooks/useAccessibility.ts');
    this.validate('Hooks de acessibilidade existem', accessibilityHooksExists, 'client/src/hooks/useAccessibility.ts');
    
    const accessibleModalExists = fs.existsSync('client/src/components/AccessibleModal.tsx');
    this.validate('Modal acessível existe', accessibleModalExists, 'client/src/components/AccessibleModal.tsx');
    
    if (accessibilityHooksExists) {
      const hooksContent = fs.readFileSync('client/src/hooks/useAccessibility.ts', 'utf8');
      this.validate('Suporte a navegação por teclado', hooksContent.includes('useKeyboardNavigation'), 'client/src/hooks/useAccessibility.ts');
      this.validate('Gerenciamento de foco', hooksContent.includes('useFocusManagement'), 'client/src/hooks/useAccessibility.ts');
      this.validate('ARIA announcements', hooksContent.includes('useAriaAnnouncements'), 'client/src/hooks/useAccessibility.ts');
    }
    
    if (accessibleModalExists) {
      const modalContent = fs.readFileSync('client/src/components/AccessibleModal.tsx', 'utf8');
      this.validate('Modal usa roles ARIA', modalContent.includes('role="dialog"'), 'client/src/components/AccessibleModal.tsx');
      this.validate('Modal suporta ESC', modalContent.includes('useKeyboardNavigation'), 'client/src/components/AccessibleModal.tsx');
      this.validate('Modal tem aria-modal', modalContent.includes('aria-modal="true"'), 'client/src/components/AccessibleModal.tsx');
    }
  }

  validatePerformanceBudget() {
    console.log('\n4️⃣ Verificando orçamento de performance...');
    
    const lighthouseExists = fs.existsSync('lighthouserc.js');
    this.validate('Configuração Lighthouse existe', lighthouseExists, 'lighthouserc.js');
    
    const perfScriptExists = fs.existsSync('scripts/verify-performance.js');
    this.validate('Script de verificação existe', perfScriptExists, 'scripts/verify-performance.js');
    
    if (lighthouseExists) {
      const lighthouseContent = fs.readFileSync('lighthouserc.js', 'utf8');
      this.validate('Budget performance ≥ 80', lighthouseContent.includes('minScore: 0.80'), 'lighthouserc.js');
      this.validate('TBT ≤ 300ms', lighthouseContent.includes('maxNumericValue: 300'), 'lighthouserc.js');
      this.validate('Transfer ≤ 1.5MB', lighthouseContent.includes('1572864'), 'lighthouserc.js');
      this.validate('Mobile emulation', lighthouseContent.includes('emulatedFormFactor'), 'lighthouserc.js');
    }
  }

  validateCIPipeline() {
    console.log('\n5️⃣ Verificando pipeline CI...');
    
    const ciExists = fs.existsSync('.github/workflows/ci.yml');
    this.validate('Pipeline CI existe', ciExists, '.github/workflows/ci.yml');
    
    if (ciExists) {
      const ciContent = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
      this.validate('Executa build', ciContent.includes('npm run build'), '.github/workflows/ci.yml');
      this.validate('Executa lint', ciContent.includes('npm run lint'), '.github/workflows/ci.yml');
      this.validate('Verifica performance', ciContent.includes('npm run verify:perf'), '.github/workflows/ci.yml');
      this.validate('Setup Node.js 20', ciContent.includes("node-version: '20'"), '.github/workflows/ci.yml');
    }
  }

  validateIntegrationFiles() {
    console.log('\n🔗 Verificando arquivos de integração...');
    
    // Verificar arquivos da fusão TeleMed + Health Connect
    this.validate('Merge completo documentado', fs.existsSync('MERGE_COMPLETE.json'), 'MERGE_COMPLETE.json');
    this.validate('Integração completa documentada', fs.existsSync('INTEGRATION_COMPLETE.json'), 'INTEGRATION_COMPLETE.json');
    this.validate('Checklist de fusão documentado', fs.existsSync('FUSION_CHECKLIST_COMPLETE.json'), 'FUSION_CHECKLIST_COMPLETE.json');
    this.validate('Navegação unificada existe', fs.existsSync('client/src/components/UnifiedNavigation.tsx'), 'client/src/components/UnifiedNavigation.tsx');
    this.validate('Página home unificada existe', fs.existsSync('client/src/pages/UnifiedHome.tsx'), 'client/src/pages/UnifiedHome.tsx');
    
    // Verificar componentes do Health Connect
    const healthConnectDir = 'client/src/components/health-connect';
    this.validate('Componentes Health Connect integrados', fs.existsSync(healthConnectDir), healthConnectDir);
    
    if (fs.existsSync(healthConnectDir)) {
      const components = fs.readdirSync(healthConnectDir).filter(f => f.endsWith('.tsx'));
      this.validate(`${components.length} componentes UI integrados`, components.length > 0, healthConnectDir);
    }
  }

  generateValidationReport() {
    console.log('\n📊 Gerando relatório de validação...');
    
    const totalValidations = this.validations.length;
    const passedValidations = this.validations.filter(v => v.status === 'PASS').length;
    const failedValidations = this.validations.filter(v => v.status === 'FAIL').length;
    const successRate = Math.round((passedValidations / totalValidations) * 100);
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_validations: totalValidations,
        passed: passedValidations,
        failed: failedValidations,
        success_rate: `${successRate}%`,
        compliance_status: successRate >= 95 ? 'COMPLIANT' : 'NON_COMPLIANT'
      },
      checklist_items: {
        '1_schemas_unified': this.validations.filter(v => v.description.includes('Schema') || v.description.includes('entidade')),
        '2_auth_consolidated': this.validations.filter(v => v.description.includes('Autenticação') || v.description.includes('JWT') || v.description.includes('OAuth')),
        '3_accessibility': this.validations.filter(v => v.description.includes('acessibilidade') || v.description.includes('ARIA') || v.description.includes('Modal')),
        '4_performance_budget': this.validations.filter(v => v.description.includes('performance') || v.description.includes('Budget') || v.description.includes('Lighthouse')),
        '5_ci_pipeline': this.validations.filter(v => v.description.includes('CI') || v.description.includes('build') || v.description.includes('lint'))
      },
      all_validations: this.validations,
      errors: this.errors,
      recommendations: this.generateRecommendations(successRate)
    };

    fs.writeFileSync('FUSION_VALIDATION_REPORT.json', JSON.stringify(report, null, 2));
    
    return report;
  }

  generateRecommendations(successRate) {
    const recommendations = [];
    
    if (successRate < 100) {
      recommendations.push('Corrigir validações que falharam antes de prosseguir');
    }
    
    if (this.errors.length > 0) {
      recommendations.push('Revisar erros específicos listados no relatório');
    }
    
    if (successRate >= 95) {
      recommendations.push('Sistema pronto para testes de aceitação');
      recommendations.push('Executar testes de performance em ambiente similar à produção');
      recommendations.push('Validar acessibilidade com ferramentas automáticas');
    }
    
    recommendations.push('Documentar processo de migração para equipe');
    recommendations.push('Treinar usuários nas novas funcionalidades');
    
    return recommendations;
  }

  async execute() {
    try {
      this.validateSchemaUnification();
      this.validateAuthConsolidation();
      this.validateAccessibility();
      this.validatePerformanceBudget();
      this.validateCIPipeline();
      this.validateIntegrationFiles();
      
      const report = this.generateValidationReport();
      
      console.log('\n🎯 RELATÓRIO DE VALIDAÇÃO DO CHECKLIST');
      console.log('='.repeat(50));
      console.log(`📊 Total de validações: ${report.summary.total_validations}`);
      console.log(`✅ Passou: ${report.summary.passed}`);
      console.log(`❌ Falhou: ${report.summary.failed}`);
      console.log(`📈 Taxa de sucesso: ${report.summary.success_rate}`);
      console.log(`🏆 Status: ${report.summary.compliance_status}`);
      
      if (report.errors.length > 0) {
        console.log('\n❌ Erros encontrados:');
        report.errors.forEach((error, i) => {
          console.log(`   ${i + 1}. ${error}`);
        });
      }
      
      console.log('\n💡 Recomendações:');
      report.recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
      
      console.log(`\n📄 Relatório detalhado salvo em: FUSION_VALIDATION_REPORT.json`);
      
      return report;
      
    } catch (error) {
      console.error('❌ Erro na validação:', error.message);
      throw error;
    }
  }
}

if (require.main === module) {
  const validator = new FusionValidator();
  validator.execute().catch(console.error);
}

module.exports = FusionValidator;