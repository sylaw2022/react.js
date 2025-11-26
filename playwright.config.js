import { defineConfig, devices } from '@playwright/test'
import { execSync } from 'child_process'

/**
 * Detect the port number used by the Next.js dev server
 * Improved detection that handles multiple scenarios
 */
function detectPort() {
  // Priority 1: TEST_BASE_URL environment variable
  if (process.env.TEST_BASE_URL) {
    try {
      const url = new URL(process.env.TEST_BASE_URL)
      const port = parseInt(url.port || '3000', 10)
      if (!isNaN(port) && port > 0 && port < 65536) {
        return port
      }
    } catch (e) {
      // Invalid URL, continue to next method
    }
  }

  // Priority 2: PORT environment variable
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT, 10)
    if (!isNaN(port) && port > 0 && port < 65536) {
      return port
    }
  }

  // Priority 3: Try to detect from running Next.js server
  // This works when a server is already running
  try {
    const commonPorts = [3000, 3001, 3002, 3003, 3004]
    
    for (const port of commonPorts) {
      try {
        // Check if port is in use
        const result = execSync(`lsof -ti:${port} 2>/dev/null`, { 
          encoding: 'utf-8', 
          stdio: 'pipe',
          timeout: 1000 
        })
        
        if (result && result.trim()) {
          const pid = result.trim().split('\n')[0] // Get first PID if multiple
          
          // Verify it's a Next.js process (more specific check)
          try {
            const processInfo = execSync(`ps -p ${pid} -o command= 2>/dev/null`, { 
              encoding: 'utf-8',
              stdio: 'pipe',
              timeout: 1000
            })
            
            // More specific check for Next.js
            if (processInfo && (
              processInfo.includes('next dev') || 
              processInfo.includes('next-server') ||
              processInfo.includes('/node_modules/.bin/next') ||
              (processInfo.includes('next') && processInfo.includes('dev'))
            )) {
              return port
            }
          } catch (psError) {
            // ps command failed, skip this port
            continue
          }
        }
      } catch (lsofError) {
        // Port not in use or lsof failed, continue to next port
        continue
      }
    }
  } catch (error) {
    // Detection failed, use default
  }

  // Priority 4: Try to test which port responds (if server is running)
  // This is a fallback that actually tests the ports
  try {
    const commonPorts = [3000, 3001, 3002, 3003, 3004]
    for (const port of commonPorts) {
      try {
        // Try to make a quick HTTP request to see if Next.js is responding
        const result = execSync(`timeout 1 curl -s -o /dev/null -w "%{http_code}" http://localhost:${port}/api/status 2>/dev/null || echo "000"`, {
          encoding: 'utf-8',
          stdio: 'pipe',
          timeout: 2000
        })
        if (result && result.trim() === '200') {
          return port
        }
      } catch (curlError) {
        // curl failed or not available, continue
        continue
      }
    }
  } catch (error) {
    // HTTP test failed, use default
  }

  // Default: 3000 (Next.js default)
  return 3000
}

const TEST_PORT = detectPort()
const BASE_URL = process.env.TEST_BASE_URL || `http://localhost:${TEST_PORT}`

console.log('[PLAYWRIGHT] Config loaded - BASE_URL:', BASE_URL)
console.log('[PLAYWRIGHT] Config loaded - TEST_PORT:', TEST_PORT)
process.stdout.write(`[PLAYWRIGHT] Config loaded - BASE_URL: ${BASE_URL}\n`)
process.stdout.write(`[PLAYWRIGHT] Config loaded - TEST_PORT: ${TEST_PORT}\n`)

// Log webServer configuration
console.log('[PLAYWRIGHT] webServer will check URL:', BASE_URL)
process.stdout.write(`[PLAYWRIGHT] webServer will check URL: ${BASE_URL}\n`)
console.log('[PLAYWRIGHT] webServer will start command: npm run dev')
process.stdout.write('[PLAYWRIGHT] webServer will start command: npm run dev\n')

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Only match Playwright test files - exclude Vitest test files (backend.test.js, frontend.test.jsx) */
  /* Matches: e2e.test.js, e2e-simple.test.js, minimal.test.js */
  testMatch: /.*(e2e|minimal).*\.test\.(js|ts|mjs)/,
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  // Add logging to confirm config is loaded
  // This runs when Playwright starts (after webServer is ready)
  // Must be a file path string, not a function
  globalSetup: './playwright-global-setup.js',
  globalTeardown: './playwright-global-teardown.js',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Don't skip tests - run all tests */
  grep: undefined,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // Use 'list' reporter for detailed test status in terminal
  // Add 'line' reporter to show console.log output from tests
  reporter: [
    ['list'],
    ['line', { outputFile: '-' }] // Output to stdout
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Comment out other browsers for faster testing during development
    // Uncomment when you need to test across all browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    // Start Next.js dev server with logging script
    // The script will log when server is ready, confirming webServer detection
    command: 'bash scripts/start-dev-with-log.sh',
    // Playwright checks this URL - it must return HTTP 200 for tests to start
    // If this URL doesn't respond, tests will never run
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    // Pipe server output to see server startup and ready detection
    stdout: 'pipe',
    stderr: 'pipe',
    // Wait for the server to respond with 200 before starting tests
    // Playwright checks BASE_URL and proceeds when it gets HTTP 200
    // This prevents tests from running before the server is ready
    startupTimeout: 60 * 1000, // 60 seconds for server to start
  },
})

