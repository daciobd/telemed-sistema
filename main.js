#!/usr/bin/env node

// Main entry point for Replit Run button
// This ensures the Run button works correctly

import { spawn } from 'child_process';

console.log('🚀 Iniciando TeleMed Sistema via Replit Run...');

const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

server.on('close', (code) => {
  console.log(`Processo finalizado com código ${code}`);
});

server.on('error', (err) => {
  console.error('Erro ao iniciar servidor:', err);
});

// Handle termination
process.on('SIGINT', () => {
  console.log('\n🛑 Parando servidor...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Terminando servidor...');
  server.kill('SIGTERM');
});