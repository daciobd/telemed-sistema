#!/usr/bin/env tsx

/**
 * Script utilitário para rotear comandos /telemed para o ChatGPT Agent
 * Uso: npm run relay "/telemed crie um endpoint para laudo PDF"
 */

import axios from 'axios';

const TELEMED_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://telemed-sistema.onrender.com'
  : 'http://localhost:5000';

interface TelemedCommand {
  command: string;
  args: string;
}

function parseTelemedCommand(input: string): TelemedCommand {
  const cleanInput = input.replace(/^\/telemed\s+/, '');
  const parts = cleanInput.split(' ');
  const command = parts[0];
  const args = parts.slice(1).join(' ');
  
  return { command, args };
}

async function routeToTelemedAgent(command: string, args: string): Promise<void> {
  const headers = {
    'Content-Type': 'application/json',
    'X-Agent': 'replit'
  };

  try {
    console.log(`👷 Replit Agent: Roteando para ChatGPT Agent...`);
    console.log(`🎯 Comando: ${command}`);
    console.log(`📝 Args: ${args}`);

    let endpoint = '';
    let payload = {};

    switch (command) {
      case 'ask':
      case 'pergunta':
        endpoint = '/api/ai-agent/ask';
        payload = { question: args };
        break;
      
      case 'gerar':
      case 'generate':
      case 'code':
        endpoint = '/api/ai-agent/generate-code';
        payload = { specification: args };
        break;
      
      case 'otimizar':
      case 'optimize':
        endpoint = '/api/ai-agent/optimize-code';
        payload = { 
          currentCode: args.split('|')[0] || '',
          objective: args.split('|')[1] || 'Otimizar código'
        };
        break;
      
      case 'status':
        endpoint = '/api/ai-agent/status';
        break;
      
      case 'initialize':
      case 'init':
        endpoint = '/api/ai-agent/initialize';
        break;
      
      default:
        // Comando genérico - usar ask
        endpoint = '/api/ai-agent/ask';
        payload = { question: `${command} ${args}` };
    }

    const url = `${TELEMED_API_BASE}${endpoint}`;
    
    console.log(`🚀 Fazendo requisição para: ${url}`);
    
    const response = await axios.post(url, payload, { headers, timeout: 30000 });
    
    console.log(`\n✅ Resposta do ChatGPT Agent TeleMed:`);
    console.log('─'.repeat(50));
    
    if (typeof response.data === 'object') {
      console.log(JSON.stringify(response.data, null, 2));
    } else {
      console.log(response.data);
    }
    
    console.log('─'.repeat(50));
    
  } catch (error: any) {
    console.error(`\n❌ Erro ao comunicar com ChatGPT Agent:`);
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor');
    } else {
      console.error('Erro na configuração:', error.message);
    }
  }
}

async function main() {
  const input = process.argv.slice(2).join(' ');
  
  if (!input || !input.startsWith('/telemed')) {
    console.log(`
👷 Replit Agent: Script de relay para ChatGPT Agent TeleMed

Uso:
  npm run relay "/telemed ask como implementar LGPD?"
  npm run relay "/telemed generate componente de triagem"
  npm run relay "/telemed optimize código|melhorar performance"
  npm run relay "/telemed status"

Comandos disponíveis:
  ask|pergunta    - Fazer pergunta ao agent
  generate|gerar  - Gerar código
  optimize        - Otimizar código (use | para separar código|objetivo)
  status          - Status do agent
  initialize      - Inicializar agent
    `);
    return;
  }

  const { command, args } = parseTelemedCommand(input);
  await routeToTelemedAgent(command, args);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { routeToTelemedAgent, parseTelemedCommand };