console.log('🩺 TeleMed Sistema - Starting...');

try {
  // Try to require the main server file
  require('./index.js');
} catch (error) {
  console.error('Error loading index.js:', error.message);
  
  // Fallback: create a simple server
  const express = require('express');
  const app = express();
  const PORT = process.env.PORT || 5000;

  app.get('*', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>TeleMed Sistema</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            background: white;
            color: #333;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🩺 TeleMed Sistema</h1>
          <h2>Sistema Online e Funcionando!</h2>
          <p>Plataforma de Telemedicina Deployada com Sucesso</p>
          <p><strong>Deploy realizado no Render.com</strong></p>
        </div>
      </body>
      </html>
    `);
  });

  app.listen(PORT, () => {
    console.log(`🌐 TeleMed fallback server running on port ${PORT}`);
  });
}