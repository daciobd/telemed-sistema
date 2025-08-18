// ---- Enhanced Consultation UX - TeleMed Professional Interface
;(() => {
  // ---- Isolated helpers (no global collision)
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ---- Abas (Chat / Atendimento / Exames / Receitas)
(() => {
  const tabBtns = $$(".tab");
  const tabPanes = $$(".pane");
  if (!tabBtns.length || !tabPanes.length) return;

  function activate(id) {
    tabBtns.forEach(b => b.classList.toggle("active", b.dataset.tab === id));
    tabPanes.forEach(p => {
      p.style.display = p.id === `pane-${id}` ? 'block' : 'none';
    });
    try {
      window.telemedAnalytics?.track?.("enhanced_tab_changed", { tab: id });
    } catch {}
  }

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => activate(btn.dataset.tab));
  });

  // abre a última aba usada
  const last = localStorage.getItem("enhanced_last_tab") || "care";
  activate(last);
  tabBtns.forEach(b => b.addEventListener("click", () => {
    localStorage.setItem("enhanced_last_tab", b.dataset.tab);
  }));
})();

// ---- Redimensionamento CLAMP seguro - CORREÇÃO DEFINITIVA
(() => {
  const NOTES_KEY = 'telemed_notes_width';
  const MIN = 360, MAX = 760, DEF = 420;

  const notes = document.querySelector('.split-right');
  const resizer = document.querySelector('.split-divider');
  const root = document.getElementById('splitRoot');
  
  if (!notes || !resizer || !root) return;

  const clamp = (v,min,max) => Math.max(min, Math.min(max, v));
  const px = n => `${n}px`;

  // largura inicial segura
  let w = parseInt(localStorage.getItem(NOTES_KEY) || DEF, 10);
  w = isNaN(w) ? DEF : clamp(w, MIN, MAX);
  root.style.gridTemplateColumns = `1fr 8px ${px(w)}`;

  // drag
  let startX = 0, startW = 0, dragging = false;
  function onMove(e){
    if(!dragging) return;
    const dx = e.clientX - startX;
    const nw = clamp(startW - dx, MIN, MAX);
    root.style.gridTemplateColumns = `1fr 8px ${px(nw)}`;
  }
  function onUp(){
    if(!dragging) return;
    dragging = false;
    const currentWidth = parseInt(root.style.gridTemplateColumns.split(' ')[2]) || DEF;
    const final = clamp(currentWidth, MIN, MAX);
    localStorage.setItem(NOTES_KEY, final);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    resizer.classList.remove('drag');
  }
  
  resizer.addEventListener('mousedown', (e)=>{
    dragging = true;
    startX = e.clientX;
    startW = parseInt(root.style.gridTemplateColumns.split(' ')[2]) || DEF;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    resizer.classList.add('drag');
  });

  // duplo clique no divisor = reset de layout
  resizer.addEventListener('dblclick', ()=>{
    root.style.gridTemplateColumns = `1fr 8px ${px(DEF)}`;
    localStorage.setItem(NOTES_KEY, DEF);
  });

  // teclado
  resizer.tabIndex = 0;
  resizer.setAttribute('aria-label', 'Redimensionar painel de anotações');
  resizer.addEventListener('keydown', (e) => {
    const current = parseInt(root.style.gridTemplateColumns.split(' ')[2]) || DEF;
    if(e.key === 'ArrowLeft'){ 
      const newW = clamp(current + 24, MIN, MAX);
      root.style.gridTemplateColumns = `1fr 8px ${px(newW)}`;
      localStorage.setItem(NOTES_KEY, newW);
    }
    if(e.key === 'ArrowRight'){ 
      const newW = clamp(current - 24, MIN, MAX);
      root.style.gridTemplateColumns = `1fr 8px ${px(newW)}`;
      localStorage.setItem(NOTES_KEY, newW);
    }
    if(e.key === 'Enter'){ 
      root.style.gridTemplateColumns = `1fr 8px ${px(DEF)}`;
      localStorage.setItem(NOTES_KEY, DEF);
    }
  });
})();

// ---- Botões da barra de ferramentas do vídeo
(() => {
  const actions = [
    ["btnShot", "click_screenshot"],
    ["btnOpenChat", "click_chat"],
    ["btnBell", "click_notify"],
    ["btnAI", "click_ai_panel"],
    ["btnMic", "toggle_mic"],
    ["btnCam", "toggle_cam"],
    ["btnHold", "send_to_waiting"],
    ["btnEnd", "end_call"]
  ];
  
  actions.forEach(([id, event]) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("click", () => {
      window.telemedAnalytics?.track?.(event, { page: location.pathname });
      
      // Abrir painel Dr. AI
      if (id === "btnAI") {
        const aiPanel = document.getElementById('aipanel');
        if (aiPanel) aiPanel.style.display = 'flex';
      }
      
      // Toggle estados mic/cam
      if (id === "btnMic") {
        btn.style.opacity = btn.style.opacity === '0.5' ? '1' : '0.5';
      }
      if (id === "btnCam") {
        btn.style.opacity = btn.style.opacity === '0.5' ? '1' : '0.5';
      }
    });
  });
})();

