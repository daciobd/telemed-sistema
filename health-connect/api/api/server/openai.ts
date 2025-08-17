import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Feature flags for AI functionality
export const AI_FEATURE_FLAGS = {
  AI_ENABLED: process.env.AI_ENABLED === 'true',
  AI_SYMPTOMS_ENABLED: process.env.AI_SYMPTOMS_ENABLED === 'true',
  AI_ICD_SUGGESTION_ENABLED: process.env.AI_ICD_SUGGESTION_ENABLED === 'true',
  AI_DRUG_INTERACTIONS_ENABLED: process.env.AI_DRUG_INTERACTIONS_ENABLED === 'true'
};

// CRÍTICOS: Apenas emergências que requerem ação imediata
const CRITICAL_EMERGENCY_KEYWORDS = [
  'parada cardíaca', 'não responde', 'inconsciente há', 'convulsão ativa',
  'sangramento arterial', 'choque anafilático ativo', 'tentativa de suicídio'
];

// MODERADOS: Situações que precisam avaliação urgente mas permitem análise
const MODERATE_EMERGENCY_KEYWORDS = [
  'dor torácica', 'dor no peito', 'infarto', 'angina', 'dispneia intensa',
  'hemiparesia súbita', 'paralisia súbita', 'avc', 'derrame'
];

// PEDIATRIA: Casos que precisam cuidado especial mas permitem análise
const PEDIATRIC_KEYWORDS = [
  'recém-nascido', 'lactente', 'bebê menor que 3 meses'
];

