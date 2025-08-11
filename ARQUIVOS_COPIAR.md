# Arquivos Específicos para Copiar

## Lista dos Arquivos Essenciais do Projeto Atual

### 1. Configuração (Copiar Exatamente)

**package.json** - Dependências essenciais:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.4.0",
    "express": "^4.18.0",
    "tsx": "^4.7.0",
    "axios": "^1.6.0",
    "openai": "^4.28.0",
    "@radix-ui/react-slot": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.300.0"
  }
}
```

**tsconfig.json** - Configuração TypeScript
**vite.config.ts** - Build configuration
**tailwind.config.ts** - Cores aquarela

### 2. Backend Essencial

**server/index.ts** - Versão simplificada:
```typescript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Agent endpoint
app.post('/api/ai-agent/chat', async (req, res) => {
  try {
    const { message } = req.body;
    res.json({ 
      response: `Echo: ${message}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro no AI Agent' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 TeleMed Clone rodando na porta ${PORT}`);
});
```

**server/utils/webhook.ts** - Copiar integralmente

### 3. Frontend Core

**client/src/App.tsx** - Aplicação principal simplificada
**client/src/index.css** - Estilos aquarela
**client/src/components/ui/** - Toda pasta (shadcn/ui)

### 4. Configuração Específica

**components.json** - Configuração shadcn/ui:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "client/src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "client/src/components",
    "utils": "client/src/lib/utils"
  }
}
```

## Scripts de Execução

### Workflow Replit (.replit):
```
run = "npm run dev"

[nix]
channel = "stable-23.05"

[deployment]
run = ["sh", "-c", "npm run build && npm run start"]
```

### Build script:
```json
{
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "vite build",
    "start": "node dist/server/index.js"
  }
}
```

## Cores Aquarela (index.css)

```css
:root {
  --aquarela-primary: #F5E8C7;
  --aquarela-secondary: #E0D7B9;
  --aquarela-accent: #B3D9E0;
  --aquarela-text: #4A5568;
}

.dashboard-aquarela {
  background: linear-gradient(135deg, var(--aquarela-primary) 0%, var(--aquarela-secondary) 100%);
}

.card-aquarela {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

## Variáveis de Ambiente (.env)

```
OPENAI_API_KEY=cole_sua_chave_aqui
ALERT_WEBHOOK_URL=webhook_slack_opcional
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

---

## Ordem de Implementação Recomendada:

1. **Configurar estrutura básica** (package.json, tsconfig.json)
2. **Implementar servidor simples** (server/index.ts)
3. **Criar dashboard aquarela** (frontend básico)
4. **Testar funcionalidade** (health check + dashboard)
5. **Adicionar AI Agent** (funcionalidade principal)
6. **Integrar alertas** (webhook.ts)

Cada passo pode ser testado independentemente, facilitando a identificação de problemas.