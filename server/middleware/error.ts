import type { ErrorRequestHandler, Request } from "express";
import { env } from "../config/env.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const status = (err as any).status || 500;
  const requestId = (req as any).requestId || 'unknown';
  
  // Log error with request ID for debugging
  console.error(`[${requestId}] Error ${status}:`, {
    message: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
  });
  
  // Send structured error response
  res.status(status).json({ 
    error: { 
      code: status, 
      message: err.message || "internal_error",
      requestId: requestId,
      ...(env.NODE_ENV === 'development' && { stack: err.stack })
    } 
  });
};