import crypto from "crypto";
import { storage } from "../storage";

// Configurações de criptografia
const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;  // 128 bits
const SALT_LENGTH = 64; // 512 bits
const TAG_LENGTH = 16;  // 128 bits

// Classe para gerenciamento de criptografia de dados médicos
export class MedicalDataEncryption {
  private masterKey: Buffer;
  private currentKeyVersion: number = 1;

  constructor() {
    // Em produção, esta chave deve vir de um gerenciador de chaves seguro (AWS KMS, Azure Key Vault, etc.)
    const masterKeyString = process.env.MEDICAL_ENCRYPTION_KEY || "telemed-master-key-development-only-change-in-production";
    this.masterKey = crypto.scryptSync(masterKeyString, "salt", KEY_LENGTH);
  }

  /**
   * Gera uma chave derivada para criptografia específica
   */
  private deriveKey(salt: Buffer, keyVersion: number = this.currentKeyVersion): Buffer {
    const info = `telemed-v${keyVersion}`;
    return crypto.hkdfSync("sha256", this.masterKey, salt, Buffer.from(info), KEY_LENGTH);
  }

  /**
   * Criptografa dados sensíveis
   */
  async encrypt(data: string, entityType: string, entityId: string): Promise<{
    encryptedValue: string;
    keyVersion: number;
    checksum: string;
  }> {
    try {
      if (!data || data.trim() === "") {
        throw new Error("Data cannot be empty");
      }

      // Gerar salt e IV únicos
      const salt = crypto.randomBytes(SALT_LENGTH);
      const iv = crypto.randomBytes(IV_LENGTH);
      
      // Derivar chave específica
      const derivedKey = this.deriveKey(salt, this.currentKeyVersion);
      
      // Criar cipher
      const cipher = crypto.createCipherGCM(ALGORITHM, derivedKey, iv);
      
      // Criptografar dados
      let encrypted = cipher.update(data, "utf8", "hex");
      encrypted += cipher.final("hex");
      
      // Obter tag de autenticação
      const authTag = cipher.getAuthTag();
      
      // Combinar todos os componentes
      const combined = Buffer.concat([
        salt,
        iv,
        authTag,
        Buffer.from(encrypted, "hex")
      ]);
      
      const encryptedValue = combined.toString("base64");
      
      // Gerar checksum para verificação de integridade
      const checksum = crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");

      // Log da operação
      await this.logEncryptionOperation(entityType, entityId, "encrypt", true);

      return {
        encryptedValue,
        keyVersion: this.currentKeyVersion,
        checksum,
      };
    } catch (error) {
      await this.logEncryptionOperation(entityType, entityId, "encrypt", false, error as Error);
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Descriptografa dados sensíveis
   */
  async decrypt(encryptedData: {
    encryptedValue: string;
    keyVersion: number;
    checksum: string;
  }, entityType: string, entityId: string): Promise<string> {
    try {
      const { encryptedValue, keyVersion, checksum } = encryptedData;
      
      // Decodificar dados
      const combined = Buffer.from(encryptedValue, "base64");
      
      // Extrair componentes
      const salt = combined.subarray(0, SALT_LENGTH);
      const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
      const authTag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
      const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
      
      // Derivar chave específica da versão
      const derivedKey = this.deriveKey(salt, keyVersion);
      
      // Criar decipher
      const decipher = crypto.createDecipherGCM(ALGORITHM, derivedKey, iv);
      decipher.setAuthTag(authTag);
      
      // Descriptografar dados
      let decrypted = decipher.update(encrypted, undefined, "utf8");
      decrypted += decipher.final("utf8");
      
      // Verificar integridade
      const dataChecksum = crypto
        .createHash("sha256")
        .update(decrypted)
        .digest("hex");
      
      if (dataChecksum !== checksum) {
        throw new Error("Data integrity verification failed");
      }

      // Log da operação
      await this.logEncryptionOperation(entityType, entityId, "decrypt", true);

      return decrypted;
    } catch (error) {
      await this.logEncryptionOperation(entityType, entityId, "decrypt", false, error as Error);
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Rotaciona chaves de criptografia
   */
  async rotateKeys(): Promise<void> {
    try {
      this.currentKeyVersion += 1;
      
      // Log da rotação
      await storage.createAuditLog({
        action: "KEY_ROTATION",
        resourceType: "encryption_keys",
        details: { 
          oldVersion: this.currentKeyVersion - 1,
          newVersion: this.currentKeyVersion,
          timestamp: new Date().toISOString()
        },
        result: "success",
        riskLevel: "high",
      });

      console.log(`Keys rotated to version ${this.currentKeyVersion}`);
    } catch (error) {
      console.error("Key rotation failed:", error);
      throw error;
    }
  }

  /**
   * Verifica se dados precisam ser re-criptografados devido à rotação de chaves
   */
  needsReEncryption(keyVersion: number): boolean {
    const daysSinceVersion = (this.currentKeyVersion - keyVersion) * 90; // Assumindo rotação a cada 90 dias
    return daysSinceVersion > 90;
  }

  /**
   * Log de operações de criptografia para auditoria
   */
  private async logEncryptionOperation(
    entityType: string,
    entityId: string,
    operation: "encrypt" | "decrypt",
    success: boolean,
    error?: Error
  ): Promise<void> {
    try {
      await storage.createAuditLog({
        action: `DATA_${operation.toUpperCase()}`,
        resourceType: entityType,
        resourceId: entityId,
        details: {
          operation,
          algorithm: ALGORITHM,
          keyVersion: this.currentKeyVersion,
          error: error?.message,
          timestamp: new Date().toISOString()
        },
        result: success ? "success" : "failure",
        riskLevel: "medium",
      });
    } catch (logError) {
      console.error("Failed to log encryption operation:", logError);
    }
  }
}

// Instância singleton
export const medicalEncryption = new MedicalDataEncryption();

// Utility functions para campos específicos
export async function encryptSensitiveField(
  value: string,
  fieldName: string,
  entityType: string,
  entityId: string
): Promise<{ encryptedValue: string; keyVersion: number; checksum: string }> {
  if (!value || value.trim() === "") {
    return { encryptedValue: "", keyVersion: 1, checksum: "" };
  }

  return medicalEncryption.encrypt(value, `${entityType}.${fieldName}`, entityId);
}

export async function decryptSensitiveField(
  encryptedData: { encryptedValue: string; keyVersion: number; checksum: string },
  fieldName: string,
  entityType: string,
  entityId: string
): Promise<string> {
  if (!encryptedData.encryptedValue) {
    return "";
  }

  return medicalEncryption.decrypt(encryptedData, `${entityType}.${fieldName}`, entityId);
}

// Função para validar configuração de segurança
export function validateSecurityConfig(): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Verificar chave master
  const masterKey = process.env.MEDICAL_ENCRYPTION_KEY;
  if (!masterKey) {
    errors.push("MEDICAL_ENCRYPTION_KEY environment variable is required");
  } else if (masterKey === "telemed-master-key-development-only-change-in-production") {
    warnings.push("Using default encryption key - change in production");
  } else if (masterKey.length < 32) {
    warnings.push("Encryption key should be at least 32 characters long");
  }

  // Verificar JWT secret
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    warnings.push("JWT_SECRET not set, using default");
  } else if (jwtSecret.length < 32) {
    warnings.push("JWT_SECRET should be at least 32 characters long");
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}