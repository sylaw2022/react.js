import { NextResponse } from 'next/server'
import { verifyTokenFromRequest, verifyTokenAndGetUser } from '@/lib/token'

/**
 * OPTIONS /api/protected
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

/**
 * GET /api/protected
 * Protected endpoint - requires valid JWT token
 * 
 * Headers: Authorization: Bearer <token>
 * Returns: { message: string, user: { userId, username, role } }
 */
export async function GET(request) {
  console.log('[API] 🛡️ GET /api/protected - Protected endpoint request received')
  
  try {
    // Use verifyTokenAndGetUser to get full user information from database
    const { user, error } = await verifyTokenAndGetUser(request)

    if (error) {
      console.log('[API] ❌ Authorization failed:', error.message)
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: error.message 
        },
        { status: 401 }
      )
    }

    console.log('[API] ✅ Authorization successful')
    console.log('[API] 📤 Sending protected data to user:', { id: user.id, username: user.username, email: user.email, role: user.role })
    return NextResponse.json({
      message: 'This is protected data',
      user: {
        id: user.id,
        userId: user.id, // Keep for backward compatibility
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      timestamp: new Date().toISOString(),
    }, { status: 200 })

  } catch (error) {
    console.error('[API] ❌ Authorization error:', error)
    return NextResponse.json(
      { 
        error: 'Authorization failed',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/protected
 * Protected endpoint - requires valid JWT token
 */
export async function POST(request) {
  console.log('[API] 🛡️ POST /api/protected - Protected POST endpoint request received')
  
  try {
    // Use verifyTokenAndGetUser to get full user information from database
    const { user, error } = await verifyTokenAndGetUser(request)

    if (error) {
      console.log('[API] ❌ Authorization failed:', error.message)
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: error.message 
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('[API] ✅ Authorization successful')
    console.log('[API] 📥 Request body received:', body)
    console.log('[API] 📤 Sending protected POST response to user:', { id: user.id, username: user.username, email: user.email, role: user.role })

    return NextResponse.json({
      message: 'Protected POST endpoint',
      user: {
        id: user.id,
        userId: user.id, // Keep for backward compatibility
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      receivedData: body,
      timestamp: new Date().toISOString(),
    }, { status: 200 })

  } catch (error) {
    console.error('[API] ❌ Authorization error:', error)
    return NextResponse.json(
      { 
        error: 'Authorization failed',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

