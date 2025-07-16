#!/bin/bash

# 📊 TeleMed Pro - Monitor Render Deployment
# Este script monitora continuamente o deployment no Render

set -e

# Verificar se URL foi fornecida
if [ -z "$1" ]; then
    echo "❌ Erro: Forneça a URL do deployment"
    echo "Uso: ./monitor-render.sh https://telemed-pro.onrender.com [intervalo_segundos]"
    exit 1
fi

BASE_URL="$1"
INTERVAL=${2:-300} # Default: 5 minutos

echo "📊 Monitorando deployment: $BASE_URL"
echo "⏰ Intervalo: ${INTERVAL}s"
echo "🔄 Pressione Ctrl+C para parar"
echo ""

# Função para log com timestamp
log_with_time() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Função para verificar saúde
check_health() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Testar endpoint principal
    main_status=$(curl -s -w "%{http_code}" -o /dev/null -m 10 "$BASE_URL" 2>/dev/null || echo "ERROR")
    
    # Testar health API
    health_response=$(curl -s -w "\n%{http_code}" -m 10 "$BASE_URL/api/health" 2>/dev/null || echo -e "\nERROR")
    health_status=$(echo "$health_response" | tail -n 1)
    health_body=$(echo "$health_response" | head -n -1)
    
    # Medir tempo de resposta
    response_time=$(curl -s -w "%{time_total}" -o /dev/null -m 10 "$BASE_URL" 2>/dev/null || echo "ERROR")
    
    # Verificar se API retorna JSON válido
    if [ "$health_status" = "200" ] && echo "$health_body" | jq . >/dev/null 2>&1; then
        app_status=$(echo "$health_body" | jq -r '.status // "unknown"')
        app_version=$(echo "$health_body" | jq -r '.version // "unknown"')
        uptime=$(echo "$health_body" | jq -r '.uptime // "unknown"')
        
        if [ "$main_status" = "200" ] && [ "$health_status" = "200" ]; then
            log_with_time "✅ Sistema saudável - Status: $app_status | Versão: $app_version | Tempo: ${response_time}s"
        else
            log_with_time "⚠️ Parcialmente saudável - Main: $main_status | Health: $health_status | Tempo: ${response_time}s"
        fi
    else
        log_with_time "❌ Sistema com problemas - Main: $main_status | Health: $health_status | Tempo: ${response_time}s"
        
        # Log detalhado em caso de erro
        if [ "$health_status" != "200" ]; then
            log_with_time "🔍 Health API response: $health_body"
        fi
    fi
}

# Função para verificar alertas
check_alerts() {
    local main_status=$(curl -s -w "%{http_code}" -o /dev/null -m 10 "$BASE_URL" 2>/dev/null || echo "ERROR")
    local response_time=$(curl -s -w "%{time_total}" -o /dev/null -m 10 "$BASE_URL" 2>/dev/null || echo "999")
    
    # Alertas de status
    if [ "$main_status" != "200" ]; then
        log_with_time "🚨 ALERTA: Site inacessível (Status: $main_status)"
    fi
    
    # Alertas de performance
    if [ "$response_time" != "ERROR" ]; then
        time_int=$(echo "$response_time" | cut -d. -f1)
        if [ "$time_int" -gt 10 ]; then
            log_with_time "🚨 ALERTA: Resposta lenta (${response_time}s > 10s)"
        fi
    fi
}

# Função para estatísticas
show_stats() {
    local uptime_response=$(curl -s -m 10 "$BASE_URL/api/health" 2>/dev/null || echo "ERROR")
    
    if [ "$uptime_response" != "ERROR" ] && echo "$uptime_response" | jq . >/dev/null 2>&1; then
        local uptime=$(echo "$uptime_response" | jq -r '.uptime // "unknown"')
        local timestamp=$(echo "$uptime_response" | jq -r '.timestamp // "unknown"')
        local environment=$(echo "$uptime_response" | jq -r '.environment // "unknown"')
        
        echo ""
        log_with_time "📊 Estatísticas do Sistema:"
        log_with_time "   Uptime: ${uptime}s"
        log_with_time "   Ambiente: $environment"
        log_with_time "   Último check: $timestamp"
        echo ""
    fi
}

# Trap para capturar Ctrl+C
trap 'echo ""; log_with_time "⏹️ Monitoramento interrompido"; exit 0' INT

# Loop principal de monitoramento
log_with_time "🚀 Iniciando monitoramento..."
check_count=0

while true; do
    check_count=$((check_count + 1))
    
    # Verificar saúde
    check_health
    
    # Verificar alertas
    check_alerts
    
    # Mostrar estatísticas a cada 10 checks
    if [ $((check_count % 10)) -eq 0 ]; then
        show_stats
    fi
    
    # Aguardar próximo check
    sleep $INTERVAL
done