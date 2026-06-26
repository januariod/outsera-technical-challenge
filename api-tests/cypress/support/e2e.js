/**
 * api-tests/cypress/support/e2e.js
 * Ponto de entrada do suporte global para testes de API.
 * Importa commands customizados e configurações globais.
 */

// ── Comandos customizados ────────────────────────────────────────────────────
import './commands/auth.commands'
import './commands/booking.commands'
import './commands/assertion.commands'

// ── Handlers globais ─────────────────────────────────────────────────────────

// Previne que erros de rede não capturados quebrem a suíte
Cypress.on('uncaught:exception', (err) => {
  // Para testes de API puros, erros do DOM não são relevantes
  if (err.message.includes('ResizeObserver') || err.message.includes('Script error')) {
    return false
  }
})

// Log de contexto antes de cada teste
beforeEach(function () {
  cy.task('log', `\n▶ Iniciando: "${this.currentTest.fullTitle()}"`)
})

// Log de resultado após cada teste
afterEach(function () {
  const status = this.currentTest.state === 'passed' ? '✅ PASSOU' : '❌ FALHOU'
  cy.task('log', `${status}: "${this.currentTest.fullTitle()}"`)
})
