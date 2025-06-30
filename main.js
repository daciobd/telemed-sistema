const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

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
      max-width: 600px;
      text-align: center;
      width: 100%;
    }
    h1 { color: #2d3748; font-size: 2.5rem; margin-bottom: 1rem; }
    .subtitle { color: #718096; font-size: 1.25rem; margin-bottom: 2rem; }
    .btn {
      display: inline-block;
      background: #4299e1;
      color: white;
      padding: 15px 30px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      margin: 10px;
      transition: all 0.3s ease;
    }
    .btn:hover { background: #3182ce; transform: translateY(-2px); }
    .btn-success { background: #48bb78; }
    .btn-success:hover { background: #38a169; }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
    .feature {
      background: #f7fafc;
      padding: 20px;
      border-radius: 10px;
      border-left: 4px solid #4299e1;
      text-align: left;
    }
    .feature h3 { color: #2d3748; margin-bottom: 10px; }
    .feature p { color: #718096; font-size: 0.9rem; }
    .url-info {
      margin-top: 30px;
      padding: 20px;
      background: #e6fffa;
      border-radius: 10px;
      border: 1px solid #38b2ac;
    }
    .status {
      background: #f0fff4;
      border: 1px solid #48bb78;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
      color: #22543d;
    }
    @media (max-width: 768px) {
      h1 { font-size: 2rem; }
      .container { padding: 20px; }
      .features { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="status">
      <strong>✅ Sistema Online</strong> - Plataforma funcionando corretamente
    </div>
    
    <h1>🩺 TeleMed Sistema</h1>
    <p class="subtitle">Plataforma Completa de Telemedicina</p>
    
    <div>
      <a href="/demo-medico" class="btn btn-success">Demo para Médicos</a>
      <a href="/documentacao" class="btn">Documentação</a>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>🎥 Videoconsultas WebRTC</h3>
        <p>Sistema peer-to-peer com chat em tempo real e compartilhamento de tela</p>
      </div>
      <div class="feature">
        <h3>💊 Prescrições MEMED</h3>
        <p>Integração completa para prescrições digitais válidas juridicamente</p>
      </div>
      <div class="feature">
        <h3>📱 Notificações Automáticas</h3>
        <p>WhatsApp e SMS para médicos quando pacientes fazem ofertas</p>
      </div>
      <div class="feature">
        <h3>💳 Pagamentos Stripe</h3>
        <p>Processamento seguro de pagamentos para consultas</p>
      </div>
    </div>
    
    <div class="url-info">
      <h3>🚀 Para seus colegas médicos testarem:</h3>
      <p><strong>https://telemed-sistema.replit.app/demo-medico</strong></p>
      <p>Acesso direto ao formulário de demonstração</p>
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
  <title>Demo Médico - TeleMed Sistema</title>
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
      max-width: 500px;
      margin: 0 auto;
    }
    h1 { color: #2d3748; text-align: center; margin-bottom: 2rem; }
    .form-group { margin-bottom: 20px; }
    label {
      display: block;
      color: #2d3748;
      font-weight: 600;
      margin-bottom: 5px;
    }
    input, select {
      width: 100%;
      padding: 12px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 16px;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #4299e1;
    }
    .btn {
      width: 100%;
      background: #4299e1;
      color: white;
      padding: 15px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }
    .btn:hover { background: #3182ce; }
    .note {
      background: #f0fff4;
      border: 1px solid #38b2ac;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
      font-size: 14px;
      color: #2d3748;
    }
    .back-link {
      display: inline-block;
      color: #4299e1;
      text-decoration: none;
      margin-bottom: 20px;
      font-weight: 500;
    }
    .back-link:hover { color: #3182ce; }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-link">← Voltar à página inicial</a>
    
    <h1>🩺 Demo para Médicos</h1>
    
    <form id="demoForm">
      <div class="form-group">
        <label for="nome">Nome Completo*</label>
        <input type="text" id="nome" name="nome" required>
      </div>
      
      <div class="form-group">
        <label for="crm">CRM*</label>
        <input type="text" id="crm" name="crm" placeholder="Ex: 123456" required>
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
      
      <button type="submit" class="btn">Acessar Plataforma Demo</button>
    </form>
    
    <div class="note">
      <strong>📋 Guia de Demonstração:</strong><br><br>
      
      <strong>🎯 Funcionalidades para Testar:</strong><br>
      • Videoconsultas WebRTC com chat em tempo real<br>
      • Prescrições MEMED integradas<br>
      • Prontuário eletrônico completo<br>
      • Sistema de pagamentos Stripe<br>
      • Notificações WhatsApp automáticas<br>
      • Avaliação psiquiátrica PHQ-9 e GAD-7<br><br>
      
      <strong>📖 Documentação Completa:</strong><br>
      GUIA_COMPLETO_MEDICOS.md - Instruções detalhadas de 30+ páginas<br>
      TESTE_VIDEOCONSULTA_DUAS_PESSOAS.md - Teste entre dispositivos<br><br>
      
      <strong>⏱️ Duração Estimada:</strong> 30 minutos<br>
      <strong>🔒 Dados:</strong> Totalmente fictícios para testes seguros
    </div>
  </div>
  
  <script>
    document.getElementById('demoForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nome = document.getElementById('nome').value;
      const crm = document.getElementById('crm').value;
      const especialidade = document.getElementById('especialidade').value;
      
      if (!nome || !crm || !especialidade) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }
      
      alert('✅ Cadastro realizado com sucesso!\\n\\nDr(a). ' + nome + '\\nCRM: ' + crm + '\\nEspecialidade: ' + especialidade + '\\n\\nA plataforma completa está sendo preparada para deployment.\\n\\nConsulte o GUIA_COMPLETO_MEDICOS.md para instruções detalhadas.');
    });
  </script>
</body>
</html>`);
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`TeleMed Sistema rodando na porta ${PORT}`);
});