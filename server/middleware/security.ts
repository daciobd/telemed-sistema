import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import type { Express } from "express";
import { env } from "../config/env.js";

export function applySecurity(app: Express) {
  // Remove server fingerprinting
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  
  // CORS configuration
  const origins = env.CORS_ORIGIN.split(",").map(origin => origin.trim());
  app.use(cors({ 
    origin: origins, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-ID']
  }));
  
  // Helmet security headers
  app.use(helmet({
    contentSecurityPolicy: env.NODE_ENV === "production" ? {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "'unsafe-inline'"],
        "connect-src": ["'self'", ...origins, "https://api.openai.com"],
        "img-src": ["'self'", "data:", "https:"],
        "font-src": ["'self'", "https:", "data:"],
        "style-src": ["'self'", "'unsafe-inline'", "https:"],
      },
    } : false, // no dev, manter flexível pro Replit
    crossOriginEmbedderPolicy: false, // Pode interferir com Replit
  }));
  
  // Compression middleware
  app.use(compression());
  
  // Payload size limiter
  app.use((req, _res, next) => {
    if (req.headers["content-length"] && Number(req.headers["content-length"]) > 2_000_000) {
      return next(Object.assign(new Error("Payload too large"), { status: 413 }));
    }
    next();
  });
}