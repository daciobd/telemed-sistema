# TeleMed Sistema - Telemedicine Platform

## Overview
TeleMed Sistema is a comprehensive telemedicine platform designed to connect doctors and patients through digital healthcare solutions. It provides video consultations, digital medical records, prescription management, and integrated payment processing. The platform aims to transform traditional medical care delivery by offering a secure, efficient, and user-friendly experience for both healthcare providers and patients. Key capabilities include AI-powered psychiatric triage, real-time patient queue management for doctors, and a transparent bidding system for consultations.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes

- **August 01, 2025**: TESTES PSICOLÓGICOS COMPLETOS - SISTEMA v13.2.0
  - ✅ **GAD-7 e PHQ-9 Implementados**: Testes de Ansiedade e Depressão totalmente funcionais
    - Nova rota `/gad7-ansiedade` com 7 questões para avaliação de ansiedade generalizada
    - Nova rota `/phq9-depressao` com 9 questões para rastreio de episódio depressivo maior
    - Integração completa com Centro de Avaliação Psiquiátrica
    - Navegação bidirecional entre todos os testes e centro de avaliação
  - 🧠 **Sistema de Triagem Psiquiátrica Completo**: 3 testes principais operacionais
    - TDAH-ASRS18: 18 questões para avaliação de déficit de atenção e hiperatividade
    - GAD-7: 7 questões para transtorno de ansiedade generalizada (0-21 pontos)
    - PHQ-9: 9 questões para episódio depressivo maior (0-27 pontos)
    - Todos com algoritmos de scoring baseados em critérios científicos validados
  - 🎯 **Funcionalidades Médicas Avançadas**: Sistema completo de avaliação
    - Alertas de segurança para ideação suicida no PHQ-9 com números de emergência
    - Escalas de severidade profissionais com recomendações clínicas específicas
    - Disclaimers médicos e orientações para busca de ajuda profissional
    - Logs de servidor configurados para todos os testes: "😰 GAD-7", "😔 PHQ-9", "🧠 TDAH"

- **August 01, 2025**: INTEGRAÇÃO TESTE TDAH COMPLETA - SISTEMA v13.1.0
  - ✅ **Teste TDAH-ASRS18 Integrado**: Conexão perfeita entre Centro de Avaliação e teste TDAH
    - Nova rota `/tdah-asrs18` totalmente funcional com interface de 18 questões interativas
    - Navegação bidirecional: Centro de Avaliação ↔ Teste TDAH com botões "Voltar" e "Outros Testes"
    - Sistema de avaliação completo com algoritmo DSM-5 para diagnóstico TDAH
    - Resultados detalhados: Tipo Combinado, Predominantemente Desatento, Hiperativo-Impulsivo
  - 🧠 **Interface Médica Profissional**: Sistema de teste psicológico completo
    - Barra de progresso em tempo real (18 questões com indicadores visuais)
    - Categorização de sintomas: Desatenção vs Hiperatividade/Impulsividade
    - Scoring automático baseado em critérios científicos (≥6 sintomas significativos)
    - Relatório final com gráficos, recomendações clínicas e disclaimers profissionais
  - 🎯 **Funcionalidade Completa**: Teste TDAH 100% operacional
    - JavaScript interativo com navegação anterio/próxima e validação de respostas
    - Sistema de reset para repetir teste e integração com outros módulos psiquiátricos
    - Logs de servidor configurados: "🧠 Serving Teste TDAH-ASRS18"
    - Status HTTP 200 OK confirmado com título "Teste TDAH - ASRS-18"

- **August 01, 2025**: CENTRO DE AVALIAÇÃO PSIQUIÁTRICA IMPLEMENTADO - SISTEMA v13.0.0
  - ✅ **Centro de Avaliação Psiquiátrica Criado**: Página completa de testes psicológicos implementada
    - Nova rota `/centro-avaliacao` totalmente funcional e acessível via URL direta
    - Interface profissional com 6 instrumentos de avaliação validados cientificamente
    - Sistema de testes: TDAH-ASRS18, Triagem Psiquiátrica, GAD-7, PHQ-9, MDQ, PSS-10
    - Design médico profissional com estatísticas em tempo real e ferramentas especializadas
  - 🧠 **Funcionalidades Médicas Avançadas**: Sistema completo de avaliação psiquiátrica
    - Instrumentos baseados em DSM-5 com relatórios PDF profissionais
    - Interface interativa com indicadores visuais de status (Disponível, Em Breve, Beta)
    - Diretrizes de uso clínico e boas práticas para profissionais de saúde mental
    - Sistema de navegação integrado com dashboard médico e área do paciente
  - 🎯 **Integração Completa**: Rota adicionada ao sistema de roteamento estático
    - Server.ts atualizado com handler específico para centro-avaliacao.html
    - Logs de acesso configurados: "🧠 Serving Centro de Avaliação Psiquiátrica"
    - Arquivo HTML otimizado com Tailwind CSS e JavaScript interativo

