Cypress.Commands.add('createBooking', (bookingData) => {
  return cy.request({
    method: 'POST',
    url: '/booking',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: bookingData,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('getBooking', (bookingId) => {
  return cy.request({
    method: 'GET',
    url: `/booking/${bookingId}`,
    headers: { 'Accept': 'application/json' },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('getAllBookings', (filters = {}) => {
  return cy.request({
    method: 'GET',
    url: '/booking',
    qs: filters,
    headers: { 'Accept': 'application/json' },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('updateBooking', (bookingId, bookingData, token) => {
  return cy.request({
    method: 'PUT',
    url: `/booking/${bookingId}`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': `token=${token}`,
    },
    body: bookingData,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('patchBooking', (bookingId, partialData, token) => {
  return cy.request({
    method: 'PATCH',
    url: `/booking/${bookingId}`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': `token=${token}`,
    },
    body: partialData,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('deleteBooking', (bookingId, token) => {
  return cy.request({
    method: 'DELETE',
    url: `/booking/${bookingId}`,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `token=${token}`,
    },
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('createAndStoreBooking', (bookingData) => {
  cy.createBooking(bookingData).then((response) => {
    expect(response.status).to.eq(200)
    Cypress.env('LAST_BOOKING_ID', response.body.bookingid)
    cy.wrap(response.body.bookingid).as('bookingId')
  })
})
