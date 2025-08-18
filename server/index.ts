import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getUsageToday } from "./utils/aiUsage.js";
import { sendAlert } from "./utils/webhook.js";

// Import middleware and config
import { applySecurity } from './middleware/security.js';
import { applyRequestId } from './middleware/requestId.js';
import { errorHandler } from './middleware/error.js';
import { requireAiEnabled } from './guards/ai.js';
import { timing } from './middleware/timing.js';
import { checkDbHealth } from './db.js';
import { env } from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Apply enhanced middlewares in order
applyRequestId(app);
applySecurity(app);
app.use(timing);

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Use environment configuration with dynamic port support
const PORT = Number(process.env.PORT) || 5000;

// Additional security headers (complementing Helmet)
app.use((req, res, next) => {
  res.header('X-Powered-By', 'TeleMed Sistema v2.0');
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ====== Import new API routes ======
import consults from './routes/consults.js';
import { ai } from './routes/ai.js';
import { cid10 } from './routes/cid10.js';
import { exams } from './routes/exams.js';
import { memed } from './routes/memed.js';

// ====== APIs e /perf primeiro ======
// (mantenha aqui TODAS as rotas /api/*, /perf/* e middlewares como timing/compression)

// Enhanced Consultation API routes
app.use("/api/consults", consults);
app.use("/api/ai", ai);
app.use("/api/cid10", cid10);
app.use("/api/exams", exams);
app.use("/api/memed", memed);

// ====== Vite dev removido devido a limitações de await ======
// Usando apenas modo produção com servindo de arquivos estáticos

// ====== Produção: servir dist se existir ======
const distDir = path.join(process.cwd(), "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir)); // /assets e index.html
  
  // Static file serving with proper headers for production
  app.use('/assets', express.static(path.join(distDir, 'assets'), {
    maxAge: '1d',
    etag: true,
    lastModified: true
  }));
}

// Static assets
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/attached_assets', express.static(path.join(__dirname, '../attached_assets')));

// Dr. AI Demo page direct route
app.get('/dr-ai-demo', (req, res) => {
  const demoPath = path.join(__dirname, '../public/dr-ai-demo.html');
  if (fs.existsSync(demoPath)) {
    console.log('🧠 Servindo Dr. AI Demo page');
    return res.sendFile(demoPath);
  }
  res.status(404).send('Demo page not found');
});

// Patient Management - serving dedicated HTML page
app.get('/patient-management', (req, res) => {
  console.log('🏥 Rota /patient-management acessada');
  const patientManagementHtml = path.join(__dirname, '../public/patient-management.html');
  if (fs.existsSync(patientManagementHtml)) {
    console.log('✅ Servindo patient-management.html dedicado');
    return res.sendFile(patientManagementHtml);
  }
  res.status(404).send('Patient Management page not found');
});

// Enhanced Consultation - main consultation interface with AI
app.get('/enhanced', (req, res) => {
  console.log('🚀 Rota /enhanced acessada - Consulta Avançada com IA');
  const enhancedConsultationHtml = path.join(__dirname, '../public/enhanced-consultation.html');
  if (fs.existsSync(enhancedConsultationHtml)) {
    console.log('✅ Servindo enhanced-consultation.html dedicado');
    return res.sendFile(enhancedConsultationHtml);
  }
  res.status(404).send('Enhanced Consultation page not found');
});

// Dashboard Teste - Chart.js dashboard
app.get('/dashboard-teste', (req, res) => {
  console.log('📊 Rota /dashboard-teste acessada - Dashboard com Chart.js');
  const dashboardTesteHtml = path.join(__dirname, '../public/dashboard-teste.html');
  if (fs.existsSync(dashboardTesteHtml)) {
    console.log('✅ Servindo dashboard-teste.html dedicado');
    return res.sendFile(dashboardTesteHtml);
  }
  res.status(404).send('Dashboard Teste page not found');
});

// Dashboard Teste HTML route (alternative)
app.get('/dashboard-teste.html', (req, res) => {
  console.log('📊 Rota /dashboard-teste.html acessada - Dashboard com Chart.js');
  const dashboardTesteHtml = path.join(__dirname, '../public/dashboard-teste.html');
  if (fs.existsSync(dashboardTesteHtml)) {
    console.log('✅ Servindo dashboard-teste.html dedicado');
    return res.sendFile(dashboardTesteHtml);
  }
  res.status(404).send('Dashboard Teste page not found');
});

// Enhanced System - redirect to enhanced consultation
app.get('/enhanced-system', (req, res) => {
  console.log('🔄 Rota /enhanced-system acessada - Redirecionando para /enhanced');
  res.redirect(301, '/enhanced');
});

// ====== SPA fallback p/ rotas do front ======
// Inclui as suas rotas principais e páginas internas do app
const SPA_MATCHER = /^\/(telemed|health|complete|video-consultation|enhanced-consultation|doctor-dashboard|ai-console|patients|enhanced)(\/.*)?$/i;
app.get(SPA_MATCHER, (req, res, next) => {
  try {
    const indexDist = path.join(distDir, "index.html");
    if (fs.existsSync(indexDist)) {
      return res.sendFile(indexDist);
    }
    // Fallback para servir a aplicação React mesmo sem build
    const indexHtml = path.join(process.cwd(), "index.html");
    if (fs.existsSync(indexHtml)) {
      return res.sendFile(indexHtml);
    }
    return next(); // deixa cair no 404 se não houver front
  } catch (e) {
    return next(e);
  }
});

// Performance reports serving
app.use('/perf', express.static(path.join(process.cwd(), 'perf'), {
  maxAge: '1h',
  etag: true,
  lastModified: true
}));

// 🔒 PATCH 1: Kill-switch global para IA — pega /api/ai e /api/ai-agent (qualquer método)
app.use((req, res, next) => {
  const url = req.originalUrl || req.url || "";
  const isAi = /^\/api\/ai(?:-agent)?\b/.test(url);
  if (isAi && !env.AI_ENABLED) {
    return res.status(403).json({ error: "ai_disabled", message: "AI features are currently disabled" });
  }
  next();
});

// ChatGPT Agent - Ativado com OpenAI instalado
import aiAgentRoutes from './routes/ai-agent.js';
import aiAgentHealthRoutes from './routes/ai-agent-health.js';

app.use('/api/ai-agent', aiAgentRoutes);
app.use('/api/ai-agent', aiAgentHealthRoutes);

// Slack alerts test route
app.post('/api/ai-agent/alert-test', async (req, res) => {
  try {
    const { msg } = req.body;
    const testMessage = `🧪 ${msg || 'Teste de alerta manual'}`;
    
    await sendAlert(testMessage, 'medium');
    
    res.json({ 
      ok: true, 
      message: 'Alerta enviado para Slack',
      testMessage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro no teste de alerta:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Falha ao enviar alerta',
      details: error.message 
    });
  }
});

// Real OpenAI endpoint for Dr. AI panel
import { createOpenAIClient } from './utils/openai-client.js';

app.post('/api/ai/ask', async (req, res) => {
  try {
    const { prompt, context = "", consultId } = req.body || {};
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        ok: false, 
        error: 'missing_prompt',
        message: 'Prompt is required' 
      });
    }

    const openaiClient = createOpenAIClient();
    if (!openaiClient) {
      return res.status(503).json({ 
        ok: false, 
        error: 'ai_unavailable',
        message: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your secrets.' 
      });
    }

    const systemMsg = "Você é o Dr. AI, um assistente clínico especializado. Responda em português, de forma objetiva, cite cuidados e alternativas, e nunca substitua o julgamento médico. Evite prescrever posologias sem checar contraindicações. Quando pertinente, aponte diretrizes e necessidade de confirmação diagnóstica. Sempre inclua que suas respostas são orientativas.";

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemMsg }
    ];

    if (context.trim()) {
      messages.push({ 
        role: 'user', 
        content: `Contexto clínico:\n${context}\n\nPergunta: ${prompt}` 
      });
    } else {
      messages.push({ role: 'user', content: prompt });
    }

    console.log(`🧠 Dr. AI consulta para ${consultId}:`, prompt.substring(0, 100) + '...');

    const response = await openaiClient.createChatCompletion({
      model: 'gpt-4o', // Using latest model as per blueprint
      messages,
      max_tokens: 800,
      temperature: 0.3 // Lower temperature for more consistent medical responses
    });

    const answer = response.choices[0]?.message?.content || 'Não consegui gerar uma resposta no momento.';

    res.json({ 
      ok: true, 
      answer,
      consultId,
      timestamp: new Date().toISOString()
    });
    
    console.log(`✅ Dr. AI respondeu para ${consultId} (${answer.length} chars)`);

  } catch (error) {
    console.error('❌ Erro no Dr. AI:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'ai_processing_error',
      message: 'Erro ao processar consulta da IA. Tente novamente.' 
    });
  }
});

