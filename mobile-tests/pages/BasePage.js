/**
 * mobile-tests/pages/BasePage.js
 * Classe base para Page Objects mobile.
 * Encapsula operações Appium/WebDriverIO comuns.
 */

class BasePage {
  /**
   * Navega para uma URL no browser mobile.
   * @param {string} url
   */
  async open(url) {
    await browser.url(url)
    return this
  }

  /**
   * Aguarda elemento ficar disponível e retorna.
   * @param {string} selector
   * @param {number} timeout
   */
  async waitForElement(selector, timeout = 15000) {
    const element = await $(selector)
    await element.waitForDisplayed({ timeout })
    return element
  }

  /**
   * Aguarda elemento e clica nele.
   * @param {string} selector
   */
  async tapElement(selector) {
    const element = await this.waitForElement(selector)
    await element.click()
    return this
  }

  /**
   * Limpa campo e digita texto.
   * @param {string} selector
   * @param {string} text
   */
  async typeText(selector, text) {
    const element = await this.waitForElement(selector)
    await element.clearValue()
    await element.setValue(text)
    return this
  }

  /**
   * Obtém texto de um elemento.
   * @param {string} selector
   * @returns {string}
   */
  async getText(selector) {
    const element = await this.waitForElement(selector)
    return element.getText()
  }

  /**
   * Verifica que elemento está visível.
   * @param {string} selector
   */
  async assertVisible(selector) {
    const element = await this.waitForElement(selector)
    const isDisplayed = await element.isDisplayed()
    expect(isDisplayed).toBe(true)
    return this
  }

  /**
   * Verifica que elemento contém texto.
   * @param {string} selector
   * @param {string} expectedText
   */
  async assertText(selector, expectedText) {
    const text = await this.getText(selector)
    expect(text).toContain(expectedText)
    return this
  }

  /**
   * Verifica URL atual do browser.
   * @param {string} expectedUrl
   */
  async assertUrl(expectedUrl) {
    const currentUrl = await browser.getUrl()
    expect(currentUrl).toContain(expectedUrl)
    return this
  }

  /**
   * Scroll para o final da página.
   */
  async scrollToBottom() {
    await browser.execute('window.scrollTo(0, document.body.scrollHeight)')
    return this
  }

  /**
   * Captura screenshot.
   * @param {string} name
   */
  async takeScreenshot(name) {
    await browser.saveScreenshot(`reports/mobile/screenshots/${name}-${Date.now()}.png`)
    return this
  }

  /**
   * Aguarda n milissegundos.
   * @param {number} ms
   */
  async pause(ms = 1000) {
    await browser.pause(ms)
    return this
  }
}

module.exports = BasePage
