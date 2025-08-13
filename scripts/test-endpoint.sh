#!/bin/bash

echo "🧪 Testing VideoConsultation endpoint..."
echo ""

# Test 1: Check if server is running
echo "1️⃣ Server status:"
if curl -s http://localhost:5000 > /dev/null; then
    echo "   ✅ Server is running on port 5000"
else
    echo "   ❌ Server is not running"
    exit 1
fi

# Test 2: Check main page loads
echo ""
echo "2️⃣ Main page:"
RESPONSE=$(curl -s -w "%{http_code}" http://localhost:5000)
HTTP_CODE="${RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Main page loads (HTTP $HTTP_CODE)"
else
    echo "   ❌ Main page failed (HTTP $HTTP_CODE)"
fi

# Test 3: Check video consultation route
echo ""
echo "3️⃣ VideoConsultation route:"
RESPONSE=$(curl -s -w "%{http_code}" "http://localhost:5000/video-consultation?consultationId=demo")
HTTP_CODE="${RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ VideoConsultation route loads (HTTP $HTTP_CODE)"
else
    echo "   ❌ VideoConsultation route failed (HTTP $HTTP_CODE)"
fi

# Test 4: Check Server-Timing headers on API endpoints
echo ""
echo "4️⃣ Server-Timing headers:"
TIMING_HEADER=$(curl -s -I "http://localhost:5000/api/appointments" | grep -i "server-timing" | head -1)
if [ ! -z "$TIMING_HEADER" ]; then
    echo "   ✅ Server-Timing header present: $TIMING_HEADER"
else
    echo "   ⚠️  Server-Timing header not found on API endpoints"
fi

# Test 5: Check security headers
echo ""
echo "5️⃣ Security headers:"
SECURITY_HEADERS=$(curl -s -I http://localhost:5000 | grep -E "(X-Content-Type-Options|X-Frame-Options|Strict-Transport)" | wc -l)
if [ "$SECURITY_HEADERS" -ge "2" ]; then
    echo "   ✅ Security headers present ($SECURITY_HEADERS found)"
else
    echo "   ⚠️  Security headers missing or incomplete"
fi

echo ""
echo "📊 Test Summary:"
echo "   🌐 Demo URL: http://localhost:5000/video-consultation?consultationId=demo"
echo "   📈 Performance test: ./scripts/perf-video.sh"
echo "   📋 Budget file: perf/budget.json"

echo ""
echo "🚀 Ready for Lighthouse testing!"