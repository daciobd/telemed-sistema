/// <reference types="cypress" />

describe('Appointment Booking E2E', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // Mock de autenticação
    cy.window().then((win) => {
      win.localStorage.setItem('telemed-auth', JSON.stringify({
        user: {
          id: 'doctor-456',
          name: 'Dr. Marcus Silva',
          role: 'doctor',
          crm: '123456/SP'
        },
        token: 'mock-jwt-token'
      }));
    });
  });

  it('deve realizar agendamento completo', () => {
    // Navegar para dashboard médico
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.url().should('include', '/doctor-dashboard');

    // Acessar área de agendamentos
    cy.get('[data-testid="appointments-tab"]').click();
    cy.contains('Agenda de Consultas').should('be.visible');

    // Criar novo agendamento
    cy.get('[data-testid="new-appointment-btn"]').click();
    
    // Preencher formulário
    cy.get('[data-testid="patient-name-input"]').type('Ana Costa Silva');
    cy.get('[data-testid="patient-cpf-input"]').type('12345678901');
    cy.get('[data-testid="appointment-date-input"]').type('2025-07-20');
    cy.get('[data-testid="appointment-time-input"]').select('14:00');
    cy.get('[data-testid="appointment-type-select"]').select('Teleconsulta');
    cy.get('[data-testid="symptoms-textarea"]').type('Dor de cabeça persistente há 3 dias');

    // Salvar agendamento
    cy.get('[data-testid="save-appointment-btn"]').click();

    // Verificar confirmação
    cy.get('[data-testid="success-toast"]').should('contain', 'Agendamento criado com sucesso');
    cy.get('[data-testid="appointment-list"]').should('contain', 'Ana Costa Silva');
    cy.get('[data-testid="appointment-list"]').should('contain', '14:00');
  });

  it('deve validar campos obrigatórios', () => {
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="appointments-tab"]').click();
    cy.get('[data-testid="new-appointment-btn"]').click();

    // Tentar salvar sem preencher
    cy.get('[data-testid="save-appointment-btn"]').click();

    // Verificar mensagens de erro
    cy.get('[data-testid="patient-name-error"]').should('contain', 'Nome do paciente é obrigatório');
    cy.get('[data-testid="appointment-date-error"]').should('contain', 'Data é obrigatória');
    cy.get('[data-testid="appointment-time-error"]').should('contain', 'Horário é obrigatório');
  });

  it('deve permitir reagendamento', () => {
    // Assumir que já existe um agendamento
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="appointments-tab"]').click();

    // Encontrar agendamento existente e reagendar
    cy.get('[data-testid="appointment-item"]').first().within(() => {
      cy.get('[data-testid="reschedule-btn"]').click();
    });

    // Alterar horário
    cy.get('[data-testid="new-time-select"]').select('15:00');
    cy.get('[data-testid="reschedule-reason-input"]').type('Conflito de agenda');
    cy.get('[data-testid="confirm-reschedule-btn"]').click();

    // Verificar atualização
    cy.get('[data-testid="success-toast"]').should('contain', 'Agendamento reagendado');
    cy.get('[data-testid="appointment-list"]').should('contain', '15:00');
  });

  it('deve cancelar agendamento', () => {
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="appointments-tab"]').click();

    // Cancelar agendamento
    cy.get('[data-testid="appointment-item"]').first().within(() => {
      cy.get('[data-testid="cancel-btn"]').click();
    });

    // Confirmar cancelamento
    cy.get('[data-testid="cancel-reason-select"]').select('Emergência médica');
    cy.get('[data-testid="confirm-cancel-btn"]').click();

    // Verificar remoção
    cy.get('[data-testid="success-toast"]').should('contain', 'Agendamento cancelado');
    cy.get('[data-testid="canceled-appointments-tab"]').click();
    cy.get('[data-testid="canceled-list"]').should('contain', 'Emergência médica');
  });

  it('deve filtrar agendamentos por data', () => {
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="appointments-tab"]').click();

    // Aplicar filtro de data
    cy.get('[data-testid="date-filter-input"]').type('2025-07-20');
    cy.get('[data-testid="apply-filter-btn"]').click();

    // Verificar resultados filtrados
    cy.get('[data-testid="appointment-item"]').each(($el) => {
      cy.wrap($el).should('contain', '2025-07-20');
    });
  });

  it('deve exibir detalhes do agendamento', () => {
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="appointments-tab"]').click();

    // Clicar em agendamento para ver detalhes
    cy.get('[data-testid="appointment-item"]').first().click();

    // Verificar modal de detalhes
    cy.get('[data-testid="appointment-details-modal"]').should('be.visible');
    cy.get('[data-testid="patient-info"]').should('be.visible');
    cy.get('[data-testid="appointment-time"]').should('be.visible');
    cy.get('[data-testid="symptoms-info"]').should('be.visible');
    cy.get('[data-testid="start-consultation-btn"]').should('be.visible');
  });

  it('deve validar conflito de horários', () => {
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="appointments-tab"]').click();
    cy.get('[data-testid="new-appointment-btn"]').click();

    // Tentar agendar no mesmo horário de outro agendamento
    cy.get('[data-testid="patient-name-input"]').type('Pedro Silva');
    cy.get('[data-testid="appointment-date-input"]').type('2025-07-20');
    cy.get('[data-testid="appointment-time-input"]').select('14:00'); // Horário já ocupado

    cy.get('[data-testid="save-appointment-btn"]').click();

    // Verificar erro de conflito
    cy.get('[data-testid="error-toast"]').should('contain', 'Conflito de horário');
    cy.get('[data-testid="time-conflict-warning"]').should('be.visible');
  });

  it('deve mostrar agenda semanal', () => {
    cy.get('[data-testid="doctor-dashboard-link"]').click();
    cy.get('[data-testid="weekly-view-btn"]').click();

    // Verificar visualização semanal
    cy.get('[data-testid="weekly-calendar"]').should('be.visible');
    cy.get('[data-testid="week-navigation"]').should('be.visible');
    
    // Navegar entre semanas
    cy.get('[data-testid="next-week-btn"]').click();
    cy.get('[data-testid="prev-week-btn"]').click();

    // Verificar slots de horário
    cy.get('[data-testid="time-slot"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="available-slot"]').should('be.visible');
    cy.get('[data-testid="occupied-slot"]').should('be.visible');
  });
});