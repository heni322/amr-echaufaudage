#!/bin/bash

# Make all helper scripts executable
# Run this after cloning the repository

echo "🔧 Making scripts executable..."

chmod +x vps-setup.sh
chmod +x quick-deploy-manual.sh
chmod +x diagnose.sh
chmod +x health-check.sh
chmod +x make-executable.sh

echo "✅ All scripts are now executable!"
echo ""
echo "Available scripts:"
echo "  ./vps-setup.sh          - First-time VPS setup"
echo "  ./quick-deploy-manual.sh - Manual deployment"
echo "  ./diagnose.sh           - System diagnostics"
echo "  ./health-check.sh       - Health check"
