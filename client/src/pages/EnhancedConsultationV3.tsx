// client/src/pages/EnhancedConsultationV3.tsx
import React, { useState, useRef, useEffect } from 'react';
import DrAIPanel from '../components/DrAIPanel';

// Enhanced Consultation – v3 with complete functionality
export default function EnhancedConsultationV3() {
  // State management
  const [currentTab, setCurrentTab] = useState<'conduta' | 'exames' | 'memed'>('conduta');
  const [videoActive, setVideoActive] = useState(false);
  const [consultationTimer, setConsultationTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [hda, setHda] = useState('');
  const [hipotese, setHipotese] = useState('');
  const [conduta, setConduta] = useState('');
  const [complexidade, setComplexidade] = useState(false);
  const [sinaisAlerta, setSinaisAlerta] = useState('');
  const [examesList, setExamesList] = useState<any[]>([]);
  const [receitasList, setReceitasList] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [aiOpen, setAiOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive) {
      interval = setInterval(() => {
        setConsultationTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Video functions
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setVideoActive(true);
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Erro ao acessar câmera/microfone');
    }
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setVideoActive(false);
  };

  // Screenshot function
  const takeScreenshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const link = document.createElement('a');
        link.download = `screenshot-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  // Context gathering for Dr. AI
  const gatherContext = () => {
    return [
      `Paciente: Ana Costa Silva (consulta demo)`,
      `HDA: ${hda || "(vazio)"}`,
      `Hipótese diagnóstica: ${hipotese || "(vazio)"}`,
      `Sinais de alerta: ${sinaisAlerta || "(nenhum)"}`,
      `Plano/Conduta atual: ${conduta || "(rascunho)"}`
    ].join("\n");
  };

  // Insert AI response into plan
  const insertToPlan = (text: string) => {
    setConduta((prev) => (prev ? `${prev}\n\n${text}` : text));
  };

  // Save consultation
  const saveConsultation = async () => {
    const consultData = {
      hda,
      hipotese,
      conduta,
      complexidade,
      sinaisAlerta,
      duracao: consultationTimer
    };
    
    try {
      const response = await fetch('/api/consults/123/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultData)
      });
      
      if (response.ok) {
        alert('Consulta salva com sucesso!');
      } else {
        alert('Erro ao salvar consulta');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar consulta');
    }
  };

  // Finalize consultation
  const finalizeConsultation = () => {
    if (confirm('Deseja finalizar a consulta?')) {
      setIsTimerActive(false);
      stopVideo();
      alert('Consulta finalizada!');
    }
  };

  // CID-10 autocomplete data (sample)
  const cid10Options = [
    'M79.3 - Paniculite, não especificada',
    'K59.0 - Constipação',
    'J06.9 - Infecção aguda das vias aéreas superiores, não especificada',
    'R50.9 - Febre, não especificada',
    'M25.5 - Dor articular',
    'K30 - Dispepsia funcional',
    'R51 - Cefaleia',
    'F41.1 - Transtorno de ansiedade generalizada'
  ];

  return (
    <div className="consultation-container">
      {/* Topbar */}
      <div className="topbar">
        <div className="patient-info">
          <div className="patient-avatar">JS</div>
          <div className="patient-details">
            <h3>João Santos</h3>
            <span>35 anos • M • Consulta Online</span>
          </div>
        </div>
        
        <div className="consultation-status">
          <div className="status-indicator active">
            <div className="status-dot"></div>
            <span>Em consulta</span>
          </div>
          <div className="timer">
            <span>{formatTime(consultationTimer)}</span>
          </div>
        </div>

        <div className="topbar-actions">
          <button className="btn-secondary" onClick={() => alert('Convidar participante')}>
            <span>👥</span> Convidar
          </button>
          <button 
            className={`btn-primary ${isTimerActive ? 'active' : ''}`}
            onClick={() => setIsTimerActive(!isTimerActive)}
          >
            {isTimerActive ? 'Pausar' : 'Iniciar consulta'}
          </button>
          <button className="btn-secondary" onClick={() => window.history.back()}>
            Voltar
          </button>
          <button className="btn-secondary" onClick={() => alert('Formulário')}>
            Formulário
          </button>
          <button className="btn-secondary" onClick={() => alert('Ajustar largura')}>
            Largura
          </button>
          <button className="btn-danger" onClick={finalizeConsultation}>
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Video Panel */}
        <div className="video-section">
          <div className="video-container">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline
              className={`video-element ${!videoActive ? 'placeholder' : ''}`}
            />
            {!videoActive && (
              <div className="video-placeholder">
                <span>📹</span>
                <p>Câmera desligada</p>
              </div>
            )}
          </div>

          {/* Video Actions Bar */}
          <div className="video-actions">
            <button className="action-btn" onClick={() => alert('Anexar arquivo')}>
              <span>📎</span>
            </button>
            <button className="action-btn" onClick={takeScreenshot}>
              <span>📷</span>
            </button>
            <button className="action-btn" onClick={() => alert('Chat')}>
              <span>💬</span>
            </button>
            <button className="action-btn" onClick={() => alert('Notificações')}>
              <span>🔔</span>
            </button>
            <button className="action-btn brain-btn" onClick={() => setAiOpen(true)} title="Abrir Dr. AI">
              <span>🧠</span>
            </button>
            <button className="action-btn" onClick={() => alert('Microfone')}>
              <span>🎤</span>
            </button>
            <button 
              className={`action-btn ${videoActive ? 'active' : ''}`}
              onClick={videoActive ? stopVideo : startVideo}
            >
              <span>{videoActive ? '📹' : '📹'}</span>
            </button>
            <button className="action-btn" onClick={() => alert('Enviar para espera')}>
              <span>⏸️</span>
            </button>
            <button className="action-btn danger" onClick={finalizeConsultation}>
              <span>🏁</span>
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section">
          {/* HDA and Hipótese */}
          <div className="form-group">
            <label>História da Doença Atual (HDA)</label>
            <textarea 
              value={hda}
              onChange={(e) => setHda(e.target.value)}
              placeholder="Descreva a história clínica do paciente..."
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label>Hipótese Diagnóstica (CID-10)</label>
            <input
              type="text"
              value={hipotese}
              onChange={(e) => setHipotese(e.target.value)}
              placeholder="Digite para buscar CID-10..."
              className="form-input"
              list="cid10-options"
            />
            <datalist id="cid10-options">
              {cid10Options.map((option, index) => (
                <option key={index} value={option} />
              ))}
            </datalist>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab ${currentTab === 'conduta' ? 'active' : ''}`}
                onClick={() => setCurrentTab('conduta')}
              >
                Conduta
              </button>
              <button 
                className={`tab ${currentTab === 'exames' ? 'active' : ''}`}
                onClick={() => setCurrentTab('exames')}
              >
                Exames
              </button>
              <button 
                className={`tab ${currentTab === 'memed' ? 'active' : ''}`}
                onClick={() => setCurrentTab('memed')}
              >
                MedMed
              </button>
            </div>

            <div className="tabs-content">
              {/* Conduta Tab */}
              {currentTab === 'conduta' && (
                <div className="tab-content">
                  <div className="form-group">
                    <label>Conduta *</label>
                    <textarea
                      value={conduta}
                      onChange={(e) => setConduta(e.target.value)}
                      placeholder="Descreva a conduta médica..."
                      className="form-textarea"
                      required
                    />
                  </div>

                  <div className="form-toggles">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={complexidade}
                        onChange={(e) => setComplexidade(e.target.checked)}
                      />
                      <span>Complexidade aumentada</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Sinais de Alerta</label>
                    <textarea
                      value={sinaisAlerta}
                      onChange={(e) => setSinaisAlerta(e.target.value)}
                      placeholder="Descreva sinais de alerta para o paciente..."
                      className="form-textarea"
                    />
                  </div>
                </div>
              )}

              {/* Exames Tab */}
              {currentTab === 'exames' && (
                <div className="tab-content">
                  <div className="exames-header">
                    <h4>Solicitar Exames</h4>
                    <select className="form-select">
                      <option value="">Escolha um template</option>
                      <option value="rotina">Exames de Rotina</option>
                      <option value="cardiaco">Check-up Cardíaco</option>
                      <option value="metabolico">Perfil Metabólico</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Prioridade</label>
                    <select className="form-select">
                      <option value="rotina">Rotina</option>
                      <option value="prioritario">Prioritário</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Instruções para o Exame</label>
                    <textarea
                      placeholder="Instruções específicas..."
                      className="form-textarea"
                    />
                  </div>

                  <div className="exames-list">
                    <h5>Exames Solicitados</h5>
                    {examesList.length === 0 ? (
                      <p className="empty-state">Nenhum exame solicitado</p>
                    ) : (
                      examesList.map((exame, index) => (
                        <div key={index} className="exame-item">
                          <span>{exame.nome}</span>
                          <button onClick={() => setExamesList(prev => prev.filter((_, i) => i !== index))}>
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* MedMed Tab */}
              {currentTab === 'memed' && (
                <div className="tab-content">
                  <div className="memed-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => window.open('https://memed.com.br/?demo=1&integration=telemed', '_blank')}
                    >
                      📝 Nova Receita
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        const novaReceita = {
                          id: Date.now(),
                          medicamentos: ['Dipirona 500mg', 'Omeprazol 20mg'],
                          status: 'Assinada',
                          data: new Date().toLocaleString()
                        };
                        setReceitasList(prev => [...prev, novaReceita]);
                      }}
                    >
                      ✅ Simular Receita Assinada
                    </button>
                  </div>

                  <div className="receitas-list">
                    <h5>Receitas da Consulta</h5>
                    {receitasList.length === 0 ? (
                      <p className="empty-state">Nenhuma receita criada</p>
                    ) : (
                      receitasList.map((receita, index) => (
                        <div key={index} className="receita-item">
                          <div className="receita-info">
                            <strong>Receita #{receita.id}</strong>
                            <p>{receita.medicamentos.join(', ')}</p>
                            <small>{receita.data} - {receita.status}</small>
                          </div>
                          <button onClick={() => setReceitasList(prev => prev.filter((_, i) => i !== index))}>
                            🗑️
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="form-actions">
            <button className="btn-primary" onClick={saveConsultation}>
              💾 Salvar
            </button>
            <button className="btn-success" onClick={finalizeConsultation}>
              🏁 Finalizar
            </button>
          </div>
        </div>
      </div>

      {/* Dr. AI Panel */}
      <DrAIPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        consultId="CONSULT-123"
        gatherContext={gatherContext}
        onInsertToPlan={insertToPlan}
      />

      {/* CSS Styles */}
      <style>{`
        .consultation-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: white;
          border-bottom: 1px solid #e9ecef;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .patient-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .patient-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
        }

        .patient-details h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .patient-details span {
          color: #6b7280;
          font-size: 14px;
        }

        .consultation-status {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
        }

        .status-indicator.active {
          background: #dcfce7;
          border-color: #bbf7d0;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .timer {
          font-family: 'Monaco', monospace;
          font-size: 18px;
          font-weight: 600;
          color: #374151;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary, .btn-secondary, .btn-danger, .btn-success {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-primary.active {
          background: #10b981;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-success {
          background: #10b981;
          color: white;
        }

        .btn-success:hover {
          background: #059669;
        }

        .main-content {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 24px;
          padding: 24px;
          max-height: calc(100vh - 88px);
          overflow: hidden;
        }

        .video-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .video-container {
          position: relative;
          height: 320px;
          background: #000;
        }

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .video-placeholder span {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .video-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: none;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }

        .action-btn:hover {
          background: #f8f9fa;
          transform: translateY(-1px);
        }

        .action-btn.brain-btn:hover {
          background: #F3F8FF;
          box-shadow: 0 4px 12px rgba(162,210,255,0.3);
        }

        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.12);
        }

        .action-btn.active {
          background: #10b981;
          color: white;
        }

        .action-btn.danger {
          background: #fef2f2;
          color: #ef4444;
        }

        .form-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          padding: 24px;
          overflow-y: auto;
          max-height: calc(100vh - 136px);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
        }

        .form-input, .form-textarea, .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .tabs-container {
          margin-top: 24px;
        }

        .tabs-header {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .tab:hover {
          color: #374151;
        }

        .tabs-content {
          padding: 24px 0;
        }

        .form-toggles {
          margin: 16px 0;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .toggle-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
        }

        .exames-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .exames-header h4 {
          margin: 0;
        }

        .exames-list, .receitas-list {
          margin-top: 20px;
        }

        .exames-list h5, .receitas-list h5 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          color: #6b7280;
          padding: 40px 20px;
          font-style: italic;
        }

        .exame-item, .receita-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .receita-info strong {
          display: block;
          font-size: 14px;
          font-weight: 600;
        }

        .receita-info p {
          margin: 4px 0;
          font-size: 14px;
          color: #374151;
        }

        .receita-info small {
          color: #6b7280;
          font-size: 12px;
        }

        .memed-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
            max-height: none;
          }

          .topbar-actions {
            flex-wrap: wrap;
          }

          .consultation-container {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}