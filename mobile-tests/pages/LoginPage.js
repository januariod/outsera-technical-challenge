class LoginPage {
  get menuButton() { return $('~open menu') }
  get loginMenuOption() { return $('~menu item log in') }
  get usernameInput() { return $('~Username input field') }
  get passwordInput() { return $('~Password input field') }
  get loginButton() { return $('~Login button') }
  get productsTitle() { return $('//*[@text="Products"]') }

  async navigateToLogin() {
    await this.menuButton.waitForDisplayed()
    await this.menuButton.click()
    await this.loginMenuOption.waitForDisplayed()
    await this.loginMenuOption.click()
  }

  async login(username, password) {
    await this.usernameInput.waitForDisplayed()
    await this.usernameInput.setValue(username)
    await this.passwordInput.setValue(password)
    await this.loginButton.click()
  }
}
module.exports = new LoginPage()
