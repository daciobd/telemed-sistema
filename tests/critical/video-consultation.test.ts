import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiRequest } from '../../lib/queryClient';

// Mock WebRTC APIs
global.RTCPeerConnection = vi.fn(() => ({
  createOffer: vi.fn().mockResolvedValue({ type: 'offer', sdp: 'mock-sdp' }),
  createAnswer: vi.fn().mockResolvedValue({ type: 'answer', sdp: 'mock-sdp' }),
  setLocalDescription: vi.fn().mockResolvedValue(undefined),
  setRemoteDescription: vi.fn().mockResolvedValue(undefined),
  addIceCandidate: vi.fn().mockResolvedValue(undefined),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}));

global.navigator.mediaDevices = {
  getUserMedia: vi.fn().mockResolvedValue({
    getTracks: vi.fn().mockReturnValue([
      { kind: 'video', stop: vi.fn() },
      { kind: 'audio', stop: vi.fn() }
    ])
  })
};

describe('Critical: Video Consultation', () => {
  let appointmentId: string;

  beforeEach(async () => {
    // Create a scheduled appointment for testing
    const appointmentResponse = await apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        patientId: 'test-patient-id',
        doctorId: 'test-doctor-id',
        scheduledFor: new Date(Date.now() + 60000).toISOString(), // 1 minute from now
        status: 'confirmed',
        consultationType: 'video'
      })
    });
    appointmentId = appointmentResponse.data.id;
  });

  it('should initialize video consultation successfully', async () => {
    const response = await apiRequest(`/api/consultations/${appointmentId}/start`, {
      method: 'POST',
      body: JSON.stringify({
        initiatedBy: 'doctor'
      })
    });

    expect(response.success).toBe(true);
    expect(response.data.status).toBe('in_progress');
    expect(response.data.roomId).toBeDefined();
    expect(response.data.startTime).toBeDefined();
  });

  it('should handle WebRTC connection establishment', async () => {
    // Start consultation
    const consultationResponse = await apiRequest(`/api/consultations/${appointmentId}/start`, {
      method: 'POST',
      body: JSON.stringify({ initiatedBy: 'doctor' })
    });

    const roomId = consultationResponse.data.roomId;

    // Test WebRTC offer/answer exchange
    const offerResponse = await apiRequest(`/api/consultations/${roomId}/offer`, {
      method: 'POST',
      body: JSON.stringify({
        sdp: 'mock-offer-sdp',
        type: 'offer',
        participantId: 'doctor-123'
      })
    });

    expect(offerResponse.success).toBe(true);

    const answerResponse = await apiRequest(`/api/consultations/${roomId}/answer`, {
      method: 'POST',
      body: JSON.stringify({
        sdp: 'mock-answer-sdp',
        type: 'answer',
        participantId: 'patient-456'
      })
    });

    expect(answerResponse.success).toBe(true);
  });

  it('should record consultation notes during session', async () => {
    // Start consultation
    const consultationResponse = await apiRequest(`/api/consultations/${appointmentId}/start`, {
      method: 'POST',
      body: JSON.stringify({ initiatedBy: 'doctor' })
    });

    const consultationId = consultationResponse.data.id;

    // Add medical notes
    const notesResponse = await apiRequest(`/api/consultations/${consultationId}/notes`, {
      method: 'POST',
      body: JSON.stringify({
        notes: 'Patient apresenta sintomas de gripe. Temperatura normal.',
        symptoms: ['dor de cabeça', 'congestão nasal'],
        diagnosis: 'Resfriado comum',
        recommendations: ['Repouso', 'Hidratação', 'Paracetamol se necessário']
      })
    });

    expect(notesResponse.success).toBe(true);
    expect(notesResponse.data.notes).toContain('gripe');
  });

  it('should end consultation with summary', async () => {
    // Start consultation
    const consultationResponse = await apiRequest(`/api/consultations/${appointmentId}/start`, {
      method: 'POST'
    });

    const consultationId = consultationResponse.data.id;

    // End consultation
    const endResponse = await apiRequest(`/api/consultations/${consultationId}/end`, {
      method: 'POST',
      body: JSON.stringify({
        endedBy: 'doctor',
        duration: 1800, // 30 minutes
        summary: 'Consulta concluída com sucesso. Paciente orientado.',
        followUpRequired: false,
        nextAppointment: null
      })
    });

    expect(endResponse.success).toBe(true);
    expect(endResponse.data.status).toBe('completed');
    expect(endResponse.data.endTime).toBeDefined();
    expect(endResponse.data.duration).toBe(1800);
  });

  it('should handle consultation interruptions', async () => {
    const consultationResponse = await apiRequest(`/api/consultations/${appointmentId}/start`, {
      method: 'POST'
    });

    const consultationId = consultationResponse.data.id;

    // Simulate connection interruption
    const interruptResponse = await apiRequest(`/api/consultations/${consultationId}/interrupt`, {
      method: 'POST',
      body: JSON.stringify({
        reason: 'Connection lost',
        participantId: 'patient-456'
      })
    });

    expect(interruptResponse.success).toBe(true);
    expect(interruptResponse.data.status).toBe('interrupted');
  });

  it('should validate consultation permissions', async () => {
    try {
      // Try to start consultation without proper role
      await apiRequest(`/api/consultations/${appointmentId}/start`, {
        method: 'POST',
        body: JSON.stringify({
          initiatedBy: 'unauthorized-user'
        })
      });
      expect.fail('Should have thrown authorization error');
    } catch (error) {
      expect(error.message).toContain('unauthorized');
    }
  });
});