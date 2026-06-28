import http from 'k6/http'
import { check, sleep } from 'k6'

import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

export const options = {
  stages: [
    { duration: '30s', target: 500 },
    { duration: '4m', target: 500 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
}

const BASE_URL = 'https://restful-booker.herokuapp.com'

export default function () {
  const res = http.get(`${BASE_URL}/booking`)

  check(res, {
    'status é 200': (r) => r.status === 200,
    'tempo de resposta < 2000ms': (r) => r.timings.duration < 2000,
  })

  sleep(1)
}

export function handleSummary(data) {
  return {
    'reports/performance/index.html': htmlReport(data, { title: 'Performance Test - Outsera QA' }),
    
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}
