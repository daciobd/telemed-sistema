# TeleMed Sistema - Telemedicine Platform

## Overview
TeleMed Sistema is a comprehensive telemedicine platform connecting doctors and patients through digital healthcare solutions. It offers video consultations, digital medical records, prescription management, and integrated payment processing. The platform aims to transform traditional medical care delivery by providing a secure, efficient, and user-friendly experience, with key capabilities including AI-powered psychiatric triage, real-time patient queue management, and a transparent bidding system for consultations.

**Recent Update (Aug 2025):** Successfully implemented premium design matching user-provided mockup with sophisticated UI/UX including gradient backgrounds, translucent headers, emerald color scheme, and professional medical aesthetics. Optimized build system achieving 145KB JavaScript bundle (down from 1.079MB) and 3.56s build time with comprehensive download system for project distribution. Enhanced security with Helmet.js, CORS, compression middleware, intelligent caching, health monitoring, and production-ready start.js with enterprise-grade security headers. Implemented automated backup system protecting 22 critical files with tar.gz compression and detailed reporting for disaster recovery compliance. **Project 1 Stabilization Complete (Aug 12, 2025):** Implemented dual-layer AI kill-switch system with global middleware and router-level guards, ensuring 100% AI feature control via AI_ENABLED flag with proper 403 responses when disabled. **Performance Optimization Complete (Aug 13, 2025):** Completed VideoConsultation pilot (85% performance score, all metrics within budget) and successfully replicated pattern in EnhancedConsultation (82% score). Established replicable optimization framework with memo/useCallback/useMemo, React.lazy+Suspense, Query optimization (staleTime 60s, payload reduction), sticky headers, and comprehensive instrumentation (useRenders, usePerfMarks, Server-Timing). **Trilho B Infrastructure (Aug 13, 2025):** Implemented scalable performance testing infrastructure with parametrizable scripts (perf-page.js, verify-perf.js, perf-summary.js), consolidated dashboard at /perf/index.html, and automated budget validation. All components serving performance reports with professional visual dashboard and public Replit URLs. System ready for scaling to additional components. **Development Environment Fixed (Aug 16, 2025):** Resolved workflow failure by implementing unified development environment with complete dependency installation (Vite, TypeScript, React ecosystem), created start-dev.js providing npm run dev functionality, fixed module resolution issues in tsconfig.json, and established working full-stack development server on ports 5000 (backend) and 5173 (frontend). All LSP diagnostics resolved and application running successfully. **OpenAI Integration Restored (Aug 16, 2025):** Successfully resolved OpenAI dependency conflicts by implementing custom SimpleOpenAIClient that bypasses zod version conflicts, enabling full AI functionality including ChatGPT Agent initialization, psychiatric triage features, and AI-powered medical insights without requiring external package dependencies. **TeleMed + Health Connect Merge Complete (Aug 17, 2025):** Successfully merged two telemedicine platforms into unified system with 66+ Health Connect UI components integrated into TeleMed architecture. Preserved all TeleMed AI features while adding advanced patient management, specialized consultations, and exam request system. Created unified navigation, integrated database schemas, and modular routing system. Resolved 28 dependency conflicts while maintaining system stability and performance optimization achievements. **Fusion Checklist Implementation (Aug 17, 2025):** Completed technical support checklist with unified schemas (Consultation, ExamOrder, Payment entities normalized), consolidated JWT/OAuth authentication strategy, WCAG 2.1 AA accessibility compliance, performance budget enforcement (Lighthouse ≥80, TBT ≤300ms, Transfer ≤1.5MB), and streamlined CI pipeline (build + lint + verify:perf). TeleMed established as single source of truth for all data models and authentication flows. **Dynamic Port Configuration (Aug 17, 2025):** Implemented environment-aware port configuration supporting Replit, Render, Heroku and other cloud platforms. Updated start-dev.js, server/config/env.ts, and server/index.ts to prioritize process.env.PORT over hardcoded values, enabling seamless deployment across different hosting environments with proper fallback to port 5000 for local development. **Dashboard Migration System (Aug 18, 2025):** Implemented comprehensive dashboard migration following enterprise best practices with automated backup system, rollback capabilities, feature flag routing, and professional migration scripts. New dashboard successfully deployed with modern TailwindCSS design, responsive layout, preserved navigation links, and integrated Dr. AI functionality. Migration system supports both automatic and manual activation with complete fallback protection. **Enhanced Consultation Clone Complete (Aug 18, 2025):** Successfully transformed enhanced-consultation.html into functional telemedicine consultation interface with patient data headers, invitation system, full consultation workflow (Chat | Atendimento | Exames | Receitas), CID-10 autosuggestion, Memed integration opening in new tab with demo data, Dr. AI panel with clinical decision support, video toolbar with all requested controls (attach, screenshot, chat, notifications, mic, video, hold, end), and complete form system with complexity switches, alert flags, and save/finalize functionality. Implemented corresponding API endpoints for consultation management, CID-10 search, and Dr. AI responses with OpenAI integration plus fallback support. **Canonical Routes Officialized (Aug 19, 2025):** Implemented official route structure with `/agenda` (Agenda Médica), `/consulta` (Enhanced Teste v2.2), `/dashboard` (Dashboard Teste Definitivo) as canonical routes. Root `/` redirects to `/agenda`. All legacy aliases (`/enhanced`, `/enhanced-consultation`, `/dashboard-teste`, `/doctor-dashboard`) redirect to new canonical routes with 301 status. Updated both Express server routes and React wouter routing configuration with proper fallback handling and parameter preservation. Dashboard-teste confirmed as the definitive canonical dashboard implementation. **Dual-Layer Redirect System Complete (Aug 19, 2025):** Implemented comprehensive redirect system with both server-side 301 redirects (Express) and client-side redirects (React wouter) for maximum compatibility. Query string preservation verified across all redirect paths. Created verification scripts package including route testing, accessibility checks, performance monitoring, and hygiene system. Router implementation includes fallback strategy ensuring redirects work even if JavaScript fails to load. **TeleMed Pro Theme System (Aug 20, 2025):** Implemented comprehensive theme system with automatic injection for all `/preview` pages. Created escopado CSS theme (`_theme-telemed-pro.css`) with dark premium medical aesthetics, server-side automatic injection system with `PREVIEW_THEME=telemed-pro` environment variable, toggle controls (`?theme=off`), and floating UI switcher. System includes navigation analysis of 420 HTML files and 1,666 links, identifying 6 canonical routes and optimal user flow patterns. **Links Optimization Complete (Aug 20, 2025):** Successfully corrected 11 critical broken links in canonical pages, connected 20 orphaned pages (100% of identified orphans) to navigation system with categorized menus distributed across 9 hubs, and optimized 7 major hubs by reorganizing links into structured submenus. Expanded system from 412 to 432 pages (+4.9%) and 1,630 to 1,939 links (+19.0%) with 132 additional valid links (+15.2%). Implemented comprehensive 3-layer backup system and automated validation scripts. Final navigation success rate: 51.7% with robust infrastructure for continued optimization. Theme automatically transforms any HTML page with professional medical dark mode including gradients (azul-verde), cards, buttons, and typography without requiring individual file modifications.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript (Vite) or Next.js.
- **UI Library**: shadcn/ui components built on Radix UI primitives.
- **Styling**: Tailwind CSS for responsive design.
- **State Management**: React Query for server state management.
- **Routing**: React Router or Next.js App Router for client-side navigation.
- **Design Principles**: Premium emerald-blue color scheme with sophisticated gradients, translucent sticky header with backdrop-blur, professional medical aesthetics matching user-provided mockup. Features include glass morphism effects, gradient card backgrounds (indigo-purple-pink), emerald accent colors for "Inteligência Artificial" text, and refined spacing with enhanced shadows and animations.
- **Key Features**: Professional login/registration, patient/doctor dashboards, medical specialty pages, appointment scheduling, bidding system, AI-powered psychiatric triage (TDAH-ASRS18, GAD-7, PHQ-9, MDQ, PSS-10), notification center, medical profile management, and SMS/WhatsApp medical notifications system.
- **Accessibility**: WCAG 2.1 conformity with ARIA labels, keyboard navigation, and screen reader support.
- **Performance**: Optimized images (WebP), lazy loading, CSS variables, and GPU-accelerated animations.

