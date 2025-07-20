#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

function startProduction() {
  console.log('🚀 Starting TeleMed Sistema...');
  
  // Check if dist directory exists
  if (!fs.existsSync('dist')) {
    console.log('📦 Building project first...');
    try {
      execSync('node build.js', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Build failed:', error);
      process.exit(1);
    }
  }

  // Set production environment
  process.env.NODE_ENV = 'production';
  process.env.PORT = process.env.PORT || '5000';

  try {
    // Start the server from dist directory
    console.log(`🌐 Starting server on port ${process.env.PORT}`);
    process.chdir('dist');
    execSync('npm start', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startProduction();