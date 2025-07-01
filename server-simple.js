import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '8.1.0-SIMPLE',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Main route
app.get('*', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TeleMed - Sistema de Telemedicina</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          max-width: 600px;
          text-align: center;
        }
        h1 { color: #2d3748; margin-bottom: 20px; font-size: 2.5em; }
        p { color: #666; margin-bottom: 30px; font-size: 1.1em; }
        .status-info {
          background: #f0fff4;
          border: 1px solid #68d391;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .url-info {
          background: #bee3f8;
          border: 1px solid #90cdf4;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .feature {
          background: #edf2f7;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          text-align: left;
        }
        .feature h4 { color: #2d3748; margin-bottom: 5px; }
        .feature p { color: #4a5568; margin: 0; font-size: 0.9em; }
        code {
          background: #f7fafc;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
          color: #2d3748;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🩺 TeleMed Sistema</h1>
        <p>Plataforma Completa de Telemedicina</p>
        
        <div class="status-info">
          <h3>✅ Servidor Funcionando</h3>
          <p><strong>Porta:</strong> ${PORT}</p>
          <p><strong>Status:</strong> Ativo e Responsivo</p>
          <p><strong>Health Check:</strong> <code>/health</code></p>
        </div>
        
        <div class="url-info">
          <h3>🔗 URLs de Acesso</h3>
          <p><strong>URL Principal:</strong></p>
          <code>https://telemed-consultation-daciobd--3000.prod1a.replit.co/</code>
          <br><br>
          <p><strong>URL Alternativa:</strong></p>
          <code>https://telemed-consultation-daciobd.replit.app/</code>
        </div>
        
        <div class="feature">
          <h4>🎥 Videoconsultas</h4>
          <p>Sistema WebRTC com chat em tempo real</p>
        </div>
        
        <div class="feature">
          <h4>💊 Prescrições MEMED</h4>
          <p>Prescrições digitais integradas</p>
        </div>
        
        <div class="feature">
          <h4>🤖 Assistente IA</h4>
          <p>Análise de sintomas e sugestões</p>
        </div>
        
        <div class="feature">
          <h4>💳 Pagamentos Stripe</h4>
          <p>Sistema de pagamentos seguro</p>
        </div>
        
        <div style="margin-top: 30px; font-size: 12px; color: #999;">
          TeleMed Sistema v8.1.0-SIMPLE | Porta ${PORT} | ${new Date().toLocaleString('pt-BR')}
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🩺 TeleMed Sistema v8.1.0-SIMPLE');
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Acesso local: http://localhost:${PORT}`);
  console.log(`🔗 Acesso externo: https://telemed-consultation-daciobd--${PORT}.prod1a.replit.co/`);
  console.log('✅ Servidor simples ativo e responsivo');
});