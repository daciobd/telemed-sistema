import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '8.0.0-PROD',
    environment: 'production'
  });
});

// Serve static files (if they exist)
try {
  app.use(express.static(join(__dirname, '../dist')));
} catch (e) {
  console.log('Pasta dist não encontrada, usando modo SPA');
}

// Main route - serves login page or redirects authenticated users
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
        .login-btn {
          background: #4299e1;
          color: white;
          padding: 15px 30px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          margin: 20px 0;
          font-size: 1.1em;
          transition: background 0.3s;
        }
        .login-btn:hover { background: #3182ce; }
        .instructions {
          background: #f0fff4;
          padding: 25px;
          border-radius: 10px;
          margin: 25px 0;
          text-align: left;
          border: 1px solid #68d391;
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
        .redirect-info {
          background: #bee3f8;
          border: 1px solid #90cdf4;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🩺 TeleMed Sistema</h1>
        <p>Plataforma Completa de Telemedicina</p>
        
        <div class="redirect-info">
          <h3>🚀 Acesso à Plataforma Completa</h3>
          <p>Após fazer login, você será redirecionado automaticamente para a versão completa da plataforma em modo desenvolvimento.</p>
          <br>
          <strong>URL de redirecionamento:</strong><br>
          <code>https://telemed-consultation-daciobd--5000.prod1a.replit.co/</code>
        </div>
        
        <div class="instructions">
          <h3>🔑 Para Acessar:</h3>
          <p>1. Clique no botão "Acesso Direto" abaixo</p>
          <p>2. Use sua conta Replit (criar conta é gratuito)</p>
          <p>3. Será redirecionado para a plataforma completa</p>
        </div>
        
        <a href="https://telemed-consultation-daciobd--5000.prod1a.replit.co/" class="login-btn">🔗 Acesso Direto à Plataforma</a>
        
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
        
        <div style="margin-top: 30px; font-size: 14px; color: #666;">
          Não possui conta Replit? <a href="https://replit.com" target="_blank" style="color: #4299e1;">Crie uma conta gratuita</a>
        </div>
        
        <div style="margin-top: 20px; font-size: 12px; color: #999;">
          TeleMed Sistema v8.0.0-PROD | Deployment Ativo
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🩺 TeleMed Sistema v8.0.0-PROD');
  console.log(`🌐 Servidor PRODUÇÃO rodando na porta ${PORT}`);
  console.log('🔗 URL Pública: https://telemed-consultation-daciobd.replit.app');
  console.log('✅ Página de redirecionamento ativa');
});