import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging para debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '1.0.0'
  });
});

// Landing page principal
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
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-top: 40px;
    }
    .feature {
      background: #f7fafc;
      padding: 25px;
      border-radius: 12px;
      border-left: 5px solid #4299e1;
      text-align: left;
      transition: transform 0.2s ease;
    }
    .feature:hover { transform: translateY(-3px); }
    .feature h3 { color: #2d3748; margin-bottom: 12px; font-size: 1.1rem; }
    .feature p { color: #718096; font-size: 0.95rem; line-height: 1.5; }
    .url-info {
      margin-top: 40px;
      padding: 25px;
      background: #e6fffa;
      border-radius: 12px;
      border: 2px solid #38b2ac;
    }
    .url-info h3 { color: #2d3748; margin-bottom: 10px; }
    .url-info p { color: #2d3748; font-size: 1rem; }
    .url-info strong { color: #38b2ac; }
    .status {
      background: #f0fff4;
      border: 2px solid #48bb78;
      padding: 18px;
      border-radius: 12px;
      margin-bottom: 25px;
      color: #22543d;
      font-weight: 600;
    }
    @media (max-width: 768px) {
      h1 { font-size: 2.2rem; }
      .container { padding: 25px; }
      .features { grid-template-columns: 1fr; }
      .btn { padding: 15px 30px; font-size: 1rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="status">
      Sistema Online - Plataforma funcionando corretamente
    </div>
    
    <h1>TeleMed Sistema</h1>
    <p class="subtitle">Plataforma Completa de Telemedicina</p>
    
    <div>
      <a href="/demo-medico" class="btn btn-success">Demo para Médicos</a>
      <a href="/documentacao" class="btn">Documentação</a>
    </div>
    
    <div class="features">
      <div class="feature">
        <h3>Videoconsultas WebRTC</h3>
        <p>Sistema peer-to-peer avançado com chat em tempo real, compartilhamento de tela e controles completos de áudio/vídeo</p>
      </div>
      <div class="feature">
        <h3>Prescrições MEMED</h3>
        <p>Integração completa com MEMED para prescrições digitais válidas juridicamente com busca de medicamentos</p>
      </div>
      <div class="feature">
        <h3>Notificações Automáticas</h3>
        <p>Sistema inteligente de WhatsApp e SMS para médicos quando pacientes fazem ofertas de teleconsulta</p>
      </div>
      <div class="feature">
        <h3>Pagamentos Stripe</h3>
        <p>Processamento seguro de pagamentos para consultas com checkout integrado e confirmação automática</p>
      </div>
      <div class="feature">
        <h3>Assistente IA Médico</h3>
        <p>Análise de sintomas, sugestões de diagnóstico e recomendações médicas baseadas em IA</p>
      </div>
      <div class="feature">
        <h3>Proteção de Dados LGPD</h3>
        <p>Sistema completo de proteção de dados dos pacientes em conformidade com a legislação brasileira</p>
      </div>
    </div>
    
    <div class="url-info">
      <h3>Para seus colegas médicos testarem:</h3>
      <p><strong>https://telemed-consultation-daciobd.replit.app/demo-medico</strong></p>
      <p>Acesso direto ao formulário de demonstração com guia completo</p>
    </div>
  </div>
</body>
</html>`);
});

// Página demo médico com interface melhorada
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
      max-width: 550px;
      margin: 0 auto;
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
      background: #4299e1;
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
      background: #3182ce; 
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(66, 153, 225, 0.3);
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
    .back-link {
      display: inline-block;
      color: #4299e1;
      text-decoration: none;
      margin-bottom: 25px;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .back-link:hover { color: #3182ce; }
    .success-interface {
      text-align: center;
      color: #2d3748;
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
      background: white;
      padding: 20px;
      border-radius: 10px;
      margin: 15px 0;
    }
    .access-instructions {
      background: #e6fffa;
      border: 2px solid #38b2ac;
      padding: 25px;
      border-radius: 15px;
      margin-bottom: 25px;
    }
    .demo-guide {
      background: #f0f4ff;
      border: 2px solid #4299e1;
      padding: 25px;
      border-radius: 15px;
      margin-bottom: 25px;
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
    }
  </style>
</head>
<body>
  <div class="container" id="mainContainer">
    <a href="/" class="back-link">Voltar à página inicial</a>
    
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
      
      <button type="submit" class="btn">Acessar Plataforma Demo</button>
    </form>
    
    <div class="note">
      <strong>Guia de Demonstração Completo:</strong><br><br>
      
      <strong>Funcionalidades Principais para Testar:</strong><br>
      • Videoconsultas WebRTC com chat em tempo real<br>
      • Prescrições MEMED integradas e funcionais<br>
      • Prontuário eletrônico completo com CID-10<br>
      • Sistema de pagamentos Stripe totalmente funcional<br>
      • Notificações WhatsApp automáticas para médicos<br>
      • Avaliação psiquiátrica PHQ-9 e GAD-7<br>
      • Sistema de leilão reverso para teleconsultas<br><br>
      
      <strong>Documentação Técnica Disponível:</strong><br>
      • GUIA_COMPLETO_MEDICOS.md - Instruções detalhadas de 30+ páginas<br>
      • TESTE_VIDEOCONSULTA_DUAS_PESSOAS.md - Teste entre dispositivos<br>
      • PROTECAO_DADOS_PACIENTES.md - Conformidade LGPD<br><br>
      
      <strong>Informações do Teste:</strong><br>
      • Duração estimada: 30 minutos<br>
      • Dados: Totalmente fictícios para testes seguros<br>
      • Ambiente: Sandbox completo com todas as funcionalidades
    </div>
  </div>
  
  <script>
    document.getElementById('demoForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nome = document.getElementById('nome').value;
      const crm = document.getElementById('crm').value;
      const especialidade = document.getElementById('especialidade').value;
      const telefone = document.getElementById('telefone').value;
      
      if (!nome || !crm || !especialidade) {
        alert('Por favor, preencha todos os campos obrigatórios para continuar.');
        return;
      }
      
      // Salvar dados do médico demo
      localStorage.setItem('demoDoctor', JSON.stringify({
        nome, crm, especialidade, telefone,
        timestamp: new Date().toISOString()
      }));
      
      // Mostrar interface de sucesso completa
      const container = document.getElementById('mainContainer');
      container.innerHTML = \`
        <div class="success-interface">
          <div class="success-header">
            <h2 style="color: #22543d; margin-bottom: 15px;">Cadastro Realizado com Sucesso!</h2>
            <div class="doctor-info">
              <strong>Dados do Médico:</strong><br>
              <strong>Nome:</strong> \${nome}<br>
              <strong>CRM:</strong> \${crm}<br>
              <strong>Especialidade:</strong> \${especialidade}<br>
              \${telefone ? '<strong>WhatsApp:</strong> ' + telefone + '<br>' : ''}
            </div>
          </div>
          
          <div class="access-instructions">
            <h3 style="color: #2d3748; margin-bottom: 15px;">Como Acessar a Plataforma Completa</h3>
            <div style="text-align: left; line-height: 1.6;">
              <strong>Passo 1:</strong> Abra uma nova aba do navegador<br>
              <strong>Passo 2:</strong> Digite na barra de endereço: <code style="background: #f7fafc; padding: 3px 8px; border-radius: 5px; font-weight: bold;">localhost:5000</code><br>
              <strong>Passo 3:</strong> Pressione Enter para acessar a plataforma<br><br>
              
              <div class="highlight-box">
                Dica Importante: A plataforma principal roda localmente na porta 5000
              </div>
            </div>
          </div>
          
          <div class="demo-guide">
            <h3 style="color: #2d3748; margin-bottom: 15px;">Guia de Demonstração Completo</h3>
            <div style="text-align: left; line-height: 1.6;">
              <strong>Funcionalidades Principais para Testar:</strong><br>
              • Videoconsultas WebRTC com chat em tempo real<br>
              • Prescrições MEMED integradas e funcionais<br>
              • Prontuário eletrônico completo com CID-10<br>
              • Sistema de pagamentos Stripe (use cartão de teste 4242...)<br>
              • Assistente IA médico com análise de sintomas<br>
              • Avaliação psiquiátrica PHQ-9 e GAD-7<br><br>
              
              <strong>Roteiro Sugerido (30 minutos):</strong><br>
              1. Explore o Dashboard médico (5 min)<br>
              2. Teste videoconsulta com paciente fictício (10 min)<br>
              3. Use prescrições MEMED com dados de teste (5 min)<br>
              4. Analise prontuário eletrônico (5 min)<br>
              5. Teste pagamentos com cartão fictício (5 min)<br><br>
              
              <strong>Documentação Técnica:</strong><br>
              • GUIA_COMPLETO_MEDICOS.md - Instruções detalhadas<br>
              • Todos os dados são fictícios para testes seguros<br>
              • Sistema completo com 50+ pacientes simulados
            </div>
          </div>
          
          <button onclick="window.open('http://localhost:5000', '_blank')" class="btn-action">
            Abrir Plataforma em Nova Aba
          </button>
          
          <a href="/" class="btn-action btn-secondary">
            Voltar à Página Inicial
          </a>
        </div>
      \`;
    });
  </script>
</body>
</html>`);
});

// Página de documentação
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
    h2 { color: #4a5568; margin: 2.5rem 0 1.2rem 0; font-size: 1.5rem; }
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
    ul { margin-left: 25px; margin-top: 10px; }
    li { margin-bottom: 10px; }
    .highlight {
      background: #e6fffa;
      border-left: 4px solid #38b2ac;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .tech-stack {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    .tech-item {
      background: #f7fafc;
      padding: 15px;
      border-radius: 8px;
      border-left: 3px solid #4299e1;
    }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-link">Voltar à página inicial</a>
    
    <h1>Documentação TeleMed Sistema</h1>
    
    <div class="card">
      <h2>Funcionalidades Implementadas</h2>
      <ul>
        <li><strong>Videoconsultas WebRTC:</strong> Sistema peer-to-peer com chat em tempo real, compartilhamento de tela e controles avançados</li>
        <li><strong>Prescrições MEMED:</strong> Integração completa para prescrições digitais válidas juridicamente</li>
        <li><strong>Pagamentos Stripe:</strong> Processamento seguro de pagamentos com checkout integrado</li>
        <li><strong>Notificações WhatsApp/SMS:</strong> Sistema automático para médicos quando pacientes fazem ofertas</li>
        <li><strong>Prontuário Eletrônico:</strong> Sistema completo de registros médicos com CID-10</li>
        <li><strong>Sistema de Psiquiatria:</strong> Avaliação PHQ-9 e GAD-7 com análise de risco</li>
        <li><strong>Proteção de Dados:</strong> Conformidade LGPD implementada com mascaramento de dados</li>
        <li><strong>Assistente IA:</strong> Análise de sintomas e sugestões de diagnóstico</li>
      </ul>
    </div>
    
    <div class="card">
      <h2>Arquivos de Documentação</h2>
      <div class="highlight">
        <strong>GUIA_COMPLETO_MEDICOS.md</strong><br>
        Guia completo de 30+ páginas com instruções detalhadas para demonstração da plataforma.
        Inclui roteiro estruturado de 30 minutos para testar todas as funcionalidades principais.
      </div>
      
      <div class="highlight">
        <strong>TESTE_VIDEOCONSULTA_DUAS_PESSOAS.md</strong><br>
        Instruções específicas para teste de videoconsulta entre dois dispositivos diferentes.
        Essencial para demonstrações realistas da plataforma com médicos e pacientes simulados.
      </div>
      
      <div class="highlight">
        <strong>PROTECAO_DADOS_PACIENTES.md</strong><br>
        Especificações completas do sistema de proteção de dados dos pacientes.
        Conformidade LGPD e proteção do modelo de negócio contra bypass da plataforma.
      </div>
    </div>
    
    <div class="card">
      <h2>Stack Tecnológico</h2>
      <div class="tech-stack">
        <div class="tech-item">
          <strong>Frontend</strong><br>
          React.js + TypeScript + TailwindCSS + shadcn/ui
        </div>
        <div class="tech-item">
          <strong>Backend</strong><br>
          Express.js + TypeScript + WebSockets
        </div>
        <div class="tech-item">
          <strong>Banco de Dados</strong><br>
          PostgreSQL + Drizzle ORM
        </div>
        <div class="tech-item">
          <strong>Autenticação</strong><br>
          Replit Auth + OpenID Connect
        </div>
        <div class="tech-item">
          <strong>Comunicação</strong><br>
          WebRTC + WebSockets + Real-time
        </div>
        <div class="tech-item">
          <strong>Pagamentos</strong><br>
          Stripe + Webhook + Checkout
        </div>
        <div class="tech-item">
          <strong>Prescrições</strong><br>
          MEMED API + Busca de medicamentos
        </div>
        <div class="tech-item">
          <strong>Deployment</strong><br>
          Replit + Production-ready
        </div>
      </div>
    </div>
    
    <div class="card">
      <h2>Estatísticas do Sistema</h2>
      <ul>
        <li><strong>Linhas de Código:</strong> +15.000 linhas TypeScript/React</li>
        <li><strong>Componentes:</strong> +50 componentes reutilizáveis</li>
        <li><strong>APIs:</strong> +30 endpoints REST funcionais</li>
        <li><strong>Especialidades:</strong> 10 especialidades médicas</li>
        <li><strong>Funcionalidades:</strong> +20 módulos principais</li>
        <li><strong>Documentação:</strong> +100 páginas de guias</li>
      </ul>
    </div>
  </div>
</body>
</html>`);
});

// 404 handler personalizado
app.use('*', (req, res) => {
  res.status(404).send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <title>404 - TeleMed Sistema</title>
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
    a { 
      color: #ffd700; 
      text-decoration: none; 
      font-weight: bold; 
      font-size: 1.1rem;
    }
    a:hover { color: #ffed4e; }
    h1 { margin-bottom: 20px; font-size: 2rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>404 - Página não encontrada</h1>
    <p>A página que você procura não existe.</p>
    <br>
    <a href="/">Voltar à página inicial</a>
  </div>
</body>
</html>`);
});

// Iniciar servidor
const port = parseInt(PORT, 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`TeleMed Sistema rodando na porta ${port}`);
  console.log(`Acesse: http://0.0.0.0:${port}`);
  console.log(`Demo: http://0.0.0.0:${port}/demo-medico`);
  console.log(`Health: http://0.0.0.0:${port}/health`);
  console.log(`Docs: http://0.0.0.0:${port}/documentacao`);
});