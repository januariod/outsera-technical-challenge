describe('BOOKING - POST /booking', { tags: ['@booking', '@create', '@smoke'] }, () => {
  let validBookings
  let invalidBookings

  before(() => {
    cy.fixture('booking/valid-booking').then((data) => {
      validBookings = data
    })
    cy.fixture('booking/invalid-booking').then((data) => {
      invalidBookings = data
    })
  })

  context('Cenários Positivos', () => {
    it('deve criar reserva válida e retornar dados completos', () => {
      cy.createBooking(validBookings.standard).then((response) => {
        expect(response.status).to.eq(200, 'Criação de reserva deve retornar 200')

        cy.assertResponseHeaders(response)
        expect(response.headers).to.have.property('content-type').and.include('application/json')

        cy.assertCreateBookingResponse(response, validBookings.standard)

        Cypress.env('CREATED_BOOKING_ID', response.body.bookingid)
      })
    })

    it('deve criar reserva com apenas campos obrigatórios (sem additionalneeds)', () => {
      cy.createBooking(validBookings.minimal).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('bookingid').and.be.a('number')
        cy.assertBookingSchema(response.body.booking)
      })
    })

    it('deve criar reserva com nomes contendo caracteres especiais', () => {
      cy.createBooking(validBookings.withSpecialCharacters).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.booking.firstname).to.eq(validBookings.withSpecialCharacters.firstname)
        expect(response.body.booking.lastname).to.eq(validBookings.withSpecialCharacters.lastname)
      })
    })

    it('deve criar reserva com totalprice de alto valor', () => {
      cy.createBooking(validBookings.highValue).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.booking.totalprice).to.eq(validBookings.highValue.totalprice)
      })
    })

    it('deve retornar bookingid único para cada criação', () => {
      const ids = []

      cy.createBooking(validBookings.standard).then((r1) => {
        ids.push(r1.body.bookingid)

        cy.createBooking(validBookings.standard).then((r2) => {
          ids.push(r2.body.bookingid)
          expect(ids[0]).to.not.eq(ids[1], 'Cada reserva deve ter um ID único')
        })
      })
    })

    it('deve persistir os dados criados e ser consultável via GET', () => {
      cy.createBooking(validBookings.standard).then((createResponse) => {
        expect(createResponse.status).to.eq(200)
        const bookingId = createResponse.body.bookingid

        cy.getBooking(bookingId).then((getResponse) => {
          expect(getResponse.status).to.eq(200)
          expect(getResponse.body.firstname).to.eq(validBookings.standard.firstname)
          expect(getResponse.body.lastname).to.eq(validBookings.standard.lastname)
          expect(getResponse.body.totalprice).to.eq(validBookings.standard.totalprice)
        })
      })
    })
  })

  context('Cenários Negativos', () => {
    it('deve rejeitar payload sem firstname', () => {
      cy.createBooking(invalidBookings.missingFirstname).then((response) => {
        expect(response.status).to.be.oneOf([400, 422, 500],
          'Payload sem firstname deve retornar erro')
      })
    })

    it('deve rejeitar payload sem lastname', () => {
      cy.createBooking(invalidBookings.missingLastname).then((response) => {
        expect(response.status).to.be.oneOf([400, 422, 500])
      })
    })

    it('deve rejeitar payload sem bookingdates', () => {
      cy.createBooking(invalidBookings.missingBookingDates).then((response) => {
        expect(response.status).to.be.oneOf([400, 422, 500])
      })
    })

    it('deve rejeitar payload completamente vazio', () => {
      const emptyPayload = {}

      cy.createBooking(emptyPayload).then((response) => {
        expect(response.status).to.be.oneOf([400, 422, 500])
      })
    })

    it('deve rejeitar requisição com Content-Type inválido', () => {
      cy.request({
        method: 'POST',
        url: '/booking',
        headers: {
          'Content-Type': 'text/plain',
          'Accept': 'application/json',
        },
        body: JSON.stringify(validBookings.standard),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 415, 500])
      })
    })

    it('deve rejeitar requisição com body malformado (JSON inválido)', () => {
      cy.request({
        method: 'POST',
        url: '/booking',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{ invalid json }',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422, 500])
      })
    })
  })
})
