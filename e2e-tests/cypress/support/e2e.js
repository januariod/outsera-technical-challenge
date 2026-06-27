import './commands'

Cypress.on('uncaught:exception', (err) => {
  const ignoredMessages = [
    'ResizeObserver loop',
    'Script error',
    'Non-Error promise rejection captured',
  ]

  if (ignoredMessages.some((msg) => err.message.includes(msg))) {
    return false
  }
})

beforeEach(function () {
  cy.task('log', `\n▶ Cenário: "${this.currentTest?.fullTitle()}"`)
})
