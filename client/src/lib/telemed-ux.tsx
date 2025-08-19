// client/src/lib/telemed-ux.tsx
import React, { useEffect, useMemo, useState } from 'react';

// =====================
// localStorage helpers
// =====================
const ANALYTICS_KEY = 'telemed_analytics';
const FEEDBACKS_KEY = 'telemed_feedbacks';
const MAX_EVENTS = 1000;

const BANNER_DISMISSED = 'telemed_banner_dismissed';
const BANNER_DISMISSED_DATE = 'telemed_banner_dismissed_date';
const BANNER_VALID_DAYS = 7; // validade após dismissal

const DASHBOARD_TESTED = 'telemed_dashboard_tested';
const DASHBOARD_TEST_DATE = 'telemed_dashboard_test_date';
const FEEDBACK_GIVEN = 'telemed_feedback_given';

function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, list: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list.slice(-MAX_EVENTS)));
  } catch {}
}

export type AnalyticsEvent = {
  event: string;
  data: Record<string, any>;
  timestamp: string; // ISO
  userAgent: string;
  page: string;
};

export function trackEvent(event: string, data: Record<string, any> = {}) {
  const entry: AnalyticsEvent = {
    event,
    data: { ...data, timestamp: new Date().toISOString() },
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    page: location.pathname,
  };
  const list = readList<AnalyticsEvent>(ANALYTICS_KEY);
  list.push(entry);
  writeList(ANALYTICS_KEY, list);
  // Google Analytics (se existir)
  // @ts-ignore
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    // @ts-ignore
    (window as any).gtag('event', event, entry.data);
  }
}

export type Feedback = {
  rating: number; // 1..5
  quickOptions?: string[]; // ["design","speed","navigation","mobile"]
  comments?: string;
  timestamp: string;
  userAgent: string;
  url: string;
};

export function saveFeedback(fb: Omit<Feedback, 'timestamp' | 'userAgent' | 'url'>) {
  const full: Feedback = {
    ...fb,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: location.href,
  };
  const list = readList<Feedback>(FEEDBACKS_KEY);
  list.push(full);
  writeList(FEEDBACKS_KEY, list);
  localStorage.setItem(FEEDBACK_GIVEN, 'true');
}

// =====================
// Banner (com 7 dias de validade)
// =====================
export function shouldShowBanner(): boolean {
  const dismissed = localStorage.getItem(BANNER_DISMISSED) === 'true';
  if (!dismissed) return true;
  const when = localStorage.getItem(BANNER_DISMISSED_DATE);
  if (!when) return true;
  const days = (Date.now() - new Date(when).getTime()) / (1000 * 60 * 60 * 24);
  return days > BANNER_VALID_DAYS;
}

export function dismissBanner() {
  localStorage.setItem(BANNER_DISMISSED, 'true');
  localStorage.setItem(BANNER_DISMISSED_DATE, new Date().toISOString());
}

export function markDashboardTested() {
  localStorage.setItem(DASHBOARD_TESTED, 'true');
  localStorage.setItem(DASHBOARD_TEST_DATE, new Date().toISOString());
}

export function Banner({ onFeedback }: { onFeedback?: () => void }) {
  const [visible, setVisible] = useState(shouldShowBanner());
  useEffect(() => {
    if (visible) trackEvent('banner_shown', {});
  }, [visible]);
  if (!visible) return null;
  return (
    <div style={styles.banner}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>🎉 Novo dashboard e consulta avançada disponíveis.</span>
        <button style={styles.btnPri} onClick={() => { markDashboardTested(); trackEvent('new_dashboard_clicked', { source: 'banner' }); location.href = '/consulta'; }}>Testar agora</button>
        <button style={styles.btnSec} onClick={() => { onFeedback?.(); trackEvent('banner_feedback_click', {}); }}>Dar feedback</button>
      </div>
      <button style={styles.btnX} onClick={() => { dismissBanner(); setVisible(false); trackEvent('banner_dismissed', {}); }}>✕</button>
    </div>
  );
}

// =====================
// Modal de Feedback
// =====================
export function FeedbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [rating, setRating] = useState<number>(0);
  const [quick, setQuick] = useState<string[]>([]);
  const [comments, setComments] = useState('');

  const toggle = (key: string) => setQuick(q => q.includes(key) ? q.filter(i => i !== key) : [...q, key]);
  const options = ['design', 'speed', 'navigation', 'mobile'];

  const canSend = rating > 0;

  if (!open) return null;
  return (
    <div style={styles.modalWrap} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Como foi a experiência?</h3>
        <p style={{ color: '#6B7280', marginTop: -6 }}>Avalie de 1 a 5 e selecione pontos rápidos</p>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setRating(n)} style={{ ...styles.star, background: rating >= n ? '#FBBF24' : '#E5E7EB' }}>{'★'}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {options.map(op => (
            <button key={op} onClick={() => toggle(op)} style={{ ...styles.pill, background: quick.includes(op) ? 'rgba(162,210,255,.22)' : '#fff', borderColor: quick.includes(op) ? 'rgba(162,210,255,.65)' : 'rgba(0,0,0,.12)' }}>{op}</button>
          ))}
        </div>
        <textarea placeholder="Comentários (opcional)" value={comments} onChange={e => setComments(e.target.value)} style={styles.textarea} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button style={styles.btnSec} onClick={onClose}>Cancelar</button>
          <button style={{ ...styles.btnPri, opacity: canSend ? 1 : .5, pointerEvents: canSend ? 'auto' : 'none' }}
            onClick={() => { saveFeedback({ rating, quickOptions: quick, comments }); trackEvent('feedback_submitted', { rating, quick }); onClose(); }}
          >Enviar</button>
        </div>
      </div>
    </div>
  );
}

// =====================
// Debug hooks em window
// =====================
export function registerDebug(showModal: () => void, hideModal: () => void) {
  if (typeof window === 'undefined') return;
  (window as any).telemedDebug = {
    testBanner: () => {
      localStorage.removeItem(BANNER_DISMISSED);
      localStorage.removeItem(BANNER_DISMISSED_DATE);
      location.reload();
    },
    testModal: () => showModal(),
    showModal: () => showModal(),
    hideModal: () => hideModal(),
  };
}

// =====================
// Estilos inline (suficiente p/ modal e banner)
// =====================
const styles: Record<string, React.CSSProperties> = {
  banner: {
    position: 'sticky', top: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 14px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,.06)', boxShadow: '0 2px 8px rgba(0,0,0,.05)', borderRadius: 12,
    marginBottom: 12
  },
  btnPri: { background: '#A2D2FF', border: '1px solid #A2D2FF', borderRadius: 10, padding: '8px 12px', fontWeight: 600, cursor: 'pointer' },
  btnSec: { background: 'transparent', border: '1px solid #A2D2FF', borderRadius: 10, padding: '8px 12px', fontWeight: 600, cursor: 'pointer' },
  btnX: { background: 'transparent', border: '1px solid rgba(0,0,0,.12)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' },
  modalWrap: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.25)', display: 'grid', placeItems: 'center', zIndex: 60 },
  modal: { width: 'min(560px, 92vw)', background: '#fff', border: '1px solid rgba(0,0,0,.06)', borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,.18)', padding: 20 },
  star: { width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(0,0,0,.1)', cursor: 'pointer' },
  pill: { borderRadius: 999, padding: '6px 10px', border: '1px solid rgba(0,0,0,.12)', cursor: 'pointer', background: '#fff' },
  textarea: { width: '100%', minHeight: 90, padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(0,0,0,.12)', marginTop: 10 }
};