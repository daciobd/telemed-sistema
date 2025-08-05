// SERVIDOR EXPRESS CORRETO PARA TELEMED
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static('./')); // Servir arquivos estáticos da raiz

// Rota principal - Dashboard Aquarela (index.html)
app.get('/', (req, res) => {
    console.log('🏥 Servindo Dashboard Aquarela (index.html)');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Redirecionamentos para consolidação
app.get('/dashboard', (req, res) => {
    console.log('🎨 Redirecting /dashboard to index.html (Unified)');
    res.redirect('/');
});

app.get('/dashboard-medical.html', (req, res) => {
    console.log('🎨 Redirecting dashboard-medical.html to index.html (Unified)');
    res.redirect('/');
});

app.get('/medical-dashboard-pro.html', (req, res) => {
    console.log('🎨 Redirecting medical-dashboard-pro.html to index.html (Unified)');
    res.redirect('/');
});

app.get('/dashboard-aquarela.html', (req, res) => {
    console.log('🎨 Redirecting dashboard-aquarela.html to index.html (Unified)');
    res.redirect('/');
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        message: 'TeleMed Sistema funcionando'
    });
});

// Landing page como rota opcional
app.get('/landing', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TeleMed Sistema - Landing</title>
        </head>
        <body>
            <h1>TeleMed Sistema</h1>
            <p>Landing page promocional</p>
            <a href="/">Ir para Dashboard Aquarela</a>
        </body>
        </html>
    `);
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TeleMed Sistema rodando na porta ${PORT}`);
    console.log(`🏥 Dashboard Aquarela: http://localhost:${PORT}`);
    console.log(`📋 Health Check: http://localhost:${PORT}/health`);
    console.log(`🎯 Landing Page: http://localhost:${PORT}/landing`);
});

export default app;