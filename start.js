import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// CORREÇÃO CRÍTICA: Servir da pasta EXATA onde o build coloca os arquivos
const publicPath = path.join(__dirname, 'dist', 'public');

console.log(`📂 Servindo arquivos de: ${publicPath}`);

// Servir arquivos estáticos com configuração explícita
app.use(express.static(publicPath, {
  maxAge: '1y',
  etag: false
}));

// Rota específica para assets (redundância para garantir)
app.use('/assets', express.static(path.join(publicPath, 'assets'), {
  maxAge: '1y',
  etag: false
}));

// SPA fallback - DEVE vir por último
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 TeleMed Sistema rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'production'}`);
  console.log(`📂 Arquivos servidos de: ${publicPath}`);
});