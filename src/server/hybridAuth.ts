import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

// Hybrid authentication middleware that supports both Replit Auth and credentials
export const hybridAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First, try Replit Auth
    if (req.user?.claims?.sub) {
      // Replit Auth is active
      return next();
    }

    // Then, try session-based auth (credentials)
    if (req.session?.userId) {
      const user = await storage.getUserWithProfile(req.session.userId);
      if (user) {
        // Simulate Replit Auth structure for compatibility
        req.user = {
          claims: {
            sub: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            profile_image_url: user.profileImageUrl
          }
        };
        return next();
      }
    }

    // No valid authentication found
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
};

// Check if user is authenticated (non-blocking version for optional auth)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try Replit Auth first
    if (req.user?.claims?.sub) {
      return next();
    }

    // Try session-based auth
    if (req.session?.userId) {
      const user = await storage.getUserWithProfile(req.session.userId);
      if (user) {
        req.user = {
          claims: {
            sub: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            profile_image_url: user.profileImageUrl
          }
        };
      }
    }

    // Continue regardless of auth status
    next();
  } catch (error) {
    console.error("Optional auth error:", error);
    next();
  }
};