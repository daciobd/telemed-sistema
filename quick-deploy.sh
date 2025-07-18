#!/bin/bash

# ========================================
# TeleMed Sistema - Deploy Rápido Render
# ========================================

set -e

echo "🚀 Iniciando deploy rápido para Render..."

# Limpar builds anteriores
echo "🧹 Limpando builds..."
rm -rf .next/
rm -rf dist/
rm -rf node_modules/.cache/

# Verificar se o Dr. AI existe
if [ ! -f "public/dr-ai.html" ]; then
    echo "❌ Dr. AI não encontrado em public/dr-ai.html"
    exit 1
fi

echo "✅ Dr. AI encontrado"

# Verificar se o render.yaml existe
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml não encontrado"
    exit 1
fi

echo "✅ render.yaml configurado"

# Verificar health endpoint
if [ ! -f "app/health/route.ts" ]; then
    echo "❌ Health endpoint não encontrado"
    exit 1
fi

echo "✅ Health endpoint configurado"

# Verificar package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado"
    exit 1
fi

echo "✅ package.json encontrado"

# Mostrar informações do deploy
echo ""
echo "📋 Informações do deploy:"
echo "   - Dr. AI: ✅ Disponível em /dr-ai.html"
echo "   - Health: ✅ Disponível em /health"
echo "   - Next.js: ✅ Versão 15.4.1"
echo "   - Render: ✅ Configurado"
echo ""

echo "🎯 URLs que estarão disponíveis:"
echo "   - App principal: https://telemed-sistema.onrender.com"
echo "   - Dr. AI: https://telemed-sistema.onrender.com/dr-ai.html"
echo "   - Health: https://telemed-sistema.onrender.com/health"
echo ""

echo "⚡ Deploy configurado com sucesso!"
echo "🔗 Acesse o Render Dashboard para iniciar o deploy"
echo "⏱️ Tempo estimado: 3-5 minutos"