import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import InventoryPage from '../../pages/InventoryPage'

const SORT_OPTION_BY_CRITERIO = {
  preco_menor_maior: 'lohi',
  preco_maior_menor: 'hilo',
  nome_z_a: 'za',
}

When('ordeno os produtos por {string}', (criterio) => {
  InventoryPage.sortBy(SORT_OPTION_BY_CRITERIO[criterio])
})

Then('os produtos devem estar ordenados por {string}', (criterio) => {
  if (criterio === 'preco_menor_maior') {
    InventoryPage.verifyPricesSortedAscending()
  } else if (criterio === 'preco_maior_menor') {
    InventoryPage.verifyPricesSortedDescending()
  } else if (criterio === 'nome_z_a') {
    InventoryPage.verifyNamesSortedDescending()
  }
})

When('acesso os detalhes do produto {string}', (productName) => {
  InventoryPage.openProductDetails(productName)
})

Then('devo visualizar a página de detalhes do produto', () => {
  InventoryPage.verifyOnProductDetailsPage()
})

When('volto para a lista de produtos', () => {
  InventoryPage.backToProducts()
})

When('adiciono o produto de slug {string} ao carrinho', (slug) => {
  InventoryPage.addProductToCart(slug)
})

When('removo o produto de slug {string} do carrinho', (slug) => {
  InventoryPage.removeProductFromCart(slug)
})

Then('o carrinho deve estar vazio', () => {
  InventoryPage.verifyCartBadgeAbsent()
})

When('realizo logout do sistema', () => {
  InventoryPage.logout()
})
