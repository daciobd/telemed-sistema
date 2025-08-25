// pages/dashboard-teste.jsx (Next.js) ou src/Dashboard.jsx (CRA)
// Dependências: npm i react chart.js
// Observação: uso direto do Chart.js (sem react-chartjs-2) + ResizeObserver para evitar charts com largura 0.

import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import Chart from "chart.js/auto";

// ---------- Hooks utilitários ----------
function useMeasure() {
  const ref = useRef(null);
  const [rect, setRect] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setRect({ width: r.width, height: r.height });
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, rect];
}

// ---------- Cores pastel ----------
const pastel = (a = 0.6) => `rgba(162,210,255,${a})`; // azul
const lavender = (a = 0.6) => `rgba(205,180,219,${a})`;

// ---------- Wrapper para Chart.js com sizing robusto ----------
function ChartCanvas({ type, data, options, height = 320, ariaLabel }) {
  const canvasRef = useRef(null);
  const [hostRef, rect] = useMeasure();
  const chartRef = useRef(null);

  // Garante largura/altura antes de instanciar o gráfico
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || rect.width === 0) return;
    if (chartRef.current) chartRef.current.destroy();
    el.setAttribute("width", String(Math.max(280, rect.width)));
    el.setAttribute("height", String(height));
    chartRef.current = new Chart(el, {
      type,
      data,
      options: { responsive: false, maintainAspectRatio: false, ...options },
    });
    return () => chartRef.current?.destroy();
  }, [rect.width, height, type, data, options]);

  return (
    <div ref={hostRef} className="chartHost" aria-label={ariaLabel}>
      <canvas ref={canvasRef} />
      <style jsx>{`
        .chartHost{width:100%; height:${height}px}
        canvas{max-width:100%; display:block}
      `}</style>
    </div>
  );
}

// ---------- Componentes UI ----------
function Icon({ path }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d={path} />
      <style jsx>{`
        .icon{width:18px;height:18px;flex:0 0 18px;display:inline-block}
      `}</style>
    </svg>
  );
}

// Ícones compostos para os cards de módulo (múltiplos paths)
function IconMulti({ paths = [], size = 22, strokeWidth = 2 }) {
  return (
    <svg
      className="micon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, i) => (<path key={i} d={d} />))}
      <style jsx>{`
        .micon{flex:0 0 auto;display:inline-block}
      `}</style>
    </svg>
  );
}

function Sidebar(){
  return (
    <aside className="sidebar">
      <div className="brand"><div className="logo">TM</div> TeleMed</div>
      <div className="section-title">Menu</div>
      <nav className="nav">
        <a className="active" href="#"><Icon path="M3 12l9-9 9 9 M9 21V9h6v12"/> Dashboard</a>
        <a href="#"><Icon path="M3 21v-1a5 5 0 0 1 5-5a5 5 0 0 1 5 5v1 M12 21v-1a5 5 0 0 1 5-5a5 5 0 0 1 5 5v1 M8 11a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 M16 11a3 3 0 1 0 0-6 a3 3 0 0 0 0 6"/> Pacientes</a>
        <a href="https://84622708-9db0-420a-a1f1-6a7a55403590-00-2d2fgen7wjybm.picard.replit.dev/agenda"><Icon path="M12 12c2.2 0 4-1.8 4-4S14.2 4 12 4 8 5.8 8 8s1.8 4 4 4z M20 20a8 8 0 10-16 0"/> Médicos</a>
        <a href="#analytics"><Icon path="M4 19V5 M10 19V9 M16 19V13 M22 19V3"/> Analytics</a>
        <a href="#prontuario"><Icon path="M4 6h12 M4 12h12 M4 18h12 M18 6h2v12h-2"/> Prontuário</a>
        <div className="section-title">Ações Rápidas</div>
        <div className="quick-actions">
          <button className="btn primary">Nova Consulta</button>
          <button className="btn secondary">Novo Paciente</button>
          <button className="btn secondary">Teleconsulta</button>
          <button className="btn secondary">Prescrição</button>
        </div>
      </nav>
      <style jsx>{styles}</style>
    </aside>
  )
}

