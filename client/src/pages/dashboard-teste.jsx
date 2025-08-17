// client/src/pages/dashboard-teste.jsx - Vite/React version
// Dependências: chart.js (já instalado)

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
    <div ref={hostRef} className="chartHost" aria-label={ariaLabel} style={{width: '100%', height: `${height}px`}}>
      <canvas ref={canvasRef} style={{maxWidth: '100%', display: 'block'}} />
    </div>
  );
}

// ---------- Componentes UI ----------
function Icon({ path }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: '18px', height: '18px', flex: '0 0 18px', display: 'inline-block'}}>
      <path d={path} />
    </svg>
  );
}

// Ícones compostos para os cards de módulo (múltiplos paths)
function IconMulti({ paths = [], size = 22, strokeWidth = 2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{flex: '0 0 auto', display: 'inline-block'}}
    >
      {paths.map((d, i) => (<path key={i} d={d} />))}
    </svg>
  );
}

function Sidebar(){
  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.logo}>TM</div> 
        TeleMed
      </div>
      <div style={styles.sectionTitle}>Menu</div>
      <nav style={styles.nav}>
        <a style={{...styles.navLink, ...styles.active}} href="#">
          <Icon path="M3 12l9-9 9 9 M9 21V9h6v12"/> Dashboard
        </a>
        <a style={styles.navLink} href="#">
          <Icon path="M3 21v-1a5 5 0 0 1 5-5a5 5 0 0 1 5 5v1 M12 21v-1a5 5 0 0 1 5-5a5 5 0 0 1 5 5v1 M8 11a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 M16 11a3 3 0 1 0 0-6 a3 3 0 0 0 0 6"/> Pacientes
        </a>
        <a style={styles.navLink} href="#">
          <Icon path="M12 12c2.2 0 4-1.8 4-4S14.2 4 12 4 8 5.8 8 8s1.8 4 4 4z M20 20a8 8 0 10-16 0"/> Médicos
        </a>
        <a style={styles.navLink} href="#analytics">
          <Icon path="M4 19V5 M10 19V9 M16 19V13 M22 19V3"/> Analytics
        </a>
        <a style={styles.navLink} href="#prontuario">
          <Icon path="M4 6h12 M4 12h12 M4 18h12 M18 6h2v12h-2"/> Prontuário
        </a>
        <div style={styles.sectionTitle}>Ações Rápidas</div>
        <div style={styles.quickActions}>
          <button style={{...styles.btn, ...styles.primary}}>Nova Consulta</button>
          <button style={{...styles.btn, ...styles.secondary}}>Novo Paciente</button>
          <button style={{...styles.btn, ...styles.secondary}}>Teleconsulta</button>
          <button style={{...styles.btn, ...styles.secondary}}>Prescrição</button>
        </div>
      </nav>
    </aside>
  )
}

function Topbar(){
  return (
    <div style={styles.topbar}>
      <div style={styles.search}>
        <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="7"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input placeholder="Buscar por pacientes, exames, sintomas…" style={styles.searchInput} />
      </div>
      <span style={styles.chip}>Período: Este ano</span>
      <span style={styles.chip}>Departamento: Todos</span>
      <span style={styles.chip}>Convênio: Todos</span>
    </div>
  );
}

function KpiCard({title, value, delta, deltaType="neutral", data, colorFn}){
  const chartData = useMemo(()=>({
    labels: data.map((_,i)=>i+1),
    datasets:[{ data, fill:true, tension:.35, borderColor:colorFn(.9), backgroundColor:colorFn(.28), pointRadius:0, borderWidth:2 }]
  }), [data, colorFn]);
  
  return (
    <div style={styles.card}>
      <h4 style={styles.kpiTitle}>{title}</h4>
      <div style={styles.kpiValue}>
        {value} 
        {delta && (
          <span style={{
            ...styles.delta,
            ...(deltaType === 'up' ? styles.deltaUp : deltaType === 'down' ? styles.deltaDown : {})
          }}>
            {delta}
          </span>
        )}
      </div>
      <ChartCanvas 
        type="line" 
        data={chartData} 
        options={{ 
          plugins:{legend:{display:false}}, 
          scales:{x:{display:false}, y:{display:false}} 
        }} 
        height={44} 
        ariaLabel={title} 
      />
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
      cells.push(
        <div 
          key={`${d}-${h}`} 
          style={{
            ...styles.hmCell,
            background: `rgba(162,210,255,${alpha.toFixed(2)})`
          }} 
        />
      );
    }
  }
  return (
    <>
      <div style={styles.heatmap}>{cells}</div>
      <div style={styles.hmLegend}>
        <span>Baixa</span>
        <span style={{...styles.hmSwatch, background:"rgba(162,210,255,.18)"}}/>
        <span style={{...styles.hmSwatch, background:"rgba(162,210,255,.35)"}}/>
        <span style={{...styles.hmSwatch, background:"rgba(162,210,255,.55)"}}/>
        <span style={{...styles.hmSwatch, background:"rgba(162,210,255,.75)"}}/>
        <span>Alta</span>
      </div>
    </>
  );
}

