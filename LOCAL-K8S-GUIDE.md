# Local Kubernetes Deployment Guide (MacOS)

**Last Updated:** 2025-10-10  
**Cost:** Free  
**Best For:** Learning Kubernetes locally

## 🛠️ Tested Environment

**Hardware & OS:**
- **MacOS**: v15.6.1
- **RAM**: 8GB+ recommended
- **Disk**: 20GB+ free space

**Software Versions:**
- **Docker Desktop**: v4.28+ 
- **Kubernetes** (via Docker Desktop): v1.33+
- **kubectl**: v1.33+
- **Browsers**: Chrome v120+, Safari v17+, Firefox v120+

**Alternative Tools:**
- **Minikube**: v1.32+
- **Kind**: v0.20+

---

## Overview

Deploy the Fibonacci Calculator to **local Kubernetes on your MacOS** using Docker Desktop. This is the **recommended method for learning** Kubernetes without cloud costs.

### Why Local Kubernetes?

✅ **100% Free** - No cloud costs  
✅ **Full K8s Features** - Practice real Kubernetes  
✅ **Fast Iteration** - Instant deployments  
✅ **Offline Capable** - Works without internet  
✅ **Safe Environment** - Experiment without risk  

---

## Option 1: Docker Desktop Kubernetes (Recommended)

### Prerequisites
- MacOS 15.6.1 or later
- Docker Desktop installed
- At least 4GB RAM available

### Step 1: Enable Kubernetes in Docker Desktop

```bash
# Open Docker Desktop
open -a Docker

# Then:
# 1. Click Docker icon in menu bar
# 2. Select "Settings" (or "Preferences")
# 3. Go to "Kubernetes" tab
# 4. Check "Enable Kubernetes"
# 5. Click "Apply & Restart"
# 6. Wait for Kubernetes to start (green light)
```

### Step 2: Verify Kubernetes is Running

```bash
# Check context
kubectl config current-context
# Output: docker-desktop

# Check nodes
kubectl get nodes
# Output: docker-desktop   Ready    control-plane   ...

# Check system pods
kubectl get pods -n kube-system
```

### Step 3: Deploy Fibonacci App

```bash
# Navigate to project
cd fibonacci-calculator

# Switch to Docker Desktop context (if not already)
kubectl config use-context docker-desktop

# Deploy the application
kubectl apply -f k8s/deployment.yaml

# Wait for deployment
kubectl wait --for=condition=available deployment/fibonacci-app --timeout=60s

# Check status
kubectl get pods
kubectl get svc
```

### Step 4: Access Your Application

**Option A: Port Forwarding (Recommended)**
```bash
# Forward port 8080 to service
kubectl port-forward svc/fibonacci-app 8080:80

# Open browser
open http://localhost:8080
```

**Option B: NodePort Service**
```bash
# Get NodePort
kubectl get svc fibonacci-app -o jsonpath='{.spec.ports[0].nodePort}'

# Access via NodePort
open http://localhost:<nodeport>
```

### Step 5: Make Changes and Test

```bash
# Edit code in your editor
# Then rebuild and redeploy:

# Rebuild Docker image
docker build -t fibonacci-app:local .

# Update deployment
kubectl set image deployment/fibonacci-app fibonacci-app=fibonacci-app:local

# Or restart deployment
kubectl rollout restart deployment/fibonacci-app

# Watch logs
kubectl logs -f -l app=fibonacci-app
```

---

## Option 2: Minikube

### Prerequisites
```bash
# Install Minikube
brew install minikube

# Or download from: https://minikube.sigs.k8s.io/docs/start/
```

### Deploy with Minikube

```bash
# Start Minikube
minikube start --cpus=2 --memory=4096

# Verify
kubectl get nodes

# Build image in Minikube
eval $(minikube docker-env)
docker build -t fibonacci-app:latest .

# Deploy
kubectl apply -f k8s/deployment.yaml

# Access via Minikube service
minikube service fibonacci-app
# This will automatically open your browser

# Get URL
minikube service fibonacci-app --url
```

### Minikube Useful Commands

```bash
# Stop Minikube (saves state)
minikube stop

# Delete Minikube cluster
minikube delete

# View dashboard
minikube dashboard

# SSH into Minikube VM
minikube ssh
```

---

## Option 3: Kind (Kubernetes in Docker)

### Prerequisites
```bash
# Install Kind
brew install kind

# Or: go install sigs.k8s.io/kind@latest
```

### Deploy with Kind

```bash
# Create cluster
kind create cluster --name fibonacci

# Verify
kubectl cluster-info --context kind-fibonacci

# Load local image into Kind
docker build -t fibonacci-app:latest .
kind load docker-image fibonacci-app:latest --name fibonacci

# Deploy
kubectl apply -f k8s/deployment.yaml

# Port forward to access
kubectl port-forward svc/fibonacci-app 8080:80
open http://localhost:8080
```

### Kind Useful Commands

```bash
# List clusters
kind get clusters

# Delete cluster
kind delete cluster --name fibonacci

# Get kubeconfig
kind get kubeconfig --name fibonacci
```

---

## Comparison Table

