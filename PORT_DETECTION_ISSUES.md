# Port Auto-Detection Issues and Fixes

## Why Auto-Detection Was Failing

### Issue 1: Timing Problem
**Problem:** The port detection runs when the config file is loaded, but Playwright's `webServer` starts the server AFTER the config is evaluated.

**Solution:** The detection now has multiple fallback methods and works both:
- When a server is already running (detects it)
- When Playwright starts the server (uses default 3000, which Playwright will use)

### Issue 2: Process Detection Too Broad
**Problem:** The check `processInfo.includes('node')` matches ANY Node.js process, not just Next.js.

**Solution:** More specific checks:
- `processInfo.includes('next dev')`
- `processInfo.includes('next-server')`
- `processInfo.includes('/node_modules/.bin/next')`
- Combined check: `next` AND `dev`

### Issue 3: Missing Error Handling
**Problem:** Commands like `lsof` and `ps` could fail silently or hang.

**Solution:** 
- Added timeouts to all execSync calls
- Redirected stderr to `/dev/null` to avoid noise
- Added try-catch around each detection method
- Validate port numbers (must be 1-65535)

### Issue 4: No HTTP Verification
**Problem:** Just checking if a port is in use doesn't verify it's actually a Next.js server.

**Solution:** Added HTTP test that checks if `/api/status` returns 200.

## How It Works Now

### Detection Priority:
1. **TEST_BASE_URL** environment variable (highest priority)
2. **PORT** environment variable
3. **Process detection** - Check running Next.js processes
4. **HTTP test** - Try to connect to common ports and verify it's Next.js
5. **Default** - Port 3000

### Improvements:
- ✅ More specific Next.js process detection
- ✅ Timeout protection for all commands
- ✅ HTTP verification fallback
- ✅ Better error handling
- ✅ Port number validation

## Testing the Detection

```bash
# Test detection script
npm run test:port

# Test with different scenarios
PORT=3001 npm run test:port
TEST_BASE_URL=http://localhost:3002 npm run test:port

# Start server and test detection
npm run dev &
sleep 5
npm run test:port
```

## Manual Override

If auto-detection still fails, you can always override:

```bash
# Method 1: Environment variable
PORT=3001 npm run test:e2e

# Method 2: TEST_BASE_URL
TEST_BASE_URL=http://localhost:3001 npm run test:e2e
```

## Common Issues

### Issue: Detection returns wrong port
**Cause:** Multiple Node.js processes running
**Fix:** More specific process checks now filter for Next.js only

### Issue: Detection times out
**Cause:** `lsof` or `ps` commands hanging
**Fix:** Added 1-second timeouts to all commands

### Issue: Detection doesn't work on CI
**Cause:** Different environment, commands might not be available
**Fix:** Falls back to default port 3000, which Playwright's webServer will use



