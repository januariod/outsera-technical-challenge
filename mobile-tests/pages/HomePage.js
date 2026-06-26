/**
 * mobile-tests/pages/HomePage.js
 * Page Object para a home page de https://the-internet.herokuapp.com/
 */

const BasePage = require('./BasePage')

class HomePage extends BasePage {
  // ── URL ──────────────────────────────────────────────────────────────────
  get URL() { return 'https://the-internet.herokuapp.com/' }

  // ── Seletores ─────────────────────────────────────────────────────────────
  get pageTitle() { return 'h1.heading' }
  get subTitle() { return 'h2' }
  get linksList() { return '#content ul li a' }
  get loginLink() { return 'a[href="/login"]' }
  get checkboxesLink() { return 'a[href="/checkboxes"]' }
  get dropdownLink() { return 'a[href="/dropdown"]' }
  get dynamicContentLink() { return 'a[href="/dynamic_content"]' }
  get formAuthLink() { return 'a[href="/login"]' }
  get jsAlertsLink() { return 'a[href="/javascript_alerts"]' }

  // ── Ações ─────────────────────────────────────────────────────────────────

  async navigate() {
    await this.open(this.URL)
    return this
  }

  async clickLoginLink() {
    await this.tapElement(this.loginLink)
    return this
  }

  async clickCheckboxesLink() {
    await this.tapElement(this.checkboxesLink)
    return this
  }

  async clickDropdownLink() {
    await this.tapElement(this.dropdownLink)
    return this
  }

  // ── Asserções ─────────────────────────────────────────────────────────────

  async assertPageLoaded() {
    await this.assertVisible(this.pageTitle)
    await this.assertText(this.pageTitle, 'Welcome to the-internet')
    return this
  }

  async assertLinksVisible() {
    const links = await $$(this.linksList)
    expect(links.length).toBeGreaterThan(0)
    return this
  }

  async getTitle() {
    return this.getText(this.pageTitle)
  }

  async countLinks() {
    const links = await $$(this.linksList)
    return links.length
  }
}

module.exports = new HomePage()
