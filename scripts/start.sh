#!/bin/bash

set -e

echo "🚀 Starting TeleMed Sistema in production..."

# Set production environment
export NODE_ENV=production
export PORT=${PORT:-5000}

# Check if dist exists, build if not
if [ ! -d "dist" ]; then
  echo "📦 Building project first..."
  ./scripts/build.sh
fi

# Start the server
echo "🌐 Starting server on port $PORT"
cd dist && node index.js