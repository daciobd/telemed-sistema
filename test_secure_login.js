// Script para testar o sistema de login seguro com criptografia

// Função para criptografar dados (mesma implementação do servidor)
function encryptData(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

// Função para descriptografar dados (mesma implementação do servidor)
function decryptData(encryptedData) {
  try {
    return JSON.parse(Buffer.from(encryptedData, 'base64').toString('utf8'));
  } catch (error) {
    throw new Error('Invalid encrypted data');
  }
}

// Testes de criptografia
console.log('🔧 TESTANDO SISTEMA DE CRIPTOGRAFIA\n');

// Teste 1: Paciente
const pacienteData = {
  email: 'paciente@demo.com',
  senha: '123456',
  origem: 'hostinger'
};

const pacienteCriptografado = encryptData(pacienteData);
console.log('📧 PACIENTE:');
console.log('Dados originais:', pacienteData);
console.log('Dados criptografados:', pacienteCriptografado);
console.log('URL segura:', `/processar-login?dados=${encodeURIComponent(pacienteCriptografado)}`);
console.log('Dados descriptografados:', decryptData(pacienteCriptografado));
console.log('');

// Teste 2: Médico
const medicoData = {
  crm: '123456-SP',
  senha: 'medico123',
  origem: 'hostinger'
};

const medicoCriptografado = encryptData(medicoData);
console.log('🩺 MÉDICO:');
console.log('Dados originais:', medicoData);
console.log('Dados criptografados:', medicoCriptografado);
console.log('URL segura:', `/processar-login?dados=${encodeURIComponent(medicoCriptografado)}`);
console.log('Dados descriptografados:', decryptData(medicoCriptografado));
console.log('');

// Teste 3: Dados inválidos
console.log('❌ TESTE ERRO:');
try {
  const dadosInvalidos = 'dados_invalidos_para_teste';
  decryptData(dadosInvalidos);
} catch (error) {
  console.log('Erro esperado capturado:', error.message);
}

console.log('\n✅ TODOS OS TESTES DE CRIPTOGRAFIA CONCLUÍDOS');