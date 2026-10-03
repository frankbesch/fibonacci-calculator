# OCI Free Tier Deployment Guide

**Last Updated:** 2025-10-10  
**Cost:** $0 (Completely Free)  
**Best For:** Quick demos, static hosting, no K8s complexity

---

## Overview

Deploy the Fibonacci Calculator to OCI **completely free** using Object Storage. This is the recommended deployment method for zero-cost hosting.

### Why Object Storage?

✅ **100% Free Forever** - Part of OCI Always Free tier  
✅ **No Kubernetes** - Simple static file hosting  
✅ **Fast Setup** - Deploy in under 10 minutes  
✅ **Global Access** - Accessible from anywhere  
✅ **No Maintenance** - Set it and forget it  

❌ **Limitations**: No Kubernetes features, no auto-scaling, static content only

---

## Option 1: Object Storage (Recommended - 100% Free)

### Prerequisites
- OCI account (Free Tier)
- OCI CLI configured
- Bucket name: `fibonacci-app`

### Step 1: Create Object Storage Bucket

```bash
# Set your region
export OCI_REGION="us-phoenix-1"  # or your preferred region

# Create bucket
oci os bucket create \
  --name fibonacci-app \
  --compartment-id $(oci iam compartment list --query 'data[0].id' --raw-output) \
  --public-access-type ObjectRead

# Verify bucket creation
oci os bucket get --name fibonacci-app
```

### Step 2: Upload Application Files

```bash
# Navigate to project directory
cd fibonacci-calculator

# Upload files
oci os object put --bucket-name fibonacci-app --file index.html --name index.html
oci os object put --bucket-name fibonacci-app --file styles.css --name styles.css
oci os object put --bucket-name fibonacci-app --file app.js --name app.js
oci os object put --bucket-name fibonacci-app --file fibonacci.js --name fibonacci.js

# Set content types
oci os object put --bucket-name fibonacci-app --file index.html --name index.html --content-type text/html
oci os object put --bucket-name fibonacci-app --file styles.css --name styles.css --content-type text/css
oci os object put --bucket-name fibonacci-app --file app.js --name app.js --content-type application/javascript
oci os object put --bucket-name fibonacci-app --file fibonacci.js --name fibonacci.js --content-type application/javascript
```

### Step 3: Get Your URL

```bash
# Get namespace
NAMESPACE=$(oci os ns get --query data --raw-output)

# Your app URL
echo "https://objectstorage.$OCI_REGION.oraclecloud.com/n/$NAMESPACE/b/fibonacci-app/o/index.html"
```

### Example URL Format:
```
https://objectstorage.us-phoenix-1.oraclecloud.com/n/<namespace>/b/fibonacci-app/o/index.html
```

---

## Option 2: OKE with E2.1.Micro (NOT SUPPORTED)

### ❌ Why E2.1.Micro Doesn't Work for OKE

OCI Always Free includes:
- 2× VM.Standard.E2.1.Micro instances
- 4× ARM-based A1.Flex instances (up to 24GB RAM total)

**However**, VM.Standard.E2.1.Micro is **NOT supported** for OKE node pools.

### Supported Always Free Shape for OKE:
- ✅ **VM.Standard.A1.Flex** (ARM-based)
  - Up to 4 OCPUs and 24GB RAM total
  - **Limitation**: Often out of capacity
  - **Regions with best availability**: us-ashburn-1, us-phoenix-1

### Try A1.Flex (if capacity available):

```bash
# Check A1 availability
oci ce node-pool-options get \
  --node-pool-option-id all \
  --compartment-id $(oci iam compartment list --query 'data[0].id' --raw-output) \
  --query 'data.shapes[?contains(@, `A1`)]'

# If available, create A1 node pool
# (Note: Capacity is limited, may get "Out of host capacity" error)
```

---

## Option 3: Minimal OKE (~$7-22/month)

If you want to practice Kubernetes but A1.Flex is unavailable, use minimal paid nodes.

### Configuration:
- **Shape**: VM.Standard.E5.Flex
- **Nodes**: 2 × 1 OCPU × 2GB RAM (minimum required)
- **Cost**: ~$21.60/month (24/7) or ~$7.20/month (8hrs/day with auto-shutdown)
- **Features**: Full Kubernetes cluster

**Important:** E5.Flex requires minimum 1 OCPU per node (not 0.5 OCPU). This increases costs compared to initial estimates.

### Deploy:

```bash
# Set environment variables
export OCI_REGION="us-phoenix-1"
export CLUSTER_ID="<your-cluster-ocid>"

# Run deployment script
./scripts/create-minimal-cluster.sh
```

### Cost Control Strategies:

