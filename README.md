# Fibonacci Calculator Application

![Version](https://img.shields.io/badge/version-v2025.09.10-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Kubernetes](https://img.shields.io/badge/kubernetes-ready-blue)

A simple Fibonacci sequence calculator with multiple deployment options and GPU acceleration estimates. This application provides various ways to calculate, explore, and understand the Fibonacci sequence and its mathematical properties.

## 🌟 Features

- **Multiple Calculation Methods**: Iterative, Recursive, and Memorized implementations
- **Web Interface**: Beautiful, modern web application with interactive UI
- **GPU Acceleration Estimates**: Theoretical performance comparisons using NVIDIA Blackwell B200 architecture
- **Real-time Validation**: Check if numbers are Fibonacci numbers with instant feedback
- **Performance Comparison**: Built-in performance benchmarking across algorithms
- **Mathematical Tools**: Fibonacci checking, sequence generation, and golden ratio calculations
- **Three Deployment Options**: Local, Docker containerized, and cloud (OCI/OKE)

## 🚀 Quick Start

Choose your deployment method:

### 1️⃣ Local Deployment (Non-Containerized)

**Perfect for**: Quick testing, development, local exploration

```bash
# Open index.html directly in your browser
open index.html

# Or use a simple HTTP server
python3 -m http.server 8080
# Then open http://localhost:8080
```

📖 **Full Guide**: [`deployments/1-local/README.md`](deployments/1-local/README.md)

### 2️⃣ Docker Deployment (Containerized)

**Perfect for**: Consistent environments, easy distribution, local containerization

```bash
# Build the Docker image
docker build -t fibonacci-app:v2025.09.10 .

# Run the container
docker run -d -p 8080:8080 --name fibonacci-app fibonacci-app:v2025.09.10

# Open http://localhost:8080
```

📖 **Full Guide**: [`deployments/2-docker/README.md`](deployments/2-docker/README.md)

### 3️⃣ Cloud Deployment (OCI/OKE)

**Perfect for**: Production, high availability, cloud-native applications

#### Option A: Object Storage (FREE) ✅ **LIVE**
```
🌐 https://objectstorage.us-chicago-1.oraclecloud.com/n/axsbuwrxhysd/b/fibonacci-app/o/index.html
```
- **Cost**: $0 (Always Free)
- **Status**: ✅ Deployed and accessible
- **Features**: Full web application functionality

#### Option B: Kubernetes Engine (Pay-As-You-Go)
```bash
# Deploy to Oracle Kubernetes Engine
cd deployments/3-oci-oke
./deploy-to-oke.sh

# Apply Kubernetes manifests
kubectl apply -f k8s/

# Get external IP
kubectl get services
```
- **Cost**: ~$6-8/month (2 nodes × 0.5 OCPU × 1GB RAM)
- **Status**: Setup script ready (requires PayGo upgrade)

📖 **Full Guides**: 
- [`deployments/3-oci-oke/README.md`](deployments/3-oci-oke/README.md)
- [`PAYGO-SETUP-GUIDE.md`](PAYGO-SETUP-GUIDE.md)

## 📁 Repository Structure

```
fibonacci-app/
├── index.html              # Web application
├── styles.css              # Modern UI styling
├── app.js                  # Application logic & GPU estimates
├── fibonacci.js            # Core Fibonacci algorithms
├── cli.js                  # Command-line interface
├── test.js                 # Comprehensive test suite
├── package.json            # Project metadata
├── Dockerfile              # Docker configuration
├── server.js               # Node.js HTTP server for container
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── GITHUB-SETUP.md         # GitHub Actions setup guide
├── PAYGO-SETUP-GUIDE.md    # Pay-As-You-Go upgrade guide
├── .github/
│   └── workflows/
│       └── docker-build.yml    # CI/CD pipeline
├── k8s/                    # Kubernetes manifests
│   └── deployment.yaml     # K8s deployment & service
├── scripts/                # Helper scripts
│   ├── get-github-secrets.sh   # GitHub secrets extraction
│   ├── create-minimal-cluster.sh  # Minimal cluster setup
│   └── monitor-cluster.sh       # Cluster monitoring
└── deployments/
    ├── 1-local/            # Local deployment
    │   ├── README.md
    │   └── run-local.sh
    ├── 2-docker/           # Docker deployment
    │   ├── README.md
    │   ├── docker-build.sh
    │   └── docker-run.sh
    └── 3-oci-oke/          # OCI/OKE deployment
        ├── README.md
        ├── Dockerfile
        ├── deploy-to-oke.sh
        └── k8s/
            ├── deployment.yaml
            ├── service.yaml
            └── ingress.yaml
```

## 💻 Web Application Features

### Calculate Fibonacci Numbers
- Interactive slider (F₀ to F₉₃)
- Real-time calculation using iterative method
- Display as F(n) = value format

### Check if Number is Fibonacci
- Input any number to validate
- Color-coded button feedback (green for Fibonacci, red for non-Fibonacci)
- Shows position in sequence for Fibonacci numbers

### GPU Acceleration Estimates
- Theoretical GPU performance using NVIDIA Blackwell B200 architecture
- Compares CPU vs GPU execution times
- Shows speedup factors (e.g., 50-100x for parallel algorithms)
- Confidence levels based on algorithm parallelization analysis
- Detailed estimation methodology with cited sources

### Algorithm Analysis
- **Iterative**: O(n) time, O(1) space - Best for large numbers
- **Recursive**: O(2^n) time, O(n) space - Educational purposes ⚠️ **Limited to n ≤ 30**
- **Memorized**: O(n) time, O(n) space - Balanced performance

### ⚠️ Performance Limitation: Recursive Algorithm

The recursive implementation is **intentionally limited to n ≤ 30** to prevent browser freezing and ensure responsive user experience.

**Why the limitation exists:**

The recursive algorithm has **exponential time complexity O(2^n)**, which means the number of calculations doubles with each increment:

| Position | Function Calls | Approximate Time |
|----------|---------------|-----------------|
| n = 20 | ~21,891 | ~2ms |
| n = 30 | ~2,692,537 | ~165ms ✅ Safe |
| n = 31 | ~4,356,617 | ~270ms ⚠️ Limit |
| n = 35 | ~29,860,703 | ~3 seconds ❌ Slow |
| n = 40 | ~331,160,281 | ~40 seconds ❌ Page locks |

**Why it's inefficient:** The recursive method recalculates the same values thousands of times. For example, when calculating F(40), it computes F(2) over **63 million times**!

**Recommended alternatives:**
- **For n > 30**: Use Iterative (fastest) or Memorized (cached results)
- **For learning recursion**: Keep n ≤ 30
- **For production**: Always use Iterative for n > 40

The Iterative and Memorized methods can easily handle **n = 93** (JavaScript's safe integer limit) in under 1ms.

## 🧮 Core Functions

The `FibonacciCalculator` class provides:

### `iterative(n)`
- **Time**: O(n) | **Space**: O(1)
- Best for large numbers and performance-critical applications

### `recursive(n)`
- **Time**: O(2^n) | **Space**: O(n)
- Best for small numbers (n ≤ 30) and educational purposes
- ⚠️ **Limited to n ≤ 30** in web interface to prevent performance issues

### `memorized(n, memo = {})`
- **Time**: O(n) | **Space**: O(n)
- Best for medium numbers with balanced performance

### `sequence(n)`
- Generate Fibonacci sequence with n terms

### `isFibonacci(num)`
- Check if a number is a Fibonacci number

### `findPosition(num)`
- Find the position of a Fibonacci number in the sequence

### `goldenRatio(n)`
- Calculate golden ratio approximation

## 🧪 Testing

```bash
# Run comprehensive test suite
node test.js
```

**Test Coverage:**
- ✅ All calculation methods (iterative, recursive, memorized)
- ✅ Edge cases (zero, negative, large numbers)
- ✅ Fibonacci number detection
- ✅ Sequence generation
- ✅ Golden ratio calculations
- ✅ Method consistency verification
- ✅ Performance benchmarking

## 📊 Performance Recommendations

| Position | Recommended Method | Reason |
|----------|-------------------|---------|
| F₀ - F₂₀ | Any | All methods perform well |
| F₂₁ - F₃₀ | Iterative or Memorized | Recursive starts slowing down |
| F₃₁ - F₄₀ | Iterative or Memorized | Recursive disabled (too slow) |
| F₄₁ - F₉₃ | Iterative only | Best performance |

**Note:** The web interface automatically limits the Recursive method to n ≤ 30. For positions above 30, you'll see "N/A" with the note "Limited to n ≤ 30".

## 🐳 Docker & CI/CD

### Docker Image
- **Base**: `node:18-alpine`
- **Port**: 8080
- **Size**: ~50MB (optimized Alpine image)

### GitHub Actions CI/CD
- **Automated Pipeline**: Build → Test → Push to OCIR → Deploy to OKE
- **Triggers**: Push to main, tags, pull requests
- **Features**: 
  - Docker image building and testing
  - Push to Oracle Container Registry (OCIR)
  - Automated deployment to Oracle Kubernetes Engine (OKE)
  - Deployment status reporting
- **Setup**: Configure GitHub secrets using [`scripts/get-github-secrets.sh`](scripts/get-github-secrets.sh)
- **Guide**: [`GITHUB-SETUP.md`](GITHUB-SETUP.md)

## ☁️ Cloud Deployment (OCI/OKE)

### Architecture
- **Container Registry**: OCI Container Registry (OCIR)
- **Orchestration**: Oracle Kubernetes Engine (OKE)
- **Load Balancer**: OCI Load Balancer
- **Networking**: OCI VCN with public/private subnets

### Resource Specs
- **CPU**: 100m request, 500m limit
- **Memory**: 128Mi request, 512Mi limit
- **Replicas**: 2 (high availability)

## 🔬 GPU Acceleration Technology

The application provides theoretical GPU acceleration estimates based on:

- **Architecture**: NVIDIA Blackwell B200 specifications
- **Analysis**: Algorithm parallelization potential
- **Factors**: Memory bandwidth, compute intensity, overhead
- **Confidence**: Based on real-world CUDA performance patterns

**Sources**: NVIDIA architecture documentation, CUDA programming guides, GPU performance optimization research

⚠️ **Note**: Estimates are theoretical and based on algorithm analysis. Actual performance varies based on implementation and hardware.

## 🛠️ Technical Details

### Browser Requirements
- Modern browser with ES6+ support
- JavaScript enabled
- CSS Grid and Flexbox support

### Node.js Requirements
- Node.js 12+ for CLI and testing
- No external dependencies required

### Deployment Requirements
- **Local**: Web browser or Python 3.x
- **Docker**: Docker 20+ installed
- **OCI/OKE**: OCI account, kubectl, OCI CLI

## 🎯 Version History

- **v2025.09.10**: Current version
  - Three deployment configurations
  - GPU acceleration estimates
  - Enhanced UI with real-time validation
  - CI/CD pipeline
  - Clean repository structure

## 📝 License

This project is open source and available under the MIT License.

---

**Built with ❤️ and curiosity by fsb** • **Version v2025.09.10**
