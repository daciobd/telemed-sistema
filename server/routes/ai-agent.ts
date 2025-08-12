import express from 'express';
import { telemedAgent } from '../chatgpt-agent.js';
import { agentLogger, validateAgentInProduction, writeLockCheck } from '../middleware/agent-logger.js';
import { requireAiEnabled } from '../guards/ai.js';

const router = express.Router();

// 🔒 PATCH 2: Aplica a flag dentro do próprio router (garante ordem correta)
router.use(requireAiEnabled());

// Aplicar middlewares de logging e validação
router.use(agentLogger);
router.use(validateAgentInProduction);
router.use(writeLockCheck);

// Rota para inicializar o ChatGPT Agent
router.post('/initialize', async (req, res) => {
  try {
    const response = await telemedAgent.inicializar();
    res.json({
      success: true,
      message: 'ChatGPT Agent inicializado com sucesso',
      agentResponse: response,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("OPENAI_ERROR - ROUTE /initialize", {
      status: error?.response?.status || error?.status,
      data: error?.response?.data || error?.error,
      code: error?.code,
      type: error?.type,
      message: error?.message
    });

    let errorMessage = 'Falha na inicialização do ChatGPT Agent';
    let errorCode = 'INITIALIZATION_ERROR';

    if (error?.code === 'insufficient_quota') {
      errorMessage = 'Quota da OpenAI excedida durante inicialização.';
      errorCode = 'QUOTA_EXCEEDED';
    } else if (error?.status === 401) {
      errorMessage = 'API Key da OpenAI inválida. Configure OPENAI_API_KEY.';
      errorCode = 'INVALID_API_KEY';
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      errorCode,
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    });
  }
});

// Rota para fazer perguntas ao agent
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Pergunta é obrigatória'
      });
    }

    const response = await telemedAgent.perguntarAgent(question);
    
    res.json({
      success: true,
      question,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("OPENAI_ERROR - ROUTE /ask", {
      status: error?.response?.status || error?.status,
      data: error?.response?.data || error?.error,
      code: error?.code,
      type: error?.type,
      message: error?.message
    });

    let errorMessage = 'Erro na consulta ao ChatGPT Agent';
    let errorCode = 'UNKNOWN_ERROR';

    // Classificar o tipo de erro para resposta adequada
    if (error?.code === 'insufficient_quota') {
      errorMessage = 'Quota da OpenAI excedida. Verifique seu plano de billing.';
      errorCode = 'QUOTA_EXCEEDED';
    } else if (error?.code === 'billing_hard_limit_reached') {
      errorMessage = 'Limite de cobrança atingido. Configure um limite maior.';
      errorCode = 'BILLING_LIMIT';
    } else if (error?.code === 'rate_limit_exceeded' || error?.status === 429) {
      errorMessage = 'Limite de requisições excedido. Tente novamente em alguns minutos.';
      errorCode = 'RATE_LIMIT';
    } else if (error?.status === 401) {
      errorMessage = 'API Key da OpenAI inválida ou não configurada.';
      errorCode = 'INVALID_API_KEY';
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      errorCode,
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    });
  }
});

// Rota para gerar código via agent
router.post('/generate-code', async (req, res) => {
  try {
    const { specification } = req.body;
    
    if (!specification) {
      return res.status(400).json({
        success: false,
        error: 'Especificação é obrigatória'
      });
    }

    const code = await telemedAgent.gerarCodigo(specification);
    
    res.json({
      success: true,
      specification,
      generatedCode: code,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro na geração de código',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Rota para otimizar código existente
router.post('/optimize-code', async (req, res) => {
  try {
    const { currentCode, objective } = req.body;
    
    if (!currentCode || !objective) {
      return res.status(400).json({
        success: false,
        error: 'Código atual e objetivo são obrigatórios'
      });
    }

    const optimizedCode = await telemedAgent.otimizarCodigo(currentCode, objective);
    
    res.json({
      success: true,
      currentCode,
      objective,
      optimizedCode,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro na otimização de código',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Rota de status do agent
router.get('/status', (req, res) => {
  const apiKeyConfigured = !!process.env.OPENAI_API_KEY;
  res.json({
    service: 'TeleMed ChatGPT Agent',
    status: apiKeyConfigured ? 'online' : 'simulation_mode',
    apiKeyConfigured,
    mode: apiKeyConfigured ? 'production' : 'simulation',
    message: apiKeyConfigured ? 'Agent fully operational' : 'Agent configured but running in simulation mode - configure OPENAI_API_KEY for full functionality',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/ai-agent/initialize',
      '/api/ai-agent/ask',
      '/api/ai-agent/generate-code',
      '/api/ai-agent/optimize-code',
      '/api/ai-agent/status',
      '/api/ai-agent/whoami'
    ]
  });
});

// Endpoint whoami
router.get('/whoami', (req, res) => {
  res.json({
    agent: "telemed-chatgpt",
    version: "5.12.1", 
    uptime: process.uptime(),
    pid: process.pid,
    mode: process.env.OPENAI_API_KEY ? 'production' : 'simulation',
    specialization: "Telemedicine Development - Brazil",
    capabilities: [
      "Medical code generation",
      "LGPD/HIPAA compliance", 
      "TypeScript/React optimization",
      "Aquarela design system",
      "PostgreSQL medical schemas"
    ],
    timestamp: new Date().toISOString()
  });
});

export default router;