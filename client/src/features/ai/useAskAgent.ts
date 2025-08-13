// client/src/features/ai/useAskAgent.ts
import { useMutation } from "@tanstack/react-query";

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "x-csrf": "1" }, // remova x-csrf se não usar CSRF-lite
    body: JSON.stringify(body),
  });
  if (r.status === 401) throw new Error("Não autenticado");
  if (r.status === 403) throw new Error("IA desabilitada ou sem permissão");
  if (r.status === 428) throw new Error("Consentimento necessário");
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(t || "Falha ao consultar IA");
  }
  return r.json() as Promise<T>;
}

export function useAskAgent() {
  return useMutation({
    mutationFn: async (question: string) => {
      const result = await postJSON<{ success: boolean; response: string; question: string; timestamp: string }>("/api/ai-agent/ask", {
        // ⚠️ não envie PII aqui
        question,
      });
      // Parse the nested JSON response and extract just the message
      try {
        const parsedResponse = JSON.parse(result.response);
        return { answer: parsedResponse.message || parsedResponse.response || result.response };
      } catch {
        return { answer: result.response };
      }
    },
  });
}

export function useGenerateCodeAgent() {
  return useMutation({
    mutationFn: async (spec: { specification: string; language?: string; notes?: string }) => {
      const result = await postJSON<{ success: boolean; generatedCode: string; specification: string; timestamp: string }>("/api/ai-agent/generate-code", spec);
      return { code: result.generatedCode, notes: "Código gerado pelo TeleMed ChatGPT Agent" };
    },
  });
}