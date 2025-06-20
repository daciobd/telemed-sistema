import {
  users,
  patients,
  doctors,
  appointments,
  medicalRecords,
  teleconsultResponses,
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
  type UserWithProfile,
  type AppointmentWithDetails,
  type PatientWithUser,
  type DoctorWithUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserWithProfile(id: string): Promise<UserWithProfile | undefined>;
  
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
  
  // Medical record operations
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  getMedicalRecord(id: number): Promise<MedicalRecord | undefined>;
  updateMedicalRecord(id: number, record: Partial<InsertMedicalRecord>): Promise<MedicalRecord>;
  deleteMedicalRecord(id: number): Promise<void>;
  getMedicalRecordsByPatient(patientId: number): Promise<MedicalRecord[]>;
  getMedicalRecordsByDoctor(doctorId: number): Promise<MedicalRecord[]>;
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

    const results = await db
      .select()
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(users, eq(patients.userId, users.id))
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .leftJoin(users, eq(doctors.userId, users.id))
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          gte(appointments.appointmentDate, startOfDay),
          lte(appointments.appointmentDate, endOfDay)
        )
      )
      .orderBy(appointments.appointmentDate);

    return results.map(result => ({
      ...result.appointments,
      patient: {
        ...result.patients!,
        user: result.users!,
      },
      doctor: {
        ...result.doctors!,
        user: result.users!,
      },
    }));
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
    // Simulate doctor responses for demo purposes
    for (const doctor of doctors.slice(0, 3)) { // Limit to first 3 doctors
      const responseType = Math.random() > 0.7 ? "immediate_accept" : 
                          consultationType === "immediate" ? "declined" : "schedule_offer";
      
      let offeredDateTime = null;
      if (responseType === "schedule_offer") {
        // Offer a time slot within next 24 hours
        const now = new Date();
        offeredDateTime = new Date(now.getTime() + Math.random() * 24 * 60 * 60 * 1000);
      }

      await db.insert(teleconsultResponses).values({
        appointmentId,
        doctorId: doctor.id,
        responseType,
        offeredDateTime,
        message: responseType === "immediate_accept" ? "Disponível agora" : 
                responseType === "schedule_offer" ? "Posso atender no horário proposto" : 
                "Não posso atender neste valor",
      });

      // If immediate acceptance, update appointment
      if (responseType === "immediate_accept") {
        await db.update(appointments).set({
          doctorId: doctor.id,
          status: "accepted",
          appointmentDate: new Date(),
        }).where(eq(appointments.id, appointmentId));
        break; // Stop after first acceptance
      }
    }

    // If no immediate acceptance and there are schedule offers, update status
    const responses = await this.getTeleconsultResponses(appointmentId);
    const hasImmediate = responses.some(r => r.responseType === "immediate_accept");
    const hasSchedule = responses.some(r => r.responseType === "schedule_offer");

    if (!hasImmediate) {
      if (hasSchedule) {
        await this.updateAppointmentStatus(appointmentId, "waiting_schedule_offers");
      } else {
        await this.updateAppointmentStatus(appointmentId, "no_immediate_response");
      }
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
}

export const storage = new DatabaseStorage();
