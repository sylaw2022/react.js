import { test, expect } from '@playwright/test'

console.log('[MINIMAL] Test file loaded')
process.stdout.write('[MINIMAL] Test file loaded\n')

test('minimal test', () => {
  console.log('[MINIMAL] Test executed!')
  process.stdout.write('[MINIMAL] Test executed!\n')
  expect(true).toBe(true)
  console.log('[MINIMAL] Test completed!')
  process.stdout.write('[MINIMAL] Test completed!\n')
})


