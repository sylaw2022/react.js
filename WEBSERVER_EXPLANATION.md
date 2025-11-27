# What is webServer in Playwright?

## Overview

`webServer` is a configuration option in Playwright that automatically starts a local development server before running your E2E tests. It ensures your application is running and ready before tests execute.

## Purpose

Instead of manually starting your server before running tests, Playwright can:
1. **Start the server automatically** when tests begin
2. **Wait for the server to be ready** (checks if it responds to HTTP requests)
3. **Stop the server automatically** when tests finish
4. **Reuse an existing server** if one is already running

## How It Works

In your `playwright.config.js`:

```javascript
webServer: {
  command: 'npm run dev',        // Command to start the server
  url: 'http://localhost:3000',   // URL to check if server is ready
  reuseExistingServer: true,      // Use existing server if running
  timeout: 120000,                // Max time to wait for server (ms)
  stdout: 'pipe',                 // How to handle server output
  stderr: 'pipe',                 // How to handle server errors
  startupTimeout: 60000,          // Time to wait for server to start (ms)
}
```

## Configuration Options

### `command`
- **What it does**: The command to run to start your server
- **Example**: `'npm run dev'`, `'node server.js'`, `'python -m http.server'`
- **In your case**: `'npm run dev'` starts your Next.js development server

### `url`
- **What it does**: The URL Playwright checks to see if the server is ready
- **Example**: `'http://localhost:3000'`
- **How it works**: Playwright makes HTTP requests to this URL. When it gets a successful response (200), it knows the server is ready

### `reuseExistingServer`
- **What it does**: Whether to use an already-running server
- **Values**: 
  - `true` - Use existing server if found (good for local development)
  - `false` - Always start a new server (good for CI/CD)

### `timeout`
- **What it does**: Maximum time to wait for the server to respond
- **Default**: Usually 60 seconds
- **In your case**: 120 seconds (120000ms)

### `startupTimeout`
- **What it does**: Maximum time to wait for the server process to start
- **Default**: Usually 30 seconds
- **In your case**: 60 seconds

### `stdout` and `stderr`
- **What it does**: How to handle server output
- **Options**:
  - `'pipe'` - Capture output (can be filtered/displayed)
  - `'ignore'` - Suppress output completely
- **In your case**: `'pipe'` to capture output

## Why It's Useful

### Before webServer (Manual):
```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Run tests
npm run test:e2e

# Terminal 1: Stop server manually
Ctrl+C
```

### With webServer (Automatic):
```bash
# Just run tests - server starts/stops automatically
npm run test:e2e
```

## In Your Project

Your current configuration:

```javascript
webServer: {
  command: 'npm run dev',              // Start Next.js dev server
  url: BASE_URL,                        // Check if server is ready (e.g., http://localhost:3001)
  reuseExistingServer: !process.env.CI, // Reuse if running (unless in CI)
  timeout: 120 * 1000,                  // Wait up to 2 minutes
  stdout: 'pipe',                      // Capture server output
  stderr: 'pipe',                      // Capture server errors
  startupTimeout: 60 * 1000,           // Wait 1 minute for server to start
}
```

## What Happens When Tests Run

1. **Playwright starts**: `npm run dev` command
2. **Playwright waits**: Checks `BASE_URL` repeatedly
3. **Server responds**: When it gets HTTP 200, server is ready
4. **Tests run**: Playwright executes your E2E tests
5. **Server stops**: Playwright stops the server when tests finish

## Common Issues

### Server takes too long to start
- **Solution**: Increase `startupTimeout`

### Server output cluttering test output
- **Solution**: Set `stdout: 'ignore'` and `stderr: 'ignore'`

### Server already running
- **Solution**: Set `reuseExistingServer: true` (or start server manually)

### Wrong port/URL
- **Solution**: Make sure `url` matches where your server actually runs

## Summary

`webServer` is Playwright's way of automatically managing your development server during E2E tests. It:
- ✅ Starts your server automatically
- ✅ Waits for it to be ready
- ✅ Stops it when done
- ✅ Makes testing easier and more reliable

This is why you don't need to manually start `npm run dev` before running E2E tests - Playwright does it for you!