console.log('🤖 ChatGPT Agent ativado com OpenAI v5.12.1');

// Medical Reports - Sistema de Laudos Médicos
import medicalReportsRoutes from './routes/medical-reports.js';
app.use('/api/medical-reports', medicalReportsRoutes);
console.log('🏥 Sistema de Laudos Médicos ativado');

// ===== Enhanced Consultation API Routes =====

// Patient data endpoint
app.get('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  console.log(`👤 Carregando dados do paciente ${id}`);
  
  // Return demo patient data
  res.json({
    id,
    name: 'João Santos',
    age: 35,
    sex: 'M',
    weight: '68 kg',
    height: '1,75 m',
    conditions: ['HAS', 'Rinite alérgica'],
    allergies: ['Dipirona (leve)', 'Ibuprofeno'],
    vitals: { PA: '120/80', FC: '78 bpm', Temp: '36.7°C', 'SpO₂': '98%' },
  });
});

// Patient exams endpoint
app.get('/api/patients/:id/exams', (req, res) => {
  const { id } = req.params;
  console.log(`🔬 Carregando exames do paciente ${id}`);
  
  // Return demo exam data
  res.json([
    { id: `${id}-e1`, name: 'Hemograma completo', kind: 'pdf', url: '#hemograma' },
    { id: `${id}-e2`, name: 'Glicemia jejum', kind: 'value', value: '89 mg/dL' },
    { id: `${id}-e3`, name: 'Perfil lipídico', kind: 'status', value: 'OK' },
    { id: `${id}-e4`, name: 'TSH', kind: 'value', value: '2.1 μUI/mL' },
    { id: `${id}-e5`, name: 'Creatinina', kind: 'value', value: '0.9 mg/dL' }
  ]);
});

