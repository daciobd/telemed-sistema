import React, { useEffect, useRef } from 'react';
import './dashboard-teste.css';

export default function DashboardTeste() {
  const spk1Ref = useRef<HTMLCanvasElement>(null);
  const spk2Ref = useRef<HTMLCanvasElement>(null);
  const spk3Ref = useRef<HTMLCanvasElement>(null);
  const spk4Ref = useRef<HTMLCanvasElement>(null);
  const barHorasRef = useRef<HTMLCanvasElement>(null);
  const lineNpsRef = useRef<HTMLCanvasElement>(null);
  const barFilaRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    script.onload = () => {
      initializeCharts();
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeCharts = () => {
    // @ts-ignore - Chart.js loaded dynamically
    if (!window.Chart) return;
    
    // @ts-ignore
    const Chart = window.Chart;

    // Utilidades
    const pastel = (alpha = 0.6) => `rgba(162,210,255,${alpha})`;
    const lavender = (alpha = 0.6) => `rgba(205,180,219,${alpha})`;

    function sparkline(el: HTMLCanvasElement, data: number[], color: string) {
      return new Chart(el, {
        type: 'line',
        data: {
          labels: Array(data.length).fill(''),
          datasets: [{
            data,
            borderColor: color,
            backgroundColor: color.replace('1)', '0.15)'),
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false }
          },
          elements: { line: { tension: 0.35 } }
        }
      });
    }

    // Sparklines
    if (spk1Ref.current) sparkline(spk1Ref.current, [20, 25, 28, 22, 30, 35, 32, 40, 42], pastel(1));
    if (spk2Ref.current) sparkline(spk2Ref.current, [8, 12, 15, 10, 14, 12, 11, 9], lavender(1));
    if (spk3Ref.current) sparkline(spk3Ref.current, [3, 5, 4, 6, 5, 4, 5], '#F59E0B');
    if (spk4Ref.current) sparkline(spk4Ref.current, [3.5, 3.8, 3.9, 4.1, 4.0, 4.2], '#22C55E');

    // Barras horizontais (Atendimentos por Hora)
    if (barHorasRef.current) {
      new Chart(barHorasRef.current, {
        type: 'bar',
        data: {
          labels: ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h'],
          datasets: [{
            label: 'Atendimentos',
            data: [4, 8, 12, 15, 9, 6, 14, 18, 11, 7],
            backgroundColor: pastel(0.7),
            borderColor: pastel(1),
            borderWidth: 1.5,
            borderRadius: 8,
          }]
        },
        options: {
          indexAxis: 'y' as const,
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { beginAtZero: true, grid: { display: false } },
            y: { grid: { display: false } }
          }
        }
      });
    }

    // Linha NPS
    if (lineNpsRef.current) {
      new Chart(lineNpsRef.current, {
        type: 'line',
        data: {
          labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
          datasets: [{
            label: 'NPS',
            data: [3.2, 3.5, 3.8, 3.6, 4.1, 4.0],
            borderColor: '#22C55E',
            backgroundColor: 'rgba(34,197,94,0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#22C55E',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, max: 5, grid: { color: '#F3F4F6' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Barras Fila por Prioridade
    if (barFilaRef.current) {
      new Chart(barFilaRef.current, {
        type: 'bar',
        data: {
          labels: ['Urgente', 'Alta', 'Média', 'Baixa'],
          datasets: [{
            label: 'Pacientes na Fila',
            data: [2, 5, 8, 3],
            backgroundColor: [
              '#EF4444',  // Urgente
              '#F59E0B',  // Alta
              pastel(0.7), // Média
              '#22C55E'   // Baixa
            ],
            borderRadius: 6,
          }]
        },
        options: {
          indexAxis: 'y' as const,
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, grid: { display: false } },
            y: { grid: { display: false } }
          }
        }
      });
    }

    // Heatmap
    const heatmapEl = document.getElementById('heatmap');
    if (heatmapEl) {
      const intensities = [
        0.1, 0.1, 0.0, 0.0, 0.0, 0.1, 0.2, 0.4, 0.7, 0.8, 0.6, 0.5,
        0.7, 0.9, 0.8, 0.6, 0.4, 0.3, 0.2, 0.1, 0.1, 0.0, 0.0, 0.0
      ];
      
      heatmapEl.innerHTML = intensities.map(intensity => 
        `<div class="hm-cell" style="background:rgba(162,210,255,${intensity * 0.8 + 0.1}); border-color:rgba(162,210,255,${intensity * 0.6 + 0.2})"></div>`
      ).join('');
    }
  };

  return (
    <div className="dashboard-teste-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">TM</div> 
          TeleMed
        </div>
        <div className="section-title">Menu</div>
        <nav className="nav">
          <a className="active" href="#">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12l9-9 9 9"/>
              <path d="M9 21V9h6v12"/>
            </svg> 
            Dashboard
          </a>
          <a href="#">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="8" cy="8" r="3"/>
              <circle cx="16" cy="8" r="3"/>
              <path d="M3 21v-1a5 5 0 015-5h0a5 5 0 015 5v1"/>
              <path d="M12 21v-1a5 5 0 015-5h0a5 5 0 015 5v1"/>
            </svg> 
            Pacientes
          </a>
          <a href="#">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 12c2.2 0 4-1.8 4-4S14.2 4 12 4 8 5.8 8 8s1.8 4 4 4z"/>
              <path d="M20 20a8 8 0 10-16 0"/>
            </svg> 
            Médicos
          </a>
          <a href="#analytics">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 19V5"/>
              <path d="M10 19V9"/>
              <path d="M16 19V13"/>
              <path d="M22 19V3"/>
            </svg> 
            Analytics
          </a>
          <a href="#prontuario">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h12"/>
              <path d="M4 12h12"/>
              <path d="M4 18h12"/>
              <path d="M18 6h2v12h-2"/>
            </svg> 
            Prontuário
          </a>
          <div className="section-title">Ações Rápidas</div>
          <div className="quick-actions">
            <button className="btn primary">Nova Consulta</button>
            <button className="btn secondary">Novo Paciente</button>
            <button className="btn secondary">Teleconsulta</button>
            <button className="btn secondary">Prescrição</button>
          </div>
        </nav>
      </aside>

      <main>
        {/* Topbar / filtros */}
        <div className="topbar">
          <div className="search">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input placeholder="Buscar por pacientes, exames, sintomas…" />
          </div>
          <span className="chip">Período: Este ano</span>
          <span className="chip">Departamento: Todos</span>
          <span className="chip">Convênio: Todos</span>
        </div>

        {/* KPI Cards */}
        <section className="kpis">
          <div className="card">
            <h4 className="kpi-title">Pacientes Cadastrados</h4>
            <div className="kpi-value">847 <span className="delta up">+3% vs. semana passada</span></div>
            <canvas ref={spk1Ref} className="spark" aria-label="tendência de pacientes"></canvas>
          </div>
          <div className="card">
            <h4 className="kpi-title">Consultas Hoje</h4>
            <div className="kpi-value">12 <span className="delta down">-7% vs. ontem</span></div>
            <canvas ref={spk2Ref} className="spark" aria-label="tendência de consultas"></canvas>
          </div>
          <div className="card">
            <h4 className="kpi-title">Prescrições Pendentes</h4>
            <div className="kpi-value">5 <span className="delta">meta: ≤ 4</span></div>
            <canvas ref={spk3Ref} className="spark" aria-label="tendência de prescrições"></canvas>
          </div>
          <div className="card">
            <h4 className="kpi-title">Avaliação Média</h4>
            <div className="kpi-value">4.0 <span className="delta up">+0.2 vs. mês anterior</span></div>
            <canvas ref={spk4Ref} className="spark" aria-label="tendência de NPS"></canvas>
          </div>
        </section>

        {/* Analytics: barras horizontais e heatmap */}
        <section id="analytics" className="grid-2">
          <div className="card">
            <h3 style={{margin:'0 0 8px'}}>Atendimentos por Hora</h3>
            <p className="meta" style={{margin:'0 0 16px', color:'var(--muted)'}}>Distribuição de atendimentos ao longo do dia</p>
            <canvas ref={barHorasRef} className="chart" aria-label="gráfico de barras horizontais"></canvas>
          </div>
          <div className="card">
            <h3 style={{margin:'0 0 8px'}}>Horários de Pico (Heatmap)</h3>
            <p className="meta" style={{margin:'0 0 16px', color:'var(--muted)'}}>Intensidade por dia x hora</p>
            <div className="heatmap" id="heatmap"></div>
            <div className="hm-legend" style={{marginTop:'12px'}}>
              <span>Baixa</span>
              <span className="hm-swatch" style={{background:'rgba(162,210,255,.18)'}}></span>
              <span className="hm-swatch" style={{background:'rgba(162,210,255,.35)'}}></span>
              <span className="hm-swatch" style={{background:'rgba(162,210,255,.55)'}}></span>
              <span className="hm-swatch" style={{background:'rgba(162,210,255,.75)'}}></span>
              <span>Alta</span>
            </div>
          </div>
        </section>

        {/* Prontuário & Atividade */}
        <section id="prontuario" className="grid-3">
          <div className="card">
            <h3 style={{margin:'0 0 8px'}}>Timeline do Prontuário</h3>
            <p className="meta" style={{margin:'0 16px 8px 0', color:'var(--muted)'}}>Eventos clínicos recentes</p>
            <ul className="timeline">
              <li>
                <span className="dot"></span>
                <div className="item">
                  <strong>Consulta concluída</strong> – João Santos<br/>
                  <span className="meta">Hoje • 14:20</span>
                </div>
              </li>
              <li>
                <span className="dot"></span>
                <div className="item">
                  <strong>Prescrição enviada</strong> – Amoxil 500mg<br/>
                  <span className="meta">Hoje • 13:55</span>
                </div>
              </li>
              <li>
                <span className="dot"></span>
                <div className="item">
                  <strong>Exame recebido</strong> – Hemograma (PDF)<br/>
                  <span className="meta">Ontem • 18:10</span>
                </div>
              </li>
              <li>
                <span className="dot"></span>
                <div className="item">
                  <strong>Anotação clínica</strong> – Dor torácica leve<br/>
                  <span className="meta">Ontem • 10:42</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 style={{margin:'0 0 8px'}}>Satisfação do Paciente</h3>
            <p className="meta" style={{margin:'0 0 16px', color:'var(--muted)'}}>NPS por semana</p>
            <canvas ref={lineNpsRef} className="chart" aria-label="linha de NPS"></canvas>
          </div>

          <div className="card">
            <h3 style={{margin:'0 0 8px'}}>Fila por Prioridade</h3>
            <p className="meta" style={{margin:'0 0 16px', color:'var(--muted)'}}>Barras finas, horizontais</p>
            <canvas ref={barFilaRef} className="chart" aria-label="fila por prioridade"></canvas>
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
    </div>
  );
}