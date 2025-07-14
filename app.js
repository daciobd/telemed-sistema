const http = require('http');

// Configuração da porta com fallback para 10000 (padrão Render)
const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 10000;

// Debug inicial
console.log('[TeleMed] Iniciando servidor...', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: PORT
});

// HTML da página (com CSS inline para melhor performance)
const htmlPage = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeleMed - Plataforma de Telemedicina</title>
    <style>
        /* Seu CSS completo aqui */
        body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        /* ... (mantenha todo seu CSS atual) ... */
    </style>
</head>
<body>
    <div class="container">
        <!-- Seu HTML completo aqui -->
        <h1>🩺 TeleMed Sistema</h1>
        <!-- ... (mantenha todo seu HTML atual) ... -->
    </div>
</body>
</html>`;

// Handler principal das requisições
const handleRequest = (req, res) => {
  // 1. Redirecionamento HTTPS em produção
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    res.writeHead(301, { 
      'Location': `https://${req.headers.host}${req.url}`,
      'Cache-Control': 'no-store'
    });
    return res.end();
  }

  // 2. Log da requisição
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.headers['user-agent']}`);

  // 3. Rotas
  if (req.url === '/health') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    return res.end(JSON.stringify({ 
      status: 'healthy',
      version: '2.0',
      timestamp: new Date().toISOString()
    }));
  }

  // 4. Resposta HTML padrão
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'X-Powered-By': 'TeleMed-API',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'public, max-age=3600'
  });
  res.end(htmlPage);
};

// Criação do servidor
const server = http.createServer(handleRequest);

// Handlers de eventos
server.on('error', (err) => {
  console.error('[TeleMed] Erro no servidor:', err);
});

process.on('SIGTERM', () => {
  console.log('[TeleMed] Recebido SIGTERM - Encerrando graciosamente...');
  server.close(() => {
    console.log('[TeleMed] Servidor encerrado com sucesso');
    process.exit(0);
  });
});

// Inicia o servidor
server.listen(PORT, () => {
  console.log(`[TeleMed] Servidor operacional na porta ${PORT}`);
  console.log(`[TeleMed] Health check: http://localhost:${PORT}/health`);
  console.log('[TeleMed] Pronto para receber conexões!');
});

module.exports = server;