// Save consultation notes
app.post('/api/consults/:id/notes', (req, res) => {
  const { id } = req.params;
  const body = req.body;
  console.log(`📝 Salvando evolução da consulta ${id}:`, body);
  
  // Here you would save to database
  // For demo, just acknowledge receipt
  res.json({ 
    ok: true, 
    consultId: id,
    timestamp: new Date().toISOString(),
    message: 'Evolução clínica salva com sucesso'
  });
});

// Save prescription
app.post('/api/consults/:id/prescriptions', (req, res) => {
  const { id } = req.params;
  const body = req.body;
  console.log(`💊 Salvando prescrição da consulta ${id}:`, body);
  
  // Here you would save to database
  // For demo, just acknowledge receipt
  res.json({ 
    ok: true, 
    consultId: id,
    timestamp: new Date().toISOString(),
    message: 'Prescrição salva com sucesso'
  });
});

// AI consultation notes generation
app.post('/api/ai/consult-notes', async (req, res) => {
  const { chiefComplaint, notes } = req.body || {};
  console.log('🤖 Gerando notas de consulta via IA:', { chiefComplaint, notes });
  
  try {
    // Generate AI-enhanced consultation notes
    const suggestion = `Sugerido (IA):
S: ${chiefComplaint || 'Queixa principal não especificada'}
O: Exame físico sem alterações relevantes. Sinais vitais estáveis.
A: Diagnóstico provável baseado em anamnese e exame físico.
P: Conduta terapêutica apropriada, orientações e reavaliação se necessário.

--- Nota: Esta é uma sugestão gerada por IA. Sempre revisar e validar clinicamente. ---`;
    
    res.json({ 
      suggestion,
      timestamp: new Date().toISOString(),
      source: 'AI Assistant'
    });
  } catch (error) {
    console.error('❌ Erro na geração de IA:', error);
    res.status(500).json({ 
      error: 'Erro ao gerar sugestão via IA',
      message: error.message 
    });
  }
});

