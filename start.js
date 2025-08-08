import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Static files path
const staticPath = path.join(__dirname, 'dist/public');

console.log('🚀 TeleMed Sistema iniciando...');
console.log('📂 Servindo arquivos de:', staticPath);

// Serve static files
app.use(express.static(staticPath));

// SPA fallback - catch all routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist/public/index.html');
  console.log(`🔄 SPA Fallback: ${req.path} → index.html`);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Página não encontrada');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TeleMed Sistema rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'production'}`);
  console.log(`📂 Arquivos servidos de: ${staticPath}`);
});