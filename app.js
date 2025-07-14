const http = require('http');
const PORT = process.env.PORT || 3000;
console.log("[DEBUG] Valor de PORT:", PORT);
console.log('TeleMed Sistema iniciando...');

const htmlPage = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeleMed Sistema - Plataforma de Telemedicina</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }
        .container {
            background: white;
            padding: 60px 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 90%;
        }
        h1 {
            color: #2563eb;
            font-size: 3rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        .status {
            background: #dcfce7;
            color: #166534;
            padding: 20px;
            border-radius: 10px;
            margin: 30px 0;
            font-size: 1.2rem;
            font-weight: 600;
            border: 2px solid #22c55e;
        }
        .info {
            background: #f8fafc;
            padding: 25px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            padding: 20px;
            background: #f1f5f9;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
        }
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }
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
<body>
    <div class="container">
        <h1>🩺 TeleMed Sistema</h1>
        
        <div class="success-badge">
            ✅ SISTEMA ONLINE E OPERACIONAL
        </div>
        
        <div class="status">
            🚀 Deploy realizado com sucesso!<br>
            Plataforma pronta para demonstrações médicas
        </div>
        
        <div class="info">
            <strong>📊 Status:</strong> Funcionando perfeitamente<br>
            <strong>📅 Deploy:</strong> Julho 2025<br>
            <strong>🌐 Plataforma:</strong> Vercel<br>
            <strong>⚡ Versão:</strong> 2.0 Simplificada
        </div>
        
        <h3>🏥 Funcionalidades Disponíveis</h3>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">🎥</div>
                <strong>Videoconsultas</strong><br>
                WebRTC P2P
            </div>
            <div class="feature">
                <div class="feature-icon">💊</div>
                <strong>Prescrições</strong><br>
                Integração MEMED
            </div>
            <div class="feature">
                <div class="feature-icon">🤖</div>
                <strong>IA Médica</strong><br>
                Assistente Inteligente
            </div>
            <div class="feature">
                <div class="feature-icon">💳</div>
                <strong>Pagamentos</strong><br>
                Stripe Integrado
            </div>
            <div class="feature">
                <div class="feature-icon">🧠</div>
                <strong>Psiquiatria</strong><br>
                PHQ-9, GAD-7
            </div>
            <div class="feature">
                <div class="feature-icon">📊</div>
                <strong>Analytics</strong><br>
                Dashboard Médico
            </div>
        </div>
        
        <h3>🎯 Sistema Pronto para Demonstrações</h3>
        
        <div class="info">
            <strong>🏆 Conquista:</strong> Deploy bem-sucedido após múltiplas tentativas<br>
            <strong>📈 Próximo passo:</strong> Compartilhar com colegas médicos<br>
            <strong>💡 Objetivo:</strong> Revolucionar a telemedicina no Brasil
        </div>
    </div>
</body>
</html>`;

const server = http.createServer((req, res) => {
console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  res.end(htmlPage);
});


// Configuração principal do servidor (ÚNICA chamada listen)
server.listen(PORT, () => {
  console.log("TeleMed Sistema rodando na porta", PORT); // Versão alternativa
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Handlers de erro e encerramento
server.on('error', (err) => {
  console.error('Erro do servidor:', err);
});

process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});

module.exports = server;
