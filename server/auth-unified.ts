
// TeleMed Unified Authentication Strategy
// JWT + OAuth Provider consolidado

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { users } from '../shared/schema-unified';
import { eq } from 'drizzle-orm';

export interface AuthUser {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  firstName?: string;
  lastName?: string;
  specialty?: string;
  licenseNumber?: string;
}

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export class UnifiedAuthProvider {
  private jwtSecret: string;
  private jwtRefreshSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'telemed-secret-key';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'telemed-refresh-secret';
  }

  // JWT Token Generation
  generateTokens(user: AuthUser): AuthToken {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      specialty: user.specialty
    };

    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, this.jwtRefreshSecret, { expiresIn: '7d' });

    return {
      token,
      refreshToken,
      expiresIn: 3600, // 1 hour
      user
    };
  }

  // Verify JWT Token
  verifyToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        specialty: decoded.specialty
      };
    } catch (error) {
      return null;
    }
  }

  // Refresh Token
  refreshAccessToken(refreshToken: string): string | null {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as any;
      const newToken = jwt.sign({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        specialty: decoded.specialty
      }, this.jwtSecret, { expiresIn: '1h' });
      
      return newToken;
    } catch (error) {
      return null;
    }
  }

  // Password Authentication
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Role-based Access Control
  hasRole(user: AuthUser, requiredRole: string | string[]): boolean {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  }

  canAccessPatientData(user: AuthUser, patientId: string): boolean {
    return user.role === 'admin' || 
           user.role === 'doctor' || 
           (user.role === 'patient' && user.id === patientId);
  }

  canManageConsultations(user: AuthUser): boolean {
    return user.role === 'admin' || user.role === 'doctor';
  }
}

export const authProvider = new UnifiedAuthProvider();
