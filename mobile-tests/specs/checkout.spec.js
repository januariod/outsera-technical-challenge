const LoginPage = require('../pages/LoginPage.js')
const CheckoutPage = require('../pages/CheckoutPage.js')

describe('E2E Mobile - Fluxos de Autenticação e Checkout', () => {

  it('Deve realizar login com sucesso e navegar para a tela de produtos', async () => {
    await LoginPage.navigateToLogin()
    await LoginPage.login(process.env.MOBILE_USERNAME, process.env.MOBILE_PASSWORD)

    const isProductsVisible = await LoginPage.productsTitle.waitForDisplayed({ timeout: 5000 })
    expect(isProductsVisible).toBe(true)
  })

  it('Deve adicionar um item ao carrinho e concluir o formulário de entrega', async () => {
    await CheckoutPage.addItemToCartAndProceed()

    const shippingData = {
      name: 'Daniel QA',
      address: 'Rua da Automação, 123',
      city: 'São Paulo',
      zip: '12345-678',
      country: 'Brasil'
    }
    await CheckoutPage.fillShippingForm(shippingData)

    const isPaymentScreenVisible = await CheckoutPage.paymentScreenTitle.waitForDisplayed({ timeout: 5000 })
    expect(isPaymentScreenVisible).toBe(true)
  })
})
