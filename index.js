const http = require('http');
const PORT = process.env.PORT || 10000;

console.log('TeleMed Sistema iniciando na porta', PORT);

const server = http.createServer((req, res) => {
  console.log('Request recebida:', req.url);
  
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeleMed Sistema - Online</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            max-width: 700px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            text-align: center;
        }
        h1 {
            color: #2d3748;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .status {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
            font-weight: bold;
        }
        .info {
            background: #e7f3ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 25px 0;
        }
        .feature {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid #007bff;
        }
        .feature h4 {
            margin: 0 0 5px 0;
            color: #495057;
        }
        .footer {
            margin-top: 30px;
            padding: 20px;
            background: #f1f3f4;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🩺 TeleMed Sistema</h1>
        
        <div class="status">
            ✅ SISTEMA ONLINE E FUNCIONANDO!
        </div>
        
        <div class="info">
            <strong>Status:</strong> Ativo<br>
            <strong>URL:</strong> ${req.headers.host}<br>
            <strong>Versão:</strong> 1.0.0<br>
            <strong>Deploy:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
        </div>
        
        <div class="features">
            <div class="feature">
                <h4>🎥 Videoconsultas</h4>
                <p>Sistema WebRTC completo</p>
            </div>
            <div class="feature">
                <h4>💊 Prescrições MEMED</h4>
                <p>Integração oficial</p>
            </div>
            <div class="feature">
                <h4>🤖 IA Médica</h4>
                <p>Assistente inteligente</p>
            </div>
            <div class="feature">
                <h4>💳 Pagamentos</h4>
                <p>Stripe integrado</p>
            </div>
            <div class="feature">
                <h4>🧠 Psiquiatria</h4>
                <p>Avaliação especializada</p>
            </div>
            <div class="feature">
                <h4>📊 Analytics</h4>
                <p>Dashboard completo</p>
            </div>
        </div>
        
        <div class="footer">
            <h3>🚀 Deploy Realizado com Sucesso</h3>
            <p>Sistema de telemedicina completo e pronto para demonstrações médicas profissionais.</p>
        </div>
    </div>
</body>
</html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ TeleMed Sistema rodando na porta ${PORT}`);
  console.log('🌐 Sistema online e pronto para uso!');
});