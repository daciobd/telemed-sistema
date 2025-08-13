// client/src/pages/ai-console.tsx
import React, { useState } from "react";
import { useAskAgent, useGenerateCodeAgent } from "../features/ai/useAskAgent";

export default function AIConsolePage() {
  const [mode, setMode] = useState<"ask" | "code">("ask");
  const [input, setInput] = useState("");
  const ask = useAskAgent();
  const gen = useGenerateCodeAgent();

  const onRun = () => {
    if (!input.trim()) return;
    if (mode === "ask") ask.mutate(input);
    else gen.mutate({ specification: input, language: "ts", notes: "React + fetch + segurança" });
  };

  const output =
    mode === "ask" ? ask.data?.answer : gen.data?.code || gen.data?.notes;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">AI Console</h1>

      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded ${mode === "ask" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("ask")}
        >
          Perguntar (Q&A)
        </button>
        <button
          className={`px-3 py-1 rounded ${mode === "code" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("code")}
        >
          Gerar Código
        </button>
      </div>

      <textarea
        className="w-full h-40 p-3 border rounded"
        placeholder={mode === "ask" ? "Sua pergunta (sem PII)..." : "Especificação do código..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={onRun}
          disabled={ask.isPending || gen.isPending}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
        >
          {mode === "ask" ? "Perguntar" : "Gerar"}
        </button>
        {(ask.isPending || gen.isPending) && <span>Processando…</span>}
      </div>

      {(ask.error || gen.error) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {(ask.error || gen.error as any)?.message}
          {/* Se quiser, aqui você pode abrir o modal de consentimento quando a msg for "Consentimento necessário" */}
        </div>
      )}

      {output && (
        <pre className="whitespace-pre-wrap p-3 bg-gray-50 border rounded text-sm overflow-x-auto">
          {output}
        </pre>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Não envie dados pessoais (nome, CPF, telefone, e-mail) no campo acima.
      </p>
    </main>
  );
}