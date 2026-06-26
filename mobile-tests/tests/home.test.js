/**
 * mobile-tests/tests/home.test.js
 * Testes mobile para a home page de https://the-internet.herokuapp.com/
 *
 * Cobre: abertura da aplicação, validação de título, listagem de links,
 *        navegação entre telas.
 */

const HomePage = require('../pages/HomePage')
const { getDeviceInfo } = require('../helpers/driver-helper')

describe('Mobile - The Internet - Home Page', () => {
  before(async () => {
    const info = await getDeviceInfo()
    console.log(`\n📱 Dispositivo: ${info.platform} | ${info.deviceName} | v${info.version}`)
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Abertura e carregamento
  // ─────────────────────────────────────────────────────────────────────────

  describe('Abertura da Aplicação', () => {
    before(async () => {
      await HomePage.navigate()
    })

    it('deve abrir a aplicação e exibir título principal', async () => {
      await HomePage.assertPageLoaded()
    })

    it('deve exibir o título correto na página', async () => {
      const title = await HomePage.getTitle()
      expect(title).toContain('Welcome to the-internet')
    })

    it('deve exibir a lista de funcionalidades disponíveis', async () => {
      await HomePage.assertLinksVisible()
    })

    it('deve ter pelo menos 30 links de funcionalidades', async () => {
      const count = await HomePage.countLinks()
      expect(count).toBeGreaterThanOrEqual(30)
    })
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Navegação entre telas
  // ─────────────────────────────────────────────────────────────────────────

  describe('Navegação entre Telas', () => {
    beforeEach(async () => {
      await HomePage.navigate()
    })

    it('deve navegar para a tela de Login ao clicar no link Form Authentication', async () => {
      await HomePage.clickLoginLink()
      await browser.pause(1000)
      const url = await browser.getUrl()
      expect(url).toContain('/login')
    })

    it('deve navegar para a tela de Checkboxes', async () => {
      await HomePage.clickCheckboxesLink()
      await browser.pause(1000)
      const url = await browser.getUrl()
      expect(url).toContain('/checkboxes')
    })

    it('deve navegar para a tela de Dropdown', async () => {
      await HomePage.clickDropdownLink()
      await browser.pause(1000)
      const url = await browser.getUrl()
      expect(url).toContain('/dropdown')
    })

    it('deve retornar à home após navegar para subpágina', async () => {
      await HomePage.clickLoginLink()
      await browser.pause(500)
      await browser.url('https://the-internet.herokuapp.com/')
      await browser.pause(500)
      const url = await browser.getUrl()
      expect(url).toBe('https://the-internet.herokuapp.com/')
    })
  })
})
