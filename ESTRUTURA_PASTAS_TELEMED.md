# Estrutura de Pastas - TeleMed Sistema

## 📁 Estrutura Principal

```
📦 TeleMed Sistema (Root)
├── 📁 api/                         # API Routes (unused - legacy)
├── 📁 app/                         # App components (unused - legacy)  
├── 📁 archive/                     # Archived components
├── 📁 attached_assets/             # Assets e arquivos anexados
│   ├── 📁 TeleMed/                 # Assets do TeleMed
│   ├── 📁 TeleMed_Final_Premium/   # Assets premium
│   ├── 📁 TeleMed_Visual/          # Assets visuais
│   ├── 📁 public/                  # Assets públicos
│   ├── 📁 server/                  # Assets do servidor
│   └── 🗂️ *.PNG, *.jpg, *.txt      # Imagens e textos colados
├── 📁 backups/                     # Sistema de backup automatizado
├── 📁 client/                      # 🎯 FRONTEND PRINCIPAL
│   ├── 📁 src/                     # Source do cliente
│   │   ├── 📁 components/          # Componentes React
│   │   │   ├── 📁 ui/              # shadcn/ui components
│   │   │   ├── Header.tsx          # Header principal
│   │   │   ├── Navigation.tsx      # Navegação
│   │   │   └── ...outros
│   │   ├── 📁 hooks/               # Custom hooks
│   │   ├── 📁 lib/                 # Utilidades do cliente
│   │   ├── 📁 pages/               # 🎯 PÁGINAS PRINCIPAIS
│   │   │   ├── enhanced-consultation.tsx  # Consulta melhorada (82% perf)
│   │   │   ├── video-consultation.tsx     # Consulta vídeo (85% perf)
│   │   │   ├── login.tsx           # Login seguro
│   │   │   ├── dashboard.tsx       # Dashboard principal
│   │   │   ├── agendamento.tsx     # Sistema de agendamentos
│   │   │   ├── especialidades.tsx  # Especialidades médicas
│   │   │   └── ...outras
│   │   ├── App.tsx                 # App principal
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Estilos globais
│   ├── index.html                  # Template HTML
│   └── vite.config.ts              # Config Vite
├── 📁 components/                  # Componentes compartilhados (legacy)
├── 📁 config/                      # Configurações
├── 📁 docs/                        # Documentação
├── 📁 hooks/                       # Hooks compartilhados (legacy)
├── 📁 lib/                         # Bibliotecas compartilhadas (legacy)
├── 📁 perf/                        # 🎯 SISTEMA DE PERFORMANCE
│   ├── budget.json                 # Budget de performance
│   ├── index.html                  # Dashboard consolidado
│   ├── video-baseline.html         # Relatório VideoConsultation
│   ├── video-baseline.json         # Métricas VideoConsultation
│   ├── enhanced-baseline.html      # Relatório EnhancedConsultation
│   ├── enhanced-baseline.json      # Métricas EnhancedConsultation
│   └── ...traces e logs
├── 📁 public/                      # Assets públicos
├── 📁 routes/                      # Rotas (legacy)
├── 📁 scripts/                     # 🎯 SCRIPTS DE PERFORMANCE
│   ├── perf-page.js                # Runner genérico Lighthouse
│   ├── verify-perf.js              # Validação de budget
│   └── perf-summary.js             # Geração de dashboard
├── 📁 server/                      # 🎯 BACKEND PRINCIPAL
│   ├── middleware/                 # Middlewares Express
│   ├── routes/                     # API Routes
│   ├── storage/                    # Sistema de armazenamento
│   ├── index.ts                    # 🎯 SERVIDOR PRINCIPAL
│   └── vite.ts                     # Integração Vite
├── 📁 shared/                      # 🎯 CÓDIGO COMPARTILHADO
│   ├── schema.ts                   # Schema Drizzle (Database)
│   └── types.ts                    # Tipos TypeScript
├── 📁 src/                         # Source adicional
├── 📁 storage/                     # Armazenamento local
├── 📁 telemed-clone/               # Clone de desenvolvimento
├── 📁 telemed-v2/                  # Versão 2 (backup)
├── 📁 telemed_clean/               # Versão limpa
├── 📁 telemed_premium/             # Versão premium
├── 📁 telemed_ultra/               # Versão ultra
├── 📁 tests/                       # Testes automatizados
├── 📁 types/                       # Definições de tipos
│
├── 📄 .env                         # Variáveis de ambiente
├── 📄 .env.example                 # Exemplo de variáveis
├── 📄 .gitignore                   # Git ignore
├── 📄 .replit                      # Config Replit
├── 📄 .vercelignore                # Vercel ignore
├── 📄 build.js                     # Script de build otimizado
├── 📄 start.js                     # Script de start produção
├── 📄 package.json                 # Dependências NPM
├── 📄 drizzle.config.ts            # Config Drizzle ORM
├── 📄 tailwind.config.js           # Config Tailwind CSS
├── 📄 tsconfig.json                # Config TypeScript
├── 📄 vite.config.ts               # Config Vite global
│
├── 📄 replit.md                    # 🎯 DOCUMENTAÇÃO PRINCIPAL
├── 📄 README.md                    # Readme do projeto
└── 📄 TRILHO_B_INFRASTRUCTURE_SUCCESS.md  # Status infraestrutura
```

