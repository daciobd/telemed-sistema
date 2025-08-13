import { useRef } from "react";

export function useRenders(name: string) {
  const c = useRef(0); 
  c.current++;
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[renders] ${name}:`, c.current);
  }
}