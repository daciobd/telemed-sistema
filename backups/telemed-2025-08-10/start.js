import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Security middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://replit.com"],
      connectSrc: ["'self'", "wss:", "https:"]
    }
  }
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://telemed-sistema.onrender.com', 'https://84622708-9db0-420a-a1f1-6a7a55403590-00-2d2fgen7wjybm.picard.replit.dev'] 
    : true,
  credentials: true
}));

app.use(compression());

// CORREÇÃO CRÍTICA: Servir da pasta EXATA onde o build coloca os arquivos
const publicPath = path.join(__dirname, 'dist', 'public');

console.log(`📂 Servindo arquivos de: ${publicPath}`);

// Production optimized static file serving
app.use(express.static(publicPath, {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Rota específica para assets (redundância para garantir)
app.use('/assets', express.static(path.join(publicPath, 'assets'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true
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