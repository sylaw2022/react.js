import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

// Mock Next.js router BEFORE importing components
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js Link component BEFORE importing components
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }) => {
    return React.createElement('a', { href, ...props }, children)
  },
}))

// Import components AFTER mocks
import Home from '@/app/page'
import Login from '@/app/login/page'
import Register from '@/app/register/page'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock fetch
global.fetch = vi.fn()

describe('Frontend Tests', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('Home Page', () => {
    it('should render home page with welcome message', async () => {
      render(<Home />)
      await waitFor(() => {
        expect(screen.getByText(/React App/i)).toBeInTheDocument()
      })
    })

    it('should show login and register links when not logged in', async () => {
      render(<Home />)
      await waitFor(() => {
        // Use getAllByRole to get all Login links, then check at least one exists
        const loginLinks = screen.getAllByRole('link', { name: /Login/i })
        expect(loginLinks.length).toBeGreaterThan(0)
        // Use getAllByRole to get all Register links, then check at least one exists
        const registerLinks = screen.getAllByRole('link', { name: /Register/i })
        expect(registerLinks.length).toBeGreaterThan(0)
      })
    })

    it('should show user info and logout button when logged in', async () => {
      localStorageMock.setItem('token', 'test-token')
      localStorageMock.setItem('user', JSON.stringify({ username: 'testuser', userId: 1, role: 'user' }))
      
      render(<Home />)
      
      await waitFor(() => {
        // Text is split across elements: "Welcome, " <strong>testuser</strong> "!"
        // Find the span element that contains the welcome message
        const welcomeSpan = screen.getByText((content, element) => {
          // Look for span elements that contain "Welcome" and "testuser"
          const isSpan = element?.tagName === 'SPAN'
          const text = element?.textContent || ''
          return isSpan && text.includes('Welcome') && text.includes('testuser')
        })
        expect(welcomeSpan).toBeInTheDocument()
        // Use getByRole to find the logout button specifically
        expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should handle logout correctly', async () => {
      const user = userEvent.setup()
      localStorageMock.setItem('token', 'test-token')
      localStorageMock.setItem('user', JSON.stringify({ username: 'testuser', userId: 1, role: 'user' }))
      
      render(<Home />)
      
      await waitFor(() => {
        // Use getByRole to find the logout button specifically
        expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument()
      })
      
      const logoutButton = screen.getByRole('button', { name: /Logout/i })
      await user.click(logoutButton)
      
      await waitFor(() => {
        expect(localStorageMock.getItem('token')).toBeNull()
        expect(localStorageMock.getItem('user')).toBeNull()
      })
    })
  })

  describe('Login Page', () => {
    it('should render login form', () => {
      render(<Login />)
      // Use getByRole for heading to avoid multiple matches
      expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument()
    })

    it('should validate required fields', async () => {
      const user = userEvent.setup()
      render(<Login />)
      
      const submitButton = screen.getByRole('button', { name: /Login/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Username is required/i)).toBeInTheDocument()
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument()
      })
    })

    it('should handle successful login', async () => {
      const user = userEvent.setup()
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'test-token',
          user: { userId: 1, username: 'testuser', role: 'user' },
        }),
      })

      render(<Login />)
      
      await user.type(screen.getByPlaceholderText(/Enter username/i), 'testuser')
      await user.type(screen.getByPlaceholderText(/Enter password/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /Login/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.any(Object))
        expect(localStorageMock.getItem('token')).toBe('test-token')
      })
    })

    it('should handle login error', async () => {
      const user = userEvent.setup()
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      })

      render(<Login />)
      
      await user.type(screen.getByPlaceholderText(/Enter username/i), 'testuser')
      await user.type(screen.getByPlaceholderText(/Enter password/i), 'wrongpassword')
      
      const submitButton = screen.getByRole('button', { name: /Login/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument()
      })
    })
  })

  describe('Register Page', () => {
    it('should render registration form', () => {
      render(<Register />)
      // Use getByRole for heading to avoid multiple matches
      expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Confirm password/i)).toBeInTheDocument()
    })

    it('should validate username format', async () => {
      const user = userEvent.setup()
      render(<Register />)
      
      await user.type(screen.getByPlaceholderText(/Enter username/i), 'ab')
      
      const submitButton = screen.getByRole('button', { name: /Register/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Username must be at least 3 characters/i)).toBeInTheDocument()
      })
    })

    it('should validate password match', async () => {
      const user = userEvent.setup()
      render(<Register />)
      
      await user.type(screen.getByPlaceholderText(/Enter username/i), 'testuser')
      await user.type(screen.getByPlaceholderText(/Enter password/i), 'password123')
      await user.type(screen.getByPlaceholderText(/Confirm password/i), 'password456')
      
      const submitButton = screen.getByRole('button', { name: /Register/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()
      })
    })

    it('should handle successful registration', async () => {
      const user = userEvent.setup()
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'test-token',
          user: { userId: 1, username: 'testuser', role: 'user' },
        }),
      })

      render(<Register />)
      
      await user.type(screen.getByPlaceholderText(/Enter username/i), 'testuser')
      await user.type(screen.getByPlaceholderText(/Enter email/i), 'test@example.com')
      await user.type(screen.getByPlaceholderText(/Enter password/i), 'password123')
      await user.type(screen.getByPlaceholderText(/Confirm password/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /Register/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.any(Object))
        expect(localStorageMock.getItem('token')).toBe('test-token')
      })
    })

    it('should handle registration error', async () => {
      const user = userEvent.setup()
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Username already exists' }),
      })

      render(<Register />)
      
      await user.type(screen.getByPlaceholderText(/Enter username/i), 'existinguser')
      await user.type(screen.getByPlaceholderText(/Enter password/i), 'password123')
      await user.type(screen.getByPlaceholderText(/Confirm password/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /Register/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Username already exists/i)).toBeInTheDocument()
      })
    })
  })
})
