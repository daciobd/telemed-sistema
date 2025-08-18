// client/src/EnhancedConsultation.tsx
// Página "Consulta Avançada" – Vite + React (sem Next), visual clean pastel
// Requisitos: nenhuma lib extra além de React (usa apenas CSS-in-file com <style>)

import React, { useMemo, useState, useEffect } from 'react';

// Analytics global interface
declare global {
  interface Window {
    telemeDashboardAnalytics?: {
      trackEvent: (event: string, data: any) => void;
    };
    telemedDebug?: {
      testBanner: () => void;
      testModal: () => void;
      showModal: () => void;
      hideModal: () => void;
    };
  }
}

// Paleta / tokens compartilhados
const globalStyles = `
  :root{
    --bg:#F6F8FB; --text:#1F2937; --muted:#6B7280; --card:#FFFFFF;
    --shadow:0 2px 8px rgba(0,0,0,.05); --radius:12px; --pad:24px;
    --primary:#A2D2FF; --primary-600:#8AB8E6; --lavender:#CDB4DB; --border:1px solid rgba(0,0,0,.06);
  }
  *{box-sizing:border-box}
  html,body,#root{height:100%}
  body{margin:0;font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;color:var(--text);background:linear-gradient(180deg,#F9FBFF 0%, var(--bg) 100%)}
`;

