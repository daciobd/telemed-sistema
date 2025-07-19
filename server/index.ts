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

// Serve static HTML files from public directory first
app.use(express.static(path.join(__dirname, '../public'), { index: false }));

// Security headers
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
});

// HTML Landing Pages - HIGHEST PRIORITY
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../public/index.html');
  console.log('📄 Serving integrated landing page for:', req.path);
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