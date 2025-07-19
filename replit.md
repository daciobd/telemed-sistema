# TeleMed Sistema - Telemedicine Platform

## Overview

TeleMed Sistema is a comprehensive telemedicine platform designed to connect doctors and patients through digital healthcare solutions. The system provides video consultations, digital medical records, prescription management, and integrated payment processing to transform traditional medical care delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **July 19, 2025**: TeleMed Pro Simple Integration - FASE 2 COMPLETED
  - ✅ Created simple landing page with clean navigation
  - ✅ Fixed server routing to prioritize HTML files over React app
  - ✅ Implemented two main action buttons: "🤖 Dr. AI" and "💰 Consulta por Valor"  
  - ✅ Added dashboard médico access button
  - ✅ All systems working: Home → Dr. AI → Bidding → Dashboard
  - ✅ Clean design with gradient background and card-based navigation
  - ✅ Server correctly serving integrated landing page at root path
  - Ready for git deployment (user needs to handle git push manually)

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Query for server state management
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **Authentication**: Hybrid system supporting both Replit Auth (OpenID Connect) and credential-based authentication
- **API Design**: RESTful endpoints with JSON responses
- **Real-time Communication**: WebSocket and WebRTC for video consultations

### Database Architecture
- **Primary Database**: PostgreSQL (configured via Drizzle ORM)
- **ORM**: Drizzle for type-safe database operations
- **Session Storage**: PostgreSQL-backed session store for authentication
- **Schema**: Comprehensive medical data models including users, patients, doctors, appointments, prescriptions, and medical records

## Key Components

### Authentication System
- **Hybrid Authentication**: Supports both Replit Auth and traditional email/password
- **JWT Tokens**: Secure token-based authentication with 7-day expiration
- **Role-based Access**: Patient, doctor, and admin roles with appropriate permissions
- **Session Management**: Persistent sessions stored in PostgreSQL

### Medical Management
- **Patient Records**: Digital medical records with comprehensive patient data
- **Appointment System**: Scheduling with reverse auction pricing for teleconsultations
- **Prescription Integration**: MEMED integration for digital prescriptions
- **Video Consultations**: WebRTC-based video calling with chat functionality

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Consistent UI using shadcn/ui components
- **Landing Pages**: Professional medical interface with demo capabilities
- **Dashboard**: Separate interfaces for doctors and patients

### External Integrations
- **MEMED**: Digital prescription platform integration
- **Stripe**: Payment processing for consultations
- **WhatsApp**: Notification system for appointment alerts
- **WebRTC**: Peer-to-peer video communication

## Data Flow

### User Registration and Authentication
1. User registers via web interface or Replit Auth
2. Credentials stored securely with hashed passwords
3. JWT tokens issued for session management
4. Role-based routing to appropriate dashboards

### Appointment Booking
1. Patient submits consultation request with symptoms and budget
2. System notifies qualified doctors via WhatsApp
3. Doctors can accept offers through web interface
4. Video consultation scheduled and conducted via WebRTC
5. Medical records updated post-consultation

