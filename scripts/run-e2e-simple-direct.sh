#!/bin/bash
# Simple E2E test runner - no filtering, just run tests

cd /home/sylaw/react.js

# Kill any existing servers
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Run tests directly without any filtering
# This ensures we see all output
npx playwright test --project=chromium --reporter=list


