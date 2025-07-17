# TeleMed Sistema - Telemedicine Platform

## Overview

TeleMed Sistema is a comprehensive telemedicine platform designed to connect doctors and patients through digital healthcare solutions. The system provides video consultations, digital medical records, prescription management, and integrated payment processing to transform traditional medical care delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

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