#!/bin/bash

# 🚀 TeleMed Pro - Deploy Completo para Render
# Este script executa o deploy completo com verificações

set -e

echo "🚀 Iniciando deploy completo para Render..."

# Verificar se preparação foi executada
if [ ! -f "render.yaml" ]; then
    echo "❌ Erro: Execute ./prepare-render.sh primeiro"
    exit 1
fi

# Executar preparação se necessário
echo "📋 Executando preparação..."
./prepare-render.sh

# Verificar se estamos em um repositório git
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositório git..."
    git init
    git branch -M main
fi

# Verificar se origin está configurado
if ! git remote get-url origin &>/dev/null; then
    echo "⚠️ Aviso: Origin remoto não configurado."
    echo "Configure manualmente:"
    echo "git remote add origin https://github.com/seu-usuario/telemed-pro.git"
    echo ""
    read -p "Deseja continuar mesmo assim? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        exit 1
    fi
fi

# Verificar status do git
echo "🔍 Verificando status do git..."
if ! git diff --quiet; then
    echo "📝 Alterações detectadas, fazendo commit..."
    git add .
    git commit -m "feat: configuração completa para Render Deploy - $(date)"
else
    echo "✅ Nenhuma alteração detectada"
fi

# Push para main
echo "📤 Enviando para repositório..."
if git remote get-url origin &>/dev/null; then
    git push origin main
    echo "✅ Push realizado com sucesso"
else
    echo "⚠️ Push pulado - origin não configurado"
fi

# Instruções finais
echo ""
echo "🎉 ===== DEPLOY PREPARADO COM SUCESSO! ====="
echo ""
echo "📋 Próximos passos no Render:"
echo ""
echo "1. 🌐 Acesse: https://dashboard.render.com"
echo "2. 🔗 Conecte seu repositório GitHub"
echo "3. 📁 Selecione o repositório telemed-pro"
echo "4. ⚙️ Configure usando render.yaml:"
echo "   - Nome: telemed-pro"
echo "   - Branch: main"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: npm start"
echo ""
echo "5. 🔐 Configurar variáveis de ambiente:"
echo "   NODE_ENV=production"
echo "   NEXT_PUBLIC_APP_URL=https://telemed-pro.onrender.com"
echo "   NEXTAUTH_URL=https://telemed-pro.onrender.com"
echo "   NEXTAUTH_SECRET=(gerar automaticamente)"
echo "   FEATURE_AI_ASSISTANT=true"
echo "   FEATURE_VIDEO_CALLS=true"
echo ""
echo "6. 🚀 Clicar em 'Create Web Service'"
echo ""
echo "⏱️ Tempo estimado de deploy: 2-3 minutos"
echo ""
echo "🔍 Após o deploy, execute:"
echo "./test-deployment.sh https://telemed-pro.onrender.com"
echo ""
echo "📊 URLs finais:"
echo "   https://telemed-pro.onrender.com"
echo "   https://telemed-pro.onrender.com/health"
echo "   https://telemed-pro.onrender.com/api/health"
echo ""
echo "🎯 Deploy pronto para execução!"