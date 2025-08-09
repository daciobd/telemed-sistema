#!/bin/bash

# Script para limpar documentos de links antigos/obsoletos
# Data: 2025-08-09
# EXECUTE APENAS APÓS CONFIRMAR O NOVO DOCUMENTO

echo "🗑️ LIMPEZA DE DOCUMENTOS DE LINKS OBSOLETOS"
echo "============================================="
echo ""
echo "⚠️  ATENÇÃO: Este script remove documentos antigos de links"
echo "📋 Documento atual: LINKS_SISTEMA_TELEMED_2025_ATUAL.md"
echo ""
echo "Arquivos que serão removidos:"
echo ""

# Lista arquivos que serão removidos
files_to_remove=(
    "LINKS_ATUALIZADOS_TELEMED.md"
    "LINKS_COPY_PASTE_PRONTOS.md"
    "LINKS_CORRETOS_FINAIS.md"
    "LINKS_CORRETOS_REPLIT.md"
    "LINKS_CORRIGIDOS_SUPORTE.md"
    "LINKS_FINAIS_COPY_PASTE.txt"
    "LINKS_HOSTINGER_ATUALIZADOS.md"
    "LINKS_HOSTINGER_CORRETOS.md"
    "LINKS_HOSTINGER_MAPEAMENTO_BOTOES.md"
    "LINKS_HOSTINGER_TELEMED.md"
    "LINKS_NAVEGACAO_CORRIGIDOS.md"
    "LINKS_TESTE_EXTERNO.md"
    "LINKS_VERIFICACAO_TELEMED.md"
    "BOTOES_LINKS_DIRETOS.txt"
    "TESTE_LINKS_COMPLETO.md"
)

for file in "${files_to_remove[@]}"; do
    if [ -f "$file" ]; then
        echo "❌ $file"
    fi
done

echo ""
echo "📋 Documento que permanece:"
echo "✅ LINKS_SISTEMA_TELEMED_2025_ATUAL.md (OFICIAL)"
echo ""
echo "Para executar a limpeza, descomente as linhas abaixo:"
echo ""

# DESCOMENTAR PARA EXECUTAR A REMOÇÃO:
# for file in "${files_to_remove[@]}"; do
#     if [ -f "$file" ]; then
#         rm "$file"
#         echo "🗑️ Removido: $file"
#     fi
# done
# echo ""
# echo "✅ Limpeza concluída!"
# echo "📋 Use apenas: LINKS_SISTEMA_TELEMED_2025_ATUAL.md"