function Timeline(){
  return (
    <ul style={styles.timeline}>
      <li style={styles.timelineItem}>
        <span style={styles.dot}></span>
        <div style={styles.item}>
          <strong>Consulta concluída</strong> – João Santos<br/>
          <span style={styles.meta}>Hoje • 14:20</span>
        </div>
      </li>
      <li style={styles.timelineItem}>
        <span style={styles.dot}></span>
        <div style={styles.item}>
          <strong>Prescrição enviada</strong> – Amoxil 500mg<br/>
          <span style={styles.meta}>Hoje • 13:55</span>
        </div>
      </li>
      <li style={styles.timelineItem}>
        <span style={styles.dot}></span>
        <div style={styles.item}>
          <strong>Exame recebido</strong> – Hemograma (PDF)<br/>
          <span style={styles.meta}>Ontem • 18:10</span>
        </div>
      </li>
      <li style={styles.timelineItem}>
        <span style={styles.dot}></span>
        <div style={styles.item}>
          <strong>Anotação clínica</strong> – Dor torácica leve<br/>
          <span style={styles.meta}>Ontem • 10:42</span>
        </div>
      </li>
    </ul>
  );
}

// ---------- Página ----------
export default function DashboardTeleMed(){
  // Dados de exemplo
  const horas = Array.from({length:24}, (_,i)=>`${String(i).padStart(2,'0')}:00`);
  const valsHoras = [4,6,8,3,2,1,1,2,4,6,10,12,14,16,18,15,13,12,11,10,8,7,6,5];

  const barrasHoras = useMemo(()=>({ 
    labels:horas, 
    datasets:[{ 
      data:valsHoras, 
      backgroundColor: pastel(.7), 
      borderColor:'#8AB8E6', 
      borderWidth:1, 
      borderRadius:8, 
      barThickness:6 
    }] 
  }),[]);
  
  const barrasOptions = useMemo(()=>({ 
    indexAxis:'y', 
    plugins:{legend:{display:false}}, 
    scales:{ 
      x:{ grid:{display:false}, ticks:{color:'#6B7280'} }, 
      y:{ grid:{display:false}, ticks:{color:'#6B7280', autoSkip:false, maxTicksLimit:24} } 
    } 
  }),[]);

  const npsData = useMemo(()=>({ 
    labels:['S1','S2','S3','S4','S5','S6','S7','S8'], 
    datasets:[{ 
      label:'NPS', 
      data:[72,74,71,75,78,80,79,82], 
      borderColor:pastel(.95), 
      backgroundColor:pastel(.3), 
      borderWidth:2, 
      pointRadius:3, 
      tension:.35, 
      fill:true 
    }] 
  }),[]);
  
  const npsOptions = useMemo(()=>({ 
    plugins:{legend:{display:false}}, 
    scales:{ 
      x:{grid:{display:false}}, 
      y:{grid:{color:'rgba(0,0,0,0.04)'}, suggestedMin:60, suggestedMax:90} 
    } 
  }),[]);

  const filaData = useMemo(()=>({ 
    labels:['Crítica','Alta','Média','Baixa'], 
    datasets:[{ 
      data:[8,14,9,5], 
      backgroundColor:[lavender(.75), pastel(.75), pastel(.55), lavender(.45)], 
      borderColor:'#8AB8E6', 
      borderWidth:1, 
      barThickness:6, 
      borderRadius:8 
    }] 
  }),[]);
  
  const filaOptions = useMemo(()=>({ 
    indexAxis:'y', 
    plugins:{legend:{display:false}}, 
    scales:{ 
      x:{grid:{display:false}}, 
      y:{grid:{display:false}} 
    } 
  }),[]);

  return (
    <div style={styles.page}>
      <Sidebar/>
      <main style={styles.main}>
        <Topbar/>

        {/* Módulos do Sistema – 5 cards no topo */}
        <section style={styles.modules}>
          <a style={styles.moduleCard} href="#agenda" title="Agenda do Dia">
            <div style={styles.moduleIcon}>
              <IconMulti size={22} paths={["M3 7h18","M7 3v4","M17 3v4","M5 7h14v12H5z"]}/>
            </div>
            <div>
              <h4 style={styles.moduleTitle}>Agenda do Dia</h4>
              <ul style={styles.moduleList}>
                <li>Timeline interativa</li>
                <li>Agendamento rápido</li>
                <li>Notificações em tempo real</li>
              </ul>
            </div>
          </a>
          <a style={styles.moduleCard} href="#pacientes" title="Gestão de Pacientes">
            <div style={styles.moduleIcon}>
              <IconMulti size={22} paths={[
                "M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
                "M16 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
                "M2 22v-1a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v1",
                "M12 22v-1a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v1"
              ]}/>
            </div>
            <div>
              <h4 style={styles.moduleTitle}>Gestão de Pacientes</h4>
              <ul style={styles.moduleList}>
                <li>Cadastro completo</li>
                <li>Histórico médico</li>
                <li>Relatórios personalizados</li>
              </ul>
            </div>
          </a>
          <a style={styles.moduleCard} href="#medico" title="Perfil do Médico">
            <div style={styles.moduleIcon}>
              <IconMulti size={22} paths={[
                "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z",
                "M12 8v8",
                "M8 12h8"
              ]}/>
            </div>
            <div>
              <h4 style={styles.moduleTitle}>Perfil do Médico</h4>
              <ul style={styles.moduleList}>
                <li>Dados profissionais</li>
                <li>Certificações</li>
                <li>Horários de trabalho</li>
              </ul>
            </div>
          </a>
          <a style={styles.moduleCard} href="#config" title="Configurações">
            <div style={styles.moduleIcon}>
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
              <h4 style={styles.moduleTitle}>Configurações</h4>
              <ul style={styles.moduleList}>
                <li>Integrações</li>
                <li>Backup e segurança</li>
                <li>Logs do sistema</li>
              </ul>
            </div>
          </a>
          <a style={styles.moduleCard} href="#demo" title="Demo Responsivo">
            <div style={styles.moduleIcon}>
              <IconMulti size={22} paths={[
                "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
                "M12 18h.01"
              ]}/>
            </div>
            <div>
              <h4 style={styles.moduleTitle}>Demo Responsivo</h4>
              <ul style={styles.moduleList}>
                <li>Simulador de dispositivos</li>
                <li>Performance otimizada</li>
                <li>Interface adaptativa</li>
              </ul>
            </div>
          </a>
        </section>

        <section style={styles.kpis}>
          <KpiCard title="Pacientes Cadastrados" value={847} delta="+3% vs. semana passada" deltaType="up" data={[10,12,11,13,14,15,14,16,18,17,19,21]} colorFn={pastel}/>
          <KpiCard title="Consultas Hoje" value={12} delta="-7% vs. ontem" deltaType="down" data={[9,8,10,7,8,6,7,6,7,5,6,5]} colorFn={lavender}/>
          <KpiCard title="Prescrições Pendentes" value={5} delta="meta: ≤ 4" data={[6,5,6,7,5,6,4,5,5,4,5,5]} colorFn={pastel}/>
          <KpiCard title="Avaliação Média" value={4.0} delta="+0.2 vs. mês anterior" deltaType="up" data={[3.6,3.7,3.8,3.7,3.9,4.0,3.9,4.1,4.0,4.2,4.1,4.0]} colorFn={lavender}/>
        </section>

        <section style={styles.charts}>
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Pico de Consultas por Horário</h4>
            <ChartCanvas type="bar" data={barrasHoras} options={barrasOptions} height={320} ariaLabel="Consultas por horário"/>
          </div>
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>NPS – Satisfação do Paciente (Últimas 8 semanas)</h4>
            <ChartCanvas type="line" data={npsData} options={npsOptions} height={320} ariaLabel="Satisfação do paciente"/>
          </div>
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Prioridade da Fila</h4>
            <ChartCanvas type="bar" data={filaData} options={filaOptions} height={320} ariaLabel="Prioridade da fila"/>
          </div>
        </section>

        <section style={styles.bottom}>
          <div style={styles.card}>
            <h4 style={styles.chartTitle}>Mapa de Calor – Atividade por Hora/Dia</h4>
            <Heatmap/>
          </div>
          <div style={styles.card}>
            <h4 style={styles.chartTitle}>Timeline de Atividades</h4>
            <Timeline/>
          </div>
        </section>

      </main>
    </div>
  );
}

