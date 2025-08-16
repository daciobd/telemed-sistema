#!/usr/bin/env node

/**
 * NPM Dev Script Replacement
 * Simulates the 'npm run dev' command that the workflow expects
 */

const { execSync, spawn } = require('child_process');
const path = require('path');

console.log('🚀 TeleMed: Starting development environment...');

// Set up environment
process.env.NODE_ENV = 'development';
process.env.PORT = process.env.PORT || '5000';
process.env.VITE_PORT = '5173';

try {
  // Clean up any existing processes
  try {
    execSync('pkill -f "tsx.*server" 2>/dev/null || true', { stdio: 'ignore' });
    execSync('pkill -f "vite" 2>/dev/null || true', { stdio: 'ignore' });
  } catch (error) {
    // Ignore cleanup errors
  }

  console.log('📡 Starting backend server...');
  
  // Start backend with tsx
  const backend = spawn('npx', ['tsx', 'watch', 'server/index.ts'], {
    stdio: 'inherit',
    env: process.env
  });

  // Wait a moment for backend to start
  setTimeout(() => {
    console.log('🌐 Starting frontend dev server...');
    
    // Start frontend with vite
    const frontend = spawn('npx', ['vite', '--port', '5173', '--host', '0.0.0.0'], {
      stdio: 'inherit',
      cwd: path.join(__dirname, 'client'),
      env: process.env
    });

    // Handle frontend errors
    frontend.on('error', (err) => {
      console.error('❌ Frontend error:', err.message);
    });

    frontend.on('close', (code) => {
      if (code !== 0) {
        console.log(`❌ Frontend exited with code ${code}`);
      }
    });

  }, 2000);

  // Handle backend errors
  backend.on('error', (err) => {
    console.error('❌ Backend error:', err.message);
  });

  backend.on('close', (code) => {
    if (code !== 0) {
      console.log(`❌ Backend exited with code ${code}`);
    }
  });

  // Cleanup on exit
  process.on('SIGINT', () => {
    console.log('\n⏹️ Shutting down development servers...');
    try {
      execSync('pkill -f "tsx.*server" 2>/dev/null || true', { stdio: 'ignore' });
      execSync('pkill -f "vite" 2>/dev/null || true', { stdio: 'ignore' });
    } catch (error) {
      // Ignore cleanup errors
    }
    process.exit(0);
  });

  console.log('✅ Development environment started!');
  console.log('📍 Backend: http://localhost:' + process.env.PORT);
  console.log('📍 Frontend: http://localhost:5173');

} catch (error) {
  console.error('❌ Failed to start development environment:', error.message);
  process.exit(1);
}