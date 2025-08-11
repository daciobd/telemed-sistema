# Como Ver o Preview do Clone

## Situação Atual

**Projeto Principal (Porto 5000):**
- Sistema completo funcionando
- URL: `https://seu-replit.replit.app` (preview padrão)

**Projeto Clone (Porto 4174):**
- Sistema simplificado na pasta `telemed-clone/`
- Precisa ser executado manualmente

## Opções para Ver o Clone:

### **Opção 1: Novo Projeto Replit (Recomendado)**

1. **Acesse replit.com**
2. **Create App → React JavaScript**
3. **Nome:** "sistema-telemedicina-v2"
4. **Copie os arquivos** de `telemed-clone/` para o novo projeto
5. **Execute:** `npm install && npm run dev`

### **Opção 2: Executar Localmente no Terminal**

1. **Abra novo terminal no Replit**
2. **Digite:**
   ```bash
   cd telemed-clone
   npx vite --port 4174 --host 0.0.0.0
   ```
3. **Acesse:** `https://seu-replit.replit.app:4174`

### **Opção 3: Usar em Desenvolvimento Local**

1. **Clone o repositório**
2. **Navegue para:** `telemed-clone/`
3. **Execute:** `npm install && npm run dev`
4. **Acesse:** `http://localhost:4174`

## Diferenças Entre os Projetos:

### **Sistema Principal (Atual)**
- ✅ Banco PostgreSQL
- ✅ AI Agent completo
- ✅ Sistema de alertas Slack
- ✅ Autenticação robusta
- ✅ Dashboard aquarela premium
- ✅ Sistema de download
- ✅ Múltiplas páginas médicas

### **Clone Simplificado**
- ✅ Interface de consulta em tempo real
- ✅ Formulário médico inteligente
- ✅ Timer automático
- ✅ Validação em tempo real
- ✅ Design limpo e responsivo
- ❌ Sem banco de dados
- ❌ Sem AI Agent
- ❌ Sem sistema de alertas

## Arquivo principal: telemed-clone/src/App.jsx

```javascript
// Sistema de consulta em tempo real
// Timer automático
// Formulário inteligente com validação
// Interface médica profissional
```

## Para Testar o Clone:

1. **Funcionalidades básicas:**
   - Timer funcionando
   - Status da consulta (waiting → active → ended)
   - Formulário com 4 campos obrigatórios

2. **Validação inteligente:**
   - Alertas visuais para campos vazios
   - Botão que só ativa quando completo
   - Contagem de campos faltantes

3. **Interface profissional:**
   - Header com info do paciente
   - Área de vídeo simulada
   - Painel lateral para registro médico

---

## Próximos Passos Recomendados:

Se você quiser continuar com o clone:

1. **Crie novo projeto no Replit**
2. **Use os arquivos da pasta telemed-clone/**
3. **Desenvolva funcionalidades específicas**
4. **Mantenha o projeto principal intacto**

O clone está pronto e funcionando. A questão é apenas como executá-lo em paralelo ao sistema principal.