function Topbar(){
  return (
    <div className="topbar">
      <div className="search">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
        <input placeholder="Buscar por pacientes, exames, sintomas…" />
      </div>
      <span className="chip">Período: Este ano</span>
      <span className="chip">Departamento: Todos</span>
      <span className="chip">Convênio: Todos</span>
      <style jsx>{styles}</style>
    </div>
  );
}

function KpiCard({title, value, delta, deltaType="neutral", data, colorFn}){
  const chartData = useMemo(()=>({
    labels: data.map((_,i)=>i+1),
    datasets:[{ data, fill:true, tension:.35, borderColor:colorFn(.9), backgroundColor:colorFn(.28), pointRadius:0, borderWidth:2 }]
  }), [data, colorFn]);
  return (
    <div className="card">
      <h4 className="kpi-title">{title}</h4>
      <div className="kpi-value">{value} {delta && (<span className={`delta ${deltaType}`}>{delta}</span>)}</div>
      <ChartCanvas type="line" data={chartData} options={{ plugins:{legend:{display:false}}, scales:{x:{display:false}, y:{display:false}} }} height={44} ariaLabel={title} />
      <style jsx>{styles}</style>
    </div>
  );
}

function Heatmap(){
  const dias = 7, horas = 24;
  const cells = [];
  for(let d=0; d<dias; d++){
    for(let h=0; h<horas; h++){
      const v = Math.random();
      const alpha = 0.18 + v*0.62;
      cells.push(<div key={`${d}-${h}`} className="hm-cell" style={{background:`rgba(162,210,255,${alpha.toFixed(2)})`}} />);
    }
  }
  return (
    <>
      <div className="heatmap">{cells}</div>
      <div className="hm-legend"><span>Baixa</span><span className="hm-swatch" style={{background:"rgba(162,210,255,.18)"}}/><span className="hm-swatch" style={{background:"rgba(162,210,255,.35)"}}/><span className="hm-swatch" style={{background:"rgba(162,210,255,.55)"}}/><span className="hm-swatch" style={{background:"rgba(162,210,255,.75)"}}/><span>Alta</span></div>
      <style jsx>{styles}</style>
    </>
  );
}

function Timeline(){
  return (
    <ul className="timeline">
      <li><span className="dot"></span><div className="item"><strong>Consulta concluída</strong> – João Santos<br/><span className="meta">Hoje • 14:20</span></div></li>
      <li><span className="dot"></span><div className="item"><strong>Prescrição enviada</strong> – Amoxil 500mg<br/><span className="meta">Hoje • 13:55</span></div></li>
      <li><span className="dot"></span><div className="item"><strong>Exame recebido</strong> – Hemograma (PDF)<br/><span className="meta">Ontem • 18:10</span></div></li>
      <li><span className="dot"></span><div className="item"><strong>Anotação clínica</strong> – Dor torácica leve<br/><span className="meta">Ontem • 10:42</span></div></li>
      <style jsx>{styles}</style>
    </ul>
  );
}

