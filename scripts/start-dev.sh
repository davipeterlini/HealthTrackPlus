#!/bin/bash

echo "🚀 Starting development server..."

# Detect operating system
OS=$(uname)

# Get local IP based on OS
if [ "$OS" = "Darwin" ]; then
    # macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -n 1 | awk '{print $2}')
elif [ "$OS" = "Linux" ]; then
    # Linux
    IP=$(ip -4 addr show scope global | grep inet | awk '{print $2}' | cut -d/ -f1 | head -n 1)
else
    # Windows with Git Bash or other
    IP=$(ipconfig | grep -i "IPv4" | head -n 1 | awk '{print $NF}')
fi

if [ -z "$IP" ]; then
    echo "⚠️ Could not detect local IP automatically."
    echo "Using localhost as fallback."
    IP="localhost"
fi

echo "📡 Network address: $IP"

# Check if capacitor.config.ts exists and update it for mobile development
if [ -f "capacitor.config.ts" ]; then
    echo "📱 Configuring for mobile development at $IP:5001"
    
    # Backup original configuration
    cp capacitor.config.ts capacitor.config.ts.backup
    
    # Update Capacitor configuration using OS-compatible method
    if [ "$OS" = "Darwin" ]; then
        # macOS requires different sed syntax
        sed -i '' "s|// url: 'http://192.168.1.100:5000',|url: 'http://$IP:5001',|g" capacitor.config.ts
        sed -i '' "s|// cleartext: true|cleartext: true|g" capacitor.config.ts
    else
        # Linux and other systems
        sed -i "s|// url: 'http://192.168.1.100:5000',|url: 'http://$IP:5001',|g" capacitor.config.ts
        sed -i "s|// cleartext: true|cleartext: true|g" capacitor.config.ts
    fi
    
    echo "✅ Capacitor configuration updated"
fi

# Start the server in development mode
echo "🌐 Starting server at http://$IP:5001"
echo "⌛ Please wait..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️ .env file not found. Copying sample.env to .env..."
    cp sample.env .env
    echo "✅ .env file created. Please check the configuration."
fi

# Start vite dev server with environment variables
echo "🔄 Loading environment variables from .env"
export $(grep -v '^#' .env | xargs)
VITE_HOST=$IP npm run dev