#!/bin/bash
# ============================================================================
# OKE Automated Diagnostic Tool
# ============================================================================
# Purpose: Comprehensive troubleshooting for OKE deployments
# Last Updated: 2025-10-10
# Version: 1.0.0
#
# What This Checks:
#   - Cluster and node pool status
#   - Kubernetes API connectivity
#   - Network prerequisites (IGW, routes, security lists)
#   - Application deployment status
#   - Resource usage and health
#
# Usage: ./scripts/diagnose-oke.sh
# Output: Detailed diagnostic report with recommended actions
#
# Note: Requires OCI CLI and kubectl to be configured
# ============================================================================

set -e

echo "🔧 OKE DIAGNOSTIC SCRIPT"
echo "========================"
echo "Timestamp: $(date)"
echo ""

# Configuration - Get from environment or OCI CLI
REGION=${OCI_REGION:-$(oci iam region-subscription list --query 'data[0]."region-name"' --raw-output 2>/dev/null || echo "unknown")}
TENANCY_OCID=${OCI_TENANCY:-$(oci iam region-subscription list --query 'data[0]."tenancy-id"' --raw-output 2>/dev/null)}
CLUSTER_ID=${CLUSTER_ID:-$(oci ce cluster list --compartment-id "$TENANCY_OCID" --lifecycle-state ACTIVE --query 'data[0].id' --raw-output 2>/dev/null)}

if [ -z "$CLUSTER_ID" ] || [ "$CLUSTER_ID" = "None" ]; then
    echo "❌ No active cluster found. Please set CLUSTER_ID:"
    echo "   export CLUSTER_ID=<your-cluster-ocid>"
    echo ""
    echo "To list clusters:"
    echo "   oci ce cluster list --compartment-id \$TENANCY_OCID --query 'data[*].{Name:name, ID:id}' --output table"
    exit 1
fi

echo "📊 CLUSTER STATUS CHECK"
echo "======================"

# Check cluster status
echo "1. Cluster Status:"
CLUSTER_STATUS=$(oci ce cluster get --cluster-id "$CLUSTER_ID" --query 'data."lifecycle-state"' --raw-output 2>/dev/null || echo "ERROR")
echo "   Cluster State: $CLUSTER_STATUS"

if [ "$CLUSTER_STATUS" != "ACTIVE" ]; then
    echo "   ⚠️  Cluster is not ACTIVE. Check OCI Console for details."
fi

# Check node pools
echo ""
echo "2. Node Pool Status:"
oci ce node-pool list --cluster-id "$CLUSTER_ID" --compartment-id "$TENANCY_OCID" --query 'data[*].{Name:name, State:"lifecycle-state", Size:"node-config-details".size}' --output table 2>/dev/null || echo "   ERROR: Cannot list node pools"

# Check individual nodes
echo ""
echo "3. Individual Node Status:"
NODE_POOLS=$(oci ce node-pool list --cluster-id "$CLUSTER_ID" --compartment-id "$TENANCY_OCID" --query 'data[*].id' --raw-output 2>/dev/null || echo "")

if [ -n "$NODE_POOLS" ]; then
    echo "$NODE_POOLS" | while read -r pool_id; do
        if [ -n "$pool_id" ]; then
            echo "   Node Pool: $pool_id"
            oci ce node-pool get --node-pool-id "$pool_id" --query 'data.nodes[*].{Name:name, State:"lifecycle-state", Details:"lifecycle-details"}' --output table 2>/dev/null || echo "     ERROR: Cannot get node details"
        fi
    done
fi

echo ""
echo "🌐 NETWORK CONNECTIVITY CHECK"
echo "============================="

# Check kubectl connectivity
echo "4. Kubernetes API Connectivity:"
if kubectl cluster-info >/dev/null 2>&1; then
    echo "   ✅ kubectl can connect to cluster"
    
    # Check nodes in Kubernetes
    echo ""
    echo "5. Kubernetes Node Status:"
    kubectl get nodes -o wide 2>/dev/null || echo "   ERROR: Cannot get Kubernetes nodes"
    
    # Check node conditions
    echo ""
    echo "6. Node Conditions:"
    kubectl describe nodes 2>/dev/null | grep -A 10 "Conditions:" || echo "   ERROR: Cannot get node conditions"
    
else
    echo "   ❌ kubectl cannot connect to cluster"
    echo "   This indicates a network connectivity issue."
fi

echo ""
echo "🔍 NETWORK PREREQUISITES CHECK"
echo "=============================="

