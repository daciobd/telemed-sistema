import { describe, it, expect } from 'vitest';
import { apiRequest } from '../../lib/queryClient';

describe('Critical: Complete Doctor-Patient Flow', () => {
  let patientId: string;
  let doctorId: string;
  let appointmentId: string;
  let consultationId: string;

  const testData = {
    patient: {
      name: 'Maria Santos',
      email: 'maria.flow@test.com',
      phone: '+5511123456789',
      cpf: '98765432100',
      birthDate: '1985-03-20',
      gender: 'F'
    },
    doctor: {
      name: 'Dr. Carlos Oliveira',
      email: 'carlos.flow@test.com',
      phone: '+5511987654321',
      crm: 'CRM/SP 987654',
      specialty: 'cardiologia',
      consultationFee: 200
    },
    appointment: {
      symptoms: 'Dor no peito e falta de ar durante exercícios',
      urgency: 'high',
      preferredDate: '2025-07-26',
      preferredTime: '10:00',
      maxBudget: 250,
      consultationType: 'video',
      specialtyPreference: 'cardiologia'
    }
  };

  it('should complete full medical flow: patient → appointment → consultation', async () => {
    // 1. PATIENT REGISTRATION
    console.log('🔄 Step 1: Creating patient...');
    const patientResponse = await apiRequest('/api/patients', {
      method: 'POST',
      body: JSON.stringify(testData.patient)
    });

    expect(patientResponse.success).toBe(true);
    expect(patientResponse.data.email).toBe(testData.patient.email);
    patientId = patientResponse.data.id;
    console.log('✅ Patient created:', patientId);

    // 2. DOCTOR REGISTRATION
    console.log('🔄 Step 2: Creating doctor...');
    const doctorResponse = await apiRequest('/api/doctors', {
      method: 'POST',
      body: JSON.stringify(testData.doctor)
    });

    expect(doctorResponse.success).toBe(true);
    expect(doctorResponse.data.crm).toBe(testData.doctor.crm);
    doctorId = doctorResponse.data.id;
    console.log('✅ Doctor created:', doctorId);

    // 3. APPOINTMENT BOOKING
    console.log('🔄 Step 3: Booking appointment...');
    const appointmentResponse = await apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        ...testData.appointment,
        patientId: patientId
      })
    });

    expect(appointmentResponse.success).toBe(true);
    expect(appointmentResponse.data.patientId).toBe(patientId);
    expect(appointmentResponse.data.status).toBe('pending');
    appointmentId = appointmentResponse.data.id;
    console.log('✅ Appointment booked:', appointmentId);

    // 4. DOCTOR ACCEPTS APPOINTMENT
    console.log('🔄 Step 4: Doctor accepting appointment...');
    const acceptResponse = await apiRequest(`/api/appointments/${appointmentId}/accept`, {
      method: 'POST',
      body: JSON.stringify({
        doctorId: doctorId,
        proposedFee: 180,
        confirmedSlot: '2025-07-26T10:00:00Z'
      })
    });

    expect(acceptResponse.success).toBe(true);
    expect(acceptResponse.data.doctorId).toBe(doctorId);
    expect(acceptResponse.data.status).toBe('confirmed');
    console.log('✅ Appointment confirmed by doctor');

    // 5. PATIENT CONFIRMS APPOINTMENT
    console.log('🔄 Step 5: Patient confirming appointment...');
    const confirmResponse = await apiRequest(`/api/appointments/${appointmentId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({
        patientId: patientId,
        agreedFee: 180,
        paymentMethod: 'credit_card'
      })
    });

    expect(confirmResponse.success).toBe(true);
    expect(confirmResponse.data.status).toBe('confirmed');
    console.log('✅ Appointment confirmed by patient');

    // 6. START VIDEO CONSULTATION
    console.log('🔄 Step 6: Starting video consultation...');
    const consultationResponse = await apiRequest(`/api/consultations/${appointmentId}/start`, {
      method: 'POST',
      body: JSON.stringify({
        initiatedBy: 'doctor',
        consultationType: 'video'
      })
    });

    expect(consultationResponse.success).toBe(true);
    expect(consultationResponse.data.status).toBe('in_progress');
    expect(consultationResponse.data.roomId).toBeDefined();
    consultationId = consultationResponse.data.id;
    console.log('✅ Video consultation started:', consultationId);

    // 7. ADD MEDICAL NOTES DURING CONSULTATION
    console.log('🔄 Step 7: Adding medical notes...');
    const notesResponse = await apiRequest(`/api/consultations/${consultationId}/notes`, {
      method: 'POST',
      body: JSON.stringify({
        notes: 'Paciente relata dor precordial aos esforços. Ausculta cardíaca normal. PA: 130/80 mmHg. Recomendado ECG e ecocardiograma.',
        symptoms: ['dor precordial', 'dispneia ao esforço'],
        vitalSigns: {
          bloodPressure: '130/80',
          heartRate: '72',
          temperature: '36.5'
        },
        preliminaryDiagnosis: 'Dor torácica atípica - investigação cardiológica',
        recommendations: [
          'ECG de repouso',
          'Ecocardiograma',
          'Teste ergométrico',
          'Retorno em 7 dias'
        ]
      })
    });

    expect(notesResponse.success).toBe(true);
    expect(notesResponse.data.notes).toContain('precordial');
    console.log('✅ Medical notes added');

    // 8. CREATE DIGITAL PRESCRIPTION
    console.log('🔄 Step 8: Creating prescription...');
    const prescriptionResponse = await apiRequest(`/api/consultations/${consultationId}/prescription`, {
      method: 'POST',
      body: JSON.stringify({
        medications: [
          {
            name: 'Ácido acetilsalicílico',
            dosage: '100mg',
            frequency: '1x ao dia',
            duration: '30 dias',
            instructions: 'Tomar pela manhã, após o café'
          }
        ],
        generalInstructions: 'Evitar esforços intensos até reavaliação. Procurar pronto-socorro em caso de dor intensa.',
        validUntil: '2025-08-26'
      })
    });

    expect(prescriptionResponse.success).toBe(true);
    expect(prescriptionResponse.data.medications).toHaveLength(1);
    console.log('✅ Prescription created');

    // 9. END CONSULTATION
    console.log('🔄 Step 9: Ending consultation...');
    const endResponse = await apiRequest(`/api/consultations/${consultationId}/end`, {
      method: 'POST',
      body: JSON.stringify({
        endedBy: 'doctor',
        duration: 2100, // 35 minutes
        summary: 'Consulta cardiológica completa. Exames solicitados para investigação. Paciente orientado sobre sintomas de alerta.',
        followUpRequired: true,
        nextAppointmentSuggested: '2025-08-02',
        consultationRating: {
          doctorRating: 5,
          platformRating: 5,
          comments: 'Excelente atendimento, médico muito atencioso'
        }
      })
    });

    expect(endResponse.success).toBe(true);
    expect(endResponse.data.status).toBe('completed');
    expect(endResponse.data.duration).toBe(2100);
    console.log('✅ Consultation completed successfully');

    // 10. VERIFY COMPLETE MEDICAL RECORD
    console.log('🔄 Step 10: Verifying medical record...');
    const recordResponse = await apiRequest(`/api/patients/${patientId}/medical-record`);

    expect(recordResponse.success).toBe(true);
    expect(recordResponse.data.consultations).toHaveLength(1);
    expect(recordResponse.data.prescriptions).toHaveLength(1);
    expect(recordResponse.data.appointments).toHaveLength(1);
    console.log('✅ Complete medical record verified');

    // 11. CLEANUP TEST DATA
    console.log('🔄 Step 11: Cleaning up test data...');
    await Promise.all([
      apiRequest(`/api/appointments/${appointmentId}`, { method: 'DELETE' }),
      apiRequest(`/api/patients/${patientId}`, { method: 'DELETE' }),
      apiRequest(`/api/doctors/${doctorId}`, { method: 'DELETE' })
    ]);
    console.log('✅ Cleanup completed');

    console.log('🎉 COMPLETE FLOW TEST PASSED - All 11 steps executed successfully!');
  });

  it('should handle flow interruptions gracefully', async () => {
    // Create minimal test data
    const quickPatient = await apiRequest('/api/patients', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Interrupt',
        email: 'interrupt@test.com',
        phone: '+5511999999999'
      })
    });

    const quickDoctor = await apiRequest('/api/doctors', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Dr. Test',
        email: 'doctor.interrupt@test.com',
        crm: 'CRM/SP 999999'
      })
    });

    // Test appointment cancellation flow
    const appointment = await apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        patientId: quickPatient.data.id,
        symptoms: 'Test symptoms',
        urgency: 'low'
      })
    });

    const cancelResponse = await apiRequest(`/api/appointments/${appointment.data.id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({
        reason: 'Patient emergency',
        cancelledBy: 'patient'
      })
    });

    expect(cancelResponse.success).toBe(true);
    expect(cancelResponse.data.status).toBe('cancelled');

    // Cleanup
    await Promise.all([
      apiRequest(`/api/patients/${quickPatient.data.id}`, { method: 'DELETE' }),
      apiRequest(`/api/doctors/${quickDoctor.data.id}`, { method: 'DELETE' })
    ]);
  });
});