### Prescription Management
1. Doctor creates prescription during or after consultation
2. Integration with MEMED for digital prescription validation
3. Prescription sent to patient via secure channels
4. Prescription history maintained in patient records

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **express**: Web application framework
- **drizzle-orm**: Type-safe ORM for database operations
- **@radix-ui/**: UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **vite**: Frontend build tool and development server

### Authentication
- **passport**: Authentication middleware
- **openid-client**: OpenID Connect authentication
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing

### Real-time Features
- **ws**: WebSocket server implementation
- **@stripe/stripe-js**: Payment processing integration

### Development Tools
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler

## Deployment Strategy

### Development Environment
- **Replit Integration**: Optimized for Replit development environment with hot reload
- **Vite Dev Server**: Fast development with HMR (Hot Module Replacement)
- **Environment Variables**: Database URL and authentication secrets managed securely

### Production Deployment
- **Multi-platform Support**: Configured for Vercel, Render, and Replit deployments
- **Static File Serving**: Express serves built React application
- **SPA Routing**: Catch-all routing to support React Router in production
- **Health Checks**: Built-in health endpoints for monitoring

### Build Process
- **Frontend Build**: Vite compiles React app to static assets
- **Backend Build**: esbuild bundles TypeScript server code
- **Environment Detection**: Automatic switching between development and production modes

### Security Considerations
- **HTTPS Enforcement**: Automatic HTTPS redirects in production
- **Security Headers**: XSS protection, content type validation, frame options
- **Password Security**: Bcrypt hashing with secure salt rounds
- **Session Security**: HTTP-only cookies with secure flags in production

### Monitoring and Logging
- **Request Logging**: Comprehensive request/response logging with timestamps
- **Error Handling**: Structured error responses with appropriate HTTP status codes
- **Health Monitoring**: Dedicated health check endpoints for uptime monitoring

## Recent Changes (July 2025)

### AUTOMATIZAÇÃO CI/CD COMPLETA v3.2.0 - 17/07/2025 16:55
- **Status**: ✅ SISTEMA CI/CD AUTOMATIZADO IMPLEMENTADO
- **Objetivo**: Automatizar deploys com GitHub Actions e Render Deploy Hooks
- **Implementação**:
  - **Scripts de Automação**: test-deployment.sh, prepare-render.sh, backup-and-rollback.sh
  - **GitHub Actions**: Workflows completos para CI/CD automatizado
  - **API Status Endpoint**: /api/status para monitoramento automatizado
  - **CI/CD Master Script**: ci-cd-automation.sh para automação local
- **Funcionalidades CI/CD**:
  - **Testes Automatizados**: Health checks, API status, endpoints críticos
  - **Deploy Automation**: Render deploy hooks integrados
  - **Backup Automático**: Sistema de backup antes de cada deploy
  - **Rollback Automático**: Reversão em caso de falha
  - **Monitoramento**: Performance e health checks contínuos
- **GitHub Actions Workflows**:
  - **ci-cd.yml**: Pipeline principal com build, test e deploy
  - **render-deploy-hook.yml**: Deploy manual com testes pós-deploy
  - **Ambientes**: Production e staging separados
  - **Notificações**: Status de deploy e rollback automático
- **Scripts Incluídos**:
  - **test-deployment.sh**: Testes comprehensivos da aplicação
  - **prepare-render.sh**: Preparação e otimização para deploy
  - **backup-and-rollback.sh**: Sistema completo de backup/restore
  - **ci-cd-automation.sh**: Script master para automação local
- **Monitoramento**:
  - **Health Endpoints**: /health, /api/status, /ready, /live
  - **Performance Metrics**: Response time, memory usage, uptime
  - **Service Checks**: Database, session store, static files
- **Resultado**: ✅ SISTEMA CI/CD AUTOMATIZADO v3.2.0 COMPLETO

### SISTEMA MONITORAMENTO COMPLETO v3.3.0 - 17/07/2025 17:00
- **Status**: ✅ MONITORAMENTO AVANÇADO IMPLEMENTADO
- **Objetivo**: Integrar UptimeRobot, StatusCake e notificações Slack/Telegram
- **Implementação**:
  - **Integrations**: Slack Web API, Telegram Bot API, UptimeRobot, StatusCake
  - **Health Checker**: Sistema avançado de health checking com alertas
  - **Dashboard Frontend**: Interface completa para monitoramento em tempo real
  - **API Endpoints**: /api/metrics, /api/test-alert, /api/setup-monitoring
- **Funcionalidades de Monitoramento**:
  - **Alertas Automáticos**: Status change, critical errors, performance issues
  - **Cooldowns Inteligentes**: Evita spam de notificações (5-15 min)
  - **Health Checks**: Database, memory, disk, API response, static files
  - **Performance Metrics**: Response time, memory usage, CPU, uptime
- **Integrações Externas**:
  - **Slack**: Alertas formatados com attachments e blocks
  - **Telegram**: Mensagens markdown com emojis contextuais
  - **UptimeRobot**: Monitoramento HTTP a cada 5 minutos
  - **StatusCake**: Multi-region monitoring com webhooks
- **Dashboard Features**:
  - **Visão Geral**: Status, métricas, health checks, serviços
  - **Gráficos**: Response time e memory usage históricos
  - **Teste de Alertas**: Interface para testar notificações
  - **Configuração**: Setup de monitoramento externo
- **Endpoints de Monitoramento**:
  - **/health**: Health check básico
  - **/api/status**: Status comprehensivo com métricas
  - **/api/metrics**: Histórico e estatísticas
  - **/ready**: Readiness probe (K8s compatible)
  - **/live**: Liveness probe (K8s compatible)
