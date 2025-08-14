import './ai-console.css';
if (process.env.NODE_ENV !== 'production') console.debug('[AIConsole] dev mode');
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, Copy, Trash2, Loader2 } from "lucide-react";

const MAX_LEN = 2000;

// scrub básico de PII no cliente (extra-cautela)
const sanitize = (s: string) =>
  s
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, "[CPF]")
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, "[CNPJ]")
    .replace(/\+?\d{2}\s?\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}/g, "[PHONE]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL]");

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "x-csrf": "1" }, // ok mesmo se não usar CSRF-lite
    body: JSON.stringify(body),
  });
  if (r.status === 401) throw new Error("Faça login.");
  if (r.status === 403) throw new Error("IA desabilitada ou sem permissão.");
  if (r.status === 428) throw new Error("Consentimento necessário (autorize a IA).");
  if (!r.ok) throw new Error(`Erro ${r.status}`);
  return r.json() as Promise<T>;
}

function isValid(s: string) {
  const t = s.trim();
  return t.length >= 6 && t.length <= MAX_LEN;
}

export default function AIConsolePage() {
  const [statusOk, setStatusOk] = useState<boolean | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>("verificando…");

  // aba
  const [tab, setTab] = useState<"ask" | "code">("ask");
  const [pending, setPending] = useState(false);

  // Q&A
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const qCount = useMemo(() => question.trim().length, [question]);

  // Codegen
  const [spec, setSpec] = useState("");
  const [language, setLanguage] = useState<"ts" | "tsx" | "js">("ts");
  const [notes, setNotes] = useState("React + segurança; use React Query quando útil");
  const [code, setCode] = useState("");
  const sCount = useMemo(() => spec.trim().length, [spec]);

  useEffect(() => {
    fetch("/api/ai-agent/status", { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) throw r;
        return r.json();
      })
      .then(() => {
        setStatusOk(true);
        setStatusMsg("online");
      })
      .catch(async (e) => {
        setStatusOk(false);
        const msg = e instanceof Response ? `offline (HTTP ${e.status})` : "offline";
        setStatusMsg(msg);
      });
  }, []);

  async function doAsk() {
    if (!isValid(question) || pending) return;
    setPending(true); setAnswer(""); setCode("");
    try {
      const data = await postJSON<{ answer?: string }>("/api/ai-agent/ask", {
        question: sanitize(question.trim()),
      });
      setAnswer(data.answer ?? "(sem conteúdo)");
      setHistory((h) => [question.trim(), ...h].slice(0, 5));
    } catch (e: any) {
      setAnswer(`⚠️ ${e.message || "Erro ao consultar o Agent"}`);
    } finally {
      setPending(false);
    }
  }

  async function doGenerate() {
    if (!isValid(spec) || pending) return;
    setPending(true); setCode(""); setAnswer("");
    try {
      const data = await postJSON<{ code?: string; notes?: string }>(
        "/api/ai-agent/generate-code",
        { specification: sanitize(spec.trim()), language, notes }
      );
      setCode(data.code || data.notes || "(sem conteúdo)");
    } catch (e: any) {
      setCode(`⚠️ ${e.message || "Erro ao gerar código"}`);
    } finally {
      setPending(false);
    }
  }

  const copy = async (txt: string) => { try { await navigator.clipboard.writeText(txt); } catch {} };
  const clear = () => { setQuestion(""); setSpec(""); setAnswer(""); setCode(""); };

  return (
    <main className="ai-wrap" role="main" aria-label="TeleMed AI Console">
      <section className="ai-card">
        <h1>TeleMed AI Console — V2</h1>
        <p className="subtitle">Faça perguntas técnicas ou gere trechos de código com segurança (sem PII).</p>

        <div className="status" aria-live="polite">
          <span className="dot" aria-hidden="true"></span>
          <div><strong>Status do Agent:</strong> {statusMsg}</div>
        </div>
        <div className="req">Requisitos: login de <strong>médico</strong>, consentimento, <code>AI_ENABLED=true</code>.</div>

        <div className="toolbar" role="group" aria-label="Ações do Agent">
          <button 
            className={`btn ${tab === 'ask' ? 'primary' : ''}`} 
            type="button"
            onClick={() => setTab('ask')}
          >
            Perguntar (Q&amp;A)
          </button>
          <button 
            className={`btn ${tab === 'code' ? 'primary' : ''}`} 
            type="button"
            onClick={() => setTab('code')}
          >
            Gerar Código
          </button>
        </div>

        <div className="grid">
          <div>
            {tab === 'ask' ? (
              <>
                <div className="field">
                  <label className="label" htmlFor="q">Pergunta para o Agent</label>
                  <textarea 
                    id="q" 
                    placeholder="Ex.: Explique opções de autenticação" 
                    aria-describedby="q-hint"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && isValid(question) && !pending) doAsk();
                    }}
                  />
                  <div id="q-hint" className="hint">
                    {qCount}/{MAX_LEN} • Sem PII • Atalho: <span className="kbd">Ctrl/⌘ + Enter</span>
                  </div>
                </div>
                <div className="actions">
                  <button 
                    className="btn primary" 
                    type="button" 
                    onClick={doAsk}
                    disabled={pending || !isValid(question)}
                  >
                    {pending ? "Perguntando..." : "Perguntar ao Agent"}
                  </button>
                  <button className="btn" type="button" aria-label="Limpar conversa" onClick={clear}>
                    🗑️ Limpar
                  </button>
                  <span className="spacer" />
                </div>
                <div className="resp" role="region" aria-live="polite" aria-label="Resposta">
                  {answer ? (
                    <pre style={{margin: 0, whiteSpace: 'pre-wrap'}}>{answer}</pre>
                  ) : (
                    <div className="muted">Nenhuma resposta ainda.</div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="field">
                  <label className="label" htmlFor="spec">Especificação para Código</label>
                  <textarea 
                    id="spec" 
                    placeholder='Ex.: "Criar hook useAppointments com React Query chamando GET /api/appointments"' 
                    aria-describedby="spec-hint"
                    value={spec}
                    onChange={(e) => setSpec(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && isValid(spec) && !pending) doGenerate();
                    }}
                  />
                  <div id="spec-hint" className="hint">
                    {sCount}/{MAX_LEN} • Sem PII • Atalho: <span className="kbd">Ctrl/⌘ + Enter</span>
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor="lang">Linguagem</label>
                  <select 
                    id="lang" 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as any)}
                    style={{padding: '10px 12px', border: '1px solid var(--bd)', borderRadius: '10px', background: '#fff', font: 'inherit'}}
                  >
                    <option value="ts">TypeScript</option>
                    <option value="tsx">TSX (React)</option>
                    <option value="js">JavaScript</option>
                  </select>
                </div>
                <div className="field">
                  <label className="label" htmlFor="notes">Notas (opcional)</label>
                  <input 
                    id="notes" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex.: React + segurança; use React Query quando útil"
                  />
                </div>
                <div className="actions">
                  <button 
                    className="btn primary" 
                    type="button" 
                    onClick={doGenerate}
                    disabled={pending || !isValid(spec)}
                  >
                    {pending ? "Gerando..." : "Gerar Código"}
                  </button>
                  <button className="btn" type="button" aria-label="Limpar" onClick={clear}>
                    🗑️ Limpar
                  </button>
                  <span className="spacer" />
                </div>
                <div className="resp" role="region" aria-live="polite" aria-label="Código Gerado">
                  {code ? (
                    <pre style={{margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto'}}>{code}</pre>
                  ) : (
                    <div className="muted">Nenhum código gerado ainda.</div>
                  )}
                </div>
              </>
            )}
          </div>

          <aside aria-label="Ajuda" className="aside">
            <div className="field">
              <div className="label">Dicas</div>
              <ul className="hint" style={{margin:0, paddingLeft: '18px'}}>
                <li>Evite dados pessoais do paciente.</li>
                <li>Peça trechos de código curtos e objetivos.</li>
                <li>Use termos: "React Query", "A11y", "RTC".</li>
              </ul>
            </div>
            
            {history.length > 0 && (
              <div className="field">
                <div className="label">Últimas perguntas</div>
                <div style={{display: 'grid', gap: '8px'}}>
                  {history.map((h, i) => (
                    <button 
                      key={i} 
                      className="btn" 
                      onClick={() => setQuestion(h)} 
                      title="Reutilizar"
                      style={{textAlign: 'left', fontSize: '12px', padding: '6px 10px'}}
                    >
                      {h.length > 40 ? h.substring(0, 40) + '...' : h}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}