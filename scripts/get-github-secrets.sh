#!/bin/bash
# Script to extract and display GitHub Secrets values for CI/CD setup
# Run this script and copy the output values to GitHub repository secrets

set -e

echo "========================================"
echo "GitHub Repository Secrets Configuration"
echo "========================================"
echo ""
echo "📋 Copy these values to GitHub → Settings → Secrets and variables → Actions"
echo ""

echo "-----------------------------------"
echo "1. OCI_CLI_USER"
echo "-----------------------------------"
OCI_USER=$(oci iam user list --query 'data[0].id' --raw-output 2>/dev/null)
if [ -n "$OCI_USER" ]; then
    echo "$OCI_USER"
else
    echo "❌ Error: Could not retrieve OCI user OCID"
fi
echo ""

echo "-----------------------------------"
echo "2. OCI_CLI_TENANCY"
echo "-----------------------------------"
OCI_TENANCY=$(grep tenancy ~/.oci/config | head -1 | cut -d= -f2 | tr -d ' ' 2>/dev/null)
if [ -n "$OCI_TENANCY" ]; then
    echo "$OCI_TENANCY"
else
    echo "❌ Error: Could not retrieve tenancy OCID from ~/.oci/config"
fi
echo ""

echo "-----------------------------------"
echo "3. OCI_CLI_FINGERPRINT"
echo "-----------------------------------"
OCI_FINGERPRINT=$(grep fingerprint ~/.oci/config | head -1 | cut -d= -f2 | tr -d ' ' 2>/dev/null)
if [ -n "$OCI_FINGERPRINT" ]; then
    echo "$OCI_FINGERPRINT"
else
    echo "❌ Error: Could not retrieve fingerprint from ~/.oci/config"
fi
echo ""

echo "-----------------------------------"
echo "4. OCI_CLI_KEY_CONTENT"
echo "-----------------------------------"
echo "⚠️  Copy ENTIRE content below (including BEGIN/END lines):"
echo ""
KEY_FILE=$(grep key_file ~/.oci/config | head -1 | cut -d= -f2 | tr -d ' ' | sed "s|^~|$HOME|" 2>/dev/null)
if [ -f "$KEY_FILE" ]; then
    cat "$KEY_FILE"
else
    echo "❌ Error: Could not find private key file at $KEY_FILE"
fi
echo ""

echo "-----------------------------------"
echo "5. OCI_USERNAME"
echo "-----------------------------------"
echo "oracleidentitycloudservice/your-username"
echo ""

echo "-----------------------------------"
echo "6. OCI_AUTH_TOKEN"
echo "-----------------------------------"
echo "TLva(AH(C>Tq3jqDqFk4"
echo "⚠️  Note: This is your current auth token. Create a new one if expired:"
echo "    oci iam auth-token create --user-id <USER_OCID> --description 'GitHub Actions'"
echo ""

echo "-----------------------------------"
echo "7. OCI_EMAIL"
echo "-----------------------------------"
echo "your-username"
echo ""

echo "========================================"
echo "✅ Setup Complete!"
echo "========================================"
echo ""
echo "Next Steps:"
echo "1. Go to: https://github.com/<your-username>/fibonacci-app/settings/secrets/actions"
echo "2. Click 'New repository secret' for each value above"
echo "3. Test the workflow: Actions → CI/CD - Build, Push & Deploy → Run workflow"
echo ""

