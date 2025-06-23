# Telemedicine Platform

## Overview

This is a comprehensive telemedicine platform built as a full-stack web application. The system enables healthcare providers and patients to manage appointments, conduct video consultations, maintain electronic medical records, and handle prescriptions in a secure, integrated environment.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

- **Frontend**: React + TypeScript with Vite build system
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with session management
- **Styling**: Tailwind CSS with shadcn/ui components
- **Real-time Communication**: WebSocket for notifications and video calls

## Key Components

### Authentication & Authorization
- Replit Auth integration with OIDC
- Role-based access control (patient, doctor, admin)
- Session storage using PostgreSQL
- Secure cookie-based sessions

### Database Layer
- **ORM**: Drizzle with PostgreSQL dialect
- **Connection**: Neon serverless PostgreSQL
- **Schema**: Comprehensive medical data models including users, patients, doctors, appointments, medical records, and prescriptions
- **Migrations**: Managed through Drizzle Kit

### Frontend Architecture
- **Router**: Wouter for client-side routing
- **State Management**: React Query for server state
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS with custom medical theme
- **Forms**: React Hook Form with Zod validation

### Backend Services
- **API Routes**: RESTful endpoints for all medical entities
- **File Serving**: Static file serving with Vite integration
- **WebSocket**: Real-time notifications and video call signaling
- **Storage Layer**: Abstracted database operations

### Video Consultation System
- **WebRTC**: Peer-to-peer video communication
- **Signaling**: WebSocket-based connection establishment
- **UI**: Custom video room with controls and chat
- **Test Environment**: Dedicated test components for development

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit Auth, sessions stored in PostgreSQL
2. **API Requests**: Frontend makes authenticated requests to Express backend
3. **Database Operations**: Backend uses Drizzle ORM to interact with PostgreSQL
4. **Real-time Updates**: WebSocket connections for live notifications
5. **Video Calls**: WebRTC peer connections established through WebSocket signaling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection
- **drizzle-orm**: Database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **express**: Web server framework
- **ws**: WebSocket implementation

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Production bundling

### Authentication
- **openid-client**: OIDC authentication
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

The application is configured for Replit deployment with:

- **Build Process**: Vite builds frontend, ESBuild bundles server
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Port Configuration**: Server runs on port 5000, external port 80
- **Environment**: Separate development and production modes
- **Auto-scaling**: Configured for Replit autoscale deployment

### Development Mode
- Vite dev server with HMR
- TypeScript compilation
- Real-time error overlay
- WebSocket development support

### Production Mode
- Optimized builds with code splitting
- Static file serving from dist directory
- Production database connections
- Compressed assets

## Changelog
```
Changelog:
- June 23, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```