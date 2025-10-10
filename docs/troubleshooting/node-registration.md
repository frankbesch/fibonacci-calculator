# Node Registration Troubleshooting Guide

**Last Updated:** 2025-10-10  
**Version:** 1.0.0  
**Difficulty:** Intermediate  
**Estimated Time:** 15-30 minutes

## Overview
This guide helps troubleshoot common node registration issues in OKE (Oracle Kubernetes Engine). It covers the most frequent problems encountered during cluster setup and provides step-by-step solutions.

## Common Issues and Solutions

### 1. Nodes Not Registering with Kubernetes

#### Symptoms:
- `kubectl get nodes` returns empty or shows nodes as `NotReady`
- Node pool shows `ACTIVE` but nodes don't appear in Kubernetes
- Error: "Unable to connect to the server: dial tcp"

#### Root Causes:
1. **Network Prerequisites Not Met** (Most Common)
2. **Security List Rules Missing**
3. **Route Table Empty**
4. **Internet Gateway Not Attached**

#### Diagnostic Steps:

```bash
# Run automated diagnostic
./scripts/diagnose-oke.sh

# Manual checks
kubectl get nodes
oci ce node-pool list --cluster-id $CLUSTER_ID --compartment-id $TENANCY_OCID
```

#### Solutions:

**A. Fix Empty Route Table:**
```bash
# Get route table ID
ROUTE_TABLE_ID=$(oci ce cluster get --cluster-id $CLUSTER_ID --query 'data."endpoint-config"."subnet-id"' --raw-output | xargs -I {} oci network subnet get --subnet-id {} --query 'data."route-table-id"' --raw-output)

# Get Internet Gateway ID
IGW_ID=$(oci network internet-gateway list --compartment-id $TENANCY_OCID --vcn-id $VCN_ID --query 'data[0].id' --raw-output)

# Add default route
oci network route-table update --rt-id $ROUTE_TABLE_ID --route-rules '[{"destination":"0.0.0.0/0","networkEntityId":"'$IGW_ID'"}]'
```

**B. Fix Security List Rules:**
```bash
# Get security list ID
SECURITY_LIST_ID=$(oci ce cluster get --cluster-id $CLUSTER_ID --query 'data."endpoint-config"."subnet-id"' --raw-output | xargs -I {} oci network subnet get --subnet-id {} --query 'data."security-list-ids"[0]' --raw-output)

# Add Kubernetes API rule
oci network security-list update --security-list-id $SECURITY_LIST_ID --ingress-security-rules '[{"source":"0.0.0.0/0","protocol":"6","tcpOptions":{"destinationPortRange":{"min":6443,"max":6443}}}]'
```

### 2. Node State Errors

#### Symptoms:
- Nodes stuck in `UPDATING` state
- Error: "Compute instance was created more than 20 minutes ago and registered timeout"
- Nodes show `Unavailable` condition

#### Solutions:

**A. Wait for PayGo Upgrade:**
- PayGo upgrades can take 15-30 minutes
- Nodes may be stuck during account transition
- Wait and monitor in OCI Console

**B. Force Node Pool Recreation:**
```bash
# Delete stuck node pool
oci ce node-pool delete --node-pool-id $NODE_POOL_ID --force --wait-for-state SUCCEEDED

# Create fresh node pool
./scripts/create-minimal-cluster.sh
```

### 3. Capacity Issues

#### Symptoms:
- Error: "Out of host capacity"
- Node pool creation fails with capacity errors
- Specific to Always Free tier shapes

#### Solutions:

**A. Try Different Region:**
```bash
# List available regions
oci iam region list --query 'data[*].{Name:name, Key:key}' --output table

# Try Phoenix or Ashburn
REGION="us-phoenix-1"  # or us-ashburn-1
```

**B. Use Paid Shapes:**
```bash
# Use E5.Flex instead of A1.Flex
--node-shape "VM.Standard.E5.Flex"
--node-shape-config '{"ocpus":0.5,"memoryInGBs":1}'
```

## Quick Reference Commands

### Check Cluster Status:
```bash
oci ce cluster get --cluster-id $CLUSTER_ID --query 'data."lifecycle-state"'
```

### Check Node Pool Status:
```bash
oci ce node-pool list --cluster-id $CLUSTER_ID --compartment-id $TENANCY_OCID --query 'data[*].{Name:name, State:"lifecycle-state"}'
```

### Check Individual Nodes:
```bash
oci ce node-pool get --node-pool-id $NODE_POOL_ID --query 'data.nodes[*].{Name:name, State:"lifecycle-state"}'
```

### Check Kubernetes Nodes:
```bash
kubectl get nodes -o wide
kubectl describe nodes
```

### Check Network Configuration:
```bash
# Get cluster network details
oci ce cluster get --cluster-id $CLUSTER_ID --query 'data."endpoint-config"'

# Check route table
oci network route-table get --rt-id $ROUTE_TABLE_ID --query 'data."route-rules"'

# Check security list
oci network security-list get --security-list-id $SECURITY_LIST_ID --query 'data."ingress-security-rules"'
```

## Emergency Procedures

### Complete Cluster Reset:
```bash
# 1. Delete all node pools
oci ce node-pool list --cluster-id $CLUSTER_ID --compartment-id $TENANCY_OCID --query 'data[*].id' --raw-output | xargs -I {} oci ce node-pool delete --node-pool-id {} --force

# 2. Wait 5 minutes
sleep 300

# 3. Create fresh cluster
./scripts/create-minimal-cluster.sh
```

### Network Reset:
```bash
# 1. Create Internet Gateway
oci network internet-gateway create --compartment-id $TENANCY_OCID --vcn-id $VCN_ID --display-name "fibonacci-igw" --is-enabled true

# 2. Add default route
oci network route-table update --rt-id $ROUTE_TABLE_ID --route-rules '[{"destination":"0.0.0.0/0","networkEntityId":"'$IGW_ID'"}]'

# 3. Add security rules
oci network security-list update --security-list-id $SECURITY_LIST_ID --ingress-security-rules '[{"source":"0.0.0.0/0","protocol":"6","tcpOptions":{"destinationPortRange":{"min":6443,"max":6443}}}]'
```

## Prevention

### Best Practices:
1. **Always check network prerequisites** before creating node pools
2. **Use PayGo account** for reliable capacity
3. **Monitor node registration** during first 15 minutes
4. **Keep diagnostic script handy** for quick troubleshooting
5. **Document your network configuration** for future reference

### Pre-deployment Checklist:
- [ ] Internet Gateway exists and is enabled
- [ ] Route table has default route (0.0.0.0/0 -> IGW)
- [ ] Security list allows port 6443 from 0.0.0.0/0
- [ ] Account is upgraded to PayGo
- [ ] Sufficient capacity in region
- [ ] Correct image ID for chosen shape

## Support Resources

- **OCI Documentation**: https://docs.oracle.com/en-us/iaas/Content/ContEng/Concepts/contengnetworkconfig.htm
- **Node Doctor Script**: Available in OCI Console under Compute > Instances
- **Oracle Support**: Create service request for persistent issues
- **Community Forums**: Oracle Cloud Infrastructure Community
