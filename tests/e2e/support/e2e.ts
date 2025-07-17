// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global configurations
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  // that are expected in our application
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});

// Global before hook
beforeEach(() => {
  // Clear local storage and session storage
  cy.clearLocalStorage();
  cy.clearCookies();
  
  // Set viewport
  cy.viewport(1280, 720);
  
  // Intercept common API calls
  cy.intercept('GET', '/api/health', { fixture: 'health.json' }).as('healthCheck');
  cy.intercept('GET', '/api/status', { fixture: 'status.json' }).as('statusCheck');
});