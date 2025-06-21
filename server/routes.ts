import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertAppointmentSchema, insertMedicalRecordSchema, insertPatientSchema, insertDoctorSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let stats = {};

      if (user.role === 'doctor' && user.doctor) {
        const todayAppointments = await storage.getTodayAppointmentsByDoctor(user.doctor.id);
        const allAppointments = await storage.getAppointmentsByDoctor(user.doctor.id);
        const activePatients = await storage.getAllPatients();
        
        stats = {
          todayAppointments: todayAppointments.length,
          activePatients: activePatients.length,
          approvalRate: "94.2%",
          monthlyRevenue: "R$ 18.4k"
        };
      } else if (user.role === 'patient' && user.patient) {
        const appointments = await storage.getAppointmentsByPatient(user.patient.id);
        const upcomingAppointments = appointments.filter(apt => 
          apt.appointmentDate && new Date(apt.appointmentDate) > new Date() && apt.status !== 'cancelled'
        );
        
        stats = {
          upcomingAppointments: upcomingAppointments.length,
          totalAppointments: appointments.length,
          lastVisit: appointments[0]?.appointmentDate || null,
          nextAppointment: upcomingAppointments[0]?.appointmentDate || null
        };
      }

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Appointments
  app.get('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let appointments: any[] = [];

      if (user.role === 'doctor' && user.doctor) {
        appointments = await storage.getAppointmentsByDoctor(user.doctor.id);
      } else if (user.role === 'patient' && user.patient) {
        appointments = await storage.getAppointmentsByPatient(user.patient.id);
      } else if (user.role === 'admin') {
        const today = new Date();
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        appointments = await storage.getAppointmentsByDateRange(today, endOfDay);
      }

      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create a more flexible schema for appointment creation
      const appointmentSchema = z.object({
        doctorId: z.number().optional(),
        patientId: z.number().optional(),
        appointmentDate: z.union([z.string(), z.date()]).transform(val => 
          typeof val === 'string' ? new Date(val) : val
        ),
        type: z.string().default("routine"),
        duration: z.number().default(30),
        status: z.string().default("scheduled"),
        notes: z.string().optional(),
      });
      
      const appointmentData = appointmentSchema.parse(req.body);
      
      // Auto-assign patient/doctor based on user role
      if (user.role === 'patient' && user.patient) {
        appointmentData.patientId = user.patient.id;
      } else if (user.role === 'doctor' && user.doctor) {
        appointmentData.doctorId = user.doctor.id;
      }
      
      // Ensure we have both patient and doctor
      if (!appointmentData.patientId || !appointmentData.doctorId) {
        return res.status(400).json({ 
          message: "Tanto paciente quanto médico devem ser especificados" 
        });
      }

      const appointment = await storage.createAppointment({
        ...appointmentData,
        type: appointmentData.type as "routine" | "followup" | "emergency" | "telemedicine",
        status: appointmentData.status as "scheduled" | "confirmed" | "completed" | "cancelled",
        patientId: appointmentData.patientId!,
        doctorId: appointmentData.doctorId!
      });
      const appointmentWithDetails = await storage.getAppointmentWithDetails(appointment.id);
      
      res.status(201).json(appointmentWithDetails);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  // Create teleconsultation request - Auction system
  app.post('/api/teleconsult', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || user.role !== 'patient' || !user.patient) {
        return res.status(403).json({ message: "Only patients can request teleconsultation" });
      }

      const { specialty, symptoms, offeredPrice, consultationType } = req.body;
      
      // Map frontend specialty keys to database values
      const specialtyMap: Record<string, string> = {
        "general": "Clínica Geral",
        "cardiology": "Cardiologia", 
        "dermatology": "Dermatologia",
        "pediatrics": "Pediatria",
        "psychiatry": "Psiquiatria",
        "gynecology": "Ginecologia"
      };
      
      const targetSpecialty = specialtyMap[specialty] || specialty;

      // Create initial teleconsult request without assigned doctor
      const teleconsultData = {
        patientId: user.patient.id,
        doctorId: null, // No doctor assigned yet
        appointmentDate: null,
        type: "telemedicine" as const,
        status: "pending" as const,
        consultationType: consultationType || "immediate",
        offeredPrice: offeredPrice,
        symptoms: symptoms || null,
        specialty: targetSpecialty,
        duration: 30,
      };

      const appointment = await storage.createTeleconsultRequest(teleconsultData);
      
      // Find available doctors for the specialty
      const doctors = await storage.getAllDoctors();
      const availableDoctors = doctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(targetSpecialty.toLowerCase()) ||
        doctor.specialty.toLowerCase() === "clínica geral"
      );
      
      if (availableDoctors.length === 0) {
        await storage.updateAppointmentStatus(appointment.id, "no_immediate_response");
        return res.status(404).json({ 
          message: "Nenhum médico disponível para esta especialidade",
          appointmentId: appointment.id,
          status: "no_doctors_available"
        });
      }

      // Simulate sending offers to doctors with realistic timing
      setTimeout(async () => {
        await storage.simulateDoctorResponses(appointment.id, availableDoctors, offeredPrice, consultationType);
      }, 1000);

      res.status(201).json({
        appointment,
        availableDoctors: availableDoctors.length,
        message: "Oferta enviada para médicos disponíveis",
        status: "waiting_responses"
      });
    } catch (error) {
      console.error("Error creating teleconsultation:", error);
      res.status(500).json({ message: "Failed to create teleconsultation request" });
    }
  });

  // Get teleconsultation status and responses
  app.get('/api/teleconsult/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const appointment = await storage.getTeleconsultRequest(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({ message: "Teleconsultation request not found" });
      }

      const responses = await storage.getTeleconsultResponses(appointmentId);
      
      res.json({
        appointment,
        responses,
        hasImmediateAcceptance: responses.some(r => r.responseType === "immediate_accept"),
        scheduleOffers: responses.filter(r => r.responseType === "schedule_offer"),
      });
    } catch (error) {
      console.error("Error getting teleconsultation status:", error);
      res.status(500).json({ message: "Failed to get teleconsultation status" });
    }
  });

  // Accept a doctor's response
  app.post('/api/teleconsult/:id/accept-response/:responseId', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const responseId = parseInt(req.params.responseId);
      
      const result = await storage.acceptDoctorResponse(appointmentId, responseId);
      
      res.json({
        message: "Response accepted successfully",
        appointment: result
      });
    } catch (error) {
      console.error("Error accepting doctor response:", error);
      res.status(500).json({ message: "Failed to accept doctor response" });
    }
  });

  app.put('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const updateData = req.body;
      
      const appointment = await storage.updateAppointment(appointmentId, updateData);
      const appointmentWithDetails = await storage.getAppointmentWithDetails(appointment.id);
      
      res.json(appointmentWithDetails);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.delete('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      await storage.deleteAppointment(appointmentId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  // Patients
  app.get('/api/patients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || (user.role !== 'doctor' && user.role !== 'admin')) {
        return res.status(403).json({ message: "Access denied" });
      }

      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.get('/api/patients/:id', isAuthenticated, async (req: any, res) => {
    try {
      const patientId = parseInt(req.params.id);
      const patient = await storage.getPatientWithUser(patientId);
      
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient:", error);
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  app.post('/api/patients', isAuthenticated, async (req: any, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      const patientWithUser = await storage.getPatientWithUser(patient.id);
      
      res.status(201).json(patientWithUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating patient:", error);
      res.status(500).json({ message: "Failed to create patient" });
    }
  });

  // Doctors
  app.get('/api/doctors', isAuthenticated, async (req: any, res) => {
    try {
      const doctors = await storage.getAllDoctors();
      res.json(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  app.post('/api/doctors', isAuthenticated, async (req: any, res) => {
    try {
      const doctorData = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(doctorData);
      const doctorWithUser = await storage.getDoctorWithUser(doctor.id);
      
      res.status(201).json(doctorWithUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating doctor:", error);
      res.status(500).json({ message: "Failed to create doctor" });
    }
  });

  // Medical Records
  app.get('/api/medical-records', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let records: any[] = [];

      if (user.role === 'doctor' && user.doctor) {
        records = await storage.getMedicalRecordsByDoctor(user.doctor.id);
      } else if (user.role === 'patient' && user.patient) {
        records = await storage.getMedicalRecordsByPatient(user.patient.id);
      }

      res.json(records);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      res.status(500).json({ message: "Failed to fetch medical records" });
    }
  });

  app.post('/api/medical-records', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || user.role !== 'doctor' || !user.doctor) {
        return res.status(403).json({ message: "Only doctors can create medical records" });
      }

      const recordData = insertMedicalRecordSchema.parse(req.body);
      recordData.doctorId = user.doctor.id;
      
      const record = await storage.createMedicalRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating medical record:", error);
      res.status(500).json({ message: "Failed to create medical record" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