**1. Auto-Shutdown Script**
```bash
# Save to scripts/shutdown-cluster.sh
#!/bin/bash
echo "Scaling down to save costs..."
kubectl scale deployment fibonacci-app --replicas=0
oci ce node-pool update --node-pool-id $NODE_POOL_ID --size 0
echo "Cluster scaled down. Savings: ~$6/month"
```

**2. Schedule-Based Scaling**
```bash
# Run only during business hours (8 hours/day)
# Cost reduction: ~67% ($21.60/mo → $7.20/mo)

# Morning startup (cron: 0 8 * * *)
./scripts/startup-cluster.sh

# Evening shutdown (cron: 0 17 * * *)
./scripts/shutdown-cluster.sh
```

**3. Cost Calculator**
```bash
# Calculate your costs
./scripts/cost-calculator.sh 2 1 8
# Output: Configuration: 2 nodes × 1 OCPU
#         Usage: 8 hours/day
#         Cost: $7.20/month
```

---

## Deployment Comparison

| Method | Cost | Setup Time | K8s Features | Maintenance |
|--------|------|-----------|--------------|-------------|
| **Object Storage** | $0 | 10 min | ❌ None | None |
| **OKE (A1.Flex)** | $0 | 20 min | ✅ Full | Low |
| **OKE (E5.Flex)** | $7-22/mo* | 20 min | ✅ Full | Low |

*E5.Flex: $21.60/mo (24/7) or $7.20/mo (8hrs/day). Minimum 1 OCPU per node required.

---

## Quick Deployment Script

Save this as `scripts/deploy-free-tier.sh`:

```bash
#!/bin/bash
# Quick Free Tier Deployment

echo "🎯 Free Tier Deployment Options"
echo "================================"
echo ""
echo "1. Object Storage (100% Free, No K8s)"
echo "2. OKE with A1.Flex (Free if available)"
echo "3. OKE with E5.Flex (~$6-10/month)"
echo ""
read -p "Choose option (1-3): " choice

case $choice in
  1)
    echo "Deploying to Object Storage..."
    NAMESPACE=$(oci os ns get --query data --raw-output)
    REGION=${OCI_REGION:-us-phoenix-1}
    
    oci os bucket create --name fibonacci-app --public-access-type ObjectRead 2>/dev/null || true
    oci os object put --bucket-name fibonacci-app --file index.html --name index.html --content-type text/html
    oci os object put --bucket-name fibonacci-app --file styles.css --name styles.css --content-type text/css
    oci os object put --bucket-name fibonacci-app --file app.js --name app.js --content-type application/javascript
    oci os object put --bucket-name fibonacci-app --file fibonacci.js --name fibonacci.js --content-type application/javascript
    
    echo "✅ Deployed!"
    echo "URL: https://objectstorage.$REGION.oraclecloud.com/n/$NAMESPACE/b/fibonacci-app/o/index.html"
    ;;
  2)
    echo "Attempting A1.Flex deployment..."
    echo "⚠️  Note: Often out of capacity"
    # A1 deployment script here
    ;;
  3)
    echo "Deploying minimal E5.Flex cluster..."
    ./scripts/create-minimal-cluster.sh
    ;;
esac
```

---

## Troubleshooting

### Issue: "Bucket already exists"
```bash
# Use existing bucket
oci os object put --bucket-name fibonacci-app --file index.html --name index.html --force
```

### Issue: "Out of host capacity" (A1.Flex)
- Try different region (us-ashburn-1, us-phoenix-1)
- Try different availability domain
- Or use Object Storage (free) or E5.Flex (paid)

### Issue: "Access Denied"
```bash
# Make bucket public
oci os bucket update --name fibonacci-app --public-access-type ObjectRead
```

---

## Next Steps

After deploying to Free Tier:

1. **Test Your Deployment**
   ```bash
   curl https://objectstorage.<region>.oraclecloud.com/n/<namespace>/b/fibonacci-app/o/index.html
   ```

2. **Try Local K8s** (also free)
   - See [LOCAL-K8S-GUIDE.md](LOCAL-K8S-GUIDE.md)
   - Practice on Docker Desktop

3. **Upgrade to OKE** (when ready for cloud K8s)
   - See [QUICKSTART.md](QUICKSTART.md)
   - Minimal cost option available

---

## Cost Summary

| Resource | Free Tier Allowance | Used by This App | Cost |
|----------|-------------------|------------------|------|
| Object Storage | 20GB | ~1MB | $0 |
| Outbound Data | 10TB/month | Minimal | $0 |
| API Requests | Unlimited | Minimal | $0 |
| **Total** | - | - | **$0** |

**Always Free = Forever Free** ✅

---

## Support

- **OCI Free Tier Docs**: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm
- **Object Storage Guide**: https://docs.oracle.com/en-us/iaas/Content/Object/home.htm
- **Issues**: Create an issue in the GitHub repository
