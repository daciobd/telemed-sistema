import { z } from "zod";

export const env = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  SESSION_SECRET: z.string().min(32),
  COOKIE_SECRET: z.string().min(16),
  
  // IA flags (desligadas por padrão em prod)
  AI_ENABLED: z.string().transform(v => v === "true").default("false"),
  AI_SYMPTOMS_ENABLED: z.string().transform(v => v === "true").default("false"),
  AI_ICD_SUGGESTION_ENABLED: z.string().transform(v => v === "true").default("false"),
  AI_DRUG_INTERACTIONS_ENABLED: z.string().transform(v => v === "true").default("false"),
  
  // OpenAI
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL_PRIMARY: z.string().default("gpt-4"),
  OPENAI_MODEL_FALLBACK: z.string().default("gpt-3.5-turbo"),
  
  // CORS
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  
  // Slack/Webhooks
  ALERT_WEBHOOK_URL: z.string().url().optional(),
  SLACK_BOT_TOKEN: z.string().optional(),
  SLACK_CHANNEL_ID: z.string().optional(),
  
  // Encryption
  MEDICAL_ENCRYPTION_KEY: z.string().min(32).optional(),
  
  // External Services
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  
  // Replit specific
  REPL_ID: z.string().optional(),
  REPLIT_DOMAINS: z.string().optional(),
}).parse(process.env);

export default env;