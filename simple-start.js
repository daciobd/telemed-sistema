#!/usr/bin/env node
/**
 * Simple development starter for TeleMed 
 * Bypasses vite config issues by using a minimal setup
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting TeleMed Simple Development Environment...');

function startProcess(command, args, name, options = {}) {
  const proc = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    cwd: options.cwd || process.cwd(),
    env: { ...process.env, ...options.env },
  });

  proc.on('error', (err) => console.error(`❌ ${name} error:`, err));
  proc.on('exit', (code) => {
    if (code !== 0) console.error(`❌ ${name} exited with code ${code}`);
  });

  return proc;
}

// Start only the backend server
const PORT = Number(process.env.PORT) || 5000;

console.log('🔧 Starting Express server only...');
const serverProcess = startProcess(
  'npx',
  ['tsx', '--watch', 'server/index.ts'],
  'Server',
  { env: { PORT: String(PORT) } }
);

const shutdown = () => {
  console.log('\n🛑 Shutting down development environment...');
  serverProcess.kill();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('✅ Server-only environment starting...');
console.log(`📊 Server running on port ${PORT}`);
console.log('📝 Press Ctrl+C to stop the server');