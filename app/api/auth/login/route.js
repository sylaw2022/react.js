import { NextResponse } from 'next/server'
import { generateToken } from '@/lib/token'
import { getUserByUsername } from '@/lib/db'
import { comparePassword } from '@/lib/auth'

/**
 * OPTIONS /api/auth/login
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 * 
 * Body: { username: string, password: string }
 * Returns: { token: string, user: { userId, username, role } }
 */
export async function POST(request) {
  console.log('[API] 🔐 POST /api/auth/login - Login request received')
  
  try {
    const { username, password } = await request.json()
    console.log('[API] 📥 Login request data:', { username, password: password ? '***' : undefined })

    // Validate input
    if (!username || !password) {
      console.log('[API] ❌ Validation failed: Username or password missing')
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Get user from database
    console.log('[API] 🔍 Looking up user in database...')
    const user = getUserByUsername(username)

    if (!user) {
      console.log('[API] ❌ User not found:', username)
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Verify password
    console.log('[API] 🔐 Verifying password...')
    const passwordMatch = await comparePassword(password, user.password_hash)

    if (!passwordMatch) {
      console.log('[API] ❌ Authentication failed: Invalid password')
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    console.log('[API] ✅ Authentication successful, generating token...')
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    }, '24h') // Token expires in 24 hours

    console.log('[API] ✅ Login successful')
    console.log('[API] 📤 Sending response with token and user data')
    return NextResponse.json({
      success: true,
      token,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      expiresIn: '24h',
    }, { status: 200 })

  } catch (error) {
    console.error('[API] ❌ Login error:', error)
    return NextResponse.json(
      { error: 'Login failed', message: error.message },
      { status: 500 }
    )
  }
}

