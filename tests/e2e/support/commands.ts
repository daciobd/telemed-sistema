/// <reference types="cypress" />

// Custom commands for TeleMed testing

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login as doctor
       * @example cy.loginAsDoctor()
       */
      loginAsDoctor(): Chainable<Element>;
      
      /**
       * Login as patient
       * @example cy.loginAsPatient()
       */
      loginAsPatient(): Chainable<Element>;
      
      /**
       * Create test appointment
       * @example cy.createTestAppointment({ patient: 'João Silva', time: '14:00' })
       */
      createTestAppointment(appointmentData: any): Chainable<Element>;
      
      /**
       * Start consultation from appointment
       * @example cy.startConsultation('appointment-123')
       */
      startConsultation(appointmentId: string): Chainable<Element>;
      
      /**
       * Fill medical notes
       * @example cy.fillMedicalNotes({ complaint: 'Dor de cabeça', diagnosis: 'Enxaqueca' })
       */
      fillMedicalNotes(notesData: any): Chainable<Element>;
      
      /**
       * Create prescription
       * @example cy.createPrescription([{ name: 'Paracetamol', dosage: '500mg' }])
       */
      createPrescription(medications: any[]): Chainable<Element>;
    }
  }
}

// Login as doctor
Cypress.Commands.add('loginAsDoctor', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('telemed-auth', JSON.stringify({
      user: {
        id: 'doctor-456',
        name: 'Dr. Marcus Silva',
        role: 'doctor',
        crm: '123456/SP',
        speciality: 'Clínica Geral'
      },
      token: 'mock-jwt-token-doctor',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
  });
});

// Login as patient
Cypress.Commands.add('loginAsPatient', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('telemed-auth', JSON.stringify({
      user: {
        id: 'patient-123',
        name: 'Ana Costa Silva',
        role: 'patient',
        cpf: '12345678901',
        birthDate: '1985-03-15'
      },
      token: 'mock-jwt-token-patient',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
  });
});

// Create test appointment
Cypress.Commands.add('createTestAppointment', (appointmentData) => {
  const defaultData = {
    patient: 'Test Patient',
    doctor: 'Dr. Marcus Silva',
    date: '2025-07-20',
    time: '14:00',
    type: 'Consulta',
    status: 'agendado',
    ...appointmentData
  };

  cy.intercept('POST', '/api/appointments', {
    statusCode: 201,
    body: {
      id: Date.now(),
      ...defaultData,
      createdAt: new Date().toISOString()
    }
  }).as('createAppointment');

  cy.get('[data-testid="new-appointment-btn"]').click();
  cy.get('[data-testid="patient-name-input"]').type(defaultData.patient);
  cy.get('[data-testid="appointment-date-input"]').type(defaultData.date);
  cy.get('[data-testid="appointment-time-input"]').select(defaultData.time);
  cy.get('[data-testid="appointment-type-select"]').select(defaultData.type);
  cy.get('[data-testid="save-appointment-btn"]').click();
  
  cy.wait('@createAppointment');
});

// Start consultation
Cypress.Commands.add('startConsultation', (appointmentId) => {
  cy.intercept('POST', '/api/consultations/start', {
    statusCode: 200,
    body: {
      id: `consultation-${appointmentId}`,
      appointmentId,
      status: 'active',
      startedAt: new Date().toISOString(),
      roomId: `room-${Date.now()}`
    }
  }).as('startConsultation');

  cy.get(`[data-testid="appointment-${appointmentId}"]`).within(() => {
    cy.get('[data-testid="start-consultation-btn"]').click();
  });
  
  cy.wait('@startConsultation');
});

// Fill medical notes
Cypress.Commands.add('fillMedicalNotes', (notesData) => {
  const defaultNotes = {
    complaint: 'Test complaint',
    diagnosis: 'Test diagnosis',
    treatment: 'Test treatment',
    ...notesData
  };

  cy.get('[data-testid="medical-notes-tab"]').click();
  
  if (defaultNotes.complaint) {
    cy.get('[data-testid="chief-complaint-input"]').type(defaultNotes.complaint);
  }
  
  if (defaultNotes.diagnosis) {
    cy.get('[data-testid="diagnosis-input"]').type(defaultNotes.diagnosis);
  }
  
  if (defaultNotes.treatment) {
    cy.get('[data-testid="treatment-plan"]').type(defaultNotes.treatment);
  }
  
  cy.get('[data-testid="save-notes-btn"]').click();
});

// Create prescription
Cypress.Commands.add('createPrescription', (medications) => {
  cy.intercept('POST', '/api/consultations/*/prescriptions', {
    statusCode: 201,
    body: {
      id: `prescription-${Date.now()}`,
      medications,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  }).as('createPrescription');

  cy.get('[data-testid="prescriptions-tab"]').click();
  
  medications.forEach((medication, index) => {
    cy.get('[data-testid="add-medication-btn"]').click();
    cy.get('[data-testid="medication-search"]').eq(index).type(medication.name);
    cy.get('[data-testid="medication-option"]').first().click();
    
    if (medication.dosage) {
      cy.get('[data-testid="dosage-input"]').eq(index).type(medication.dosage);
    }
    
    if (medication.frequency) {
      cy.get('[data-testid="frequency-select"]').eq(index).select(medication.frequency);
    }
    
    if (medication.duration) {
      cy.get('[data-testid="duration-input"]').eq(index).type(medication.duration);
    }
  });
  
  cy.get('[data-testid="generate-prescription-btn"]').click();
  cy.get('[data-testid="finalize-prescription-btn"]').click();
  
  cy.wait('@createPrescription');
});