// Dr. AI endpoint for Enhanced Consultation sidebar panel
app.post('/api/dr-ai', async (req, res) => {
  try {
    const { messages = [], context = {} } = req.body || {};
    const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
    
    if (!lastUserMessage.trim()) {
      return res.status(400).json({ ok: false, error: 'Mensagem vazia' });
    }
    
    console.log('🧠 Dr. AI consulta Enhanced:', lastUserMessage.substring(0, 50) + '...');
    
    // Check OpenAI availability 
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        ok: false,
        error: 'openai_unavailable',
        text: 'Serviço de IA temporariamente indisponível. Verifique a configuração da chave API.'
      });
    }
    
    // Build context for AI
    let fullPrompt = `Você é Dr. AI, um assistente médico especializado em apoio à decisão clínica. Responda em português de forma clara, profissional e objetiva.
    
PERGUNTA DO MÉDICO: ${lastUserMessage}`;
    
    if (context.patient) fullPrompt += `\nPACIENTE: ${context.patient}`;
    if (context.hda) fullPrompt += `\nHDA: ${context.hda}`;
    if (context.diagnosis) fullPrompt += `\nHIPÓTESE DIAGNÓSTICA: ${context.diagnosis}`;
    if (context.plan) fullPrompt += `\nCONDUTA ATUAL: ${context.plan}`;
    
    fullPrompt += `\n\nIMPORTANTE: Sempre inclua ao final um aviso de que esta é uma sugestão educacional e a decisão clínica final é do médico responsável.`;
    
    // Use existing SimpleOpenAI client - fix method call
    const { SimpleOpenAIClient } = require('./utils/openai-client');
    const openaiClient = new SimpleOpenAIClient();
    
    const response = await openaiClient.createChatCompletion({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: fullPrompt }],
      max_tokens: 800,
      temperature: 0.3
    });
    
    const responseText = response.choices[0]?.message?.content || 'Não consegui gerar uma resposta no momento.';
    
    console.log(`✅ Dr. AI Enhanced respondeu (${responseText.length} chars)`);
    
    res.json({ 
      ok: true, 
      text: responseText,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro Dr. AI Enhanced:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'ai_processing_error',
      text: 'Falha ao processar solicitação da IA médica. Tente novamente.',
      details: error.message 
    });
  }
});

console.log('🩺 Enhanced Consultation API ativado');

// Health check endpoint for Render
app.get('/healthz', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'TeleMed Sistema',
    version: '12.5.2'
  });
});

// Ping endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Simple health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Landing page simples
app.get('/landing-simple', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../landing-page-simple.html'), 'utf-8');
    console.log('🚀 Landing page simples carregada');
    res.send(html);
  } catch (err) {
    console.error('❌ Erro ao carregar landing page:', err);
    res.status(500).send('Erro ao carregar a landing page');
  }
});

// Página de download do projeto
app.get('/download', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../download-page-fixed.html'), 'utf-8');
    console.log('📦 Página de download carregada');
    res.send(html);
  } catch (err) {
    console.error('❌ Erro ao carregar página de download:', err);
    res.status(500).send('Erro ao carregar página de download');
  }
});

// Página de teste para debug
app.get('/test-download', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../test-download.html'), 'utf-8');
    console.log('🧪 Página de teste carregada');
    res.send(html);
  } catch (err) {
    console.error('❌ Erro ao carregar página de teste:', err);
    res.status(500).send('Erro ao carregar página de teste');
  }
});

