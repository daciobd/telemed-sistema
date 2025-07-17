import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockApiSuccess, mockApiError } from '../../setup';

// Mock das APIs de agendamento
const BASE_URL = 'http://localhost:5000';

describe('Appointments API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/appointments', () => {
    it('deve retornar lista de agendamentos', async () => {
      const mockAppointments = [
        {
          id: 1,
          patient: 'Carlos Mendes',
          doctor: 'Dr. Marcus Silva',
          time: '08:00',
          date: '2025-07-18',
          type: 'Consulta Inicial',
          status: 'confirmado'
        },
        {
          id: 2,
          patient: 'Lucia Fernandes',
          doctor: 'Dr. Marcus Silva',
          time: '09:30',
          date: '2025-07-18',
          type: 'Retorno',
          status: 'confirmado'
        }
      ];

      mockApiSuccess(mockAppointments);

      const response = await fetch(`${BASE_URL}/api/appointments`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0].patient).toBe('Carlos Mendes');
      expect(data[1].type).toBe('Retorno');
    });

    it('deve tratar erro da API de agendamentos', async () => {
      mockApiError(500, 'Erro interno do servidor');

      const response = await fetch(`${BASE_URL}/api/appointments`);
      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
      expect(data.error).toBe('Erro interno do servidor');
    });
  });

  describe('POST /api/appointments', () => {
    it('deve criar novo agendamento', async () => {
      const newAppointment = {
        patient: 'Ana Costa',
        doctor: 'Dr. Marcus Silva',
        time: '14:00',
        date: '2025-07-18',
        type: 'Consulta',
        status: 'agendado'
      };

      const mockResponse = {
        id: 3,
        ...newAppointment,
        createdAt: '2025-07-17T20:49:21.399Z'
      };

      mockApiSuccess(mockResponse);

      const response = await fetch(`${BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment)
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.id).toBe(3);
      expect(data.patient).toBe('Ana Costa');
      expect(data.status).toBe('agendado');
    });

    it('deve validar dados obrigatórios', async () => {
      const invalidAppointment = {
        patient: '',
        time: '14:00'
        // Faltando campos obrigatórios
      };

      mockApiError(400, 'Dados obrigatórios faltando');

      const response = await fetch(`${BASE_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidAppointment)
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(data.error).toBe('Dados obrigatórios faltando');
    });
  });

  describe('PUT /api/appointments/:id', () => {
    it('deve atualizar agendamento existente', async () => {
      const updatedAppointment = {
        id: 1,
        patient: 'Carlos Mendes',
        doctor: 'Dr. Marcus Silva',
        time: '08:30', // Horário alterado
        date: '2025-07-18',
        type: 'Consulta Inicial',
        status: 'confirmado'
      };

      mockApiSuccess(updatedAppointment);

      const response = await fetch(`${BASE_URL}/api/appointments/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: '08:30' })
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.time).toBe('08:30');
      expect(data.id).toBe(1);
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    it('deve cancelar agendamento', async () => {
      mockApiSuccess({ message: 'Agendamento cancelado' });

      const response = await fetch(`${BASE_URL}/api/appointments/1`, {
        method: 'DELETE'
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.message).toBe('Agendamento cancelado');
    });

    it('deve tratar agendamento não encontrado', async () => {
      mockApiError(404, 'Agendamento não encontrado');

      const response = await fetch(`${BASE_URL}/api/appointments/999`, {
        method: 'DELETE'
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(data.error).toBe('Agendamento não encontrado');
    });
  });
});