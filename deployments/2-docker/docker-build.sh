#!/bin/bash

# Fibonacci App v2025.09.10 - Docker Build Script
# Builds the Docker image for local containerized deployment

echo "🐳 Building Fibonacci App v2025.09.10 Docker image..."
echo "📁 Project directory: $(pwd)"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found!"
    echo "   Please run this script from the project root directory."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker and try again."
    exit 1
fi

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t fibonacci-app:v2025.09.10 .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Docker image built successfully!"
    echo "📦 Image: fibonacci-app:v2025.09.10"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Run: ./docker-run.sh"
    echo "   2. Open: http://localhost:8080"
    echo ""
    echo "📋 Available commands:"
    echo "   docker images | grep fibonacci-app"
    echo "   docker run -d -p 8080:8080 --name fibonacci-app fibonacci-app:v2025.09.10"
else
    echo ""
    echo "❌ Docker build failed!"
    echo "   Check the error messages above and try again."
    exit 1
fi