# Get cluster details for network analysis
echo "7. Cluster Network Configuration:"
CLUSTER_DETAILS=$(oci ce cluster get --cluster-id "$CLUSTER_ID" --query 'data' 2>/dev/null || echo "{}")

if [ "$CLUSTER_DETAILS" != "{}" ]; then
    ENDPOINT_SUBNET=$(echo "$CLUSTER_DETAILS" | jq -r '."endpoint-config"."subnet-id"' 2>/dev/null || echo "UNKNOWN")
    WORKER_SUBNET=$(echo "$CLUSTER_DETAILS" | jq -r '."endpoint-config"."nsg-ids"[0]' 2>/dev/null || echo "UNKNOWN")
    
    echo "   Endpoint Subnet: $ENDPOINT_SUBNET"
    echo "   Worker Subnet: $WORKER_SUBNET"
    
    # Check endpoint subnet configuration
    if [ "$ENDPOINT_SUBNET" != "UNKNOWN" ]; then
        echo ""
        echo "8. Endpoint Subnet Analysis:"
        SUBNET_DETAILS=$(oci network subnet get --subnet-id "$ENDPOINT_SUBNET" --query 'data' 2>/dev/null || echo "{}")
        
        if [ "$SUBNET_DETAILS" != "{}" ]; then
            VCN_ID=$(echo "$SUBNET_DETAILS" | jq -r '."vcn-id"' 2>/dev/null || echo "UNKNOWN")
            ROUTE_TABLE_ID=$(echo "$SUBNET_DETAILS" | jq -r '."route-table-id"' 2>/dev/null || echo "UNKNOWN")
            SECURITY_LIST_ID=$(echo "$SUBNET_DETAILS" | jq -r '."security-list-ids"[0]' 2>/dev/null || echo "UNKNOWN")
            
            echo "   VCN ID: $VCN_ID"
            echo "   Route Table ID: $ROUTE_TABLE_ID"
            echo "   Security List ID: $SECURITY_LIST_ID"
            
            # Check route table
            if [ "$ROUTE_TABLE_ID" != "UNKNOWN" ]; then
                echo ""
                echo "9. Route Table Analysis:"
                ROUTES=$(oci network route-table get --rt-id "$ROUTE_TABLE_ID" --query 'data."route-rules"' 2>/dev/null || echo "[]")
                
                if [ "$ROUTES" != "[]" ]; then
                    echo "   ✅ Route table has rules"
                    echo "$ROUTES" | jq -r '.[] | "   Route: \(.destination) -> \(."network-entity-id")"' 2>/dev/null || echo "   ERROR: Cannot parse routes"
                else
                    echo "   ❌ Route table is empty - this is likely the problem!"
                    echo "   Solution: Add default route (0.0.0.0/0) to Internet Gateway"
                fi
            fi
            
            # Check Internet Gateway
            echo ""
            echo "10. Internet Gateway Check:"
            IGW_LIST=$(oci network internet-gateway list --compartment-id "$TENANCY_OCID" --vcn-id "$VCN_ID" --query 'data[*].{ID:id, Name:"display-name", State:"lifecycle-state"}' --output table 2>/dev/null || echo "ERROR")
            
            if [ "$IGW_LIST" != "ERROR" ]; then
                echo "$IGW_LIST"
                
                # Check if IGW is attached to route table
                IGW_ATTACHED=$(echo "$ROUTES" | jq -r '.[] | select(."network-entity-id" | contains("internetgateway")) | ."network-entity-id"' 2>/dev/null || echo "")
                
                if [ -n "$IGW_ATTACHED" ]; then
                    echo "   ✅ Internet Gateway is attached to route table"
                else
                    echo "   ❌ Internet Gateway not attached to route table"
                    echo "   Solution: Add route 0.0.0.0/0 -> Internet Gateway"
                fi
            else
                echo "   ❌ Cannot list Internet Gateways"
            fi
        fi
    fi
fi

echo ""
echo "🔒 SECURITY LIST CHECK"
echo "======================"

