// client/src/pages/enhanced-clone.tsx
// UI clone da tela "Enhanced" com vídeo à esquerda, formulário à direita,
// barra superior, botões de ação e painel Dr. AI (drawer). Sem dependências extras.
// Basta criar a rota no App/Router para "/enhanced" apontar para este componente.

import React, { useEffect, useMemo, useRef, useState } from "react";

// ====== Ícones (SVG inline, sem libs) ======
const Icon = ({ path, size = 20, stroke = 2 }: { path: string; size?: number; stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const Icons = {
  paperclip: "M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 015 5l-9.19 9.19a2 2 0 01-2.83-2.83l8.49-8.49",
  camera: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h3l2-3h8l2 3h3a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z",
  chat: "M21 15a4 4 0 01-4 4H7l-4 4V7a4 4 0 014-4h10a4 4 0 014 4z",
  bell: "M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  brain: "M15 8a3 3 0 00-6 0 3 3 0 00-3 3 3 3 0 003 3h6a3 3 0 003-3 3 3 0 00-3-3z M9 14v4 M15 14v4",
  mic: "M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z M19 10a7 7 0 01-14 0 M12 19v4",
  micOff: "M1 1l22 22 M9 5v6a3 3 0 004.24 2.82 M15 9V4a3 3 0 00-6 0v1 M19 10a7 7 0 01-9 6",
  video: "M23 7l-7 5 7 5V7z M1 5h14v14H1z",
  videoOff: "M2 2l20 20 M15 10l8-5v12l-5-3.13 M2 6h10v10H2z",
  clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
  phoneOff: "M10 3h4M2 2l20 20 M22 16.92a16 16 0 01-6.92 1.58c-1.55 0-3.06-.24-4.46-.68l-2.55 2.55A15.91 15.91 0 012 6.41l2.55-2.55c-.45-1.4-.69-2.9-.69-4.46",
  back: "M15 18l-6-6 6-6",
  form: "M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z M8 6h8 M8 10h8 M8 14h6",
  layout: "M3 6h18M3 12h18M3 18h18",
  exit: "M10 17l-5-5 5-5M3 12h12 M21 21V3",
  play: "M5 3l14 9-14 9V3z",
  send: "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7",
  check: "M20 6L9 17l-5-5",
  search: "M21 21l-4.35-4.35 M11 18a7 7 0 100-14 7 7 0 000 14z",
  x: "M18 6L6 18M6 6l12 12",
  pdf: "M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z M14 2v6h6",
};

// Utilidades simples
const fmtTime = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
};

// Lista mínima de CID-10 para auto-complete
const CID10_SAMPLE = [
  { code: "F41.1", name: "Transtorno de ansiedade generalizada" },
  { code: "F32.0", name: "Episódio depressivo leve" },
  { code: "J00", name: "Rinite aguda (resfriado comum)" },
  { code: "I10", name: "Hipertensão essencial (primária)" },
  { code: "E11.9", name: "Diabetes mellitus tipo 2, sem complicações" },
];

// ====== Componentes ======
function TogglePill({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button className={`pill ${checked ? "on" : "off"}`} onClick={() => onChange(!checked)} type="button">
      <span className="dot" /> {label}
      <style>{`
        .pill{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;border:1px solid #e5e7eb;background:#fff;color:#374151}
        .pill.on{background:#ecfdf5;border-color:#a7f3d0;color:#065f46}
        .pill .dot{width:10px;height:10px;border-radius:999px;background:#d1d5db}
        .pill.on .dot{background:#10b981}
      `}</style>
    </button>
  );
}

function IconButton({ title, icon, variant = "ghost", danger = false, onClick }: any) {
  return (
    <button className={`ibtn ${variant} ${danger ? "danger" : ""}`} onClick={onClick} title={title} type="button">
      {icon}
      <style>{`
        .ibtn{width:44px;height:44px;border-radius:999px;border:1px solid rgba(255,255,255,.15);display:grid;place-items:center;cursor:pointer;transition:transform .15s ease, opacity .15s ease;background:rgba(255,255,255,.06);color:#eef2ff}
        .ibtn:hover{opacity:.9;transform:translateY(-1px)}
        .ibtn.danger{background:#ef4444;border-color:#ef4444}
        .ibtn.ghost{background:rgba(255,255,255,.06)}
        .ibtn.primary{background:#3b82f6;border-color:#3b82f6}
        .ibtn.warning{background:#f59e0b;border-color:#f59e0b;color:#111827}
      `}</style>
    </button>
  );
}

function DrawerAI({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([
    { role: "ai", text: "Olá! Eu sou o Dr. AI. Posso apoiar com triagem de hipóteses, condutas e doses. Use sempre como apoio e confirme clinicamente." },
  ]);
  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => { scroller.current?.scrollTo({ top: 999999, behavior: "smooth" }); }, [messages, open]);

  async function send() {
    if (!text.trim()) return;
    const ask = text.trim();
    setMessages((m) => [...m, { role: "user", text: ask }]);
    setText("");
    try {
      const r = await fetch("/api/ai/clinical", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: ask }) });
      if (!r.ok) throw new Error("fallback");
      const data = await r.json();
      setMessages((m) => [...m, { role: "ai", text: data.answer || "Sem resposta" }]);
    } catch (e) {
      // Fallback local
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text:
            "⚠️ Aviso: resposta gerada automaticamente apenas para orientação. Sempre confirme via exame físico e diretrizes locais.\n\nHipóteses iniciais sugeridas com base na queixa: enxaqueca, cefaleia tensional, sinusite. Avalie bandeiras vermelhas (febre alta persistente, déficit neurológico, rigidez de nuca).",
        },
      ]);
    }
  }

  return (
    <div className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="header">
        <strong>Dr. AI – Assistente Clínico</strong>
        <button className="x" onClick={onClose} title="Fechar"><Icon path={Icons.x} /></button>
      </div>
      <div className="disclaimer">As respostas são sugestões educacionais. A decisão final é do médico responsável.</div>
      <div className="msgs" ref={scroller}>
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>{m.text}</div>
        ))}
      </div>
      <div className="input">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ex.: cefaleia com náuseas há 3 dias. Conduta e sinais de alarme?" onKeyDown={(e)=>{if(e.key==='Enter') send();}}/>
        <button onClick={send} className="send"><Icon path={Icons.send} /></button>
      </div>
      <style>{`
        .drawer{position:fixed;top:0;right:-460px;width:460px;max-width:96vw;height:100vh;background:#fff;box-shadow:-8px 0 24px rgba(0,0,0,.15);transition:right .25s ease;display:flex;flex-direction:column;z-index:60}
        .drawer.open{right:0}
        .header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #e5e7eb}
        .x{background:transparent;border:none;cursor:pointer;color:#374151}
        .disclaimer{padding:10px 16px;color:#6b7280;font-size:13px;background:#f9fafb;border-bottom:1px solid #eef2f7}
        .msgs{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#fafafa}
        .msg{max-width:90%;padding:10px 12px;border-radius:12px}
        .msg.user{margin-left:auto;background:#e0f2fe;color:#0c4a6e}
        .msg.ai{background:#eef2ff;color:#111827}
        .input{display:flex;gap:8px;border-top:1px solid #e5e7eb;padding:10px}
        .input input{flex:1;border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px}
        .send{width:44px;border-radius:12px;border:1px solid #93c5fd;background:#bfdbfe;cursor:pointer}
      `}</style>
    </div>
  );
}

