#!/usr/bin/env node
// CommonJS
require('dotenv').config();

/**
 * Development starter script for TeleMed full-stack application
 * Sobe o servidor Express (TSX + watch) e o Vite do client em paralelo.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting TeleMed Development Environment...');

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

// Porta dinâmica (Replit/Deploy) com fallback local
const PORT = Number(process.env.PORT) || 5000;

const serverProcess = startProcess(
  'npx',
  ['tsx', '--watch', 'server/index.ts'],
  'Server',
  { env: { PORT: String(PORT) } }
);

// Sobe o Vite do frontend (pasta client/) após um pequeno atraso
setTimeout(() => {
  console.log('🎨 Starting Vite frontend on port 5173...');
  const clientProcess = startProcess(
    'npx',
    ['vite', '--host', '0.0.0.0', '--port', '5173'],
    'Client',
    { cwd: path.join(process.cwd(), 'client') }
  );

  const shutdown = () => {
    console.log('\n🛑 Shutting down development environment...');
    serverProcess.kill();
    clientProcess.kill();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}, 3000);

console.log('✅ Development environment starting...');
console.log('📝 Press Ctrl+C to stop both servers');
