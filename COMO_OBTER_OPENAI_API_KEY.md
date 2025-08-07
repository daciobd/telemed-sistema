# 🔑 Como Obter Chave OpenAI API com Quota Disponível

## 📋 **OPÇÕES DISPONÍVEIS**

### **1. Conta Gratuita OpenAI**
- **Créditos:** $5 USD gratuitos por 3 meses
- **Limitações:** Expires após 3 meses se não usado
- **Modelos:** Acesso limitado ao GPT-3.5-turbo
- **Ideal para:** Testes iniciais e prototipagem

### **2. Plano Pay-as-you-go (Recomendado)**
- **Pagamento:** Por uso real (por token)
- **Créditos mínimos:** $5 USD 
- **Modelos:** GPT-3.5-turbo, GPT-4o-mini, GPT-4o
- **Custo aproximado:** $0.002 por 1K tokens (muito barato)
- **Ideal para:** Produção e uso regular

## 🚀 **PASSO A PASSO DETALHADO**

### **Passo 1: Criar Conta na OpenAI**
1. Acesse: https://platform.openai.com
2. Clique em "Sign Up" 
3. Use e-mail válido + verificação
4. Complete o perfil

### **Passo 2: Configurar Billing**
1. Vá em "Settings" > "Billing"
2. Adicione método de pagamento (cartão)
3. Defina limite de uso (ex: $10/mês)
4. Ative "Auto-recharge" se desejar

### **Passo 3: Gerar API Key**
1. Vá em "API Keys" no menu lateral
2. Clique "Create new secret key"
3. Dê um nome: "TeleMed-Production"
4. Copie a chave (começa com sk-...)
5. **IMPORTANTE:** Salve imediatamente (não aparece novamente)

### **Passo 4: Testar API Key**
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SUA_CHAVE_AQUI" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 50
  }'
```

## 💰 **CUSTOS ESTIMADOS TELEMED**

### **Uso Típico do TeleMed Consulta:**
- **Consulta simples:** ~500 tokens = $0.001 USD
- **Geração de código:** ~2000 tokens = $0.004 USD  
- **Análise médica:** ~1500 tokens = $0.003 USD
- **100 consultas/dia:** ~$0.30 USD/dia = $9 USD/mês

### **Comparação de Modelos:**
| Modelo | Custo por 1K tokens | Recomendação |
|--------|-------------------|-------------|
| GPT-3.5-turbo | $0.002 | Ideal para produção |
| GPT-4o-mini | $0.15 | Análises complexas |
| GPT-4o | $5.00 | Casos especiais |

## ⚡ **ATIVAÇÃO RÁPIDA (15 minutos)**

### **Opção Express:**
1. **Conta Nova:** https://platform.openai.com/signup
2. **Adicionar $5:** Settings > Billing > Add Payment
3. **Criar Key:** API Keys > Create New Secret Key  
4. **Copiar Chave:** Começará com "sk-proj-" ou "sk-"
5. **Adicionar no Replit:** Secrets > OPENAI_API_KEY

### **Para Reativação de Quota:**
- **Conta existente:** Adicione créditos em Billing
- **Reset mensal:** Quotas gratuitas resetam todo mês
- **Upgrade:** Mova de Free Tier para Pay-as-you-go

## 🔧 **CONFIGURAÇÃO NO TELEMED**

### **Método 1: Via Replit Secrets**
1. Vá em Secrets (painel lateral)
2. Adicione: `OPENAI_API_KEY`
3. Cole sua chave OpenAI
4. Restart o projeto

### **Método 2: Via Environment**
```bash
export OPENAI_API_KEY="sk-proj-sua-chave-aqui"
npm run dev
```

### **Verificar Funcionamento:**
```bash
curl http://localhost:5000/api/ai-agent/status
# Deve retornar: "status": "online"
```

## 🛡️ **SEGURANÇA DA API KEY**

### **Boas Práticas:**
- ❌ **Nunca** commitar chave no código
- ✅ **Sempre** usar environment variables
- ✅ Definir limites de uso mensal
- ✅ Monitorar uso regularmente
- ✅ Rotacionar chaves periodicamente

### **Configurar Limites:**
1. OpenAI Dashboard > Settings > Billing
2. Set "Monthly budget": $10-20
3. Enable "Email notifications"
4. Set "Hard limit": Para evitar surpresas

## 📊 **MONITORAMENTO**

### **Dashboard OpenAI:**
- Usage: Tokens consumidos
- Costs: Gastos em tempo real
- Rate limits: Limites por minuto
- Error logs: Problemas de API

### **TeleMed Logs:**
```bash
# Verificar logs do agent
tail -f logs/chatgpt-agent.log

# Status em tempo real
curl http://localhost:5000/api/ai-agent/status
```

## 🚨 **TROUBLESHOOTING COMUM**

### **Error 401: Invalid API Key**
- Verificar se chave está correta
- Confirmar que não expirou
- Recriar chave se necessário

### **Error 429: Rate Limited**
- Aguardar reset (1 minuto)
- Considerar upgrade de tier
- Implementar retry logic

### **Error 429: Quota Exceeded**
- Adicionar créditos na conta
- Verificar billing status
- Considerar plano pay-as-you-go

## 💡 **DICAS PARA ECONOMIZAR**

### **Otimizações:**
1. **Use GPT-3.5-turbo** para casos simples
2. **Limite max_tokens** em requests
3. **Cache respostas** frequentes
4. **Implemente retry** com backoff
5. **Monitore usage** semanalmente

### **Configuração Econômica TeleMed:**
```javascript
// server/chatgpt-agent.ts
const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  max_tokens: 500,        // Limite menor
  temperature: 0.7,
  frequency_penalty: 0.1  // Reduz repetições
});
```

## ✅ **CHECKLIST FINAL**

- [ ] Conta OpenAI criada
- [ ] Método de pagamento adicionado  
- [ ] Limites de uso configurados
- [ ] API Key gerada e salva
- [ ] Chave adicionada no Replit Secrets
- [ ] Projeto reiniciado
- [ ] Status confirmado: "online"
- [ ] Teste realizado com sucesso

---

**🎯 Resultado Esperado:** Após seguir estes passos, o ChatGPT Agent do TeleMed passará de "simulation_mode" para "online", com todas as funcionalidades de IA médica ativas!

**⏱️ Tempo Total:** 15-30 minutos
**💰 Custo Inicial:** $5-10 USD (suficiente para milhares de consultas)