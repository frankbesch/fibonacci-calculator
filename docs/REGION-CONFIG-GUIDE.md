# Region Configuration Guide

**Last Updated:** 2025-10-10  
**Version:** 1.0.0

## Overview
This guide explains how to configure the Fibonacci App deployment for any OCI region.

---

## Supported Regions

The deployment supports all OCI regions. Common regions include:

| Region Name | Region Key | Location |
|------------|-----------|----------|
| US East (Ashburn) | us-ashburn-1 | Virginia, USA |
| US West (Phoenix) | us-phoenix-1 | Arizona, USA |
| US Midwest (Chicago) | us-chicago-1 | Illinois, USA |
| Canada Southeast (Montreal) | ca-montreal-1 | Quebec, Canada |
| Canada Southeast (Toronto) | ca-toronto-1 | Ontario, Canada |
| UK South (London) | uk-london-1 | United Kingdom |
| Germany Central (Frankfurt) | eu-frankfurt-1 | Germany |
| India West (Mumbai) | ap-mumbai-1 | India |
| Japan East (Tokyo) | ap-tokyo-1 | Japan |
| Australia East (Sydney) | ap-sydney-1 | Australia |

**For complete list:** https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm

---

## Configuration Methods

### Method 1: Environment Variables (Recommended)

Set these environment variables before running deployment scripts:

```bash
# Set your region
export OCI_REGION="us-phoenix-1"  # Change to your region

# Set cluster ID (if you have an existing cluster)
export CLUSTER_ID="ocid1.cluster.oc1.us-phoenix-1.aaaa..."

# Optional: Set worker subnet (script will auto-detect if not set)
export WORKER_SUBNET_ID="ocid1.subnet.oc1.us-phoenix-1.aaaa..."

# Optional: Set SSH key
export OKE_SSH_KEY="ssh-rsa AAAAB3... your-public-key"

# Run deployment
./scripts/create-minimal-cluster.sh
```

### Method 2: OCI CLI Configuration

The scripts will automatically detect your region from OCI CLI config:

```bash
# Check your current region
oci iam region list

# Your default region is in ~/.oci/config
cat ~/.oci/config | grep region
```

### Method 3: Script Parameters

Modify the scripts directly (not recommended for version control):

```bash
# In scripts/create-minimal-cluster.sh
REGION="us-phoenix-1"
CLUSTER_ID="your-cluster-ocid"
```

---

## Step-by-Step: Deploy to a New Region

### 1. Choose Your Region

```bash
# List available regions for your tenancy
oci iam region-subscription list --query 'data[*]."region-name"'
```

### 2. Create OKE Cluster (If Needed)

```bash
# Set variables
export OCI_REGION="us-phoenix-1"  # Your chosen region
export TENANCY_OCID=$(oci iam region-subscription list --query 'data[0]."tenancy-id"' --raw-output)

# List or create VCN first (networking prerequisite)
oci network vcn list --compartment-id $TENANCY_OCID --region $OCI_REGION

# Create OKE cluster via OCI Console or CLI
# Console: Menu → Developer Services → Kubernetes Clusters → Create Cluster
```

### 3. Configure Environment

```bash
# Set region and cluster
export OCI_REGION="us-phoenix-1"
export CLUSTER_ID="ocid1.cluster.oc1.us-phoenix-1.aaaa..."

# Verify
echo "Region: $OCI_REGION"
echo "Cluster: $CLUSTER_ID"
```

### 4. Run Deployment

```bash
# Deploy cluster
./scripts/create-minimal-cluster.sh

# The script will:
# - Auto-detect region
# - Find appropriate OKE image for that region
# - Create node pool with regional resources
```

---

## GitHub Actions CI/CD Configuration

Update `.github/workflows/docker-build.yml` for your region:

```yaml
env:
  OCI_REGION: us-phoenix-1  # Change to your region
  OCIR_NAMESPACE: your-namespace  # Change to your namespace
  IMAGE_NAME: fibonacci-app
  OKE_CLUSTER_ID: ocid1.cluster.oc1.us-phoenix-1.aaaa...  # Your cluster
```

**To find your OCIR namespace:**
```bash
oci os ns get --query 'data' --raw-output
```

---

## Region-Specific Considerations

### 1. OKE Image Availability

