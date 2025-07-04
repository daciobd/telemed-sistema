export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeleMed Sistema - Plataforma de Telemedicina</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
            line-height: 1.6;
        }
        .container {
            background: white;
            padding: 3rem 2rem;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 700px;
            width: 95%;
            margin: 20px;
        }
        .logo {
            font-size: 2.5rem;
            font-weight: 700;
            color: #4f46e5;
            margin-bottom: 1rem;
        }
        .subtitle {
            font-size: 1.1rem;
            color: #6b7280;
            margin-bottom: 2rem;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
            text-align: left;
        }
        .feature {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 12px;
            border-left: 4px solid #4f46e5;
        }
        .feature h3 {
            color: #1e293b;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        .feature p {
            color: #64748b;
            font-size: 0.9rem;
        }
        .cta-section {
            margin: 3rem 0 2rem 0;
            padding: 2rem;
            background: #f1f5f9;
            border-radius: 12px;
        }
        .cta-title {
            font-size: 1.5rem;
            color: #1e293b;
            margin-bottom: 1rem;
        }
        .contact-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 1.5rem;
        }
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn-primary {
            background: #4f46e5;
            color: white;
        }
        .btn-primary:hover {
            background: #4338ca;
            transform: translateY(-2px);
        }
        .btn-secondary {
            background: #10b981;
            color: white;
        }
        .btn-secondary:hover {
            background: #059669;
            transform: translateY(-2px);
        }
        .demo-info {
            background: #ecfdf5;
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid #d1fae5;
            margin: 2rem 0;
        }
        .demo-info h3 {
            color: #065f46;
            margin-bottom: 0.5rem;
        }
        .demo-info p {
            color: #047857;
            font-size: 0.9rem;
        }
        @media (max-width: 768px) {
            .container { padding: 2rem 1rem; }
            .features { grid-template-columns: 1fr; }
            .contact-buttons { flex-direction: column; align-items: center; }
            .btn { width: 100%; max-width: 300px; justify-content: center; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🏥 TeleMed Sistema</div>
        <p class="subtitle">Plataforma Completa de Telemedicina com Tecnologia Avançada</p>
        
        <div class="features">
            <div class="feature">
                <h3>🎥 Videoconsultas WebRTC</h3>
                <p>Sistema completo de videochamadas médicas com chat em tempo real e compartilhamento de tela</p>
            </div>
            <div class="feature">
                <h3>📋 Prescrições MEMED</h3>
                <p>Integração completa com MEMED para prescrições digitais válidas juridicamente</p>
            </div>
            <div class="feature">
                <h3>🤖 Assistente IA Médico</h3>
                <p>Inteligência artificial para análise de sintomas e sugestões de diagnóstico</p>
            </div>
            <div class="feature">
                <h3>💳 Pagamentos Stripe</h3>
                <p>Sistema completo de pagamentos integrado com processamento seguro</p>
            </div>
            <div class="feature">
                <h3>🧠 Sistema de Psiquiatria</h3>
                <p>Avaliação psicológica especializada com escalas PHQ-9 e GAD-7</p>
            </div>
            <div class="feature">
                <h3>📱 Notificações WhatsApp</h3>
                <p>Sistema de comunicação direta entre médicos e pacientes</p>
            </div>
        </div>

        <div class="demo-info">
            <h3>🎯 Sistema Completo Para Demonstração</h3>
            <p>Plataforma 100% funcional com dados fictícios para testes de médicos e investidores. Todas as funcionalidades estão operacionais para demonstrações completas.</p>
        </div>

        <div class="cta-section">
            <h2 class="cta-title">Interessado em Conhecer o Sistema?</h2>
            <p>Entre em contato para agendar uma demonstração completa</p>
            
            <div class="contact-buttons">
                <a href="mailto:contato@daciobd.com.br?subject=Demonstração TeleMed Sistema&body=Olá, tenho interesse em conhecer o sistema de telemedicina TeleMed. Gostaria de agendar uma demonstração.%0D%0A%0D%0AEspecialidade médica: %0D%0ATelefone: %0D%0AMelhor horário: " 
                   class="btn btn-primary">
                    📧 Contato por Email
                </a>
                <a href="https://wa.me/5511999998888?text=Olá, vi o sistema TeleMed e tenho interesse em conhecer mais sobre a plataforma de telemedicina. Gostaria de agendar uma demonstração." 
                   class="btn btn-secondary" target="_blank">
                    📱 WhatsApp
                </a>
            </div>
        </div>

        <div style="margin-top: 2rem; padding: 1rem; background: #f8fafc; border-radius: 8px; font-size: 0.9rem; color: #64748b;">
            <strong>Especialidades Disponíveis:</strong><br>
            Clínica Geral • Cardiologia • Dermatologia • Psiquiatria • Pediatria • Ginecologia • Neurologia • Ortopedia • Endocrinologia • Oftalmologia
        </div>
    </div>
</body>
</html>`;

  res.status(200).send(html);
}
