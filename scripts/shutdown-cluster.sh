#!/bin/bash
# ============================================================================
# OKE Cluster Shutdown Script
# ============================================================================
# Last Updated: 2025-10-10
# Purpose: Scale down OKE cluster to save costs
# Savings: ~$6-10/month when scaled to 0
# ============================================================================

set -e

echo "🛑 OKE CLUSTER SHUTDOWN"
echo "======================="
echo ""

# Check if cluster info is available
if [ -z "$NODE_POOL_ID" ]; then
    echo "⚠️  NODE_POOL_ID not set"
    echo ""
    echo "Finding node pools..."
    CLUSTER_ID=${CLUSTER_ID:-$(oci ce cluster list --lifecycle-state ACTIVE --query 'data[0].id' --raw-output 2>/dev/null)}
    
    if [ -n "$CLUSTER_ID" ]; then
        TENANCY_OCID=$(oci iam region-subscription list --query 'data[0]."tenancy-id"' --raw-output 2>/dev/null)
        NODE_POOL_ID=$(oci ce node-pool list --cluster-id "$CLUSTER_ID" --compartment-id "$TENANCY_OCID" --query 'data[0].id' --raw-output 2>/dev/null)
    fi
    
    if [ -z "$NODE_POOL_ID" ]; then
        echo "❌ Could not find node pool"
        echo ""
        echo "Please set NODE_POOL_ID manually:"
        echo "  export NODE_POOL_ID=<your-node-pool-ocid>"
        exit 1
    fi
fi

echo "Node Pool ID: ${NODE_POOL_ID:0:50}..."
echo ""

# Get current size
CURRENT_SIZE=$(oci ce node-pool get --node-pool-id "$NODE_POOL_ID" --query 'data."node-config-details".size' --raw-output 2>/dev/null || echo "unknown")
echo "Current size: $CURRENT_SIZE nodes"
echo ""

if [ "$CURRENT_SIZE" = "0" ]; then
    echo "✅ Cluster is already scaled down"
    exit 0
fi

# Confirm shutdown
read -p "Scale down to 0 nodes? This will stop all pods. (y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Shutdown cancelled"
    exit 0
fi

# Scale down pods first
echo ""
echo "Scaling down application..."
kubectl scale deployment fibonacci-app --replicas=0 2>/dev/null || echo "  App not running"

# Scale down node pool
echo "Scaling down node pool to 0..."
oci ce node-pool update \
  --node-pool-id "$NODE_POOL_ID" \
  --size 0 \
  --force

echo ""
echo "✅ Cluster shutdown initiated"
echo "=============================="
echo ""
echo "💰 Cost Savings:"
echo "  • Before: ~\$6-10/month"
echo "  • After: \$0/month (nodes scaled to 0)"
echo "  • Savings: ~\$6-10/month"
echo ""
echo "🔄 To restart cluster:"
echo "  ./scripts/startup-cluster.sh"
echo "  or manually:"
echo "  oci ce node-pool update --node-pool-id \$NODE_POOL_ID --size 2"
echo ""
echo "💡 Tip: Use Object Storage (FREE) for zero-cost hosting"
echo "  See: FREE-TIER-GUIDE.md"
