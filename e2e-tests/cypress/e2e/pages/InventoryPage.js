class InventoryPage {
  verifyOnInventoryPage() {
    cy.url().should('include', '/inventory.html')
    cy.get('.title').should('contain.text', 'Products')
  }

  addBackpackToCart() {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
  }

  goToCart() {
    cy.get('.shopping_cart_link').click()
  }
}
export default new InventoryPage()
