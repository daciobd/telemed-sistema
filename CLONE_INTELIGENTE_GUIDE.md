# Guia: Clone Inteligente TeleMed

## Objetivo
Criar um projeto simplificado baseado no TeleMed atual, mantendo apenas os arquivos essenciais para facilitar testes e experimentação.

## Passo 1: Criar Novo Projeto no Replit

1. Acesse **replit.com**
2. Clique em **"Create App"**
3. Selecione **"Choose a Template"**
4. Busque por **"React TypeScript"**
5. Nome: **"telemed-clone"** ou **"telemed-test"**
6. Privacidade: **Private**
7. Clique **"Create App"**

## Passo 2: Estrutura Essencial

### Arquivos Core para Copiar:

#### **Configuração Base:**
```
package.json (dependências essenciais)
tsconfig.json
vite.config.ts
tailwind.config.ts
components.json (shadcn/ui)
```

#### **Backend Essencial:**
```
server/
├── index.ts (servidor principal simplificado)
├── utils/
│   ├── aiUsage.ts
│   └── webhook.ts
└── routes/
    └── ai-agent.ts (funcionalidade principal)
```

#### **Frontend Core:**
```
client/src/
├── App.tsx (aplicação principal)
├── pages/
│   ├── Dashboard.tsx (dashboard aquarela)
│   └── Login.tsx (autenticação básica)
├── components/ui/ (shadcn components)
└── lib/
    └── utils.ts
```

#### **Estilos e Assets:**
```
public/ (assets básicos)
index.css (estilos aquarela)
```

## Passo 3: Simplificações Recomendadas

### O que MANTER:
- Dashboard aquarela (visual principal)
- AI Agent básico
- Sistema de alertas Slack
- Autenticação simples
- Design responsivo

### O que REMOVER:
- PostgreSQL complexo (usar localStorage inicialmente)
- Múltiplas páginas HTML
- Sistema de download complexo
- Funcionalidades médicas avançadas
- Integrações externas desnecessárias

## Passo 4: Configuração Inicial

### 1. **Instalar Dependências Essenciais:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.3.0",
    "express": "^4.18.0",
    "axios": "^1.4.0",
    "openai": "^4.0.0"
  }
}
```

### 2. **Servidor Simplificado (server/index.ts):**
```typescript
import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('dist'));

// AI Agent endpoint básico
app.post('/api/ai-agent/chat', (req, res) => {
  res.json({ message: 'AI Agent funcionando!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 TeleMed Clone rodando na porta ${PORT}`);
});
```

### 3. **Dashboard Aquarela Essencial:**
```typescript
// client/src/pages/Dashboard.tsx
import React from 'react';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          TeleMed Clone - Dashboard
        </h1>
        
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="font-semibold mb-2">🩺 Consultas</h3>
            <p className="text-gray-600">Sistema básico</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="font-semibold mb-2">🤖 AI Assistant</h3>
            <p className="text-gray-600">Chatbot médico</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="font-semibold mb-2">📊 Analytics</h3>
            <p className="text-gray-600">Métricas simples</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="font-semibold mb-2">⚙️ Configurações</h3>
            <p className="text-gray-600">Ajustes básicos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Passo 5: Variáveis de Ambiente

### Arquivo `.env`:
```
OPENAI_API_KEY=sua_chave_aqui
ALERT_WEBHOOK_URL=webhook_slack_opcional
NODE_ENV=development
```

## Passo 6: Scripts de Desenvolvimento

### Em `package.json`:
```json
{
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "vite build",
    "start": "node dist/server/index.js"
  }
}
```

## Vantagens do Clone Inteligente:

✅ **Rápido de configurar** (menos de 30 min)
✅ **Fácil de entender** (código simplificado)
✅ **Base sólida** (mantém arquitetura principal)
✅ **Flexível** (fácil de expandir)
✅ **Testável** (ambiente limpo para experimentos)

## Próximos Passos Após Configuração:

1. **Testar funcionalidade básica**
2. **Adicionar funcionalidades gradualmente**
3. **Experimentar mudanças de arquitetura**
4. **Validar performance**
5. **Comparar com sistema principal**

---

## Arquivos para Copiar do Projeto Atual:

### Prioritários:
- `tailwind.config.ts`
- `components.json`
- `client/src/components/ui/` (toda pasta)
- `server/utils/webhook.ts`
- Estilos CSS do dashboard aquarela

### Opcionais:
- `server/utils/aiUsage.ts`
- Configurações específicas do Replit
- Assets visuais importantes

---

Este guia permite criar uma versão simplificada mas funcional do sistema atual, ideal para testes e experimentos sem comprometer o projeto principal.