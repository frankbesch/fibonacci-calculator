#!/bin/bash
# Create minimal cost 2-node Kubernetes cluster
# Run this AFTER upgrading to Pay-As-You-Go

set -e

echo "🚀 MINIMAL COST KUBERNETES CLUSTER CREATION"
echo "==========================================="
echo ""
echo "Configuration:"
echo "  • Shape: VM.Standard.E3.Flex (AMD, latest generation)"
echo "  • Nodes: 2"
echo "  • Per Node: 0.5 OCPU, 1GB RAM"
echo "  • Total: 1 OCPU, 2GB RAM"
echo "  • Estimated Cost: ~$6-8/month"
echo ""

# Configuration
CLUSTER_ID="ocid1.cluster.oc1.us-chicago-1.aaaaaaaag637h4fhp6gs3sk7e2nhd5tlblbvmnmwjrh2gatvzcz5cq4xpg3q"
WORKER_SUBNET_ID="ocid1.subnet.oc1.us-chicago-1.aaaaaaaa5pzktcwayez7w4k34jdaisxirsnnaiqsdjtum4h3ch44l5nkkpsq"
IMAGE_ID="ocid1.image.oc1.us-chicago-1.aaaaaaaa2uwykjngvpmgrekqbswmelgropwbqtb4p2e2zg7lcz6rni37rvia"
SSH_KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDFOpl+FS/hzIZ0mr5fYAK6zd3z"

echo "Step 1: Deleting any existing node pools..."
CLUSTER_ID="ocid1.cluster.oc1.us-chicago-1.aaaaaaaag637h4fhp6gs3sk7e2nhd5tlblbvmnmwjrh2gatvzcz5cq4xpg3q"
TENANCY_OCID="ocid1.tenancy.oc1..aaaaaaaaw2z4q2j3bkh6s2nh6apjezrv64i4wlr3er2pwwwhixs6x65f2vzq"

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
echo "Step 2: Creating minimal cost node pool..."
oci ce node-pool create \
  --cluster-id "$CLUSTER_ID" \
  --name "fibonacci-minimal-nodepool" \
  --compartment-id "$TENANCY_OCID" \
  --kubernetes-version "v1.33.1" \
  --node-shape "VM.Standard.E3.Flex" \
  --node-shape-config '{"ocpus":0.5,"memoryInGBs":1}' \
  --node-image-id "$IMAGE_ID" \
  --placement-configs "[{\"availabilityDomain\":\"yAdn:US-CHICAGO-1-AD-1\",\"subnetId\":\"$WORKER_SUBNET_ID\"}]" \
  --size 2 \
  --ssh-public-key "$SSH_KEY" \
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
        echo ""
        echo "🚀 Your app should be accessible at:"
        kubectl get svc fibonacci-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null | xargs -I {} echo "http://{}" || echo "LoadBalancer IP pending..."
        exit 0
    fi
    
    echo "    Nodes ready: $NODES_READY/2"
    sleep 20
    ATTEMPT=$((ATTEMPT + 1))
done

echo ""
echo "⚠️  Timeout: Cluster not ready after $MAX_ATTEMPTS attempts"
echo "Check manually with: kubectl get nodes"
exit 1
