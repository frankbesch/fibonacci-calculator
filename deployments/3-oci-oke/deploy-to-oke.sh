#!/bin/bash

# OCI OKE Deployment Script for Fibonacci App
# Run this in OCI Cloud Shell

set -e

echo "🚀 Starting OCI OKE Deployment for Fibonacci App"
echo "=================================================="

# Configuration
REGION="us-chicago-1"
TENANCY_OCID="${TENANCY_OCID:?export TENANCY_OCID first}"
COMPARTMENT_ID="${COMPARTMENT_ID:-$TENANCY_OCID}"
REGISTRY_NAMESPACE="<namespace>"
APP_NAME="fibonacci-app"
IMAGE_TAG="latest"

echo "📋 Configuration:"
echo "   Region: $REGION"
echo "   Registry: $REGISTRY_NAMESPACE"
echo "   App: $APP_NAME"
echo ""

# Step 1: Build Docker Image
echo "🔨 Step 1: Building Docker Image"
docker build -t $APP_NAME:$IMAGE_TAG .
echo "✅ Docker image built successfully"
echo ""

# Step 2: Tag for OCI Registry
echo "🏷️  Step 2: Tagging for OCI Registry"
docker tag $APP_NAME:$IMAGE_TAG us-chicago-1.ocir.io/$REGISTRY_NAMESPACE/$APP_NAME:$IMAGE_TAG
echo "✅ Image tagged for OCI registry"
echo ""

# Step 3: Login to OCI Registry (Cloud Shell should handle this automatically)
echo "🔐 Step 3: Pushing to OCI Container Registry"
docker push us-chicago-1.ocir.io/$REGISTRY_NAMESPACE/$APP_NAME:$IMAGE_TAG
echo "✅ Image pushed to OCI registry"
echo ""

# Step 4: Create VCN (if needed)
echo "🌐 Step 4: Setting up Networking"
VCN_NAME="fibonacci-vcn-clean"
SUBNET_NAME="fibonacci-subnet-clean"

# Check if VCN exists
VCN_ID=$(oci network vcn list --compartment-id $COMPARTMENT_ID --display-name $VCN_NAME --query 'data[0].id' --raw-output 2>/dev/null || echo "")

if [ -z "$VCN_ID" ] || [ "$VCN_ID" = "null" ]; then
    echo "   Creating VCN: $VCN_NAME"
    VCN_ID=$(oci network vcn create --compartment-id $COMPARTMENT_ID --display-name $VCN_NAME --cidr-block "10.0.0.0/16" --query 'data.id' --raw-output)
    echo "   ✅ VCN created: $VCN_ID"
else
    echo "   ✅ VCN exists: $VCN_ID"
fi

# Create Internet Gateway
IGW_ID=$(oci network internet-gateway list --compartment-id $COMPARTMENT_ID --vcn-id $VCN_ID --query 'data[0].id' --raw-output 2>/dev/null || echo "")

if [ -z "$IGW_ID" ] || [ "$IGW_ID" = "null" ]; then
    echo "   Creating Internet Gateway"
    IGW_ID=$(oci network internet-gateway create --compartment-id $COMPARTMENT_ID --vcn-id $VCN_ID --display-name "fibonacci-igw" --is-enabled true --query 'data.id' --raw-output)
    echo "   ✅ Internet Gateway created: $IGW_ID"
else
    echo "   ✅ Internet Gateway exists: $IGW_ID"
fi

# Create Route Table
RT_ID=$(oci network route-table list --compartment-id $COMPARTMENT_ID --vcn-id $VCN_ID --query 'data[0].id' --raw-output 2>/dev/null || echo "")

if [ -z "$RT_ID" ] || [ "$RT_ID" = "null" ]; then
    echo "   Creating Route Table"
    RT_ID=$(oci network route-table create --compartment-id $COMPARTMENT_ID --vcn-id $VCN_ID --display-name "fibonacci-rt" --route-rules '[{"destination": "0.0.0.0/0", "destination-type": "CIDR_BLOCK", "network-entity-id": "'$IGW_ID'"}]' --query 'data.id' --raw-output)
    echo "   ✅ Route Table created: $RT_ID"
else
    echo "   ✅ Route Table exists: $RT_ID"
fi

# Create Subnet
SUBNET_ID=$(oci network subnet list --compartment-id $COMPARTMENT_ID --vcn-id $VCN_ID --display-name $SUBNET_NAME --query 'data[0].id' --raw-output 2>/dev/null || echo "")

if [ -z "$SUBNET_ID" ] || [ "$SUBNET_ID" = "null" ]; then
    echo "   Creating Subnet: $SUBNET_NAME"
    SUBNET_ID=$(oci network subnet create --compartment-id $COMPARTMENT_ID --vcn-id $VCN_ID --display-name $SUBNET_NAME --cidr-block "10.0.1.0/24" --route-table-id $RT_ID --query 'data.id' --raw-output)
    echo "   ✅ Subnet created: $SUBNET_ID"
else
    echo "   ✅ Subnet exists: $SUBNET_ID"
fi

# Step 5: Create OKE Cluster
echo "☸️  Step 5: Creating OKE Cluster"
CLUSTER_NAME="fibonacci-cluster-clean"

# Check if cluster exists
CLUSTER_ID=$(oci ce cluster list --compartment-id $COMPARTMENT_ID --name $CLUSTER_NAME --query 'data[0].id' --raw-output 2>/dev/null || echo "")

