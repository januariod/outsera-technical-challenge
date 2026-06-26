/**
 * mobile-tests/pages/CheckboxesPage.js
 * Page Object para a tela de checkboxes de https://the-internet.herokuapp.com/checkboxes
 */

const BasePage = require('./BasePage')

class CheckboxesPage extends BasePage {
  get URL() { return 'https://the-internet.herokuapp.com/checkboxes' }

  get pageTitle() { return 'h3' }
  get checkboxes() { return '#checkboxes input[type="checkbox"]' }
  get firstCheckbox() { return '#checkboxes input:nth-child(1)' }
  get secondCheckbox() { return '#checkboxes input:nth-child(3)' }

  async navigate() {
    await this.open(this.URL)
    return this
  }

  async getCheckboxes() {
    return $$(this.checkboxes)
  }

  async toggleFirstCheckbox() {
    await this.tapElement(this.firstCheckbox)
    return this
  }

  async toggleSecondCheckbox() {
    await this.tapElement(this.secondCheckbox)
    return this
  }

  async assertCheckboxChecked(selector) {
    const el = await $(selector)
    const isSelected = await el.isSelected()
    expect(isSelected).toBe(true)
    return this
  }

  async assertCheckboxUnchecked(selector) {
    const el = await $(selector)
    const isSelected = await el.isSelected()
    expect(isSelected).toBe(false)
    return this
  }

  async assertPageLoaded() {
    await this.assertVisible(this.pageTitle)
    await this.assertText(this.pageTitle, 'Checkboxes')
    return this
  }
}

module.exports = new CheckboxesPage()
