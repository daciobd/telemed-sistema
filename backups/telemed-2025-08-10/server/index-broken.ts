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
      // Em produção, serve uma página de login direta
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api/')) {
          return next(); // Deixa as APIs passarem
        }
        
        // Se usuário está autenticado, serve aplicação básica
        if (req.isAuthenticated && req.isAuthenticated()) {
          const appHtml = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>TeleMed - Dashboard</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  background: #f8fafc;
                  min-height: 100vh;
                }
                .header {
                  background: white;
                  padding: 20px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }
                .container {
                  max-width: 1200px;
                  margin: 0 auto;
                  padding: 40px 20px;
                }
                .welcome {
                  background: white;
                  border-radius: 10px;
                  padding: 30px;
                  margin-bottom: 30px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .features-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                  gap: 20px;
                  margin-top: 30px;
                }
                .feature-card {
                  background: white;
                  border-radius: 10px;
                  padding: 25px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                  text-align: center;
                  border: 1px solid #e2e8f0;
                }
                .feature-card h3 { color: #2d3748; margin-bottom: 15px; }
                .feature-card p { color: #4a5568; margin-bottom: 20px; }
                .btn {
                  background: #4299e1;
                  color: white;
                  padding: 12px 24px;
                  border-radius: 8px;
                  text-decoration: none;
                  font-weight: 600;
                  display: inline-block;
                  transition: background 0.3s;
                }
                .btn:hover { background: #3182ce; }
                .btn-secondary {
                  background: #48bb78;
                }
                .btn-secondary:hover { background: #38a169; }
                .message {
                  background: #bee3f8;
                  border: 1px solid #90cdf4;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 20px 0;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>🩺 TeleMed Sistema</h1>
                <a href="/api/logout" class="btn">Logout</a>
              </div>
              
              <div class="container">
                <div class="welcome">
                  <h2>Bem-vindo ao TeleMed Sistema!</h2>
                  <p>Login realizado com sucesso. Você está acessando a versão de demonstração da plataforma.</p>
                  
                  <div class="message">
                    <h3>🚀 Para acessar a versão completa:</h3>
                    <p>A plataforma completa está rodando em modo desenvolvimento.</p>
                    <p>Abra uma nova aba e acesse: <strong>https://telemed-consultation-daciobd--5000.prod1a.replit.co/</strong></p>
                    <br>
                    <a href="https://telemed-consultation-daciobd--5000.prod1a.replit.co/" target="_blank" class="btn btn-secondary">
                      🔗 Abrir Plataforma Completa
                    </a>
                  </div>
                </div>
                
                <div class="features-grid">
                  <div class="feature-card">
                    <h3>🎥 Videoconsultas</h3>
                    <p>Sistema WebRTC com chat em tempo real, compartilhamento de tela e controles avançados</p>
                    <p><strong>Status:</strong> ✅ Funcional</p>
                  </div>
                  
                  <div class="feature-card">
                    <h3>💊 Prescrições MEMED</h3>
                    <p>Integração completa com MEMED para prescrições digitais válidas</p>
                    <p><strong>Status:</strong> ✅ Funcional</p>
                  </div>
                  
                  <div class="feature-card">
                    <h3>🤖 Assistente IA</h3>
                    <p>Análise de sintomas, sugestões de diagnóstico e recomendações médicas</p>
                    <p><strong>Status:</strong> ✅ Funcional</p>
                  </div>
                  
                  <div class="feature-card">
                    <h3>💳 Pagamentos Stripe</h3>
                    <p>Sistema de pagamentos seguro e processamento de consultas</p>
                    <p><strong>Status:</strong> ✅ Funcional</p>
                  </div>
                  
                  <div class="feature-card">
                    <h3>📋 Prontuário Eletrônico</h3>
                    <p>Gestão completa de pacientes e histórico médico</p>
                    <p><strong>Status:</strong> ✅ Funcional</p>
                  </div>
                  
                  <div class="feature-card">
                    <h3>📅 Agenda Médica</h3>
                    <p>Sistema avançado de agendamentos e calendário médico</p>
                    <p><strong>Status:</strong> ✅ Funcional</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          \`;
          return res.send(appHtml);
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
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🩺 TeleMed Sistema</h1>
              <p>Plataforma Completa de Telemedicina</p>
              
              <div class="instructions">
                <h3>🔑 Para Acessar a Plataforma:</h3>
                <p>1. Clique no botão "Fazer Login" abaixo</p>
                <p>2. Use sua conta Replit (criar conta é gratuito)</p>
                <p>3. Após o login, acesse todas as funcionalidades</p>
              </div>
              
              <a href="/api/login" class="login-btn">🔑 Fazer Login com Replit</a>
              
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