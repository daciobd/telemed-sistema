#!/usr/bin/env bash
set -euo pipefail

ROOT="public_live"
echo "🔧 Corrigindo rotas em: $ROOT/**/*.html"

# 1) Corrigir qualquer /cadastro → /consulta/
find "$ROOT" -type f -name '*.html' -print0 | xargs -0 sed -i \
  -e 's|\(href\|data-path\)="/cadastro"|\\1="/consulta/"|g' \
  -e 's|\(href\|data-path\)="/cadastro/"|\\1="/consulta/"|g' \
  -e 's|https://telemed.pro/cadastro|https://telemed.pro/consulta/|g'

# 2) Rotas que sempre devem ter barra final
ROUTES=(
  "/dashboard"
  "/consulta"
  "/centro-de-testes"
  "/medico"
  "/gestao-avancada"
  "/meus-pacientes"
  "/agenda"
  "/sala-de-espera"
  "/dr-ai"
  "/como-funciona"
  "/precos"
)

for R in "${ROUTES[@]}"; do
  find "$ROOT" -type f -name '*.html' -print0 | xargs -0 sed -i \
    -e "s|href=\"${R}\"|href=\"${R}/\"|g" \
    -e "s|data-path=\"${R}\"|data-path=\"${R}/\"|g"
done

echo "✅ Rotas corrigidas."
