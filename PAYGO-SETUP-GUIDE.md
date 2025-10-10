# Pay-As-You-Go Setup Guide for Minimal Cost Kubernetes

## Overview
This guide will help you upgrade to Pay-As-You-Go and create a minimal cost 2-node Kubernetes cluster for your Fibonacci Calculator app.

## Cost Breakdown
- **Shape**: VM.Standard.E3.Flex (AMD, latest generation)
- **Configuration**: 2 nodes × 0.5 OCPU × 1GB RAM
- **Total Resources**: 1 OCPU, 2GB RAM
- **Estimated Monthly Cost**: $6-8 USD
- **Hourly Cost**: ~$0.008-0.011/hour

## Step 1: Upgrade to Pay-As-You-Go

### 1.1 Access OCI Console
1. Go to: https://cloud.oracle.com/
2. Sign in with your account
3. Select your preferred region (e.g., US Midwest (Chicago), US East (Ashburn), US West (Phoenix))

### 1.2 Navigate to Upgrade
1. Click the **Menu** (hamburger icon) in the top-left
2. Under **Governance & Administration**, click **Billing**
3. Click **Upgrade** in the left sidebar

### 1.3 Complete Upgrade
1. Review your account details:
   - **Plan Type**: Free Tier
   - **Email**: Your registered email
   - **Payment Method**: Your payment method on file

2. Click **"Upgrade your account"** button

3. Review the Pay-As-You-Go terms:
   - Access to all Oracle Cloud Infrastructure services
   - No minimum term commitment
   - No prepayment required
   - Pay only for what you use

4. Confirm the upgrade

### 1.4 Verify Upgrade
- You should see your plan type change from "Free Tier" to "Pay As You Go"
- This may take a few minutes to propagate

## Step 2: Create Minimal Cost Cluster

### 2.1 Run the Setup Script
After your account is upgraded, run:

```bash
./scripts/create-minimal-cluster.sh
```

This script will:
1. Delete any existing node pools
2. Create a new minimal cost node pool
3. Wait for nodes to register with Kubernetes
4. Verify the deployment

### 2.2 Manual Verification
After the script completes, verify your cluster:

```bash
# Check nodes
kubectl get nodes

# Check pods
kubectl get pods

# Get LoadBalancer IP
kubectl get svc fibonacci-app
```

## Step 3: Access Your Application

Your Fibonacci Calculator will be accessible at:
```
http://[LOADBALANCER_IP]/
```

The LoadBalancer IP will be displayed by the setup script.

## Cost Monitoring

### 3.1 Set Up Billing Alerts
1. Go to OCI Console → Billing → Cost Management
2. Create budget alerts for $10, $20, $50 monthly
3. This will help you monitor spending

### 3.2 View Usage
1. Go to OCI Console → Billing → Usage Reports
2. Monitor your compute usage
3. Check for any unexpected charges

## Troubleshooting

### Issue: "Out of host capacity"
**Solution**: The E3 shape has better availability than A1. If this occurs, try:
- Different availability domain
- E4 or E5 shapes (slightly higher cost)
- Different region

### Issue: "Insufficient permissions"
**Solution**: Ensure your user has:
- Container Engine permissions
- Compute permissions
- Network permissions

### Issue: Nodes not registering
**Solution**: Check:
1. Internet Gateway is configured (we already fixed this)
2. Security lists allow traffic
3. Node pool is in ACTIVE state

## Cost Optimization Tips

### 4.1 Development vs Production
- **Development**: Use the minimal 0.5 OCPU configuration
- **Production**: Scale up to 1 OCPU per node if needed

### 4.2 Auto-scaling
- Configure horizontal pod autoscaling
- Scale down during low usage periods

### 4.3 Shutdown When Not Needed
```bash
# Scale down to 0 nodes when not in use
kubectl scale deployment fibonacci-app --replicas=0

# Scale back up when needed
kubectl scale deployment fibonacci-app --replicas=2
```

## Alternative: Object Storage (FREE)
If you prefer to avoid costs entirely, your app is already deployed to Object Storage:
- **URL**: https://objectstorage.us-chicago-1.oraclecloud.com/n/<namespace>/b/fibonacci-app/o/index.html
- **Cost**: $0
- **Limitations**: No Kubernetes features

## Support
If you encounter issues:
1. Check OCI Console → Service Health
2. Review OCI documentation
3. Contact Oracle Support if needed

---

**Next Steps After Setup:**
1. Test the application
2. Set up GitHub Actions CI/CD
3. Configure monitoring and alerts
4. Update README with deployment URLs
