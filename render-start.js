#!/usr/bin/env node

/**
 * Simple Render Start Script - Direct tsx execution
 * Fixes deployment issues by avoiding complex wrapper scripts
 */

import { spawn } from 'child_process';

console.log('🚀 Starting TeleMed Sistema on Render...');

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '5000';

console.log(`📍 Environment: ${process.env.NODE_ENV}`);
console.log(`🔌 Port: ${process.env.PORT}`);

// Start the server directly with tsx
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: process.env
});

server.on('error', (error) => {
  console.error('❌ Server start failed:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`🔚 Server exited with code ${code}`);
  process.exit(code);
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