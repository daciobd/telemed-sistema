#!/usr/bin/env node

/**
 * TeleMed Sistema - Critical Tests Runner
 * Executes 5 critical test suites for production readiness
 */

import { execSync } from 'child_process';
import path from 'path';

const TESTS = [
  {
    name: '🏥 Patient Creation',
    file: 'tests/critical/patient-creation.test.ts',
    description: 'Tests patient registration and validation'
  },
  {
    name: '📅 Appointment Booking', 
    file: 'tests/critical/appointment-booking.test.ts',
    description: 'Tests appointment scheduling and doctor assignment'
  },
  {
    name: '🎥 Video Consultation',
    file: 'tests/critical/video-consultation.test.ts', 
    description: 'Tests WebRTC video consultation flow'
  },
  {
    name: '⚡ API Status',
    file: 'tests/critical/api-status.test.ts',
    description: 'Tests API health and performance'
  },
  {
    name: '🔄 Complete Flow',
    file: 'tests/critical/complete-flow.test.ts',
    description: 'Tests end-to-end doctor-patient workflow'
  }
];

console.log('🩺 TeleMed Sistema - Critical Tests');
console.log('=' .repeat(50));
console.log('Running 5 critical test suites...\n');

let passed = 0;
let failed = 0;

for (const test of TESTS) {
  console.log(`${test.name}: ${test.description}`);
  
  try {
    // Run individual test file
    execSync(`npx vitest run ${test.file} --reporter=verbose`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log(`✅ ${test.name} - PASSED\n`);
    passed++;
    
  } catch (error) {
    console.log(`❌ ${test.name} - FAILED`);
    console.log(`Error: ${error.message}\n`);
    failed++;
  }
}

console.log('=' .repeat(50));
console.log(`📊 Test Results:`);
console.log(`   ✅ Passed: ${passed}/${TESTS.length}`);
console.log(`   ❌ Failed: ${failed}/${TESTS.length}`);

if (failed === 0) {
  console.log('\n🎉 All critical tests passed! System ready for production.');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failed} critical test(s) failed. Review before deployment.`);
  process.exit(1);
}