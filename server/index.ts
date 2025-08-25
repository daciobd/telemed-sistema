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

// Landing Page
app.get('/lp',               serveCanonical('lp.html'));

// Dashboard e principais
app.get('/agenda',           serveCanonical('preview/agenda-avancada.html')); 
app.get('/consulta',         serveCanonical('preview/enhanced-teste.html'));
app.get('/dashboard',        serveCanonical('preview/dashboard.html'));
app.get('/demo-responsivo',  serveCanonical('preview/demo-responsivo.html'));
app.get('/sala-de-espera',   serveCanonical('preview/sala-de-espera.html'));

// Perfis
app.get('/medico',           serveCanonical('preview/perfil-medico.html'));
app.get('/paciente',         serveCanonical('preview/mobile.html'));
app.get('/configuracoes',    serveCanonical('preview/perfil-medico.html')); // fallback para perfil médico

// Funcionalidades
app.get('/centro-de-testes', serveCanonical('preview/centro-de-testes.html'));
app.get('/como-funciona',    serveCanonical('preview/como-funciona.html'));
app.get('/dr-ai',            serveCanonical('dr-ai.html'));

// Autenticação
app.get('/cadastro',         serveCanonical('cadastro.html'));
app.get('/login',            serveCanonical('preview/login.html'));

// Institucional
app.get('/sobre',            serveCanonical('preview/sobre-themed.html'));
app.get('/faq',              serveCanonical('preview/faq.html'));
app.get('/registro-saude',   serveCanonical('preview/registro-saude.html'));
app.get('/privacidade',      serveCanonical('preview/privacidade.html'));
app.get('/termos-de-uso',    serveCanonical('preview/termos-de-uso.html'));
app.get('/precos',           serveCanonical('preview/precos.html'));
app.get('/recuperar-senha',  serveCanonical('preview/recuperar-senha.html'));
app.get('/feedback-medico',  serveCanonical('preview/feedback-medico.html'));
app.get('/guia-orientacao',  serveCanonical('preview/guia-orientacao.html'));
app.get('/triagem-psiquiatrica', serveCanonical('preview/triagem-psiquiatrica.html'));

// --- Redirects de aliases/legados → canônicas (preservando querystring) ---
const r301 = (to: string) => (req: any, res: any) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  res.redirect(301, to + qs);
};

// Home/landing velhos → /lp
app.get(['/home','/index.html','/landing','/inicio'], r301('/lp'));

app.get(['/dev/agenda','/agenda2','/agenda-legacy'], r301('/agenda'));
app.get(['/enhanced','/enhanced-consultation','/enhanced-teste','/enhanced-system','/video-consultation'], r301('/consulta'));
app.get(['/doctor-dashboard','/dashboard-teste','/dashboard-teste.html'], r301('/dashboard'));

// Aliases para Centro de Testes
app.get(['/testes','/centro-testes','/testes-psiquiatricos','/screening'], r301('/centro-de-testes'));

// Aliases para Sala de Espera
app.get(['/waiting-room','/aguardando'], r301('/sala-de-espera'));

// Redirects úteis (antigos → canônicas)
app.get(['/politica-de-privacidade','/politicas'], r301('/privacidade'));
app.get(['/termos','/termos-uso'], r301('/termos-de-uso'));
app.get(['/sobre-thelemed','/sobre-a-telemed'], r301('/sobre'));
app.get('/faq.html', r301('/faq'));
app.get('/feedback', r301('/feedback-medico'));
app.get('/consulta-por-valor', r301('/precos'));
app.get('/triagem', r301('/triagem-psiquiatrica'));

// Rotas adicionais usadas no Dashboard
app.get('/gestao-avancada.html', serveCanonical('gestao-avancada.html')); // gestão avançada
app.get('/perfil-medico',        r301('/medico')); // redirect para canonical

// Aliases que ainda aparecem no Dashboard/HTMLs antigos:
app.get(['/public/demo-ativo/perfil-medico.html','/preview/perfil-medico.html','/area-medica.html'], r301('/medico'));
app.get(['/public/demo-ativo/configuracoes.html','/config.html'], r301('/configuracoes'));
app.get(['/responsive-demo.html','/demo-responsivo.html','/demo-ativo/responsivo.html'], r301('/demo-responsivo'));

// páginas antigas de pacientes
app.get(['/pacientes','/pacientes.html','/public/preview/meus-pacientes-original.html'], r301('/dashboard'));

// Outros links do dashboard
app.get('/enhanced', r301('/consulta')); // enhanced → consulta

// Dashboards alternativos - fallback para main dashboard se não existirem
app.get('/dashboard-clean.html', r301('/dashboard'));
app.get('/dashboard-minimal.html', r301('/dashboard'));
app.get('/dashboard-pastel.html', r301('/dashboard'));

// Testes psiquiátricos - redirect para centro de testes
app.get('/depressao-phq9.html', r301('/centro-de-testes'));
app.get('/gad7-ansiedade.html', r301('/centro-de-testes'));
app.get('/ansiedade-gad7.html', r301('/centro-de-testes'));
app.get('/bipolar-mdq.html', r301('/centro-de-testes'));

// Outros links órfãos do dashboard
app.get('/atendimento-medico.html', r301('/consulta'));
app.get('/guia-integracao-hostinger.html', r301('/guia-orientacao'));
app.get('/links-verificacao-telemed.html', r301('/dashboard'));
app.get('/logout.html', r301('/login'));

// Porta
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log('✅ Express pronto em', PORT);
  console.log('🗂️  static:', PUBLIC_DIR);
});