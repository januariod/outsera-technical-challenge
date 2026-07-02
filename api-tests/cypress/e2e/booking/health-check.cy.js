describe('HEALTH CHECK - GET /ping', { tags: ['@smoke', '@health'] }, () => {
  it('deve confirmar que a API está no ar respondendo 201 Created', () => {
    cy.request({
      method: 'GET',
      url: '/ping',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201, 'API deve estar disponível (health check)')
    })
  })

  it('deve responder rapidamente ao health check', () => {
    cy.request({
      method: 'GET',
      url: '/ping',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.duration, 'health check deve responder em tempo hábil').to.be.lessThan(5000)
    })
  })
})
