class LoginPage {
  elements = {
    usernameInput: () => cy.get('[data-test="username"]'),
    passwordInput: () => cy.get('[data-test="password"]'),
    loginButton: () => cy.get('[data-test="login-button"]'),
    errorMessage: () => cy.get('[data-test="error"]'),
  }

  visit() {
    cy.visit('/')
    return this
  }

  fillUsername(username) {
    if (username) this.elements.usernameInput().clear().type(username)
    return this
  }

  fillPassword(password) {
    if (password) this.elements.passwordInput().clear().type(password)
    return this
  }

  clickLogin() {
    this.elements.loginButton().click()
    return this
  }

  verifyErrorMessage(expectedMessage) {
    this.elements.errorMessage().should('be.visible').and('contain.text', expectedMessage)
    return this
  }

  verifyOnLoginPage() {
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    return this
  }
}
export default new LoginPage()
