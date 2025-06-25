# Sistema de Telemedicina - Telemed Sistema

## Visão Geral
Sistema abrangente de telemedicina que oferece soluções digitais inovadoras para saúde, combinando tecnologias avançadas com design centrado no usuário para transformar consultas médicas e cuidados ao paciente.

## Tecnologias Principais
- **Frontend**: React.js com TypeScript, Vite, TailwindCSS
- **Backend**: Express.js com TypeScript
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Autenticação**: Replit Auth com OpenID Connect
- **Comunicação**: WebRTC para videoconsultas, WebSockets para tempo real
- **UI Components**: shadcn/ui com Radix UI

## Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Login/logout com Replit Auth
- Gerenciamento de sessões seguras
- Controle de acesso baseado em roles (médico/paciente)

### ✅ Dashboard Principal
- Interface responsiva para médicos e pacientes
- Estatísticas em tempo real
- Navegação intuitiva com sidebar

### ✅ Gerenciamento de Consultas
- Agendamento de consultas
- Visualização de agenda
- Status e histórico de consultas
- Sistema de leilão reverso para teleconsultas

### ✅ Sistema de Videoconsultas
- Videochamadas WebRTC peer-to-peer
- Chat em tempo real durante consultas
- Controles de áudio/vídeo
- Compartilhamento de tela
- Tratamento robusto de permissões de mídia

### ✅ Gerenciamento de Pacientes
- Cadastro completo de pacientes
- Histórico médico
- Informações de contato

### ✅ Sistema de Prescrições MEMED
- Interface integrada com MEMED
- Busca de medicamentos
- Templates de prescrição
- Prescrições digitais válidas

### ✅ Assistente IA
- Análise de sintomas
- Sugestões de diagnóstico
- Recomendações médicas
- Interface conversacional

### ✅ Sistema de Psiquiatria Especializado
- Avaliação psicológica pré-consulta com escalas PHQ-9 e GAD-7
- Questionário detalhado para consultas psiquiátricas
- Análise automática de nível de risco (baixo, moderado, alto, urgente)
- Recomendações personalizadas baseadas na avaliação
- Interface de preparação pré-consulta especializada

### ✅ Sistema de Notificações
- Notificações em tempo real via WebSocket
- Centro de notificações com interface moderna
- Diferentes tipos de notificação (consultas, mensagens, etc.)

### ✅ Sistema de Exames Clínicos
- Interface categorizada para solicitação de exames
- Exames de sangue, urina, imagem, cardiológicos e especializados
- Sistema de prioridades (rotina, urgente, emergência)
- Instruções de preparo automáticas para cada exame

### ✅ Sistema de Encaminhamentos Médicos
- Encaminhamento para todas as especialidades disponíveis
- Opção entre consulta presencial ou teleconsulta
- Resumo clínico e solicitação de exames
- Sistema de prioridades e notas complementares

### ✅ Sistema de Demonstração Médica
- Equipe fictícia com 20 médicos especialistas
- 50 pacientes com condições médicas variadas
- 100 consultas distribuídas entre especialidades
- Interface de gerenciamento para criar/limpar dados demo

### ✅ Relatórios e Analytics
- Dashboard de analytics avançado
- Métricas de desempenho
- Gráficos interativos
- Exportação de relatórios

## Arquitetura do Sistema

### Frontend (client/)
```
src/
├── components/
│   ├── layout/           # Layout principal, header, sidebar
│   ├── video/            # Componentes de videoconsulta
│   ├── prescriptions/    # Sistema MEMED
│   ├── notifications/    # Centro de notificações
│   ├── reports/          # Dashboard de analytics
│   └── ui/              # Componentes base (shadcn/ui)
├── pages/               # Páginas da aplicação
├── hooks/               # React hooks customizados
└── lib/                 # Utilitários e configurações
```

### Backend (server/)
```
├── db.ts               # Configuração do banco de dados
├── index.ts            # Servidor principal
├── routes.ts           # Rotas da API e WebSocket
├── storage.ts          # Interface de armazenamento
├── replitAuth.ts       # Autenticação Replit
└── vite.ts             # Configuração Vite
```

### Schema do Banco (shared/schema.ts)
- `users` - Usuários do sistema
- `patients` - Dados dos pacientes
- `doctors` - Dados dos médicos
- `appointments` - Consultas agendadas
- `medicalRecords` - Prontuários médicos
- `prescriptions` - Prescrições médicas
- `teleconsultResponses` - Respostas do leilão reverso

## Mudanças Recentes (Junho 2025)

### Landing Page Aprimorada com Diferenciais Competitivos
- **Data**: 25/06/2025
- **Implementação**: Nova landing page que destaca funcionalidades únicas do sistema
- **Melhorias**: 
  - Destaque do sistema de leilão reverso inteligente
  - Seção dedicada ao assistente IA médico
  - Evidência das prescrições MEMED integradas
  - Showcasing das videoconsultas WebRTC
  - Sistema especializado de psiquiatria em destaque
  - Grid das 10 especialidades médicas disponíveis
  - **Imagens profissionais** estilo PicDoc com médicos reais
  - **Cards visuais** com gradientes e fotos de tecnologia médica
  - **Depoimentos ilustrados** com avatars de pacientes
  - **Hero section** com imagem do médico e estatísticas flutuantes
  - **Integração funcional** com autenticação e rotas do sistema
  - **CTAs conectados** direcionando para páginas específicas
  - **Navegação inteligente** baseada no status de autenticação
