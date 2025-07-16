#!/bin/bash

# 🚀 TeleMed Pro - Preparação Automática para Render
# Este script prepara automaticamente o projeto para deploy no Render

set -e

echo "🚀 Iniciando preparação para Render..."

# Verificar se estamos no diretório correto
if [ ! -f "render.yaml" ]; then
    echo "❌ Erro: render.yaml não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

# Navegar para o diretório telemed-v2
cd telemed-v2

echo "📦 Verificando dependências..."
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado no diretório telemed-v2."
    exit 1
fi

# Limpar cache e node_modules
echo "🧹 Limpando cache e dependências antigas..."
rm -rf node_modules
rm -rf .next
rm -f package-lock.json

# Instalar dependências
echo "📥 Instalando dependências..."
npm install

# Verificar se build funciona localmente
echo "🔨 Testando build local..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build local. Corrija os erros antes de continuar."
    exit 1
fi

# Voltar para raiz
cd ..

# Verificar arquivos essenciais
echo "🔍 Verificando arquivos essenciais..."

required_files=(
    "render.yaml"
    ".env.example"
    "telemed-v2/package.json"
    "telemed-v2/app/api/health/route.ts"
    "telemed-v2/app/health/page.tsx"
    "telemed-v2/next.config.js"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Arquivo obrigatório não encontrado: $file"
        exit 1
    fi
done

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
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Temporary files
*.tmp
*.temp

# Database
*.db
*.sqlite

# Testing
coverage/

# Vercel
.vercel

# Render
.render
EOF

# Verificar se o projeto está pronto
echo "✅ Verificação final..."

# Verificar se health check está funcionando
echo "🏥 Verificando health check..."
if ! grep -q "export async function GET" telemed-v2/app/api/health/route.ts; then
    echo "❌ Health check API não está configurado corretamente."
    exit 1
fi

# Verificar configuração do Next.js
echo "⚙️ Verificando configuração do Next.js..."
if [ ! -f "telemed-v2/next.config.js" ]; then
    echo "❌ next.config.js não encontrado."
    exit 1
fi

# Verificar PORT no package.json
echo "🔌 Verificando configuração de porta..."
if ! grep -q "\${PORT:-3001}" telemed-v2/package.json; then
    echo "❌ Configuração de porta não está correta no package.json."
    exit 1
fi

echo ""
echo "🎉 ===== PREPARAÇÃO CONCLUÍDA COM SUCESSO! ====="
echo ""
echo "✅ Próximos passos:"
echo "1. Fazer commit e push das alterações:"
echo "   git add ."
echo "   git commit -m 'feat: configuração completa para Render'"
echo "   git push origin main"
echo ""
echo "2. Configurar o projeto no Render:"
echo "   - Acesse: https://dashboard.render.com"
echo "   - Conecte o repositório GitHub"
echo "   - Use o render.yaml para configuração automática"
echo ""
echo "3. Aguardar o deploy (2-3 minutos)"
echo ""
echo "4. Testar o deployment:"
echo "   ./test-deployment.sh https://telemed-pro.onrender.com"
echo ""
echo "📊 Arquivos preparados:"
echo "   ✅ render.yaml - Configuração do Render"
echo "   ✅ .env.example - Variáveis de ambiente"
echo "   ✅ .gitignore - Arquivos ignorados"
echo "   ✅ Health checks - API e página estática"
echo "   ✅ Package.json - Scripts otimizados"
echo "   ✅ Build testado localmente"
echo ""
echo "🌐 URLs finais (após deploy):"
echo "   https://telemed-pro.onrender.com"
echo "   https://telemed-pro.onrender.com/health"
echo "   https://telemed-pro.onrender.com/api/health"
echo ""
echo "🚀 Pronto para deploy no Render!"