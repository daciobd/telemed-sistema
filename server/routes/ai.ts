import { Router } from "express";

export const ai = Router();

// Use the existing OpenAI client from the project
let client: any = null;
try {
  // Try to use the existing OpenAI client from the server
  const openaiModule = require('../lib/openai-client');
  client = openaiModule.openaiClient || openaiModule.default;
} catch (e) {
  console.log("🤖 Using fallback OpenAI configuration");
}

const SYSTEM_PROMPT = `Você é o Dr. AI, assistente clínico para médicos brasileiros.
Características importantes:
- Responda de forma objetiva e prática
- Cite red flags e sinais de alarme quando houver
- Proponha diagnósticos diferenciais relevantes
- Sugira condutas baseadas em evidências
- Use terminologia médica adequada
- Considere protocolos do SUS quando aplicável
- SEMPRE inclua a ressalva final obrigatória

Formato de resposta:
1. Análise da situação
2. Hipóteses diagnósticas principais
3. Sinais de alarme a observar
4. Conduta sugerida
5. Ressalva obrigatória`;

ai.post("/clinical", async (req, res) => {
  const { question, patient, context } = req.body ?? {};
  if (!question) return res.status(400).json({ ok:false, error:"question obrigatório" });

  try {
    let answer = "";

    if (client && typeof client.chat?.completions?.create === 'function') {
      const userPrompt = [
        patient ? `Paciente: ${JSON.stringify(patient)}` : "",
        context ? `Contexto clínico: ${JSON.stringify(context)}` : "",
        `Pergunta do médico: ${question}`
      ].filter(Boolean).join("\n\n");

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 800,
      });

      answer = response.choices?.[0]?.message?.content?.trim() || "Sem resposta do modelo.";
    } else {
      // Fallback response when OpenAI is not available
      answer = generateFallbackResponse(question, patient, context);
    }

    // Ensure the mandatory disclaimer is always present
    if (!answer.includes("Conteúdo educativo")) {
      answer += "\n\n**Importante:** Conteúdo educativo; a decisão final é sempre do médico assistente.";
    }

    console.log(`🤖 Dr. AI respondeu para: ${question.substring(0, 50)}...`);
    res.json({ ok: true, answer });
    
  } catch (error: any) {
    console.error("🚨 Erro no Dr. AI:", error.message);
    
    // Professional fallback response
    const fallbackAnswer = generateFallbackResponse(question, patient, context);
    res.json({ ok: true, answer: fallbackAnswer });
  }
});

function generateFallbackResponse(question: string, patient?: any, context?: any): string {
  const responses = {
    cefaleia: `**Análise - Cefaleia:**
    
**Hipóteses principais:**
- Cefaleia tensional (mais comum)
- Enxaqueca sem aura
- Cefaleia secundária (investigar se sintomas de alarme)

**Sinais de alarme a investigar:**
- Início súbito e intenso ("pior cefaleia da vida")
- Febre associada
- Déficits neurológicos focais
- Alteração do nível de consciência
- Rigidez de nuca

**Conduta sugerida:**
- Anamnese detalhada (início, localização, qualidade, fatores desencadeantes)
- Exame neurológico completo
- Verificar sinais vitais
- Considerar analgesia sintomática se não há red flags
- Orientar retorno se piora ou novos sintomas

**Importante:** Conteúdo educativo; a decisão final é sempre do médico assistente.`,

    febre: `**Análise - Febre:**
    
**Hipóteses principais:**
- Síndrome gripal/viral
- Infecção respiratória
- Infecção urinária
- Outras causas infecciosas

**Sinais de alarme:**
- Febre persistente >7 dias
- Sinais de sepse (hipotensão, taquicardia, alteração mental)
- Dificuldade respiratória
- Desidratação severa

**Conduta:**
- Identificar foco infeccioso
- Exames complementares se indicado (hemograma, urina, RX tórax)
- Hidratação adequada
- Antitérmicos sintomáticos
- Antibioticoterapia apenas se bacterial confirmada/suspeita

**Importante:** Conteúdo educativo; a decisão final é sempre do médico assistente.`,

    dor: `**Análise - Quadro álgico:**
    
**Avaliação:**
- Caracterizar dor (localização, irradiação, intensidade, qualidade)
- Fatores desencadeantes e de alívio
- Sintomas associados
- História de trauma

**Conduta geral:**
- Analgesia multimodal conforme intensidade
- Investigar causa subjacente
- Medidas não farmacológicas
- Orientar sinais de alarme para retorno

**Importante:** Conteúdo educativo; a decisão final é sempre do médico assistente.`
  };

  // Try to match common medical terms
  const q = question.toLowerCase();
  if (q.includes("cefaleia") || q.includes("dor de cabeça")) return responses.cefaleia;
  if (q.includes("febre") || q.includes("temperatura")) return responses.febre;
  if (q.includes("dor")) return responses.dor;

  // Generic response
  return `**Orientação clínica geral:**

Para uma avaliação adequada, considere:

**Anamnese completa:**
- História da doença atual detalhada
- Antecedentes pessoais e familiares
- Medicações em uso
- Alergias conhecidas

**Exame físico direcionado:**
- Sinais vitais
- Exame do sistema relacionado à queixa
- Pesquisa de sinais de alarme

**Conduta:**
- Hipóteses diagnósticas baseadas em achados clínicos
- Exames complementares se indicados
- Tratamento sintomático quando apropriado
- Orientações de retorno claras

**Importante:** Conteúdo educativo; a decisão final é sempre do médico assistente.`;
}

export default ai;