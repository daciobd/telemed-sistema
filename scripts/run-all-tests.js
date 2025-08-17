#!/usr/bin/env node

/**
 * Executar todos os testes do TeleMed sistema
 * Smoke tests + contratos + auth + a11y + performance
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 Executando suite completa de testes TeleMed...\n');

class TestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async runTest(name, command, description) {
    console.log(`🔄 Executando: ${name} - ${description}`);
    
    try {
      const startTime = Date.now();
      const result = execSync(command, { 
        encoding: 'utf8', 
        stdio: 'pipe',
        timeout: 60000 // 60 segundos timeout
      });
      const duration = Date.now() - startTime;
      
      this.results.push({
        name,
        status: 'PASS',
        duration: `${duration}ms`,
        output: result.trim(),
        description
      });
      
      console.log(`✅ ${name} - PASSOU (${duration}ms)\n`);
      
    } catch (error) {
      const duration = Date.now() - this.startTime;
      
      this.results.push({
        name,
        status: 'FAIL',
        duration: `${duration}ms`,
        error: error.message,
        output: error.stdout ? error.stdout.toString() : '',
        stderr: error.stderr ? error.stderr.toString() : '',
        description
      });
      
      console.log(`❌ ${name} - FALHOU (${duration}ms)`);
      console.log(`   Erro: ${error.message}\n`);
    }
  }

  async execute() {
    try {
      // Verificar se o servidor está rodando
      console.log('🔍 Verificando se o servidor está ativo...');
      
      // 1. Testes de contrato de API
      await this.runTest(
        'Contract Tests',
        'node scripts/contract-tests.cjs',
        'Validação dos contratos mínimos das APIs (Consultation/ExamOrder/Payment)'
      );

      // 2. Verificação de autenticação JWT
      await this.runTest(
        'Auth Verification',
        'node scripts/verify-auth.cjs',
        'Validação da estrutura e campos JWT/OAuth'
      );

      // 3. Testes de acessibilidade WCAG AA
      await this.runTest(
        'Accessibility Tests',
        'node scripts/a11y.cjs',
        'Verificação WCAG 2.1 AA nas páginas críticas'
      );

      // 4. Testes de performance
      if (fs.existsSync('scripts/verify-performance.js')) {
        await this.runTest(
          'Performance Tests',
          'node scripts/verify-performance.js',
          'Validação do budget de performance (Lighthouse ≥80)'
        );
      }

      // 5. Validação do checklist de fusão
      if (fs.existsSync('scripts/validate-fusion-checklist.js')) {
        await this.runTest(
          'Fusion Checklist',
          'node scripts/validate-fusion-checklist.js',
          'Validação completa do checklist de fusão TeleMed + Health Connect'
        );
      }

      this.generateReport();
      
    } catch (error) {
      console.error('❌ Erro na execução dos testes:', error.message);
      throw error;
    }
  }

  generateReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = this.results.filter(r => r.status === 'FAIL').length;
    const totalDuration = Date.now() - this.startTime;
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_tests: totalTests,
        passed: passedTests,
        failed: failedTests,
        success_rate: `${Math.round((passedTests / totalTests) * 100)}%`,
        total_duration: `${totalDuration}ms`,
        status: failedTests === 0 ? 'ALL_PASSED' : 'SOME_FAILED'
      },
      test_results: this.results,
      recommendations: this.generateRecommendations()
    };

    fs.writeFileSync('TEST_RESULTS.json', JSON.stringify(report, null, 2));

    console.log('\n🎯 RELATÓRIO DE TESTES COMPLETO');
    console.log('='.repeat(50));
    console.log(`📊 Total de testes: ${totalTests}`);
    console.log(`✅ Passou: ${passedTests}`);
    console.log(`❌ Falhou: ${failedTests}`);
    console.log(`📈 Taxa de sucesso: ${report.summary.success_rate}`);
    console.log(`⏱️ Duração total: ${totalDuration}ms`);
    console.log(`🏆 Status geral: ${report.summary.status}`);

    if (failedTests > 0) {
      console.log('\n❌ Testes que falharam:');
      this.results.filter(r => r.status === 'FAIL').forEach(test => {
        console.log(`   • ${test.name}: ${test.error}`);
      });
    }

    console.log('\n💡 Recomendações:');
    report.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });

    console.log(`\n📄 Relatório detalhado salvo em: TEST_RESULTS.json`);

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    const failedTests = this.results.filter(r => r.status === 'FAIL');

    if (failedTests.length === 0) {
      recommendations.push('Todos os testes passaram - sistema pronto para produção');
      recommendations.push('Executar testes regularmente em CI/CD');
      recommendations.push('Monitorar performance em produção');
    } else {
      recommendations.push('Corrigir testes que falharam antes de deploy');
      
      failedTests.forEach(test => {
        switch (test.name) {
          case 'Contract Tests':
            recommendations.push('Verificar se todas as rotas de API estão funcionando');
            break;
          case 'Auth Verification':
            recommendations.push('Validar configuração JWT e tokens de teste');
            break;
          case 'Accessibility Tests':
            recommendations.push('Corrigir problemas de acessibilidade identificados');
            break;
          case 'Performance Tests':
            recommendations.push('Otimizar performance para atingir budget definido');
            break;
        }
      });
    }

    recommendations.push('Documentar resultados para equipe');
    recommendations.push('Estabelecer processo de testes contínuos');

    return recommendations;
  }
}

if (require.main === module) {
  const runner = new TestRunner();
  runner.execute().catch(error => {
    console.error('Falha na execução dos testes:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;