// Load testing para endpoints críticos
// Usar com k6: k6 run tests/performance/load-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up
    { duration: '1m', target: 50 },  // Stay at 50 users
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requests < 500ms
    http_req_failed: ['rate<0.1'],    // Taxa de erro < 10%
  },
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  // Test health endpoint
  let healthResponse = http.get(`${BASE_URL}/health`);
  check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 100ms': (r) => r.timings.duration < 100,
  });

  // Test status endpoint
  let statusResponse = http.get(`${BASE_URL}/api/status`);
  check(statusResponse, {
    'status check is 200': (r) => r.status === 200,
    'status has performance data': (r) => r.json('performance') !== undefined,
  });

  // Test appointments endpoint
  let appointmentsResponse = http.get(`${BASE_URL}/api/appointments`);
  check(appointmentsResponse, {
    'appointments endpoint responds': (r) => r.status === 200 || r.status === 401,
  });

  // Test metrics endpoint
  let metricsResponse = http.get(`${BASE_URL}/api/metrics`);
  check(metricsResponse, {
    'metrics endpoint responds': (r) => r.status === 200 || r.status === 401,
  });

  sleep(1);
}