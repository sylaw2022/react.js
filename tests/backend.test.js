import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { execSync } from 'child_process'
import { GET as statusGET } from '@/app/api/status/route'
import { POST as loginPOST } from '@/app/api/auth/login/route'
import { POST as registerPOST } from '@/app/api/auth/register/route'
import { GET as verifyGET } from '@/app/api/auth/verify/route'
import { GET as protectedGET } from '@/app/api/protected/route'
import { createUser, getUserByUsername, deleteUser } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

/**
 * Detect the port number used by the Next.js dev server
 */
function detectPort() {
  // Priority 1: TEST_BASE_URL environment variable
  if (process.env.TEST_BASE_URL) {
    try {
      const url = new URL(process.env.TEST_BASE_URL)
      return parseInt(url.port || '3000', 10)
    } catch (e) {
      // Invalid URL, continue to next method
    }
  }

  // Priority 2: PORT environment variable
  if (process.env.PORT) {
    return parseInt(process.env.PORT, 10)
  }

  // Priority 3: Try to detect from running Next.js server
  try {
    const commonPorts = [3000, 3001, 3002, 3003, 3004]
    
    for (const port of commonPorts) {
      try {
        const result = execSync(`lsof -ti:${port}`, { encoding: 'utf-8', stdio: 'pipe' })
        if (result.trim()) {
          const pid = result.trim()
          const processInfo = execSync(`ps -p ${pid} -o command=`, { encoding: 'utf-8' })
          if (processInfo.includes('next') || processInfo.includes('node')) {
            return port
          }
        }
      } catch (e) {
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
const BASE_URL = `http://localhost:${TEST_PORT}`

// Mock database functions
vi.mock('@/lib/db', () => ({
  createUser: vi.fn(),
  getUserByUsername: vi.fn(),
  getUserByEmail: vi.fn(),
  getUserById: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  getDb: vi.fn(),
}))

// Mock auth functions
vi.mock('@/lib/auth', () => ({
  hashPassword: vi.fn(),
  comparePassword: vi.fn(),
  validateUsername: vi.fn((username) => {
    if (!username || username.length < 3) {
      return { valid: false, error: 'Username must be at least 3 characters' }
    }
    return { valid: true }
  }),
  validateEmail: vi.fn((email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { valid: false, error: 'Invalid email format' }
    }
    return { valid: true }
  }),
  validatePassword: vi.fn((password) => {
    if (!password || password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters' }
    }
    return { valid: true }
  }),
}))

// Mock token functions
vi.mock('@/lib/token', () => ({
  generateToken: vi.fn((payload) => {
    const userId = payload.userId || payload.id || 'unknown'
    return `mock-token-${userId}`
  }),
  verifyTokenFromRequest: vi.fn(),
  verifyTokenAndGetUser: vi.fn(),
  extractTokenFromRequest: vi.fn(),
}))

describe('Backend API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Status API', () => {
    it('should return server status', async () => {
      const request = new NextRequest(`${BASE_URL}/api/status`)
      const response = await statusGET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('online')
      expect(data.timestamp).toBeDefined()
      expect(data.uptime).toBeGreaterThanOrEqual(0)
      expect(data.server).toBe('Next.js')
    })
  })

  describe('Registration API', () => {
    it('should register a new user successfully', async () => {
      const { hashPassword } = await import('@/lib/auth')
      const { createUser, getUserByUsername, getUserByEmail } = await import('@/lib/db')

      hashPassword.mockResolvedValue('hashed-password')
      // getUserByUsername is synchronous
      getUserByUsername.mockReturnValue(null)
      // getUserByEmail is synchronous
      getUserByEmail.mockReturnValue(null)
      // createUser is synchronous and takes an object parameter
      createUser.mockReturnValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      })

      const request = new NextRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        }),
      })

      const response = await registerPOST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.token).toBeDefined()
      expect(data.user.username).toBe('testuser')
    })

    it('should reject registration with missing fields', async () => {
      const request = new NextRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          username: 'testuser',
          // Missing password
        }),
      })

      const response = await registerPOST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Username and password are required')
    })

    it('should reject registration with invalid username', async () => {
      const request = new NextRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          username: 'ab', // Too short
          password: 'password123',
        }),
      })

      const response = await registerPOST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Username')
    })

    it('should reject registration with existing username', async () => {
      const { getUserByUsername, getUserByEmail } = await import('@/lib/db')
      // getUserByUsername is synchronous
      getUserByUsername.mockReturnValue({
        id: 1,
        username: 'existinguser',
      })
      // getUserByEmail is synchronous
      getUserByEmail.mockReturnValue(null)

      const request = new NextRequest(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          username: 'existinguser',
          password: 'password123',
        }),
      })

      const response = await registerPOST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Username already exists')
    })
  })

  describe('Login API', () => {
    it('should login user successfully', async () => {
      const { getUserByUsername } = await import('@/lib/db')
      const { comparePassword } = await import('@/lib/auth')

      // getUserByUsername is synchronous
      getUserByUsername.mockReturnValue({
        id: 1,
        username: 'testuser',
        password_hash: 'hashed-password',
        role: 'user',
      })
      comparePassword.mockResolvedValue(true)

      const request = new NextRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          username: 'testuser',
          password: 'password123',
        }),
      })

      const response = await loginPOST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.token).toBeDefined()
      expect(data.user.username).toBe('testuser')
    })

    it('should reject login with missing credentials', async () => {
      const request = new NextRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          username: 'testuser',
          // Missing password
        }),
      })

      const response = await loginPOST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Username and password are required')
    })

    it('should reject login with invalid credentials', async () => {
      const { getUserByUsername } = await import('@/lib/db')
      // getUserByUsername is synchronous
      getUserByUsername.mockReturnValue(null)

      const request = new NextRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          username: 'nonexistent',
          password: 'password123',
        }),
      })

      const response = await loginPOST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid username or password')
    })

    it('should reject login with wrong password', async () => {
      const { getUserByUsername } = await import('@/lib/db')
      const { comparePassword } = await import('@/lib/auth')

      // getUserByUsername is synchronous
      getUserByUsername.mockReturnValue({
        id: 1,
        username: 'testuser',
        password_hash: 'hashed-password',
        role: 'user',
      })
      comparePassword.mockResolvedValue(false)

      const request = new NextRequest(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          username: 'testuser',
          password: 'wrongpassword',
        }),
      })

      const response = await loginPOST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid username or password')
    })
  })

  describe('Verify API', () => {
    it('should verify valid token', async () => {
      const { verifyTokenFromRequest } = await import('@/lib/token')
      // verifyTokenFromRequest is synchronous, not async
      verifyTokenFromRequest.mockReturnValue({
        user: { userId: 1, username: 'testuser', role: 'user' },
        error: null,
      })

      const request = new NextRequest(`${BASE_URL}/api/auth/verify`, {
        headers: {
          Authorization: 'Bearer valid-token',
        },
      })

      const response = await verifyGET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(true)
      expect(data.user.username).toBe('testuser')
    })

    it('should reject invalid token', async () => {
      const { verifyTokenFromRequest } = await import('@/lib/token')
      // verifyTokenFromRequest is synchronous, not async
      verifyTokenFromRequest.mockReturnValue({
        user: null,
        error: new Error('Invalid token'),
      })

      const request = new NextRequest(`${BASE_URL}/api/auth/verify`, {
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      })

      const response = await verifyGET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.valid).toBe(false)
    })
  })

  describe('Protected API', () => {
    it('should allow access with valid token', async () => {
      const { verifyTokenAndGetUser } = await import('@/lib/token')
      // verifyTokenAndGetUser is async and returns full user data from database
      verifyTokenAndGetUser.mockResolvedValue({
        user: {
          id: 1,
          userId: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        error: null,
      })

      const request = new NextRequest(`${BASE_URL}/api/protected`, {
        headers: {
          Authorization: 'Bearer valid-token',
        },
      })

      const response = await protectedGET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('This is protected data')
      expect(data.user.username).toBe('testuser')
    })

    it('should reject access without token', async () => {
      const { verifyTokenAndGetUser } = await import('@/lib/token')
      // verifyTokenAndGetUser is async
      verifyTokenAndGetUser.mockResolvedValue({
        user: null,
        error: new Error('No token provided'),
      })

      const request = new NextRequest(`${BASE_URL}/api/protected`)

      const response = await protectedGET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })
  })
})
