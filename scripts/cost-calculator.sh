#!/bin/bash
# ============================================================================
# OKE Cost Calculator
# ============================================================================
# Last Updated: 2025-10-10
# Purpose: Calculate estimated OKE deployment costs
# Usage: ./cost-calculator.sh [nodes] [ocpu_per_node] [hours_per_day]
# ============================================================================

# Default values
NODES=${1:-2}
OCPU_PER_NODE=${2:-0.5}
HOURS_PER_DAY=${3:-24}

# Pricing (approximate, check OCI pricing page for exact values)
# E5.Flex: ~$0.015/OCPU/hour
OCPU_HOURLY_COST=0.015

# Calculate costs
TOTAL_OCPU=$(echo "$NODES * $OCPU_PER_NODE" | bc)
COST_PER_HOUR=$(echo "$TOTAL_OCPU * $OCPU_HOURLY_COST" | bc)
DAILY_COST=$(echo "$COST_PER_HOUR * $HOURS_PER_DAY" | bc)
MONTHLY_COST=$(echo "$DAILY_COST * 30" | bc)
YEARLY_COST=$(echo "$MONTHLY_COST * 12" | bc)

# Cost with auto-shutdown (8 hours/day)
SHUTDOWN_DAILY_COST=$(echo "$COST_PER_HOUR * 8" | bc)
SHUTDOWN_MONTHLY_COST=$(echo "$SHUTDOWN_DAILY_COST * 30" | bc)
SAVINGS=$(echo "$MONTHLY_COST - $SHUTDOWN_MONTHLY_COST" | bc)
SAVINGS_PERCENT=$(echo "scale=0; ($SAVINGS / $MONTHLY_COST) * 100" | bc)

echo "💰 OKE COST CALCULATOR"
echo "======================"
echo ""
echo "Configuration:"
echo "  • Nodes: $NODES"
echo "  • OCPU per node: $OCPU_PER_NODE"
echo "  • Total OCPU: $TOTAL_OCPU"
echo "  • Shape: VM.Standard.E5.Flex"
echo ""
echo "Running 24/7:"
echo "  • Cost per hour: \$$COST_PER_HOUR"
echo "  • Cost per day: \$$DAILY_COST"
echo "  • Cost per month: \$$MONTHLY_COST"
echo "  • Cost per year: \$$YEARLY_COST"
echo ""
echo "With Auto-Shutdown (8 hours/day):"
echo "  • Cost per month: \$$SHUTDOWN_MONTHLY_COST"
echo "  • Savings: \$$SAVINGS/month ($SAVINGS_PERCENT%)"
echo ""
echo "💡 Cost Optimization Tips:"
echo "  • Use auto-shutdown scripts during off-hours"
echo "  • Scale to 0 nodes when not in use"
echo "  • Use Object Storage (FREE) for static hosting"
echo "  • Monitor usage with: kubectl top nodes"
echo ""
echo "📊 Cost Comparison:"
echo "  • Object Storage: \$0/month (FREE)"
echo "  • Minimal OKE (this config): \$$MONTHLY_COST/month"
echo "  • Standard OKE (3x1 OCPU): ~\$32/month"
echo "  • Production OKE: \$200+/month"
echo ""
echo "Run './scripts/shutdown-cluster.sh' to save costs when not using the cluster"
