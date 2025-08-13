import { useEffect } from "react";

export function usePerfMarks(name: string) {
  useEffect(() => {
    performance.mark(`${name}-mount`);
    return () => {
      performance.mark(`${name}-unmount`);
      performance.measure(`${name}-lifetime`, `${name}-mount`, `${name}-unmount`);
      const m = performance.getEntriesByName(`${name}-lifetime`).pop();
      if (m && process.env.NODE_ENV !== "production") {
        // útil para comparar antes/depois de correções
        console.debug(`[perf] ${name}: ${Math.round(m.duration)}ms`);
      }
    };
  }, [name]);
}