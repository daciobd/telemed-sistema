#!/usr/bin/env node
/**
 * Build frontend and start server for TeleMed
 * This bypasses the problematic vite dev server configuration
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 TeleMed Build & Start Process...');

function execPromise(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error executing: ${command}`);
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

function startProcess(command, args, name, options = {}) {
  const proc = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    cwd: options.cwd || process.cwd(),
    env: { ...process.env, ...options.env },
  });

  proc.on('error', (err) => console.error(`❌ ${name} error:`, err));
  proc.on('exit', (code) => {
    if (code !== 0) console.error(`❌ ${name} exited with code ${code}`);
  });

  return proc;
}

async function main() {
  try {
    // Build frontend first
    console.log('🔨 Building frontend...');
    
    // Create a minimal vite config for build only
    const buildConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
`;
    
    // Write minimal build config
    fs.writeFileSync('vite.build.config.js', buildConfig);
    
    await execPromise('npx vite build --config vite.build.config.js', { 
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    console.log('✅ Frontend built successfully');
    
    // Start server
    const PORT = Number(process.env.PORT) || 5000;
    console.log(`🔧 Starting server on port ${PORT}...`);
    
    const serverProcess = startProcess(
      'npx',
      ['tsx', 'server/index.ts'],
      'Server',
      { env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' } }
    );

    const shutdown = () => {
      console.log('\n🛑 Shutting down...');
      serverProcess.kill();
      // Clean up build config
      if (fs.existsSync('vite.build.config.js')) {
        fs.unlinkSync('vite.build.config.js');
      }
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    console.log('✅ TeleMed started successfully!');
    console.log(`🌐 Access your app at: http://localhost:${PORT}`);
    console.log('📝 Press Ctrl+C to stop');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

main();