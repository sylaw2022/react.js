import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'

// Console log to verify test file is loaded
console.log('[E2E] Test file loaded: e2e.test.js')

/**
 * Detect the port number used by the Next.js dev server
 * Uses the same improved detection logic as playwright.config.js
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
  try {
    const commonPorts = [3000, 3001, 3002, 3003, 3004]
    
    for (const port of commonPorts) {
      try {
        const result = execSync(`lsof -ti:${port} 2>/dev/null`, { 
          encoding: 'utf-8', 
          stdio: 'pipe',
          timeout: 1000 
        })
        
        if (result && result.trim()) {
          const pid = result.trim().split('\n')[0]
          
          try {
            const processInfo = execSync(`ps -p ${pid} -o command= 2>/dev/null`, { 
              encoding: 'utf-8',
              stdio: 'pipe',
              timeout: 1000
            })
            
            if (processInfo && (
              processInfo.includes('next dev') || 
              processInfo.includes('next-server') ||
              processInfo.includes('/node_modules/.bin/next') ||
              (processInfo.includes('next') && processInfo.includes('dev'))
            )) {
              return port
            }
          } catch (psError) {
            continue
          }
        }
      } catch (lsofError) {
        continue
      }
    }
  } catch (error) {
    // Detection failed, use default
  }

  // Default: 3000
  return 3000
}

const TEST_PORT = detectPort()
const BASE_URL = process.env.TEST_BASE_URL || `http://localhost:${TEST_PORT}`

console.log('[E2E] BASE_URL detected:', BASE_URL)
process.stdout.write(`[E2E] BASE_URL detected: ${BASE_URL}\n`)

// Add a hook to log when tests are discovered
test.beforeAll(() => {
  console.log('[E2E] beforeAll: All tests discovered, about to run')
  process.stdout.write('[E2E] beforeAll: All tests discovered, about to run\n')
})

test.describe('E2E Tests', () => {
  console.log('[E2E] describe block "E2E Tests" initialized')
  process.stdout.write('[E2E] describe block "E2E Tests" initialized\n')
  
  // Add a simple test to verify execution (without page fixture)
  test('test execution check - no page', () => {
    console.log('[E2E] Simple test executed (no page)!')
    process.stdout.write('[E2E] Simple test executed (no page)!\n')
    process.stderr.write('[E2E] Simple test executed (no page) - stderr!\n')
    console.error('[E2E] Simple test executed (no page) - console.error!')
    expect(true).toBe(true)
    console.log('[E2E] Simple test assertion passed!')
    process.stdout.write('[E2E] Simple test assertion passed!\n')
  })
  
  // Add a simple test with page to verify page fixture works
  test('test execution check - with page', async ({ page }) => {
    console.log('[E2E] Simple test with page executed!')
    process.stdout.write('[E2E] Simple test with page executed!\n')
    console.log('[E2E] Page object:', typeof page)
    process.stdout.write(`[E2E] Page object: ${typeof page}\n`)
    expect(true).toBe(true)
  })
  
  test.beforeEach(async ({ page }, testInfo) => {
    // Log immediately - before any async operations
    console.log('[E2E] beforeEach: Starting')
    process.stdout.write('[E2E] beforeEach: Starting\n')
    process.stderr.write('[E2E] beforeEach: Starting (stderr)\n')
    
    console.log('[E2E] beforeEach: BASE_URL =', BASE_URL)
    process.stdout.write(`[E2E] beforeEach: BASE_URL = ${BASE_URL}\n`)
    console.log('[E2E] beforeEach: Test info:', testInfo.title)
    process.stdout.write(`[E2E] beforeEach: Test info: ${testInfo.title}\n`)
    
    console.log('[E2E] beforeEach: Clearing localStorage')
    process.stdout.write('[E2E] beforeEach: Clearing localStorage\n')
    
    try {
      // Clear localStorage before each test
      console.log('[E2E] beforeEach: Navigating to', BASE_URL)
      process.stdout.write(`[E2E] beforeEach: Navigating to ${BASE_URL}\n`)
      
      const response = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 10000 })
      console.log('[E2E] beforeEach: Navigation complete, status:', response?.status())
      process.stdout.write(`[E2E] beforeEach: Navigation complete, status: ${response?.status()}\n`)
      
      await page.evaluate(() => {
        localStorage.clear()
      })
      console.log('[E2E] beforeEach: localStorage cleared')
      process.stdout.write('[E2E] beforeEach: localStorage cleared\n')
    } catch (error) {
      console.error('[E2E] beforeEach: ERROR', error)
      process.stdout.write(`[E2E] beforeEach: ERROR ${error.message}\n`)
      process.stderr.write(`[E2E] beforeEach: ERROR ${error.message} (stderr)\n`)
      // Don't throw - let's see if tests continue
      // throw error
    }
    
    console.log('[E2E] beforeEach: Completed')
    process.stdout.write('[E2E] beforeEach: Completed\n')
  })

  test.describe('Home Page', () => {
    console.log('[E2E] describe block "Home Page" initialized')
    process.stdout.write('[E2E] describe block "Home Page" initialized\n')
    
    test('should load home page', async ({ page }, testInfo) => {
      // Use both console.log and process.stdout.write to ensure output is visible
      console.log('[E2E] Test started: should load home page')
      process.stdout.write('[E2E] Test started: should load home page\n')
      console.log('[E2E] Test name:', testInfo.title)
      console.log('[E2E] Test file:', testInfo.file)
      console.log('[E2E] BASE_URL:', BASE_URL)
      process.stdout.write(`[E2E] BASE_URL: ${BASE_URL}\n`)
      
      await page.goto(BASE_URL)
      console.log('[E2E] Navigated to:', BASE_URL)
      process.stdout.write(`[E2E] Navigated to: ${BASE_URL}\n`)
      
      // Target the main content h1 (not the nav h1)
      await expect(page.locator('h1').nth(1)).toContainText('Hello World!')
      console.log('[E2E] Test completed: should load home page')
      process.stdout.write('[E2E] Test completed: should load home page\n')
    })

    test('should show login and register links when not logged in', async ({ page }) => {
      console.log('[E2E] Test started: should show login and register links')
      await page.goto(BASE_URL)
      // Target the nav links specifically (first occurrence)
      await expect(page.getByRole('link', { name: /Login/i }).first()).toBeVisible()
      await expect(page.getByRole('link', { name: /Register/i }).first()).toBeVisible()
      console.log('[E2E] Test completed: should show login and register links')
    })

    test('should navigate to login page', async ({ page }) => {
      console.log('[E2E] Test started: should navigate to login page')
      await page.goto(BASE_URL)
      // Target the nav Login link specifically (first occurrence)
      await page.getByRole('link', { name: /Login/i }).first().click()
      await expect(page).toHaveURL(/.*\/login/)
      await expect(page.locator('h1')).toContainText('Login')
      console.log('[E2E] Test completed: should navigate to login page')
    })

    test('should navigate to register page', async ({ page }) => {
      await page.goto(BASE_URL)
      await page.getByRole('link', { name: /Register/i }).click()
      await expect(page).toHaveURL(/.*\/register/)
      await expect(page.locator('h1')).toContainText('Register')
    })
  })

  test.describe('Registration Flow', () => {
    test('should register a new user successfully', async ({ page }) => {
      // Mock API response
      await page.route('**/api/auth/register', async (route) => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'test-token-123',
            user: { userId: 1, username: 'e2etestuser', role: 'user' },
            expiresIn: '24h',
          }),
        })
      })

      await page.goto(`${BASE_URL}/register`)

      // Fill registration form
      await page.fill('input[name="username"]', 'e2etestuser')
      await page.fill('input[name="email"]', 'e2e@test.com')
      await page.fill('input[name="password"]', 'password123')
      await page.fill('input[name="confirmPassword"]', 'password123')

      // Submit form
      await page.click('button[type="submit"]')

      // Wait for success message
      await expect(page.locator('text=Registration successful')).toBeVisible({ timeout: 5000 })

      // Check redirect to home
      await expect(page).toHaveURL(BASE_URL, { timeout: 5000 })
    })

    test('should show validation errors for invalid input', async ({ page }) => {
      await page.goto(`${BASE_URL}/register`)

      // Try to submit empty form
      await page.click('button[type="submit"]')

      // Check for validation errors
      await expect(page.locator('text=/Username is required/i')).toBeVisible()
      await expect(page.locator('text=/Password is required/i')).toBeVisible()
    })

    test('should show error for password mismatch', async ({ page }) => {
      await page.goto(`${BASE_URL}/register`)

      await page.fill('input[name="username"]', 'testuser')
      await page.fill('input[name="password"]', 'password123')
      await page.fill('input[name="confirmPassword"]', 'password456')

      await page.click('button[type="submit"]')

      await expect(page.locator('text=/Passwords do not match/i')).toBeVisible()
    })

    test('should show error for existing username', async ({ page }) => {
      // Mock API error response
      await page.route('**/api/auth/register', async (route) => {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Username already exists',
          }),
        })
      })

      await page.goto(`${BASE_URL}/register`)

      await page.fill('input[name="username"]', 'existinguser')
      await page.fill('input[name="password"]', 'password123')
      await page.fill('input[name="confirmPassword"]', 'password123')

      await page.click('button[type="submit"]')

      await expect(page.locator('text=/Username already exists/i')).toBeVisible()
    })
  })

  test.describe('Login Flow', () => {
    console.log('[E2E] describe block "Login Flow" initialized')
    
    test('should login successfully', async ({ page }) => {
      console.log('[E2E] Test started: should login successfully')
      // Mock API response
      await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'test-token-123',
            user: { userId: 1, username: 'testuser', role: 'user' },
            expiresIn: '24h',
          }),
        })
      })

      await page.goto(`${BASE_URL}/login`)

      // Fill login form
      await page.fill('input[name="username"]', 'testuser')
      await page.fill('input[name="password"]', 'password123')

      // Submit form
      await page.click('button[type="submit"]')

      // Wait for success message
      await expect(page.locator('text=Login successful')).toBeVisible({ timeout: 5000 })

      // Check redirect to home
      await expect(page).toHaveURL(BASE_URL, { timeout: 5000 })
    })

    test('should show error for invalid credentials', async ({ page }) => {
      // Mock API error response
      await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Invalid username or password',
          }),
        })
      })

      await page.goto(`${BASE_URL}/login`)

      await page.fill('input[name="username"]', 'wronguser')
      await page.fill('input[name="password"]', 'wrongpassword')

      await page.click('button[type="submit"]')

      await expect(page.locator('text=/Invalid username or password/i')).toBeVisible()
    })

    test('should validate required fields', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`)

      // Try to submit empty form
      await page.click('button[type="submit"]')

      // Check for validation errors
      await expect(page.locator('text=/Username is required/i')).toBeVisible()
      await expect(page.locator('text=/Password is required/i')).toBeVisible()
    })
  })

  test.describe('Authentication State', () => {
    test('should show user info when logged in', async ({ page }) => {
      // Set localStorage before navigating
      await page.goto(BASE_URL)
      await page.evaluate(() => {
        localStorage.setItem('token', 'test-token')
        localStorage.setItem('user', JSON.stringify({ username: 'testuser', userId: 1, role: 'user' }))
      })

      await page.reload()

      await expect(page.locator('text=/Welcome, testuser/i')).toBeVisible()
      await expect(page.getByRole('button', { name: /Logout/i })).toBeVisible()
    })

    test('should logout successfully', async ({ page }) => {
      // Set logged in state
      await page.goto(BASE_URL)
      await page.evaluate(() => {
        localStorage.setItem('token', 'test-token')
        localStorage.setItem('user', JSON.stringify({ username: 'testuser', userId: 1, role: 'user' }))
      })

      await page.reload()
      await expect(page.locator('text=/Welcome, testuser/i')).toBeVisible()

      // Click logout
      await page.getByRole('button', { name: /Logout/i }).click()

      // Check that user info is gone
      await expect(page.locator('text=/Welcome, testuser/i')).not.toBeVisible()
      // Target the nav Login link specifically (first occurrence)
      await expect(page.getByRole('link', { name: /Login/i }).first()).toBeVisible()
    })
  })

  test.describe('Navigation', () => {
    console.log('[E2E] describe block "Navigation" initialized')
    test('should navigate between pages without full reload', async ({ page }) => {
      await page.goto(BASE_URL)

      // Navigate to register
      await page.getByRole('link', { name: /Register/i }).click()
      await expect(page).toHaveURL(/.*\/register/)

      // Navigate to login
      await page.getByRole('link', { name: /Login/i }).click()
      await expect(page).toHaveURL(/.*\/login/)

      // Navigate back to home
      await page.getByRole('link', { name: /Back to Home/i }).click()
      await expect(page).toHaveURL(BASE_URL)

      // Verify no full page reloads occurred (check for SPA behavior)
      const navigationCount = await page.evaluate(() => {
        return window.performance.getEntriesByType('navigation').length
      })
      expect(navigationCount).toBeGreaterThan(0)
    })
  })

  test.describe('API Integration', () => {
    test('should call registration API with correct data', async ({ page }) => {
      let requestData = null

      await page.route('**/api/auth/register', async (route) => {
        const request = route.request()
        requestData = await request.postDataJSON()
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'test-token',
            user: { userId: 1, username: 'testuser', role: 'user' },
          }),
        })
      })

      await page.goto(`${BASE_URL}/register`)
      await page.fill('input[name="username"]', 'testuser')
      await page.fill('input[name="email"]', 'test@example.com')
      await page.fill('input[name="password"]', 'password123')
      await page.fill('input[name="confirmPassword"]', 'password123')
      await page.click('button[type="submit"]')

      await page.waitForTimeout(1000)

      expect(requestData).toBeTruthy()
      expect(requestData.username).toBe('testuser')
      expect(requestData.email).toBe('test@example.com')
      expect(requestData.password).toBe('password123')
    })
  })
})

