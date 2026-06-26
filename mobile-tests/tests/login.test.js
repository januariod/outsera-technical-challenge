/**
 * mobile-tests/tests/login.test.js
 * Testes mobile para login em https://the-internet.herokuapp.com/login
 *
 * Cobre: login válido, inválido, campos vazios, logout, validação de textos.
 */

const LoginPage = require('../pages/LoginPage')
const CheckboxesPage = require('../pages/CheckboxesPage')

describe('Mobile - The Internet - Form Authentication', () => {
  // ─────────────────────────────────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────────────────────────────────

  describe('Abertura da Tela de Login', () => {
    before(async () => {
      await LoginPage.navigate()
    })

    it('deve abrir a tela de login corretamente', async () => {
      await LoginPage.assertLoginPageLoaded()
    })

    it('deve exibir o campo de usuário', async () => {
      await LoginPage.assertVisible(LoginPage.usernameInput)
    })

    it('deve exibir o campo de senha', async () => {
      await LoginPage.assertVisible(LoginPage.passwordInput)
    })

    it('deve exibir o botão de login', async () => {
      await LoginPage.assertVisible(LoginPage.loginButton)
    })
  })

  describe('Login com Credenciais Válidas', () => {
    beforeEach(async () => {
      await LoginPage.navigate()
    })

    it('deve realizar login com sucesso com credenciais válidas', async () => {
      await LoginPage.login('tomsmith', 'SuperSecretPassword!')
      await LoginPage.assertLoginSuccess()
    })

    it('deve exibir mensagem de boas-vindas após login', async () => {
      await LoginPage.login('tomsmith', 'SuperSecretPassword!')
      await LoginPage.assertSuccessMessageContains('You logged into a secure area!')
    })

    it('deve exibir botão de logout após login', async () => {
      await LoginPage.login('tomsmith', 'SuperSecretPassword!')
      await LoginPage.assertVisible(LoginPage.logoutButton)
    })
  })

  describe('Logout', () => {
    beforeEach(async () => {
      await LoginPage.navigate()
      await LoginPage.login('tomsmith', 'SuperSecretPassword!')
      await LoginPage.assertLoginSuccess()
    })

    it('deve realizar logout com sucesso', async () => {
      await LoginPage.logout()
      await browser.pause(500)
      const url = await browser.getUrl()
      expect(url).toContain('/login')
    })

    it('deve exibir mensagem de logout após sair', async () => {
      await LoginPage.logout()
      await LoginPage.assertVisible(LoginPage.successMessage)
    })
  })

  describe('Login com Credenciais Inválidas', () => {
    beforeEach(async () => {
      await LoginPage.navigate()
    })

    it('deve exibir erro com senha incorreta', async () => {
      await LoginPage.login('tomsmith', 'senhaErrada')
      await LoginPage.assertLoginFailed()
    })

    it('deve exibir erro com usuário incorreto', async () => {
      await LoginPage.login('usuarioInexistente', 'SuperSecretPassword!')
      await LoginPage.assertLoginFailed()
    })

    it('deve exibir mensagem de erro específica para credenciais inválidas', async () => {
      await LoginPage.login('wronguser', 'wrongpassword')
      await LoginPage.assertErrorMessageContains('Your username is invalid')
    })

    it('deve permanecer na tela de login após tentativa inválida', async () => {
      await LoginPage.login('wronguser', 'wrongpassword')
      await LoginPage.assertUrl('/login')
    })
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Checkboxes (interação com componentes)
  // ─────────────────────────────────────────────────────────────────────────

  describe('Interação com Componentes - Checkboxes', () => {
    before(async () => {
      await CheckboxesPage.navigate()
    })

    it('deve carregar a página de checkboxes', async () => {
      await CheckboxesPage.assertPageLoaded()
    })

    it('deve ter dois checkboxes visíveis', async () => {
      const checkboxes = await CheckboxesPage.getCheckboxes()
      expect(checkboxes.length).toBe(2)
    })

    it('deve alternar estado do primeiro checkbox', async () => {
      const checkboxes = await CheckboxesPage.getCheckboxes()
      const initialState = await checkboxes[0].isSelected()
      await CheckboxesPage.toggleFirstCheckbox()
      const newState = await checkboxes[0].isSelected()
      expect(newState).toBe(!initialState)
    })

    it('deve validar texto da página de checkboxes', async () => {
      await CheckboxesPage.assertText(CheckboxesPage.pageTitle, 'Checkboxes')
    })
  })
})