- **UX/UI**: Design moderno com cards informativos e CTAs otimizados
- **Visual**: Imagens de alta qualidade da Unsplash focadas em telemedicina
- **Funcional**: Botões e links conectados às funcionalidades reais
- **Posicionamento**: Foca nos diferenciais tecnológicos únicos
- **Conversão**: CTAs direcionados para demo e teste do sistema

### Sistema de Demonstração Médica e Funcionalidades Clínicas
- **Data**: 25/06/2025
- **Implementação**: Sistema completo para demonstração com equipe médica fictícia
- **Funcionalidades**: 
  - Geração de 2 médicos por especialidade (20 médicos total)
  - 5 pacientes por médico com condições médicas variadas (50 pacientes)
  - Sistema de solicitação de exames clínicos com interface categorizada
  - Sistema de encaminhamentos para especialistas (presencial ou teleconsulta)
  - Página de gerenciamento de demonstração para médicos
- **Backend**: Novas tabelas clinical_exams e medical_referrals
- **Interface**: Modais especializados para seleção de exames e criação de encaminhamentos
- **Dashboard**: Integração das ações clínicas no dashboard principal dos médicos

### Sistema de Fluxo Flexível para Teleconsultas Psiquiátricas
- **Data**: 25/06/2025
- **Implementação**: Fluxo flexível onde psiquiatras podem escolher atendimento imediato ou com preparação
- **Funcionalidades**: 
  - Resposta a leilão reverso com preferência de workflow
  - Interface para psiquiatras escolherem entre imediato ou preparação
  - Sistema de antecipação automática baseado em risco (PHQ-9 e GAD-7)
  - Status de workflow em tempo real para pacientes e médicos
- **Backend**: Novas tabelas e APIs para gerenciar workflow de preparação
- **Interface**: Componentes especializados para gerenciamento de teleconsultas psiquiátricas

### Sistema de Videoconsultas WebRTC
- **Data**: 24/06/2025
- **Implementação**: Sistema completo de videoconsultas com WebRTC
- **Recursos**: Vídeo P2P, chat, compartilhamento de tela, controles A/V
- **Backend**: WebSocket handlers para sinalização WebRTC
- **Interface**: Componente VideoRoom com tratamento de permissões
- **Correções**: Resolvido problema de exibição de vídeo local com debug avançado

### Sistema de Prescrições MEMED
- **Data**: 23/06/2025  
- **Integração**: Interface completa com MEMED para prescrições digitais
- **Funcionalidades**: Busca de medicamentos, templates, prescrições válidas
- **Interface**: Componente tabbed com múltiplas funcionalidades

### Dashboard de Analytics
- **Data**: 23/06/2025
- **Implementação**: Sistema avançado de relatórios e métricas
- **Visualizações**: Gráficos interativos com Recharts
- **Dados**: Métricas de consultas, pacientes, receita, satisfação

### Sistema de Notificações
- **Data**: 23/06/2025
- **Recursos**: Centro de notificações em tempo real
- **Interface**: Popover moderno com diferentes tipos de notificação
- **Backend**: WebSocket para notificações instantâneas

### Sistema de Psiquiatria Especializado
- **Data**: 24/06/2025
- **Implementação**: Avaliação psicológica e questionário pré-consulta para psiquiatria
- **Funcionalidades**: Escalas PHQ-9 e GAD-7, análise de risco, recomendações automáticas
- **Interface**: Componentes especializados com progress tracking e validação
- **Backend**: Novas tabelas e APIs para armazenar avaliações e questionários

## Estado Atual do Projeto

### Funcionalidades Testadas
- ✅ Autenticação e autorização
- ✅ Dashboard e navegação
- ✅ Gerenciamento de consultas
- ✅ Sistema de pacientes
- ✅ Assistente IA funcional
- ✅ Videoconsultas WebRTC completas
- ✅ Prescrições MEMED
- ✅ Sistema de notificações
- ✅ Sistema de psiquiatria especializado com entrevista pré-consulta
- ✅ Avaliação psicológica PHQ-9 e GAD-7 operacional
- ✅ Questionário psiquiátrico 100% funcional (dropdowns, sliders e inputs corrigidos)
- ✅ Sistema de entrevista com psicóloga para avaliação psicodinâmica

### Próximas Melhorias
- Sistema de pagamentos integrado
- Integração com laboratórios
- Aplicativo móvel
- Telemedicina especializada
- Conformidade LGPD completa

## Configuração de Desenvolvimento

### Variáveis de Ambiente
```
DATABASE_URL=postgresql://...
SESSION_SECRET=...
REPL_ID=...
REPLIT_DOMAINS=...
```

### Scripts Disponíveis
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run db:push` - Aplica mudanças no schema do banco
- `npm run build` - Build para produção

## Conformidade e Segurança
- Autenticação segura com OpenID Connect
- Sessões com armazenamento seguro no PostgreSQL
- Dados médicos protegidos conforme LGPD
- Comunicação criptografada HTTPS/WSS
- Prescrições digitais válidas juridicamente

## Suporte e Manutenção
- Logs centralizados para debugging
- Monitoramento de performance
- Backup automático de dados
- Atualizações de segurança regulares