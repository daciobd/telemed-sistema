-85
+44
const http = require('http');
const PORT = process.env.PORT || 10000;
const PORT = process.env.PORT || 3000;
console.log('=== TeleMed Sistema Iniciando ===');
console.log('Porta configurada:', PORT);
console.log('Ambiente:', process.env.NODE_ENV || 'production');
console.log('TeleMed Sistema iniciando...');
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
const htmlPage = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeleMed Sistema Online</title>
    <title>TeleMed Sistema - Plataforma de Telemedicina</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #333;
        }
        .container {
            background: white;
            padding: 60px 40px;
            border-radius: 20px;
            padding: 40px;
            max-width: 800px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 90%;
        }
        h1 {
            color: #2c3e50;
            font-size: 2.5rem;
            color: #2563eb;
            font-size: 3rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        .status {
            background: #d4edda;
            color: #155724;
            background: #dcfce7;
            color: #166534;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid #c3e6cb;
            margin: 30px 0;
            font-size: 1.2rem;
            font-weight: 600;
            font-size: 1.1rem;
            border: 2px solid #22c55e;
        }
        .info {
            background: #f8f9fa;
            padding: 20px;
            background: #f8fafc;
            padding: 25px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid #e9ecef;
        }
        .info strong {
            color: #495057;
            border-left: 4px solid #3b82f6;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            background: #f8f9fa;
            padding: 20px;
            background: #f1f5f9;
            border-radius: 10px;
            border-left: 4px solid #007bff;
            transition: transform 0.2s;
            border: 1px solid #e2e8f0;
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
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        .timestamp {
            font-size: 0.9rem;
            color: #6c757d;
            margin-top: 10px;
        h3 {
            color: #1e40af;
            margin: 30px 0 20px 0;
            font-size: 1.5rem;
        }
        .success-badge {
            background: #059669;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin: 20px 0;
            font-weight: 600;
        }
        @media (max-width: 768px) {
            .container { padding: 40px 20px; }
            h1 { font-size: 2rem; }
            .features { grid-template-columns: 1fr; }
        }
    </style>
</head>
-52
+66
    <div class="container">
        <h1>🩺 TeleMed Sistema</h1>
        
        <div class="success-badge">
            ✅ SISTEMA ONLINE E OPERACIONAL
        </div>
        
        <div class="status">
            ✅ SISTEMA ONLINE E FUNCIONANDO PERFEITAMENTE
            🚀 Deploy realizado com sucesso!<br>
            Plataforma pronta para demonstrações médicas
        </div>
        
        <div class="info">
            <strong>Status:</strong> Ativo e Operacional<br>
            <strong>URL:</strong> ${req.headers.host || 'localhost'}<br>
            <strong>Porta:</strong> ${PORT}<br>
            <strong>Versão:</strong> 1.0.0 (Estável)<br>
            <strong>Deploy:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
            <strong>📊 Status:</strong> Funcionando perfeitamente<br>
            <strong>📅 Deploy:</strong> ${new Date().toLocaleString('pt-BR')}<br>
            <strong>🌐 Plataforma:</strong> Vercel<br>
            <strong>⚡ Versão:</strong> 2.0 Simplificada
        </div>
        
        <h3>🏥 Funcionalidades Disponíveis</h3>
        
        <div class="features">
            <div class="feature">
                <h3>🎥 Videoconsultas</h3>
                <p>Sistema WebRTC completo com chat e compartilhamento de tela</p>
                <div class="feature-icon">🎥</div>
                <strong>Videoconsultas</strong><br>
                WebRTC P2P
            </div>
            <div class="feature">
                <h3>💊 Prescrições MEMED</h3>
                <p>Integração oficial com sistema de prescrições digitais</p>
                <div class="feature-icon">💊</div>
                <strong>Prescrições</strong><br>
                Integração MEMED
            </div>
            <div class="feature">
                <h3>🤖 Assistente IA</h3>
                <p>Inteligência artificial para auxiliar diagnósticos médicos</p>
                <div class="feature-icon">🤖</div>
                <strong>IA Médica</strong><br>
                Assistente Inteligente
            </div>
            <div class="feature">
                <h3>💳 Pagamentos Stripe</h3>
                <p>Sistema seguro de pagamentos integrado</p>
                <div class="feature-icon">💳</div>
                <strong>Pagamentos</strong><br>
                Stripe Integrado
            </div>
            <div class="feature">
                <h3>🧠 Especialidade Psiquiatria</h3>
                <p>Avaliação psicológica com escalas PHQ-9 e GAD-7</p>
                <div class="feature-icon">🧠</div>
                <strong>Psiquiatria</strong><br>
                PHQ-9, GAD-7
            </div>
            <div class="feature">
                <h3>📊 Dashboard Analytics</h3>
                <p>Relatórios completos e métricas de performance</p>
                <div class="feature-icon">📊</div>
                <strong>Analytics</strong><br>
                Dashboard Médico
            </div>
        </div>
        
        <div class="footer">
            <h3>🚀 Deploy Realizado com Sucesso</h3>
            <p>Plataforma de telemedicina profissional pronta para demonstrações médicas e uso em produção.</p>
            <div class="timestamp">
                Servidor iniciado em ${new Date().toISOString()}
            </div>
        <h3>🎯 Sistema Pronto para Demonstrações</h3>
        
        <div class="info">
            <strong>🏆 Conquista:</strong> Deploy bem-sucedido após múltiplas tentativas<br>
            <strong>📈 Próximo passo:</strong> Compartilhar com colegas médicos<br>
            <strong>💡 Objetivo:</strong> Revolucionar a telemedicina no Brasil
        </div>
    </div>
</body>
</html>`);
</html>`;
const server = http.createServer((req, res) => {
  console.log(\`\${new Date().toISOString()} - \${req.method} \${req.url}\`);
  
  const duration = Date.now() - startTime;
  console.log(`Request processada em ${duration}ms`);
  // Health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  
  // Main page
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  res.end(htmlPage);
});
// Error handling
server.listen(PORT, () => {
  console.log(\`TeleMed Sistema rodando na porta \${PORT}\`);
  console.log(\`Health check: http://localhost:\${PORT}/health\`);
  console.log('Sistema pronto para conexões!');
});
server.on('error', (err) => {
  console.error('Erro no servidor:', err);
  process.exit(1);
  console.error('Erro do servidor:', err);
});
// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, fechando servidor...');
  console.log('Recebido SIGTERM, encerrando servidor...');
  server.close(() => {
    console.log('Servidor fechado');
    console.log('Servidor encerrado.');
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
module.exports = server;
