import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT;

console.log('🚀 TeleMed Sistema iniciando...');

// CORREÇÃO CRÍTICA: Servir assets estáticos PRIMEIRO
app.use(express.static(path.join(__dirname, 'dist/public')));
app.use('/assets', express.static(path.join(__dirname, 'dist/public/assets')));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'production'
  });
});

// SPA fallback por último
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TeleMed Sistema rodando na porta ${PORT}`);
  console.log(`📂 Arquivos servidos de: ${path.join(__dirname, 'dist/public')}`);
  console.log(`🎨 Assets CSS/JS servidos de: ${path.join(__dirname, 'dist/public/assets')}`);
});