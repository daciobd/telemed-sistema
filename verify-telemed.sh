#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-}"

if [ -z "$BASE_URL" ]; then
  echo "Uso: $0 <BASE_URL>"
  echo "Ex.: $0 https://telemedconsulta.onrender.com"
  echo "     $0 https://seu-projeto.replit.dev"
  exit 2
fi

BASE_URL="${BASE_URL%/}"

ok=0
fail=0

divider() { printf "\n=== %s ===\n" "$1"; }

curl_check () {
  local path="$1"
  local marker="${2:-}"
  local url="${BASE_URL}${path}"
  local tmp
  tmp="$(mktemp)"

  local status
  status="$(curl -L -s -o "$tmp" -w '%{http_code}' "$url" || true)"

  if [ "$status" = "200" ]; then
    if [ -n "$marker" ]; then
      if grep -qi -- "$marker" "$tmp"; then
        printf "✓ %s → 200 OK (marcador encontrado: %s)\n" "$path" "$marker"
        ok=$((ok+1))
      else
        printf "✗ %s → 200 OK, mas marcador NÃO encontrado: %s\n" "$path" "$marker"
        fail=$((fail+1))
      fi
    else
      printf "✓ %s → 200 OK\n" "$path"
      ok=$((ok+1))
    fi
  else
    printf "✗ %s → HTTP %s\n" "$path" "$status"
    fail=$((fail+1))
  fi

  rm -f "$tmp"
}

divider "Rotas principais"
curl_check "/dashboard/"              "Agenda do Dia"
curl_check "/consulta/"               "title.*Consulta"
curl_check "/centro-de-testes/"       "Centro de Testes"
curl_check "/meus-pacientes/"         "Meus Pacientes"
curl_check "/agenda/"                 "title.*Agenda"
curl_check "/medico/"                 "Perfil do Médico"
curl_check "/gestao-avancada/"        "Gestão Avançada"
curl_check "/sala-de-espera/"         "Sala de Espera"
curl_check "/dr-ai/"                  "Dr. AI"
curl_check "/como-funciona/"          "Como Funciona"
curl_check "/precos/"                 "Planos"

divider "Preview (opcional, se existir)"
curl_check "/preview/dashboard.html"           "Dashboard Médico"
curl_check "/preview/centro-de-testes.html"    "Centro de Testes"
curl_check "/preview/guia-orientacao.html"     "Guia"
curl_check "/preview/demo-responsivo.html"     "Demo Responsivo"

divider "Demo Responsivo (produção)"
curl_check "/demo-responsivo/index.html"       "Demo Responsivo"

divider "Assets importantes (se existirem)"
curl_check "/css/theme-telemed.css"            ""

divider "Resumo"
printf "OK: %d  |  Problemas: %d\n" "$ok" "$fail"

if [ "$fail" -gt 0 ]; then
  exit 1
fi
exit 0
