#!/usr/bin/env node
/**
 * Get the port for testing - checks environment variable or detects from running server
 * This is used by test scripts to determine which port to use
 */

import { execSync } from 'child_process'

function getTestPort() {
  // Priority 1: TEST_BASE_URL environment variable
  if (process.env.TEST_BASE_URL) {
    const url = new URL(process.env.TEST_BASE_URL)
    return parseInt(url.port || '3000', 10)
  }

  // Priority 2: PORT environment variable
  if (process.env.PORT) {
    return parseInt(process.env.PORT, 10)
  }

  // Priority 3: Try to detect from running Next.js server
  try {
    // Check common ports for Next.js
    const commonPorts = [3000, 3001, 3002, 3003, 3004]
    
    for (const port of commonPorts) {
      try {
        const result = execSync(`lsof -ti:${port}`, { encoding: 'utf-8', stdio: 'pipe' })
        if (result.trim()) {
          // Verify it's a Node.js/Next.js process
          const pid = result.trim()
          const processInfo = execSync(`ps -p ${pid} -o command=`, { encoding: 'utf-8' })
          if (processInfo.includes('next') || processInfo.includes('node')) {
            return port
          }
        }
      } catch (e) {
        // Port not in use or not accessible
        continue
      }
    }
  } catch (error) {
    // Detection failed, use default
  }

  // Default: 3000
  return 3000
}

const port = getTestPort()
console.log(port)



