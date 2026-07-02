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

Then('o contador do carrinho deve exibir {string}', (quantidade) => {
  InventoryPage.verifyCartBadgeCount(quantidade)
})

Then('o carrinho deve conter o item {string} com preço {string} e quantidade {string}', (nome, preco, quantidade) => {
  CheckoutPage.verifyCartItem(nome, preco, Number(quantidade))
})

When('sigo para o checkout', () => {
  CheckoutPage.startCheckout()
})

When('preencho os dados de entrega com Nome {string}, Sobrenome {string} e CEP {string}', (nome, sobrenome, cep) => {
  CheckoutPage.fillDeliveryInformation(nome, sobrenome, cep)
})

Then('o resumo da compra deve exibir subtotal {string}, imposto {string} e total {string}', (subtotal, imposto, total) => {
  CheckoutPage.verifyOrderSummary({ subtotal, tax: imposto, total })
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

When('cancelo o checkout', () => {
  CheckoutPage.cancelCheckout()
})

Then('devo retornar para a página do carrinho de compras', () => {
  CheckoutPage.verifyOnCartPage()
})
