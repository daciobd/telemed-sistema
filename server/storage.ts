import {
  users,
  patients,
  doctors,
  appointments,
  medicalRecords,
  teleconsultResponses,
  prescriptions,
  psychologicalAssessments,
  psychiatryQuestionnaires,
  type User,
  type UpsertUser,
  type Patient,
  type InsertPatient,
  type Doctor,
  type InsertDoctor,
  type Appointment,
  type InsertAppointment,
  type MedicalRecord,
  type InsertMedicalRecord,
  type Prescription,
  type InsertPrescription,
  type PsychologicalAssessment,
  type InsertPsychologicalAssessment,
  type PsychiatryQuestionnaire,
  type InsertPsychiatryQuestionnaire,
  type UserWithProfile,
  type AppointmentWithDetails,
  type PatientWithUser,
  type DoctorWithUser,
  type PsychologistInterview,
  type InsertPsychologistInterview,
  clinicalExams,
  medicalReferrals,
  medicalEvaluations,
  paymentTransactions,
  doctorEarnings,
  psychologistInterviews,
  type PaymentTransaction,
  type InsertPaymentTransaction,
  type ClinicalExam,
  type InsertClinicalExam,
  type MedicalReferral,
  type InsertMedicalReferral,
  doctorRegistrations,
  patientRegistrations,
  type DoctorRegistration,
  type InsertDoctorRegistration,
  type PatientRegistration,
  type InsertPatientRegistration,
  consultationRecords,
  cidCodes,
  type ConsultationRecord,
  type InsertConsultationRecord,
  type CidCode,
  type InsertCidCode,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserWithProfile(id: string): Promise<UserWithProfile | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Patient operations
  createPatient(patient: InsertPatient): Promise<Patient>;
  getPatient(id: number): Promise<Patient | undefined>;
  getPatientByUserId(userId: string): Promise<Patient | undefined>;
  getPatientWithUser(id: number): Promise<PatientWithUser | undefined>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient>;
  getAllPatients(): Promise<PatientWithUser[]>;
  
  // Doctor operations
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  getDoctorByUserId(userId: string): Promise<Doctor | undefined>;
  getDoctorWithUser(id: number): Promise<DoctorWithUser | undefined>;
  updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor>;
  getAllDoctors(): Promise<DoctorWithUser[]>;
  
  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentWithDetails(id: number): Promise<AppointmentWithDetails | undefined>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;
  getAppointmentsByPatient(patientId: number): Promise<AppointmentWithDetails[]>;
  getAppointmentsByDoctor(doctorId: number): Promise<AppointmentWithDetails[]>;
  getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<AppointmentWithDetails[]>;
  getTodayAppointmentsByDoctor(doctorId: number): Promise<AppointmentWithDetails[]>;
  
  // Teleconsultation auction operations
  createTeleconsultRequest(data: any): Promise<Appointment>;
  getTeleconsultRequest(id: number): Promise<Appointment | undefined>;
  updateAppointmentStatus(id: number, status: string): Promise<void>;
  simulateDoctorResponses(appointmentId: number, doctors: any[], offeredPrice: number, consultationType: string): Promise<void>;
  getTeleconsultResponses(appointmentId: number): Promise<any[]>;
  acceptDoctorResponse(appointmentId: number, responseId: number): Promise<Appointment>;
  createTeleconsultResponse(data: any): Promise<any>;
  
  // Consultation workflow operations
  updateAppointmentWorkflow(appointmentId: number, workflowData: any): Promise<Appointment>;
  getAppointmentWithWorkflowStatus(appointmentId: number): Promise<any>;
  getPreparationStatus(appointmentId: number): Promise<any>;
  advanceConsultationDueToRisk(appointmentId: number): Promise<Appointment>;
  
  // Medical record operations
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  getMedicalRecord(id: number): Promise<MedicalRecord | undefined>;
  updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord>;
  deleteMedicalRecord(id: number): Promise<void>;
  getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]>;
  getMedicalRecordsByDoctor(doctorId: number): Promise<MedicalRecord[]>;
  
  // Prescription operations
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  getPrescription(id: number): Promise<Prescription | undefined>;
  updatePrescription(id: number, prescription: Partial<InsertPrescription>): Promise<Prescription>;
  deletePrescription(id: number): Promise<void>;
  getPrescriptionsByPatient(patientId: number): Promise<any[]>;
  getPrescriptionsByDoctor(doctorId: number): Promise<any[]>;
  getAllPrescriptions(): Promise<any[]>;
  
  // Psychological Assessment operations
  createPsychologicalAssessment(assessment: InsertPsychologicalAssessment): Promise<PsychologicalAssessment>;
  getPsychologicalAssessment(id: number): Promise<PsychologicalAssessment | undefined>;
  getPsychologicalAssessmentByAppointment(appointmentId: number): Promise<PsychologicalAssessment | undefined>;
  updatePsychologicalAssessment(id: number, assessment: Partial<InsertPsychologicalAssessment>): Promise<PsychologicalAssessment>;
  
  // Psychiatry Questionnaire operations
  createPsychiatryQuestionnaire(questionnaire: InsertPsychiatryQuestionnaire): Promise<PsychiatryQuestionnaire>;
  getPsychiatryQuestionnaire(id: number): Promise<PsychiatryQuestionnaire | undefined>;
  getPsychiatryQuestionnaireByAppointment(appointmentId: number): Promise<PsychiatryQuestionnaire | undefined>;
  updatePsychiatryQuestionnaire(id: number, questionnaire: Partial<InsertPsychiatryQuestionnaire>): Promise<PsychiatryQuestionnaire>;
  
  // Psychologist Interview operations
  createPsychologistInterview(interview: InsertPsychologistInterview): Promise<PsychologistInterview>;
  getPsychologistInterview(id: number): Promise<PsychologistInterview | undefined>;
  getPsychologistInterviewByAppointment(appointmentId: number): Promise<PsychologistInterview | undefined>;
  updatePsychologistInterview(id: number, interview: Partial<InsertPsychologistInterview>): Promise<PsychologistInterview>;
  getAvailablePsychologists(): Promise<DoctorWithUser[]>;
  schedulePsychologistInterview(appointmentId: number, psychologistId: number, interviewDate: Date): Promise<PsychologistInterview>;
  
  // Clinical exam operations
  createClinicalExam(exam: any): Promise<any>;
  getClinicalExamsByDoctor(doctorId: number): Promise<any[]>;
  getClinicalExamsByPatient(patientId: number): Promise<any[]>;
  
  // Medical referral operations
  createMedicalReferral(referral: any): Promise<any>;
  getMedicalReferralsByDoctor(doctorId: number): Promise<any[]>;
  getMedicalReferralsByPatient(patientId: number): Promise<any[]>;
  
  // Medical evaluation operations
  createMedicalEvaluation(evaluation: any): Promise<any>;
  getMedicalEvaluationsByDoctor(doctorId: number): Promise<any[]>;
  getMedicalEvaluationsByPatient(patientId: number): Promise<any[]>;
  getMedicalEvaluationByAppointment(appointmentId: number): Promise<any | undefined>;
  
  // Payment operations
  createPaymentTransaction(transaction: any): Promise<any>;
  getPaymentTransactionsByDoctor(doctorId: number): Promise<any[]>;
  getDoctorEarnings(doctorId: number): Promise<any[]>;
  
  // Registration operations
  createDoctorRegistration(registration: InsertDoctorRegistration): Promise<DoctorRegistration>;
  createPatientRegistration(registration: InsertPatientRegistration): Promise<PatientRegistration>;
  updatePatientRegistration(id: number, updates: Partial<PatientRegistration>): Promise<PatientRegistration>;
  getDoctorRegistrations(): Promise<DoctorRegistration[]>;
  getPatientRegistrations(): Promise<PatientRegistration[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserWithProfile(id: string): Promise<UserWithProfile | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const patient = await this.getPatientByUserId(id);
    const doctor = await this.getDoctorByUserId(id);

    return {
      ...user,
      patient: patient || undefined,
      doctor: doctor || undefined,
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Patient operations
  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db.insert(patients).values(patient).returning();
    return newPatient;
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async getPatientByUserId(userId: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.userId, userId));
    return patient;
  }

  async getPatientWithUser(id: number): Promise<PatientWithUser | undefined> {
    const [result] = await db
      .select()
      .from(patients)
      .leftJoin(users, eq(patients.userId, users.id))
      .where(eq(patients.id, id));

    if (!result || !result.users) return undefined;

    return {
      ...result.patients,
      user: result.users,
    };
  }

  async updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient> {
    const [updatedPatient] = await db
      .update(patients)
      .set({ ...patient, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return updatedPatient;
  }

  async getAllPatients(): Promise<PatientWithUser[]> {
    const results = await db
      .select()
      .from(patients)
      .leftJoin(users, eq(patients.userId, users.id))
      .orderBy(desc(patients.createdAt));

    return results
      .filter(result => result.users)
      .map(result => ({
        ...result.patients,
        user: result.users!,
      }));
  }

  // Doctor operations
  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const [newDoctor] = await db.insert(doctors).values(doctor).returning();
    return newDoctor;
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }

  async getDoctorByUserId(userId: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, userId));
    return doctor;
  }

  async getDoctorWithUser(id: number): Promise<DoctorWithUser | undefined> {
    const [result] = await db
      .select()
      .from(doctors)
      .leftJoin(users, eq(doctors.userId, users.id))
      .where(eq(doctors.id, id));

    if (!result || !result.users) return undefined;

    return {
      ...result.doctors,
      user: result.users,
    };
  }

  async updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor> {
    const [updatedDoctor] = await db
      .update(doctors)
      .set({ ...doctor, updatedAt: new Date() })
      .where(eq(doctors.id, id))
      .returning();
    return updatedDoctor;
  }

  async getAllDoctors(): Promise<DoctorWithUser[]> {
    const results = await db
      .select()
      .from(doctors)
      .leftJoin(users, eq(doctors.userId, users.id))
      .orderBy(desc(doctors.createdAt));

    return results
      .filter(result => result.users)
      .map(result => ({
        ...result.doctors,
        user: result.users!,
      }));
  }

  // Appointment operations
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async getAppointmentWithDetails(id: number): Promise<AppointmentWithDetails | undefined> {
    const appointment = await this.getAppointment(id);
    if (!appointment) return undefined;

    const patient = await this.getPatientWithUser(appointment.patientId);
    const doctor = await this.getDoctorWithUser(appointment.doctorId);
    
    if (!patient || !doctor) return undefined;

    return {
      ...appointment,
      patient,
      doctor,
    };
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ ...appointment, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  async getAppointmentsByPatient(patientId: number): Promise<AppointmentWithDetails[]> {
    // First get all appointments for the patient
    const appointmentList = await db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, patientId))
      .orderBy(desc(appointments.appointmentDate));

    // Then get detailed information for each appointment
    const results = [];
    for (const appointment of appointmentList) {
      const patient = await this.getPatientWithUser(appointment.patientId);
      const doctor = await this.getDoctorWithUser(appointment.doctorId);
      
      if (patient && doctor) {
        results.push({
          ...appointment,
          patient,
          doctor,
        });
      }
    }

    return results;
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<AppointmentWithDetails[]> {
    const appointmentList = await db
      .select()
      .from(appointments)
      .where(eq(appointments.doctorId, doctorId))
      .orderBy(desc(appointments.appointmentDate));

    const results = [];
    for (const appointment of appointmentList) {
      const patient = await this.getPatientWithUser(appointment.patientId);
      const doctor = await this.getDoctorWithUser(appointment.doctorId);
      
      if (patient && doctor) {
        results.push({
          ...appointment,
          patient,
          doctor,
        });
      }
    }

    return results;
  }

  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<AppointmentWithDetails[]> {
    const appointmentList = await db
      .select()
      .from(appointments)
      .where(
        and(
          gte(appointments.appointmentDate, startDate),
          lte(appointments.appointmentDate, endDate)
        )
      )
      .orderBy(appointments.appointmentDate);

    const results = [];
    for (const appointment of appointmentList) {
      const patient = await this.getPatientWithUser(appointment.patientId);
      const doctor = await this.getDoctorWithUser(appointment.doctorId);
      
      if (patient && doctor) {
        results.push({
          ...appointment,
          patient,
          doctor,
        });
      }
    }

    return results;
  }

  async getTodayAppointmentsByDoctor(doctorId: number): Promise<AppointmentWithDetails[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Simplificada para evitar erros SQL
    const appointmentResults = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          gte(appointments.appointmentDate, startOfDay),
          lte(appointments.appointmentDate, endOfDay)
        )
      )
      .orderBy(appointments.appointmentDate);

    const resultsWithDetails = [];
    for (const appointment of appointmentResults) {
      if (appointment.patientId && appointment.doctorId) {
        const patient = await this.getPatientWithUser(appointment.patientId);
        const doctor = await this.getDoctorWithUser(appointment.doctorId);
        
        if (patient && doctor) {
          resultsWithDetails.push({
            ...appointment,
            patient,
            doctor,
          } as AppointmentWithDetails);
        }
      }
    }

    return resultsWithDetails;
  }

  // Medical record operations
  async createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const [newRecord] = await db.insert(medicalRecords).values(record).returning();
    return newRecord;
  }

  async getMedicalRecord(id: number): Promise<MedicalRecord | undefined> {
    const [record] = await db.select().from(medicalRecords).where(eq(medicalRecords.id, id));
    return record;
  }

  async updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord> {
    const [updatedRecord] = await db
      .update(medicalRecords)
      .set({ ...record, updatedAt: new Date() })
      .where(eq(medicalRecords.id, id))
      .returning();
    return updatedRecord;
  }

  async deleteMedicalRecord(id: number): Promise<void> {
    await db.delete(medicalRecords).where(eq(medicalRecords.id, id));
  }

  async getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]> {
    return await db
      .select()
      .from(medicalRecords)
      .where(eq(medicalRecords.patientId, patientId))
      .orderBy(desc(medicalRecords.createdAt));
  }

  async getMedicalRecordsByDoctor(doctorId: number): Promise<MedicalRecord[]> {
    return await db
      .select()
      .from(medicalRecords)
      .where(eq(medicalRecords.doctorId, doctorId))
      .orderBy(desc(medicalRecords.createdAt));
  }

  // Teleconsultation auction operations
  async createTeleconsultRequest(data: any): Promise<Appointment> {
    const [appointment] = await db.insert(appointments).values(data).returning();
    return appointment;
  }

  async getTeleconsultRequest(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<void> {
    await db.update(appointments).set({ status }).where(eq(appointments.id, id));
  }

  async simulateDoctorResponses(appointmentId: number, doctors: any[], offeredPrice: number, consultationType: string): Promise<void> {
    // Simulate realistic doctor responses based on price and consultation type
    const responses = [];
    
    for (const doctor of doctors.slice(0, Math.min(4, doctors.length))) {
      // Response probability based on price (higher price = more likely to accept)
      const priceScore = Math.min(offeredPrice / 400, 1); // Max score at R$ 400+
      const acceptanceProbability = priceScore * 0.6 + 0.2; // 20% base + up to 60% based on price
      
      let responseType: string;
      let offeredDateTime = null;
      let message = "";

      if (Math.random() < acceptanceProbability) {
        if (consultationType === "immediate" && Math.random() < 0.7) {
          responseType = "immediate_accept";
          message = "Disponível agora! Iniciando videochamada...";
        } else {
          responseType = "schedule_offer";
          // Offer realistic time slots
          const now = new Date();
          const hoursToAdd = Math.random() < 0.5 ? 
            Math.floor(Math.random() * 6) + 1 : // Next 1-6 hours
            Math.floor(Math.random() * 48) + 24; // Tomorrow or day after
          offeredDateTime = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
          message = `Posso atender ${offeredDateTime.toLocaleDateString('pt-BR')} às ${offeredDateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        }
      } else {
        responseType = "declined";
        const reasons = [
          "Valor abaixo do meu honorário mínimo",
          "Não tenho horário disponível hoje",
          "Especialidade muito específica para este valor",
          "Agenda lotada nas próximas 48h"
        ];
        message = reasons[Math.floor(Math.random() * reasons.length)];
      }

      responses.push({
        appointmentId,
        doctorId: doctor.id,
        responseType,
        offeredDateTime,
        message,
      });
    }

    // Insert all responses immediately for demo
    for (const response of responses) {
      await db.insert(teleconsultResponses).values({
        appointmentId: response.appointmentId,
        doctorId: response.doctorId,
        responseType: response.responseType as "immediate_accept" | "schedule_offer" | "declined",
        offeredDateTime: response.offeredDateTime,
        message: response.message,
        isAccepted: false,
      });
    }

    // Check if there's an immediate acceptance
    const immediateAcceptance = responses.find(r => r.responseType === "immediate_accept");
    if (immediateAcceptance) {
      await db.update(appointments).set({
        doctorId: immediateAcceptance.doctorId,
        status: "accepted",
        appointmentDate: new Date(),
      }).where(eq(appointments.id, appointmentId));
      return;
    }

    // Update status based on available options
    const hasScheduleOffers = responses.some(r => r.responseType === "schedule_offer");
    if (hasScheduleOffers) {
      await this.updateAppointmentStatus(appointmentId, "waiting_schedule_offers");
    } else {
      await this.updateAppointmentStatus(appointmentId, "no_immediate_response");
    }
  }

  async getTeleconsultResponses(appointmentId: number): Promise<any[]> {
    const responses = await db
      .select({
        response: teleconsultResponses,
        doctor: doctors,
        user: users,
      })
      .from(teleconsultResponses)
      .leftJoin(doctors, eq(teleconsultResponses.doctorId, doctors.id))
      .leftJoin(users, eq(doctors.userId, users.id))
      .where(eq(teleconsultResponses.appointmentId, appointmentId));

    return responses.map(r => ({
      ...r.response,
      doctor: r.doctor ? { ...r.doctor, user: r.user } : null,
    }));
  }

  async acceptDoctorResponse(appointmentId: number, responseId: number): Promise<Appointment> {
    // Get the response details
    const [response] = await db
      .select()
      .from(teleconsultResponses)
      .where(eq(teleconsultResponses.id, responseId));

    if (!response) {
      throw new Error("Response not found");
    }

    // Update the appointment with the selected doctor and time
    const [updatedAppointment] = await db
      .update(appointments)
      .set({
        doctorId: response.doctorId,
        appointmentDate: response.offeredDateTime || new Date(),
        status: "confirmed",
      })
      .where(eq(appointments.id, appointmentId))
      .returning();

    // Mark this response as accepted
    await db
      .update(teleconsultResponses)
      .set({ isAccepted: true })
      .where(eq(teleconsultResponses.id, responseId));

    return updatedAppointment;
  }

  // Prescription operations
  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const [created] = await db
      .insert(prescriptions)
      .values(prescription)
      .returning();
    return created;
  }

  async getPrescription(id: number): Promise<Prescription | undefined> {
    const [prescription] = await db
      .select()
      .from(prescriptions)
      .where(eq(prescriptions.id, id));
    return prescription;
  }

  async updatePrescription(id: number, prescription: Partial<InsertPrescription>): Promise<Prescription> {
    const [updated] = await db
      .update(prescriptions)
      .set(prescription)
      .where(eq(prescriptions.id, id))
      .returning();
    return updated;
  }

  async deletePrescription(id: number): Promise<void> {
    await db
      .delete(prescriptions)
      .where(eq(prescriptions.id, id));
  }

  async getPrescriptionsByPatient(patientId: number): Promise<any[]> {
    const prescriptionsList = await db
      .select()
      .from(prescriptions)
      .where(eq(prescriptions.patientId, patientId))
      .orderBy(desc(prescriptions.createdAt));

    const result = [];
    for (const prescription of prescriptionsList) {
      const patient = await this.getPatientWithUser(prescription.patientId);
      const doctor = await this.getDoctorWithUser(prescription.doctorId);
      
      result.push({
        ...prescription,
        patient,
        doctor
      });
    }

    return result;
  }

  async getPrescriptionsByDoctor(doctorId: number): Promise<any[]> {
    const prescriptionsList = await db
      .select()
      .from(prescriptions)
      .where(eq(prescriptions.doctorId, doctorId))
      .orderBy(desc(prescriptions.createdAt));

    const result = [];
    for (const prescription of prescriptionsList) {
      const patient = await this.getPatientWithUser(prescription.patientId);
      const doctor = await this.getDoctorWithUser(prescription.doctorId);
      
      result.push({
        ...prescription,
        patient,
        doctor
      });
    }

    return result;
  }

  async getAllPrescriptions(): Promise<any[]> {
    const prescriptionsList = await db
      .select()
      .from(prescriptions)
      .orderBy(desc(prescriptions.createdAt));

    const result = [];
    for (const prescription of prescriptionsList) {
      const patient = await this.getPatientWithUser(prescription.patientId);
      const doctor = await this.getDoctorWithUser(prescription.doctorId);
      
      result.push({
        ...prescription,
        patient,
        doctor
      });
    }

    return result;
  }
  // Psychological Assessment operations
  async createPsychologicalAssessment(assessment: InsertPsychologicalAssessment): Promise<PsychologicalAssessment> {
    const [newAssessment] = await db
      .insert(psychologicalAssessments)
      .values(assessment)
      .returning();
    return newAssessment;
  }

  async getPsychologicalAssessment(id: number): Promise<PsychologicalAssessment | undefined> {
    const [assessment] = await db
      .select()
      .from(psychologicalAssessments)
      .where(eq(psychologicalAssessments.id, id));
    return assessment;
  }

  async getPsychologicalAssessmentByAppointment(appointmentId: number): Promise<PsychologicalAssessment | undefined> {
    const [assessment] = await db
      .select()
      .from(psychologicalAssessments)
      .where(eq(psychologicalAssessments.appointmentId, appointmentId));
    return assessment;
  }

  async updatePsychologicalAssessment(id: number, assessment: Partial<InsertPsychologicalAssessment>): Promise<PsychologicalAssessment> {
    const [updatedAssessment] = await db
      .update(psychologicalAssessments)
      .set(assessment)
      .where(eq(psychologicalAssessments.id, id))
      .returning();
    return updatedAssessment;
  }

  // Psychiatry Questionnaire operations
  async createPsychiatryQuestionnaire(questionnaire: InsertPsychiatryQuestionnaire): Promise<PsychiatryQuestionnaire> {
    const [newQuestionnaire] = await db
      .insert(psychiatryQuestionnaires)
      .values(questionnaire)
      .returning();
    return newQuestionnaire;
  }

  async getPsychiatryQuestionnaire(id: number): Promise<PsychiatryQuestionnaire | undefined> {
    const [questionnaire] = await db
      .select()
      .from(psychiatryQuestionnaires)
      .where(eq(psychiatryQuestionnaires.id, id));
    return questionnaire;
  }

  async getPsychiatryQuestionnaireByAppointment(appointmentId: number): Promise<PsychiatryQuestionnaire | undefined> {
    const [questionnaire] = await db
      .select()
      .from(psychiatryQuestionnaires)
      .where(eq(psychiatryQuestionnaires.appointmentId, appointmentId));
    return questionnaire;
  }

  async updatePsychiatryQuestionnaire(id: number, questionnaire: Partial<InsertPsychiatryQuestionnaire>): Promise<PsychiatryQuestionnaire> {
    const [updatedQuestionnaire] = await db
      .update(psychiatryQuestionnaires)
      .set(questionnaire)
      .where(eq(psychiatryQuestionnaires.id, id))
      .returning();
    return updatedQuestionnaire;
  }

  // Psychologist Interview operations
  async createPsychologistInterview(interview: InsertPsychologistInterview): Promise<PsychologistInterview> {
    const [created] = await db
      .insert(psychologistInterviews)
      .values(interview)
      .returning();
    return created;
  }

  async getPsychologistInterview(id: number): Promise<PsychologistInterview | undefined> {
    const [interview] = await db
      .select()
      .from(psychologistInterviews)
      .where(eq(psychologistInterviews.id, id));
    return interview;
  }

  async getPsychologistInterviewByAppointment(appointmentId: number): Promise<PsychologistInterview | undefined> {
    const [interview] = await db
      .select()
      .from(psychologistInterviews)
      .where(eq(psychologistInterviews.appointmentId, appointmentId));
    return interview;
  }

  async updatePsychologistInterview(id: number, interview: Partial<InsertPsychologistInterview>): Promise<PsychologistInterview> {
    const [updated] = await db
      .update(psychologistInterviews)
      .set(interview)
      .where(eq(psychologistInterviews.id, id))
      .returning();
    return updated;
  }

  async getAvailablePsychologists(): Promise<DoctorWithUser[]> {
    return await db
      .select()
      .from(doctors)
      .innerJoin(users, eq(doctors.userId, users.id))
      .where(eq(doctors.specialty, "Psicologia"));
  }

  async schedulePsychologistInterview(appointmentId: number, psychologistId: number, interviewDate: Date): Promise<PsychologistInterview> {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment) throw new Error("Appointment not found");

    const interview = await this.createPsychologistInterview({
      appointmentId,
      psychologistId,
      patientId: appointment.patientId,
      interviewDate,
      status: "scheduled",
    });

    return interview;
  }

  // Medical evaluation operations
  async createMedicalEvaluation(evaluation: any): Promise<any> {
    const [newEvaluation] = await db.insert(medicalEvaluations).values(evaluation).returning();
    return newEvaluation;
  }

  async getMedicalEvaluationsByDoctor(doctorId: number): Promise<any[]> {
    return await db
      .select()
      .from(medicalEvaluations)
      .where(eq(medicalEvaluations.doctorId, doctorId))
      .orderBy(desc(medicalEvaluations.createdAt));
  }

  async getMedicalEvaluationsByPatient(patientId: number): Promise<any[]> {
    return await db
      .select()
      .from(medicalEvaluations)
      .where(eq(medicalEvaluations.patientId, patientId))
      .orderBy(desc(medicalEvaluations.createdAt));
  }

  async getMedicalEvaluationByAppointment(appointmentId: number): Promise<any | undefined> {
    const [evaluation] = await db
      .select()
      .from(medicalEvaluations)
      .where(eq(medicalEvaluations.appointmentId, appointmentId));
    return evaluation;
  }

  // Payment operations
  async createPaymentTransaction(transaction: any): Promise<any> {
    const [result] = await db
      .insert(paymentTransactions)
      .values(transaction)
      .returning();
    return result;
  }

  async getPaymentTransactionsByDoctor(doctorId: number): Promise<any[]> {
    return await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.doctorId, doctorId))
      .orderBy(desc(paymentTransactions.createdAt));
  }

  async getDoctorEarnings(doctorId: number): Promise<any[]> {
    return await db
      .select()
      .from(doctorEarnings)
      .where(eq(doctorEarnings.doctorId, doctorId))
      .orderBy(desc(doctorEarnings.createdAt));
  }

  // Clinical exam operations
  async createClinicalExam(exam: any): Promise<any> {
    const [result] = await db
      .insert(clinicalExams)
      .values(exam)
      .returning();
    return result;
  }

  async getClinicalExamsByDoctor(doctorId: number): Promise<any[]> {
    return await db
      .select()
      .from(clinicalExams)
      .where(eq(clinicalExams.doctorId, doctorId))
      .orderBy(desc(clinicalExams.createdAt));
  }

  async getClinicalExamsByPatient(patientId: number): Promise<any[]> {
    return await db
      .select()
      .from(clinicalExams)
      .where(eq(clinicalExams.patientId, patientId))
      .orderBy(desc(clinicalExams.createdAt));
  }

  // Medical referral operations
  async createMedicalReferral(referral: any): Promise<any> {
    const [result] = await db
      .insert(medicalReferrals)
      .values(referral)
      .returning();
    return result;
  }

  async getMedicalReferralsByDoctor(doctorId: number): Promise<any[]> {
    return await db
      .select()
      .from(medicalReferrals)
      .where(eq(medicalReferrals.referringDoctorId, doctorId))
      .orderBy(desc(medicalReferrals.createdAt));
  }

  async getMedicalReferralsByPatient(patientId: number): Promise<any[]> {
    return await db
      .select()
      .from(medicalReferrals)
      .where(eq(medicalReferrals.patientId, patientId))
      .orderBy(desc(medicalReferrals.createdAt));
  }

  // Teleconsultation workflow operations
  async createTeleconsultResponse(data: any): Promise<any> {
    const [result] = await db
      .insert(teleconsultResponses)
      .values(data)
      .returning();
    return result;
  }

  async updateAppointmentWorkflow(appointmentId: number, workflowData: any): Promise<Appointment> {
    const [result] = await db
      .update(appointments)
      .set(workflowData)
      .where(eq(appointments.id, appointmentId))
      .returning();
    return result;
  }

  async getAppointmentWithWorkflowStatus(appointmentId: number): Promise<any> {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId));
    return appointment;
  }

  async getPreparationStatus(appointmentId: number): Promise<any> {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId));
    return appointment;
  }

  async advanceConsultationDueToRisk(appointmentId: number): Promise<Appointment> {
    const [result] = await db
      .update(appointments)
      .set({ 
        status: "confirmed",
        notes: "Consultation advanced due to high risk assessment"
      })
      .where(eq(appointments.id, appointmentId))
      .returning();
    return result;
  }

  // Registration operations
  async createDoctorRegistration(registration: InsertDoctorRegistration): Promise<DoctorRegistration> {
    const [result] = await db
      .insert(doctorRegistrations)
      .values(registration)
      .returning();
    return result;
  }

  async createPatientRegistration(registration: InsertPatientRegistration): Promise<PatientRegistration> {
    const [result] = await db
      .insert(patientRegistrations)
      .values(registration)
      .returning();
    return result;
  }

  async updatePatientRegistration(id: number, updates: Partial<PatientRegistration>): Promise<PatientRegistration> {
    const [result] = await db
      .update(patientRegistrations)
      .set(updates)
      .where(eq(patientRegistrations.id, id))
      .returning();
    return result;
  }

  async getDoctorRegistrations(): Promise<DoctorRegistration[]> {
    return await db
      .select()
      .from(doctorRegistrations)
      .orderBy(desc(doctorRegistrations.createdAt));
  }

  async getPatientRegistrations(): Promise<PatientRegistration[]> {
    return await db
      .select()
      .from(patientRegistrations)
      .orderBy(desc(patientRegistrations.createdAt));
  }

  // Consultation Records operations
  async createConsultationRecord(record: InsertConsultationRecord): Promise<ConsultationRecord> {
    const [result] = await db
      .insert(consultationRecords)
      .values(record)
      .returning();
    return result;
  }

  async updateConsultationRecord(id: number, updates: Partial<ConsultationRecord>): Promise<ConsultationRecord> {
    const [result] = await db
      .update(consultationRecords)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(consultationRecords.id, id))
      .returning();
    return result;
  }

  async getConsultationRecordByAppointment(appointmentId: number): Promise<ConsultationRecord | null> {
    const [record] = await db
      .select()
      .from(consultationRecords)
      .where(eq(consultationRecords.appointmentId, appointmentId));
    return record || null;
  }

  async getConsultationRecordsByDoctor(doctorId: number): Promise<ConsultationRecord[]> {
    return await db
      .select()
      .from(consultationRecords)
      .where(eq(consultationRecords.doctorId, doctorId))
      .orderBy(desc(consultationRecords.createdAt));
  }

  async getConsultationRecordsByPatient(patientId: number): Promise<ConsultationRecord[]> {
    return await db
      .select()
      .from(consultationRecords)
      .where(eq(consultationRecords.patientId, patientId))
      .orderBy(desc(consultationRecords.createdAt));
  }

  async getConsultationRecordsByAppointment(appointmentId: number): Promise<ConsultationRecord[]> {
    return await db
      .select()
      .from(consultationRecords)
      .where(eq(consultationRecords.appointmentId, appointmentId))
      .orderBy(desc(consultationRecords.createdAt));
  }

  // CID Codes operations
  async createCidCode(code: InsertCidCode): Promise<CidCode> {
    const [result] = await db
      .insert(cidCodes)
      .values(code)
      .returning();
    return result;
  }

  async searchCidCodes(query: string, limit: number = 10) {
    const searchTerm = `%${query.toLowerCase()}%`;
    
    const results = await db
      .select()
      .from(cidCodes)
      .where(
        and(
          eq(cidCodes.isActive, true),
          or(
            sql`LOWER(${cidCodes.code}) LIKE ${searchTerm}`,
            sql`LOWER(${cidCodes.description}) LIKE ${searchTerm}`,
            sql`LOWER(${cidCodes.shortDescription}) LIKE ${searchTerm}`,
            sql`LOWER(${cidCodes.keywords}) LIKE ${searchTerm}`
          )
        )
      )
      .limit(limit)
      .orderBy(cidCodes.code);
      
    return results;
  }

  async getAppointmentsByDateRange(doctorId: number, startDate: Date, endDate: Date) {
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          gte(appointments.appointmentDate, startDate),
          lt(appointments.appointmentDate, endDate)
        )
      )
      .orderBy(appointments.appointmentDate);
  }

  async searchCidCodes(query: string, limit: number = 10): Promise<CidCode[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await db
      .select()
      .from(cidCodes)
      .where(
        and(
          eq(cidCodes.isActive, true),
          or(
            sql`LOWER(${cidCodes.code}) LIKE ${searchTerm}`,
            sql`LOWER(${cidCodes.description}) LIKE ${searchTerm}`,
            sql`LOWER(${cidCodes.shortDescription}) LIKE ${searchTerm}`,
            sql`LOWER(${cidCodes.keywords}) LIKE ${searchTerm}`
          )
        )
      )
      .limit(limit)
      .orderBy(sql`
        CASE 
          WHEN LOWER(${cidCodes.code}) LIKE ${searchTerm} THEN 1
          WHEN LOWER(${cidCodes.shortDescription}) LIKE ${searchTerm} THEN 2
          WHEN LOWER(${cidCodes.description}) LIKE ${searchTerm} THEN 3
          ELSE 4
        END
      `);
  }

  async getCidCodesByCategory(category: string): Promise<CidCode[]> {
    return await db
      .select()
      .from(cidCodes)
      .where(
        and(
          eq(cidCodes.category, category),
          eq(cidCodes.isActive, true)
        )
      )
      .orderBy(cidCodes.code);
  }

  // Consultation Records methods
  async createConsultationRecord(data: any): Promise<ConsultationRecord> {
    const [record] = await db
      .insert(consultationRecords)
      .values({
        appointmentId: data.appointmentId,
        doctorId: data.doctorId,
        patientId: data.patientId,
        chiefComplaint: data.chiefComplaint || null,
        anamnesis: data.anamnesis || null,
        diagnosis: data.diagnosis || null,
        cidCode: data.cidCode || null,
        cidDescription: data.cidDescription || null,
        treatment: data.treatment || null,
        physicalExam: data.physicalExam || null,
        vitalSigns: data.vitalSigns || null,
        notes: data.notes || null,
        followUp: data.followUp || null,
        status: data.status || 'in_progress'
      })
      .returning();
    return record;
  }

  async getConsultationRecord(id: number): Promise<ConsultationRecord | null> {
    const [record] = await db
      .select()
      .from(consultationRecords)
      .where(eq(consultationRecords.id, id));
    return record || null;
  }

  async getConsultationRecordByAppointment(appointmentId: number): Promise<ConsultationRecord | null> {
    const [record] = await db
      .select()
      .from(consultationRecords)
      .where(eq(consultationRecords.appointmentId, appointmentId));
    return record || null;
  }

  async updateConsultationRecord(id: number, data: any): Promise<ConsultationRecord> {
    const [record] = await db
      .update(consultationRecords)
      .set({
        chiefComplaint: data.chiefComplaint,
        anamnesis: data.anamnesis,
        diagnosis: data.diagnosis,
        cidCode: data.cidCode,
        cidDescription: data.cidDescription,
        treatment: data.treatment,
        physicalExam: data.physicalExam,
        vitalSigns: data.vitalSigns,
        notes: data.notes,
        followUp: data.followUp,
        status: data.status,
        completedAt: data.status === 'completed' ? new Date() : null,
        updatedAt: new Date()
      })
      .where(eq(consultationRecords.id, id))
      .returning();
    return record;
  }

  async getConsultationRecordsByDoctor(doctorId: number): Promise<ConsultationRecord[]> {
    return await db
      .select()
      .from(consultationRecords)
      .where(eq(consultationRecords.doctorId, doctorId))
      .orderBy(desc(consultationRecords.createdAt));
  }

  async getConsultationRecordsByPatient(patientId: number): Promise<ConsultationRecord[]> {
    return await db
      .select()
      .from(consultationRecords)
      .where(eq(consultationRecords.patientId, patientId))
      .orderBy(desc(consultationRecords.createdAt));
  }
}

export const storage = new DatabaseStorage();
