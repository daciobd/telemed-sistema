import json
import os
from datetime import datetime

def carregar_analise():
    """Carrega dados da análise de navegação"""
    try:
        with open('mapa_navegacao_completo.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ Arquivo mapa_navegacao_completo.json não encontrado")
        return None

def gerar_relatorio_html(dados):
    """Gera relatório HTML interativo"""
    metadata = dados['metadata']
    pages = dados['pages']
    analysis = dados['analysis']
    
    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>TeleMed - Relatório de Navegação</title>
    <style>
        body {{ font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }}
        .container {{ max-width: 1200px; margin: 0 auto; }}
        .header {{ background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; }}
        .stats {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }}
        .stat-card {{ background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }}
        .stat-value {{ font-size: 2.5rem; font-weight: bold; color: #1e40af; }}
        .stat-label {{ color: #64748b; font-size: 0.9rem; }}
        .section {{ background: white; margin-bottom: 20px; border-radius: 10px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .section h2 {{ color: #1e40af; margin-top: 0; }}
        table {{ width: 100%; border-collapse: collapse; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }}
        th {{ background: #f1f5f9; font-weight: 600; }}
        .status-ok {{ color: #16a34a; }}
        .status-warning {{ color: #ca8a04; }}
        .status-error {{ color: #dc2626; }}
        .progress {{ width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }}
        .progress-bar {{ height: 100%; background: #10b981; transition: width 0.3s; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Relatório de Navegação TeleMed</h1>
            <p>Análise completa realizada em {metadata['analysis_date']}</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">{metadata['total_pages']}</div>
                <div class="stat-label">Páginas HTML</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{metadata['total_links']}</div>
                <div class="stat-label">Links Totais</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{metadata['valid_links']}</div>
                <div class="stat-label">Links Válidos</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{metadata['broken_links']}</div>
                <div class="stat-label">Links Quebrados</div>
            </div>
        </div>
        
        <div class="section">
            <h2>🎯 Páginas Canônicas</h2>
            <table>
                <tr><th>Página</th><th>Links Internos</th><th>Links Externos</th><th>Status</th></tr>"""
    
    canonicas = ['landing-teste.html', 'agenda-medica.html', 'enhanced-teste.html', 
                 'dashboard-teste.html', 'meus-pacientes.html', 'registro-saude.html']
    
    for pagina in canonicas:
        if pagina in pages:
            info = pages[pagina]
            status_class = "status-ok" if info['broken_links'] == 0 else "status-warning"
            status_text = "✅ OK" if info['broken_links'] == 0 else f"⚠️ {info['broken_links']} quebrados"
            html += f"""<tr>
                <td>{pagina}</td>
                <td>{info['internal_count']}</td>
                <td>{info['external_count']}</td>
                <td class="{status_class}">{status_text}</td>
            </tr>"""
        else:
            html += f"""<tr><td>{pagina}</td><td colspan="3" class="status-error">❌ Não encontrada</td></tr>"""
    
    html += """</table></div>
        
        <div class="section">
            <h2>📈 Top 10 Hubs (Páginas com Mais Links)</h2>
            <table><tr><th>#</th><th>Página</th><th>Links Saindo</th><th>Progresso</th></tr>"""
    
    max_links = analysis['top_hubs'][0][1] if analysis['top_hubs'] else 1
    for i, (pagina, count) in enumerate(analysis['top_hubs'][:10], 1):
        percent = (count / max_links) * 100
        html += f"""<tr>
            <td>{i}</td>
            <td>{pagina}</td>
            <td>{count}</td>
            <td><div class="progress"><div class="progress-bar" style="width: {percent}%"></div></div></td>
        </tr>"""
    
    html += """</table></div>
        
        <div class="section">
            <h2>⭐ Top 10 Páginas Mais Referenciadas</h2>
            <table><tr><th>#</th><th>Página</th><th>Referências</th><th>Popularidade</th></tr>"""
    
    max_refs = analysis['most_referenced'][0][1] if analysis['most_referenced'] else 1
    for i, (pagina, count) in enumerate(analysis['most_referenced'][:10], 1):
        percent = (count / max_refs) * 100
        html += f"""<tr>
            <td>{i}</td>
            <td>{pagina}</td>
            <td>{count}</td>
            <td><div class="progress"><div class="progress-bar" style="width: {percent}%"></div></div></td>
        </tr>"""
    
    html += f"""</table></div>
        
        <div class="section">
            <h2>👻 Análise de Páginas Órfãs</h2>
            <p><strong>{len(analysis['orphan_pages'])}</strong> páginas não possuem links de entrada (órfãs).</p>
            <p>Primeiras 10 páginas órfãs:</p>
            <ul>"""
    
    for pagina in analysis['orphan_pages'][:10]:
        html += f"<li>{pagina}</li>"
    
    html += f"""</ul>
            {f"<p>... e mais {len(analysis['orphan_pages']) - 10} páginas</p>" if len(analysis['orphan_pages']) > 10 else ""}
        </div>
        
        <div class="section">
            <h2>🔧 Recomendações</h2>
            <ul>
                <li><strong>Links Quebrados:</strong> Corrigir {metadata['broken_links']} links quebrados identificados</li>
                <li><strong>Páginas Órfãs:</strong> Adicionar navegação para {len(analysis['orphan_pages'])} páginas órfãs</li>
                <li><strong>Consolidação:</strong> Focar nas 6 páginas canônicas como pontos de entrada principais</li>
                <li><strong>Hubs:</strong> Otimizar os top 5 hubs para melhor distribuição de tráfego</li>
            </ul>
        </div>
    </div>
</body>
</html>"""
    
    return html

def main():
    dados = carregar_analise()
    if not dados:
        return
    
    # Gerar relatório HTML
    html_relatorio = gerar_relatorio_html(dados)
    
    with open('relatorio_navegacao.html', 'w', encoding='utf-8') as f:
        f.write(html_relatorio)
    
    print("=" * 60)
    print("📊 ANALYTICS DE NAVEGAÇÃO GERADO")
    print("=" * 60)
    print("✅ Relatório HTML: relatorio_navegacao.html")
    print("📁 JSON detalhado: mapa_navegacao_completo.json")
    
    # Estatísticas rápidas
    metadata = dados['metadata']
    print(f"\n📈 ESTATÍSTICAS:")
    print(f"   Páginas: {metadata['total_pages']}")
    print(f"   Links: {metadata['total_links']}")
    print(f"   Taxa de sucesso: {(metadata['valid_links']/(metadata['total_links'] or 1)*100):.1f}%")
    print(f"   Links quebrados: {metadata['broken_links']}")
    
    # Top insights
    analysis = dados['analysis']
    print(f"\n🎯 INSIGHTS:")
    print(f"   Hub principal: {analysis['top_hubs'][0][0]} ({analysis['top_hubs'][0][1]} links)")
    print(f"   Mais referenciada: {analysis['most_referenced'][0][0]} ({analysis['most_referenced'][0][1]} refs)")
    print(f"   Páginas órfãs: {len(analysis['orphan_pages'])}")

if __name__ == "__main__":
    main()