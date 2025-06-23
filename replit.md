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

### ✅ Sistema de Notificações
- Notificações em tempo real via WebSocket
- Centro de notificações com interface moderna
- Diferentes tipos de notificação (consultas, mensagens, etc.)

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

### Sistema de Videoconsultas WebRTC
- **Data**: 23/06/2025
- **Implementação**: Sistema completo de videoconsultas com WebRTC
- **Recursos**: Vídeo P2P, chat, compartilhamento de tela, controles A/V
- **Backend**: WebSocket handlers para sinalização WebRTC
- **Interface**: Componente VideoRoom com tratamento de permissões

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

## Estado Atual do Projeto

### Funcionalidades Testadas
- ✅ Autenticação e autorização
- ✅ Dashboard e navegação
- ✅ Gerenciamento de consultas
- ✅ Sistema de pacientes
- ✅ Assistente IA funcional
- 🔄 Videoconsultas (necessita permissões de câmera)
- ✅ Prescrições MEMED
- ✅ Sistema de notificações

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