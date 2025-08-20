#!/usr/bin/env python3
"""
Script para conectar as 20 páginas órfãs restantes distribuindo pelos hubs
Finaliza a conexão de todas as páginas órfãs ao sistema de navegação
"""

import json
import os
from bs4 import BeautifulSoup
import shutil

def carregar_orfas():
    """Carrega lista das páginas órfãs"""
    try:
        with open('mapa_navegacao_completo.json', 'r', encoding='utf-8') as f:
            dados = json.load(f)
        return dados['analysis']['orphan_pages']
    except FileNotFoundError:
        return []

def encontrar_hubs_adicionais():
    """Identifica hubs adicionais para distribuir órfãs"""
    hubs_adicionais = [
        'centro-avaliacao.html',
        'dr-ai.html', 
        'videoconsulta.html',
        'consulta-por-valor.html',
        'area-medica-new.html'
    ]
    
    hubs_encontrados = []
    for hub in hubs_adicionais:
        for root, dirs, files in os.walk('.'):
            if hub in files:
                hubs_encontrados.append(os.path.join(root, hub))
                break
    
    return hubs_encontrados

def adicionar_links_simples(hub_path, orfas_grupo, categoria="📄 Páginas Extras"):
    """Adiciona links simples para páginas órfãs"""
    if not os.path.exists(hub_path) or not orfas_grupo:
        return False
    
    try:
        with open(hub_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except:
        return False
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Criar seção simples de links órfãs
    orfas_div = soup.new_tag('div', style='margin: 15px 0; padding: 10px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #10b981;')
    
    titulo = soup.new_tag('strong', style='color: #374151; display: block; margin-bottom: 8px; font-size: 0.9rem;')
    titulo.string = categoria
    orfas_div.append(titulo)
    
    # Container de links
    links_container = soup.new_tag('div', style='display: flex; flex-wrap: wrap; gap: 8px;')
    
    for pagina in orfas_grupo[:5]:  # Máximo 5 por hub
        link = soup.new_tag('a', 
                           href=f'/{pagina}',
                           style='padding: 4px 8px; background: #e5e7eb; color: #374151; text-decoration: none; border-radius: 4px; font-size: 0.8rem;')
        
        # Nome mais amigável
        nome_display = pagina.replace('.html', '').replace('-', ' ').title()[:15]
        if len(nome_display) < len(pagina.replace('.html', '')):
            nome_display += '...'
        
        link.string = nome_display
        links_container.append(link)
    
    orfas_div.append(links_container)
    
    # Inserir no body ou após nav
    nav = soup.find('nav')
    if nav:
        nav.insert_after(orfas_div)
    else:
        body = soup.find('body')
        if body:
            body.insert(0, orfas_div)
    
    # Salvar
    try:
        with open(hub_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        return True
    except:
        return False

def main():
    print("🔗 Conectando as 20 páginas órfãs restantes aos hubs...")
    
    # Carregar órfãs
    orfas = carregar_orfas()
    print(f"📋 Órfãs encontradas: {len(orfas)}")
    
    if len(orfas) == 0:
        print("✅ Nenhuma órfã restante!")
        return
    
    # Encontrar hubs adicionais
    hubs_adicionais = encontrar_hubs_adicionais()
    print(f"🏢 Hubs adicionais encontrados: {len(hubs_adicionais)}")
    
    # Hubs principais já conectados
    hubs_principais = [
        'agenda-medica.html',
        'dashboard-teste.html', 
        'landing-teste.html',
        'meus-pacientes.html'
    ]
    
    # Distribuir órfãs entre todos os hubs
    todos_hubs = []
    
    # Adicionar hubs principais
    for hub in hubs_principais:
        for root, dirs, files in os.walk('.'):
            if hub in files:
                todos_hubs.append((os.path.join(root, hub), f"📄 Mais Páginas"))
                break
    
    # Adicionar hubs secundários
    for hub_path in hubs_adicionais:
        todos_hubs.append((hub_path, "📋 Páginas Relacionadas"))
    
    print(f"🎯 Total de hubs para distribuição: {len(todos_hubs)}")
    
    # Distribuir órfãs (máximo 5 por hub)
    orfas_por_hub = 5
    conexoes = 0
    
    for i, (hub_path, categoria) in enumerate(todos_hubs):
        inicio = i * orfas_por_hub
        fim = min(inicio + orfas_por_hub, len(orfas))
        
        if inicio >= len(orfas):
            break
            
        orfas_grupo = orfas[inicio:fim]
        hub_nome = os.path.basename(hub_path)
        
        print(f"🔗 Conectando {len(orfas_grupo)} órfãs ao {hub_nome}")
        
        success = adicionar_links_simples(hub_path, orfas_grupo, categoria)
        if success:
            conexoes += len(orfas_grupo)
            print(f"   ✅ {len(orfas_grupo)} páginas conectadas")
        else:
            print(f"   ❌ Falha na conexão")
    
    print(f"\n✅ Conexão completa: {conexoes}/{len(orfas)} páginas órfãs conectadas")
    
    if conexoes == len(orfas):
        print("🎯 Todas as páginas órfãs foram conectadas ao sistema!")
    else:
        restantes = len(orfas) - conexoes
        print(f"⚠️ {restantes} páginas ainda precisam de conexão")

if __name__ == "__main__":
    main()