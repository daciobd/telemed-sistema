const axios = require('axios');

// Lista completa de todas as rotas/páginas do site
const allRoutes = [
  '/',
  '/login',
  '/register', 
  '/doctor-dashboard',
  '/patient-dashboard',
  '/telemonitoramento-enfermagem',
  '/centro-avaliacao',
  '/dr-ai',
  '/especialidades',
  '/sobre',
  '/saiba-mais',
  '/triagem-psiquiatrica',
  '/gad7-ansiedade',
  '/phq9-depressao',
  '/mdq-bipolar',
  '/pss10-stress',
  '/tdah-asrs18',
  '/guia-integracao-hostinger',
  '/sistema-indice',
  '/ansiedade-gad7',
  '/depressao-phq9',
  '/bipolar-mdq',
  '/stress-pss10',
  '/lances',
  '/dashboard',
  '/health'
];

async function testRoute(route) {
  try {
    const response = await axios.get(`http://localhost:5000${route}`, {
      timeout: 5000,
      validateStatus: function (status) {
        return status < 500; // Resolve apenas se for erro de servidor
      }
    });
    
    return {
      route,
      status: response.status,
      working: response.status === 200,
      redirected: response.request.res.responseUrl !== `http://localhost:5000${route}`
    };
  } catch (error) {
    return {
      route,
      status: error.response?.status || 'ERROR',
      working: false,
      error: error.message
    };
  }
}

async function testAllLinks() {
  console.log('🔍 TESTE SISTEMÁTICO DE TODOS OS LINKS - INICIADO');
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const route of allRoutes) {
    const result = await testRoute(route);
    results.push(result);
    
    const status = result.working ? '✅' : '❌';
    console.log(`${status} ${route} - Status: ${result.status}`);
    
    if (result.redirected) {
      console.log(`   ↪️  Redirecionado`);
    }
    if (result.error) {
      console.log(`   ⚠️  Erro: ${result.error}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS RESULTADOS:');
  
  const working = results.filter(r => r.working).length;
  const broken = results.filter(r => !r.working).length;
  
  console.log(`✅ Links funcionando: ${working}`);
  console.log(`❌ Links quebrados: ${broken}`);
  console.log(`📈 Taxa de sucesso: ${Math.round((working/results.length)*100)}%`);
  
  console.log('\n🔧 LINKS QUE PRECISAM DE CORREÇÃO:');
  results.filter(r => !r.working).forEach(r => {
    console.log(`❌ ${r.route} - Status: ${r.status}`);
  });
  
  return results;
}

testAllLinks().catch(console.error);