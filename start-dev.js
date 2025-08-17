#!/usr/bin/env node

/**
 * Development starter script for TeleMed full-stack application
 * This script replaces the need for npm run dev by running both
 * the Express server and Vite frontend concurrently
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting TeleMed Development Environment...');

// Function to start a process with proper logging
function startProcess(command, args, name, options = {}) {
  const proc = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    cwd: options.cwd || process.cwd(),
    env: { ...process.env, ...options.env }
  });

  proc.on('error', (err) => {
    console.error(`❌ ${name} error:`, err);
  });

  proc.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ ${name} exited with code ${code}`);
    }
  });

  return proc;
}

// Start the backend server with dynamic port
const PORT = Number(process.env.PORT) || 5000;
console.log(`🔧 Starting Express server on port ${PORT}...`);
const serverProcess = startProcess('npx', ['tsx', 'watch', 'server/index.ts'], 'Server', {
  env: { PORT: String(PORT) }
});

// Wait a moment for server to initialize
setTimeout(() => {
  console.log('🎨 Starting Vite frontend on port 5173...');
  const clientProcess = startProcess('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], 'Client', {
    cwd: path.join(process.cwd(), 'client')
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development environment...');
    serverProcess.kill();
    clientProcess.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down development environment...');
    serverProcess.kill();
    clientProcess.kill();
    process.exit(0);
  });
}, 3000);

console.log('✅ Development environment starting...');
console.log('📝 Press Ctrl+C to stop both servers');