## 🎯 Arquivos Críticos do Sistema

### Frontend (client/)
- **client/src/pages/video-consultation.tsx** - Consulta por vídeo (85% performance)
- **client/src/pages/enhanced-consultation.tsx** - Consulta melhorada (82% performance)
- **client/src/components/ui/** - Componentes shadcn/ui
- **client/index.html** - Template principal
- **client/vite.config.ts** - Configuração do build

### Backend (server/)
- **server/index.ts** - Servidor Express principal
- **server/routes/** - API endpoints
- **server/middleware/** - Middlewares de segurança

### Database (shared/)
- **shared/schema.ts** - Schema Drizzle ORM
- **shared/types.ts** - Tipos TypeScript

### Performance (scripts/ e perf/)
- **scripts/perf-page.js** - Runner Lighthouse genérico
- **scripts/verify-perf.js** - Validação de budget
- **scripts/perf-summary.js** - Dashboard HTML
- **perf/index.html** - Dashboard consolidado
- **perf/budget.json** - Targets de performance

### Configuração
- **package.json** - Dependências e scripts
- **build.js** - Build otimizado (145KB bundle)
- **start.js** - Start produção com segurança
- **drizzle.config.ts** - Config database
- **tailwind.config.js** - Config CSS

### Documentação
- **replit.md** - Documentação técnica principal
- **TRILHO_B_INFRASTRUCTURE_SUCCESS.md** - Status da infraestrutura
- **README.md** - Documentação do projeto

## 🔗 URLs Públicas do Sistema

### Dashboard Performance
```
https://84622708-9db0-420a-a1f1-6a7a55403590-00-2d2fgen7wjybm.picard.replit.dev/perf/index.html
```

### Páginas Demo
```
https://84622708-9db0-420a-a1f1-6a7a55403590-00-2d2fgen7wjybm.picard.replit.dev/video-consultation?consultationId=demo
https://84622708-9db0-420a-a1f1-6a7a55403590-00-2d2fgen7wjybm.picard.replit.dev/enhanced-consultation?consultationId=demo
```

### Relatórios Performance
```
https://84622708-9db0-420a-a1f1-6a7a55403590-00-2d2fgen7wjybm.picard.replit.dev/perf/video-baseline.html
https://84622708-9db0-420a-a1f1-6a7a55403590-00-2d2fgen7wjybm.picard.replit.dev/perf/enhanced-baseline.html
```

## 🚀 Comandos Principais

```bash
# Desenvolvimento
npm run dev

# Build otimizado
npm run build

# Performance testing
node scripts/perf-page.js --route=/qualquer-rota --name=nome-baseline
node scripts/verify-perf.js
node scripts/perf-summary.js

# Database
npm run db:push
npm run db:migrate

# Testes
npm run test
```

---
*Estrutura atualizada: 13 Agosto 2025*  
*TeleMed Sistema - Plataforma de Telemedicina Completa*