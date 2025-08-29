#!/usr/bin/env bash
set -euo pipefail

ROOT="public_live"
echo "🔧 Normalizando rotas em: $ROOT/**/*.html"

# 1) Corrigir 'cadastro' -> 'consulta/' (href e data-path)
#    (primeiro sem barra, depois com barra sem /)
find "$ROOT" -type f -name '*.html' -print0 | xargs -0 sed -i \
  -e 's|\(href\|data-path\)="/cadastro"|\\1="/consulta/"|g' \
  -e 's|\(href\|data-path\)="/cadastro/"|\\1="/consulta/"|g'

# 2) Rotas canônicas que devem ter barra final
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

# Para cada rota: se encontrar href="/rota" → href="/rota/"
#                 e data-path="/rota" → data-path="/rota/"
for R in "${ROUTES[@]}"; do
  # sem barra → com barra
  find "$ROOT" -type f -name '*.html' -print0 | xargs -0 sed -i \
    -e "s|href=\"${R}\"|href=\"${R}/\"|g" \
    -e "s|data-path=\"${R}\"|data-path=\"${R}/\"|g"
  # evita duplicar barras (caso já esteja ok, não faz nada)
done

echo "✅ Rotas normalizadas."
