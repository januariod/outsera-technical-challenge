class LoginPage {
  visit() {
    cy.visit('/')
  }

  fillUsername(username) {
    cy.clearAndType('[data-test="username"]', username)
  }

  fillPassword(password) {
    if (password) cy.get('[data-test="password"]').clear().type(password)
  }

  clickLogin() {
    cy.get('[data-test="login-button"]').click()
  }

  verifyErrorMessage(expectedMessage) {
    cy.get('[data-test="error"]').should('be.visible').and('contain.text', expectedMessage)
  }

  verifyOnLoginPage() {
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  }
}
export default new LoginPage()
