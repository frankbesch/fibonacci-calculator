#!/bin/bash
# ============================================================================
# Docker Desktop Kubernetes - One-Click Deploy
# ============================================================================
# Last Updated: 2025-10-10
# Purpose: Deploy Fibonacci app to local Docker Desktop Kubernetes
# Prerequisites: Docker Desktop with Kubernetes enabled
# ============================================================================

set -e

echo "🚀 Deploying Fibonacci App to Docker Desktop Kubernetes"
echo "========================================================="
echo ""

# Check if Docker Desktop K8s is running
CURRENT_CONTEXT=$(kubectl config current-context 2>/dev/null || echo "none")

if [ "$CURRENT_CONTEXT" != "docker-desktop" ]; then
    echo "Switching to docker-desktop context..."
    kubectl config use-context docker-desktop 2>/dev/null || {
        echo "❌ Error: Docker Desktop Kubernetes not found"
        echo ""
        echo "Please enable Kubernetes in Docker Desktop:"
        echo "  1. Open Docker Desktop"
        echo "  2. Go to Settings → Kubernetes"
        echo "  3. Check 'Enable Kubernetes'"
        echo "  4. Click 'Apply & Restart'"
        exit 1
    }
fi

# Verify Kubernetes is running
if ! kubectl get nodes >/dev/null 2>&1; then
    echo "❌ Error: Kubernetes is not responding"
    echo "Please ensure Docker Desktop Kubernetes is running"
    exit 1
fi

echo "✅ Docker Desktop Kubernetes is running"
echo ""

# Deploy application
echo "📦 Deploying application..."
kubectl apply -f ../../k8s/deployment.yaml

# Wait for deployment
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available deployment/fibonacci-app --timeout=60s

# Get deployment status
echo ""
echo "📊 Deployment Status:"
kubectl get deployments,pods,svc -l app=fibonacci-app

# Port forward in background
echo ""
echo "🌐 Setting up port forwarding..."
pkill -f "port-forward.*fibonacci-app" 2>/dev/null || true
kubectl port-forward svc/fibonacci-app 8080:80 > /dev/null 2>&1 &
PF_PID=$!

sleep 2

echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo ""
echo "📍 Access your app at: http://localhost:8080"
echo ""
echo "Useful commands:"
echo "  • View logs:     kubectl logs -l app=fibonacci-app -f"
echo "  • Scale app:     kubectl scale deployment fibonacci-app --replicas=3"
echo "  • Stop port-forward: kill $PF_PID"
echo "  • Delete app:    kubectl delete -f ../../k8s/deployment.yaml"
echo ""

# Try to open browser
if command -v open >/dev/null 2>&1; then
    sleep 1
    open http://localhost:8080 2>/dev/null || true
fi
