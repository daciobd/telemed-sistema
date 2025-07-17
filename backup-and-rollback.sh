#!/bin/bash

# ========================================
# TeleMed Sistema - Backup and Rollback
# ========================================
# Sistema de backup e rollback para deploys
# Permite reverter para versões anteriores em caso de problemas

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
BACKUP_DIR="backups"
MAX_BACKUPS=10
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="telemed_backup_${TIMESTAMP}"

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}🔄 TeleMed Sistema - Backup and Rollback${NC}"
    echo -e "=========================================="
    echo ""
    echo -e "${YELLOW}Uso:${NC}"
    echo -e "  $0 backup              - Criar backup do estado atual"
    echo -e "  $0 rollback [version]  - Reverter para versão anterior"
    echo -e "  $0 list                - Listar backups disponíveis"
    echo -e "  $0 cleanup             - Limpar backups antigos"
    echo -e "  $0 restore [backup]    - Restaurar backup específico"
    echo ""
    echo -e "${YELLOW}Exemplos:${NC}"
    echo -e "  $0 backup"
    echo -e "  $0 rollback HEAD~1"
    echo -e "  $0 restore telemed_backup_20250717_120000"
    echo ""
}

# Criar diretório de backup
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        echo -e "${GREEN}✅ Diretório de backup criado: ${BACKUP_DIR}${NC}"
    fi
}

# Backup do código fonte
backup_source() {
    echo -e "${YELLOW}📦 Criando backup do código fonte...${NC}"
    
    create_backup_dir
    
    # Criar arquivo com informações do backup
    cat > "${BACKUP_DIR}/${BACKUP_NAME}_info.json" << EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'no-git')",
    "git_branch": "$(git branch --show-current 2>/dev/null || echo 'no-git')",
    "node_version": "$(node --version 2>/dev/null || echo 'unknown')",
    "npm_version": "$(npm --version 2>/dev/null || echo 'unknown')",
    "backup_type": "source",
    "description": "Backup automático antes do deploy"
}
EOF

    # Backup dos arquivos essenciais
    echo -e "${YELLOW}📁 Compactando arquivos...${NC}"
    
    tar -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" \
        --exclude="node_modules" \
        --exclude="dist" \
        --exclude="build" \
        --exclude=".next" \
        --exclude="backups" \
        --exclude="*.log" \
        --exclude=".git" \
        . 2>/dev/null || true
    
    echo -e "${GREEN}✅ Backup criado: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz${NC}"
    
    # Git backup se disponível
    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${YELLOW}🔄 Criando backup Git...${NC}"
        git bundle create "${BACKUP_DIR}/${BACKUP_NAME}.bundle" --all 2>/dev/null || true
        echo -e "${GREEN}✅ Git bundle criado${NC}"
    fi
    
    return 0
}

# Backup do banco de dados (se configurado)
backup_database() {
    if [ -n "$DATABASE_URL" ]; then
        echo -e "${YELLOW}🗄️ Fazendo backup do banco de dados...${NC}"
        
        # Tentar backup PostgreSQL
        if command -v pg_dump >/dev/null 2>&1; then
            pg_dump "$DATABASE_URL" > "${BACKUP_DIR}/${BACKUP_NAME}_database.sql" 2>/dev/null || {
                echo -e "${YELLOW}⚠️ Backup do banco falhou, continuando...${NC}"
                return 0
            }
            echo -e "${GREEN}✅ Backup do banco criado${NC}"
        else
            echo -e "${YELLOW}⚠️ pg_dump não encontrado, pulando backup do banco${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ DATABASE_URL não configurada, pulando backup do banco${NC}"
    fi
}

