# 🚂 Deploy TeleMed no Railway - Instruções Detalhadas

## 📋 Checklist de Preparação
Seu projeto já está pronto com:
- ✅ `railway.json` - Configuração otimizada
- ✅ `package.json` - Scripts build/start configurados  
- ✅ `Dockerfile` - Backup para containerização
- ✅ Servidor na porta 5000 funcionando
- ✅ Health check endpoint: `/health`

## 🎯 Passos para Deploy

### 1. Acessar Railway
- Vá para: https://railway.app
- Clique em **"Login"** 
- Use GitHub para fazer login

### 2. Criar Novo Projeto
- Clique **"New Project"**
- Selecione **"Deploy from GitHub repo"**
- Procure por `telemed-consultation` (seu repositório)
- Clique **"Deploy Now"**

### 3. Adicionar PostgreSQL
- No dashboard do projeto, clique **"+ New"**
- Selecione **"Database"** → **"PostgreSQL"**
- O Railway criará automaticamente uma instância

### 4. Configurar Variáveis de Ambiente
Clique no serviço da aplicação → **"Variables"** e adicione:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
SESSION_SECRET=telemed-railway-secret-2025-production
STRIPE_SECRET_KEY=sk_test_51... (sua chave)
VITE_STRIPE_PUBLIC_KEY=pk_test_51... (sua chave pública)
NODE_ENV=production
PORT=5000
REPL_ID=telemed-railway-prod
REPLIT_DOMAINS=telemed.railway.app
ISSUER_URL=https://replit.com/oidc
```

### 5. Verificar Build
- O Railway executará automaticamente:
  - `npm install` (dependências)
  - `npm run build` (build do projeto)
  - `npm start` (iniciar servidor)

### 6. Monitorar Deploy
- Acompanhe logs em tempo real na aba **"Deployments"**
- Aguarde status **"Success"** (2-3 minutos)

### 7. Obter URL Final
- Na aba **"Settings"** → **"Domains"**
- Copie a URL gerada: `https://telemed-[hash].up.railway.app`

## 🧪 Testes Pós-Deploy

### URLs para Testar
1. **Health Check**: `[sua-url]/health`
2. **Landing Page**: `[sua-url]/`
3. **Demo Médico**: `[sua-url]/demo-medico`
4. **Teste Videoconsulta**: `[sua-url]/video-test`

### Verificações
- ✅ Landing page carrega com design moderno
- ✅ Botões de navegação funcionam
- ✅ Login via Replit funciona
- ✅ Banco de dados conecta corretamente

## 🔧 Solução de Problemas

### Build Falha
**Problema**: Erro durante `npm run build`
**Solução**: 
- Verifique logs detalhados
- Confirme que todas dependências estão listadas
- Re-deploy se necessário

### Banco Não Conecta
**Problema**: Erro de conexão PostgreSQL
**Solução**:
- Verifique se `DATABASE_URL` está usando `${{Postgres.DATABASE_URL}}`
- Confirme que serviço PostgreSQL está ativo
- Reinicie o deploy

### Aplicação Não Responde
**Problema**: 502 Bad Gateway
**Solução**:
- Confirme que aplicação está escutando na `PORT` correta
- Verifique health check em `/health`
- Examine logs de runtime

## 💰 Custos Esperados
- **Aplicação**: ~$1-3/mês (uso básico)
- **PostgreSQL**: Incluído no plano
- **Crédito Gratuito**: $5/mês iniciais

## 🎉 Resultado Final

Após sucesso do deploy:
- ✅ URL pública funcionando: `https://[hash].up.railway.app`
- ✅ HTTPS automático com certificado SSL
- ✅ PostgreSQL configurado e funcionando
- ✅ Pronto para demonstrações aos médicos
- ✅ Deploy automático a cada push no GitHub

## 📱 Compartilhamento

Para médicos colegas testarem:
```
🩺 TeleMed Sistema - Plataforma de Telemedicina

Acesse: https://[sua-url].up.railway.app

Funcionalidades para testar:
✓ Demo Médico (sem cadastro): /demo-medico
✓ Teste Videoconsulta: /video-test  
✓ Cadastro Médico: /register-doctor
✓ Sistema completo de teleconsultas

Desenvolvido por: [Seu Nome]
```

A partir de agora, você terá uma URL funcional para compartilhar com médicos interessados em testar a plataforma!