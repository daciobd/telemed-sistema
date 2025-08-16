const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Iniciando servidor TeleMed...');

// Servir arquivos estáticos da pasta public
app.use(express.static('public'));
app.use(express.static('.'));

// Rota principal - redireciona para sistema integrado
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sistema-integrado.html'));
});

// Rotas específicas para facilitar acesso
app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demo-ativo', 'index.html'));
});

app.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'react-app', 'index.html'));
});

app.get('/sistema', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sistema-integrado.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor TeleMed rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
    console.log(`📍 URLs disponíveis:`);
    console.log(`   🎯 Sistema: /sistema`);
    console.log(`   🎨 Demo: /demo`);
    console.log(`   ⚡ Consulta: /consulta`);
});
