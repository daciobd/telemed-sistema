#!/usr/bin/env node

// Entry point para Replit Run button - TeleMed Sistema
// Este arquivo é reconhecido automaticamente pelo botão Run do Replit

import { spawn } from 'child_process';

console.log('🚀 TeleMed Sistema v12.5.2 - Iniciando...');

// Mata processos existentes na porta 5000
const killExisting = spawn('pkill', ['-f', 'tsx server'], { stdio: 'pipe' });

killExisting.on('close', () => {
  // Aguarda um momento antes de iniciar o novo servidor
  setTimeout(() => {
    console.log('🔄 Iniciando servidor TeleMed...');
    
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      detached: false
    });

    server.on('close', (code) => {
      console.log(`\n🛑 Servidor finalizado com código ${code}`);
    });

    server.on('error', (err) => {
      console.error('❌ Erro ao iniciar servidor:', err);
    });

    // Cleanup handlers
    process.on('SIGINT', () => {
      console.log('\n🛑 Recebido SIGINT, parando servidor...');
      server.kill('SIGINT');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Recebido SIGTERM, parando servidor...');
      server.kill('SIGTERM');
      process.exit(0);
    });

    console.log('✅ Servidor TeleMed iniciado!');
    console.log('🌐 Acesse: http://localhost:5000');
    console.log('🏥 Dashboard: http://localhost:5000/dashboard-aquarela');
    console.log('🩺 Status: http://localhost:5000/api/ai-agent/status');
    
  }, 2000);
});