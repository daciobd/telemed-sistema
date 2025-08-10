#!/bin/bash
# Script para verificar uso detalhado do AI Agent

echo "📊 AI Agent - Usage Statistics"
echo "=============================="
curl -s http://localhost:5000/api/ai-agent/usage-local | jq '.' 2>/dev/null || curl -s http://localhost:5000/api/ai-agent/usage-local

echo ""
echo "📁 Local storage file:"
if [ -f "storage/ai-usage.json" ]; then
    echo "✅ ai-usage.json exists"
    cat storage/ai-usage.json | jq '.' 2>/dev/null || cat storage/ai-usage.json
else
    echo "❌ ai-usage.json not found"
fi