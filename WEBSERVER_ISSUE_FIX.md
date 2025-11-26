# WebServer Issue: Server Ready But Tests Don't Run

## Problem

- ✅ Server shows "Ready in XXXms"
- ✅ Server outputs "Local: http://localhost:XXXX"
- ❌ Tests don't execute

## Root Cause

Playwright's `webServer` checks the `url` parameter by making HTTP requests. It only proceeds to run tests when:
1. The server command starts
2. The `url` responds with **HTTP 200**
3. This happens within `startupTimeout` (60 seconds)

If the URL check fails, tests **never run**.

## Common Causes

### 1. Port Mismatch
- Server starts on port 3001
- `BASE_URL` points to port 3000
- Playwright checks port 3000, gets no response
- Tests never run

### 2. URL Not Responding
- Server starts but root URL doesn't respond
- Playwright checks `BASE_URL`, gets error
- Tests never run

### 3. Server Takes Too Long
- Server starts but takes > 60 seconds
- `startupTimeout` expires
- Tests never run

## Solution

### Check Port Detection
```bash
# See what port is detected
node scripts/detect-port.js

# Or check manually
echo $PORT
echo $TEST_BASE_URL
```

### Verify URL Responds
```bash
# Start server manually
npm run dev

# In another terminal, check if URL responds
curl http://localhost:3001
curl http://localhost:3001/api/status

# Should get HTTP 200
```

### Fix Port Mismatch
If server starts on 3001 but BASE_URL is 3000:
1. Set `TEST_BASE_URL` environment variable:
   ```bash
   TEST_BASE_URL=http://localhost:3001 npm run test:e2e
   ```

2. Or update port detection in `playwright.config.js`

## Debugging

The logs will show:
- `[PLAYWRIGHT] webServer will check URL: http://localhost:XXXX`
- `[WEBSERVER] ✓ Server ready detected: Ready in XXXms`

If you see both but tests don't run, the URL check is failing.

## Quick Fix

Try setting the URL explicitly:
```bash
TEST_BASE_URL=http://localhost:3001 npm run test:e2e
```

This ensures Playwright checks the correct port.


