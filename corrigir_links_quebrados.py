#!/usr/bin/env python3
"""
Script para correção automática de links quebrados nas páginas canônicas
Identifica, valida e corrige links quebrados em páginas críticas do TeleMed
"""

import os
import json
from bs4 import BeautifulSoup
import shutil
from datetime import datetime

# Definir páginas canônicas
CANONICAL_PAGES = {
    'landing-teste.html': '/lp',
    'agenda-medica.html': '/agenda', 
    'enhanced-teste.html': '/consulta',
    'dashboard-teste.html': '/dashboard',
    'meus-pacientes.html': '/pacientes',
    'registro-saude.html': '/registros'
}

# Mapeamento de correções comuns
LINK_CORRECTIONS = {
    '/leilao-consultas.html': '/consulta',
    '/receitas-digitais.html': '/dashboard',
    '/login.html': '/lp',
    '/index.html': '/dashboard',
    '/centro-avaliacao.html': '/dashboard',
    '/videoconsulta.html': '/consulta',
    '/patient-bidding': '/consulta',
    '/agenda-do-dia.html': '/agenda',
    '/consulta-por-valor.html': '/consulta',
    '/dr-ai.html': '/dashboard'
}

def fazer_backup(arquivo):
    """Cria backup do arquivo antes das modificações"""
    backup_dir = 'backup_links_corrigidos'
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    backup_path = os.path.join(backup_dir, os.path.basename(arquivo))
    shutil.copy2(arquivo, backup_path)
    return backup_path

def encontrar_arquivo_html(nome_arquivo, diretorio_base='.'):
    """Encontra a localização real de um arquivo HTML"""
    for root, dirs, files in os.walk(diretorio_base):
        if nome_arquivo in files:
            return os.path.join(root, nome_arquivo)
    return None

def validar_e_corrigir_link(link_original, arquivo_base):
    """Valida um link e sugere correção se quebrado"""
    if not link_original or link_original.startswith(('#', 'javascript:', 'mailto:', 'tel:')):
        return link_original, True
    
    # Links externos
    if link_original.startswith('http'):
        return link_original, True
    
    # Links absolutos internos - verificar se existem rotas correspondentes
    if link_original.startswith('/'):
        # Verificar mapeamento de correções
        if link_original in LINK_CORRECTIONS:
            return LINK_CORRECTIONS[link_original], False
        
        # Verificar se é rota canônica válida
        rotas_validas = ['/lp', '/agenda', '/consulta', '/dashboard', '/pacientes', '/registros', '/preview']
        if any(link_original.startswith(rota) for rota in rotas_validas):
            return link_original, True
        
        # Tentar encontrar arquivo correspondente
        arquivo_alvo = link_original.lstrip('/').replace('/', os.sep)
        if os.path.exists(arquivo_alvo):
            return link_original, True
    
    # Links relativos
    if link_original.endswith('.html'):
        dir_base = os.path.dirname(arquivo_base)
        caminho_completo = os.path.normpath(os.path.join(dir_base, link_original))
        
        if os.path.exists(caminho_completo):
            return link_original, True
        
        # Tentar encontrar o arquivo em outras localizações
        nome_arquivo = os.path.basename(link_original)
        arquivo_encontrado = encontrar_arquivo_html(nome_arquivo)
        if arquivo_encontrado:
            # Calcular caminho relativo correto
            caminho_relativo = os.path.relpath(arquivo_encontrado, dir_base)
            return caminho_relativo, False
    
    # Se não conseguiu corrigir, verificar mapeamentos
    if link_original in LINK_CORRECTIONS:
        return LINK_CORRECTIONS[link_original], False
    
    return link_original, False

