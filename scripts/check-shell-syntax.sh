#!/bin/bash

# Shell Syntax Checker for Fibonacci App
# Validates all shell scripts to prevent quote and syntax errors

echo "🔍 Checking all shell scripts for syntax errors..."
echo "=================================================="
echo ""

# Find all .sh files
SCRIPTS=$(find . -name "*.sh" -type f)
ERROR_COUNT=0
SUCCESS_COUNT=0

for script in $SCRIPTS; do
    echo -n "Checking: $script ... "
    
    # Run bash syntax check
    if bash -n "$script" 2>/dev/null; then
        echo "✅ OK"
        ((SUCCESS_COUNT++))
    else
        echo "❌ SYNTAX ERROR"
        echo "Error details:"
        bash -n "$script" 2>&1 | sed 's/^/  /'
        echo ""
        ((ERROR_COUNT++))
    fi
done

echo ""
echo "=================================================="
echo "Summary:"
echo "  ✅ Valid scripts: $SUCCESS_COUNT"
echo "  ❌ Invalid scripts: $ERROR_COUNT"
echo ""

if [ $ERROR_COUNT -eq 0 ]; then
    echo "🎉 All shell scripts are syntactically correct!"
    exit 0
else
    echo "⚠️  Please fix the syntax errors above"
    exit 1
fi

