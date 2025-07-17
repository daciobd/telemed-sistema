import type { Express } from "express";
import { healthChecker } from "../monitoring/health-checker";
import { monitoringService } from "../monitoring/integrations";

// API Status endpoint for automated testing
export function registerApiStatusRoutes(app: Express) {
  // Endpoint específico para testes automatizados com sistema avançado de monitoramento
  app.get('/api/status', async (req, res) => {
    try {
      const metrics = await healthChecker.runHealthChecks();
      
      // Adicionar informações extras para compatibilidade
      const status = {
        ...metrics,
        version: process.env.npm_package_version || '8.3.0-CLEAN',
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 5000,
      };
      
      // Status code baseado no status de saúde
      const statusCode = status.status === 'healthy' ? 200 : 
                        status.status === 'degraded' ? 503 : 500;
      
      res.status(statusCode).json(status);
      
    } catch (error) {
      console.error('API Status check failed:', error);
      
      // Enviar alerta de falha crítica
      await monitoringService.sendAlert({
        type: 'critical',
        title: 'API Status Endpoint Failed',
        message: `API status endpoint encountered a critical error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        metadata: {
          error_name: error instanceof Error ? error.name : 'Unknown',
          stack: error instanceof Error ? error.stack : 'No stack trace'
        }
      });
      
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        version: process.env.npm_package_version || '8.3.0-CLEAN'
      });
    }
  });
  
  // Endpoint de health check mais simples
  app.get('/health', async (req, res) => {
    try {
      const latestMetrics = healthChecker.getLatestMetrics();
      
      res.status(200).json({
        status: latestMetrics?.status || 'healthy',
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 5000,
        version: process.env.npm_package_version || '8.3.0-CLEAN',
        uptime: process.uptime(),
        last_check: latestMetrics?.timestamp
      });
    } catch (error) {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 5000,
        version: process.env.npm_package_version || '8.3.0-CLEAN'
      });
    }
  });
  
  // Endpoint de readiness (para k8s/containers)
  app.get('/ready', async (req, res) => {
    try {
      const latestMetrics = healthChecker.getLatestMetrics();
      const isReady = latestMetrics?.status === 'healthy' || latestMetrics?.status === 'degraded';
      
      res.status(isReady ? 200 : 503).json({
        status: isReady ? 'ready' : 'not ready',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        status: 'not ready',
        error: 'Health check failed'
      });
    }
  });

  // Endpoint de liveness (para k8s/containers)
  app.get('/live', (req, res) => {
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString()
    });
  });

  // Endpoint para métricas históricas de monitoramento
  app.get('/api/metrics', async (req, res) => {
    try {
      const history = healthChecker.getMetricsHistory();
      const latest = healthChecker.getLatestMetrics();
      
      res.status(200).json({
        latest: latest,
        history: history.slice(-24), // Últimas 24 medições (2 horas se cada 5 min)
        summary: {
          total_checks: history.length,
          healthy_percentage: history.length > 0 ? (history.filter(m => m.status === 'healthy').length / history.length * 100).toFixed(2) : '0',
          average_response_time: history.length > 0 ? (history.reduce((sum, m) => sum + m.performance.response_time_ms, 0) / history.length).toFixed(0) : '0'
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch metrics',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Endpoint para teste de alertas (desenvolvimento)
  app.post('/api/test-alert', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Not available in production' });
    }

    try {
      const { type, title, message } = req.body;
      
      await monitoringService.sendAlert({
        type: type || 'info',
        title: title || 'Test Alert from TeleMed',
        message: message || 'This is a test alert to verify monitoring integrations.',
        timestamp: new Date().toISOString(),
        metadata: {
          test: true,
          environment: process.env.NODE_ENV
        }
      });

      res.status(200).json({
        success: true,
        message: 'Test alert sent successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to send test alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Endpoint para configurar monitoramento externo
  app.post('/api/setup-monitoring', async (req, res) => {
    try {
      const baseUrl = req.body.baseUrl || `${req.protocol}://${req.get('host')}`;
      
      await monitoringService.setupExternalMonitoring(baseUrl);
      
      res.status(200).json({
        success: true,
        message: 'External monitoring setup initiated',
        baseUrl: baseUrl
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to setup external monitoring',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}