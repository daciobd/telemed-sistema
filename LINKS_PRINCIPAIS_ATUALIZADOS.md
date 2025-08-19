# 🎯 LINKS PRINCIPAIS - TeleMed Sistema Canônico

## ✅ AMBIENTE LOCAL (FUNCIONANDO)

### Links Principais Locais:
```
http://localhost:5000/agenda      → Agenda Médica (agenda-medica.html)
http://localhost:5000/consulta    → Sistema de Consulta (enhanced-teste.html)  
http://localhost:5000/dashboard   → Dashboard Médico (dashboard-teste.html)
```

**Status:** ✅ Todos funcionando perfeitamente (verificado com curl)

## 🌐 AMBIENTE EXTERNO/PRODUÇÃO

### Domínio Atual:
```
https://telemed-hibrido--5000.prod1.defang.dev/
```

**Status:** ⚠️ "Resource Not Found" - Pode estar com problemas de deploy

### Alternativas de Deploy:
1. **Replit Native:** Use o botão "Deploy" no Replit
2. **Render/Vercel:** Configure deploy automático via GitHub
3. **Manual:** Verifique configurações de porta e build

## 📋 ESTRUTURA CANÔNICA CONFIRMADA

| Rota        | Arquivo               | Função                    | Status |
|-------------|----------------------|---------------------------|---------|
| `/agenda`   | `agenda-medica.html` | Sistema de agendamento    | ✅ Ativo |
| `/consulta` | `enhanced-teste.html`| Interface de telemedicina | ✅ Ativo |
| `/dashboard`| `dashboard-teste.html`| Dashboard administrativo | ✅ Ativo |

## 🔄 REDIRECTS AUTOMÁTICOS

Todos os links antigos redirecionam automaticamente:
- `/enhanced*` → `/consulta`
- `/dashboard-teste*` → `/dashboard` 
- `/doctor-dashboard` → `/dashboard`

**Preservação:** Query strings mantidas em todos os redirects

## 🧪 VERIFICAÇÃO CONTÍNUA

Comandos disponíveis para validação:
```bash
npm run verify:routes        # Verifica todas as rotas
npm run test:canonical       # Teste completo das canônicas  
npm run canonical:hygiene    # Status geral do sistema
```

## 🚀 PRÓXIMOS PASSOS

1. **Deploy Externo:** Configure deploy via Replit Deploy ou plataforma externa
2. **Monitoramento:** Execute verificações regulares com os scripts criados
3. **Limpeza:** Considere mover arquivos legacy para pasta dedicada

**Última Verificação:** 19/08/2025 20:01 - Sistema local 100% funcional