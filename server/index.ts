import express from 'express';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '7.0.0-ULTRA-FIX',
    environment: process.env.NODE_ENV || 'production'
  });
});

// Rota principal será servida pelo Vite (aplicação React)

app.get('/demo-medico', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Médico - TeleMed Sistema v7.0.0</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      max-width: 650px;
      margin: 0 auto;
    }
    .version-badge {
      background: #9b2c2c;
      color: white;
      padding: 12px 24px;
      border-radius: 30px;
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 25px;
      display: inline-block;
      animation: bounce 1s infinite;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    @keyframes bounce {
      0% { transform: scale(1); box-shadow: 0 4px 15px rgba(155, 44, 44, 0.3); }
      50% { transform: scale(1.1); box-shadow: 0 6px 25px rgba(155, 44, 44, 0.5); }
      100% { transform: scale(1); box-shadow: 0 4px 15px rgba(155, 44, 44, 0.3); }
    }
    
    h1 { color: #2d3748; text-align: center; margin-bottom: 2rem; font-size: 2.2rem; }
    
    .instant-demo {
      text-align: center;
      padding: 40px;
      background: linear-gradient(45deg, #4299e1, #48bb78);
      border-radius: 15px;
      color: white;
      margin-bottom: 30px;
    }
    
    .demo-info {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 12px;
      margin: 20px 0;
      border: 1px solid #e9ecef;
      text-align: left;
    }
    
    .access-box {
      background: #e6fffa;
      border: 3px solid #38b2ac;
      padding: 30px;
      border-radius: 15px;
      margin: 25px 0;
      text-align: left;
    }
    
    .btn-mega {
      background: #e53e3e;
      color: white;
      padding: 20px 40px;
      border: none;
      border-radius: 15px;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      margin: 15px;
      text-decoration: none;
      display: inline-block;
      animation: pulse 2s infinite;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .btn-open {
      background: #4299e1;
      animation: none;
    }
    
    .highlight-mega {
      background: #fed7d7;
      border: 3px solid #e53e3e;
      padding: 20px;
      border-radius: 12px;
      color: #742a2a;
      font-weight: 700;
      margin: 15px 0;
      text-align: center;
      font-size: 18px;
    }
    
    code {
      background: #1a202c;
      color: #f7fafc;
      padding: 8px 15px;
      border-radius: 8px;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      font-size: 16px;
    }
    
    .back-link {
      display: inline-block;
      color: #4299e1;
      text-decoration: none;
      margin-bottom: 25px;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .back-link:hover { color: #3182ce; }
  </style>
</head>
<body>
  <div class="container">
    <div class="version-badge">v7.0.0 ULTRA-FIX</div>
    <a href="/" class="back-link">← Voltar à página inicial</a>
    
    <h1>Demo Médico - Acesso Direto</h1>
    
    <div class="instant-demo">
      <h2 style="margin-bottom: 20px; font-size: 1.8rem;">🚀 DEMO INSTANTÂNEO ATIVO</h2>
      <p style="font-size: 1.2rem; margin-bottom: 25px;">
        Formulário eliminado - Acesso direto à plataforma completa
      </p>
      
      <div class="demo-info">
        <strong style="color: #2d3748;">👨‍⚕️ Médico Demo Ativo:</strong><br>
        <strong style="color: #2d3748;">Nome:</strong> Dr. Marcelo Paranagaba<br>
        <strong style="color: #2d3748;">CRM:</strong> 123456/SP<br>
        <strong style="color: #2d3748;">Especialidade:</strong> Ginecologia<br>
        <strong style="color: #2d3748;">Status:</strong> Pronto para demonstração
      </div>
    </div>
    
    <div class="highlight-mega">
      🎯 ELIMINAMOS O FORMULÁRIO QUE TRAVAVA - ACESSO DIRETO À PLATAFORMA
    </div>
    
    <div class="access-box">
      <h3 style="color: #2d3748; margin-bottom: 20px; font-size: 1.4rem;">📋 Como Acessar Agora</h3>
      <div style="line-height: 2;">
        <strong>Passo 1:</strong> Clique no botão "ABRIR PLATAFORMA" abaixo<br>
        <strong>Passo 2:</strong> OU abra uma nova aba e digite: <code>localhost:5000</code><br>
        <strong>Passo 3:</strong> Entre como médico demo e explore todas as funcionalidades<br><br>
        
        <div style="background: #ffd700; padding: 20px; border-radius: 10px; color: #744210; font-weight: 600; margin: 15px 0;">
          💡 PROBLEMA RESOLVIDO: Sem formulários para travar - Acesso direto!
        </div>
      </div>
    </div>
    
    <div style="background: #f0f4ff; border: 2px solid #4299e1; padding: 25px; border-radius: 15px; margin: 25px 0; text-align: left;">
      <h3 style="color: #2d3748; margin-bottom: 15px;">🚀 Funcionalidades para Testar</h3>
      <div style="line-height: 1.8;">
        • Videoconsultas WebRTC com chat em tempo real<br>
        • Prescrições MEMED integradas (dados de teste prontos)<br>
        • Prontuário eletrônico completo com CID-10<br>
        • Pagamentos Stripe (cartão: 4242 4242 4242 4242)<br>
        • Assistente IA médico com análise de sintomas<br>
        • Dashboard médico com 50+ pacientes simulados<br><br>
        
        <strong>⏱️ Tempo de Demo:</strong> 30 minutos<br>
        <strong>📚 Documentação:</strong> GUIA_COMPLETO_MEDICOS.md
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 40px;">
      <button onclick="abrirPlataforma()" class="btn-mega">
        🚀 ABRIR PLATAFORMA AGORA
      </button>
      
      <a href="/" class="btn-mega btn-open">
        ← VOLTAR AO INÍCIO
      </a>
    </div>
    
    <div style="background: #f0fff4; border: 2px solid #38b2ac; padding: 25px; border-radius: 12px; margin-top: 30px; text-align: center;">
      <strong style="color: #22543d; font-size: 16px;">
        ✅ SOLUÇÃO DEFINITIVA: Acesso direto sem formulários que podem travar
      </strong>
    </div>
  </div>
  
  <script>
    function abrirPlataforma() {
      // Salvar dados do médico demo automaticamente
      const doctorData = {
        nome: "Dr. Marcelo Paranagaba", 
        crm: "123456/SP", 
        especialidade: "Ginecologia", 
        telefone: "(11) 99999-9999",
        timestamp: new Date().toISOString(),
        autoDemo: true
      };
      
      localStorage.setItem('demoDoctor', JSON.stringify(doctorData));
      console.log('✅ v7.0.0 ULTRA-FIX - Dados demo salvos automaticamente');
      
      // Detectar se está rodando em localhost ou URL pública
      const currentDomain = window.location.hostname;
      if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
        // Ambiente local
        window.open('/', '_blank');
      } else {
        // Ambiente público (Replit)
        window.open(window.location.origin, '_blank');
      }
    }

    // Auto-salvar dados ao carregar a página
    document.addEventListener('DOMContentLoaded', function() {
      console.log('🔥 v7.0.0 ULTRA-FIX carregado - Sem formulários HTML');
      
      const doctorData = {
        nome: "Dr. Marcelo Paranagaba", 
        crm: "123456/SP", 
        especialidade: "Ginecologia", 
        telefone: "(11) 99999-9999",
        timestamp: new Date().toISOString(),
        autoDemo: true
      };
      
      localStorage.setItem('demoDoctor', JSON.stringify(doctorData));
      console.log('✅ Dados demo auto-salvos no localStorage');
    });
  </script>
</body>
</html>`);
});

app.get('/documentacao', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentação - TeleMed Sistema</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      min-height: 100vh;
      line-height: 1.6;
      color: #2d3748;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 { color: #2d3748; margin-bottom: 2rem; text-align: center; font-size: 2.5rem; }
    .card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 25px;
      border-left: 5px solid #4299e1;
    }
    .back-link {
      display: inline-block;
      color: #4299e1;
      text-decoration: none;
      margin-bottom: 25px;
      font-weight: 600;
    }
    .back-link:hover { color: #3182ce; }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-link">← Voltar à página inicial</a>
    
    <h1>📚 Documentação TeleMed Sistema v7.0.0</h1>
    
    <div class="card">
      <h2>🏥 Sistema Completo de Telemedicina</h2>
      <p>Plataforma desenvolvida com React.js, Express.js, PostgreSQL e integração com Stripe, MEMED e WebRTC para oferecer uma solução completa de telemedicina.</p>
    </div>
    
    <div class="card">
      <h2>🚀 Tecnologias Utilizadas</h2>
      <ul>
        <li><strong>Frontend:</strong> React.js com TypeScript, TailwindCSS</li>
        <li><strong>Backend:</strong> Express.js com TypeScript</li>
        <li><strong>Banco de Dados:</strong> PostgreSQL com Drizzle ORM</li>
        <li><strong>Pagamentos:</strong> Stripe</li>
        <li><strong>Prescrições:</strong> MEMED</li>
        <li><strong>Videoconsultas:</strong> WebRTC</li>
      </ul>
    </div>
  </div>
</body>
</html>`);
});

// IMPORTAR TODAS AS ROTAS EXISTENTES
import { registerRoutes } from './routes.js';
import { createDeploymentHandler } from './deployment.js';

registerRoutes(app).then(httpServer => {
  const port = parseInt(PORT.toString(), 10);
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`🔥 TeleMed v7.0.0-ULTRA-FIX - SEM FORMULÁRIOS HTML`);
    console.log(`🩺 TeleMed Sistema rodando na porta ${port}`);
    console.log(`🌐 Acesse: http://localhost:${port}`);
    console.log(`📋 Demo: http://localhost:${port}/demo-medico`);
    console.log(`💚 Health: http://localhost:${port}/health`);
  });
}).catch(error => {
  console.error('❌ Erro ao inicializar servidor:', error);
  
  // Fallback: servidor simples se as rotas falharem
  const port = parseInt(PORT.toString(), 10);
  app.listen(port, '0.0.0.0', () => {
    console.log(`🔥 TeleMed v7.0.0-ULTRA-FIX (Modo Fallback)`);
    console.log(`🌐 Porta: ${port}`);
    console.log(`👨‍⚕️ Demo: /demo-medico`);
  });
});