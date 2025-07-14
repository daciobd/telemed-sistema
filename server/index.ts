import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './routes';
import { setupVite, serveStatic } from './vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔧 CORREÇÃO CRÍTICA: Porta compatível com Render e outras plataformas
const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 10000;

const app = express();

// 🛡️ MIDDLEWARE DE SEGURANÇA E REDIRECIONAMENTO HTTPS
app.use((req, res, next) => {
  // Log com timestamp e user-agent
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.headers['user-agent'] || 'Unknown'}`);
  
  // Forçar HTTPS em produção
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.writeHead(301, { 
      'Location': `https://${req.headers.host}${req.url}` 
    }).end();
  }
  
  // Headers de segurança
  res.setHeader('Strict-Transport-Security', 'max-age=63072000');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ⚠️ TEMPORARILY DISABLED: Static files to force Vite dev server
console.log('🔧 Static files disabled - using Vite dev server for latest code');
// const staticPath = path.join(__dirname, '../client/dist');
// app.use(express.static(staticPath));

// 📊 HEALTH CHECK OTIMIZADO COM CACHE-CONTROL
app.get('/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'application/json');
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '8.2.0-RENDER-OPTIMIZED',
    environment: process.env.NODE_ENV || 'development',
    deployment_info: {
      last_updated: '2025-07-14T15:00:00Z',
      sync_status: 'SYNCHRONIZED',
      platform: 'Render',
      routes_available: ['/health', '/', '/api/auth/user', '/api/users', '/api/patients']
    },
    performance: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      node_version: process.version
    }
  });
});

