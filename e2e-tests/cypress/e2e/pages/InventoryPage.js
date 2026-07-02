class InventoryPage {
  elements = {
    title: () => cy.get('.title'),
    inventoryItem: () => cy.get('.inventory_item'),
    itemName: () => cy.get('.inventory_item_name'),
    itemPrice: () => cy.get('.inventory_item_price'),
    cartBadge: () => cy.get('.shopping_cart_badge'),
    cartLink: () => cy.get('.shopping_cart_link'),
    addToCartButton: (productSlug) => cy.get(`[data-test="add-to-cart-${productSlug}"]`),
    removeButton: (productSlug) => cy.get(`[data-test="remove-${productSlug}"]`),
    sortDropdown: () => cy.get('[data-test="product-sort-container"]'),
    burgerMenuButton: () => cy.get('#react-burger-menu-btn'),
    logoutLink: () => cy.get('#logout_sidebar_link'),
    backToProductsButton: () => cy.get('[data-test="back-to-products"]'),
  }

  verifyOnInventoryPage() {
    cy.url().should('include', '/inventory.html')
    this.elements.title().should('contain.text', 'Products')
    return this
  }

  addProductToCart(productSlug = 'sauce-labs-backpack') {
    this.elements.addToCartButton(productSlug).click()
    return this
  }

  addBackpackToCart() {
    return this.addProductToCart('sauce-labs-backpack')
  }

  removeProductFromCart(productSlug) {
    this.elements.removeButton(productSlug).click()
    return this
  }

  goToCart() {
    this.elements.cartLink().click()
    return this
  }

  verifyCartBadgeCount(expectedCount) {
    this.elements.cartBadge().should('be.visible').and('have.text', String(expectedCount))
    return this
  }

  verifyCartBadgeAbsent() {
    this.elements.cartBadge().should('not.exist')
    return this
  }

  sortBy(optionValue) {
    this.elements.sortDropdown().select(optionValue)
    return this
  }

  verifyPricesSortedAscending() {
    this.elements.itemPrice().then(($prices) => {
      const values = [...$prices].map((el) => parseFloat(el.textContent.replace('$', '')))
      const sorted = [...values].sort((a, b) => a - b)
      expect(values).to.deep.equal(sorted, 'Preços devem estar em ordem crescente')
    })
    return this
  }

  verifyPricesSortedDescending() {
    this.elements.itemPrice().then(($prices) => {
      const values = [...$prices].map((el) => parseFloat(el.textContent.replace('$', '')))
      const sorted = [...values].sort((a, b) => b - a)
      expect(values).to.deep.equal(sorted, 'Preços devem estar em ordem decrescente')
    })
    return this
  }

  verifyNamesSortedDescending() {
    this.elements.itemName().then(($names) => {
      const values = [...$names].map((el) => el.textContent)
      const sorted = [...values].sort((a, b) => b.localeCompare(a))
      expect(values).to.deep.equal(sorted, 'Nomes devem estar em ordem alfabética decrescente (Z-A)')
    })
    return this
  }

  openProductDetails(productName) {
    this.elements.itemName().contains(productName).click()
    return this
  }

  verifyOnProductDetailsPage() {
    cy.url().should('include', '/inventory-item.html')
    return this
  }

  backToProducts() {
    this.elements.backToProductsButton().click()
    return this
  }

  logout() {
    this.elements.burgerMenuButton().click()
    this.elements.logoutLink().should('be.visible').click()
    return this
  }
}
export default new InventoryPage()

