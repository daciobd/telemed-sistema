import { WebClient } from "@slack/web-api";

// ========================================
// MONITORING INTEGRATIONS
// ========================================
// Integrações com sistemas de monitoramento externos
// UptimeRobot, StatusCake, Slack, Telegram

interface MonitoringAlert {
  type: 'error' | 'warning' | 'info' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean>;
  performance: {
    response_time_ms: number;
    memory_usage: any;
    cpu_usage: any;
  };
  services: Record<string, boolean>;
}

// ========================================
// SLACK INTEGRATION
// ========================================
class SlackMonitoring {
  private client: WebClient;
  private channel: string;

  constructor() {
    if (!process.env.SLACK_BOT_TOKEN) {
      console.warn('SLACK_BOT_TOKEN not configured - Slack monitoring disabled');
      return;
    }
    
    this.client = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.channel = process.env.SLACK_CHANNEL_ID || '#telemed-alerts';
  }

  async sendAlert(alert: MonitoringAlert): Promise<void> {
    if (!this.client) return;

    try {
      const color = this.getAlertColor(alert.type);
      const emoji = this.getAlertEmoji(alert.type);
      
      await this.client.chat.postMessage({
        channel: this.channel,
        text: `${emoji} ${alert.title}`,
        attachments: [
          {
            color: color,
            title: `${emoji} ${alert.title}`,
            text: alert.message,
            fields: [
              {
                title: "Timestamp",
                value: alert.timestamp,
                short: true
              },
              {
                title: "Type",
                value: alert.type.toUpperCase(),
                short: true
              },
              ...(alert.metadata ? Object.entries(alert.metadata).map(([key, value]) => ({
                title: key,
                value: String(value),
                short: true
              })) : [])
            ],
            footer: "TeleMed Sistema Monitoring",
            ts: Math.floor(new Date(alert.timestamp).getTime() / 1000).toString()
          }
        ]
      });
      
      console.log('✅ Slack alert sent successfully');
    } catch (error) {
      console.error('❌ Failed to send Slack alert:', error);
    }
  }

  async sendHealthReport(health: HealthStatus): Promise<void> {
    if (!this.client) return;

    try {
      const statusEmoji = health.status === 'healthy' ? '✅' : 
                         health.status === 'degraded' ? '⚠️' : '❌';
      
      const failedChecks = Object.entries(health.checks)
        .filter(([_, status]) => !status)
        .map(([name]) => name);

      const failedServices = Object.entries(health.services)
        .filter(([_, status]) => !status)
        .map(([name]) => name);

      await this.client.chat.postMessage({
        channel: this.channel,
        text: `${statusEmoji} Health Report - ${health.status.toUpperCase()}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `${statusEmoji} TeleMed Sistema Health Report`
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Status:* ${health.status.toUpperCase()}`
              },
              {
                type: "mrkdwn",
                text: `*Response Time:* ${health.performance.response_time_ms}ms`
              },
              {
                type: "mrkdwn",
                text: `*Memory Used:* ${Math.round(health.performance.memory_usage.heapUsed / 1024 / 1024)}MB`
              },
              {
                type: "mrkdwn",
                text: `*Timestamp:* ${new Date().toISOString()}`
              }
            ]
          },
          ...(failedChecks.length > 0 ? [{
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Failed Health Checks:* ${failedChecks.join(', ')}`
            }
          }] : []),
          ...(failedServices.length > 0 ? [{
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Failed Services:* ${failedServices.join(', ')}`
            }
          }] : [])
        ]
      });
      
      console.log('✅ Slack health report sent successfully');
    } catch (error) {
      console.error('❌ Failed to send Slack health report:', error);
    }
  }

  private getAlertColor(type: string): string {
    switch (type) {
      case 'critical': return 'danger';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'good';
      default: return '#36a64f';
    }
  }

  private getAlertEmoji(type: string): string {
    switch (type) {
      case 'critical': return '🚨';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📊';
    }
  }
}

// ========================================
// TELEGRAM INTEGRATION
// ========================================
class TelegramMonitoring {
  private botToken: string;
  private chatId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
    
    if (!this.botToken || !this.chatId) {
      console.warn('Telegram credentials not configured - Telegram monitoring disabled');
    }
  }

  async sendAlert(alert: MonitoringAlert): Promise<void> {
    if (!this.botToken || !this.chatId) return;

    try {
      const emoji = this.getAlertEmoji(alert.type);
      const message = this.formatTelegramMessage(alert, emoji);
      
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status}`);
      }
      
      console.log('✅ Telegram alert sent successfully');
    } catch (error) {
      console.error('❌ Failed to send Telegram alert:', error);
    }
  }

  async sendHealthReport(health: HealthStatus): Promise<void> {
    if (!this.botToken || !this.chatId) return;

    try {
      const statusEmoji = health.status === 'healthy' ? '✅' : 
                         health.status === 'degraded' ? '⚠️' : '❌';
      
      const message = `${statusEmoji} *TeleMed Sistema Health Report*

*Status:* ${health.status.toUpperCase()}
*Response Time:* ${health.performance.response_time_ms}ms
*Memory Used:* ${Math.round(health.performance.memory_usage.heapUsed / 1024 / 1024)}MB
*Timestamp:* ${new Date().toISOString()}

*Health Checks:*
${Object.entries(health.checks).map(([name, status]) => 
  `${status ? '✅' : '❌'} ${name}`
).join('\n')}

*Services:*
${Object.entries(health.services).map(([name, status]) => 
  `${status ? '✅' : '❌'} ${name}`
).join('\n')}`;

      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status}`);
      }
      
      console.log('✅ Telegram health report sent successfully');
    } catch (error) {
      console.error('❌ Failed to send Telegram health report:', error);
    }
  }

  private formatTelegramMessage(alert: MonitoringAlert, emoji: string): string {
    let message = `${emoji} *${alert.title}*\n\n${alert.message}\n\n`;
    message += `*Type:* ${alert.type.toUpperCase()}\n`;
    message += `*Time:* ${alert.timestamp}\n`;
    
    if (alert.metadata) {
      message += '\n*Details:*\n';
      Object.entries(alert.metadata).forEach(([key, value]) => {
        message += `${key}: ${value}\n`;
      });
    }
    
    return message;
  }

  private getAlertEmoji(type: string): string {
    switch (type) {
      case 'critical': return '🚨';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📊';
    }
  }
}

