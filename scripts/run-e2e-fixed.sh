#!/bin/bash
# E2E test runner that shows test status

cd /home/sylaw/react.js

# Kill any existing servers
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Run tests with list reporter to show detailed status
# Server errors are suppressed by webServer config
npx playwright test --project=chromium --reporter=list
