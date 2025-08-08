import { OpenAI } from 'openai';
import { aiUsageTracker } from './utils/aiUsage';
import { webhookManager } from './utils/webhook';

// Configuração do ChatGPT Agent para TeleMed Consulta
let openai: OpenAI | null = null;

// Configuração de modelos e retry
const PRIMARY_MODEL = process.env.OPENAI_MODEL_PRIMARY || 'gpt-4o';
const FALLBACK_MODEL = process.env.OPENAI_MODEL_FALLBACK || 'gpt-4o-mini';
const MAX_RETRIES = parseInt(process.env.OPENAI_BACKOFF_MAX_RETRIES || '5');

// Função de delay exponencial
const exponentialDelay = (attempt: number): number => {
  return Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30 segundos
};

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

// Wrapper de resiliência para chamadas OpenAI
async function callOpenAIWithResilience(
  messages: any[],
  model: string = PRIMARY_MODEL,
  attempt: number = 0,
  useFallback: boolean = false
): Promise<string> {
  const currentModel = useFallback ? FALLBACK_MODEL : model;
  
  try {
    // Track da tentativa
    await aiUsageTracker.trackRequest(currentModel);
    
    console.log(`🤖 OpenAI Request: ${currentModel} (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
    
    if (!openai) {
      throw new Error('OpenAI client não inicializado');
    }
    
    const completion = await openai.chat.completions.create({
      model: currentModel,
      messages,
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia da OpenAI');
    }

    // Track sucesso
    await aiUsageTracker.trackSuccess();
    
    // Se usou fallback, alerta
    if (useFallback) {
      await aiUsageTracker.trackFallback();
      await webhookManager.alertFallbackActivated({
        model: currentModel,
        attempt,
        originalModel: model
      });
    }

    console.log(`✅ OpenAI Success: ${currentModel} (${content.length} chars)`);
    return content;

  } catch (error: any) {
    console.error(`❌ OpenAI Error (${currentModel}, attempt ${attempt + 1}):`, {
      status: error?.response?.status || error?.status,
      code: error?.code,
      type: error?.type,
      message: error?.message
    });

    // Track erro
    await aiUsageTracker.trackError(error?.code || 'unknown', error?.message);

    // Classificar erro e decidir estratégia
    const errorCode = error?.code;
    const statusCode = error?.response?.status || error?.status;

    // Erros críticos que não devem fazer retry
    if (errorCode === 'insufficient_quota') {
      await webhookManager.alertQuotaExceeded({ error: error?.message, model: currentModel });
      throw error;
    }
    
    if (errorCode === 'billing_hard_limit_reached') {
      await webhookManager.alertBillingLimit({ error: error?.message, model: currentModel });
      throw error;
    }

    if (statusCode === 401) {
      await webhookManager.alertAPIError({ error: 'Invalid API Key', model: currentModel });
      throw error;
    }

    // Rate limits e erros temporários - tentar fallback ou retry
    if (errorCode === 'rate_limit_exceeded' || statusCode === 429) {
      await webhookManager.alertRateLimit({ error: error?.message, model: currentModel, attempt });
    }

    // Tentar fallback se não está usando ainda
    if (!useFallback && (errorCode === 'rate_limit_exceeded' || statusCode === 429 || statusCode >= 500)) {
      console.log(`🔄 Tentando modelo fallback: ${FALLBACK_MODEL}`);
      return callOpenAIWithResilience(messages, model, attempt, true);
    }

    // Retry com backoff se ainda há tentativas
    if (attempt < MAX_RETRIES) {
      await aiUsageTracker.trackRetry();
      const delay = exponentialDelay(attempt);
      console.log(`⏳ Retry em ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return callOpenAIWithResilience(messages, model, attempt + 1, useFallback);
    }

    // Esgotou tentativas
    console.error(`💥 Todas as tentativas falharam para ${currentModel}`);
    throw error;
  }
}

export class TelemedChatGPTAgent {
  private initialized = false;

