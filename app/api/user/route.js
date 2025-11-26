import { NextResponse } from 'next/server'
import { verifyTokenAndGetUser } from '@/lib/token'

/**
 * OPTIONS /api/user
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
 * GET /api/user
 * Get current user information by validating token and retrieving from database
 * 
 * Headers: Authorization: Bearer <token>
 * Returns: { user: { id, username, email, role, created_at, updated_at } }
 */
export async function GET(request) {
  console.log('[API] 👤 GET /api/user - User information request received')
  
  try {
    const { user, error } = await verifyTokenAndGetUser(request)

    if (error) {
      console.log('[API] ❌ Token validation or user retrieval failed:', error.message)
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: error.message 
        },
        { status: 401 }
      )
    }

    console.log('[API] ✅ User information retrieved successfully')
    console.log('[API] 📤 Sending user data:', { id: user.id, username: user.username, email: user.email, role: user.role })
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      timestamp: new Date().toISOString(),
    }, { status: 200 })

  } catch (error) {
    console.error('[API] ❌ Error retrieving user information:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