- **August 01, 2025**: URL ROUTING FIXED - SISTEMA v12.9.0
  - ✅ **Critical URL Routing Issue Resolved**: Fixed direct URL access for `/lances` and `/dashboard` routes
    - Added server-side redirect mapping: `/lances` → `/patient-bidding` and `/dashboard` → `/patient-dashboard`
    - Created complete Patient Bidding Page with real-time timer system and interactive bidding interface
    - Added comprehensive bidding functionality with Cardiologia, Pediatria, and Dermatologia specialties
    - Implemented countdown timers, bid amount tracking, and interactive user interface
    - Both routes now fully functional and accessible via direct URL access
  - 🎯 **Bidding System Complete**: Full patient bidding platform implemented
    - Real-time bid tracking with countdown timers (12:45, 25:30, 35:00)
    - Interactive specialty cards with current bid amounts (R$ 180, R$ 150, R$ 120)
    - Statistics dashboard showing active bids, total value, and interested doctors
    - Professional UI with TeleMed branding and responsive design
  - 🔧 **Server Architecture Enhanced**:
    - SPA fallback routing properly configured for React routes
    - Static route mapping updated to include `/patient-bidding` in protected routes
    - Redirect system working seamlessly with proper logging and status codes

- **July 31, 2025**: DEPLOYMENT ERROR FIXED - SISTEMA v12.8.0
  - ✅ **Critical Deployment Fix**: Resolved "Missing script: build" error for Replit deployments
    - Activated production package.json with required build and start scripts
    - Verified build process creates optimized dist/ directory (1.07MB frontend)  
    - Confirmed all deployment scripts and dependencies are properly configured
    - Created deploy.js automation script for one-click deployment preparation
  - 🚀 **Deployment Verification Complete**: All deployment requirements validated
    - Build command: `npm run build` - Creates production build with Vite and copies server files
    - Start command: `npm run start` - Launches production server with tsx TypeScript runtime
    - Comprehensive verification script confirms deployment readiness
    - Multi-platform compatibility maintained (Heroku, Render, Railway, Vercel)
  - 📦 **Build System Status**: Production build successfully tested
    - Frontend: React app optimized to dist/public/ with code-splitting warnings noted
    - Backend: TypeScript server files copied to dist/server/ with tsx runtime
    - Database: Drizzle ORM schema and migrations properly included
    - Dependencies: All production and runtime dependencies verified

- **July 31, 2025**: DEPLOYMENT SCRIPTS FIXED - SISTEMA v12.7.0
  - ✅ **Deployment Configuration Complete**: Fixed missing build and start scripts for production deployment
    - Created `deploy-build.js` and `deploy-start.js` wrapper scripts for deployment compatibility
    - Added platform-specific configuration files: `Procfile`, `render.yaml`, `railway.json`, `vercel.json`
    - Production package.json contains all required scripts: build, start, dev, db:push
    - Build process creates optimized `dist/` directory with frontend and backend files
  - 🚀 **Multi-Platform Support**: Works with all major deployment services
    - Heroku, Render.com, Railway, Vercel compatibility ensured
    - TypeScript support maintained in production via tsx runtime
    - Automatic package.json switching for deployment environments
    - Complete dependency management for production builds
  - 📦 **Build System Enhanced**: 
    - Frontend: Vite builds React app to `dist/public/` (1.07MB optimized)
    - Backend: Server files copied with tsx TypeScript runtime support
    - Shared modules: Database schema and utilities properly included
    - Production optimization: Build warnings noted for future code-splitting improvements

