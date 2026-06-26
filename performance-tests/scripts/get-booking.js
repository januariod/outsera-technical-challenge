/**
 * performance-tests/scripts/get-booking.js
 * Teste de carga K6 para GET /booking e GET /booking/:id
 *
 * Configuração: 500 VUs, 5 minutos de execução com ramp-up gradual.
 * Decisão técnica: ramp-up evita spike abrupto que poderia mascarar
 * comportamento real sob carga sustentada.
 */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'
import { BASE_URL, DEFAULT_HEADERS, GLOBAL_THRESHOLDS, CREDENTIALS } from './config.js'

// ── Métricas customizadas ─────────────────────────────────────────────────────
const errorRate = new Rate('custom_error_rate')
const listBookingsDuration = new Trend('list_bookings_duration')
const getBookingByIdDuration = new Trend('get_booking_by_id_duration')
const totalRequests = new Counter('total_requests')

// ── Configuração de carga ────────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '1m', target: 100 },   // Ramp-up: 0 → 100 VUs em 1 min
    { duration: '1m', target: 250 },   // Ramp-up: 100 → 250 VUs em 1 min
    { duration: '1m', target: 500 },   // Ramp-up: 250 → 500 VUs em 1 min
    { duration: '1m', target: 500 },   // Carga constante: 500 VUs por 1 min
    { duration: '1m', target: 0 },     // Ramp-down: 500 → 0 VUs em 1 min
  ],

  thresholds: {
    ...GLOBAL_THRESHOLDS,
    // Thresholds específicos para operações de leitura (mais restritivos)
    'list_bookings_duration': ['p(95)<1500', 'p(99)<3000'],
    'get_booking_by_id_duration': ['p(95)<1500', 'p(99)<3000'],
    'custom_error_rate': ['rate<0.01'],
  },

  // Configurações de execução
  noConnectionReuse: false,
  userAgent: 'K6-PerformanceTest/1.0',
}

// ── Setup: obtém IDs de reservas existentes ───────────────────────────────────
export function setup() {
  // Obtém token de autenticação
  const authResponse = http.post(
    `${BASE_URL}/auth`,
    JSON.stringify(CREDENTIALS),
    { headers: DEFAULT_HEADERS },
  )

  const token = authResponse.json('token')

  // Obtém lista de IDs disponíveis para uso nos testes
  const listResponse = http.get(`${BASE_URL}/booking`, { headers: DEFAULT_HEADERS })
  const bookings = listResponse.json()
  const bookingIds = Array.isArray(bookings)
    ? bookings.slice(0, 50).map((b) => b.bookingid)
    : [1, 2, 3, 4, 5]

  return { token, bookingIds }
}

// ── Cenário principal ─────────────────────────────────────────────────────────
export default function (data) {
  const { bookingIds } = data
  const vu = __VU
  const iter = __ITER

  // Seleciona um ID aleatório para simular acesso distribuído
  const randomId = bookingIds[Math.floor(Math.random() * bookingIds.length)]

  group('GET /booking - Listar todas as reservas', () => {
    const startTime = Date.now()
    const response = http.get(`${BASE_URL}/booking`, {
      headers: DEFAULT_HEADERS,
      tags: { endpoint: 'list_bookings', vu: String(vu) },
    })

    listBookingsDuration.add(Date.now() - startTime)
    totalRequests.add(1)

    const success = check(response, {
      'list: status é 200': (r) => r.status === 200,
      'list: retorna array': (r) => Array.isArray(r.json()),
      'list: array não está vazio': (r) => r.json().length > 0,
      'list: cada item tem bookingid': (r) => {
        const body = r.json()
        return body.length > 0 && body[0].hasOwnProperty('bookingid')
      },
      'list: tempo de resposta < 2s': (r) => r.timings.duration < 2000,
    })

    errorRate.add(!success)
  })

  sleep(0.5) // Pausa entre grupos para simular comportamento real

  group('GET /booking/:id - Buscar reserva por ID', () => {
    const startTime = Date.now()
    const response = http.get(`${BASE_URL}/booking/${randomId}`, {
      headers: DEFAULT_HEADERS,
      tags: { endpoint: 'get_booking_by_id', bookingId: String(randomId) },
    })

    getBookingByIdDuration.add(Date.now() - startTime)
    totalRequests.add(1)

    const success = check(response, {
      'getById: status é 200': (r) => r.status === 200,
      'getById: tem firstname': (r) => r.json().hasOwnProperty('firstname'),
      'getById: tem lastname': (r) => r.json().hasOwnProperty('lastname'),
      'getById: tem totalprice': (r) => r.json().hasOwnProperty('totalprice'),
      'getById: tem bookingdates': (r) => r.json().hasOwnProperty('bookingdates'),
      'getById: tempo de resposta < 2s': (r) => r.timings.duration < 2000,
    })

    errorRate.add(!success)
  })

  // Think time: simula tempo de leitura/interação do usuário
  sleep(Math.random() * 2 + 0.5) // 0.5s a 2.5s
}

// ── Teardown: log de sumário ──────────────────────────────────────────────────
export function teardown(data) {
  console.log(`\n📊 Teste GET concluído. Token usado: ${data.token ? '✓' : '✗'}`)
}
