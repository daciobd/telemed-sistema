#!/bin/bash

set -e

echo "🏗️  Building TeleMed Sistema for production..."

# Create dist directory
mkdir -p dist

# Build frontend with Vite
echo "📦 Building frontend..."
npx vite build

# Build backend with esbuild
echo "🔧 Building backend..."
npx esbuild server/index.ts --bundle --platform=node --target=node18 --outdir=dist --format=esm --external:pg-native --external:sqlite3 --external:better-sqlite3 --external:mysql2 --external:mysql --external:oracledb --external:tedious --banner:js="import { createRequire } from 'module'; import { fileURLToPath } from 'url'; import { dirname } from 'path'; const require = createRequire(import.meta.url); const __filename = fileURLToPath(import.meta.url); const __dirname = dirname(__filename);"

# Copy package.json for production
echo "📋 Creating production package.json..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const prodPkg = {
  name: pkg.name,
  version: pkg.version,
  type: pkg.type,
  dependencies: pkg.dependencies,
  scripts: { start: 'node index.js' }
};
fs.writeFileSync('dist/package.json', JSON.stringify(prodPkg, null, 2));
"

echo "✅ Build completed successfully!"
echo "📂 Build output: ./dist/"