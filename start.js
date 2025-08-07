import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from dist/public
app.use(express.static('dist/public'));

// Root route
app.get('/', (req, res) => {
    res.sendFile('dist/public/index.html', { root: __dirname + '/../' });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Fallback for SPA routes
app.get('*', (req, res) => {
    res.sendFile('dist/public/index.html', { root: __dirname + '/../' });
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port} em ${new Date().toISOString()}`);
});