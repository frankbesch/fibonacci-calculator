# GitHub Secrets Update Guide

## 🔐 How to Update GitHub Secrets for CI/CD

### **Step 1: Go to GitHub Repository Settings**

1. Open your browser and go to: https://github.com/frankbesch/fibonacci-calculator
2. Click **Settings** tab (top right)
3. In the left sidebar, click **Secrets and variables** → **Actions**

---

### **Step 2: Update/Add These Secrets**

Click **New repository secret** (or **Update** if they already exist):

#### **Secret 1: OCI_USERNAME**
- **Name:** `OCI_USERNAME`
- **Value:** `<namespace>/your-email@example.com`
- **Description:** OCI username for OCIR authentication

#### **Secret 2: OCI_AUTH_TOKEN**
- **Name:** `OCI_AUTH_TOKEN`
- **Value:** `<your-auth-token>`
- **Description:** OCI auth token for OCIR push

#### **Secret 3: OCI_EMAIL**
- **Name:** `OCI_EMAIL`
- **Value:** `your-email@example.com`
- **Description:** Your OCI account email

#### **Secret 4: OCI_REGION**
- **Name:** `OCI_REGION`
- **Value:** `us-chicago-1`
- **Description:** OCI region for deployment

#### **Secret 5: OCI_TENANCY_OCID**
- **Name:** `OCI_TENANCY_OCID`
- **Value:** `ocid1.tenancy.oc1..aaaaaaaaw2z4q2j3bkh6s2nh6apjezrv64i4wlr3er2pwwwhixs6x65f2vzq`
- **Description:** OCI tenancy OCID

#### **Secret 6: OCI_COMPARTMENT_ID**
- **Name:** `OCI_COMPARTMENT_ID`
- **Value:** `ocid1.tenancy.oc1..aaaaaaaaw2z4q2j3bkh6s2nh6apjezrv64i4wlr3er2pwwwhixs6x65f2vzq`
- **Description:** OCI compartment OCID (same as tenancy for root)

#### **Secret 7: OCIR_REGISTRY**
- **Name:** `OCIR_REGISTRY`
- **Value:** `us-chicago-1.ocir.io`
- **Description:** OCIR registry endpoint

#### **Secret 8: OCIR_NAMESPACE**
- **Name:** `OCIR_NAMESPACE`
- **Value:** `<namespace>`
- **Description:** OCIR namespace (object storage namespace)

---

### **Step 3: Verify Secrets**

After adding/updating, you should see these 8 secrets listed:

- ✅ OCI_USERNAME
- ✅ OCI_AUTH_TOKEN
- ✅ OCI_EMAIL
- ✅ OCI_REGION
- ✅ OCI_TENANCY_OCID
- ✅ OCI_COMPARTMENT_ID
- ✅ OCIR_REGISTRY
- ✅ OCIR_NAMESPACE

---

### **Step 4: Test GitHub Actions**

Once secrets are updated, push a change to trigger the workflow:

```bash
# Make a small change
echo "# Test" >> README.md
git add README.md
git commit -m "test: Trigger GitHub Actions with new OCIR credentials"
git push
```

Then check: https://github.com/frankbesch/fibonacci-calculator/actions

---

## 🔑 Quick Reference

| Secret Name | Type | Current Value |
|-------------|------|---------------|
| `OCI_USERNAME` | String | `<namespace>/your-email@example.com` |
| `OCI_AUTH_TOKEN` | Secret | `<your-auth-token>` |
| `OCI_EMAIL` | String | `your-email@example.com` |
| `OCI_REGION` | String | `us-chicago-1` |
| `OCI_TENANCY_OCID` | String | `ocid1.tenancy.oc1..aaaa...f2vzq` |
| `OCI_COMPARTMENT_ID` | String | `ocid1.tenancy.oc1..aaaa...f2vzq` |
| `OCIR_REGISTRY` | String | `us-chicago-1.ocir.io` |
| `OCIR_NAMESPACE` | String | `<namespace>` |

---

## ⚠️ Security Notes

- **Never commit secrets to git** (they're in .gitignore'd files)
- **Rotate auth tokens regularly** (every 90 days recommended)
- **Use environment-specific secrets** for prod vs dev
- **Limit token permissions** to minimum required

---

## 🔄 How to Rotate Auth Token

When the current token expires or needs rotation:

1. **In OCI Console:**
   - Profile → User Settings → Auth Tokens
   - Delete old token
   - Generate new token
   - **Copy immediately!**

2. **Update GitHub Secret:**
   - GitHub → Settings → Secrets → Actions
   - Update `OCI_AUTH_TOKEN` with new value

3. **Update Local Documentation:**
   - Update `GITHUB-SETUP.md`
   - Commit and push changes

---

## 📋 Troubleshooting

### GitHub Actions fails with "Unauthorized"
- Check `OCI_USERNAME` format: `namespace/email`
- Verify `OCI_AUTH_TOKEN` is current and valid
- Confirm `OCIR_REGISTRY` is `us-chicago-1.ocir.io`

### Image push fails
- Check `OCIR_NAMESPACE` matches your tenancy namespace
- Verify token has permissions to push to OCIR
- Confirm registry URL is correct

---

**Direct Link to Secrets:**
https://github.com/frankbesch/fibonacci-calculator/settings/secrets/actions

