import { NextResponse } from 'next/server'
import { refreshToken, extractTokenFromRequest } from '@/lib/token'

/**
 * OPTIONS /api/auth/refresh
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
 * POST /api/auth/refresh
 * Refresh JWT token (get new token with extended expiration)
 * 
 * Headers: Authorization: Bearer <token>
 * Returns: { token: string, expiresIn: string }
 */
export async function POST(request) {
  console.log('[API] 🔄 POST /api/auth/refresh - Token refresh request received')
  
  try {
    const token = extractTokenFromRequest(request)

    if (!token) {
      console.log('[API] ❌ No token provided for refresh')
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    console.log('[API] ✅ Token extracted, refreshing...')
    // Generate new token with extended expiration
    const newToken = refreshToken(token, '24h')

    console.log('[API] ✅ Token refresh successful')
    console.log('[API] 📤 Sending new token')
    return NextResponse.json({
      success: true,
      token: newToken,
      expiresIn: '24h',
    }, { status: 200 })

  } catch (error) {
    console.error('[API] ❌ Token refresh failed:', error.message)
    return NextResponse.json(
      { 
        error: 'Token refresh failed',
        message: error.message 
      },
      { status: 401 }
    )
  }
}

