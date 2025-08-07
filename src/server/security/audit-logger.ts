import { storage } from "../storage";

interface AuditLogData {
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  result: "success" | "failure" | "unauthorized";
  riskLevel: "low" | "medium" | "high" | "critical";
  details: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogger {
  async log(data: AuditLogData): Promise<void> {
    try {
      await storage.createAuditLog({
        userId: data.userId || null,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId || null,
        result: data.result,
        riskLevel: data.riskLevel,
        details: data.details,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        timestamp: new Date()
      });

      // Log to console for immediate monitoring in development
      console.log(`[AUDIT] ${data.action} by ${data.userId || 'anonymous'}: ${data.result} (${data.riskLevel} risk)`);
      
      // In production, could also send to external monitoring service
      if (data.riskLevel === 'critical' || data.riskLevel === 'high') {
        console.warn(`[SECURITY ALERT] High-risk activity detected:`, data);
        // Could send notification to security team
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Even if audit logging fails, we shouldn't break the main operation
    }
  }

  async logUserAction(
    userId: string,
    action: string,
    resourceType: string,
    result: "success" | "failure" = "success",
    details: any = {},
    req?: any
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resourceType,
      result,
      riskLevel: this.determineRiskLevel(action, result),
      details,
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent')
    });
  }

  async logSecurityEvent(
    action: string,
    userId: string | null,
    riskLevel: "low" | "medium" | "high" | "critical",
    details: any,
    req?: any
  ): Promise<void> {
    await this.log({
      userId: userId || undefined,
      action,
      resourceType: 'security',
      result: 'success',
      riskLevel,
      details,
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent')
    });
  }

  private determineRiskLevel(action: string, result: "success" | "failure" | "unauthorized"): "low" | "medium" | "high" | "critical" {
    if (result === "unauthorized") return "high";
    if (result === "failure") return "medium";

    // Determine risk based on action
    const highRiskActions = [
      'DATA_EXPORTED',
      'ACCOUNT_DELETED',
      'ADMIN_ACCESS',
      'LGPD_REQUEST_SUBMITTED',
      'MEDICAL_DATA_ACCESSED',
      'ENCRYPTION_KEY_ROTATED'
    ];

    const mediumRiskActions = [
      'PASSWORD_CHANGED',
      'CONSENT_RECORDED',
      'PRIVACY_SETTINGS_UPDATED',
      'USER_LOGIN',
      'MEDICAL_RECORD_CREATED'
    ];

    if (highRiskActions.includes(action)) return "high";
    if (mediumRiskActions.includes(action)) return "medium";
    
    return "low";
  }

  async getSecuritySummary(timeframe: 'day' | 'week' | 'month' = 'day'): Promise<any> {
    try {
      const now = new Date();
      let startDate: Date;

      switch (timeframe) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const logs = await storage.getAuditLogsSummary(startDate, now);
      
      return {
        totalEvents: logs.length,
        successfulEvents: logs.filter(l => l.result === 'success').length,
        failedEvents: logs.filter(l => l.result === 'failure').length,
        unauthorizedAttempts: logs.filter(l => l.result === 'unauthorized').length,
        riskLevels: {
          low: logs.filter(l => l.riskLevel === 'low').length,
          medium: logs.filter(l => l.riskLevel === 'medium').length,
          high: logs.filter(l => l.riskLevel === 'high').length,
          critical: logs.filter(l => l.riskLevel === 'critical').length
        },
        topActions: this.getTopActions(logs),
        timeframe,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to generate security summary:', error);
      throw error;
    }
  }

  private getTopActions(logs: any[]): any[] {
    const actionCounts = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10);
  }
}

export const auditLogger = new AuditLogger();