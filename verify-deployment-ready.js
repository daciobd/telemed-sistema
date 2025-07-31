#!/usr/bin/env node

/**
 * Deployment Readiness Verification Script
 * Verifies that all deployment requirements are met
 */

import fs from 'fs';

const log = (message) => console.log(`✅ ${message}`);
const error = (message) => console.error(`❌ ${message}`);
const info = (message) => console.log(`ℹ️  ${message}`);

function verifyDeploymentReadiness() {
  let allChecksPass = true;

  info('Verifying deployment readiness...\n');

  // Check 1: package.json has required scripts
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageJson.scripts && packageJson.scripts.build) {
      log('Build script found in package.json');
    } else {
      error('Build script missing in package.json');
      allChecksPass = false;
    }
    
    if (packageJson.scripts && packageJson.scripts.start) {
      log('Start script found in package.json');
    } else {
      error('Start script missing in package.json');
      allChecksPass = false;
    }
  } else {
    error('package.json not found');
    allChecksPass = false;
  }

  // Check 2: Build script exists
  if (fs.existsSync('build.js')) {
    log('build.js file exists');
  } else {
    error('build.js file missing');
    allChecksPass = false;
  }

  // Check 3: Start script exists
  if (fs.existsSync('start.js')) {
    log('start.js file exists');
  } else {
    error('start.js file missing');
    allChecksPass = false;
  }

  // Check 4: Production package.json backup exists
  if (fs.existsSync('package.production.json')) {
    log('package.production.json backup available');
  } else {
    info('package.production.json not found (optional)');
  }

  // Check 5: Deployment wrapper scripts exist
  if (fs.existsSync('deploy-build.js')) {
    log('deploy-build.js wrapper exists');
  } else {
    info('deploy-build.js not found (optional)');
  }

  if (fs.existsSync('deploy-start.js')) {
    log('deploy-start.js wrapper exists');
  } else {
    info('deploy-start.js not found (optional)');
  }

  // Check 6: TypeScript and build dependencies
  if (fs.existsSync('tsconfig.json')) {
    log('TypeScript configuration found');
  } else {
    error('tsconfig.json missing');
    allChecksPass = false;
  }

  if (fs.existsSync('vite.config.ts')) {
    log('Vite configuration found');
  } else {
    error('vite.config.ts missing');
    allChecksPass = false;
  }

  // Check 7: Build output verification (if build was run)
  if (fs.existsSync('dist')) {
    log('Build output directory exists');
    
    if (fs.existsSync('dist/public')) {
      log('Frontend build output found');
    } else {
      info('Frontend build output not found (run build first)');
    }
    
    if (fs.existsSync('dist/server')) {
      log('Backend build output found');
    } else {
      info('Backend build output not found (run build first)');
    }
  } else {
    info('Build output not found (run build first)');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  
  if (allChecksPass) {
    log('🎉 DEPLOYMENT READY!');
    console.log('\n📋 Your application is ready for deployment:');
    console.log('   • Build command: npm run build');
    console.log('   • Start command: npm run start');
    console.log('   • All required scripts and files are present');
    console.log('\n🚀 You can now deploy your application!');
  } else {
    error('❌ DEPLOYMENT NOT READY');
    console.log('\n🔧 Please fix the issues above before deploying.');
  }

  return allChecksPass;
}

// Run verification if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const isReady = verifyDeploymentReadiness();
  process.exit(isReady ? 0 : 1);
}

export default verifyDeploymentReadiness;