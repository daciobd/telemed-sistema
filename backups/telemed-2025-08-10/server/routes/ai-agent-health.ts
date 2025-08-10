import { Router, Request, Response } from 'express';
import { aiUsageTracker } from '../utils/aiUsage';

const router = Router();

// Health check endpoint
router.get('/health', async (req: Request, res: Response) => {
  try {
    await aiUsageTracker.loadMetrics();
    const healthStatus = aiUsageTracker.getHealthStatus();
    
    res.json({
      status: 'ok',
      service: 'ai-agent',
      health: healthStatus.status,
      timestamp: new Date().toISOString(),
      details: healthStatus.details
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      service: 'ai-agent',
      health: 'critical',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Métricas detalhadas
router.get('/usage', async (req: Request, res: Response) => {
  try {
    await aiUsageTracker.loadMetrics();
    const metrics = aiUsageTracker.getMetrics();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      metrics
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Métricas locais simplificadas
router.get('/usage-local', async (req: Request, res: Response) => {
  try {
    await aiUsageTracker.loadMetrics();
    const metrics = aiUsageTracker.getMetrics();
    const healthStatus = aiUsageTracker.getHealthStatus();
    
    const summary = {
      health: healthStatus.status,
      total_requests: metrics.totalRequests,
      successful_requests: metrics.successfulRequests,
      failed_requests: metrics.failedRequests,
      error_rate: metrics.totalRequests > 0 
        ? `${Math.round((metrics.failedRequests / metrics.totalRequests) * 100)}%` 
        : '0%',
      quota_errors: metrics.quotaErrors,
      rate_limit_errors: metrics.rateLimitErrors,
      billing_errors: metrics.billingErrors,
      fallback_usage: metrics.fallbackUsage,
      last_request: metrics.lastRequest,
      last_error: metrics.lastError || 'None',
      model_usage: metrics.modelUsage
    };
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reset das métricas (apenas para desenvolvimento)
router.post('/reset-metrics', async (req: Request, res: Response) => {
  try {
    // Criar nova instância limpa
    const newTracker = aiUsageTracker;
    await newTracker.saveMetrics();
    
    res.json({
      status: 'ok',
      message: 'Métricas resetadas com sucesso',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;