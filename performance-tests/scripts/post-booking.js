/**
 * performance-tests/scripts/post-booking.js
 * Teste de carga K6 para POST /booking (criação de reservas)
 *
 * 500 VUs, 5 minutos. Cenário focado em criação concorrente.
 * Decisão técnica: cada VU cria reservas independentes para
 * evitar conflito de dados e simular carga realista de escrita.
 */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'
import { BASE_URL, DEFAULT_HEADERS, GLOBAL_THRESHOLDS, generateBookingPayload } from './config.js'

// ── Métricas customizadas ─────────────────────────────────────────────────────
const errorRate = new Rate('post_error_rate')
const createBookingDuration = new Trend('create_booking_duration')
const successfulCreations = new Counter('successful_creations')
const failedCreations = new Counter('failed_creations')

// ── Configuração de carga ─────────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '1m', target: 250 },
    { duration: '1m', target: 500 },
    { duration: '1m', target: 500 },
    { duration: '1m', target: 0 },
  ],

  thresholds: {
    ...GLOBAL_THRESHOLDS,
    // POST é mais pesado que GET - thresholds ligeiramente mais relaxados
    'http_req_duration': ['p(95)<3000', 'p(99)<6000'],
    'create_booking_duration': ['p(95)<3000', 'p(99)<6000'],
    'post_error_rate': ['rate<0.02'], // Tolerância ligeiramente maior para escritas
  },

  noConnectionReuse: false,
  userAgent: 'K6-PerformanceTest/1.0',
}

// ── Cenário principal ─────────────────────────────────────────────────────────
export default function () {
  const vu = __VU
  const iter = __ITER
  const bookingData = generateBookingPayload(vu * 1000 + iter)

  group('POST /booking - Criar nova reserva', () => {
    const startTime = Date.now()
    const response = http.post(
      `${BASE_URL}/booking`,
      JSON.stringify(bookingData),
      {
        headers: DEFAULT_HEADERS,
        tags: { endpoint: 'create_booking', vu: String(vu) },
      },
    )

    createBookingDuration.add(Date.now() - startTime)

    const isSuccess = check(response, {
      'create: status é 200': (r) => r.status === 200,
      'create: retorna bookingid': (r) => {
        const body = r.json()
        return body && typeof body.bookingid === 'number' && body.bookingid > 0
      },
      'create: retorna objeto booking': (r) => {
        const body = r.json()
        return body && typeof body.booking === 'object'
      },
      'create: firstname está correto': (r) => {
        const body = r.json()
        return body && body.booking && body.booking.firstname === bookingData.firstname
      },
      'create: totalprice está correto': (r) => {
        const body = r.json()
        return body && body.booking && body.booking.totalprice === bookingData.totalprice
      },
      'create: tempo de resposta < 3s': (r) => r.timings.duration < 3000,
    })

    if (isSuccess && response.status === 200) {
      successfulCreations.add(1)
    } else {
      failedCreations.add(1)
    }

    errorRate.add(!isSuccess)
  })

  // Think time entre criações
  sleep(Math.random() * 3 + 1) // 1s a 4s
}
