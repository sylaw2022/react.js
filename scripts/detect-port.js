#!/usr/bin/env node
/**
 * Detect the port number used by Next.js dev server
 * This script checks for the port in multiple ways:
 * 1. From process.env.PORT
 * 2. From Next.js output (if server is running)
 * 3. Defaults to 3000
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function detectPort() {
  // Method 1: Check environment variable
  if (process.env.PORT) {
    return parseInt(process.env.PORT, 10)
  }

  // Method 2: Check if Next.js is running and get its port
  try {
    // Check for processes listening on common Next.js ports
    const commonPorts = [3000, 3001, 3002, 3003, 3004]
    
    for (const port of commonPorts) {
      try {
        const result = execSync(`lsof -ti:${port}`, { encoding: 'utf-8', stdio: 'pipe' })
        if (result.trim()) {
          // Check if it's a Next.js process
          const processInfo = execSync(`ps -p ${result.trim()} -o command=`, { encoding: 'utf-8' })
          if (processInfo.includes('next') || processInfo.includes('node')) {
            return port
          }
        }
      } catch (e) {
        // Port not in use, continue
        continue
      }
    }
  } catch (error) {
    // If lsof or ps commands fail, continue to next method
  }

  // Method 3: Try to read from .next/port file (if Next.js creates one)
  try {
    const portFile = join(process.cwd(), '.next', 'port')
    const port = parseInt(readFileSync(portFile, 'utf-8').trim(), 10)
    if (!isNaN(port)) {
      return port
    }
  } catch (error) {
    // File doesn't exist, continue
  }

  // Method 4: Default to 3000
  return 3000
}

const port = detectPort()
console.log(port)
process.exit(0)