### Backend Architecture
- **Runtime**: Node.js with Express.js framework.
- **Language**: TypeScript.
- **Authentication**: Hybrid system supporting Replit Auth (OpenID Connect) and credential-based authentication with JWT tokens and role-based access (Patient, Doctor, Admin). Advanced login security includes Base64 encryption, IP tracking, rate limiting, and secure session management.
- **API Design**: RESTful endpoints with JSON responses.
- **Real-time Communication**: WebSocket and WebRTC for video consultations.
- **Security**: LGPD compliance with consent management, audit logging, and data export tools.

### Database Architecture
- **Primary Database**: PostgreSQL (configured via Drizzle ORM).
- **ORM**: Drizzle for type-safe database operations.
- **Session Storage**: PostgreSQL-backed session store for authentication.
- **Schema**: Comprehensive medical data models for users, patients, doctors, appointments, prescriptions, medical records, and medical notifications (medicos_cadastrados, ofertas_medicas, respostas_ofertas).

### Development & Deployment
- **Environments**: Optimized for Replit development and multi-platform production deployment (Render, Heroku, Vercel).
- **CI/CD**: Automated CI/CD pipelines with GitHub Actions.
- **Monitoring**: Integrated with UptimeRobot, StatusCake, and Slack/Telegram notifications.

