#!/usr/bin/env node

/**
 * Development script that runs both frontend and backend
 * This script replaces the missing "dev" script in package.json
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting TeleMed Development Environment...');

// Start backend server
console.log('📡 Starting backend server...');
const backend = spawn('npx', ['tsx', 'watch', 'server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

// Start frontend dev server
console.log('🌐 Starting frontend dev server...');
const frontend = spawn('npx', ['vite', '--port', '5173'], {
  stdio: 'inherit',
  cwd: 'client'
});

// Handle process cleanup
process.on('SIGINT', () => {
  console.log('\n⏹️ Shutting down development servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

backend.on('close', (code) => {
  console.log(`❌ Backend process exited with code ${code}`);
});

frontend.on('close', (code) => {
  console.log(`❌ Frontend process exited with code ${code}`);
});