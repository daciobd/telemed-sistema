#!/usr/bin/env python3
"""
Script para conectar páginas órfãs ao sistema de navegação
Adiciona links para páginas órfãs nos hubs principais
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
            dados = json.load(f)
        return dados
    except FileNotFoundError:
        print("❌ Execute primeiro o script mapa_navegacao_otimizado.py")
        return None

def categorizar_paginas_orfas(orfas):
    """Categoriza páginas órfãs por tipo/funcionalidade"""
    categorias = {
        'avaliacoes': [],
        'dashboards': [],
        'consultas': [],
        'admin': [],
        'testes': [],
        'backup': [],
        'outras': []
    }
    
    for pagina in orfas:
        nome_lower = pagina.lower()
        
        if any(term in nome_lower for term in ['gad', 'phq', 'mdq', 'asrs', 'pss', 'ansiedade', 'depressao', 'bipolar']):
            categorias['avaliacoes'].append(pagina)
        elif 'dashboard' in nome_lower or 'painel' in nome_lower:
            categorias['dashboards'].append(pagina)
        elif any(term in nome_lower for term in ['consulta', 'atendimento', 'videoconsulta']):
            categorias['consultas'].append(pagina)
        elif any(term in nome_lower for term in ['admin', 'gestao', 'configuracao']):
            categorias['admin'].append(pagina)
        elif any(term in nome_lower for term in ['teste', 'test', 'demo']):
            categorias['testes'].append(pagina)
        elif 'backup' in nome_lower or nome_lower.endswith('-old.html') or 'copy' in nome_lower:
            categorias['backup'].append(pagina)
        else:
            categorias['outras'].append(pagina)
    
    return categorias

def adicionar_menu_orfas_to_hub(hub_path, categorias, max_por_categoria=5):
    """Adiciona menu de páginas órfãs a um hub"""
    if not os.path.exists(hub_path):
        return False
    
    # Criar backup
    backup_dir = 'backup_hubs_conectados'
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
    
    # Criar seção de páginas órfãs
    orfas_section = soup.new_tag('div', **{'class': 'paginas-orfas-menu'})
    orfas_section.append(soup.new_tag('h3'))
    orfas_section.h3.string = "📋 Páginas Adicionais"
    
    # Adicionar CSS inline para o menu
    style_tag = soup.new_tag('style')
    style_tag.string = """
    .paginas-orfas-menu {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 15px;
        margin: 20px 0;
        font-size: 0.9rem;
    }
    .paginas-orfas-menu h3 {
        margin: 0 0 10px 0;
        color: #374151;
        font-size: 1rem;
    }
    .categoria-orfas {
        margin-bottom: 10px;
    }
    .categoria-orfas strong {
        color: #1f2937;
        display: block;
        margin-bottom: 5px;
    }
    .categoria-orfas a {
        display: inline-block;
        margin: 2px 5px 2px 0;
        padding: 4px 8px;
        background: #e5e7eb;
        color: #374151;
        text-decoration: none;
        border-radius: 4px;
        font-size: 0.8rem;
    }
    .categoria-orfas a:hover {
        background: #d1d5db;
    }
    """
    
    # Adicionar estilo ao head se existir
    head = soup.find('head')
    if head:
        head.append(style_tag)
    
    # Adicionar links por categoria
    for categoria, paginas in categorias.items():
        if not paginas:
            continue
        
        # Traduzir nomes das categorias
        nomes_categorias = {
            'avaliacoes': '🧠 Avaliações Psiquiátricas',
            'dashboards': '📊 Dashboards Alternativos',
            'consultas': '🩺 Consultas Especializadas',
            'admin': '⚙️ Administração',
            'testes': '🧪 Páginas de Teste',
            'backup': '📦 Arquivos de Backup',
            'outras': '📄 Outras Páginas'
        }
        
        categoria_div = soup.new_tag('div', **{'class': 'categoria-orfas'})
        categoria_strong = soup.new_tag('strong')
        categoria_strong.string = nomes_categorias.get(categoria, categoria.title())
        categoria_div.append(categoria_strong)
        
        # Adicionar até max_por_categoria links
        for pagina in paginas[:max_por_categoria]:
            link = soup.new_tag('a', href=f'/{pagina}')
            # Criar nome mais amigável
            nome_display = pagina.replace('.html', '').replace('-', ' ').title()[:20]
            if len(nome_display) < len(pagina.replace('.html', '')):
                nome_display += '...'
            link.string = nome_display
            categoria_div.append(link)
        
        if len(paginas) > max_por_categoria:
            mais_link = soup.new_tag('span', style='color: #6b7280; font-style: italic;')
            mais_link.string = f' (+{len(paginas) - max_por_categoria} mais)'
            categoria_div.append(mais_link)
        
        orfas_section.append(categoria_div)
    
    # Inserir seção antes do fechamento do body ou após o primeiro nav
    nav = soup.find('nav')
    if nav:
        nav.insert_after(orfas_section)
    else:
        body = soup.find('body')
        if body and body.children:
            # Inserir após o primeiro elemento do body
            first_element = next(body.children, None)
            if first_element:
                first_element.insert_after(orfas_section)
            else:
                body.append(orfas_section)
        else:
            # Fallback: adicionar ao final do HTML
            soup.append(orfas_section)
    
    # Salvar arquivo modificado
    try:
        with open(hub_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        return True
    except Exception as e:
        print(f"❌ Erro ao salvar {hub_path}: {e}")
        # Restaurar backup
        shutil.copy2(backup_path, hub_path)
        return False

def main():
    print("=" * 80)
    print("🔗 CONECTANDO PÁGINAS ÓRFÃS AO SISTEMA DE NAVEGAÇÃO")
    print("=" * 80)
    
    # Carregar dados de navegação
    dados = carregar_dados_navegacao()
    if not dados:
        return
    
    # Obter páginas órfãs
    orfas = dados['analysis']['orphan_pages']
    print(f"👻 Páginas órfãs encontradas: {len(orfas)}")
    
    if not orfas:
        print("✅ Nenhuma página órfã encontrada!")
        return
    
    # Categorizar órfãs
    categorias = categorizar_paginas_orfas(orfas)
    
    print("\n📊 Categorização das páginas órfãs:")
    for categoria, paginas in categorias.items():
        if paginas:
            print(f"   {categoria}: {len(paginas)} páginas")
    
    # Definir hubs principais para conexão
    hubs_principais = [
        ('agenda-medica.html', 'render-deploy/pages/agenda-medica.html'),
        ('dashboard-teste.html', 'dashboard-teste.html'),
        ('landing-teste.html', 'landing-teste.html'),
        ('meus-pacientes.html', 'meus-pacientes.html')
    ]
    
    conexoes_realizadas = 0
    
    # Adicionar menus nos hubs principais
    for hub_nome, hub_path in hubs_principais:
        print(f"\n🔗 Conectando órfãs ao hub: {hub_nome}")
        
        # Verificar se arquivo existe
        if not os.path.exists(hub_path):
            # Tentar encontrar o arquivo
            for root, dirs, files in os.walk('.'):
                if hub_nome in files:
                    hub_path = os.path.join(root, hub_nome)
                    break
        
        if os.path.exists(hub_path):
            success = adicionar_menu_orfas_to_hub(hub_path, categorias, max_por_categoria=3)
            if success:
                print(f"   ✅ Menu adicionado a {hub_nome}")
                conexoes_realizadas += 1
            else:
                print(f"   ❌ Falha ao conectar {hub_nome}")
        else:
            print(f"   ❌ Arquivo não encontrado: {hub_path}")
    
    # Relatório final
    print("\n" + "=" * 80)
    print("📊 RELATÓRIO DE CONEXÃO DE ÓRFÃS")
    print("=" * 80)
    
    print(f"👻 Total de páginas órfãs: {len(orfas)}")
    print(f"🔗 Hubs conectados: {conexoes_realizadas}")
    print(f"📂 Categorias criadas: {len([c for c in categorias.values() if c])}")
    
    # Salvar relatório
    relatorio = {
        'timestamp': datetime.now().isoformat(),
        'total_orfas': len(orfas),
        'categorias': {k: len(v) for k, v in categorias.items()},
        'hubs_conectados': conexoes_realizadas,
        'paginas_orfas_detalhadas': categorias
    }
    
    with open('relatorio_conexao_orfas.json', 'w', encoding='utf-8') as f:
        json.dump(relatorio, f, ensure_ascii=False, indent=2)
    
    print(f"📄 Relatório salvo: relatorio_conexao_orfas.json")
    print(f"📋 Backups salvos em: backup_hubs_conectados/")
    
    if conexoes_realizadas > 0:
        print(f"\n🎯 {len(orfas)} páginas órfãs agora estão acessíveis via {conexoes_realizadas} hubs!")
        print("✅ Menus de 'Páginas Adicionais' foram adicionados aos hubs principais")
    else:
        print("\n❌ Nenhuma conexão foi realizada. Verifique os caminhos dos arquivos.")

if __name__ == "__main__":
    main()