/**
 * api-tests/cypress/support/commands/booking.commands.js
 * Comandos customizados para operações CRUD de reservas.
 *
 * Decisão técnica: encapsulamos cy.request() em comandos nomeados para:
 * - Reutilização sem repetição de código
 * - Erros mais legíveis nos logs
 * - Facilidade de manutenção (URL, headers centralizados)
 */

/**
 * cy.createBooking(bookingData)
 * Cria uma nova reserva via POST /booking
 *
 * @param {Object} bookingData - Dados da reserva
 * @returns Cypress chainable com a resposta completa
 */
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

/**
 * cy.getBooking(bookingId)
 * Busca uma reserva por ID via GET /booking/:id
 *
 * @param {number} bookingId - ID da reserva
 */
Cypress.Commands.add('getBooking', (bookingId) => {
  return cy.request({
    method: 'GET',
    url: `/booking/${bookingId}`,
    headers: { 'Accept': 'application/json' },
    failOnStatusCode: false,
  })
})

/**
 * cy.getAllBookings(filters)
 * Lista todas as reservas via GET /booking com filtros opcionais
 *
 * @param {Object} filters - Filtros: { firstname, lastname, checkin, checkout }
 */
Cypress.Commands.add('getAllBookings', (filters = {}) => {
  return cy.request({
    method: 'GET',
    url: '/booking',
    qs: filters,
    headers: { 'Accept': 'application/json' },
    failOnStatusCode: false,
  })
})

/**
 * cy.updateBooking(bookingId, bookingData, token)
 * Atualiza completamente uma reserva via PUT /booking/:id
 *
 * @param {number} bookingId - ID da reserva
 * @param {Object} bookingData - Dados completos de atualização
 * @param {string} token - Token de autenticação
 */
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

/**
 * cy.patchBooking(bookingId, partialData, token)
 * Atualiza parcialmente uma reserva via PATCH /booking/:id
 *
 * @param {number} bookingId - ID da reserva
 * @param {Object} partialData - Dados parciais de atualização
 * @param {string} token - Token de autenticação
 */
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

/**
 * cy.deleteBooking(bookingId, token)
 * Remove uma reserva via DELETE /booking/:id
 *
 * @param {number} bookingId - ID da reserva
 * @param {string} token - Token de autenticação
 */
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

/**
 * cy.createAndStoreBooking(bookingData)
 * Helper de conveniência: cria uma reserva e armazena o ID para uso posterior.
 * Falha o teste se a criação não for bem-sucedida.
 */
Cypress.Commands.add('createAndStoreBooking', (bookingData) => {
  cy.createBooking(bookingData).then((response) => {
    expect(response.status).to.eq(200)
    Cypress.env('LAST_BOOKING_ID', response.body.bookingid)
    cy.wrap(response.body.bookingid).as('bookingId')
  })
})
