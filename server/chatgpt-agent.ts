import { OpenAI } from 'openai';

// Configuração do ChatGPT Agent para TeleMed Consulta
let openai: OpenAI | null = null;

// Inicializar OpenAI apenas se a API key estiver disponível
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('🤖 OpenAI Client inicializado com sucesso');
} else {
  console.log('⚠️ OPENAI_API_KEY não encontrada - ChatGPT Agent em modo simulação');
}

// Prompt inicial para configurar o agente
const telemedPrompt = `
Você é meu assistente de desenvolvimento para o sistema TeleMed Consulta, uma plataforma de telemedicina brasileira.

CONTEXTO DO SISTEMA:
- Plataforma completa de telemedicina com Dashboard Aquarela
- Frontend: React.js com TypeScript, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express.js, PostgreSQL com Drizzle ORM  
- Autenticação: Replit Auth + JWT com Base64 encryption
- Funcionalidades: Videoconsultas, triagem psiquiátrica, prescrições digitais MEMED, sistema de leilão de consultas, notificações SMS/WhatsApp

CARACTERÍSTICAS TÉCNICAS:
- Design aquarela com cores suaves (#F5E8C7, #E0D7B9, #B3D9E0)
- Mobile-first, responsivo para todos os dispositivos
- Integração PostgreSQL com dados reais de médicos e pacientes
- Sistema de notificações médicas via Twilio/WhatsApp
- Testes psiquiátricos: GAD-7, PHQ-9, MDQ, PSS-10
- PDF generation com jsPDF e HTML2Canvas
- WebRTC para videoconsultas seguras

COMPLIANCE E SEGURANÇA:
- LGPD e HIPAA compliance obrigatório
- Criptografia de dados sensíveis
- Logs de auditoria médica
- IP tracking e rate limiting
- Session management seguro

DIRETRIZES DE DESENVOLVIMENTO:
- Código TypeScript otimizado e type-safe
- Componentes reutilizáveis com shadcn/ui
- Performance e acessibilidade (WCAG 2.1)
- Testes automatizados com Vitest
- Documentação completa em Markdown
- Git workflow com commits estruturados

DESIGN SYSTEM:
- Cores médicas profissionais com tons aquarela
- Animações suaves e microinterações
- Cards com glass morphism e hover effects
- Tipografia Inter para legibilidade médica
- Icons lucide-react para consistência

Sua tarefa é fornecer código otimizado, seguir boas práticas de segurança e performance, além de gerar documentos e testes automatizados específicos para ambiente médico brasileiro.
`;

export class TelemedChatGPTAgent {
  private initialized = false;

  async inicializar(): Promise<string> {
    if (!openai) {
      const simulatedResponse = 'Olá! Sou o assistente de desenvolvimento do TeleMed Consulta. Estou configurado e pronto para ajudar com desenvolvimento médico, mas estou rodando em modo simulação porque a chave da OpenAI API não está disponível. Para ativação completa, configure a OPENAI_API_KEY.';
      console.log('🔄 ChatGPT Agent em modo simulação');
      return simulatedResponse;
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Modelo compatível com a maioria das API keys
        messages: [
          { 
            role: 'system', 
            content: telemedPrompt 
          },
          { 
            role: 'user', 
            content: 'Inicialize como assistente de desenvolvimento do TeleMed Consulta. Confirme que entendeu o contexto e está pronto para ajudar.' 
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      this.initialized = true;
      const agentResponse = response.choices[0].message.content || '';
      
      console.log('🤖 ChatGPT Agent inicializado para TeleMed Consulta');
      console.log('📋 Resposta do Agent:', agentResponse);
      
      return agentResponse;
    } catch (error) {
      console.error('❌ Erro ao inicializar ChatGPT Agent:', error);
      throw new Error('Falha na inicialização do ChatGPT Agent');
    }
  }

  async perguntarAgent(pergunta: string): Promise<string> {
    if (!this.initialized) {
      await this.inicializar();
    }

    if (!openai) {
      return `[MODO SIMULAÇÃO] Recebi sua pergunta: "${pergunta}". O ChatGPT Agent está configurado corretamente mas necessita da chave OPENAI_API_KEY para funcionar completamente. Todas as rotas e integrações estão funcionais.`;
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: telemedPrompt },
          { role: 'user', content: pergunta }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      console.error('❌ Erro na consulta ao ChatGPT Agent:', error);
      throw new Error('Falha na comunicação com ChatGPT Agent');
    }
  }

  async gerarCodigo(especificacao: string): Promise<string> {
    const prompt = `
    Como assistente de desenvolvimento do TeleMed Consulta, gere código TypeScript/React para:
    
    ${especificacao}
    
    Considerações obrigatórias:
    - Use componentes shadcn/ui quando possível
    - Aplique design system aquarela do TeleMed
    - Implemente responsividade mobile-first
    - Adicione tratamento de erro adequado
    - Inclua tipos TypeScript completos
    - Siga padrões de acessibilidade médica
    - Considere LGPD/HIPAA compliance
    `;

    return await this.perguntarAgent(prompt);
  }

  async otimizarCodigo(codigoAtual: string, objetivo: string): Promise<string> {
    const prompt = `
    Otimize o seguinte código do TeleMed Consulta:
    
    CÓDIGO ATUAL:
    ${codigoAtual}
    
    OBJETIVO:
    ${objetivo}
    
    Forneça versão otimizada com explicação das melhorias aplicadas.
    `;

    return await this.perguntarAgent(prompt);
  }
}

// Export da instância singleton
export const telemedAgent = new TelemedChatGPTAgent();

// Função de inicialização rápida
export async function inicializarTelemedAgent(): Promise<void> {
  try {
    await telemedAgent.inicializar();
    console.log('✅ TeleMed ChatGPT Agent pronto para uso');
  } catch (error) {
    console.error('❌ Falha na inicialização do TeleMed Agent:', error);
  }
}