# 🩺 TeleMed Sistema

Uma plataforma completa de telemedicina que conecta médicos e pacientes através de soluções digitais inovadoras.

## 🚀 Funcionalidades Principais

- **🤖 Dr. AI**: Triagem inteligente com assistente médico virtual
- **💰 Sistema de Lances**: Consultas médicas por valor personalizado  
- **📊 Dashboard Médico**: Interface profissional para médicos
- **🔒 Sistema de Segurança**: Conformidade LGPD e auditoria completa
- **📱 Integração WhatsApp**: Notificações automáticas
- **💳 Pagamentos Stripe**: Processamento seguro de pagamentos

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      TeleMed Sistema                             │
├─────────────────────────────────────────────────────────────────┤
│                    Frontend (React + Vite)                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────────┐ │
│  │ Landing     │ │ Dr. AI      │ │ Dashboard Médico            │ │
│  │ Page        │ │ Chat        │ │ - Consultas                 │ │
│  └─────────────┘ └─────────────┘ │ - Agendamentos              │ │
│  ┌─────────────┐ ┌─────────────┐ │ - Prescrições              │ │
│  │ Sistema de  │ │ Pagamentos  │ │ - Métricas                 │ │
│  │ Lances      │ │ Stripe      │ └─────────────────────────────┘ │
│  └─────────────┘ └─────────────┘                                 │
├─────────────────────────────────────────────────────────────────┤
│                    Backend (Node.js + Express)                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────────┐ │
│  │ API Routes  │ │ Auth System │ │ Real-time Communication     │ │
│  │ - /api/*    │ │ - JWT       │ │ - WebSocket                 │ │
│  │ - Health    │ │ - Sessions  │ │ - WebRTC                    │ │
│  │ - Security  │ │ - RBAC      │ └─────────────────────────────┘ │
│  └─────────────┘ └─────────────┘                                 │
├─────────────────────────────────────────────────────────────────┤
│                    Database (PostgreSQL)                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────────┐ │
│  │ Users       │ │ Appointments│ │ Medical Records             │ │
│  │ - Patients  │ │ - Scheduling│ │ - Prescriptions             │ │
│  │ - Doctors   │ │ - Bidding   │ │ - Consultations             │ │
│  │ - Roles     │ │ - Status    │ │ - History                   │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    External Integrations                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────────┐ │
│  │ WhatsApp    │ │ Stripe      │ │ Monitoring                  │ │
│  │ Business    │ │ Payments    │ │ - UptimeRobot               │ │
│  │ API         │ │ Processing  │ │ - StatusCake                │ │
│  └─────────────┘ └─────────────┘ │ - Slack/Telegram            │ │
│                                   └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Tecnologias

### Frontend
- **React 18** - Interface de usuário moderna
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápida
- **Tailwind CSS** - Estilização responsiva
- **shadcn/ui** - Componentes UI consistentes
- **Radix UI** - Primitivos acessíveis

### Backend  
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Desenvolvimento tipado
- **Drizzle ORM** - Mapeamento objeto-relacional
- **WebSocket/WebRTC** - Comunicação em tempo real

### Database
- **PostgreSQL** - Banco de dados principal
- **Neon Database** - PostgreSQL gerenciado

## 🚀 Início Rápido

### 1. Pré-requisitos
```bash
Node.js 18+
PostgreSQL (ou Neon Database)
```

### 2. Instalação
```bash
# Clone o repositório
git clone https://github.com/daciobd/telemed-sistema.git

# Entre no diretório  
cd telemed-sistema

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### 3. Configuração do Banco
```bash
# Execute as migrações
npm run db:push

# (Opcional) Visualize o banco
npm run db:studio
```

### 4. Execução
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

O sistema estará disponível em `http://localhost:5000`

## 📱 Navegação do Sistema

### Fluxo Principal
1. **Landing Page** (`/`) - Página inicial com navegação
2. **Dr. AI** (`/dr-ai.html`) - Triagem inteligente
3. **Sistema de Lances** (`/consulta-por-valor.html`) - Proposta de valores
4. **Dashboard Médico** (`/medical-dashboard-pro.html`) - Interface profissional

### URLs da API
- `/health` - Health check do sistema
- `/api/status` - Status completo com métricas
- `/api/appointments/*` - Gerenciamento de consultas
- `/api/security/*` - Configurações de segurança

## 🔧 Configuração

### Variáveis de Ambiente Essenciais
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
SESSION_SECRET="your-secret-key"
PORT=5000
NODE_ENV=development
```

### Integrações Opcionais
```env
# Pagamentos
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Notificações
WHATSAPP_ACCESS_TOKEN="..."
SLACK_BOT_TOKEN="xoxb-..."
TELEGRAM_BOT_TOKEN="..."

# Monitoramento
UPTIMEROBOT_API_KEY="..."
STATUSCAKE_API_KEY="..."
```

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes de integração  
npm run test:integration

# Testes end-to-end
npm run test:e2e

# Cobertura de código
npm run test:coverage
```

## 📦 Deploy

### Render (Recomendado)
```bash
# Configuração automática via render.yaml
git push origin main
# Deploy automático configurado
```

### Vercel
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t telemed-sistema .
docker run -p 5000:5000 telemed-sistema
```

## 🔐 Segurança e Conformidade

- **LGPD Compliant** - Gestão completa de consentimento
- **Auditoria Automática** - Logs de segurança detalhados  
- **Exportação de Dados** - Conformidade com direitos do usuário
- **Criptografia** - Dados sensíveis protegidos
- **Rate Limiting** - Proteção contra abuso

## 📊 Monitoramento

### Health Checks
- `/health` - Status básico do sistema
- `/api/status` - Métricas detalhadas
- `/ready` - Kubernetes readiness probe
- `/live` - Kubernetes liveness probe

### Métricas Disponíveis
- Response time
- Memory usage  
- Database connectivity
- External services status
- User activity analytics

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Documentação**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/daciobd/telemed-sistema/issues)
- **Email**: suporte@telemed.pro

## 📈 Roadmap

### v3.0 (Q2 2025)
- [ ] Mobile app (React Native)
- [ ] IA de diagnóstico avançada
- [ ] Integração com laboratórios
- [ ] Telemedicina veterinária

### v2.5 (Q1 2025)  
- [x] Sistema de monitoramento avançado
- [x] CI/CD automatizado
- [x] Conformidade LGPD completa
- [ ] Multi-idioma (EN, ES)

---

⭐ **TeleMed Sistema** - Transformando o cuidado médico através da tecnologia

Desenvolvido com ❤️ para melhorar a saúde e bem-estar