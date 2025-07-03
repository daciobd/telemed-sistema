const http = require('http');
const PORT = process.env.PORT || 10000;

console.log('TeleMed Sistema Iniciando...');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>TeleMed Sistema - Online!</title>
  <style>
    body { font-family: Arial; padding: 40px; background: #667eea; color: white; text-align: center; }
    .card { background: white; color: #333; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
    h1 { color: #667eea; font-size: 2.5em; }
    .success { background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🩺 TeleMed Sistema</h1>
    <div class="success">✅ Deploy Realizado com Sucesso!</div>
    <p><strong>Status:</strong> Online e Funcionando</p>
    <p><strong>URL:</strong> ${req.headers.host}</p>
    <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
    
    <h3>Sistema de Telemedicina Completo</h3>
    <p>Videoconsultas | Prescrições MEMED | IA Médica | Pagamentos</p>
    
    <p style="margin-top: 30px; font-weight: bold;">
      Pronto para demonstrações médicas!
    </p>
  </div>
</body>
</html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('TeleMed Sistema ONLINE na porta', PORT);
});
