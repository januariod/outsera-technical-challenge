/**
 * Page Object da tela de Produtos / Inventário (SauceDemo).
 *
 * Seletores centralizados em `elements` para reaproveitamento em qualquer step.
 * Métodos parametrizados (ex.: `addProductToCart`) evitam duplicação e permitem
 * escalar para outros produtos sem criar um método por item.
 */
class InventoryPage {
  elements = {
    title: () => cy.get('.title'),
    inventoryItem: () => cy.get('.inventory_item'),
    itemName: () => cy.get('.inventory_item_name'),
    itemPrice: () => cy.get('.inventory_item_price'),
    cartBadge: () => cy.get('.shopping_cart_badge'),
    cartLink: () => cy.get('.shopping_cart_link'),
    addToCartButton: (productSlug) => cy.get(`[data-test="add-to-cart-${productSlug}"]`),
  }

  verifyOnInventoryPage() {
    cy.url().should('include', '/inventory.html')
    this.elements.title().should('contain.text', 'Products')
    return this
  }

  /**
   * Adiciona um produto ao carrinho pelo seu slug data-test.
   * @param {string} [productSlug='sauce-labs-backpack']
   */
  addProductToCart(productSlug = 'sauce-labs-backpack') {
    this.elements.addToCartButton(productSlug).click()
    return this
  }

  addBackpackToCart() {
    return this.addProductToCart('sauce-labs-backpack')
  }

  goToCart() {
    this.elements.cartLink().click()
    return this
  }

  verifyCartBadgeCount(expectedCount) {
    this.elements.cartBadge().should('be.visible').and('have.text', String(expectedCount))
    return this
  }
}
export default new InventoryPage()
