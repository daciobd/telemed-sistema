#!/usr/bin/env node

/**
 * Complete Deployment Script
 * Handles package.json switching, building, and deployment preparation
 */

import { execSync } from 'child_process';
import fs from 'fs';

const log = (message) => console.log(`🚀 ${message}`);
const error = (message) => console.error(`❌ ${message}`);

async function deploy() {
  try {
    log('Starting deployment process...');

    // Step 1: Switch to production package.json
    if (fs.existsSync('package.production.json')) {
      log('Switching to production package.json...');
      
      // Backup current package.json
      if (fs.existsSync('package.json')) {
        fs.copyFileSync('package.json', 'package.json.backup');
        log('Original package.json backed up');
      }
      
      // Use production package.json
      fs.copyFileSync('package.production.json', 'package.json');
      log('Production package.json activated');
    } else {
      error('package.production.json not found!');
      process.exit(1);
    }

    // Step 2: Verify scripts exist
    log('Verifying deployment scripts...');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!packageJson.scripts.build) {
      error('Build script not found in package.json');
      process.exit(1);
    }
    
    if (!packageJson.scripts.start) {
      error('Start script not found in package.json');
      process.exit(1);
    }

    log('✅ Build script found: ' + packageJson.scripts.build);
    log('✅ Start script found: ' + packageJson.scripts.start);

    // Step 3: Run build process
    log('Running build process...');
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Build completed successfully');

    // Step 4: Verify build output
    if (!fs.existsSync('dist')) {
      error('Build output directory not found!');
      process.exit(1);
    }

    log('✅ Build output verified');

    // Step 5: Create deployment info
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      version: packageJson.version,
      buildComplete: true,
      scriptsAvailable: {
        build: packageJson.scripts.build,
        start: packageJson.scripts.start
      }
    };

    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    log('✅ Deployment info created');

    log('🎉 Deployment preparation completed successfully!');
    log('📋 Your application is ready for deployment with:');
    log(`   Build command: npm run build`);
    log(`   Start command: npm run start`);
    log(`   Version: ${packageJson.version}`);

  } catch (err) {
    error(`Deployment failed: ${err.message}`);
    
    // Restore original package.json if something went wrong
    if (fs.existsSync('package.json.backup')) {
      fs.copyFileSync('package.json.backup', 'package.json');
      fs.unlinkSync('package.json.backup');
      log('Original package.json restored');
    }
    
    process.exit(1);
  }
}

// Run deployment if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deploy();
}

export default deploy;