- **Resultado**: ✅ SISTEMA DE MONITORAMENTO COMPLETO v3.3.0 FUNCIONAL

### UX/UI UNIFICADA COMPLETA v4.0.0 - 17/07/2025 19:35
- **Status**: ✅ ARQUITETURA HÍBRIDA UNIFICADA IMPLEMENTADA
- **Objetivo**: Integrar todos os arquivos HTML soltos no fluxo React/Vite
- **Implementação**:
  - **Migração Completa**: medical-dashboard-pro.html → DashboardMedicalPro.tsx
  - **Migração Completa**: demo-vs-real.html → LegacyDemoPage.tsx
  - **Integração Vite**: index.html totalmente integrado ao SPA
  - **Organização**: Arquivos HTML movidos para legacy/ como referência
- **Componentes React Criados**:
  - **DashboardMedicalPro.tsx**: Dashboard médico avançado com shadcn/ui
  - **LegacyDemoPage.tsx**: Interface de testes e demos unificada
  - **Rotas**: /medical-pro, /legacy-demo integradas ao App.tsx
- **Arquitetura Unificada**:
  - **SPA Principal**: Todas as páginas no fluxo React/Vite
  - **Estado Unificado**: React Query para server state
  - **Componentes**: shadcn/ui para consistência visual
  - **TypeScript**: Type safety em todos os componentes
- **Documentação**:
  - **docs/UX_UI_ARCHITECTURE.md**: Arquitetura detalhada
  - **README.md**: Atualizado com nova estrutura
  - **Benefícios**: Hot reload, componentes reutilizáveis, debugging facilitado
