import { pgTable, text, integer, timestamp, boolean, uuid, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  role: text("role", { enum: ["doctor", "patient", "admin"] }).notNull().default("doctor"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Patients table
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cpf: text("cpf").notNull(),
  email: text("email"),
  phone: text("phone"),
  birthDate: text("birth_date"),
  address: text("address"),
  healthPlan: text("health_plan"),
  planNumber: text("plan_number"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  medicalHistory: text("medical_history"),
  allergies: text("allergies"),
  medications: text("medications"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Consultations table
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  status: text("status", { enum: ["scheduled", "active", "completed", "cancelled"] }).notNull().default("scheduled"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  chiefComplaint: text("chief_complaint"),
  currentIllness: text("current_illness"),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  examRequests: text("exam_requests"),
  prescriptions: text("prescriptions"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Messages table for chat
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  consultationId: integer("consultation_id").notNull(),
  senderId: integer("sender_id").notNull(),
  senderType: text("sender_type", { enum: ["doctor", "patient"] }).notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Create insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  passwordHash: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
});

export const updatePatientSchema = insertPatientSchema.partial();

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type UpdatePatient = z.infer<typeof updatePatientSchema>;

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;