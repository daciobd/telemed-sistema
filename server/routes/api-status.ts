import type { Express } from "express";

// API Status endpoint for automated testing
export function registerApiStatusRoutes(app: Express) {
  // Endpoint específico para testes automatizados
  app.get('/api/status', async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Informações básicas do sistema
      const status = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '8.3.0-CLEAN',
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 5000,
        
        // Health checks
        checks: {
          database: await checkDatabase(),
          memory: checkMemory(),
          disk: checkDisk(),
          api: true
        },
        
        // Performance metrics
        performance: {
          response_time_ms: Date.now() - startTime,
          memory_usage: process.memoryUsage(),
          cpu_usage: process.cpuUsage()
        },
        
        // Serviços críticos
        services: {
          web_server: true,
          static_files: checkStaticFiles(),
          session_store: checkSessionStore(),
          health_endpoint: true
        }
      };
      
      // Calcular status geral
      const allChecksHealthy = Object.values(status.checks).every(check => check === true);
      const allServicesHealthy = Object.values(status.services).every(service => service === true);
      
      if (allChecksHealthy && allServicesHealthy) {
        status.status = 'healthy';
        res.status(200).json(status);
      } else {
        status.status = 'degraded';
        res.status(503).json(status);
      }
      
    } catch (error) {
      console.error('API Status check failed:', error);
      
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        version: process.env.npm_package_version || '8.3.0-CLEAN'
      });
    }
  });
  
  // Endpoint de health check mais simples
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      port: process.env.PORT || 5000,
      version: process.env.npm_package_version || '8.3.0-CLEAN'
    });
  });
  
  // Endpoint de readiness (para k8s/containers)
  app.get('/ready', (req, res) => {
    // Verificações mais rigorosas para readiness
    const ready = checkReadiness();
    
    if (ready) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Endpoint de liveness (para k8s/containers)
  app.get('/live', (req, res) => {
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
}

// Verificar conexão com banco de dados
async function checkDatabase(): Promise<boolean> {
  try {
    // Se tiver DATABASE_URL configurada, tentar uma query simples
    if (process.env.DATABASE_URL) {
      // Placeholder - implementar verificação real do banco se necessário
      return true;
    }
    return true; // Se não tem banco configurado, considera OK
  } catch (error) {
    console.error('Database check failed:', error);
    return false;
  }
}

// Verificar uso de memória
function checkMemory(): boolean {
  try {
    const memUsage = process.memoryUsage();
    const totalMem = memUsage.heapTotal;
    const usedMem = memUsage.heapUsed;
    
    // Alerta se usar mais de 90% da heap
    const memoryPercent = (usedMem / totalMem) * 100;
    return memoryPercent < 90;
  } catch (error) {
    console.error('Memory check failed:', error);
    return false;
  }
}

// Verificar espaço em disco (simplificado)
function checkDisk(): boolean {
  try {
    // Verificação básica - se conseguir executar, considera OK
    return true;
  } catch (error) {
    console.error('Disk check failed:', error);
    return false;
  }
}

// Verificar se arquivos estáticos estão acessíveis
function checkStaticFiles(): boolean {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Verificar se o diretório dist existe (para build de produção)
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      return true;
    }
    
    // Verificar se estamos em desenvolvimento
    const clientPath = path.join(process.cwd(), 'client');
    if (fs.existsSync(clientPath)) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Static files check failed:', error);
    return false;
  }
}

// Verificar session store
function checkSessionStore(): boolean {
  try {
    // Se temos SESSION_SECRET, considera que o session store está OK
    return !!process.env.SESSION_SECRET;
  } catch (error) {
    console.error('Session store check failed:', error);
    return false;
  }
}

// Verificar se a aplicação está pronta para receber tráfego
function checkReadiness(): boolean {
  try {
    // Verificações para determinar se a app está pronta
    const hasRequiredEnv = process.env.NODE_ENV !== undefined;
    const serverRunning = true; // Se chegou aqui, o servidor está rodando
    
    return hasRequiredEnv && serverRunning;
  } catch (error) {
    console.error('Readiness check failed:', error);
    return false;
  }
}