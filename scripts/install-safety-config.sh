#!/bin/bash

# Shell Safety Configuration Installer
# Safely adds shell safety features to your environment

echo "🛡️  Shell Safety Configuration Installer"
echo "=========================================="
echo ""

# Detect shell
SHELL_CONFIG=""
if [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
    SHELL_NAME="zsh"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
    SHELL_NAME="bash"
else
    echo "❌ Unable to detect shell type (zsh or bash required)"
    exit 1
fi

echo "Detected shell: $SHELL_NAME"
echo "Configuration file: $SHELL_CONFIG"
echo ""

# Check if already installed
SAFETY_SOURCE="source $(cd "$(dirname "$0")" && pwd)/shell-safety-config.sh"

if grep -q "shell-safety-config.sh" "$SHELL_CONFIG" 2>/dev/null; then
    echo "ℹ️  Safety configuration already installed in $SHELL_CONFIG"
    echo ""
    read -p "Do you want to reinstall/update it? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi
    # Remove old line
    sed -i.bak '/shell-safety-config.sh/d' "$SHELL_CONFIG"
fi

# Create backup
BACKUP_FILE="${SHELL_CONFIG}.backup-$(date +%Y%m%d-%H%M%S)"
cp "$SHELL_CONFIG" "$BACKUP_FILE"
echo "✅ Backup created: $BACKUP_FILE"

# Add safety configuration
echo "" >> "$SHELL_CONFIG"
echo "# Fibonacci App Shell Safety Configuration" >> "$SHELL_CONFIG"
echo "$SAFETY_SOURCE" >> "$SHELL_CONFIG"

echo "✅ Safety configuration added to $SHELL_CONFIG"
echo ""

echo "🎯 Installation Complete!"
echo ""
echo "Next steps:"
echo "  1. Reload your shell: source $SHELL_CONFIG"
echo "  2. Or start a new terminal session"
echo ""
echo "New commands available after reload:"
echo "  • fb              → Go to Fibonacci app directory"
echo "  • fb-check        → Check all shell scripts"
echo "  • fb-help         → Show best practices"
echo "  • safe-run <sh>   → Run scripts safely"
echo "  • quote-escape    → Emergency help"
echo ""
echo "To test now:"
echo "  source $SHELL_CONFIG"
echo ""

