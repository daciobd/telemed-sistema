import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/test-demo-safe', (req, res) => {
    console.log("✅ Safe API called successfully.");
    res.json({ success: true, message: "This is the safe endpoint responding correctly." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Safe Test Server running on port ${PORT}`);
    console.log(`📁 Static files: ${path.join(__dirname, '../public')}`);
    console.log(`🌐 Access: http://localhost:${PORT}/test-safe.html`);
});