#!/usr/bin/env node

import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function buildProject() {
  console.log('🏗️  Building TeleMed Sistema for production...');

  try {
    // Step 1: Build the frontend with Vite
    console.log('📦 Building frontend with Vite...');
    execSync('vite build', { stdio: 'inherit' });

    // Step 2: Copy necessary server files to dist
    console.log('🔧 Preparing server files...');
    execSync('mkdir -p dist', { stdio: 'inherit' });
    execSync('cp -r server dist/', { stdio: 'inherit' });
    execSync('cp -r shared dist/', { stdio: 'inherit' });

    // Step 3: Create package.json for production with tsx support
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const prodPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      type: packageJson.type,
      dependencies: {
        ...packageJson.dependencies,
        tsx: packageJson.devDependencies.tsx
      },
      scripts: {
        start: 'tsx server/index.ts'
      }
    };

    fs.writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2));

    // Step 4: Copy necessary config files
    if (fs.existsSync('tsconfig.json')) {
      fs.copyFileSync('tsconfig.json', 'dist/tsconfig.json');
    }
    if (fs.existsSync('vite.config.ts')) {
      fs.copyFileSync('vite.config.ts', 'dist/vite.config.ts');
    }

    console.log('✅ Build completed successfully!');
    console.log('📂 Build output: ./dist/');
    console.log('🚀 To start production server: cd dist && npm start');

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildProject();