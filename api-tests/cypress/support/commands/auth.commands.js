Cypress.Commands.add('createAuthToken', (credentials = {}, attemptsLeft = 3) => {
  const username = credentials.username || Cypress.env('ADMIN_USERNAME')
  const password = credentials.password || Cypress.env('ADMIN_PASSWORD')

  return cy.request({
    method: 'POST',
    url: '/auth',
    headers: { 'Content-Type': 'application/json' },
    body: { username, password },
    failOnStatusCode: false,
  }).then((response) => {
    const hasValidToken = response.status === 200 && !!response.body?.token

    if (!hasValidToken && attemptsLeft > 1) {
      cy.log(`⚠ Falha transitória ao autenticar ("${response.body?.reason || response.status}"). Tentando novamente... (${attemptsLeft - 1} tentativa(s) restante(s))`)
      return cy.wait(1500).then(() => cy.createAuthToken(credentials, attemptsLeft - 1))
    }

    expect(response.status, 'Autenticação deve retornar 200').to.eq(200)
    expect(response.body, 'Resposta deve conter token de autenticação').to.have.property('token')
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
