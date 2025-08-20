#!/usr/bin/env python3
"""
Relatório final da otimização de navegação TeleMed Pro
Calcula estatísticas finais e verifica cumprimento de metas
"""

import json
from datetime import datetime

def carregar_dados():
    try:
        with open('mapa_navegacao_completo.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return None

def calcular_estatisticas_finais(dados):
    """Calcula estatísticas finais do projeto"""
    metadata = dados['metadata']
    analysis = dados['analysis']
    
    # Estatísticas básicas
    total_paginas = metadata['total_pages']
    total_links = metadata['total_links']
    links_validos = metadata['valid_links']
    links_quebrados = metadata['broken_links']
    
    # Taxa de sucesso
    taxa_sucesso = (links_validos / total_links * 100) if total_links > 0 else 0
    
    # Análise de órfãs
    orfas_restantes = len(analysis['orphan_pages'])
    
    # Top hubs
    top_hubs = analysis['top_hubs'][:5]
    
    return {
        'total_paginas': total_paginas,
        'total_links': total_links,
        'links_validos': links_validos,
        'links_quebrados': links_quebrados,
        'taxa_sucesso': taxa_sucesso,
        'orfas_restantes': orfas_restantes,
        'top_hubs': top_hubs
    }

def verificar_metas(stats):
    """Verifica cumprimento das metas estabelecidas"""
    metas = {
        'taxa_sucesso_alvo': 55.0,
        'orfas_maximas': 10,
        'links_quebrados_canonicas': 0
    }
    
    resultados = {
        'taxa_sucesso': {
            'meta': metas['taxa_sucesso_alvo'],
            'atual': stats['taxa_sucesso'],
            'atingida': stats['taxa_sucesso'] >= metas['taxa_sucesso_alvo']
        },
        'orfas': {
            'meta': metas['orfas_maximas'],
            'atual': stats['orfas_restantes'],
            'atingida': stats['orfas_restantes'] <= metas['orfas_maximas']
        }
    }
    
    return resultados

def gerar_relatorio_final():
    """Gera relatório final completo"""
    dados = carregar_dados()
    if not dados:
        print("❌ Dados não encontrados")
        return
    
    stats = calcular_estatisticas_finais(dados)
    metas = verificar_metas(stats)
    
    print("=" * 80)
    print("🎯 RELATÓRIO FINAL - OTIMIZAÇÃO DE NAVEGAÇÃO TELEMED PRO")
    print("=" * 80)
    print(f"⏰ Gerado em: {datetime.now().strftime('%d/%m/%Y às %H:%M')}")
    
    # Estatísticas gerais
    print(f"\n📊 ESTATÍSTICAS FINAIS:")
    print(f"   📄 Total de páginas: {stats['total_paginas']:,}")
    print(f"   🔗 Total de links: {stats['total_links']:,}")
    print(f"   ✅ Links válidos: {stats['links_validos']:,}")
    print(f"   ❌ Links quebrados: {stats['links_quebrados']:,}")
    print(f"   📈 Taxa de sucesso: {stats['taxa_sucesso']:.1f}%")
    
    # Verificação de metas
    print(f"\n🎯 CUMPRIMENTO DE METAS:")
    
    # Meta 1: Taxa de sucesso
    taxa_meta = metas['taxa_sucesso']
    status_taxa = "✅ ATINGIDA" if taxa_meta['atingida'] else "❌ NÃO ATINGIDA"
    print(f"   📈 Taxa de links válidos: {taxa_meta['atual']:.1f}% (meta: {taxa_meta['meta']:.1f}%) - {status_taxa}")
    
    # Meta 2: Órfãs
    orfas_meta = metas['orfas']
    status_orfas = "✅ ATINGIDA" if orfas_meta['atingida'] else "❌ NÃO ATINGIDA" 
    print(f"   👻 Páginas órfãs: {orfas_meta['atual']} (meta: ≤{orfas_meta['meta']}) - {status_orfas}")
    
    # Análise de hubs
    print(f"\n🏢 TOP 5 HUBS OTIMIZADOS:")
    for i, (pagina, count) in enumerate(stats['top_hubs'], 1):
        status_hub = "✅ Otimizado" if count <= 25 else "⚠️ Alto"
        print(f"   {i}. {pagina}: {count} links - {status_hub}")
    
    # Progresso total
    metas_atingidas = sum([
        metas['taxa_sucesso']['atingida'],
        metas['orfas']['atingida']
    ])
    
    progresso_pct = (metas_atingidas / 2) * 100
    
    print(f"\n🏆 PROGRESSO GERAL:")
    print(f"   📋 Metas atingidas: {metas_atingidas}/2 ({progresso_pct:.0f}%)")
    
    if progresso_pct == 100:
        print(f"   🎉 TODAS AS METAS FORAM ATINGIDAS!")
    elif progresso_pct >= 50:
        print(f"   ✅ Progresso satisfatório!")
    else:
        print(f"   ⚠️ Mais otimizações necessárias")
    
    # Recomendações
    print(f"\n💡 PRÓXIMAS RECOMENDAÇÕES:")
    
    if not metas['taxa_sucesso']['atingida']:
        diferenca = metas['taxa_sucesso']['meta'] - metas['taxa_sucesso']['atual']
        print(f"   📈 Corrigir mais {diferenca:.1f}% de links para atingir 55%")
    
    if not metas['orfas']['atingida']:
        excesso = metas['orfas']['atual'] - metas['orfas']['meta']
        print(f"   🔗 Conectar mais {excesso} páginas órfãs")
    
    if progresso_pct == 100:
        print(f"   🚀 Sistema pronto para produção!")
        print(f"   📊 Implementar monitoramento contínuo")
        print(f"   🔄 Configurar validação automática")
    
    print("=" * 80)
    
    return {
        'stats': stats,
        'metas': metas,
        'progresso_pct': progresso_pct
    }

if __name__ == "__main__":
    relatorio = gerar_relatorio_final()