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

// Import security tables and types
export * from "./security";

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

// User storage table for Replit Auth + Credentials
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["patient", "doctor", "admin"] }).notNull().default("patient"),
  specialty: varchar("specialty"), // For doctors
  licenseNumber: varchar("license_number"), // For doctors
  passwordHash: varchar("password_hash"), // For credential-based auth
  isEmailVerified: boolean("is_email_verified").default(false),
  hasCompletedOnboarding: boolean("has_completed_onboarding").default(false),
  onboardingStep: integer("onboarding_step").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dateOfBirth: timestamp("date_of_birth"),
  phone: varchar("phone"),
  address: text("address"),
  cpf: varchar("cpf", { length: 14 }),
  emergencyContact: varchar("emergency_contact"),
  bloodType: varchar("blood_type"),
  allergies: text("allergies"),
  medications: text("medications"),
  chronicConditions: text("chronic_conditions"),
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
  offeredDateTime: timestamp("offered_date_time"),
  offeredPrice: numeric("offered_price", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  isAccepted: boolean("is_accepted").default(false),
  consultationPreference: varchar("consultation_preference", { length: 50 }).default("immediate"),
  requiresPreparation: boolean("requires_preparation").default(false),
  preparationMessage: text("preparation_message"),
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

// Dynamic Patient Journey Visualization - Core table for tracking patient interactions
export const patientJourneyEvents = pgTable("patient_journey_events", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  eventType: varchar("event_type", { 
    enum: ["registration", "appointment_scheduled", "appointment_completed", "prescription_issued", "lab_test_ordered", "lab_result_received", "symptom_reported", "follow_up_scheduled", "treatment_started", "treatment_completed", "emergency_visit", "specialist_referral", "medication_changed", "vital_signs_recorded"]
  }).notNull(),
  eventDate: timestamp("event_date").notNull(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  doctorId: integer("doctor_id").references(() => doctors.id),
  description: text("description"),
  severity: varchar("severity", { enum: ["low", "medium", "high", "critical"] }).default("medium"),
  category: varchar("category", { enum: ["administrative", "clinical", "diagnostic", "therapeutic", "preventive", "emergency"] }).notNull(),
  metadata: jsonb("metadata"), // Additional structured data specific to event type
  outcome: varchar("outcome", { enum: ["positive", "negative", "neutral", "pending"] }).default("neutral"),
  tags: jsonb("tags"), // Array of tags for filtering and grouping
  isVisible: boolean("is_visible").default(true), // For hiding sensitive events
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patient health metrics tracking for trend visualization
export const patientHealthMetrics = pgTable("patient_health_metrics", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  journeyEventId: integer("journey_event_id").references(() => patientJourneyEvents.id),
  metricType: varchar("metric_type", {
    enum: ["blood_pressure", "heart_rate", "weight", "height", "bmi", "temperature", "oxygen_saturation", "glucose_level", "cholesterol", "pain_level", "mood_score", "sleep_quality", "exercise_minutes", "medication_adherence"]
  }).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(), // mg/dl, mmHg, kg, bpm, etc.
  normalRangeMin: decimal("normal_range_min", { precision: 10, scale: 2 }),
  normalRangeMax: decimal("normal_range_max", { precision: 10, scale: 2 }),
  isNormal: boolean("is_normal").default(true),
  recordedAt: timestamp("recorded_at").notNull(),
  recordedBy: varchar("recorded_by", { enum: ["patient", "doctor", "nurse", "device"] }).default("patient"),
  deviceId: varchar("device_id"), // For IoT device tracking
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Patient journey milestones and goals
export const patientJourneyMilestones = pgTable("patient_journey_milestones", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description"),
  targetDate: timestamp("target_date"),
  completedDate: timestamp("completed_date"),
  milestoneType: varchar("milestone_type", {
    enum: ["treatment_goal", "recovery_target", "preventive_care", "lifestyle_change", "diagnostic_milestone", "therapeutic_milestone"]
  }).notNull(),
  status: varchar("status", { enum: ["planned", "in_progress", "completed", "overdue", "cancelled"] }).default("planned"),
  priority: varchar("priority", { enum: ["low", "medium", "high", "critical"] }).default("medium"),
  assignedDoctorId: integer("assigned_doctor_id").references(() => doctors.id),
  progress: integer("progress").default(0), // 0-100 percentage
  conditions: jsonb("conditions"), // Conditions that must be met
  rewards: jsonb("rewards"), // Achievements or benefits upon completion
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clinical examinations ordered by doctors
export const clinicalExams = pgTable("clinical_exams", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id).notNull(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  examType: varchar("exam_type", { length: 100 }).notNull(), // "blood", "urine", "imaging", "cardiac", etc.
  examName: varchar("exam_name", { length: 200 }).notNull(),
  priority: varchar("priority", { enum: ["routine", "urgent", "emergency"] }).default("routine"),
  instructions: text("instructions"),
  status: varchar("status", { enum: ["ordered", "scheduled", "completed", "cancelled"] }).default("ordered"),
  results: text("results"),
  resultDate: timestamp("result_date"),
  scheduledDate: timestamp("scheduled_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical referrals to other specialists
export const medicalReferrals = pgTable("medical_referrals", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id).notNull(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  referringDoctorId: integer("referring_doctor_id").references(() => doctors.id).notNull(),
  specialty: varchar("specialty").notNull(),
  consultationType: varchar("consultation_type").default("presential"), // presential, teleconsult
  clinicalSummary: text("clinical_summary").notNull(),
  requestedExams: text("requested_exams"),
  priority: varchar("priority").default("routine"), // routine, urgent, emergency
  notes: text("notes"),
  status: varchar("status").default("pending"), // pending, scheduled, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  scheduledFor: timestamp("scheduled_for"),
  completedAt: timestamp("completed_at"),
});

// Medical service evaluations by patients
export const medicalEvaluations = pgTable("medical_evaluations", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull().references(() => appointments.id, { onDelete: "cascade" }),
  patientId: integer("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  doctorId: integer("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  satisfactionRating: integer("satisfaction_rating").notNull(), // 1-5 scale
  knowledgeRating: integer("knowledge_rating").notNull(), // 1-5 scale  
  attentivenessRating: integer("attentiveness_rating").notNull(), // 1-5 scale
  testimonial: text("testimonial"), // Optional patient testimonial
  wouldRecommend: boolean("would_recommend").default(true),
  overallRating: integer("overall_rating").notNull(), // 1-5 scale (calculated average)
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

// Electronic Medical Records for consultations
export const consultationRecords = pgTable("consultation_records", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  
  // Clinical data
  chiefComplaint: text("chief_complaint"), // Queixa principal
  anamnesis: text("anamnesis"), // Anamnese
  diagnosis: text("diagnosis"), // Hipótese diagnóstica
  cidCode: varchar("cid_code"), // CID-10 code
  cidDescription: text("cid_description"), // CID-10 description
  treatment: text("treatment"), // Conduta
  
  // Additional clinical fields
  physicalExam: text("physical_exam"),
  vitalSigns: jsonb("vital_signs"), // { bp: "120/80", hr: "72", temp: "36.5" }
  notes: text("notes"),
  followUp: text("follow_up"),
  
  // Status and timestamps
  status: varchar("status").default("in_progress"), // in_progress, completed, draft
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CID-10 codes database for search functionality
export const cidCodes = pgTable("cid_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code").notNull().unique(), // Ex: F32.9
  category: varchar("category").notNull(), // Ex: F32
  description: text("description").notNull(), // Ex: Episódio depressivo não especificado
  shortDescription: varchar("short_description"), // Shorter version for UI
  keywords: text("keywords"), // Additional search terms
  chapter: varchar("chapter"), // CID chapter (F00-F99, etc)
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pre-consultation interview with psychologist
export const psychologistInterviews = pgTable("psychologist_interviews", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id).notNull(),
  psychologistId: integer("psychologist_id").references(() => doctors.id).notNull(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  interviewDate: timestamp("interview_date").notNull(),
  duration: integer("duration"), // minutes - set by psychologist after interview
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

// Doctor registration applications
export const doctorRegistrations = pgTable("doctor_registrations", {
  id: serial("id").primaryKey(),
  
  // Personal Information
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull().unique(),
  phone: varchar("phone").notNull(),
  cpf: varchar("cpf").notNull(),
  
  // Professional Information
  crm: varchar("crm").notNull(),
  specialty: varchar("specialty").notNull(),
  graduationYear: integer("graduation_year").notNull(),
  medicalSchool: varchar("medical_school").notNull(),
  
  // Experience
  yearsExperience: integer("years_experience").notNull(),
  currentWorkplace: varchar("current_workplace").notNull(),
  telemedicineExperience: boolean("telemedicine_experience").default(false),
  
  // Availability and Preferences
  availableHours: jsonb("available_hours"), // { "monday": ["09:00", "17:00"], ... }
  preferredConsultationTypes: jsonb("preferred_consultation_types"), // ["routine", "emergency", etc.]
  consultationFee: numeric("consultation_fee", { precision: 8, scale: 2 }), // Fee per consultation
  
  // Application Status
  status: varchar("status").default("pending"), // pending, approved, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  rejectionReason: text("rejection_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patient registration applications
export const patientRegistrations = pgTable("patient_registrations", {
  id: serial("id").primaryKey(),
  
  // Personal Information
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull().unique(),
  phone: varchar("phone").notNull(),
  cpf: varchar("cpf").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  gender: varchar("gender").notNull(),
  
  // Address
  address: text("address").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  zipCode: varchar("zip_code").notNull(),
  
  // Emergency Contact
  emergencyContactName: varchar("emergency_contact_name").notNull(),
  emergencyContactPhone: varchar("emergency_contact_phone").notNull(),
  emergencyContactRelation: varchar("emergency_contact_relation").notNull(),
  
  // Medical Information
  bloodType: varchar("blood_type"),
  allergies: text("allergies"),
  chronicConditions: text("chronic_conditions"),
  currentMedications: text("current_medications"),
  familyMedicalHistory: text("family_medical_history"),
  
  // Insurance
  hasInsurance: boolean("has_insurance").default(false),
  insuranceProvider: varchar("insurance_provider"),
  insuranceNumber: varchar("insurance_number"),
  
  // Account Creation
  password: varchar("password").notNull(), // Will be hashed
  agreedToTerms: boolean("agreed_to_terms").default(false),
  
  // Registration Status
  status: varchar("status").default("completed"), // completed (auto-approved for patients)
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
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
  journeyEvents: many(patientJourneyEvents),
  healthMetrics: many(patientHealthMetrics),
  journeyMilestones: many(patientJourneyMilestones),
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
  journeyEvents: many(patientJourneyEvents),
}));

export const patientJourneyEventsRelations = relations(patientJourneyEvents, ({ one, many }) => ({
  patient: one(patients, {
    fields: [patientJourneyEvents.patientId],
    references: [patients.id],
  }),
  appointment: one(appointments, {
    fields: [patientJourneyEvents.appointmentId],
    references: [appointments.id],
  }),
  doctor: one(doctors, {
    fields: [patientJourneyEvents.doctorId],
    references: [doctors.id],
  }),
  healthMetrics: many(patientHealthMetrics),
}));

export const patientHealthMetricsRelations = relations(patientHealthMetrics, ({ one }) => ({
  patient: one(patients, {
    fields: [patientHealthMetrics.patientId],
    references: [patients.id],
  }),
  journeyEvent: one(patientJourneyEvents, {
    fields: [patientHealthMetrics.journeyEventId],
    references: [patientJourneyEvents.id],
  }),
}));

export const patientJourneyMilestonesRelations = relations(patientJourneyMilestones, ({ one }) => ({
  patient: one(patients, {
    fields: [patientJourneyMilestones.patientId],
    references: [patients.id],
  }),
  assignedDoctor: one(doctors, {
    fields: [patientJourneyMilestones.assignedDoctorId],
    references: [doctors.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;
export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = typeof doctors.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = typeof medicalRecords.$inferInsert;
export type PatientJourneyEvent = typeof patientJourneyEvents.$inferSelect;
export type InsertPatientJourneyEvent = typeof patientJourneyEvents.$inferInsert;
export type PatientHealthMetric = typeof patientHealthMetrics.$inferSelect;
export type InsertPatientHealthMetric = typeof patientHealthMetrics.$inferInsert;
export type PatientJourneyMilestone = typeof patientJourneyMilestones.$inferSelect;
export type InsertPatientJourneyMilestone = typeof patientJourneyMilestones.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertPatientSchema = createInsertSchema(patients);
export const insertDoctorSchema = createInsertSchema(doctors);
export const insertAppointmentSchema = createInsertSchema(appointments);
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords);
export const insertPatientJourneyEventSchema = createInsertSchema(patientJourneyEvents);
export const insertPatientHealthMetricSchema = createInsertSchema(patientHealthMetrics);
export const insertPatientJourneyMilestoneSchema = createInsertSchema(patientJourneyMilestones);
export const insertDoctorRegistrationSchema = createInsertSchema(doctorRegistrations);
export const insertPatientRegistrationSchema = createInsertSchema(patientRegistrations);
export const insertPrescriptionSchema = createInsertSchema(prescriptions);
export const insertPsychologicalAssessmentSchema = createInsertSchema(psychologicalAssessments);
export const insertPsychiatryQuestionnaireSchema = createInsertSchema(psychiatryQuestionnaires);
export const insertClinicalExamSchema = createInsertSchema(clinicalExams);
export const insertMedicalReferralSchema = createInsertSchema(medicalReferrals);
export const insertConsultationRecordSchema = createInsertSchema(consultationRecords);
export const insertCidCodeSchema = createInsertSchema(cidCodes);
export const insertPsychologistInterviewSchema = createInsertSchema(psychologistInterviews);

// Auth schemas for JWT authentication
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["patient", "doctor"]).default("patient"),
  specialty: z.string().optional(),
  licenseNumber: z.string().optional(),
});

export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertPatientType = z.infer<typeof insertPatientSchema>;
export type InsertDoctorType = z.infer<typeof insertDoctorSchema>;
export type InsertAppointmentType = z.infer<typeof insertAppointmentSchema>;
export type InsertMedicalRecordType = z.infer<typeof insertMedicalRecordSchema>;
export type InsertPatientJourneyEventType = z.infer<typeof insertPatientJourneyEventSchema>;
export type InsertPatientHealthMetricType = z.infer<typeof insertPatientHealthMetricSchema>;
export type InsertPatientJourneyMilestoneType = z.infer<typeof insertPatientJourneyMilestoneSchema>;
export type DoctorRegistration = typeof doctorRegistrations.$inferSelect;
export type InsertDoctorRegistration = typeof doctorRegistrations.$inferInsert;
export type PatientRegistration = typeof patientRegistrations.$inferSelect;
export type InsertPatientRegistration = typeof patientRegistrations.$inferInsert;
export type InsertDoctorRegistrationType = z.infer<typeof insertDoctorRegistrationSchema>;
export type InsertPatientRegistrationType = z.infer<typeof insertPatientRegistrationSchema>;
export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = typeof prescriptions.$inferInsert;
export type PsychologicalAssessment = typeof psychologicalAssessments.$inferSelect;
export type InsertPsychologicalAssessment = typeof psychologicalAssessments.$inferInsert;
export type PsychiatryQuestionnaire = typeof psychiatryQuestionnaires.$inferSelect;
export type InsertPsychiatryQuestionnaire = typeof psychiatryQuestionnaires.$inferInsert;
export type ClinicalExam = typeof clinicalExams.$inferSelect;
export type InsertClinicalExam = typeof clinicalExams.$inferInsert;
export type MedicalReferral = typeof medicalReferrals.$inferSelect;
export type InsertMedicalReferral = typeof medicalReferrals.$inferInsert;
export type ConsultationRecord = typeof consultationRecords.$inferSelect;
export type InsertConsultationRecord = typeof consultationRecords.$inferInsert;
export type CidCode = typeof cidCodes.$inferSelect;
export type InsertCidCode = typeof cidCodes.$inferInsert;
export type PsychologistInterview = typeof psychologistInterviews.$inferSelect;
export type InsertPsychologistInterview = typeof psychologistInterviews.$inferInsert;

// Combined types for complex queries
export type UserWithProfile = User & {
  patient?: Patient;
  doctor?: Doctor;
};

export type AppointmentWithDetails = Appointment & {
  patient: PatientWithUser;
  doctor?: DoctorWithUser;
};

export type PatientWithUser = Patient & {
  user: User;
};

export type DoctorWithUser = Doctor & {
  user: User;
};