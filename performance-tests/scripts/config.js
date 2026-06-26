/**
 * performance-tests/scripts/config.js
 * Configurações compartilhadas para todos os scripts K6.
 *
 * Decisão técnica: centralizar thresholds e configurações de carga evita
 * inconsistências entre scripts e facilita ajuste único para todos os cenários.
 */

export const BASE_URL = __ENV.BASE_URL || 'https://restful-booker.herokuapp.com'

// ── Credenciais ───────────────────────────────────────────────────────────────
export const CREDENTIALS = {
  username: __ENV.ADMIN_USERNAME || 'admin',
  password: __ENV.ADMIN_PASSWORD || 'password123',
}

// ── Headers padrão ────────────────────────────────────────────────────────────
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

// ── Thresholds globais ────────────────────────────────────────────────────────
// Critérios de aceitação de performance:
// - 95% das requisições devem completar em menos de 2s
// - 99% das requisições devem completar em menos de 5s
// - Taxa de erros deve ser menor que 1%
export const GLOBAL_THRESHOLDS = {
  // Duração das requisições HTTP
  http_req_duration: ['p(95)<2000', 'p(99)<5000'],

  // Taxa de falhas (HTTP errors)
  http_req_failed: ['rate<0.01'],

  // Checks (asserções de negócio)
  checks: ['rate>0.95'],

  // Requisições por segundo (mínimo esperado)
  http_reqs: ['rate>10'],
}

// ── Payload de reserva para testes ───────────────────────────────────────────
export function generateBookingPayload(index = 0) {
  const date = new Date()
  const checkin = new Date(date.getTime() + index * 24 * 60 * 60 * 1000)
  const checkout = new Date(checkin.getTime() + 7 * 24 * 60 * 60 * 1000)

  const formatDate = (d) => d.toISOString().split('T')[0]

  return {
    firstname: `User${index}`,
    lastname: `Performance${index}`,
    totalprice: 100 + (index % 900),
    depositpaid: index % 2 === 0,
    bookingdates: {
      checkin: formatDate(checkin),
      checkout: formatDate(checkout),
    },
    additionalneeds: 'Performance test booking',
  }
}
