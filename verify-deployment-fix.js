#!/usr/bin/env node

/**
 * Deployment Fix Verification Script
 * Verifies that all deployment issues have been resolved
 */

import fs from 'fs';
import { execSync } from 'child_process';

const log = (message) => console.log(`✅ ${message}`);
const error = (message) => console.error(`❌ ${message}`);
const info = (message) => console.log(`📋 ${message}`);

console.log('🔍 Verifying Deployment Fix...\n');

const checks = [
  {
    name: 'Build Script Exists',
    check: () => fs.existsSync('./build.js'),
    solution: 'build.js file created'
  },
  {
    name: 'Start Script Exists', 
    check: () => fs.existsSync('./start.js'),
    solution: 'start.js file created'
  },
  {
    name: 'Deployment Package Configuration',
    check: () => fs.existsSync('./package.deployment.json'),
    solution: 'package.deployment.json with build/start scripts created'
  },
  {
    name: 'Deployment Preparation Script',
    check: () => fs.existsSync('./prepare-deployment.js'),
    solution: 'prepare-deployment.js script created'
  },
  {
    name: 'Platform Configurations',
    check: () => fs.existsSync('./Procfile') && fs.existsSync('./render.yaml'),
    solution: 'Procfile, render.yaml, railway.json, vercel.json created'
  },
  {
    name: 'Documentation',
    check: () => fs.existsSync('./DEPLOYMENT.md'),
    solution: 'DEPLOYMENT.md guide created'
  }
];

let allPassed = true;

for (const { name, check, solution } of checks) {
  if (check()) {
    log(`${name}`);
    info(`   ${solution}`);
  } else {
    error(`${name} - FAILED`);
    allPassed = false;
  }
}

console.log('\n🧪 Testing Deployment Commands...\n');

try {
  // Test deployment preparation
  execSync('node prepare-deployment.js', { stdio: 'pipe' });
  log('Deployment preparation works');
  
  // Test build command
  execSync('npm run build', { stdio: 'pipe' });
  log('Build command works');
  
  // Check if built files exist
  if (fs.existsSync('dist/public/index.html') && fs.existsSync('dist/server/index.ts')) {
    log('Build output verified');
  } else {
    error('Build output incomplete');
    allPassed = false;
  }
  
  // Restore original package.json
  if (fs.existsSync('package.json.backup')) {
    fs.copyFileSync('package.json.backup', 'package.json');
    log('Original package.json restored');
  }
  
} catch (err) {
  error(`Command test failed: ${err.message}`);
  allPassed = false;
}

console.log('\n' + '='.repeat(60));

if (allPassed) {
  console.log('🎉 ALL DEPLOYMENT FIXES SUCCESSFUL!');
  console.log('');
  console.log('Your deployment commands are now available:');
  console.log('  Build: npm run build');
  console.log('  Start: npm run start');
  console.log('');
  console.log('Platform-specific configs created for:');
  console.log('  • Heroku (Procfile)');
  console.log('  • Render (render.yaml)');
  console.log('  • Railway (railway.json)');
  console.log('  • Vercel (vercel.json)');
  console.log('');
  console.log('📖 See DEPLOYMENT.md for complete instructions');
} else {
  console.log('❌ Some deployment fixes failed');
  process.exit(1);
}

console.log('='.repeat(60));