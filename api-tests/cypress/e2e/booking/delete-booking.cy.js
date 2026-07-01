import { buildBooking } from '../../support/factories/booking.factory'

describe('BOOKING - DELETE /booking/:id', { tags: ['@booking', '@delete'] }, () => {
  let authToken
  let bookingIdToDelete

  before(() => {
    cy.createAuthToken().then((token) => {
      authToken = token
    })
  })

  beforeEach(() => {
    cy.createBooking(buildBooking()).then((response) => {
      expect(response.status).to.eq(200, 'Setup: criação da reserva para deletar')
      bookingIdToDelete = response.body.bookingid
    })
  })

  context('Cenários Positivos', () => {
    it('deve deletar reserva com token válido e retornar 201', () => {
      cy.deleteBooking(bookingIdToDelete, authToken).then((response) => {
        expect(response.status).to.eq(201, 'DELETE bem-sucedido deve retornar 201')
      })
    })

    it('deve confirmar remoção: GET retorna 404 após DELETE', () => {
      cy.deleteBooking(bookingIdToDelete, authToken).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(201)

        cy.getBooking(bookingIdToDelete).then((getResponse) => {
          expect(getResponse.status).to.eq(404, 'Reserva deletada deve retornar 404 no GET')
        })
      })
    })

    it('deve remover reserva da listagem após DELETE', () => {
      cy.deleteBooking(bookingIdToDelete, authToken).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(201)

        cy.getAllBookings().then((listResponse) => {
          const found = listResponse.body.find((b) => b.bookingid === bookingIdToDelete)
          expect(found).to.be.undefined
        })
      })
    })
  })

  context('Cenários Negativos', () => {
    it('deve retornar 403 ao deletar sem token de autenticação', () => {
      cy.request({
        method: 'DELETE',
        url: `/booking/${bookingIdToDelete}`,
        headers: { 'Content-Type': 'application/json' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(403, 'DELETE sem token deve retornar 403')
      })
    })

    it('deve retornar 403 com token inválido', () => {
      cy.deleteBooking(bookingIdToDelete, 'invalid_token_123').then((response) => {
        expect(response.status).to.eq(403, 'Token inválido deve impedir deleção')
      })
    })

    it('deve retornar 403 com token vazio', () => {
      cy.deleteBooking(bookingIdToDelete, '').then((response) => {
        expect(response.status).to.eq(403)
      })
    })

    it('deve retornar 405 ao deletar ID inexistente com token válido', () => {
      cy.deleteBooking(999999999, authToken).then((response) => {
        expect(response.status).to.be.oneOf([404, 405])
      })
    })

    it('deve retornar erro para tentativa de deletar ID não numérico', () => {
      cy.request({
        method: 'DELETE',
        url: '/booking/not-a-number',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${authToken}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 404, 405])
      })
    })

    it('não deve ser possível deletar a mesma reserva duas vezes', () => {
      cy.deleteBooking(bookingIdToDelete, authToken).then((firstDelete) => {
        expect(firstDelete.status).to.eq(201)

        cy.deleteBooking(bookingIdToDelete, authToken).then((secondDelete) => {
          expect(secondDelete.status).to.be.oneOf([404, 405],
            'Segunda deleção deve falhar pois reserva já foi removida')
        })
      })
    })
  })
})
