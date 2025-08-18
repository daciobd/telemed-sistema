// client/src/EnhancedConsultation.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Banner, FeedbackModal, registerDebug, trackEvent } from './lib/telemed-ux';

function useQueryId(param: string, fallback = '123') {
  const [id] = useState(() => new URLSearchParams(location.search).get(param) || fallback);
  return id;
}

// ================= Video simples (getUserMedia) =================
function VideoPanel() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      trackEvent('video_started', {});
    } catch (e) {
      alert('Falha ao acessar câmera/microfone');
      trackEvent('video_error', { message: String(e) });
    }
  }
  function stop() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    trackEvent('video_stopped', {});
  }

  return (
    <div>
      <div style={{ height: 320, borderRadius: 14, background: 'linear-gradient(135deg, rgba(162,210,255,.28), rgba(205,180,219,.26))', display: 'grid', placeItems: 'center', border: '1px dashed rgba(0,0,0,.08)', overflow: 'hidden' }}>
        <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button className="btn primary" onClick={start}>Conectar</button>
        <button className="btn secondary" onClick={stop}>Desconectar</button>
      </div>
    </div>
  );
}

// ================= Tipos =================
interface PatientInfo {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F' | 'O';
  weight?: string; height?: string;
  conditions?: string[];
  allergies?: string[];
  vitals?: { [k: string]: string };
}

interface ExamItem { id: string; name: string; kind: string; value?: string; url?: string }

