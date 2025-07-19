# 🧪 Como Executar os Testes Automáticos Críticos

## 📋 Testes Disponíveis

Criamos **5 suítes de testes críticos** para validar o TeleMed Sistema:

1. **🏥 Patient Creation** (`patient-creation.test.ts`)
   - Criação de pacientes
   - Validação de campos obrigatórios
   - Prevenção de duplicatas
   - Validação de CPF

2. **📅 Appointment Booking** (`appointment-booking.test.ts`)
   - Agendamento de consultas
   - Aceitação por médicos
   - Conflitos de horário
   - Cancelamentos

3. **🎥 Video Consultation** (`video-consultation.test.ts`)
   - Início de videoconsultas
   - WebRTC e anotações médicas
   - Finalização com relatório
   - Interrupções de conexão

4. **⚡ API Status** (`api-status.test.ts`)
   - Health checks (/health, /api/status)
   - Performance da API
   - Conectividade do banco
   - Headers de segurança

5. **🔄 Complete Flow** (`complete-flow.test.ts`)
   - Fluxo completo médico-paciente
   - 11 etapas: cadastro → consulta → prescrição
   - Validação do prontuário médico
   - Teste de interrupções

## 🚀 Como Executar

### Método 1: Executar Todos os Testes Críticos
```bash
npx vitest run tests/critical --reporter=verbose
```

### Método 2: Script Automatizado (Recomendado)
```bash
node tests/run-critical-tests.js
```

### Método 3: Teste Individual
```bash
# Teste específico
npx vitest run tests/critical/patient-creation.test.ts

# Teste com watch mode
npx vitest tests/critical/api-status.test.ts --watch
```

### Método 4: Interface Visual
```bash
npx vitest --ui
```
Abre uma interface web no navegador para ver os testes em tempo real.

## 📊 Relatórios e Cobertura

### Ver Cobertura de Código
```bash
npx vitest run --coverage
```

### Relatório Detalhado
```bash
npx vitest run tests/critical --reporter=verbose --reporter=json
```

## 🔍 O Que Cada Teste Faz

### Patient Creation Test
```typescript
// Testa criação de paciente
const testPatient = {
  name: 'João Silva',
  email: 'joao.test@email.com',
  phone: '+5511999999999',
  cpf: '12345678901'
};

// Valida resposta da API
expect(response.success).toBe(true);
expect(response.data.email).toBe(testPatient.email);
```

### Appointment Booking Test
```typescript
// Testa agendamento completo
const appointment = await apiRequest('/api/appointments', {
  method: 'POST',
  body: JSON.stringify({
    symptoms: 'Dor de cabeça persistente',
    urgency: 'medium',
    maxBudget: 150
  })
});

// Médico aceita consulta
const acceptance = await apiRequest(`/api/appointments/${appointmentId}/accept`, {
  method: 'POST',
  body: JSON.stringify({
    doctorId: testDoctorId,
    proposedFee: 130
  })
});
```

### Complete Flow Test
```typescript
// Testa fluxo completo em 11 etapas:
// 1. Criar paciente
// 2. Criar médico  
// 3. Agendar consulta
// 4. Médico aceita
// 5. Paciente confirma
// 6. Iniciar videoconsulta
// 7. Adicionar anotações médicas
// 8. Criar prescrição digital
// 9. Finalizar consulta
// 10. Verificar prontuário
// 11. Limpeza dos dados
```

## 📈 Interpretando Resultados

### ✅ Teste Passou
```
✓ tests/critical/patient-creation.test.ts (4)
  ✓ should create a new patient successfully
  ✓ should validate required fields
  ✓ should prevent duplicate email registration
  ✓ should validate CPF format
```

### ❌ Teste Falhou
```
✗ tests/critical/api-status.test.ts (1)
  ✗ should respond to /health with basic status
    Error: fetch failed - connection refused
```

### 📊 Resumo Final
```
Test Files  5 passed (5)
Tests      23 passed (23)
Errors     0
Time       2.34s
```

## 🎯 Critérios de Aprovação

Para o sistema estar **PRONTO PARA PRODUÇÃO**, todos os testes devem passar:

- **Patient Creation**: 4/4 testes ✅
- **Appointment Booking**: 4/4 testes ✅ 
- **Video Consultation**: 6/6 testes ✅
- **API Status**: 8/8 testes ✅
- **Complete Flow**: 2/2 testes ✅

**Total: 24/24 testes críticos devem passar**

## 🛠️ Solução de Problemas

### Erro: "Cannot connect to database"
```bash
# Verificar se DATABASE_URL está configurado
echo $DATABASE_URL

# Verificar status do banco
npm run db:studio
```

### Erro: "API not responding"
```bash
# Verificar se servidor está rodando
npm run dev

# Testar health check manualmente
curl http://localhost:5000/health
```

### Erro: "Module not found"
```bash
# Reinstalar dependências
npm install

# Verificar se Vitest está instalado
npx vitest --version
```

## 📝 Exemplo de Execução Completa

```bash
$ node tests/run-critical-tests.js

🩺 TeleMed Sistema - Critical Tests
==================================================
Running 5 critical test suites...

🏥 Patient Creation: Tests patient registration and validation
✅ Patient Creation - PASSED

📅 Appointment Booking: Tests appointment scheduling and doctor assignment  
✅ Appointment Booking - PASSED

🎥 Video Consultation: Tests WebRTC video consultation flow
✅ Video Consultation - PASSED

⚡ API Status: Tests API health and performance
✅ API Status - PASSED

🔄 Complete Flow: Tests end-to-end doctor-patient workflow
✅ Complete Flow - PASSED

==================================================
📊 Test Results:
   ✅ Passed: 5/5
   ❌ Failed: 0/5

🎉 All critical tests passed! System ready for production.
```

---

**🎯 Objetivo**: Garantir que o TeleMed Sistema funcione perfeitamente em produção através de testes automatizados abrangentes.