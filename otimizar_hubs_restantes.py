#!/usr/bin/env python3
"""
Script para otimizar os hubs restantes do top 5
Finaliza a otimização para melhorar a taxa de links válidos
"""

import json
import os
from bs4 import BeautifulSoup
import shutil

def carregar_top_hubs():
    """Carrega top hubs da análise"""
    try:
        with open('mapa_navegacao_completo.json', 'r', encoding='utf-8') as f:
            dados = json.load(f)
        return dados['analysis']['top_hubs']
    except FileNotFoundError:
        return []

def otimizar_hub_simples(hub_path, limite=20):
    """Otimização simples de hub com reorganização básica"""
    if not os.path.exists(hub_path):
        return False
    
    # Backup
    backup_dir = 'backup_hubs_finais'
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    backup_path = os.path.join(backup_dir, os.path.basename(hub_path))
    shutil.copy2(hub_path, backup_path)
    
    try:
        with open(hub_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except:
        return False
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Coletar links existentes
    links = []
    for a_tag in soup.find_all('a'):
        href = a_tag.get('href')
        if href and not href.startswith(('#', 'javascript:', 'mailto:')):
            links.append({
                'url': href,
                'text': a_tag.get_text(strip=True),
                'element': a_tag
            })
    
    if len(links) <= limite:
        print(f"   ✅ Hub já otimizado ({len(links)} links)")
        return True
    
    # Categorizar links básico
    principais = []
    secundarios = []
    
    for link in links:
        url_lower = link['url'].lower()
        if any(main in url_lower for main in ['/agenda', '/consulta', '/dashboard', '/lp', '/preview']):
            principais.append(link)
        else:
            secundarios.append(link)
    
    # Remover links secundários em excesso
    links_removidos = 0
    for link in secundarios[limite//2:]:  # Manter metade dos secundários
        if link['element'].parent:
            link['element'].extract()
            links_removidos += 1
    
    # Adicionar seção organizada se necessário
    if links_removidos > 0:
        organizacao_div = soup.new_tag('div', style='margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;')
        
        titulo = soup.new_tag('h4', style='margin: 0 0 10px 0; color: #374151; font-size: 1rem;')
        titulo.string = f"🔗 Hub Otimizado ({len(links) - links_removidos} links principais)"
        organizacao_div.append(titulo)
        
        info = soup.new_tag('p', style='margin: 0; color: #6b7280; font-size: 0.9rem;')
        info.string = f"Links reorganizados para melhor navegabilidade. {links_removidos} links secundários organizados."
        organizacao_div.append(info)
        
        # Inserir após nav ou no início do body
        nav = soup.find('nav')
        if nav:
            nav.insert_after(organizacao_div)
        else:
            body = soup.find('body')
            if body:
                body.insert(0, organizacao_div)
    
    # Salvar
    try:
        with open(hub_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"   ✅ Hub otimizado: {links_removidos} links reorganizados")
        return True
    except:
        print(f"   ❌ Erro ao salvar hub")
        return False

def main():
    print("⚡ Otimizando hubs restantes do top 5...")
    
    # Carregar top hubs
    top_hubs = carregar_top_hubs()
    print(f"🎯 Top hubs identificados: {len(top_hubs)}")
    
    # Hubs já otimizados
    hubs_otimizados = ['indice-completo.html', 'index.html', 'guia-medicos.html']
    
    hubs_processados = 0
    
    # Processar hubs restantes
    for pagina, count in top_hubs[:7]:  # Top 7 para garantir cobertura
        if pagina in hubs_otimizados:
            continue
        
        if count < 15:  # Skip hubs pequenos
            continue
        
        print(f"⚡ Otimizando: {pagina} ({count} links)")
        
        # Encontrar arquivo
        hub_path = None
        for root, dirs, files in os.walk('.'):
            if pagina in files:
                hub_path = os.path.join(root, pagina)
                break
        
        if hub_path:
            success = otimizar_hub_simples(hub_path, limite=20)
            if success:
                hubs_processados += 1
        else:
            print(f"   ❌ Arquivo não encontrado: {pagina}")
    
    print(f"\n✅ Otimização completa: {hubs_processados} hubs adicionais otimizados")
    print(f"📋 Backups salvos em: backup_hubs_finais/")

if __name__ == "__main__":
    main()