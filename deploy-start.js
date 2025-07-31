#!/usr/bin/env node

/**
 * Deployment Start Script
 * Wrapper for start.js to ensure compatibility with deployment systems
 * that expect npm start
 */

import { spawn } from 'child_process';
import fs from 'fs';

console.log('🚀 Deployment Start Script Started...');

try {
  // Step 1: Use production package.json if available
  if (fs.existsSync('package.production.json')) {
    console.log('📋 Using production package.json configuration...');
    fs.copyFileSync('package.json', 'package.json.backup');
    fs.copyFileSync('package.production.json', 'package.json');
  }

  // Step 2: Run the main start process
  console.log('🚀 Starting production server...');
  
  // Set production environment
  process.env.NODE_ENV = 'production';
  
  // Determine the start command based on available files
  let startCommand, startArgs;
  
  if (fs.existsSync('start.js')) {
    startCommand = 'node';
    startArgs = ['start.js'];
  } else if (fs.existsSync('dist/server/index.ts')) {
    startCommand = 'npx';
    startArgs = ['tsx', 'dist/server/index.ts'];
  } else if (fs.existsSync('server/index.ts')) {
    startCommand = 'npx';
    startArgs = ['tsx', 'server/index.ts'];
  } else {
    throw new Error('No valid start file found');
  }

  const server = spawn(startCommand, startArgs, {
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd()
  });

  server.on('error', (err) => {
    console.error(`❌ Failed to start server: ${err.message}`);
    process.exit(1);
  });

  server.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Server exited with code ${code}`);
      process.exit(code);
    }
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    server.kill('SIGTERM');
  });

  process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    server.kill('SIGINT');
  });

} catch (error) {
  console.error('❌ Deployment start failed:', error);
  
  // Restore package.json if we made a backup
  if (fs.existsSync('package.json.backup')) {
    fs.copyFileSync('package.json.backup', 'package.json');
    fs.unlinkSync('package.json.backup');
  }
  
  process.exit(1);
}