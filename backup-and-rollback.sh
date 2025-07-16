#!/bin/bash

# 💾 TeleMed Pro - Backup and Rollback System
# Este script gerencia backups e rollbacks do deployment

set -e

BACKUP_DIR="backups"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# Função para mostrar uso
show_usage() {
    echo "💾 TeleMed Pro - Backup and Rollback System"
    echo ""
    echo "Uso:"
    echo "  $0 backup                    # Criar backup atual"
    echo "  $0 list                      # Listar backups disponíveis"
    echo "  $0 restore <backup_name>     # Restaurar backup específico"
    echo "  $0 rollback                  # Rollback para último backup"
    echo "  $0 clean                     # Limpar backups antigos"
    echo ""
    echo "Exemplos:"
    echo "  $0 backup"
    echo "  $0 restore backup_20250716_200530"
    echo "  $0 rollback"
}

# Função para criar backup
create_backup() {
    echo "💾 Criando backup..."
    
    # Criar diretório de backups
    mkdir -p "$BACKUP_DIR"
    
    # Nome do backup
    backup_name="backup_${TIMESTAMP}"
    backup_path="$BACKUP_DIR/$backup_name"
    
    # Criar diretório do backup
    mkdir -p "$backup_path"
    
    # Backup dos arquivos principais
    echo "📁 Fazendo backup dos arquivos principais..."
    
    # Arquivos de configuração
    cp render.yaml "$backup_path/" 2>/dev/null || true
    cp .env.example "$backup_path/" 2>/dev/null || true
    cp .gitignore "$backup_path/" 2>/dev/null || true
    
    # Scripts
    cp *.sh "$backup_path/" 2>/dev/null || true
    
    # Diretório telemed-v2 completo
    if [ -d "telemed-v2" ]; then
        echo "📦 Fazendo backup do diretório telemed-v2..."
        cp -r telemed-v2 "$backup_path/"
    fi
    
    # Informações do git
    if [ -d ".git" ]; then
        echo "🔍 Salvando informações do git..."
        git log --oneline -10 > "$backup_path/git_history.txt" 2>/dev/null || true
        git status > "$backup_path/git_status.txt" 2>/dev/null || true
        git branch > "$backup_path/git_branches.txt" 2>/dev/null || true
    fi
    
    # Criar manifesto do backup
    echo "📋 Criando manifesto do backup..."
    cat > "$backup_path/backup_manifest.txt" << EOF
TeleMed Pro - Backup Manifest
============================

Backup criado: $(date)
Timestamp: $TIMESTAMP
Commit atual: $(git rev-parse HEAD 2>/dev/null || echo "N/A")
Branch atual: $(git branch --show-current 2>/dev/null || echo "N/A")

Arquivos incluídos:
$(find "$backup_path" -type f | sort)

Tamanho total: $(du -sh "$backup_path" | cut -f1)
EOF
    
    echo "✅ Backup criado: $backup_name"
    echo "📁 Localização: $backup_path"
    echo "📊 Tamanho: $(du -sh "$backup_path" | cut -f1)"
}

