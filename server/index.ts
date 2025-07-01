import express from 'express';
import { registerRoutes } from './routes';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '8.0.0-CLEAN',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Demo medico redirect - sempre redireciona para a plataforma principal
app.get('/demo-medico', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  res.redirect(baseUrl);
});

// Initialize routes
async function startServer() {
  try {
    const httpServer = await registerRoutes(app);
    
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log('🩺 TeleMed Sistema v8.0.0-CLEAN');
      console.log(`🌐 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 Acesso: http://localhost:${PORT}`);
      console.log('✅ Sem redirecionamentos problemáticos');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();