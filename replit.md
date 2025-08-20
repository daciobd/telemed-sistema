# TeleMed Sistema - Telemedicine Platform

## Overview
TeleMed Sistema is a comprehensive telemedicine platform connecting doctors and patients through digital healthcare solutions. It offers video consultations, digital medical records, prescription management, and integrated payment processing. The platform aims to transform traditional medical care delivery by providing a secure, efficient, and user-friendly experience, with key capabilities including AI-powered psychiatric triage, real-time patient queue management, and a transparent bidding system for consultations. The project's vision is to transform traditional medical care delivery by providing a secure, efficient, and user-friendly experience, establishing itself as a leading digital healthcare provider.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript (Vite).
- **UI Library**: shadcn/ui components built on Radix UI primitives.
- **Styling**: Tailwind CSS for responsive design.
- **State Management**: React Query for server state management.
- **Routing**: React Router or Next.js App Router for client-side navigation.
- **Design Principles**: Premium emerald-blue color scheme with sophisticated gradients, translucent sticky header with backdrop-blur, glass morphism effects, and professional medical aesthetics.
- **Key Features**: Professional login/registration, patient/doctor dashboards, medical specialty pages, appointment scheduling, bidding system, AI-powered psychiatric triage (TDAH-ASRS18, GAD-7, PHQ-9, MDQ, PSS-10), notification center, medical profile management, and SMS/WhatsApp medical notifications system.
- **Accessibility**: WCAG 2.1 conformity with ARIA labels, keyboard navigation, and screen reader support.
- **Performance**: Optimized images (WebP), lazy loading, CSS variables, and GPU-accelerated animations.
- **Theme System**: Comprehensive theme system with automatic injection for preview pages, allowing `PREVIEW_THEME` environment variable control and a floating UI switcher.

### Backend Architecture
- **Runtime**: Node.js with Express.js framework.
- **Language**: TypeScript.
- **Authentication**: Hybrid system supporting Replit Auth (OpenID Connect) and credential-based authentication with JWT tokens and role-based access (Patient, Doctor, Admin), including advanced login security.
- **API Design**: RESTful endpoints with JSON responses.
- **Real-time Communication**: WebSocket and WebRTC for video consultations.
- **Security**: LGPD compliance with consent management, audit logging, and data export tools. Enhanced security with Helmet.js, CORS, compression middleware, intelligent caching, health monitoring, and production-ready server configuration.
- **AI Integration**: Dual-layer AI kill-switch system with global middleware and router-level guards, ensuring 100% AI feature control via `AI_ENABLED` flag.

### Database Architecture
- **Primary Database**: PostgreSQL (configured via Drizzle ORM).
- **ORM**: Drizzle for type-safe database operations.
- **Session Storage**: PostgreSQL-backed session store for authentication.
- **Schema**: Comprehensive medical data models for users, patients, doctors, appointments, prescriptions, medical records, and medical notifications (medicos_cadastrados, ofertas_medicas, respostas_ofertas).

### Development & Deployment
- **Environments**: Optimized for Replit development and multi-platform production deployment (Render, Heroku, Vercel) with dynamic port configuration.
- **CI/CD**: Automated CI/CD pipelines with GitHub Actions.
- **Monitoring**: Integrated with UptimeRobot, StatusCake, and Slack/Telegram notifications.
- **Automated Backups**: System protecting critical files with tar.gz compression and detailed reporting.
- **Performance Optimization Framework**: Established framework with memo/useCallback/useMemo, React.lazy+Suspense, Query optimization, sticky headers, and comprehensive instrumentation.
- **Canonical Routes**: Officialized route structure for `/agenda`, `/consulta`, `/dashboard` with root `/` redirecting to `/agenda`. Implemented dual-layer redirect system (server-side and client-side) with query string preservation.

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
- **SimpleOpenAIClient**: Custom OpenAI client for AI functionality.
- **beautifulsoup4**: HTML parsing for navigation analysis.