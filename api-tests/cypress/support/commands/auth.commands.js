/**
 * api-tests/cypress/support/commands/auth.commands.js
 * Comandos customizados relacionados à autenticação na API Restful Booker.
 *
 * Decisão técnica: comandos de auth são isolados para permitir reutilização
 * em toda a suíte sem duplicação, e para facilitar atualização de credentials.
 */

/**
 * cy.createAuthToken()
 * Cria um token de autenticação via POST /auth e o armazena no alias 'authToken'.
 *
 * @example
 * cy.createAuthToken().then((token) => { ... })
 */
Cypress.Commands.add('createAuthToken', (credentials = {}) => {
  const username = credentials.username || Cypress.env('ADMIN_USERNAME')
  const password = credentials.password || Cypress.env('ADMIN_PASSWORD')

  return cy.request({
    method: 'POST',
    url: '/auth',
    headers: { 'Content-Type': 'application/json' },
    body: { username, password },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('token')
    return response.body.token
  })
})

/**
 * cy.createAuthTokenAndStore()
 * Cria token e armazena como variável de ambiente Cypress para uso na sessão.
 */
Cypress.Commands.add('createAuthTokenAndStore', () => {
  cy.createAuthToken().then((token) => {
    Cypress.env('AUTH_TOKEN', token)
  })
})

/**
 * cy.getStoredToken()
 * Retorna o token armazenado na sessão.
 */
Cypress.Commands.add('getStoredToken', () => {
  return cy.wrap(Cypress.env('AUTH_TOKEN'))
})
