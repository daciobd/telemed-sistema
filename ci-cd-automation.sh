#!/bin/bash

# ========================================
# TeleMed Sistema - CI/CD Automation
# ========================================
# Script principal para automação CI/CD
# Combina todos os scripts para deployment automático

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}🤖 TeleMed Sistema - CI/CD Automation${NC}"
    echo -e "=========================================="
    echo ""
    echo -e "${YELLOW}Uso:${NC}"
    echo -e "  $0 full-deploy              - Deploy completo (backup + prepare + deploy + test)"
    echo -e "  $0 quick-deploy             - Deploy rápido (prepare + deploy)"
    echo -e "  $0 test-only                - Apenas testes (local)"
    echo -e "  $0 prepare-only             - Apenas preparação"
    echo -e "  $0 emergency-rollback       - Rollback de emergência"
    echo -e "  $0 status                   - Status do sistema"
    echo ""
    echo -e "${YELLOW}Variáveis de Ambiente:${NC}"
    echo -e "  DEPLOY_URL                  - URL para testes (padrão: http://localhost:5000)"
    echo -e "  SKIP_TESTS                  - Pular testes (padrão: false)"
    echo -e "  RENDER_DEPLOY_HOOK          - Hook do Render para deploy automático"
    echo ""
    echo -e "${YELLOW}Exemplos:${NC}"
    echo -e "  $0 full-deploy"
    echo -e "  DEPLOY_URL=https://telemed.onrender.com $0 test-only"
    echo -e "  SKIP_TESTS=true $0 quick-deploy"
    echo ""
}

# Verificar se os scripts existem
check_scripts() {
    local scripts=("test-deployment.sh" "prepare-render.sh" "backup-and-rollback.sh")
    
    for script in "${scripts[@]}"; do
        if [ ! -f "$script" ]; then
            echo -e "${RED}❌ Script não encontrado: $script${NC}"
            exit 1
        fi
        
        if [ ! -x "$script" ]; then
            echo -e "${YELLOW}🔧 Tornando executável: $script${NC}"
            chmod +x "$script"
        fi
    done
    
    echo -e "${GREEN}✅ Todos os scripts encontrados${NC}"
}

