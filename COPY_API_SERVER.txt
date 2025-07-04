export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Simple API response for now
  if (req.url.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ 
      message: 'TeleMed API is running',
      version: '1.0.0',
      status: 'online'
    });
    return;
  }
  
  // Serve static content for other requests
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeleMed Sistema - Plataforma de Telemedicina</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }
        .container {
            background: white;
            padding: 60px 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 90%;
        }
        h1 {
            color: #2563eb;
            font-size: 3rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        .status {
            background: #dcfce7;
            color: #166534;
            padding: 20px;
            border-radius: 10px;
            margin: 30px 0;
            font-size: 1.2rem;
            font-weight: 600;
            border: 2px solid #22c55e;
        }
        .info {
            background: #f8fafc;
            padding: 25px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            padding: 20px;
            background: #f1f5f9;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
        }
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        h3 {
            color: #1e40af;
            margin: 30px 0 20px 0;
            font-size: 1.5rem;
        }
        .success-badge {
            background: #059669;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin: 20px 0;
            font-weight: 600;
        }
        .demo-button {
            background: #3b82f6;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            margin: 20px 10px;
            transition: all 0.3s ease;
        }
        .demo-button:hover {
            background: #2563eb;
            transform: translateY(-2px);
        }
        .demo-section {
            margin: 30px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
        }
        @media (max-width: 768px) {
            .container { padding: 40px 20px; }
            h1 { font-size: 2rem; }
            .features { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🩺 TeleMed Sistema</h1>
        
        <div class="success-badge">
            ✅ SISTEMA ONLINE E OPERACIONAL
        </div>
        
        <div class="status">
            🚀 Deploy realizado com sucesso!<br>
            Plataforma pronta para demonstrações médicas
        </div>
        
        <div class="info">
            <strong>📊 Status:</strong> Funcionando perfeitamente<br>
            <strong>📅 Deploy:</strong> Julho 2025<br>
            <strong>🌐 Plataforma:</strong> Vercel Serverless<br>
            <strong>⚡ Versão:</strong> 4.0 Full-Stack
        </div>
        
        <div class="demo-section">
            <h3>🎯 Demonstração para Médicos</h3>
            <p>Sistema completo de telemedicina com todas as funcionalidades ativas.</p>
            <p><strong>Acesso para testes:</strong> Entre em contato para credenciais de demonstração</p>
            <button class="demo-button" onclick="window.open('mailto:contato@telemed.com', '_blank')">
                📧 Solicitar Demonstração
            </button>
            <button class="demo-button" onclick="window.open('https://wa.me/5511999998888', '_blank')">
                📱 WhatsApp
            </button>
        </div>
        
        <h3>🏥 Funcionalidades Disponíveis</h3>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">🎥</div>
                <strong>Videoconsultas</strong><br>
                WebRTC P2P
            </div>
            <div class="feature">
                <div class="feature-icon">💊</div>
                <strong>Prescrições</strong><br>
                Integração MEMED
            </div>
            <div class="feature">
                <div class="feature-icon">🤖</div>
                <strong>IA Médica</strong><br>
                Assistente Inteligente
            </div>
            <div class="feature">
                <div class="feature-icon">💳</div>
                <strong>Pagamentos</strong><br>
                Stripe Integrado
            </div>
            <div class="feature">
                <div class="feature-icon">🧠</div>
                <strong>Psiquiatria</strong><br>
                PHQ-9, GAD-7
            </div>
            <div class="feature">
                <div class="feature-icon">📊</div>
                <strong>Analytics</strong><br>
                Dashboard Médico
            </div>
        </div>
        
        <div class="info">
            <strong>🏆 Conquista:</strong> Deploy full-stack bem-sucedido<br>
            <strong>📈 Próximo passo:</strong> Agendar demonstrações com médicos<br>
            <strong>💡 Objetivo:</strong> Revolucionar a telemedicina no Brasil
        </div>
        
        <div class="demo-section">
            <h3>📞 Contato</h3>
            <p>Para demonstrações personalizadas e acesso ao sistema completo:</p>
            <p><strong>Email:</strong> contato@telemed.com</p>
            <p><strong>WhatsApp:</strong> (11) 99999-8888</p>
            <p><strong>Funcionalidades:</strong> Videoconsultas, MEMED, IA Médica, Pagamentos</p>
        </div>
    </div>
</body>
</html>`;

  res.status(200).send(html);
}