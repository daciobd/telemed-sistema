// Dashboard Teste - React/Next.js robust version with Chart.js and ResizeObserver
// Eliminates chart width bugs through proper sizing and measurement
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import './dashboard-teste.css';

// Types
interface ChartCanvasProps {
  type: any;
  data: any;
  options?: any;
  height?: number;
  ariaLabel?: string;
}

interface IconProps {
  path: string;
}

interface IconMultiProps {
  paths?: string[];
  size?: number;
  strokeWidth?: number;
}

interface KpiCardProps {
  title: string;
  value: number | string;
  delta?: string;
  deltaType?: string;
  data: number[];
  colorFn: (alpha?: number) => string;
}

// ---------- Utility Hooks ----------
function useMeasure(): [React.RefObject<HTMLDivElement>, { width: number; height: number }] {
  const ref = useRef<HTMLDivElement>(null);
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

// ---------- Color Utils ----------
const pastel = (a = 0.6) => `rgba(162,210,255,${a})`; // blue
const lavender = (a = 0.6) => `rgba(205,180,219,${a})`;

// ---------- Robust Chart.js Wrapper ----------
function ChartCanvas({ type, data, options, height = 320, ariaLabel }: ChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hostRef, rect] = useMeasure();
  const chartRef = useRef<Chart | null>(null);

  // Ensures width/height before instantiating chart
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
    <div 
      ref={hostRef} 
      className="chartHost" 
      aria-label={ariaLabel}
      style={{ width: '100%', height: `${height}px` }}
    >
      <canvas 
        ref={canvasRef}
        style={{ maxWidth: '100%', display: 'block' }}
      />
    </div>
  );
}

// ---------- UI Components ----------
function Icon({ path }: IconProps) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d={path} />
    </svg>
  );
}

function IconMulti({ paths = [], size = 22, strokeWidth = 2 }: IconMultiProps) {
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
      style={{ flex: '0 0 auto', display: 'inline-block' }}
    >
      {paths.map((d, i) => (<path key={i} d={d} />))}
    </svg>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand"><div className="logo">TM</div> TeleMed</div>
      <div className="section-title">Menu</div>
      <nav className="nav">
        <a className="active" href="#"><Icon path="M3 12l9-9 9 9 M9 21V9h6v12"/> Dashboard</a>
        <a href="#"><Icon path="M3 21v-1a5 5 0 0 1 5-5a5 5 0 0 1 5 5v1 M12 21v-1a5 5 0 0 1 5-5a5 5 0 0 1 5 5v1 M8 11a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 M16 11a3 3 0 1 0 0-6 a3 3 0 0 0 0 6"/> Pacientes</a>
        <a href="#"><Icon path="M12 12c2.2 0 4-1.8 4-4S14.2 4 12 4 8 5.8 8 8s1.8 4 4 4z M20 20a8 8 0 10-16 0"/> Médicos</a>
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
    </aside>
  )
}

function Topbar() {
  return (
    <div className="topbar">
      <div className="search">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
        <input placeholder="Buscar por pacientes, exames, sintomas…" />
      </div>
      <span className="chip">Período: Este ano</span>
      <span className="chip">Departamento: Todos</span>
      <span className="chip">Convênio: Todos</span>
    </div>
  );
}

