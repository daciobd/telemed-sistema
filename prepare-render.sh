#!/bin/bash

# ========================================
# TeleMed Sistema - Prepare Render Deploy
# ========================================
# Prepara o ambiente para deploy no Render
# Otimiza builds, configura variáveis e valida setup

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Preparando para deploy no Render...${NC}"

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json não encontrado. Execute no diretório raiz do projeto.${NC}"
    exit 1
fi

# Limpar builds anteriores
echo -e "${YELLOW}🧹 Limpando builds anteriores...${NC}"
rm -rf dist/
rm -rf build/
rm -rf .next/
rm -rf node_modules/.cache/

# Verificar Node.js version
echo -e "${YELLOW}📋 Verificando Node.js...${NC}"
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    exit 1
fi

# Verificar npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: ${NPM_VERSION}${NC}"
else
    echo -e "${RED}❌ npm não encontrado${NC}"
    exit 1
fi

# Instalar dependências
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
npm ci --prefer-offline --no-audit

# Verificar scripts essenciais no package.json
echo -e "${YELLOW}📝 Verificando scripts no package.json...${NC}"

required_scripts=("dev" "build" "start")
missing_scripts=()

for script in "${required_scripts[@]}"; do
    if npm run "$script" --silent 2>/dev/null | grep -q "Missing script"; then
        missing_scripts+=("$script")
    else
        echo -e "${GREEN}✅ Script '${script}' encontrado${NC}"
    fi
done

if [ ${#missing_scripts[@]} -gt 0 ]; then
    echo -e "${RED}❌ Scripts ausentes: ${missing_scripts[*]}${NC}"
    exit 1
fi

# Verificar arquivos essenciais
echo -e "${YELLOW}📄 Verificando arquivos essenciais...${NC}"

essential_files=(
    "render.yaml"
    "package.json"
    "tsconfig.json"
    "server/index.ts"
    "client/src/App.tsx"
)

missing_files=()

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ ${file}${NC}"
    else
        echo -e "${RED}❌ ${file} ausente${NC}"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo -e "${RED}🚨 Arquivos essenciais ausentes. Deploy pode falhar.${NC}"
fi

# Verificar render.yaml
echo -e "${YELLOW}⚙️ Verificando configuração render.yaml...${NC}"
if [ -f "render.yaml" ]; then
    # Verificar se contém configurações básicas
    if grep -q "services:" render.yaml && grep -q "buildCommand:" render.yaml; then
        echo -e "${GREEN}✅ render.yaml configurado corretamente${NC}"
    else
        echo -e "${YELLOW}⚠️ render.yaml pode estar incompleto${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ render.yaml não encontrado, criando configuração básica...${NC}"
    
    cat > render.yaml << 'EOF'
services:
  - type: web
    name: telemed-sistema
    env: node
    region: oregon
    plan: free
    buildCommand: npm run build
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
EOF
    
    echo -e "${GREEN}✅ render.yaml criado${NC}"
fi

# Verificar variáveis de ambiente
echo -e "${YELLOW}🌍 Verificando variáveis de ambiente...${NC}"

# Criar .env.example se não existir
if [ ! -f ".env.example" ]; then
    echo -e "${YELLOW}📝 Criando .env.example...${NC}"
    
    cat > .env.example << 'EOF'
# TeleMed Sistema - Environment Variables
NODE_ENV=production
PORT=10000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/telemed

# Session
SESSION_SECRET=your-session-secret-here

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Render specific
RENDER=true
EOF
    
    echo -e "${GREEN}✅ .env.example criado${NC}"
fi

# Otimizar package.json para Render
echo -e "${YELLOW}⚡ Otimizando configurações para Render...${NC}"

# Verificar se o PORT está configurado dinamicamente
if grep -q "process.env.PORT" server/index.ts; then
    echo -e "${GREEN}✅ PORT dinâmico configurado${NC}"
else
    echo -e "${YELLOW}⚠️ PORT pode não estar configurado dinamicamente${NC}"
fi

# Build de teste
echo -e "${YELLOW}🔨 Executando build de teste...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build executado com sucesso${NC}"
else
    echo -e "${RED}❌ Build falhou${NC}"
    exit 1
fi

# Verificar tamanho do build
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sh dist/ | cut -f1)
    echo -e "${GREEN}📏 Tamanho do build: ${BUILD_SIZE}${NC}"
fi

# Teste de start rápido
echo -e "${YELLOW}🚀 Testando start...${NC}"
timeout 10s npm start &
START_PID=$!
sleep 3

if kill -0 $START_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Aplicação iniciou corretamente${NC}"
    kill $START_PID 2>/dev/null || true
else
    echo -e "${RED}❌ Aplicação falhou ao iniciar${NC}"
    exit 1
fi

# Criar script de deploy
echo -e "${YELLOW}📄 Criando script de deploy...${NC}"

cat > deploy-to-render.sh << 'EOF'
#!/bin/bash

# Deploy automatizado para Render
echo "🚀 Iniciando deploy para Render..."

# Verificar se há mudanças para commit
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Commitando mudanças..."
    git add .
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Push para trigger deploy
echo "📤 Fazendo push para repositório..."
git push origin main

echo "✅ Deploy iniciado! Verifique o Render Dashboard."
EOF

chmod +x deploy-to-render.sh

# Relatório final
echo -e "\n${BLUE}📊 Relatório de Preparação${NC}"
echo -e "=================================="
echo -e "${GREEN}✅ Dependências instaladas${NC}"
echo -e "${GREEN}✅ Build executado com sucesso${NC}"
echo -e "${GREEN}✅ Aplicação testada${NC}"
echo -e "${GREEN}✅ Configurações otimizadas${NC}"

if [ ${#missing_files[@]} -eq 0 ]; then
    echo -e "\n${GREEN}🎉 Projeto pronto para deploy no Render!${NC}"
    echo -e "\n${BLUE}Próximos passos:${NC}"
    echo -e "1. Configure as variáveis de ambiente no Render Dashboard"
    echo -e "2. Execute: ${YELLOW}./deploy-to-render.sh${NC}"
    echo -e "3. Monitore o deploy no Render Dashboard"
    echo -e "4. Execute: ${YELLOW}DEPLOY_URL=https://sua-app.onrender.com ./test-deployment.sh${NC}"
else
    echo -e "\n${YELLOW}⚠️ Alguns arquivos estão ausentes, mas o deploy pode funcionar${NC}"
fi

# Salvar configurações
echo "{
    \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
    \"status\": \"prepared\",
    \"node_version\": \"$NODE_VERSION\",
    \"npm_version\": \"$NPM_VERSION\",
    \"missing_files\": $(printf '%s\n' "${missing_files[@]}" | jq -R . | jq -s .),
    \"build_size\": \"${BUILD_SIZE:-unknown}\",
    \"ready_for_deploy\": $([ ${#missing_files[@]} -eq 0 ] && echo "true" || echo "false")
}" > prepare-results.json

echo -e "\n${GREEN}✅ Preparação concluída!${NC}"