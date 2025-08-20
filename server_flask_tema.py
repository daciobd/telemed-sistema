#!/usr/bin/env python3
"""
Servidor Flask para injeção automática de tema TeleMed Pro
Alternativa ao middleware Express para aplicação de tema em todas as páginas
"""

from flask import Flask, send_from_directory, request, Response
import os
import re

app = Flask(__name__)

# Configurações
THEME_CSS_PATH = '/preview/_theme-telemed-pro.css'
THEME_FONTS = '''
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
'''

def injetar_tema(html_content, tema_ativo=True):
    """Injeta tema TeleMed Pro no HTML"""
    if not tema_ativo:
        return html_content
    
    # Injeção de CSS e fontes no <head>
    head_inject = f'''
{THEME_FONTS}
<link rel="stylesheet" href="{THEME_CSS_PATH}">
'''
    
    if '</head>' in html_content:
        html_content = html_content.replace('</head>', head_inject + '</head>')
    else:
        # Se não há </head>, adicionar no início
        html_content = head_inject + html_content
    
    # Adicionar data-theme ao body
    if '<body' in html_content and 'data-theme=' not in html_content:
        html_content = re.sub(r'<body([^>]*)>', r'<body\1 data-theme="telemed-pro">', html_content)
    elif '<body' not in html_content:
        # Fallback para HTML muito simples
        html_content = '<body data-theme="telemed-pro">' + html_content + '</body>'
    
    # Adicionar toggle script
    toggle_script = '''
<script>
(function(){
    const btn=document.createElement('button');
    btn.textContent='Theme: ON';
    Object.assign(btn.style,{
        position:'fixed',right:'12px',top:'12px',zIndex:99999,
        background:'#111827',color:'#fff',border:'1px solid #374151',
        borderRadius:'10px',padding:'6px 10px',fontSize:'12px',
        cursor:'pointer',fontFamily:'Inter,sans-serif'
    });
    btn.onclick=function(){
        const u=new URL(location.href);
        u.searchParams.set('theme','off');
        location.href=u.toString();
    };
    document.body.appendChild(btn);
})();
</script>
'''
    
    if '</body>' in html_content:
        html_content = html_content.replace('</body>', toggle_script + '</body>')
    else:
        html_content += toggle_script
    
    return html_content

@app.route('/')
def root():
    return '''
    <h1>🎨 TeleMed Flask Theme Server</h1>
    <p>Servidor Flask para injeção automática de tema</p>
    <ul>
        <li><a href="/public/landing-teste.html">Landing Page (com tema)</a></li>
        <li><a href="/public/agenda-medica.html">Agenda Médica (com tema)</a></li>
        <li><a href="/preview/">Portal de Preview</a></li>
        <li><a href="/relatorio_navegacao.html">Relatório de Navegação</a></li>
    </ul>
    '''

@app.route('/public/<path:filename>')
def serve_public_with_theme(filename):
    """Serve arquivos HTML da pasta public com tema aplicado"""
    try:
        filepath = os.path.join('public', filename)
        if not os.path.exists(filepath):
            return "Arquivo não encontrado", 404
        
        # Verificar se tema deve ser aplicado
        tema_off = request.args.get('theme') == 'off'
        
        if filename.endswith('.html'):
            with open(filepath, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # Aplicar tema se não estiver desabilitado
            if not tema_off:
                html_content = injetar_tema(html_content)
            
            return Response(html_content, mimetype='text/html')
        else:
            # Arquivos não-HTML (CSS, JS, imagens)
            return send_from_directory('public', filename)
    
    except Exception as e:
        return f"Erro: {str(e)}", 500

@app.route('/preview/')
@app.route('/preview/<path:filename>')
def serve_preview(filename='index.html'):
    """Serve arquivos do preview com tema sempre aplicado"""
    try:
        filepath = os.path.join('public/preview', filename)
        if not os.path.exists(filepath):
            return "Arquivo não encontrado", 404
        
        tema_off = request.args.get('theme') == 'off'
        
        if filename.endswith('.html'):
            with open(filepath, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            if not tema_off:
                html_content = injetar_tema(html_content)
            
            return Response(html_content, mimetype='text/html')
        else:
            return send_from_directory('public/preview', filename)
    
    except Exception as e:
        return f"Erro: {str(e)}", 500

@app.route('/<path:filename>')
def serve_root_files(filename):
    """Serve arquivos da raiz (relatórios, etc.)"""
    if os.path.exists(filename):
        if filename.endswith('.html'):
            with open(filename, 'r', encoding='utf-8') as f:
                return Response(f.read(), mimetype='text/html')
        else:
            return send_from_directory('.', filename)
    return "Arquivo não encontrado", 404

if __name__ == '__main__':
    print("🎨 Iniciando servidor Flask com tema TeleMed Pro")
    print("📁 Servindo:")
    print("   /public/*.html - Páginas principais com tema")
    print("   /preview/ - Portal de preview sempre tematizado")
    print("   /?theme=off - Desabilitar tema em qualquer página")
    print("🌐 Acesse: http://localhost:8080")
    
    app.run(host='0.0.0.0', port=8080, debug=True)