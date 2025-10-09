# GitHub Actions CI/CD Setup Guide

This guide will help you configure GitHub repository secrets for automated CI/CD deployment to OCI/OKE.

## Overview

The CI/CD pipeline automatically:
1. Builds and tests Docker images on every push
2. Pushes images to Oracle Cloud Infrastructure Registry (OCIR)
3. Deploys to Oracle Kubernetes Engine (OKE)
4. Provides deployment summary with service URLs

## Required GitHub Secrets

Navigate to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 1. OCI Authentication Secrets

| Secret Name | Description | Where to Find |
|------------|-------------|---------------|
| `OCI_CLI_USER` | Your OCI user OCID | OCI Console → Profile → User Settings |
| `OCI_CLI_TENANCY` | Your OCI tenancy OCID | OCI Console → Profile → Tenancy |
| `OCI_CLI_FINGERPRINT` | API key fingerprint | OCI Console → User Settings → API Keys |
| `OCI_CLI_KEY_CONTENT` | Private API key content | The `.pem` file you downloaded when creating API key |

**To get these values:**
```bash
# User OCID
oci iam user list --query 'data[0].id' --raw-output

# Tenancy OCID
oci iam tenancy get --tenancy-id $(grep tenancy ~/.oci/config | cut -d= -f2) --query 'data.id' --raw-output

# Fingerprint
grep fingerprint ~/.oci/config | cut -d= -f2 | tr -d ' '

# Key Content (copy entire file content)
cat ~/.oci/oci_api_key.pem
```

### 2. OCIR Secrets

| Secret Name | Description | Value |
|------------|-------------|-------|
| `OCI_USERNAME` | OCI username for OCIR | `axsbuwrxhysd/frank.besch@icloud.com` |
| `OCI_AUTH_TOKEN` | OCIR authentication token | From OCI Console → User Settings → Auth Tokens |
| `OCI_EMAIL` | Your email address | `frank.besch@icloud.com` |

**Current Auth Token:** `7YV{01o.)]L[8AWe_j.{`

**Registry Endpoint:** `us-chicago-1.ocir.io` (NOT `ord.ocir.io`)

**To create a new auth token:**
```bash
oci iam auth-token create \
  --user-id $(oci iam user list --query 'data[0].id' --raw-output) \
  --description "GitHub Actions OCIR Access" \
  --query 'data.token' --raw-output
```

## Quick Setup Script

Run this script to display all the values you need:

```bash
#!/bin/bash
echo "==================================="
echo "GitHub Secrets Configuration"
echo "==================================="
echo ""
echo "OCI_CLI_USER:"
oci iam user list --query 'data[0].id' --raw-output
echo ""
echo "OCI_CLI_TENANCY:"
grep tenancy ~/.oci/config | cut -d= -f2 | tr -d ' '
echo ""
echo "OCI_CLI_FINGERPRINT:"
grep fingerprint ~/.oci/config | cut -d= -f2 | tr -d ' '
echo ""
echo "OCI_CLI_KEY_CONTENT:"
echo "(Copy the content below, including BEGIN/END lines)"
cat ~/.oci/oci_api_key.pem
echo ""
echo "OCI_USERNAME:"
echo "oracleidentitycloudservice/frank.besch@oracle.com"
echo ""
echo "OCI_AUTH_TOKEN:"
echo "TLva(AH(C>Tq3jqDqFk4"
echo ""
echo "OCI_EMAIL:"
echo "frank.besch@oracle.com"
echo ""
```

## Verification

After setting up secrets:

1. Go to **Actions** tab in your GitHub repository
2. Click on **CI/CD - Build, Push & Deploy** workflow
3. Click **Run workflow** to trigger manually
4. Monitor the workflow execution
5. Check the deployment summary for the LoadBalancer URL

## Workflow Triggers

The workflow runs automatically on:
- **Push to main branch** - Full build, push, and deploy
- **Pull requests** - Build and test only (no deployment)
- **Manual trigger** - Via "Run workflow" button

## Environment Variables

The following are configured in the workflow file (no secrets needed):

- `OCI_REGION`: `us-chicago-1`
- `OCIR_NAMESPACE`: `axsbuwrxhysd`
- `IMAGE_NAME`: `fibonacci-app`
- `OKE_CLUSTER_ID`: `ocid1.cluster.oc1.us-chicago-1.aaaaaaaag637h4fhp6gs3sk7e2nhd5tlblbvmnmwjrh2gatvzcz5cq4xpg3q`

## Troubleshooting

### Authentication Failed
- Verify all OCIDs are correct
- Check that API key fingerprint matches the key content
- Ensure auth token is valid (check in OCI Console)

### Deployment Failed
- Check OKE cluster is running
- Verify network configuration (Internet Gateway, routes)
- Check node pool status: `oci ce node-pool list --cluster-id <CLUSTER_ID>`

### Image Push Failed
- Verify auth token is valid
- Check OCIR namespace and region are correct
- Ensure repository exists or create it in OCI Console

## Security Best Practices

✅ **DO:**
- Rotate auth tokens regularly
- Use dedicated service accounts for CI/CD
- Review workflow logs for sensitive data leaks
- Enable branch protection rules

❌ **DON'T:**
- Commit secrets to the repository
- Share auth tokens publicly
- Use personal credentials for automation
- Disable secret scanning

## Support

For issues or questions:
1. Check GitHub Actions logs for detailed error messages
2. Review OCI audit logs
3. Consult OCI/OKE documentation
4. Open an issue in the repository

---

**Last Updated:** October 9, 2025  
**Version:** v2025.09.10

