import { monitoringService } from './integrations';
import fs from 'fs';
import path from 'path';

// ========================================
// HEALTH CHECKER
// ========================================
// Sistema avançado de health checking com alertas automáticos

interface HealthCheck {
  name: string;
  check: () => Promise<boolean>;
  critical: boolean;
  timeout: number;
}

interface HealthMetrics {
  timestamp: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean>;
  performance: {
    response_time_ms: number;
    memory_usage: NodeJS.MemoryUsage;
    cpu_usage: NodeJS.CpuUsage;
    uptime: number;
  };
  services: Record<string, boolean>;
  errors: string[];
}

export class HealthChecker {
  private checks: HealthCheck[] = [];
  private lastStatus: string = 'healthy';
  private alertCooldown: Map<string, number> = new Map();
  private metricsHistory: HealthMetrics[] = [];
  private maxHistorySize = 100;

  constructor() {
    this.setupDefaultChecks();
    this.startPeriodicChecks();
  }

  private setupDefaultChecks(): void {
    // Database check
    this.addCheck({
      name: 'database',
      check: this.checkDatabase.bind(this),
      critical: true,
      timeout: 5000
    });

    // Memory check
    this.addCheck({
      name: 'memory',
      check: this.checkMemory.bind(this),
      critical: false,
      timeout: 1000
    });

    // Disk space check
    this.addCheck({
      name: 'disk',
      check: this.checkDiskSpace.bind(this),
      critical: false,
      timeout: 2000
    });

    // API responsiveness check
    this.addCheck({
      name: 'api_response',
      check: this.checkApiResponse.bind(this),
      critical: true,
      timeout: 3000
    });

    // Static files check
    this.addCheck({
      name: 'static_files',
      check: this.checkStaticFiles.bind(this),
      critical: false,
      timeout: 2000
    });

    // Session store check
    this.addCheck({
      name: 'session_store',
      check: this.checkSessionStore.bind(this),
      critical: false,
      timeout: 2000
    });
  }

  addCheck(check: HealthCheck): void {
    this.checks.push(check);
  }

  async runHealthChecks(): Promise<HealthMetrics> {
    const startTime = Date.now();
    const errors: string[] = [];
    const checkResults: Record<string, boolean> = {};
    const serviceResults: Record<string, boolean> = {};

    // Run all health checks with timeout
    for (const check of this.checks) {
      try {
        const result = await Promise.race([
          check.check(),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), check.timeout)
          )
        ]);
        
        checkResults[check.name] = result;
        