// ========================================
// UPTIME ROBOT INTEGRATION
// ========================================
class UptimeRobotIntegration {
  private apiKey: string;
  private baseUrl = 'https://api.uptimerobot.com/v2/';

  constructor() {
    this.apiKey = process.env.UPTIMEROBOT_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('UPTIMEROBOT_API_KEY not configured - UptimeRobot integration disabled');
    }
  }

  async createMonitor(url: string, name: string): Promise<string | null> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(`${this.baseUrl}newMonitor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          api_key: this.apiKey,
          format: 'json',
          type: '1', // HTTP(s)
          url: url,
          friendly_name: name,
          interval: '300', // 5 minutes
        }),
      });

      const data = await response.json();
      
      if (data.stat === 'ok') {
        console.log(`✅ UptimeRobot monitor created: ${name}`);
        return data.monitor.id;
      } else {
        console.error('❌ Failed to create UptimeRobot monitor:', data.error);
        return null;
      }
    } catch (error) {
      console.error('❌ UptimeRobot API error:', error);
      return null;
    }
  }

  async getMonitorStatus(monitorId: string): Promise<any> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(`${this.baseUrl}getMonitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          api_key: this.apiKey,
          format: 'json',
          monitors: monitorId,
        }),
      });

      const data = await response.json();
      return data.stat === 'ok' ? data.monitors[0] : null;
    } catch (error) {
      console.error('❌ UptimeRobot API error:', error);
      return null;
    }
  }
}

// ========================================
// STATUS CAKE INTEGRATION
// ========================================
class StatusCakeIntegration {
  private apiKey: string;
  private baseUrl = 'https://api.statuscake.com/v1/';

  constructor() {
    this.apiKey = process.env.STATUSCAKE_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('STATUSCAKE_API_KEY not configured - StatusCake integration disabled');
    }
  }

  async createMonitor(url: string, name: string): Promise<string | null> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(`${this.baseUrl}uptime`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          website_url: url,
          check_rate: 300, // 5 minutes
          test_type: 'HTTP',
          contact_groups: [],
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ StatusCake monitor created: ${name}`);
        return data.data.new_id;
      } else {
        console.error('❌ Failed to create StatusCake monitor:', data);
        return null;
      }
    } catch (error) {
      console.error('❌ StatusCake API error:', error);
      return null;
    }
  }

  async getMonitorStatus(monitorId: string): Promise<any> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(`${this.baseUrl}uptime/${monitorId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      const data = await response.json();
      return response.ok ? data.data : null;
    } catch (error) {
      console.error('❌ StatusCake API error:', error);
      return null;
    }
  }
}

// ========================================
// MONITORING SERVICE MANAGER
// ========================================
export class MonitoringService {
  private slack: SlackMonitoring;
  private telegram: TelegramMonitoring;
  private uptimeRobot: UptimeRobotIntegration;
  private statusCake: StatusCakeIntegration;

  constructor() {
    this.slack = new SlackMonitoring();
    this.telegram = new TelegramMonitoring();
    this.uptimeRobot = new UptimeRobotIntegration();
    this.statusCake = new StatusCakeIntegration();
  }

  async sendAlert(alert: MonitoringAlert): Promise<void> {
    const promises = [
      this.slack.sendAlert(alert),
      this.telegram.sendAlert(alert),
    ];

    await Promise.allSettled(promises);
  }

  async sendHealthReport(health: HealthStatus): Promise<void> {
    const promises = [
      this.slack.sendHealthReport(health),
      this.telegram.sendHealthReport(health),
    ];

    await Promise.allSettled(promises);
  }

  async setupExternalMonitoring(baseUrl: string): Promise<void> {
    console.log('🔧 Setting up external monitoring...');

    const monitors = [
      { url: `${baseUrl}/health`, name: 'TeleMed Health Check' },
      { url: `${baseUrl}/api/status`, name: 'TeleMed API Status' },
      { url: baseUrl, name: 'TeleMed Main Site' },
    ];

    for (const monitor of monitors) {
      await Promise.allSettled([
        this.uptimeRobot.createMonitor(monitor.url, monitor.name),
        this.statusCake.createMonitor(monitor.url, monitor.name),
      ]);
    }

    console.log('✅ External monitoring setup complete');
  }

  async checkExternalMonitors(): Promise<any[]> {
    // This would check the status of external monitors
    // Implementation depends on stored monitor IDs
    return [];
  }
}

// Singleton instance
export const monitoringService = new MonitoringService();