def analisar_e_corrigir_pagina(arquivo_path):
    """Analisa uma página e corrige links quebrados"""
    if not os.path.exists(arquivo_path):
        print(f"❌ Arquivo não encontrado: {arquivo_path}")
        return None
    
    # Criar backup
    backup_path = fazer_backup(arquivo_path)
    print(f"📋 Backup criado: {backup_path}")
    
    try:
        with open(arquivo_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except Exception as e:
        print(f"❌ Erro ao ler {arquivo_path}: {e}")
        return None
    
    soup = BeautifulSoup(html_content, 'html.parser')
    links_analisados = []
    links_corrigidos = 0
    
    # Analisar todos os links
    for a_tag in soup.find_all('a'):
        href = a_tag.get('href')
        if href:
            novo_href, eh_valido = validar_e_corrigir_link(href, arquivo_path)
            
            status = "✅ Válido" if eh_valido else "🔧 Corrigido"
            if not eh_valido:
                a_tag['href'] = novo_href
                links_corrigidos += 1
                status = f"🔧 {href} → {novo_href}"
            
            links_analisados.append({
                'original': href,
                'corrigido': novo_href,
                'valido': eh_valido,
                'texto': a_tag.get_text(strip=True)[:30],
                'status': status
            })
    
    # Salvar arquivo corrigido se houve mudanças
    if links_corrigidos > 0:
        try:
            with open(arquivo_path, 'w', encoding='utf-8') as f:
                f.write(str(soup))
            print(f"✅ {links_corrigidos} links corrigidos em {os.path.basename(arquivo_path)}")
        except Exception as e:
            print(f"❌ Erro ao salvar {arquivo_path}: {e}")
            # Restaurar backup em caso de erro
            shutil.copy2(backup_path, arquivo_path)
            return None
    else:
        print(f"✅ Nenhuma correção necessária em {os.path.basename(arquivo_path)}")
    
    return {
        'arquivo': os.path.basename(arquivo_path),
        'path': arquivo_path,
        'links_analisados': len(links_analisados),
        'links_corrigidos': links_corrigidos,
        'detalhes': links_analisados
    }

def main():
    print("=" * 80)
    print("🔧 CORREÇÃO DE LINKS QUEBRADOS - PÁGINAS CANÔNICAS TELEMED")
    print("=" * 80)
    
    resultados = {}
    total_links_corrigidos = 0
    
    # Processar cada página canônica
    for arquivo, rota in CANONICAL_PAGES.items():
        print(f"\n📄 Processando: {arquivo} ({rota})")
        print("-" * 50)
        
        # Encontrar localização do arquivo
        arquivo_path = encontrar_arquivo_html(arquivo)
        if not arquivo_path:
            print(f"❌ Arquivo não encontrado: {arquivo}")
            continue
        
        resultado = analisar_e_corrigir_pagina(arquivo_path)
        if resultado:
            resultados[arquivo] = resultado
            total_links_corrigidos += resultado['links_corrigidos']
            
            # Mostrar detalhes das correções
            for link in resultado['detalhes']:
                if not link['valido']:
                    print(f"   {link['status']}")
    
    # Relatório final
    print("\n" + "=" * 80)
    print("📊 RELATÓRIO FINAL DE CORREÇÕES")
    print("=" * 80)
    
    print(f"✅ Páginas processadas: {len(resultados)}")
    print(f"🔧 Total de links corrigidos: {total_links_corrigidos}")
    
    # Salvar relatório JSON
    relatorio = {
        'timestamp': datetime.now().isoformat(),
        'total_paginas': len(resultados),
        'total_correcoes': total_links_corrigidos,
        'detalhes': resultados
    }
    
    with open('relatorio_correcao_links.json', 'w', encoding='utf-8') as f:
        json.dump(relatorio, f, ensure_ascii=False, indent=2)
    
    print(f"📄 Relatório salvo: relatorio_correcao_links.json")
    print(f"📋 Backups salvos em: backup_links_corrigidos/")
    
    if total_links_corrigidos > 0:
        print(f"\n🎯 {total_links_corrigidos} links foram corrigidos automaticamente!")
        print("✅ Execute novamente o script de análise para validar as correções")
    else:
        print("\n✅ Todas as páginas canônicas já possuem links válidos!")

if __name__ == "__main__":
    main()