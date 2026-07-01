/**
 * Page Object do fluxo de Carrinho e Checkout (SauceDemo).
 *
 * Seletores centralizados em `elements`. Os métodos de verificação cobrem não só
 * o comportamento principal (sucesso/erro), mas também o conteúdo do carrinho e o
 * resumo financeiro da compra (item, quantidade, preço, subtotal, imposto e total).
 */
class CheckoutPage {
  elements = {
    cartItem: () => cy.get('.cart_item'),
    itemName: () => cy.get('.inventory_item_name'),
    itemPrice: () => cy.get('.inventory_item_price'),
    itemQuantity: () => cy.get('.cart_quantity'),
    checkoutButton: () => cy.get('[data-test="checkout"]'),
    firstNameInput: () => cy.get('[data-test="firstName"]'),
    lastNameInput: () => cy.get('[data-test="lastName"]'),
    postalCodeInput: () => cy.get('[data-test="postalCode"]'),
    continueButton: () => cy.get('[data-test="continue"]'),
    finishButton: () => cy.get('[data-test="finish"]'),
    subtotalLabel: () => cy.get('.summary_subtotal_label'),
    taxLabel: () => cy.get('.summary_tax_label'),
    totalLabel: () => cy.get('.summary_total_label'),
    completeHeader: () => cy.get('.complete-header'),
    errorMessage: () => cy.get('[data-test="error"]'),
  }

  startCheckout() {
    this.elements.checkoutButton().click()
    return this
  }

  fillDeliveryInformation(firstName, lastName, postalCode) {
    if (firstName) this.elements.firstNameInput().clear().type(firstName)
    if (lastName) this.elements.lastNameInput().clear().type(lastName)
    if (postalCode) this.elements.postalCodeInput().clear().type(postalCode)
    this.elements.continueButton().click()
    return this
  }

  finishPurchase() {
    this.elements.finishButton().click()
    return this
  }

  verifySuccessMessage(expectedMessage) {
    this.elements.completeHeader().should('be.visible').and('contain.text', expectedMessage)
    return this
  }

  verifyCheckoutError(expectedMessage) {
    this.elements.errorMessage().should('be.visible').and('contain.text', expectedMessage)
    return this
  }

  /**
   * Valida um item presente no carrinho/resumo pelo nome, preço e quantidade.
   * @param {string} name  Nome exibido do produto.
   * @param {string} price Preço formatado (ex.: "$29.99").
   * @param {number} [quantity=1] Quantidade esperada.
   */
  verifyCartItem(name, price, quantity = 1) {
    this.elements.cartItem().should('have.length', 1)
    this.elements.itemName().should('have.text', name)
    this.elements.itemPrice().should('have.text', price)
    this.elements.itemQuantity().should('have.text', String(quantity))
    return this
  }

  /**
   * Valida o resumo financeiro da compra na tela de overview.
   * @param {{ subtotal: string, tax: string, total: string }} summary
   */
  verifyOrderSummary({ subtotal, tax, total }) {
    this.elements.subtotalLabel().should('contain.text', subtotal)
    this.elements.taxLabel().should('contain.text', tax)
    this.elements.totalLabel().should('contain.text', total)
    return this
  }
}
export default new CheckoutPage()
