const http = require('http');

const PORT = process.env.PORT || 10000;
console.log('=== TELEMED STARTING ===');
console.log('Port:', PORT);

const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache'
  });
  
  res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>TeleMed Sistema</title>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0;">
    <h1 style="color: #2563eb;">🩺 TeleMed Sistema</h1>
    <div style="background: white; padding: 30px; border-radius: 10px; margin: 20px auto; max-width: 500px;">
        <h2 style="color: #059669;">✅ SISTEMA ONLINE</h2>
        <p><strong>Status:</strong> Funcionando</p>
        <p><strong>Deploy:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Porta:</strong> ${PORT}</p>
        <hr>
        <h3>Funcionalidades:</h3>
        <p>🎥 Videoconsultas</p>
        <p>💊 Prescrições MEMED</p>
        <p>🤖 Assistente IA</p>
        <p>💳 Pagamentos</p>
        <p>📊 Analytics</p>
    </div>
    <p style="color: #666;">Deploy realizado com sucesso!</p>
</body>
</html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('=== SERVER RUNNING ===');
  console.log(`Listening on port ${PORT}`);
  console.log('=== READY FOR CONNECTIONS ===');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});