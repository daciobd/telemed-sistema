#!/usr/bin/env node

/**
 * Build Script for Telemedicine Platform
 * Builds both client (React/Vite) and server (Node.js/Express) for deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const log = (message) => console.log(`🔧 ${message}`);
const error = (message) => console.error(`❌ ${message}`);

try {
  const startTime = Date.now();
  log('Starting build process...');

  // Step 1: Clean previous build
  if (fs.existsSync('dist')) {
    log('Cleaning previous build...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Step 2: Build client (React/Vite)
  log('Building client application...');
  execSync('npx vite build --base=/', { stdio: 'inherit' });

  // Step 3: Copy server files (TypeScript, will run with tsx)
  log('Copying server application...');
  if (fs.existsSync('server')) {
    fs.cpSync('server', 'dist/server', { recursive: true });
  }

  // Step 4: Copy shared files
  log('Copying shared files...');
  if (fs.existsSync('shared')) {
    fs.cpSync('shared', 'dist/shared', { recursive: true });
  }

  // Step 5: Create production package.json
  log('Creating production package.json...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const prodPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    type: "module",
    scripts: {
      start: "NODE_ENV=production tsx server/index.ts"
    },
    dependencies: {
      // Include production dependencies needed at runtime
      express: packageJson.dependencies.express,
      "express-session": packageJson.dependencies["express-session"],
      "@neondatabase/serverless": packageJson.dependencies["@neondatabase/serverless"],
      "drizzle-orm": packageJson.dependencies["drizzle-orm"],
      "drizzle-zod": packageJson.dependencies["drizzle-zod"],
      bcryptjs: packageJson.dependencies.bcryptjs,
      jsonwebtoken: packageJson.dependencies.jsonwebtoken,
      passport: packageJson.dependencies.passport,
      "passport-openidconnect": packageJson.dependencies["passport-openidconnect"],
      "openid-client": packageJson.dependencies["openid-client"],
      "connect-pg-simple": packageJson.dependencies["connect-pg-simple"],
      pg: packageJson.dependencies.pg,
      ws: packageJson.dependencies.ws,
      zod: packageJson.dependencies.zod,
      nanoid: packageJson.dependencies.nanoid,
      memoizee: packageJson.dependencies.memoizee,
      "@slack/web-api": packageJson.dependencies["@slack/web-api"],
      // Include dev dependencies needed for tsx runtime
      tsx: packageJson.devDependencies.tsx,
      typescript: packageJson.devDependencies.typescript,
      "@types/node": packageJson.devDependencies["@types/node"],
      "@types/express": packageJson.devDependencies["@types/express"],
      // Include additional runtime dependencies
      vite: packageJson.dependencies.vite,
      "@vitejs/plugin-react": packageJson.dependencies["@vitejs/plugin-react"],
      "@replit/vite-plugin-runtime-error-modal": packageJson.dependencies["@replit/vite-plugin-runtime-error-modal"]
    }
  };

  fs.writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2));

  // Step 6: Fix CSS paths in index.html (Critical for Render deployment)
  log('Fixing CSS/JS paths in index.html...');
  const indexPath = 'dist/public/index.html';
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Garantir que todos os assets usem paths absolutos
    indexContent = indexContent.replace(/href="\.\/assets\//g, 'href="/assets/');
    indexContent = indexContent.replace(/src="\.\/assets\//g, 'src="/assets/');
    
    fs.writeFileSync(indexPath, indexContent);
    log('✅ Index.html CSS/JS paths corrected to absolute paths!');
  }

  // Performance metrics
  const endTime = Date.now();
  const buildTime = ((endTime - startTime) / 1000).toFixed(2);
  
  log('✅ Build completed successfully!');
  log('📦 Client built to: dist/public');
  log('🚀 Server built to: dist/server');
  log('📄 Production package.json created');
  log('🎨 CSS paths fixed for production deployment');
  log('📊 Build Performance:');
  log(`⏱️ Build time: ${buildTime}s`);
  
  // Bundle size analysis
  if (fs.existsSync('dist/public/assets')) {
    const assetsPath = path.join('dist/public/assets');
    const files = fs.readdirSync(assetsPath);
    let totalSize = 0;
    
    files.forEach(file => {
      const filePath = path.join(assetsPath, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      totalSize += stats.size;
      
      if (file.endsWith('.js')) {
        log(`📄 JS Bundle: ${file} - ${sizeKB}KB`);
      } else if (file.endsWith('.css')) {
        log(`🎨 CSS Bundle: ${file} - ${sizeKB}KB`);
      }
    });
    
    log(`📊 Total assets size: ${(totalSize / 1024).toFixed(2)}KB`);
  }

} catch (err) {
  error(`Build failed: ${err.message}`);
  process.exit(1);
}