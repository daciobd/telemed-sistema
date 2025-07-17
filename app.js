const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Health check PRIMEIRO
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'TeleMed Sistema operacional',
        port: PORT
    });
});

// Rota principal - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback para SPA (caso tenha rotas)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TeleMed] Servidor rodando na porta ${PORT}`);
    console.log(`[TeleMed] Acesse: http://localhost:${PORT}`);
    console.log(`[TeleMed] Health: http://localhost:${PORT}/health`);
});

module.exports = app;