# Listar backups disponíveis
list_backups() {
    echo -e "${BLUE}📋 Backups Disponíveis${NC}"
    echo -e "======================"
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
        echo -e "${YELLOW}⚠️ Nenhum backup encontrado${NC}"
        return 0
    fi
    
    for info_file in "${BACKUP_DIR}"/*_info.json; do
        if [ -f "$info_file" ]; then
            backup_name=$(basename "$info_file" _info.json)
            timestamp=$(grep '"timestamp"' "$info_file" | cut -d'"' -f4 2>/dev/null || echo "unknown")
            git_commit=$(grep '"git_commit"' "$info_file" | cut -d'"' -f4 2>/dev/null || echo "unknown")
            
            echo -e "${GREEN}📦 ${backup_name}${NC}"
            echo -e "   📅 Data: $timestamp"
            echo -e "   🔄 Commit: ${git_commit:0:8}"
            
            # Verificar se arquivos existem
            if [ -f "${BACKUP_DIR}/${backup_name}.tar.gz" ]; then
                size=$(du -h "${BACKUP_DIR}/${backup_name}.tar.gz" | cut -f1)
                echo -e "   📁 Tamanho: $size"
            fi
            
            echo ""
        fi
    done
}

# Restaurar backup específico
restore_backup() {
    local backup_name=$1
    
    if [ -z "$backup_name" ]; then
        echo -e "${RED}❌ Nome do backup é obrigatório${NC}"
        echo -e "${YELLOW}Use: $0 list para ver backups disponíveis${NC}"
        return 1
    fi
    
    local backup_file="${BACKUP_DIR}/${backup_name}.tar.gz"
    local info_file="${BACKUP_DIR}/${backup_name}_info.json"
    
    if [ ! -f "$backup_file" ]; then
        echo -e "${RED}❌ Backup não encontrado: $backup_file${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}🔄 Restaurando backup: $backup_name${NC}"
    
    # Mostrar informações do backup
    if [ -f "$info_file" ]; then
        echo -e "${BLUE}📋 Informações do Backup:${NC}"
        cat "$info_file" | grep -E '"timestamp"|"git_commit"|"description"' | sed 's/^/   /'
        echo ""
    fi
    
    # Confirmar restauração
    echo -e "${YELLOW}⚠️ Esta operação irá sobrescrever os arquivos atuais.${NC}"
    echo -e "${YELLOW}Tem certeza? (y/N):${NC} "
    read -r confirm
    
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo -e "${YELLOW}❌ Operação cancelada${NC}"
        return 0
    fi
    
    # Criar backup do estado atual antes de restaurar
    echo -e "${YELLOW}📦 Criando backup de segurança do estado atual...${NC}"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    SAFETY_BACKUP="safety_backup_${TIMESTAMP}"
    backup_source_silent "$SAFETY_BACKUP"
    
    # Restaurar arquivos
    echo -e "${YELLOW}📁 Extraindo backup...${NC}"
    tar -xzf "$backup_file" --exclude="backups" 2>/dev/null || {
        echo -e "${RED}❌ Falha ao extrair backup${NC}"
        return 1
    }
    
    # Reinstalar dependências
    echo -e "${YELLOW}📦 Reinstalando dependências...${NC}"
    npm ci --prefer-offline --no-audit >/dev/null 2>&1 || {
        echo -e "${YELLOW}⚠️ Falha ao instalar dependências${NC}"
    }
    
    echo -e "${GREEN}✅ Backup restaurado com sucesso!${NC}"
    echo -e "${BLUE}💡 Backup de segurança criado: ${SAFETY_BACKUP}${NC}"
    
    return 0
}

# Backup silencioso (para uso interno)
backup_source_silent() {
    local custom_name=${1:-$BACKUP_NAME}
    create_backup_dir
    
    cat > "${BACKUP_DIR}/${custom_name}_info.json" << EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'no-git')",
    "git_branch": "$(git branch --show-current 2>/dev/null || echo 'no-git')",
    "backup_type": "safety",
    "description": "Backup de segurança automático"
}
EOF

    tar -czf "${BACKUP_DIR}/${custom_name}.tar.gz" \
        --exclude="node_modules" \
        --exclude="dist" \
        --exclude="build" \
        --exclude=".next" \
        --exclude="backups" \
        --exclude="*.log" \
        --exclude=".git" \
        . 2>/dev/null || true
}

# Rollback Git
git_rollback() {
    local target=${1:-HEAD~1}
    
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ Não é um repositório Git${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}🔄 Fazendo rollback Git para: $target${NC}"
    
    # Verificar se o commit existe
    if ! git rev-parse --verify "$target" >/dev/null 2>&1; then
        echo -e "${RED}❌ Commit não encontrado: $target${NC}"
        return 1
    fi
    
    # Criar backup antes do rollback
    echo -e "${YELLOW}📦 Criando backup antes do rollback...${NC}"
    backup_source_silent "pre_rollback_${TIMESTAMP}"
    
    # Fazer rollback
    echo -e "${YELLOW}🔄 Executando rollback...${NC}"
    git reset --hard "$target" || {
        echo -e "${RED}❌ Falha no rollback Git${NC}"
        return 1
    }
    
    # Reinstalar dependências
    echo -e "${YELLOW}📦 Reinstalando dependências...${NC}"
    npm ci --prefer-offline --no-audit >/dev/null 2>&1 || {
        echo -e "${YELLOW}⚠️ Falha ao instalar dependências${NC}"
    }
    
    echo -e "${GREEN}✅ Rollback Git concluído!${NC}"
    return 0
}

# Limpar backups antigos
cleanup_backups() {
    echo -e "${YELLOW}🧹 Limpando backups antigos...${NC}"
    
    if [ ! -d "$BACKUP_DIR" ]; then
        echo -e "${YELLOW}⚠️ Diretório de backup não existe${NC}"
        return 0
    fi
    
    # Contar backups
    backup_count=$(ls -1 "${BACKUP_DIR}"/*_info.json 2>/dev/null | wc -l)
    
    if [ "$backup_count" -le "$MAX_BACKUPS" ]; then
        echo -e "${GREEN}✅ Nenhuma limpeza necessária (${backup_count}/${MAX_BACKUPS})${NC}"
        return 0
    fi
    
    echo -e "${YELLOW}📊 Encontrados ${backup_count} backups (máximo: ${MAX_BACKUPS})${NC}"
    
    # Remover backups mais antigos
    ls -1t "${BACKUP_DIR}"/*_info.json 2>/dev/null | tail -n +$((MAX_BACKUPS + 1)) | while read -r info_file; do
        backup_name=$(basename "$info_file" _info.json)
        echo -e "${YELLOW}🗑️ Removendo: $backup_name${NC}"
        
        rm -f "${BACKUP_DIR}/${backup_name}.tar.gz" 2>/dev/null || true
        rm -f "${BACKUP_DIR}/${backup_name}.bundle" 2>/dev/null || true
        rm -f "${BACKUP_DIR}/${backup_name}_database.sql" 2>/dev/null || true
        rm -f "$info_file" 2>/dev/null || true
    done
    
    echo -e "${GREEN}✅ Limpeza concluída${NC}"
}

# Função principal
main() {
    case "$1" in
        "backup")
            echo -e "${BLUE}📦 Iniciando backup completo...${NC}"
            backup_source
            backup_database
            cleanup_backups
            echo -e "${GREEN}🎉 Backup concluído: ${BACKUP_NAME}${NC}"
            ;;
        "rollback")
            git_rollback "$2"
            ;;
        "list")
            list_backups
            ;;
        "cleanup")
            cleanup_backups
            ;;
        "restore")
            restore_backup "$2"
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

# Executar função principal
main "$@"