// Estilos inline para compatibilidade
const styles = {
  page: { display: 'flex', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', background: '#fafbfc' },
  sidebar: { 
    width: '280px', 
    background: 'linear-gradient(180deg, #1a1b23 0%, #2c2d39 100%)', 
    color: '#e4e5e9', 
    display: 'flex', 
    flexDirection: 'column', 
    padding: '24px 20px', 
    boxShadow: '2px 0 12px rgba(0,0,0,0.08)' 
  },
  main: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    padding: '24px', 
    overflowY: 'auto', 
    gap: '24px' 
  },
  brand: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    fontSize: '20px', 
    fontWeight: 700, 
    marginBottom: '32px' 
  },
  logo: { 
    width: '40px', 
    height: '40px', 
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
    borderRadius: '8px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontWeight: 800, 
    fontSize: '16px', 
    color: 'white' 
  },
  sectionTitle: { 
    fontSize: '11px', 
    textTransform: 'uppercase', 
    letterSpacing: '1px', 
    color: '#9ca3af', 
    margin: '24px 0 12px', 
    fontWeight: 600 
  },
  nav: { display: 'flex', flexDirection: 'column' },
  navLink: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    padding: '12px 16px', 
    borderRadius: '8px', 
    textDecoration: 'none', 
    color: '#d1d5db', 
    transition: 'all 0.2s', 
    marginBottom: '4px' 
  },
  active: { background: '#6366f1', color: 'white' },
  quickActions: { marginTop: '16px' },
  btn: { 
    width: '100%', 
    padding: '10px 16px', 
    border: 'none', 
    borderRadius: '6px', 
    fontSize: '13px', 
    fontWeight: 500, 
    cursor: 'pointer', 
    marginBottom: '8px', 
    transition: 'all 0.2s' 
  },
  primary: { background: '#10b981', color: 'white' },
  secondary: { background: 'rgba(255,255,255,0.1)', color: '#d1d5db' },
  topbar: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '16px', 
    padding: '16px 24px', 
    background: 'white', 
    borderRadius: '12px', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
    marginBottom: '8px' 
  },
  search: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    background: '#f9fafb', 
    border: '1px solid #e5e7eb', 
    borderRadius: '8px', 
    padding: '8px 12px', 
    flex: 1 
  },
  searchIcon: { width: '18px', height: '18px' },
  searchInput: { 
    border: 'none', 
    background: 'none', 
    outline: 'none', 
    flex: 1, 
    fontSize: '14px' 
  },
  chip: { 
    background: '#f3f4f6', 
    border: '1px solid #e5e7eb', 
    borderRadius: '20px', 
    padding: '6px 12px', 
    fontSize: '12px', 
    color: '#6b7280', 
    whiteSpace: 'nowrap' 
  },
  modules: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
    gap: '16px', 
    marginBottom: '8px' 
  },
  moduleCard: { 
    background: 'white', 
    borderRadius: '12px', 
    padding: '20px', 
    textDecoration: 'none', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
    border: '1px solid #f1f5f9', 
    transition: 'all 0.2s', 
    display: 'flex', 
    alignItems: 'flex-start', 
    gap: '16px' 
  },
  moduleIcon: { 
    width: '44px', 
    height: '44px', 
    background: 'linear-gradient(135deg, #e0f2fe, #b3e5fc)', 
    borderRadius: '10px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    color: '#0277bd', 
    flexShrink: 0 
  },
  moduleTitle: { 
    fontSize: '16px', 
    fontWeight: 600, 
    color: '#1f2937', 
    marginBottom: '8px' 
  },
  moduleList: { listStyle: 'none', margin: 0, padding: 0 },
  kpis: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '16px', 
    marginBottom: '8px' 
  },
  card: { 
    background: 'white', 
    borderRadius: '12px', 
    padding: '20px', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
    border: '1px solid #f1f5f9' 
  },
  kpiTitle: { 
    fontSize: '14px', 
    color: '#6b7280', 
    marginBottom: '8px', 
    fontWeight: 500 
  },
  kpiValue: { 
    fontSize: '24px', 
    fontWeight: 700, 
    color: '#1f2937', 
    marginBottom: '12px', 
    display: 'flex', 
    alignItems: 'baseline', 
    gap: '8px' 
  },
  delta: { fontSize: '12px', fontWeight: 500, color: '#6b7280' },
  deltaUp: { color: '#10b981' },
  deltaDown: { color: '#ef4444' },
  charts: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '16px', 
    marginBottom: '8px' 
  },
  chartCard: { 
    background: 'white', 
    borderRadius: '12px', 
    padding: '20px', 
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
    border: '1px solid #f1f5f9' 
  },
  chartTitle: { 
    fontSize: '16px', 
    fontWeight: 600, 
    color: '#1f2937', 
    marginBottom: '16px' 
  },
  bottom: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '16px' 
  },
  heatmap: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(24, 1fr)', 
    gap: '2px', 
    marginBottom: '12px' 
  },
  hmCell: { width: '12px', height: '12px', borderRadius: '2px' },
  hmLegend: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    fontSize: '12px', 
    color: '#6b7280' 
  },
  hmSwatch: { width: '12px', height: '12px', borderRadius: '2px' },
  timeline: { listStyle: 'none', margin: 0, padding: 0 },
  timelineItem: { 
    display: 'flex', 
    alignItems: 'flex-start', 
    gap: '12px', 
    marginBottom: '16px' 
  },
  dot: { 
    width: '8px', 
    height: '8px', 
    background: '#6366f1', 
    borderRadius: '50%', 
    marginTop: '6px', 
    flexShrink: 0 
  },
  item: { flex: 1 },
  meta: { fontSize: '12px', color: '#9ca3af' }
};