import type { Express, Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function applyRequestId(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const id = (req.headers["x-request-id"] as string) || randomUUID();
    (req as any).requestId = id;
    res.setHeader("x-request-id", id);
    next();
  });
}