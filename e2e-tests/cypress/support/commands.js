Cypress.Commands.add('clearAndType', (selector, text) => {
  if (text) {
    cy.get(selector).clear().type(text)
  }
})

Cypress.Commands.add('login', (username, password) => {
  const user = username || Cypress.env('SAUCE_USERNAME')
  const pass = password || Cypress.env('SAUCE_PASSWORD')

  cy.visit('/')
  
  cy.clearAndType('[data-test="username"]', user)
  cy.clearAndType('[data-test="password"]', pass)
  
  cy.get('[data-test="login-button"]').click()
  cy.url().should('include', '/inventory.html')
})

