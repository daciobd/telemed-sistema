import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { apiRequest } from '../../lib/queryClient';

describe('Critical: Appointment Booking', () => {
  let testPatientId: string;
  let testDoctorId: string;
  let testAppointmentId: string;

  const appointmentData = {
    symptoms: 'Dor de cabeça persistente há 3 dias',
    urgency: 'medium',
    preferredDate: '2025-07-25',
    preferredTime: '14:00',
    maxBudget: 150,
    consultationType: 'video',
    specialtyPreference: 'clinico-geral'
  };

  beforeEach(async () => {
    // Create test patient
    const patientResponse = await apiRequest('/api/patients', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Patient',
        email: 'patient.test@email.com',
        phone: '+5511888888888',
        cpf: '11111111111'
      })
    });
    testPatientId = patientResponse.data.id;

    // Create test doctor
    const doctorResponse = await apiRequest('/api/doctors', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Dr. Test Silva',
        email: 'doctor.test@email.com',
        phone: '+5511777777777',
        crm: 'CRM/SP 123456',
        specialty: 'clinico-geral',
        consultationFee: 120
      })
    });
    testDoctorId = doctorResponse.data.id;
  });

  afterEach(async () => {
    // Cleanup created data
    if (testAppointmentId) {
      await apiRequest(`/api/appointments/${testAppointmentId}`, {
        method: 'DELETE'
      });
    }
    if (testPatientId) {
      await apiRequest(`/api/patients/${testPatientId}`, {
        method: 'DELETE'
      });
    }
    if (testDoctorId) {
      await apiRequest(`/api/doctors/${testDoctorId}`, {
        method: 'DELETE'
      });
    }
  });

  it('should create appointment booking successfully', async () => {
    const response = await apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        ...appointmentData,
        patientId: testPatientId
      })
    });

    expect(response.success).toBe(true);
    expect(response.data.patientId).toBe(testPatientId);
    expect(response.data.symptoms).toBe(appointmentData.symptoms);
    expect(response.data.status).toBe('pending');
    
    testAppointmentId = response.data.id;
  });

  it('should allow doctor to accept appointment', async () => {
    // Create appointment
    const appointmentResponse = await apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        ...appointmentData,
        patientId: testPatientId
      })
    });
    testAppointmentId = appointmentResponse.data.id;

    // Doctor accepts with bid
    const acceptResponse = await apiRequest(`/api/appointments/${testAppointmentId}/accept`, {
      method: 'POST',
      body: JSON.stringify({
        doctorId: testDoctorId,
        proposedFee: 130,
        availableSlots: ['2025-07-25T14:00:00Z', '2025-07-25T15:00:00Z']
      })
    });

    expect(acceptResponse.success).toBe(true);
    expect(acceptResponse.data.doctorId).toBe(testDoctorId);
    expect(acceptResponse.data.status).toBe('doctor_assigned');
    expect(acceptResponse.data.proposedFee).toBe(130);
  });

  it('should validate appointment time conflicts', async () => {
    // Create first appointment
    const firstAppointment = await apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        ...appointmentData,
        patientId: testPatientId
      })
    });

    // Doctor accepts first appointment
    await apiRequest(`/api/appointments/${firstAppointment.data.id}/accept`, {
      method: 'POST',
      body: JSON.stringify({
        doctorId: testDoctorId,
        proposedFee: 120,
        confirmedSlot: '2025-07-25T14:00:00Z'
      })
    });

    // Try to book same time slot
    try {
      const conflictAppointment = await apiRequest('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({
          ...appointmentData,
          patientId: testPatientId,
          preferredDate: '2025-07-25',
          preferredTime: '14:00'
        })
      });

      await apiRequest(`/api/appointments/${conflictAppointment.data.id}/accept`, {
        method: 'POST',
        body: JSON.stringify({
          doctorId: testDoctorId,
          proposedFee: 120,
          confirmedSlot: '2025-07-25T14:00:00Z'
        })
      });

      expect.fail('Should have thrown time conflict error');
    } catch (error) {
      expect(error.message).toContain('conflict');
    }
  });

  it('should handle appointment cancellation', async () => {
    // Create and accept appointment
    const appointmentResponse = await apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        ...appointmentData,
        patientId: testPatientId
      })
    });
    testAppointmentId = appointmentResponse.data.id;

    // Cancel appointment
    const cancelResponse = await apiRequest(`/api/appointments/${testAppointmentId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({
        reason: 'Patient requested cancellation',
        cancelledBy: 'patient'
      })
    });

    expect(cancelResponse.success).toBe(true);
    expect(cancelResponse.data.status).toBe('cancelled');
    expect(cancelResponse.data.cancellationReason).toBe('Patient requested cancellation');
  });
});