# 🔧 COMO CONFIGURAR ENVIRONMENT VARIABLES NO RAILWAY

## PASSO A PASSO SIMPLES

### 1. NO RAILWAY DASHBOARD
Depois de conectar o repositório, você verá uma tela do projeto. Procure por:
- **"Variables"** ou **"Environment"** (aba lateral)
- **"Settings"** > **"Environment Variables"**

### 2. ADICIONAR AS VARIÁVEIS

#### OBRIGATÓRIAS (Railway pedirá):

**SESSION_SECRET**
```
Nome: SESSION_SECRET
Valor: telemed_sistema_secreto_super_forte_minimo_32_chars_2025
```

**REPL_ID** 
```
Nome: REPL_ID  
Valor: (usar o mesmo que está no Replit atual)
```

**REPLIT_DOMAINS**
```
Nome: REPLIT_DOMAINS
Valor: telemed-production.up.railway.app
```

**ISSUER_URL**
```
Nome: ISSUER_URL
Valor: https://replit.com/oidc
```

### 3. OPCIONAIS (para funcionalidades completas):

**STRIPE (se quiser pagamentos)**
```
Nome: STRIPE_SECRET_KEY
Valor: sk_test_... (sua chave do Stripe)

Nome: VITE_STRIPE_PUBLIC_KEY  
Valor: pk_test_... (sua chave pública do Stripe)
```

### 4. AUTOMÁTICAS (Railway cria sozinho):

**DATABASE_URL** - Railway cria automaticamente quando você adiciona PostgreSQL
**NODE_ENV** - Railway define como "production"

## 📝 COMO ADICIONAR NO RAILWAY

### Interface Railway:
1. **Clique "Add Variable"**
2. **Digite o Nome** (ex: SESSION_SECRET)
3. **Cole o Valor** 
4. **Clique "Add"**
5. **Repita** para cada variável

### Exemplo Visual:
```
┌─────────────────────────────────────┐
│ Environment Variables               │
├─────────────────────────────────────┤
│ Name: SESSION_SECRET                │
│ Value: telemed_sistema_secreto...   │
│ [Add Variable]                      │
├─────────────────────────────────────┤
│ Name: REPL_ID                       │
│ Value: seu_repl_id_aqui            │
│ [Add Variable]                      │
└─────────────────────────────────────┘
```

## ⚡ VALORES PRONTOS PARA COPIAR

### SESSION_SECRET (copie e cole):
```
telemed_sistema_secreto_super_forte_minimo_32_chars_2025
```

### ISSUER_URL (copie e cole):
```
https://replit.com/oidc
```

### REPLIT_DOMAINS (copie e cole):
```
telemed-production.up.railway.app
```

## 🎯 RESULTADO

Depois de adicionar as variáveis:
- **Railway fará o deploy automático**
- **PostgreSQL será conectado**
- **Sistema ficará online**
- **URL será gerada**: `https://telemed-[hash].up.railway.app`

## 🆘 SE TIVER DÚVIDA

1. **PostgreSQL**: Railway pergunta automaticamente se quer adicionar
2. **Variáveis**: Use a aba "Variables" ou "Environment" 
3. **Deploy**: Acontece automaticamente após configurar
4. **URL**: Aparece no dashboard após deploy concluído

**É mais simples do que parece! Railway guia você através do processo.**