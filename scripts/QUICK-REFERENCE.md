# 🆘 Shell Safety Quick Reference Card

## Emergency: Stuck in Quote Prompt RIGHT NOW?

```
dquote>  →  Press Ctrl+C
quote>   →  Press Ctrl+C  
cmdand>  →  Press Ctrl+C
>        →  Press Ctrl+D or Ctrl+C
```

## Install Safety Features (One-Time Setup)

```bash
./scripts/install-safety-config.sh
source ~/.zshrc
```

## Daily Usage Commands

```bash
# Check all scripts
fb-check

# Run script safely
safe-run script.sh

# Quick syntax check
bash -n script.sh

# Emergency help
quote-escape
```

## Before Running ANY Script

```bash
# Method 1: Manual check
bash -n script.sh && ./script.sh

# Method 2: Use safe-run (after installing safety config)
safe-run script.sh

# Method 3: Check all at once
fb-check
```

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `dquote>` | Missing `"` | Ctrl+C |
| `quote>` | Missing `'` | Ctrl+C |
| `cmdand>` | Incomplete | Ctrl+C |

## New Commands (After Installation)

- `fb` - Go to fibonacci app
- `fb-check` - Validate all scripts
- `fb-help` - Show best practices
- `safe-run` - Run with validation
- `quote-escape` - Emergency guide

## File Locations

- Tools: `scripts/`
- Main guide: `SHELL-SAFETY-GUIDE.md`
- Best practices: `scripts/shell-best-practices.md`
- Tool docs: `scripts/README.md`

---

**Most Important:** Always run `bash -n script.sh` before `./script.sh`

