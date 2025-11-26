// Playwright global teardown - runs after tests complete

async function globalTeardown() {
  console.log('[PLAYWRIGHT] Global teardown: Tests completed')
  process.stdout.write('[PLAYWRIGHT] Global teardown: Tests completed\n')
}

export default globalTeardown


