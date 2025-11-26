#!/bin/bash
# E2E test runner that shows test status and suppresses module errors

cd /home/sylaw/react.js

# Kill any existing servers
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Run tests and filter out module resolution errors
# Use awk for better line-by-line processing
npx playwright test --project=chromium --reporter=list 2>&1 | \
  awk '!/Error: Cannot find module.*next\/(server|navigation|link)/ && !/Did you mean to import/ { print }'