const styles = `
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

  /* Video/Chamado */
  .videoArea{height:380px;border-radius:14px;background:linear-gradient(135deg, rgba(162,210,255,.28), rgba(205,180,219,.26));
    display:grid;place-items:center;border:1px dashed rgba(0,0,0,.08)}
  .videoToolbar{display:flex;gap:10px;margin-top:12px}

  /* Editor/Prescrição */
  .group{display:flex;gap:12px;flex-wrap:wrap}
  .input, .textarea{width:100%;border:1px solid rgba(0,0,0,.08);border-radius:12px;padding:12px 14px;font-size:14px;background:#fff;box-shadow:0 1px 0 rgba(0,0,0,.02) inset}
  .textarea{min-height:110px;resize:vertical}
  .tags{display:flex;flex-wrap:wrap;gap:8px}
  .tag{padding:6px 10px;border-radius:999px;background:rgba(162,210,255,.22);border:1px solid rgba(162,210,255,.45);font-size:12px}

  /* Lateral do Paciente */
  .patientCard{display:flex;gap:12px;align-items:center;margin-bottom:10px}
  .avatar{width:46px;height:46px;border-radius:999px;background:linear-gradient(135deg, #E0F2FE, #EDE9FE);display:grid;place-items:center;font-weight:700}
  .pill{border-radius:999px;border:1px solid rgba(0,0,0,.08);padding:6px 10px;background:#fff;font-size:12px}
  .vitals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .vital{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:10px;padding:10px}

  .list{display:flex;flex-direction:column;gap:8px}
  .list .item{display:flex;justify-content:space-between;gap:8px}

  /* Banner do novo dashboard */
  .new-dashboard-banner{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);margin:15px 15px 25px 15px;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(102,126,234,0.2);position:relative;animation:slideIn 0.5s ease-out;z-index:100;width:calc(100% - 30px)}
  @keyframes slideIn{from{transform:translateY(-10px);opacity:0}to{transform:translateY(0);opacity:1}}
  .banner-content{display:flex;align-items:center;padding:20px;color:white;position:relative;z-index:2}
  .banner-icon{font-size:32px;margin-right:15px;animation:bounce 2s infinite}
  @keyframes bounce{0%,20%,50%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}60%{transform:translateY(-3px)}}
  .banner-text{flex:1}
  .banner-text h4{margin:0 0 5px 0;font-size:18px;font-weight:600}
  .banner-text p{margin:0;font-size:14px;opacity:0.9}
  .banner-actions{display:flex;gap:10px;align-items:center}
  .btn-test{background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);color:white;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:500;transition:all 0.3s ease;backdrop-filter:blur(10px)}
  .btn-test:hover{background:rgba(255,255,255,0.3);transform:translateY(-1px)}
  .btn-dismiss{background:transparent;border:1px solid rgba(255,255,255,0.3);color:white;padding:8px 12px;border-radius:6px;cursor:pointer;font-size:16px;transition:all 0.3s ease}
  .btn-dismiss:hover{background:rgba(255,255,255,0.1)}
  .banner-progress{height:3px;background:rgba(255,255,255,0.2);position:relative}
  .progress-bar{height:100%;background:rgba(255,255,255,0.6);width:0;transition:width 0.3s ease}
  
  /* Modal de feedback */
  .feedback-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);backdrop-filter:blur(5px);display:none;align-items:center;justify-content:center;z-index:10000}
  .feedback-modal.show{display:flex}
  .feedback-content{background:white;border-radius:16px;max-width:480px;width:90%;max-height:90vh;overflow-y:auto;animation:modalSlideUp 0.4s ease-out}
  @keyframes modalSlideUp{from{transform:translateY(20px) scale(0.95);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
  .feedback-header{padding:24px 24px 0;display:flex;justify-content:space-between;align-items:center}
  .feedback-header h3{margin:0;color:#333}
  .close-btn{background:none;border:none;font-size:20px;cursor:pointer;color:#999;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center}
  .close-btn:hover{background:#f5f5f5}
  .feedback-form{padding:20px 24px 24px}
  .rating-section,.feedback-quick,.feedback-text{margin-bottom:24px}
  .rating-section label,.feedback-quick label,.feedback-text label{display:block;margin-bottom:12px;font-weight:600;color:#333}
  .star-rating{display:flex;gap:8px}
  .star{font-size:28px;color:#ddd;cursor:pointer;transition:all 0.2s ease}
  .star:hover,.star.active{color:#ffd700;transform:scale(1.1)}
  .quick-options{display:flex;gap:8px;flex-wrap:wrap}
  .quick-btn{background:#f8f9fa;border:1px solid #e9ecef;padding:8px 12px;border-radius:20px;cursor:pointer;font-size:13px;transition:all 0.2s ease}
  .quick-btn:hover,.quick-btn.selected{background:#667eea;color:white;border-color:#667eea}
  .user-comments{width:100%;min-height:80px;padding:12px;border:1px solid #ddd;border-radius:8px;resize:vertical;font-family:inherit;box-sizing:border-box}
  .feedback-actions{display:flex;gap:12px;justify-content:flex-end}
  .btn-skip{background:#f8f9fa;border:1px solid #dee2e6;color:#6c757d;padding:10px 20px;border-radius:8px;cursor:pointer}
  .btn-submit{background:#667eea;border:none;color:white;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:500}
  .btn-submit:hover{background:#5a67d8}

  /* Responsivo */
  @media (max-width:1200px){ .grid{grid-template-columns:1fr} .videoArea{height:300px} }
  @media (max-width:768px){.banner-content{flex-direction:column;text-align:center;gap:15px}.banner-actions{width:100%;justify-content:center}.feedback-content{width:95%;margin:10px}}
`;

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand"><div className="logo">TM</div> TeleMed</div>
      <div className="section-title">Menu</div>
      <nav className="nav">
        <a href="/" className="">🏠 Dashboard</a>
        <a href="/enhanced" className="active">🩺 Consulta Avançada</a>
      </nav>
      <div className="section-title">Ações Rápidas</div>
      <div className="group">
        <button className="btn primary">Nova Consulta</button>
        <button className="btn secondary">Novo Paciente</button>
      </div>
      <style>{styles}</style>
    </aside>
  );
}

