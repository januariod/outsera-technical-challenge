import './commands/auth.commands'
import './commands/booking.commands'
import './commands/assertion.commands'

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver') || err.message.includes('Script error')) {
    return false
  }
})

beforeEach(function () {
  cy.task('log', `\n▶ Iniciando: "${this.currentTest.fullTitle()}"`)
})

afterEach(function () {
  const status = this.currentTest.state === 'passed' ? '✅ PASSOU' : '❌ FALHOU'
  cy.task('log', `${status}: "${this.currentTest.fullTitle()}"`)
})
