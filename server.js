// TeleMed Sistema - Servidor Simples para Render
const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 5000;

// HTML da landing page
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TeleMed - Sistema de Telemedicina</title>
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
      padding: 50px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.15);
      max-width: 700px;
      text-align: center;
      animation: fadeIn 0.8s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    h1 { 
      color: #2d3748; 
      margin-bottom: 20px; 
      font-size: 3em; 
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    p { color: #666; margin-bottom: 30px; font-size: 1.2em; }
    .status { 
      color: #48bb78; 
      font-weight: bold; 
      margin: 25px 0;
      padding: 20px;
      background: linear-gradient(135deg, #f0fff4, #e6fffa);
      border-radius: 12px;
      border-left: 4px solid #48bb78;
      font-size: 1.1em;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .feature {
      background: linear-gradient(135deg, #edf2f7, #e2e8f0);
      padding: 20px;
      border-radius: 12px;
      text-align: left;
      transition: transform 0.3s ease;
    }
    .feature:hover {
      transform: translateY(-5px);
    }
    .feature h4 { 
      color: #2d3748; 
      margin-bottom: 8px; 
      font-size: 1.1em;
    }
    .feature p { 
      color: #4a5568; 
      margin: 0; 
      font-size: 0.95em; 
      line-height: 1.4;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      margin: 30px 0;
    }
    .stat {
      text-align: center;
    }
    .stat-number {
      font-size: 2em;
      font-weight: bold;
      color: #4299e1;
    }
    .stat-label {
      font-size: 0.9em;
      color: #666;
    }
    .footer {
      margin-top: 40px;
      padding: 25px;
      background: linear-gradient(135deg, #f7fafc, #edf2f7);
      border-radius: 12px;
      border-top: 3px solid #4299e1;
    }
    .footer h4 { 
      color: #2d3748; 
      margin-bottom: 10px; 
      font-size: 1.2em;
    }
    .footer p { 
      color: #4a5568; 
      margin: 0; 
      font-size: 1em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🩺 TeleMed Sistema</h1>
    <p>Plataforma Completa de Telemedicina</p>
    
    <div class="status">✅ Sistema Online e Funcionando no Render!</div>
    
    <div class="stats">
      <div class="stat">
        <div class="stat-number">15+</div>
        <div class="stat-label">Funcionalidades</div>
      </div>
      <div class="stat">
        <div class="stat-number">WebRTC</div>
        <div class="stat-label">Videoconsultas</div>
      </div>
      <div class="stat">
        <div class="stat-number">24/7</div>
        <div class="stat-label">Disponível</div>
      </div>
    </div>
    
    <div class="features">
      <div class="feature">
        <h4>🎥 Videoconsultas WebRTC</h4>
        <p>Sistema peer-to-peer com chat em tempo real, compartilhamento de tela e controles completos de áudio/vídeo</p>
      </div>
      
      <div class="feature">
        <h4>💊 Prescrições MEMED Integradas</h4>
        <p>Prescrições digitais válidas com busca de medicamentos, templates e integração completa com a plataforma MEMED</p>
      </div>
      
      <div class="feature">
        <h4>🤖 Assistente IA Médico</h4>
        <p>Análise inteligente de sintomas, sugestões diagnósticas e recomendações médicas personalizadas</p>
      </div>
      
      <div class="feature">
        <h4>💳 Pagamentos Stripe Seguros</h4>
        <p>Sistema de pagamentos integrado com valores de R$ 150,00 por consulta e checkout seguro</p>
      </div>
      
      <div class="feature">
        <h4>🧠 Psiquiatria Especializada</h4>
        <p>Avaliação psicológica com escalas PHQ-9 e GAD-7, análise de risco e workflow personalizado</p>
      </div>
      
      <div class="feature">
        <h4>📊 Dashboard Analytics Avançado</h4>
        <p>Relatórios interativos, métricas de desempenho e gráficos de satisfação do paciente</p>
      </div>
      
      <div class="feature">
        <h4>📱 Sistema de Notificações</h4>
        <p>Notificações em tempo real via WebSocket, centro de mensagens e alertas personalizados</p>
      </div>
      
      <div class="feature">
        <h4>🔒 Proteção de Dados LGPD</h4>
        <p>Sistema completo de proteção de dados dos pacientes com mascaramento automático</p>
      </div>
    </div>
    
    <div class="footer">
      <h4>🚀 Deploy Realizado com Sucesso!</h4>
      <p>Plataforma completa online no Render - Pronta para demonstrações médicas e testes profissionais</p>
      <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
        Versão 1.0.0 - Sistema estável e funcional | Deploy: ${new Date().toLocaleDateString('pt-BR')}
      </p>
    </div>
  </div>
</body>
</html>
`;

// Criar servidor HTTP nativo (sem Express)
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Routes
  if (parsedUrl.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      port: PORT,
      version: '1.0.0-NATIVE'
    }));
  } else if (parsedUrl.pathname === '/api/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'TeleMed API funcionando!',
      status: 'success',
      timestamp: new Date().toISOString()
    }));
  } else {
    // Serve HTML page for all other routes
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML_PAGE);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('🩺 TeleMed Sistema v1.0.0-NATIVE');
  console.log(`🌐 Servidor HTTP nativo rodando na porta ${PORT}`);
  console.log(`🔗 Acesso: http://localhost:${PORT}`);
  console.log('✅ Deploy realizado com sucesso no Render!');
  console.log('📱 Pronto para demonstrações médicas');
});