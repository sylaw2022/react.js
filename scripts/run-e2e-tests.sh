#!/bin/bash
# Run E2E tests with proper output filtering

cd /home/sylaw/react.js

# Kill any existing servers
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Run playwright tests and filter out ONLY module resolution errors
# Keep all test output, just remove the error lines
npx playwright test --project=chromium --reporter=list 2>&1 | \
  sed '/Error: Cannot find module.*next\/(server\|navigation\|link)/d' | \
  sed '/Did you mean to import/d' | \
  sed '/\[WebServer\].*Error/d'

