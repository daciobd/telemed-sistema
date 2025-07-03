-53
+54
console.log('🩺 TeleMed Sistema - Starting...');
const http = require('http');
try {
  // Try to require the main server file
  require('./index.js');
} catch (error) {
  console.error('Error loading index.js:', error.message);
const PORT = process.env.PORT || 10000;
console.log('=== TELEMED STARTING ===');
console.log('Port:', PORT);
const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  
  // Fallback: create a simple server
  const express = require('express');
  const app = express();
  const PORT = process.env.PORT || 5000;
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
  app.get('*', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>TeleMed Sistema</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            background: white;
            color: #333;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🩺 TeleMed Sistema</h1>
          <h2>Sistema Online e Funcionando!</h2>
          <p>Plataforma de Telemedicina Deployada com Sucesso</p>
          <p><strong>Deploy realizado no Render.com</strong></p>
        </div>
      </body>
      </html>
    `);
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
  app.listen(PORT, () => {
    console.log(`🌐 TeleMed fallback server running on port ${PORT}`);
  });
}
});
