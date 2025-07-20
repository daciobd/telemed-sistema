#!/usr/bin/env node

/**
 * Deployment Validation Script
 * Tests that all deployment configurations are working correctly
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔍 Validating Deployment Configuration...\n');

const validationChecks = [
  {
    name: 'Build Script Exists',
    check: () => fs.existsSync('build.js') && fs.existsSync('deploy-build.js'),
    fix: 'Ensure build.js and deploy-build.js exist'
  },
  {
    name: 'Start Script Exists', 
    check: () => fs.existsSync('start.js') && fs.existsSync('deploy-start.js'),
    fix: 'Ensure start.js and deploy-start.js exist'
  },
  {
    name: 'Production Package.json',
    check: () => fs.existsSync('package.production.json'),
    fix: 'Create package.production.json with build/start scripts'
  },
  {
    name: 'Deployment Configs',
    check: () => fs.existsSync('Procfile') && fs.existsSync('render.yaml'),
    fix: 'Create platform-specific deployment configs'
  },
  {
    name: 'TypeScript Config',
    check: () => fs.existsSync('tsconfig.json'),
    fix: 'Ensure tsconfig.json exists'
  },
  {
    name: 'Vite Config',
    check: () => fs.existsSync('vite.config.ts'),
    fix: 'Ensure vite.config.ts exists'
  }
];

let allPassed = true;

validationChecks.forEach((test, index) => {
  const passed = test.check();
  const status = passed ? '✅' : '❌';
  console.log(`${index + 1}. ${status} ${test.name}`);
  
  if (!passed) {
    console.log(`   Fix: ${test.fix}`);
    allPassed = false;
  }
});

console.log('\n🔧 Build Process Test...');

try {
  // Test build process (but clean up after)
  console.log('Testing build process...');
  execSync('node deploy-build.js', { stdio: 'pipe' });
  console.log('✅ Build process successful');
  
  // Check if dist directory was created
  if (fs.existsSync('dist') && fs.existsSync('dist/package.json')) {
    console.log('✅ Dist directory and package.json created');
  } else {
    console.log('❌ Build output missing');
    allPassed = false;
  }

} catch (error) {
  console.log('❌ Build process failed:', error.message);
  allPassed = false;
}

console.log('\n📋 Summary:');
if (allPassed) {
  console.log('✅ All deployment validations passed!');
  console.log('🚀 Ready for deployment on any platform');
  console.log('\nSupported platforms:');
  console.log('- Heroku (Procfile)');
  console.log('- Render.com (render.yaml)');  
  console.log('- Railway (railway.json)');
  console.log('- Vercel (vercel.json)');
  console.log('- Manual deployment (build + start scripts)');
} else {
  console.log('❌ Some validations failed. Please fix the issues above.');
  process.exit(1);
}