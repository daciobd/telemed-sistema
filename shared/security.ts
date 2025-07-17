import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

// LGPD Compliance and Security Tables

// Tabela de consentimentos LGPD
export const userConsents = pgTable("user_consents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  consentType: varchar("consent_type", { 
    enum: ["data_processing", "medical_data", "communication", "analytics", "marketing"] 
  }).notNull(),
  granted: boolean("granted").notNull(),
  purpose: text("purpose").notNull(), // Finalidade específica
  legalBasis: varchar("legal_basis", {
    enum: ["consent", "legitimate_interest", "legal_obligation", "vital_interests", "public_task", "contract"]
  }).notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  consentMethod: varchar("consent_method", {
    enum: ["web_form", "email", "phone", "physical_document"]
  }).notNull(),
  expiresAt: timestamp("expires_at"), // Consentimentos podem expirar
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela de logs de auditoria
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  action: varchar("action").notNull(), // CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT
  resourceType: varchar("resource_type").notNull(), // users, patients, medical_records, etc.
  resourceId: varchar("resource_id"),
  details: jsonb("details"), // Detalhes específicos da ação
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  result: varchar("result", { enum: ["success", "failure", "unauthorized"] }).notNull(),
  riskLevel: varchar("risk_level", { enum: ["low", "medium", "high", "critical"] }).default("low"),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela de tokens de sessão seguros
export const secureTokens = pgTable("secure_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  tokenHash: varchar("token_hash").notNull().unique(),
  tokenType: varchar("token_type", {
    enum: ["access", "refresh", "email_verification", "password_reset", "medical_access"]
  }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isRevoked: boolean("is_revoked").default(false),
  revokedAt: timestamp("revoked_at"),
  revokedReason: varchar("revoked_reason"),
  lastUsedAt: timestamp("last_used_at"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela de dados criptografados
export const encryptedData = pgTable("encrypted_data", {
  id: serial("id").primaryKey(),
  entityType: varchar("entity_type").notNull(), // medical_record, prescription, etc.
  entityId: varchar("entity_id").notNull(),
  fieldName: varchar("field_name").notNull(), // Nome do campo criptografado
  encryptedValue: text("encrypted_value").notNull(),
  encryptionMethod: varchar("encryption_method").default("AES-256-GCM"),
  keyVersion: integer("key_version").default(1),
  checksum: varchar("checksum"), // Para verificar integridade
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela de solicitações de direitos LGPD
export const lgpdRequests = pgTable("lgpd_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  requestType: varchar("request_type", {
    enum: ["access", "portability", "rectification", "deletion", "restriction", "objection"]
  }).notNull(),
  status: varchar("status", {
    enum: ["pending", "in_progress", "completed", "rejected", "cancelled"]
  }).notNull().default("pending"),
  description: text("description"),
  requestedData: jsonb("requested_data"), // Tipos específicos de dados solicitados
  responseData: jsonb("response_data"), // Dados fornecidos em resposta
  processedBy: varchar("processed_by"), // ID do funcionário que processou
  completedAt: timestamp("completed_at"),
  dueDate: timestamp("due_date"), // Prazo legal para resposta (geralmente 15 dias)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela de configurações de privacidade do usuário
export const privacySettings = pgTable("privacy_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  dataRetentionPeriod: integer("data_retention_period").default(365), // dias
  allowDataSharing: boolean("allow_data_sharing").default(false),
  allowAnalytics: boolean("allow_analytics").default(false),
  allowMarketing: boolean("allow_marketing").default(false),
  allowThirdPartySharing: boolean("allow_third_party_sharing").default(false),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  sessionTimeout: integer("session_timeout").default(30), // minutos
  notificationPreferences: jsonb("notification_preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schemas Zod para validação

export const insertUserConsentSchema = createInsertSchema(userConsents, {
  consentType: z.enum(["data_processing", "medical_data", "communication", "analytics", "marketing"]),
  legalBasis: z.enum(["consent", "legitimate_interest", "legal_obligation", "vital_interests", "public_task", "contract"]),
  granted: z.boolean(),
  purpose: z.string().min(10).max(500),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs, {
  action: z.string().min(1),
  resourceType: z.string().min(1),
  result: z.enum(["success", "failure", "unauthorized"]),
  riskLevel: z.enum(["low", "medium", "high", "critical"]).optional(),
});

export const insertLgpdRequestSchema = createInsertSchema(lgpdRequests, {
  requestType: z.enum(["access", "portability", "rectification", "deletion", "restriction", "objection"]),
  description: z.string().min(10).max(1000),
});

export const updatePrivacySettingsSchema = createInsertSchema(privacySettings).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UserConsent = typeof userConsents.$inferSelect;
export type InsertUserConsent = z.infer<typeof insertUserConsentSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

export type SecureToken = typeof secureTokens.$inferSelect;
export type InsertSecureToken = typeof secureTokens.$inferInsert;

export type EncryptedData = typeof encryptedData.$inferSelect;
export type InsertEncryptedData = typeof encryptedData.$inferInsert;

export type LgpdRequest = typeof lgpdRequests.$inferSelect;
export type InsertLgpdRequest = z.infer<typeof insertLgpdRequestSchema>;

export type PrivacySettings = typeof privacySettings.$inferSelect;
export type UpdatePrivacySettings = z.infer<typeof updatePrivacySettingsSchema>;

// Constantes de segurança
export const SECURITY_CONSTANTS = {
  JWT_ACCESS_TOKEN_EXPIRES: "15m",
  JWT_REFRESH_TOKEN_EXPIRES: "7d",
  SESSION_TIMEOUT_MINUTES: 30,
  PASSWORD_MIN_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
  ENCRYPTION_KEY_ROTATION_DAYS: 90,
  AUDIT_LOG_RETENTION_DAYS: 1095, // 3 anos
  CONSENT_VALIDITY_MONTHS: 24,
  LGPD_RESPONSE_DEADLINE_DAYS: 15,
} as const;

// Tipos de dados sensíveis que requerem criptografia
export const SENSITIVE_FIELDS = [
  "cpf",
  "phone", 
  "address",
  "bloodType",
  "allergies",
  "medications",
  "chronicConditions",
  "medicalHistory",
  "symptoms",
  "diagnosis",
  "prescription",
  "emergencyContact",
] as const;

export type SensitiveField = typeof SENSITIVE_FIELDS[number];