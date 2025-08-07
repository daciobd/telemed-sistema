import { storage } from "../storage";
import { SECURITY_CONSTANTS } from "../../shared/security";
import type { InsertLgpdRequest, InsertUserConsent } from "../../shared/security";

// Classe para gerenciamento de conformidade LGPD
export class LGPDComplianceManager {
  
  /**
   * Registra consentimento do usuário
   */
  async recordConsent(data: {
    userId: string;
    consentType: "data_processing" | "medical_data" | "communication" | "analytics" | "marketing";
    granted: boolean;
    purpose: string;
    legalBasis: "consent" | "legitimate_interest" | "legal_obligation" | "vital_interests" | "public_task" | "contract";
    ipAddress?: string;
    userAgent?: string;
    consentMethod: "web_form" | "email" | "phone" | "physical_document";
  }): Promise<void> {
    await storage.createUserConsent({
      userId: data.userId,
      consentType: data.consentType,
      granted: data.granted,
      purpose: data.purpose,
      legalBasis: data.legalBasis,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      consentMethod: data.consentMethod,
      expiresAt: new Date(Date.now() + SECURITY_CONSTANTS.CONSENT_VALIDITY_MONTHS * 30 * 24 * 60 * 60 * 1000),
    });

    // Log da operação
    await storage.createAuditLog({
      userId: data.userId,
      action: "CONSENT_RECORDED",
      resourceType: "user_consents",
      details: {
        consentType: data.consentType,
        granted: data.granted,
        purpose: data.purpose,
        legalBasis: data.legalBasis,
        method: data.consentMethod,
      },
      result: "success",
      riskLevel: "low",
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });
  }

  /**
   * Revoga consentimento
   */
  async revokeConsent(userId: string, consentType: string, reason?: string): Promise<void> {
    await storage.revokeUserConsent(userId, consentType);

    await storage.createAuditLog({
      userId,
      action: "CONSENT_REVOKED",
      resourceType: "user_consents",
      details: { consentType, reason },
      result: "success",
      riskLevel: "medium",
    });
  }

  /**
   * Processa solicitação de direitos LGPD
   */
  async processRightsRequest(data: {
    userId: string;
    requestType: "access" | "portability" | "rectification" | "deletion" | "restriction" | "objection";
    description: string;
    requestedData?: any;
    processedBy?: string;
  }): Promise<{ requestId: number; dueDate: Date }> {
    const dueDate = new Date(Date.now() + SECURITY_CONSTANTS.LGPD_RESPONSE_DEADLINE_DAYS * 24 * 60 * 60 * 1000);

    const request = await storage.createLgpdRequest({
      userId: data.userId,
      requestType: data.requestType,
      description: data.description,
      requestedData: data.requestedData,
      status: "pending",
      dueDate,
    });

    // Log da solicitação
    await storage.createAuditLog({
      userId: data.userId,
      action: "LGPD_REQUEST_CREATED",
      resourceType: "lgpd_requests",
      resourceId: request.id.toString(),
      details: {
        requestType: data.requestType,
        description: data.description,
        dueDate: dueDate.toISOString(),
      },
      result: "success",
      riskLevel: "medium",
    });

    return { requestId: request.id, dueDate };
  }

