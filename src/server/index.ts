import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';

const app = express();

// Middlewares básicos
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(compression());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// 🔎 Rotas de exemplo / health
app.get('/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development', time: new Date().toISOString() });
});

app.get('/api/ping', (_req, res) => {
  res.json({ pong: true });
});

/** =========================
 *  ⬇️ SUAS ROTAS/INTEGRAÇÕES AQUI
 *  app.post('/api/...', handler)
 *  app.use('/api/xyz', xyzRouter)
 *  =========================
 */

// Rota específica para pacientes.html
app.get('/pacientes.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pacientes.html'));
});

// Porta com prioridade: process.env.PORT -> fallback 5000
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('🔧 Starting Express server on port', PORT, '...');
  console.log('🔗 Environment:', process.env.NODE_ENV || 'development');
});