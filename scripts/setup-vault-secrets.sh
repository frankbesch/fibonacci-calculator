#!/bin/bash
# ============================================================================
# OCI Vault Integration Setup
# ============================================================================
# Purpose: Configure OCI Vault for secure secret management
# Last Updated: 2025-10-10
# Version: 1.0.0
#
# Prerequisites:
#   - OCI account upgraded to Pay-As-You-Go
#   - OCI CLI configured and authenticated
#   - kubectl connected to OKE cluster
#   - External Secrets Operator installed (optional, script will configure)
#
# What This Does:
#   - Creates OCI Vault compartment
#   - Creates encryption key
#   - Stores OCIR credentials as secrets
#   - Sets up IAM policies
#   - Configures External Secrets Operator
#
# Security: Secrets are encrypted at rest with AES-256
# ============================================================================

set -e

echo "🔐 OCI VAULT SETUP FOR SECURE SECRET MANAGEMENT"
echo "==============================================="
echo ""

# Configuration
TENANCY_OCID="ocid1.tenancy.oc1..aaaaaaaaw2z4q2j3bkh6s2nh6apjezrv64i4wlr3er2pwwwhixs6x65f2vzq"
COMPARTMENT_ID="ocid1.tenancy.oc1..aaaaaaaaw2z4q2j3bkh6s2nh6apjezrv64i4wlr3er2pwwwhixs6x65f2vzq"
VAULT_NAME="fibonacci-vault"
KEY_NAME="fibonacci-key"
SECRET_NAME="ocir-credentials"

echo "Step 1: Creating Vault compartment..."
echo "===================================="

# Create vault compartment
VAULT_COMPARTMENT_ID=$(oci iam compartment create \
  --compartment-id "$TENANCY_OCID" \
  --name "fibonacci-vault-compartment" \
  --description "Compartment for Fibonacci app secrets" \
  --query 'data.id' \
  --raw-output 2>/dev/null || echo "")

if [ -z "$VAULT_COMPARTMENT_ID" ]; then
    echo "  Vault compartment already exists or creation failed"
    VAULT_COMPARTMENT_ID=$(oci iam compartment list \
      --compartment-id "$TENANCY_OCID" \
      --query 'data[?name=="fibonacci-vault-compartment"].id' \
      --raw-output | head -1)
fi

echo "  Vault compartment ID: $VAULT_COMPARTMENT_ID"

echo ""
echo "Step 2: Creating Vault..."
echo "========================"

# Create vault
VAULT_ID=$(oci kms vault create \
  --compartment-id "$VAULT_COMPARTMENT_ID" \
  --display-name "$VAULT_NAME" \
  --vault-type DEFAULT \
  --query 'data.id' \
  --raw-output 2>/dev/null || echo "")

if [ -z "$VAULT_ID" ]; then
    echo "  Vault already exists or creation failed"
    VAULT_ID=$(oci kms vault list \
      --compartment-id "$VAULT_COMPARTMENT_ID" \
      --query 'data[?display-name=="'$VAULT_NAME'"].id' \
      --raw-output | head -1)
fi

echo "  Vault ID: $VAULT_ID"

echo ""
echo "Step 3: Creating encryption key..."
echo "================================="

# Create encryption key
KEY_ID=$(oci kms key create \
  --compartment-id "$VAULT_COMPARTMENT_ID" \
  --display-name "$KEY_NAME" \
  --key-shape '{"algorithm":"AES","length":32}' \
  --protection-mode SOFTWARE \
  --query 'data.id' \
  --raw-output 2>/dev/null || echo "")

if [ -z "$KEY_ID" ]; then
    echo "  Key already exists or creation failed"
    KEY_ID=$(oci kms key list \
      --compartment-id "$VAULT_COMPARTMENT_ID" \
      --query 'data[?display-name=="'$KEY_NAME'"].id' \
      --raw-output | head -1)
fi

echo "  Key ID: $KEY_ID"

echo ""
echo "Step 4: Creating OCIR credentials secret..."
echo "=========================================="

# Get OCIR credentials from environment or prompt
if [ -z "$OCI_USERNAME" ]; then
    read -p "Enter OCIR username (format: <namespace>/<username>): " OCI_USERNAME
fi

if [ -z "$OCI_AUTH_TOKEN" ]; then
    read -s -p "Enter OCIR auth token: " OCI_AUTH_TOKEN
    echo ""
fi

# Create secret with OCIR credentials
SECRET_CONTENT=$(echo -n "{\"username\":\"$OCI_USERNAME\",\"password\":\"$OCI_AUTH_TOKEN\"}" | base64 -w 0)

