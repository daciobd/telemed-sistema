const http = require('http');
const PORT = process.env.PORT || 10000;

console.log('Iniciando servidor na porta:', PORT);

const server = http.createServer((req, res) => {
  console.log('Request:', req.method, req.url);
  
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>TeleMed Sistema - Online</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(45deg, #667eea, #764ba2);
            margin: 0; 
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            background: white; 
            padding: 40px; 
            border-radius: 10px; 
            text-align: center;
            max-width: 600px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 { color: #333; margin-bottom: 20px; }
        .status { 
            background: #d4edda; 
            color: #155724; 
            padding: 15px; 
            border-radius: 5px; 
            margin: 20px 0;
            font-weight: bold;
        }
        .info { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🩺 TeleMed Sistema</h1>
        <div class="status">✅ SISTEMA ONLINE E FUNCIONANDO</div>
        <div class="info">
            <strong>URL:</strong> ${req.headers.host}<br>
            <strong>Porta:</strong> ${PORT}<br>
            <strong>Status:</strong> Operacional<br>
            <strong>Deploy:</strong> ${new Date().toLocaleString('pt-BR')}
        </div>
        <h3>Funcionalidades Disponíveis:</h3>
        <p>🎥 Videoconsultas WebRTC</p>
        <p>💊 Prescrições MEMED</p>
        <p>🤖 Assistente IA Médico</p>
        <p>💳 Pagamentos Stripe</p>
        <p>🧠 Psiquiatria Especializada</p>
        <p>📊 Dashboard Analytics</p>
        <br>
        <h3>🚀 Sistema Pronto para Demonstrações</h3>
    </div>
</body>
</html>`);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`URL: http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('Erro:', err);
});