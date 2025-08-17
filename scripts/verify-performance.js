#!/usr/bin/env node
// TeleMed Performance Verification Script

const { spawn } = require('child_process');
const fs = require('fs');

async function verifyPerformance() {
  console.log('🚀 Verificando performance TeleMed...');
  
  // Start server
  const server = spawn('npm', ['run', 'dev'], { detached: true });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    // Run Lighthouse CI
    const lighthouse = spawn('npx', ['@lhci/cli', 'autorun'], { stdio: 'inherit' });
    
    lighthouse.on('close', (code) => {
      console.log(code === 0 ? '✅ Performance budget atingido!' : '❌ Performance budget não atingido');
      
      // Kill server
      process.kill(-server.pid);
      process.exit(code);
    });
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error);
    process.kill(-server.pid);
    process.exit(1);
  }
}

if (require.main === module) {
  verifyPerformance();
}

module.exports = verifyPerformance;
