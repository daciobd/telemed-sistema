import axios from 'axios';

interface WebhookAlert {
  type: 'quota_exceeded' | 'billing_limit' | 'rate_limit' | 'api_error' | 'fallback_activated';
  message: string;
  details: any;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class WebhookManager {
  private static instance: WebhookManager;
  private webhookUrl: string | undefined;

  private constructor() {
    this.webhookUrl = process.env.ALERT_WEBHOOK_URL;
  }

  public static getInstance(): WebhookManager {
    if (!WebhookManager.instance) {
      WebhookManager.instance = new WebhookManager();
    }
    return WebhookManager.instance;
  }

  private async sendWebhook(alert: WebhookAlert): Promise<void> {
    if (!this.webhookUrl) {
      console.log('🔔 Webhook não configurado, pulando alerta:', alert.type);
      return;
    }

    try {
      const payload = {
        text: `🚨 TeleMed AI Alert: ${alert.message}`,
        attachments: [
          {
            color: this.getSeverityColor(alert.severity),
            fields: [
              {
                title: 'Tipo',
                value: alert.type,
                short: true
              },
              {
                title: 'Severidade',
                value: alert.severity.toUpperCase(),
                short: true
              },
              {
                title: 'Timestamp',
                value: alert.timestamp,
                short: false
              },
              {
                title: 'Detalhes',
                value: JSON.stringify(alert.details, null, 2),
                short: false
              }
            ]
          }
        ]
      };

      await axios.post(this.webhookUrl, payload, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Webhook enviado com sucesso:', alert.type);
    } catch (error) {
      console.error('❌ Erro ao enviar webhook:', error);
    }
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff6600';
      case 'medium': return '#ffcc00';
      case 'low': return '#00ff00';
      default: return '#cccccc';
    }
  }

  async alertQuotaExceeded(details: any): Promise<void> {
    await this.sendWebhook({
      type: 'quota_exceeded',
      message: 'Quota da OpenAI excedida',
      details,
      timestamp: new Date().toISOString(),
      severity: 'critical'
    });
  }

  async alertBillingLimit(details: any): Promise<void> {
    await this.sendWebhook({
      type: 'billing_limit',
      message: 'Limite de cobrança atingido',
      details,
      timestamp: new Date().toISOString(),
      severity: 'critical'
    });
  }

  async alertRateLimit(details: any): Promise<void> {
    await this.sendWebhook({
      type: 'rate_limit',
      message: 'Rate limit excedido',
      details,
      timestamp: new Date().toISOString(),
      severity: 'high'
    });
  }

  async alertFallbackActivated(details: any): Promise<void> {
    await this.sendWebhook({
      type: 'fallback_activated',
      message: 'Modelo fallback ativado',
      details,
      timestamp: new Date().toISOString(),
      severity: 'medium'
    });
  }

  async alertAPIError(details: any): Promise<void> {
    await this.sendWebhook({
      type: 'api_error',
      message: 'Erro na API OpenAI',
      details,
      timestamp: new Date().toISOString(),
      severity: 'high'
    });
  }
}

export const webhookManager = WebhookManager.getInstance();