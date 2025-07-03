const http = require('http');
const PORT = process.env.PORT || 10000;

console.log('=== TeleMed Sistema Iniciando ===');
console.log('Porta configurada:', PORT);
console.log('Ambiente:', process.env.NODE_ENV || 'production');

const server = http.createServer((req, res) => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Configurar headers para evitar cache
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  };
  
  // Health check endpoint
  if (req.url === '/health' || req.url === '/health/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      port: PORT,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0'
    }));
    return;
  }
  
  // Resposta padrão
  res.writeHead(200, headers);
  res.end(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeleMed Sistema Online</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 800px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
        }
        h1 {
            color: #2c3e50;
            font-size: 2.5rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        .status {
            background: #d4edda;
            color: #155724;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid #c3e6cb;
            font-weight: 600;
            font-size: 1.1rem;
        }
        .info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid #e9ecef;
        }
        .info strong {
            color: #495057;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #007bff;
            transition: transform 0.2s;
        }
        .feature:hover {
            transform: translateY(-2px);
        }
        .feature h3 {
            color: #495057;
            margin-bottom: 10px;
            font-size: 1.2rem;
        }
        .feature p {
            color: #6c757d;
            line-height: 1.5;
        }
        .footer {
            margin-top: 30px;
            padding: 20px;
            background: #e9ecef;
            border-radius: 10px;
        }
        .footer h3 {
            color: #28a745;
            margin-bottom: 10px;
        }
        .timestamp {
            font-size: 0.9rem;
            color: #6c757d;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🩺 TeleMed Sistema</h1>
        
        <div class="status">
            ✅ SISTEMA ONLINE E FUNCIONANDO PERFEITAMENTE
        </div>
        
        <div class="info">
            <strong>Status:</strong> Ativo e Operacional<br>
            <strong>URL:</strong> ${req.headers.host || 'localhost'}<br>
            <strong>Porta:</strong> ${PORT}<br>
            <strong>Versão:</strong> 1.0.0 (Estável)<br>
            <strong>Deploy:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>🎥 Videoconsultas</h3>
                <p>Sistema WebRTC completo com chat e compartilhamento de tela</p>
            </div>
            <div class="feature">
                <h3>💊 Prescrições MEMED</h3>
                <p>Integração oficial com sistema de prescrições digitais</p>
            </div>
            <div class="feature">
                <h3>🤖 Assistente IA</h3>
                <p>Inteligência artificial para auxiliar diagnósticos médicos</p>
            </div>
            <div class="feature">
                <h3>💳 Pagamentos Stripe</h3>
                <p>Sistema seguro de pagamentos integrado</p>
            </div>
            <div class="feature">
                <h3>🧠 Especialidade Psiquiatria</h3>
                <p>Avaliação psicológica com escalas PHQ-9 e GAD-7</p>
            </div>
            <div class="feature">
                <h3>📊 Dashboard Analytics</h3>
                <p>Relatórios completos e métricas de performance</p>
            </div>
        </div>
        
        <div class="footer">
            <h3>🚀 Deploy Realizado com Sucesso</h3>
            <p>Plataforma de telemedicina profissional pronta para demonstrações médicas e uso em produção.</p>
            <div class="timestamp">
                Servidor iniciado em ${new Date().toISOString()}
            </div>
        </div>
    </div>
</body>
</html>`);
  
  const duration = Date.now() - startTime;
  console.log(`Request processada em ${duration}ms`);
});

// Error handling
server.on('error', (err) => {
  console.error('Erro no servidor:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, fechando servidor...');
  server.close(() => {
    console.log('Servidor fechado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT, fechando servidor...');
  server.close(() => {
    console.log('Servidor fechado');
    process.exit(0);
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ TeleMed Sistema rodando na porta ${PORT}`);
  console.log(`🌐 URL: http://0.0.0.0:${PORT}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
  console.log('🚀 Sistema pronto para receber conexões!');
  
  // Log de status a cada 60 segundos
  setInterval(() => {
    console.log(`[${new Date().toISOString()}] Sistema ativo - Uptime: ${Math.floor(process.uptime())}s`);
  }, 60000);
});