Different regions may have different OKE image OCIDs. The scripts auto-detect the correct image:

```bash
# List available OKE images in your region
oci ce node-pool-options get \
  --node-pool-option-id all \
  --compartment-id $TENANCY_OCID \
  --query 'data.sources[?contains("source-name", `OKE-1.33.1`)]'
```

### 2. Shape Availability

Some regions have better availability for Always Free shapes:

- **Best for A1 (ARM)**: us-ashburn-1, us-phoenix-1
- **Best for E3/E5 (Intel)**: All regions
- **Check availability**: OCI Console → Limits, Quotas & Usage

### 3. Networking

Ensure your VCN components are in the same region:
- VCN
- Subnets
- Internet Gateway
- Route Tables
- Security Lists

---

## Troubleshooting

### Issue: "Out of host capacity"

**Solution:** Try a different availability domain or region:

```bash
# List availability domains in region
oci iam availability-domain list --query 'data[*].name'

# Update placement config in script
--placement-configs '[{"availabilityDomain":"<AD-NAME>","subnetId":"<SUBNET-ID>"}]'
```

### Issue: "Image not found"

**Solution:** Update IMAGE_ID for your region:

```bash
# Get correct image ID
export IMAGE_ID=$(oci ce node-pool-options get \
  --node-pool-option-id all \
  --compartment-id $TENANCY_OCID \
  --query 'data.sources[?contains("source-name", `OKE-1.33.1`) && !contains("source-name", `aarch64`)] | [0]."image-id"' \
  --raw-output)
```

### Issue: "Cannot connect to kubectl"

**Solution:** Update kubeconfig for your region:

```bash
oci ce cluster create-kubeconfig \
  --cluster-id $CLUSTER_ID \
  --file $HOME/.kube/config \
  --region $OCI_REGION \
  --token-version 2.0.0
```

---

## Multi-Region Deployment (Advanced)

To deploy across multiple regions for high availability:

### 1. Create clusters in multiple regions

```bash
# Region 1
export OCI_REGION="us-ashburn-1"
export CLUSTER_ID="ocid1.cluster.oc1.us-ashburn-1.aaaa..."
./scripts/create-minimal-cluster.sh

# Region 2
export OCI_REGION="us-phoenix-1"
export CLUSTER_ID="ocid1.cluster.oc1.us-phoenix-1.aaaa..."
./scripts/create-minimal-cluster.sh
```

### 2. Configure multi-region kubeconfig

```bash
# Merge contexts
export KUBECONFIG=~/.kube/config-ashburn:~/.kube/config-phoenix
kubectl config view --flatten > ~/.kube/config-merged
```

### 3. Use a global load balancer

- OCI Traffic Management (DNS-based)
- Third-party load balancer (Cloudflare, etc.)

---

## Quick Reference Commands

```bash
# List all regions
oci iam region list --output table

# Get current region
echo $OCI_REGION

# Find cluster in region
oci ce cluster list --compartment-id $TENANCY_OCID --region $OCI_REGION

# Get OCIR endpoint for region
echo "$OCI_REGION.ocir.io"

# Test deployment in region
./scripts/diagnose-oke.sh
```

---

## Cost by Region

Costs vary slightly by region. Typical pricing for VM.Standard.E5.Flex:

| Region | Cost (per OCPU/hour) | Monthly (0.5 OCPU × 2 nodes) |
|--------|---------------------|------------------------------|
| US Regions | ~$0.015 | ~$6-8 |
| EU Regions | ~$0.017 | ~$7-9 |
| AP Regions | ~$0.018 | ~$8-10 |

**Always Free resources** (available in home region only):
- 2 AMD Compute VMs (E2.1.Micro)
- 4 ARM Compute VMs (A1.Flex, up to 24GB RAM total)

---

## Best Practices

1. **Choose closest region** to your users for lowest latency
2. **Check shape availability** before deploying
3. **Use environment variables** for easy region switching
4. **Test in one region** before multi-region deployment
5. **Keep VCN resources** in the same region as cluster
6. **Update GitHub secrets** when changing regions

---

## Support

- **Region List**: https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm
- **OKE Regions**: https://docs.oracle.com/en-us/iaas/Content/ContEng/Concepts/contengprerequisites.htm
- **Diagnostic Tool**: `./scripts/diagnose-oke.sh`
