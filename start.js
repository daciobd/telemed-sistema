#!/usr/bin/env node

/**
 * Production Start Script for Telemedicine Platform
 * Starts the built application in production mode
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const log = (message) => console.log(`🚀 ${message}`);
const error = (message) => console.error(`❌ ${message}`);

try {
  // Verify build exists
  if (!fs.existsSync('dist/server/index.ts')) {
    error('Build not found! Please run the build script first.');
    process.exit(1);
  }

  log('Starting production server...');
  
  // Set production environment
  process.env.NODE_ENV = 'production';
  
  // Start the server
  const server = spawn('npx', ['tsx', 'dist/server/index.ts'], {
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd()
  });

  server.on('error', (err) => {
    error(`Failed to start server: ${err.message}`);
    process.exit(1);
  });

  server.on('exit', (code) => {
    if (code !== 0) {
      error(`Server exited with code ${code}`);
      process.exit(code);
    }
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    log('Received SIGTERM, shutting down gracefully...');
    server.kill('SIGTERM');
  });

  process.on('SIGINT', () => {
    log('Received SIGINT, shutting down gracefully...');
    server.kill('SIGINT');
  });

} catch (err) {
  error(`Start failed: ${err.message}`);
  process.exit(1);
}