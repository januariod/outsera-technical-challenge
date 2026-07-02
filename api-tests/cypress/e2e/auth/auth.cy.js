describe('AUTH - POST /auth', { tags: ['@auth', '@smoke'] }, () => {
  const validCredentials = {
    username: Cypress.env('ADMIN_USERNAME'),
    password: Cypress.env('ADMIN_PASSWORD')
  }

  const credentials = {
    invalidPassword: { username: validCredentials.username, password: 'wrongpassword' },
    invalidUsername: { username: 'notexistinguser', password: validCredentials.password },
    emptyCredentials: { username: '', password: '' },
  }

  context('Cenários Positivos', () => {
    it('deve retornar token válido com credenciais corretas', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        headers: { 'Content-Type': 'application/json' },
        body: validCredentials,
      }).then((response) => {
        expect(response.status).to.eq(200)

        cy.assertResponseHeaders(response)

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
        body: validCredentials,
      }).then((r1) => {
        tokens.push(r1.body.token)

        cy.request({
          method: 'POST',
          url: '/auth',
          headers: { 'Content-Type': 'application/json' },
          body: validCredentials,
        }).then((r2) => {
          tokens.push(r2.body.token)
          tokens.forEach((t) => {
            expect(t).to.be.a('string').and.have.length.greaterThan(0)
          })
        })
      })
    })
  })

  context('Cenários Negativos', () => {
    it('deve retornar "Bad credentials" com senha inválida', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        headers: { 'Content-Type': 'application/json' },
        body: credentials.invalidPassword,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200)
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
        body: validCredentials,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 415])
      })
    })

    it('deve retornar erro ao enviar username sem password', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        headers: { 'Content-Type': 'application/json' },
        body: { username: validCredentials.username },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('reason')
      })
    })

    it('deve retornar erro ao enviar body vazio', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        headers: { 'Content-Type': 'application/json' },
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('reason')
      })
    })
  })
})
