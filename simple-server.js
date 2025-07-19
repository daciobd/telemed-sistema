#!/usr/bin/env node

const http = require('http');
const path = require('path');

console.log('🔧 Starting simple server to test basic functionality...');

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      port: PORT,
      version: 'bootstrap-server'
    }));
    return;
  }
  
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>TeleMed Sistema - Bootstrap</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
          .container { max-width: 600px; margin: 0 auto; }
          .status { padding: 20px; background: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🩺 TeleMed Sistema</h1>
          <div class="status">
            <h2>✅ Bootstrap Server Running</h2>
            <p>Server is running on port ${PORT}</p>
            <p>Status: Working on fixing package dependencies</p>
            <p>Time: ${new Date().toISOString()}</p>
          </div>
          <p>This is a temporary server while we fix the main application.</p>
        </div>
      </body>
      </html>
    `);
    return;
  }
  
  // 404 for other routes
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Bootstrap server running on port ${PORT}`);
  console.log(`🔗 Access: http://localhost:${PORT}`);
  console.log(`📄 Health check: http://localhost:${PORT}/health`);
});