import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockApiSuccess, mockApiError } from '../../setup';

const BASE_URL = 'http://localhost:5000';

describe('Consultations API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/consultations/start', () => {
    it('deve iniciar nova consulta', async () => {
      const consultation = {
        appointmentId: 1,
        patientId: 'patient-123',
        doctorId: 'doctor-456',
        type: 'video',
        roomId: 'room-abc123'
      };

      const mockResponse = {
        id: 'consultation-789',
        ...consultation,
        status: 'active',
        startedAt: '2025-07-17T20:49:21.399Z'
      };

      mockApiSuccess(mockResponse);

      const response = await fetch(`${BASE_URL}/api/consultations/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultation)
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.status).toBe('active');
      expect(data.roomId).toBe('room-abc123');
      expect(data.type).toBe('video');
    });

    it('deve validar dados da consulta', async () => {
      const invalidConsultation = {
        patientId: '',
        // Faltando campos obrigatórios
      };

      mockApiError(400, 'PatientId e DoctorId são obrigatórios');

      const response = await fetch(`${BASE_URL}/api/consultations/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidConsultation)
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(data.error).toBe('PatientId e DoctorId são obrigatórios');
    });
  });

  describe('GET /api/consultations/:id', () => {
    it('deve retornar detalhes da consulta', async () => {
      const mockConsultation = {
        id: 'consultation-789',
        appointmentId: 1,
        patientId: 'patient-123',
        doctorId: 'doctor-456',
        type: 'video',
        status: 'active',
        roomId: 'room-abc123',
        startedAt: '2025-07-17T20:49:21.399Z',
        notes: [],
        prescriptions: []
      };

      mockApiSuccess(mockConsultation);

      const response = await fetch(`${BASE_URL}/api/consultations/consultation-789`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.id).toBe('consultation-789');
      expect(data.status).toBe('active');
      expect(data.roomId).toBe('room-abc123');
    });
  });

  describe('POST /api/consultations/:id/notes', () => {
    it('deve adicionar anotações à consulta', async () => {
      const notes = {
        symptoms: 'Dor de cabeça persistente',
        diagnosis: 'Enxaqueca',
        treatment: 'Repouso e hidratação',
        followUp: 'Retorno em 7 dias se persistir'
      };

      const mockResponse = {
        id: 'note-456',
        consultationId: 'consultation-789',
        ...notes,
        createdAt: '2025-07-17T20:49:21.399Z'
      };

      mockApiSuccess(mockResponse);

      const response = await fetch(`${BASE_URL}/api/consultations/consultation-789/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notes)
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.symptoms).toBe('Dor de cabeça persistente');
      expect(data.diagnosis).toBe('Enxaqueca');
      expect(data.consultationId).toBe('consultation-789');
    });
  });

  describe('POST /api/consultations/:id/prescriptions', () => {
    it('deve criar prescrição durante consulta', async () => {
      const prescription = {
        medications: [
          {
            name: 'Paracetamol 500mg',
            dosage: '1 comprimido a cada 6 horas',
            duration: '3 dias',
            instructions: 'Tomar com água, preferencialmente após as refeições'
          }
        ],
        patientId: 'patient-123',
        doctorId: 'doctor-456'
      };

      const mockResponse = {
        id: 'prescription-123',
        consultationId: 'consultation-789',
        ...prescription,
        status: 'active',
        createdAt: '2025-07-17T20:49:21.399Z'
      };

      mockApiSuccess(mockResponse);

      const response = await fetch(`${BASE_URL}/api/consultations/consultation-789/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescription)
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.medications).toHaveLength(1);
      expect(data.medications[0].name).toBe('Paracetamol 500mg');
      expect(data.status).toBe('active');
    });
  });

  describe('PUT /api/consultations/:id/finish', () => {
    it('deve finalizar consulta', async () => {
      const consultationSummary = {
        duration: 25, // minutos
        summary: 'Consulta finalizada com sucesso',
        nextAppointment: '2025-07-25T14:00:00Z'
      };

      const mockResponse = {
        id: 'consultation-789',
        status: 'completed',
        finishedAt: '2025-07-17T21:14:21.399Z',
        ...consultationSummary
      };

      mockApiSuccess(mockResponse);

      const response = await fetch(`${BASE_URL}/api/consultations/consultation-789/finish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultationSummary)
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.status).toBe('completed');
      expect(data.duration).toBe(25);
      expect(data.finishedAt).toBeDefined();
    });
  });

  describe('GET /api/consultations/doctor/:doctorId', () => {
    it('deve retornar consultas do médico', async () => {
      const mockConsultations = [
        {
          id: 'consultation-789',
          patientName: 'Carlos Mendes',
          type: 'video',
          status: 'active',
          startedAt: '2025-07-17T20:49:21.399Z'
        },
        {
          id: 'consultation-456',
          patientName: 'Lucia Fernandes',
          type: 'presencial',
          status: 'completed',
          startedAt: '2025-07-17T19:30:00.000Z',
          finishedAt: '2025-07-17T20:00:00.000Z'
        }
      ];

      mockApiSuccess(mockConsultations);

      const response = await fetch(`${BASE_URL}/api/consultations/doctor/doctor-456`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0].status).toBe('active');
      expect(data[1].status).toBe('completed');
    });
  });

  describe('WebRTC Video Consultation', () => {
    it('deve gerar token de acesso para sala de vídeo', async () => {
      const mockToken = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        roomId: 'room-abc123',
        userId: 'doctor-456',
        expiresAt: '2025-07-17T22:49:21.399Z'
      };

      mockApiSuccess(mockToken);

      const response = await fetch(`${BASE_URL}/api/consultations/consultation-789/video-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'doctor-456', role: 'doctor' })
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.token).toBeDefined();
      expect(data.roomId).toBe('room-abc123');
      expect(data.userId).toBe('doctor-456');
    });
  });
});