if [ -z "$CLUSTER_ID" ] || [ "$CLUSTER_ID" = "null" ]; then
    echo "   Creating OKE Cluster: $CLUSTER_NAME"
    CLUSTER_ID=$(oci ce cluster create --compartment-id $COMPARTMENT_ID --name $CLUSTER_NAME --vcn-id $VCN_ID --kubernetes-version "v1.28.2" --endpoint-config '{"subnetId": "'$SUBNET_ID'", "isPublicIpEnabled": true}' --query 'data.id' --raw-output)
    echo "   ✅ OKE Cluster created: $CLUSTER_ID"
    echo "   ⏳ Waiting for cluster to be active (this may take 5-10 minutes)..."
    
    # Wait for cluster to be active
    while true; do
        STATE=$(oci ce cluster get --cluster-id $CLUSTER_ID --query 'data."lifecycle-state"' --raw-output)
        echo "   Current state: $STATE"
        if [ "$STATE" = "ACTIVE" ]; then
            break
        fi
        sleep 30
    done
    echo "   ✅ Cluster is now ACTIVE"
else
    echo "   ✅ OKE Cluster exists: $CLUSTER_ID"
fi

# Step 6: Create Node Pool
echo "🖥️  Step 6: Creating Node Pool"
NODEPOOL_NAME="fibonacci-nodepool-clean"

# Check if node pool exists
NODEPOOL_ID=$(oci ce node-pool list --cluster-id $CLUSTER_ID --compartment-id $COMPARTMENT_ID --name $NODEPOOL_NAME --query 'data[0].id' --raw-output 2>/dev/null || echo "")

if [ -z "$NODEPOOL_ID" ] || [ "$NODEPOOL_ID" = "null" ]; then
    echo "   Creating Node Pool: $NODEPOOL_NAME"
    
    # Get latest Oracle Linux image
    IMAGE_ID=$(oci compute image list --compartment-id $COMPARTMENT_ID --operating-system "Oracle Linux" --operating-system-version "8" --query 'data[0].id' --raw-output)
    
    NODEPOOL_ID=$(oci ce node-pool create --cluster-id $CLUSTER_ID --compartment-id $COMPARTMENT_ID --name $NODEPOOL_NAME --node-shape "VM.Standard.E2.1.Micro" --node-image-id $IMAGE_ID --node-count 2 --subnet-ids "[\"$SUBNET_ID\"]" --query 'data.id' --raw-output)
    echo "   ✅ Node Pool created: $NODEPOOL_ID"
    echo "   ⏳ Waiting for nodes to be ready (this may take 5-10 minutes)..."
    
    # Wait for nodes to be ready
    while true; do
        NODE_COUNT=$(oci ce node-pool get --node-pool-id $NODEPOOL_ID --query 'data."node-config-details".size' --raw-output)
        READY_NODES=$(oci ce node list --cluster-id $CLUSTER_ID --compartment-id $COMPARTMENT_ID --query 'data[?lifecycle-state==`ACTIVE`] | length(@)' --raw-output)
        echo "   Nodes: $READY_NODES/$NODE_COUNT ready"
        if [ "$READY_NODES" -eq "$NODE_COUNT" ] && [ "$NODE_COUNT" -gt 0 ]; then
            break
        fi
        sleep 30
    done
    echo "   ✅ All nodes are ready"
else
    echo "   ✅ Node Pool exists: $NODEPOOL_ID"
fi

# Step 7: Configure kubectl
echo "⚙️  Step 7: Configuring kubectl"
oci ce cluster create-kubeconfig --cluster-id $CLUSTER_ID --file ~/.kube/config --region $REGION --token-version 2.0.0
echo "✅ kubectl configured"

# Test kubectl connection
echo "🧪 Testing kubectl connection"
kubectl get nodes
echo "✅ kubectl connection successful"
echo ""

# Step 8: Deploy Fibonacci App
echo "🚀 Step 8: Deploying Fibonacci App"

# Create deployment
kubectl create deployment $APP_NAME --image=us-chicago-1.ocir.io/$REGISTRY_NAMESPACE/$APP_NAME:$IMAGE_TAG --port=8080

# Create service
kubectl expose deployment $APP_NAME --type=LoadBalancer --port=80 --target-port=8080

echo "✅ Fibonacci app deployed"
echo ""

# Step 9: Wait for Load Balancer
echo "⏳ Step 9: Waiting for Load Balancer IP"
echo "   This may take 2-5 minutes..."

while true; do
    EXTERNAL_IP=$(kubectl get service $APP_NAME --output=jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    if [ -n "$EXTERNAL_IP" ] && [ "$EXTERNAL_IP" != "null" ]; then
        break
    fi
    echo "   Waiting for external IP..."
    sleep 10
done

echo "✅ Load Balancer IP: $EXTERNAL_IP"
echo ""

# Step 10: Test Deployment
echo "🧪 Step 10: Testing Deployment"
echo "   Testing: http://$EXTERNAL_IP"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$EXTERNAL_IP || echo "000")
echo "   HTTP Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
    echo "🎉 SUCCESS! Fibonacci app is running at:"
    echo "   🌐 http://$EXTERNAL_IP"
    echo ""
    echo "📊 Deployment Summary:"
    echo "   ✅ Docker image built and pushed"
    echo "   ✅ VCN and networking configured"
    echo "   ✅ OKE cluster created and active"
    echo "   ✅ Node pool created and ready"
    echo "   ✅ kubectl configured"
    echo "   ✅ App deployed with LoadBalancer"
    echo "   ✅ App accessible via external IP"
    echo ""
    echo "🔗 Open your browser to: http://$EXTERNAL_IP"
else
    echo "❌ Deployment test failed. HTTP Status: $HTTP_STATUS"
    echo "   Check pod status: kubectl get pods"
    echo "   Check service status: kubectl get services"
fi