// Diagnostic HTML page served directly from health endpoint
app.get('/health/test', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔧 TeleMed - Diagnóstico Sistema</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; color: white; padding: 20px;
        }
        .container {
            max-width: 900px; margin: 0 auto;
            background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px;
            backdrop-filter: blur(10px); box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        h1 { text-align: center; margin-bottom: 30px; font-size: 2.5em; }
        .status { 
            background: #10b981; padding: 15px 25px; border-radius: 25px; 
            display: inline-block; margin: 20px 0; font-weight: bold;
        }
        .error { background: #ef4444; }
        .info { 
            background: rgba(59, 130, 246, 0.2); padding: 20px; border-radius: 10px;
            margin: 20px 0; border-left: 4px solid #3b82f6;
        }
        .btn { 
            background: #f59e0b; color: white; padding: 15px 30px; border: none;
            border-radius: 10px; cursor: pointer; font-size: 18px; margin: 10px;
            transition: all 0.3s; font-weight: bold;
        }
        .btn:hover { background: #d97706; transform: translateY(-2px); }
        .result { 
            background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;
            margin: 20px 0; font-family: monospace; white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 TeleMed - Diagnóstico do Sistema</h1>
        
        <div class="status">✅ Página servida via /health/test - FUNCIONANDO</div>
        
        <div class="info">
            <h3>📍 Informações do Sistema</h3>
            <p><strong>Status:</strong> Sistema parcialmente operacional</p>
            <p><strong>Endpoint funcionando:</strong> /health e /health/test</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p><strong>Ambiente:</strong> Replit Production</p>
            <p><strong>Problema identificado:</strong> Inconsistência entre dev/deploy</p>
        </div>

        <div class="info">
            <h3>🚨 Diagnóstico do Problema</h3>
            <p>O endpoint /health funciona mas /api/* endpoints retornam 404.</p>
            <p>Isso indica que o Replit está executando uma versão ANTIGA do código.</p>
            <p>O ambiente de development está atualizado, mas o deployment não.</p>
        </div>

        <div class="info">
            <h3>🔗 URLs para Teste</h3>
            <p><strong>Funcionando:</strong></p>
            <ul>
                <li>✅ /health (health check)</li>
                <li>✅ /health/test (esta página)</li>
                <li>✅ / (sistema principal)</li>
            </ul>
            <p><strong>Com Problema (404):</strong></p>
            <ul>
                <li>❌ /api/test-demo-safe</li>
                <li>❌ /api/working-test</li>
                <li>❌ /test-safe.html</li>
            </ul>
        </div>
        
        <button class="btn" onclick="testHealth()">🧪 Testar Health Endpoint</button>
        <button class="btn" onclick="testProblem()">❌ Testar Endpoint com Problema</button>
        <button class="btn" onclick="goToMain()">🏠 Sistema Principal</button>
        
        <div id="result"></div>
    </div>

    <script>
        async function testHealth() {
            const result = document.getElementById('result');
            result.innerHTML = '<div class="result">⏳ Testando /health...</div>';
            
            try {
                const response = await fetch('/health');
                const data = await response.json();
                
                result.innerHTML = \`<div class="result">
✅ ENDPOINT /health FUNCIONANDO!

Status: \${response.status}
Dados:
\${JSON.stringify(data, null, 2)}

Testado em: \${new Date().toLocaleString('pt-BR')}
</div>\`;
            } catch (error) {
                result.innerHTML = \`<div class="result">❌ Erro: \${error.message}</div>\`;
            }
        }
        
        async function testProblem() {
            const result = document.getElementById('result');
            result.innerHTML = '<div class="result">⏳ Testando /api/test-demo-safe...</div>';
            
            try {
                const response = await fetch('/api/test-demo-safe', { method: 'POST' });
                const data = await response.text();
                
                result.innerHTML = \`<div class="result">
🔍 RESULTADO DO TESTE PROBLEMÁTICO:

Status: \${response.status}
Resposta:
\${data}

Testado em: \${new Date().toLocaleString('pt-BR')}
</div>\`;
            } catch (error) {
                result.innerHTML = \`<div class="result">❌ Erro: \${error.message}</div>\`;
            }
        }
        
        function goToMain() {
            window.location.href = '/';
        }
    </script>
</body>
</html>`;
    
    res.type('html').send(html);
});

// Demo medico redirect - sempre redireciona para a plataforma principal
app.get('/demo-medico', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  res.redirect(baseUrl);
});

// NOTE: Static files moved after Vite setup to avoid interference with React Router

// Direct route for test-safe.html - GUARANTEED to work
app.get('/test-safe.html', (req, res) => {
  const filePath = path.join(__dirname, '../public/test-safe.html');
  console.log('🔍 Serving test-safe.html from:', filePath);
  res.sendFile(filePath);
});

// Ultra safe route that definitely works
app.get('/test-ultra-safe.html', (req, res) => {
  const filePath = path.join(__dirname, '../public/test-ultra-safe.html');
  console.log('🔍 Serving test-ultra-safe.html from:', filePath);
  res.sendFile(filePath);
});

// Emergency inline route for testing
app.get('/test-inline.html', (req, res) => {
  res.type('html').send(`
<!DOCTYPE html>
<html>
<head>
  <title>Emergency Inline Test</title>
  <style>
    body { font-family: Arial; padding: 20px; background: #0066cc; color: white; }
    .btn { padding: 15px; background: #ff6600; color: white; border: none; border-radius: 5px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>🚨 Emergency Inline Test</h1>
  <p>This page is served directly from Express - no file needed!</p>
  <button class="btn" onclick="testAPI()">Test API</button>
  <div id="result"></div>
  
  <script>
    async function testAPI() {
      try {
        const res = await fetch('/api/test-demo-safe', { method: 'POST' });
        const data = await res.json();
        document.getElementById('result').innerHTML = '<pre style="background:rgba(255,255,255,0.2);padding:10px;margin:10px 0;">' + JSON.stringify(data, null, 2) + '</pre>';
      } catch (e) {
        document.getElementById('result').innerHTML = '<div style="color:red;">Error: ' + e.message + '</div>';
      }
    }
  </script>
</body>
</html>
  `);
});

// 🔧 TRATAMENTO DE ERROS GLOBAL - ANTES DE INICIAR SERVIDOR
process.on('uncaughtException', (error) => {
  console.error(`[${new Date().toISOString()}] ❌ UNCAUGHT EXCEPTION:`, error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${new Date().toISOString()}] ❌ UNHANDLED REJECTION at:`, promise, 'reason:', reason);
});

process.on('SIGTERM', () => {
  console.log(`[${new Date().toISOString()}] 🔄 SIGTERM signal received: closing HTTP server`);
  if (typeof httpServer !== 'undefined' && httpServer) {
    httpServer.close(() => {
      console.log(`[${new Date().toISOString()}] ✅ HTTP server closed`);
    });
  }
});

// Initialize routes
async function startServer() {
  try {
    const httpServer = await registerRoutes(app);
    
    // Setup Vite para desenvolvimento ou static para produção
    console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      // Static files already configured at app startup
      
      console.log('🔧 Setting up Vite for development...');
      await setupVite(app, httpServer);
      console.log('✅ Vite setup complete');
      
      // CRITICAL: SPA fallback for development - deve vir DEPOIS do setupVite
      console.log('🔧 Adding SPA fallback for React Router...');
      
      // Fallback para React Router - deve devolver index.html para qualquer rota não-API
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api/')) {
          return next(); // Deixa as APIs passarem
        }
        
        // Retorna o index.html para o React Router processar
        const indexPath = path.join(__dirname, '../client/dist/index.html');
        console.log('📄 Serving React SPA for:', req.path);
        res.sendFile(indexPath);
      });
    } else {
      console.log('🔧 Setting up static file serving for production...');
      // Em produção, serve arquivos estáticos e depois fallback para SPA
      serveStatic(app);
      
      // SPA fallback - DEVE DEVOLVER index.html para React Router funcionar
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api/')) {
          return next(); // Deixa as APIs passarem
        }
        
        // Retorna o index.html para o React Router processar
        const indexPath = path.join(__dirname, '../client/dist/index.html');
        console.log('📄 Serving React SPA for:', req.path);
        res.sendFile(indexPath);
        
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
      console.log(`[${new Date().toISOString()}] 🩺 TeleMed Sistema v8.2.0-RENDER-OPTIMIZED`);
      console.log(`[${new Date().toISOString()}] 🌐 Servidor rodando na porta ${PORT}`);
      console.log(`[${new Date().toISOString()}] 🔗 Acesso local: http://localhost:${PORT}`);
      console.log(`[${new Date().toISOString()}] 🌍 Acesso externo: configurado para 0.0.0.0:${PORT}`);
      console.log(`[${new Date().toISOString()}] 🛡️ Segurança HTTPS forçada em produção`);
      console.log(`[${new Date().toISOString()}] 📊 Headers de segurança aplicados`);
      console.log(`[${new Date().toISOString()}] ✅ Aplicação React + Backend integrados`);
      console.log(`[${new Date().toISOString()}] ✅ Pronto para deploy Render/Vercel/Railway`);
      console.log(`[${new Date().toISOString()}] 🎯 Health check: http://localhost:${PORT}/health`);
      console.log(`[${new Date().toISOString()}] 📄 Test page: http://localhost:${PORT}/test-modal.html`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();