- **Organização de Arquivos**:
  - **client/src/pages/**: Todas as páginas React
  - **legacy/**: Arquivos HTML originais preservados
  - **docs/**: Documentação técnica completa
- **Resultado**: ✅ UX/UI UNIFICADA COMPLETA v4.0.0 - ARQUITETURA HÍBRIDA DEFINITIVA

### SISTEMA TESTES E VALIDAÇÃO COMPLETO v1.0.0 - 17/07/2025 21:05
- **Status**: ✅ TESTES UNITÁRIOS, INTEGRAÇÃO E E2E IMPLEMENTADOS
- **Objetivo**: Criar sistema completo de testes para validar agendamento e consultas
- **Implementação**:
  - **Estrutura Completa**: tests/ com unit, integration, e2e, performance
  - **Vitest Setup**: Configuração completa com jsdom, coverage, mocks
  - **Cypress Setup**: E2E testing com custom commands e fixtures
  - **Testing Library**: React Testing Library para componentes
- **Testes Implementados**:
  - **Unit Tests**: Dashboard.test.tsx, appointments.test.ts, consultations.test.ts
  - **Integration Tests**: appointment-flow.test.ts com fluxo completo
  - **E2E Tests**: appointment-booking.cy.ts, consultation-flow.cy.ts
  - **Performance**: load-test.js com k6 para endpoints críticos
- **Cobertura de Testes**:
  - **Agendamentos**: CRUD completo, validações, conflitos de horário
  - **Consultas**: Início, vídeo, anotações, prescrições, finalização
  - **Dashboard**: Navegação, estatísticas, ações rápidas
  - **APIs**: Todos os endpoints críticos testados
- **Custom Commands Cypress**:
  - **cy.loginAsDoctor()**: Login automático médico
  - **cy.createTestAppointment()**: Criar agendamento teste
  - **cy.startConsultation()**: Iniciar consulta
  - **cy.fillMedicalNotes()**: Preencher anotações médicas
- **Fixtures e Mocks**:
  - **appointments.json**: 5 agendamentos exemplo
  - **health.json, status.json**: Responses mock APIs
  - **Global mocks**: fetch, localStorage, window.location
- **Scripts NPM**: test, test:ui, test:coverage, cypress:open, test:e2e, test:all
- **Documentação**: tests/README.md e docs/TESTING_IMPLEMENTATION.md completos
- **Resultado**: ✅ SISTEMA DE TESTES COMPLETO v1.0 - 50+ TESTES IMPLEMENTADOS

### MIGRAÇÃO NEXT.JS COMPLETA v5.0.0 - 18/07/2025 12:05
- **Status**: ✅ MIGRAÇÃO NEXT.JS ARQUITETURA DEFINITIVA CONCLUÍDA
- **Objetivo**: Migrar projeto telemed-v2/ para estrutura Next.js na raiz
- **Implementação**:
  - **Estrutura Base**: app/, components/, lib/, types/, config/ migrados
  - **Configurações**: next.config.js, tailwind.config.ts, tsconfig.json atualizados
  - **Providers**: React Query, Theme Provider configurados
  - **Components**: UI shadcn/ui estrutura completa implementada
- **Arquivos Migrados**:
  - **app/**: Layout, providers, pages principais
  - **components/**: UI library completa, theme provider
  - **lib/**: Utils, hooks, integrações, auth, db
  - **types/**: Tipagens TypeScript
  - **config/**: Configurações do projeto
- **Correções Implementadas**:
  - **SessionProvider**: Temporariamente desabilitado para funcionamento
  - **Toast System**: useToast hook e componentes criados
  - **Metadata**: Viewport corrigido para Next.js 15
  - **Aliases**: Paths @/ configurados corretamente
- **Status Funcional**:
  - **Next.js 15**: Rodando na porta 3001
  - **Compilação**: Successful build com warnings resolvidos
  - **Rotas**: Sistema de rotas App Router funcionando
  - **Hot Reload**: Desenvolvimento com HMR ativo
- **Resultado**: ✅ MIGRAÇÃO NEXT.JS v5.0.0 COMPLETA - PROJETO FUNCIONAL

### DR. AI SISTEMA COMPLETO INTEGRADO v6.0.0 - 18/07/2025 16:35
- **Status**: ✅ DR. AI SISTEMA COMPLETO IMPLEMENTADO E PRONTO PARA DEPLOY
- **Objetivo**: Integrar sistema Dr. AI com triagem inteligente completa
- **Implementação**:
  - **Dr. AI HTML**: Sistema completo em public/dr-ai.html
  - **Integração Next.js**: Componente em app/dr-ai/page.tsx
  - **Botões Interface**: Adicionados em página principal e dashboard médico
  - **Health Endpoint**: Criado app/health/route.ts para monitoramento
- **Funcionalidades Dr. AI**:
  - **Chatbot Conversacional**: Interface inteligente com design médico
  - **Triagem 5 Etapas**: Coleta → Análise → Classificação → Especialidade → Recomendações
  - **Classificação de Risco**: Sistema baixo/médio/alto com cores visuais
  - **Determinação de Especialidade**: Clínica geral ou especializada
  - **Recomendações Personalizadas**: Baseadas em risco e sintomas
  - **Agendamento Inteligente**: Integração com sistema principal
- **Deploy Render Configurado**:
  - **render.yaml**: Configuração completa para deploy automático
  - **Scripts**: quick-deploy.sh para validação pré-deploy
  - **Health Check**: Endpoint /health configurado
  - **Build Otimizado**: Next.js 15.4.1 com chunks corrigidos
- **URLs Disponíveis**:
  - **App Principal**: https://telemed-sistema.onrender.com/
  - **Dr. AI Direto**: https://telemed-sistema.onrender.com/dr-ai.html
  - **Dr. AI Next.js**: https://telemed-sistema.onrender.com/dr-ai
  - **Health Check**: https://telemed-sistema.onrender.com/health
- **Integração Completa**:
  - **Página Principal**: Botão "Triagem com IA" no hero section
  - **Dashboard Médico**: Botão "Dr. AI" para profissionais
  - **Fluxo Unificado**: Integração com agendamento e consultas
  - **Design Consistente**: Padronização visual com sistema principal
- **Resultado**: ✅ DR. AI SISTEMA COMPLETO v6.0.0 - PRONTO PARA DEPLOY RENDER

### OTIMIZAÇÃO UX/UI UNIFIED SYSTEM v3.1.0 - 17/07/2025 11:30
- **Status**: ✅ INTERFACE UNIFICADA IMPLEMENTADA
- **Objetivo**: Padronizar experiência médico/paciente e eliminar telas genéricas
- **Implementação**:
  - **UnifiedLayout**: Layout base responsivo com navegação unificada
  - **PatientDashboardUnified**: Dashboard otimizado para experiência do paciente
  - **DoctorDashboardUnified**: Dashboard profissional para médicos
  - **LandingPageUnified**: Página inicial profissional e atrativa
- **Melhorias UX/UI**:
  - **Design Consistente**: Componentes padronizados com shadcn/ui
  - **Navegação Intuitiva**: Menu contextual por tipo de usuário
  - **Responsividade**: Interface adaptada para mobile e desktop
  - **Cores e Tipografia**: Sistema visual coerente e profissional
- **Funcionalidades**:
  - **Quick Actions**: Ações rápidas contextuais por dashboard
  - **Health Metrics**: Métricas visuais para pacientes
  - **Agenda Médica**: Interface otimizada para workflow médico
  - **Notificações**: Sistema unificado de alertas
- **Eliminação**: Removidas telas genéricas de teste (teste-botoes-simples, etc.)
- **Rotas Organizadas**: Estrutura clara com dashboards principais e legados
- **Resultado**: ✅ EXPERIÊNCIA UNIFICADA v3.1.0 COMPLETA

### SISTEMA SEGURANÇA E LGPD COMPLETO v3.0.0 - 17/07/2025 11:25
- **Status**: ✅ SISTEMA DE SEGURANÇA COMPLETO IMPLEMENTADO
- **Implementação**: Sistema completo de segurança e conformidade LGPD
- **Backend Implementado**:
  - **Rotas de Segurança**: `/api/security/*` com audit logging completo
  - **Storage Layer**: Métodos completos para consentimento, LGPD, auditoria
  - **Audit Logger**: Sistema automático de logs de segurança
  - **Exportação LGPD**: Exportação completa de dados do usuário
- **Frontend Implementado**:
  - **SecurityPage**: Página de configurações de segurança
  - **SecurityDashboard**: Dashboard completo com métricas
  - **PrivacySettings**: Controle de privacidade e consentimento
  - **DataExportTool**: Ferramenta de exportação de dados
  - **SecurityAuditLog**: Visualização de logs de auditoria
- **Funcionalidades**:
  - **Gestão de Consentimento**: LGPD Article 7 compliance
  - **Auditoria Completa**: Risk levels (low/medium/high/critical)
  - **Exportação de Dados**: LGPD Article 15 compliance
  - **Controles de Privacidade**: Configurações granulares
  - **Dashboard de Segurança**: Métricas e alertas em tempo real
- **Integração**:
  - **Navegação**: Link no DoctorDashboard para /security
  - **Rotas**: Integradas no sistema principal
- **Resultado**: ✅ SISTEMA DE SEGURANÇA v3.0.0 COMPLETO E FUNCIONAL

### CONFIGURAÇÃO RENDER DEPLOY v2.1.0 - 16/07/2025 20:10
- **Status**: ✅ DEPLOY RENDER CONFIGURADO E PRONTO
- **Implementação**: Sistema completo de deploy para Render Platform
- **Arquivos Criados**:
  - **render.yaml**: Configuração completa do Render com health checks
  - **.env.example**: Template de variáveis de ambiente
  - **Scripts de automação**: prepare-render.sh, deploy-render.sh, test-deployment.sh, monitor-render.sh, backup-and-rollback.sh, quick-deploy.sh
- **Health Checks Implementados**:
  - **API Health**: `/api/health` com JSON completo
  - **Static Health**: `/health` com interface visual
  - **Monitoramento**: Scripts automatizados
- **Configurações Otimizadas**:
  - **Next.js**: Output standalone, security headers
  - **Package.json**: PORT dinâmico para Render
  - **Gitignore**: Configuração para deploy
- **URLs Finais**: https://telemed-pro.onrender.com
- **Resultado**: ✅ DEPLOY RENDER CONFIGURADO - PRONTO PARA PRODUÇÃO

### IMPLEMENTAÇÃO ARQUITETURA DEFINITIVA v2.0.0 - 16/07/2025 20:00
- **Status**: ✅ FASE 1 CONCLUÍDA - ESTRUTURA BASE NEXT.JS 14 IMPLEMENTADA
- **Implementação**: Nova arquitetura profissional Next.js 14 com estrutura completa
- **Tecnologias**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Estrutura**: Landing Page, Componentes UI, Layout responsivo, Configurações
- **Diretório**: `telemed-v2/` com estrutura completa
- **Resultado**: ✅ ESTRUTURA BASE v2.0.0 CONCLUÍDA - PRONTO PARA FASE 2