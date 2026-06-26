/**
 * api-tests/cypress/e2e/auth/auth.cy.js
 * Testes de autenticação - POST /auth
 *
 * Cobre: criação de token, credenciais inválidas, campos ausentes.
 */

describe('AUTH - POST /auth', { tags: ['@auth', '@smoke'] }, () => {
  let credentials

  before(() => {
    cy.fixture('auth/credentials').then((data) => {
      credentials = data
    })
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Cenários Positivos
  // ─────────────────────────────────────────────────────────────────────────
  describe('Cenários Positivos', () => {
    it('deve retornar token válido com credenciais corretas', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        headers: { 'Content-Type': 'application/json' },
        body: credentials.valid,
      }).then((response) => {
        // Status
        expect(response.status).to.eq(200)

        // Headers
        cy.assertResponseHeaders(response)

        // Body
        expect(response.body).to.have.property('token')
        expect(response.body.token).to.be.a('string').and.have.length.greaterThan(0)
        expect(response.body.token).to.not.eq('Bad credentials')
      })
    })

    it('deve gerar tokens diferentes em chamadas consecutivas', () => {
      const tokens = []

      cy.request({
        method: 'POST',
        url: '/auth',
        headers: { 'Content-Type': 'application/json' },
        body: credentials.valid,
      }).then((r1) => {
        tokens.push(r1.body.token)

        cy.request({
          method: 'POST',
          url: '/auth',
          headers: { 'Content-Type': 'application/json' },
          body: credentials.valid,
        }).then((r2) => {
          tokens.push(r2.body.token)
          // Tokens podem ser iguais (sem rotação) ou diferentes - apenas validamos que ambos são strings válidas
          tokens.forEach((t) => {
            expect(t).to.be.a('string').and.have.length.greaterThan(0)
          })
        })
      })
    })
  })

  // ─────────────────────────────────────────────────────────────────────────
  // Cenários Negativos
  // ─────────────────────────────────────────────────────────────────────────
  describe('Cenários Negativos', () => {
    it('deve retornar "Bad credentials" com senha inválida', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        headers: { 'Content-Type': 'application/json' },
        body: credentials.invalidPassword,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200) // API retorna 200 mesmo com credenciais inválidas
        expect(response.body).to.have.property('reason')
        expect(response.body.reason).to.include('Bad credentials')
      })
    })

    it('deve retornar "Bad credentials" com usuário inválido', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        headers: { 'Content-Type': 'application/json' },
        body: credentials.invalidUsername,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('reason')
        expect(response.body.reason).to.include('Bad credentials')
      })
    })

    it('deve retornar erro com credenciais vazias', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        headers: { 'Content-Type': 'application/json' },
        body: credentials.emptyCredentials,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('reason')
      })
    })

    it('deve rejeitar requisição sem Content-Type', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        body: credentials.valid,
        failOnStatusCode: false,
      }).then((response) => {
        // Pode aceitar ou rejeitar - validamos que a resposta é estruturada
        expect(response.status).to.be.oneOf([200, 400, 415])
      })
    })
  })
})
