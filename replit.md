# TeleMed Sistema - Telemedicine Platform

## Overview
TeleMed Sistema is a comprehensive telemedicine platform connecting doctors and patients through digital healthcare solutions. It offers video consultations, digital medical records, prescription management, and integrated payment processing. The platform aims to transform traditional medical care delivery by providing a secure, efficient, and user-friendly experience. Key capabilities include AI-powered psychiatric triage, real-time patient queue management for doctors, and a transparent bidding system for consultations.

## User Preferences
Preferred communication style: Simple, everyday language.

## Agent Configuration
- **Agent Name**: Assistente TeleMed Consulta
- **Role**: Agente AI especializado em telemedicina e desenvolvimento contínuo da plataforma TeleMed Consulta
- **Function**: Copiloto de programação com acesso completo para ler, editar e criar arquivos no projeto
- **Target Users**: Médicos, secretárias, pacientes e equipe técnica
- **Capabilities**: 
  - File read/write access (file_read: true, file_write: true)
  - Code execution (execute_code: true)
  - Direct code implementation maintaining TeleMed visual and functional standards
- **Operational Mode**: Executes requested changes directly in project code, creates new files as needed
- **Technical Focus**: Senior developer and intelligent support for healthcare platform development

### Replit Agent JSON Configuration
```json
{
  "name": "Assistente TeleMed Consulta",
  "description": "Agente AI especializado em telemedicina e desenvolvimento contínuo da plataforma TeleMed Consulta. Atua como copiloto de programação, com acesso para ler, editar e criar arquivos no projeto.",
  "instructions": "Você é o Assistente AI TeleMed Consulta, um desenvolvedor sênior e suporte inteligente para médicos, secretárias, pacientes e equipe técnica. Você tem acesso total ao código do projeto (leitura, escrita, criação de arquivos) e deve implementar alterações diretamente no código, mantendo o padrão visual e funcional do TeleMed Consulta.",
  "capabilities": {
    "file_read": true,
    "file_write": true,
    "execute_code": true
  }
}
```

