#!/usr/bin/env bash
set -euo pipefail

echo "➡️  Preparando pasta de publicação: public_live/"
mkdir -p public_live/{css,assets,react-app}

copy_if_exists () {
  local src="$1"
  local dst="$2"
  if [ -e "$src" ]; then
    echo "   • Copiando $src -> $dst"
    rsync -a --delete "$src" "$dst"
  else
    echo "   • (ignorado) $src não existe"
  fi
}

# 1) Assets e CSS para o webroot publicado
copy_if_exists public/css/        public_live/
copy_if_exists public/assets/     public_live/

# 2) SPA (consulta) e páginas principais
copy_if_exists public/react-app/  public_live/
for page in lp.html dashboard.html login.html cadastro.html como-funciona.html consulta.html; do
  if [ -f "public/$page" ]; then
    echo "   • Copiando public/$page -> public_live/$page"
    rsync -a "public/$page" "public_live/$page"
  fi
done

# 3) Garante <base> no SPA
SPA_INDEX="public_live/react-app/index.html"
if [ -f "$SPA_INDEX" ]; then
  if ! grep -q '<base href="/react-app/">' "$SPA_INDEX"; then
    echo "   • Injetando <base href=\"/react-app/\"> no SPA"
    # insere após a primeira tag <head>
    sed -i '0,/<head>/s//<head>\n  <base href="\/react-app\/">/' "$SPA_INDEX"
  else
    echo "   • <base href=\"/react-app/\"> já presente no SPA"
  fi
fi

# 4) Relatório rápido
echo
echo "📄 Páginas publicadas (public_live/):"
ls -1 public_live | sed 's/^/   - /' || true

echo
echo "📁 Pastas publicadas:"
du -sh public_live/* 2>/dev/null || true

echo
echo "✅ Pronto. Faça commit/push e depois 'Manual Deploy' no Render."
