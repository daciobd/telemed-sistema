import os
from bs4 import BeautifulSoup
import json
from urllib.parse import urljoin, urlparse

def normalizar_link(link, arquivo_base):
    """Normaliza links relativos e absolutos"""
    if not link or link.startswith(('#', 'javascript:', 'mailto:', 'tel:')):
        return None
    
    # Se é link externo, manter como está
    if link.startswith('http') and 'replit.app' not in link:
        return link
    
    # Se é link absoluto interno, manter
    if link.startswith('/'):
        return link
    
    # Se é link relativo, normalizar baseado no arquivo
    if link.endswith('.html'):
        dir_base = os.path.dirname(arquivo_base)
        link_normalizado = os.path.normpath(os.path.join(dir_base, link))
        return link_normalizado.replace('\\', '/')
    
    return link

def extrair_links(arquivo):
    """Extrai e normaliza links de um arquivo HTML"""
    try:
        with open(arquivo, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        
        links_processados = []
        for a in soup.find_all('a'):
            href = a.get('href')
            link_normalizado = normalizar_link(href, arquivo)
            
            if link_normalizado:
                texto = a.get_text(strip=True)[:50]
                tipo = 'external' if link_normalizado.startswith('http') else 'internal'
                
                links_processados.append({
                    'url': link_normalizado,
                    'type': tipo,
                    'text': texto,
                    'valid': os.path.exists(link_normalizado) if tipo == 'internal' and link_normalizado.endswith('.html') else True
                })
        
        return links_processados
    except Exception as e:
        print(f"Erro ao processar {arquivo}: {e}")
        return []

def analisar_conectividade(mapa_estruturado):
    """Analisa hubs e páginas órfãs"""
    # Contar links de entrada
    links_entrada = {}
    for pagina, info in mapa_estruturado.items():
        for link in info['links']:
            if link['type'] == 'internal':
                target = os.path.basename(link['url'])
                if target not in links_entrada:
                    links_entrada[target] = 0
                links_entrada[target] += 1
    
    # Identificar hubs (muitos links saindo)
    hubs = sorted([(p, len(info['links'])) for p, info in mapa_estruturado.items()], 
                  key=lambda x: x[1], reverse=True)[:10]
    
    # Identificar páginas populares (muitos links entrando)
    populares = sorted(links_entrada.items(), key=lambda x: x[1], reverse=True)[:10]
    
    # Identificar órfãs (nenhum link entrando)
    orfas = [p for p in mapa_estruturado.keys() if p not in links_entrada]
    
    return hubs, populares, orfas

# Executar análise completa
print("=" * 70)
print("ANÁLISE OTIMIZADA DE NAVEGAÇÃO - TELEMED SISTEMA")
print("=" * 70)

mapa_estruturado = {}
total_html = 0
total_links = 0
links_validos = 0
links_quebrados = 0

# Coletar todos os arquivos HTML
for root, dirs, files in os.walk('.'):
    # Pular diretórios desnecessários
    if any(skip in root for skip in ['.git', 'node_modules', '__pycache__', '.vscode', 
                                     'backups', '_archived', '.pythonlibs']):
        continue
    
    for file in files:
        if file.endswith('.html'):
            caminho = os.path.join(root, file)
            links = extrair_links(caminho)
            
            # Contar links válidos/quebrados
            for link in links:
                if link['type'] == 'internal':
                    if link['valid']:
                        links_validos += 1
                    else:
                        links_quebrados += 1
            
            mapa_estruturado[os.path.basename(file)] = {
                'path': caminho,
                'directory': os.path.dirname(caminho),
                'links': links,
                'internal_count': len([l for l in links if l['type'] == 'internal']),
                'external_count': len([l for l in links if l['type'] == 'external']),
                'valid_links': len([l for l in links if l.get('valid', True)]),
                'broken_links': len([l for l in links if not l.get('valid', True)])
            }
            
            total_html += 1
            total_links += len(links)

# Análise de conectividade
hubs, populares, orfas = analisar_conectividade(mapa_estruturado)

# Salvar dados estruturados
with open('mapa_navegacao_completo.json', 'w', encoding='utf-8') as f:
    json.dump({
        'metadata': {
            'total_pages': total_html,
            'total_links': total_links,
            'valid_links': links_validos,
            'broken_links': links_quebrados,
            'analysis_date': '2025-08-20'
        },
        'pages': mapa_estruturado,
        'analysis': {
            'top_hubs': hubs,
            'most_referenced': populares,
            'orphan_pages': orfas[:20]  # Limitar a 20 para não poluir
        }
    }, f, ensure_ascii=False, indent=2)

print(f"📊 Total de páginas HTML: {total_html}")
print(f"🔗 Total de links encontrados: {total_links}")
print(f"✅ Links válidos: {links_validos}")
print(f"❌ Links quebrados: {links_quebrados}")
print("=" * 70)

print("\n🎯 PÁGINAS CANÔNICAS:")
canonicas = ['landing-teste.html', 'agenda-medica.html', 'enhanced-teste.html', 
             'dashboard-teste.html', 'meus-pacientes.html', 'registro-saude.html']

for pagina in canonicas:
    if pagina in mapa_estruturado:
        info = mapa_estruturado[pagina]
        status = "✅" if info['broken_links'] == 0 else "⚠️"
        print(f"{status} {pagina}: {info['internal_count']} internos, {info['external_count']} externos, {info['broken_links']} quebrados")
    else:
        print(f"❌ {pagina}: não encontrada")

print(f"\n📈 TOP 10 HUBS (mais links saindo):")
for i, (pagina, count) in enumerate(hubs, 1):
    print(f"{i:2d}. {pagina:<35} ({count:2d} links)")

print(f"\n⭐ TOP 10 MAIS REFERENCIADAS (links entrando):")
for i, (pagina, count) in enumerate(populares, 1):
    print(f"{i:2d}. {pagina:<35} ({count:2d} referências)")

print(f"\n👻 PÁGINAS ÓRFÃS (sem links entrando): {len(orfas)} páginas")
if orfas[:5]:  # Mostrar só as 5 primeiras
    for pagina in orfas[:5]:
        print(f"   - {pagina}")
    if len(orfas) > 5:
        print(f"   ... e mais {len(orfas) - 5} páginas")

print(f"\n✅ Análise completa salva em: mapa_navegacao_completo.json")
print("📊 Dados estruturados incluem: metadata, páginas, análise de conectividade")
print("🔧 Para usar: cat mapa_navegacao_completo.json | jq '.analysis.top_hubs'")