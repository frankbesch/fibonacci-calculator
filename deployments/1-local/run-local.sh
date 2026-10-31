#!/bin/bash

# Fibonacci App 2026.10.3 - Local HTTP Server
# Simple script to run the app locally without containerization

echo "🚀 Starting Fibonacci App 2026.10.3 locally..."
echo "📁 Project directory: $(pwd)"
echo "🌐 Server will start on: http://localhost:8080"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found!"
    echo "   Please run this script from the project root directory."
    exit 1
fi

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Using Python 3 HTTP server"
    echo "🔗 Open your browser to: http://localhost:8080"
    echo "⏹️  Press Ctrl+C to stop the server"
    echo ""
    exec python3 -m http.server 8080 --bind 127.0.0.1
else
    echo "❌ Error: Python 3 not found!"
    echo "   Please install Python 3.x or use Node.js:"
    echo "   npx http-server -p 8080 -a 127.0.0.1"
    exit 1
fi