# Status do sistema
show_status() {
    echo -e "${BLUE}📊 Status do Sistema TeleMed${NC}"
    echo -e "=============================="
    
    # Informações básicas
    echo -e "${YELLOW}📋 Informações Básicas:${NC}"
    echo -e "   Data/Hora: $(date)"
    echo -e "   Diretório: $(pwd)"
    echo -e "   Usuário: $(whoami)"
    echo -e "   Node.js: $(node --version 2>/dev/null || echo 'não instalado')"
    echo -e "   npm: $(npm --version 2>/dev/null || echo 'não instalado')"
    echo ""
    
    # Git status
    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${YELLOW}🔄 Git Status:${NC}"
        echo -e "   Branch: $(git branch --show-current)"
        echo -e "   Commit: $(git rev-parse --short HEAD)"
        echo -e "   Mudanças: $(git status --porcelain | wc -l) arquivos"
        echo ""
    fi
    
    # Backups disponíveis
    if [ -d "backups" ]; then
        backup_count=$(ls -1 backups/*_info.json 2>/dev/null | wc -l)
        echo -e "${YELLOW}📦 Backups:${NC}"
        echo -e "   Disponíveis: $backup_count"
        echo ""
    fi
    
    # Status do servidor local
    echo -e "${YELLOW}🌐 Servidor Local:${NC}"
    if curl -s http://localhost:5000/health >/dev/null 2>&1; then
        echo -e "   Status: ${GREEN}Online${NC}"
        health_response=$(curl -s http://localhost:5000/health)
        version=$(echo "$health_response" | grep -o '"version":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "unknown")
        echo -e "   Versão: $version"
    else
        echo -e "   Status: ${RED}Offline${NC}"
    fi
    echo ""
    
    # Render status (se URL configurada)
    if [ ! -z "$DEPLOY_URL" ] && [ "$DEPLOY_URL" != "http://localhost:5000" ]; then
        echo -e "${YELLOW}☁️ Render Deployment:${NC}"
        if curl -s "$DEPLOY_URL/health" >/dev/null 2>&1; then
            echo -e "   Status: ${GREEN}Online${NC}"
            echo -e "   URL: $DEPLOY_URL"
        else
            echo -e "   Status: ${RED}Offline ou inacessível${NC}"
        fi
        echo ""
    fi
}

# Deploy completo
full_deploy() {
    echo -e "${BLUE}🚀 Iniciando Deploy Completo${NC}"
    echo -e "=============================="
    
    # 1. Verificar scripts
    check_scripts
    
    # 2. Criar backup
    echo -e "\n${YELLOW}📦 Passo 1: Backup${NC}"
    ./backup-and-rollback.sh backup || {
        echo -e "${RED}❌ Backup falhou${NC}"
        exit 1
    }
    
    # 3. Preparar deploy
    echo -e "\n${YELLOW}🔧 Passo 2: Preparação${NC}"
    ./prepare-render.sh || {
        echo -e "${RED}❌ Preparação falhou${NC}"
        exit 1
    }
    
    # 4. Deploy (se hook configurado)
    if [ ! -z "$RENDER_DEPLOY_HOOK" ]; then
        echo -e "\n${YELLOW}🚀 Passo 3: Deploy${NC}"
        echo -e "Triggering Render deploy..."
        
        response=$(curl -s -w "%{http_code}" -X POST "$RENDER_DEPLOY_HOOK")
        status_code="${response: -3}"
        
        if [ "$status_code" -eq 200 ] || [ "$status_code" -eq 201 ]; then
            echo -e "${GREEN}✅ Deploy iniciado com sucesso${NC}"
            echo -e "${YELLOW}⏳ Aguardando deploy completar...${NC}"
            sleep 60
        else
            echo -e "${RED}❌ Falha ao iniciar deploy (Status: $status_code)${NC}"
            exit 1
        fi
    else
        echo -e "\n${YELLOW}⚠️ RENDER_DEPLOY_HOOK não configurado, pulando deploy automático${NC}"
    fi
    
    # 5. Testes
    if [ "$SKIP_TESTS" != "true" ]; then
        echo -e "\n${YELLOW}🧪 Passo 4: Testes${NC}"
        test_deployment || {
            echo -e "${RED}❌ Testes falharam${NC}"
            echo -e "${YELLOW}🔄 Considerando rollback...${NC}"
            return 1
        }
    else
        echo -e "\n${YELLOW}⏭️ Testes pulados (SKIP_TESTS=true)${NC}"
    fi
    
    echo -e "\n${GREEN}🎉 Deploy completo finalizado com sucesso!${NC}"
}

# Deploy rápido
quick_deploy() {
    echo -e "${BLUE}⚡ Deploy Rápido${NC}"
    echo -e "================"
    
    check_scripts
    
    # Preparar
    ./prepare-render.sh || {
        echo -e "${RED}❌ Preparação falhou${NC}"
        exit 1
    }
    
    # Deploy
    if [ ! -z "$RENDER_DEPLOY_HOOK" ]; then
        echo -e "${YELLOW}🚀 Triggering deploy...${NC}"
        curl -X POST "$RENDER_DEPLOY_HOOK"
        echo -e "${GREEN}✅ Deploy iniciado${NC}"
    else
        echo -e "${YELLOW}⚠️ Deploy hook não configurado${NC}"
    fi
}

# Executar testes
test_deployment() {
    echo -e "${BLUE}🧪 Executando Testes${NC}"
    echo -e "===================="
    
    check_scripts
    
    local test_url=${DEPLOY_URL:-"http://localhost:5000"}
    echo -e "${YELLOW}🎯 URL de teste: $test_url${NC}"
    
    DEPLOY_URL="$test_url" ./test-deployment.sh
}

# Rollback de emergência
emergency_rollback() {
    echo -e "${RED}🚨 ROLLBACK DE EMERGÊNCIA${NC}"
    echo -e "=========================="
    
    check_scripts
    
    echo -e "${YELLOW}🔄 Executando rollback Git...${NC}"
    ./backup-and-rollback.sh rollback HEAD~1
    
    echo -e "${YELLOW}🧪 Testando após rollback...${NC}"
    sleep 5
    test_deployment
    
    echo -e "${GREEN}✅ Rollback de emergência concluído${NC}"
}

# Função principal
main() {
    case "$1" in
        "full-deploy")
            full_deploy
            ;;
        "quick-deploy")
            quick_deploy
            ;;
        "test-only")
            test_deployment
            ;;
        "prepare-only")
            check_scripts
            ./prepare-render.sh
            ;;
        "emergency-rollback")
            emergency_rollback
            ;;
        "status")
            show_status
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            echo -e "${RED}❌ Comando inválido: $1${NC}"
            show_help
            exit 1
            ;;
    esac
}

# Banner inicial
echo -e "${BLUE}"
echo "████████╗███████╗██╗     ███████╗███╗   ███╗███████╗██████╗ "
echo "╚══██╔══╝██╔════╝██║     ██╔════╝████╗ ████║██╔════╝██╔══██╗"
echo "   ██║   █████╗  ██║     █████╗  ██╔████╔██║█████╗  ██║  ██║"
echo "   ██║   ██╔══╝  ██║     ██╔══╝  ██║╚██╔╝██║██╔══╝  ██║  ██║"
echo "   ██║   ███████╗███████╗███████╗██║ ╚═╝ ██║███████╗██████╔╝"
echo "   ╚═╝   ╚══════╝╚══════╝╚══════╝╚═╝     ╚═╝╚══════╝╚═════╝ "
echo -e "${NC}"
echo -e "${YELLOW}🤖 Sistema de Automação CI/CD${NC}"
echo ""

# Executar função principal
main "$@"