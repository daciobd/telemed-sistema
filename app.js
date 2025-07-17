const express = require('express');
const path = require('path');
const app = express();

// FORÇAR porta 10000 - ignorar process.env.PORT que está bugado
const PORT = 10000;

// Debug completo do ambiente
console.log('=== DEBUG AMBIENTE ===');
console.log('process.env.PORT:', process.env.PORT);
console.log('PORT final:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('===================');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', function(req, res) {
    res.json({ 
        status: 'OK',
        port: PORT,
        message: 'TeleMed Sistema operacional',
        timestamp: new Date().toISOString()
    });
});

// Rota principal
app.get('/', function(req, res) {
    console.log('Servindo index.html');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', function() {
    console.log('[TeleMed] ✅ Servidor ONLINE na porta ' + PORT);
    console.log('[TeleMed] 🌐 URL: http://0.0.0.0:' + PORT);
    console.log('[TeleMed] 💚 Health: http://0.0.0.0:' + PORT + '/health');
    console.log('[TeleMed] 🚀 Deploy bem-sucedido!');
});

// Error handling
process.on('uncaughtException', function(err) {
    console.error('Erro não capturado:', err);
});

module.exports = app;
