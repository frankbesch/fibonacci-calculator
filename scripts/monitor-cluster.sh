#!/bin/bash
# Monitor OKE 2-node cluster until ready

set -e

NODE_POOL_ID="ocid1.nodepool.oc1.us-chicago-1.aaaaaaaadfwe5ft5i5bxakqctg7xcrziupyh3nywxfddygzcyns7ti2fimva"

echo "🔄 Monitoring 2-Node Kubernetes Cluster"
echo "========================================"
echo ""
echo "Node Pool: fibonacci-free-arm-nodepool"
echo "Shape: VM.Standard.A1.Flex (ARM/Ampere)"
echo "Config: 2 nodes × 1 OCPU × 6GB RAM"
echo ""

MAX_CHECKS=40
CHECK_INTERVAL=15

for i in $(seq 1 $MAX_CHECKS); do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Check $i/$MAX_CHECKS at $(date '+%H:%M:%S')"
    echo ""
    
    # Get node pool state
    POOL_STATE=$(oci ce node-pool get --node-pool-id "$NODE_POOL_ID" --query 'data."lifecycle-state"' --raw-output 2>/dev/null || echo "ERROR")
    echo "📦 Node Pool: $POOL_STATE"
    
    # Get individual node states
    echo ""
    echo "🖥️  Individual Nodes:"
    oci ce node-pool get --node-pool-id "$NODE_POOL_ID" --query 'data.nodes[*].{Name:name, State:"lifecycle-state"}' --output table 2>/dev/null || echo "  Unable to retrieve node details"
    
    # Get Kubernetes nodes
    echo ""
    echo "☸️  Kubernetes Nodes:"
    K8S_NODES=$(kubectl get nodes --no-headers 2>/dev/null | wc -l | tr -d ' ')
    if [ "$K8S_NODES" -ge "2" ]; then
        kubectl get nodes
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ SUCCESS! 2-node cluster is ready!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        exit 0
    else
        echo "  Nodes registered: $K8S_NODES/2"
    fi
    
    # Check if pool is active
    if [ "$POOL_STATE" = "ACTIVE" ]; then
        echo ""
        echo "📌 Node pool is ACTIVE, waiting for nodes to register with Kubernetes..."
    fi
    
    # Wait before next check
    if [ $i -lt $MAX_CHECKS ]; then
        echo ""
        echo "⏳ Waiting ${CHECK_INTERVAL}s before next check..."
        sleep $CHECK_INTERVAL
        echo ""
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  Timeout: Cluster not ready after $MAX_CHECKS checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Current status:"
oci ce node-pool get --node-pool-id "$NODE_POOL_ID" --query 'data.nodes[*].{Name:name, State:"lifecycle-state", Error:"node-error"}' --output json | python3 -m json.tool
exit 1


