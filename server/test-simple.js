const express = require('express');
const app = express();
const PORT = 5000;

// Rota de teste simples
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>TeleMed Teste</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
            .container {
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
            }
            h1 { font-size: 3rem; margin-bottom: 20px; }
            p { font-size: 1.2rem; margin: 10px 0; }
            .status { 
                background: rgba(34, 197, 94, 0.3); 
                padding: 15px; 
                border-radius: 10px; 
                margin: 20px 0; 
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🩺 TeleMed Sistema</h1>
            <div class="status">✅ FUNCIONANDO!</div>
            <p><strong>Versão:</strong> 8.0.0-TEST</p>
            <p><strong>Porta:</strong> ${PORT}</p>
            <p><strong>Horário:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p><strong>Status:</strong> Conectividade Externa Confirmada</p>
            <br>
            <p>Se você está vendo esta página, o deployment está funcionando!</p>
            <p>A plataforma completa TeleMed está disponível.</p>
        </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TeleMed Teste Funcionando',
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧪 TeleMed Teste rodando na porta ${PORT}`);
  console.log(`📍 Acesso: http://localhost:${PORT}`);
  console.log(`🌐 Deploy: https://telemed-consultation-daciobd.replit.app`);
});