#!/usr/bin/env tsx

/**
 * Script para verificar status de ambos os agentes
 * Uso: npm run agent:status
 */

import axios from 'axios';

const TELEMED_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://telemed-sistema.onrender.com'
  : 'http://localhost:5000';

async function checkReplitAgent(): Promise<void> {
  console.log('👷 Replit Agent: online');
  console.log('📍 Location: Replit workspace chat');
  console.log('🔧 Capabilities: File operations, code execution, deployments');
  console.log('💬 Communication: Direct chat interface');
  console.log('🎯 Specialization: Full-stack development, DevOps');
}

async function checkTelemedAgent(): Promise<void> {
  try {
    const response = await axios.get(`${TELEMED_API_BASE}/api/ai-agent/whoami`, {
      timeout: 10000,
      headers: {
        'X-Agent': 'replit'
      }
    });
    
    const data = response.data;
    
    console.log('🤖 ChatGPT Agent TeleMed:');
    console.log(`   Agent: ${data.agent}`);
    console.log(`   Version: ${data.version}`);
    console.log(`   Mode: ${data.mode}`);
    console.log(`   Uptime: ${Math.floor(data.uptime)}s`);
    console.log(`   PID: ${data.pid}`);
    console.log(`   Specialization: ${data.specialization}`);
    console.log('   Capabilities:');
    data.capabilities.forEach((cap: string) => {
      console.log(`     - ${cap}`);
    });
    
  } catch (error: any) {
    console.log('❌ ChatGPT Agent TeleMed: offline ou inacessível');
    
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.error || 'Unknown'}`);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('   Error: Servidor não está rodando');
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }
}

async function main(): Promise<void> {
  console.log('🔍 Verificando status dos agentes TeleMed...\n');
  
  console.log('═'.repeat(50));
  await checkReplitAgent();
  
  console.log('\n' + '═'.repeat(50));
  await checkTelemedAgent();
  
  console.log('\n' + '═'.repeat(50));
  console.log('📊 Status Report Completo');
  console.log('🕐 Timestamp:', new Date().toISOString());
  
  // Testar endpoint de status também
  try {
    const statusResponse = await axios.get(`${TELEMED_API_BASE}/api/ai-agent/status`, {
      timeout: 5000,
      headers: { 'X-Agent': 'replit' }
    });
    
    console.log('\n🎯 API Status:');
    console.log(`   Service: ${statusResponse.data.service}`);
    console.log(`   Status: ${statusResponse.data.status}`);
    console.log(`   Mode: ${statusResponse.data.mode}`);
    console.log(`   API Key Configured: ${statusResponse.data.apiKeyConfigured}`);
    console.log(`   Endpoints: ${statusResponse.data.endpoints.length} available`);
    
  } catch (error) {
    console.log('\n❌ API Status: Não foi possível verificar');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}