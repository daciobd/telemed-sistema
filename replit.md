# TeleMed Sistema - Telemedicine Platform

## Overview
TeleMed Sistema is a comprehensive telemedicine platform connecting doctors and patients through digital healthcare solutions. It offers video consultations, digital medical records, prescription management, and integrated payment processing. The platform aims to transform traditional medical care delivery by providing a secure, efficient, and user-friendly experience. Key capabilities include AI-powered psychiatric triage, real-time patient queue management for doctors, and a transparent bidding system for consultations.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Updates
- **January 2025**: Implemented comprehensive responsive design system with advanced CSS and JavaScript
- **Mobile Optimization**: Added viewport control, touch targets (44px minimum), iOS zoom prevention
- **Medical Loading System**: Professional loading animations and medical-grade notifications across all pages
- **Advanced Notifications**: 5-type notification system with progress bars and smooth animations
- **Responsive JavaScript**: Dynamic layout adjustment for mobile, tablet, desktop breakpoints
- **Performance**: GPU acceleration, lazy loading, reduced motion support for accessibility
- **Dashboard Clean Version**: Created optimized dashboard based on user template with simplified design, clean UI, premium animations, and responsive layout

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript using Vite, or Next.js.
- **UI Library**: shadcn/ui components built on Radix UI primitives.
- **Styling**: Tailwind CSS for responsive design.
- **State Management**: React Query for server state management.
- **Routing**: React Router for client-side navigation (or Next.js App Router).
- **Design Principles**: Duotone color scheme (#A7C7E7, #F4D9B4, #E9967A), professional gradients, subtle micro-animations, consistent border-radius (20px), mobile-first approach.
- **Key Features**: Professional login/registration, patient/doctor dashboards, medical specialty pages, appointment scheduling, bidding system, AI-powered psychiatric triage (TDAH-ASRS18, GAD-7, PHQ-9, MDQ, PSS-10), notification center, and comprehensive medical profile management.
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
- **Schema**: Comprehensive medical data models including users, patients, doctors, appointments, prescriptions, and medical records.

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