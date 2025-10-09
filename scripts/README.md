# Shell Safety Scripts

This directory contains helper scripts and configurations to prevent and fix shell syntax errors, particularly the annoying `dquote>` and `cmdand>` prompts caused by unclosed quotes.

## 📁 Files

### 1. `check-shell-syntax.sh`
**Purpose:** Validates all `.sh` files in the project for syntax errors.

**Usage:**
```bash
./scripts/check-shell-syntax.sh
```

**What it does:**
- Finds all shell scripts in the project
- Runs `bash -n` on each to check syntax
- Reports which scripts are valid/invalid
- Returns exit code 0 if all valid, 1 if any errors

### 2. `emergency-quote-fix.sh`
**Purpose:** Quick reference guide when you're stuck in a quote prompt.

**Usage:**
```bash
./scripts/emergency-quote-fix.sh
```

**When to use:**
- You see `dquote>` prompt (unclosed double quote)
- You see `quote>` prompt (unclosed single quote)  
- You see `cmdand>` prompt (incomplete command)
- Your shell is waiting for input unexpectedly

### 3. `shell-safety-config.sh`
**Purpose:** Shell configuration file that adds safety features to your environment.

**Installation:**
```bash
# Add to your shell configuration
echo 'source /Users/frankbesch/fibonacci-app/scripts/shell-safety-config.sh' >> ~/.zshrc
source ~/.zshrc
```

**Features:**
- ✅ Aliases for quick syntax checking
- ✅ Shell nesting level indicator in prompt
- ✅ `safe-run` function to validate before executing
- ✅ Fibonacci app shortcuts (`fb`, `fb-check`, `fb-help`)
- ✅ Emergency escape helpers

### 4. `shell-best-practices.md`
**Purpose:** Comprehensive guide to preventing and fixing shell syntax errors.

**View:**
```bash
cat scripts/shell-best-practices.md
# or
fb-help  # after installing shell-safety-config.sh
```

**Topics covered:**
- Pre-execution syntax checking
- Emergency recovery techniques
- Shell configuration safety
- Editor configuration
- Common pitfalls and solutions
- Git pre-commit hooks
- Environment-specific configurations

## 🚀 Quick Start

### Step 1: Check your current scripts
```bash
./scripts/check-shell-syntax.sh
```

### Step 2: Install safety configuration
```bash
# Add to your ~/.zshrc
echo 'source /Users/frankbesch/fibonacci-app/scripts/shell-safety-config.sh' >> ~/.zshrc

# Reload your shell
source ~/.zshrc
```

### Step 3: Verify installation
```bash
# You should see new commands available:
fb              # Go to fibonacci app
fb-check        # Check all scripts
safe-run        # Run scripts safely
quote-escape    # Show escape guide
```

## 🆘 Emergency: I'm Stuck in `dquote>`!

**Immediate fix:**
1. Press `Ctrl+C` (cancels the command)
2. OR type `"` and press Enter (closes the quote)
3. OR press `Ctrl+D` (sends EOF)

**Prevention:**
```bash
# Always validate before running
bash -n script.sh

# Or use the safe-run function
safe-run script.sh
```

## 📊 Common Error Prompts

| Prompt | Cause | Fix |
|--------|-------|-----|
| `dquote>` | Unclosed `"` | Type `"` + Enter, or Ctrl+C |
| `quote>` | Unclosed `'` | Type `'` + Enter, or Ctrl+C |
| `cmdand>` | Unclosed command | Complete it, or Ctrl+C |
| `>` | Heredoc or continuation | Complete it, or Ctrl+D |

## 🛠️ Advanced Tools

### Install ShellCheck (Recommended)
```bash
# macOS
brew install shellcheck

# Ubuntu/Debian
sudo apt install shellcheck

# Use it
shellcheck script.sh
```

### Create Git Pre-Commit Hook
```bash
# Prevents committing broken scripts
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
SCRIPTS=$(git diff --cached --name-only --diff-filter=ACM | grep '\.sh$')
if [ -n "$SCRIPTS" ]; then
    for script in $SCRIPTS; do
        bash -n "$script" || exit 1
    done
fi
EOF

chmod +x .git/hooks/pre-commit
```

## 🔍 Testing

All scripts in this directory are self-validating:

```bash
# Test syntax checker
./scripts/check-shell-syntax.sh

# Test emergency helper
./scripts/emergency-quote-fix.sh

# Test safety config (won't break your shell)
source ./scripts/shell-safety-config.sh
```

## 📝 Maintenance

### Adding New Scripts

When you create new shell scripts:

1. **Start with the shebang:**
   ```bash
   #!/bin/bash
   ```

2. **Validate before committing:**
   ```bash
   bash -n new-script.sh
   ```

3. **Run full check:**
   ```bash
   ./scripts/check-shell-syntax.sh
   ```

### Updating Safety Config

The safety configuration is designed to be non-invasive:
- Won't override existing custom PS1 prompts
- Won't reload if already loaded
- Safe to source multiple times

## 🎯 Best Practices Summary

1. **Before running any script:**
   ```bash
   bash -n script.sh && ./script.sh
   # or
   safe-run script.sh
   ```

2. **Before committing scripts:**
   ```bash
   ./scripts/check-shell-syntax.sh
   ```

3. **If stuck in quote prompt:**
   - Press `Ctrl+C` immediately
   - Don't try to "fix" it by typing more commands

4. **Install syntax highlighting:**
   - Use an editor with shell script support
   - Install `zsh-syntax-highlighting` for terminal

5. **Regular validation:**
   ```bash
   # Make it a habit
   fb-check  # if safety config installed
   ```

---

## 🤝 Contributing

If you find new quote-related issues or have better solutions, please update these scripts and documentation.

---

**Remember:** An ounce of prevention is worth a pound of `Ctrl+C`! 🛡️

