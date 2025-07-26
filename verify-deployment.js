#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Verifies that all deployment requirements are met
 */

import fs from 'fs';

const log = (message, status = 'info') => {
  const icons = { success: '✅', error: '❌', info: '🔍', warning: '⚠️' };
  console.log(`${icons[status]} ${message}`);
};

const checks = [
  {
    name: 'Build Script Exists',
    check: () => fs.existsSync('./build.js'),
    error: 'build.js is missing'
  },
  {
    name: 'Start Script Exists', 
    check: () => fs.existsSync('./start.js'),
    error: 'start.js is missing'
  },
  {
    name: 'Package.json Has Required Dependencies',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      return pkg.dependencies && pkg.devDependencies && pkg.devDependencies.tsx;
    },
    error: 'package.json missing required dependencies'
  },
  {
    name: 'TypeScript Config Present',
    check: () => fs.existsSync('./tsconfig.json'),
    error: 'tsconfig.json is missing'
  },
  {
    name: 'Vite Config Present',
    check: () => fs.existsSync('./vite.config.ts'),
    error: 'vite.config.ts is missing'
  },
  {
    name: 'Server Entry Point Exists',
    check: () => fs.existsSync('./server/index.ts'),
    error: 'server/index.ts is missing'
  },
  {
    name: 'Client Entry Point Exists',
    check: () => fs.existsSync('./client/src/main.tsx'),
    error: 'client/src/main.tsx is missing'
  },
  {
    name: 'Platform Configs Present',
    check: () => fs.existsSync('./Procfile') && fs.existsSync('./render.yaml'),
    error: 'Platform deployment configs missing'
  }
];

log('🔍 Verifying Deployment Configuration...\n');

let allPassed = true;

for (const check of checks) {
  if (check.check()) {
    log(`${check.name}`, 'success');
  } else {
    log(`${check.name} - ${check.error}`, 'error');
    allPassed = false;
  }
}

log('');

if (allPassed) {
  log('🎉 All deployment checks passed! Your app is ready to deploy.', 'success');
  log('');
  log('Next steps:', 'info');
  log('1. Push your code to your git repository');
  log('2. Connect your repository to your deployment platform');
  log('3. Set build command: npm install && node build.js');
  log('4. Set start command: node start.js');
  log('5. Add required environment variables (DATABASE_URL, etc.)');
} else {
  log('Some deployment requirements are missing. Please fix the issues above.', 'error');
  process.exit(1);
}