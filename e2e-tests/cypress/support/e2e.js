/**
 * e2e-tests/cypress/support/e2e.js
 * Ponto de entrada do suporte para testes E2E.
 */

import './commands'

// Previne falhas por erros não capturados irrelevantes ao teste
Cypress.on('uncaught:exception', (err) => {
  // Ignora erros comuns de scripts de terceiros
  const ignoredMessages = [
    'ResizeObserver loop',
    'Script error',
    'Non-Error promise rejection captured',
  ]

  if (ignoredMessages.some((msg) => err.message.includes(msg))) {
    return false
  }
})

// Log contextual de início de cada cenário
beforeEach(function () {
  cy.task('log', `\n▶ Cenário: "${this.currentTest?.fullTitle()}"`)
})
