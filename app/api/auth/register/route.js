import { NextResponse } from 'next/server'
import { generateToken } from '@/lib/token'
import { createUser, getUserByUsername, getUserByEmail } from '@/lib/db'
import { hashPassword, validateUsername, validateEmail, validatePassword } from '@/lib/auth'

/**
 * OPTIONS /api/auth/register
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
 * POST /api/auth/register
 * Register a new user
 * 
 * Body: { username: string, email?: string, password: string, role?: string }
 * Returns: { success: true, token: string, user: { userId, username, role } }
 */
export async function POST(request) {
  console.log('[API] 📝 POST /api/auth/register - Registration request received')
  
  try {
    const { username, email, password, role } = await request.json()
    console.log('[API] 📥 Registration data:', { username, email, password: password ? '***' : undefined, role })

    // Validate input
    if (!username || !password) {
      console.log('[API] ❌ Validation failed: Username or password missing')
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Validate username
    const usernameValidation = validateUsername(username)
    if (!usernameValidation.valid) {
      console.log('[API] ❌ Username validation failed:', usernameValidation.error)
      return NextResponse.json(
        { error: usernameValidation.error },
        { status: 400 }
      )
    }

    // Validate email if provided
    if (email) {
      const emailValidation = validateEmail(email)
      if (!emailValidation.valid) {
        console.log('[API] ❌ Email validation failed:', emailValidation.error)
        return NextResponse.json(
          { error: emailValidation.error },
          { status: 400 }
        )
      }
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      console.log('[API] ❌ Password validation failed:', passwordValidation.error)
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUser = getUserByUsername(username)
    if (existingUser) {
      console.log('[API] ❌ Username already exists:', username)
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = getUserByEmail(email)
      if (existingEmail) {
        console.log('[API] ❌ Email already exists:', email)
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        )
      }
    }

    // Hash password
    console.log('[API] 🔐 Hashing password...')
    const password_hash = await hashPassword(password)

    // Create user
    console.log('[API] ➕ Creating user in database...')
    const user = createUser({
      username,
      email: email || null,
      password_hash,
      role: role || 'user',
    })

    console.log('[API] ✅ User created successfully, generating token...')
    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    }, '24h')

    console.log('[API] ✅ Registration successful')
    console.log('[API] 📤 Sending response with token and user data')
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      expiresIn: '24h',
    }, { status: 201 })

  } catch (error) {
    console.error('[API] ❌ Registration error:', error)
    
    // Handle unique constraint violations
    if (error.message && error.message.includes('UNIQUE constraint')) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Registration failed', message: error.message },
      { status: 500 }
    )
  }
}


