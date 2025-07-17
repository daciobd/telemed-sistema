const express = require('express');
const path = require('path');
const app = express();
// IMPORTANTE: Usar a porta do ambiente ou 10000 como padrão
const PORT = process.env.PORT || 10000;

// Middleware essenciais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Health check - DEVE vir ANTES das outras rotas
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'TeleMed Sistema operacional',
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Rota principal - servir index.html
app.get('/', (req, res) => {
    console.log(`[TeleMed] Serving index.html`);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API de status
app.get('/api/status', (req, res) => {
    res.json({
        system: 'TeleMed Sistema',
        status: 'operational',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Fallback para SPA - DEVE vir por ÚLTIMO
app.get('*', (req, res) => {
    console.log(`[TeleMed] Fallback route for: ${req.path}`);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor com bind correto para o Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TeleMed] ✅ Servidor rodando na porta ${PORT}`);
    console.log(`[TeleMed] 🌐 Acesse: http://localhost:${PORT}`);
    console.log(`[TeleMed] 💚 Health: http://localhost:${PORT}/health`);
    console.log(`[TeleMed] 📊 Status: Operacional`);
});

// Tratamento de erros
process.on('unhandledRejection', (err) => {
    console.error('[TeleMed] ❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('[TeleMed] ❌ Uncaught Exception:', err);
    process.exit(1);
});

module.exports = app;
