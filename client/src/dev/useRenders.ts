import { useRef } from "react";

/**
 * Hook para contar re-renders de componentes em desenvolvimento
 * Útil para identificar componentes que estão re-renderizando desnecessariamente
 * 
 * @param name Nome do componente para identificação nos logs
 */
export function useRenders(name: string) {
  const c = useRef(0);
  c.current++;
  
  if (import.meta.env.DEV) {
    console.debug(`[renders] ${name}:`, c.current);
  }
}

/**
 * Hook avançado para monitorar re-renders com timestamp e props changes
 * 
 * @param name Nome do componente
 * @param props Props do componente para detectar mudanças
 */
export function useRendersAdvanced(name: string, props?: Record<string, any>) {
  const renderCount = useRef(0);
  const lastProps = useRef(props);
  const lastRenderTime = useRef(Date.now());
  
  renderCount.current++;
  const currentTime = Date.now();
  const timeDiff = currentTime - lastRenderTime.current;
  
  if (import.meta.env.DEV) {
    let changeInfo = '';
    
    if (props && lastProps.current) {
      const changedProps = Object.keys(props).filter(key => 
        props[key] !== lastProps.current?.[key]
      );
      
      if (changedProps.length > 0) {
        changeInfo = ` | props changed: ${changedProps.join(', ')}`;
      }
    }
    
    console.debug(
      `[renders] ${name}: #${renderCount.current} | ${timeDiff}ms since last${changeInfo}`
    );
  }
  
  lastProps.current = props;
  lastRenderTime.current = currentTime;
}

/**
 * Hook para alertar sobre re-renders excessivos
 * 
 * @param name Nome do componente
 * @param threshold Número máximo de renders antes do alerta (default: 10)
 */
export function useRenderAlert(name: string, threshold: number = 10) {
  const renderCount = useRef(0);
  const alertShown = useRef(false);
  
  renderCount.current++;
  
  if (import.meta.env.DEV) {
    console.debug(`[renders] ${name}:`, renderCount.current);
    
    if (renderCount.current > threshold && !alertShown.current) {
      console.warn(
        `🔥 [Performance Warning] ${name} has rendered ${renderCount.current} times! ` +
        `Consider using React.memo, useMemo, or useCallback to optimize.`
      );
      alertShown.current = true;
    }
  }
}