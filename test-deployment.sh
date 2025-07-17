#!/bin/bash

# ========================================
# TeleMed Sistema - Test Deployment Script
# ========================================
# Testa se o deployment está funcionando corretamente
# Verifica API status, health checks e endpoints críticos

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
TIMEOUT=30
RETRY_COUNT=3
SLEEP_BETWEEN_RETRIES=5

# URLs para teste
if [ -z "$DEPLOY_URL" ]; then
    DEPLOY_URL="http://localhost:5000"
fi

API_STATUS_URL="${DEPLOY_URL}/api/status"
HEALTH_URL="${DEPLOY_URL}/health"
ROOT_URL="${DEPLOY_URL}/"

echo -e "${BLUE}🧪 Iniciando testes de deployment...${NC}"
echo -e "${BLUE}📍 URL Base: ${DEPLOY_URL}${NC}"

# Função para fazer requisições com retry
make_request() {
    local url=$1
    local expected_status=${2:-200}
    local retry_count=0
    
    while [ $retry_count -lt $RETRY_COUNT ]; do
        echo -e "${YELLOW}🔄 Testando: ${url}${NC}"
        
        if command -v curl >/dev/null 2>&1; then
            response=$(curl -s -w "HTTPSTATUS:%{http_code}" --connect-timeout $TIMEOUT "$url" 2>/dev/null || echo "HTTPSTATUS:000")
            body=$(echo "$response" | sed -E 's/HTTPSTATUS\:[0-9]{3}$//')
            status=$(echo "$response" | tr -d '\n' | sed -E 's/.*HTTPSTATUS:([0-9]{3})$/\1/')
        else
            echo -e "${RED}❌ curl não encontrado, instalando...${NC}"
            # Tentar instalar curl se não estiver disponível
            if command -v apt-get >/dev/null 2>&1; then
                apt-get update && apt-get install -y curl
            elif command -v yum >/dev/null 2>&1; then
                yum install -y curl
            else
                echo -e "${RED}❌ Não foi possível instalar curl${NC}"
                return 1
            fi
            continue
        fi
        
        if [ "$status" = "$expected_status" ]; then
            echo -e "${GREEN}✅ Sucesso: ${url} (Status: ${status})${NC}"
            echo "$body"
            return 0
        else
            echo -e "${RED}❌ Falha: ${url} (Status: ${status})${NC}"
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $RETRY_COUNT ]; then
                echo -e "${YELLOW}⏳ Retry ${retry_count}/${RETRY_COUNT} em ${SLEEP_BETWEEN_RETRIES}s...${NC}"
                sleep $SLEEP_BETWEEN_RETRIES
            fi
        fi
    done
    
    echo -e "${RED}❌ Falha após ${RETRY_COUNT} tentativas: ${url}${NC}"
    return 1
}

# Função para testar conteúdo JSON
test_json_response() {
    local url=$1
    local expected_field=$2
    
    echo -e "${YELLOW}🔍 Testando JSON: ${url}${NC}"
    
    response=$(curl -s --connect-timeout $TIMEOUT "$url" 2>/dev/null || echo "{}")
    
    if command -v jq >/dev/null 2>&1; then
        if echo "$response" | jq -e ".$expected_field" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ JSON válido com campo '${expected_field}'${NC}"
            echo "$response" | jq .
            return 0
        else
            echo -e "${RED}❌ JSON inválido ou campo '${expected_field}' ausente${NC}"
            echo "$response"
            return 1
        fi
    else
        # Teste simples sem jq
        if echo "$response" | grep -q "\"$expected_field\""; then
            echo -e "${GREEN}✅ JSON contém campo '${expected_field}'${NC}"
            echo "$response"
            return 0
        else
            echo -e "${RED}❌ Campo '${expected_field}' não encontrado${NC}"
            echo "$response"
            return 1
        fi
    fi
}

# Teste 1: Health Check básico
echo -e "\n${BLUE}🏥 Teste 1: Health Check${NC}"
if make_request "$HEALTH_URL" 200; then
    test_json_response "$HEALTH_URL" "status"
else
    echo -e "${RED}❌ Health Check falhou${NC}"
    exit 1
fi

# Teste 2: API Status
echo -e "\n${BLUE}🔌 Teste 2: API Status${NC}"
if make_request "$API_STATUS_URL" 200; then
    test_json_response "$API_STATUS_URL" "status"
else
    echo -e "${RED}❌ API Status falhou${NC}"
    exit 1
fi

# Teste 3: Página principal
echo -e "\n${BLUE}🏠 Teste 3: Página Principal${NC}"
if make_request "$ROOT_URL" 200; then
    echo -e "${GREEN}✅ Página principal carregou${NC}"
else
    echo -e "${RED}❌ Página principal falhou${NC}"
    exit 1
fi

# Teste 4: Endpoints críticos
echo -e "\n${BLUE}🎯 Teste 4: Endpoints Críticos${NC}"

critical_endpoints=(
    "/doctor-dashboard"
    "/patient-dashboard"
    "/security"
)

failed_endpoints=0

for endpoint in "${critical_endpoints[@]}"; do
    url="${DEPLOY_URL}${endpoint}"
    if make_request "$url" 200; then
        echo -e "${GREEN}✅ ${endpoint} funcionando${NC}"
    else
        echo -e "${RED}❌ ${endpoint} falhou${NC}"
        failed_endpoints=$((failed_endpoints + 1))
    fi
done

# Teste 5: Performance básica
echo -e "\n${BLUE}⚡ Teste 5: Performance${NC}"
start_time=$(date +%s%N)
make_request "$HEALTH_URL" 200 >/dev/null
end_time=$(date +%s%N)
response_time=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds

if [ $response_time -lt 2000 ]; then
    echo -e "${GREEN}✅ Response time: ${response_time}ms (< 2s)${NC}"
else
    echo -e "${YELLOW}⚠️ Response time: ${response_time}ms (> 2s)${NC}"
fi

# Resultado final
echo -e "\n${BLUE}📊 Resumo dos Testes${NC}"
echo -e "=============================="

if [ $failed_endpoints -eq 0 ]; then
    echo -e "${GREEN}✅ Todos os testes passaram!${NC}"
    echo -e "${GREEN}🚀 Deploy está funcionando corretamente${NC}"
    
    # Salvar resultado do teste
    echo "{
        \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
        \"status\": \"success\",
        \"deploy_url\": \"$DEPLOY_URL\",
        \"response_time_ms\": $response_time,
        \"tests_passed\": true,
        \"failed_endpoints\": 0
    }" > test-results.json
    
    exit 0
else
    echo -e "${RED}❌ ${failed_endpoints} endpoint(s) falharam${NC}"
    echo -e "${RED}🚨 Deploy tem problemas${NC}"
    
    # Salvar resultado do teste
    echo "{
        \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
        \"status\": \"failed\",
        \"deploy_url\": \"$DEPLOY_URL\",
        \"response_time_ms\": $response_time,
        \"tests_passed\": false,
        \"failed_endpoints\": $failed_endpoints
    }" > test-results.json
    
    exit 1
fi