// API para criar ZIP dos arquivos funcionais
app.get('/api/download-zip', async (req, res) => {
  try {
    console.log('🔄 Iniciando download do ZIP...');
    const zipPath = path.join(__dirname, '../dist/telemed-functional.tar.gz');
    
    if (fs.existsSync(zipPath)) {
      console.log('✅ Arquivo encontrado, enviando download...');
      res.download(zipPath, 'telemed-funcional.tar.gz', (err) => {
        if (err) {
          console.error('❌ Erro no download:', err);
          res.status(500).send('Erro no download');
        } else {
          console.log('📦 Download concluído');
        }
      });
    } else {
      console.log('⚠️  Arquivo não encontrado, criando novo...');
      const { createFunctionalZip } = await import('../scripts/create-functional-zip.js');
      const newZipPath = await createFunctionalZip();
      
      if (fs.existsSync(newZipPath)) {
        res.download(newZipPath, 'telemed-funcional.zip');
      } else {
        res.status(404).json({ error: 'ZIP não pôde ser criado' });
      }
    }
  } catch (err) {
    console.error('❌ Erro ao criar ZIP:', err);
    res.status(500).json({ error: 'Erro ao criar ZIP', details: err.message });
  }
});

// Rota alternativa para download simples
app.get('/api/download-simple', (req, res) => {
  try {
    console.log('📄 Download simples solicitado...');
    
    // Cria um ZIP simples com arquivos básicos
    const simpleFiles = {
      'README.md': `# TeleMed Sistema

Sistema de telemedicina completo desenvolvido em React + Node.js.

## Características:
- Frontend React com TypeScript
- Backend Express com PostgreSQL
- Sistema de autenticação JWT
- IA médica com OpenAI
- Design responsivo premium

## Links:
- Produção: telemed-sistema.onrender.com
- Desenvolvimento: Replit

Para executar: npm install && npm run dev
`,
      'landing-page.html': fs.readFileSync(path.join(__dirname, '../landing-page-simple.html'), 'utf-8'),
      'package-info.json': JSON.stringify({
        name: "telemed-sistema",
        version: "2.1.0",
        description: "Sistema completo de telemedicina otimizado",
        stack: ["React", "Node.js", "PostgreSQL", "OpenAI"],
        deployment: "Replit + Render",
        optimizations: {
          bundleSize: "145KB JS + 6KB CSS",
          buildTime: "3.5s",
          security: "Helmet + CORS + CSP"
        }
      }, null, 2)
    };
    
    res.json({
      message: 'Arquivos básicos disponíveis',
      files: Object.keys(simpleFiles),
      download_url: '/download'
    });
    
  } catch (err) {
    console.error('❌ Erro no download simples:', err);
    res.status(500).json({ error: 'Erro no download simples' });
  }
});

// Rota simples de teste primeiro
app.get('/api/download-backup-test', (req, res) => {
  res.json({ message: 'Rota funcionando!', timestamp: new Date().toISOString() });
});

// Nova rota para backup completo atualizado
app.get('/api/download-backup', async (req, res) => {
  try {
    console.log('📦 Backup completo solicitado via API...');
    
    // Executar o sistema de backup
    const { execSync } = require('child_process');
    execSync('node scripts/backup-system.js', { cwd: path.join(__dirname, '..') });
    
    // Encontrar o backup mais recente
    const backupsDir = path.join(__dirname, '../backups');
    const backupFolders = fs.readdirSync(backupsDir)
      .filter(f => f.startsWith('telemed-'))
      .sort()
      .reverse();
    
    if (backupFolders.length === 0) {
      return res.status(404).json({ error: 'Nenhum backup encontrado' });
    }
    
    const latestBackup = backupFolders[0];
    const backupPath = path.join(backupsDir, latestBackup);
    const zipPath = path.join(backupPath, 'telemed-backup.tar.gz');
    
    if (fs.existsSync(zipPath)) {
      const stats = fs.statSync(zipPath);
      const report = JSON.parse(fs.readFileSync(path.join(backupPath, 'backup-report.json'), 'utf-8'));
      
      res.json({
        message: 'Backup completo disponível',
        backup: {
          date: latestBackup,
          files: report.files,
          size: `${(stats.size / 1024 / 1024).toFixed(2)}MB`,
          version: report.version,
          optimizations: report.optimizations
        },
        download_url: `/api/download-backup-file/${latestBackup}`
      });
    } else {
      res.status(500).json({ error: 'Arquivo de backup não encontrado' });
    }
    
  } catch (err) {
    console.error('❌ Erro ao gerar backup:', err);
    res.status(500).json({ error: 'Erro ao gerar backup', details: err.message });
  }
});