# Check security list rules
echo "11. Security List Analysis:"
if [ "$SECURITY_LIST_ID" != "UNKNOWN" ]; then
    SECURITY_RULES=$(oci network security-list get --security-list-id "$SECURITY_LIST_ID" --query 'data."ingress-security-rules"' 2>/dev/null || echo "[]")
    
    # Check for port 6443 (Kubernetes API)
    PORT_6443_RULE=$(echo "$SECURITY_RULES" | jq -r '.[] | select(.tcpOptions.portRange.min == 6443 and .tcpOptions.portRange.max == 6443) | .source' 2>/dev/null || echo "")
    
    if [ -n "$PORT_6443_RULE" ]; then
        echo "   ✅ Port 6443 (Kubernetes API) is allowed from: $PORT_6443_RULE"
    else
        echo "   ❌ Port 6443 (Kubernetes API) is not allowed"
        echo "   Solution: Add ingress rule for 0.0.0.0/0:6443"
    fi
    
    # Check for port 22 (SSH)
    PORT_22_RULE=$(echo "$SECURITY_RULES" | jq -r '.[] | select(.tcpOptions.portRange.min == 22 and .tcpOptions.portRange.max == 22) | .source' 2>/dev/null || echo "")
    
    if [ -n "$PORT_22_RULE" ]; then
        echo "   ✅ Port 22 (SSH) is allowed from: $PORT_22_RULE"
    else
        echo "   ⚠️  Port 22 (SSH) is not allowed (may be intentional)"
    fi
else
    echo "   ❌ Cannot check security list"
fi

echo ""
echo "📋 APPLICATION STATUS CHECK"
echo "==========================="

# Check if kubectl works
if kubectl cluster-info >/dev/null 2>&1; then
    echo "12. Application Deployment Status:"
    kubectl get deployments,pods,services,hpa,pdb 2>/dev/null || echo "   ERROR: Cannot get application status"
    
    echo ""
    echo "13. Pod Logs (last 10 lines):"
    kubectl logs -l app=fibonacci-app --tail=10 2>/dev/null || echo "   No logs available"
    
    echo ""
    echo "14. Resource Usage:"
    kubectl top nodes 2>/dev/null || echo "   Metrics server not available"
    kubectl top pods 2>/dev/null || echo "   Metrics server not available"
fi

echo ""
echo "🎯 RECOMMENDED ACTIONS"
echo "======================"

# Generate recommendations based on findings
if [ "$CLUSTER_STATUS" != "ACTIVE" ]; then
    echo "1. ❌ CRITICAL: Cluster is not ACTIVE"
    echo "   Action: Check OCI Console for cluster issues"
fi

if kubectl cluster-info >/dev/null 2>&1; then
    NODE_COUNT=$(kubectl get nodes --no-headers 2>/dev/null | wc -l | tr -d ' ')
    if [ "$NODE_COUNT" -lt 2 ]; then
        echo "2. ⚠️  WARNING: Only $NODE_COUNT nodes registered"
        echo "   Action: Wait for nodes to register or check node pool status"
    else
        echo "2. ✅ Good: $NODE_COUNT nodes registered"
    fi
else
    echo "2. ❌ CRITICAL: Cannot connect to Kubernetes API"
    echo "   Action: Check network prerequisites (see above)"
fi

if [ "$ROUTES" = "[]" ]; then
    echo "3. ❌ CRITICAL: Route table is empty"
    echo "   Action: Add default route to Internet Gateway"
fi

if [ -z "$PORT_6443_RULE" ]; then
    echo "4. ❌ CRITICAL: Port 6443 not allowed"
    echo "   Action: Add security list rule for Kubernetes API"
fi

echo ""
echo "🔧 QUICK FIXES"
echo "=============="
echo "If you found issues above, try these commands:"
echo ""
echo "# Fix empty route table:"
echo "oci network route-table update --rt-id \$ROUTE_TABLE_ID --route-rules '[{\"destination\":\"0.0.0.0/0\",\"networkEntityId\":\"\$IGW_ID\"}]'"
echo ""
echo "# Add Kubernetes API security rule:"
echo "oci network security-list update --security-list-id \$SECURITY_LIST_ID --ingress-security-rules '[{\"source\":\"0.0.0.0/0\",\"protocol\":\"6\",\"tcpOptions\":{\"destinationPortRange\":{\"min\":6443,\"max\":6443}}}]'"
echo ""
echo "# Check node pool status:"
echo "oci ce node-pool list --cluster-id \$CLUSTER_ID --compartment-id \$TENANCY_OCID"
echo ""
echo "# Restart stuck nodes:"
echo "oci ce node-pool delete --node-pool-id \$NODE_POOL_ID --force"
echo "./scripts/create-minimal-cluster.sh"

echo ""
echo "📄 DIAGNOSTIC COMPLETE"
echo "====================="
echo "Generated: $(date)"
echo "Cluster: $CLUSTER_ID"
echo "Region: $REGION"
