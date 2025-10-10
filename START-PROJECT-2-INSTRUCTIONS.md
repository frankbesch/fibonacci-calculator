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

### Step 3: Open Existing Project 2 Directory

**The nvidia-nim-oke directory already exists with artifacts!**

**In the NEW Cursor session:**
```bash
# Navigate to existing Project 2 directory
cd /Users/frankbesch/nvidia-nim-oke

# Verify you're in the RIGHT directory
pwd
# Should show: /Users/frankbesch/nvidia-nim-oke
# NOT: /Users/frankbesch/fibonacci-app

# Check existing files
ls -la
# You should see: docs/, helm/, scripts/, README.md, etc.

# This is the CORRECT project for NIM deployment
```

### Step 4: Tell the AI Agent About Project 2

**IMPORTANT:** The nvidia-nim-oke directory already has some artifacts from previous work.

**In the NEW session, say:**
```
I'm working on Project 2: NVIDIA NIM on OKE deployment.

Context:
- This is a completely separate project from fibonacci-app
- Directory: /Users/frankbesch/nvidia-nim-oke/ (already exists with some artifacts)
- Existing files: README.md, docs/, helm/, scripts/ from previous session

Project Requirements:
- Deploy NVIDIA Inference Microservices (NIM) on OCI OKE
- Use GPU nodes (VM.GPU.A10.1 or similar)
- Minimum-cost GPU configuration for learning/practice
- NOT designed for OCI Free Tier (GPU requires payment)
- Complete separation from fibonacci-app (no shared dependencies)

Tasks:
1. Review existing nvidia-nim-oke artifacts
2. Update/enhance for minimal-cost GPU deployment
3. Create comprehensive cost analysis
4. Add troubleshooting guides
5. Test GPU cluster setup

Reference: https://github.com/NVIDIA/nim-deploy/blob/main/cloud-service-providers/oracle/oke/README.md

Please start by reviewing what's in the directory and create a plan.
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

## 🔄 Working on BOTH Projects Simultaneously in Cursor

### Method 1: Multiple Cursor Windows (Recommended)

**Best Practice:** Use separate Cursor windows for complete isolation

```
Cursor Window 1: Project 1 (Fibonacci)
├── Workspace: /Users/frankbesch/fibonacci-app/
├── AI Context: Fibonacci-specific
└── Use for: Fibonacci updates, documentation

Cursor Window 2: Project 2 (NIM)
├── Workspace: /Users/frankbesch/nvidia-nim-oke/
├── AI Context: NIM-specific
└── Use for: NIM deployment, GPU setup
```

**How to set up:**
1. **Window 1** (This current session):
   - Already open in `fibonacci-app/`
   - Keep open for Fibonacci work
   - Don't use for NIM

2. **Window 2** (New session):
   - Open NEW Cursor window
   - File → Open Folder → `/Users/frankbesch/nvidia-nim-oke/`
   - Fresh AI context for NIM

### Method 2: Cursor Tabs (Alternative, Less Isolation)

**If you prefer tabs within same Cursor window:**

1. **Keep current tab** for fibonacci-app
2. **Open new tab**: Cmd+T
3. **Switch workspace**: File → Open Folder → nvidia-nim-oke
4. **Important**: Tell the AI which project when you switch tabs

**Example:**
```
In fibonacci-app tab: "Update Fibonacci documentation"
In nvidia-nim-oke tab: "Working on NIM project now - deploy GPU operator"
```

### Method 3: Use Cursor Composer (Advanced)

**For complex multi-file edits:**
- Use Composer (Cmd+I) for multi-file changes
- Always specify which project explicitly
- Example: "In fibonacci-app project, update README.md"

### Best Practices for Parallel Work

✅ **DO:**
- Use separate windows for complete isolation
- Always verify `pwd` before running commands
- Keep AI context separate (different windows)
- Commit changes to different Git repos (if applicable)

❌ **DON'T:**
- Mix files from both projects in same edit
- Reference fibonacci-app from nvidia-nim-oke
- Share scripts or configurations
- Work on both in same AI conversation

### Directory Quick Reference

```bash
# Always verify where you are
pwd

# Project 1 - Fibonacci
cd /Users/frankbesch/fibonacci-app/
ls  # Should see: index.html, app.js, k8s/, etc.

# Project 2 - NIM
cd /Users/frankbesch/nvidia-nim-oke/
ls  # Should see: docs/, helm/, scripts/, README.md
```

### AI Context Management

**When switching between projects:**
```
"I'm now working on Project 2 (NVIDIA NIM on OKE).
This is separate from the Fibonacci project.
Directory: /Users/frankbesch/nvidia-nim-oke/"
```

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

---

## 🧠 Understanding Cursor AI Cache Tabs (raw-*)

### What Are These Tabs?

**Cache tabs** (names starting with `raw-`) are temporary files created by Cursor's AI system to:
1. **Store conversation context** - AI responses and code snippets
2. **Enable quick retrieval** - Faster response times
3. **Maintain session state** - Preserve working memory

### Example Names:
- `raw-response-1234567890.txt`
- `raw-context-abcdef.json`
- `raw-temp-xyz.md`

### What to Do With Them

✅ **SAFE TO IGNORE**
- These are temporary system files
- Cursor manages them automatically
- They don't affect your actual project files

✅ **SAFE TO CLOSE**
- You can close these tabs without losing work
- Your actual files (index.html, app.js, etc.) are unaffected
- AI conversation history is preserved separately

❌ **DO NOT:**
- Edit these files manually
- Commit them to Git (they're temporary)
- Worry about them accumulating

### How to Clean Up Cache Tabs

**Method 1: Close Individual Tabs**
```
1. Click X on each raw-* tab
2. Or: Cmd+W when tab is focused
3. This doesn't delete any real files
```

**Method 2: Close All Tabs**
```
1. Right-click any tab
2. Select "Close All Tabs"
3. Your project files are safe
```

**Method 3: Restart Cursor**
```
1. Cmd+Q to quit Cursor
2. Reopen Cursor
3. Cache tabs won't reappear
4. Your work is preserved
```

### When to Clean Up

**Clean cache tabs when:**
- ✅ You have many tabs open (>10)
- ✅ Cursor feels slow
- ✅ Switching between projects
- ✅ Ending a work session

**Cleaning is optional:**
- Cursor auto-manages cache
- No performance impact for most users
- Safe to leave them alone

### Cache vs Real Files

| Type | Location | Purpose | Action |
|------|----------|---------|--------|
| **Cache** | `raw-*` tabs | Temporary AI data | Safe to close |
| **Real Files** | Your project tabs | Your actual code | Keep these! |

**Example:**
- ✅ Keep: `README.md`, `app.js`, `deployment.yaml`
- ⚠️ Optional: `raw-response-123.txt` (cache, can close)

### Best Practice

**Before starting new project:**
```
1. Save all real work (Cmd+S)
2. Commit to Git (if applicable)
3. Close all tabs (Cmd+W repeatedly)
4. Start fresh session
```

This gives you a clean slate for the new project.

---

## 📞 Summary

**AI Cache Tabs (raw-*):**
- Temporary system files
- Safe to close anytime
- Don't affect your real files
- Cursor manages them automatically
- **No action needed** unless you want to clean up

**Your Real Project Files:**
- Saved in `/Users/frankbesch/fibonacci-app/`
- Committed to GitHub
- Completely safe and preserved
- Will persist even if you close all tabs

**Bottom Line:** Cache tabs are harmless. Close them if you want a cleaner workspace, or ignore them completely. Your real work is safe! ✅
