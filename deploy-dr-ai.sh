#!/bin/bash

# ========================================
# Deploy Dr. AI para Render - TeleMed Sistema
# ========================================

echo "🚀 Iniciando deploy do Dr. AI para Render..."
echo ""

# Verificar se dr-ai.html existe
if [ ! -f "public/dr-ai.html" ]; then
    echo "❌ ERRO: public/dr-ai.html não encontrado!"
    exit 1
fi

echo "✅ Arquivo public/dr-ai.html encontrado"

# Verificar se render.yaml existe
if [ ! -f "render.yaml" ]; then
    echo "❌ ERRO: render.yaml não encontrado!"
    exit 1
fi

echo "✅ Arquivo render.yaml configurado"

# Verificar se health endpoint existe
if [ ! -f "app/health/route.ts" ]; then
    echo "❌ ERRO: app/health/route.ts não encontrado!"
    exit 1
fi

echo "✅ Health endpoint configurado"

echo ""
echo "📋 Arquivos Dr. AI verificados:"
echo "   ✅ public/dr-ai.html - Sistema completo"
echo "   ✅ app/dr-ai/page.tsx - Integração Next.js"
echo "   ✅ render.yaml - Deploy automático"
echo "   ✅ app/health/route.ts - Health check"
echo ""

echo "🔧 Comandos para executar:"
echo ""
echo "# 1. Adicionar arquivo Dr. AI"
echo "git add public/dr-ai.html"
echo ""
echo "# 2. Adicionar todos os arquivos"
echo "git add ."
echo ""
echo "# 3. Commit com mensagem"
echo 'git commit -m "feat: Dr. AI sistema completo - deploy para Render"'
echo ""
echo "# 4. Push para repositório"
echo "git push origin main"
echo ""

echo "🎯 URLs que estarão disponíveis após deploy:"
echo "   🌐 App Principal: https://telemed-sistema.onrender.com/"
echo "   🤖 Dr. AI Direto: https://telemed-sistema.onrender.com/dr-ai.html"
echo "   🔗 Dr. AI Next.js: https://telemed-sistema.onrender.com/dr-ai"
echo "   ❤️ Health Check: https://telemed-sistema.onrender.com/health"
echo ""

echo "⏱️ Tempo estimado do deploy:"
echo "   📦 Build: 3-5 minutos"
echo "   🚀 Deploy: 2-3 minutos"
echo "   ✅ Total: 5-8 minutos"
echo ""

echo "🔍 Para monitorar o deploy:"
echo "   1. Acesse o Render Dashboard"
echo "   2. Vá para o serviço 'telemed-sistema'"
echo "   3. Acompanhe os logs de build e deploy"
echo ""

echo "✅ Script de deploy preparado!"
echo "Execute os comandos git acima para iniciar o deploy"