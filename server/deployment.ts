import express, { Request, Response } from "express";
import path from "path";

export function createDeploymentHandler() {
  const app = express();
  
  // Simple health check
  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Landing page for deployment
  app.get("/", (req: Request, res: Response) => {
    const html = `
      <!DOCTYPE html>
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
            h1 { 
              color: #2d3748;
              font-size: 3rem;
              margin-bottom: 1rem;
            }
            .subtitle {
              color: #718096;
              font-size: 1.25rem;
              margin-bottom: 2rem;
            }
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
            .btn:hover {
              background: #3182ce;
              transform: translateY(-2px);
            }
            .features {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 30px;
            }
            .feature {
              background: #f7fafc;
              padding: 20px;
              border-radius: 10px;
              border-left: 4px solid #4299e1;
            }
            .feature h3 {
              color: #2d3748;
              margin-bottom: 10px;
            }
            .feature p {
              color: #718096;
              font-size: 0.9rem;
            }
            .url-info {
              margin-top: 30px;
              padding: 20px;
              background: #e6fffa;
              border-radius: 10px;
              border: 1px solid #38b2ac;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🩺 TeleMed Sistema</h1>
            <p class="subtitle">Plataforma Completa de Telemedicina</p>
            
            <div style="background: #f0fff4; padding: 30px; border-radius: 15px; margin: 30px 0; border: 3px solid #38b2ac;">
              <h2 style="color: #22543d; margin-bottom: 20px; font-size: 1.5rem;">🚀 Como Acessar a Plataforma</h2>
              <div style="text-align: left; line-height: 1.8; color: #2d3748;">
                <p><strong>1.</strong> Esta é uma plataforma privada que requer login</p>
                <p><strong>2.</strong> Clique no botão "Log in" no canto superior direito</p>
                <p><strong>3.</strong> Faça login com sua conta Replit (gratuita)</p>
                <p><strong>4.</strong> Após o login, explore todas as funcionalidades</p>
              </div>
              <div style="background: #e6fffa; padding: 20px; border-radius: 10px; margin-top: 20px;">
                <strong style="color: #234e52;">💡 Não possui conta Replit?</strong><br>
                <span style="color: #4a5568;">Crie uma conta gratuita em: replit.com</span>
              </div>
            </div>
            
            <div class="features">
              <div class="feature">
                <h3>🎥 Videoconsultas</h3>
                <p>WebRTC peer-to-peer com chat em tempo real</p>
              </div>
              <div class="feature">
                <h3>💊 Prescrições MEMED</h3>
                <p>Integração completa para prescrições digitais</p>
              </div>
              <div class="feature">
                <h3>📱 Notificações</h3>
                <p>WhatsApp e SMS automáticos para médicos</p>
              </div>
              <div class="feature">
                <h3>💳 Pagamentos</h3>
                <p>Processamento seguro com Stripe</p>
              </div>
            </div>
            
            <div class="url-info">
              <h3>🎯 Para compartilhar com colegas médicos:</h3>
              <p><strong>URL Direta:</strong> ${req.get('host')}</p>
              <p>✅ Acesso direto à plataforma completa</p>
              <p>🔑 Login necessário: Conta Replit (gratuita)</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    res.send(html);
  });

  // Demo route - redireciona direto para a plataforma principal
  app.get("/demo-medico", (req: Request, res: Response) => {
    // Remove a barra do final se existir para evitar problemas de redirecionamento
    const baseUrl = req.protocol + '://' + req.get('host');
    res.redirect(baseUrl);
  });

  // Página de acesso direto simples
  app.get("/acesso-direto", (req: Request, res: Response) => {
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Acesso Direto - TeleMed Sistema</title>
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
            h1 { 
              color: #2d3748;
              text-align: center;
              margin-bottom: 2rem;
            }
            .form-group {
              margin-bottom: 20px;
            }
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
            .btn:hover {
              background: #3182ce;
            }
            .note {
              background: #f0fff4;
              border: 1px solid #38b2ac;
              padding: 15px;
              border-radius: 8px;
              margin-top: 20px;
              font-size: 14px;
              color: #2d3748;
            }
          </style>
        </head>
        <body>
          <div class="container">
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
              
              <button type="submit" class="btn">Acessar Demo da Plataforma</button>
            </form>
            
            <div class="note">
              <strong>Instruções:</strong><br>
              1. Preencha seus dados básicos<br>
              2. Após o acesso, siga o guia de 4 passos<br>
              3. Teste videoconsultas, MEMED e todas as funcionalidades<br>
              4. Duração estimada: 30 minutos
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
              
              // Store demo user data
              localStorage.setItem('demoUser', JSON.stringify({
                name: nome,
                crm: crm,
                specialty: especialidade,
                phone: document.getElementById('telefone').value
              }));
              
              alert('Demo configurado! Redirecionando para a plataforma...');
              // In a real deployment, this would redirect to the full app
              window.location.href = '/';
            });
          </script>
        </body>
      </html>
    `;
    
    res.send(html);
  });

  return app;
}