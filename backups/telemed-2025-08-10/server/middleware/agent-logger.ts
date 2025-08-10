import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para logging de agentes
export const agentLogger = (req: Request, res: Response, next: NextFunction) => {
  const agentHeader = req.headers['x-agent'] as string;
  const method = req.method;
  const route = req.path;
  const timestamp = new Date().toISOString();
  
  // Log entry
  const logEntry = {
    timestamp,
    agent: agentHeader || 'unknown',
    method,
    route,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    body: method !== 'GET' ? req.body : null
  };

  // Write to progress_log.md
  const logPath = path.join(__dirname, '../../progress_log.md');
  const logLine = `\n## 📝 ${timestamp}\n**Agent:** ${agentHeader || 'unknown'}\n**Route:** ${method} ${route}\n**IP:** ${req.ip}\n\n`;
  
  try {
    fs.appendFileSync(logPath, logLine);
  } catch (error) {
    console.error('❌ Erro ao escrever no progress_log.md:', error);
  }

  // Console log
  console.log(`🔍 Agent Request: ${agentHeader || 'unknown'} → ${method} ${route}`);
  
  next();
};

// Middleware para validação de produção
export const validateAgentInProduction = (req: Request, res: Response, next: NextFunction) => {
  const agentHeader = req.headers['x-agent'] as string;
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction && !agentHeader) {
    return res.status(400).json({
      error: 'X-Agent header required in production',
      message: 'Must specify agent: replit or telemed-chatgpt',
      timestamp: new Date().toISOString()
    });
  }
  
  if (agentHeader && !['replit', 'telemed-chatgpt'].includes(agentHeader)) {
    return res.status(400).json({
      error: 'Invalid X-Agent header',
      valid_agents: ['replit', 'telemed-chatgpt'],
      received: agentHeader,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

// Middleware para lock de escrita
export const writeLockCheck = (req: Request, res: Response, next: NextFunction) => {
  const agentHeader = req.headers['x-agent'] as string;
  const lockPath = path.join(__dirname, '../../.agent-lock');
  
  // Apenas para operações de escrita
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    try {
      if (fs.existsSync(lockPath)) {
        const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf-8'));
        
        if (lockData.owner !== agentHeader) {
          return res.status(423).json({
            error: 'Resource locked',
            locked_by: lockData.owner,
            locked_at: lockData.timestamp,
            message: 'Another agent is currently writing. Try again later.',
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar lock:', error);
    }
  }
  
  next();
};

// Função para criar lock
export const createAgentLock = (agent: string): void => {
  const lockPath = path.join(__dirname, '../../.agent-lock');
  const lockData = {
    owner: agent,
    timestamp: new Date().toISOString(),
    pid: process.pid
  };
  
  try {
    fs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2));
    console.log(`🔒 Lock criado para ${agent}`);
  } catch (error) {
    console.error('❌ Erro ao criar lock:', error);
  }
};

// Função para remover lock
export const removeAgentLock = (): void => {
  const lockPath = path.join(__dirname, '../../.agent-lock');
  
  try {
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath);
      console.log('🔓 Lock removido');
    }
  } catch (error) {
    console.error('❌ Erro ao remover lock:', error);
  }
};