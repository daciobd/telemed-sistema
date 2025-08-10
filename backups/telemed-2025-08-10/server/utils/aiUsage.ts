import fs from 'fs/promises';
import path from 'path';

interface AIUsageMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  quotaErrors: number;
  rateLimitErrors: number;
  billingErrors: number;
  fallbackUsage: number;
  lastRequest: string;
  lastError?: string;
  retryCount: number;
  modelUsage: {
    [model: string]: number;
  };
  dailyUsage: {
    [date: string]: {
      requests: number;
      errors: number;
      fallbacks: number;
    };
  };
}

const AI_USAGE_FILE = process.env.AI_USAGE_FILE || './storage/ai-usage.json';

export class AIUsageTracker {
  private static instance: AIUsageTracker;
  private metrics: AIUsageMetrics;

  private constructor() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      quotaErrors: 0,
      rateLimitErrors: 0,
      billingErrors: 0,
      fallbackUsage: 0,
      lastRequest: new Date().toISOString(),
      retryCount: 0,
      modelUsage: {},
      dailyUsage: {}
    };
  }

  public static getInstance(): AIUsageTracker {
    if (!AIUsageTracker.instance) {
      AIUsageTracker.instance = new AIUsageTracker();
    }
    return AIUsageTracker.instance;
  }

  async loadMetrics(): Promise<void> {
    try {
      const data = await fs.readFile(AI_USAGE_FILE, 'utf-8');
      this.metrics = { ...this.metrics, ...JSON.parse(data) };
    } catch (error) {
      console.log(`📊 AI Usage: Criando novo arquivo de métricas em ${AI_USAGE_FILE}`);
      await this.saveMetrics();
    }
  }

  async saveMetrics(): Promise<void> {
    try {
      const dir = path.dirname(AI_USAGE_FILE);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(AI_USAGE_FILE, JSON.stringify(this.metrics, null, 2));
    } catch (error) {
      console.error('❌ Erro ao salvar métricas AI:', error);
    }
  }

  private getTodayKey(): string {
    return new Date().toISOString().split('T')[0];
  }

  private updateDailyUsage(type: 'requests' | 'errors' | 'fallbacks'): void {
    const today = this.getTodayKey();
    if (!this.metrics.dailyUsage[today]) {
      this.metrics.dailyUsage[today] = { requests: 0, errors: 0, fallbacks: 0 };
    }
    this.metrics.dailyUsage[today][type]++;
  }

  async trackRequest(model: string): Promise<void> {
    this.metrics.totalRequests++;
    this.metrics.lastRequest = new Date().toISOString();
    this.metrics.modelUsage[model] = (this.metrics.modelUsage[model] || 0) + 1;
    this.updateDailyUsage('requests');
    await this.saveMetrics();
  }

  async trackSuccess(): Promise<void> {
    this.metrics.successfulRequests++;
    await this.saveMetrics();
  }

  async trackError(errorType: string, errorMessage?: string): Promise<void> {
    this.metrics.failedRequests++;
    this.metrics.lastError = errorMessage;
    this.updateDailyUsage('errors');

    switch (errorType) {
      case 'insufficient_quota':
        this.metrics.quotaErrors++;
        break;
      case 'billing_hard_limit_reached':
        this.metrics.billingErrors++;
        break;
      case 'rate_limit_exceeded':
        this.metrics.rateLimitErrors++;
        break;
    }

    await this.saveMetrics();
  }

  async trackFallback(): Promise<void> {
    this.metrics.fallbackUsage++;
    this.updateDailyUsage('fallbacks');
    await this.saveMetrics();
  }

  async trackRetry(): Promise<void> {
    this.metrics.retryCount++;
    await this.saveMetrics();
  }

  getMetrics(): AIUsageMetrics {
    return { ...this.metrics };
  }

  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'critical';
    details: any;
  } {
    const today = this.getTodayKey();
    const todayUsage = this.metrics.dailyUsage[today] || { requests: 0, errors: 0, fallbacks: 0 };
    
    const errorRate = this.metrics.totalRequests > 0 
      ? (this.metrics.failedRequests / this.metrics.totalRequests) * 100 
      : 0;
    
    const fallbackRate = this.metrics.totalRequests > 0 
      ? (this.metrics.fallbackUsage / this.metrics.totalRequests) * 100 
      : 0;

    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';

    if (errorRate > 50 || this.metrics.quotaErrors > 10) {
      status = 'critical';
    } else if (errorRate > 20 || fallbackRate > 30) {
      status = 'degraded';
    }

    return {
      status,
      details: {
        errorRate: Math.round(errorRate * 100) / 100,
        fallbackRate: Math.round(fallbackRate * 100) / 100,
        todayRequests: todayUsage.requests,
        todayErrors: todayUsage.errors,
        quotaErrors: this.metrics.quotaErrors,
        rateLimitErrors: this.metrics.rateLimitErrors,
        billingErrors: this.metrics.billingErrors,
        lastRequest: this.metrics.lastRequest,
        lastError: this.metrics.lastError
      }
    };
  }
}

export const aiUsageTracker = AIUsageTracker.getInstance();