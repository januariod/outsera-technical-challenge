class CheckoutPage {
  get firstProduct() { return $('~store item') }

  get addToCartButton() {
    return $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("Add To Cart button"))')
  }

  get cartBadge() { return $('~cart badge') }
  get proceedToCheckoutBtn() { return $('~Proceed To Checkout button') }

  get fullNameInput() { return $('~Full Name* input field') }
  get addressInput() { return $('~Address Line 1* input field') }

  get cityInput() {
    return $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("City* input field"))')
  }
  get zipInput() {
    return $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("Zip Code* input field"))')
  }
  get countryInput() {
    return $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("Country* input field"))')
  }

  get toPaymentButton() {
    return $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("To Payment button"))')
  }

  get paymentScreenTitle() { return $('//*[@text="Enter a payment method"]') }

  async addItemToCartAndProceed() {
    await this.firstProduct.waitForDisplayed()
    await this.firstProduct.click()

    await this.addToCartButton.waitForDisplayed()
    await this.addToCartButton.click()

    await this.cartBadge.click()
    await this.proceedToCheckoutBtn.waitForDisplayed()
    await this.proceedToCheckoutBtn.click()
  }

  async fillShippingForm(data) {
    await this.fullNameInput.waitForDisplayed()
    await this.fullNameInput.setValue(data.name)
    await this.addressInput.setValue(data.address)

    if (await driver.isKeyboardShown()) {
      await driver.hideKeyboard()
    }

    await this.cityInput.setValue(data.city)
    await this.zipInput.setValue(data.zip)

    if (await driver.isKeyboardShown()) {
      await driver.hideKeyboard()
    }

    await this.countryInput.setValue(data.country)

    if (await driver.isKeyboardShown()) {
      await driver.hideKeyboard()
    }

    await this.toPaymentButton.click()
  }
}
module.exports = new CheckoutPage()
