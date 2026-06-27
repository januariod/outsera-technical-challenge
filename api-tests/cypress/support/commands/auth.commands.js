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

Cypress.Commands.add('createAuthTokenAndStore', () => {
  cy.createAuthToken().then((token) => {
    Cypress.env('AUTH_TOKEN', token)
  })
})

Cypress.Commands.add('getStoredToken', () => {
  return cy.wrap(Cypress.env('AUTH_TOKEN'))
})