export default function EnhancedConsultation(){
  const [chiefComplaint, setChief] = useState('Cefaleia e náusea há 2 dias');
  const [notes, setNotes] = useState('S: Dor latejante, piora com luz. O: PA 120/80, FC 78, afebril. A: Enxaqueca prov. P: Dipirona 500mg se dor, hidratação, repouso.');
  const [rx, setRx] = useState('Dipirona 500mg, 1cp VO a cada 6-8h se dor. Max 4x/dia por 3 dias.');
  
  // Analytics state (banner removed from this page)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [selectedQuickOptions, setSelectedQuickOptions] = useState<string[]>([]);
  const [userComments, setUserComments] = useState('');

  // Initialize analytics and banner system
  useEffect(() => {
    // Setup analytics
    if (!window.telemeDashboardAnalytics) {
      window.telemeDashboardAnalytics = {
        trackEvent: function(event: string, data: any) {
          console.log('📊 Analytics:', event, data);
          const events = JSON.parse(localStorage.getItem('telemed_analytics') || '[]');
          events.push({
            event,
            data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            page: window.location.pathname
          });
          if (events.length > 1000) events.splice(0, events.length - 1000);
          localStorage.setItem('telemed_analytics', JSON.stringify(events));
          if (typeof (window as any).gtag !== 'undefined') {
            (window as any).gtag('event', event, data);
          }
        }
      };
    }

    // Setup debug functions
    window.telemedDebug = {
      testBanner: () => setShowBanner(true),
      testModal: () => setShowFeedbackModal(true),
      showModal: () => setShowFeedbackModal(true),
      hideModal: () => setShowFeedbackModal(false)
    };

    // Banner removed from this page - will be added to main dashboard

    console.log('🚀 Enhanced Consultation carregada com analytics');
  }, []);

  const allergies = ['Dipirona (leve)', 'Ibuprofeno'];
  const conditions = ['HAS', 'Rinite alérgica'];

  const vitals = useMemo(() => ([
    { k: 'PA', v: '120/80' },
    { k: 'FC', v: '78 bpm' },
    { k: 'Temp', v: '36.7°C' },
    { k: 'SpO₂', v: '98%' },
  ]), []);

  // Banner handlers removed - moved to main dashboard

  // Feedback handlers
  const handleStarClick = (rating: number) => {
    setCurrentRating(rating);
    console.log('⭐ Rating selecionado:', rating);
  };

  const handleQuickOptionToggle = (value: string) => {
    if (selectedQuickOptions.includes(value)) {
      setSelectedQuickOptions(prev => prev.filter(opt => opt !== value));
    } else {
      setSelectedQuickOptions(prev => [...prev, value]);
    }
  };

  const handleSubmitFeedback = () => {
    const feedback = {
      rating: currentRating,
      quickOptions: selectedQuickOptions,
      comments: userComments,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    console.log('📝 Feedback enviado:', feedback);
    const feedbacks = JSON.parse(localStorage.getItem('telemed_feedbacks') || '[]');
    feedbacks.push(feedback);
    localStorage.setItem('telemed_feedbacks', JSON.stringify(feedbacks));
    window.telemeDashboardAnalytics?.trackEvent('feedback_submitted', {
      rating: currentRating,
      hasComments: !!userComments,
      optionsCount: selectedQuickOptions.length
    });
    setShowFeedbackModal(false);
    localStorage.setItem('telemed_feedback_given', 'true');
  };

  return (
    <div className="page">
      <Sidebar/>
      
      {/* Banner removed - moved to main dashboard page */}

      <main>
        <div className="topbar">
          <div className="search">
            <span>🔎</span>
            <input placeholder="Buscar paciente, CPF, ID ou sintomas" />
          </div>
          <button className="btn secondary" onClick={()=>location.href='/'}>Voltar ao Dashboard</button>
          <style>{styles}</style>
        </div>

        <section className="grid">
          {/* Coluna 1: Video e arquivos */}
          <div className="card">
            <h3>Teleconsulta</h3>
            <p className="meta">Conecte áudio/vídeo e compartilhe arquivos com o paciente</p>
            <div className="videoArea">📹 Área de vídeo / tela compartilhada</div>
            <div className="videoToolbar">
              <button className="btn primary">Conectar</button>
              <button className="btn secondary">Compartilhar Tela</button>
              <button className="btn secondary">Enviar Arquivo</button>
            </div>
          </div>

          {/* Coluna 2: Evolução / Prescrição */}
          <div className="card">
            <h3>Evolução clínica</h3>
            <p className="meta">Modelo SOAP com IA opcional</p>
            <div className="group">
              <input className="input" value={chiefComplaint} onChange={e=>setChief(e.target.value)} placeholder="Queixa principal"/>
              <textarea className="textarea" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notas clínicas (S/O/A/P)"></textarea>
            </div>
            <div style={{height:8}}/>
            <h3>Prescrição</h3>
            <p className="meta">Medicamentos / posologia</p>
            <textarea className="textarea" value={rx} onChange={e=>setRx(e.target.value)} placeholder="Prescrição"></textarea>
            <div style={{display:'flex',gap:10,marginTop:12,flexWrap:'wrap'}}>
              <button className="btn primary">Salvar Evolução</button>
              <button className="btn secondary">Gerar via IA</button>
              <button className="btn secondary">Imprimir/Salvar PDF</button>
            </div>
          </div>

          {/* Coluna 3: Dados do Paciente */}
          <div className="card">
            <div className="patientCard">
              <div className="avatar">JS</div>
              <div>
                <strong>João Santos</strong>
                <div className="meta">35 anos • M • 68 kg • 1,75 m</div>
              </div>
            </div>
            <div className="tags" style={{marginBottom:12}}>
              {conditions.map((c)=> <span key={c} className="tag">{c}</span>)}
            </div>

            <h3>Dados vitais</h3>
            <div className="vitals">
              {vitals.map((v)=> (
                <div key={v.k} className="vital"><div className="meta">{v.k}</div><div style={{fontWeight:700}}>{v.v}</div></div>
              ))}
            </div>
            <div style={{height:12}}/>

            <h3>Alergias</h3>
            <div className="list">
              {allergies.map((a)=> (
                <div key={a} className="item"><span>{a}</span><span className="pill">registrada</span></div>
              ))}
            </div>
            <div style={{height:12}}/>

            <h3>Exames recentes</h3>
            <div className="list">
              <div className="item"><span>Hemograma completo</span><span className="pill">PDF</span></div>
              <div className="item"><span>Glicemia jejum</span><span className="pill">89 mg/dL</span></div>
              <div className="item"><span>Perfil lipídico</span><span className="pill">ok</span></div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Feedback */}
      {showFeedbackModal && (
        <div className="feedback-modal show">
          <div className="feedback-content">
            <div className="feedback-header">
              <h3>💬 Como foi sua experiência?</h3>
              <button onClick={() => setShowFeedbackModal(false)} className="close-btn">×</button>
            </div>
            
            <div className="feedback-form">
              <div className="rating-section">
                <label>Avalie o novo dashboard:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <span 
                      key={rating}
                      className={`star ${rating <= currentRating ? 'active' : ''}`}
                      onClick={() => handleStarClick(rating)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="feedback-quick">
                <label>O que mais gostou?</label>
                <div className="quick-options">
                  {[
                    { value: 'design', label: '🎨 Design' },
                    { value: 'speed', label: '⚡ Velocidade' },
                    { value: 'navigation', label: '🧭 Navegação' },
                    { value: 'mobile', label: '📱 Mobile' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`quick-btn ${selectedQuickOptions.includes(option.value) ? 'selected' : ''}`}
                      onClick={() => handleQuickOptionToggle(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="feedback-text">
                <label>Comentários (opcional):</label>
                <textarea 
                  className="user-comments"
                  value={userComments}
                  onChange={(e) => setUserComments(e.target.value)}
                  placeholder="Conte o que achou e sugestões de melhoria..."
                />
              </div>
              
              <div className="feedback-actions">
                <button onClick={() => setShowFeedbackModal(false)} className="btn-skip">
                  Pular
                </button>
                <button onClick={handleSubmitFeedback} className="btn-submit">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{globalStyles}</style>
      <style>{styles}</style>
    </div>
  );
}