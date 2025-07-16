#!/bin/bash

# 🚀 TeleMed Pro - Quick Deploy para Render

echo "🚀 Preparação rápida para Deploy Render..."

# Verificar arquivos essenciais
echo "🔍 Verificando arquivos essenciais..."
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml não encontrado"
    exit 1
fi

if [ ! -f "telemed-v2/package.json" ]; then
    echo "❌ telemed-v2/package.json não encontrado"
    exit 1
fi

if [ ! -f "telemed-v2/app/api/health/route.ts" ]; then
    echo "❌ Health check API não encontrado"
    exit 1
fi

echo "✅ Arquivos essenciais verificados"

# Atualizar .gitignore
echo "📝 Atualizando .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Production builds
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.production.local
.env.development.local

# Logs
*.log
npm-debug.log*

# Runtime data
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# next.js build output
.next

# Serverless directories
.serverless

# DynamoDB Local files
.dynamodb/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite

# Vercel
.vercel

# Render
.render
EOF

echo "✅ .gitignore atualizado"

echo ""
echo "🎉 ===== PREPARAÇÃO CONCLUÍDA! ====="
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Fazer commit e push:"
echo "   git add ."
echo "   git commit -m 'feat: configuração Render completa'"
echo "   git push origin main"
echo ""
echo "2. Configurar no Render:"
echo "   - Acesse: https://dashboard.render.com"
echo "   - Conecte repositório GitHub"
echo "   - Use render.yaml para configuração"
echo ""
echo "3. Aguardar deploy (2-3 minutos)"
echo ""
echo "4. Testar deployment:"
echo "   ./test-deployment.sh https://telemed-pro.onrender.com"
echo ""
echo "🌐 URLs finais:"
echo "   https://telemed-pro.onrender.com"
echo "   https://telemed-pro.onrender.com/health"
echo "   https://telemed-pro.onrender.com/api/health"
echo ""
echo "🚀 Pronto para deploy no Render!"