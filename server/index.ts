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

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Ensure JSON response for API routes
    if (_req.path.startsWith('/api/')) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(status).json({ message });
    }
    
    res.status(status).json({ message });
    throw err;
  });

  // Add a basic catch-all route for deployment
  app.get("*", (req, res) => {
    // Serve a basic HTML page for deployment
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>TeleMed Sistema</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div id="root">
            <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
              <div class="max-w-2xl mx-auto text-center p-8">
                <h1 class="text-4xl font-bold text-blue-900 mb-4">🩺 TeleMed Sistema</h1>
                <p class="text-xl text-gray-600 mb-8">Plataforma de Telemedicina Avançada</p>
                
                <div class="space-y-4">
                  <a href="/demo-medico" class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                    Demo para Médicos
                  </a>
                  
                  <div class="mt-8 p-6 bg-white rounded-lg shadow-lg">
                    <h2 class="text-2xl font-semibold mb-4">Funcionalidades Disponíveis</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div class="p-4 border rounded">
                        <h3 class="font-semibold">🎥 Videoconsultas</h3>
                        <p class="text-sm text-gray-600">WebRTC peer-to-peer</p>
                      </div>
                      <div class="p-4 border rounded">
                        <h3 class="font-semibold">💊 Prescrições MEMED</h3>
                        <p class="text-sm text-gray-600">Integração completa</p>
                      </div>
                      <div class="p-4 border rounded">
                        <h3 class="font-semibold">📱 Notificações WhatsApp</h3>
                        <p class="text-sm text-gray-600">Automáticas para médicos</p>
                      </div>
                      <div class="p-4 border rounded">
                        <h3 class="font-semibold">💳 Pagamentos Stripe</h3>
                        <p class="text-sm text-gray-600">Processamento seguro</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-6 text-sm text-gray-500">
                    <p>URL para compartilhar: <strong>${req.get('host')}/demo-medico</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });

  // Setup Vite for development
  if (process.env.NODE_ENV === "development") {
    try {
      await setupVite(app, server);
    } catch (error) {
      log(`Vite setup failed, using fallback: ${error}`);
    }
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
