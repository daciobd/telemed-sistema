#!/bin/bash

echo "🔍 Executando baseline oficial do Lighthouse..."

# Create perf directory if it doesn't exist
mkdir -p perf

# Find Chrome executable
CHROME_PATH=""
if command -v chromium-browser &> /dev/null; then
    CHROME_PATH=$(which chromium-browser)
elif command -v chromium &> /dev/null; then
    CHROME_PATH=$(which chromium)
elif command -v google-chrome &> /dev/null; then
    CHROME_PATH=$(which google-chrome)
elif command -v chrome &> /dev/null; then
    CHROME_PATH=$(which chrome)
fi

if [ -z "$CHROME_PATH" ]; then
    echo "❌ Chrome/Chromium not found. Installing..."
    # Fallback using available browsers in Replit environment
    CHROME_PATH="/usr/bin/chromium-browser"
fi

echo "🌐 Using Chrome: $CHROME_PATH"
export CHROME_PATH="$CHROME_PATH"

# Check if server is running
if ! curl -s http://localhost:5000 > /dev/null; then
    echo "❌ Server not running on port 5000"
    echo "Execute: npm run dev"
    exit 1
fi

echo "✅ Server confirmed running on port 5000"
echo "🎯 Testing URL: http://localhost:5000/video-consultation?consultationId=demo"

# Run Lighthouse with proper flags
npx lighthouse \
    'http://localhost:5000/video-consultation?consultationId=demo' \
    --preset=desktop \
    --only-categories=performance,accessibility,best-practices \
    --form-factor=mobile \
    --screenEmulation.mobile \
    --throttling-method=simulate \
    --output=json \
    --output=html \
    --quiet \
    --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage --disable-gpu' \
    --budget-path=./perf/budget.json \
    --save-assets \
    --no-enable-error-reporting \
    --timeout=60000

# Move generated files
if ls localhost_5000_video-consultation*.html 1> /dev/null 2>&1; then
    mv localhost_5000_video-consultation*.html ./perf/video-baseline.html
    echo "✅ HTML report: perf/video-baseline.html"
fi

if ls localhost_5000_video-consultation*.json 1> /dev/null 2>&1; then
    mv localhost_5000_video-consultation*.json ./perf/video-baseline.json
    echo "✅ JSON report: perf/video-baseline.json"
fi

# Extract key metrics if JSON exists
if [ -f "./perf/video-baseline.json" ]; then
    echo ""
    echo "📊 BASELINE METRICS:"
    node -e "
        try {
            const r = require('./perf/video-baseline.json');
            const a = r.audits;
            const metrics = {
                perf: Math.round(r.categories.performance.score * 100),
                LCP: Math.round(a['largest-contentful-paint'].numericValue),
                TBT: Math.round(a['total-blocking-time'].numericValue),
                TTI: Math.round(a.interactive.numericValue),
                CLS: Number(a['cumulative-layout-shift'].numericValue).toFixed(3),
                transfer: Math.round(a['total-byte-weight'].numericValue / 1024)
            };
            console.log('Performance Score:', metrics.perf + '%');
            console.log('LCP (Largest Contentful Paint):', metrics.LCP + 'ms');
            console.log('TBT (Total Blocking Time):', metrics.TBT + 'ms');
            console.log('TTI (Time to Interactive):', metrics.TTI + 'ms');
            console.log('CLS (Cumulative Layout Shift):', metrics.CLS);
            console.log('Transfer Size:', metrics.transfer + 'KB');
        } catch(e) {
            console.log('❌ Error parsing metrics:', e.message);
        }
    "
    echo ""
fi

echo "🌐 Report URL: http://localhost:5000/perf/video-baseline.html"
echo "📄 JSON Data: http://localhost:5000/perf/video-baseline.json"
echo "💾 Budget: http://localhost:5000/perf/budget.json"