import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js Link component globally
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }) => {
    const React = require('react')
    return React.createElement('a', { href, ...props }, children)
  },
}))



