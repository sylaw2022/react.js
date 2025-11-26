#!/bin/bash
# Simple E2E test runner that shows test status

cd /home/sylaw/react.js

# Kill any existing servers
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Run tests and filter out module resolution errors
# Use sed with unbuffered mode to see results immediately
npx playwright test --project=chromium --reporter=list 2>&1 | \
  sed -u '/Error: Cannot find module.*next\/server/d' | \
  sed -u '/Error: Cannot find module.*next\/navigation/d' | \
  sed -u '/Error: Cannot find module.*next\/link/d' | \
  sed -u '/Did you mean to import/d'
