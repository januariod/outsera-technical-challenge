/**
 * mobile-tests/pages/LoginPage.js
 * Page Object para a tela de login de https://the-internet.herokuapp.com/login
 */

const BasePage = require('./BasePage')

class LoginPage extends BasePage {
  get URL() { return 'https://the-internet.herokuapp.com/login' }

  // ── Seletores ─────────────────────────────────────────────────────────────
  get usernameInput() { return '#username' }
  get passwordInput() { return '#password' }
  get loginButton() { return 'button[type="submit"]' }
  get successMessage() { return '.flash.success' }
  get errorMessage() { return '.flash.error' }
  get logoutButton() { return 'a[href="/logout"]' }
  get pageTitle() { return 'h2' }
  get secureAreaTitle() { return 'h2, h4.subheader' }

  // ── Ações ─────────────────────────────────────────────────────────────────

  async navigate() {
    await this.open(this.URL)
    return this
  }

  async fillUsername(username) {
    await this.typeText(this.usernameInput, username)
    return this
  }

  async fillPassword(password) {
    await this.typeText(this.passwordInput, password)
    return this
  }

  async clickLogin() {
    await this.tapElement(this.loginButton)
    return this
  }

  async login(username, password) {
    await this.fillUsername(username)
    await this.fillPassword(password)
    await this.clickLogin()
    return this
  }

  async logout() {
    await this.tapElement(this.logoutButton)
    return this
  }

  // ── Asserções ─────────────────────────────────────────────────────────────

  async assertLoginPageLoaded() {
    await this.assertVisible(this.usernameInput)
    await this.assertVisible(this.passwordInput)
    await this.assertVisible(this.loginButton)
    return this
  }

  async assertLoginSuccess() {
    await this.assertVisible(this.successMessage)
    await this.assertUrl('/secure')
    return this
  }

  async assertLoginFailed() {
    await this.assertVisible(this.errorMessage)
    return this
  }

  async assertSuccessMessageContains(text) {
    await this.assertText(this.successMessage, text)
    return this
  }

  async assertErrorMessageContains(text) {
    await this.assertText(this.errorMessage, text)
    return this
  }
}

module.exports = new LoginPage()
