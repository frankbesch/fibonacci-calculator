#!/bin/bash

# OKE Deployment Commands for Cloud Shell
# Copy and paste these into your OCI Cloud Shell session

echo "🚀 OKE Deployment Commands"
echo "=========================="
echo ""
echo "Your image is already in OCIR: us-chicago-1.ocir.io/<namespace>/fibonacci-app:latest"
echo ""
echo "Run these commands in OCI Cloud Shell:"
echo ""

cat << 'COMMANDS'

# 1. Set variables
export REGION="us-chicago-1"
export TENANCY_OCID="ocid1.tenancy.oc1..aaaaaaaaw2z4q2j3bkh6s2nh6apjezrv64i4wlr3er2pwwwhixs6x65f2vzq"
export COMPARTMENT_ID="$TENANCY_OCID"
export APP_NAME="fibonacci-app"
export IMAGE="us-chicago-1.ocir.io/<namespace>/fibonacci-app:latest"

# 2. Check if you have an OKE cluster already
oci ce cluster list --compartment-id $COMPARTMENT_ID --query 'data[*].{Name:name, State:"lifecycle-state"}' --output table

# If you DON'T have a cluster, you'll need to create one (takes ~10-15 minutes)
# If you DO have a cluster, get its OCID:
CLUSTER_ID=$(oci ce cluster list --compartment-id $COMPARTMENT_ID --query 'data[0].id' --raw-output)

# 3. Configure kubectl (if you have a cluster)
oci ce cluster create-kubeconfig --cluster-id $CLUSTER_ID --file ~/.kube/config --region $REGION --token-version 2.0.0

# 4. Test kubectl connection
kubectl get nodes

# 5. Create image pull secret for OCIR
kubectl create secret docker-registry ocir-secret \
  --docker-server=us-chicago-1.ocir.io \
  --docker-username=<namespace>/your-email@example.com \
  --docker-password='7YV{01o.)]L[8AWe_j.{' \
  --docker-email=your-email@example.com

# 6. Create deployment
kubectl create deployment fibonacci-app \
  --image=us-chicago-1.ocir.io/<namespace>/fibonacci-app:latest \
  --port=8080

# 7. Patch deployment to use image pull secret
kubectl patch deployment fibonacci-app \
  -p '{"spec":{"template":{"spec":{"imagePullSecrets":[{"name":"ocir-secret"}]}}}}'

# 8. Create LoadBalancer service
kubectl expose deployment fibonacci-app \
  --type=LoadBalancer \
  --port=80 \
  --target-port=8080 \
  --name=fibonacci-service

# 9. Wait for LoadBalancer IP (this takes 2-5 minutes)
echo "⏳ Waiting for LoadBalancer IP..."
kubectl get service fibonacci-service --watch

# Once you see an EXTERNAL-IP, press Ctrl+C and get the IP:
EXTERNAL_IP=$(kubectl get service fibonacci-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "🎉 Your app is available at: http://$EXTERNAL_IP"

# 10. Test the deployment
curl http://$EXTERNAL_IP

COMMANDS

