import os
from bs4 import BeautifulSoup
import json

def extrair_links(arquivo):
    try:
        with open(arquivo, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            
        links = []
        for a in soup.find_all('a'):
            href = a.get('href')
            if href and not href.startswith(('#', 'javascript:', 'mailto:', 'tel:')):
                if href.startswith('http') and 'replit.app' not in href:
                    links.append({'url': href, 'type': 'external', 'text': a.get_text(strip=True)[:50]})
                elif href.endswith('.html') or href.startswith('/'):
                    links.append({'url': href, 'type': 'internal', 'text': a.get_text(strip=True)[:50]})
        
        return links
    except Exception as e:
        print(f"Erro ao processar {arquivo}: {e}")
        return []

# Análise de navegação
mapa_estruturado = {}
total_html = 0
total_links = 0

for root, dirs, files in os.walk('.'):
    if any(skip in root for skip in ['.git', 'node_modules', '__pycache__', '.vscode', 'backups', '_archived']):
        continue
        
    for file in files:
        if file.endswith('.html'):
            caminho = os.path.join(root, file)
            links = extrair_links(caminho)
            
            mapa_estruturado[os.path.basename(file)] = {
                'path': caminho,
                'directory': os.path.dirname(caminho),
                'links': links,
                'internal_count': len([l for l in links if l['type'] == 'internal']),
                'external_count': len([l for l in links if l['type'] == 'external'])
            }
            
            total_html += 1
            total_links += len(links)

# Salvar análise estruturada em JSON
with open('mapa_navegacao.json', 'w', encoding='utf-8') as f:
    json.dump(mapa_estruturado, f, ensure_ascii=False, indent=2)

print("=" * 60)
print("ANÁLISE DE NAVEGAÇÃO TELEMED - VERSÃO REFINADA")
print("=" * 60)
print(f"Total de páginas HTML: {total_html}")
print(f"Total de links encontrados: {total_links}")
print(f"JSON estruturado salvo em: mapa_navegacao.json")
print("=" * 60)

# Análise das páginas principais
principais = ['landing-teste.html', 'agenda-medica.html', 'enhanced-teste.html', 
             'dashboard-teste.html', 'meus-pacientes.html', 'registro-saude.html']

print("\n🎯 PÁGINAS CANÔNICAS:")
for pagina in principais:
    if pagina in mapa_estruturado:
        info = mapa_estruturado[pagina]
        print(f"✅ {pagina}: {info['internal_count']} internos, {info['external_count']} externos")
    else:
        print(f"❌ {pagina}: não encontrada")

# Top 10 páginas com mais links
print("\n📊 TOP 10 PÁGINAS COM MAIS LINKS:")
sorted_pages = sorted(mapa_estruturado.items(), 
                     key=lambda x: len(x[1]['links']), reverse=True)[:10]

for i, (pagina, info) in enumerate(sorted_pages, 1):
    total = len(info['links'])
    print(f"{i:2d}. {pagina:<30} ({total:2d} links)")

print(f"\n✅ Análise completa salva em mapa_navegacao.json")
print("📊 Para visualizar: cat mapa_navegacao.json | jq")