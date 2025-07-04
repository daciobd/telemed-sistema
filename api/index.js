export default function handler(req, res) {
  res.writeHead(200, { 
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache'
  });
  
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeleMed Sistema - Plataforma de Telemedicina</title>
    <style>
        body { 
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 20px 25px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }
        .logo { 
            font-size: 2.5rem; 
            font-weight: 700; 
            color: #4f46e5; 
            margin-bottom: 20px; 
        }
        .subtitle { 
            color: #6b7280; 
            margin-bottom: 30px; 
            font-size: 1.1rem; 
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #4f46e5;
            text-align: left;
        }
        .feature h3 { 
            color: #1e293b; 
            margin-bottom: 8px; 
        }
        .feature p { 
            color: #64748b; 
            font-size: 0.9rem; 
            line-height: 1.5; 
        }
        .contact-section {
            margin: 40px 0;
            padding: 30px;
            background: #f1f5f9;
            border-radius: 12px;
        }
        .contact-title { 
            font-size: 1.5rem; 
            color: #1e293b; 
            margin-bottom: 15px; 
        }
        .buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary { background: #4f46e5; color: white; }
        .btn-secondary { background: #10b981; color: white; }
        .info {
            margin-top: 30px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            font-size: 0.9rem;
            color: #64748b;
        }
        @media (max-width: 768px) {
            .container { padding: 30px 20px; }
            .buttons { flex-direction: column; align-items: center; }
            .btn { width: 100%; max-width: 280px; text-align: center; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🏥 TeleMed Sistema</div>
        <p class="subtitle">Plataforma Completa de Telemedicina</p>
        
        <div class="features">
            <div class="feature">
                <h3>🎥 Videoconsultas WebRTC</h3>
                <p>Sistema completo de videochamadas médicas com chat em tempo real</p>
            </div>
            <div class="feature">
                <h3>📋 Prescrições MEMED</h3>
                <p>Integração com MEMED para prescrições digitais válidas</p>
            </div>
            <div class="feature">
                <h3>🤖 Assistente IA</h3>
                <p>Inteligência artificial para análise de sintomas</p>
            </div>
            <div class="feature">
                <h3>💳 Pagamentos Stripe</h3>
                <p>Sistema de pagamentos integrado e seguro</p>
            </div>
            <div class="feature">
                <h3>🧠 Sistema Psiquiatria</h3>
                <p>Avaliação psicológica com escalas PHQ-9 e GAD-7</p>
            </div>
            <div class="feature">
                <h3>📱 Notificações WhatsApp</h3>
                <p>Comunicação direta médico-paciente</p>
            </div>
        </div>

        <div class="contact-section">
            <h2 class="contact-title">Interessado em Conhecer?</h2>
            <p>Entre em contato para agendar uma demonstração</p>
            
            <div class="buttons">
                <a href="mailto:contato@daciobd.com.br?subject=Demonstração TeleMed&body=Olá, tenho interesse no sistema TeleMed. Gostaria de agendar uma demonstração." 
                   class="btn btn-primary">📧 Email</a>
                <a href="https://wa.me/5511999998888?text=Olá, vi o TeleMed e gostaria de conhecer mais sobre a plataforma." 
                   class="btn btn-secondary" target="_blank">📱 WhatsApp</a>
            </div>
        </div>

        <div class="info">
            <strong>Especialidades:</strong><br>
            Clínica Geral • Cardiologia • Dermatologia • Psiquiatria • Pediatria • Ginecologia
        </div>
    </div>
</body>
</html>`;

  res.end(html);
}
