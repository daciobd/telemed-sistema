# TeleMed Sistema - Guia de Setup CI/CD

## 🚀 Sistema de Automação Completo

Este sistema oferece automação completa de CI/CD com GitHub Actions, Render Deploy Hooks, testes automatizados e rollback automático.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Git configurado
- Conta no Render.com
- Repositório no GitHub

## 🔧 Configuração Inicial

### 1. Scripts Locais

Todos os scripts já estão incluídos e configurados:

```bash
# Tornar executáveis (já feito automaticamente)
chmod +x test-deployment.sh prepare-render.sh backup-and-rollback.sh ci-cd-automation.sh
```

### 2. Variáveis de Ambiente (GitHub Secrets)

Configure no GitHub → Settings → Secrets and variables → Actions:

#### Obrigatórias:
- `RENDER_DEPLOY_HOOK`: Hook do Render para deploy automático
- `RENDER_DEPLOY_URL`: URL da aplicação no Render (ex: https://telemed.onrender.com)

#### Opcionais:
- `RENDER_PRODUCTION_HOOK`: Hook específico para produção
- `RENDER_STAGING_HOOK`: Hook específico para staging

### 3. Configuração do Render

1. Conecte seu repositório GitHub ao Render
2. Configure as variáveis de ambiente:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=seu_postgresql_url
   SESSION_SECRET=seu_session_secret
   ```
3. Obtenha o Deploy Hook:
   - Render Dashboard → Seu serviço → Settings → Deploy Hook
   - Copie a URL e adicione como `RENDER_DEPLOY_HOOK`

## 🚀 Como Usar

### Automação Local

```bash
# Deploy completo (recomendado)
./ci-cd-automation.sh full-deploy

# Deploy rápido
./ci-cd-automation.sh quick-deploy

# Apenas testes
./ci-cd-automation.sh test-only

# Status do sistema
./ci-cd-automation.sh status

# Rollback de emergência
./ci-cd-automation.sh emergency-rollback
```

### GitHub Actions

#### Deploy Automático
- Push para `main` → Deploy automático para produção
- Pull Request → Apenas testes
- Push para `develop` → Testes completos

#### Deploy Manual
1. GitHub → Actions → "Render Deploy Hook"
2. Escolha environment (production/staging)
3. Opção de executar testes pós-deploy

## 🧪 Testes Automatizados

### O que é testado:

1. **Health Check** (`/health`)
   - Status básico da aplicação
   - Uptime e versão

2. **API Status** (`/api/status`)
   - Verificações comprehensivas
   - Performance metrics
   - Status de serviços

3. **Endpoints Críticos**
   - `/doctor-dashboard`
   - `/patient-dashboard`
   - `/security`

4. **Performance**
   - Response time < 2s
   - Memory usage
   - Service availability

### Executar Testes Localmente

```bash
# Teste local
./test-deployment.sh

# Teste em produção
DEPLOY_URL=https://sua-app.onrender.com ./test-deployment.sh
```

## 📦 Sistema de Backup

### Backup Automático
- Feito automaticamente antes de cada deploy
- Inclui código fonte, configurações e Git history
- Mantém até 10 backups (configurável)

### Comandos de Backup

```bash
# Criar backup
./backup-and-rollback.sh backup

# Listar backups
./backup-and-rollback.sh list

# Restaurar backup específico
./backup-and-rollback.sh restore nome_do_backup

# Rollback para commit anterior
./backup-and-rollback.sh rollback HEAD~1

# Limpeza automática
./backup-and-rollback.sh cleanup
```

## 🔄 Processo de Deploy

### Deploy Automático (GitHub Actions)

1. **Trigger**: Push para `main`
2. **Build & Test**: Múltiplas versões do Node.js
3. **Security Scan**: npm audit e verificação de secrets
4. **Deploy**: Trigger do Render via webhook
5. **Test**: Verificação pós-deploy
6. **Notification**: Status do deploy

### Rollback Automático

Se o deploy falhar:
1. Detecção automática de falha
2. Restauração do backup anterior
3. Verificação pós-rollback
4. Notificação do status

## 📊 Monitoramento

### Endpoints de Monitoramento

- `/health` - Health check básico
- `/api/status` - Status comprehensivo
- `/ready` - Readiness probe (K8s compatible)
- `/live` - Liveness probe (K8s compatible)

### Métricas Incluídas

- **Performance**: Response time, memory usage, CPU
- **Services**: Database, session store, static files
- **Application**: Uptime, version, environment
- **Health**: Overall status, error rates

## 🚨 Troubleshooting

### Problemas Comuns

1. **Deploy Hook não funciona**
   ```bash
   # Verificar URL do hook
   curl -X POST $RENDER_DEPLOY_HOOK
   ```

2. **Testes falham**
   ```bash
   # Debug local
   DEPLOY_URL=http://localhost:5000 ./test-deployment.sh
   ```

3. **Backup corrompido**
   ```bash
   # Listar e verificar backups
   ./backup-and-rollback.sh list
   ```

4. **GitHub Actions falha**
   - Verificar secrets configurados
   - Verificar logs detalhados no Actions tab

### Logs Úteis

```bash
# Status completo
./ci-cd-automation.sh status

# Logs do Render
# Render Dashboard → Logs

# Logs do GitHub Actions
# GitHub → Actions → Workflow específico
```

## 🔐 Segurança

### Boas Práticas Implementadas

- Secrets nunca expostos nos logs
- Backup automático antes de mudanças
- Testes de segurança automatizados
- Rollback automático em falhas
- Verificação de secrets expostos

### Configurações de Segurança

- HTTPS obrigatório em produção
- Headers de segurança configurados
- Session security habilitada
- CORS configurado adequadamente

## 📈 Otimizações

### Performance

- Build otimizado para produção
- Cache de dependências
- Compressão de assets
- Testes de performance automatizados

### Eficiência

- Paralelização de testes
- Cache de Node.js
- Deploy incremental
- Cleanup automático de builds antigos

## 📞 Suporte

Para problemas ou dúvidas:

1. Verificar logs do Render
2. Executar `./ci-cd-automation.sh status`
3. Verificar GitHub Actions logs
4. Executar testes locais para debug

---

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Deploy hook configurado
- [ ] Testes passando localmente
- [ ] Backup atual criado
- [ ] Notificações configuradas

```bash
# Comando completo para primeiro deploy
./ci-cd-automation.sh full-deploy
```