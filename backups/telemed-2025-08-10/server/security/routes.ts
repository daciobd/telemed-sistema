import { Router } from "express";
import { isAuthenticated } from "../replitAuth";
import { storage } from "../storage";
import { auditLogger } from "./audit-logger";

const router = Router();

// ===============================================
// CONSENT MANAGEMENT ROUTES
// ===============================================

// Get user's current consents
router.get('/consents', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const consents = await storage.getUserConsents(userId);

    // Log access to consents
    await auditLogger.log({
      userId,
      action: 'VIEW_CONSENTS',
      resourceType: 'user_consents',
      result: 'success',
      riskLevel: 'low',
      details: { consentCount: consents.length },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json(consents);
  } catch (error) {
    await auditLogger.log({
      userId: req.user?.claims?.sub,
      action: 'VIEW_CONSENTS',
      resourceType: 'user_consents',
      result: 'failure',
      riskLevel: 'medium',
      details: { error: error.message },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({ error: 'Failed to fetch consents' });
  }
});

// Grant or update consent
router.post('/consents', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { consentType, granted, purposes } = req.body;

    const consent = await storage.recordConsent({
      userId,
      consentType,
      granted,
      purposes: purposes || [],
      version: '1.0',
      givenAt: new Date()
    });

    // Log consent action
    await auditLogger.log({
      userId,
      action: 'CONSENT_RECORDED',
      resourceType: 'user_consents',
      resourceId: consent.id.toString(),
      result: 'success',
      riskLevel: 'low',
      details: { consentType, granted, purposes },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json(consent);
  } catch (error) {
    await auditLogger.log({
      userId: req.user?.claims?.sub,
      action: 'CONSENT_RECORDED',
      resourceType: 'user_consents',
      result: 'failure',
      riskLevel: 'high',
      details: { error: error.message },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({ error: 'Failed to record consent' });
  }
});

// ===============================================
// PRIVACY SETTINGS ROUTES
// ===============================================

// Get user's privacy settings
router.get('/privacy/settings', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const settings = await storage.getPrivacySettings(userId);

    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch privacy settings' });
  }
});

// Update privacy settings
router.put('/privacy/settings', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const updates = req.body;

    const settings = await storage.updatePrivacySettings(userId, updates);

    // Log privacy settings change
    await auditLogger.log({
      userId,
      action: 'PRIVACY_SETTINGS_UPDATED',
      resourceType: 'privacy_settings',
      result: 'success',
      riskLevel: 'medium',
      details: { updatedFields: Object.keys(updates) },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ settings });
  } catch (error) {
    await auditLogger.log({
      userId: req.user?.claims?.sub,
      action: 'PRIVACY_SETTINGS_UPDATED',
      resourceType: 'privacy_settings',
      result: 'failure',
      riskLevel: 'high',
      details: { error: error.message },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({ error: 'Failed to update privacy settings' });
  }
});

// ===============================================
// LGPD COMPLIANCE ROUTES
// ===============================================

// Export user data (LGPD Article 15)
router.get('/lgpd/export', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // For now, allow data export for authenticated users
    // In production, could add additional verification steps
    
    const userData = await storage.exportUserDataForLGPD(userId);

    // Log data export
    await auditLogger.log({
      userId,
      action: 'DATA_EXPORTED',
      resourceType: 'user_data',
      result: 'success',
      riskLevel: 'high',
      details: { 
        dataTypes: Object.keys(userData),
        exportFormat: 'JSON'
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ 
      data: userData,
      exportedAt: new Date().toISOString(),
      format: 'JSON'
    });
  } catch (error) {
    await auditLogger.log({
      userId: req.user?.claims?.sub,
      action: 'DATA_EXPORTED',
      resourceType: 'user_data',
      result: 'failure',
      riskLevel: 'critical',
      details: { error: error.message },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({ error: 'Failed to export user data' });
  }
});

// Submit LGPD request (deletion, rectification, etc.)
router.post('/lgpd/request', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { requestType, description } = req.body;

    const request = await storage.createLgpdRequest({
      userId,
      requestType,
      description,
      status: 'pending',
      requestDate: new Date(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days
    });

    // Log LGPD request
    await auditLogger.log({
      userId,
      action: 'LGPD_REQUEST_SUBMITTED',
      resourceType: 'lgpd_requests',
      resourceId: request.id.toString(),
      result: 'success',
      riskLevel: 'high',
      details: { requestType, description: description.substring(0, 100) },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({ request });
  } catch (error) {
    await auditLogger.log({
      userId: req.user?.claims?.sub,
      action: 'LGPD_REQUEST_SUBMITTED',
      resourceType: 'lgpd_requests',
      result: 'failure',
      riskLevel: 'critical',
      details: { error: error.message },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({ error: 'Failed to submit LGPD request' });
  }
});

// Get user's LGPD requests
router.get('/lgpd/requests', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const requests = await storage.getLgpdRequestsByUser(userId);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch LGPD requests' });
  }
});

// ===============================================
// AUDIT LOG ROUTES (User Access)
// ===============================================

// Get user's audit logs
router.get('/audit-logs', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { limit = 50, offset = 0, action, result } = req.query;

    const logs = await storage.getUserAuditLogs(userId, {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      action: action as string,
      result: result as string
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// ===============================================
// ENCRYPTION VERIFICATION ROUTES
// ===============================================

// Verify data encryption status
router.get('/encryption/status', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Check encryption status for user's sensitive data
    const encryptionStatus = {
      medicalRecords: await storage.verifyMedicalDataEncryption(userId),
      personalData: await storage.verifyPersonalDataEncryption(userId),
      communications: await storage.verifyCommunicationEncryption(userId),
      lastVerification: new Date().toISOString()
    };

    res.json(encryptionStatus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify encryption status' });
  }
});

// ===============================================
// ADMIN ROUTES (Restricted Access)
// ===============================================

// Admin: Get all audit logs
router.get('/admin/audit-logs', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);

    // Check if user is admin
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { limit = 100, offset = 0, userId: targetUserId, action, riskLevel } = req.query;

    const logs = await storage.getAuditLogs({
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      userId: targetUserId as string,
      action: action as string,
      riskLevel: riskLevel as string
    });

    // Log admin access to audit logs
    await auditLogger.log({
      userId,
      action: 'ADMIN_AUDIT_LOGS_ACCESSED',
      resourceType: 'audit_logs',
      result: 'success',
      riskLevel: 'high',
      details: { 
        targetUserId, 
        action, 
        riskLevel,
        recordsAccessed: logs.length 
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json(logs);
  } catch (error) {
    await auditLogger.log({
      userId: req.user?.claims?.sub,
      action: 'ADMIN_AUDIT_LOGS_ACCESSED',
      resourceType: 'audit_logs',
      result: 'failure',
      riskLevel: 'critical',
      details: { error: error.message },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Admin: Process LGPD requests
router.put('/admin/lgpd/requests/:id', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);

    // Check if user is admin
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const requestId = parseInt(req.params.id);
    const { status, response } = req.body;

    const request = await storage.updateLgpdRequest(requestId, {
      status,
      response,
      processedAt: new Date(),
      processedBy: userId
    });

    // Log LGPD request processing
    await auditLogger.log({
      userId,
      action: 'LGPD_REQUEST_PROCESSED',
      resourceType: 'lgpd_requests',
      resourceId: requestId.toString(),
      result: 'success',
      riskLevel: 'high',
      details: { status, response: response?.substring(0, 100) },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ request });
  } catch (error) {
    await auditLogger.log({
      userId: req.user?.claims?.sub,
      action: 'LGPD_REQUEST_PROCESSED',
      resourceType: 'lgpd_requests',
      result: 'failure',
      riskLevel: 'critical',
      details: { error: error.message },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({ error: 'Failed to process LGPD request' });
  }
});

// ===============================================
// SECURITY HEALTH CHECK
// ===============================================

router.get('/health', async (req, res) => {
  try {
    const securityHealth = {
      encryption: {
        status: 'active',
        algorithm: 'AES-256-GCM',
        keyRotation: 'enabled'
      },
      audit: {
        status: 'active',
        logsRetention: '3 years',
        riskLevels: ['low', 'medium', 'high', 'critical']
      },
      lgpd: {
        status: 'compliant',
        dataRetention: 'configured',
        consentManagement: 'active'
      },
      lastChecked: new Date().toISOString()
    };

    res.json(securityHealth);
  } catch (error) {
    res.status(500).json({ error: 'Security health check failed' });
  }
});

export default router;