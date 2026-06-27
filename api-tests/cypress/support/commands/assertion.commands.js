Cypress.Commands.add('assertBookingSchema', (booking) => {
  expect(booking, 'booking deve ter firstname').to.have.property('firstname').and.be.a('string')
  expect(booking, 'booking deve ter lastname').to.have.property('lastname').and.be.a('string')
  expect(booking, 'booking deve ter totalprice').to.have.property('totalprice').and.be.a('number')
  expect(booking, 'booking deve ter depositpaid').to.have.property('depositpaid').and.be.a('boolean')
  expect(booking, 'booking deve ter bookingdates').to.have.property('bookingdates').and.be.an('object')
  expect(booking.bookingdates, 'bookingdates deve ter checkin').to.have.property('checkin').and.be.a('string')
  expect(booking.bookingdates, 'bookingdates deve ter checkout').to.have.property('checkout').and.be.a('string')

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  expect(booking.bookingdates.checkin).to.match(dateRegex, 'checkin deve estar no formato YYYY-MM-DD')
  expect(booking.bookingdates.checkout).to.match(dateRegex, 'checkout deve estar no formato YYYY-MM-DD')

  const checkinDate = new Date(booking.bookingdates.checkin)
  const checkoutDate = new Date(booking.bookingdates.checkout)
  expect(checkinDate.getTime()).to.be.lessThan(
    checkoutDate.getTime(),
    'checkin deve ser anterior a checkout',
  )
})

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

Cypress.Commands.add('assertResponseHeaders', (response, expectedContentType = 'application/json') => {
  expect(response.headers).to.have.property('content-type')
  expect(response.headers['content-type']).to.include(expectedContentType)
})
