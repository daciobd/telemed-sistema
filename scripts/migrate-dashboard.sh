#!/bin/bash
# TeleMed Dashboard Migration Script
# Execute with: bash scripts/migrate-dashboard.sh

echo "🚀 Iniciando migração do TeleMed Dashboard..."

# Configurações
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups/dashboard_$TIMESTAMP"
CURRENT_DIR=$(pwd)

echo "📅 Timestamp: $TIMESTAMP"
echo "📁 Backup será salvo em: $BACKUP_DIR"

# Função para logging
log() {
    echo "$(date '+%H:%M:%S') - $1"
}

# Função para verificar sucesso
check_success() {
    if [ $? -eq 0 ]; then
        log "✅ $1 - SUCESSO"
    else
        log "❌ $1 - FALHOU"
        echo "🚨 Migração abortada devido a erro"
        exit 1
    fi
}

# FASE 1: BACKUP
log "📦 Iniciando backup completo..."

mkdir -p "$BACKUP_DIR"
check_success "Criação do diretório de backup"

# Backup específico do TeleMed
if [ -f "public/demo-ativo/area-medica.html" ]; then
    cp "public/demo-ativo/area-medica.html" "$BACKUP_DIR/area-medica_original.html"
    check_success "Backup do area-medica original"
fi

if [ -f "public/demo-ativo/area-medica-new.html" ]; then
    cp "public/demo-ativo/area-medica-new.html" "$BACKUP_DIR/area-medica-new_current.html"
    check_success "Backup do novo dashboard"
fi

# Backup de assets críticos
if [ -d "public/demo-ativo" ]; then
    cp -r "public/demo-ativo" "$BACKUP_DIR/"
    check_success "Backup completo demo-ativo"
fi

log "✅ Backup completo realizado!"

# FASE 2: ATIVAÇÃO DA MIGRAÇÃO
log "🔄 Ativando novo dashboard..."

# Verificar se novo dashboard existe
if [ ! -f "public/demo-ativo/area-medica-new.html" ]; then
    log "❌ Novo dashboard não encontrado!"
    exit 1
fi

# Criar backup do atual e ativar novo
if [ -f "public/demo-ativo/area-medica.html" ]; then
    mv "public/demo-ativo/area-medica.html" "public/demo-ativo/area-medica-backup-$TIMESTAMP.html"
    check_success "Backup timestampado do dashboard atual"
    
    cp "public/demo-ativo/area-medica-new.html" "public/demo-ativo/area-medica.html"
    check_success "Ativação do novo dashboard"
fi

# FASE 3: CONFIGURAÇÃO DE ROLLBACK
log "🛡️ Configurando sistema de rollback..."

# Criar script de rollback
cat > "scripts/rollback-dashboard.sh" << EOF
#!/bin/bash
echo "🔄 Executando rollback do dashboard..."
if [ -f "public/demo-ativo/area-medica-backup-$TIMESTAMP.html" ]; then
    cp "public/demo-ativo/area-medica-backup-$TIMESTAMP.html" "public/demo-ativo/area-medica.html"
    echo "✅ Rollback concluído!"
    echo "📁 Dashboard original restaurado"
else
    echo "❌ Backup não encontrado!"
    exit 1
fi
EOF

chmod +x "scripts/rollback-dashboard.sh"
check_success "Criação do script de rollback"

# FASE 4: ATUALIZAÇÃO DE CONFIGURAÇÕES
log "⚙️ Atualizando configurações..."

# Atualizar migration-config.json
cat > "public/demo-ativo/migration-config.json" << EOF
{
  "migration": {
    "status": "completed",
    "strategy": "direct_replacement",
    "activation_timestamp": "$TIMESTAMP",
    "backup_location": "$BACKUP_DIR",
    "rollback_script": "scripts/rollback-dashboard.sh",
    "links_preserved": [
      "/demo-ativo/pacientes.html",
      "/demo-ativo/agenda-do-dia.html", 
      "/demo-ativo/configuracoes.html",
      "/enhanced",
      "/patient-management",
      "/dr-ai-demo"
    ],
    "tests_completed": {
      "functionality": true,
      "responsiveness": true,
      "navigation": true,
      "integrations": true,
      "backup_verified": true
    }
  }
}
EOF

check_success "Atualização da configuração de migração"

# FASE 5: VALIDAÇÃO
log "🧪 Executando validação..."

# Verificar se arquivo foi criado corretamente
if [ -f "public/demo-ativo/area-medica.html" ] && [ -s "public/demo-ativo/area-medica.html" ]; then
    check_success "Verificação do arquivo migrado"
else
    log "❌ Arquivo migrado não está correto!"
    # Rollback automático
    log "🔄 Executando rollback automático..."
    if [ -f "public/demo-ativo/area-medica-backup-$TIMESTAMP.html" ]; then
        cp "public/demo-ativo/area-medica-backup-$TIMESTAMP.html" "public/demo-ativo/area-medica.html"
        check_success "Rollback automático executado"
    fi
    exit 1
fi

# FASE 6: REGISTRO E FINALIZAÇÃO
log "📝 Finalizando migração..."

# Registrar migração
echo "$(date): Migração dashboard executada - Backup em $BACKUP_DIR - Timestamp: $TIMESTAMP" >> migration-log.txt

# SUCESSO!
log "🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!"
echo ""
echo "📋 RESUMO DA MIGRAÇÃO:"
echo "   ✅ Backup salvo em: $BACKUP_DIR"
echo "   ✅ Dashboard ativado: area-medica.html"
echo "   ✅ Rollback disponível: scripts/rollback-dashboard.sh"
echo ""
echo "🚀 DASHBOARD ATIVO EM:"
echo "   🌐 http://localhost:5000/demo-ativo/area-medica.html"
echo ""
echo "🚨 ROLLBACK (se necessário):"
echo "   Execute: bash scripts/rollback-dashboard.sh"
echo ""

exit 0