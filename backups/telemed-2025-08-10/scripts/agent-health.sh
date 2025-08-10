#!/bin/bash
# Script para monitorar a saúde do AI Agent

echo "🤖 Verificando saúde do AI Agent..."
echo "📊 Health Check:"
curl -s http://localhost:5000/api/ai-agent/health | jq '.' 2>/dev/null || curl -s http://localhost:5000/api/ai-agent/health

echo ""
echo "📈 Usage Statistics:"
curl -s http://localhost:5000/api/ai-agent/usage-local | jq '.' 2>/dev/null || curl -s http://localhost:5000/api/ai-agent/usage-local