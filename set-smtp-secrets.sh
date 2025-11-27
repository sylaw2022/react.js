#!/bin/bash

# Script to set SMTP secrets using GitHub CLI

echo "=== Setting SMTP Secrets with GitHub CLI ==="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "Install it with:"
    echo "  sudo apt install gh"
    echo ""
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "⚠️  Not authenticated with GitHub CLI."
    echo ""
    echo "Please authenticate first:"
    echo "  gh auth login"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Set SMTP_USERNAME
echo "Setting SMTP_USERNAME..."
echo "groklord2@gmail.com" | gh secret set SMTP_USERNAME --repo sylaw2022/react.js

if [ $? -eq 0 ]; then
    echo "✅ SMTP_USERNAME set successfully"
else
    echo "❌ Failed to set SMTP_USERNAME"
    exit 1
fi

echo ""

# Prompt for SMTP_PASSWORD
echo "To set SMTP_PASSWORD, run:"
echo "  echo 'your-app-password' | gh secret set SMTP_PASSWORD --repo sylaw2022/react.js"
echo ""
echo "Or run this script with the password:"
echo "  ./set-smtp-secrets.sh <app-password>"
echo ""

# If password provided as argument
if [ -n "$1" ]; then
    echo "Setting SMTP_PASSWORD..."
    echo "$1" | gh secret set SMTP_PASSWORD --repo sylaw2022/react.js
    
    if [ $? -eq 0 ]; then
        echo "✅ SMTP_PASSWORD set successfully"
    else
        echo "❌ Failed to set SMTP_PASSWORD"
        exit 1
    fi
fi

echo ""
echo "=== Verification ==="
echo "Listing secrets (names only):"
gh secret list --repo sylaw2022/react.js | grep -i smtp || echo "No SMTP secrets found"

echo ""
echo "✅ Done!"

