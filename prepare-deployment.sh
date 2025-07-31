#!/bin/bash

# Deployment Preparation Script
# Ensures the correct package.json is used for deployment

echo "🚀 Preparing deployment configuration..."

# Check if production package.json exists
if [ -f "package.production.json" ]; then
    echo "📋 Switching to production package.json..."
    
    # Backup current package.json
    if [ -f "package.json" ]; then
        cp package.json package.json.backup
        echo "✅ Original package.json backed up"
    fi
    
    # Use production package.json
    cp package.production.json package.json
    echo "✅ Production package.json activated"
    
    # Verify the scripts exist
    if npm run build --dry-run >/dev/null 2>&1; then
        echo "✅ Build script verified"
    else
        echo "❌ Build script missing or invalid"
        exit 1
    fi
    
    if npm run start --dry-run >/dev/null 2>&1; then
        echo "✅ Start script verified"
    else
        echo "❌ Start script missing or invalid"
        exit 1
    fi
    
    echo "🎉 Deployment preparation completed successfully!"
    echo "📋 Available scripts:"
    npm run --silent 2>/dev/null | grep -E "^\s+(build|start|dev)"
    
else
    echo "❌ package.production.json not found!"
    echo "📋 Using current package.json for deployment"
    
    # Check if current package.json has required scripts
    if ! npm run build --dry-run >/dev/null 2>&1; then
        echo "❌ Current package.json missing build script"
        exit 1
    fi
    
    if ! npm run start --dry-run >/dev/null 2>&1; then
        echo "❌ Current package.json missing start script"
        exit 1
    fi
fi

echo "✅ Ready for deployment!"