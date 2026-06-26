/**
 * api-tests/cypress/support/commands/assertion.commands.js
 * Comandos de asserção customizados para validação de contratos de API.
 *
 * Decisão técnica: centralizar asserções de schema/contrato evita duplicação
 * e garante consistência na validação entre os spec files.
 */

/**
 * cy.assertBookingSchema(booking)
 * Valida que um objeto de reserva possui todos os campos obrigatórios com tipos corretos.
 * Implementa validação de contrato sem dependência externa de schema validator.
 */
Cypress.Commands.add('assertBookingSchema', (booking) => {
  // Campos obrigatórios de nível superior
  expect(booking, 'booking deve ter firstname').to.have.property('firstname').and.be.a('string')
  expect(booking, 'booking deve ter lastname').to.have.property('lastname').and.be.a('string')
  expect(booking, 'booking deve ter totalprice').to.have.property('totalprice').and.be.a('number')
  expect(booking, 'booking deve ter depositpaid').to.have.property('depositpaid').and.be.a('boolean')
  expect(booking, 'booking deve ter bookingdates').to.have.property('bookingdates').and.be.an('object')

  // Campos de datas
  expect(booking.bookingdates, 'bookingdates deve ter checkin').to.have.property('checkin').and.be.a('string')
  expect(booking.bookingdates, 'bookingdates deve ter checkout').to.have.property('checkout').and.be.a('string')

  // Formato de datas (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  expect(booking.bookingdates.checkin).to.match(dateRegex, 'checkin deve estar no formato YYYY-MM-DD')
  expect(booking.bookingdates.checkout).to.match(dateRegex, 'checkout deve estar no formato YYYY-MM-DD')

  // Regra de negócio: checkin antes de checkout
  const checkinDate = new Date(booking.bookingdates.checkin)
  const checkoutDate = new Date(booking.bookingdates.checkout)
  expect(checkinDate.getTime()).to.be.lessThan(
    checkoutDate.getTime(),
    'checkin deve ser anterior a checkout',
  )
})

/**
 * cy.assertCreateBookingResponse(response, expectedData)
 * Valida a resposta completa de criação de reserva (POST /booking).
 */
Cypress.Commands.add('assertCreateBookingResponse', (response, expectedData) => {
  expect(response.status).to.eq(200, 'Status deve ser 200 para criação')
  expect(response.headers).to.have.property('content-type').and.include('application/json')

  const body = response.body
  expect(body).to.have.property('bookingid').and.be.a('number').and.be.greaterThan(0)
  expect(body).to.have.property('booking').and.be.an('object')

  cy.assertBookingSchema(body.booking)

  if (expectedData) {
    expect(body.booking.firstname).to.eq(expectedData.firstname)
    expect(body.booking.lastname).to.eq(expectedData.lastname)
    expect(body.booking.totalprice).to.eq(expectedData.totalprice)
    expect(body.booking.depositpaid).to.eq(expectedData.depositpaid)
  }
})

/**
 * cy.assertResponseHeaders(response, expectedContentType)
 * Valida headers padrão esperados em respostas da API.
 */
Cypress.Commands.add('assertResponseHeaders', (response, expectedContentType = 'application/json') => {
  expect(response.headers).to.have.property('content-type')
  expect(response.headers['content-type']).to.include(expectedContentType)
})

/**
 * cy.assertErrorResponse(response, expectedStatus, expectedMessage)
 * Valida respostas de erro da API.
 */
Cypress.Commands.add('assertErrorResponse', (response, expectedStatus, expectedMessage = null) => {
  expect(response.status).to.eq(expectedStatus, `Status esperado: ${expectedStatus}`)
  if (expectedMessage) {
    const bodyText = typeof response.body === 'string' ? response.body : JSON.stringify(response.body)
    expect(bodyText).to.include(expectedMessage)
  }
})
