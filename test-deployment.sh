#!/bin/bash

# 🧪 TeleMed Pro - Teste de Deployment
# Este script testa automaticamente o deployment no Render

set -e

# Verificar se URL foi fornecida
if [ -z "$1" ]; then
    echo "❌ Erro: Forneça a URL do deployment"
    echo "Uso: ./test-deployment.sh https://telemed-pro.onrender.com"
    exit 1
fi

BASE_URL="$1"
echo "🧪 Testando deployment em: $BASE_URL"

# Função para testar endpoint
test_endpoint() {
    local url="$1"
    local description="$2"
    local expected_status="$3"
    
    echo "🔍 Testando: $description"
    
    # Fazer request com timeout
    response=$(curl -s -w "\n%{http_code}\n%{time_total}" -m 10 "$url" 2>/dev/null || echo -e "\nERROR\n999")
    
    # Extrair status code e tempo
    status_code=$(echo "$response" | tail -n 2 | head -n 1)
    time_total=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -2)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo "  ✅ Status: $status_code (${time_total}s)"
        return 0
    else
        echo "  ❌ Status: $status_code (esperado: $expected_status)"
        echo "  📝 Resposta: $body"
        return 1
    fi
}

# Função para testar JSON
test_json_endpoint() {
    local url="$1"
    local description="$2"
    
    echo "🔍 Testando: $description"
    
    response=$(curl -s -w "\n%{http_code}\n%{time_total}" -H "Accept: application/json" -m 10 "$url" 2>/dev/null || echo -e "\nERROR\n999")
    
    status_code=$(echo "$response" | tail -n 2 | head -n 1)
    time_total=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -2)
    
    if [ "$status_code" = "200" ]; then
        # Verificar se é JSON válido
        if echo "$body" | jq . >/dev/null 2>&1; then
            echo "  ✅ Status: $status_code (${time_total}s) - JSON válido"
            # Mostrar campos importantes
            if echo "$body" | jq -r '.status' >/dev/null 2>&1; then
                status=$(echo "$body" | jq -r '.status')
                echo "  📊 Status: $status"
            fi
            if echo "$body" | jq -r '.version' >/dev/null 2>&1; then
                version=$(echo "$body" | jq -r '.version')
                echo "  📋 Versão: $version"
            fi
            return 0
        else
            echo "  ❌ Status: $status_code - JSON inválido"
            echo "  📝 Resposta: $body"
            return 1
        fi
    else
        echo "  ❌ Status: $status_code"
        echo "  📝 Resposta: $body"
        return 1
    fi
}

# Contador de testes
total_tests=0
passed_tests=0

# Testes principais
echo ""
echo "🚀 ===== INICIANDO TESTES DE DEPLOYMENT ====="
echo ""

# Teste 1: Homepage
total_tests=$((total_tests + 1))
if test_endpoint "$BASE_URL" "Homepage" "200"; then
    passed_tests=$((passed_tests + 1))
fi

# Teste 2: Health page
total_tests=$((total_tests + 1))
if test_endpoint "$BASE_URL/health" "Health page" "200"; then
    passed_tests=$((passed_tests + 1))
fi

# Teste 3: API Health
total_tests=$((total_tests + 1))
if test_json_endpoint "$BASE_URL/api/health" "API Health"; then
    passed_tests=$((passed_tests + 1))
fi

# Teste 4: 404 handling
total_tests=$((total_tests + 1))
if test_endpoint "$BASE_URL/pagina-inexistente" "404 handling" "404"; then
    passed_tests=$((passed_tests + 1))
fi

# Teste 5: Headers de segurança
echo "🔍 Testando: Headers de segurança"
security_headers=$(curl -s -I "$BASE_URL" 2>/dev/null | grep -i -E "(x-frame-options|x-content-type-options|x-xss-protection|strict-transport-security)")

if [ -n "$security_headers" ]; then
    echo "  ✅ Headers de segurança encontrados:"
    echo "$security_headers" | sed 's/^/    /'
    total_tests=$((total_tests + 1))
    passed_tests=$((passed_tests + 1))
else
    echo "  ⚠️ Headers de segurança não encontrados"
    total_tests=$((total_tests + 1))
fi

# Teste 6: Performance básica
echo "🔍 Testando: Performance básica"
time_result=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL" 2>/dev/null)

if [ -n "$time_result" ]; then
    time_float=$(echo "$time_result" | cut -d. -f1)
    if [ "$time_float" -lt 5 ]; then
        echo "  ✅ Tempo de resposta: ${time_result}s (< 5s)"
        total_tests=$((total_tests + 1))
        passed_tests=$((passed_tests + 1))
    else
        echo "  ❌ Tempo de resposta: ${time_result}s (> 5s)"
        total_tests=$((total_tests + 1))
    fi
else
    echo "  ❌ Falha ao medir tempo de resposta"
    total_tests=$((total_tests + 1))
fi

# Teste 7: Verificar se é HTTPS
echo "🔍 Testando: HTTPS"
if [[ "$BASE_URL" == https://* ]]; then
    # Testar certificado SSL
    if curl -s --head "$BASE_URL" >/dev/null 2>&1; then
        echo "  ✅ HTTPS funcionando corretamente"
        total_tests=$((total_tests + 1))
        passed_tests=$((passed_tests + 1))
    else
        echo "  ❌ Erro no certificado SSL"
        total_tests=$((total_tests + 1))
    fi
else
    echo "  ⚠️ URL não é HTTPS"
    total_tests=$((total_tests + 1))
fi

# Resultados finais
echo ""
echo "📊 ===== RESULTADOS DOS TESTES ====="
echo ""
echo "✅ Testes aprovados: $passed_tests/$total_tests"

if [ $passed_tests -eq $total_tests ]; then
    echo "🎉 DEPLOYMENT APROVADO!"
    echo ""
    echo "🌐 URLs funcionais:"
    echo "   $BASE_URL"
    echo "   $BASE_URL/health"
    echo "   $BASE_URL/api/health"
    echo ""
    echo "🚀 Deployment está pronto para uso!"
    exit 0
else
    echo "❌ DEPLOYMENT COM PROBLEMAS!"
    echo ""
    echo "🔧 Problemas encontrados:"
    echo "   - $((total_tests - passed_tests)) teste(s) falharam"
    echo "   - Verifique os logs do Render"
    echo "   - Corrija os problemas e tente novamente"
    echo ""
    echo "🔍 Para debug:"
    echo "   - Render logs: https://dashboard.render.com"
    echo "   - Health API: $BASE_URL/api/health"
    echo "   - Health page: $BASE_URL/health"
    exit 1
fi