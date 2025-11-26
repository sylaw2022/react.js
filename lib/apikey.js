import crypto from 'crypto'
import { createApiKey, getApiKeyByHash, updateApiKeyLastUsed, getUserById, deleteApiKey, deactivateApiKey } from '@/lib/db'

// Get secret key from environment
const API_KEY_SECRET = process.env.API_KEY_SECRET || process.env.JWT_SECRET || 'default-secret-key-change-in-production'

/**
 * Generate a new API key
 * @param {number} userId - User ID
 * @param {string} keyName - Optional name for the key
 * @returns {string} Generated API key
 */
export function generateApiKeyString(userId) {
  console.log('[APIKEY] 🔑 generateApiKeyString() called for user:', userId)
  
  // Generate a unique API key using crypto
  const randomBytes = crypto.randomBytes(32).toString('hex')
  const timestamp = Date.now()
  const combined = `${userId}-${timestamp}-${randomBytes}`
  
  // Create HMAC hash for the key
  const hash = crypto
    .createHmac('sha256', API_KEY_SECRET)
    .update(combined)
    .digest('hex')
  
  // Format as: ak_live_<hash>
  const apiKey = `ak_live_${hash.substring(0, 48)}`
  
  console.log('[APIKEY] ✅ API key generated')
  return apiKey
}

/**
 * Hash an API key for storage
 * @param {string} apiKey - Plain API key
 * @returns {string} Hashed API key
 */
export function hashApiKey(apiKey) {
  console.log('[APIKEY] 🔐 hashApiKey() called')
  
  const hash = crypto
    .createHmac('sha256', API_KEY_SECRET)
    .update(apiKey)
    .digest('hex')
  
  console.log('[APIKEY] ✅ API key hashed')
  return hash
}

/**
 * Create and store a new API key for a user
 * @param {number} userId - User ID
 * @param {string} keyName - Optional name for the key
 * @param {Date} expiresAt - Optional expiration date
 * @returns {Object} Created API key object with the plain key
 */
export function createUserApiKey(userId, keyName = null, expiresAt = null) {
  console.log('[APIKEY] ➕ createUserApiKey() called:', { userId, keyName })
  
  // Generate API key
  const apiKey = generateApiKeyString(userId)
  const keyHash = hashApiKey(apiKey)
  
  // Store in database
  const keyData = createApiKey({
    user_id: userId,
    key_name: keyName,
    api_key: apiKey, // Store plain key (only shown once)
    key_hash: keyHash, // Store hash for verification
    expires_at: expiresAt,
  })
  
  console.log('[APIKEY] ✅ User API key created')
  return {
    ...keyData,
    api_key: apiKey, // Return plain key (only time it's shown)
  }
}

/**
 * Verify API key and return user information
 * @param {string} apiKey - API key to verify
 * @returns {Object} { user: userObject, error: null } or { user: null, error: Error }
 */
export function verifyApiKey(apiKey) {
  console.log('[APIKEY] 🔍 verifyApiKey() called')
  
  try {
    if (!apiKey) {
      console.log('[APIKEY] ❌ No API key provided')
      return {
        user: null,
        error: new Error('No API key provided'),
      }
    }
    
    // Remove 'ak_live_' prefix if present
    const cleanKey = apiKey.replace(/^ak_live_/, '')
    const fullKey = apiKey.startsWith('ak_live_') ? apiKey : `ak_live_${cleanKey}`
    
    // Hash the provided key
    const keyHash = hashApiKey(fullKey)
    
    // Look up in database
    const apiKeyRecord = getApiKeyByHash(keyHash)
    
    if (!apiKeyRecord) {
      console.log('[APIKEY] ❌ API key not found')
      return {
        user: null,
        error: new Error('Invalid API key'),
      }
    }
    
    // Check if key is active
    if (!apiKeyRecord.is_active) {
      console.log('[APIKEY] ❌ API key is inactive')
      return {
        user: null,
        error: new Error('API key is inactive'),
      }
    }
    
    // Check expiration
    if (apiKeyRecord.expires_at) {
      const expiresAt = new Date(apiKeyRecord.expires_at)
      if (expiresAt < new Date()) {
        console.log('[APIKEY] ❌ API key has expired')
        return {
          user: null,
          error: new Error('API key has expired'),
        }
      }
    }
    
    // Update last used timestamp
    updateApiKeyLastUsed(apiKeyRecord.id)
    
    // Get user information
    const user = getUserById(apiKeyRecord.user_id)
    
    if (!user) {
      console.log('[APIKEY] ❌ User not found for API key')
      return {
        user: null,
        error: new Error('User not found'),
      }
    }
    
    // Remove password hash
    const { password_hash, ...userWithoutPassword } = user
    
    console.log('[APIKEY] ✅ API key verified successfully')
    return {
      user: userWithoutPassword,
      error: null,
    }
  } catch (error) {
    console.error('[APIKEY] ❌ Error verifying API key:', error.message)
    return {
      user: null,
      error: error,
    }
  }
}

/**
 * Extract API key from request headers
 * @param {Request} request - Next.js request object
 * @returns {string|null} API key or null if not found
 */
export function extractApiKeyFromRequest(request) {
  console.log('[APIKEY] 🔎 extractApiKeyFromRequest() called')
  
  // Try X-API-Key header first
  const xApiKey = request.headers.get('X-API-Key')
  if (xApiKey) {
    console.log('[APIKEY] ✅ API key found in X-API-Key header')
    return xApiKey
  }
  
  // Try Authorization header with Bearer
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    // Check if it looks like an API key (starts with ak_live_)
    if (token.startsWith('ak_live_')) {
      console.log('[APIKEY] ✅ API key found in Authorization header')
      return token
    }
  }
  
  // Try api-key header
  const apiKeyHeader = request.headers.get('api-key')
  if (apiKeyHeader) {
    console.log('[APIKEY] ✅ API key found in api-key header')
    return apiKeyHeader
  }
  
  console.log('[APIKEY] ❌ No API key found in request')
  return null
}

/**
 * Verify API key from request
 * @param {Request} request - Next.js request object
 * @returns {Object} { user: userObject, error: null } or { user: null, error: Error }
 */
export function verifyApiKeyFromRequest(request) {
  console.log('[APIKEY] 🛡️ verifyApiKeyFromRequest() called')
  
  const apiKey = extractApiKeyFromRequest(request)
  
  if (!apiKey) {
    return {
      user: null,
      error: new Error('No API key provided'),
    }
  }
  
  return verifyApiKey(apiKey)
}

