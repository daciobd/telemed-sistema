# GUIA: CONFIGURAR DOMÍNIO HOSTINGER → REPLIT

## 🎯 MÉTODO RECOMENDADO: DEPLOYMENT REPLIT

### PASSO 1: DEPLOY NO REPLIT
1. **Clique no botão "Deploy" no Replit** (canto superior direito)
2. **Escolha o plano**: Autoscale ou Static
3. **Aguarde o deployment**: Replit criará uma URL pública
4. **Anote a URL**: Será algo como `https://seu-projeto.replit.app`

### PASSO 2: CONFIGURAR DNS NA HOSTINGER
Com a URL do Replit Deploy, você tem duas opções:

#### OPÇÃO A: CNAME RECORD (RECOMENDADO)
```
Type: CNAME
Name: @ (ou www)
Points to: seu-projeto.replit.app
TTL: 14400
```

#### OPÇÃO B: A RECORD (SE NECESSÁRIO)
Se o Replit fornecer um IP específico:
```
Type: A
Name: @
Points to: [IP_DO_REPLIT]
TTL: 14400
```

## 🔧 CONFIGURAÇÃO ATUAL DO PROJETO

### DEPLOYMENT CONFIGURADO
```yaml
# .replit file atual
[deployment]
deploymentTarget = "gce"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]

# Porta configurada
[[ports]]
localPort = 5000
externalPort = 80
```

### SCRIPTS PRONTOS
```json
// package.json
"scripts": {
  "dev": "tsx server/index.ts",
  "build": "tsc && vite build",
  "start": "node dist/server/index.js"
}
```

## 📋 PASSO A PASSO COMPLETO

### 1. PREPARAR PARA DEPLOYMENT
```bash
# O projeto já está pronto para deploy
# Servidor Express configurado
# Porta 5000 mapeada para porta 80
# Build scripts prontos
```

### 2. FAZER DEPLOY NO REPLIT
1. **Clique em "Deploy"** no topo do Replit
2. **Selecione plano**:
   - **Autoscale**: Para produção (escala automática)
   - **Static**: Para testes (mais barato)
3. **Configure domínio personalizado**:
   - Adicione `telamedconsulta.com` nas configurações
   - Replit fornecerá instruções específicas

### 3. CONFIGURAR DNS HOSTINGER
Na sua imagem, vejo o campo "Points to" vazio. Você deve preencher com:

#### SE REPLIT DER UMA URL:
```
Type: CNAME
Name: @
Points to: seu-projeto.replit.app
```

#### SE REPLIT DER UM IP:
```
Type: A
Name: @
Points to: [IP_FORNECIDO_PELO_REPLIT]
```

## 🌐 ALTERNATIVA: USAR REPLIT COMO SUBDOMAIN

### CONFIGURAÇÃO TEMPORÁRIA
Enquanto configura o domínio principal:
```
Type: CNAME
Name: app
Points to: seu-projeto.replit.app
```
Isso criará: `app.telamedconsulta.com`

## ⚡ CONFIGURAÇÕES EXTRAS

### VARIÁVEIS DE AMBIENTE
O Replit manterá automaticamente:
```
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=5000
```

### SSL/HTTPS
- Replit Deploy fornece SSL automático
- Seus links `https://telamedconsulta.com` funcionarão automaticamente

## 🚀 PRÓXIMOS PASSOS

1. **DEPLOY AGORA**: Clique no botão Deploy do Replit
2. **AGUARDE URL**: Replit fornecerá a URL de produção
3. **CONFIGURE DNS**: Use a URL na Hostinger (campo "Points to")
4. **TESTE**: Aguarde propagação DNS (até 24h)

## 📞 SE PRECISAR DE AJUDA

### REPLIT SUPPORT
- Documentação: docs.replit.com
- Suporte direto no Replit se tiver problemas

### HOSTINGER SUPPORT  
- Chat da Hostinger para questões de DNS
- Tempo de propagação: 1-24 horas

---

## ✅ STATUS ATUAL
- **Projeto**: ✅ Pronto para deploy
- **Configuração**: ✅ Ports e scripts configurados  
- **SSL**: ✅ Automático no Replit Deploy
- **Domínio**: ⏳ Aguardando deploy para obter URL

**PRÓXIMO PASSO**: Clique em "Deploy" no Replit!