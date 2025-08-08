# Sistema de Tratamento de Erros OpenAI - TeleMed

## Overview
Implementado sistema avançado de tratamento e logging de erros da OpenAI API para o ChatGPT Agent do TeleMed Sistema.

## Tipos de Erro Tratados

### 1. Quota Excedida (`insufficient_quota`)
```
🚫 QUOTA EXCEDIDA: Limite de uso da OpenAI atingido
```
**Causa:** Limite mensal ou de créditos da OpenAI foi atingido
**Ação:** Usuário deve verificar billing no dashboard OpenAI

### 2. Limite de Cobrança (`billing_hard_limit_reached`)  
```
💳 LIMITE DE BILLING: Limite de cobrança atingido
```
**Causa:** Limite hard de billing configurado foi atingido
**Ação:** Aumentar limite de cobrança nas configurações

### 3. Rate Limit (`rate_limit_exceeded` ou status 429)
```
⏱️ RATE LIMIT: Muitas requisições simultâneas
⚠️ RATE LIMIT 429: Limite de requisições por minuto excedido
```
**Causa:** Muitas requisições em pouco tempo
**Ação:** Implementar retry com backoff ou reduzir frequência

### 4. API Key Inválida (status 401)
```
🔑 API KEY INVÁLIDA: Verifique OPENAI_API_KEY
```
**Causa:** OPENAI_API_KEY incorreta ou não configurada
**Ação:** Verificar e reconfigurar a variável de ambiente

## Estrutura de Logging

### Console Logs Detalhados
```javascript
console.error("OPENAI_ERROR", {
  status: err.response?.status,
  data: err.response?.data, 
  code: err.code,
  type: err.type,
  message: err.message
});
```

### Resposta de API Estruturada
```json
{
  "success": false,
  "error": "Quota da OpenAI excedida. Verifique seu plano de billing.",
  "errorCode": "QUOTA_EXCEEDED",
  "details": "RateLimitError: 429 You exceeded your current quota...",
  "timestamp": "2025-08-08T11:21:57.123Z"
}
```

## Arquivos Modificados

### `server/chatgpt-agent.ts`
- Método `inicializar()`: Tratamento completo de erros de inicialização
- Método `perguntarAgent()`: Tratamento de erros em consultas
- Logging detalhado com classificação automática de tipos de erro

### `server/routes/ai-agent.ts`
- Rota `/ask`: Resposta estruturada com errorCode específico
- Rota `/initialize`: Tratamento específico para erros de inicialização
- Mensagens de erro amigáveis para diferentes cenários

## Códigos de Erro Padronizados

| Código | Descrição | Status HTTP |
|--------|-----------|-------------|
| `QUOTA_EXCEEDED` | Quota da OpenAI excedida | 500 |
| `BILLING_LIMIT` | Limite de cobrança atingido | 500 |
| `RATE_LIMIT` | Rate limit excedido | 500 |
| `INVALID_API_KEY` | API Key inválida | 500 |
| `UNKNOWN_ERROR` | Erro não classificado | 500 |

## Benefícios

1. **Debugging Facilitado**: Logs detalhados para identificação rápida de problemas
2. **Respostas Consistentes**: Estrutura padronizada de erro para frontend
3. **Experiência do Usuário**: Mensagens claras sobre o que fazer em cada erro
4. **Monitoramento**: Logs estruturados para análise e alertas
5. **Manutenibilidade**: Código organizado e fácil de estender

## Uso no Frontend

```javascript
try {
  const response = await fetch('/api/ai-agent/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'teste' })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    switch(data.errorCode) {
      case 'QUOTA_EXCEEDED':
        showError('Limite da OpenAI atingido. Contate o administrador.');
        break;
      case 'RATE_LIMIT':
        showError('Muitas requisições. Tente novamente em alguns minutos.');
        break;
      default:
        showError(data.error);
    }
  }
} catch (error) {
  console.error('Request failed:', error);
}
```

## Data de Implementação
**8 de agosto de 2025** - Sistema implementado e testado com sucesso.