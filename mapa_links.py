import os
from bs4 import BeautifulSoup

# Função para extrair links de um arquivo HTML
def extrair_links(arquivo):
    try:
        with open(arquivo, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            links = [a.get('href') for a in soup.find_all('a') if a.get('href')]
        return links
    except Exception as e:
        print(f"Erro ao processar {arquivo}: {e}")
        return []

# Listar todos os arquivos HTML no diretório e subdiretórios
mapa = {}
total_html = 0
total_links = 0

for root, dirs, files in os.walk('.'):
    # Pular diretórios desnecessários
    if any(skip in root for skip in ['.git', 'node_modules', '__pycache__', '.vscode']):
        continue
        
    for file in files:
        if file.endswith('.html'):
            caminho = os.path.join(root, file)
            links = extrair_links(caminho)
            mapa[caminho] = links
            total_html += 1
            total_links += len(links)

# Gerar relatório
print("=" * 60)
print("MAPA DE NAVEGAÇÃO - TELEMED SISTEMA")
print("=" * 60)
print(f"Total de páginas HTML: {total_html}")
print(f"Total de links encontrados: {total_links}")
print("=" * 60)

# Análise por diretório
diretorios = {}
for pagina, links in mapa.items():
    diretorio = os.path.dirname(pagina)
    if diretorio not in diretorios:
        diretorios[diretorio] = []
    diretorios[diretorio].append((os.path.basename(pagina), links))

# Relatório por diretório
for dir_path, arquivos in sorted(diretorios.items()):
    print(f"\nDIRETÓRIO: {dir_path or '(raiz)'}")
    print("-" * 40)
    
    for arquivo, links in arquivos:
        print(f"📄 {arquivo}")
        if links:
            # Filtrar links internos vs externos
            internos = [l for l in links if l.endswith('.html') or l.startswith('/') or not l.startswith('http')]
            externos = [l for l in links if l.startswith('http') and not l.endswith('.html')]
            
            if internos:
                print("  🔗 Links internos:")
                for link in internos[:10]:  # Limitar a 10 para não poluir
                    print(f"    → {link}")
                if len(internos) > 10:
                    print(f"    ... e mais {len(internos) - 10} links")
            
            if externos:
                print(f"  🌐 Links externos: {len(externos)}")
        else:
            print("  (sem links)")
        print()

# Análise de páginas principais
print("\n" + "=" * 60)
print("ANÁLISE DE PÁGINAS PRINCIPAIS")
print("=" * 60)

principais = ['public/landing-teste.html', 'public/agenda-medica.html', 
             'public/enhanced-teste.html', 'public/meus-pacientes.html',
             'public/registro-saude.html', 'public/dashboard-teste.html']

for pagina_key in principais:
    if pagina_key in mapa:
        links = mapa[pagina_key]
        nome = os.path.basename(pagina_key)
        print(f"\n🎯 {nome.upper()}")
        print(f"   Total de links: {len(links)}")
        
        # Contar tipos de links
        internos = len([l for l in links if l.endswith('.html') or l.startswith('/') and not l.startswith('http')])
        externos = len([l for l in links if l.startswith('http')])
        relativos = len([l for l in links if not l.startswith('/') and not l.startswith('http')])
        
        print(f"   Internos: {internos} | Externos: {externos} | Relativos: {relativos}")

# Gerar arquivo DOT para diagrama
print("\n" + "=" * 60)
print("GERANDO MAPA VISUAL")
print("=" * 60)

with open('mapa_navegacao.dot', 'w', encoding='utf-8') as dot:
    dot.write('digraph TeleMed {\n')
    dot.write('  rankdir=TB;\n')
    dot.write('  node [shape=box, style=filled, fillcolor=lightblue];\n')
    
    # Adicionar nós especiais para páginas principais
    principais_cores = {
        'landing-teste.html': 'gold',
        'agenda-medica.html': 'lightgreen', 
        'enhanced-teste.html': 'lightcoral',
        'dashboard-teste.html': 'lightpink'
    }
    
    for pagina, links in mapa.items():
        pagina_nome = os.path.basename(pagina)
        
        # Colorir páginas principais
        cor = principais_cores.get(pagina_nome, 'lightblue')
        if pagina_nome in principais_cores:
            dot.write(f'  "{pagina_nome}" [fillcolor={cor}, fontweight=bold];\n')
        
        # Adicionar conexões apenas para links HTML internos
        for link in links:
            if link.endswith('.html') and not link.startswith('http'):
                link_nome = os.path.basename(link)
                dot.write(f'  "{pagina_nome}" -> "{link_nome}";\n')
    
    dot.write('}\n')

print("✅ Arquivo 'mapa_navegacao.dot' gerado")
print("📊 Para visualizar o diagrama:")
print("   1. Copie o conteúdo de mapa_navegacao.dot")
print("   2. Cole em: https://dreampuf.github.io/GraphvizOnline/")
print("   3. Ou use: https://magjac.com/graphviz-visual-editor/")

print("\n🎯 RELATÓRIO COMPLETO GERADO!")