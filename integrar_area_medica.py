#!/usr/bin/env python3
"""
Script para integrar a nova página 'Área Médica' aos hubs principais
Adiciona links de navegação nos principais pontos de acesso
"""

import os
from bs4 import BeautifulSoup
import shutil

def adicionar_link_area_medica(arquivo_path, posicao_nav=True):
    """Adiciona link para Área Médica em um arquivo HTML"""
    if not os.path.exists(arquivo_path):
        return False
    
    # Backup
    backup_dir = 'backup_area_medica_integration'
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    backup_path = os.path.join(backup_dir, os.path.basename(arquivo_path))
    shutil.copy2(arquivo_path, backup_path)
    
    try:
        with open(arquivo_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False
    
    soup = BeautifulSoup(content, 'html.parser')
    
    # Verificar se já existe link para área médica
    existing_links = soup.find_all('a')
    for link in existing_links:
        href = link.get('href', '')
        if 'area-medica' in href:
            print(f"   ✅ Link já existe em {os.path.basename(arquivo_path)}")
            return True
    
    # Tentar encontrar navegação existente
    nav = soup.find('nav')
    if nav and posicao_nav:
        # Adicionar à navegação existente
        novo_link = soup.new_tag('a', href='/area-medica.html')
        novo_link.string = 'Área Médica'
        
        # Aplicar classes se existirem
        links_existentes = nav.find_all('a')
        if links_existentes:
            primeiro_link = links_existentes[0]
            if primeiro_link.get('class'):
                novo_link['class'] = primeiro_link['class']
        
        nav.append(novo_link)
        
    else:
        # Adicionar como link simples no body
        body = soup.find('body')
        if body:
            # Criar seção simples de link
            link_section = soup.new_tag('div', style='margin: 15px 0; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border-left: 3px solid #10b981;')
            
            titulo = soup.new_tag('strong', style='color: #10b981; display: block; margin-bottom: 5px;')
            titulo.string = '🏥 Acesso Rápido'
            link_section.append(titulo)
            
            link = soup.new_tag('a', 
                               href='/area-medica.html',
                               style='color: #10b981; text-decoration: none; font-weight: 600;')
            link.string = 'Área Médica - Gestão de Pacientes'
            link_section.append(link)
            
            # Inserir no início do body
            first_child = body.find()
            if first_child:
                first_child.insert_before(link_section)
            else:
                body.append(link_section)
    
    # Salvar arquivo
    try:
        with open(arquivo_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        return True
    except:
        # Restaurar backup em caso de erro
        shutil.copy2(backup_path, arquivo_path)
        return False

def main():
    print("🔗 Integrando Área Médica aos hubs principais...")
    
    # Arquivos principais para integração
    hubs_principais = [
        ('public/agenda-medica.html', True),      # Adicionar à nav
        ('public/dashboard-teste.html', True),   # Adicionar à nav/sidebar
        ('public/landing-teste.html', False),    # Adicionar como seção
        ('public/meus-pacientes.html', False),   # Adicionar como seção
        ('public/guia-medicos.html', False),     # Adicionar como seção
    ]
    
    integracoes_sucesso = 0
    
    for arquivo, usar_nav in hubs_principais:
        if os.path.exists(arquivo):
            print(f"🔗 Integrando em {os.path.basename(arquivo)}...")
            success = adicionar_link_area_medica(arquivo, usar_nav)
            if success:
                integracoes_sucesso += 1
                print(f"   ✅ Integração bem-sucedida")
            else:
                print(f"   ❌ Falha na integração")
        else:
            print(f"   ⚠️ Arquivo não encontrado: {arquivo}")
    
    print(f"\n✅ Integração completa: {integracoes_sucesso} hubs atualizados")
    print(f"📋 Backups salvos em: backup_area_medica_integration/")
    print(f"🏥 Página Área Médica disponível em: /area-medica.html")

if __name__ == "__main__":
    main()