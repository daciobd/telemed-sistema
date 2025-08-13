# TeleMed Sistema - Telemedicine Platform

## Overview
TeleMed Sistema is a comprehensive telemedicine platform connecting doctors and patients through digital healthcare solutions. It offers video consultations, digital medical records, prescription management, and integrated payment processing. The platform aims to transform traditional medical care delivery by providing a secure, efficient, and user-friendly experience, with key capabilities including AI-powered psychiatric triage, real-time patient queue management, and a transparent bidding system for consultations.

**Recent Update (Aug 2025):** Successfully implemented premium design matching user-provided mockup with sophisticated UI/UX including gradient backgrounds, translucent headers, emerald color scheme, and professional medical aesthetics. Optimized build system achieving 145KB JavaScript bundle (down from 1.079MB) and 3.56s build time with comprehensive download system for project distribution. Enhanced security with Helmet.js, CORS, compression middleware, intelligent caching, health monitoring, and production-ready start.js with enterprise-grade security headers. Implemented automated backup system protecting 22 critical files with tar.gz compression and detailed reporting for disaster recovery compliance. **Project 1 Stabilization Complete (Aug 12, 2025):** Implemented dual-layer AI kill-switch system with global middleware and router-level guards, ensuring 100% AI feature control via AI_ENABLED flag with proper 403 responses when disabled. **Performance Optimization Complete (Aug 13, 2025):** Completed VideoConsultation pilot (85% performance score, all metrics within budget) and successfully replicated pattern in EnhancedConsultation (82% score). Established replicable optimization framework with memo/useCallback/useMemo, React.lazy+Suspense, Query optimization (staleTime 60s, payload reduction), sticky headers, and comprehensive instrumentation (useRenders, usePerfMarks, Server-Timing). **Trilho B Infrastructure (Aug 13, 2025):** Implemented scalable performance testing infrastructure with parametrizable scripts (perf-page.js, verify-perf.js, perf-summary.js), consolidated dashboard at /perf/index.html, and automated budget validation. All components serving performance reports with professional visual dashboard and public Replit URLs. System ready for scaling to additional components.

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