## Recent Updates
- **January 2025**: Implemented comprehensive responsive design system with advanced CSS and JavaScript
- **Mobile Optimization**: Added viewport control, touch targets (44px minimum), iOS zoom prevention
- **Medical Loading System**: Professional loading animations and medical-grade notifications across all pages
- **Advanced Notifications**: 5-type notification system with progress bars and smooth animations
- **Responsive JavaScript**: Dynamic layout adjustment for mobile, tablet, desktop breakpoints
- **Performance**: GPU acceleration, lazy loading, reduced motion support for accessibility
- **Dashboard Clean Version**: Created optimized dashboard based on user template with simplified design, clean UI, premium animations, and responsive layout
- **Dashboard Pastel Design**: Implemented modern pastel design with unique sidebar, Poppins typography, FontAwesome icons, gradient backgrounds, and mobile-responsive layout following user's aesthetic specifications
- **Dashboard Medical Professional**: Created professional medical dashboard based on user's image template with clean layout, medical-focused design, sidebar navigation, and comprehensive functionality cards
- **Dashboard Minimal**: Implemented clean minimal dashboard following user's simplified HTML structure with sidebar navigation, stats cards, and responsive design using Inter typography and professional medical color scheme
- **Agenda Médica**: Created comprehensive medical calendar system with month selection, appointment management, and responsive design featuring blue color scheme (#007BFF), interactive calendar, schedule list with patient details, and add/edit functionality
- **Dashboard Aquarela**: Implemented premium watercolor-style dashboard with soft gradients, aquarela aesthetic using pastel colors (#e0eafc, #cfdef3), interactive hover animations, comprehensive stats cards, action cards for all functionalities, recent activity feed, and breadcrumb navigation. Features glass morphism effects and responsive design optimized for medical workflow efficiency
- **Database Integration Complete (January 2025)**: Successfully connected PostgreSQL database to front-end with real-time data synchronization. Implemented comprehensive API endpoints for patient management, medical records, consultation scheduling, and statistical reporting. Added calendar functionality with date-based patient filtering, real-time status updates, appointment rescheduling, and consultation cancellation with database persistence.
- **Auction System for Consultations (January 2025)**: Implemented innovative bidding system where patients propose consultation values starting at R$ 150. Features dynamic pricing with urgent category (+35% markup), future appointment scheduling for lower bids, doctor continuity (patients can rebook with same doctor), and comprehensive status tracking (waiting, accepted, scheduled). Includes PostgreSQL integration with real-time notifications and mobile-responsive design.
- **MEMED Digital Prescriptions Integration (January 2025)**: Complete digital prescription system implemented with MEMED API preparation. Features include prescription generation with multiple medications, QR codes for verification, prescription validation periods, patient-specific prescription history, and professional prescription management interface. System includes PostgreSQL storage, real-time notifications, and responsive design. Currently in simulation mode awaiting MEMED API credentials for full activation.
- **Advanced Consultation Rescheduling System (January 2025)**: Complete overhaul of the appointment rescheduling system with modern modal interface, real-time availability checking, categorized rescheduling reasons, detailed observation fields, and comprehensive audit trail. Features include visual time slot selection, automatic conflict detection, rescheduling history tracking in PostgreSQL, and responsive design for all devices. System integrates seamlessly with existing patient management and provides detailed analytics for medical practice optimization.
- **Medical Notifications System via SMS/WhatsApp (August 2025)**: Complete SMS and WhatsApp notification system for medical offers implemented with PostgreSQL integration. Features include automatic medical offer distribution to registered doctors by specialty, bidding system with minimum R$ 150 value, urgent consultation markup (+35%), doctor response processing (ACCEPT/REJECT), comprehensive offer tracking and analytics. System includes 5 registered doctors across multiple specialties, simulation mode for testing without Twilio costs, and full preparation for real Twilio API integration. Responsive web interface (sistema-notificacoes-medicas.html) with breadcrumb navigation and real-time status updates.
- **Agent Configuration Implementation (August 2025)**: Formalized Assistente TeleMed Consulta configuration with specialized telemedicine development capabilities. Agent configured as senior developer copilot with full file access, code execution, and direct implementation capabilities. Supports medical staff, patients, and technical team with healthcare-focused development approach maintaining TeleMed platform standards. JSON configuration provided for Replit Agent setup with complete capabilities enabled.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript using Vite, or Next.js.
- **UI Library**: shadcn/ui components built on Radix UI primitives.
- **Styling**: Tailwind CSS for responsive design.
- **State Management**: React Query for server state management.
- **Routing**: React Router for client-side navigation (or Next.js App Router).
- **Design Principles**: Duotone color scheme (#A7C7E7, #F4D9B4, #E9967A), professional gradients, subtle micro-animations, consistent border-radius (20px), mobile-first approach.
- **Key Features**: Professional login/registration, patient/doctor dashboards, medical specialty pages, appointment scheduling, bidding system, AI-powered psychiatric triage (TDAH-ASRS18, GAD-7, PHQ-9, MDQ, PSS-10), notification center, comprehensive medical profile management, and SMS/WhatsApp medical notifications system.
- **Accessibility**: WCAG 2.1 conformity with ARIA labels, keyboard navigation, and screen reader support.
- **Performance**: Optimized images (WebP), lazy loading, CSS variables, and GPU-accelerated animations.

### Backend Architecture
- **Runtime**: Node.js with Express.js framework.
- **Language**: TypeScript.
- **Authentication**: Hybrid system supporting Replit Auth (OpenID Connect) and credential-based authentication with JWT tokens and role-based access (Patient, Doctor, Admin).
- **API Design**: RESTful endpoints with JSON responses.
- **Real-time Communication**: WebSocket and WebRTC for video consultations.
- **Security**: Advanced login security with Base64 encryption, IP tracking, rate limiting, secure session management, and robust error handling. LGPD compliance with consent management, audit logging, and data export tools.

### Database Architecture
- **Primary Database**: PostgreSQL (configured via Drizzle ORM).
- **ORM**: Drizzle for type-safe database operations.
- **Session Storage**: PostgreSQL-backed session store for authentication.
- **Schema**: Comprehensive medical data models including users, patients, doctors, appointments, prescriptions, medical records, medical notifications (medicos_cadastrados, ofertas_medicas, respostas_ofertas).

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