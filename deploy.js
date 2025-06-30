import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Main landing page
app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
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
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      max-width: 600px;
      text-align: center;
    }
    h1 { color: #2d3748; font-size: 3rem; margin-bottom: 1rem; }
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
    }
    @media (max-width: 768px) {
      .container { margin: 20px; padding: 20px; }
      h1 { font-size: 2rem; }
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
      <a href="/documentacao" class="btn">Documentação Completa</a>
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
</html>`;
  res.send(html);
});

// Demo medico page
app.get('/demo-medico', (req, res) => {
  const html = `<!DOCTYPE html>
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
      <strong>📋 Instruções de Teste:</strong><br><br>
      1. Preencha seus dados básicos acima<br>
      2. A plataforma completa será carregada automaticamente<br>
      3. Teste videoconsultas, MEMED, prontuário eletrônico<br>
      4. Duração estimada: 30 minutos<br><br>
      
      <strong>📖 Guia Completo:</strong><br>
      O arquivo GUIA_COMPLETO_MEDICOS.md contém instruções detalhadas de todas as funcionalidades.<br><br>
      
      <strong>⚠️ Nota Importante:</strong><br>
      Esta é uma versão de demonstração com dados fictícios para testes seguros.
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
      
      // Show success message
      alert('✅ Dados registrados com sucesso!\\n\\nA plataforma completa estará disponível em breve.\\n\\nEnquanto isso, consulte o GUIA_COMPLETO_MEDICOS.md para instruções detalhadas.');
      
      // Store demo data
      localStorage.setItem('demoDoctor', JSON.stringify({
        nome, crm, especialidade,
        telefone: document.getElementById('telefone').value,
        timestamp: new Date().toISOString()
      }));
    });
  </script>
</body>
</html>`;
  res.send(html);
});

// Documentation page
app.get('/documentacao', (req, res) => {
  const html = `<!DOCTYPE html>
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
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 { color: #2d3748; margin-bottom: 2rem; text-align: center; }
    h2 { color: #4a5568; margin: 2rem 0 1rem 0; }
    .card {
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .back-link {
      display: inline-block;
      color: #4299e1;
      text-decoration: none;
      margin-bottom: 20px;
      font-weight: 500;
    }
    .back-link:hover { color: #3182ce; }
    ul { margin-left: 20px; }
    li { margin-bottom: 8px; }
    .highlight {
      background: #e6fffa;
      border-left: 4px solid #38b2ac;
      padding: 15px;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-link">← Voltar à página inicial</a>
    
    <h1>📚 Documentação TeleMed Sistema</h1>
    
    <div class="card">
      <h2>🚀 Funcionalidades Principais</h2>
      <ul>
        <li><strong>Videoconsultas WebRTC:</strong> Sistema peer-to-peer com chat em tempo real</li>
        <li><strong>Prescrições MEMED:</strong> Integração completa para prescrições digitais</li>
        <li><strong>Pagamentos Stripe:</strong> Processamento seguro de R$ 150 por consulta</li>
        <li><strong>Notificações WhatsApp:</strong> Automáticas para médicos quando pacientes fazem ofertas</li>
        <li><strong>Prontuário Eletrônico:</strong> Sistema completo de registros médicos</li>
        <li><strong>Sistema de Psiquiatria:</strong> Avaliação PHQ-9 e GAD-7 especializada</li>
      </ul>
    </div>
    
    <div class="card">
      <h2>📖 Guias Disponíveis</h2>
      <div class="highlight">
        <strong>GUIA_COMPLETO_MEDICOS.md</strong><br>
        Instruções detalhadas de 30+ páginas para demonstração completa da plataforma.
        Inclui roteiro de 30 minutos para testar todas as funcionalidades.
      </div>
      
      <div class="highlight">
        <strong>TESTE_VIDEOCONSULTA_DUAS_PESSOAS.md</strong><br>
        Instruções específicas para teste de videoconsulta entre dois dispositivos diferentes.
      </div>
      
      <div class="highlight">
        <strong>PROTECAO_DADOS_PACIENTES.md</strong><br>
        Especificações do sistema de proteção de dados e conformidade LGPD.
      </div>
    </div>
    
    <div class="card">
      <h2>🔧 Tecnologias</h2>
      <ul>
        <li><strong>Frontend:</strong> React.js + TypeScript + TailwindCSS</li>
        <li><strong>Backend:</strong> Express.js + TypeScript</li>
        <li><strong>Banco de Dados:</strong> PostgreSQL + Drizzle ORM</li>
        <li><strong>Autenticação:</strong> Replit Auth + OpenID Connect</li>
        <li><strong>Comunicação:</strong> WebRTC + WebSockets</li>
        <li><strong>Pagamentos:</strong> Stripe Integration</li>
      </ul>
    </div>
    
    <div class="card">
      <h2>📞 Suporte</h2>
      <p>Para dúvidas sobre o sistema ou configuração de demonstrações, consulte os arquivos de documentação no repositório do projeto.</p>
    </div>
  </div>
</body>
</html>`;
  res.send(html);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Página não encontrada - TeleMed Sistema</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        a { color: #ffd700; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404 - Página não encontrada</h1>
        <p>A página que você está procurando não existe.</p>
        <p><a href="/">← Voltar à página inicial</a></p>
      </div>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🩺 TeleMed Sistema rodando na porta ${PORT}`);
  console.log(`🌐 Demo: http://localhost:${PORT}/demo-medico`);
  console.log(`📋 Health: http://localhost:${PORT}/health`);
});