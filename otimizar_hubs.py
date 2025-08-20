#!/usr/bin/env python3
"""
Script para otimização de distribuição de links nos hubs principais
Balanceia carga de links e melhora a navegabilidade
"""

import os
import json
from bs4 import BeautifulSoup
import shutil
from datetime import datetime

def carregar_dados_navegacao():
    """Carrega dados da análise de navegação"""
    try:
        with open('mapa_navegacao_completo.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ Execute primeiro o script mapa_navegacao_otimizado.py")
        return None

def criar_submenu_organizado(soup, links_list, titulo, max_items=8):
    """Cria um submenu organizado com limite de itens"""
    submenu_div = soup.new_tag('div', **{'class': 'submenu-hub'})
    
    # Título do submenu
    titulo_tag = soup.new_tag('h4')
    titulo_tag.string = titulo
    submenu_div.append(titulo_tag)
    
    # Container de links
    links_container = soup.new_tag('div', **{'class': 'links-container'})
    
    # Adicionar links (limitado)
    for i, link_info in enumerate(links_list[:max_items]):
        link_tag = soup.new_tag('a', href=link_info['url'], **{'class': 'hub-link'})
        link_tag.string = link_info.get('text', link_info['url'][:30])
        links_container.append(link_tag)
        
        if i < len(links_list[:max_items]) - 1:
            links_container.append(' | ')
    
    # Indicador de mais links se necessário
    if len(links_list) > max_items:
        mais_span = soup.new_tag('span', **{'class': 'mais-links'})
        mais_span.string = f' (+{len(links_list) - max_items} mais)'
        links_container.append(mais_span)
    
    submenu_div.append(links_container)
    return submenu_div

def otimizar_hub(hub_path, limite_links=25):
    """Otimiza um hub reorganizando seus links"""
    if not os.path.exists(hub_path):
        return False
    
    # Criar backup
    backup_dir = 'backup_hubs_otimizados'
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    backup_path = os.path.join(backup_dir, os.path.basename(hub_path))
    shutil.copy2(hub_path, backup_path)
    
    try:
        with open(hub_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except Exception as e:
        print(f"❌ Erro ao ler {hub_path}: {e}")
        return False
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Coletar todos os links existentes
    links_existentes = []
    for a_tag in soup.find_all('a'):
        href = a_tag.get('href')
        if href and not href.startswith(('#', 'javascript:', 'mailto:')):
            links_existentes.append({
                'url': href,
                'text': a_tag.get_text(strip=True)[:30],
                'element': a_tag
            })
    
    if len(links_existentes) <= limite_links:
        print(f"   ✅ Hub já otimizado ({len(links_existentes)} links)")
        return True
    
    # Categorizar links por tipo
    categorias = {
        'navegacao': [],      # Links principais de navegação
        'funcionalidades': [],  # Funcionalidades específicas
        'avaliacoes': [],     # Avaliações psiquiátricas
        'externos': [],       # Links externos
        'outros': []          # Outros links
    }
    
    for link in links_existentes:
        url = link['url'].lower()
        texto = link['text'].lower()
        
        if any(nav in url for nav in ['/agenda', '/consulta', '/dashboard', '/lp']):
            categorias['navegacao'].append(link)
        elif any(aval in url or aval in texto for aval in ['gad', 'phq', 'mdq', 'asrs', 'pss', 'ansiedade']):
            categorias['avaliacoes'].append(link)
        elif url.startswith('http'):
            categorias['externos'].append(link)
        elif any(func in url or func in texto for func in ['consulta', 'paciente', 'receita', 'dr-ai']):
            categorias['funcionalidades'].append(link)
        else:
            categorias['outros'].append(link)
    
    # Remover links existentes do DOM (manteremos apenas os principais)
    links_removidos = 0
    for link in links_existentes[limite_links:]:  # Remove links em excesso
        if link['element'].parent:
            link['element'].extract()
            links_removidos += 1
    
    # Adicionar CSS para os submenus
    style_tag = soup.new_tag('style')
    style_tag.string = """
    .hub-otimizado {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
    }
    .hub-otimizado h3 {
        color: #1e40af;
        margin: 0 0 15px 0;
        font-size: 1.1rem;
    }
    .submenu-hub {
        margin-bottom: 15px;
        padding: 10px;
        background: white;
        border-radius: 8px;
        border-left: 4px solid #10b981;
    }
    .submenu-hub h4 {
        margin: 0 0 8px 0;
        color: #374151;
        font-size: 0.9rem;
        font-weight: 600;
    }
    .links-container {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }
    .hub-link {
        padding: 4px 8px;
        background: #e5e7eb;
        color: #374151;
        text-decoration: none;
        border-radius: 4px;
        font-size: 0.8rem;
        transition: background 0.2s;
    }
    .hub-link:hover {
        background: #d1d5db;
    }
    .mais-links {
        color: #6b7280;
        font-style: italic;
        font-size: 0.8rem;
    }
    """
    
    # Adicionar estilo ao head
    head = soup.find('head')
    if head:
        head.append(style_tag)
    
    # Criar seção de hub otimizado
    hub_section = soup.new_tag('div', **{'class': 'hub-otimizado'})
    hub_title = soup.new_tag('h3')
    hub_title.string = f"🔗 Hub Organizado ({len(links_existentes)} links)"
    hub_section.append(hub_title)
    
    # Adicionar categorias como submenus
    for categoria, links_cat in categorias.items():
        if not links_cat:
            continue
        
        titulos_categoria = {
            'navegacao': '🧭 Navegação Principal',
            'funcionalidades': '⚡ Funcionalidades',
            'avaliacoes': '🧠 Avaliações',
            'externos': '🌐 Links Externos',
            'outros': '📄 Outras Páginas'
        }
        
        submenu = criar_submenu_organizado(
            soup, 
            links_cat, 
            titulos_categoria[categoria],
            max_items=6 if categoria == 'navegacao' else 4
        )
        hub_section.append(submenu)
    
    # Inserir seção otimizada
    body = soup.find('body')
    if body:
        # Tentar inserir após um elemento de navegação existente
        nav = soup.find('nav')
        if nav:
            nav.insert_after(hub_section)
        else:
            body.insert(0, hub_section)
    
    # Salvar arquivo otimizado
    try:
        with open(hub_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"   ✅ Hub otimizado: {links_removidos} links reorganizados")
        return True
    except Exception as e:
        print(f"❌ Erro ao salvar {hub_path}: {e}")
        shutil.copy2(backup_path, hub_path)
        return False

def main():
    print("=" * 80)
    print("⚡ OTIMIZAÇÃO DE DISTRIBUIÇÃO DE LINKS - HUBS PRINCIPAIS")
    print("=" * 80)
    
    # Carregar dados de navegação
    dados = carregar_dados_navegacao()
    if not dados:
        return
    
    # Obter top 5 hubs
    top_hubs = dados['analysis']['top_hubs'][:5]
    print(f"🎯 Top 5 hubs identificados:")
    for i, (pagina, count) in enumerate(top_hubs, 1):
        status = "🔥 Alto" if count > 30 else "⚠️ Médio" if count > 20 else "✅ OK"
        print(f"   {i}. {pagina}: {count} links - {status}")
    
    hubs_otimizados = 0
    
    # Otimizar cada hub
    for pagina, count in top_hubs:
        if count <= 25:  # Skip hubs que já estão OK
            continue
            
        print(f"\n⚡ Otimizando hub: {pagina} ({count} links)")
        print("-" * 50)
        
        # Encontrar arquivo do hub
        hub_path = None
        for root, dirs, files in os.walk('.'):
            if pagina in files:
                hub_path = os.path.join(root, pagina)
                break
        
        if hub_path and os.path.exists(hub_path):
            success = otimizar_hub(hub_path, limite_links=25)
            if success:
                hubs_otimizados += 1
        else:
            print(f"   ❌ Arquivo não encontrado: {pagina}")
    
    # Relatório final
    print("\n" + "=" * 80)
    print("📊 RELATÓRIO DE OTIMIZAÇÃO DE HUBS")
    print("=" * 80)
    
    print(f"🎯 Hubs analisados: {len(top_hubs)}")
    print(f"⚡ Hubs otimizados: {hubs_otimizados}")
    print(f"📋 Limite por hub: 25 links principais + submenus organizados")
    
    # Salvar relatório
    relatorio = {
        'timestamp': datetime.now().isoformat(),
        'hubs_analisados': len(top_hubs),
        'hubs_otimizados': hubs_otimizados,
        'limite_links': 25,
        'top_hubs_original': top_hubs
    }
    
    with open('relatorio_otimizacao_hubs.json', 'w', encoding='utf-8') as f:
        json.dump(relatorio, f, ensure_ascii=False, indent=2)
    
    print(f"📄 Relatório salvo: relatorio_otimizacao_hubs.json")
    print(f"📋 Backups salvos em: backup_hubs_otimizados/")
    
    if hubs_otimizados > 0:
        print(f"\n🎯 {hubs_otimizados} hubs foram otimizados com submenus organizados!")
        print("✅ Links reorganizados por categoria para melhor usabilidade")
    else:
        print("\n✅ Todos os hubs já estão dentro do limite recomendado!")

if __name__ == "__main__":
    main()