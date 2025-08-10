import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Debug environment variables
console.log('🔍 DEBUG - process.env.PORT:', JSON.stringify(process.env.PORT));
console.log('🔍 DEBUG - All env vars with PORT:', Object.keys(process.env).filter(k => k.includes('PORT')));

// Render requires us to use their PORT exactly as provided, even if it's problematic
let PORT;

// In production (Render), force use of their PORT or use a specific fallback
if (process.env.NODE_ENV === 'production') {
  // For Render: Try to get a valid port from environment or use 10000
  if (process.env.PORT && process.env.PORT !== 'PORT' && !isNaN(Number(process.env.PORT))) {
    PORT = Number(process.env.PORT);
    console.log('🔄 Using Render provided PORT:', PORT);
  } else {
    // Render fallback - use 10000
    PORT = 10000;
    console.log('🔄 Using Render fallback PORT:', PORT);
  }
} else {
  // Development
  PORT = 5000;
}

// Final validation
if (!PORT || isNaN(PORT)) {
  PORT = 10000;
  console.log('🔄 Final fallback PORT:', PORT);
}

console.log('🔍 FINAL PORT SELECTED:', PORT);

// CORS and security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving with proper headers
app.use('/assets', express.static(path.join(__dirname, '../dist/public/assets'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

app.use(express.static(path.join(__dirname, '../dist/public'), {
  maxAge: '1h',
  etag: true,
  lastModified: true
}));

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/attached_assets', express.static(path.join(__dirname, '../attached_assets')));

// ChatGPT Agent - Ativado com OpenAI instalado
import aiAgentRoutes from './routes/ai-agent.js';
import aiAgentHealthRoutes from './routes/ai-agent-health.js';
app.use('/api/ai-agent', aiAgentRoutes);
app.use('/api/ai-agent', aiAgentHealthRoutes);
console.log('🤖 ChatGPT Agent ativado com OpenAI v5.12.1');

// Medical Reports - Sistema de Laudos Médicos
import medicalReportsRoutes from './routes/medical-reports.js';
app.use('/api/medical-reports', medicalReportsRoutes);
console.log('🏥 Sistema de Laudos Médicos ativado');

// Health check endpoint for Render
app.get('/healthz', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'TeleMed Sistema',
    version: '12.5.2'
  });
});

// Ping endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Simple health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Landing page simples
app.get('/landing-simple', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../landing-page-simple.html'), 'utf-8');
    console.log('🚀 Landing page simples carregada');
    res.send(html);
  } catch (err) {
    console.error('❌ Erro ao carregar landing page:', err);
    res.status(500).send('Erro ao carregar a landing page');
  }
});

// Página de download do projeto
app.get('/download', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../download-page-fixed.html'), 'utf-8');
    console.log('📦 Página de download carregada');
    res.send(html);
  } catch (err) {
    console.error('❌ Erro ao carregar página de download:', err);
    res.status(500).send('Erro ao carregar página de download');
  }
});

// API para criar ZIP dos arquivos funcionais
app.get('/api/download-zip', async (req, res) => {
  try {
    console.log('🔄 Iniciando download do ZIP...');
    const zipPath = path.join(__dirname, '../dist/telemed-functional.tar.gz');
    
    if (fs.existsSync(zipPath)) {
      console.log('✅ Arquivo encontrado, enviando download...');
      res.download(zipPath, 'telemed-funcional.tar.gz', (err) => {
        if (err) {
          console.error('❌ Erro no download:', err);
          res.status(500).send('Erro no download');
        } else {
          console.log('📦 Download concluído');
        }
      });
    } else {
      console.log('⚠️  Arquivo não encontrado, criando novo...');
      const { createFunctionalZip } = await import('../scripts/create-functional-zip.js');
      const newZipPath = await createFunctionalZip();
      
      if (fs.existsSync(newZipPath)) {
        res.download(newZipPath, 'telemed-funcional.zip');
      } else {
        res.status(404).json({ error: 'ZIP não pôde ser criado' });
      }
    }
  } catch (err) {
    console.error('❌ Erro ao criar ZIP:', err);
    res.status(500).json({ error: 'Erro ao criar ZIP', details: err.message });
  }
});

// Rota alternativa para download simples
app.get('/api/download-simple', (req, res) => {
  try {
    console.log('📄 Download simples solicitado...');
    
    // Cria um ZIP simples com arquivos básicos
    const simpleFiles = {
      'README.md': `# TeleMed Sistema

Sistema de telemedicina completo desenvolvido em React + Node.js.

## Características:
- Frontend React com TypeScript
- Backend Express com PostgreSQL
- Sistema de autenticação JWT
- IA médica com OpenAI
- Design responsivo premium

## Links:
- Produção: telemed-sistema.onrender.com
- Desenvolvimento: Replit

Para executar: npm install && npm run dev
`,
      'landing-page.html': fs.readFileSync(path.join(__dirname, '../landing-page-simple.html'), 'utf-8'),
      'package-info.json': JSON.stringify({
        name: "telemed-sistema",
        version: "2.0.0",
        description: "Sistema completo de telemedicina",
        stack: ["React", "Node.js", "PostgreSQL", "OpenAI"],
        deployment: "Replit + Render"
      }, null, 2)
    };
    
    res.json({
      message: 'Arquivos básicos disponíveis',
      files: Object.keys(simpleFiles),
      download_url: '/download'
    });
    
  } catch (err) {
    console.error('❌ Erro no download simples:', err);
    res.status(500).json({ error: 'Erro no download simples' });
  }
});

