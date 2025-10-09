# Local Deployment (Non-Containerized)

**Version:** v2025.09.10  
**Type:** Local development and testing

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for HTTP server) or any web server
- No additional dependencies required

## Quick Start

### Option 1: Direct File Access
1. Navigate to the project root directory
2. Open `index.html` directly in your browser
3. The app will run with file:// protocol

### Option 2: HTTP Server (Recommended)
1. Navigate to the project root directory
2. Run the local server script:
   ```bash
   ./run-local.sh
   ```
3. Open your browser to `http://localhost:8080`

## Manual HTTP Server Setup

If you prefer to run the server manually:

```bash
# Navigate to project root
cd /path/to/fibonacci-app

# Start Python HTTP server
python3 -m http.server 8080

# Or use Node.js if available
npx http-server -p 8080
```

## Features Available

- ✅ Calculate Fibonacci numbers (Iterative, Recursive, Memorized)
- ✅ Generate Fibonacci sequences
- ✅ Check if numbers are Fibonacci
- ✅ GPU acceleration estimates
- ✅ Performance comparisons
- ✅ Interactive web interface

## Troubleshooting

**CORS Issues:** If you encounter CORS errors, use the HTTP server option instead of direct file access.

**Port Conflicts:** If port 8080 is busy, modify `run-local.sh` to use a different port (e.g., 8081, 3000).

**Browser Compatibility:** Ensure your browser supports ES6+ features and CSS Grid.

## Development Notes

- All files are served statically
- No build process required
- Hot reload: refresh browser after file changes
- Debug: Use browser developer tools (F12)

## Next Steps

- For containerized deployment: See `../2-docker/README.md`
- For cloud deployment: See `../3-oci-oke/README.md`

