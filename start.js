import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log('TeleMed Sistema iniciando...');
console.log('Diretório:', __dirname);

// Simple static serving - no path.join complications
app.use(express.static('dist/public'));

// Log requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.resolve('dist/public/index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Catch-all for SPA
app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist/public/index.html'));
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`TeleMed rodando na porta ${port}`);
});