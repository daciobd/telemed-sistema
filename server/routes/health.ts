import { Router } from 'express';
import { checkDbHealth } from '../db.js';
import { env } from '../config/env.js';

const router = Router();

// Comprehensive health check endpoint
router.get('/health', async (req, res) => {
  const requestId = (req as any).requestId;
  const startTime = Date.now();
  
  try {
    // Check database connectivity
    const dbHealthy = await checkDbHealth();
    
    // Basic system checks
    const health = {
      ok: dbHealthy,
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      requestId,
      services: {
        database: dbHealthy ? 'healthy' : 'unhealthy',
        ai: env.AI_ENABLED ? 'enabled' : 'disabled',
      },
      performance: {
        responseTime: Date.now() - startTime,
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        }
      }
    };
    
    // Log health check
    console.log(`[${requestId}] Health check - DB: ${dbHealthy ? 'OK' : 'FAIL'}, Response: ${health.performance.responseTime}ms`);
    
    const statusCode = dbHealthy ? 200 : 503;
    res.status(statusCode).json(health);
    
  } catch (error) {
    console.error(`[${requestId}] Health check error:`, error);
    res.status(503).json({
      ok: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
});

// Readiness probe (for k8s/container orchestration)
router.get('/ready', async (req, res) => {
  try {
    const dbHealthy = await checkDbHealth();
    if (dbHealthy) {
      res.status(200).json({ ready: true });
    } else {
      res.status(503).json({ ready: false, reason: 'database_unavailable' });
    }
  } catch (error) {
    res.status(503).json({ ready: false, reason: 'health_check_failed' });
  }
});

// Liveness probe (for k8s/container orchestration)
router.get('/live', (req, res) => {
  res.status(200).json({ 
    alive: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router;