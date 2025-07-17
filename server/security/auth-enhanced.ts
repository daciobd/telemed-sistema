import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { SECURITY_CONSTANTS } from "../../shared/security";

// Configurações de segurança aprimoradas
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "telemed-access-secret-dev";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "telemed-refresh-secret-dev";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "telemed-cookie-secret-dev";

export interface SecureAuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    sessionId: string;
    tokenVersion: number;
  };
  sessionMetadata?: {
    ipAddress: string;
    userAgent: string;
    loginTime: Date;
    lastActivity: Date;
  };
}

// Esquemas de validação Zod
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  rememberMe: z.boolean().optional(),
  deviceFingerprint: z.string().optional(),
});

const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           "Senha deve conter pelo menos: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial"),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  role: z.enum(["patient", "doctor"]),
  consentToDataProcessing: z.boolean().refine(val => val === true, "Consentimento obrigatório"),
  consentToMedicalData: z.boolean().refine(val => val === true, "Consentimento para dados médicos obrigatório"),
});

// Classe para gerenciamento de tokens seguros
export class SecureTokenManager {
  private tokenBlacklist = new Set<string>();

  /**
   * Gera token de acesso JWT seguro
   */
  generateAccessToken(user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  }, sessionId: string): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      sessionId,
      tokenType: "access",
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: SECURITY_CONSTANTS.JWT_ACCESS_TOKEN_EXPIRES,
      issuer: "telemed-sistema",
      audience: "telemed-users",
      algorithm: "HS256",
    });
  }

  /**
   * Gera token de refresh seguro
   */
  generateRefreshToken(userId: string, sessionId: string): string {
    const payload = {
      userId,
      sessionId,
      tokenType: "refresh",
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: SECURITY_CONSTANTS.JWT_REFRESH_TOKEN_EXPIRES,
      issuer: "telemed-sistema",
      audience: "telemed-users",
      algorithm: "HS256",
    });
  }

  /**
   * Verifica e decodifica token de acesso
   */
  verifyAccessToken(token: string): any {
    try {
      if (this.tokenBlacklist.has(token)) {
        throw new Error("Token has been revoked");
      }

      return jwt.verify(token, JWT_ACCESS_SECRET, {
        issuer: "telemed-sistema",
        audience: "telemed-users",
        algorithms: ["HS256"],
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica e decodifica token de refresh
   */
  verifyRefreshToken(token: string): any {
    try {
      if (this.tokenBlacklist.has(token)) {
        throw new Error("Token has been revoked");
      }

      return jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: "telemed-sistema",
        audience: "telemed-users",
        algorithms: ["HS256"],
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Revoga token (adiciona à blacklist)
   */
  async revokeToken(token: string, reason: string, userId?: string): Promise<void> {
    this.tokenBlacklist.add(token);

    // Log da revogação
    await storage.createAuditLog({
      userId,
      action: "TOKEN_REVOKED",
      resourceType: "auth_tokens",
      details: { reason, tokenHash: this.hashToken(token) },
      result: "success",
      riskLevel: "medium",
    });
  }

  /**
   * Gera hash do token para logs (sem expor o token real)
   */
  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex").substring(0, 16);
  }
}

// Instância singleton do gerenciador de tokens
export const tokenManager = new SecureTokenManager();

// Classe para gerenciamento de sessões seguras
export class SecureSessionManager {
  /**
   * Cria nova sessão segura
   */
  async createSession(userId: string, req: Request): Promise<string> {
    const sessionId = crypto.randomUUID();
    const ipAddress = this.getClientIP(req);
    const userAgent = req.headers["user-agent"] || "";

    // Armazenar sessão no banco
    await storage.createSecureToken({
      userId,
      tokenHash: crypto.createHash("sha256").update(sessionId).digest("hex"),
      tokenType: "access",
      expiresAt: new Date(Date.now() + SECURITY_CONSTANTS.SESSION_TIMEOUT_MINUTES * 60 * 1000),
      ipAddress,
      userAgent,
    });

    // Log da criação da sessão
    await storage.createAuditLog({
      userId,
      action: "SESSION_CREATED",
      resourceType: "user_sessions",
      details: { sessionId, ipAddress, userAgent },
      result: "success",
      riskLevel: "low",
      sessionId,
      ipAddress,
      userAgent,
    });

    return sessionId;
  }

  /**
   * Valida sessão existente
   */
  async validateSession(sessionId: string, req: Request): Promise<boolean> {
    const sessionHash = crypto.createHash("sha256").update(sessionId).digest("hex");
    const session = await storage.getSecureTokenByHash(sessionHash);

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      return false;
    }

    // Verificar IP e User-Agent para detectar sequestro de sessão
    const currentIP = this.getClientIP(req);
    const currentUserAgent = req.headers["user-agent"] || "";

    if (session.ipAddress !== currentIP) {
      // Log suspeita de sequestro de sessão
      await storage.createAuditLog({
        userId: session.userId,
        action: "SUSPICIOUS_SESSION_ACCESS",
        resourceType: "user_sessions",
        details: {
          sessionId,
          originalIP: session.ipAddress,
          currentIP,
          risk: "IP address mismatch",
        },
        result: "failure",
        riskLevel: "high",
        sessionId,
        ipAddress: currentIP,
        userAgent: currentUserAgent,
      });

      // Revogar sessão suspeita
      await this.revokeSession(sessionId, "IP address mismatch detected");
      return false;
    }

    // Atualizar último uso
    await storage.updateSecureTokenLastUsed(session.id);

    return true;
  }

  /**
   * Revoga sessão
   */
  async revokeSession(sessionId: string, reason: string): Promise<void> {
    const sessionHash = crypto.createHash("sha256").update(sessionId).digest("hex");
    await storage.revokeSecureToken(sessionHash, reason);

    await storage.createAuditLog({
      action: "SESSION_REVOKED",
      resourceType: "user_sessions",
      details: { sessionId, reason },
      result: "success",
      riskLevel: "medium",
      sessionId,
    });
  }

  /**
   * Obtém IP real do cliente (considerando proxies)
   */
  private getClientIP(req: Request): string {
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      ""
    ).toString();
  }
}

// Instância singleton do gerenciador de sessões
export const sessionManager = new SecureSessionManager();

// Classe para autenticação aprimorada
export class EnhancedAuth {
  private loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();

  /**
   * Registra novo usuário com validações de segurança
   */
  async register(data: z.infer<typeof registerSchema>, req: Request): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
  }> {
    // Validar dados
    const validatedData = registerSchema.parse(data);

    // Verificar se usuário já existe
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      throw new Error("E-mail já cadastrado");
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Criar usuário
    const user = await storage.createUser({
      id: crypto.randomUUID(),
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      role: validatedData.role,
      passwordHash,
      isEmailVerified: false,
    });

    // Registrar consentimentos LGPD
    await this.recordUserConsents(user.id, req, [
      { type: "data_processing", granted: validatedData.consentToDataProcessing },
      { type: "medical_data", granted: validatedData.consentToMedicalData },
    ]);

    // Criar configurações de privacidade padrão
    await storage.createPrivacySettings({
      userId: user.id,
      allowDataSharing: false,
      allowAnalytics: false,
      allowMarketing: false,
      allowThirdPartySharing: false,
    });

    // Criar sessão
    const sessionId = await sessionManager.createSession(user.id, req);

    // Gerar tokens
    const accessToken = tokenManager.generateAccessToken(user, sessionId);
    const refreshToken = tokenManager.generateRefreshToken(user.id, sessionId);

    // Log do registro
    await storage.createAuditLog({
      userId: user.id,
      action: "USER_REGISTERED",
      resourceType: "users",
      resourceId: user.id,
      details: { email: user.email, role: user.role },
      result: "success",
      riskLevel: "low",
      sessionId,
      ipAddress: sessionManager["getClientIP"](req),
      userAgent: req.headers["user-agent"],
    });

    return { user, accessToken, refreshToken };
  }

  /**
   * Autentica usuário com proteção contra ataques
   */
  async login(data: z.infer<typeof loginSchema>, req: Request): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
  }> {
    const validatedData = loginSchema.parse(data);
    const clientIP = sessionManager["getClientIP"](req);

    // Verificar tentativas de login
    const attempts = this.loginAttempts.get(clientIP);
    if (attempts && attempts.count >= SECURITY_CONSTANTS.MAX_LOGIN_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
      if (timeSinceLastAttempt < SECURITY_CONSTANTS.LOCKOUT_DURATION_MINUTES * 60 * 1000) {
        await storage.createAuditLog({
          action: "LOGIN_BLOCKED",
          resourceType: "auth",
          details: { email: validatedData.email, reason: "Too many attempts" },
          result: "failure",
          riskLevel: "high",
          ipAddress: clientIP,
          userAgent: req.headers["user-agent"],
        });

        throw new Error("Muitas tentativas de login. Tente novamente em 15 minutos.");
      } else {
        // Reset contador após período de bloqueio
        this.loginAttempts.delete(clientIP);
      }
    }

    try {
      // Buscar usuário
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user || !user.passwordHash) {
        throw new Error("Credenciais inválidas");
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(validatedData.password, user.passwordHash);
      if (!isValidPassword) {
        throw new Error("Credenciais inválidas");
      }

      // Resetar tentativas de login em caso de sucesso
      this.loginAttempts.delete(clientIP);

      // Criar sessão
      const sessionId = await sessionManager.createSession(user.id, req);

      // Gerar tokens
      const accessToken = tokenManager.generateAccessToken(user, sessionId);
      const refreshToken = tokenManager.generateRefreshToken(user.id, sessionId);

      // Log do login bem-sucedido
      await storage.createAuditLog({
        userId: user.id,
        action: "USER_LOGIN",
        resourceType: "auth",
        details: { email: user.email, method: "credentials" },
        result: "success",
        riskLevel: "low",
        sessionId,
        ipAddress: clientIP,
        userAgent: req.headers["user-agent"],
      });

      return { user, accessToken, refreshToken };

    } catch (error) {
      // Incrementar tentativas de login
      const currentAttempts = this.loginAttempts.get(clientIP) || { count: 0, lastAttempt: new Date() };
      this.loginAttempts.set(clientIP, {
        count: currentAttempts.count + 1,
        lastAttempt: new Date(),
      });

      // Log da tentativa falhada
      await storage.createAuditLog({
        action: "LOGIN_FAILED",
        resourceType: "auth",
        details: { email: validatedData.email, error: error instanceof Error ? error.message : "Unknown" },
        result: "failure",
        riskLevel: "medium",
        ipAddress: clientIP,
        userAgent: req.headers["user-agent"],
      });

      throw error;
    }
  }

  /**
   * Registra consentimentos LGPD do usuário
   */
  private async recordUserConsents(
    userId: string,
    req: Request,
    consents: Array<{ type: string; granted: boolean }>
  ): Promise<void> {
    const ipAddress = sessionManager["getClientIP"](req);
    const userAgent = req.headers["user-agent"] || "";

    for (const consent of consents) {
      await storage.createUserConsent({
        userId,
        consentType: consent.type as any,
        granted: consent.granted,
        purpose: `Processamento de dados para ${consent.type}`,
        legalBasis: "consent",
        ipAddress,
        userAgent,
        consentMethod: "web_form",
        expiresAt: new Date(Date.now() + SECURITY_CONSTANTS.CONSENT_VALIDITY_MONTHS * 30 * 24 * 60 * 60 * 1000),
      });
    }
  }
}

