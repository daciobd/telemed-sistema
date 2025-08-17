const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 TeleMed Server Starting...');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sistema-integrado.html'));
});

app.get('/complete', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'telemed-complete.html'));
});

app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demo-ativo', 'index.html'));
});

app.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'react-app', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ TeleMed Server ONLINE na porta ${PORT}`);
});

// Rotas para sistema fusionado
app.get('/telemed', (req, res) => {
    console.log('🤖 Servindo TeleMed IA');
    res.sendFile(path.join(__dirname, 'public', 'telemed-ia.html'));
});

app.get('/health', (req, res) => {
    console.log('🏥 Servindo Health Connect');
    res.sendFile(path.join(__dirname, 'public', 'health-connect.html'));
});

app.get('/complete', (req, res) => {
    console.log('🔗 Servindo Sistema Integrado');
    res.sendFile(path.join(__dirname, 'public', 'sistema-completo.html'));
});
