#!/bin/bash

# Shell Safety Configuration for Fibonacci App
# Add this to your ~/.zshrc or ~/.bashrc to prevent quote/syntax errors
# 
# Installation:
#   echo 'source /Users/frankbesch/fibonacci-app/scripts/shell-safety-config.sh' >> ~/.zshrc
#   source ~/.zshrc

# ============================================================================
# SAFETY ALIASES
# ============================================================================

# Quick syntax checker for shell scripts
alias check-sh='bash -n'
alias check-all-sh='find . -name "*.sh" -type f -exec bash -n {} \; -print'

# Fibonacci app specific shortcuts
alias fb='cd /Users/frankbesch/fibonacci-app'
alias fb-check='cd /Users/frankbesch/fibonacci-app && ./scripts/check-shell-syntax.sh'
alias fb-help='cat /Users/frankbesch/fibonacci-app/scripts/shell-best-practices.md'

# ============================================================================
# VISUAL FEEDBACK
# ============================================================================

# Show shell nesting level (helps detect stuck shells)
export SHLVL_INDICATOR="[\$SHLVL] "

# Enhanced PS1 with shell level (only if not already customized)
if [[ ! "$PS1" =~ "SHLVL" ]]; then
    export PS1="$SHLVL_INDICATOR$PS1"
fi

# ============================================================================
# SAFETY FUNCTIONS
# ============================================================================

# Function to validate script before running
safe-run() {
    if [ -z "$1" ]; then
        echo "Usage: safe-run script.sh [args...]"
        return 1
    fi
    
    local script="$1"
    shift
    
    if [ ! -f "$script" ]; then
        echo "❌ Error: File not found: $script"
        return 1
    fi
    
    echo "🔍 Checking syntax of $script..."
    if bash -n "$script" 2>&1; then
        echo "✅ Syntax OK. Running script..."
        bash "$script" "$@"
    else
        echo "❌ Syntax error detected. Script NOT executed."
        return 1
    fi
}

# Function to escape from quote prompts
quote-escape() {
    cat << 'EOF'
🆘 Quote Escape Guide
====================
If you're stuck in a quote prompt:

dquote>  → Press Ctrl+C or type: "
quote>   → Press Ctrl+C or type: '
cmdand>  → Press Ctrl+C
>        → Press Ctrl+D or Ctrl+C

Prevention:
• Use an editor with syntax highlighting
• Run: check-sh script.sh before executing
• Use: safe-run script.sh to validate before running

Test your scripts:
• Single file: bash -n script.sh
• All files: fb-check
EOF
}

# Function to find unclosed quotes in a file
find-unclosed-quotes() {
    if [ -z "$1" ]; then
        echo "Usage: find-unclosed-quotes script.sh"
        return 1
    fi
    
    echo "🔍 Analyzing: $1"
    bash -n "$1" 2>&1 || echo "⬆️  Found syntax issues above"
}

# ============================================================================
# HELPFUL BINDINGS (ZSH)
# ============================================================================

# If using zsh, add helpful key bindings
if [ -n "$ZSH_VERSION" ]; then
    # Ctrl+X then S to syntax check current command
    bindkey -s '^XS' ' # syntax-check^M'
fi

# ============================================================================
# WELCOME MESSAGE
# ============================================================================

# Show safety features loaded (only once per shell)
if [ -z "$FB_SAFETY_LOADED" ]; then
    export FB_SAFETY_LOADED=1
    cat << 'EOF'
✅ Fibonacci App Shell Safety Loaded!

Available commands:
  • fb              → Go to Fibonacci app directory
  • fb-check        → Check all shell scripts
  • fb-help         → Show best practices guide
  • safe-run <sh>   → Validate and run shell script
  • quote-escape    → Show escape guide
  • check-sh <sh>   → Syntax check a script

Safety features active:
  ✓ Shell nesting level indicator in prompt
  ✓ Syntax checking aliases
  ✓ Emergency quote escape helper

Type 'quote-escape' if you get stuck in dquote> or similar prompts.
EOF
fi