SECRET_ID=$(oci vault secret create-base64-secret \
  --compartment-id "$VAULT_COMPARTMENT_ID" \
  --secret-name "$SECRET_NAME" \
  --vault-id "$VAULT_ID" \
  --key-id "$KEY_ID" \
  --secret-content-content "$SECRET_CONTENT" \
  --secret-content-name "ocir-credentials" \
  --query 'data.id' \
  --raw-output 2>/dev/null || echo "")

if [ -z "$SECRET_ID" ]; then
    echo "  Secret already exists or creation failed"
    SECRET_ID=$(oci vault secret list \
      --compartment-id "$VAULT_COMPARTMENT_ID" \
      --query 'data[?secret-name=="'$SECRET_NAME'"].id' \
      --raw-output | head -1)
fi

echo "  Secret ID: $SECRET_ID"

echo ""
echo "Step 5: Creating IAM policies..."
echo "==============================="

# Create dynamic group for pods
DYNAMIC_GROUP_NAME="fibonacci-pods"
DYNAMIC_GROUP_ID=$(oci iam dynamic-group create \
  --compartment-id "$TENANCY_OCID" \
  --name "$DYNAMIC_GROUP_NAME" \
  --description "Dynamic group for Fibonacci app pods" \
  --matching-rule 'resource.type="pod" && resource.compartment.id="'$TENANCY_OCID'"' \
  --query 'data.id' \
  --raw-output 2>/dev/null || echo "")

if [ -z "$DYNAMIC_GROUP_ID" ]; then
    echo "  Dynamic group already exists or creation failed"
    DYNAMIC_GROUP_ID=$(oci iam dynamic-group list \
      --compartment-id "$TENANCY_OCID" \
      --query 'data[?name=="'$DYNAMIC_GROUP_NAME'"].id' \
      --raw-output | head -1)
fi

echo "  Dynamic group ID: $DYNAMIC_GROUP_ID"

# Create policy for vault access
POLICY_NAME="fibonacci-vault-policy"
POLICY_STATEMENT="Allow dynamic-group $DYNAMIC_GROUP_NAME to read secret-bundles in compartment id $VAULT_COMPARTMENT_ID"

POLICY_ID=$(oci iam policy create \
  --compartment-id "$TENANCY_OCID" \
  --name "$POLICY_NAME" \
  --description "Policy for Fibonacci app to access vault secrets" \
  --statements "[\"$POLICY_STATEMENT\"]" \
  --query 'data.id' \
  --raw-output 2>/dev/null || echo "")

if [ -z "$POLICY_ID" ]; then
    echo "  Policy already exists or creation failed"
fi

echo ""
echo "Step 6: Creating External Secrets Operator configuration..."
echo "========================================================"

# Create namespace for external secrets
kubectl create namespace external-secrets-system 2>/dev/null || echo "  Namespace already exists"

# Install External Secrets Operator (simplified version)
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: external-secrets
  namespace: external-secrets-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: external-secrets
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: ["external-secrets.io"]
  resources: ["secretstores", "externalsecrets"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: external-secrets
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: external-secrets
subjects:
- kind: ServiceAccount
  name: external-secrets
  namespace: external-secrets-system
---
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: oci-vault-secret-store
  namespace: default
spec:
  provider:
    oracle:
      vault: "$VAULT_ID"
      region: "us-chicago-1"
      compartment: "$VAULT_COMPARTMENT_ID"
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: ocir-secret
  namespace: default
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: oci-vault-secret-store
    kind: SecretStore
  target:
    name: ocir-secret
    creationPolicy: Owner
  data:
  - secretKey: username
    remoteRef:
      key: "$SECRET_NAME"
      property: username
  - secretKey: password
    remoteRef:
      key: "$SECRET_NAME"
      property: password
EOF

echo ""
echo "✅ VAULT SETUP COMPLETE!"
echo "======================="
echo ""
echo "🔐 Vault Configuration:"
echo "  • Vault ID: $VAULT_ID"
echo "  • Key ID: $KEY_ID"
echo "  • Secret ID: $SECRET_ID"
echo "  • Dynamic Group: $DYNAMIC_GROUP_ID"
echo ""
echo "📋 Next Steps:"
echo "  1. Verify secret creation: kubectl get externalsecret"
echo "  2. Check secret sync: kubectl get secret ocir-secret"
echo "  3. Update deployment to use vault secrets"
echo ""
echo "🔧 Troubleshooting:"
echo "  • Check External Secrets logs: kubectl logs -n external-secrets-system"
echo "  • Verify IAM policies in OCI Console"
echo "  • Test secret retrieval: kubectl describe externalsecret ocir-secret"