// Instância singleton da autenticação aprimorada
export const enhancedAuth = new EnhancedAuth();

// Middleware de autenticação segura
export function requireSecureAuth(req: SecureAuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de acesso obrigatório" });
  }

  const token = authHeader.substring(7);
  const decoded = tokenManager.verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }

  req.user = decoded;
  req.sessionMetadata = {
    ipAddress: sessionManager["getClientIP"](req),
    userAgent: req.headers["user-agent"] || "",
    loginTime: new Date(decoded.iat * 1000),
    lastActivity: new Date(),
  };

  next();
}

// Middleware para configurar cookies seguros
export function setSecureCookies(res: Response, accessToken: string, refreshToken: string): void {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutos
    signed: true,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    signed: true,
  });
}

// Validações de senha segura
export const passwordValidation = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxConsecutiveChars: 3,
  
  validate(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.minLength) {
      errors.push(`Senha deve ter pelo menos ${this.minLength} caracteres`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push("Senha deve conter pelo menos uma letra maiúscula");
    }

    if (this.requireLowercase && !/[a-z]/.test(password)) {
      errors.push("Senha deve conter pelo menos uma letra minúscula");
    }

    if (this.requireNumbers && !/\d/.test(password)) {
      errors.push("Senha deve conter pelo menos um número");
    }

    if (this.requireSpecialChars && !/[@$!%*?&]/.test(password)) {
      errors.push("Senha deve conter pelo menos um caractere especial (@$!%*?&)");
    }

    // Verificar caracteres consecutivos
    for (let i = 0; i <= password.length - this.maxConsecutiveChars; i++) {
      const substr = password.substring(i, i + this.maxConsecutiveChars);
      if (substr === substr[0].repeat(this.maxConsecutiveChars)) {
        errors.push(`Senha não pode ter mais de ${this.maxConsecutiveChars - 1} caracteres consecutivos iguais`);
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export { loginSchema, registerSchema };