// ---- Botões do banner do paciente
(() => {
  const toast = (m, cls="ok") => {
    const t = document.createElement("div");
    t.className = `toast ${cls}`;
    t.textContent = m;
    t.style.cssText = `
      position:fixed;top:20px;right:20px;z-index:9999;
      padding:12px 16px;border-radius:8px;color:#fff;font-weight:500;
      background:${cls==='ok'?'#10b981':'#ef4444'};
      box-shadow:0 4px 12px rgba(0,0,0,.3);
      animation:slideIn .3s ease;
    `;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(), 2200);
  };

  // Convite
  const btnInvite = $("#btnInvite");
  btnInvite?.addEventListener("click", () => {
    window.telemedAnalytics?.track?.("invite_sent", { room: "ABC123" });
    btnInvite.textContent = "Enviado ✓";
    setTimeout(() => btnInvite.textContent = "Convite", 2000);
    toast("Convite enviado ao paciente");
  });

  // Iniciar consulta
  const btnStart = $("#btnStart");
  btnStart?.addEventListener("click", async () => {
    window.telemedAnalytics?.track?.("consult_start_clicked", {});
    const statusLabel = $("#statusLabel");
    if (statusLabel) statusLabel.textContent = "Em atendimento";
    toast("Consulta iniciada");
  });

  // Salvar
  const btnSave = $("#btnSave");
  btnSave?.addEventListener("click", async () => {
    window.telemedAnalytics?.track?.("consult_save_clicked", {});
    toast("Rascunho salvo");
  });

  // Finalizar
  const btnFinish = $("#btnFinish");
  btnFinish?.addEventListener("click", async () => {
    window.telemedAnalytics?.track?.("consult_finish_clicked", {});
    toast("Consulta finalizada");
  });
})();

// ---- Timer do banner
(() => {
  const timerEl = $("#pbTimer");
  if (!timerEl) return;
  
  let secs = 0;
  const t = setInterval(() => {
    secs++;
    const m = String(Math.floor(secs/60)).padStart(2,'0');
    const s = String(secs%60).padStart(2,'0');
    timerEl.textContent = `${m}:${s}`;
  }, 1000);
})();

// ---- Segmentos (Conduta/Exames/MedMed)
(() => {
  const segTabs = $$('.segtab');
  const segPanes = $$('[id^="seg-"]');
  
  segTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.seg;
      
      // Ativar tab
      segTabs.forEach(t => t.classList.toggle('active', t.dataset.seg === target));
      
      // Mostrar pane
      segPanes.forEach(pane => {
        pane.style.display = pane.id === `seg-${target}` ? 'block' : 'none';
      });
      
      window.telemedAnalytics?.track?.("segment_changed", { segment: target });
    });
  });
})();

// ---- Switches/toggles
(() => {
  $$('.sw').forEach(sw => {
    sw.addEventListener('click', () => {
      sw.classList.toggle('on');
      window.telemedAnalytics?.track?.("toggle_switch", { 
        switchId: sw.id,
        active: sw.classList.contains('on')
      });
    });
  });
})();

// ---- Debug utilities
window.telemedEnhancedDebug = Object.assign(window.telemedEnhancedDebug || {}, {
  resetLayout() { 
    localStorage.removeItem('telemed_notes_width'); 
    location.reload(); 
  },
  showAnalytics() {
    const ta = window.telemedAnalytics;
    if (!ta) return console.log('Analytics not loaded');
    console.group('📊 Enhanced Consultation Analytics');
    console.table(ta.all().filter(e => e.page.includes('enhanced')));
    console.groupEnd();
  }
});

  // ---- Export only what's needed globally
  window.telemedEnhancedDebug = telemedEnhancedDebug;
  
  console.log('🎯 Enhanced UX loaded - TeleMed Professional Interface');
})(); // End IIFE

