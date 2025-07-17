# TeleMed Sistema - Guia de Setup de Monitoramento

## 📊 Sistema de Monitoramento Completo

Este guia configura monitoramento avançado com integrações para UptimeRobot, StatusCake, Slack e Telegram, incluindo alertas automáticos e dashboards.

## 🔧 Configurações Necessárias

### 1. Slack Integration

#### Criar Bot do Slack:
1. Acesse https://api.slack.com/apps
2. Clique em "Create New App" → "From scratch"
3. Nome: "TeleMed Monitoring Bot"
4. Selecione seu workspace

#### Configurar Permissões:
```
OAuth & Permissions → Scopes → Bot Token Scopes:
- chat:write
- chat:write.public
- channels:read
- groups:read
```

#### Obter Tokens:
- `SLACK_BOT_TOKEN`: OAuth & Permissions → Bot User OAuth Token (xoxb-...)
- `SLACK_CHANNEL_ID`: Clique direito no canal → View channel details → Copy ID

### 2. Telegram Integration

#### Criar Bot do Telegram:
1. Abra o Telegram e procure por @BotFather
2. Envie `/newbot`
3. Nome: "TeleMed Monitoring"
4. Username: "TeleMedMonitoringBot" (ou similar)

#### Obter Tokens:
- `TELEGRAM_BOT_TOKEN`: Fornecido pelo BotFather
- `TELEGRAM_CHAT_ID`: 
  1. Adicione o bot ao grupo/canal
  2. Envie uma mensagem
  3. Acesse: `https://api.telegram.org/bot<TOKEN>/getUpdates`
  4. Procure por "chat":{"id":-XXXXXXXXX}

### 3. UptimeRobot Integration

#### Configurar API:
1. Acesse https://uptimerobot.com/
2. Dashboard → Settings → API Settings
3. Crie uma API Key (Main API Key)
4. `UPTIMEROBOT_API_KEY`: Sua chave da API

### 4. StatusCake Integration

#### Configurar API:
1. Acesse https://www.statuscake.com/
2. Account → API Keys
3. Crie uma nova API Key
4. `STATUSCAKE_API_KEY`: Sua chave da API

## 🌍 Variáveis de Ambiente

### Render/Production:
```bash
# Slack
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL_ID=C1234567890

# Telegram
TELEGRAM_BOT_TOKEN=123456789:your-telegram-bot-token
TELEGRAM_CHAT_ID=-1001234567890

# UptimeRobot
UPTIMEROBOT_API_KEY=your-uptimerobot-api-key

# StatusCake
STATUSCAKE_API_KEY=your-statuscake-api-key
```

### Desenvolvimento Local (.env):
```bash
# Copie as mesmas variáveis para .env
```

## 🚀 Como Usar

### 1. Dashboard de Monitoramento

Acesse `/monitoring` para ver:
- Status em tempo real
- Gráficos de performance
- História de health checks
- Configuração de alertas

### 2. Endpoints de Monitoramento

```bash
# Status atual
GET /api/status

# Métricas históricas
GET /api/metrics

# Teste de alertas (desenvolvimento)
POST /api/test-alert
{
  "type": "warning",
  "title": "Teste",
  "message": "Mensagem de teste"
}

# Configurar monitoramento externo
POST /api/setup-monitoring
```

### 3. Alertas Automáticos

#### Tipos de Alertas:
- **Status Change**: Quando status muda (healthy ↔ degraded ↔ unhealthy)
- **Critical Errors**: Quando health checks críticos falham
- **Performance**: Quando response time > 5s
- **Daily Reports**: Relatório diário de saúde

#### Cooldowns:
- Status Change: 5 minutos
- Error Alerts: 10 minutos
- Performance: 15 minutos
- Daily Reports: 24 horas

## 📱 Configuração de Canais

### Slack:
```
#telemed-alerts - Alertas críticos
#telemed-reports - Relatórios diários
#telemed-monitoring - Logs detalhados
```

### Telegram:
```
TeleMed Alerts - Grupo para alertas
TeleMed Reports - Canal para relatórios
```

## 🧪 Testes

### Teste Local:
```bash
# Verificar health checks
curl http://localhost:5000/api/status

# Enviar alerta de teste
curl -X POST http://localhost:5000/api/test-alert \
  -H "Content-Type: application/json" \
  -d '{"type":"info","title":"Teste Local","message":"Sistema funcionando"}'
```

### Teste em Produção:
```bash
# Status do sistema
curl https://sua-app.onrender.com/api/status

# Setup de monitoramento externo
curl -X POST https://sua-app.onrender.com/api/setup-monitoring
```

## 🔍 Monitoramento Externo

### UptimeRobot - URLs Monitoradas:
- `https://sua-app.onrender.com/` - Site principal
- `https://sua-app.onrender.com/health` - Health check
- `https://sua-app.onrender.com/api/status` - API status

### StatusCake - Configurações:
- Intervalo: 5 minutos
- Timeout: 30 segundos
- Localizações: Múltiplas regiões
- Alertas: Email + Webhook

## 📈 Métricas Coletadas

### Performance:
- Response time (ms)
- Memory usage (MB)
- CPU usage
- Uptime

### Health Checks:
- Database connectivity
- Memory usage threshold
- Disk space
- API responsiveness
- Static files availability
- Session store status

### Services:
- Web server status
- Health endpoint
- Static files serving
- Session management

## 🚨 Troubleshooting

### Alertas não funcionam:
1. Verificar tokens nas variáveis de ambiente
2. Testar bot permissions no Slack/Telegram
3. Verificar logs do servidor
4. Usar endpoint de teste: `/api/test-alert`

### Monitoramento externo falha:
1. Verificar API keys
2. Verificar quotas das APIs
3. Verificar URLs acessíveis publicamente
4. Verificar logs de setup

### Performance degradada:
1. Verificar uso de memória
2. Verificar response times
3. Verificar logs de erro
4. Verificar health checks específicos

## 📊 Dashboard Features

### Visão Geral:
- Status atual do sistema
- Métricas em tempo real
- Health checks individuais
- Erros recentes

### Gráficos:
- Response time ao longo do tempo
- Uso de memória histórico
- Status availability

### Serviços:
- Status de todos os endpoints
- Configuração de monitoramento externo
- Status das integrações

### Alertas:
- Teste de notificações
- Configuração de integrações
- Histórico de alertas

## 🔄 Manutenção

### Limpeza Automática:
- Métricas antigas são removidas automaticamente
- Máximo de 100 registros históricos
- Cooldowns de alertas evitam spam

### Backup de Configurações:
- Configurações são persistidas
- Health checks executam periodicamente
- Relatórios diários automáticos

---

## ✅ Checklist de Setup

- [ ] Slack bot configurado e adicionado ao canal
- [ ] Telegram bot configurado e chat ID obtido
- [ ] UptimeRobot API key configurada
- [ ] StatusCake API key configurada
- [ ] Variáveis de ambiente definidas
- [ ] Teste de alertas executado
- [ ] Monitoramento externo configurado
- [ ] Dashboard acessível em /monitoring

```bash
# Comando para testar tudo
curl -X POST http://localhost:5000/api/test-alert \
  -H "Content-Type: application/json" \
  -d '{"type":"info","title":"Setup Completo","message":"Monitoramento TeleMed configurado com sucesso!"}'
```