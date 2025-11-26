#!/usr/bin/env node
/**
 * Filter test output to remove non-fatal Next.js module resolution warnings
 * These warnings don't affect functionality but clutter the output
 */

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Patterns to filter out (non-fatal warnings)
const FILTER_PATTERNS = [
  /Error: Cannot find module.*node_modules\/next\/(server|navigation|link).*imported from.*tests\/backend\.test\.js/,
  /Error: Cannot find module.*node_modules\/next\/(server|navigation|link).*imported from.*app\/.*\.jsx/,
  /Did you mean to import "next\/.*\.js"\?/,
]

function shouldFilterLine(line) {
  return FILTER_PATTERNS.some(pattern => pattern.test(line))
}

// Get the original command (everything after this script)
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node scripts/filter-test-output.js <command>')
  process.exit(1)
}

const [command, ...commandArgs] = args
const child = spawn(command, commandArgs, {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
})

let stdoutBuffer = ''
let stderrBuffer = ''

child.stdout.on('data', (data) => {
  stdoutBuffer += data.toString()
  const lines = stdoutBuffer.split('\n')
  stdoutBuffer = lines.pop() || '' // Keep incomplete line in buffer
  
  lines.forEach(line => {
    if (!shouldFilterLine(line)) {
      process.stdout.write(line + '\n')
    }
  })
})

child.stderr.on('data', (data) => {
  stderrBuffer += data.toString()
  const lines = stderrBuffer.split('\n')
  stderrBuffer = lines.pop() || '' // Keep incomplete line in buffer
  
  lines.forEach(line => {
    if (!shouldFilterLine(line)) {
      process.stderr.write(line + '\n')
    }
  })
})

child.on('close', (code) => {
  // Flush remaining buffers
  if (stdoutBuffer && !shouldFilterLine(stdoutBuffer)) {
    process.stdout.write(stdoutBuffer)
  }
  if (stderrBuffer && !shouldFilterLine(stderrBuffer)) {
    process.stderr.write(stderrBuffer)
  }
  process.exit(code || 0)
})


