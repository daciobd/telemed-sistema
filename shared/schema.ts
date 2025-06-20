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
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["patient", "doctor", "admin"] }).notNull().default("patient"),
  specialty: varchar("specialty"), // For doctors
  licenseNumber: varchar("license_number"), // For doctors
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dateOfBirth: timestamp("date_of_birth"),
  phone: varchar("phone"),
  address: text("address"),
  emergencyContact: varchar("emergency_contact"),
  bloodType: varchar("blood_type"),
  allergies: text("allergies"),
  medicalHistory: text("medical_history"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  specialty: varchar("specialty").notNull(),
  licenseNumber: varchar("license_number").notNull().unique(),
  experience: integer("experience"), // years of experience
  consultationFee: integer("consultation_fee"), // in cents
  availableSlots: jsonb("available_slots"), // JSON array of time slots
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  doctorId: integer("doctor_id").references(() => doctors.id, { onDelete: "cascade" }), // nullable for initial requests
  appointmentDate: timestamp("appointment_date"),
  duration: integer("duration").notNull().default(30), // in minutes
  type: varchar("type", { enum: ["routine", "followup", "emergency", "telemedicine"] }).notNull(),
  status: varchar("status", { enum: ["scheduled", "confirmed", "completed", "cancelled", "rescheduled", "pending", "accepted", "no_immediate_response", "waiting_schedule_offers"] }).notNull().default("scheduled"),
  consultationType: varchar("consultation_type", { enum: ["immediate", "scheduled"] }).notNull().default("scheduled"),
  offeredPrice: numeric("offered_price", { precision: 10, scale: 2 }),
  acceptedPrice: numeric("accepted_price", { precision: 10, scale: 2 }),
  symptoms: text("symptoms"),
  notes: text("notes"),
  specialty: varchar("specialty", { length: 50 }),
  prescription: text("prescription"),
  diagnosis: text("diagnosis"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  doctorId: integer("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  recordType: varchar("record_type", { enum: ["consultation", "prescription", "lab_result", "diagnosis", "procedure"] }).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  attachments: jsonb("attachments"), // JSON array of file URLs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Table for doctor responses to teleconsultation requests
export const teleconsultResponses = pgTable("teleconsult_responses", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull().references(() => appointments.id, { onDelete: "cascade" }),
  doctorId: integer("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  responseType: varchar("response_type", { enum: ["immediate_accept", "schedule_offer", "declined"] }).notNull(),
  offeredDateTime: timestamp("offered_date_time"), // for schedule offers
  message: text("message"),
  isAccepted: boolean("is_accepted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  patient: one(patients, {
    fields: [users.id],
    references: [patients.userId],
  }),
  doctor: one(doctors, {
    fields: [users.id],
    references: [doctors.userId],
  }),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, {
    fields: [patients.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, {
    fields: [doctors.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
  medicalRecords: many(medicalRecords),
  teleconsultResponses: many(teleconsultResponses),
}));

export const teleconsultResponsesRelations = relations(teleconsultResponses, ({ one }) => ({
  appointment: one(appointments, {
    fields: [teleconsultResponses.appointmentId],
    references: [appointments.id],
  }),
  doctor: one(doctors, {
    fields: [teleconsultResponses.doctorId],
    references: [doctors.id],
  }),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [medicalRecords.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [medicalRecords.doctorId],
    references: [doctors.id],
  }),
  appointment: one(appointments, {
    fields: [medicalRecords.appointmentId],
    references: [appointments.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type MedicalRecord = typeof medicalRecords.$inferSelect;

// Extended types for API responses
export type UserWithProfile = User & {
  patient?: Patient;
  doctor?: Doctor;
};

export type AppointmentWithDetails = Appointment & {
  patient: Patient & { user: User };
  doctor: Doctor & { user: User };
};

export type PatientWithUser = Patient & {
  user: User;
  appointments?: AppointmentWithDetails[];
};

export type DoctorWithUser = Doctor & {
  user: User;
  appointments?: AppointmentWithDetails[];
};