function containsCriticalEmergency(text: string): boolean {
  const lowerText = text.toLowerCase();
  return CRITICAL_EMERGENCY_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

function containsModerateEmergency(text: string): boolean {
  const lowerText = text.toLowerCase();
  return MODERATE_EMERGENCY_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

function containsPediatricRisk(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PEDIATRIC_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// Deidentify patient data before sending to OpenAI
function deidentifyPatientData(data: SymptomAnalysisRequest): SymptomAnalysisRequest {
  return {
    ...data,
    symptoms: data.symptoms,
    patientAge: data.patientAge > 0 ? data.patientAge : 30,
    patientGender: data.patientGender,
    currentMedications: data.currentMedications.map(med => 
      med.replace(/\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2}/g, '[ID_REMOVIDO]')
    ),
    chronicConditions: data.chronicConditions,
    allergies: data.allergies
  };
}

export interface SymptomAnalysisRequest {
  symptoms: string;
  patientAge: number;
  patientGender: 'M' | 'F' | 'O';
  currentMedications: string[];
  chronicConditions: string[];
  allergies: string[];
}

export interface SymptomAnalysisResult {
  urgencyLevel: 'baixa' | 'media' | 'alta';
  urgencyScore: number;
  possibleDiagnoses: Array<{
    diagnosis: string;
    icdCode: string;
    confidence: number;
    description: string;
  }>;
  recommendedActions: string[];
  suggestedMedications: Array<{
    medication: string;
    dosage: string;
    indication: string;
    warnings: string[];
  }>;
  drugInteractions: Array<{
    medications: string[];
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  recommendedSpecialties: string[];
  followUpRecommendations: string[];
}

export async function analyzeSymptoms(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResult> {
  // Check if AI features are enabled
  if (!AI_FEATURE_FLAGS.AI_ENABLED || !AI_FEATURE_FLAGS.AI_SYMPTOMS_ENABLED) {
    throw new Error('AI symptom analysis is currently disabled');
  }

  // EMERGÊNCIA CRÍTICA - Bloquear imediatamente
  if (containsCriticalEmergency(request.symptoms)) {
    return {
      urgencyLevel: 'alta',
      urgencyScore: 20,
      possibleDiagnoses: [{
        diagnosis: 'Emergência médica crítica',
        icdCode: 'EMERGÊNCIA_CRÍTICA',
        confidence: 100,
        description: 'Situação que requer ação médica imediata'
      }],
      recommendedActions: [
        'CHAMAR SAMU 192 IMEDIATAMENTE',
        'Não aguardar - emergência médica crítica',
        'Dirigir-se ao pronto-socorro mais próximo'
      ],
      suggestedMedications: [],
      drugInteractions: [],
      recommendedSpecialties: ['Medicina de Emergência'],
      followUpRecommendations: ['Atendimento emergencial imediato']
    };
  }

  // PEDIATRIA DE ALTO RISCO - Precaução especial
  if (containsPediatricRisk(request.symptoms) && request.patientAge < 1) {
    return {
      urgencyLevel: 'alta',
      urgencyScore: 18,
      possibleDiagnoses: [{
        diagnosis: 'Caso pediátrico de alto risco',
        icdCode: 'PEDIATRIA_ALTO_RISCO',
        confidence: 95,
        description: 'Casos neonatais requerem avaliação presencial especializada'
      }],
      recommendedActions: [
        'Avaliação presencial obrigatória',
        'Não realizar diagnóstico via telemedicina em neonatos',
        'Encaminhar para pediatra urgentemente'
      ],
      suggestedMedications: [],
      drugInteractions: [],
      recommendedSpecialties: ['Pediatria', 'Neonatologia'],
      followUpRecommendations: ['Consulta presencial prioritária']
    };
  }

  // Deidentify patient data before sending to OpenAI
  const deidentifiedRequest = deidentifyPatientData(request);

  const systemPrompt = `Você é um assistente médico especializado para apoio diagnóstico. 

MISSÃO: Fornecer análise médica estruturada e útil, mantendo segurança clínica.

CAPACIDADES:
- Análise de sintomas com base em evidências médicas
- Sugestão de hipóteses diagnósticas com probabilidades
- Classificação de urgência baseada em critérios clínicos
- Recomendação de especialidades e exames
- Identificação de red flags e sinais de alarme
- Sugestão de códigos CID quando apropriado

DIRETRIZES DE SEGURANÇA:
- Sempre recomendar avaliação médica para confirmação
- Identificar sinais de alarme e emergências
- Ser transparente sobre limitações e incertezas
- Priorizar segurança do paciente
- Basear recomendações em evidências científicas

FORMATO DE RESPOSTA: JSON estruturado conforme especificado.`;

  const userPrompt = `Analise os seguintes dados clínicos e forneça uma avaliação médica estruturada:

DADOS DO PACIENTE:
- Sintomas: ${deidentifiedRequest.symptoms}
- Idade: ${deidentifiedRequest.patientAge} anos
- Sexo: ${deidentifiedRequest.patientGender === 'M' ? 'Masculino' : deidentifiedRequest.patientGender === 'F' ? 'Feminino' : 'Outro'}
- Medicamentos atuais: ${deidentifiedRequest.currentMedications.join(', ') || 'Nenhum informado'}
- Condições crônicas: ${deidentifiedRequest.chronicConditions.join(', ') || 'Nenhuma informada'}
- Alergias conhecidas: ${deidentifiedRequest.allergies.join(', ') || 'Nenhuma informada'}

RESPOSTA OBRIGATÓRIA EM JSON:
{
  "urgencyLevel": "baixa|media|alta",
  "urgencyScore": "número de 1-20",
  "possibleDiagnoses": [
    {
      "diagnosis": "nome do diagnóstico",
      "icdCode": "código CID-10 se conhecido",
      "confidence": "porcentagem de confiança",
      "description": "descrição clínica detalhada"
    }
  ],
  "recommendedActions": ["lista de ações recomendadas"],
  "recommendedSpecialties": ["especialidades médicas indicadas"],
  "followUpRecommendations": ["recomendações de seguimento"],
  "redFlags": ["sinais de alarme identificados"],
  "additionalTests": ["exames complementares sugeridos"]
}

CRITÉRIOS DE URGÊNCIA:
- BAIXA (1-7): Sintomas leves, condições não urgentes
- MÉDIA (8-15): Sintomas moderados, avaliação em 24-48h
- ALTA (16-20): Sintomas graves, avaliação imediata necessária

IMPORTANTE: Forneça análise clinicamente útil mantendo foco na segurança.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: userPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Ligeiramente mais flexível mas ainda conservador
      max_tokens: 2000 // Mais tokens para resposta completa
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    // Processar resultado com ajustes de segurança
    let urgencyScore = result.urgencyScore || 5;
    let urgencyLevel = result.urgencyLevel || 'media';

    // Ajustar urgência se contém emergência moderada
    if (containsModerateEmergency(request.symptoms) && urgencyScore < 16) {
      urgencyScore = Math.max(urgencyScore, 16);
      urgencyLevel = 'alta';
    }

    // Estruturar resposta final
    return {
      urgencyLevel: urgencyLevel as 'baixa' | 'media' | 'alta',
      urgencyScore: Math.min(urgencyScore, 20), // Máximo 20
      possibleDiagnoses: (result.possibleDiagnoses || []).map((d: any) => ({
        diagnosis: d.diagnosis || 'Diagnóstico não especificado',
        icdCode: AI_FEATURE_FLAGS.AI_ICD_SUGGESTION_ENABLED ? (d.icdCode || '') : '',
        confidence: Math.max(10, Math.min(d.confidence || 50, 90)), // Entre 10-90%
        description: d.description || 'Descrição não disponível'
      })),
      recommendedActions: [
        'Esta análise é de apoio ao diagnóstico médico',
        'Recomenda-se avaliação médica presencial para confirmação',
        ...(result.recommendedActions || [])
      ],
      suggestedMedications: [], // Mantido vazio por segurança
      drugInteractions: AI_FEATURE_FLAGS.AI_DRUG_INTERACTIONS_ENABLED ? 
        (result.drugInteractions || []) : [],
      recommendedSpecialties: result.recommendedSpecialties || ['Clínica Médica'],
      followUpRecommendations: [
        ...(result.followUpRecommendations || []),
        'Reavaliar se sintomas piorarem ou persistirem'
      ]
    };

  } catch (error) {
    console.error('Error analyzing symptoms with OpenAI:', error);
    throw new Error('Erro na análise: ' + (error as Error).message);
  }
}

export async function getMedicalAdvice(question: string, patientContext?: Partial<SymptomAnalysisRequest>): Promise<string> {
  if (!AI_FEATURE_FLAGS.AI_ENABLED) {
    throw new Error('AI medical advice is currently disabled');
  }

  if (containsCriticalEmergency(question)) {
    return `⚠️ EMERGÊNCIA DETECTADA: Sua pergunta sugere emergência médica crítica. 

AÇÃO IMEDIATA: Ligar SAMU 192 ou dirigir-se ao pronto-socorro mais próximo.

Este assistente não deve ser usado para emergências médicas.`;
  }

  const safeContext = patientContext ? {
    patientAge: patientContext.patientAge,
    currentMedications: patientContext.currentMedications?.map(med => 
      med.replace(/\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2}/g, '[ID_REMOVIDO]')
    ),
    chronicConditions: patientContext.chronicConditions
  } : null;

  const contextInfo = safeContext ? `
CONTEXTO CLÍNICO:
- Idade: ${safeContext.patientAge} anos
- Medicamentos: ${safeContext.currentMedications?.join(', ') || 'Nenhum informado'}
- Condições crônicas: ${safeContext.chronicConditions?.join(', ') || 'Nenhuma informada'}
` : '';

  const systemPrompt = `Você é um assistente médico para orientação educativa e apoio clínico.

OBJETIVOS:
- Fornecer informações médicas baseadas em evidências
- Orientar sobre quando buscar atendimento médico
- Educar sobre condições de saúde
- Apoiar decisões clínicas (não substituir)

SEMPRE INCLUIR:
- Base científica das informações
- Limitações da orientação remota
- Quando procurar atendimento presencial
- Sinais de alarme relevantes

NUNCA FORNECER:
- Diagnósticos definitivos
- Prescrições específicas
- Dosagens medicamentosas
- Orientações para emergências críticas`;

  const prompt = `${contextInfo}

PERGUNTA: ${question}

Forneça orientação médica educativa, incluindo:
1. Informações baseadas em evidências
2. Quando buscar atendimento médico
3. Sinais de alarme a observar
4. Limitações desta orientação

Seja útil mas sempre seguro.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 800
    });

    const content = response.choices[0].message.content || 'Não foi possível processar a pergunta.';

    return `${content}

📋 LEMBRE-SE: Esta é uma orientação educativa de apoio. Para avaliação clínica definitiva, consulte um médico presencialmente.`;

  } catch (error) {
    console.error('Error getting medical advice from OpenAI:', error);
    throw new Error('Failed to get medical advice. Please try again.');
  }
}

export async function checkDrugInteractions(medications: string[]): Promise<Array<{
  medications: string[];
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation: string;
}>> {
  if (!AI_FEATURE_FLAGS.AI_ENABLED || !AI_FEATURE_FLAGS.AI_DRUG_INTERACTIONS_ENABLED) {
    throw new Error('AI drug interaction checking is disabled. Use a licensed pharmaceutical database or clinical decision support system.');
  }

  // Esta funcionalidade requer base de dados licenciada
  return [{
    medications: medications,
    severity: 'medium',
    description: 'Verificação de interações medicamentosas requer base de dados farmacológica licenciada.',
    recommendation: 'Consulte um farmacêutico ou sistema de apoio à decisão clínica licenciado.'
  }];
}