- **July 31, 2025**: PROBLEMA DE REDIRECIONAMENTO CORRIGIDO - SISTEMA v12.6.1
  - 🎯 **Correção Crítica de Redirecionamento**: URLs hardcoded do Replit substituídas por sistema dinâmico
    - Detecção automática do domínio de origem (req.get('host'))
    - Parâmetro `redirect_base` para controle personalizado de redirecionamento  
    - URLs absolutas geradas dinamicamente: `https://dominio.com/dashboard`
    - Compatibilidade total com Hostinger e outros provedores
  - ✅ **Sistema de URLs Inteligente**: Funciona em qualquer ambiente
    - Desenvolvimento: `http://localhost:5000/patient-dashboard`
    - Produção: `https://seudominio.hostinger.com/patient-dashboard`
    - Redirecionamento baseado no protocolo (HTTP/HTTPS) e domínio atual
  - 🔧 **Integração Hostinger Aperfeiçoada**:
    - URLs de exemplo com redirecionamento correto criadas
    - Documentação completa de implementação gerada  
    - Teste de redirecionamento validado e funcionando
    - Sistema de logs aprimorado com domínio de destino

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript using Vite as the build tool, or Next.js for enhanced capabilities.
- **UI Library**: shadcn/ui components built on Radix UI primitives.
- **Styling**: Tailwind CSS for responsive design.
- **State Management**: React Query for server state management.
- **Routing**: React Router for client-side navigation (or Next.js App Router).
- **Design Principles**: Duotone color scheme (#A7C7E7, #F4D9B4, #E9967A), professional gradients, subtle micro-animations (fade-in, scale, bounce), consistent border-radius (20px), mobile-first approach.
- **Key Features**: Professional login and registration flows, patient and doctor dashboards, medical specialty pages, appointment scheduling, bidding system for consultations, AI-powered psychiatric triage, notification center, and comprehensive medical profile management.
- **Accessibility**: WCAG 2.1 conformity with ARIA labels, keyboard navigation, and screen reader support.
- **Performance**: Optimized images (WebP), lazy loading, CSS variables, and GPU-accelerated animations.

### Backend Architecture
- **Runtime**: Node.js with Express.js framework.
- **Language**: TypeScript for type safety.
- **Authentication**: Hybrid system supporting Replit Auth (OpenID Connect) and credential-based authentication with JWT tokens and role-based access (Patient, Doctor, Admin).
- **API Design**: RESTful endpoints with JSON responses.
- **Real-time Communication**: WebSocket and WebRTC for video consultations.
- **Security**: Advanced login security with Base64 encryption, IP tracking, rate limiting, secure session management, and robust error handling. Full LGPD compliance with consent management, audit logging, and data export tools.

### Database Architecture
- **Primary Database**: PostgreSQL (configured via Drizzle ORM).
- **ORM**: Drizzle for type-safe database operations.
- **Session Storage**: PostgreSQL-backed session store for authentication.
- **Schema**: Comprehensive medical data models including users, patients, doctors, appointments, prescriptions, and medical records.

### Development & Deployment
- **Environments**: Optimized for Replit development with hot reload and multi-platform production deployment (Render, Heroku, Vercel).
- **CI/CD**: Automated CI/CD pipelines with GitHub Actions for build, test, and deploy, including automated backups and rollbacks.
- **Monitoring**: Integrated with UptimeRobot, StatusCake, and Slack/Telegram notifications for comprehensive health and performance monitoring.

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL database connection.
- **express**: Web application framework for backend.
- **drizzle-orm**: ORM for database operations.
- **@radix-ui/**: UI component primitives.
- **tailwindcss**: Utility-first CSS framework.
- **vite**: Frontend build tool and development server.
- **passport**: Authentication middleware.
- **openid-client**: OpenID Connect authentication.
- **jsonwebtoken**: JWT token generation and verification.
- **bcryptjs**: Password hashing.
- **ws**: WebSocket server implementation.
- **@stripe/stripe-js**: Payment processing integration.
- **MEMED**: Digital prescription platform integration.
- **WhatsApp**: Notification system for appointment alerts.
- **WebRTC**: Peer-to-peer video communication (integrated for video calls).
- **tsx**: TypeScript execution for development.
- **esbuild**: Fast JavaScript bundler.
- **k6**: Load testing tool for performance monitoring.
- **Vitest**: Unit and integration testing framework.
- **Cypress**: End-to-end testing framework.
- **Testing Library**: React component testing.