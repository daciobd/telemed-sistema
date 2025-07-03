const http = require('http');
const PORT = process.env.PORT || 5000;

console.log('EMERGENCY SERVER STARTING ON PORT', PORT);

http.createServer((req, res) => {
  console.log('REQUEST:', req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <h1>TeleMed Sistema - ONLINE!</h1>
    <p>Deploy realizado com sucesso no Render</p>
    <p>URL: ${req.headers.host}</p>
    <p>Versao: Emergency-1.0</p>
    <p>Status: Funcionando</p>
  `);
}).listen(PORT, () => console.log('EMERGENCY SERVER RUNNING ON', PORT));