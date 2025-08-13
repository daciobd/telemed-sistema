#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Ensure perf directory exists
const perfDir = './perf';
if (!existsSync(perfDir)) {
  mkdirSync(perfDir, { recursive: true });
}

const runLighthouse = () => {
  console.log('🔍 Running Lighthouse performance test...');
  
  const lighthouse = spawn('npx', [
    'lighthouse',
    'http://localhost:5000/video-consultation?consultationId=demo',
    '--preset=desktop',
    '--only-categories=performance,accessibility,best-practices',
    '--form-factor=mobile',
    '--screenEmulation.mobile',
    '--throttling-method=simulate',
    '--output=json',
    '--output=html',
    '--quiet',
    '--chrome-flags=--headless --no-sandbox',
    '--budget-path=./perf/budget.json',
    '--save-assets'
  ], {
    stdio: 'inherit'
  });

  lighthouse.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Lighthouse test completed successfully');
      
      // Move generated files to perf directory
      const moveFiles = spawn('bash', ['-c', `
        if ls localhost_5000_video-consultation*.html 1> /dev/null 2>&1; then
          mv localhost_5000_video-consultation*.html ./perf/video-baseline.html
          echo "✅ HTML report moved to perf/video-baseline.html"
        fi
        if ls localhost_5000_video-consultation*.json 1> /dev/null 2>&1; then
          mv localhost_5000_video-consultation*.json ./perf/video-baseline.json
          echo "✅ JSON report moved to perf/video-baseline.json"
        fi
      `], {
        stdio: 'inherit'
      });

      moveFiles.on('close', () => {
        console.log('📊 Performance reports available in perf/ directory');
        process.exit(0);
      });
    } else {
      console.error('❌ Lighthouse test failed');
      process.exit(1);
    }
  });

  lighthouse.on('error', (err) => {
    console.error('❌ Failed to start Lighthouse:', err);
    process.exit(1);
  });
};

runLighthouse();