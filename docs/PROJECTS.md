# Related Projects

**Last Updated:** 2025-10-10  
**Purpose:** Document project boundaries and relationships

---

## This Project: Fibonacci Calculator

### Overview
**A standalone learning project for practicing Docker containerization and Kubernetes deployment.**

### Details
- **Purpose**: Learning containerization and K8s
- **Technology**: Docker, Kubernetes, simple web application
- **Resources**: CPU-only (no GPU)
- **Cost**: Free (local/Object Storage) or ~$6-10/month (OKE)
- **Directory**: `/Users/frankbesch/fibonacci-app/`
- **Target Audience**: Beginners learning containers and K8s

### Deployment Options
1. **Local MacOS** - Docker Desktop Kubernetes (Free)
2. **OCI Object Storage** - Static hosting (Free)
3. **OCI OKE** - Cloud Kubernetes (~$6-10/month)

### What This Project IS
✅ Learning tool for Docker and Kubernetes  
✅ Compatible with OCI Free Tier  
✅ Runs on local MacOS (v15.6.1)  
✅ Simple CPU-based calculations  
✅ Cost-effective deployment options  

### What This Project is NOT
❌ NOT related to NVIDIA NIM  
❌ NOT a GPU workload  
❌ NOT an AI/ML platform  
❌ NOT for production AI inference  

---

## Other Projects

### NVIDIA NIM on OKE (Separate Project)

**⚠️ This is a completely separate project with no shared resources**

### Overview
**Production AI inference platform using NVIDIA Inference Microservices on OKE with GPU acceleration.**

### Details
- **Purpose**: Production AI inference deployments
- **Technology**: NVIDIA NIM, GPU nodes (A10/V100), AI models
- **Resources**: GPU-required (NOT CPU)
- **Cost**: $200-2000+/month (GPU nodes are expensive)
- **Directory**: `/Users/frankbesch/nvidia-nim-oke/`
- **Target Audience**: AI/ML practitioners, production deployments

### Key Differences from Fibonacci Project

| Aspect | Fibonacci Calculator | NVIDIA NIM on OKE |
|--------|---------------------|-------------------|
| **Purpose** | Learning/Practice | Production AI |
| **Resources** | CPU only | GPU required |
| **Cost** | Free or ~$6-10/mo | $200-2000+/mo |
| **Complexity** | Simple | Enterprise-grade |
| **Free Tier** | ✅ Compatible | ❌ Not compatible |
| **Directory** | `fibonacci-app/` | `nvidia-nim-oke/` |
| **Dependencies** | None | None (separate) |

### What NIM Project IS
✅ Production AI inference platform  
✅ GPU-powered (A10, V100, A100)  
✅ Enterprise-grade deployment  
✅ NVIDIA NIM microservices  
✅ AI model hosting  

### What NIM Project is NOT
❌ NOT a learning project  
❌ NOT Free Tier compatible  
❌ NOT for beginners  
❌ NOT CPU-based  

---

## Project Independence

### No Shared Resources
These projects are intentionally isolated:

- ❌ No shared code or libraries
- ❌ No shared configurations
- ❌ No shared Docker images
- ❌ No shared Kubernetes manifests
- ❌ No shared deployment scripts
- ❌ No shared documentation

### Separate Directories
```
/Users/frankbesch/
├── fibonacci-app/           # THIS PROJECT
│   ├── index.html
│   ├── k8s/
│   ├── scripts/
│   └── docs/
│
└── nvidia-nim-oke/          # SEPARATE PROJECT
    ├── k8s/
    ├── scripts/
    ├── models/
    └── docs/
```

### Different Lifecycles
- **Fibonacci**: Develop, learn, experiment freely
- **NIM**: Production deployments, careful change management

### Different Agents/Sessions
**Recommendation**: Use separate Cursor agents/sessions for each project to prevent cross-contamination.

1. **This Session**: Fibonacci calculator development
2. **New Session**: NVIDIA NIM on OKE setup (when ready)

---

## When to Use Which Project

### Use Fibonacci Calculator When:
- ✅ Learning Docker and Kubernetes
- ✅ Practicing containerization
- ✅ Want free or low-cost deployment
- ✅ Building simple web applications
- ✅ Testing K8s features locally
- ✅ Demonstrating concepts

### Use NVIDIA NIM on OKE When:
- ✅ Deploying AI/ML models to production
- ✅ Need GPU acceleration for inference
- ✅ Building AI-powered applications
- ✅ Scaling AI inference workloads
- ✅ Enterprise AI requirements
- ✅ Production-grade AI platform needed

---

## Future Projects

### Potential Additions (Independent)
1. **fibonacci-helm** - Helm chart version
2. **fibonacci-ci-cd** - Advanced CI/CD pipeline
3. **fibonacci-monitoring** - Enhanced observability
4. **other-ai-deployments** - Different AI platforms

Each would be:
- Separate directory
- Independent lifecycle
- No shared dependencies
- Clear documentation

---

## Getting Started

### For This Project (Fibonacci)
```bash
cd /Users/frankbesch/fibonacci-app
open README.md
# Follow deployment guides
```

### For NIM Project (Future)
```bash
cd /Users/frankbesch/nvidia-nim-oke
open README.md
# Follow NIM-specific guides
```

---

## Support & Documentation

### Fibonacci Calculator
- **README**: [README.md](README.md)
- **Local Deploy**: [LOCAL-K8S-GUIDE.md](LOCAL-K8S-GUIDE.md)
- **Free Tier**: [FREE-TIER-GUIDE.md](FREE-TIER-GUIDE.md)
- **All Options**: [DEPLOYMENT-OPTIONS.md](DEPLOYMENT-OPTIONS.md)

### NVIDIA NIM on OKE
- **README**: `../nvidia-nim-oke/README.md` (separate project)
- **Prerequisites**: GPU quota, NGC account, PayGo billing
- **Note**: Start in NEW Cursor session for clean separation

---

## Summary

**Two completely independent projects:**

1. **Fibonacci Calculator** (This Project)
   - Learning & practice
   - CPU-based
   - Free or minimal cost
   - Beginner-friendly

2. **NVIDIA NIM on OKE** (Separate Project)
   - Production AI
   - GPU-required
   - Expensive ($200-2000+/mo)
   - Enterprise-grade

**No overlap. No shared resources. Complete isolation.** ✅
