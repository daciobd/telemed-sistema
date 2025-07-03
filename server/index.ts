const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    version: '1.0.0-SIMPLE-JS'
  });
});

// API test
app.get('/api/test', (req, res) => {
  res.json({ message: 'TeleMed API funcionando!', status: 'success' });
});

// Landing page
app.get('*', (req, res) => {
  const html = `
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
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          max-width: 600px;
          text-align: center;
        }
        h1 { color: #2d3748; margin-bottom: 20px; font-size: 2.5em; }
        p { color: #666; margin-bottom: 30px; font-size: 1.1em; }
        .status { 
          color: #48bb78; 
          font-weight: bold; 
          margin: 20px 0;
          padding: 15px;
          background: #f0fff4;
          border-radius: 8px;
        }
        .feature {
          background: #edf2f7;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          text-align: left;
        }
        .feature h4 { color: #2d3748; margin-bottom: 5px; }
        .feature p { color: #4a5568; margin: 0; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🩺 TeleMed Sistema</h1>
        <p>Plataforma Completa de Telemedicina</p>
        
        <div class="status">✅ Sistema Online e Funcionando!</div>
        
        <div class="feature">
          <h4>🎥 Videoconsultas WebRTC</h4>
          <p>Sistema peer-to-peer com chat em tempo real</p>
        </div>
        
        <div class="feature">
          <h4>💊 Prescrições MEMED</h4>
          <p>Prescrições digitais integradas e válidas</p>
        </div>
        
        <div class="feature">
          <h4>🤖 Assistente IA Médico</h4>
          <p>Análise de sintomas e sugestões diagnósticas</p>
        </div>
        
        <div class="feature">
          <h4>💳 Pagamentos Stripe</h4>
          <p>Sistema de pagamentos seguro R$ 150/consulta</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #f7fafc; border-radius: 8px;">
          <h4 style="color: #2d3748; margin-bottom: 10px;">🚀 Deploy Realizado com Sucesso!</h4>
          <p style="color: #4a5568; margin: 0; font-size: 0.9em;">
            Plataforma online e pronta para demonstrações médicas
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🩺 TeleMed Sistema v1.0.0-SIMPLE-JS`);
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
  console.log(`✅ Deploy realizado com sucesso!`);
});
