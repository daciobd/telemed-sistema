import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer } from "http";

const app = express();
const PORT = 3000; // Forçar porta 3000

// Configuração para servir arquivos estáticos (build do React)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const clientBuildPath = path.join(__dirname, "../client/dist");

// Middleware para servir arquivos estáticos
app.use(express.static(clientBuildPath));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "TeleMed Sistema funcionando na porta 3000",
    port: PORT,
    version: "8.0.0-PORT3000"
  });
});

// Todas as outras rotas servem o index.html (SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// Configurar servidor para escutar em todas as interfaces
const server = createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  console.log("🩺 TeleMed Sistema v8.0.0-PORT3000");
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Acesso local: http://localhost:${PORT}`);
  console.log(`🌍 Acesso externo: https://telemed-consultation-daciobd--3000.prod1a.replit.co/`);
  console.log("✅ Forçando porta 3000 para compatibilidade Replit");
});

export default server;