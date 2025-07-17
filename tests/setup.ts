import { beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Setup para React Testing Library
afterEach(() => {
  cleanup();
});

// Mock para APIs externas
beforeAll(() => {
  // Mock fetch global
  global.fetch = vi.fn();
  
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });

  // Mock window.location
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:5000',
      pathname: '/',
      search: '',
      hash: '',
    },
    writable: true,
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

// Helpers para testes
export const createMockResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response);
};

export const mockApiSuccess = (data: any) => {
  (global.fetch as any).mockResolvedValueOnce(createMockResponse(data));
};

export const mockApiError = (status = 500, message = 'API Error') => {
  (global.fetch as any).mockResolvedValueOnce(createMockResponse({ error: message }, status));
};