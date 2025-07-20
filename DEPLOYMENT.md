# Deployment Guide - TeleMed Sistema

## 🚀 Quick Start

The project has been configured with complete deployment support for multiple platforms.

### Manual Deployment

```bash
# Build the application
node deploy-build.js

# Start production server  
node deploy-start.js
```

### Platform-Specific Instructions

#### 1. Heroku
- **Build Command**: Automatic (uses Procfile)
- **Start Command**: `web: node deploy-start.js`
- **Environment Variables**: Set DATABASE_URL, NODE_ENV=production

#### 2. Render.com
- **Build Command**: `node deploy-build.js`
- **Start Command**: `node deploy-start.js`
- **Configuration**: Uses render.yaml

#### 3. Railway
- **Build Command**: `node deploy-build.js`
- **Start Command**: `node deploy-start.js`
- **Configuration**: Uses railway.json

#### 4. Vercel
- **Build Command**: `node deploy-build.js`
- **Start Command**: `node deploy-start.js`
- **Configuration**: Uses vercel.json

#### 5. Replit Deployments
- **Build Command**: `node deploy-build.js`
- **Start Command**: `node deploy-start.js`
- **Port**: Uses PORT environment variable or defaults to 5000

## 🔧 Build Process

The deployment build process includes:

1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Preparation**: Copies server files and dependencies
3. **Production Package.json**: Creates optimized package.json for production
4. **TypeScript Support**: Maintains tsx runtime for production

## 📁 Output Structure

```
dist/
├── public/           # Built frontend assets
├── server/           # Server source files  
├── shared/           # Shared TypeScript types
├── package.json      # Production dependencies
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
```

## 🌍 Environment Variables

- `NODE_ENV=production` - Production environment
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string

## ⚙️ Available Scripts

- `node build.js` - Standard build process
- `node start.js` - Standard start process  
- `node deploy-build.js` - Deployment-optimized build
- `node deploy-start.js` - Deployment-optimized start

## 🔍 Troubleshooting

### Missing Build/Start Scripts Error

If deployment fails with "Missing 'build' script", use:
- Build Command: `node deploy-build.js`
- Start Command: `node deploy-start.js`

### TypeScript Runtime Issues

The production build includes tsx runtime to handle TypeScript files directly without compilation.

### Port Binding Issues

Ensure your deployment platform sets the PORT environment variable. The app defaults to port 5000.

## 🏗️ Architecture

- **Frontend**: React + Vite (bundled to static assets)
- **Backend**: Express + TypeScript (tsx runtime)
- **Database**: PostgreSQL (supports connection pooling)
- **File Structure**: Monorepo with shared types

## ✅ Deployment Checklist

1. ☐ Environment variables configured
2. ☐ Database URL provided
3. ☐ Build command set to `node deploy-build.js`
4. ☐ Start command set to `node deploy-start.js`
5. ☐ Port configuration verified (0.0.0.0 binding)
6. ☐ Health check endpoint available at `/health`