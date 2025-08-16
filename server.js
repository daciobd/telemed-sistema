const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 TeleMed Server Starting...');

app.use(express.static('public'));
app.use((req, res, next) => {
    console.log(`📍 ${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sistema-integrado.html'));
});

app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demo-ativo', 'index.html'));
});

app.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'react-app', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ TeleMed Server ONLINE - Port ${PORT}`);
    console.log(`🌐 Teste: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
});

// Rota para sistema completo híbrido
app.get('/complete', (req, res) => {
    console.log('🎯 Servindo sistema híbrido completo');
    res.sendFile(path.join(__dirname, 'public', 'telemed-complete.html'));
});

// Rota para acesso direto ao sistema com IA
app.get('/sistema-ia', (req, res) => {
    console.log('🤖 Redirecionando para sistema com IA');
    res.redirect('https://e6d689c1-512b-4fe0-95e9-97962bd221aa-00-1tscx6q290aml.spock.replit.dev/');
});
