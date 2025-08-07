import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log('🔧 Iniciando servidor TeleMed...');
console.log('📁 Diretório atual:', __dirname);
console.log('📁 Servindo arquivos de:', path.join(__dirname, 'dist/public'));

// Serve static files from dist/public with explicit path
app.use(express.static(path.join(__dirname, 'dist/public')));

// Additional static paths for assets
app.use('/assets', express.static(path.join(__dirname, 'dist/public/assets')));

// Root route with logging
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'dist/public/index.html');
    console.log(`📄 Tentando servir index.html de: ${indexPath} em ${new Date().toISOString()}`);
    
    try {
        res.sendFile(indexPath);
        console.log('✅ index.html servido com sucesso');
    } catch (error) {
        console.error('❌ Erro ao servir index.html:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'TeleMed Sistema',
        version: '12.5.2'
    });
});

// Additional health check for Render
app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
});

// Fallback for SPA routes
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist/public/index.html');
    console.log(`🔄 Fallback para: ${req.path} -> servindo index.html`);
    res.sendFile(indexPath);
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 TeleMed Sistema rodando na porta ${port} em ${new Date().toISOString()}`);
    console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'production'}`);
    console.log(`📁 Arquivos estáticos: ${path.join(__dirname, 'dist/public')}`);
});