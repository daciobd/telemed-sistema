#!/usr/bin/env node

/**
 * TeleMed Development Server
 * Unified script to start the full application in development mode
 */

const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

// Configuration
const BACKEND_PORT = process.env.PORT || 5000;
const FRONTEND_PORT = 5173;

console.log('🚀 TeleMed Development Environment Starting...');
console.log(`🔧 Backend Port: ${BACKEND_PORT}`);
console.log(`🔧 Frontend Port: ${FRONTEND_PORT}`);

// Enhanced Express server based on working server.js
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.static('public'));

// Logging middleware
app.use((req, res, next) => {
    console.log(`📍 ${req.method} ${req.path}`);
    next();
});

// Serve static HTML files
app.use(express.static('.', {
    extensions: ['html'],
    index: false
}));

// Main routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sistema-integrado.html'));
});

app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'demo-ativo', 'index.html'));
});

app.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'react-app', 'index.html'));
});

app.get('/complete', (req, res) => {
    console.log('🎯 Servindo sistema híbrido completo');
    res.sendFile(path.join(__dirname, 'public', 'telemed-complete.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: 'development',
        backend_port: BACKEND_PORT,
        frontend_port: FRONTEND_PORT
    });
});

// API endpoint for testing
app.get('/api/status', (req, res) => {
    res.json({ 
        message: 'TeleMed API is running',
        timestamp: new Date().toISOString(),
        version: '2.0-dev'
    });
});

// Start the combined development server
const server = app.listen(BACKEND_PORT, '0.0.0.0', () => {
    console.log(`✅ TeleMed Backend running on port ${BACKEND_PORT}`);
    console.log(`🌐 Main App: http://localhost:${BACKEND_PORT}`);
    console.log(`🏥 System: http://localhost:${BACKEND_PORT}/complete`);
    console.log(`📊 Health: http://localhost:${BACKEND_PORT}/health`);
    
    // Start frontend dev server if client exists
    const clientPath = path.join(__dirname, 'client');
    const fs = require('fs');
    
    if (fs.existsSync(clientPath)) {
        console.log(`🌐 Starting frontend dev server on port ${FRONTEND_PORT}...`);
        
        const frontend = spawn('npx', ['vite', '--port', FRONTEND_PORT.toString(), '--host', '0.0.0.0'], {
            cwd: clientPath,
            stdio: 'inherit'
        });
        
        frontend.on('error', (err) => {
            console.error('❌ Frontend server error:', err.message);
        });
    } else {
        console.log('ℹ️ Client directory not found, running backend only');
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⏹️ Shutting down TeleMed development server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n⏹️ Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});