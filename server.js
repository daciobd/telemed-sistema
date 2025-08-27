const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

console.log('🚀 TeleMed Server Starting...');

// Middleware
app.use(express.static('public'));

// Rotas principais
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'lp.html'));
});

app.get('/telemed', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'telemed-ia.html'));
});

app.get('/health', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'health-connect.html'));
});

app.get('/complete', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sistema-completo.html'));
});

app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demo-ativo', 'index.html'));
});

app.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'react-app', 'index.html'));
});

app.get('/videoconsulta', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'videoconsulta.html'));
});

// ROTA ENHANCED-SYSTEM
app.get('/enhanced-system', (req, res) => {
    console.log('🚀 Servindo Enhanced System');
    res.sendFile(path.join(__dirname, 'public', 'enhanced-system.html'));
});

// Rota de saúde
app.get('/health-check', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.get('/pacientes.html', (req, res) => {
  res.sendFile(__dirname + '/public/pacientes.html');
});

app.get('/landing-teste', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'app', 'landing-teste.html'));
});
// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ TeleMed Server ONLINE na porta ${PORT}`);
    console.log(`🌐 URLs disponíveis:`);
    console.log(`   🏠 Home: /`);
    console.log(`   🤖 TeleMed: /telemed`);
    console.log(`   🏥 Health: /health`);
    console.log(`   🎯 Complete: /complete`);
    console.log(`   🎥 Videoconsulta: /videoconsulta`);
    console.log(`   🚀 Enhanced: /enhanced-system`);
});
