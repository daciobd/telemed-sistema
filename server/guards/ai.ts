import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export function requireAiEnabled(feature?: "symptoms" | "icd" | "interactions") {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if AI is globally enabled
    if (!env.AI_ENABLED) {
      return res.status(403).json({ error: "ai_disabled" });
    }
    
    // Check specific AI feature flags
    if (feature === "symptoms" && !env.AI_SYMPTOMS_ENABLED) {
      return res.status(403).json({ error: "ai_feature_disabled", feature });
    }
    if (feature === "icd" && !env.AI_ICD_SUGGESTION_ENABLED) {
      return res.status(403).json({ error: "ai_feature_disabled", feature });
    }
    if (feature === "interactions" && !env.AI_DRUG_INTERACTIONS_ENABLED) {
      return res.status(403).json({ error: "ai_feature_disabled", feature });
    }
    
    // Require authenticated user
    if (!(req as any).user) {
      return res.status(401).json({ error: "authentication_required" });
    }
    
    // Require doctor role for AI features
    if ((req as any).user.role !== "doctor") {
      return res.status(403).json({ error: "forbidden", required_role: "doctor" });
    }
    
    // Require medical consent for AI features
    if (!(req as any).userConsent) {
      return res.status(428).json({ 
        error: "consent_required",
        message: "Medical AI consent is required before using AI features"
      });
    }
    
    next();
  };
}