// ---------- Resizer do painel lateral (flex/width) com persistência ----------
(function initSideResizer(){
  const side =
    document.querySelector('[data-panel="side"]') ||
    document.querySelector('.side-panel') ||
    document.querySelector('.right-panel') ||
    document.querySelector('.left-panel') ||
    document.querySelector('.consult-panel') ||
    document.querySelector('.consult-notes') ||
    document.querySelector('.split-right') ||
    document.querySelector('#rightPane');

  if (!side) return;

  // garante base
  side.style.position = side.style.position || 'relative';
  side.style.overflow = side.style.overflow || 'visible';

  // onde fica o handle? (direita se o painel está à esquerda da tela)
  const rect = side.getBoundingClientRect();
  const isLeft = rect.left < (window.innerWidth / 2);

  // limites e chave de storage
  const KEY = 'telemed_notes_width';
  const MIN = 320, MAX = 720;

  // helper para aplicar largura em qualquer layout
  const applyWidth = (wPx) => {
    const w = Math.min(MAX, Math.max(MIN, Math.round(wPx)));
    side.style.width = w + 'px';
    side.style.flex = '0 0 ' + w + 'px';   // funciona em flex layouts
    side.style.maxWidth = w + 'px';
    localStorage.setItem(KEY, String(w));
    return w;
  };

  // restaura se existir
  const saved = Number(localStorage.getItem(KEY));
  if (saved) applyWidth(saved);

  // injeta / posiciona handle
  let handle = document.getElementById('tmResizer');
  if (!handle) {
    handle = document.createElement('div');
    handle.id = 'tmResizer';
    side.appendChild(handle);
  }
  handle.style.left  = isLeft ? 'auto' : '-4px';
  handle.style.right = isLeft ? '-4px' : 'auto';

  let dragging = false, startX = 0, startW = parseInt(getComputedStyle(side).width,10)||480;

  const onMove = (e) => {
    if (!dragging) return;
    const x = (e.clientX || e.touches?.[0]?.clientX);
    const dx = x - startX;
    // se o painel está do lado esquerdo, arrastar para a direita aumenta (dx positivo)
    // se está do lado direito, o inverso
    const factor = isLeft ? 1 : -1;
    applyWidth(startW + factor * dx);
  };

  const stop = () => {
    dragging = false;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', stop);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('touchend', stop);
  };

  const start = (e) => {
    dragging = true;
    startX = (e.clientX || e.touches?.[0]?.clientX);
    startW = parseInt(getComputedStyle(side).width,10) || 480;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', onMove, {passive:false});
    window.addEventListener('touchend', stop);
  };

  handle.addEventListener('mousedown', start);
  handle.addEventListener('touchstart', start, {passive:false});

  // expõe helper no console e passa a RETORNAR o valor aplicado
  window.tmSetNotesWidth = (w) => applyWidth(Number(w)||480);
})();

// ---------- Card do paciente sobre o vídeo ----------
(function mountPatientBanner(){
  // Verificar se já existe um banner (evitar duplicação)
  if (document.getElementById('patientBanner')) return;
  
  // tenta localizar a área de vídeo
  const stage =
    document.querySelector('.video-area') ||
    document.querySelector('#videoStage') ||
    document.querySelector('.call-stage') ||
    document.querySelector('[data-video-stage]') ||
    document.querySelector('.split-left') ||
    document.querySelector('#leftPane');
  if (!stage) return;

  // colete dados já visíveis no cabeçalho/sua UI  
  const name  = (document.querySelector('[data-patient-name]') || document.querySelector('.patient-name') || document.querySelector('#pbName'))?.textContent?.trim() || 'Ana Costa Silva';
  const phone = (document.querySelector('[data-patient-phone]')|| document.querySelector('.patient-phone') || document.querySelector('#pbPhone'))?.textContent?.trim() || '11 98765-4321';
  const age   = (document.querySelector('[data-patient-age]')  || document.querySelector('.patient-age') || document.querySelector('#pbAge'))?.textContent?.trim() || '35 anos';

  const banner = document.createElement('div');
  banner.id = 'patientBanner';
  banner.innerHTML = `
    <div>
      <div class="name">${name}</div>
      <div class="meta">${phone ? '📞 ' + phone : ''}${age ? (phone ? ' • ' : '') + age : ''}</div>
    </div>
    <button id="pbInvite">Convite</button>
  `;
  stage.style.position = stage.style.position || 'relative';
  stage.appendChild(banner);

  // ação do convite
  const inviteBtn = banner.querySelector('#pbInvite');
  inviteBtn?.addEventListener('click', async () => {
    try {
      await fetch('/api/consults/ABC123/invite', { method: 'POST' });
      inviteBtn.textContent = 'Convite enviado';
      setTimeout(()=> inviteBtn.textContent = 'Convite', 2500);
    } catch (e) {
      console.warn('Falha ao enviar convite', e);
    }
  });
})();