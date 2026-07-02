class LoginPage {
  get menuButton() { return $('~open menu') }
  get loginMenuOption() { return $('~menu item log in') }
  get logoutMenuOption() { return $('~menu item log out') }
  get usernameInput() { return $('~Username input field') }
  get passwordInput() { return $('~Password input field') }
  get loginButton() { return $('~Login button') }
  get productsTitle() { return $('//*[@text="Products"]') }
  get errorMessage() { return $('~generic-error-message') }
  get errorMessageText() { return $('~generic-error-message').$('android.widget.TextView') }
  get logoutConfirmButton() { return $('//android.widget.Button[@text="LOG OUT"]') }
  get logoutSuccessOkButton() { return $('//android.widget.Button[@text="OK"]') }

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

  async logout() {
    await this.menuButton.waitForDisplayed()
    await this.menuButton.click()
    await this.logoutMenuOption.waitForDisplayed()
    await this.logoutMenuOption.click()
    await this.logoutConfirmButton.waitForDisplayed()
    await this.logoutConfirmButton.click()
    await this.logoutSuccessOkButton.waitForDisplayed()
    await this.logoutSuccessOkButton.click()
  }

  async returnToMenuAccessibleScreen(maxAttempts = 3) {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (await this.menuButton.isDisplayed().catch(() => false)) {
        return
      }
      await driver.back()
      await driver.pause(800)
    }
    await this.menuButton.waitForDisplayed()
  }
}
module.exports = new LoginPage()
