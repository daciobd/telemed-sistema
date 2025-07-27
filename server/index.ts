import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './routes';
import { setupVite, serveStatic } from './vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 5000;
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from root and public directory
app.use(express.static(path.join(__dirname, '..'), { index: false }));
app.use(express.static(path.join(__dirname, '../public'), { index: false }));

// Security headers
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  
  // Only apply security headers to non-Vite resources
  if (!req.url.startsWith('/@vite/') && !req.url.startsWith('/src/') && !req.url.includes('?v=')) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
  }
  
  next();
});

// HTML Landing Pages - HIGHEST PRIORITY
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../index.html');
  console.log('📄 Serving NEW simple landing page for:', req.path);
  res.sendFile(indexPath);
});

app.get('/dr-ai.html', (req, res) => {
  const drAiPath = path.join(__dirname, '../public/dr-ai.html');
  console.log('📄 Serving Dr. AI page for:', req.path);
  res.sendFile(drAiPath);
});

app.get('/consulta-por-valor.html', (req, res) => {
  const bidPath = path.join(__dirname, '../public/consulta-por-valor.html');
  console.log('📄 Serving bidding system for:', req.path);
  res.sendFile(bidPath);
});

app.get('/medical-dashboard-pro.html', (req, res) => {
  const dashboardPath = path.join(__dirname, '../public/medical-dashboard-pro.html');
  console.log('📄 Serving medical dashboard for:', req.path);
  res.sendFile(dashboardPath);
});

app.get('/agenda-do-dia.html', (req, res) => {
  const agendaPath = path.join(__dirname, '../public/agenda-do-dia.html');
  console.log('📄 Serving agenda do dia for:', req.path);
  res.sendFile(agendaPath);
});

// SOLUÇÃO RÁPIDA - Sistema de Lances HTML Estático
app.get('/patient-bidding', (req, res) => {
  console.log('📄 Serving sistema de lances (HTML estático) for:', req.path);
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Sistema de Lances TeleMed</title>
        <style>
            body { font-family: 'Poppins', Arial; padding: 20px; background: #FAFBFC; }
            .container { max-width: 1000px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; }
            .header { background: linear-gradient(135deg, #A7C7E7, #92B4D7); color: white; padding: 20px; border-radius: 20px; margin-bottom: 20px; }
            .card { background: #F8F9FA; border-radius: 15px; padding: 20px; margin: 15px 0; border-left: 5px solid #A7C7E7; }
            .urgente { border-left-color: #E9967A; }
            .btn { background: #A7C7E7; color: white; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; margin: 5px; }
            .btn:hover { opacity: 0.8; }
            .valor { font-size: 20px; font-weight: bold; color: #2D5A87; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏥 Sistema de Lances TeleMed</h1>
                <p>Faça seu lance e receba propostas dos melhores médicos</p>
            </div>
            
            <div class="card urgente">
                <h3>❤️ Cardiologia - Urgente</h3>
                <div class="valor">Lance Atual: R$ 180</div>
                <p>Tempo Restante: 12:26 | Médicos Interessados: 5</p>
                <p>Paciente: Maria Silva</p>
                <button class="btn" onclick="window.location.href='/aguardando-medico.html'">🩺 ATENDER AGORA - R$ 230</button>
                <button class="btn" onclick="alert('Lance enviado!')">💰 Fazer Lance</button>
            </div>
            
            <div class="card">
                <h3>👶 Pediatria - Regular</h3>
                <div class="valor">Lance Atual: R$ 150</div>
                <p>Tempo Restante: 25:11 | Médicos Interessados: 3</p>
                <p>Paciente: Ana Costa</p>
                <button class="btn" onclick="window.location.href='/aguardando-medico.html'">🩺 ATENDER AGORA - R$ 200</button>
                <button class="btn" onclick="alert('Lance enviado!')">💰 Fazer Lance</button>
            </div>
            
            <div class="card">
                <h3>🔬 Dermatologia - Alta</h3>
                <div class="valor">Lance Atual: R$ 120</div>
                <p>Tempo Restante: 34:43 | Médicos Interessados: 2</p>
                <p>Paciente: João Santos</p>
                <button class="btn" onclick="window.location.href='/aguardando-medico.html'">🩺 ATENDER AGORA - R$ 170</button>
                <button class="btn" onclick="alert('Lance enviado!')">💰 Fazer Lance</button>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '8.3.0-CLEAN'
  });
});

// Initialize server
async function startServer() {
  try {
    const httpServer = await registerRoutes(app);
    
    const nodeEnv = process.env.NODE_ENV || 'development';
    console.log('🔧 NODE_ENV:', nodeEnv);
    
    if (nodeEnv === 'development') {
      console.log('🔧 Setting up Vite for development...');
      await setupVite(app, httpServer);
      console.log('✅ Vite setup complete');
    } else {
      console.log('🔧 Setting up static file serving for production...');
      serveStatic(app);
    }

    // SPA fallback - ONLY for non-API routes and non-HTML routes
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.endsWith('.html')) {
        return next(); // Let API routes and HTML files pass through
      }
      
      // Serve React app index.html for all other routes
      const indexPath = path.join(__dirname, '../client/index.html');
      console.log('📄 Serving React SPA for:', req.path);
      res.sendFile(indexPath);
    });
    
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`[${new Date().toISOString()}] 🩺 TeleMed Sistema v8.3.0-CLEAN`);
      console.log(`[${new Date().toISOString()}] 🌐 Servidor rodando na porta ${PORT}`);
      console.log(`[${new Date().toISOString()}] 🔗 Acesso: http://localhost:${PORT}`);
      console.log(`[${new Date().toISOString()}] ✅ React + Backend integrados`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();