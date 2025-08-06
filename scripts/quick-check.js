// Versão simplificada em JavaScript para teste rápido
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const criticalLinks = [
  '/',
  '/health',
  '/entrada',
  '/dashboard-aquarela',
  '/videoconsulta',
  '/triagem-psiquiatrica',
  '/especialidades'
];

async function quickCheck() {
  console.log('🔍 TeleMed - Verificação Rápida de Links');
  console.log('=====================================');
  
  for (const link of criticalLinks) {
    try {
      const response = await axios.get(`${BASE_URL}${link}`, { timeout: 5000 });
      console.log(`✅ ${link} - Status: ${response.status}`);
    } catch (error) {
      const status = error.response?.status || 'ERRO';
      console.log(`❌ ${link} - Status: ${status} - ${error.message}`);
    }
  }
  
  console.log('\n✅ Verificação rápida concluída!');
}

quickCheck();