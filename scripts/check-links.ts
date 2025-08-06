import axios from 'axios';

// Configuração do sistema de verificação de links
const BASE_URL = process.env.REPLIT_DEV_DOMAIN 
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : 'http://localhost:5000';

const PRODUCTION_URL = 'https://telemed-sistema.onrender.com';

// Lista completa de links do TeleMed Sistema
const linksToCheck = [
  // Página principal
  '/',
  
  // Health checks
  '/health',
  '/healthz',
  
  // Autenticação e entrada
  '/entrada',
  
  // Dashboard principal
  '/dashboard-aquarela',
  
  // Páginas médicas principais
  '/videoconsulta',
  '/agenda-medica',
  '/receitas-digitais',
  '/dr-ai',
  '/especialidades',
  '/atendimento-medico',
  '/telemonitoramento-enfermagem',
  
  // Sistema de leilão e notificações
  '/leilao-consultas',
  '/sistema-notificacoes-medicas',
  
  // Triagem e avaliação psiquiátrica
  '/triagem-psiquiatrica',
  '/centro-avaliacao',
  
  // Testes psiquiátricos
  '/ansiedade-gad7',
  '/depressao-phq9',
  '/bipolar-mdq',
  '/gad7-ansiedade',
  
  // MEMED e receitas
  '/memed-receita-viewer',
  
  // Páginas dashboard alternativas
  '/dashboard-clean',
  '/dashboard-minimal',
  '/dashboard-pastel'
];

interface LinkCheckResult {
  url: string;
  status: number | null;
  success: boolean;
  error?: string;
  responseTime?: number;
}

async function checkSingleLink(baseUrl: string, path: string): Promise<LinkCheckResult> {
  const fullUrl = `${baseUrl}${path}`;
  const startTime = Date.now();
  
  try {
    const response = await axios.get(fullUrl, {
      timeout: 10000, // 10 segundos de timeout
      validateStatus: (status) => status < 500 // Aceita 2xx, 3xx, 4xx como sucesso
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      url: fullUrl,
      status: response.status,
      success: true,
      responseTime
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    return {
      url: fullUrl,
      status: error.response?.status || null,
      success: false,
      error: error.message,
      responseTime
    };
  }
}

async function checkAllLinks(baseUrl: string): Promise<LinkCheckResult[]> {
  console.log(`\n🔍 Verificando links em: ${baseUrl}`);
  console.log('='.repeat(60));
  
  const results: LinkCheckResult[] = [];
  
  // Verificar links em paralelo (batches de 5 para não sobrecarregar)
  const batchSize = 5;
  for (let i = 0; i < linksToCheck.length; i += batchSize) {
    const batch = linksToCheck.slice(i, i + batchSize);
    const batchPromises = batch.map(link => checkSingleLink(baseUrl, link));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Pequena pausa entre batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

function displayResults(results: LinkCheckResult[], environment: string) {
  console.log(`\n📊 RELATÓRIO - ${environment.toUpperCase()}`);
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Links funcionais: ${successful.length}`);
  console.log(`❌ Links com problemas: ${failed.length}`);
  console.log(`📈 Taxa de sucesso: ${((successful.length / results.length) * 100).toFixed(1)}%`);
  
  if (successful.length > 0) {
    console.log('\n✅ LINKS FUNCIONAIS:');
    successful.forEach(result => {
      const status = result.status || 'N/A';
      const time = result.responseTime || 0;
      console.log(`   ${result.url.split('/').pop() || '/'} - Status: ${status} (${time}ms)`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ LINKS COM PROBLEMAS:');
    failed.forEach(result => {
      const status = result.status || 'N/A';
      const error = result.error ? ` - ${result.error}` : '';
      console.log(`   ${result.url.split('/').pop() || '/'} - Status: ${status}${error}`);
    });
  }
  
  // Análise de performance
  const avgResponseTime = successful.reduce((sum, r) => sum + (r.responseTime || 0), 0) / successful.length;
  console.log(`\n⏱️ Tempo médio de resposta: ${avgResponseTime.toFixed(0)}ms`);
  
  const slowLinks = successful.filter(r => (r.responseTime || 0) > 2000);
  if (slowLinks.length > 0) {
    console.log(`⚠️ Links lentos (>2s): ${slowLinks.length}`);
    slowLinks.forEach(link => {
      console.log(`   ${link.url.split('/').pop()} - ${link.responseTime}ms`);
    });
  }
}

async function main() {
  console.log('🚀 TeleMed Sistema - Verificador de Links v1.0');
  console.log('📅 Data:', new Date().toLocaleString('pt-BR'));
  
  try {
    // Verificar ambiente de desenvolvimento (Replit)
    console.log('\n1️⃣ VERIFICANDO AMBIENTE DE DESENVOLVIMENTO');
    const devResults = await checkAllLinks(BASE_URL);
    displayResults(devResults, 'Desenvolvimento');
    
    // Verificar ambiente de produção (Render)
    console.log('\n2️⃣ VERIFICANDO AMBIENTE DE PRODUÇÃO');
    const prodResults = await checkAllLinks(PRODUCTION_URL);
    displayResults(prodResults, 'Produção');
    
    // Comparação entre ambientes
    console.log('\n🔄 COMPARAÇÃO ENTRE AMBIENTES');
    console.log('='.repeat(60));
    
    const devSuccessRate = (devResults.filter(r => r.success).length / devResults.length) * 100;
    const prodSuccessRate = (prodResults.filter(r => r.success).length / prodResults.length) * 100;
    
    console.log(`Desenvolvimento: ${devSuccessRate.toFixed(1)}% de sucesso`);
    console.log(`Produção: ${prodSuccessRate.toFixed(1)}% de sucesso`);
    
    if (devSuccessRate > prodSuccessRate) {
      console.log('⚠️ Produção tem mais problemas que desenvolvimento');
    } else if (prodSuccessRate > devSuccessRate) {
      console.log('⚠️ Desenvolvimento tem mais problemas que produção');
    } else {
      console.log('✅ Ambos ambientes estão equivalentes');
    }
    
    // Recomendações
    console.log('\n💡 RECOMENDAÇÕES');
    console.log('='.repeat(60));
    
    const allFailedLinks = [...new Set([
      ...devResults.filter(r => !r.success).map(r => r.url.split('/').pop()),
      ...prodResults.filter(r => !r.success).map(r => r.url.split('/').pop())
    ])];
    
    if (allFailedLinks.length > 0) {
      console.log('🔧 Links que precisam de correção:');
      allFailedLinks.forEach(link => console.log(`   - ${link}`));
    }
    
    const avgDevTime = devResults.filter(r => r.success).reduce((sum, r) => sum + (r.responseTime || 0), 0) / devResults.filter(r => r.success).length;
    const avgProdTime = prodResults.filter(r => r.success).reduce((sum, r) => sum + (r.responseTime || 0), 0) / prodResults.filter(r => r.success).length;
    
    if (avgProdTime > avgDevTime * 2) {
      console.log('⚡ Considere otimização de performance para produção');
    }
    
    console.log('\n✅ Verificação concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
    process.exit(1);
  }
}

// Exportar funções para uso em outros módulos
export { checkAllLinks, checkSingleLink, linksToCheck };

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}