// ================= Página =================
export default function EnhancedConsultation() {
  const consultId = useQueryId('consultId', 'c-001');
  const patientId = useQueryId('patientId', 'p-001');

  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [chiefComplaint, setChief] = useState('Cefaleia e náusea há 2 dias');
  const [notes, setNotes] = useState('S: Dor latejante, piora com luz. O: PA 120/80, FC 78, afebril. A: Enxaqueca prov. P: Dipirona 500mg se dor.');
  const [rx, setRx] = useState('Dipirona 500mg, 1cp VO a cada 6-8h se dor.');

  const [openFeedback, setOpenFeedback] = useState(false);

  useEffect(() => {
    trackEvent('enhanced_opened', { consultId, patientId });
    registerDebug(() => setOpenFeedback(true), () => setOpenFeedback(false));
  }, [consultId, patientId]);

  // Carregar paciente
  useEffect(() => {
    fetch(`/api/patients/${patientId}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setPatient)
      .catch(() => {
        // fallback demo
        setPatient({ id: patientId, name: 'João Santos', age: 35, sex: 'M', weight: '68 kg', height: '1,75 m',
          conditions: ['HAS', 'Rinite alérgica'], allergies: ['Dipirona (leve)', 'Ibuprofeno'],
          vitals: { PA: '120/80', FC: '78 bpm', Temp: '36.7°C', 'SpO₂': '98%' } });
      });
  }, [patientId]);

  // Carregar exames (ex.: Fleury ou sua API)
  useEffect(() => {
    fetch(`/api/patients/${patientId}/exams`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((arr: ExamItem[]) => setExams(arr))
      .catch(() => setExams([
        { id: 'e1', name: 'Hemograma completo', kind: 'pdf', url: '#' },
        { id: 'e2', name: 'Glicemia jejum', kind: 'value', value: '89 mg/dL' },
        { id: 'e3', name: 'Perfil lipídico', kind: 'status', value: 'OK' }
      ]));
  }, [patientId]);

  async function saveNotes() {
    const body = { chiefComplaint, notes };
    const r = await fetch(`/api/consults/${consultId}/notes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) { trackEvent('notes_saved', { consultId }); alert('Evolução salva!'); }
    else { alert('Falha ao salvar evolução'); }
  }

  async function saveRx() {
    const body = { prescription: rx };
    const r = await fetch(`/api/consults/${consultId}/prescriptions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) { trackEvent('prescription_saved', { consultId }); alert('Prescrição salva!'); }
    else { alert('Falha ao salvar prescrição'); }
  }

  async function generateAI() {
    const r = await fetch(`/api/ai/consult-notes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chiefComplaint, notes }) });
    if (r.ok) {
      const j = await r.json();
      setNotes(j.suggestion || notes);
      trackEvent('ai_notes_generated', {});
    } else {
      alert('Endpoint de IA não encontrado; mantendo texto atual.');
    }
  }

  const vitals = useMemo(() => {
    const v = patient?.vitals || { PA: '120/80', FC: '78 bpm', Temp: '36.7°C', 'SpO₂': '98%' };
    return Object.entries(v).map(([k, val]) => ({ k, v: val }));
  }, [patient]);

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="brand"><div className="logo">TM</div> TeleMed</div>
        <div className="section-title">Menu</div>
        <nav className="nav">
          <a href="/">🏠 Dashboard</a>
          <a href="/enhanced" className="active">🩺 Consulta Avançada</a>
        </nav>
        <div className="section-title">Ações Rápidas</div>
        <div className="group">
          <button className="btn primary" onClick={() => trackEvent('quick_new_consult', {})}>Nova Consulta</button>
          <button className="btn secondary" onClick={() => trackEvent('quick_new_patient', {})}>Novo Paciente</button>
        </div>
      </aside>

      <main>
        <Banner onFeedback={() => setOpenFeedback(true)} />

        <div className="topbar">
          <div className="search"><span>🔎</span><input placeholder="Buscar paciente, CPF, ID ou sintomas" /></div>
          <button className="btn secondary" onClick={() => (location.href = '/')}>Voltar ao Dashboard</button>
        </div>

        <section className="grid">
          {/* Coluna 1: Vídeo */}
          <div className="card">
            <h3>Teleconsulta</h3>
            <p className="meta">Conecte áudio/vídeo e compartilhe arquivos com o paciente</p>
            <VideoPanel />
          </div>

          {/* Coluna 2: Evolução/Prescrição */}
          <div className="card">
            <h3>Evolução clínica</h3>
            <p className="meta">Modelo SOAP com IA opcional</p>
            <div className="group">
              <input className="input" value={chiefComplaint} onChange={e => setChief(e.target.value)} placeholder="Queixa principal" />
              <textarea className="textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas clínicas (S/O/A/P)" />
            </div>
            <div style={{ height: 8 }} />
            <h3>Prescrição</h3>
            <p className="meta">Medicamentos / posologia</p>
            <textarea className="textarea" value={rx} onChange={e => setRx(e.target.value)} placeholder="Prescrição" />
            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              <button className="btn primary" onClick={saveNotes}>Salvar Evolução</button>
              <button className="btn secondary" onClick={generateAI}>Gerar via IA</button>
              <button className="btn secondary" onClick={saveRx}>Salvar Prescrição</button>
            </div>
          </div>

          {/* Coluna 3: Paciente/Exames */}
          <div className="card">
            <div className="patientCard">
              <div className="avatar">{(patient?.name || 'J S').split(' ').map(p => p[0]).slice(0, 2).join('')}</div>
              <div>
                <strong>{patient?.name || 'João Santos'}</strong>
                <div className="meta">{patient?.age || 35} anos • {patient?.sex || 'M'} • {patient?.weight || '68 kg'} • {patient?.height || '1,75 m'}</div>
              </div>
            </div>

            {patient?.conditions && (
              <div className="tags" style={{ marginBottom: 12 }}>
                {patient.conditions.map(c => <span key={c} className="tag">{c}</span>)}
              </div>
            )}

            <h3>Dados vitais</h3>
            <div className="vitals">
              {vitals.map(v => (
                <div key={v.k} className="vital"><div className="meta">{v.k}</div><div style={{ fontWeight: 700 }}>{v.v}</div></div>
              ))}
            </div>
            <div style={{ height: 12 }} />

            {patient?.allergies && (
              <>
                <h3>Alergias</h3>
                <div className="list">
                  {patient.allergies.map(a => <div key={a} className="item"><span>{a}</span><span className="pill">registrada</span></div>)}
                </div>
                <div style={{ height: 12 }} />
              </>
            )}

            <h3>Exames recentes</h3>
            <div className="list">
              {exams.map(ex => (
                <div key={ex.id} className="item">
                  <span>{ex.name}</span>
                  {ex.kind === 'pdf' && ex.url && <a className="pill" href={ex.url} target="_blank">PDF</a>}
                  {ex.kind === 'value' && <span className="pill">{ex.value}</span>}
                  {ex.kind === 'status' && <span className="pill">{ex.value || 'ok'}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <FeedbackModal open={openFeedback} onClose={() => setOpenFeedback(false)} />

      {/* estilos compartilhados com o dashboard */}
      <style>{`
        :root{ --bg:#F6F8FB; --text:#1F2937; --muted:#6B7280; --card:#FFFFFF; --shadow:0 2px 8px rgba(0,0,0,.05); --radius:12px; --pad:24px; --primary:#A2D2FF; --primary-600:#8AB8E6; --lavender:#CDB4DB; --border:1px solid rgba(0,0,0,.06) }
        *{box-sizing:border-box} html,body,#root{height:100%}
        body{margin:0;font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;color:var(--text);background:linear-gradient(180deg,#F9FBFF 0%, var(--bg) 100%)}
        .page{display:flex}
        .sidebar{position:fixed;inset:0 auto 0 0;width:272px;background:#fff;box-shadow:var(--shadow);border-right:var(--border);padding:20px;display:flex;flex-direction:column;gap:16px}
        .brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:18px}
        .logo{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:var(--primary);color:#0F172A;font-weight:700}
        .section-title{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:8px 0 4px}
        .nav{display:flex;flex-direction:column;gap:6px}
        .nav a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;text-decoration:none;color:var(--text);transition:transform .15s ease, background .15s ease, opacity .15s ease}
        .nav a:hover{background:rgba(162,210,255,.18);opacity:.9}
        .nav a.active{background:rgba(162,210,255,.25);border:1px solid rgba(162,210,255,.6)}
        main{margin-left:272px;padding:32px;display:flex;flex-direction:column;gap:24px}
        .topbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .search{flex:1;min-width:260px;display:flex;align-items:center;gap:10px;background:#fff;border-radius:12px;padding:10px 14px;box-shadow:var(--shadow);border:var(--border)}
        .search input{border:none;outline:none;width:100%;font-size:14px}
        .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:12px;border:1px solid transparent;cursor:pointer;font-weight:600;transition:opacity .15s ease, transform .15s ease}
        .btn:hover{opacity:.9}
        .btn.primary{background:var(--primary);border-color:var(--primary)}
        .btn.primary:hover{background:var(--primary-600)}
        .btn.secondary{background:transparent;border:1px solid var(--primary);color:#0F172A}
        .grid{display:grid;grid-template-columns:1.6fr 1.4fr 1.1fr;gap:24px}
        .card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);border:var(--border);padding:var(--pad)}
        .card h3{margin:0 0 8px}
        .meta{color:var(--muted);font-size:12px;margin:0 0 12px}
        .group{display:flex;gap:12px;flex-wrap:wrap}
        .input,.textarea{width:100%;border:1px solid rgba(0,0,0,.08);border-radius:12px;padding:12px 14px;font-size:14px;background:#fff;box-shadow:0 1px 0 rgba(0,0,0,.02) inset}
        .textarea{min-height:110px;resize:vertical}
        .tags{display:flex;flex-wrap:wrap;gap:8px}
        .tag{padding:6px 10px;border-radius:999px;background:rgba(162,210,255,.22);border:1px solid rgba(162,210,255,.45);font-size:12px}
        .patientCard{display:flex;gap:12px;align-items:center;margin-bottom:10px}
        .avatar{width:46px;height:46px;border-radius:999px;background:linear-gradient(135deg,#E0F2FE,#EDE9FE);display:grid;place-items:center;font-weight:700}
        .pill{border-radius:999px;border:1px solid rgba(0,0,0,.08);padding:6px 10px;background:#fff;font-size:12px}
        .vitals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        .vital{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:10px;padding:10px}
        .list{display:flex;flex-direction:column;gap:8px}
        .list .item{display:flex;justify-content:space-between;gap:8px}
        @media (max-width:1200px){ .grid{grid-template-columns:1fr} }
      `}</style>
    </div>
  );
}