  async inicializar(): Promise<string> {
    if (!openai) {
      const simulatedResponse = JSON.stringify({
        agent: "telemed-chatgpt",
        mode: "simulation",
        message: 'Olá! Sou o assistente de desenvolvimento do TeleMed Consulta. Estou configurado e pronto para ajudar com desenvolvimento médico, mas estou rodando em modo simulação porque a chave da OpenAI API não está disponível. Para ativação completa, configure a OPENAI_API_KEY.',
        timestamp: new Date().toISOString()
      });
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
      
      const formattedResponse = JSON.stringify({
        agent: "telemed-chatgpt",
        mode: "production",
        message: agentResponse,
        timestamp: new Date().toISOString()
      });
      
      console.log('🤖 ChatGPT Agent inicializado para TeleMed Consulta');
      console.log('📋 Resposta do Agent:', agentResponse);
      
      return formattedResponse;
    } catch (error: any) {
      console.error("OPENAI_ERROR - INITIALIZATION", {
        status: error?.response?.status || error?.status,
        data: error?.response?.data || error?.error,
        code: error?.code,
        type: error?.type,
        message: error?.message
      });

      // Log específico para diferentes tipos de erro OpenAI
      if (error?.code === 'insufficient_quota') {
        console.error('🚫 QUOTA EXCEDIDA: Limite de uso da OpenAI atingido');
      } else if (error?.code === 'billing_hard_limit_reached') {
        console.error('💳 LIMITE DE BILLING: Limite de cobrança atingido');
      } else if (error?.code === 'rate_limit_exceeded') {
        console.error('⏱️ RATE LIMIT: Muitas requisições simultâneas');
      } else if (error?.status === 401) {
        console.error('🔑 API KEY INVÁLIDA: Verifique OPENAI_API_KEY');
      }

      throw new Error('Falha na inicialização do ChatGPT Agent');
    }
  }

  async perguntarAgent(pergunta: string): Promise<string> {
    if (!this.initialized) {
      await this.inicializar();
    }

    if (!openai) {
      return JSON.stringify({
        agent: "telemed-chatgpt",
        mode: "simulation",
        question: pergunta,
        message: `[MODO SIMULAÇÃO] Recebi sua pergunta: "${pergunta}". O ChatGPT Agent está configurado corretamente mas necessita da chave OPENAI_API_KEY para funcionar completamente. Todas as rotas e integrações estão funcionais.`,
        timestamp: new Date().toISOString()
      });
    }

    try {
      const messages = [
        { role: 'system', content: telemedPrompt },
        { role: 'user', content: pergunta }
      ];

      const content = await callOpenAIWithResilience(messages, PRIMARY_MODEL);
      return JSON.stringify({
        agent: "telemed-chatgpt",
        mode: "production", 
        question: pergunta,
        message: content,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("OPENAI_ERROR - QUERY", {
        status: error?.response?.status || error?.status,
        data: error?.response?.data || error?.error,
        code: error?.code,
        type: error?.type,
        message: error?.message,
        question: pergunta
      });

      // Log específico para diferentes tipos de erro OpenAI
      if (error?.code === 'insufficient_quota') {
        console.error('🚫 QUOTA EXCEDIDA: Limite de uso da OpenAI atingido');
      } else if (error?.code === 'billing_hard_limit_reached') {
        console.error('💳 LIMITE DE BILLING: Limite de cobrança atingido');
      } else if (error?.code === 'rate_limit_exceeded') {
        console.error('⏱️ RATE LIMIT: Muitas requisições simultâneas');
      } else if (error?.status === 401) {
        console.error('🔑 API KEY INVÁLIDA: Verifique OPENAI_API_KEY');
      } else if (error?.status === 429) {
        console.error('⚠️ RATE LIMIT 429: Limite de requisições por minuto excedido');
      }

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

// Export do método perguntarAgent para uso direto
export const perguntarAgent = async (pergunta: string): Promise<string> => {
  return await telemedAgent.perguntarAgent(pergunta);
};

// Export do wrapper de resiliência para uso avançado
export { callOpenAIWithResilience };

// Função de inicialização rápida
export async function inicializarTelemedAgent(): Promise<void> {
  try {
    await telemedAgent.inicializar();
    console.log('✅ TeleMed ChatGPT Agent pronto para uso');
  } catch (error) {
    console.error('❌ Falha na inicialização do TeleMed Agent:', error);
  }
}