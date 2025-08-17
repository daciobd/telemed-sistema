
// TeleMed Performance Budget Configuration
// Lighthouse mobile ≥ 80, TBT ≤ 300ms, Transfer ≤ 1.5MB

module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:5173/'],
      numberOfRuns: 3,
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        emulatedFormFactor: 'mobile'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.80 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'metrics:total-blocking-time': ['error', { maxNumericValue: 300 }],
        'metrics:first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'metrics:largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'metrics:cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 1572864 }], // 1.5MB
        'resource-summary:script:size': ['warn', { maxNumericValue: 524288 }], // 512KB
        'resource-summary:image:size': ['warn', { maxNumericValue: 1048576 }] // 1MB
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
