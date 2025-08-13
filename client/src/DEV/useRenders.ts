// client/src/dev/useRenders.ts
import { useRef } from "react";

export function useRenders(name: string) {
  const c = useRef(0);
  c.current++;
  if (import.meta.env.MODE !== "production") {
    console.debug(`[renders] ${name}:`, c.current);
  }
}
