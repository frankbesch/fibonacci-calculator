#!/bin/bash

# Fibonacci App v2025.09.10 - Local HTTP Server
# Simple script to run the app locally without containerization

echo "🚀 Starting Fibonacci App v2025.09.10 locally..."
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
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "✅ Using Python HTTP server"
    echo "🔗 Open your browser to: http://localhost:8080"
    echo "⏹️  Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8080
else
    echo "❌ Error: Python not found!"
    echo "   Please install Python 3.x or use Node.js:"
    echo "   npx http-server -p 8080"
    exit 1
fi

