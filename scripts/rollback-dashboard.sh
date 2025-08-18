#!/bin/bash
# TeleMed Dashboard Rollback Script
# Execute com: bash scripts/rollback-dashboard.sh

echo "🔄 Iniciando rollback do dashboard..."

# Encontrar o backup mais recente
LATEST_BACKUP=$(ls -t public/demo-ativo/area-medica-backup-*.html 2>/dev/null | head -n1)

if [ -n "$LATEST_BACKUP" ] && [ -f "$LATEST_BACKUP" ]; then
    echo "📁 Backup encontrado: $LATEST_BACKUP"
    
    # Fazer backup do estado atual antes do rollback
    ROLLBACK_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    cp "public/demo-ativo/area-medica.html" "public/demo-ativo/area-medica-pre-rollback-$ROLLBACK_TIMESTAMP.html"
    
    # Executar rollback
    cp "$LATEST_BACKUP" "public/demo-ativo/area-medica.html"
    
    if [ $? -eq 0 ]; then
        echo "✅ Rollback concluído com sucesso!"
        echo "📁 Dashboard original restaurado"
        echo "💾 Estado atual salvo como: area-medica-pre-rollback-$ROLLBACK_TIMESTAMP.html"
        
        # Atualizar configuração
        echo "$(date): Rollback executado - Restaurado de $LATEST_BACKUP" >> migration-log.txt
        
        echo ""
        echo "🌐 Dashboard disponível em: http://localhost:5000/demo-ativo/area-medica.html"
    else
        echo "❌ Erro durante rollback!"
        exit 1
    fi
else
    echo "❌ Nenhum backup encontrado!"
    echo "🔍 Procurando backups alternativos..."
    
    # Procurar em outros locais
    if [ -f "public/demo-ativo/area-medica-backup.html" ]; then
        echo "📁 Backup genérico encontrado"
        cp "public/demo-ativo/area-medica-backup.html" "public/demo-ativo/area-medica.html"
        echo "✅ Rollback para backup genérico concluído!"
    else
        echo "❌ Nenhum backup disponível para rollback!"
        echo "🚨 Contate o suporte técnico"
        exit 1
    fi
fi

exit 0