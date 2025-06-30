import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '6.0.0-BREAKTHROUGH'
  });
});

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TeleMed Sistema - Plataforma de Telemedicina</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      max-width: 700px;
      text-align: center;
      width: 100%;
    }
    h1 { color: #2d3748; font-size: 2.8rem; margin-bottom: 1rem; font-weight: 700; }
    .subtitle { color: #718096; font-size: 1.3rem; margin-bottom: 2rem; font-weight: 500; }
    .btn {
      display: inline-block;
      background: #4299e1;
      color: white;
      padding: 18px 36px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      margin: 12px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(66, 153, 225, 0.3);
    }
    .btn:hover { 
      background: #3182ce; 
      transform: translateY(-2px); 
      box-shadow: 0 6px 20px rgba(66, 153, 225, 0.4);
    }
    .btn-success { 
      background: #48bb78; 
      box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
    }
    .btn-success:hover { 
      background: #38a169; 
      box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
    }
    .status {
      background: #f0fff4;
      border: 2px solid #48bb78;
      padding: 18px;
      border-radius: 12px;
      margin-bottom: 25px;
      color: #22543d;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="status">
      ✅ Sistema v6.0.0 BREAKTHROUGH - Sem Modal, Transição Direta
    </div>
    
    <h1>TeleMed Sistema</h1>
    <p class="subtitle">Plataforma Completa de Telemedicina</p>
    
    <div>
      <a href="/demo-medico" class="btn btn-success">Demo para Médicos</a>
      <a href="/documentacao" class="btn">Documentação</a>
    </div>
  </div>
</body>
</html>`);
});

app.get('/demo-medico', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Médico - TeleMed Sistema v6.0.0</title>
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
      background: #e53e3e;
      color: white;
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 20px;
      display: inline-block;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    h1 { color: #2d3748; text-align: center; margin-bottom: 2rem; font-size: 2.2rem; }
    .form-group { margin-bottom: 22px; }
    label {
      display: block;
      color: #2d3748;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 0.95rem;
    }
    input, select {
      width: 100%;
      padding: 14px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 16px;
      transition: border-color 0.2s ease;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }
    .btn {
      width: 100%;
      background: #48bb78;
      color: white;
      padding: 16px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn:hover { 
      background: #38a169; 
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
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
    
    /* REMOVIDO COMPLETAMENTE O MODAL - Agora usa transition suave */
    .form-container {
      transition: all 0.5s ease;
    }
    .form-container.submitted {
      opacity: 0;
      transform: translateY(-20px);
      pointer-events: none;
    }
    
    .success-interface {
      text-align: center;
      color: #2d3748;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.5s ease;
    }
    .success-interface.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    .success-header {
      background: #f0fff4;
      border: 2px solid #48bb78;
      padding: 25px;
      border-radius: 15px;
      margin-bottom: 30px;
    }
    .doctor-info {
      text-align: left;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin: 15px 0;
      border: 1px solid #e9ecef;
    }
    .access-instructions {
      background: #e6fffa;
      border: 2px solid #38b2ac;
      padding: 25px;
      border-radius: 15px;
      margin-bottom: 25px;
      text-align: left;
    }
    .demo-guide {
      background: #f0f4ff;
      border: 2px solid #4299e1;
      padding: 25px;
      border-radius: 15px;
      margin-bottom: 25px;
      text-align: left;
    }
    .btn-action {
      background: #4299e1;
      color: white;
      padding: 15px 30px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin: 10px;
      text-decoration: none;
      display: inline-block;
    }
    .btn-secondary {
      background: #718096;
    }
    .highlight-box {
      background: #ffd700;
      padding: 15px;
      border-radius: 8px;
      color: #744210;
      font-weight: 600;
      margin: 10px 0;
    }
    .note {
      background: #f0fff4;
      border: 2px solid #38b2ac;
      padding: 20px;
      border-radius: 12px;
      margin-top: 25px;
      font-size: 14px;
      color: #2d3748;
      line-height: 1.6;
    }
    code {
      background: #f7fafc;
      padding: 5px 10px;
      border-radius: 5px;
      font-weight: bold;
      color: #e53e3e;
      font-family: 'Courier New', monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="version-badge">v6.0.0 BREAKTHROUGH</div>
    <a href="/" class="back-link">← Voltar à página inicial</a>
    
    <div id="formContainer" class="form-container">
      <h1>Demo para Médicos</h1>
      
      <form id="demoForm">
        <div class="form-group">
          <label for="nome">Nome Completo*</label>
          <input type="text" id="nome" name="nome" required placeholder="Dr(a). Seu Nome Completo">
        </div>
        
        <div class="form-group">
          <label for="crm">CRM*</label>
          <input type="text" id="crm" name="crm" placeholder="Ex: 123456/SP" required>
        </div>
        
        <div class="form-group">
          <label for="especialidade">Especialidade*</label>
          <select id="especialidade" name="especialidade" required>
            <option value="">Selecione uma especialidade</option>
            <option value="Clínico Geral">Clínico Geral</option>
            <option value="Cardiologia">Cardiologia</option>
            <option value="Dermatologia">Dermatologia</option>
            <option value="Endocrinologia">Endocrinologia</option>
            <option value="Ginecologia">Ginecologia</option>
            <option value="Neurologia">Neurologia</option>
            <option value="Ortopedia">Ortopedia</option>
            <option value="Pediatria">Pediatria</option>
            <option value="Psiquiatria">Psiquiatria</option>
            <option value="Urologia">Urologia</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="telefone">WhatsApp (opcional)</label>
          <input type="tel" id="telefone" name="telefone" placeholder="(11) 99999-9999">
        </div>
        
        <button type="submit" class="btn">🚀 PROCESSAR CADASTRO</button>
      </form>
      
      <div class="note">
        <strong>⚡ NOVA VERSÃO - SEM MODAL TRAVANDO:</strong><br>
        • Transição direta sem popup<br>
        • Videoconsultas WebRTC com chat em tempo real<br>
        • Prescrições MEMED integradas e funcionais<br>
        • Sistema de pagamentos Stripe<br>
        • Prontuário eletrônico completo
      </div>
    </div>

    <div id="successContainer" class="success-interface">
      <div class="success-header">
        <h2 style="color: #22543d; margin-bottom: 15px;">🎉 PROCESSAMENTO CONCLUÍDO COM SUCESSO!</h2>
        <div class="doctor-info" id="doctorInfo">
          <!-- Dados do médico serão inseridos aqui -->
        </div>
      </div>
      
      <div class="access-instructions">
        <h3 style="color: #2d3748; margin-bottom: 15px;">🎯 Como Acessar a Plataforma Completa</h3>
        <div style="line-height: 1.8;">
          <strong>Passo 1:</strong> Abra uma nova aba do navegador<br>
          <strong>Passo 2:</strong> Digite na barra de endereço: <code>localhost:5000</code><br>
          <strong>Passo 3:</strong> Pressione Enter para acessar a plataforma<br><br>
          
          <div class="highlight-box">
            💡 IMPORTANTE: A plataforma principal roda localmente na porta 5000
          </div>
        </div>
      </div>
      
      <div class="demo-guide">
        <h3 style="color: #2d3748; margin-bottom: 15px;">📋 Guia de Demonstração (30 min)</h3>
        <div style="line-height: 1.6;">
          <strong>🚀 Funcionalidades Principais:</strong><br>
          • Videoconsultas WebRTC com chat em tempo real<br>
          • Prescrições MEMED integradas e funcionais<br>
          • Prontuário eletrônico completo com CID-10<br>
          • Pagamentos Stripe (cartão teste: 4242 4242 4242 4242)<br>
          • Assistente IA médico com análise de sintomas<br>
          • Notificações WhatsApp automáticas<br><br>
          
          <strong>⏱️ Roteiro Sugerido:</strong><br>
          1. Explore o Dashboard médico (5 min)<br>
          2. Teste videoconsulta com paciente fictício (10 min)<br>
          3. Use prescrições MEMED com dados de teste (5 min)<br>
          4. Analise prontuário eletrônico (5 min)<br>
          5. Teste pagamentos com cartão fictício (5 min)<br><br>
          
          <strong>📚 Documentação:</strong><br>
          • GUIA_COMPLETO_MEDICOS.md - Instruções detalhadas<br>
          • Sistema com 50+ pacientes simulados para testes seguros
        </div>
      </div>
      
      <div style="margin-top: 30px;">
        <button onclick="abrirPlataforma()" class="btn-action">
          🚀 Abrir Plataforma em Nova Aba
        </button>
        
        <a href="/" class="btn-action btn-secondary">
          ← Voltar à Página Inicial
        </a>
      </div>
    </div>
  </div>
  
  <script>
    function abrirPlataforma() {
      window.open('http://localhost:5000', '_blank');
    }

    // JAVASCRIPT TOTALMENTE REESCRITO SEM MODAL
    document.addEventListener('DOMContentLoaded', function() {
      console.log('✅ v6.0.0 BREAKTHROUGH carregado - SEM MODAL');
      
      const form = document.getElementById('demoForm');
      const formContainer = document.getElementById('formContainer');
      const successContainer = document.getElementById('successContainer');
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Formulário submetido - iniciando transição');
        
        const nome = document.getElementById('nome').value.trim();
        const crm = document.getElementById('crm').value.trim();
        const especialidade = document.getElementById('especialidade').value;
        const telefone = document.getElementById('telefone').value.trim();
        
        if (!nome || !crm || !especialidade) {
          alert('❌ Por favor, preencha todos os campos obrigatórios.');
          return;
        }
        
        console.log('✅ Dados validados, iniciando transição...');
        
        // Salvar dados do médico demo
        const doctorData = {
          nome: nome, 
          crm: crm, 
          especialidade: especialidade, 
          telefone: telefone,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('demoDoctor', JSON.stringify(doctorData));
        console.log('💾 Dados salvos no localStorage');
        
        // Atualizar informações do médico na tela de sucesso
        const doctorInfo = document.getElementById('doctorInfo');
        doctorInfo.innerHTML = 
          '<strong>👨‍⚕️ Nome:</strong> ' + nome + '<br>' +
          '<strong>📋 CRM:</strong> ' + crm + '<br>' +
          '<strong>🏥 Especialidade:</strong> ' + especialidade + '<br>' +
          (telefone ? '<strong>📱 WhatsApp:</strong> ' + telefone + '<br>' : '') +
          '<strong>📅 Processado em:</strong> ' + new Date().toLocaleString('pt-BR');
        
        console.log('📊 Dados inseridos na interface de sucesso');
        
        // TRANSIÇÃO SUAVE SEM MODAL
        formContainer.classList.add('submitted');
        
        setTimeout(() => {
          formContainer.style.display = 'none';
          successContainer.classList.add('show');
          console.log('🎉 Transição para tela de sucesso concluída');
          window.scrollTo(0, 0);
        }, 500);
      });
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
    
    <h1>📚 Documentação TeleMed Sistema v6.0.0</h1>
    
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

app.use('*', (req, res) => {
  res.status(404).send('404 - Página não encontrada');
});

const port = parseInt(PORT, 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 TeleMed v6.0.0-BREAKTHROUGH - SEM MODAL`);
  console.log(`🌐 Porta: ${port}`);
  console.log(`👨‍⚕️ Demo: /demo-medico`);
});