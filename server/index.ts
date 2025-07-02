import express from 'express';
import { registerRoutes } from './routes';
import { setupVite, serveStatic } from './vite';

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
    version: '8.0.0-CLEAN',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Demo medico redirect - sempre redireciona para a plataforma principal
app.get('/demo-medico', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  res.redirect(baseUrl);
});

// Initialize routes
async function startServer() {
  try {
    const httpServer = await registerRoutes(app);
    
    // Setup Vite para desenvolvimento ou static para produção
    if (process.env.NODE_ENV === 'development') {
      await setupVite(app, httpServer);
    } else {
      // Landing page HTML para produção
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api/')) {
          return next();
        }
        
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
              .feature {
                background: #edf2f7;
                padding: 15px;
                border-radius: 8px;
                margin: 10px 0;
                text-align: left;
              }
              .feature h4 { color: #2d3748; margin-bottom: 5px; }
              .feature p { color: #4a5568; margin: 0; font-size: 0.9em; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🩺 TeleMed Sistema</h1>
              <p>Plataforma Completa de Telemedicina</p>
              
              <a href="/api/login" class="login-btn">🔑 Fazer Login</a>
              
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
            </div>
          </body>
          </html>
        `;
        res.send(html);
      });
    }
    
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log('🩺 TeleMed Sistema v8.0.0-CLEAN');
      console.log(`🌐 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 Acesso: http://localhost:${PORT}`);
      console.log('✅ Aplicação React + Backend integrados');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
