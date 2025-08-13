import type { Request, Response, NextFunction } from "express";

export const timing = (req: Request, res: Response, next: NextFunction) => {
  const t = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - t;
    if (ms > 300) {
      console.warn(`[slow] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
    }
    try {
      // Chrome DevTools > Network > Timing
      res.setHeader("Server-Timing", `total;dur=${ms}`);
    } catch {}
  });
  next();
};