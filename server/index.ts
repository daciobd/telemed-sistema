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

// Rota raiz será definida após registerRoutes

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
          💡 PROBLEMA RESOLVIDO: Sem formulários para travar - Acesso direto!<br>
          🌐 Use o botão VERDE se o vermelho não funcionar<br><br>
          
          <strong>Se não vir o botão verde, copie este link:</strong><br>
          <code style="background: white; padding: 10px; display: block; margin-top: 10px; color: #2563eb; font-size: 14px;">
          https://telemed-consultation-daciobd.replit.app
          </code>
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
      <button onclick="abrirPlataformaPublica()" class="btn-mega">
        🚀 ABRIR PLATAFORMA AGORA
      </button>
      
      <a href="https://telemed-consultation-daciobd.replit.app" target="_blank" class="btn-mega" style="background: #10b981; margin-left: 15px; font-size: 18px; padding: 20px 30px; border: 3px solid #059669;">
        🌐 LINK DIRETO PÚBLICO
      </a>
      
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
    
    // Função específica para URL pública do Replit
    function abrirPlataformaPublica() {
      console.log('🚀 Abrindo plataforma via URL pública do Replit');
      
      // SEMPRE usar URL pública - nunca localhost
      const publicUrl = 'https://telemed-consultation-daciobd.replit.app';
      
      console.log('🌐 URL de destino:', publicUrl);
      console.log('🔧 Forçando abertura em nova aba para evitar conflitos');
      
      // Sempre usar window.open em nova aba para evitar problemas de redirecionamento
      try {
        const newWindow = window.open(publicUrl, '_blank', 'noopener,noreferrer,width=1200,height=800');
        console.log('✅ Nova aba aberta para:', publicUrl);
        
        if (!newWindow) {
          alert('Por favor, permita popups para este site e tente novamente.\\n\\nOu acesse diretamente: ' + publicUrl);
        }
      } catch (error) {
        console.error('❌ Erro ao abrir nova aba:', error);
        alert('Acesse diretamente: ' + publicUrl);
      }
    }
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

// Configurar autenticação demo antes das rotas principais
app.get('/api/auth/demo-login', (req, res) => {
  // Simular login do médico demo
  const demoUser = {
    id: 'demo_doctor_marcelo',
    email: 'marcelo@demo.com',
    firstName: 'Marcelo',
    lastName: 'Paranagaba',
    role: 'doctor',
    specialty: 'Ginecologia',
    licenseNumber: '123456/SP'
  };
  
  if (req.session) {
    req.session.userId = demoUser.id;
    req.session.user = demoUser;
  }
  
  res.json({ user: demoUser, message: 'Demo login successful' });
});

registerRoutes(app).then(httpServer => {
  // Adicionar rota raiz por último para garantir prioridade
  app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TeleMed Sistema - Plataforma de Telemedicina</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 600px;
    }
    h1 {
      color: #2d3748;
      margin-bottom: 20px;
    }
    .btn {
      background: #3182ce;
      color: white;
      padding: 15px 30px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      margin: 10px;
      transition: all 0.3s;
    }
    .btn:hover {
      background: #2c5282;
      transform: translateY(-2px);
    }
    .btn-green {
      background: #38a169;
    }
    .btn-green:hover {
      background: #2f855a;
    }
    .solution {
      background: #e6fffa;
      border: 2px solid #38b2ac;
      padding: 25px;
      border-radius: 12px;
      margin: 25px 0;
      text-align: left;
    }
    .url-box {
      background: #f7fafc;
      border: 2px solid #4299e1;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
      font-family: monospace;
      font-size: 14px;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🩺 TeleMed Sistema</h1>
    <p>Plataforma de Telemedicina Avançada</p>
    
    <div class="solution">
      <strong>✅ PROBLEMA RESOLVIDO!</strong><br>
      Sistema funcionando corretamente. Use o botão verde abaixo para acessar a demonstração via URL pública.
    </div>
    
    <a href="/demo-medico" class="btn">
      📋 Demo Local
    </a>
    
    <a href="https://telemed-consultation-daciobd.replit.app/demo-medico" class="btn btn-green" target="_blank">
      🌐 DEMO VIA URL PÚBLICA
    </a>
    
    <div class="url-box">
      Para colegas médicos: https://telemed-consultation-daciobd.replit.app/demo-medico
    </div>
    
    <div style="margin-top: 30px; font-size: 14px; color: #666;">
      <p>v7.0.0-ULTRA-FIX | Sistema Corrigido</p>
    </div>
  </div>
</body>
</html>`);
  });

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