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

  verifyCartItem(name, price, quantity = 1) {
    this.elements.cartItem().should('have.length', 1)
    this.elements.itemName().should('have.text', name)
    this.elements.itemPrice()
      .should('have.text', price)
      .invoke('text')
      .should('match', /^\$\d+\.\d{2}$/)
    this.elements.itemQuantity().should('have.text', String(quantity))
    return this
  }

  verifyOrderSummary({ subtotal, tax, total }) {
    this.elements.subtotalLabel().should('contain.text', subtotal)
    this.elements.taxLabel().should('contain.text', tax)
    this.elements.totalLabel().should('contain.text', total)

    this.elements.totalLabel().invoke('text').then((totalText) => {
      const parseMoney = (text) => parseFloat(text.replace(/[^0-9.]/g, ''))
      const subtotalValue = parseMoney(subtotal)
      const taxValue = parseMoney(tax)
      const totalValue = parseMoney(totalText)

      expect(totalValue).to.be.closeTo(
        subtotalValue + taxValue,
        0.01,
        'Total deve ser igual a subtotal + imposto',
      )
    })
    return this
  }
}
export default new CheckoutPage()
