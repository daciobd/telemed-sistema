// Development environment starter for TeleMed
// This runs the TypeScript server directly using tsx

const { spawn } = require('child_process');

console.log('🚀 Starting TeleMed Development Server...');

// Start the TypeScript server with tsx
const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd(),
  env: { ...process.env }
});

serverProcess.on('error', (err) => {
  console.error('❌ Server error:', err);
});

serverProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  serverProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  serverProcess.kill();
  process.exit(0);
});

// Rota para sistema completo híbrido
app.get("/complete", (req, res) => {
    console.log("🎯 Servindo sistema híbrido completo");
    res.sendFile(path.join(__dirname, "public", "telemed-complete.html"));
});