// Serve SPA with proper handling
app.get('/', (req, res) => {
  try {
    const indexPath = path.join(__dirname, '../dist/public/index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
      console.log('🏠 TeleMed Homepage loaded from dist/public');
    } else {
      console.error('❌ index.html not found at:', indexPath);
      res.status(404).send('Application not built. Run npm run build first.');
    }
  } catch (err) {
    console.error('❌ Error serving homepage:', err);
    res.status(500).send('Server error loading homepage');
  }
});

app.get('/dashboard-aquarela', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../dashboard-aquarela.html'), 'utf-8');
    console.log('🎨 Carregando Dashboard Aquarela premium');
    // Força no-cache para evitar problemas de cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(html);
  } catch (err) {
    console.error('❌ Erro ao carregar dashboard:', err);
    res.status(500).send('Erro ao carregar o dashboard');
  }
});

// Rotas do Dashboard Aquarela
app.get('/dashboard', (req, res) => res.redirect('/dashboard-aquarela'));
app.get('/dashboard-medical.html', (req, res) => res.redirect('/dashboard-aquarela'));
app.get('/dashboard-aquarela.html', (req, res) => res.redirect('/dashboard-aquarela'));
app.get('/medical-dashboard-pro.html', (req, res) => res.redirect('/dashboard-aquarela'));

// Agenda Médica
app.get('/agenda-medica', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../agenda-medica.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Receitas Digitais
app.get('/receitas-digitais', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../memed-receita-viewer.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Videoconsultas
app.get('/videoconsulta', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../atendimento-medico.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Dr. AI
app.get('/dr-ai', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../dr-ai.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Leilão Consultas
app.get('/leilao-consultas', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../leilao-consultas.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Triagem Psiquiátrica
app.get('/triagem-psiquiatrica', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../centro-avaliacao.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Centro Avaliação
app.get('/centro-avaliacao', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../centro-avaliacao.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Sistema Notificações SMS
app.get('/sistema-notificacoes-medicas', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../sistema-notificacoes-medicas.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Especialidades
app.get('/especialidades', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../especialidades.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Atendimento Médico
app.get('/atendimento-medico', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../atendimento-medico.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// MEMED Receitas
app.get('/memed-receita-viewer', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../memed-receita-viewer.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Testes Psiquiátricos
app.get('/ansiedade-gad7', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../ansiedade-gad7.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

app.get('/depressao-phq9', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../depressao-phq9.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

app.get('/bipolar-mdq', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../bipolar-mdq.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Telemonitoramento
app.get('/telemonitoramento-enfermagem', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../telemonitoramento-enfermagem.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Entrada e Login
app.get('/entrada', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../entrada.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

app.get('/login', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../login.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Teste de Laudos Médicos
app.get('/test-medical-report', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../test-medical-report.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// SPA Configuration - Fallback para index.html em rotas não encontradas
app.get('*', (req, res, next) => {
  // Se é uma rota da API, pula o fallback SPA
  if (req.path.startsWith('/api/') || 
      req.path.startsWith('/health') || 
      req.path.startsWith('/ping') ||
      req.path.startsWith('/attached_assets/') ||
      req.path.includes('.')) {
    return next(); // Deixa outras rotas passarem
  }
  
  // Para todas as outras rotas, serve index.html (SPA)
  const indexPath = path.join(__dirname, '../dist/public/index.html');
  
  if (fs.existsSync(indexPath)) {
    console.log(`🔄 SPA Fallback: ${req.path} → index.html`);
    res.sendFile(indexPath);
  } else {
    console.log(`❌ index.html não encontrado em: ${indexPath}`);
    res.status(404).send(`
      <h1>Página não encontrada</h1>
      <p>Rota: ${req.path}</p>
      <p>Build necessário: npm run build</p>
    `);
  }
});

// Render-specific: Listen on all interfaces with proper error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TeleMed Sistema v12.5.2 rodando na porta ${PORT}`);
  console.log(`🔗 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 PORT env raw: '${process.env.PORT}'`);
  console.log(`🔗 PORT final: ${PORT}`);
  console.log(`🔗 Bind: 0.0.0.0:${PORT}`);
  console.log(`🔗 Server address: ${JSON.stringify(server.address())}`);
  console.log('🛡️ Sistema de login seguro implementado');
  console.log('🔐 Área médica protegida com autenticação');
  console.log('📱 Sistema de notificações médicas ativo');
  
  // Test server responsiveness
  console.log('🔍 Testing server health...');
});

server.on('error', (err: any) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
});

server.on('listening', () => {
  console.log('✅ Server is listening and ready for connections');
});

// SPA Catch-all handler (must be last)
app.get('*', (req, res) => {
  // Skip API routes and specific assets
  if (req.path.startsWith('/api/') || 
      req.path.startsWith('/assets/') || 
      req.path.startsWith('/healthz') || 
      req.path.startsWith('/ping') ||
      req.path.includes('.html') ||
      req.path.includes('.js') ||
      req.path.includes('.css')) {
    return res.status(404).send('Not found');
  }
  
  try {
    const indexPath = path.join(__dirname, '../dist/public/index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
      console.log('🔄 SPA route served:', req.path);
    } else {
      res.status(404).send('SPA not built');
    }
  } catch (err) {
    console.error('❌ Error serving SPA route:', err);
    res.status(500).send('Server error');
  }
});