import { NextResponse } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/token'

/**
 * OPTIONS /api/auth/verify
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

/**
 * GET /api/auth/verify
 * Verify JWT token and return user information
 * 
 * Headers: Authorization: Bearer <token>
 * Returns: { user: { userId, username, role }, valid: true }
 */
export async function GET(request) {
  console.log('[API] 🔍 GET /api/auth/verify - Token verification request received')
  
  try {
    const { user, error } = verifyTokenFromRequest(request)

    if (error) {
      console.log('[API] ❌ Token verification failed:', error.message)
      return NextResponse.json(
        { 
          valid: false,
          error: error.message 
        },
        { status: 401 }
      )
    }

    console.log('[API] ✅ Token verification successful')
    console.log('[API] 📤 Sending verified user data')
    return NextResponse.json({
      valid: true,
      user: {
        userId: user.userId,
        username: user.username,
        role: user.role,
      },
    }, { status: 200 })

  } catch (error) {
    console.error('[API] ❌ Token verification error:', error)
    return NextResponse.json(
      { 
        valid: false,
        error: 'Token verification failed',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

