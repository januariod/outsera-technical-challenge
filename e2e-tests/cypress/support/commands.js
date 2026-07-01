import LoginPage from '../e2e/pages/LoginPage'

Cypress.Commands.add('clearAndType', (selector, text) => {
  if (text) {
    cy.get(selector).clear().type(text)
  }
})

Cypress.Commands.add('login', (username, password) => {
  const user = username || Cypress.env('SAUCE_USERNAME')
  const pass = password || Cypress.env('SAUCE_PASSWORD')

  LoginPage.visit()
    .fillUsername(user)
    .fillPassword(pass)
    .clickLogin()

  cy.url().should('include', '/inventory.html')
})

