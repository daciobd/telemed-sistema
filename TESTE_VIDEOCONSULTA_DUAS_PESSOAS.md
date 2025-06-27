# Guia para Teste de Videoconsulta com Duas Pessoas

## Sistema de Teste Implementado

O sistema de videoconsulta foi configurado para permitir testes realistas entre duas pessoas diferentes, simulando uma consulta médica real entre médico e paciente.

## Como Testar

### Passo 1: Acesso à Página de Teste
- **URL direta**: `/video-test`
- **Ou pela Landing Page**: Clique no botão verde "Testar Videoconsulta" na página inicial

### Passo 2: Configuração para Duas Pessoas

#### Pessoa 1 (Médico):
1. Acesse `/video-test` no primeiro dispositivo/navegador
2. Digite seu nome (ex: "Dr. João Silva")
3. Selecione "Médico" no dropdown
4. Certifique-se que o ID da consulta seja o mesmo para ambos (padrão: 999)
5. Clique em "Entrar na Videoconsulta"

#### Pessoa 2 (Paciente):
1. Acesse `/video-test` no segundo dispositivo/navegador (pode ser outra aba, outro computador, ou celular)
2. Digite seu nome (ex: "Maria Santos")
3. Selecione "Paciente" no dropdown
4. **IMPORTANTE**: Use o mesmo ID da consulta (999)
5. Clique em "Entrar na Videoconsulta"

### Passo 3: Permissões de Mídia
- Quando solicitado, permita acesso à câmera e microfone em ambos os dispositivos
- O sistema detectará automaticamente os dispositivos de áudio/vídeo

### Passo 4: Conexão WebRTC
- As duas pessoas serão conectadas automaticamente via WebRTC
- Cada pessoa verá:
  - Seu próprio vídeo no canto (menor)
  - O vídeo da outra pessoa (tela principal)
  - Chat em tempo real
  - Controles de áudio/vídeo

## Funcionalidades Disponíveis no Teste

### Controles de Vídeo
- Ligar/desligar câmera
- Ligar/desligar microfone  
- Compartilhamento de tela
- Encerrar chamada

### Chat em Tempo Real
- Mensagens instantâneas entre as duas pessoas
- Histórico da conversa
- Identificação do remetente

### Prontuário Eletrônico (apenas para médico)
- Acesso aos dados do paciente
- Preenchimento de informações da consulta

### Prescrições MEMED (apenas para médico)
- Sistema integrado de prescrições
- Dados do paciente pré-preenchidos

## Dicas para Teste Eficaz

### Configuração Recomendada
- Use dois dispositivos diferentes (computador + celular, ou dois computadores)
- Certifique-se de ter boa conexão de internet em ambos
- Use headphones para evitar eco de áudio
- Teste em ambiente com boa iluminação

### IDs de Consulta Personalizados
- Para testes isolados, altere o ID da consulta para um número único
- Ambas as pessoas devem usar o mesmo ID
- Exemplos: 1001, 2025, etc.

### Resolução de Problemas
- Se não conseguir ver o vídeo da outra pessoa, verifique as permissões de mídia
- Se o áudio não funcionar, verifique se o microfone não está bloqueado
- Para reiniciar, saia da chamada e entre novamente

## Cenários de Teste Sugeridos

### Teste Básico (5 minutos)
1. Conexão e verificação de áudio/vídeo
2. Envio de mensagens no chat
3. Teste dos controles (mute/unmute, câmera on/off)

### Teste Médico Completo (15 minutos)
1. Simulação de anamnese através do chat
2. Médico preenche prontuário durante a consulta
3. Uso da prescrição MEMED
4. Compartilhamento de tela para explicar exames

### Teste de Resistência (30 minutos)
1. Chamada prolongada para testar estabilidade
2. Múltiplas mudanças de configuração (câmera, mic)
3. Teste de reconexão (fechar/abrir navegador)

## Tecnologias Utilizadas

- **WebRTC**: Comunicação peer-to-peer para vídeo/áudio
- **WebSocket**: Sinalização e chat em tempo real
- **MediaDevices API**: Acesso à câmera e microfone
- **Screen Capture API**: Compartilhamento de tela

## Segurança e Privacidade

- As videochamadas são peer-to-peer (diretas entre os dispositivos)
- Nenhum vídeo é armazenado no servidor
- Chat é temporário e não persistido
- Dados de teste são isolados do sistema principal

## Saída do Teste

Para sair do teste:
- Clique no botão "Encerrar Chamada" (vermelho)
- Ou feche a aba do navegador
- Retornará automaticamente à página de configuração de teste

## URLs Importantes

- **Página de teste**: `/video-test`
- **Landing page**: `/` (botão "Testar Videoconsulta")
- **Sistema principal**: `/dashboard` (após login)

---

**Última atualização**: 27 de junho de 2025
**Status**: Sistema totalmente funcional e testado