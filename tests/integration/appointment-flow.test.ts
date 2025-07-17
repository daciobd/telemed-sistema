import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockApiSuccess, mockApiError } from '../setup';

const BASE_URL = 'http://localhost:5000';

describe('Appointment Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve realizar fluxo completo de agendamento → consulta → prescrição', async () => {
    // 1. Criar agendamento
    const newAppointment = {
      patient: 'Ana Costa',
      doctor: 'Dr. Marcus Silva',
      patientId: 'patient-123',
      doctorId: 'doctor-456',
      time: '14:00',
      date: '2025-07-18',
      type: 'Teleconsulta',
      status: 'agendado'
    };

    const appointmentResponse = {
      id: 1,
      ...newAppointment,
      createdAt: '2025-07-17T20:49:21.399Z'
    };

    mockApiSuccess(appointmentResponse);

    // Criar agendamento
    const createResponse = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAppointment)
    });

    const appointmentData = await createResponse.json();
    expect(createResponse.ok).toBe(true);
    expect(appointmentData.id).toBe(1);

    // 2. Iniciar consulta baseada no agendamento
    const consultationStart = {
      appointmentId: appointmentData.id,
      patientId: newAppointment.patientId,
      doctorId: newAppointment.doctorId,
      type: 'video',
      roomId: 'room-' + Date.now()
    };

    const consultationResponse = {
      id: 'consultation-' + appointmentData.id,
      ...consultationStart,
      status: 'active',
      startedAt: '2025-07-17T21:00:00.000Z'
    };

    mockApiSuccess(consultationResponse);

    const startConsultationResponse = await fetch(`${BASE_URL}/api/consultations/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consultationStart)
    });

    const consultationData = await startConsultationResponse.json();
    expect(startConsultationResponse.ok).toBe(true);
    expect(consultationData.status).toBe('active');

    // 3. Adicionar anotações médicas
    const medicalNotes = {
      symptoms: 'Dor de cabeça, náusea',
      diagnosis: 'Enxaqueca tensional',
      treatment: 'Analgésico e repouso',
      followUp: 'Retorno em 7 dias se persistir'
    };

    const notesResponse = {
      id: 'note-123',
      consultationId: consultationData.id,
      ...medicalNotes,
      createdAt: '2025-07-17T21:15:00.000Z'
    };

    mockApiSuccess(notesResponse);

    const addNotesResponse = await fetch(`${BASE_URL}/api/consultations/${consultationData.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicalNotes)
    });

    const notesData = await addNotesResponse.json();
    expect(addNotesResponse.ok).toBe(true);
    expect(notesData.diagnosis).toBe('Enxaqueca tensional');

    // 4. Criar prescrição
    const prescription = {
      medications: [
        {
          name: 'Paracetamol 500mg',
          dosage: '1 comprimido a cada 6 horas',
          duration: '3 dias',
          instructions: 'Tomar com água após as refeições'
        },
        {
          name: 'Dipirona 500mg',
          dosage: '1 comprimido se persistir dor',
          duration: 'Conforme necessário',
          instructions: 'Máximo 4 comprimidos por dia'
        }
      ],
      patientId: newAppointment.patientId,
      doctorId: newAppointment.doctorId
    };

    const prescriptionResponse = {
      id: 'prescription-789',
      consultationId: consultationData.id,
      ...prescription,
      status: 'active',
      createdAt: '2025-07-17T21:20:00.000Z'
    };

    mockApiSuccess(prescriptionResponse);

    const createPrescriptionResponse = await fetch(`${BASE_URL}/api/consultations/${consultationData.id}/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prescription)
    });

    const prescriptionData = await createPrescriptionResponse.json();
    expect(createPrescriptionResponse.ok).toBe(true);
    expect(prescriptionData.medications).toHaveLength(2);

    // 5. Finalizar consulta
    const consultationSummary = {
      duration: 25,
      summary: 'Consulta concluída. Prescrição emitida para tratamento de enxaqueca.',
      nextAppointment: '2025-07-25T14:00:00Z'
    };

    const finishResponse = {
      id: consultationData.id,
      status: 'completed',
      finishedAt: '2025-07-17T21:25:00.000Z',
      ...consultationSummary
    };

    mockApiSuccess(finishResponse);

    const finishConsultationResponse = await fetch(`${BASE_URL}/api/consultations/${consultationData.id}/finish`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consultationSummary)
    });

    const finishData = await finishConsultationResponse.json();
    expect(finishConsultationResponse.ok).toBe(true);
    expect(finishData.status).toBe('completed');
    expect(finishData.duration).toBe(25);

    // 6. Verificar histórico de consultas do médico
    const doctorConsultations = [
      {
        id: consultationData.id,
        patientName: 'Ana Costa',
        type: 'video',
        status: 'completed',
        startedAt: '2025-07-17T21:00:00.000Z',
        finishedAt: '2025-07-17T21:25:00.000Z',
        duration: 25
      }
    ];

    mockApiSuccess(doctorConsultations);

    const historyResponse = await fetch(`${BASE_URL}/api/consultations/doctor/${newAppointment.doctorId}`);
    const historyData = await historyResponse.json();
    
    expect(historyResponse.ok).toBe(true);
    expect(historyData).toHaveLength(1);
    expect(historyData[0].status).toBe('completed');
  });

  it('deve tratar cancelamento de agendamento antes da consulta', async () => {
    // 1. Criar agendamento
    const appointment = {
      id: 2,
      patient: 'Pedro Silva',
      doctor: 'Dr. Marcus Silva',
      time: '15:00',
      date: '2025-07-18',
      type: 'Consulta',
      status: 'agendado'
    };

    mockApiSuccess(appointment);

    // 2. Cancelar agendamento
    mockApiSuccess({ message: 'Agendamento cancelado', id: 2, status: 'cancelado' });

    const cancelResponse = await fetch(`${BASE_URL}/api/appointments/2`, {
      method: 'DELETE'
    });

    const cancelData = await cancelResponse.json();
    expect(cancelResponse.ok).toBe(true);
    expect(cancelData.message).toBe('Agendamento cancelado');

    // 3. Tentar iniciar consulta com agendamento cancelado
    mockApiError(400, 'Agendamento cancelado ou não encontrado');

    const consultationStart = {
      appointmentId: 2,
      patientId: 'patient-456',
      doctorId: 'doctor-456',
      type: 'video'
    };

    const startResponse = await fetch(`${BASE_URL}/api/consultations/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consultationStart)
    });

    const startData = await startResponse.json();
    expect(startResponse.ok).toBe(false);
    expect(startData.error).toBe('Agendamento cancelado ou não encontrado');
  });

  it('deve validar reagendamento de consulta', async () => {
    // 1. Agendamento original
    const originalAppointment = {
      id: 3,
      patient: 'Maria Santos',
      doctor: 'Dr. Marcus Silva',
      time: '16:00',
      date: '2025-07-18',
      type: 'Retorno',
      status: 'agendado'
    };

    mockApiSuccess(originalAppointment);

    // 2. Reagendar
    const rescheduledAppointment = {
      ...originalAppointment,
      time: '17:00',
      date: '2025-07-19',
      status: 'reagendado'
    };

    mockApiSuccess(rescheduledAppointment);

    const rescheduleResponse = await fetch(`${BASE_URL}/api/appointments/3`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        time: '17:00',
        date: '2025-07-19',
        status: 'reagendado'
      })
    });

    const rescheduleData = await rescheduleResponse.json();
    expect(rescheduleResponse.ok).toBe(true);
    expect(rescheduleData.time).toBe('17:00');
    expect(rescheduleData.date).toBe('2025-07-19');
    expect(rescheduleData.status).toBe('reagendado');
  });

  it('deve validar conflito de horários', async () => {
    // Tentar agendar no mesmo horário
    const conflictingAppointment = {
      patient: 'João Costa',
      doctor: 'Dr. Marcus Silva',
      time: '14:00', // Mesmo horário do primeiro teste
      date: '2025-07-18',
      type: 'Consulta'
    };

    mockApiError(409, 'Conflito de horário: médico já possui consulta agendada');

    const conflictResponse = await fetch(`${BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conflictingAppointment)
    });

    const conflictData = await conflictResponse.json();
    expect(conflictResponse.ok).toBe(false);
    expect(conflictResponse.status).toBe(409);
    expect(conflictData.error).toContain('Conflito de horário');
  });
});