/**
 * Development utilities for performance monitoring
 */

export { useRenders, useRendersAdvanced, useRenderAlert } from './useRenders';
export { usePerfMarks } from './usePerfMarks';

// Export development flag
export const isDev = import.meta.env.DEV;

/**
 * Global performance monitoring utilities
 */
export const perfUtils = {
  /**
   * Log component render with timing
   */
  logRender: (componentName: string, renderCount: number) => {
    if (isDev) {
      console.debug(`[renders] ${componentName}: #${renderCount}`);
    }
  },
  
  /**
   * Log performance mark
   */
  logMark: (markName: string) => {
    if (isDev && 'performance' in window) {
      performance.mark(markName);
      console.debug(`[perf] Mark: ${markName}`);
    }
  },
  
  /**
   * Measure performance between two marks
   */
  measure: (measureName: string, startMark: string, endMark: string) => {
    if (isDev && 'performance' in window) {
      try {
        performance.measure(measureName, startMark, endMark);
        const measure = performance.getEntriesByName(measureName)[0];
        console.debug(`[perf] ${measureName}: ${measure.duration.toFixed(2)}ms`);
      } catch (error) {
        console.warn(`[perf] Could not measure ${measureName}:`, error);
      }
    }
  }
};