/**
 * e2e-tests/cypress/pages/BasePage.js
 * Classe base para todos os Page Objects.
 *
 * Decisão técnica: herança de BasePage garante que todos os POs
 * tenham acesso a métodos comuns (navegação, espera, asserções gerais)
 * sem duplicação, e facilita manutenção centralizada de timeouts e helpers.
 */

class BasePage {
  /**
   * Navega para a URL da página.
   * @param {string} path - Caminho relativo à baseUrl
   */
  visit(path = '/') {
    cy.visit(path)
    return this
  }

  /**
   * Aguarda a página estar completamente carregada.
   */
  waitForPageLoad() {
    cy.document().should('have.property', 'readyState', 'complete')
    return this
  }

  /**
   * Verifica que a URL contém o path esperado.
   * @param {string} path
   */
  assertUrl(path) {
    cy.url().should('include', path)
    return this
  }

  /**
   * Verifica que o título da página contém o texto esperado.
   * @param {string} title
   */
  assertTitle(title) {
    cy.title().should('include', title)
    return this
  }

  /**
   * Verifica que um elemento está visível.
   * @param {string} selector
   */
  assertVisible(selector) {
    cy.get(selector).should('be.visible')
    return this
  }

  /**
   * Verifica que um elemento não está visível.
   * @param {string} selector
   */
  assertNotVisible(selector) {
    cy.get(selector).should('not.be.visible')
    return this
  }

  /**
   * Verifica que um elemento contém o texto esperado.
   * @param {string} selector
   * @param {string} text
   */
  assertText(selector, text) {
    cy.get(selector).should('contain.text', text)
    return this
  }

  /**
   * Clica em um elemento após verificar visibilidade.
   * @param {string} selector
   */
  click(selector) {
    cy.get(selector).should('be.visible').click()
    return this
  }

  /**
   * Limpa e digita em um campo.
   * @param {string} selector
   * @param {string} value
   */
  fillField(selector, value) {
    cy.get(selector).clear().type(value)
    return this
  }

  /**
   * Aguarda um elemento estar visível com timeout customizado.
   * @param {string} selector
   * @param {number} timeout - Timeout em ms
   */
  waitForElement(selector, timeout = 10000) {
    cy.get(selector, { timeout }).should('be.visible')
    return this
  }

  /**
   * Captura screenshot com nome descritivo.
   * @param {string} name
   */
  takeScreenshot(name) {
    cy.screenshot(name)
    return this
  }
}

module.exports = BasePage
