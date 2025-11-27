# WebServer URL Check Debugging

## Problem

Server shows "Ready" but tests don't run. This means:
- ✅ Server starts successfully
- ✅ Server outputs "Ready in XXXms"
- ❌ Playwright's webServer URL check is failing
- ❌ Tests never execute

## How webServer Works

Playwright's `webServer` checks the `url` parameter by:
1. Starting the server command
2. Making HTTP requests to the `url` repeatedly
3. Waiting for HTTP 200 response
4. **Only then** proceeding to run tests

If the URL check fails, tests will **never run**.

## Debugging Steps

### Step 1: Verify URL is correct
```bash
# Check what URL Playwright is checking
grep "BASE_URL" playwright.config.js

# Manually test if URL responds
curl http://localhost:3001
curl http://localhost:3001/api/status
```

### Step 2: Check if URL responds
```bash
# Use the verification script
bash scripts/verify-server-url.sh
```

### Step 3: Check port mismatch
The server might start on one port, but Playwright checks another:
- Server starts on: 3001
- Playwright checks: 3000
- Result: Tests never run

### Step 4: Check BASE_URL detection
```bash
# See what port is detected
node scripts/detect-port.js

# Or check in test
node -e "const { execSync } = require('child_process'); /* detectPort logic */ console.log('Port:', detectPort())"
```

## Common Issues

### Issue 1: Port Mismatch
- Server starts on port 3001
- BASE_URL points to port 3000
- Solution: Ensure BASE_URL matches actual server port

### Issue 2: Server Not Responding to Root URL
- Server might require a specific path
- Solution: Check if `BASE_URL` should be `BASE_URL + '/api/status'`

### Issue 3: Server Takes Too Long
- Server starts but takes > 60 seconds
- Solution: Increase `startupTimeout`

## Solution

The webServer `url` must:
1. Match the actual server port
2. Respond with HTTP 200
3. Respond within `startupTimeout` (60 seconds)

If any of these fail, tests won't run.



