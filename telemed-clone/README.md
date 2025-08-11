# Sistema de Telemedicina V2 - Clone Inteligente

## Sobre o Projeto
Sistema simplificado de telemedicina baseado no roteiro detalhado fornecido. Implementa uma interface de consulta em tempo real com formulário inteligente para registro médico.

## Funcionalidades Implementadas

### ✅ FASE 1: Base Sólida
- Interface de consulta com informações do paciente
- Timer em tempo real do atendimento
- Status da consulta (waiting/active/ended)
- Área de vídeo simulada
- Design responsivo e profissional

### ✅ FASE 2: Formulário Inteligente
- Painel lateral com formulário médico
- Campos obrigatórios validados em tempo real:
  - Queixa Principal
  - História da Doença Atual
  - Hipótese Diagnóstica
  - Conduta/Indicações
- Validação visual com feedback imediato
- Botão inteligente que só ativa quando todos os campos estão preenchidos

## Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Fazer build para produção:**
   ```bash
   npm run build
   ```

## Estrutura do Projeto

```
telemed-clone/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos CSS
│   └── main.jsx         # Ponto de entrada
├── index.html           # Template HTML
├── package.json         # Dependências
├── vite.config.js       # Configuração Vite
└── README.md           # Documentação
```

## Paciente de Exemplo

**Nome:** Claudio Felipe Montanha Correa  
**Idade:** 36 anos  
**Telefone:** (11) 99945-1628

## Próximas Fases (Roadmap)

- [ ] Integração com WebRTC para vídeo real
- [ ] Sistema de prescrições digitais
- [ ] Exportação de relatórios em PDF
- [ ] Banco de dados para persistência
- [ ] Sistema de notificações
- [ ] Dashboard médico completo

## Tecnologias Utilizadas

- **React 18** - Interface de usuário
- **Vite** - Build tool e dev server
- **CSS Vanilla** - Estilização (sem dependências extras)
- **JavaScript ES6+** - Lógica da aplicação

## Características Especiais

- **Validação em Tempo Real:** Campos obrigatórios são validados instantaneamente
- **Interface Intuitiva:** Design limpo focado na experiência médica
- **Timer Automático:** Cronometragem automática da consulta
- **Status Visual:** Indicadores visuais do estado da consulta
- **Formulário Inteligente:** Botão só ativa quando tudo está preenchido

---

Desenvolvido seguindo o roteiro detalhado para clone inteligente do sistema TeleMed.