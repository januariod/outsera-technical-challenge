/**
 * e2e-tests/cypress/pages/LoginPage.js
 * Page Object para a tela de login do Restful Booker.
 *
 * Centraliza todos os seletores e ações da página de login.
 * Decisão técnica: seletores como getters estáticos permitem
 * atualização em único ponto caso o DOM mude.
 */

const BasePage = require('./BasePage')

class LoginPage extends BasePage {
  // ─────────────────────────────────────────────────────────────────────────
  // Seletores (centralizados para facilitar manutenção)
  // ─────────────────────────────────────────────────────────────────────────

  // A aplicação Restful Booker usa Bootstrap com IDs específicos
  get usernameInput() { return '#username' }
  get passwordInput() { return '#password' }
  get loginButton() { return '#doLogin' }
  get logoutButton() { return '#doLogout' }
  get loginForm() { return '.login' }
  get errorMessage() { return '.alert-danger, .error-message, #invalidLogin' }
  get successMessage() { return '.alert-success' }
  get adminPanel() { return '#admin-panel, .admin-panel, #roomForm' }

  // ─────────────────────────────────────────────────────────────────────────
  // Ações
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Navega para a página de admin/login.
   */
  navigate() {
    this.visit('/#/login')
    return this
  }

  /**
   * Preenche o campo de usuário.
   * @param {string} username
   */
  fillUsername(username) {
    cy.get(this.usernameInput)
      .should('be.visible')
      .clear()
      .type(username)
    return this
  }

  /**
   * Preenche o campo de senha.
   * @param {string} password
   */
  fillPassword(password) {
    cy.get(this.passwordInput)
      .should('be.visible')
      .clear()
      .type(password)
    return this
  }

  /**
   * Clica no botão de login.
   */
  clickLogin() {
    cy.get(this.loginButton)
      .should('be.visible')
      .click()
    return this
  }

  /**
   * Realiza o fluxo completo de login.
   * @param {string} username
   * @param {string} password
   */
  login(username, password) {
    this.fillUsername(username)
    this.fillPassword(password)
    this.clickLogin()
    return this
  }

  /**
   * Realiza logout.
   */
  logout() {
    cy.get(this.logoutButton)
      .should('be.visible')
      .click()
    return this
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Asserções
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Verifica que o formulário de login está visível.
   */
  assertLoginFormVisible() {
    this.assertVisible(this.loginForm)
    return this
  }

  /**
   * Verifica que o login foi bem-sucedido (painel admin visível).
   */
  assertLoginSuccess() {
    cy.get(this.adminPanel, { timeout: 10000 }).should('be.visible')
    this.assertUrl('/admin')
    return this
  }

  /**
   * Verifica que o login falhou (mensagem de erro visível).
   */
  assertLoginFailed() {
    cy.get(this.errorMessage, { timeout: 5000 }).should('be.visible')
    return this
  }

  /**
   * Verifica que a mensagem de erro contém texto específico.
   * @param {string} message
   */
  assertErrorMessage(message) {
    cy.get(this.errorMessage)
      .should('be.visible')
      .and('contain.text', message)
    return this
  }

  /**
   * Verifica que o usuário está na página de login (não autenticado).
   */
  assertIsOnLoginPage() {
    this.assertUrl('/login')
    this.assertVisible(this.usernameInput)
    this.assertVisible(this.passwordInput)
    return this
  }

  /**
   * Verifica que os campos obrigatórios estão visivelmente vazios.
   */
  assertFieldsAreEmpty() {
    cy.get(this.usernameInput).should('have.value', '')
    cy.get(this.passwordInput).should('have.value', '')
    return this
  }
}

module.exports = new LoginPage()