export default function EnhancedClone() {
  // Estado da barra lateral (form) – tamanhos: 'sm' | 'md' | 'lg'
  const [panelSize, setPanelSize] = useState<"sm" | "md" | "lg">("md");
  const cyclePanel = () => setPanelSize((s) => (s === "sm" ? "md" : s === "md" ? "lg" : "sm"));

  const [tab, setTab] = useState<"chat" | "form" | "exams" | "medmed">("form");
  const [seconds, setSeconds] = useState(0);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [notify, setNotify] = useState(1);
  const [aiOpen, setAiOpen] = useState(false);

  // Form fields
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [hpi, setHpi] = useState("");
  const [icd, setIcd] = useState("");
  const [icdOpen, setIcdOpen] = useState(false);
  const [conduct, setConduct] = useState("");
  const [flags, setFlags] = useState({ a: false, b: false, c: false });
  const [alerts, setAlerts] = useState("");

  // Exams
  const [examName, setExamName] = useState("");
  const [examPriority, setExamPriority] = useState("Rotina");
  const [examInstr, setExamInstr] = useState("");
  const [examList, setExamList] = useState<string[]>([]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const missing = useMemo(() => {
    const req = [chiefComplaint, hpi, conduct];
    return req.some((v) => !v.trim());
  }, [chiefComplaint, hpi, conduct]);

  function addExam(template?: string) {
    const name = template || examName || "Exame sem nome";
    setExamList((l) => [name, ...l]);
    setExamName("");
    setExamInstr("");
    setExamPriority("Rotina");
  }

  function openMemed() {
    const patient = encodeURIComponent(JSON.stringify({ name: "Ana Costa Silva", age: 0, phone: "11987654321" }));
    window.open(`https://memed.com.br/?demo=1&patient=${patient}`, "_blank");
  }

  return (
    <div className="page">
      {/* Topbar */}
      <header className="top">
        <div className="left">
          <div className="avatar">CF</div>
          <div className="pinfo">
            <div className="pname">Ana Costa Silva <span>• 0 anos</span> <span className="tag">Convite</span></div>
            <div className="sub">📞 11987654321 • Particular</div>
          </div>
          <button className="invite" onClick={() => alert("Convite enviado para a sala de espera")}>Convidar para entrar</button>
        </div>
        <div className="right">
          <div className="status"><span className="dot" /> Aguardando</div>
          <div className="timer">{fmtTime(seconds)}</div>
          <button className="primary" onClick={() => alert("Consulta iniciada")}>Iniciar Consulta</button>
          <button className="ghost" title="Voltar"><Icon path={Icons.back} /></button>
          <button className="ghost" title="Formulário"><Icon path={Icons.form} /></button>
          <button className="ghost" title="Largura do painel" onClick={cyclePanel}><Icon path={Icons.layout} /></button>
          <button className="ghost" title="Sair"><Icon path={Icons.exit} /></button>
        </div>
      </header>

      <main className={`content ${panelSize}`}>
        {/* Área de vídeo */}
        <section className="video">
          <div className="vidTimer">{fmtTime(seconds)}</div>
          <div className="placeholder">
            <div className="camIcon">📹</div>
            <div className="txt">Aguardando paciente</div>
            <div className="room">Sala: #ABC123</div>
          </div>
          <div className="controls">
            <IconButton title="Anexar" icon={<Icon path={Icons.paperclip} />} />
            <IconButton title="Screenshot" icon={<Icon path={Icons.camera} />} />
            <IconButton title="Chat" icon={<Icon path={Icons.chat} />} onClick={() => setTab("chat")} />
            <div className="notifWrap" title="Notificações" onClick={() => setNotify(0)}>
              <IconButton title="Notificações" icon={<Icon path={Icons.bell} />} />
              {notify > 0 && <span className="badge">{notify}</span>}
            </div>
            <IconButton title="Dr. AI" icon={<Icon path={Icons.brain} />} onClick={() => setAiOpen(true)} />
            <IconButton title={mic ? "Mutar" : "Ativar microfone"} icon={<Icon path={mic ? Icons.mic : Icons.micOff} />} onClick={() => setMic(!mic)} />
            <IconButton title={cam ? "Desligar câmera" : "Ligar câmera"} icon={<Icon path={cam ? Icons.video : Icons.videoOff} />} onClick={() => setCam(!cam)} />
            <IconButton title="Enviar para sala de espera" icon={<Icon path={Icons.clock} />} variant="warning" />
            <IconButton title="Finalizar" icon={<Icon path={Icons.phoneOff} />} danger />
          </div>
        </section>

        {/* Painel lateral */}
        <aside className="panel">
          <div className="tabs">
            <button className={tab === "chat" ? "on" : ""} onClick={() => setTab("chat")}>Chat</button>
            <button className={tab === "form" ? "on" : ""} onClick={() => setTab("form")}>Atendimento</button>
            <button className={tab === "exams" ? "on" : ""} onClick={() => setTab("exams")}>Exames</button>
            <button className={tab === "medmed" ? "on" : ""} onClick={() => setTab("medmed")}>MedMed</button>
          </div>

          {tab === "chat" && (
            <div className="card chatbox">
              <div className="msg other">Olá, doutor! Como está?</div>
              <div className="msg mine">Estou bem, obrigado. Como posso ajudá-lo hoje?</div>
              <div className="msg other">Dores de cabeça frequentes nos últimos dias.</div>
              <div className="chatInput">
                <input placeholder="Digite sua mensagem..." />
                <button className="send"><Icon path={Icons.send} /></button>
              </div>
            </div>
          )}

          {tab === "form" && (
            <div className="form">
              <div className="group">
                <label>História da Doença Atual <span className="req">*</span></label>
                <textarea value={hpi} onChange={(e) => setHpi(e.target.value)} placeholder="Evolução dos sintomas" />
              </div>

              <div className="group">
                <label>Hipótese Diagnóstica <span className="req">*</span></label>
                <div className="icdWrap">
                  <input value={icd} onChange={(e) => { setIcd(e.target.value); setIcdOpen(true); }} onFocus={() => setIcdOpen(true)} placeholder="Ex.: F41.1 - Transtorno de ansiedade..." />
                  {icdOpen && (
                    <div className="dropdown" onMouseLeave={() => setIcdOpen(false)}>
                      {CID10_SAMPLE.filter((c) => (icd ? (c.code + " " + c.name).toLowerCase().includes(icd.toLowerCase()) : true)).map((c) => (
                        <div key={c.code} className="item" onClick={() => { setIcd(`${c.code} - ${c.name}`); setIcdOpen(false); }}>
                          <strong>{c.code}</strong> {c.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="tabs soft">
                <button className="on">Conduta</button>
                <button onClick={() => setTab("exams")}>Exames</button>
                <button onClick={() => setTab("medmed")}>MedMed</button>
              </div>

              <div className="group">
                <label>Conduta Terapêutica <span className="req">*</span></label>
                <textarea value={conduct} onChange={(e) => setConduct(e.target.value)} placeholder="Orientações e tratamento" />
              </div>

              <div className="group">
                <label>Complexidade</label>
                <div className="pills">
                  <TogglePill label="Agravo em saúde mental" checked={flags.a} onChange={(v) => setFlags({ ...flags, a: v })} />
                  <TogglePill label="Complexidade clínica" checked={flags.b} onChange={(v) => setFlags({ ...flags, b: v })} />
                  <TogglePill label="Inconsistência de queixas" checked={flags.c} onChange={(v) => setFlags({ ...flags, c: v })} />
                </div>
              </div>

              <div className="group">
                <label>Sinais de Alerta</label>
                <input value={alerts} onChange={(e) => setAlerts(e.target.value)} placeholder="Ex: ideação suicida, dor torácica..." />
              </div>

              {missing && (
                <div className="warn">⚠️ Campos obrigatórios: Queixa principal, Doença atual, Conduta</div>
              )}

              <div className="actions">
                <button className="ghost"><Icon path={Icons.check} /> Salvar</button>
                <button className="primary">Finalizar</button>
              </div>
            </div>
          )}

          {tab === "exams" && (
            <div className="form">
              <div className="templates card">
                <div className="t" onClick={() => addExam("Hemograma completo – Jejum de 8-12 horas")}>Hemograma completo <span>Jejum de 8-12 horas</span></div>
                <div className="t" onClick={() => addExam("Glicemia de jejum – Jejum rigoroso de 8-12 horas")}>Glicemia de jejum <span>Jejum rigoroso de 8-12 horas</span></div>
              </div>
              <div className="group"><label>Nome do exame</label><input value={examName} onChange={(e) => setExamName(e.target.value)} /></div>
              <div className="group"><label>Rotina</label>
                <select value={examPriority} onChange={(e) => setExamPriority(e.target.value)}>
                  <option>Rotina</option><option>Prioritário</option><option>Urgente</option>
                </select>
              </div>
              <div className="group"><label>Instruções específicas</label><textarea value={examInstr} onChange={(e) => setExamInstr(e.target.value)} /></div>
              <button className="primary block" onClick={() => addExam()}>+ Adicionar Exame</button>
              <div className="empty card">
                {examList.length === 0 ? (
                  <div className="none">Nenhum exame solicitado</div>
                ) : (
                  <ul className="list">
                    {examList.map((e, i) => (<li key={i}><Icon path={Icons.check} size={16}/> {e}</li>))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {tab === "medmed" && (
            <div className="form">
              <div className="med card">
                <div className="title"><Icon path={Icons.form} /> Integração MedMed</div>
                <p>Prescreva medicamentos com assinatura digital automática.</p>
                <button className="primary" onClick={openMemed}>Nova Receita MedMed</button>
                <ul className="ticks">
                  <li>✔️ Base farmacológica completa</li>
                  <li>✔️ Assinatura digital ICP-Brasil</li>
                  <li>✔️ Verificação de interações</li>
                </ul>
              </div>
              <div className="card">
                <div className="rx">
                  <div className="left">
                    <div className="rtitle">Receita #MEMED-ZJMAJOFLO <span className="ok">Assinada</span></div>
                    <div className="item">Dipirona Sódica – 500mg • 1 comprimido de 6/6 horas se dor ou febre • 20 comprimidos</div>
                  </div>
                  <div className="right">
                    <button className="ghost"><Icon path={Icons.pdf} /> PDF</button>
                    <button className="ghost">🗑️</button>
                  </div>
                </div>
                <div className="success">✅ MedMed conectado! Aguardando receita...</div>
              </div>
            </div>
          )}
        </aside>
      </main>

      <DrawerAI open={aiOpen} onClose={() => setAiOpen(false)} />

      {/* ====== ESTILOS ====== */}
      <style>{`
        :root{--bg:#0f172a;--panel:#ffffff;--muted:#6b7280;--line:#e5e7eb;--primary:#2563eb;--ok:#10b981;--danger:#ef4444}
        *{box-sizing:border-box}
        body{margin:0}
        .page{min-height:100vh;background:#0b1220;color:#111827}

        /* Topbar */
        .top{height:56px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#fff;position:sticky;top:0;z-index:40}
        .left{display:flex;align-items:center;gap:10px}
        .avatar{width:28px;height:28px;border-radius:999px;background:#1f2937;color:#e5e7eb;display:grid;place-items:center;font-size:12px}
        .pinfo .pname{font-weight:600}
        .pinfo .pname span{color:#6b7280;font-weight:400;margin-left:6px}
        .tag{background:#e0e7ff;color:#3730a3;border-radius:999px;padding:2px 6px;margin-left:8px;font-size:12px}
        .sub{font-size:12px;color:#6b7280}
        .invite{margin-left:10px;border:1px solid #c7d2fe;background:#eef2ff;color:#1e3a8a;border-radius:10px;padding:6px 10px;cursor:pointer}
        .right{display:flex;align-items:center;gap:8px}
        .status{display:flex;align-items:center;gap:6px;color:#6b7280}
        .status .dot{width:8px;height:8px;border-radius:999px;background:#22c55e}
        .timer{font-variant-numeric:tabular-nums;color:#6b7280;width:48px;text-align:right}
        .primary{background:#3b82f6;border:1px solid #3b82f6;color:#fff;border-radius:10px;padding:8px 12px;cursor:pointer}
        .ghost{background:#fff;border:1px solid var(--line);border-radius:10px;padding:6px 10px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}

        /* Layout */
        .content{display:grid;grid-template-columns:1fr 420px;gap:0}
        .content.sm{grid-template-columns:1fr 360px}
        .content.lg{grid-template-columns:1fr 560px}

        /* Video */
        .video{min-height:calc(100vh - 56px);background:#0b1220;position:relative;display:flex;align-items:center;justify-content:center}
        .placeholder{color:#94a3b8;text-align:center}
        .camIcon{font-size:46px;margin-bottom:6px}
        .room{margin-top:6px;color:#64748b}
        .vidTimer{position:absolute;top:14px;right:14px;background:rgba(0,0,0,.45);color:#e5e7eb;border-radius:8px;padding:6px 8px;font-variant-numeric:tabular-nums}
        .controls{position:absolute;left:50%;transform:translateX(-50%);bottom:18px;display:flex;gap:10px;align-items:center}
        .notifWrap{position:relative;display:flex}
        .badge{position:absolute;right:-2px;top:-2px;background:#ef4444;color:#fff;border-radius:999px;font-size:11px;min-width:18px;height:18px;display:grid;place-items:center;padding:0 4px}

        /* Painel */
        .panel{background:#fff;border-left:1px solid var(--line);min-height:calc(100vh - 56px);overflow:auto}
        .tabs{display:flex;border-bottom:1px solid var(--line)}
        .tabs button{flex:1;padding:10px 12px;background:#fff;border:none;border-right:1px solid var(--line);cursor:pointer}
        .tabs button.on{background:#eef2ff;color:#1e3a8a;font-weight:600}
        .tabs.soft{margin:6px 12px;border:1px solid var(--line);border-radius:8px;overflow:hidden}
        .tabs.soft button{border-right:1px solid var(--line);padding:8px 10px}
        .form{padding:12px}
        .group{margin-bottom:12px}
        label{display:block;font-size:13px;color:#374151;margin-bottom:6px}
        .req{color:#ef4444}
        textarea,input,select{width:100%;border:1px solid var(--line);border-radius:10px;padding:10px 12px;outline:none}
        textarea{min-height:90px;resize:vertical}
        .pills{display:flex;gap:8px;flex-wrap:wrap}
        .warn{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:10px;padding:8px 10px}
        .actions{display:flex;gap:12px;margin-top:10px}
        .block{width:100%;margin-top:4px}
        .card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:10px}
        .chatbox{display:flex;flex-direction:column;gap:8px}
        .msg{max-width:85%;padding:8px 10px;border-radius:10px}
        .mine{align-self:flex-end;background:#dbeafe}
        .other{align-self:flex-start;background:#f1f5f9}
        .chatInput{margin-top:auto;display:flex;gap:8px}
        .chatInput input{flex:1}
        .send{border:1px solid #93c5fd;background:#bfdbfe;border-radius:10px;padding:8px 10px}
        .templates .t{padding:8px 10px;border:1px solid var(--line);border-radius:8px;margin-bottom:6px;cursor:pointer}
        .templates .t span{display:block;color:#6b7280;font-size:12px}
        .empty{margin-top:10px}
        .none{color:#6b7280;text-align:center;padding:20px}
        .list{list-style:none;padding:0;margin:0;display:grid;gap:8px}
        .rx{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
        .rtitle{font-weight:600}
        .ok{background:#dcfce7;color:#166534;border-radius:999px;padding:2px 8px;margin-left:6px;font-size:12px}
        .success{margin-top:10px;background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;border-radius:8px;padding:8px 10px}
        .med .title{display:flex;align-items:center;gap:8px;font-weight:600;margin-bottom:6px}

        .icdWrap{position:relative}
        .dropdown{position:absolute;left:0;right:0;top:100%;background:#fff;border:1px solid var(--line);border-radius:10px;margin-top:4px;z-index:10;max-height:200px;overflow:auto}
        .dropdown .item{padding:8px 10px;cursor:pointer}
        .dropdown .item:hover{background:#f3f4f6}

        @media (max-width: 980px){
          .content,.content.sm,.content.lg{grid-template-columns:1fr}
          .panel{min-height:auto}
        }
      `}</style>
    </div>
  );
}