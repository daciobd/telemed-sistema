import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertAppointmentSchema, insertMedicalRecordSchema, insertPatientSchema, insertDoctorSchema, insertPrescriptionSchema } from "@shared/schema";
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
      res.status(201).json(appointment);
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
      const revenue = allAppointments.reduce((sum, apt) => sum + (apt.price || 150), 0);
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
  
  return httpServer;
}