| Tool | Pros | Cons | Best For |
|------|------|------|----------|
| **Docker Desktop** | Easy setup, integrated, native Mac app | Limited to 1 node | Quick start, Mac users |
| **Minikube** | Full-featured, VM-based, multi-driver support | Requires VM, slower startup | Production-like environment |
| **Kind** | Fast, multiple clusters, CI/CD friendly | Less intuitive, no dashboard | Advanced users, testing |

---

## Development Workflow

### 1. Local Development Loop

```bash
# 1. Edit code
vim index.html

# 2. Rebuild image
docker build -t fibonacci-app:dev .

# 3. Update deployment
kubectl set image deployment/fibonacci-app fibonacci-app=fibonacci-app:dev
# Or: kubectl rollout restart deployment/fibonacci-app

# 4. Check logs
kubectl logs -l app=fibonacci-app --tail=50 -f

# 5. Test
curl http://localhost:8080
```

### 2. Debug Pods

```bash
# Get pod name
POD=$(kubectl get pods -l app=fibonacci-app -o jsonpath='{.items[0].metadata.name}')

# Exec into pod
kubectl exec -it $POD -- /bin/sh

# View logs
kubectl logs $POD -f

# Describe pod
kubectl describe pod $POD
```

### 3. Test Kubernetes Features

```bash
# Scale deployment
kubectl scale deployment fibonacci-app --replicas=3

# Check HPA (if configured)
kubectl get hpa

# View events
kubectl get events --sort-by='.lastTimestamp'

# Test rolling update
kubectl set image deployment/fibonacci-app fibonacci-app=fibonacci-app:v2
kubectl rollout status deployment/fibonacci-app
kubectl rollout undo deployment/fibonacci-app  # Rollback if needed
```

---

## Quick Deploy Scripts

### Docker Desktop One-Click Deploy

Save as `local/docker-desktop-deploy.sh`:

```bash
#!/bin/bash
echo "🚀 Deploying to Docker Desktop Kubernetes"

# Check if Docker Desktop K8s is running
if ! kubectl config current-context | grep -q "docker-desktop"; then
    echo "Switching to docker-desktop context..."
    kubectl config use-context docker-desktop
fi

# Deploy
echo "Deploying application..."
kubectl apply -f k8s/deployment.yaml

# Wait for ready
echo "Waiting for deployment..."
kubectl wait --for=condition=available deployment/fibonacci-app --timeout=60s

# Port forward in background
echo "Setting up port forwarding..."
kubectl port-forward svc/fibonacci-app 8080:80 > /dev/null 2>&1 &
PF_PID=$!

echo "✅ Deployed successfully!"
echo ""
echo "📍 Access your app at: http://localhost:8080"
echo "🛑 Stop port-forward with: kill $PF_PID"
echo "📊 View logs with: kubectl logs -l app=fibonacci-app -f"
```

Make it executable:
```bash
chmod +x local/docker-desktop-deploy.sh
./local/docker-desktop-deploy.sh
```

---

## Troubleshooting

### Issue: "Kubernetes is not running"

**Solution:**
```bash
# Restart Docker Desktop
# Or enable Kubernetes:
# Docker Desktop → Settings → Kubernetes → Enable
```

### Issue: "Image pull backoff"

**Solution:**
```bash
# Build image locally
docker build -t fibonacci-app:latest .

# Update deployment to use local image
kubectl set image deployment/fibonacci-app fibonacci-app=fibonacci-app:latest

# Set imagePullPolicy to Never or IfNotPresent
kubectl patch deployment fibonacci-app -p '{"spec":{"template":{"spec":{"containers":[{"name":"fibonacci-app","imagePullPolicy":"Never"}]}}}}'
```

### Issue: "Port already in use"

**Solution:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or use different port
kubectl port-forward svc/fibonacci-app 8081:80
```

### Issue: "Context not found"

**Solution:**
```bash
# List contexts
kubectl config get-contexts

# Set correct context
kubectl config use-context docker-desktop  # or minikube, or kind-fibonacci
```

---

## Clean Up

### Docker Desktop
```bash
# Delete deployment
kubectl delete -f k8s/deployment.yaml

# Or delete everything
kubectl delete all --all
```

### Minikube
```bash
# Stop Minikube
minikube stop

# Delete cluster (frees disk space)
minikube delete
```

### Kind
```bash
# Delete cluster
kind delete cluster --name fibonacci
```

---

## Next Steps

After mastering local Kubernetes:

1. **Try OCI Free Tier** - Deploy to cloud for free
   - See [FREE-TIER-GUIDE.md](FREE-TIER-GUIDE.md)

2. **Practice OKE** - Real cloud Kubernetes
   - See [QUICKSTART.md](QUICKSTART.md)

3. **Learn Advanced K8s** - Explore more features
   - Ingress controllers
   - Persistent volumes
   - ConfigMaps and Secrets
   - Network policies

---

## Learning Resources

- **Docker Desktop K8s**: https://docs.docker.com/desktop/kubernetes/
- **Minikube**: https://minikube.sigs.k8s.io/docs/
- **Kind**: https://kind.sigs.k8s.io/
- **Kubernetes Basics**: https://kubernetes.io/docs/tutorials/kubernetes-basics/

---

## Support

- **Issues**: Check [docs/troubleshooting/](docs/troubleshooting/)
- **Questions**: Create an issue on GitHub
- **Local K8s Docs**: See tool-specific documentation above
