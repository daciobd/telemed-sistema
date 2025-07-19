import { describe, it, expect } from 'vitest';
import { apiRequest } from '../../lib/queryClient';

describe('Critical: API Status & Health', () => {
  it('should respond to /health with basic status', async () => {
    const response = await fetch('/health');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.timestamp).toBeDefined();
    expect(data.port).toBeDefined();
    expect(data.version).toBeDefined();
  });

  it('should respond to /api/status with detailed metrics', async () => {
    const response = await apiRequest('/api/status');

    expect(response.status).toBe('healthy');
    expect(response.services).toBeDefined();
    expect(response.services.database).toBeDefined();
    expect(response.services.sessionStore).toBeDefined();
    expect(response.metrics).toBeDefined();
    expect(response.metrics.uptime).toBeGreaterThan(0);
    expect(response.metrics.memoryUsage).toBeDefined();
    expect(response.lastCheck).toBeDefined();
  });

  it('should validate database connectivity', async () => {
    const response = await apiRequest('/api/status');

    expect(response.services.database.status).toBe('connected');
    expect(response.services.database.responseTime).toBeGreaterThan(0);
    expect(response.services.database.lastCheck).toBeDefined();
  });

  it('should check critical API endpoints', async () => {
    const endpoints = [
      '/api/patients',
      '/api/doctors', 
      '/api/appointments',
      '/api/consultations'
    ];

    for (const endpoint of endpoints) {
      const response = await fetch(endpoint);
      // Should not be 500 (server error)
      expect(response.status).not.toBe(500);
      // Should be either 200 (OK), 401 (auth required), or 405 (method not allowed)
      expect([200, 401, 405]).toContain(response.status);
    }
  });

  it('should validate session store functionality', async () => {
    const response = await apiRequest('/api/status');

    expect(response.services.sessionStore.status).toBe('connected');
    expect(response.services.sessionStore.sessionCount).toBeGreaterThanOrEqual(0);
  });

  it('should return appropriate CORS headers', async () => {
    const response = await fetch('/api/status');

    expect(response.headers.get('Access-Control-Allow-Origin')).toBeTruthy();
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });

  it('should handle high load scenarios', async () => {
    const startTime = Date.now();
    
    // Make multiple concurrent requests
    const promises = Array.from({ length: 10 }, () => 
      apiRequest('/api/status')
    );

    const results = await Promise.all(promises);
    const endTime = Date.now();

    // All requests should succeed
    results.forEach(result => {
      expect(result.status).toBe('healthy');
    });

    // Should complete within reasonable time (5 seconds)
    expect(endTime - startTime).toBeLessThan(5000);
  });

  it('should validate security headers', async () => {
    const response = await fetch('/health');

    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
  });
});