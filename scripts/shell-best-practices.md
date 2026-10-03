# Shell Configuration Best Practices

## 🛡️ Preventing Quote and Syntax Errors

### 1. **Pre-Execution Syntax Checking**

Always validate shell scripts before running:

```bash
# Check single script
bash -n script.sh

# Check all scripts in project
./scripts/check-shell-syntax.sh
```

### 2. **Emergency Recovery**

If you get stuck in `dquote>`, `quote>`, or similar prompts:

```bash
# Method 1: Cancel command
Ctrl+C

# Method 2: Close the quote
"     # Then press Enter

# Method 3: Send EOF
Ctrl+D
```

### 3. **Shell Configuration Safety**

Add these to your `~/.zshrc` or `~/.bashrc`:

```bash
# Enable syntax highlighting (install zsh-syntax-highlighting first)
# For zsh:
source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# Show current shell level (helpful to detect nested shells)
export PS1="[\$SHLVL] $PS1"

# Alias for quick syntax checking
alias check-syntax='find . -name "*.sh" -type f -exec bash -n {} \; -print'
```

### 4. **Editor Configuration**

Use editors with shell script support:
- **VS Code**: Install "ShellCheck" extension
- **Vim**: Enable syntax highlighting with `:syntax on`
- **Nano**: Use `nano -Y sh script.sh`

### 5. **Common Pitfalls to Avoid**

❌ **Wrong:**
```bash
echo "Hello World    # Missing closing quote
VAR='value       # Missing closing quote
```

✅ **Correct:**
```bash
echo "Hello World"
VAR='value'
```

❌ **Wrong:**
```bash
if [ "$VAR" = "test ]; then    # Missing quote after test
```

✅ **Correct:**
```bash
if [ "$VAR" = "test" ]; then
```

### 6. **Quote Matching Rules**

- **Double quotes `"`**: Can contain variables, escape sequences
- **Single quotes `'`**: Literal strings, no variable expansion
- **Backticks `` ` ``**: Command substitution (prefer `$()`)

### 7. **Tools for Shell Script Validation**

```bash
# Install shellcheck (recommended)
brew install shellcheck    # macOS
apt install shellcheck     # Ubuntu/Debian

# Use shellcheck
shellcheck script.sh

# Use bash's built-in checker
bash -n script.sh

# Use this project's helper
./scripts/check-shell-syntax.sh
```

### 8. **Git Pre-Commit Hook** (Optional)

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Validate all shell scripts before commit

SCRIPTS=$(git diff --cached --name-only --diff-filter=ACM | grep '\.sh$')

if [ -n "$SCRIPTS" ]; then
    echo "Checking shell scripts..."
    for script in $SCRIPTS; do
        if ! bash -n "$script" 2>&1; then
            echo "❌ Syntax error in: $script"
            exit 1
        fi
    done
    echo "✅ All shell scripts are valid"
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

### 9. **Environment-Specific Configurations**

#### For Local Development:
```bash
# Add to ~/.zshrc or ~/.bashrc
alias fb-check='cd "$FIB_HOME" && ./scripts/check-shell-syntax.sh'
```

#### For Docker Environments:
```bash
# Already isolated, but add validation to Dockerfile:
RUN bash -n /path/to/script.sh
```

#### For OCI Cloud Shell:
```bash
# Run syntax check before deployment
bash -n deploy-to-oke.sh && ./deploy-to-oke.sh
```

### 10. **Quick Reference Card**

| Prompt | Meaning | How to Exit |
|--------|---------|-------------|
| `dquote>` | Waiting for closing `"` | Type `"` and Enter, or Ctrl+C |
| `quote>` | Waiting for closing `'` | Type `'` and Enter, or Ctrl+C |
| `cmdand>` | Waiting for command continuation | Complete command or Ctrl+C |
| `>` | Waiting for input | Complete command or Ctrl+D |

---

## 🚀 Quick Start

1. **Check all scripts now:**
   ```bash
   ./scripts/check-shell-syntax.sh
   ```

2. **Add safety to your shell:**
   ```bash
   echo 'alias check-sh="bash -n"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Install ShellCheck:**
   ```bash
   brew install shellcheck
   ```

4. **Make helpers executable:**
   ```bash
   chmod +x scripts/*.sh
   ```

---

**Remember:** Prevention is better than cure. Always validate before you execute! 🛡️

