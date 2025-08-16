#!/bin/bash

# TeleMed Development Environment Launcher
# This script provides the "dev" functionality expected by the workflow

echo "🚀 TeleMed Development Environment Starting..."
echo "📊 Environment: Development"
echo "🔗 Backend: TypeScript with tsx"
echo "🌐 Frontend: React with Vite"

# Set environment variables
export NODE_ENV=development
export PORT=5000
export VITE_PORT=5173

# Kill any existing processes
pkill -f "tsx.*server" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start backend server with tsx
echo "📡 Starting backend server on port $PORT..."
cd server && npx tsx watch index.ts --port $PORT &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 2

# Start frontend dev server
echo "🌐 Starting frontend dev server on port $VITE_PORT..."
cd ../client && npx vite --port $VITE_PORT --host 0.0.0.0 &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo -e "\n⏹️ Shutting down development servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    pkill -f "tsx.*server" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

echo "✅ Development environment ready!"
echo "📍 Backend: http://localhost:$PORT"
echo "📍 Frontend: http://localhost:$VITE_PORT"
echo "⏹️ Press Ctrl+C to stop both servers"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID