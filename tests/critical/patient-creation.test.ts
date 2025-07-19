import { describe, it, expect, beforeEach } from 'vitest';
import { apiRequest } from '../../lib/queryClient';

describe('Critical: Patient Creation', () => {
  const testPatient = {
    name: 'João Silva',
    email: 'joao.test@email.com',
    phone: '+5511999999999',
    cpf: '12345678901',
    birthDate: '1990-01-15',
    gender: 'M',
    address: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    }
  };

  beforeEach(async () => {
    // Clean up test patient if exists
    try {
      await apiRequest('/api/patients/cleanup-test', {
        method: 'DELETE',
        body: JSON.stringify({ email: testPatient.email })
      });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should create a new patient successfully', async () => {
    const response = await apiRequest('/api/patients', {
      method: 'POST',
      body: JSON.stringify(testPatient)
    });

    expect(response.success).toBe(true);
    expect(response.data.email).toBe(testPatient.email);
    expect(response.data.name).toBe(testPatient.name);
    expect(response.data.id).toBeDefined();
  });

  it('should validate required fields', async () => {
    const invalidPatient = { name: 'Test' }; // Missing required fields

    try {
      await apiRequest('/api/patients', {
        method: 'POST',
        body: JSON.stringify(invalidPatient)
      });
      expect.fail('Should have thrown validation error');
    } catch (error) {
      expect(error.message).toContain('validation');
    }
  });

  it('should prevent duplicate email registration', async () => {
    // First creation
    await apiRequest('/api/patients', {
      method: 'POST',
      body: JSON.stringify(testPatient)
    });

    // Attempt duplicate
    try {
      await apiRequest('/api/patients', {
        method: 'POST',
        body: JSON.stringify(testPatient)
      });
      expect.fail('Should have thrown duplicate error');
    } catch (error) {
      expect(error.message).toContain('already exists');
    }
  });

  it('should validate CPF format', async () => {
    const invalidCpfPatient = {
      ...testPatient,
      cpf: '123' // Invalid CPF
    };

    try {
      await apiRequest('/api/patients', {
        method: 'POST',
        body: JSON.stringify(invalidCpfPatient)
      });
      expect.fail('Should have thrown CPF validation error');
    } catch (error) {
      expect(error.message).toContain('CPF');
    }
  });
});