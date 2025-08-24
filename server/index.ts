import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';

const app = express();

// Trust proxy (Render) e middlewares
app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(compression());

// === Static ===
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
app.use(express.static(PUBLIC_DIR, { maxAge: '7d', etag: true }));
app.use((req, _res, next) => {
  // HTML sem cache agressivo
  if (!path.extname(req.path)) req.headers['cache-control'] = 'public, max-age=0';
  next();
});

// Health / ping
app.get('/health', (_req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || 'development', time: new Date().toISOString() })
);
app.get('/api/ping', (_req, res) => res.json({ pong: true }));

// Helper para servir canônicas a partir de /public
const serveCanonical = (rel: string) => (_req: any, res: any) =>
  res.sendFile(path.join(PUBLIC_DIR, rel));

// --- Rotas CANÔNICAS ---
app.get('/', (_req, res) => res.redirect(301, '/agenda'));

app.get('/agenda',           serveCanonical('preview/agenda-avancada.html')); // nova agenda
app.get('/consulta',         serveCanonical('preview/enhanced-teste.html'));
app.get('/dashboard',        serveCanonical('preview/dashboard.html'));
app.get('/demo-responsivo',  serveCanonical('preview/demo-responsivo.html'));
app.get('/sala-de-espera',   serveCanonical('preview/sala-de-espera.html'));

app.get('/medico',           serveCanonical('preview/perfil-medico.html'));
app.get('/paciente',         serveCanonical('preview/mobile.html'));

app.get('/como-funciona',    serveCanonical('preview/como-funciona.html'));
app.get('/dr-ai',            serveCanonical('preview/doutor-ai.html'));

app.get('/cadastro',         serveCanonical('cadastro.html'));
app.get('/login',            serveCanonical('preview/login.html'));

app.get('/registro-saude',   serveCanonical('preview/registro-saude.html'));
app.get('/privacidade',      serveCanonical('preview/privacidade.html'));
app.get('/precos',           serveCanonical('preview/precos.html'));
app.get('/recuperar-senha',  serveCanonical('preview/recuperar-senha.html'));
app.get('/feedback-medico',  serveCanonical('preview/feedback-medico.html'));
app.get('/guia-orientacao',  serveCanonical('preview/guia-orientacao.html'));

// --- Redirects de aliases/legados → canônicas (preservando querystring) ---
const r301 = (to: string) => (req: any, res: any) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  res.redirect(301, to + qs);
};

app.get(['/dev/agenda','/agenda2','/agenda-legacy'], r301('/agenda'));
app.get(['/enhanced','/enhanced-consultation','/enhanced-teste','/enhanced-system'], r301('/consulta'));
app.get(['/doctor-dashboard','/dashboard-teste','/dashboard-teste.html'], r301('/dashboard'));
// opcional: backlinks antigos
app.get(['/video-consultation'], r301('/consulta'));
// páginas antigas de pacientes
app.get(['/pacientes','/pacientes.html'], r301('/dashboard'));

// Porta
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log('✅ Express pronto em', PORT);
  console.log('🗂️  static:', PUBLIC_DIR);
});