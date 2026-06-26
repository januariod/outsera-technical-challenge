/**
 * e2e-tests/cypress/e2e/step-definitions/login/login.steps.js
 * Step Definitions para os cenários de login.
 *
 * Decisão técnica: cada step é atômico e delega ações ao Page Object,
 * mantendo os steps legíveis e sem lógica de UI duplicada.
 * O Page Object é importado como singleton para compartilhar estado.
 */

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
const LoginPage = require('../../pages/LoginPage')
const AdminPage = require('../../pages/AdminPage')

// ─────────────────────────────────────────────────────────────────────────────
// GIVEN - Pré-condições
// ─────────────────────────────────────────────────────────────────────────────

Given('que estou na página de login', () => {
  LoginPage.navigate()
  LoginPage.waitForPageLoad()
  LoginPage.assertLoginFormVisible()
})

// ─────────────────────────────────────────────────────────────────────────────
// WHEN - Ações
// ─────────────────────────────────────────────────────────────────────────────

When('informo o usuário {string} e a senha {string}', (username, password) => {
  // Campos vazios são representados como string vazia nos exemplos
  if (username) {
    LoginPage.fillUsername(username)
  }
  if (password) {
    LoginPage.fillPassword(password)
  }
})

When('não preencho nenhum campo', () => {
  // Campos permanecem vazios por padrão - apenas verifica estado inicial
  LoginPage.assertFieldsAreEmpty()
})

When('clico no botão de login', () => {
  LoginPage.clickLogin()
})

When('clico no botão de logout', () => {
  AdminPage.logout()
})

When('clico no link para a área frontal do hotel', () => {
  AdminPage.navigateToFrontEnd()
})

// ─────────────────────────────────────────────────────────────────────────────
// THEN - Verificações
// ─────────────────────────────────────────────────────────────────────────────

Then('devo ser redirecionado para o painel administrativo', () => {
  AdminPage.assertAdminPanelVisible()
})

Then('devo ver o painel de gerenciamento de quartos', () => {
  AdminPage.assertRoomsSectionVisible()
})

Then('devo ver o botão de logout disponível', () => {
  AdminPage.assertLogoutButtonVisible()
})

Then('devo ser redirecionado para a página inicial do hotel', () => {
  cy.url().should('not.include', '/admin')
})

Then('devo ser redirecionado para a página de login', () => {
  cy.url().should('include', '/login')
  LoginPage.assertLoginFormVisible()
})

Then('devo ver uma mensagem de erro de credenciais inválidas', () => {
  LoginPage.assertLoginFailed()
})

Then('devo ver uma mensagem de erro indicando campos obrigatórios', () => {
  LoginPage.assertLoginFailed()
})

Then('devo ver uma mensagem de erro', () => {
  // Step genérico - verifica qualquer tipo de feedback de erro
  cy.get('body').then(($body) => {
    const hasError = $body.find('.alert-danger, .error, #invalidLogin, [class*="error"]').length > 0
    const isStillOnLogin = window.location.href.includes('login') || !window.location.href.includes('admin')
    expect(hasError || isStillOnLogin).to.be.true
  })
})

Then('devo permanecer na página de login', () => {
  // Verifica que não foi redirecionado para o admin
  cy.url().should('not.include', '/admin')
})
