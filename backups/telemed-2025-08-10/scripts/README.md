# Scripts de Monitoramento - TeleMed Sistema

## Scripts Disponíveis

### 🤖 agent-health.sh
Script para verificar a saúde geral do AI Agent e estatísticas de uso.

**Uso:**
```bash
./scripts/agent-health.sh
```

**Saída esperada:**
- Health check completo com status do serviço
- Estatísticas de uso (requests, errors, fallbacks)
- Informações de modelos utilizados

### 📊 agent-usage.sh  
Script para análise detalhada do uso do AI Agent, incluindo dados locais.

**Uso:**
```bash
./scripts/agent-usage.sh
```

**Saída esperada:**
- Estatísticas detalhadas de uso
- Conteúdo do arquivo de métricas local
- Informações de modelos e quotas

## Equivalentes aos Scripts do Package.json

Como não podemos modificar o `package.json` diretamente, estes scripts substituem:

```json
{
  "scripts": {
    "agent:health": "curl -s http://localhost:5000/api/ai-agent/health | jq",
    "agent:usage": "curl -s http://localhost:5000/api/ai-agent/usage-local | jq"
  }
}
```

## Endpoints Monitorados

- **Health Check:** `GET /api/ai-agent/health`
- **Usage Stats:** `GET /api/ai-agent/usage-local`
- **Storage File:** `storage/ai-usage.json`

## Pré-requisitos

- Servidor TeleMed rodando na porta 5000
- `jq` instalado para formatação JSON (opcional)
- `curl` disponível no sistema

## Exemplo de Saída

```json
{
  "status": "ok",
  "service": "ai-agent", 
  "health": "healthy",
  "details": {
    "errorRate": 0,
    "todayRequests": 1,
    "quotaErrors": 0,
    "rateLimitErrors": 0,
    "billingErrors": 0
  }
}
```