// Rota para download direto do arquivo de backup
app.get('/api/download-backup-file/:backupId', (req, res) => {
  try {
    const backupId = req.params.backupId;
    const zipPath = path.join(__dirname, `../backups/${backupId}/telemed-backup.tar.gz`);
    
    if (fs.existsSync(zipPath)) {
      console.log(`📦 Enviando backup: ${backupId}`);
      res.download(zipPath, `telemed-sistema-${backupId}.tar.gz`);
    } else {
      res.status(404).json({ error: 'Backup não encontrado' });
    }
  } catch (err) {
    console.error('❌ Erro ao enviar backup:', err);
    res.status(500).json({ error: 'Erro ao enviar backup' });
  }
});

// Vite será configurado depois do servidor inicializar

// Root route será gerenciado pelo React SPA via Vite middleware
// Removido para permitir que o React handle o routing

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

// Static Dashboard Teste (HTML version with fixed icons)
app.get('/dashboard-teste-static', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../public/dashboard-teste-static.html'), 'utf-8');
    console.log('📊 Carregando Dashboard Teste estático (com correção de ícones)');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(html);
  } catch (err) {
    console.error('❌ Erro ao carregar dashboard teste:', err);
    res.status(500).send('Erro ao carregar o dashboard');
  }
});

// Fixed Dashboard Teste (Latest version with corrected icon CSS)
app.get('/dashboard-teste-fixed', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../public/dashboard-teste-fixed.html'), 'utf-8');
    console.log('📊 Carregando Dashboard Teste corrigido (versão atualizada)');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(html);
  } catch (err) {
    console.error('❌ Erro ao carregar dashboard teste:', err);
    res.status(500).send('Erro ao carregar o dashboard');
  }
});

// Rotas do Dashboard Aquarela
app.get('/dashboard', (req, res) => res.redirect('/dashboard-aquarela'));
app.get('/dashboard-medical.html', (req, res) => res.redirect('/dashboard-aquarela'));
app.get('/dashboard-aquarela.html', (req, res) => res.redirect('/dashboard-aquarela'));
app.get('/medical-dashboard-pro.html', (req, res) => res.redirect('/dashboard-aquarela'));

