import { faker } from '@faker-js/faker'
import { buildBooking } from '../../support/factories/booking.factory'

describe('BOOKING - Fluxo Completo de Ciclo de Vida', { tags: ['@booking', '@flow', '@smoke'] }, () => {
  it('deve executar o ciclo completo: autenticar -> criar -> consultar -> atualizar -> deletar -> confirmar remoção', () => {
    const initialBooking = buildBooking()
    const updatedBooking = buildBooking()
    let authToken
    let bookingId

    cy.createAuthToken().then((token) => {
      authToken = token
      expect(authToken).to.be.a('string').and.have.length.greaterThan(0)
    }).then(() => {
      return cy.createBooking(initialBooking)
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(200)
      bookingId = createResponse.body.bookingid

      return cy.getBooking(bookingId)
    }).then((getResponse) => {
      expect(getResponse.status).to.eq(200)
      expect(getResponse.body.firstname).to.eq(initialBooking.firstname)

      return cy.updateBooking(bookingId, updatedBooking, authToken)
    }).then((updateResponse) => {
      expect(updateResponse.status).to.eq(200)
      expect(updateResponse.body.firstname).to.eq(updatedBooking.firstname)

      return cy.getBooking(bookingId)
    }).then((getAfterUpdateResponse) => {
      expect(getAfterUpdateResponse.status).to.eq(200)
      expect(getAfterUpdateResponse.body.lastname).to.eq(updatedBooking.lastname)

      return cy.deleteBooking(bookingId, authToken)
    }).then((deleteResponse) => {
      expect(deleteResponse.status).to.eq(201)

      return cy.getBooking(bookingId)
    }).then((getAfterDeleteResponse) => {
      expect(getAfterDeleteResponse.status).to.eq(404, 'reserva deletada não deve mais existir')
    })
  })

  it('deve criar múltiplas reservas para o mesmo hóspede e listá-las via filtro', () => {
    const sharedLastname = faker.person.lastName()
    const bookingA = buildBooking({ lastname: sharedLastname })
    const bookingB = buildBooking({ lastname: sharedLastname })
    const createdIds = []

    cy.createBooking(bookingA).then((responseA) => {
      expect(responseA.status).to.eq(200)
      createdIds.push(responseA.body.bookingid)

      return cy.createBooking(bookingB)
    }).then((responseB) => {
      expect(responseB.status).to.eq(200)
      createdIds.push(responseB.body.bookingid)

      return cy.getAllBookings({ lastname: sharedLastname })
    }).then((listResponse) => {
      expect(listResponse.status).to.eq(200)

      const foundIds = listResponse.body.map((b) => b.bookingid)
      createdIds.forEach((id) => {
        expect(foundIds, `booking ${id} deve constar na listagem filtrada por lastname`).to.include(id)
      })
    })
  })
})
