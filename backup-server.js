require('http').createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<h1>TeleMed Sistema - ONLINE!</h1><p>Deploy realizado com sucesso</p>');
}).listen(process.env.PORT || 10000);