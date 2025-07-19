import { vi } from 'vitest';

// Mock global fetch
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
    origin: 'http://localhost:5000',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

// Setup API base URL for tests
process.env.VITE_API_URL = 'http://localhost:5000';