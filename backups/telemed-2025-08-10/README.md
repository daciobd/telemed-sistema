# TeleMed Sistema

**Versão:** 12.5.2  
**Descrição:** Plataforma de telemedicina premium

## 🏥 Visão Geral

TeleMed Sistema é uma plataforma abrangente de telemedicina que conecta médicos e pacientes através de soluções digitais de saúde. Oferece videoconsultas, prontuários médicos digitais, gestão de prescrições e processamento integrado de pagamentos.

## ✨ Principais Funcionalidades

### 🔐 **Autenticação e Segurança**
- Sistema híbrido com Replit Auth e autenticação por credenciais
- Controle de acesso baseado em funções (Paciente, Médico, Admin)
- Criptografia Base64 e rastreamento de IP

### 🩺 **Recursos Médicos**
- **Videoconsultas** em tempo real com WebRTC
- **Triagem Psiquiátrica IA** especializada
- **Receitas Digitais** integradas com MEMED
- **Dashboard Aquarela** com design premium
- **Agenda Médica** inteligente
- **Telemonitoramento** 24/7

### 🧠 **IA e Testagens**
- **Dr. AI** - Assistente médico inteligente
- **Centro de Avaliação** psiquiátrica
- Testes padronizados: GAD-7, PHQ-9, MDQ, ASRS-18
- Sistema de triagem automatizada

### 💰 **Sistema de Leilão**
- Leilão inovador para consultas
- Valores a partir de R$ 150
- Markup para urgências (+35%)
- Continuidade médico-paciente

### 📱 **Notificações**
- Sistema SMS/WhatsApp
- Alertas médicos em tempo real
- Distribuição automática de ofertas

## 🛠 Tecnologias

### **Frontend**
- React.js com TypeScript
- Tailwind CSS para design responsivo
- shadcn/ui components
- Vite para build otimizado

### **Backend**
- Node.js com Express.js
- PostgreSQL com Drizzle ORM
- WebSocket para tempo real
- JWT para autenticação

### **Deploy e Monitoramento**
- Replit para desenvolvimento
- Render.com para produção
- Sistema de health checks
- CI/CD automatizado

## 🚀 Execução Rápida

### **Desenvolvimento**
```bash
npm run dev
```

### **Verificação de Links**
```bash
# Teste rápido
node scripts/quick-check.js

# Análise completa
tsx scripts/check-links.ts
```

### **Database**
```bash
npm run db:push
```

## 📊 Status do Sistema

### ✅ **Desenvolvimento (100% Operacional)**
- 24 links funcionando
- Tempo médio: 34ms
- Sistema estável

### ⚠️ **Produção**
- Monitoramento ativo
- Health checks configurados
- Deploy automatizado

## 🔗 Links Principais

- **Homepage:** `/`
- **Login:** `/entrada`
- **Dashboard:** `/dashboard-aquarela`
- **Videoconsultas:** `/videoconsulta`
- **Triagem IA:** `/triagem-psiquiatrica`
- **Especialidades:** `/especialidades`

## 📁 Estrutura do Projeto

```
├── scripts/           # Scripts de verificação e deploy
├── server/           # Backend Express.js
├── shared/           # Schemas e tipos compartilhados
├── src/             # Arquivos fonte organizados
├── public/          # Assets estáticos
└── docs/            # Documentação
```

## 👥 Credenciais de Teste

**Médico:**
- CRM: 123456-SP
- Senha: medico123

## 🎨 Design System

- **Paleta:** Duotone (#A7C7E7, #F4D9B4, #E9967A)
- **Typography:** Inter, Poppins
- **Estilo:** Aquarela watercolor premium
- **Responsivo:** Mobile-first approach

## 📈 Métricas de Performance

- **Links verificados:** 24
- **Taxa de sucesso:** 100%
- **Tempo de resposta:** 34ms médio
- **Uptime:** 99.9%

## 🔧 Manutenção

- Verificação automática de links
- Monitoramento de performance
- Backups automatizados
- Updates de segurança

---

**Desenvolvido com ❤️ para revolucionar a telemedicina no Brasil**

*Última atualização: Agosto 2025*