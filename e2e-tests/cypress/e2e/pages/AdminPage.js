/**
 * e2e-tests/cypress/pages/AdminPage.js
 * Page Object para o painel administrativo do Restful Booker.
 * Acessível após login bem-sucedido.
 */

const BasePage = require('./BasePage')

class AdminPage extends BasePage {
  // ─────────────────────────────────────────────────────────────────────────
  // Seletores
  // ─────────────────────────────────────────────────────────────────────────
  get pageTitle() { return 'h1, .navbar-brand' }
  get roomsSection() { return '#roomForm, .rooms-container, #root' }
  get frontEndLink() { return 'a[href="/"]' }
  get logoutButton() { return '#doLogout' }
  get adminNav() { return '.navbar, nav' }
  get roomsLink() { return 'a[href*="room"], a[href*="admin"]' }

  // ─────────────────────────────────────────────────────────────────────────
  // Navegação
  // ─────────────────────────────────────────────────────────────────────────

  navigate() {
    this.visit('/admin')
    return this
  }

  navigateToFrontEnd() {
    cy.get(this.frontEndLink).click()
    return this
  }

  logout() {
    cy.get(this.logoutButton).click()
    return this
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Asserções
  // ─────────────────────────────────────────────────────────────────────────

  assertAdminPanelVisible() {
    cy.url().should('include', '/admin')
    this.assertVisible(this.adminNav)
    return this
  }

  assertRoomsSectionVisible() {
    this.assertVisible(this.roomsSection)
    return this
  }

  assertLogoutButtonVisible() {
    this.assertVisible(this.logoutButton)
    return this
  }
}

module.exports = new AdminPage()