// ---------- Página ----------
export default function DashboardTeleMed(){
  // Dados de exemplo
  const horas = Array.from({length:24}, (_,i)=>`${String(i).padStart(2,'0')}:00`);
  const valsHoras = [4,6,8,3,2,1,1,2,4,6,10,12,14,16,18,15,13,12,11,10,8,7,6,5];

  const barrasHoras = useMemo(()=>({ labels:horas, datasets:[{ data:valsHoras, backgroundColor: pastel(.7), borderColor:'#8AB8E6', borderWidth:1, borderRadius:8, barThickness:6 }] }),[]);
  const barrasOptions = useMemo(()=>({ indexAxis:'y', plugins:{legend:{display:false}}, scales:{ x:{ grid:{display:false}, ticks:{color:'#6B7280'} }, y:{ grid:{display:false}, ticks:{color:'#6B7280', autoSkip:false, maxTicksLimit:24} } } }),[]);

  const npsData = useMemo(()=>({ labels:['S1','S2','S3','S4','S5','S6','S7','S8'], datasets:[{ label:'NPS', data:[72,74,71,75,78,80,79,82], borderColor:pastel(.95), backgroundColor:pastel(.3), borderWidth:2, pointRadius:3, tension:.35, fill:true }] }),[]);
  const npsOptions = useMemo(()=>({ plugins:{legend:{display:false}}, scales:{ x:{grid:{display:false}}, y:{grid:{color:'rgba(0,0,0,0.04)'}, suggestedMin:60, suggestedMax:90} } }),[]);

  const filaData = useMemo(()=>({ labels:['Crítica','Alta','Média','Baixa'], datasets:[{ data:[8,14,9,5], backgroundColor:[lavender(.75), pastel(.75), pastel(.55), lavender(.45)], borderColor:'#8AB8E6', borderWidth:1, barThickness:6, borderRadius:8 }] }),[]);
  const filaOptions = useMemo(()=>({ indexAxis:'y', plugins:{legend:{display:false}}, scales:{ x:{grid:{display:false}}, y:{grid:{display:false}} } }),[]);

  return (
    <div className="page">
      <Sidebar/>
      <main>
        <Topbar/>

        {/* Módulos do Sistema – 5 cards no topo */}
        <section className="modules">
          <a className="module-card" href="#agenda" title="Agenda do Dia">
            <div className="module-icon">
              <IconMulti size={22} paths={["M3 7h18","M7 3v4","M17 3v4","M5 7h14v12H5z"]}/>
            </div>
            <div>
              <h4 className="module-title">Agenda do Dia</h4>
              <ul className="module-list">
                <li>Timeline interativa</li>
                <li>Agendamento rápido</li>
                <li>Notificações em tempo real</li>
              </ul>
            </div>
          </a>
          <a className="module-card" href="#pacientes" title="Gestão de Pacientes">
            <div className="module-icon">
              <IconMulti size={22} paths={[
                "M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
                "M16 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
                "M2 22v-1a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v1",
                "M12 22v-1a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v1"
              ]}/>
            </div>
            <div>
              <h4 className="module-title">Gestão de Pacientes</h4>
              <ul className="module-list">
                <li>Cadastro completo</li>
                <li>Histórico médico</li>
                <li>Relatórios personalizados</li>
              </ul>
            </div>
          </a>
          <a className="module-card" href="#medico" title="Perfil do Médico">
            <div className="module-icon">
              <IconMulti size={22} paths={[
                "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z",
                "M12 8v8",
                "M8 12h8"
              ]}/>
            </div>
            <div>
              <h4 className="module-title">Perfil do Médico</h4>
              <ul className="module-list">
                <li>Dados profissionais</li>
                <li>Certificações</li>
                <li>Horários de trabalho</li>
              </ul>
            </div>
          </a>
          <a className="module-card" href="/demo-ativo/configuracoes.html" title="Configurações">
            <div className="module-icon">
              <IconMulti size={22} paths={[
                "M4 6h16",
                "M4 12h16",
                "M4 18h16",
                "M8 4v4",
                "M12 10v4",
                "M16 16v4"
              ]}/>
            </div>
            <div>
              <h4 className="module-title">Configurações</h4>
              <ul className="module-list">
                <li>Integrações</li>
                <li>Backup e segurança</li>
                <li>Logs do sistema</li>
              </ul>
            </div>
          </a>
          <a className="module-card" href="#demo" title="Demo Responsivo">
            <div className="module-icon">
              <IconMulti size={22} paths={[
                "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
                "M12 18h.01"
              ]}/>
            </div>
            <div>
              <h4 className="module-title">Demo Responsivo</h4>
              <ul className="module-list">
                <li>Simulador de dispositivos</li>
                <li>Performance otimizada</li>
                <li>Interface adaptativa</li>
              </ul>
            </div>
          </a>
        </section>

        <section className="kpis">
          <KpiCard title="Pacientes Cadastrados" value={847} delta="+3% vs. semana passada" deltaType="up" data={[10,12,11,13,14,15,14,16,18,17,19,21]} colorFn={pastel}/>
          <KpiCard title="Consultas Hoje" value={12} delta="-7% vs. ontem" deltaType="down" data={[9,8,10,7,8,6,7,6,7,5,6,5]} colorFn={lavender}/>
          <KpiCard title="Prescrições Pendentes" value={5} delta="meta: ≤ 4" data={[6,5,6,7,5,6,4,5,5,4,5,5]} colorFn={pastel}/>
          <KpiCard title="Avaliação Média" value={4.0} delta="+0.2 vs. mês anterior" deltaType="up" data={[3.6,3.7,3.8,3.7,3.9,4.0,3.9,4.1,4.0,4.2,4.1,4.0]} colorFn={lavender}/>
        </section>

        <section className="charts">
          <div className="chart-card">
            <h4>Pico de Consultas por Horário</h4>
            <ChartCanvas type="bar" data={barrasHoras} options={barrasOptions} height={320} ariaLabel="Consultas por horário"/>
          </div>
          <div className="chart-card">
            <h4>NPS – Satisfação do Paciente (Últimas 8 semanas)</h4>
            <ChartCanvas type="line" data={npsData} options={npsOptions} height={320} ariaLabel="Satisfação do paciente"/>
          </div>
          <div className="chart-card">
            <h4>Prioridade da Fila</h4>
            <ChartCanvas type="bar" data={filaData} options={filaOptions} height={320} ariaLabel="Prioridade da fila"/>
          </div>
        </section>

        <section className="bottom">
          <div className="card">
            <h4>Mapa de Calor – Atividade por Hora/Dia</h4>
            <Heatmap/>
          </div>
          <div className="card">
            <h4>Timeline de Atividades</h4>
            <Timeline/>
          </div>
        </section>

        <section className="bottom">
          <div className="card">
            <h4>Mapa de Calor – Atividade por Hora/Dia</h4>
            <Heatmap/>
          </div>
          <div className="card">
            <h4>Timeline de Atividades</h4>
            <Timeline/>
          </div>
        </section>

      </main>
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
  /* Reset e base */
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #fafbfc; }

  /* Layout principal */
  .page { display: flex; height: 100vh; }
  .sidebar { 
    width: 280px; background: linear-gradient(180deg, #1a1b23 0%, #2c2d39 100%); 
    color: #e4e5e9; display: flex; flex-direction: column; padding: 24px 20px; 
    box-shadow: 2px 0 12px rgba(0,0,0,0.08); 
  }
  main { 
    flex: 1; display: flex; flex-direction: column; padding: 24px; 
    overflow-y: auto; gap: 24px; 
  }

  /* Sidebar */
  .brand { 
    display: flex; align-items: center; gap: 12px; font-size: 20px; 
    font-weight: 700; margin-bottom: 32px; 
  }
  .logo { 
    width: 40px; height: 40px; background: linear-gradient(135deg, #6366f1, #8b5cf6); 
    border-radius: 8px; display: flex; align-items: center; justify-content: center; 
    font-weight: 800; font-size: 16px; color: white; 
  }
  .section-title { 
    font-size: 11px; text-transform: uppercase; letter-spacing: 1px; 
    color: #9ca3af; margin: 24px 0 12px; font-weight: 600; 
  }
  .nav a { 
    display: flex; align-items: center; gap: 12px; padding: 12px 16px; 
    border-radius: 8px; text-decoration: none; color: #d1d5db; 
    transition: all 0.2s; margin-bottom: 4px; 
  }
  .nav a:hover { background: rgba(255,255,255,0.1); color: white; }
  .nav a.active { background: #6366f1; color: white; }
  .quick-actions { margin-top: 16px; }
  .btn { 
    width: 100%; padding: 10px 16px; border: none; border-radius: 6px; 
    font-size: 13px; font-weight: 500; cursor: pointer; margin-bottom: 8px; 
    transition: all 0.2s; 
  }
  .btn.primary { background: #10b981; color: white; }
  .btn.primary:hover { background: #059669; }
  .btn.secondary { background: rgba(255,255,255,0.1); color: #d1d5db; }
  .btn.secondary:hover { background: rgba(255,255,255,0.2); }

  /* Topbar */
  .topbar { 
    display: flex; align-items: center; gap: 16px; padding: 16px 24px; 
    background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
    margin-bottom: 8px; 
  }
  .search { 
    display: flex; align-items: center; gap: 8px; background: #f9fafb; 
    border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 12px; flex: 1; 
  }
  .search input { 
    border: none; background: none; outline: none; flex: 1; font-size: 14px; 
  }
  .chip { 
    background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 20px; 
    padding: 6px 12px; font-size: 12px; color: #6b7280; white-space: nowrap; 
  }

  /* Módulos */
  .modules { 
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
    gap: 16px; margin-bottom: 8px; 
  }
  .module-card { 
    background: white; border-radius: 12px; padding: 20px; text-decoration: none; 
    box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; 
    transition: all 0.2s; display: flex; align-items: flex-start; gap: 16px; 
  }
  .module-card:hover { 
    box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(-2px); 
  }
  .module-icon { 
    width: 44px; height: 44px; background: linear-gradient(135deg, #e0f2fe, #b3e5fc); 
    border-radius: 10px; display: flex; align-items: center; justify-content: center; 
    color: #0277bd; flex-shrink: 0; 
  }
  .module-title { 
    font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 8px; 
  }
  .module-list { list-style: none; }
  .module-list li { 
    font-size: 13px; color: #6b7280; margin-bottom: 4px; 
    position: relative; padding-left: 12px; 
  }
  .module-list li::before { 
    content: '•'; position: absolute; left: 0; color: #9ca3af; 
  }

  /* KPIs */
  .kpis { 
    display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
    gap: 16px; margin-bottom: 8px; 
  }
  .card { 
    background: white; border-radius: 12px; padding: 20px; 
    box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; 
  }
  .kpi-title { 
    font-size: 14px; color: #6b7280; margin-bottom: 8px; font-weight: 500; 
  }
  .kpi-value { 
    font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 12px; 
    display: flex; align-items: baseline; gap: 8px; 
  }
  .delta { font-size: 12px; font-weight: 500; }
  .delta.up { color: #10b981; }
  .delta.down { color: #ef4444; }
  .delta.neutral { color: #6b7280; }

  /* Charts */
  .charts { 
    display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
    gap: 16px; margin-bottom: 8px; 
  }
  .chart-card { 
    background: white; border-radius: 12px; padding: 20px; 
    box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; 
  }
  .chart-card h4 { 
    font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 16px; 
  }

  /* Bottom section */
  .bottom { 
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px; 
  }

  /* Heatmap */
  .heatmap { 
    display: grid; grid-template-columns: repeat(24, 1fr); gap: 2px; 
    margin-bottom: 12px; 
  }
  .hm-cell { width: 12px; height: 12px; border-radius: 2px; }
  .hm-legend { 
    display: flex; align-items: center; gap: 8px; font-size: 12px; color: #6b7280; 
  }
  .hm-swatch { width: 12px; height: 12px; border-radius: 2px; }

  /* Timeline */
  .timeline { list-style: none; }
  .timeline li { 
    display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; 
  }
  .dot { 
    width: 8px; height: 8px; background: #6366f1; border-radius: 50%; 
    margin-top: 6px; flex-shrink: 0; 
  }
  .item { flex: 1; }
  .meta { font-size: 12px; color: #9ca3af; }

  /* Responsivo */
  @media (max-width: 768px) {
    .page { flex-direction: column; height: auto; }
    .sidebar { width: 100%; }
    .modules { grid-template-columns: 1fr; }
    .kpis { grid-template-columns: 1fr; }
    .charts { grid-template-columns: 1fr; }
    .bottom { grid-template-columns: 1fr; }
  }
`;