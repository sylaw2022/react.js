# Playwright E2E Test Troubleshooting

## Common Issues and Solutions

### Issue: Tests Get Stuck/Hang

**Symptoms:**
- Playwright tests start but never complete
- Tests appear to hang indefinitely
- No error messages, just waiting

**Solutions:**

1. **Check if server is already running:**
   ```bash
   lsof -ti:3000
   # If a process is found, kill it:
   pkill -f "next dev"
   ```

2. **Run tests with a single browser (faster):**
   ```bash
   npm run test:e2e  # Uses only Chromium
   ```

3. **Run tests with all browsers:**
   ```bash
   npm run test:e2e:all  # Uses all browsers (slower)
   ```

4. **Check server startup manually:**
   ```bash
   # Start server manually
   npm run dev
   # In another terminal, test if it's responding:
   curl http://localhost:3000
   ```

5. **Increase timeout if server is slow to start:**
   Edit `playwright.config.js` and increase `startupTimeout`:
   ```javascript
   webServer: {
     startupTimeout: 90 * 1000, // 90 seconds
   }
   ```

6. **Run tests with UI mode to see what's happening:**
   ```bash
   npm run test:e2e:ui
   ```

7. **Run tests in headed mode to see browser:**
   ```bash
   npm run test:e2e:headed
   ```

### Issue: Port Already in Use

**Solution:**
```bash
# Kill any process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm run dev
# Then update TEST_BASE_URL in playwright.config.js
```

### Issue: Server Takes Too Long to Start

**Solution:**
- Check if Next.js build is needed first: `npm run build`
- Check system resources (CPU, memory)
- Consider using a production build for tests:
  ```javascript
  webServer: {
    command: 'npm run build && npm run start',
    // ...
  }
  ```

### Issue: Tests Fail with Timeout

**Solution:**
- Increase test timeout in `playwright.config.js`:
  ```javascript
  use: {
    actionTimeout: 10000, // 10 seconds
    navigationTimeout: 30000, // 30 seconds
  }
  ```

### Debugging Tips

1. **Run a single test:**
   ```bash
   npx playwright test tests/e2e.test.js -g "should load home page"
   ```

2. **Run with debug output:**
   ```bash
   DEBUG=pw:api npm run test:e2e
   ```

3. **Check Playwright logs:**
   ```bash
   npx playwright test --reporter=list
   ```

4. **View test report:**
   ```bash
   npx playwright show-report
   ```

## Configuration Notes

- By default, only Chromium is used for faster testing
- To test all browsers, use `npm run test:e2e:all`
- The server automatically starts before tests and stops after
- If a server is already running on port 3000, Playwright will reuse it (unless in CI mode)


