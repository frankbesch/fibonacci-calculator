# Fibonacci Calculator Application

![Version](https://img.shields.io/badge/version-v2025.09.10-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Kubernetes](https://img.shields.io/badge/kubernetes-ready-blue)

A comprehensive Fibonacci sequence calculator with multiple deployment options and GPU acceleration estimates. This application provides various ways to calculate, explore, and understand the Fibonacci sequence and its mathematical properties.

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

```bash
# Deploy to Oracle Kubernetes Engine
cd deployments/3-oci-oke
./deploy-to-oke.sh

# Apply Kubernetes manifests
kubectl apply -f k8s/

# Get external IP
kubectl get services
```

📖 **Full Guide**: [`deployments/3-oci-oke/README.md`](deployments/3-oci-oke/README.md)

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
├── .gitignore              # Git ignore rules
├── .github/
│   └── workflows/
│       └── docker-build.yml    # CI/CD pipeline
└── deployments/
    ├── 1-local/            # Local deployment
    │   ├── README.md
    │   └── run-local.sh
    ├── 2-docker/           # Docker deployment
    │   ├── README.md
    │   ├── Dockerfile
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
- **Recursive**: O(2^n) time, O(n) space - Educational purposes
- **Memorized**: O(n) time, O(n) space - Balanced performance

## 🧮 Core Functions

The `FibonacciCalculator` class provides:

### `iterative(n)`
- **Time**: O(n) | **Space**: O(1)
- Best for large numbers and performance-critical applications

### `recursive(n)`
- **Time**: O(2^n) | **Space**: O(n)
- Best for small numbers and educational purposes

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
| F₂₁ - F₄₀ | Iterative or Memorized | Recursive becomes slow |
| F₄₁ - F₉₃ | Iterative only | Best performance |

## 🐳 Docker & CI/CD

### Docker Image
- **Base**: `node:18-alpine`
- **Port**: 8080
- **Size**: ~50MB (optimized Alpine image)

### GitHub Actions
- Automated builds on push to main
- Version tagging from `package.json`
- Docker image testing with health checks

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
