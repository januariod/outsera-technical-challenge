describe('BOOKING - PUT & PATCH /booking/:id', { tags: ['@booking', '@update'] }, () => {
  let authToken
  let bookingId
  let updateData

  before(() => {
    cy.fixture('booking/update-booking').then((data) => {
      updateData = data
    })

    cy.createAuthToken().then((token) => {
      authToken = token
    })
  })

  beforeEach(() => {
    cy.createBooking({
      firstname: 'Original',
      lastname: 'Name',
      totalprice: 100,
      depositpaid: false,
      bookingdates: {
        checkin: '2025-04-01',
        checkout: '2025-04-10',
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      bookingId = response.body.bookingid
    })
  })

  context('PUT /booking/:id - Atualização Completa', () => {
    it('deve atualizar reserva completa com token válido', () => {
      cy.updateBooking(bookingId, updateData.fullUpdate, authToken).then((response) => {
        expect(response.status).to.eq(200)
        cy.assertResponseHeaders(response)
        cy.assertBookingSchema(response.body)

        expect(response.body.firstname).to.eq(updateData.fullUpdate.firstname)
        expect(response.body.lastname).to.eq(updateData.fullUpdate.lastname)
        expect(response.body.totalprice).to.eq(updateData.fullUpdate.totalprice)
        expect(response.body.depositpaid).to.eq(updateData.fullUpdate.depositpaid)
      })
    })

    it('deve persistir atualização - GET deve retornar dados novos', () => {
      cy.updateBooking(bookingId, updateData.fullUpdate, authToken).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200)

        cy.getBooking(bookingId).then((getResponse) => {
          expect(getResponse.status).to.eq(200)
          expect(getResponse.body.firstname).to.eq(updateData.fullUpdate.firstname)
          expect(getResponse.body.totalprice).to.eq(updateData.fullUpdate.totalprice)
        })
      })
    })

    it('deve retornar 403 ao atualizar sem token de autenticação', () => {
      cy.request({
        method: 'PUT',
        url: `/booking/${bookingId}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: updateData.fullUpdate,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(403, 'PUT sem token deve retornar 403')
      })
    })

    it('deve retornar 403 com token inválido', () => {
      cy.updateBooking(bookingId, updateData.fullUpdate, 'invalid_token_xyz').then((response) => {
        expect(response.status).to.eq(403, 'Token inválido deve retornar 403')
      })
    })

    it('deve retornar 405 para ID inexistente', () => {
      cy.updateBooking(999999999, updateData.fullUpdate, authToken).then((response) => {
        expect(response.status).to.be.oneOf([405, 404])
      })
    })

    it('deve retornar erro ao atualizar com campos obrigatórios ausentes', () => {
      const incompleteData = { firstname: 'OnlyFirstname' }
      cy.updateBooking(bookingId, incompleteData, authToken).then((response) => {
        expect(response.status).to.be.oneOf([400, 422, 500])
      })
    })
  })

  context('PATCH /booking/:id - Atualização Parcial', () => {
    it('deve atualizar parcialmente uma reserva - apenas firstname e totalprice', () => {
      cy.patchBooking(bookingId, updateData.partialUpdate, authToken).then((response) => {
        expect(response.status).to.eq(200)
        cy.assertBookingSchema(response.body)

        expect(response.body.firstname).to.eq(updateData.partialUpdate.firstname)
        expect(response.body.totalprice).to.eq(updateData.partialUpdate.totalprice)

        expect(response.body.lastname).to.eq('Name')
      })
    })

    it('deve retornar 403 ao PATCH sem autenticação', () => {
      cy.request({
        method: 'PATCH',
        url: `/booking/${bookingId}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: updateData.partialUpdate,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(403)
      })
    })

    it('deve retornar 403 com token expirado/inválido no PATCH', () => {
      cy.patchBooking(bookingId, updateData.priceUpdate, 'expired_token').then((response) => {
        expect(response.status).to.eq(403)
      })
    })
  })
})
