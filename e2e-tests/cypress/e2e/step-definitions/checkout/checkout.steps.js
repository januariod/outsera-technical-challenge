import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import InventoryPage from '../../pages/InventoryPage'
import CheckoutPage from '../../pages/CheckoutPage'

Given('que estou autenticado no sistema com perfil padrao', () => {
  cy.login()
})

Given('estou na página de produtos', () => {
  InventoryPage.verifyOnInventoryPage()
})

When('adiciono o produto "Mochila" ao carrinho', () => {
  InventoryPage.addBackpackToCart()
})

When('acesso o carrinho de compras', () => {
  InventoryPage.goToCart()
})

When('sigo para o checkout', () => {
  CheckoutPage.startCheckout()
})

When('preencho os dados de entrega com Nome {string}, Sobrenome {string} e CEP {string}', (nome, sobrenome, cep) => {
  CheckoutPage.fillDeliveryInformation(nome, sobrenome, cep)
})

When('confirmo o resumo da compra', () => {
  CheckoutPage.finishPurchase()
})

Then('devo ver a tela de sucesso com a mensagem {string}', (mensagemSucesso) => {
  CheckoutPage.verifySuccessMessage(mensagemSucesso)
})

Then('devo ver a mensagem de erro no checkout indicando {string}', (mensagemErro) => {
  CheckoutPage.verifyCheckoutError(mensagemErro)
})
