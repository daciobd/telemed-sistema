
// TeleMed Unified Schema - Source of Truth
// Fusão TeleMed + Health Connect - Normalizado

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
  numeric,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === CORE AUTHENTICATION (TeleMed Source of Truth) ===
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["patient", "doctor", "admin"] }).notNull().default("patient"),
  specialty: varchar("specialty"),
  licenseNumber: varchar("license_number"),
  passwordHash: varchar("password_hash"),
  isEmailVerified: boolean("is_email_verified").default(false),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  onboardingStep: integer("onboarding_step").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === UNIFIED CONSULTATION MODEL ===
export const consultations = pgTable("consultations", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: varchar("patient_id").references(() => users.id),
  doctorId: varchar("doctor_id").references(() => users.id),
  type: varchar("type", { enum: ["video", "enhanced", "specialized", "exam"] }).notNull(),
  status: varchar("status", { enum: ["scheduled", "active", "completed", "cancelled"] }).default("scheduled"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in minutes
  notes: text("notes"),
  prescription: jsonb("prescription"),
  diagnosis: text("diagnosis"),
  symptoms: jsonb("symptoms"),
  aiAnalysis: jsonb("ai_analysis"),
  videoRoomId: varchar("video_room_id"),
  recordingUrl: varchar("recording_url"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === UNIFIED EXAM ORDER MODEL ===
export const examOrders = pgTable("exam_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  consultationId: uuid("consultation_id").references(() => consultations.id),
  patientId: varchar("patient_id").references(() => users.id),
  doctorId: varchar("doctor_id").references(() => users.id),
  examType: varchar("exam_type").notNull(),
  priority: varchar("priority", { enum: ["low", "normal", "high", "urgent"] }).default("normal"),
  status: varchar("status", { enum: ["ordered", "scheduled", "in_progress", "completed", "cancelled"] }).default("ordered"),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  results: jsonb("results"),
  resultsPdf: varchar("results_pdf"),
  instructions: text("instructions"),
  clinicId: varchar("clinic_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === UNIFIED PAYMENT MODEL ===
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  consultationId: uuid("consultation_id").references(() => consultations.id),
  examOrderId: uuid("exam_order_id").references(() => examOrders.id),
  patientId: varchar("patient_id").references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("BRL"),
  status: varchar("status", { enum: ["pending", "processing", "completed", "failed", "refunded"] }).default("pending"),
  paymentMethod: varchar("payment_method", { enum: ["credit_card", "debit_card", "pix", "boleto", "insurance"] }),
  transactionId: varchar("transaction_id"),
  providerId: varchar("provider_id"), // Stripe, PagSeguro, etc.
  metadata: jsonb("metadata"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === RELATIONS ===
export const consultationsRelations = relations(consultations, ({ one, many }) => ({
  patient: one(users, { fields: [consultations.patientId], references: [users.id] }),
  doctor: one(users, { fields: [consultations.doctorId], references: [users.id] }),
  examOrders: many(examOrders),
  payments: many(payments),
}));

export const examOrdersRelations = relations(examOrders, ({ one }) => ({
  consultation: one(consultations, { fields: [examOrders.consultationId], references: [consultations.id] }),
  patient: one(users, { fields: [examOrders.patientId], references: [users.id] }),
  doctor: one(users, { fields: [examOrders.doctorId], references: [users.id] }),
  payment: one(payments, { fields: [examOrders.id], references: [payments.examOrderId] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  consultation: one(consultations, { fields: [payments.consultationId], references: [consultations.id] }),
  examOrder: one(examOrders, { fields: [payments.examOrderId], references: [examOrders.id] }),
  patient: one(users, { fields: [payments.patientId], references: [users.id] }),
}));

// === ZOD SCHEMAS ===
export const insertConsultationSchema = createInsertSchema(consultations);
export const insertExamOrderSchema = createInsertSchema(examOrders);
export const insertPaymentSchema = createInsertSchema(payments);

export type Consultation = typeof consultations.$inferSelect;
export type ExamOrder = typeof examOrders.$inferSelect;
export type Payment = typeof payments.$inferSelect;

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type InsertExamOrder = z.infer<typeof insertExamOrderSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
