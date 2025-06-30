import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Add simple fallback routes first
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000
  });
});

app.get("/", (req, res) => {
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
    .feature h3 { color: #2d3748; margin-bottom: 10px; }
    .feature p { color: #718096; font-size: 0.9rem; }
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
    
    <div>
      <a href="/demo-medico" class="btn">Demo para Médicos</a>
      <a href="/video-test" class="btn">Teste de Videoconsulta</a>
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
      <h3>Para seus colegas médicos testarem:</h3>
      <p><strong>${req.get('host')}/demo-medico</strong></p>
      <p>Acesso simples com formulário básico</p>
    </div>
  </div>
</body>
</html>`;
  res.send(html);
});

app.get("/demo-medico", (req, res) => {
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
      2. O sistema irá carregar automaticamente<br>
      3. Teste videoconsultas, MEMED e todas as funcionalidades<br>
      4. Duração estimada: 30 minutos<br><br>
      <strong>Nota:</strong> Esta é uma versão simplificada. A versão completa está sendo configurada.
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
      
      alert('Demo configurado! A plataforma completa estará disponível em breve.');
    });
  </script>
</body>
</html>`;
  res.send(html);
});

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Setup Vite only in development
    if (process.env.NODE_ENV === "development") {
      try {
        await setupVite(app, server);
      } catch (error) {
        log(`Vite setup failed, using static routes: ${error}`);
      }
    }

    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen({
      port,
      host: "0.0.0.0",
    }, () => {
      log(`TeleMed Sistema serving on port ${port}`);
      log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      log(`Demo URL: http://localhost:${port}/demo-medico`);
    });
  } catch (error) {
    log(`Server startup failed: ${error}`);
    process.exit(1);
  }
})();