## Navigation Analysis & Theme System

### Navigation Analysis Tools
- **Script Principal**: `mapa_navegacao_otimizado.py` analisa 412 páginas HTML e 1,630 links com validação completa
- **Analytics Avançado**: `analytics_navegacao.py` gera relatório HTML interativo com estatísticas detalhadas
- **Saída Estruturada**: `mapa_navegacao_completo.json` (dados completos), `relatorio_navegacao.html` (relatório visual)
- **Dependências**: `beautifulsoup4` (instalado via packager tool)
- **Resultados**: 51.7% links válidos finais (432 páginas, 1,939 links), 11 links críticos corrigidos, 20 páginas órfãs conectadas (100%), 7 hubs otimizados, +132 links válidos

### Theme System Implementation
- **CSS Escopado**: `public/preview/_theme-telemed-pro.css` com seletor `body[data-theme="telemed-pro"]`
- **Injeção Automática**: Servidor aplica tema a todas as páginas `/preview/*` via middleware
- **Variável de Ambiente**: `PREVIEW_THEME=telemed-pro` controla ativação global
- **Toggle UI**: Botão flutuante JavaScript em cada página para alternar `?theme=off`
- **Breadcrumbs Universal**: `breadcrumbs_universal.html` com detecção automática de rota

### System Architecture Enhancements
- **Preview System**: `/preview/index.html` como portal central para demonstrações tematizadas
- **Fluxo Recomendado**: `Landing (/lp) → Preview (/preview) → Agenda (/agenda) → Consulta (/consulta) → Dashboard (/dashboard)`
- **Rotas Canônicas**: 6 páginas principais identificadas via análise automatizada
- **Theme Integration**: Qualquer HTML recebe automaticamente estilo TeleMed Pro sem modificações manuais

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL database connection.
- **express**: Web application framework.
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
- **WebRTC**: Peer-to-peer video communication.
- **beautifulsoup4**: HTML parsing for navigation analysis.