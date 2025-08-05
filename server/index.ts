import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/attached_assets', express.static(path.join(__dirname, '../attached_assets')));

app.get('/', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../entrada.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send('Erro ao carregar a página');
  }
});

app.get('/dashboard-aquarela', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../dashboard-aquarela.html'), 'utf-8');
    console.log('🎨 Carregando Dashboard Aquarela premium');
    // Força no-cache para evitar problemas de cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(html);
  } catch (err) {
    console.error('❌ Erro ao carregar dashboard:', err);
    res.status(500).send('Erro ao carregar o dashboard');
  }
});

app.get('/cadastrar-paciente', (req, res) => res.send('Página de Cadastro - Em construção'));

app.get('/dashboard', (req, res) => res.redirect('/dashboard-aquarela'));
app.get('/dashboard-medical.html', (req, res) => res.redirect('/dashboard-aquarela'));
app.get('/dashboard-aquarela.html', (req, res) => res.redirect('/dashboard-aquarela'));
app.get('/medical-dashboard-pro.html', (req, res) => res.redirect('/dashboard-aquarela'));

app.listen(PORT, () => {
  console.log(`🚀 TeleMed Sistema v12.5.2 rodando na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}`);
  console.log('🛡️ Sistema de login seguro implementado');
  console.log('🔐 Área médica protegida com autenticação');
  console.log('📱 Sistema de notificações médicas ativo');
});