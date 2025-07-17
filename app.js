const express = require('express');
const path = require('path');
const app = express();

// Definir porta PRIMEIRO
const PORT = process.env.PORT || 10000;

// Log para debug
console.log('DEBUG - PORT value:', PORT);
console.log('DEBUG - PORT type:', typeof PORT);

// Middleware
app.use(express.static('public'));

// Rotas
app.get('/health', function(req, res) {
    res.json({ 
        status: 'OK',
        port: PORT,
        message: 'TeleMed funcionando'
    });
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor - usando concatenação simples
app.listen(PORT, '0.0.0.0', function() {
    console.log('[TeleMed] Servidor na porta: ' + PORT);
    console.log('[TeleMed] URL: http://localhost:' + PORT);
    console.log('[TeleMed] Health: http://localhost:' + PORT + '/health');
    console.log('[TeleMed] Status: ONLINE');
});

module.exports = app;
