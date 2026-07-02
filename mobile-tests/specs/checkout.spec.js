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

  it('Deve remover um item do carrinho e o carrinho deve ficar vazio', async () => {
    await LoginPage.returnToMenuAccessibleScreen()
    await LoginPage.logout()
    await LoginPage.navigateToLogin()
    await LoginPage.login(process.env.MOBILE_USERNAME, process.env.MOBILE_PASSWORD)
    await LoginPage.productsTitle.waitForDisplayed({ timeout: 5000 })

    await CheckoutPage.addFirstItemToCart()
    const isBadgeCountVisibleBeforeRemoval = await CheckoutPage.cartBadgeCount.waitForDisplayed({ timeout: 5000 })
    expect(isBadgeCountVisibleBeforeRemoval).toBe(true)

    await CheckoutPage.removeFirstItemFromCart()

    const isEmptyCartMessageVisible = await CheckoutPage.emptyCartMessage.waitForDisplayed({ timeout: 5000 })
    expect(isEmptyCartMessageVisible).toBe(true)
  })

  it('Deve realizar logout com sucesso e retornar para a tela de login', async () => {
    await LoginPage.logout()

    const isLoginMenuVisible = await LoginPage.menuButton.waitForDisplayed({ timeout: 5000 })
    expect(isLoginMenuVisible).toBe(true)
  })

  it('Não deve permitir login com credenciais inválidas', async () => {
    await LoginPage.navigateToLogin()
    await LoginPage.login('invalid_user', 'wrong_password')

    const isErrorVisible = await LoginPage.errorMessage.waitForDisplayed({ timeout: 5000 })
    expect(isErrorVisible).toBe(true)

    const errorText = await LoginPage.errorMessageText.getText()
    expect(errorText).toContain('Provided credentials do not match any user in this service.')
  })
})
