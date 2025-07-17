/// <reference types="cypress" />

describe('Consultation Flow E2E', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // Mock de autenticação médica
    cy.window().then((win) => {
      win.localStorage.setItem('telemed-auth', JSON.stringify({
        user: {
          id: 'doctor-456',
          name: 'Dr. Marcus Silva',
          role: 'doctor',
          crm: '123456/SP',
          speciality: 'Clínica Geral'
        },
        token: 'mock-jwt-token'
      }));
    });

    // Mock de dados do agendamento
    cy.intercept('GET', '/api/appointments', {
      fixture: 'appointments.json'
    }).as('getAppointments');
  });

  it('deve iniciar consulta a partir de agendamento', () => {
    // Navegar para dashboard médico
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.wait('@getAppointments');

    // Selecionar agendamento e iniciar consulta
    cy.get('[data-testid="appointment-item"]').first().within(() => {
      cy.get('[data-testid="start-consultation-btn"]').click();
    });

    // Verificar inicialização da consulta
    cy.get('[data-testid="consultation-interface"]').should('be.visible');
    cy.get('[data-testid="patient-info-panel"]').should('be.visible');
    cy.get('[data-testid="consultation-timer"]').should('be.visible');
    
    // Verificar dados do paciente
    cy.get('[data-testid="patient-name"]').should('contain', 'Ana Costa Silva');
    cy.get('[data-testid="patient-age"]').should('be.visible');
    cy.get('[data-testid="chief-complaint"]').should('contain', 'Dor de cabeça');
  });

  it('deve realizar teleconsulta com vídeo', () => {
    // Iniciar teleconsulta
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="teleconsultation-item"]').first().within(() => {
      cy.get('[data-testid="join-video-btn"]').click();
    });

    // Verificar interface de vídeo
    cy.get('[data-testid="video-consultation-room"]').should('be.visible');
    cy.get('[data-testid="doctor-video"]').should('be.visible');
    cy.get('[data-testid="patient-video"]').should('be.visible');

    // Controles de vídeo
    cy.get('[data-testid="mute-btn"]').should('be.visible');
    cy.get('[data-testid="camera-btn"]').should('be.visible');
    cy.get('[data-testid="screen-share-btn"]').should('be.visible');
    cy.get('[data-testid="end-call-btn"]').should('be.visible');

    // Chat durante a consulta
    cy.get('[data-testid="chat-panel"]').should('be.visible');
    cy.get('[data-testid="chat-input"]').type('Paciente pode me ouvir bem?');
    cy.get('[data-testid="send-message-btn"]').click();
    cy.get('[data-testid="chat-messages"]').should('contain', 'Paciente pode me ouvir bem?');
  });

  it('deve registrar anotações médicas', () => {
    // Iniciar consulta
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="start-consultation-btn"]').first().click();

    // Acessar aba de anotações
    cy.get('[data-testid="medical-notes-tab"]').click();

    // Preencher anamnese
    cy.get('[data-testid="chief-complaint-input"]').type('Cefaleia há 3 dias');
    cy.get('[data-testid="history-present-illness"]').type('Dor pulsátil, intensidade 7/10, piora com luz');
    cy.get('[data-testid="past-medical-history"]').type('Hipertensão controlada');
    cy.get('[data-testid="medications-input"]').type('Losartana 50mg 1x/dia');
    cy.get('[data-testid="allergies-input"]').type('NENHUMA');

    // Exame físico
    cy.get('[data-testid="vital-signs-tab"]').click();
    cy.get('[data-testid="blood-pressure-input"]').type('140/90');
    cy.get('[data-testid="heart-rate-input"]').type('72');
    cy.get('[data-testid="temperature-input"]').type('36.5');
    cy.get('[data-testid="respiratory-rate-input"]').type('16');

    // Exame físico geral
    cy.get('[data-testid="physical-exam-tab"]').click();
    cy.get('[data-testid="general-appearance"]').type('Paciente consciente, orientada, colaborativa');
    cy.get('[data-testid="neurological-exam"]').type('Pupilas isocóricas e fotorreagentes');

    // Salvar anotações
    cy.get('[data-testid="save-notes-btn"]').click();
    cy.get('[data-testid="success-toast"]').should('contain', 'Anotações salvas');
  });

  it('deve criar prescrição médica', () => {
    // Iniciar consulta
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="start-consultation-btn"]').first().click();

    // Acessar aba de prescrições
    cy.get('[data-testid="prescriptions-tab"]').click();

    // Adicionar primeiro medicamento
    cy.get('[data-testid="add-medication-btn"]').click();
    cy.get('[data-testid="medication-search"]').type('Paracetamol');
    cy.get('[data-testid="medication-option"]').first().click();
    
    cy.get('[data-testid="dosage-input"]').type('500mg');
    cy.get('[data-testid="frequency-select"]').select('A cada 6 horas');
    cy.get('[data-testid="duration-input"]').type('5 dias');
    cy.get('[data-testid="instructions-textarea"]').type('Tomar com água, de preferência após as refeições');

    // Adicionar segundo medicamento
    cy.get('[data-testid="add-medication-btn"]').click();
    cy.get('[data-testid="medication-search"]').last().type('Dipirona');
    cy.get('[data-testid="medication-option"]').first().click();
    
    cy.get('[data-testid="dosage-input"]').last().type('500mg');
    cy.get('[data-testid="frequency-select"]').last().select('Se necessário');
    cy.get('[data-testid="duration-input"]').last().type('Conforme necessário');
    cy.get('[data-testid="instructions-textarea"]').last().type('Máximo 4 comprimidos por dia');

    // Orientações gerais
    cy.get('[data-testid="general-instructions"]').type('Repouso, hidratação adequada. Retornar se persistir.');

    // Gerar prescrição
    cy.get('[data-testid="generate-prescription-btn"]').click();
    
    // Verificar preview
    cy.get('[data-testid="prescription-preview"]').should('be.visible');
    cy.get('[data-testid="prescription-preview"]').should('contain', 'Paracetamol 500mg');
    cy.get('[data-testid="prescription-preview"]').should('contain', 'Dr. Marcus Silva');
    cy.get('[data-testid="prescription-preview"]').should('contain', 'CRM 123456/SP');

    // Finalizar prescrição
    cy.get('[data-testid="finalize-prescription-btn"]').click();
    cy.get('[data-testid="success-toast"]').should('contain', 'Prescrição criada');
  });

  it('deve solicitar exames complementares', () => {
    // Iniciar consulta
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="start-consultation-btn"]').first().click();

    // Acessar aba de exames
    cy.get('[data-testid="exams-tab"]').click();

    // Selecionar exames laboratoriais
    cy.get('[data-testid="lab-exams-section"]').click();
    cy.get('[data-testid="exam-checkbox"][data-exam="hemograma"]').check();
    cy.get('[data-testid="exam-checkbox"][data-exam="glicemia"]').check();
    cy.get('[data-testid="exam-checkbox"][data-exam="colesterol"]').check();

    // Exames de imagem
    cy.get('[data-testid="imaging-exams-section"]').click();
    cy.get('[data-testid="exam-checkbox"][data-exam="tc-cranio"]').check();

    // Justificativa
    cy.get('[data-testid="exam-justification"]').type('Investigação de cefaleia secundária');

    // Urgência
    cy.get('[data-testid="urgency-select"]').select('Normal');

    // Gerar solicitação
    cy.get('[data-testid="generate-exam-request-btn"]').click();
    cy.get('[data-testid="exam-request-preview"]').should('be.visible');
    cy.get('[data-testid="finalize-exam-request-btn"]').click();
    
    cy.get('[data-testid="success-toast"]').should('contain', 'Solicitação de exames criada');
  });

  it('deve finalizar consulta com diagnóstico', () => {
    // Iniciar consulta
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="start-consultation-btn"]').first().click();

    // Preencher dados mínimos
    cy.get('[data-testid="medical-notes-tab"]').click();
    cy.get('[data-testid="chief-complaint-input"]').type('Cefaleia');

    // Finalizar consulta
    cy.get('[data-testid="finish-consultation-btn"]').click();

    // Diagnóstico
    cy.get('[data-testid="diagnosis-modal"]').should('be.visible');
    cy.get('[data-testid="primary-diagnosis-input"]').type('Cefaleia tensional');
    cy.get('[data-testid="icd-code-input"]').type('G44.2');
    
    // Condutas
    cy.get('[data-testid="treatment-plan"]').type('Analgésicos e repouso');
    cy.get('[data-testid="follow-up-select"]').select('Retorno em 7 dias');
    
    // Orientações ao paciente
    cy.get('[data-testid="patient-instructions"]').type('Evitar estresse, manter hidratação, retornar se piorar');

    // Confirmar finalização
    cy.get('[data-testid="confirm-finish-btn"]').click();
    
    // Verificar conclusão
    cy.get('[data-testid="consultation-summary"]').should('be.visible');
    cy.get('[data-testid="consultation-duration"]').should('be.visible');
    cy.get('[data-testid="success-toast"]').should('contain', 'Consulta finalizada');
    
    // Retornar ao dashboard
    cy.get('[data-testid="back-to-dashboard-btn"]').click();
    cy.url().should('include', '/doctor-dashboard');
  });

  it('deve permitir consulta de emergência', () => {
    // Marcar como emergência
    cy.get('[data-testid="emergency-consultation-btn"]').click();
    
    // Preencher dados urgentes
    cy.get('[data-testid="emergency-modal"]').should('be.visible');
    cy.get('[data-testid="patient-name-input"]').type('João Emergência');
    cy.get('[data-testid="emergency-level-select"]').select('Alta');
    cy.get('[data-testid="chief-complaint-input"]').type('Dor torácica');
    
    // Iniciar imediatamente
    cy.get('[data-testid="start-emergency-btn"]').click();
    
    // Verificar interface de emergência
    cy.get('[data-testid="emergency-consultation-interface"]').should('be.visible');
    cy.get('[data-testid="emergency-protocols"]').should('be.visible');
    cy.get('[data-testid="quick-actions-panel"]').should('be.visible');
    
    // Verificar timestamp de emergência
    cy.get('[data-testid="emergency-timer"]').should('be.visible');
    cy.get('[data-testid="emergency-level-indicator"]').should('contain', 'ALTA');
  });

  it('deve validar histórico de consultas', () => {
    // Acessar histórico
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="consultation-history-tab"]').click();

    // Filtros
    cy.get('[data-testid="date-filter-from"]').type('2025-07-01');
    cy.get('[data-testid="date-filter-to"]').type('2025-07-31');
    cy.get('[data-testid="status-filter"]').select('Todas');
    cy.get('[data-testid="apply-filters-btn"]').click();

    // Verificar lista
    cy.get('[data-testid="consultation-history-list"]').should('be.visible');
    cy.get('[data-testid="consultation-item"]').should('have.length.greaterThan', 0);

    // Detalhes de consulta passada
    cy.get('[data-testid="consultation-item"]').first().click();
    cy.get('[data-testid="consultation-details-modal"]').should('be.visible');
    cy.get('[data-testid="consultation-notes"]').should('be.visible');
    cy.get('[data-testid="consultation-prescriptions"]').should('be.visible');
    cy.get('[data-testid="consultation-duration"]').should('be.visible');
  });
});