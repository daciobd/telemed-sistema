import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertAppointmentSchema, 
  insertMedicalRecordSchema, 
  insertPatientSchema, 
  insertDoctorSchema, 
  insertPrescriptionSchema,
  insertDoctorRegistrationSchema,
  insertPatientRegistrationSchema 
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";

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

  // Role switching for testing
  app.post('/api/auth/switch-role/:role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.params;
      
      if (!['patient', 'doctor', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Update user role
      const updatedUser = await storage.upsertUser({
        id: userId,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
        role: role as "patient" | "doctor" | "admin"
      });

      // Create doctor profile if switching to doctor
      if (role === 'doctor') {
        try {
          const existingDoctor = await storage.getDoctorByUserId(userId);
          if (!existingDoctor) {
            await storage.createDoctor({
              userId: userId,
              specialty: "Clínico Geral",
              licenseNumber: "CRM-12345",
              experience: 5
            });
          }
        } catch (error) {
          console.error("Error creating doctor profile:", error);
        }
      }

      // Create patient profile if switching to patient
      if (role === 'patient') {
        try {
          const existingPatient = await storage.getPatientByUserId(userId);
          if (!existingPatient) {
            await storage.createPatient({
              userId: userId,
              dateOfBirth: new Date('1990-01-01'),
              phone: "(11) 99999-9999",
              address: "Endereço do paciente",
              emergencyContact: "Contato de emergência"
            });
          }
        } catch (error) {
          console.error("Error creating patient profile:", error);
        }
      }

      // Get updated user with profile
      const userWithProfile = await storage.getUserWithProfile(userId);
      res.json({ message: `Role switched to ${role}`, user: userWithProfile });
    } catch (error) {
      console.error("Error switching role:", error);
      res.status(500).json({ message: "Failed to switch role" });
    }
  });

  // Public registration routes (no authentication required)
  app.post('/api/register/doctor', async (req, res) => {
    try {
      const validatedData = insertDoctorRegistrationSchema.parse(req.body);
      
      // Convert string date to Date object
      const registrationData = {
        ...validatedData,
        dateOfBirth: new Date(validatedData.dateOfBirth)
      } as any;
      
      const result = await storage.createDoctorRegistration(registrationData);
      
      res.status(201).json({ 
        message: "Doctor registration submitted successfully",
        id: result.id 
      });
    } catch (error) {
      console.error("Error creating doctor registration:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit registration" });
    }
  });

  app.post('/api/register/patient', async (req, res) => {
    try {
      const validatedData = insertPatientRegistrationSchema.parse(req.body);
      
      // Convert string date to Date object for database
      const registrationData = {
        ...validatedData,
        dateOfBirth: new Date(validatedData.dateOfBirth)
      } as any;
      
      const result = await storage.createPatientRegistration(registrationData);
      
      // Automatically create user account for patients
      const userId = `patient_${result.id}_${Date.now()}`;
      
      // Create user account
      const user = await storage.upsertUser({
        id: userId,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: "patient"
      });

      // Create patient profile
      const patient = await storage.createPatient({
        userId: userId,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        phone: validatedData.phone,
        address: `${validatedData.address}, ${validatedData.city} - ${validatedData.state}, ${validatedData.zipCode}`,
        emergencyContact: `${validatedData.emergencyContactName} - ${validatedData.emergencyContactPhone} (${validatedData.emergencyContactRelation})`,
        bloodType: validatedData.bloodType || null,
        allergies: validatedData.allergies || null,
        medications: validatedData.medications || null,
        chronicConditions: validatedData.chronicConditions || null
      });

      // Link patient registration to user
      await storage.updatePatientRegistration(result.id, { userId });
      
      res.status(201).json({ 
        message: "Patient registration completed successfully",
        id: result.id,
        userId: userId
      });
    } catch (error) {
      console.error("Error creating patient registration:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to complete registration" });
    }
  });

  // Consultation Records API
  app.post('/api/consultation-records', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || user.role !== 'doctor') {
        return res.status(403).json({ message: "Access denied" });
      }

      const doctorProfile = await storage.getDoctorByUserId(userId);
      if (!doctorProfile) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      const record = await storage.createConsultationRecord({
        ...req.body,
        doctorId: doctorProfile.id
      });

      res.json(record);
    } catch (error) {
      console.error("Error creating consultation record:", error);
      res.status(500).json({ message: "Failed to create consultation record" });
    }
  });

  app.put('/api/consultation-records/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || user.role !== 'doctor') {
        return res.status(403).json({ message: "Access denied" });
      }

      const recordId = parseInt(req.params.id);
      const record = await storage.updateConsultationRecord(recordId, req.body);

      res.json(record);
    } catch (error) {
      console.error("Error updating consultation record:", error);
      res.status(500).json({ message: "Failed to update consultation record" });
    }
  });

  app.get('/api/consultation-records/appointment/:appointmentId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const appointmentId = parseInt(req.params.appointmentId);
      const record = await storage.getConsultationRecordByAppointment(appointmentId);

      if (!record) {
        return res.status(404).json({ message: "Consultation record not found" });
      }

      // Verify access - doctor can see their own records, patients can see their own
      if (user.role === 'doctor') {
        const doctorProfile = await storage.getDoctorByUserId(userId);
        if (doctorProfile && record.doctorId !== doctorProfile.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else if (user.role === 'patient') {
        const patientProfile = await storage.getPatientByUserId(userId);
        if (patientProfile && record.patientId !== patientProfile.id) {
          return res.status(403).json({ message: "Access denied" });
        }
      }

      res.json(record);
    } catch (error) {
      console.error("Error fetching consultation record:", error);
      res.status(500).json({ message: "Failed to fetch consultation record" });
    }
  });

  // CID Codes search API
  app.get('/api/cid-codes/search', isAuthenticated, async (req, res) => {
    try {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query || query.length < 2) {
        return res.json([]);
      }

      const codes = await storage.searchCidCodes(query, limit);
      res.json(codes);
    } catch (error) {
      console.error("Error searching CID codes:", error);
      res.status(500).json({ message: "Failed to search CID codes" });
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

  // Get single appointment with details
  app.get('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const appointment = await storage.getAppointmentWithDetails(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json(appointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({ message: "Failed to fetch appointment" });
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
      
      // Auto-assign patient/doctor based on user role if not provided
      if (user.role === 'patient' && user.patient && !appointmentData.patientId) {
        appointmentData.patientId = user.patient.id;
      } else if (user.role === 'doctor' && user.doctor && !appointmentData.doctorId) {
        appointmentData.doctorId = user.doctor.id;
      }
      
      // For doctors scheduling appointments, use provided patientId and their own doctorId
      if (user.role === 'doctor' && user.doctor) {
        appointmentData.doctorId = user.doctor.id;
      }
      
      // Ensure we have both patient and doctor
      if (!appointmentData.patientId || !appointmentData.doctorId) {
        return res.status(400).json({ 
          message: "Tanto paciente quanto médico devem ser especificados",
          debug: {
            patientId: appointmentData.patientId,
            doctorId: appointmentData.doctorId,
            userRole: user.role,
            userHasPatient: !!user.patient,
            userHasDoctor: !!user.doctor
          }
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
      console.log('Fetching medical records for user:', userId);
      
      // Check if user is a doctor
      const doctor = await storage.getDoctorByUserId(userId);
      if (doctor) {
        console.log('User is doctor with ID:', doctor.id);
        const records = await storage.getMedicalRecordsByDoctor(doctor.id);
        console.log('Found', records.length, 'records for doctor');
        return res.json(records);
      }
      
      // Check if user is a patient
      const patient = await storage.getPatientByUserId(userId);
      if (patient) {
        console.log('User is patient with ID:', patient.id);
        const records = await storage.getMedicalRecordsByPatient(patient.id);
        console.log('Found', records.length, 'records for patient');
        return res.json(records);
      }
      
      console.log('User is neither patient nor doctor, returning empty array');
      res.json([]);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      res.status(500).json({ message: "Failed to fetch medical records" });
    }
  });

  // Get medical records for a specific patient (for doctors viewing patient records)
  app.get('/api/medical-records/patient/:patientId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patientId = parseInt(req.params.patientId);
      
      // Check if user is a doctor (only doctors can view patient records)
      const doctor = await storage.getDoctorByUserId(userId);
      if (!doctor) {
        return res.status(403).json({ message: "Only doctors can view patient records" });
      }
      
      console.log('Doctor', doctor.id, 'viewing records for patient', patientId);
      const records = await storage.getMedicalRecordsByPatient(patientId);
      console.log('Found', records.length, 'records for patient', patientId);
      
      res.json(records);
    } catch (error) {
      console.error("Error fetching patient medical records:", error);
      res.status(500).json({ message: "Failed to fetch patient medical records" });
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

  // Prescriptions routes
  app.get('/api/prescriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let prescriptions: any[] = [];

      if (user.role === 'doctor' && user.doctor) {
        prescriptions = await storage.getPrescriptionsByDoctor(user.doctor.id);
      } else if (user.role === 'patient' && user.patient) {
        prescriptions = await storage.getPrescriptionsByPatient(user.patient.id);
      } else if (user.role === 'admin') {
        prescriptions = await storage.getAllPrescriptions();
      }

      res.json(prescriptions);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      res.status(500).json({ message: "Failed to fetch prescriptions" });
    }
  });

  app.post('/api/prescriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || user.role !== 'doctor' || !user.doctor) {
        return res.status(403).json({ message: "Only doctors can create prescriptions" });
      }

      const prescriptionData = insertPrescriptionSchema.parse(req.body);
      prescriptionData.doctorId = user.doctor.id;
      
      const prescription = await storage.createPrescription(prescriptionData);
      
      // Send notification to patient
      const patient = await storage.getPatientWithUser(prescriptionData.patientId);
      if (patient && app.locals.sendNotification) {
        app.locals.sendNotification(patient.userId, {
          title: 'Nova Prescrição Médica',
          message: `Dr. ${user.firstName} prescreveu novos medicamentos para você`,
          type: 'prescription_created',
          prescriptionId: prescription.id
        });
      }
      
      res.status(201).json(prescription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating prescription:", error);
      res.status(500).json({ message: "Failed to create prescription" });
    }
  });

  app.put('/api/prescriptions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const prescriptionId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || user.role !== 'doctor' || !user.doctor) {
        return res.status(403).json({ message: "Only doctors can update prescriptions" });
      }

      const updateData = req.body;
      const prescription = await storage.updatePrescription(prescriptionId, updateData);
      
      res.json(prescription);
    } catch (error) {
      console.error("Error updating prescription:", error);
      res.status(500).json({ message: "Failed to update prescription" });
    }
  });

  // Reports API
  app.get('/api/reports/:type', isAuthenticated, async (req: any, res) => {
    try {
      const { type } = req.params;
      const { start, end } = req.query;
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || user.role !== 'doctor' || !user.doctor) {
        return res.status(403).json({ message: "Only doctors can access reports" });
      }

      // Mock analytics data based on actual database
      const appointments = await storage.getAppointmentsByDoctor(user.doctor.id);
      const prescriptions = await storage.getPrescriptionsByDoctor(user.doctor.id);
      
      const reportData = {
        total: appointments.length,
        uniquePatients: new Set(appointments.map(a => a.patientId)).size,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        scheduled: appointments.filter(a => a.status === 'scheduled').length,
        completionRate: Math.round((appointments.filter(a => a.status === 'completed').length / appointments.length) * 100) || 0,
        growth: Math.floor(Math.random() * 20) + 5 // Mock growth percentage
      };

      res.json(reportData);
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  app.get('/api/reports/prescriptions/:dateRange?', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || user.role !== 'doctor' || !user.doctor) {
        return res.status(403).json({ message: "Only doctors can access prescription reports" });
      }

      const prescriptions = await storage.getPrescriptionsByDoctor(user.doctor.id);
      
      // Analyze medications
      const medicationCounts = prescriptions.reduce((acc: any, p: any) => {
        const med = p.medications.toUpperCase();
        acc[med] = (acc[med] || 0) + 1;
        return acc;
      }, {});

      const topMedications = Object.entries(medicationCounts)
        .map(([name, count]: [string, any]) => ({
          name,
          count,
          dosage: "Variável",
          percentage: Math.round((count / prescriptions.length) * 100)
        }))
        .sort((a, b) => b.count - a.count);

      const reportData = {
        total: prescriptions.length,
        averagePerDay: Math.round(prescriptions.length / 30) || 1,
        topMedications
      };

      res.json(reportData);
    } catch (error) {
      console.error("Error generating prescription report:", error);
      res.status(500).json({ message: "Failed to generate prescription report" });
    }
  });

  app.get('/api/reports/appointments/:dateRange?', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || user.role !== 'doctor' || !user.doctor) {
        return res.status(403).json({ message: "Only doctors can access appointment reports" });
      }

      const appointments = await storage.getAppointmentsByDoctor(user.doctor.id);
      
      const reportData = {
        total: appointments.length,
        uniquePatients: new Set(appointments.map(a => a.patientId)).size,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        scheduled: appointments.filter(a => a.status === 'scheduled').length,
        completionRate: Math.round((appointments.filter(a => a.status === 'completed').length / appointments.length) * 100) || 0,
        growth: Math.floor(Math.random() * 15) + 8 // Mock growth data
      };

      res.json(reportData);
    } catch (error) {
      console.error("Error generating appointment report:", error);
      res.status(500).json({ message: "Failed to generate appointment report" });
    }
  });

  // AI Assistant API
  app.post('/api/ai/analyze', isAuthenticated, async (req: any, res) => {
    try {
      const { message, history } = req.body;
      
      // Simulate AI analysis with intelligent symptom detection
      const symptoms = extractSymptoms(message);
      const urgencyLevel = determineUrgency(message, symptoms);
      const possibleConditions = suggestConditions(symptoms);
      const recommendations = generateRecommendations(urgencyLevel, symptoms);
      
      const analysis = {
        symptoms,
        urgencyLevel,
        possibleConditions,
        recommendations
      };

      const response = generateAIResponse(message, analysis);

      res.json({ response, analysis });
    } catch (error) {
      console.error("Error in AI analysis:", error);
      res.status(500).json({ message: "Failed to analyze symptoms" });
    }
  });

  // Teleconsult Auction APIs
  app.post('/api/teleconsult/request', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patient = await storage.getPatientByUserId(userId);
      
      if (!patient) {
        return res.status(404).json({ message: "Patient profile not found" });
      }

      const appointmentData = {
        ...req.body,
        patientId: patient.id,
        status: 'auction'
      };

      const appointment = await storage.createTeleconsultRequest(appointmentData);
      
      // Send notifications to doctors
      const { notifyDoctorsAboutOffer } = await import('./notifications');
      const whatsappUrls = await notifyDoctorsAboutOffer(appointment.id);
      
      console.log(`Notifications sent to doctors for appointment ${appointment.id}`);
      console.log('WhatsApp URLs generated:', whatsappUrls);
      
      res.status(201).json({ 
        ...appointment, 
        notificationsSent: whatsappUrls.length,
        whatsappUrls 
      });
    } catch (error) {
      console.error("Error creating teleconsult request:", error);
      res.status(500).json({ message: "Failed to create teleconsult request" });
    }
  });

  app.post('/api/teleconsult/simulate-responses', isAuthenticated, async (req: any, res) => {
    try {
      const { appointmentId, offeredPrice, consultationType } = req.body;
      const doctors = await storage.getAllDoctors();
      
      await storage.simulateDoctorResponses(appointmentId, doctors.slice(0, 5), offeredPrice, consultationType);
      res.json({ message: "Doctor responses simulated" });
    } catch (error) {
      console.error("Error simulating doctor responses:", error);
      res.status(500).json({ message: "Failed to simulate responses" });
    }
  });

  app.get('/api/teleconsult/responses/:appointmentId', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.appointmentId);
      const responses = await storage.getTeleconsultResponses(appointmentId);
      res.json(responses);
    } catch (error) {
      console.error("Error fetching teleconsult responses:", error);
      res.status(500).json({ message: "Failed to fetch responses" });
    }
  });

  // Get pending teleconsult offers for notifications
  app.get('/api/teleconsult/pending-offers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const doctor = await storage.getDoctorByUserId(userId);
      
      if (!doctor) {
        return res.status(403).json({ message: "Only doctors can view offers" });
      }

      // Create sample pending offers for demonstration
      const pendingOffers = [
        {
          id: 1,
          patientName: 'Maria Silva',
          specialty: doctor.specialty,
          offeredPrice: 150,
          symptoms: 'Dor de cabeça persistente há 3 dias',
          urgency: 'Normal',
          createdAt: new Date().toISOString(),
          status: 'auction'
        },
        {
          id: 2,
          patientName: 'João Santos',
          specialty: doctor.specialty,
          offeredPrice: 180,
          symptoms: 'Dor no peito e falta de ar',
          urgency: 'Urgente',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
          status: 'auction'
        }
      ];

      res.json(pendingOffers);
    } catch (error) {
      console.error("Error fetching pending offers:", error);
      res.status(500).json([]);
    }
  });

  // Get teleconsult offers for doctors
  app.get('/api/teleconsult/offers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const doctor = await storage.getDoctorByUserId(userId);
      
      if (!doctor) {
        return res.status(403).json({ message: "Only doctors can view offers" });
      }

      // Get all appointments in auction status
      const appointments = await storage.getAppointments();
      const offers = appointments
        .filter(apt => apt.status === 'auction')
        .map(apt => ({
          id: apt.id,
          patientName: 'Paciente Anônimo', // Protected data
          specialty: apt.specialty || doctor.specialty,
          offeredPrice: 150, // Standard price
          symptoms: apt.symptoms || 'Consulta médica',
          urgency: 'Normal',
          createdAt: apt.createdAt || new Date().toISOString(),
          status: apt.status
        }));

      res.json(offers);
    } catch (error) {
      console.error("Error fetching teleconsult offers:", error);
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });

  // Get doctor's responses to teleconsult offers
  app.get('/api/teleconsult/my-responses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const doctor = await storage.getDoctorByUserId(userId);
      
      if (!doctor) {
        return res.status(403).json({ message: "Only doctors can view responses" });
      }

      const responses = await storage.getTeleconsultResponsesByDoctor(doctor.id);
      res.json(responses);
    } catch (error) {
      console.error("Error fetching doctor responses:", error);
      res.status(500).json({ message: "Failed to fetch responses" });
    }
  });

  // Doctor responds to teleconsult offer
  app.post('/api/teleconsult/respond', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const doctor = await storage.getDoctorByUserId(userId);
      
      if (!doctor) {
        return res.status(403).json({ message: "Only doctors can respond to offers" });
      }

      const responseData = {
        ...req.body,
        doctorId: doctor.id
      };

      const response = await storage.createTeleconsultResponse(responseData);
      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating teleconsult response:", error);
      res.status(500).json({ message: "Failed to submit response" });
    }
  });

  app.post('/api/teleconsult/accept/:appointmentId/:responseId', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.appointmentId);
      const responseId = parseInt(req.params.responseId);
      
      const appointment = await storage.acceptDoctorResponse(appointmentId, responseId);
      res.json(appointment);
    } catch (error) {
      console.error("Error accepting doctor response:", error);
      res.status(500).json({ message: "Failed to accept response" });
    }
  });

  // AI Helper Functions
  function extractSymptoms(message: string): string[] {
    const symptoms: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    const symptomKeywords = [
      'dor de cabeça', 'cefaleia', 'enxaqueca',
      'febre', 'temperatura', 'calafrio',
      'tosse', 'espirro', 'coriza',
      'dor no peito', 'falta de ar', 'dispneia',
      'náusea', 'vômito', 'enjoo',
      'dor abdominal', 'dor na barriga', 'cólica',
      'diarréia', 'constipação', 'prisão de ventre',
      'dor nas costas', 'lombalgia',
      'dor muscular', 'mialgia',
      'fadiga', 'cansaço', 'fraqueza',
      'tontura', 'vertigem', 'mal estar',
      'dor de garganta', 'garganta inflamada',
      'coceira', 'prurido', 'alergia'
    ];

    symptomKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        symptoms.push(keyword);
      }
    });

    return symptoms;
  }

  function determineUrgency(message: string, symptoms: string[]): string {
    const lowerMessage = message.toLowerCase();
    
    const emergencyKeywords = ['emergência', 'urgente', 'grave', 'intenso', 'severo', 'muito forte'];
    const highUrgencyKeywords = ['dor no peito', 'falta de ar', 'vômito', 'febre alta'];
    const mediumUrgencyKeywords = ['dor', 'febre', 'mal estar'];
    
    if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'emergency';
    }
    
    if (highUrgencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'high';
    }
    
    if (mediumUrgencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  function suggestConditions(symptoms: string[]): string[] {
    const conditions: string[] = [];
    
    if (symptoms.includes('febre') && symptoms.includes('tosse')) {
      conditions.push('Infecção respiratória', 'Gripe', 'Resfriado');
    }
    
    if (symptoms.includes('dor de cabeça')) {
      conditions.push('Cefaleia tensional', 'Enxaqueca', 'Sinusite');
    }
    
    if (symptoms.includes('dor abdominal') || symptoms.includes('náusea')) {
      conditions.push('Gastrite', 'Indigestão', 'Síndrome do intestino irritável');
    }
    
    if (symptoms.includes('dor no peito')) {
      conditions.push('Ansiedade', 'Refluxo gastroesofágico', 'Problemas cardíacos');
    }
    
    if (conditions.length === 0) {
      conditions.push('Avaliação médica necessária para diagnóstico preciso');
    }
    
    return conditions;
  }

  function generateRecommendations(urgency: string, symptoms: string[]): string[] {
    const recommendations: string[] = [];
    
    switch (urgency) {
      case 'emergency':
        recommendations.push('Procure atendimento médico de emergência imediatamente');
        recommendations.push('Dirija-se ao pronto-socorro mais próximo');
        break;
      case 'high':
        recommendations.push('Agende consulta médica o mais breve possível');
        recommendations.push('Monitore os sintomas de perto');
        break;
      case 'medium':
        recommendations.push('Considere agendar consulta médica em alguns dias');
        recommendations.push('Mantenha-se hidratado e descanse');
        break;
      case 'low':
        recommendations.push('Monitore os sintomas');
        recommendations.push('Procure orientação se os sintomas piorarem');
        break;
    }
    
    if (symptoms.includes('febre')) {
      recommendations.push('Mantenha-se hidratado e descanse');
      recommendations.push('Use antitérmicos se necessário');
    }
    
    if (symptoms.includes('tosse')) {
      recommendations.push('Evite irritantes como fumaça');
      recommendations.push('Use umidificador se possível');
    }
    
    return recommendations;
  }

  function generateAIResponse(message: string, analysis: any): string {
    const { symptoms, urgencyLevel, possibleConditions, recommendations } = analysis;
    
    let response = "Analisei seus sintomas e aqui está minha avaliação:\n\n";
    
    if (symptoms.length > 0) {
      response += `Identifiquei os seguintes sintomas: ${symptoms.join(', ')}.\n\n`;
    }
    
    response += `Baseado nas informações fornecidas, classifiquei a urgência como ${urgencyLevel === 'emergency' ? 'emergência' : urgencyLevel === 'high' ? 'alta' : urgencyLevel === 'medium' ? 'média' : 'baixa'}.\n\n`;
    
    if (possibleConditions.length > 0) {
      response += `Algumas condições que podem estar relacionadas aos seus sintomas incluem: ${possibleConditions.join(', ')}.\n\n`;
    }
    
    response += "Minhas recomendações:\n";
    recommendations.forEach((rec: string, index: number) => {
      response += `${index + 1}. ${rec}\n`;
    });
    
    response += "\n⚠️ Lembre-se: Esta análise é apenas informativa e não substitui uma consulta médica profissional. Em caso de dúvidas ou agravamento dos sintomas, procure um médico.";
    
    return response;
  }

  // Consultation Records API
  app.post('/api/consultation-records', isAuthenticated, async (req: any, res) => {
    try {
      const { appointmentId, patientId, chiefComplaint, anamnesis, diagnosis, treatment, physicalExam, notes, status } = req.body;
      
      const record = await storage.createConsultationRecord({
        appointmentId,
        patientId,
        doctorId: req.user.id,
        chiefComplaint: chiefComplaint || '',
        anamnesis: anamnesis || '',
        diagnosis: diagnosis || '',
        treatment: treatment || '',
        physicalExam: physicalExam || '',
        notes: notes || '',
        status: status || 'in_progress'
      });
      
      res.json(record);
    } catch (error) {
      console.error('Error creating consultation record:', error);
      res.status(500).json({ error: 'Failed to create consultation record' });
    }
  });

  app.get('/api/consultation-records/:appointmentId', isAuthenticated, async (req: any, res) => {
    try {
      const { appointmentId } = req.params;
      const records = await storage.getConsultationRecordsByAppointment(parseInt(appointmentId));
      res.json(records);
    } catch (error) {
      console.error('Error fetching consultation records:', error);
      res.status(500).json({ error: 'Failed to fetch consultation records' });
    }
  });

  // CID-10 Search API
  app.get('/api/cid/search', isAuthenticated, async (req: any, res) => {
    try {
      const { q: query, limit = 10 } = req.query;
      if (!query || query.trim().length < 2) {
        return res.json([]);
      }
      
      const results = await storage.searchCidCodes(query.trim(), parseInt(limit));
      res.json(results);
    } catch (error) {
      console.error('Error searching CID codes:', error);
      res.status(500).json({ error: 'Failed to search CID codes' });
    }
  });

  // Today's appointments for doctor agenda
  app.get('/api/appointments/today', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const doctor = await storage.getDoctorByUserId(userId);
      
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const appointments = await storage.getAppointmentsByDateRange(doctor.id, startOfDay, endOfDay);
      
      // Enhance appointments with patient data and online status
      const enhancedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const patient = await storage.getPatientById(appointment.patientId);
          
          // Simulate patient online status (in real system, track via WebSocket)
          const isPatientOnline = Math.random() > 0.7; // 30% chance online
          const lastActivity = isPatientOnline ? 'há 2 minutos' : null;
          
          // Determine appointment status based on time and current status
          let status = appointment.status;
          const appointmentTime = new Date(appointment.appointmentDate);
          const now = new Date();
          const timeDiff = appointmentTime.getTime() - now.getTime();
          
          // If appointment is within 15 minutes and confirmed, mark as waiting
          if (status === 'confirmed' && Math.abs(timeDiff) <= 15 * 60 * 1000) {
            status = 'waiting';
          }
          
          return {
            ...appointment,
            patient,
            status,
            isPatientOnline,
            lastActivity,
            notes: appointment.notes || ''
          };
        })
      );

      res.json(enhancedAppointments);
    } catch (error) {
      console.error('Error fetching today appointments:', error);
      res.status(500).json({ error: 'Failed to fetch today appointments' });
    }
  });

  // Populate CID codes for demo/testing
  app.post('/api/cid/populate', isAuthenticated, async (req: any, res) => {
    try {
      const cidCodes = [
        {
          code: 'F41.1',
          description: 'Transtorno de ansiedade generalizada',
          shortDescription: 'Ansiedade generalizada',
          category: 'Transtornos mentais e comportamentais',
          keywords: 'ansiedade generalizada TAG preocupação excessiva',
          isActive: true
        },
        {
          code: 'F41.0',
          description: 'Transtorno de pânico [ansiedade paroxística episódica]',
          shortDescription: 'Transtorno de pânico',
          category: 'Transtornos mentais e comportamentais',
          keywords: 'pânico ansiedade paroxística episódica ataque',
          isActive: true
        },
        {
          code: 'F41.2',
          description: 'Transtorno misto ansioso e depressivo',
          shortDescription: 'Ansiedade e depressão mistas',
          category: 'Transtornos mentais e comportamentais',
          keywords: 'ansiedade depressão mista ansioso depressivo',
          isActive: true
        },
        {
          code: 'F40.1',
          description: 'Fobias sociais',
          shortDescription: 'Fobia social',
          category: 'Transtornos mentais e comportamentais',
          keywords: 'fobia social ansiedade social timidez',
          isActive: true
        },
        {
          code: 'F32.9',
          description: 'Episódio depressivo não especificado',
          shortDescription: 'Depressão não especificada',
          category: 'Transtornos mentais e comportamentais',
          keywords: 'depressão episódio depressivo tristeza',
          isActive: true
        },
        {
          code: 'F43.1',
          description: 'Estado de estresse pós-traumático',
          shortDescription: 'TEPT',
          category: 'Transtornos mentais e comportamentais',
          keywords: 'estresse pós traumático TEPT trauma',
          isActive: true
        }
      ];

      for (const cidCode of cidCodes) {
        await storage.createCidCode(cidCode);
      }

      res.json({ message: 'CID codes populated successfully', count: cidCodes.length });
    } catch (error) {
      console.error('Error populating CID codes:', error);
      res.status(500).json({ error: 'Failed to populate CID codes' });
    }
  });

  // Analytics endpoints
  app.get('/api/analytics/overview', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userProfile = await storage.getUserWithProfile(userId);
      
      if (!userProfile?.doctor) {
        return res.status(403).json({ message: 'Only doctors can access analytics' });
      }

      const doctorId = userProfile.doctor.id;
      const allAppointments = await storage.getAppointmentsByDoctor(doctorId);
      const allPrescriptions = await storage.getPrescriptionsByDoctor(doctorId);
      
      // Calculate metrics
      const totalAppointments = allAppointments.length;
      const activePatients = new Set(allAppointments.map(apt => apt.patientId)).size;
      const revenue = allAppointments.reduce((sum, apt) => sum + 150, 0); // Default consultation fee
      const completedAppointments = allAppointments.filter(apt => apt.status === 'completed');
      
      // Calculate growth percentages (simulate for now)
      const appointmentsGrowth = Math.floor(Math.random() * 20) - 5;
      const patientsGrowth = Math.floor(Math.random() * 15);
      const revenueGrowth = Math.floor(Math.random() * 25) - 5;
      
      // Calculate metrics
      const avgConsultationTime = 30 + Math.floor(Math.random() * 30);
      const noShowRate = Math.floor(Math.random() * 15);
      const patientSatisfaction = 4.2 + Math.random() * 0.7;
      const digitalPrescriptions = Math.floor(85 + Math.random() * 15);
      const occupancyRate = Math.floor(70 + Math.random() * 25);
      
      // Recent activity
      const recentActivity = [
        {
          title: 'Nova consulta agendada',
          description: 'Paciente João Silva agendou consulta para amanhã',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          title: 'Prescrição enviada',
          description: 'Prescrição digital enviada para Maria Santos',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        },
        {
          title: 'Videoconsulta finalizada',
          description: 'Consulta com Carlos Oliveira concluída',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
        }
      ];

      const stats = {
        totalAppointments,
        activePatients,
        revenue,
        appointmentsGrowth,
        patientsGrowth,
        revenueGrowth,
        avgConsultationTime,
        noShowRate,
        patientSatisfaction: Number(patientSatisfaction.toFixed(1)),
        digitalPrescriptions,
        occupancyRate,
        recentActivity
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });

  app.get('/api/analytics/appointments-trend', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userProfile = await storage.getUserWithProfile(userId);
      
      if (!userProfile?.doctor) {
        return res.status(403).json({ message: 'Only doctors can access analytics' });
      }

      // Generate trend data for the last 30 days
      const trendData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const appointments = Math.floor(Math.random() * 8) + 2;
        
        trendData.push({
          date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          appointments
        });
      }

      res.json(trendData);
    } catch (error) {
      console.error('Error fetching appointments trend:', error);
      res.status(500).json({ message: 'Failed to fetch trend data' });
    }
  });

  app.get('/api/analytics/patient-demographics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userProfile = await storage.getUserWithProfile(userId);
      
      if (!userProfile?.doctor) {
        return res.status(403).json({ message: 'Only doctors can access analytics' });
      }

      const demographics = [
        { name: '18-30 anos', value: 25 },
        { name: '31-45 anos', value: 35 },
        { name: '46-60 anos', value: 30 },
        { name: '60+ anos', value: 10 }
      ];

      res.json(demographics);
    } catch (error) {
      console.error('Error fetching demographics:', error);
      res.status(500).json({ message: 'Failed to fetch demographics' });
    }
  });

  app.get('/api/analytics/prescriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userProfile = await storage.getUserWithProfile(userId);
      
      if (!userProfile?.doctor) {
        return res.status(403).json({ message: 'Only doctors can access analytics' });
      }

      const prescriptionStats = [
        { specialty: 'Cardiologia', prescriptions: 45 },
        { specialty: 'Dermatologia', prescriptions: 32 },
        { specialty: 'Pediatria', prescriptions: 28 },
        { specialty: 'Clínica Geral', prescriptions: 52 },
        { specialty: 'Psiquiatria', prescriptions: 18 }
      ];

      res.json(prescriptionStats);
    } catch (error) {
      console.error('Error fetching prescription stats:', error);
      res.status(500).json({ message: 'Failed to fetch prescription data' });
    }
  });

  // Medication search endpoint for MEMED integration
  app.post('/api/medications/search', isAuthenticated, async (req: any, res) => {
    try {
      const { query } = req.body;
      
      // Simulate medication database search
      const medications = [
        {
          name: 'Paracetamol 500mg',
          activeIngredient: 'Paracetamol',
          presentation: 'Comprimido',
          dosage: '500mg'
        },
        {
          name: 'Dipirona 500mg',
          activeIngredient: 'Dipirona Sódica',
          presentation: 'Comprimido',
          dosage: '500mg'
        },
        {
          name: 'Amoxicilina 875mg',
          activeIngredient: 'Amoxicilina',
          presentation: 'Comprimido Revestido',
          dosage: '875mg'
        },
        {
          name: 'Omeprazol 20mg',
          activeIngredient: 'Omeprazol',
          presentation: 'Cápsula',
          dosage: '20mg'
        }
      ].filter(med => 
        med.name.toLowerCase().includes(query.toLowerCase()) ||
        med.activeIngredient.toLowerCase().includes(query.toLowerCase())
      );

      res.json(medications);
    } catch (error) {
      console.error('Error searching medications:', error);
      res.status(500).json({ message: 'Failed to search medications' });
    }
  });

  // Prescription templates endpoint
  app.get('/api/prescription-templates', isAuthenticated, async (req: any, res) => {
    try {
      const templates = [
        {
          id: '1',
          name: 'Gripe e Resfriado',
          specialty: 'Clínica Geral',
          medications: [
            {
              id: '1',
              name: 'Paracetamol 500mg',
              dosage: '500mg',
              frequency: '3x-dia',
              duration: '5 dias',
              instructions: 'Tomar após as refeições',
              activeIngredient: 'Paracetamol',
              presentation: 'Comprimido'
            }
          ],
          instructions: 'Repouso, hidratação e retorno se necessário'
        },
        {
          id: '2',
          name: 'Hipertensão',
          specialty: 'Cardiologia',
          medications: [
            {
              id: '2',
              name: 'Losartana 50mg',
              dosage: '50mg',
              frequency: '1x-dia',
              duration: 'Uso contínuo',
              instructions: 'Tomar sempre no mesmo horário',
              activeIngredient: 'Losartana Potássica',
              presentation: 'Comprimido'
            }
          ],
          instructions: 'Dieta com pouco sal, exercícios regulares'
        }
      ];

      res.json(templates);
    } catch (error) {
      console.error('Error fetching prescription templates:', error);
      res.status(500).json({ message: 'Failed to fetch templates' });
    }
  });

  // Psychological Assessment routes
  app.get('/api/appointments/:appointmentId/psychological-assessment', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.appointmentId);
      const assessment = await storage.getPsychologicalAssessmentByAppointment(appointmentId);
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching psychological assessment:", error);
      res.status(500).json({ message: "Failed to fetch psychological assessment" });
    }
  });

  app.post('/api/psychological-assessments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || !user.patient) {
        return res.status(403).json({ message: "Only patients can submit psychological assessments" });
      }

      const assessmentData = {
        ...req.body,
        patientId: user.patient.id
      };

      const assessment = await storage.createPsychologicalAssessment(assessmentData);
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating psychological assessment:", error);
      res.status(500).json({ message: "Failed to create psychological assessment" });
    }
  });

  // Psychiatry Questionnaire routes
  app.get('/api/appointments/:appointmentId/psychiatry-questionnaire', isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.appointmentId);
      const questionnaire = await storage.getPsychiatryQuestionnaireByAppointment(appointmentId);
      res.json(questionnaire);
    } catch (error) {
      console.error("Error fetching psychiatry questionnaire:", error);
      res.status(500).json({ message: "Failed to fetch psychiatry questionnaire" });
    }
  });

  app.post('/api/psychiatry-questionnaires', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithProfile(userId);
      
      if (!user || !user.patient) {
        return res.status(403).json({ message: "Only patients can submit psychiatry questionnaires" });
      }

      const questionnaireData = {
        ...req.body,
        patientId: user.patient.id
      };

      const questionnaire = await storage.createPsychiatryQuestionnaire(questionnaireData);
      res.status(201).json(questionnaire);
    } catch (error) {
      console.error("Error creating psychiatry questionnaire:", error);
      res.status(500).json({ message: "Failed to create psychiatry questionnaire" });
    }
  });

  // Medical Evaluations
  app.post('/api/medical-evaluations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user is a patient
      const patient = await storage.getPatientByUserId(userId);
      if (!patient) {
        return res.status(403).json({ message: "Only patients can create evaluations" });
      }

      const evaluationData = req.body;
      evaluationData.patientId = patient.id;
      
      // Get appointment to verify patient access and get doctor ID
      const appointment = await storage.getAppointmentWithDetails(evaluationData.appointmentId);
      if (!appointment || appointment.patientId !== patient.id) {
        return res.status(403).json({ message: "Unauthorized to evaluate this appointment" });
      }
      
      evaluationData.doctorId = appointment.doctorId;
      
      // Check if evaluation already exists
      const existingEvaluation = await storage.getMedicalEvaluationByAppointment(evaluationData.appointmentId);
      if (existingEvaluation) {
        return res.status(400).json({ message: "Evaluation already exists for this appointment" });
      }
      
      const evaluation = await storage.createMedicalEvaluation(evaluationData);
      res.status(201).json(evaluation);
    } catch (error) {
      console.error("Error creating medical evaluation:", error);
      res.status(500).json({ message: "Failed to create evaluation" });
    }
  });

  app.get('/api/medical-evaluations/doctor/:doctorId', isAuthenticated, async (req: any, res) => {
    try {
      const doctorId = parseInt(req.params.doctorId);
      const evaluations = await storage.getMedicalEvaluationsByDoctor(doctorId);
      res.json(evaluations);
    } catch (error) {
      console.error("Error fetching doctor evaluations:", error);
      res.status(500).json({ message: "Failed to fetch evaluations" });
    }
  });

  app.get('/api/medical-evaluations/patient', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patient = await storage.getPatientByUserId(userId);
      
      if (!patient) {
        return res.status(403).json({ message: "Patient not found" });
      }
      
      const evaluations = await storage.getMedicalEvaluationsByPatient(patient.id);
      res.json(evaluations);
    } catch (error) {
      console.error("Error fetching patient evaluations:", error);
      res.status(500).json({ message: "Failed to fetch evaluations" });
    }
  });

  // Payment routes
  app.post('/api/payments/create-payment-intent', isAuthenticated, async (req: any, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ message: 'Stripe not configured' });
      }
      
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      
      const { appointmentId, amount = '150' } = req.body;
      const userId = req.user.claims.sub;
      
      if (!appointmentId) {
        return res.status(400).json({ message: 'Appointment ID is required' });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount || '150') * 100), // Convert to cents
        currency: 'brl',
        metadata: {
          appointmentId: appointmentId.toString(),
          userId: userId
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      return res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id 
      });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      return res.status(500).json({ 
        message: 'Failed to create payment intent',
        error: error?.message || 'Unknown error'
      });
    }
  });

  // Webhook for payment success
  app.post('/api/payments/webhook', async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      const event = req.body;
      
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const appointmentId = paymentIntent.metadata.appointmentId;
        
        // Update appointment status to paid
        await storage.updateAppointment(parseInt(appointmentId), {
          status: 'confirmed',
          notes: `Payment confirmed: ${paymentIntent.id}`
        });
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send('Webhook Error');
    }
  });

  // Financial dashboard for doctors
  app.get('/api/financial/dashboard/:doctorId', isAuthenticated, async (req: any, res) => {
    try {
      const doctorId = parseInt(req.params.doctorId);
      const userId = req.user.claims.sub;
      
      // Verify user is the doctor
      const doctor = await storage.getDoctorByUserId(userId);
      if (!doctor || doctor.id !== doctorId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      // Get financial data
      const earnings = await storage.getDoctorEarnings(doctorId);
      const transactions = await storage.getPaymentTransactionsByDoctor(doctorId);
      
      // Calculate metrics
      const totalEarnings = earnings.reduce((sum: number, earning: any) => sum + parseFloat(earning.netAmount), 0);
      const monthlyEarnings = earnings
        .filter((earning: any) => new Date(earning.createdAt).getMonth() === new Date().getMonth())
        .reduce((sum: number, earning: any) => sum + parseFloat(earning.netAmount), 0);
      
      const pendingPayments = transactions
        .filter((t: any) => t.status === 'pending')
        .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
      
      const successfulPayments = transactions.filter((t: any) => t.status === 'succeeded').length;
      const conversionRate = transactions.length > 0 ? (successfulPayments / transactions.length) * 100 : 0;
      
      res.json({
        totalEarnings,
        monthlyEarnings,
        pendingPayments,
        conversionRate: conversionRate.toFixed(1),
        monthlyConsultations: earnings.filter((earning: any) => 
          new Date(earning.createdAt).getMonth() === new Date().getMonth()
        ).length,
        pendingCount: transactions.filter((t: any) => t.status === 'pending').length
      });
    } catch (error) {
      console.error('Error fetching financial dashboard:', error);
      res.status(500).json({ message: 'Failed to fetch financial data' });
    }
  });

  app.get('/api/financial/transactions/:doctorId', isAuthenticated, async (req: any, res) => {
    try {
      const doctorId = parseInt(req.params.doctorId);
      const userId = req.user.claims.sub;
      
      // Verify user is the doctor
      const doctor = await storage.getDoctorByUserId(userId);
      if (!doctor || doctor.id !== doctorId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const transactions = await storage.getPaymentTransactionsByDoctor(doctorId);
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Failed to fetch transactions' });
    }
  });

  // Consultation Records API
  app.post('/api/consultation-records', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { appointmentId, patientId, ...recordData } = req.body;
      
      // Verify user is the doctor for this appointment
      const doctor = await storage.getDoctorByUserId(userId);
      if (!doctor) {
        return res.status(403).json({ message: 'Only doctors can create consultation records' });
      }
      
      const appointment = await storage.getAppointment(appointmentId);
      if (!appointment || appointment.doctorId !== doctor.id) {
        return res.status(403).json({ message: 'Unauthorized access to this appointment' });
      }
      
      const consultationRecord = await storage.createConsultationRecord({
        appointmentId,
        doctorId: doctor.id,
        patientId,
        ...recordData
      });
      
      res.json(consultationRecord);
    } catch (error) {
      console.error('Error creating consultation record:', error);
      res.status(500).json({ message: 'Failed to create consultation record' });
    }
  });

  app.get('/api/consultation-records/:appointmentId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointmentId = parseInt(req.params.appointmentId);
      
      // Check if user has access to this appointment (doctor or patient)
      const doctor = await storage.getDoctorByUserId(userId);
      const patient = await storage.getPatientByUserId(userId);
      
      const appointment = await storage.getAppointment(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      const hasAccess = (doctor && appointment.doctorId === doctor.id) || 
                       (patient && appointment.patientId === patient.id);
      
      if (!hasAccess) {
        return res.status(403).json({ message: 'Unauthorized access to this consultation record' });
      }
      
      const consultationRecord = await storage.getConsultationRecordByAppointment(appointmentId);
      res.json(consultationRecord);
    } catch (error) {
      console.error('Error fetching consultation record:', error);
      res.status(500).json({ message: 'Failed to fetch consultation record' });
    }
  });

  app.put('/api/consultation-records/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recordId = parseInt(req.params.id);
      const updateData = req.body;
      
      // Verify user is the doctor who created this record
      const doctor = await storage.getDoctorByUserId(userId);
      if (!doctor) {
        return res.status(403).json({ message: 'Only doctors can update consultation records' });
      }
      
      const existingRecord = await storage.getConsultationRecord(recordId);
      if (!existingRecord || existingRecord.doctorId !== doctor.id) {
        return res.status(403).json({ message: 'Unauthorized access to this consultation record' });
      }
      
      const updatedRecord = await storage.updateConsultationRecord(recordId, updateData);
      res.json(updatedRecord);
    } catch (error) {
      console.error('Error updating consultation record:', error);
      res.status(500).json({ message: 'Failed to update consultation record' });
    }
  });

  // Search CID-10 codes
  app.get('/api/cid-codes/search', isAuthenticated, async (req: any, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }
      
      // Mock CID-10 data for demonstration
      const mockCidCodes = [
        { code: 'F32.9', description: 'Episódio depressivo não especificado', shortDescription: 'Depressão não especificada' },
        { code: 'F41.1', description: 'Transtorno de ansiedade generalizada', shortDescription: 'Ansiedade generalizada' },
        { code: 'F43.0', description: 'Reação aguda ao estresse', shortDescription: 'Estresse agudo' },
        { code: 'F40.9', description: 'Transtorno fóbico não especificado', shortDescription: 'Fobia não especificada' },
        { code: 'F42.9', description: 'Transtorno obsessivo-compulsivo não especificado', shortDescription: 'TOC não especificado' },
        { code: 'Z71.1', description: 'Pessoa consultando em nome de outra', shortDescription: 'Consulta por terceiro' },
        { code: 'R50.9', description: 'Febre não especificada', shortDescription: 'Febre' },
        { code: 'K30', description: 'Dispepsia funcional', shortDescription: 'Dispepsia' },
        { code: 'M79.1', description: 'Mialgia', shortDescription: 'Dor muscular' },
        { code: 'R51', description: 'Cefaleia', shortDescription: 'Dor de cabeça' }
      ];
      
      const results = mockCidCodes.filter(code => 
        code.description.toLowerCase().includes(query.toLowerCase()) ||
        code.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
        code.code.toLowerCase().includes(query.toLowerCase())
      );
      
      res.json(results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Error searching CID codes:', error);
      res.status(500).json({ message: 'Failed to search CID codes' });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time notifications and video calls
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients with user info
  const clients = new Map<string, WebSocket>();
  // Store video call rooms
  const videoCallRooms = new Map<number, { 
    participants: Map<string, { ws: WebSocket, role: string }>, 
    mediaReady?: Set<string> 
  }>();

  // Video call handlers
  const handleJoinVideoCall = (ws: WebSocket, data: any) => {
    const { appointmentId, userId, role } = data;
    
    if (!videoCallRooms.has(appointmentId)) {
      videoCallRooms.set(appointmentId, { 
        participants: new Map(),
        mediaReady: new Set()
      });
    }
    
    const room = videoCallRooms.get(appointmentId)!;
    room.participants.set(userId, { ws, role });
    
    console.log(`User ${userId} (${role}) joined video call for appointment ${appointmentId}`);
    
    // Notify other participants that someone joined
    room.participants.forEach((participant, otherUserId) => {
      if (otherUserId !== userId && participant.ws.readyState === WebSocket.OPEN) {
        participant.ws.send(JSON.stringify({
          type: 'user-joined',
          userId,
          role
        }));
      }
    });
    
    // If this is the second person joining, prepare for WebRTC
    if (room.participants.size === 2) {
      console.log('Two participants in room, checking if ready for WebRTC');
      checkRoomReadiness(appointmentId);
    }
  };

  const handleMediaReady = (ws: WebSocket, data: any) => {
    const { appointmentId, userId } = data;
    const room = videoCallRooms.get(appointmentId);
    
    if (room) {
      if (!room.mediaReady) room.mediaReady = new Set();
      room.mediaReady.add(userId);
      
      console.log(`User ${userId} media ready. Total ready: ${room.mediaReady.size}`);
      
      // Check if we can start WebRTC
      checkRoomReadiness(appointmentId);
    }
  };

  const checkRoomReadiness = (appointmentId: number) => {
    const room = videoCallRooms.get(appointmentId);
    if (!room) return;
    
    const participantCount = room.participants.size;
    const mediaReadyCount = room.mediaReady ? room.mediaReady.size : 0;
    
    console.log(`Room ${appointmentId} - Participants: ${participantCount}, Media ready: ${mediaReadyCount}`);
    
    // If we have at least 2 participants and at least 1 with media ready, start WebRTC
    if (participantCount >= 2 && mediaReadyCount >= 1) {
      console.log('Room ready for WebRTC, notifying participants');
      
      let isFirst = true;
      room.participants.forEach((participant, userId) => {
        if (participant.ws.readyState === WebSocket.OPEN) {
          participant.ws.send(JSON.stringify({
            type: 'room-ready',
            appointmentId,
            shouldInitiate: isFirst && room.mediaReady?.has(userId) // First user with media ready should initiate
          }));
          isFirst = false;
        }
      });
    }
  };

  const handleWebRTCSignaling = (ws: WebSocket, data: any) => {
    const { appointmentId } = data;
    const room = videoCallRooms.get(appointmentId);
    
    if (room) {
      // Forward signaling message to other participants
      room.participants.forEach((participant, userId) => {
        if (participant.ws !== ws && participant.ws.readyState === WebSocket.OPEN) {
          participant.ws.send(JSON.stringify(data));
        }
      });
    }
  };

  const handleChatMessage = (ws: WebSocket, data: any) => {
    const { appointmentId } = data;
    const room = videoCallRooms.get(appointmentId);
    
    if (room) {
      // Forward chat message to other participants
      room.participants.forEach((participant, userId) => {
        if (participant.ws !== ws && participant.ws.readyState === WebSocket.OPEN) {
          participant.ws.send(JSON.stringify(data));
        }
      });
    }
  };

  const handleLeaveVideoCall = (ws: WebSocket, data: any) => {
    const { appointmentId } = data;
    const room = videoCallRooms.get(appointmentId);
    
    if (room) {
      // Find and remove the user
      let userIdToRemove: string | null = null;
      room.participants.forEach((participant, userId) => {
        if (participant.ws === ws) {
          userIdToRemove = userId;
        }
      });
      
      if (userIdToRemove) {
        room.participants.delete(userIdToRemove);
        
        // Notify other participants
        const removedUserId = userIdToRemove;
        room.participants.forEach((participant, userId) => {
          if (participant.ws.readyState === WebSocket.OPEN) {
            participant.ws.send(JSON.stringify({
              type: 'user-left',
              userId: removedUserId
            }));
          }
        });
        
        // Clean up empty rooms
        if (room.participants.size === 0) {
          videoCallRooms.delete(appointmentId);
        }
      }
    }
  };
  
  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'auth' && data.userId) {
          clients.set(data.userId, ws);
          console.log(`User ${data.userId} connected via WebSocket`);
          
          ws.send(JSON.stringify({
            type: 'auth_success',
            message: 'Connected successfully'
          }));
        } else if (data.type === 'join-video-call') {
          handleJoinVideoCall(ws, data);
        } else if (data.type === 'media-ready') {
          handleMediaReady(ws, data);
        } else if (data.type === 'webrtc-offer' || data.type === 'webrtc-answer' || data.type === 'webrtc-ice-candidate') {
          handleWebRTCSignaling(ws, data);
        } else if (data.type === 'chat-message') {
          handleChatMessage(ws, data);
        } else if (data.type === 'leave-video-call') {
          handleLeaveVideoCall(ws, data);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      // Remove client from map when disconnected
      clients.forEach((client, userId) => {
        if (client === ws) {
          clients.delete(userId);
          console.log(`User ${userId} disconnected from WebSocket`);
          
          // Remove from video call rooms
          videoCallRooms.forEach((room, appointmentId) => {
            if (room.participants.has(userId)) {
              room.participants.delete(userId);
              
              // Notify other participants
              room.participants.forEach((participant, otherUserId) => {
                if (participant.ws.readyState === WebSocket.OPEN) {
                  participant.ws.send(JSON.stringify({
                    type: 'user-left',
                    userId
                  }));
                }
              });
              
              // Clean up empty rooms
              if (room.participants.size === 0) {
                videoCallRooms.delete(appointmentId);
              }
            }
          });
        }
      });
    });
  });


  
  // Function to send notifications to specific users
  app.locals.sendNotification = (userId: string, notification: any) => {
    const client = clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'notification',
        ...notification
      }));
    }
  };
  
  // Credential-based authentication routes
  const credentialAuthSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    role: z.enum(["doctor", "patient"]),
    crm: z.string().optional(),
    specialty: z.string().optional(),
    birthDate: z.string().optional(),
    phone: z.string().optional(),
  });

  // Register new user with credentials
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email já está em uso" });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

      // Create user
      const userId = `credential_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const user = await storage.upsertUser({
        id: userId,
        email: validatedData.email,
        firstName: validatedData.name.split(' ')[0],
        lastName: validatedData.name.split(' ').slice(1).join(' ') || '',
        role: validatedData.role,
        passwordHash,
        isEmailVerified: false,
        specialty: validatedData.specialty,
        licenseNumber: validatedData.crm,
      });

      // Create doctor or patient profile
      if (validatedData.role === 'doctor') {
        await storage.createDoctor({
          userId: userId,
          specialty: validatedData.specialty!,
          licenseNumber: validatedData.crm!,
          bio: 'Médico cadastrado no sistema',
          experience: 'A definir',
          education: 'A definir',
          languages: 'Português',
          consultationFee: 150,
          rating: 0,
          availability: [],
          whatsappNumber: '',
        });
      } else {
        await storage.createPatient({
          userId: userId,
          dateOfBirth: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
          phone: validatedData.phone || '',
          address: '',
          cpf: '',
          emergencyContact: '',
          medicalHistory: '',
          allergies: '',
          medications: '',
          bloodType: '',
          weight: '',
          height: '',
        });
      }

      res.status(201).json({ 
        message: "Usuário criado com sucesso",
        user: { id: user.id, email: user.email, role: user.role }
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Dados inválidos" });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Login with credentials
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = credentialAuthSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email ou senha inválidos" });
      }

      // Create session
      if (req.session) {
        req.session.userId = user.id;
        req.session.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      }

      res.json({ 
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Dados inválidos" });
      }
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Create demo users for quick access
  app.post('/api/auth/create-demo-users', async (req, res) => {
    try {
      const saltRounds = 12;
      
      // Demo doctor
      const doctorPasswordHash = await bcrypt.hash('demo123', saltRounds);
      const doctorId = 'demo_doctor_001';
      
      try {
        await storage.upsertUser({
          id: doctorId,
          email: 'medico@demo.com',
          firstName: 'Dr. João',
          lastName: 'Silva',
          role: 'doctor',
          passwordHash: doctorPasswordHash,
          specialty: 'Cardiologia',
          licenseNumber: '12345/SP',
          isEmailVerified: true,
        });

        await storage.createDoctor({
          userId: doctorId,
          specialty: 'Cardiologia',
          licenseNumber: '12345/SP',
          bio: 'Médico cardiologista com 15 anos de experiência',
          experience: '15 anos',
          education: 'USP - Medicina',
          languages: 'Português, Inglês',
          consultationFee: 150,
          rating: 4.8,
          availability: [],
          whatsappNumber: '(11) 99999-0001',
        });
      } catch (e) {
        // User might already exist
      }

      // Demo patient
      const patientPasswordHash = await bcrypt.hash('demo123', saltRounds);
      const patientId = 'demo_patient_001';
      
      try {
        await storage.upsertUser({
          id: patientId,
          email: 'paciente@demo.com',
          firstName: 'Maria',
          lastName: 'Santos',
          role: 'patient',
          passwordHash: patientPasswordHash,
          isEmailVerified: true,
        });

        await storage.createPatient({
          userId: patientId,
          dateOfBirth: new Date('1985-05-15'),
          phone: '(11) 98765-4321',
          address: 'Rua das Flores, 123 - São Paulo/SP',
          cpf: '123.456.789-00',
          emergencyContact: '(11) 99999-9999',
          medicalHistory: 'Hipertensão controlada',
          allergies: 'Nenhuma conhecida',
          medications: 'Losartana 50mg',
          bloodType: 'O+',
          weight: '70kg',
          height: '1.65m',
        });
      } catch (e) {
        // User might already exist
      }

      res.json({ message: "Usuários demo criados com sucesso" });
    } catch (error) {
      console.error("Error creating demo users:", error);
      res.status(500).json({ message: "Erro ao criar usuários demo" });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Erro ao fazer logout" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Logout realizado com sucesso" });
      });
    } else {
      res.json({ message: "Logout realizado com sucesso" });
    }
  });

  // Consultation Reports API (for doctors)
  app.post('/api/consultation-reports', isAuthenticated, async (req, res) => {
    try {
      const reportData = req.body;
      const consultationReport = await storage.createConsultationReport({
        appointmentId: reportData.appointmentId,
        doctorId: reportData.doctorId,
        technicalIssues: reportData.technicalIssues || null,
        patientBehaviorIssues: reportData.patientBehaviorIssues || null,
        diagnosis: reportData.diagnosis || null,
        treatment: reportData.treatment || null,
        followUpRequired: reportData.followUpRequired || false,
        followUpInstructions: reportData.followUpInstructions || null,
        prescriptionIssued: reportData.prescriptionIssued || false,
        referralSpecialty: reportData.referralSpecialty || null,
        referralReason: reportData.referralReason || null,
        referralUrgency: reportData.referralUrgency || 'routine',
        additionalNotes: reportData.additionalNotes || null
      });
      
      res.json(consultationReport);
    } catch (error) {
      console.error('Error creating consultation report:', error);
      res.status(500).json({ error: 'Failed to create consultation report' });
    }
  });

  // Consultation Feedback API (for patients)
  app.post('/api/consultation-feedback', isAuthenticated, async (req, res) => {
    try {
      const feedbackData = req.body;
      const consultationFeedback = await storage.createConsultationFeedback({
        appointmentId: feedbackData.appointmentId,
        patientId: feedbackData.patientId,
        hadTechnicalIssues: feedbackData.hadTechnicalIssues || false,
        technicalIssuesDetails: feedbackData.technicalIssuesDetails || null,
        audioQuality: feedbackData.audioQuality || null,
        videoQuality: feedbackData.videoQuality || null,
        platformEaseOfUse: feedbackData.platformEaseOfUse || null,
        hadDoctorInteractionIssues: feedbackData.hadDoctorInteractionIssues || false,
        doctorInteractionDetails: feedbackData.doctorInteractionDetails || null,
        overallSatisfaction: feedbackData.overallSatisfaction,
        doctorKnowledge: feedbackData.doctorKnowledge,
        doctorAttention: feedbackData.doctorAttention,
        wouldRecommend: feedbackData.wouldRecommend,
        testimonial: feedbackData.testimonial || null,
        wantsToReschedule: feedbackData.wantsToReschedule || false,
        rescheduleReason: feedbackData.rescheduleReason || null,
        prefersSameDoctorReschedule: feedbackData.prefersSameDoctorReschedule || true
      });
      
      res.json(consultationFeedback);
    } catch (error) {
      console.error('Error creating consultation feedback:', error);
      res.status(500).json({ error: 'Failed to create consultation feedback' });
    }
  });

  // Get consultation reports for a specific appointment
  app.get('/api/appointments/:id/reports', isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const reports = await storage.getConsultationReportsByAppointment(appointmentId);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching consultation reports:', error);
      res.status(500).json({ error: 'Failed to fetch consultation reports' });
    }
  });

  // Get consultation feedback for a specific appointment
  app.get('/api/appointments/:id/feedback', isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const feedback = await storage.getConsultationFeedbackByAppointment(appointmentId);
      res.json(feedback);
    } catch (error) {
      console.error('Error fetching consultation feedback:', error);
      res.status(500).json({ error: 'Failed to fetch consultation feedback' });
    }
  });

  // Setup Vite to serve React app on all other routes
  if (process.env.NODE_ENV === 'development') {
    const { setupVite } = await import('./vite.js');
    await setupVite(app, httpServer);
  }

  return httpServer;
}
