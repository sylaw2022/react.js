import { NextResponse } from 'next/server'
import { verifyApiKeyFromRequest } from '@/lib/apikey'

/**
 * OPTIONS /api/api-keys/test
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, api-key',
    },
  })
}

/**
 * GET /api/api-keys/test
 * Test an API key
 */
export async function GET(request) {
  console.log('[API] 🧪 GET /api/api-keys/test - Test API key request received')
  
  try {
    const { user, error } = verifyApiKeyFromRequest(request)

    if (error || !user) {
      console.log('[API] ❌ API key verification failed:', error?.message)
      return NextResponse.json(
        { 
          valid: false,
          error: error?.message || 'Invalid API key'
        },
        { status: 401 }
      )
    }

    console.log('[API] ✅ API key verified successfully')
    return NextResponse.json({
      valid: true,
      message: 'API key is valid',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
    }, { status: 200 })

  } catch (error) {
    console.error('[API] ❌ Error testing API key:', error)
    return NextResponse.json(
      { 
        valid: false,
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/api-keys/test
 * Test an API key (alternative method)
 */
export async function POST(request) {
  console.log('[API] 🧪 POST /api/api-keys/test - Test API key request received')
  
  try {
    const { user, error } = verifyApiKeyFromRequest(request)

    if (error || !user) {
      console.log('[API] ❌ API key verification failed:', error?.message)
      return NextResponse.json(
        { 
          valid: false,
          error: error?.message || 'Invalid API key'
        },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    
    console.log('[API] ✅ API key verified successfully')
    return NextResponse.json({
      valid: true,
      message: 'API key is valid',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      receivedData: body,
      timestamp: new Date().toISOString(),
    }, { status: 200 })

  } catch (error) {
    console.error('[API] ❌ Error testing API key:', error)
    return NextResponse.json(
      { 
        valid: false,
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