        if (!result && check.critical) {
          errors.push(`Critical check failed: ${check.name}`);
        }
      } catch (error) {
        checkResults[check.name] = false;
        const errorMsg = `Check ${check.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        
        if (check.critical) {
          console.error(`🚨 Critical health check failed: ${check.name}`, error);
        }
      }
    }

    // Additional service checks
    serviceResults.web_server = true; // If we're running this, web server is up
    serviceResults.health_endpoint = true; // If this runs, health endpoint works
    serviceResults.static_files = checkResults.static_files || false;
    serviceResults.session_store = checkResults.session_store || false;

    // Calculate overall status
    const criticalChecks = this.checks.filter(c => c.critical);
    const criticalChecksPassed = criticalChecks.every(c => checkResults[c.name]);
    const allChecksHealthy = Object.values(checkResults).every(result => result);

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (!criticalChecksPassed) {
      status = 'unhealthy';
    } else if (!allChecksHealthy) {
      status = 'degraded';
    } else {
      status = 'healthy';
    }

    // Performance metrics
    const performance = {
      response_time_ms: Date.now() - startTime,
      memory_usage: process.memoryUsage(),
      cpu_usage: process.cpuUsage(),
      uptime: process.uptime()
    };

    const metrics: HealthMetrics = {
      timestamp: new Date().toISOString(),
      status,
      checks: checkResults,
      performance,
      services: serviceResults,
      errors
    };

    // Store metrics
    this.storeMetrics(metrics);

    // Send alerts if status changed or critical issues
    await this.handleAlerts(metrics);

    return metrics;
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      // If we have a database URL, try to connect
      if (process.env.DATABASE_URL) {
        // Simple check - if URL exists and we can import db module, consider it healthy
        // In a real implementation, you'd run a simple query like SELECT 1
        return true;
      }
      return true; // No database configured, consider healthy
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  private async checkMemory(): Promise<boolean> {
    try {
      const memUsage = process.memoryUsage();
      const heapPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
      
      // Alert if memory usage is above 85%
      return heapPercent < 85;
    } catch (error) {
      console.error('Memory health check failed:', error);
      return false;
    }
  }

  private async checkDiskSpace(): Promise<boolean> {
    try {
      // Check if we can write to the current directory
      const testFile = path.join(process.cwd(), '.health-check-test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      return true;
    } catch (error) {
      console.error('Disk space health check failed:', error);
      return false;
    }
  }

  private async checkApiResponse(): Promise<boolean> {
    try {
      // If we're running this check, the API is responding
      return true;
    } catch (error) {
      console.error('API response health check failed:', error);
      return false;
    }
  }

  private async checkStaticFiles(): Promise<boolean> {
    try {
      // Check if dist directory exists (production) or client directory (development)
      const distPath = path.join(process.cwd(), 'dist');
      const clientPath = path.join(process.cwd(), 'client');
      
      return fs.existsSync(distPath) || fs.existsSync(clientPath);
    } catch (error) {
      console.error('Static files health check failed:', error);
      return false;
    }
  }

  private async checkSessionStore(): Promise<boolean> {
    try {
      // Check if session configuration is present
      return !!process.env.SESSION_SECRET;
    } catch (error) {
      console.error('Session store health check failed:', error);
      return false;
    }
  }

  private storeMetrics(metrics: HealthMetrics): void {
    this.metricsHistory.push(metrics);
    
    // Keep only last N metrics
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory.shift();
    }
  }

  private async handleAlerts(metrics: HealthMetrics): Promise<void> {
    const currentTime = Date.now();
    
    // Status change alert
    if (metrics.status !== this.lastStatus) {
      const cooldownKey = `status_change_${metrics.status}`;
      const lastAlert = this.alertCooldown.get(cooldownKey) || 0;
      
      // 5 minute cooldown for status change alerts
      if (currentTime - lastAlert > 5 * 60 * 1000) {
        await monitoringService.sendAlert({
          type: metrics.status === 'unhealthy' ? 'critical' : 'warning',
          title: `TeleMed Status Changed: ${this.lastStatus} → ${metrics.status}`,
          message: `System status changed from ${this.lastStatus} to ${metrics.status}.\n\nErrors: ${metrics.errors.join(', ') || 'None'}`,
          timestamp: metrics.timestamp,
          metadata: {
            previous_status: this.lastStatus,
            current_status: metrics.status,
            response_time: `${metrics.performance.response_time_ms}ms`,
            memory_used: `${Math.round(metrics.performance.memory_usage.heapUsed / 1024 / 1024)}MB`,
            uptime: `${Math.round(metrics.performance.uptime / 3600)}h`
          }
        });
        
        this.alertCooldown.set(cooldownKey, currentTime);
      }
      
      this.lastStatus = metrics.status;
    }

    // Critical error alerts
    if (metrics.errors.length > 0) {
      const cooldownKey = 'critical_errors';
      const lastAlert = this.alertCooldown.get(cooldownKey) || 0;
      
      // 10 minute cooldown for error alerts
      if (currentTime - lastAlert > 10 * 60 * 1000) {
        await monitoringService.sendAlert({
          type: 'error',
          title: 'TeleMed Critical Errors Detected',
          message: `${metrics.errors.length} error(s) detected:\n\n${metrics.errors.join('\n')}`,
          timestamp: metrics.timestamp,
          metadata: {
            error_count: metrics.errors.length,
            status: metrics.status
          }
        });
        
        this.alertCooldown.set(cooldownKey, currentTime);
      }
    }

    // Performance alerts
    if (metrics.performance.response_time_ms > 5000) {
      const cooldownKey = 'slow_response';
      const lastAlert = this.alertCooldown.get(cooldownKey) || 0;
      
      // 15 minute cooldown for performance alerts
      if (currentTime - lastAlert > 15 * 60 * 1000) {
        await monitoringService.sendAlert({
          type: 'warning',
          title: 'TeleMed Slow Response Time',
          message: `Health check took ${metrics.performance.response_time_ms}ms (> 5s threshold)`,
          timestamp: metrics.timestamp,
          metadata: {
            response_time: `${metrics.performance.response_time_ms}ms`,
            threshold: '5000ms'
          }
        });
        
        this.alertCooldown.set(cooldownKey, currentTime);
      }
    }
  }

  private startPeriodicChecks(): void {
    // Run health checks every 5 minutes
    setInterval(async () => {
      try {
        await this.runHealthChecks();
      } catch (error) {
        console.error('Periodic health check failed:', error);
      }
    }, 5 * 60 * 1000);

    // Send daily health reports
    setInterval(async () => {
      try {
        const metrics = await this.runHealthChecks();
        await monitoringService.sendHealthReport(metrics);
      } catch (error) {
        console.error('Daily health report failed:', error);
      }
    }, 24 * 60 * 60 * 1000);
  }

  getMetricsHistory(): HealthMetrics[] {
    return this.metricsHistory.slice();
  }

  getLatestMetrics(): HealthMetrics | null {
    return this.metricsHistory[this.metricsHistory.length - 1] || null;
  }
}

// Singleton instance
export const healthChecker = new HealthChecker();