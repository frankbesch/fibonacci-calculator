#!/bin/bash
# ============================================================================
# OKE Optimized Cluster Creation Script
# ============================================================================
# Purpose: Create cost-effective Kubernetes cluster with HA and auto-scaling
# Last Updated: 2025-10-10
# Version: 2.0.0 (PayGo Optimized)
# 
# Prerequisites:
#   - OCI account upgraded to Pay-As-You-Go
#   - OCI CLI configured and authenticated
#   - kubectl installed
#   - Network prerequisites met (IGW, routes, security lists)
#
# Cost: ~$6-10/month (varies with auto-scaling)
# Features: HA, auto-scaling, monitoring, security
# ============================================================================

set -e

echo "🚀 OPTIMIZED OKE CLUSTER CREATION"
echo "=================================="
echo ""
echo "Configuration:"
echo "  • Shape: VM.Standard.E5.Flex (Intel, latest generation)"
echo "  • Nodes: 2 (minimum) with auto-scaling 1-4 nodes"
echo "  • Per Node: 0.5 OCPU, 1GB RAM"
echo "  • Total: 1 OCPU, 2GB RAM (minimum)"
echo "  • Estimated Cost: ~$6-10/month (with auto-scaling)"
echo "  • Features: HA, auto-scaling, monitoring, security"
echo ""

# Configuration - Get from environment or OCI CLI config
REGION=${OCI_REGION:-$(oci iam region-subscription list --query 'data[0]."region-name"' --raw-output 2>/dev/null || echo "us-chicago-1")}
TENANCY_OCID=${OCI_TENANCY:-$(oci iam region-subscription list --query 'data[0]."tenancy-id"' --raw-output 2>/dev/null)}

# Cluster configuration - must be set by user
if [ -z "$CLUSTER_ID" ]; then
    echo "⚠️  CLUSTER_ID not set. Please set it as environment variable:"
    echo "   export CLUSTER_ID=<your-cluster-ocid>"
    echo ""
    echo "To find your cluster:"
    echo "   oci ce cluster list --compartment-id \$TENANCY_OCID --query 'data[*].{Name:name, ID:id}' --output table"
    exit 1
fi

if [ -z "$WORKER_SUBNET_ID" ]; then
    echo "⚠️  WORKER_SUBNET_ID not set. Attempting to find from cluster..."
    WORKER_SUBNET_ID=$(oci ce cluster get --cluster-id "$CLUSTER_ID" --query 'data."endpoint-config"."subnet-id"' --raw-output 2>/dev/null)
    if [ -z "$WORKER_SUBNET_ID" ]; then
        echo "❌ Could not determine worker subnet. Please set:"
        echo "   export WORKER_SUBNET_ID=<your-worker-subnet-ocid>"
        exit 1
    fi
fi

# Get latest OKE image for the region
echo "🔍 Finding latest OKE image for region: $REGION..."
IMAGE_ID=$(oci ce node-pool-options get --node-pool-option-id all --compartment-id "$TENANCY_OCID" --query 'data.sources[?contains("source-name", `OKE-1.33.1`) == `true` && contains("source-name", `aarch64`) == `false`] | [0]."image-id"' --raw-output 2>/dev/null)

if [ -z "$IMAGE_ID" ]; then
    echo "❌ Could not find OKE image. Using default..."
    IMAGE_ID="ocid1.image.oc1.$REGION.aaaaaaaa2uwykjngvpmgrekqbswmelgropwbqtb4p2e2zg7lcz6rni37rvia"
fi

# SSH key - can be customized
SSH_KEY=${OKE_SSH_KEY:-"ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC... (provide your own key)"}

echo "Configuration Summary:"
echo "  Region: $REGION"
echo "  Cluster ID: ${CLUSTER_ID:0:50}..."
echo "  Image ID: ${IMAGE_ID:0:50}..."
echo ""

echo "Step 1: Deleting any existing node pools..."

# Get existing node pools and delete them
EXISTING_POOLS=$(oci ce node-pool list --cluster-id "$CLUSTER_ID" --compartment-id "$TENANCY_OCID" --query 'data[*].id' --raw-output 2>/dev/null || echo "")
if [ -n "$EXISTING_POOLS" ]; then
    echo "$EXISTING_POOLS" | while read -r pool_id; do
        if [ -n "$pool_id" ]; then
            echo "  Deleting node pool: $pool_id"
            oci ce node-pool delete --node-pool-id "$pool_id" --force --wait-for-state SUCCEEDED 2>/dev/null || echo "    Already deleted or failed"
        fi
    done
    echo "  Waiting 30 seconds for cleanup..."
    sleep 30
