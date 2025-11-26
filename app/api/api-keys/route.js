import { NextResponse } from 'next/server'
import { verifyTokenAndGetUser } from '@/lib/token'
import { createUserApiKey } from '@/lib/apikey'
import { getApiKeysByUserId, deleteApiKey, deactivateApiKey } from '@/lib/db'

/**
 * OPTIONS /api/api-keys
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

/**
 * GET /api/api-keys
 * Get all API keys for the authenticated user
 */
export async function GET(request) {
  console.log('[API] 🔑 GET /api/api-keys - List API keys request received')
  
  try {
    const { user, error } = await verifyTokenAndGetUser(request)

    if (error || !user) {
      console.log('[API] ❌ Authentication failed:', error?.message)
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: error?.message || 'Authentication required'
        },
        { status: 401 }
      )
    }

    const apiKeys = getApiKeysByUserId(user.id)
    
    // Don't return the full API key, only show first 8 and last 4 characters
    const maskedKeys = apiKeys.map(key => ({
      id: key.id,
      key_name: key.key_name,
      api_key: key.api_key ? `${key.api_key.substring(0, 12)}...${key.api_key.substring(key.api_key.length - 4)}` : null,
      is_active: key.is_active,
      last_used_at: key.last_used_at,
      created_at: key.created_at,
      expires_at: key.expires_at,
    }))

    console.log('[API] ✅ API keys retrieved:', apiKeys.length)
    return NextResponse.json({
      success: true,
      apiKeys: maskedKeys,
    }, { status: 200 })

  } catch (error) {
    console.error('[API] ❌ Error retrieving API keys:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/api-keys
 * Create a new API key for the authenticated user
 */
export async function POST(request) {
  console.log('[API] ➕ POST /api/api-keys - Create API key request received')
  
  try {
    const { user, error } = await verifyTokenAndGetUser(request)

    if (error || !user) {
      console.log('[API] ❌ Authentication failed:', error?.message)
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: error?.message || 'Authentication required'
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { key_name, expires_at } = body

    // Create API key
    const apiKeyData = createUserApiKey(
      user.id,
      key_name || null,
      expires_at ? new Date(expires_at) : null
    )

    console.log('[API] ✅ API key created successfully')
    return NextResponse.json({
      success: true,
      message: 'API key created successfully',
      apiKey: {
        id: apiKeyData.id,
        key_name: apiKeyData.key_name,
        api_key: apiKeyData.api_key, // Full key shown only once
        created_at: apiKeyData.created_at,
        expires_at: apiKeyData.expires_at,
      },
      warning: 'Save this API key now. You will not be able to see it again.',
    }, { status: 201 })

  } catch (error) {
    console.error('[API] ❌ Error creating API key:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/api-keys
 * Delete or deactivate an API key
 */
export async function DELETE(request) {
  console.log('[API] 🗑️ DELETE /api/api-keys - Delete API key request received')
  
  try {
    const { user, error } = await verifyTokenAndGetUser(request)

    if (error || !user) {
      console.log('[API] ❌ Authentication failed:', error?.message)
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: error?.message || 'Authentication required'
        },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const keyId = parseInt(searchParams.get('id'))
    const action = searchParams.get('action') || 'delete' // 'delete' or 'deactivate'

    if (!keyId) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      )
    }

    let success = false
    if (action === 'deactivate') {
      success = deactivateApiKey(keyId, user.id)
    } else {
      success = deleteApiKey(keyId, user.id)
    }

    if (!success) {
      return NextResponse.json(
        { error: 'API key not found or access denied' },
        { status: 404 }
      )
    }

    console.log('[API] ✅ API key', action === 'deactivate' ? 'deactivated' : 'deleted')
    return NextResponse.json({
      success: true,
      message: `API key ${action === 'deactivate' ? 'deactivated' : 'deleted'} successfully`,
    }, { status: 200 })

  } catch (error) {
    console.error('[API] ❌ Error deleting API key:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

