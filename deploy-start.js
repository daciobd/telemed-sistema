#!/usr/bin/env node

/**
 * Deployment Start Script  
 * Wrapper for start.js to ensure compatibility with deployment systems
 * that expect npm start
 */

import { execSync } from 'child_process';

console.log('🚀 Deployment Start Script Started...');

try {
  // Set production environment variables
  process.env.NODE_ENV = 'production';
  process.env.PORT = process.env.PORT || '5000';

  console.log('🌐 Starting production server...');
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔌 Port: ${process.env.PORT}`);

  // Run the main start process
  execSync('node start.js', { stdio: 'inherit' });

} catch (error) {
  console.error('❌ Deployment start failed:', error);
  process.exit(1);
}