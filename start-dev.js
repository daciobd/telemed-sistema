#!/usr/bin/env node
// CommonJS
require('dotenv').config();

/**
 * Development starter script for TeleMed full-stack application
 * Sobe o servidor Express (TSX + watch) e o Vite do client em paralelo.
 */

const { spawn } = require('node:child_process');
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

// --- INÍCIO BLOCO VITE VIA CLI ---
// roda o vite como subprocesso (ESM-friendly), sem usar API Node (CJS)

function startVite() {
  if (process.env.SKIP_VITE === '1') {
    console.log('⏭️  SKIP_VITE=1 → pulando Vite (somente backend Express).');
    return;
  }
  const VITE_PORT = process.env.VITE_PORT || '5173';
  const args = ['vite', '--port', VITE_PORT, '--strictPort'];
  if (process.env.VITE_HOST) { args.push('--host', process.env.VITE_HOST); }

  console.log(`🎨 Starting Vite frontend on port ${VITE_PORT}...`);
  const vite = spawn('npx', args, { stdio: 'inherit', shell: true });
  vite.on('exit', (code) => console.log('Vite exited with code', code));

  const shutdown = () => {
    console.log('\n🛑 Shutting down development environment...');
    serverProcess.kill();
    vite.kill();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  return vite;
}

setTimeout(() => {
  startVite();
}, 3000);
// --- FIM BLOCO VITE VIA CLI ---

console.log('✅ Development environment starting...');
console.log('📝 Press Ctrl+C to stop both servers');
