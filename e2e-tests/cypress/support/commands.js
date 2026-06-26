/**
 * e2e-tests/cypress/support/commands.js
 * Comandos customizados para os testes E2E.
 */

/**
 * cy.login(username, password)
 * Realiza login na aplicação Restful Booker via UI.
 */
Cypress.Commands.add('login', (username, password) => {
  cy.get('[data-testid="username"], #username, input[name="username"]')
    .should('be.visible')
    .clear()
    .type(username)

  cy.get('[data-testid="password"], #password, input[name="password"]')
    .should('be.visible')
    .clear()
    .type(password)

  cy.get('[data-testid="submit"], button[type="submit"], input[type="submit"]')
    .click()
})

/**
 * cy.navigateTo(path)
 * Navega para uma rota específica da aplicação.
 */
Cypress.Commands.add('navigateTo', (path) => {
  cy.visit(path)
  cy.url().should('include', path)
})

/**
 * cy.shouldBeVisible(selector)
 * Verifica que um elemento está visível na tela.
 */
Cypress.Commands.add('shouldBeVisible', (selector) => {
  cy.get(selector).should('be.visible')
})

/**
 * cy.shouldContainText(selector, text)
 * Verifica que um elemento contém o texto esperado.
 */
Cypress.Commands.add('shouldContainText', (selector, text) => {
  cy.get(selector).should('contain.text', text)
})

/**
 * cy.clearAndType(selector, text)
 * Limpa o campo e digita o texto.
 */
Cypress.Commands.add('clearAndType', (selector, text) => {
  cy.get(selector).clear().type(text)
})
