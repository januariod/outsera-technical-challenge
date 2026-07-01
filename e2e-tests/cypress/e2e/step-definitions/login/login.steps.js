import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import LoginPage from '../../pages/LoginPage'
import InventoryPage from '../../pages/InventoryPage'

Given('que estou na página de login do e-commerce', () => {
  LoginPage.visit()
})

When('informo o usuário {string} e a senha {string}', (username, password) => {
  LoginPage.fillUsername(username)
  LoginPage.fillPassword(password)
})

When('informo minhas credenciais válidas', () => {
  LoginPage.fillUsername(Cypress.env('SAUCE_USERNAME'))
  LoginPage.fillPassword(Cypress.env('SAUCE_PASSWORD'))
})

When('clico no botão de login', () => {
  LoginPage.clickLogin()
})

Then('a navegação deve ser bem-sucedida para a página de produtos', () => {
  InventoryPage.verifyOnInventoryPage()
})

Then('devo ver a mensagem de erro {string}', (mensagemErro) => {
  LoginPage.verifyErrorMessage(mensagemErro)
})

Then('devo permanecer na página de login', () => {
  LoginPage.verifyOnLoginPage()
})
