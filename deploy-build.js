#!/usr/bin/env node

/**
 * Deployment Build Script
 * Wrapper for build.js to ensure compatibility with deployment systems
 * that expect npm run build
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Deployment Build Script Started...');

try {
  // Step 1: Replace package.json with production version if needed
  if (fs.existsSync('package.production.json')) {
    console.log('📋 Using production package.json configuration...');
    fs.copyFileSync('package.json', 'package.json.backup');
    fs.copyFileSync('package.production.json', 'package.json');
  }

  // Step 2: Run the main build process
  console.log('🏗️  Running main build process...');
  execSync('node build.js', { stdio: 'inherit' });

  // Step 3: Restore original package.json if we made a backup
  if (fs.existsSync('package.json.backup')) {
    console.log('📋 Restoring original package.json...');
    fs.copyFileSync('package.json.backup', 'package.json');
    fs.unlinkSync('package.json.backup');
  }

  console.log('✅ Deployment build completed successfully!');

} catch (error) {
  console.error('❌ Deployment build failed:', error);
  
  // Restore package.json if something went wrong
  if (fs.existsSync('package.json.backup')) {
    fs.copyFileSync('package.json.backup', 'package.json');
    fs.unlinkSync('package.json.backup');
  }
  
  process.exit(1);
}