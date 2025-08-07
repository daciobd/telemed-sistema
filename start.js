import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log('🚀 TeleMed Sistema iniciando...');
console.log('📁 Diretório atual:', __dirname);
console.log('📁 Working directory:', process.cwd());

// Determine the correct static path based on environment
const staticPath = process.env.NODE_ENV === 'production' 
    ? '/opt/render/project/src/dist/public'  // Absolute path for Render
    : path.join(__dirname, 'dist/public');  // Relative path for development

console.log('📂 Servindo arquivos estáticos de:', staticPath);

// Check if static path exists
const fs = require('fs');
if (fs.existsSync(staticPath)) {
    console.log('✅ Diretório estático encontrado');
    const assetsPath = path.join(staticPath, 'assets');
    if (fs.existsSync(assetsPath)) {
        const assetsFiles = fs.readdirSync(assetsPath);
        console.log('📁 Assets encontrados:', assetsFiles);
    } else {
        console.log('⚠️ Diretório assets não encontrado');
    }
} else {
    console.log('❌ Diretório estático não encontrado:', staticPath);
}

// Middleware to log all requests for debugging
app.use((req, res, next) => {
    console.log(`📋 ${req.method} ${req.path} em ${new Date().toISOString()}`);
    next();
});

// Serve static files with detailed error handling
app.use(express.static(staticPath, {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['html', 'js', 'css', 'png', 'jpg', 'gif', 'ico'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        console.log('📄 Servindo arquivo:', path);
    }
}));

// Root route with detailed logging
app.get('/', (req, res) => {
    const indexPath = path.resolve(staticPath, 'index.html');
    console.log(`📄 Tentando servir index.html em ${new Date().toISOString()} from ${indexPath}`);
    
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('❌ Erro ao servir index.html:', err);
            res.status(500).send('Erro ao carregar página');
        } else {
            console.log('✅ index.html servido com sucesso');
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        staticPath: staticPath,
        workingDir: process.cwd()
    });
});

// Debug route to check file structure
app.get('/debug/files', (req, res) => {
    const fs = require('fs');
    try {
        const files = fs.readdirSync(staticPath);
        const assetsFiles = fs.existsSync(path.join(staticPath, 'assets')) 
            ? fs.readdirSync(path.join(staticPath, 'assets'))
            : [];
        
        res.json({
            staticPath,
            files,
            assetsFiles,
            workingDir: process.cwd(),
            dirname: __dirname
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Catch-all for SPA
app.get('*', (req, res) => {
    const indexPath = path.resolve(staticPath, 'index.html');
    console.log(`🔄 Fallback para: ${req.path} -> servindo index.html de ${indexPath}`);
    res.sendFile(indexPath);
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 TeleMed Sistema rodando na porta ${port} em ${new Date().toISOString()}`);
    console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'production'}`);
    console.log(`📂 Arquivos servidos de: ${staticPath}`);
});