import { faker } from '@faker-js/faker'

const toApiDate = (date) => date.toISOString().split('T')[0]

export const buildBooking = (overrides = {}) => {
  const checkin = faker.date.soon({ days: 30 })
  const checkout = faker.date.soon({ days: 10, refDate: checkin })

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 5000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: toApiDate(checkin),
      checkout: toApiDate(checkout),
    },
    additionalneeds: faker.helpers.arrayElement([
      'Breakfast',
      'Late checkout',
      'Airport pickup',
      'Extra towels',
    ]),
    ...overrides,
  }
}

export default buildBooking
