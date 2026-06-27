class CheckoutPage {
  startCheckout() {
    cy.get('[data-test="checkout"]').click()
  }

  fillDeliveryInformation(firstName, lastName, postalCode) {
    if (firstName) cy.get('[data-test="firstName"]').clear().type(firstName)
    if (lastName) cy.get('[data-test="lastName"]').clear().type(lastName)
    if (postalCode) cy.get('[data-test="postalCode"]').clear().type(postalCode)
    cy.get('[data-test="continue"]').click()
  }

  finishPurchase() {
    cy.get('[data-test="finish"]').click()
  }

  verifySuccessMessage(expectedMessage) {
    cy.get('.complete-header').should('be.visible').and('contain.text', expectedMessage)
  }

  verifyCheckoutError(expectedMessage) {
    cy.get('[data-test="error"]').should('be.visible').and('contain.text', expectedMessage)
  }
}
export default new CheckoutPage()
