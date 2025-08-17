import { patients, insertPatientSchema, updatePatientSchema, users, insertUserSchema } from "@shared/schema";
import { sql, eq } from "drizzle-orm";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";


export async function registerRoutes(app: Express): Promise<Server> {
  // Env validation
  const env = z.object({
    JWT_SECRET: z.string().min(32),
  }).parse({
    JWT_SECRET: process.env.JWT_SECRET || "super_secret_jwt_key_that_should_be_changed_in_production_with_at_least_32_chars"
  });

  // Register route
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { username, password, role } = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (existingUser.length > 0) {
        return res.status(409).json({ error: "username_taken" });
      }
      
      // Hash password and create user
      const passwordHash = await bcrypt.hash(password, 12);
      await db.insert(users).values({ username, role, passwordHash });
      
      return res.status(201).json({ ok: true, message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Login route
  const loginSchema = insertUserSchema.pick({ username: true, password: true });
  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Find user
      const foundUsers = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (foundUsers.length === 0) {
        return res.status(401).json({ error: "invalid_credentials" });
      }
      
      const user = foundUsers[0];
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "invalid_credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { sub: user.id, role: user.role, username: user.username }, 
        env.JWT_SECRET, 
        { expiresIn: "7d" }
      );
      
      // Set cookie
      res.cookie("auth", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      return res.json({ 
        ok: true, 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        } 
      });
    } catch (error) {
      next(error);
    }
  });

  // Logout route
  app.post("/api/logout", (req, res) => {
    res.clearCookie("auth", { path: "/" });
    res.json({ ok: true, message: "Logged out successfully" });
  });

  // Me route (get current user)
  app.get("/api/me", async (req, res) => {
    const token = req.cookies?.auth;
    if (!token) {
      return res.status(401).json({ error: "unauthorized" });
    }
    
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as any;
      
      // Get fresh user data from database
      const foundUsers = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
      if (foundUsers.length === 0) {
        return res.status(401).json({ error: "user_not_found" });
      }
      
      const user = foundUsers[0];
      return res.json({ 
        id: user.id, 
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      });
    } catch (error) {
      return res.status(401).json({ error: "invalid_token" });
    }
  });

  // Middleware for protecting routes
  const requireAuth = async (req: any, res: any, next: any) => {
    const token = req.cookies?.auth;
    if (!token) {
      return res.status(401).json({ error: "unauthorized" });
    }
    
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as any;
      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).json({ error: "invalid_token" });
    }
  };

  // Protected route example
  app.get("/api/protected", requireAuth, (req: any, res) => {
    res.json({ message: "This is a protected route", user: req.user });
  });

  // AI Feature Flags endpoint
  app.get("/api/ai-features", requireAuth, async (req: any, res) => {
    try {
      console.log('Environment variables check:', {
        AI_ENABLED: process.env.AI_ENABLED,
        AI_SYMPTOMS_ENABLED: process.env.AI_SYMPTOMS_ENABLED,
        AI_ICD_SUGGESTION_ENABLED: process.env.AI_ICD_SUGGESTION_ENABLED,
        AI_DRUG_INTERACTIONS_ENABLED: process.env.AI_DRUG_INTERACTIONS_ENABLED
      });
      
      const features = {
        AI_ENABLED: process.env.AI_ENABLED === 'true',
        AI_SYMPTOMS_ENABLED: process.env.AI_SYMPTOMS_ENABLED === 'true',
        AI_ICD_SUGGESTION_ENABLED: process.env.AI_ICD_SUGGESTION_ENABLED === 'true',
        AI_DRUG_INTERACTIONS_ENABLED: process.env.AI_DRUG_INTERACTIONS_ENABLED === 'true'
      };
      res.json(features);
    } catch (error) {
      console.error('Error getting AI features:', error);
      res.status(500).json({ error: 'Failed to get AI features' });
    }
  });

  // Medical consent logging endpoint
  app.post("/api/medical/consent", requireAuth, async (req: any, res) => {
    try {
      const { consentType, timestamp } = req.body;
      
      // Log consent for audit (without PHI)
      console.log(`AI consent given by user ${req.user?.id} for ${consentType} at ${timestamp}`);
      
      res.json({ success: true, message: 'Consent logged successfully' });
    } catch (error) {
      console.error('Error logging consent:', error);
      res.status(500).json({ error: 'Failed to log consent' });
    }
  });

  // OpenAI Medical Assistant routes with feature flags
  app.post("/api/medical/analyze-symptoms", requireAuth, async (req: any, res) => {
    try {
      const { analyzeSymptoms, AI_FEATURE_FLAGS } = await import("./openai");
      
      // Check feature flags first
      if (!AI_FEATURE_FLAGS.AI_ENABLED || !AI_FEATURE_FLAGS.AI_SYMPTOMS_ENABLED) {
        return res.status(403).json({ 
          error: 'AI symptom analysis is currently disabled',
          code: 'AI_DISABLED'
        });
      }

      // Log AI usage for audit (without PHI)
      console.log(`AI symptom analysis requested by user ${req.user?.id} at ${new Date().toISOString()}`);
      
      const result = await analyzeSymptoms(req.body);
      res.json(result);
    } catch (error: any) {
      console.error('Symptom analysis error:', error);
      
      if (error.message.includes('disabled')) {
        return res.status(403).json({ error: error.message, code: 'AI_DISABLED' });
      }
      
      res.status(500).json({ error: error.message || 'Failed to analyze symptoms' });
    }
  });

  app.post("/api/medical/advice", requireAuth, async (req: any, res) => {
    try {
      const { getMedicalAdvice, AI_FEATURE_FLAGS } = await import("./openai");
      
      // Check feature flags first
      if (!AI_FEATURE_FLAGS.AI_ENABLED) {
        return res.status(403).json({ 
          error: 'AI medical advice is currently disabled',
          code: 'AI_DISABLED'
        });
      }

      const { question, patientContext } = req.body;
      
      // Log AI usage for audit (without PHI)
      console.log(`AI medical advice requested by user ${req.user?.id} at ${new Date().toISOString()}`);
      
      const advice = await getMedicalAdvice(question, patientContext);
      res.json({ advice });
    } catch (error: any) {
      console.error('Medical advice error:', error);
      
      if (error.message.includes('disabled')) {
        return res.status(403).json({ error: error.message, code: 'AI_DISABLED' });
      }
      
      res.status(500).json({ error: error.message || 'Failed to get medical advice' });
    }
  });

  app.post("/api/medical/drug-interactions", requireAuth, async (req: any, res) => {
    try {
      const { checkDrugInteractions, AI_FEATURE_FLAGS } = await import("./openai");
      
      // Drug interactions are disabled for safety
      return res.status(403).json({ 
        error: 'AI drug interaction checking is disabled for patient safety. Please use a licensed pharmaceutical database or clinical decision support system.',
        code: 'AI_DISABLED',
        recommendation: 'Use licensed drug interaction database'
      });
      
    } catch (error: any) {
      console.error('Drug interaction check error:', error);
      res.status(403).json({ 
        error: 'Drug interaction checking via AI is not available',
        code: 'AI_DISABLED'
      });
    }
  });

  // AI Consent logging endpoint
  app.post("/api/medical/consent", requireAuth, async (req: any, res) => {
    try {
      const { consentType, patientId, timestamp } = req.body;
      
      // Log consent for LGPD compliance (without PHI details)
      console.log(`AI consent logged: ${consentType} by user ${req.user?.id} at ${timestamp || new Date().toISOString()}`);
      
      // In a real system, this would be stored in database
      res.json({ success: true, message: 'Consent logged successfully' });
    } catch (error: any) {
      console.error('Consent logging error:', error);
      res.status(500).json({ error: 'Failed to log consent' });
    }
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)
  // ROTAS DE PACIENTES

  // Listar todos os pacientes do médico
  app.get("/api/patients", requireAuth, async (req: any, res) => {
    try {
      const userPatients = await db.select().from(patients).where(eq(patients.createdBy, req.user.sub));
      res.json(userPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ error: 'Failed to fetch patients' });
    }
  });

  // Criar novo paciente
  app.post("/api/patients", requireAuth, async (req: any, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const newPatient = await db.insert(patients).values({
        ...validatedData,
        createdBy: req.user.sub
      }).returning();

      res.status(201).json(newPatient[0]);
    } catch (error: any) {
      console.error('Error creating patient:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid patient data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create patient' });
    }
  });

  // Buscar paciente específico
  app.get("/api/patients/:id", requireAuth, async (req: any, res) => {
    try {
      const patientId = parseInt(req.params.id);
      const patient = await db.select().from(patients)
        .where(eq(patients.id, patientId) && eq(patients.createdBy, req.user.sub))
        .limit(1);

      if (patient.length === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      res.json(patient[0]);
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ error: 'Failed to fetch patient' });
    }
  });

  // Atualizar paciente
  app.put("/api/patients/:id", requireAuth, async (req: any, res) => {
    try {
      const patientId = parseInt(req.params.id);
      const validatedData = updatePatientSchema.parse(req.body);

      const updatedPatient = await db.update(patients)
        .set(validatedData)
        .where(eq(patients.id, patientId) && eq(patients.createdBy, req.user.sub))
        .returning();

      if (updatedPatient.length === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      res.json(updatedPatient[0]);
    } catch (error: any) {
      console.error('Error updating patient:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid patient data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update patient' });
    }
  });

  // Buscar pacientes por nome ou CPF
  app.get("/api/patients/search/:term", requireAuth, async (req: any, res) => {
    try {
      const searchTerm = req.params.term.toLowerCase();
      const foundPatients = await db.select().from(patients)
        .where(
          eq(patients.createdBy, req.user.sub) && 
          (
            sql`LOWER(${patients.name}) LIKE ${`%${searchTerm}%`}` ||
            sql`${patients.cpf} LIKE ${`%${searchTerm}%`}`
          )
        );

      res.json(foundPatients);
    } catch (error) {
      console.error('Error searching patients:', error);
      res.status(500).json({ error: 'Failed to search patients' });
    }
  });

  // Deletar paciente (opcional)
  app.delete("/api/patients/:id", requireAuth, async (req: any, res) => {
    try {
      const patientId = parseInt(req.params.id);
      const deletedPatient = await db.delete(patients)
        .where(eq(patients.id, patientId) && eq(patients.createdBy, req.user.sub))
        .returning();

      if (deletedPatient.length === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      console.error('Error deleting patient:', error);
      res.status(500).json({ error: 'Failed to delete patient' });
    }
  });
  const httpServer = createServer(app);

  return httpServer;
}
