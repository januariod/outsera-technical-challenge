describe('CONTRACT - Validação de Contratos da API Restful Booker', { tags: ['@contract', '@smoke'] }, () => {
  let createdBookingId

  before(() => {
    cy.createBooking({
      firstname: 'Contract',
      lastname: 'Test',
      totalprice: 200,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-08-01',
        checkout: '2025-08-15',
      },
      additionalneeds: 'Contract validation',
    }).then((response) => {
      createdBookingId = response.body.bookingid
    })
  })

  context('Contrato POST /auth', () => {
    it('resposta deve ter Content-Type application/json', () => {
      cy.request({
        method: 'POST',
        url: '/auth',
        headers: { 'Content-Type': 'application/json' },
        body: { username: 'admin', password: 'password123' },
      }).then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
        expect(response.body).to.be.an('object')
      })
    })
  })

  context('Contrato POST /booking', () => {
    it('resposta de criação deve ter bookingid e booking object', () => {
      cy.createBooking({
        firstname: 'Schema',
        lastname: 'Checker',
        totalprice: 100,
        depositpaid: true,
        bookingdates: { checkin: '2025-09-01', checkout: '2025-09-05' },
      }).then((response) => {
        expect(response.status).to.eq(200)

        const schema = response.body
        expect(schema).to.have.all.keys(['bookingid', 'booking'])
        expect(schema.bookingid).to.be.a('number')
        expect(schema.booking).to.be.an('object')

        const booking = schema.booking
        expect(booking).to.have.property('firstname').that.is.a('string')
        expect(booking).to.have.property('lastname').that.is.a('string')
        expect(booking).to.have.property('totalprice').that.is.a('number')
        expect(booking).to.have.property('depositpaid').that.is.a('boolean')
        expect(booking).to.have.property('bookingdates').that.is.an('object')
        expect(booking.bookingdates).to.have.property('checkin').that.is.a('string')
        expect(booking.bookingdates).to.have.property('checkout').that.is.a('string')
      })
    })
  })

  context('Contrato GET /booking', () => {
    it('lista de bookings deve ser um array de objetos com bookingid', () => {
      cy.getAllBookings().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')

        if (response.body.length > 0) {
          const sample = response.body[0]
          expect(sample).to.be.an('object')
          expect(sample).to.have.property('bookingid').that.is.a('number')
        }
      })
    })
  })

  context('Contrato GET /booking/:id', () => {
    it('booking individual deve ter todos os campos do schema', () => {
      cy.getBooking(createdBookingId).then((response) => {
        expect(response.status).to.eq(200)

        const booking = response.body

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        expect(booking.bookingdates.checkin).to.match(dateRegex)
        expect(booking.bookingdates.checkout).to.match(dateRegex)
      })
    })
  })

  context('Contrato Headers HTTP', () => {
    const endpoints = [
      { method: 'GET', url: '/booking' },
      { method: 'GET', url: '/booking/1' },
    ]

    endpoints.forEach(({ method, url }) => {
      it(`${method} ${url} deve retornar header Content-Type correto`, () => {
        cy.request({
          method,
          url,
          headers: { 'Accept': 'application/json' },
          failOnStatusCode: false,
        }).then((response) => {
          if (response.status === 200) {
            expect(response.headers).to.have.property('content-type')
            expect(response.headers['content-type']).to.include('application/json')
          }
        })
      })
    })
  })
})
