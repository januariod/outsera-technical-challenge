/**
 * performance-tests/scripts/full-scenario.js
 * Cenário completo de performance - simula fluxo real de usuário.
 *
 * Fluxo por VU:
 * 1. Autenticação (POST /auth)
 * 2. Listagem de reservas (GET /booking)
 * 3. Busca de reserva específica (GET /booking/:id)
 * 4. Criação de nova reserva (POST /booking)
 * 5. Atualização da reserva criada (PUT /booking/:id)
 * 6. Deleção da reserva (DELETE /booking/:id)
 *
 * 500 VUs, 5 minutos com ramp-up gradual.
 */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'
import {
  BASE_URL,
  DEFAULT_HEADERS,
  GLOBAL_THRESHOLDS,
  CREDENTIALS,
  generateBookingPayload,
} from './config.js'

// ── Métricas customizadas ─────────────────────────────────────────────────────
const errorRate = new Rate('scenario_error_rate')
const authDuration = new Trend('auth_duration')
const listDuration = new Trend('list_duration')
const getDuration = new Trend('get_single_duration')
const createDuration = new Trend('create_duration')
const updateDuration = new Trend('update_duration')
const deleteDuration = new Trend('delete_duration')
const fullFlowDuration = new Trend('full_flow_duration')
const completedFlows = new Counter('completed_flows')

// ── Opções de execução ────────────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '1m', target: 50 },    // Warm-up suave
    { duration: '1m', target: 200 },   // Ramp-up
    { duration: '1m', target: 500 },   // Carga máxima
    { duration: '1m', target: 500 },   // Sustentação
    { duration: '1m', target: 0 },     // Ramp-down
  ],

  thresholds: {
    ...GLOBAL_THRESHOLDS,
    'auth_duration': ['p(95)<2000'],
    'list_duration': ['p(95)<2000'],
    'get_single_duration': ['p(95)<2000'],
    'create_duration': ['p(95)<3000'],
    'update_duration': ['p(95)<3000'],
    'delete_duration': ['p(95)<2000'],
    'full_flow_duration': ['p(95)<15000'], // Fluxo completo em até 15s
    'scenario_error_rate': ['rate<0.05'],  // Tolerância 5% em fluxo complexo
  },

  // Configuração de saída para relatório JSON
  // Para gerar: k6 run --out json=reports/performance/results.json full-scenario.js
}

