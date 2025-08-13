#!/bin/bash

echo "🚀 Starting performance test for VideoConsultation..."

# Create perf directory if it doesn't exist
mkdir -p perf

# Function to cleanup background processes
cleanup() {
    echo "🧹 Cleaning up background processes..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
    fi
    exit
}

# Trap cleanup on script exit
trap cleanup EXIT INT TERM

# Check if server is already running
if curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Server already running on port 5000"
    SERVER_RUNNING=true
else
    echo "🔄 Starting development server..."
    npm run dev &
    SERVER_PID=$!
    SERVER_RUNNING=false
    
    # Wait for server to be ready
    echo "⏳ Waiting for server to be ready..."
    npx wait-on http://localhost:5000 --timeout 30000
    
    if [ $? -eq 0 ]; then
        echo "✅ Server is ready!"
    else
        echo "❌ Server failed to start within 30 seconds"
        exit 1
    fi
fi

# Run Lighthouse test
echo "🔍 Running Lighthouse performance test..."
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
    --chrome-flags='--headless --no-sandbox' \
    --budget-path=./perf/budget.json \
    --save-assets

# Move generated files to perf directory
if ls localhost_5000_video-consultation*.html 1> /dev/null 2>&1; then
    mv localhost_5000_video-consultation*.html ./perf/video-baseline.html
    echo "✅ HTML report saved to perf/video-baseline.html"
fi

if ls localhost_5000_video-consultation*.json 1> /dev/null 2>&1; then
    mv localhost_5000_video-consultation*.json ./perf/video-baseline.json
    echo "✅ JSON report saved to perf/video-baseline.json"
fi

# Stop server if we started it
if [ "$SERVER_RUNNING" = false ] && [ ! -z "$SERVER_PID" ]; then
    echo "🛑 Stopping development server..."
    kill $SERVER_PID
fi

echo "📊 Performance test completed! Check reports in perf/ directory"
echo "🌐 Open perf/video-baseline.html in browser to view results"