  /**
   * Exporta dados do usuário (direito de portabilidade)
   */
  async exportUserData(userId: string, requestId: number): Promise<{
    personalData: any;
    medicalData: any;
    activityData: any;
    consentHistory: any;
  }> {
    try {
      // Buscar todos os dados do usuário
      const [user, patient, doctor, appointments, medicalRecords, consents, auditLogs] = await Promise.all([
        storage.getUserWithProfile(userId),
        storage.getPatientByUserId(userId),
        storage.getDoctorByUserId(userId),
        storage.getAppointmentsByUserId(userId),
        storage.getMedicalRecordsByUserId(userId),
        storage.getUserConsents(userId),
        storage.getAuditLogsByUserId(userId),
      ]);

      const exportData = {
        personalData: {
          user: user ? {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          } : null,
          patient: patient || null,
          doctor: doctor || null,
        },
        medicalData: {
          appointments: appointments || [],
          medicalRecords: medicalRecords || [],
        },
        activityData: {
          loginHistory: auditLogs?.filter(log => log.action.includes("LOGIN")) || [],
          dataAccess: auditLogs?.filter(log => log.action.includes("READ")) || [],
        },
        consentHistory: consents || [],
        exportMetadata: {
          requestId,
          exportDate: new Date().toISOString(),
          dataRetentionPeriod: SECURITY_CONSTANTS.AUDIT_LOG_RETENTION_DAYS,
          legalBasis: "Article 20 LGPD - Right to data portability",
        },
      };

      // Atualizar status da solicitação
      await storage.updateLgpdRequestStatus(requestId, "completed", exportData);

      // Log da exportação
      await storage.createAuditLog({
        userId,
        action: "DATA_EXPORTED",
        resourceType: "lgpd_requests",
        resourceId: requestId.toString(),
        details: {
          dataSize: JSON.stringify(exportData).length,
          includesPersonalData: !!exportData.personalData.user,
          includesMedicalData: exportData.medicalData.appointments.length > 0,
        },
        result: "success",
        riskLevel: "high",
      });

      return exportData;
    } catch (error) {
      // Log do erro
      await storage.createAuditLog({
        userId,
        action: "DATA_EXPORT_FAILED",
        resourceType: "lgpd_requests",
        resourceId: requestId.toString(),
        details: { error: error instanceof Error ? error.message : "Unknown error" },
        result: "failure",
        riskLevel: "high",
      });

      throw new Error(`Falha na exportação de dados: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  }

  /**
   * Deleta dados do usuário (direito ao esquecimento)
   */
  async deleteUserData(userId: string, requestId: number, options: {
    keepBasicProfile?: boolean;
    anonymizeMedicalRecords?: boolean;
    retainForLegalPurposes?: boolean;
  } = {}): Promise<void> {
    try {
      const deletionLog: any = {
        userId,
        requestId,
        deletionDate: new Date().toISOString(),
        deletedData: [],
        retainedData: [],
        anonymizedData: [],
      };

      // 1. Revogar todos os consentimentos
      await storage.revokeAllUserConsents(userId);
      deletionLog.deletedData.push("user_consents");

      // 2. Deletar ou anonimizar dados médicos
      if (options.anonymizeMedicalRecords) {
        await storage.anonymizeMedicalRecords(userId);
        deletionLog.anonymizedData.push("medical_records");
      } else if (!options.retainForLegalPurposes) {
        await storage.deleteMedicalRecords(userId);
        deletionLog.deletedData.push("medical_records");
      } else {
        deletionLog.retainedData.push("medical_records (legal requirement)");
      }

      // 3. Deletar dados pessoais
      if (!options.keepBasicProfile) {
        await storage.deleteUserPersonalData(userId);
        deletionLog.deletedData.push("personal_data");
      } else {
        await storage.anonymizeUserPersonalData(userId);
        deletionLog.anonymizedData.push("personal_data");
      }

      // 4. Manter logs de auditoria por período legal
      deletionLog.retainedData.push(`audit_logs (${SECURITY_CONSTANTS.AUDIT_LOG_RETENTION_DAYS} days)`);

      // 5. Revogar todos os tokens
      await storage.revokeAllUserTokens(userId);
      deletionLog.deletedData.push("auth_tokens");

      // Atualizar status da solicitação
      await storage.updateLgpdRequestStatus(requestId, "completed", deletionLog);

      // Log da deleção
      await storage.createAuditLog({
        userId,
        action: "USER_DATA_DELETED",
        resourceType: "lgpd_requests",
        resourceId: requestId.toString(),
        details: deletionLog,
        result: "success",
        riskLevel: "critical",
      });

    } catch (error) {
      // Log do erro
      await storage.createAuditLog({
        userId,
        action: "DATA_DELETION_FAILED",
        resourceType: "lgpd_requests",
        resourceId: requestId.toString(),
        details: { error: error instanceof Error ? error.message : "Unknown error" },
        result: "failure",
        riskLevel: "critical",
      });

      throw new Error(`Falha na deleção de dados: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  }

  /**
   * Verifica conformidade dos consentimentos
   */
  async checkConsentCompliance(userId: string): Promise<{
    isCompliant: boolean;
    missingConsents: string[];
    expiredConsents: string[];
    validConsents: string[];
  }> {
    const consents = await storage.getUserConsents(userId);
    const now = new Date();

    const validConsents: string[] = [];
    const expiredConsents: string[] = [];
    const requiredConsents = ["data_processing", "medical_data"];

    // Verificar consentimentos existentes
    for (const consent of consents) {
      if (consent.granted && consent.expiresAt && consent.expiresAt > now && !consent.revokedAt) {
        validConsents.push(consent.consentType);
      } else if (consent.expiresAt && consent.expiresAt <= now) {
        expiredConsents.push(consent.consentType);
      }
    }

    // Verificar consentimentos obrigatórios faltantes
    const missingConsents = requiredConsents.filter(
      required => !validConsents.includes(required)
    );

    return {
      isCompliant: missingConsents.length === 0 && expiredConsents.length === 0,
      missingConsents,
      expiredConsents,
      validConsents,
    };
  }

  /**
   * Gera relatório de conformidade LGPD
   */
  async generateComplianceReport(startDate: Date, endDate: Date): Promise<{
    totalUsers: number;
    compliantUsers: number;
    nonCompliantUsers: number;
    lgpdRequests: {
      total: number;
      byType: Record<string, number>;
      pendingOverdue: number;
    };
    dataBreaches: number;
    auditSummary: {
      totalLogs: number;
      highRiskActivities: number;
      failedOperations: number;
    };
  }> {
    const [
      totalUsers,
      lgpdRequests,
      auditLogs,
      complianceStatus
    ] = await Promise.all([
      storage.getTotalUsersCount(),
      storage.getLgpdRequestsInPeriod(startDate, endDate),
      storage.getAuditLogsInPeriod(startDate, endDate),
      storage.getUsersComplianceStatus(),
    ]);

    const lgpdRequestsByType = lgpdRequests.reduce((acc: Record<string, number>, req: any) => {
      acc[req.requestType] = (acc[req.requestType] || 0) + 1;
      return acc;
    }, {});

    const pendingOverdue = lgpdRequests.filter((req: any) => 
      req.status === "pending" && req.dueDate < new Date()
    ).length;

    const highRiskActivities = auditLogs.filter((log: any) => 
      log.riskLevel === "high" || log.riskLevel === "critical"
    ).length;

    const failedOperations = auditLogs.filter((log: any) => 
      log.result === "failure"
    ).length;

    const dataBreaches = auditLogs.filter((log: any) => 
      log.action.includes("BREACH") || log.action.includes("UNAUTHORIZED")
    ).length;

    return {
      totalUsers,
      compliantUsers: complianceStatus.compliant,
      nonCompliantUsers: complianceStatus.nonCompliant,
      lgpdRequests: {
        total: lgpdRequests.length,
        byType: lgpdRequestsByType,
        pendingOverdue,
      },
      dataBreaches,
      auditSummary: {
        totalLogs: auditLogs.length,
        highRiskActivities,
        failedOperations,
      },
    };
  }

  /**
   * Agenda limpeza automática de dados
   */
  async scheduleDataCleanup(): Promise<void> {
    try {
      // Deletar logs de auditoria antigos
      await storage.deleteOldAuditLogs(SECURITY_CONSTANTS.AUDIT_LOG_RETENTION_DAYS);

      // Revogar tokens expirados
      await storage.revokeExpiredTokens();

      // Notificar sobre consentimentos próximos do vencimento
      await storage.notifyExpiringConsents(30); // 30 dias antes do vencimento

      // Log da limpeza
      await storage.createAuditLog({
        action: "AUTOMATIC_DATA_CLEANUP",
        resourceType: "system",
        details: {
          auditLogRetentionDays: SECURITY_CONSTANTS.AUDIT_LOG_RETENTION_DAYS,
          cleanupDate: new Date().toISOString(),
        },
        result: "success",
        riskLevel: "low",
      });

    } catch (error) {
      await storage.createAuditLog({
        action: "DATA_CLEANUP_FAILED",
        resourceType: "system",
        details: { error: error instanceof Error ? error.message : "Unknown error" },
        result: "failure",
        riskLevel: "medium",
      });

      throw error;
    }
  }
}

// Instância singleton
export const lgpdManager = new LGPDComplianceManager();

// Middleware para verificar consentimentos LGPD
export async function checkLGPDConsent(
  userId: string,
  requiredConsentTypes: string[]
): Promise<{ hasConsent: boolean; missingConsents: string[] }> {
  const compliance = await lgpdManager.checkConsentCompliance(userId);
  
  const missingRequiredConsents = requiredConsentTypes.filter(
    required => !compliance.validConsents.includes(required)
  );

  return {
    hasConsent: missingRequiredConsents.length === 0,
    missingConsents: missingRequiredConsents,
  };
}

// Templates de consentimento LGPD
export const LGPD_CONSENT_TEMPLATES = {
  data_processing: {
    title: "Consentimento para Processamento de Dados Pessoais",
    description: "Concordo com o processamento dos meus dados pessoais para finalidades relacionadas ao atendimento médico e funcionamento da plataforma TeleMed.",
    purpose: "Operação da plataforma de telemedicina, agendamento de consultas, e comunicação com profissionais de saúde.",
    legalBasis: "consent" as const,
    required: true,
  },
  medical_data: {
    title: "Consentimento para Processamento de Dados de Saúde",
    description: "Autorizo o processamento dos meus dados de saúde para finalidades de atendimento médico, diagnóstico e prescrição.",
    purpose: "Prestação de serviços médicos, elaboração de diagnósticos, prescrições e acompanhamento da saúde.",
    legalBasis: "consent" as const,
    required: true,
  },
  communication: {
    title: "Consentimento para Comunicações",
    description: "Concordo em receber comunicações relacionadas aos meus atendimentos, lembretes de consultas e informações importantes da plataforma.",
    purpose: "Comunicação sobre consultas, resultados de exames, lembretes e informações relevantes para o atendimento.",
    legalBasis: "legitimate_interest" as const,
    required: false,
  },
  analytics: {
    title: "Consentimento para Análise de Dados",
    description: "Autorizo o uso dos meus dados para análises estatísticas e melhoria dos serviços, de forma anonimizada.",
    purpose: "Melhoria dos serviços da plataforma através de análises estatísticas anonimizadas.",
    legalBasis: "consent" as const,
    required: false,
  },
  marketing: {
    title: "Consentimento para Marketing",
    description: "Concordo em receber comunicações promocionais e ofertas de novos serviços da TeleMed.",
    purpose: "Envio de ofertas, promoções e informações sobre novos serviços da plataforma.",
    legalBasis: "consent" as const,
    required: false,
  },
} as const;