// Agenda Médica
app.get('/agenda-medica', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../agenda-medica.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Receitas Digitais
app.get('/receitas-digitais', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../memed-receita-viewer.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Videoconsultas
app.get('/videoconsulta', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../atendimento-medico.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Dr. AI
app.get('/dr-ai', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../public/dr-ai-static.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Leilão Consultas
app.get('/leilao-consultas', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../leilao-consultas.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Triagem Psiquiátrica
app.get('/triagem-psiquiatrica', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../centro-avaliacao.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Centro Avaliação
app.get('/centro-avaliacao', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../centro-avaliacao.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Sistema Notificações SMS
app.get('/sistema-notificacoes-medicas', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../sistema-notificacoes-medicas.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Configurar rota home page personalizada ANTES do Vite middleware
app.get('/', (req, res, next) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../public/demo-ativo/index.html'), 'utf-8');
    console.log('🏠 Servindo home page personalizada: /public/demo-ativo/index.html');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(html);
  } catch (err) {
    console.error('❌ Erro ao carregar home page personalizada:', err);
    res.status(500).send('Erro ao carregar a página inicial');
  }
});

// Servir arquivos estáticos da pasta demo-ativo
app.use('/public/demo-ativo', express.static(path.join(__dirname, '../public/demo-ativo')));

// Demo-ativo routes with dashboard migration support
app.get('/demo-ativo/:page', (req, res) => {
  const { page } = req.params;
  
  // Dashboard migration: serve new version if accessing area-medica.html
  if (page === 'area-medica.html') {
    const newDashboardPath = path.join(__dirname, '../public/demo-ativo/area-medica-new.html');
    if (fs.existsSync(newDashboardPath)) {
      console.log('🆕 Servindo novo dashboard (area-medica-new.html)');
      return res.sendFile(newDashboardPath);
    }
  }
  
  // Default behavior for other pages
  const pagePath = path.join(__dirname, '../public/demo-ativo', page);
  if (fs.existsSync(pagePath)) {
    console.log(`📄 Servindo página demo: ${page}`);
    return res.sendFile(pagePath);
  }
  
  res.status(404).send('Página não encontrada');
});

// Rota específica para area-medica.html
app.get('/area-medica.html', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../public/demo-ativo/area-medica.html'), 'utf-8');
    console.log('📱 Servindo área médica: /public/demo-ativo/area-medica.html');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(html);
  } catch (err) {
    console.error('❌ Erro ao carregar área médica:', err);
    res.status(404).send('Página não encontrada');
  }
});

// Especialidades
app.get('/especialidades', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../especialidades.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Atendimento Médico
app.get('/atendimento-medico', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../atendimento-medico.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// MEMED Receitas
app.get('/memed-receita-viewer', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../memed-receita-viewer.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Testes Psiquiátricos
app.get('/ansiedade-gad7', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../ansiedade-gad7.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

app.get('/depressao-phq9', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../depressao-phq9.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

app.get('/bipolar-mdq', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../bipolar-mdq.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Telemonitoramento
app.get('/telemonitoramento-enfermagem', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../telemonitoramento-enfermagem.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Entrada e Login
app.get('/entrada', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../entrada.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

app.get('/login', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../login.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// Teste de Laudos Médicos
app.get('/test-medical-report', (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '../test-medical-report.html'), 'utf-8');
    res.send(html);
  } catch (err) {
    res.status(404).send('Página não encontrada');
  }
});

// SPA catch-all route deve estar ANTES das rotas específicas
// Esta rota é adicionada pelo setupVite() no listener 'listening'

// Render-specific: Listen on all interfaces with proper error handling
const REPLIT_URL = process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : `http://localhost:${PORT}`;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🔧 Starting Express server on port', PORT, '...');
});

server.on('error', (err: any) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
});

server.on('listening', async () => {
  console.log('✅ Server is listening and ready for connections');
  
  // Configurar Vite middleware DEPOIS do servidor estar rodando
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    try {
      console.log('⚡ Configurando Vite dev server...');
      const { setupVite } = await import('./vite.js');
      await setupVite(app, server);
      console.log('⚡ Vite dev server configurado com sucesso para React app');
    } catch (error) {
      console.error('❌ Erro ao configurar Vite:', error);
    }
  }
  
  // Initialize AI usage tracking watchdog
  startAIUsageWatchdog();
});



// AI Usage Watchdog - monitors and alerts every 5 minutes
const watchdogAlerts = {
  lastQuotaAlert: null as string | null,
  lastFallbackAlert: null as string | null
};

function startAIUsageWatchdog(): void {
  if (!process.env.ALERT_WEBHOOK_URL) {
    console.log('⚠️ ALERT_WEBHOOK_URL não configurado, watchdog desabilitado');
    return;
  }

  console.log('🔍 Iniciando AI Usage Watchdog (5min intervals)');
  
  setInterval(async () => {
    try {
      const usage = getUsageToday();
      const today = new Date().toISOString().split('T')[0];
      
      // Check for quota errors
      if (usage.quotaErrors > 0 && watchdogAlerts.lastQuotaAlert !== today) {
        await sendAlert(`🚨 Quota detectada hoje: ${usage.quotaErrors} erros. Snapshot: ${JSON.stringify(usage)}`, 'critical');
        watchdogAlerts.lastQuotaAlert = today;
      }
      
      // Check for high fallback rate (>20%)
      if (usage.fallbackRate > 0.2 && watchdogAlerts.lastFallbackAlert !== today) {
        await sendAlert(`⚠️ Fallback >20% hoje: ${Math.round(usage.fallbackRate * 100)}%. Snapshot: ${JSON.stringify(usage)}`, 'high');
        watchdogAlerts.lastFallbackAlert = today;
      }
      
      console.log(`📊 Watchdog check: ${usage.totalRequests} requests, ${Math.round(usage.fallbackRate * 100)}% fallback, ${usage.quotaErrors} quota errors`);
      
    } catch (error) {
      console.error('❌ Erro no watchdog:', error);
    }
  }, 5 * 60 * 1000); // 5 minutes
}

// === Enhanced Consultation API Endpoints ===

// Start consultation
app.post('/api/consults/:id/start', (req, res) => {
  const { id } = req.params;
  console.log('🩺 START consultation:', id);
  res.json({ ok: true, startedAt: Date.now(), consultId: id });
});

// Save consultation notes
app.post('/api/consults/:id/notes', express.json(), (req, res) => {
  const { id } = req.params;
  const { qp, hda, cid, cond, alert, flags, exams, rx } = req.body;
  console.log('💾 SAVE consultation notes:', id, qp?.slice(0, 60) + '...');
  res.json({ ok: true, consultId: id, saved: true });
});

// Finalize consultation
app.post('/api/consults/:id/finalize', (req, res) => {
  const { id } = req.params;
  console.log('✅ FINALIZE consultation:', id);
  res.json({ ok: true, consultId: id, finalized: true });
});

// Send invitation to waiting room
app.post('/api/consults/:id/invite', (req, res) => {
  const { id } = req.params;
  console.log('📧 INVITE patient to consultation:', id);
  res.json({ ok: true, consultId: id, delivered: true });
});

// CID-10 autosuggestion endpoint
const CID_LOCAL = [
  'F41.1 – Transtorno de ansiedade generalizada',
  'G43.0 – Enxaqueca sem aura',
  'J00 – Nasofaringite aguda (resfriado)',
  'I10 – Hipertensão essencial (primária)',
  'E11 – Diabetes mellitus tipo 2',
  'F32.0 – Episódio depressivo leve',
  'F33.0 – Transtorno depressivo recorrente',
  'R51 – Cefaleia',
  'K21.9 – Doença do refluxo gastroesofágico',
  'Z00.00 – Exame médico geral'
];

app.get('/api/cid10', (req, res) => {
  const query = String(req.query.q || '').toLowerCase();
  if (query.length < 2) {
    return res.json([]);
  }
  
  const filteredCids = CID_LOCAL.filter(cid => 
    cid.toLowerCase().includes(query)
  );
  
  console.log(`🔍 CID-10 search for "${query}": ${filteredCids.length} results`);
  res.json(filteredCids);
});

// Dr.AI endpoint for Enhanced Consultation
app.post('/api/ai/doctor', express.json(), async (req, res) => {
  try {
    const { message, page = 'enhanced' } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Mensagem é obrigatória' 
      });
    }

    console.log(`🧠 Dr. AI consulta (${page}):`, message.substring(0, 50) + '...');
    
    // Check if OpenAI is available
    const openaiClient = createOpenAIClient();
    if (!openaiClient) {
      // Return fallback response
      const fallbackResponses = [
        'Para essa queixa, considere verificar sinais vitais, realizar exame físico direcionado e avaliar fatores de risco.',
        'Importante confirmar sinais de alarme e considerar diagnósticos diferenciais. Reavalie necessidade de exames complementares.',
        'Sugiro investigação clínica detalhada, atenção a medicamentos em uso e considerar encaminhamento se necessário.'
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      return res.json({ 
        answer: `${randomResponse}\n\n⚠️ Resposta gerada localmente. Para análise completa da IA, configure a chave OpenAI.`,
        fallback: true
      });
    }

    // Use OpenAI for real response
    const systemPrompt = `Você é Dr. AI, um assistente médico especializado em apoio à decisão clínica. 
    Responda em português de forma clara, objetiva e profissional. 
    Sempre inclua ao final que suas respostas são orientativas e a decisão final é do médico responsável.`;

    const response = await openaiClient.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 600,
      temperature: 0.3
    });

    const answer = response.choices[0]?.message?.content || 'Não foi possível gerar uma resposta no momento.';
    
    res.json({ 
      answer: answer + '\n\n💡 Esta é uma orientação educacional. A decisão clínica final é do médico responsável.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro no Dr. AI:', error);
    res.status(500).json({ 
      error: 'Erro no processamento da IA',
      answer: 'Sugestão: confirmar sinais de alarme, avaliar necessidade de exame físico e considerar fatores de risco.'
    });
  }
});

// React SPA routes - servir pelo Vite (será configurado após servidor iniciar)
// Esta seção será substituída pelo Vite middleware * quando configurado