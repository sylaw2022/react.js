// Playwright global setup - runs after webServer is ready
// This confirms that webServer detected the server and tests are about to start

async function globalSetup(config) {
  console.log('[PLAYWRIGHT] Global setup: STARTING - webServer is ready, tests are about to start')
  process.stdout.write('[PLAYWRIGHT] Global setup: STARTING - webServer is ready, tests are about to start\n')
  
  // Get BASE_URL from config or environment
  const baseURL = config?.use?.baseURL || process.env.TEST_BASE_URL || `http://localhost:${process.env.PORT || 3000}`
  console.log('[PLAYWRIGHT] Global setup: BASE_URL =', baseURL)
  process.stdout.write(`[PLAYWRIGHT] Global setup: BASE_URL = ${baseURL}\n`)
  console.log('[PLAYWRIGHT] Global setup: Test directory = ./tests')
  process.stdout.write('[PLAYWRIGHT] Global setup: Test directory = ./tests\n')
  
  // Log config details
  console.log('[PLAYWRIGHT] Global setup: Config testDir =', config?.testDir)
  process.stdout.write(`[PLAYWRIGHT] Global setup: Config testDir = ${config?.testDir}\n`)
  console.log('[PLAYWRIGHT] Global setup: Config projects =', config?.projects?.map(p => p.name).join(', '))
  process.stdout.write(`[PLAYWRIGHT] Global setup: Config projects = ${config?.projects?.map(p => p.name).join(', ')}\n`)
  
  console.log('[PLAYWRIGHT] Global setup: COMPLETED - returning control to Playwright')
  process.stdout.write('[PLAYWRIGHT] Global setup: COMPLETED - returning control to Playwright\n')
}

export default globalSetup

