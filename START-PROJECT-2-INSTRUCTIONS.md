# PROJECT 2: NVIDIA NIM on OKE - Setup Instructions

**IMPORTANT: Start this in a COMPLETELY NEW Cursor session to prevent cross-contamination with Project 1**

---

## 🚨 CRITICAL: Complete Isolation Required

### Do NOT:
- ❌ Use the same Cursor session as Project 1
- ❌ Work in the `fibonacci-app/` directory
- ❌ Reference any Fibonacci app files
- ❌ Share configurations or scripts between projects

### DO:
- ✅ Close the Fibonacci app Cursor session first
- ✅ Start a NEW Cursor session (fresh context window)
- ✅ Create separate directory: `/Users/frankbesch/nvidia-nim-oke/`
- ✅ Use separate Git repository (optional but recommended)

---

## 📋 Step-by-Step: Starting Project 2

### Step 1: Close Current Session
```
1. Save any unsaved work
2. Close this Cursor window/tab completely
3. DO NOT continue in this session
```

### Step 2: Start Fresh Cursor Session
```
1. Open NEW Cursor window
2. Do NOT open fibonacci-app workspace
3. Start completely fresh
```

### Step 3: Create Project 2 Directory

**In the NEW Cursor session, run:**
```bash
# Create project directory
mkdir -p /Users/frankbesch/nvidia-nim-oke
cd /Users/frankbesch/nvidia-nim-oke

# Verify you're in the RIGHT directory
pwd
# Should show: /Users/frankbesch/nvidia-nim-oke
# NOT: /Users/frankbesch/fibonacci-app

# Initialize git (optional)
git init
```

### Step 4: Tell the AI Agent About Project 2

**In the NEW session, say:**
```
I want to create a new project: NVIDIA NIM on OKE

This is a completely separate project from fibonacci-app.

Project Requirements:
- Deploy NVIDIA Inference Microservices (NIM) on OCI OKE
- Use GPU nodes (A10 or similar)
- Minimum cost GPU configuration for learning/practice
- NOT designed for OCI Free Tier (GPU costs money)
- Directory: /Users/frankbesch/nvidia-nim-oke/
- No dependencies on fibonacci-app

Please create a plan for:
1. Setting up minimal-cost GPU OKE cluster
2. Installing NVIDIA GPU Operator
3. Deploying NIM services
4. Comprehensive documentation

Reference: https://github.com/NVIDIA/nim-deploy/blob/main/cloud-service-providers/oracle/oke/README.md
```

---

## 🎯 What to Expect for Project 2

### Infrastructure
- **GPU Cluster**: OKE with GPU node pool
- **GPU Shape**: VM.GPU.A10.1 or similar
- **Cost**: $1-3+ per hour (much more expensive than Fibonacci)
- **Complexity**: Enterprise-grade AI platform

### Prerequisites
- OCI Account with PayGo (same as Project 1)
- GPU quota approved (may need to request increase)
- NVIDIA NGC account and API key
- Docker and kubectl (already have from Project 1)

### Directory Structure
```
/Users/frankbesch/nvidia-nim-oke/
├── README.md
├── docs/
├── k8s/
│   ├── gpu-operator/
│   ├── nim-deployment/
│   └── monitoring/
├── scripts/
├── helm/
└── models/
```

### Key Differences from Project 1

| Aspect | Project 1 (Fibonacci) | Project 2 (NIM) |
|--------|----------------------|-----------------|
| **Directory** | `fibonacci-app/` | `nvidia-nim-oke/` |
| **Purpose** | Learning | Production AI |
| **Resources** | CPU only | GPU required |
| **Cost** | Free-$22/mo | $200-2000+/mo |
| **Session** | THIS one (closing) | NEW one (fresh) |

---

## ✅ Verification Checklist

Before starting Project 2, verify:

- [ ] Closed fibonacci-app Cursor session
- [ ] Started NEW Cursor session
- [ ] Created `/Users/frankbesch/nvidia-nim-oke/` directory
- [ ] Verified `pwd` shows nvidia-nim-oke (not fibonacci-app)
- [ ] No fibonacci-app files in current directory
- [ ] Fresh AI context (no Fibonacci history)

---

## 🚀 Quick Start Command for NEW Session

Copy and paste this into the NEW Cursor session:

```markdown
Create NVIDIA NIM on OKE deployment project.

Requirements:
- Directory: /Users/frankbesch/nvidia-nim-oke/
- Minimal-cost GPU configuration (learning/practice)
- Complete separation from fibonacci-app project
- Reference: https://github.com/NVIDIA/nim-deploy/blob/main/cloud-service-providers/oracle/oke/README.md

Create comprehensive plan for:
1. GPU cluster setup (minimal cost)
2. NVIDIA GPU Operator installation
3. NIM deployment
4. Documentation with cost analysis

Note: This is NOT Free Tier compatible (GPU required).
```

---

## 📌 Project 1 Status for Reference

**✅ Project 1 (Fibonacci Calculator) Status:**
- Code: Complete and on GitHub
- Documentation: Complete (8 guides)
- Deployment scripts: Tested and working
- OKE cluster: Deleted (clean slate for future)
- Free options: Available (Object Storage, local Docker Desktop)

**Repository:** https://github.com/frankbesch/fibonacci-calculator

**To deploy Project 1 in future:**
```bash
# Local (free)
cd /Users/frankbesch/fibonacci-app
./local/docker-desktop/deploy.sh

# Object Storage (free)
# See: FREE-TIER-GUIDE.md

# OKE (paid, when needed)
# Use scripts in fibonacci-app/scripts/
```

---

## 🎯 Next Actions

### In THIS Session (Project 1):
1. ✅ Cluster deletion initiated
2. ✅ All code committed to GitHub
3. ✅ Documentation complete
4. 🔴 **CLOSE THIS SESSION NOW**

### In NEW Session (Project 2):
1. Open fresh Cursor window
2. Create nvidia-nim-oke directory
3. Start with clean AI context
4. Begin NIM deployment planning

---

**Ready to close this session and start Project 2 fresh!** 🚀

See you in the new session for NVIDIA NIM on OKE!