function KpiCard({ title, value, delta, deltaType = "neutral", data, colorFn }: KpiCardProps) {
  const chartData = useMemo(() => ({
    labels: data.map((_, i) => i + 1),
    datasets: [{ data, fill: true, tension: .35, borderColor: colorFn(.9), backgroundColor: colorFn(.28), pointRadius: 0, borderWidth: 2 }]
  }), [data, colorFn]);
  
  return (
    <div className="card">
      <h4 className="kpi-title">{title}</h4>
      <div className="kpi-value">{value} {delta && (<span className={`delta ${deltaType}`}>{delta}</span>)}</div>
      <ChartCanvas type="line" data={chartData} options={{ plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} height={44} ariaLabel={title} />
    </div>
  );
}

function Heatmap() {
  const dias = 7, horas = 24;
  const cells = [];
  for (let d = 0; d < dias; d++) {
    for (let h = 0; h < horas; h++) {
      const v = Math.random();
      const alpha = 0.18 + v * 0.62;
      cells.push(<div key={`${d}-${h}`} className="hm-cell" style={{ background: `rgba(162,210,255,${alpha.toFixed(2)})` }} />);
    }
  }
  return (
    <>
      <div className="heatmap">{cells}</div>
      <div className="hm-legend"><span>Baixa</span><span className="hm-swatch" style={{ background: "rgba(162,210,255,.18)" }} /><span className="hm-swatch" style={{ background: "rgba(162,210,255,.35)" }} /><span className="hm-swatch" style={{ background: "rgba(162,210,255,.55)" }} /><span className="hm-swatch" style={{ background: "rgba(162,210,255,.75)" }} /><span>Alta</span></div>
    </>
  );
}

function Timeline() {
  return (
    <ul className="timeline">
      <li><span className="dot"></span><div className="item"><strong>Consulta concluída</strong> – João Santos<br /><span className="meta">Hoje • 14:20</span></div></li>
      <li><span className="dot"></span><div className="item"><strong>Prescrição enviada</strong> – Amoxil 500mg<br /><span className="meta">Hoje • 13:55</span></div></li>
      <li><span className="dot"></span><div className="item"><strong>Exame recebido</strong> – Hemograma (PDF)<br /><span className="meta">Ontem • 18:10</span></div></li>
      <li><span className="dot"></span><div className="item"><strong>Anotação clínica</strong> – Dor torácica leve<br /><span className="meta">Ontem • 10:42</span></div></li>
    </ul>
  );
}

// ---------- Main Component ----------
export default function DashboardTesteRobust() {
  // Sample data
  const horas = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  const valsHoras = [4, 6, 8, 3, 2, 1, 1, 2, 4, 6, 10, 12, 14, 16, 18, 15, 13, 12, 11, 10, 8, 7, 6, 5];

  const barrasHoras = useMemo(() => ({ labels: horas, datasets: [{ data: valsHoras, backgroundColor: pastel(.7), borderColor: '#8AB8E6', borderWidth: 1, borderRadius: 8, barThickness: 6 }] }), []);
  const barrasOptions = useMemo(() => ({ indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#6B7280' } }, y: { grid: { display: false }, ticks: { color: '#6B7280', autoSkip: false, maxTicksLimit: 24 } } } }), []);

  const npsData = useMemo(() => ({ labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'], datasets: [{ label: 'NPS', data: [72, 74, 71, 75, 78, 80, 79, 82], borderColor: pastel(.95), backgroundColor: pastel(.3), borderWidth: 2, pointRadius: 3, tension: .35, fill: true }] }), []);
  const npsOptions = useMemo(() => ({ plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(0,0,0,0.04)' }, suggestedMin: 60, suggestedMax: 90 } } }), []);

  const filaData = useMemo(() => ({ labels: ['Crítica', 'Alta', 'Média', 'Baixa'], datasets: [{ data: [8, 14, 9, 5], backgroundColor: [lavender(.75), pastel(.75), pastel(.55), lavender(.45)], borderColor: '#8AB8E6', borderWidth: 1, barThickness: 6, borderRadius: 8 }] }), []);
  const filaOptions = useMemo(() => ({ indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } }), []);

  useEffect(() => {
    console.log('🎯 Dashboard Teste robusta carregada com Chart.js e ResizeObserver');
  }, []);

  return (
    <div className="dashboard-teste-container">
      <Sidebar />
      <main>
        <Topbar />

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
          <a className="module-card" href="#config" title="Configurações">
            <div className="module-icon">
              <IconMulti size={22} paths={[
                "M4 6h16","M4 12h16","M4 18h16",
                "M8 4v4","M12 10v4","M16 16v4"
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
          <KpiCard title="Pacientes Cadastrados" value={847} delta="+3% vs. semana passada" deltaType="up" data={[10, 12, 11, 13, 14, 15, 14, 16, 18, 17, 19, 21]} colorFn={pastel} />
          <KpiCard title="Consultas Hoje" value={12} delta="-7% vs. ontem" deltaType="down" data={[9, 8, 10, 7, 8, 6, 7, 6, 7, 5, 6, 5]} colorFn={lavender} />
          <KpiCard title="Prescrições Pendentes" value={5} delta="meta: ≤ 4" data={[6, 5, 6, 7, 5, 6, 4, 5, 5, 4, 5, 5]} colorFn={pastel} />
          <KpiCard title="Avaliação Média" value={4.0} delta="+0.2 vs. mês anterior" deltaType="up" data={[3.6, 3.7, 3.8, 3.7, 3.9, 4.0, 3.9, 4.1, 4.0, 4.2, 4.1, 4.0]} colorFn={lavender} />
        </section>

        <section id="analytics" className="grid-2">
          <div className="card">
            <h3>Atendimentos por Hora</h3>
            <p className="meta">Distribuição de atendimentos ao longo do dia</p>
            <ChartCanvas type="bar" data={barrasHoras} options={barrasOptions} ariaLabel="Barras horizontais – Atendimentos por Hora" />
          </div>
          <div className="card">
            <h3>Horários de Pico (Heatmap)</h3>
            <p className="meta">Intensidade por dia x hora</p>
            <Heatmap />
          </div>
        </section>

        <section id="prontuario" className="grid-3">
          <div className="card">
            <h3>Timeline do Prontuário</h3>
            <p className="meta">Eventos clínicos recentes</p>
            <Timeline />
          </div>
          <div className="card">
            <h3>Satisfação do Paciente</h3>
            <p className="meta">NPS por semana</p>
            <ChartCanvas type="line" data={npsData} options={npsOptions} ariaLabel="Linha – NPS" />
          </div>
          <div className="card">
            <h3>Fila por Prioridade</h3>
            <p className="meta">Barras finas, horizontais</p>
            <ChartCanvas type="bar" data={filaData} options={filaOptions} ariaLabel="Fila por prioridade" />
          </div>
        </section>

        <section className="card">
          <div className="quick-actions">
            <button className="btn primary">Agendar Consulta</button>
            <button className="btn secondary">Ver Relatórios</button>
            <button className="btn secondary">Importar Exames</button>
            <button className="btn secondary">Abrir Teleconsulta</button>
          </div>
        </section>
      </main>

      {/* Inline styles for modules section */}
      <style>{`
        .modules {
          display: grid;
          grid-template-columns: repeat(5, minmax(220px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }
        .module-card {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          text-decoration: none;
          color: var(--text, #1F2937);
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,.05);
          border: 1px solid rgba(0,0,0,.06);
          padding: 18px;
          transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
        }
        .module-card:hover {
          transform: translateY(-2px);
          background: rgba(162,210,255,.06);
        }
        .module-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: rgba(162,210,255,.18);
        }
        .module-title {
          margin: 0 0 6px;
          font-size: 16px;
          font-weight: 600;
        }
        .module-list {
          margin: 0;
          padding-left: 18px;
          color: #6B7280;
          font-size: 13px;
        }
        .module-list li {
          margin-bottom: 2px;
        }
        @media (max-width: 1200px) {
          .modules {
            grid-template-columns: repeat(3, minmax(220px, 1fr));
          }
        }
        @media (max-width: 768px) {
          .modules {
            grid-template-columns: repeat(2, minmax(200px, 1fr));
            gap: 16px;
          }
        }
        @media (max-width: 480px) {
          .modules {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}