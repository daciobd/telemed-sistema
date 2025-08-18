import React, { useEffect, useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant" | "system"; content: string; ts: number };

export default function DrAIPanel({
  open,
  onClose,
  consultId = "demo",
  gatherContext,      // () => string  -> resumo clínico opcional
  onInsertToPlan,     // (text:string) -> cola na Conduta se quiser
}: {
  open: boolean;
  onClose: () => void;
  consultId?: string;
  gatherContext?: () => string;
  onInsertToPlan?: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);

  const storageKey = useMemo(() => `drAi_${consultId}`, [consultId]);
  const listRef = useRef<HTMLDivElement>(null);

  // carrega / salva histórico
  useEffect(() => {
    if (!open) return;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) setMsgs(JSON.parse(raw));
    } catch {}
  }, [open, storageKey]);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(msgs));
    } catch {}
  }, [msgs, storageKey]);

  useEffect(() => {
    if (open) setTimeout(() => listRef.current?.scrollTo(0, 999999), 50);
  }, [open, msgs.length]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  async function send() {
    if (!input.trim() || busy) return;
    if (!accepted) {
      alert("Confirme que você leu o aviso de responsabilidade para usar o Dr. AI.");
      return;
    }
    const ctx = gatherContext?.() ?? "";
    const userMsg: Msg = { role: "user", content: input.trim(), ts: Date.now() };
    setMsgs((m) => [...m, userMsg]);

    setBusy(true);
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input.trim(),
          context: ctx,
          consultId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      const answer =
        data?.answer ||
        data?.message ||
        "Não consegui obter uma resposta da IA no momento. Tente novamente.";

      const botMsg: Msg = {
        role: "assistant",
        content: answer,
        ts: Date.now(),
      };
      setMsgs((m) => [...m, botMsg]);
      setInput("");
    } catch (e) {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Houve um erro ao consultar a IA. Verifique a conexão ou o backend (`POST /api/ai/ask`).",
          ts: Date.now(),
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function quick(q: string) {
    setInput(q);
    // envio imediato opcional:
    // setTimeout(send, 0);
  }

  return (
    <>
      <div className={`draioverlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`draipanel ${open ? "open" : ""}`} aria-hidden={!open}>
        <header className="dhead">
          <div className="title">
            <span className="brain">🧠</span>
            <div>
              <strong>Dr. AI</strong>
              <div className="muted">Assistente clínico – uso orientativo</div>
            </div>
          </div>
          <button className="x" onClick={onClose} aria-label="Fechar">✕</button>
        </header>

        <div className="disclaimer">
          ⚠️ <b>Importante:</b> as respostas são orientativas e <b>não substituem</b> o
          julgamento clínico do médico, protocolos locais ou diretrizes oficiais.
        </div>

        <div className="qbar">
          <button className="chip" onClick={() => quick("Sugira conduta baseada no caso.")}>
            Conduta
          </button>
          <button className="chip" onClick={() => quick("Proponha hipóteses diferenciais com CID-10.")}>
            Diferenciais
          </button>
          <button className="chip" onClick={() => quick("Quais exames são indicados neste quadro?")}>
            Exames
          </button>
          <button className="chip" onClick={() => quick("Escreva orientação clara ao paciente.")}>
            Orientação ao paciente
          </button>
        </div>

        <div ref={listRef} className="mlist">
          {msgs.length === 0 && (
            <div className="empty">
              Faça uma pergunta clínica. Dica: inclua dados relevantes.{" "}
              <span className="pill">Ctrl/⌘ + Enter</span> para enviar.
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`m ${m.role}`}>
              <div className="bubble">
                {m.content.split("\n").map((ln, j) => (
                  <p key={j}>{ln}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="accept">
          <label>
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />{" "}
            <span>
              Li e entendi a ressalva acima. Eu, médico responsável, assumo as
              decisões clínicas.
            </span>
          </label>
        </div>

        <div className="composer">
          <textarea
            placeholder="Descreva a dúvida clínica…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") send();
            }}
          />
          <div className="actions">
            {onInsertToPlan && (
              <button
                className="ghost"
                disabled={!msgs.find((m) => m.role === "assistant")}
                onClick={() => {
                  const last = [...msgs].reverse().find((m) => m.role === "assistant");
                  if (last) onInsertToPlan(last.content);
                }}
              >
                Inserir na Conduta
              </button>
            )}
            <button className="send" onClick={send} disabled={busy}>
              {busy ? "Gerando…" : "Enviar"}
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        :root{
          --primary:#A2D2FF; --primary-600:#8AB8E6;
          --bg:#F6F8FB; --card:#fff; --muted:#6B7280;
          --shadow:0 2px 8px rgba(0,0,0,.05); --radius:12px;
        }
        .draioverlay{
          position:fixed; inset:0; background:rgba(0,0,0,.15);
          opacity:0; visibility:hidden; transition:.18s ease;
          z-index: 80;
        }
        .draioverlay.show{opacity:1; visibility:visible}
        .draipanel{
          position:fixed; top:0; right:-520px; width:520px; max-width:92vw; height:100%;
          background:var(--card); box-shadow:-6px 0 24px rgba(0,0,0,.08);
          border-left:1px solid rgba(0,0,0,.06); z-index: 90;
          display:flex; flex-direction:column; transition: right .22s ease;
        }
        .draipanel.open{ right:0 }
        .dhead{ display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid rgba(0,0,0,.06)}
        .title{display:flex; gap:10px; align-items:center}
        .brain{font-size:22px}
        .muted{font-size:12px; color:var(--muted)}
        .x{ border:none; background:transparent; font-size:18px; cursor:pointer }
        .disclaimer{ margin:12px 16px; padding:10px 12px; background:#FFF; border:1px dashed #F59E0B90; border-radius:10px; color:#92400E; font-size:13px }
        .qbar{ display:flex; gap:8px; flex-wrap:wrap; padding:0 16px 8px }
        .chip{ background:#fff; border:1px solid var(--primary); color:#0F172A; padding:6px 10px; border-radius:999px; font-size:12px; cursor:pointer }
        .mlist{ flex:1; overflow:auto; padding:8px 16px 16px; background:linear-gradient(#FAFCFF,#F6F8FB) }
        .empty{ color:var(--muted); font-size:13px; padding:10px; }
        .pill{ background:#fff; border:1px solid rgba(0,0,0,.08); border-radius:999px; padding:2px 8px }
        .m{ display:flex; margin:10px 0 }
        .m.user{ justify-content:flex-end }
        .bubble{ max-width:88%; padding:10px 12px; border-radius:14px; box-shadow:var(--shadow); white-space:pre-wrap }
        .m.user .bubble{ background:var(--primary); color:#0F172A }
        .m.assistant .bubble{ background:#fff; border:1px solid rgba(0,0,0,.06) }
        .accept{ padding:8px 16px; border-top:1px solid rgba(0,0,0,.06); font-size:13px; color:#374151 }
        .composer{ padding:12px 16px; border-top:1px solid rgba(0,0,0,.06); display:grid; gap:8px }
        textarea{ width:100%; min-height:78px; resize:vertical; font:inherit; padding:10px 12px; border-radius:12px; border:1px solid rgba(0,0,0,.12); box-shadow:var(--shadow); outline:none }
        textarea:focus{ border-color: var(--primary-600); box-shadow: 0 0 0 3px rgba(162,210,255,.35) }
        .actions{ display:flex; justify-content:space-between; align-items:center }
        .ghost{ background:transparent; border:1px solid rgba(0,0,0,.12); border-radius:10px; padding:8px 10px; cursor:pointer }
        .send{ background:var(--primary); border:1px solid var(--primary); border-radius:10px; padding:8px 14px; font-weight:600; cursor:pointer }
        @media (max-width:720px){ .draipanel{width:100%} }
      `}</style>
    </>
  );
}