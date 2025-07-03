import { ViteDevServer } from "vite";
import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "http";

export async function setupVite(app: express.Express, server: Server) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  
  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
}

export function serveStatic(app: express.Express) {
  app.use(express.static('dist/client'));
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'dist/client' });
  });
}