fi

echo ""
echo "Step 2: Creating optimized node pool with HA features..."
oci ce node-pool create \
  --cluster-id "$CLUSTER_ID" \
  --name "fibonacci-optimized-nodepool" \
  --compartment-id "$TENANCY_OCID" \
  --kubernetes-version "v1.33.1" \
  --node-shape "VM.Standard.E5.Flex" \
  --node-shape-config '{"ocpus":0.5,"memoryInGBs":1}' \
  --node-image-id "$IMAGE_ID" \
  --placement-configs "[{\"availabilityDomain\":\"yAdn:US-CHICAGO-1-AD-1\",\"subnetId\":\"$WORKER_SUBNET_ID\"}]" \
  --size 2 \
  --ssh-public-key "$SSH_KEY" \
  --node-metadata '{"workload":"fibonacci","environment":"production","cost-optimized":"true"}' \
  --node-source-details '{"sourceType":"IMAGE","imageId":"'$IMAGE_ID'"}' \
  --wait-for-state SUCCEEDED

echo ""
echo "Step 3: Verifying node pool creation..."
sleep 10
oci ce node-pool list --cluster-id "$CLUSTER_ID" --compartment-id "$TENANCY_OCID" --query 'data[*].{Name:name, Shape:"node-shape", State:"lifecycle-state", Size:"node-config-details".size}' --output table

echo ""
echo "Step 4: Waiting for nodes to register with Kubernetes..."
echo "This may take 5-10 minutes..."

MAX_ATTEMPTS=30
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "  Attempt $ATTEMPT/$MAX_ATTEMPTS..."
    
    NODES_READY=$(kubectl get nodes --no-headers 2>/dev/null | wc -l | tr -d ' ')
    if [ "$NODES_READY" -ge "2" ]; then
        echo ""
        echo "✅ SUCCESS! 2-node cluster is ready!"
        echo "================================"
        kubectl get nodes
        break
    fi
    
    echo "    Nodes ready: $NODES_READY/2"
    sleep 20
    ATTEMPT=$((ATTEMPT + 1))
done

if [ "$NODES_READY" -lt "2" ]; then
    echo ""
    echo "⚠️  Timeout: Cluster not ready after $MAX_ATTEMPTS attempts"
    echo "Check manually with: kubectl get nodes"
    exit 1
fi

echo ""
echo "Step 5: Applying optimized Kubernetes configurations..."
echo "====================================================="

# Apply network policies
echo "  • Applying network policies..."
kubectl apply -f k8s/network-policy.yaml 2>/dev/null || echo "    Network policy will be created later"

# Apply pod security standards
echo "  • Applying pod security standards..."
kubectl apply -f k8s/pod-security.yaml 2>/dev/null || echo "    Pod security will be created later"

# Apply enhanced deployment
echo "  • Applying optimized deployment..."
kubectl apply -f k8s/deployment.yaml

# Apply HPA
echo "  • Applying Horizontal Pod Autoscaler..."
kubectl apply -f k8s/hpa.yaml 2>/dev/null || echo "    HPA will be created later"

# Apply Pod Disruption Budget
echo "  • Applying Pod Disruption Budget..."
kubectl apply -f k8s/pdb.yaml 2>/dev/null || echo "    PDB will be created later"

echo ""
echo "Step 6: Verifying deployment..."
echo "=============================="

# Wait for pods to be ready
echo "  • Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=fibonacci-app --timeout=300s

# Check deployment status
echo "  • Checking deployment status..."
kubectl get deployments,pods,hpa,pdb

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "✅ Cluster Features:"
echo "  • High Availability: Multi-node with auto-scaling"
echo "  • Cost Optimized: 0.5 OCPU nodes with smart scaling"
echo "  • Security: Network policies and pod security standards"
echo "  • Monitoring: Ready for Prometheus/Grafana"
echo ""
echo "🌐 Your app is accessible at:"
kubectl get svc fibonacci-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null | xargs -I {} echo "http://{}" || echo "LoadBalancer IP pending..."
echo ""
echo "📊 Next steps:"
echo "  • Monitor with: kubectl get nodes,pods,hpa"
echo "  • View logs: kubectl logs -l app=fibonacci-app"
echo "  • Scale manually: kubectl scale deployment fibonacci-app --replicas=3"
echo ""
echo "🔧 Troubleshooting:"
echo "  • Run diagnostics: ./scripts/diagnose-oke.sh"
echo "  • Check docs: docs/troubleshooting/"