// ── Configuração de relatório HTML integrado ──────────────────────────────────
export function handleSummary(data) {
  return {
    'reports/performance/summary.html': htmlReport(data),
    'reports/performance/summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}

// ── Funções de relatório inline (evita dependência externa) ───────────────────
function textSummary(data, opts = {}) {
  const { indent = '', enableColors = false } = opts
  const lines = ['\n📊 RESUMO DO TESTE DE PERFORMANCE\n']

  const metrics = data.metrics

  if (metrics.http_req_duration) {
    const p95 = metrics.http_req_duration.values['p(95)']
    const p99 = metrics.http_req_duration.values['p(99)']
    lines.push(`${indent}http_req_duration:`)
    lines.push(`${indent}  p(95) = ${p95?.toFixed(2)}ms`)
    lines.push(`${indent}  p(99) = ${p99?.toFixed(2)}ms`)
  }

  if (metrics.http_req_failed) {
    const failRate = (metrics.http_req_failed.values.rate * 100).toFixed(2)
    lines.push(`${indent}http_req_failed: ${failRate}%`)
  }

  if (metrics.checks) {
    const checkRate = (metrics.checks.values.rate * 100).toFixed(2)
    lines.push(`${indent}checks passed: ${checkRate}%`)
  }

  if (metrics.http_reqs) {
    lines.push(`${indent}total requests: ${metrics.http_reqs.values.count}`)
    lines.push(`${indent}req/s: ${metrics.http_reqs.values.rate?.toFixed(2)}`)
  }

  return lines.join('\n')
}

function htmlReport(data) {
  const metrics = data.metrics
  const p95 = metrics.http_req_duration?.values['p(95)']?.toFixed(2) || 'N/A'
  const p99 = metrics.http_req_duration?.values['p(99)']?.toFixed(2) || 'N/A'
  const failRate = ((metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2)
  const checkRate = ((metrics.checks?.values?.rate || 0) * 100).toFixed(2)
  const totalReqs = metrics.http_reqs?.values?.count || 0
  const reqRate = metrics.http_reqs?.values?.rate?.toFixed(2) || 'N/A'

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>K6 Performance Report - Outsera Technical Challenge</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; background: #f5f5f5; color: #333; }
    .header { background: #2d3748; color: white; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 8px 0 0; opacity: 0.8; }
    .container { max-width: 900px; margin: 24px auto; padding: 0 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; margin-bottom: 8px; }
    .card-value { font-size: 32px; font-weight: bold; color: #2d3748; }
    .card-unit { font-size: 14px; color: #666; }
    .pass { color: #38a169; }
    .fail { color: #e53e3e; }
    .section { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 16px; }
    .section h2 { margin: 0 0 16px; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    td, th { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    th { background: #f7fafc; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 K6 Performance Test Report</h1>
    <p>Outsera Technical Challenge | Restful Booker API | ${new Date().toLocaleString('pt-BR')}</p>
  </div>
  <div class="container">
    <div class="grid">
      <div class="card">
        <div class="card-title">p(95) Response Time</div>
        <div class="card-value ${parseFloat(p95) < 2000 ? 'pass' : 'fail'}">${p95}<span class="card-unit">ms</span></div>
      </div>
      <div class="card">
        <div class="card-title">p(99) Response Time</div>
        <div class="card-value ${parseFloat(p99) < 5000 ? 'pass' : 'fail'}">${p99}<span class="card-unit">ms</span></div>
      </div>
      <div class="card">
        <div class="card-title">Error Rate</div>
        <div class="card-value ${parseFloat(failRate) < 1 ? 'pass' : 'fail'}">${failRate}<span class="card-unit">%</span></div>
      </div>
      <div class="card">
        <div class="card-title">Checks Passed</div>
        <div class="card-value ${parseFloat(checkRate) > 95 ? 'pass' : 'fail'}">${checkRate}<span class="card-unit">%</span></div>
      </div>
      <div class="card">
        <div class="card-title">Total Requests</div>
        <div class="card-value">${totalReqs.toLocaleString()}</div>
      </div>
      <div class="card">
        <div class="card-title">Requests/sec</div>
        <div class="card-value">${reqRate}</div>
      </div>
    </div>

    <div class="section">
      <h2>Thresholds</h2>
      <table>
        <tr><th>Métrica</th><th>Threshold</th><th>Resultado</th></tr>
        <tr><td>p(95) response time</td><td>&lt; 2000ms</td><td class="${parseFloat(p95) < 2000 ? 'pass' : 'fail'}">${parseFloat(p95) < 2000 ? '✅ PASSOU' : '❌ FALHOU'}</td></tr>
        <tr><td>p(99) response time</td><td>&lt; 5000ms</td><td class="${parseFloat(p99) < 5000 ? 'pass' : 'fail'}">${parseFloat(p99) < 5000 ? '✅ PASSOU' : '❌ FALHOU'}</td></tr>
        <tr><td>Error rate</td><td>&lt; 1%</td><td class="${parseFloat(failRate) < 1 ? 'pass' : 'fail'}">${parseFloat(failRate) < 1 ? '✅ PASSOU' : '❌ FALHOU'}</td></tr>
        <tr><td>Checks</td><td>&gt; 95%</td><td class="${parseFloat(checkRate) > 95 ? 'pass' : 'fail'}">${parseFloat(checkRate) > 95 ? '✅ PASSOU' : '❌ FALHOU'}</td></tr>
      </table>
    </div>
  </div>
</body>
</html>`
}

// ── Setup: prepara dados de suporte ──────────────────────────────────────────
export function setup() {
  const authResponse = http.post(
    `${BASE_URL}/auth`,
    JSON.stringify(CREDENTIALS),
    { headers: DEFAULT_HEADERS },
  )

  const token = check(authResponse, {
    'setup: auth retornou 200': (r) => r.status === 200,
  }) ? authResponse.json('token') : null

  // Obtém IDs de reservas existentes
  const listResponse = http.get(`${BASE_URL}/booking`, { headers: DEFAULT_HEADERS })
  const bookings = listResponse.json()
  const bookingIds = Array.isArray(bookings)
    ? bookings.slice(0, 100).map((b) => b.bookingid)
    : [1, 2, 3]

  console.log(`✓ Setup: token obtido | ${bookingIds.length} reservas disponíveis`)
  return { token, bookingIds }
}

// ── Cenário principal ─────────────────────────────────────────────────────────
export default function (data) {
  const { token, bookingIds } = data
  const vu = __VU
  const iter = __ITER
  const flowStart = Date.now()
  let flowErrors = 0

  // Seleciona ID aleatório para leitura
  const readId = bookingIds[Math.floor(Math.random() * bookingIds.length)]

  // ── ETAPA 1: Listagem ──────────────────────────────────────────────────
  group('1. GET /booking - Listar reservas', () => {
    const t = Date.now()
    const res = http.get(`${BASE_URL}/booking`, {
      headers: DEFAULT_HEADERS,
      tags: { step: 'list' },
    })
    listDuration.add(Date.now() - t)

    const ok = check(res, {
      'list: 200': (r) => r.status === 200,
      'list: array': (r) => Array.isArray(r.json()),
    })
    if (!ok) flowErrors++
  })

  sleep(0.3)

  // ── ETAPA 2: Busca por ID ─────────────────────────────────────────────
  group('2. GET /booking/:id - Buscar reserva', () => {
    const t = Date.now()
    const res = http.get(`${BASE_URL}/booking/${readId}`, {
      headers: DEFAULT_HEADERS,
      tags: { step: 'get_single' },
    })
    getDuration.add(Date.now() - t)

    const ok = check(res, {
      'get: 200': (r) => r.status === 200,
      'get: tem firstname': (r) => r.json().hasOwnProperty('firstname'),
    })
    if (!ok) flowErrors++
  })

  sleep(0.3)

  // ── ETAPA 3: Criação ──────────────────────────────────────────────────
  let newBookingId = null
  group('3. POST /booking - Criar reserva', () => {
    const payload = generateBookingPayload(vu * 10000 + iter)
    const t = Date.now()
    const res = http.post(
      `${BASE_URL}/booking`,
      JSON.stringify(payload),
      { headers: DEFAULT_HEADERS, tags: { step: 'create' } },
    )
    createDuration.add(Date.now() - t)

    const ok = check(res, {
      'create: 200': (r) => r.status === 200,
      'create: tem bookingid': (r) => r.json().bookingid > 0,
    })
    if (ok) newBookingId = res.json('bookingid')
    else flowErrors++
  })

  sleep(0.3)

  // ── ETAPA 4: Atualização (só se criação foi bem-sucedida) ─────────────
  if (newBookingId && token) {
    group('4. PUT /booking/:id - Atualizar reserva', () => {
      const updatePayload = generateBookingPayload(vu * 10000 + iter + 1)
      const t = Date.now()
      const res = http.put(
        `${BASE_URL}/booking/${newBookingId}`,
        JSON.stringify(updatePayload),
        {
          headers: { ...DEFAULT_HEADERS, 'Cookie': `token=${token}` },
          tags: { step: 'update' },
        },
      )
      updateDuration.add(Date.now() - t)

      const ok = check(res, {
        'update: 200': (r) => r.status === 200,
        'update: dados atualizados': (r) => r.json().firstname === updatePayload.firstname,
      })
      if (!ok) flowErrors++
    })

    sleep(0.3)

    // ── ETAPA 5: Deleção ─────────────────────────────────────────────────
    group('5. DELETE /booking/:id - Deletar reserva', () => {
      const t = Date.now()
      const res = http.del(
        `${BASE_URL}/booking/${newBookingId}`,
        null,
        {
          headers: { 'Content-Type': 'application/json', 'Cookie': `token=${token}` },
          tags: { step: 'delete' },
        },
      )
      deleteDuration.add(Date.now() - t)

      const ok = check(res, {
        'delete: 201': (r) => r.status === 201,
      })
      if (!ok) flowErrors++
    })
  }

  // Métricas de fluxo completo
  const flowTime = Date.now() - flowStart
  fullFlowDuration.add(flowTime)
  errorRate.add(flowErrors > 0)

  if (flowErrors === 0) {
    completedFlows.add(1)
  }

  // Think time entre iterações
  sleep(Math.random() * 3 + 1)
}
