import express from "express";

export async function setupVite(app: express.Express, server: any) {
  // Development mode - serve static files
  console.log('Development mode: Vite setup');
}

export function serveStatic(app: express.Express) {
  app.use(express.static('dist/client'));
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'dist/client' });
  });
}
