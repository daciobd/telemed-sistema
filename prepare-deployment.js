#!/usr/bin/env node

/**
 * Deployment Preparation Script
 * Prepares the application for deployment by ensuring all required scripts exist
 */

import fs from 'fs';
import { execSync } from 'child_process';

const log = (message) => console.log(`🔧 ${message}`);
const error = (message) => console.error(`❌ ${message}`);

try {
  log('Preparing deployment configuration...');

  // Step 1: Check if deployment package.json exists
  if (fs.existsSync('package.deployment.json')) {
    log('Copying deployment package.json...');
    
    // Backup original package.json
    if (fs.existsSync('package.json')) {
      fs.copyFileSync('package.json', 'package.json.backup');
      log('Original package.json backed up');
    }
    
    // Copy deployment package.json to package.json
    fs.copyFileSync('package.deployment.json', 'package.json');
    log('Deployment package.json activated');
  }

  // Step 2: Verify required scripts exist
  const requiredFiles = ['build.js', 'start.js'];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      error(`Required deployment file missing: ${file}`);
      process.exit(1);
    }
    log(`✅ Found ${file}`);
  }

  // Step 3: Verify package.json has required scripts
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['build', 'start'];
  
  for (const script of requiredScripts) {
    if (!packageJson.scripts || !packageJson.scripts[script]) {
      error(`Missing script in package.json: ${script}`);
      process.exit(1);
    }
    log(`✅ Found script: ${script}`);
  }

  log('✅ Deployment preparation completed successfully!');
  log('📋 Your deployment platform can now use:');
  log('   Build command: npm run build');
  log('   Start command: npm run start');

} catch (err) {
  error(`Deployment preparation failed: ${err.message}`);
  process.exit(1);
}