# Função para listar backups
list_backups() {
    echo "📋 Backups disponíveis:"
    echo ""
    
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]; then
        echo "   Nenhum backup encontrado."
        return
    fi
    
    for backup in "$BACKUP_DIR"/*; do
        if [ -d "$backup" ]; then
            backup_name=$(basename "$backup")
            backup_date=$(echo "$backup_name" | sed 's/backup_//' | sed 's/_/ /')
            backup_size=$(du -sh "$backup" | cut -f1)
            
            echo "   📦 $backup_name"
            echo "      Data: $backup_date"
            echo "      Tamanho: $backup_size"
            
            # Mostrar informações do manifesto se existir
            if [ -f "$backup/backup_manifest.txt" ]; then
                commit=$(grep "Commit atual:" "$backup/backup_manifest.txt" | cut -d: -f2 | xargs)
                if [ "$commit" != "N/A" ]; then
                    echo "      Commit: $commit"
                fi
            fi
            echo ""
        fi
    done
}

# Função para restaurar backup
restore_backup() {
    local backup_name="$1"
    
    if [ -z "$backup_name" ]; then
        echo "❌ Erro: Especifique o nome do backup"
        echo "Use: $0 list para ver backups disponíveis"
        exit 1
    fi
    
    local backup_path="$BACKUP_DIR/$backup_name"
    
    if [ ! -d "$backup_path" ]; then
        echo "❌ Erro: Backup não encontrado: $backup_name"
        echo "Use: $0 list para ver backups disponíveis"
        exit 1
    fi
    
    echo "🔄 Restaurando backup: $backup_name"
    
    # Confirmar ação
    read -p "⚠️  Isso irá substituir os arquivos atuais. Continuar? (y/N): " confirm
    if [ "$confirm" != "y" ]; then
        echo "❌ Restauração cancelada"
        exit 1
    fi
    
    # Criar backup do estado atual antes de restaurar
    echo "💾 Criando backup do estado atual..."
    current_backup="current_before_restore_${TIMESTAMP}"
    mkdir -p "$BACKUP_DIR/$current_backup"
    
    # Backup rápido dos arquivos principais
    cp render.yaml "$BACKUP_DIR/$current_backup/" 2>/dev/null || true
    cp .env.example "$BACKUP_DIR/$current_backup/" 2>/dev/null || true
    cp -r telemed-v2 "$BACKUP_DIR/$current_backup/" 2>/dev/null || true
    
    # Restaurar arquivos
    echo "📁 Restaurando arquivos..."
    
    # Restaurar arquivos de configuração
    cp "$backup_path/render.yaml" . 2>/dev/null || true
    cp "$backup_path/.env.example" . 2>/dev/null || true
    cp "$backup_path/.gitignore" . 2>/dev/null || true
    
    # Restaurar scripts
    cp "$backup_path"/*.sh . 2>/dev/null || true
    chmod +x *.sh 2>/dev/null || true
    
    # Restaurar diretório telemed-v2
    if [ -d "$backup_path/telemed-v2" ]; then
        echo "📦 Restaurando diretório telemed-v2..."
        rm -rf telemed-v2 2>/dev/null || true
        cp -r "$backup_path/telemed-v2" .
    fi
    
    echo "✅ Backup restaurado com sucesso!"
    echo "📝 Backup do estado anterior salvo em: $current_backup"
    echo ""
    echo "🔄 Próximos passos:"
    echo "1. Verificar se os arquivos foram restaurados corretamente"
    echo "2. Fazer commit das alterações:"
    echo "   git add ."
    echo "   git commit -m 'restore: backup $backup_name'"
    echo "3. Fazer push para trigger novo deploy:"
    echo "   git push origin main"
}

# Função para rollback para último backup
rollback() {
    echo "🔄 Executando rollback para último backup..."
    
    # Encontrar último backup
    if [ ! -d "$BACKUP_DIR" ]; then
        echo "❌ Erro: Nenhum backup encontrado"
        exit 1
    fi
    
    last_backup=$(ls -t "$BACKUP_DIR" | head -n 1)
    
    if [ -z "$last_backup" ]; then
        echo "❌ Erro: Nenhum backup encontrado"
        exit 1
    fi
    
    echo "📦 Último backup encontrado: $last_backup"
    restore_backup "$last_backup"
}

# Função para limpar backups antigos
clean_backups() {
    echo "🧹 Limpando backups antigos..."
    
    if [ ! -d "$BACKUP_DIR" ]; then
        echo "✅ Nenhum backup para limpar"
        return
    fi
    
    # Manter apenas os 5 backups mais recentes
    backup_count=$(ls -1 "$BACKUP_DIR" | wc -l)
    
    if [ "$backup_count" -le 5 ]; then
        echo "✅ Apenas $backup_count backups encontrados (mantendo todos)"
        return
    fi
    
    echo "📊 Encontrados $backup_count backups (mantendo os 5 mais recentes)"
    
    # Listar backups por data (mais antigos primeiro)
    old_backups=$(ls -t "$BACKUP_DIR" | tail -n +6)
    
    for backup in $old_backups; do
        echo "🗑️  Removendo backup antigo: $backup"
        rm -rf "$BACKUP_DIR/$backup"
    done
    
    echo "✅ Limpeza concluída"
}

# Função principal
main() {
    case "$1" in
        "backup")
            create_backup
            ;;
        "list")
            list_backups
            ;;
        "restore")
            restore_backup "$2"
            ;;
        "rollback")
            rollback
            ;;
        "clean")
            clean_backups
            ;;
        *)
            show_usage
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@"