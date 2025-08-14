import './ai-console.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
if (process.env.NODE_ENV !== 'production') console.debug('[AIConsole] dev mode');

const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const CPF_RE = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/;
const PHONE_BR_RE = /\b(?:\+?55\s?)?(?:\(?\d{2}\)?\s*)?\d{4,5}-?\d{4}\b/;

function hasPII(txt: string) {
  return EMAIL_RE.test(txt) || CPF_RE.test(txt) || PHONE_BR_RE.test(txt);
}

export default function AIConsolePage(){
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const disabled = useMemo(()=> loading || !q.trim() , [loading, q]);

  async function handleAsk(){
    const text = q.trim();
    setWarn(null);
    if (!text) return;
    if (hasPII(text)) {
      setWarn('Detectamos possível PII (email/telefone/CPF). Remova antes de enviar.');
      return;
    }
    setLoading(true);
    try{
      const r = await fetch('/api/ai/ask', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ q: text })
      });
      const j = await r.json();
      setResp(j?.answer ?? 'Sem resposta.');
    } catch(e:any){
      setResp('Erro ao consultar o agente.');
    } finally{
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent){
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAsk();
    }
  }

  useEffect(()=>{ taRef.current?.focus(); }, []);

  return (
    <main className="ai-wrap" role="main" aria-label="TeleMed AI Console">
      <section className="ai-card">
        <h1>TeleMed AI Console — V2</h1>
        <p className="subtitle">Faça perguntas técnicas ou gere trechos de código com segurança (sem PII).</p>

        <div className="status" aria-live="polite">
          <span className="dot" aria-hidden="true"></span>
          <div><strong>Status do Agent:</strong> online</div>
        </div>
        <div className="req">Requisitos: login de <strong>médico</strong>, consentimento, <code>AI_ENABLED=true</code>.</div>

        <div className="toolbar" role="group" aria-label="Ações do Agent">
          <button className="btn primary" type="button" onClick={handleAsk} disabled={disabled}>
            {loading ? 'Enviando…' : 'Perguntar (Q&A)'}
          </button>
          <button className="btn" type="button" onClick={()=>setResp('`// em breve: gerar snippet`')}>Gerar Código</button>
        </div>

        <div className="grid">
          <div>
            <div className="field">
              <label className="label" htmlFor="q">Pergunta para o Agent</label>
              <textarea
                ref={taRef}
                id="q"
                maxLength={2000}
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ex.: Explique opções de autenticação"
                aria-describedby="q-hint"
              />
              <div id="q-hint" className="hint">
                {q.length}/2000 • Sem PII • Atalho: <span className="kbd">Ctrl/⌘ + Enter</span>
              </div>
              {warn && <div role="alert" className="hint" style={{color:'#b45309'}}>{warn}</div>}
            </div>
            <div className="actions">
              <button className="btn primary" type="button" onClick={handleAsk} disabled={disabled}>
                {loading ? 'Perguntando…' : 'Perguntar ao Agent'}
              </button>
              <button className="btn" type="button" aria-label="Limpar conversa" onClick={()=>{ setQ(''); setResp(null); setWarn(null); taRef.current?.focus(); }}>
                🗑️ Limpar
              </button>
              <span className="spacer" />
            </div>
            <div className="resp" role="region" aria-live="polite" aria-label="Resposta">
              {resp ? <pre style={{whiteSpace:'pre-wrap', margin:0}}>{resp}</pre> : <div className="muted">Nenhuma resposta ainda.</div>}
            </div>
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
          </aside>
        </div>
      </section>
    </main>
  );
}