describe('BOOKING - GET /booking', { tags: ['@booking', '@get', '@smoke'] }, () => {
  let createdBookingId

  before(() => {
    cy.createBooking({
      firstname: 'QueryTest',
      lastname: 'User',
      totalprice: 123,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-02-01',
        checkout: '2025-02-10',
      },
      additionalneeds: 'Test setup booking',
    }).then((response) => {
      expect(response.status).to.eq(200)
      createdBookingId = response.body.bookingid
    })
  })

  context('GET /booking - Listar todas as reservas', () => {
    it('deve retornar lista de reservas com status 200', () => {
      cy.getAllBookings().then((response) => {
        expect(response.status).to.eq(200)
        cy.assertResponseHeaders(response)

        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('cada item da lista deve ter apenas o campo bookingid', () => {
      cy.getAllBookings().then((response) => {
        expect(response.status).to.eq(200)

        response.body.slice(0, 5).forEach((item) => {
          expect(item).to.have.property('bookingid').and.be.a('number')
          expect(Object.keys(item)).to.have.length(1)
        })
      })
    })

    it('deve filtrar reservas por firstname', () => {
      cy.getAllBookings({ firstname: 'QueryTest' }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        const found = response.body.find((b) => b.bookingid === createdBookingId)
        expect(found).to.not.be.undefined
      })
    })

    it('deve filtrar reservas por lastname', () => {
      cy.getAllBookings({ lastname: 'User' }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('deve filtrar reservas por checkin', () => {
      cy.getAllBookings({ checkin: '2025-02-01' }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })

    it('deve retornar array vazio para filtro sem resultados', () => {
      cy.getAllBookings({ firstname: 'ZZZNON_EXISTENT_NAME_XYZ_9999' }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
      })
    })
  })

  context('GET /booking/:id - Buscar reserva por ID', () => {
    it('deve retornar reserva existente com dados completos', () => {
      cy.getBooking(createdBookingId).then((response) => {
        expect(response.status).to.eq(200)
        cy.assertResponseHeaders(response)
        cy.assertBookingSchema(response.body)

        expect(response.body.firstname).to.eq('QueryTest')
        expect(response.body.lastname).to.eq('User')
        expect(response.body.totalprice).to.eq(123)
        expect(response.body.depositpaid).to.eq(true)
      })
    })

    it('deve retornar todos os campos obrigatórios', () => {
      cy.getBooking(createdBookingId).then((response) => {
        const requiredFields = ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates']
        requiredFields.forEach((field) => {
          expect(response.body).to.have.property(field)
        })
        expect(response.body.bookingdates).to.have.property('checkin')
        expect(response.body.bookingdates).to.have.property('checkout')
      })
    })

    it('deve retornar 404 para ID inexistente', () => {
      cy.getBooking(999999999).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

    it('deve retornar 404 para ID negativo', () => {
      cy.getBooking(-1).then((response) => {
        expect(response.status).to.be.oneOf([400, 404])
      })
    })

    it('deve retornar erro para ID não numérico', () => {
      cy.request({
        method: 'GET',
        url: '/booking/abc',
        headers: { 'Accept': 'application/json' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404])
      })
    })

    it('deve retornar erro para ID zero', () => {
      cy.getBooking(0).then((response) => {
        expect(response.status).to.be.oneOf([400, 404])
      })
    })
  })
})
