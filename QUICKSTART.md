# Quick Start Deployment Guide

**Last Updated:** 2025-10-10  
**Estimated Time:** 15-20 minutes  
**Cost:** ~$21.60/month (24/7) or ~$7.20/month (8hrs/day)  
**Prerequisites:** OCI account on Pay-As-You-Go, OCI CLI configured

## 🛠️ Stack Versions

**OCI Infrastructure:**
- **OKE**: Kubernetes v1.33.1
- **Node Shape**: VM.Standard.E5.Flex
- **Node Image**: Oracle Linux 8.10-2025.08.31-0
- **OCPUs**: 1 OCPU per node (minimum required)
- **Memory**: 2GB per node

**Container Runtime:**
- **Docker**: v24+
- **Node.js**: v18-alpine (for static server)

---

## 🚀 Deploy in 3 Steps

### Step 1: Set Your Configuration

```bash
# Navigate to project directory
cd /Users/frankbesch/fibonacci-app

# Set your region (choose one)
export OCI_REGION="us-phoenix-1"     # Arizona
# export OCI_REGION="us-ashburn-1"   # Virginia
# export OCI_REGION="us-chicago-1"   # Illinois

# Auto-detect your tenancy
export TENANCY_OCID=$(oci iam region-subscription list --query 'data[0]."tenancy-id"' --raw-output)

# Find or create your cluster
oci ce cluster list --compartment-id $TENANCY_OCID --region $OCI_REGION --query 'data[*].{Name:name, ID:id}' --output table

# Set your cluster ID (from the output above)
export CLUSTER_ID="ocid1.cluster.oc1.<region>.aaaa..."

# Verify configuration
echo "Region: $OCI_REGION"
echo "Tenancy: $TENANCY_OCID"
echo "Cluster: $CLUSTER_ID"
```

### Step 2: Run Deployment

```bash
# Deploy the optimized cluster
./scripts/create-minimal-cluster.sh
```

The script will:
- ✅ Create 2-node cluster with VM.Standard.E5.Flex (0.5 OCPU each)
- ✅ Apply network policies and security configurations
- ✅ Deploy application with HPA (2-6 replicas)
- ✅ Set up Pod Disruption Budget for HA
- ✅ Verify deployment health

### Step 3: Access Your Application

```bash
# Get LoadBalancer IP
kubectl get svc fibonacci-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# Open in browser
open http://$(kubectl get svc fibonacci-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
```

---

## 📊 Optional: Deploy Monitoring

```bash
# Deploy Prometheus and Grafana
kubectl apply -f k8s/monitoring/

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=prometheus -n monitoring --timeout=300s
kubectl wait --for=condition=ready pod -l app=grafana -n monitoring --timeout=300s

# Access Grafana dashboard
kubectl port-forward -n monitoring svc/grafana 3000:3000 &

# Open Grafana (credentials: admin/fibonacci2025)
open http://localhost:3000
```

---

## 🔐 Optional: Set Up OCI Vault

```bash
# Configure secure secret management
./scripts/setup-vault-secrets.sh

# Follow prompts to enter credentials
# Script will configure vault and External Secrets Operator
```

---

## ✅ Verify Deployment

```bash
# Check all resources
kubectl get all

# Check HPA status
kubectl get hpa

# Check Pod Disruption Budget
kubectl get pdb

# View application logs
kubectl logs -l app=fibonacci-app --tail=50

# Run diagnostics
./scripts/diagnose-oke.sh
```

---

## 💰 Estimated Costs

- **Base**: ~$6/month (2 nodes × 0.5 OCPU)
- **Peak**: ~$10/month (4 nodes with autoscaling)
- **Average**: ~$7-8/month

---

## 🔧 Troubleshooting

If you encounter issues:

1. **Run diagnostic script:**
   ```bash
   ./scripts/diagnose-oke.sh
   ```

2. **Check guides:**
   - [Node Registration Issues](docs/troubleshooting/node-registration.md)
   - [Networking Issues](docs/troubleshooting/networking.md)
   - [Region Configuration](docs/REGION-CONFIG-GUIDE.md)

3. **Common fixes:**
   ```bash
   # Network prerequisites
   # Ensure Internet Gateway exists and route table is configured
   
   # Reset kubectl context
   oci ce cluster create-kubeconfig \
     --cluster-id $CLUSTER_ID \
     --file $HOME/.kube/config \
     --region $OCI_REGION \
     --token-version 2.0.0
   ```

---

## 📚 Next Steps

- [ ] Configure custom domain (optional)
- [ ] Set up GitHub Actions CI/CD (see GITHUB-SETUP.md)
- [ ] Enable OCI Vault for secrets (optional)
- [ ] Review monitoring dashboards
- [ ] Configure autoscaling thresholds

---

## 🎯 Support

- **Diagnostic Tool**: `./scripts/diagnose-oke.sh`
- **Documentation**: `docs/`
- **OCI Docs**: https://docs.oracle.com/en-us/iaas/Content/ContEng/home.htm
