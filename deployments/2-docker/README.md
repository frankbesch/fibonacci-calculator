# Docker Deployment (Containerized)

**Version:** v2025.09.10  
**Type:** Local containerized deployment

## Prerequisites

- Docker installed and running
- Git (to clone repository)
- Basic Docker knowledge

## Quick Start

1. Navigate to the project root directory
2. Build the Docker image:
   ```bash
   ./docker-build.sh
   ```
3. Run the container:
   ```bash
   ./docker-run.sh
   ```
4. Open your browser to `http://localhost:8080`

## Manual Docker Commands

### Build Image
```bash
docker build -t fibonacci-app:v2025.09.10 .
```

### Run Container
```bash
docker run -d -p 8080:8080 --name fibonacci-app fibonacci-app:v2025.09.10
```

### Stop Container
```bash
docker stop fibonacci-app
docker rm fibonacci-app
```

## Docker Image Details

- **Base Image:** `node:18-alpine`
- **Port:** 8080
- **Working Directory:** `/app`
- **Command:** `node app.js`

## Features Available

- ✅ All web application features
- ✅ Containerized environment
- ✅ Consistent deployment across systems
- ✅ Easy scaling and management

## Troubleshooting

**Port Conflicts:** If port 8080 is busy, modify `docker-run.sh` to use a different port mapping (e.g., `-p 8081:8080`).

**Build Failures:** Ensure Docker is running and you have sufficient disk space.

**Container Issues:** Check logs with `docker logs fibonacci-app`

## Development Notes

- Image is built from current directory
- All source files are copied into container
- No external dependencies required
- Container runs Node.js HTTP server

## Next Steps

- For non-containerized deployment: See `../1-local/README.md`
- For cloud deployment: See `../3-oci-oke/README.md`

