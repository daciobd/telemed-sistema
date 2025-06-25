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

export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  doctorId: integer("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  medications: text("medications").notNull(),
  dosage: varchar("dosage", { length: 100 }).notNull(),
  frequency: varchar("frequency", { length: 100 }).notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  instructions: text("instructions"),
  status: varchar("status", { enum: ["active", "completed", "cancelled"] }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Psychological Assessment for psychiatry consultations
export const psychologicalAssessments = pgTable("psychological_assessments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  
  // Basic assessment scores
  anxietyLevel: integer("anxiety_level"), // 1-10 scale
  depressionLevel: integer("depression_level"), // 1-10 scale
  stressLevel: integer("stress_level"), // 1-10 scale
  sleepQuality: integer("sleep_quality"), // 1-10 scale
  moodStability: integer("mood_stability"), // 1-10 scale
  
  // Quick psychological tests results
  phq9Score: integer("phq9_score"), // Depression screening
  gad7Score: integer("gad7_score"), // Anxiety screening
  
  // Assessment summary
  riskLevel: varchar("risk_level").default("low"), // low, medium, high, urgent
  recommendedActions: jsonb("recommended_actions"), // Array of recommendations
  notes: text("notes"),
  
  completedAt: timestamp("completed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pre-consultation questionnaire for psychiatry
export const psychiatryQuestionnaires = pgTable("psychiatry_questionnaires", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  
  // Current symptoms and concerns
  currentSymptoms: jsonb("current_symptoms"), // Array of selected symptoms
  symptomDuration: varchar("symptom_duration"), // weeks, months, years
  symptomSeverity: integer("symptom_severity"), // 1-10 scale
  triggerEvents: text("trigger_events"),
  
  // Medical history
  previousTreatment: boolean("previous_treatment").default(false),
  currentMedications: jsonb("current_medications"), // Array of medications
  familyHistory: jsonb("family_history"), // Mental health family history
  medicalConditions: jsonb("medical_conditions"), // Other medical conditions
  
  // Lifestyle factors
  sleepHours: integer("sleep_hours"),
  exerciseFrequency: varchar("exercise_frequency"),
  alcoholUse: varchar("alcohol_use"), // none, occasional, moderate, frequent
  substanceUse: varchar("substance_use"), // none, occasional, frequent
  smokingStatus: varchar("smoking_status"), // none, former, current
  
  // Social and work factors
  workStress: integer("work_stress"), // 1-10 scale
  relationshipStatus: varchar("relationship_status"),
  supportSystem: integer("support_system"), // 1-10 scale
  financialStress: integer("financial_stress"), // 1-10 scale
  
  // Goals and expectations
  treatmentGoals: text("treatment_goals"),
  preferredApproach: varchar("preferred_approach"), // therapy, medication, both
  concerns: text("concerns"),
  
  completedAt: timestamp("completed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pre-consultation interview with psychologist
export const psychologistInterviews = pgTable("psychologist_interviews", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id).notNull(),
  psychologistId: integer("psychologist_id").references(() => doctors.id).notNull(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  interviewDate: timestamp("interview_date").notNull(),
  duration: integer("duration"), // minutes
  status: varchar("status").default("scheduled"), // scheduled, completed, cancelled
  psychodynamicSummary: text("psychodynamic_summary"),
  personalityProfile: text("personality_profile"),
  copingMechanisms: text("coping_mechanisms"),
  interpersonalPatterns: text("interpersonal_patterns"),
  defenseStructures: text("defense_structures"),
  emotionalRegulation: text("emotional_regulation"),
  recommendations: text("recommendations"),
  riskFactors: text("risk_factors"),
  strengths: text("strengths"),
  therapeuticAlliance: text("therapeutic_alliance"),
  transferenceNotes: text("transference_notes"),
  countertransferenceNotes: text("countertransference_notes"),
  treatmentRecommendations: text("treatment_recommendations"),
  urgencyLevel: varchar("urgency_level"), // low, moderate, high, urgent
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  prescriptions: many(prescriptions),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, {
    fields: [doctors.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
  prescriptions: many(prescriptions),
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

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  patient: one(patients, {
    fields: [prescriptions.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [prescriptions.doctorId],
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

export const psychologicalAssessmentsRelations = relations(psychologicalAssessments, ({ one }) => ({
  patient: one(patients, {
    fields: [psychologicalAssessments.patientId],
    references: [patients.id],
  }),
  appointment: one(appointments, {
    fields: [psychologicalAssessments.appointmentId],
    references: [appointments.id],
  }),
}));

export const psychiatryQuestionnairesRelations = relations(psychiatryQuestionnaires, ({ one }) => ({
  patient: one(patients, {
    fields: [psychiatryQuestionnaires.patientId],
    references: [patients.id],
  }),
  appointment: one(appointments, {
    fields: [psychiatryQuestionnaires.appointmentId],
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

export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPsychologicalAssessmentSchema = createInsertSchema(psychologicalAssessments).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertPsychiatryQuestionnaireSchema = createInsertSchema(psychiatryQuestionnaires).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertPsychologistInterviewSchema = createInsertSchema(psychologistInterviews).omit({
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

export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type Prescription = typeof prescriptions.$inferSelect;

export type InsertPsychologicalAssessment = z.infer<typeof insertPsychologicalAssessmentSchema>;
export type PsychologicalAssessment = typeof psychologicalAssessments.$inferSelect;

export type InsertPsychiatryQuestionnaire = z.infer<typeof insertPsychiatryQuestionnaireSchema>;
export type PsychiatryQuestionnaire = typeof psychiatryQuestionnaires.$inferSelect;

export type InsertPsychologistInterview = z.infer<typeof insertPsychologistInterviewSchema>;
export type PsychologistInterview = typeof psychologistInterviews.$inferSelect;

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
