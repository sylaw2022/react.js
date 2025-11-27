import jwt from 'jsonwebtoken'

// Get secret key from environment
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production'

/**
 * Generate JWT token for a user
 * @param {Object} payload - User data to include in token
 * @param {string} payload.userId - User ID
 * @param {string} payload.username - Username
 * @param {string} payload.role - User role (optional)
 * @param {string} expiresIn - Token expiration (default: '24h')
 * @returns {string} JWT token
 */
export function generateToken(payload, expiresIn = '24h') {
  console.log('[TOKEN] 🔑 generateToken() called')
  console.log('[TOKEN] 📥 Input payload:', { userId: payload.userId, username: payload.username, role: payload.role, expiresIn })
  
  try {
    const token = jwt.sign(
      {
        userId: payload.userId,
        username: payload.username,
        role: payload.role || 'user',
        ...payload, // Include any additional payload data
      },
      JWT_SECRET,
      {
        expiresIn,
        issuer: 'react-app',
        audience: 'react-app-users',
      }
    )
    
    console.log('[TOKEN] ✅ Token generated successfully')
    console.log('[TOKEN] 📤 Token (first 50 chars):', token.substring(0, 50) + '...')
    return token
  } catch (error) {
    console.error('[TOKEN] ❌ Token generation failed:', error.message)
    throw new Error(`Token generation failed: ${error.message}`)
  }
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyToken(token) {
  console.log('[TOKEN] 🔍 verifyToken() called')
  console.log('[TOKEN] 📥 Input token (first 50 chars):', token ? token.substring(0, 50) + '...' : 'null')
  
  try {
    if (!token) {
      console.error('[TOKEN] ❌ No token provided')
      throw new Error('No token provided')
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '')
    console.log('[TOKEN] 🧹 Cleaned token (first 50 chars):', cleanToken.substring(0, 50) + '...')
    
    const decoded = jwt.verify(cleanToken, JWT_SECRET, {
      issuer: 'react-app',
      audience: 'react-app-users',
    })
    
    console.log('[TOKEN] ✅ Token verified successfully')
    console.log('[TOKEN] 📤 Decoded payload:', { userId: decoded.userId, username: decoded.username, role: decoded.role })
    return decoded
  } catch (error) {
    console.error('[TOKEN] ❌ Token verification failed:', error.name, error.message)
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token')
    } else if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired')
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not active yet')
    }
    throw new Error(`Token verification failed: ${error.message}`)
  }
}

/**
 * Decode token without verification (for inspection only)
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload (not verified)
 */
export function decodeToken(token) {
  try {
    const cleanToken = token.replace(/^Bearer\s+/i, '')
    return jwt.decode(cleanToken)
  } catch (error) {
    throw new Error(`Token decode failed: ${error.message}`)
  }
}

/**
 * Refresh token (generate new token with same payload)
 * @param {string} token - Existing token
 * @param {string} expiresIn - New expiration (default: '24h')
 * @returns {string} New JWT token
 */
export function refreshToken(token, expiresIn = '24h') {
  console.log('[TOKEN] 🔄 refreshToken() called')
  console.log('[TOKEN] 📥 Input token (first 50 chars):', token ? token.substring(0, 50) + '...' : 'null')
  console.log('[TOKEN] 📥 New expiration:', expiresIn)
  
  try {
    const decoded = verifyToken(token)
    console.log('[TOKEN] ✅ Original token verified, extracting payload')
    
    // Remove exp and iat from decoded token
    const { exp, iat, ...payload } = decoded
    console.log('[TOKEN] 📦 Extracted payload:', { userId: payload.userId, username: payload.username, role: payload.role })
    
    // Generate new token
    const newToken = generateToken(payload, expiresIn)
    console.log('[TOKEN] ✅ New token generated for refresh')
    return newToken
  } catch (error) {
    console.error('[TOKEN] ❌ Token refresh failed:', error.message)
    throw new Error(`Token refresh failed: ${error.message}`)
  }
}

/**
 * Extract token from request headers
 * @param {Request} request - Next.js request object
 * @returns {string|null} Token or null if not found
 */
export function extractTokenFromRequest(request) {
  console.log('[TOKEN] 🔎 extractTokenFromRequest() called')
  
  // Try Authorization header first
  const authHeader = request.headers.get('Authorization')
  console.log('[TOKEN] 🔍 Checking Authorization header:', authHeader ? 'Found' : 'Not found')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    console.log('[TOKEN] ✅ Token extracted from Authorization header')
    console.log('[TOKEN] 📤 Token (first 50 chars):', token.substring(0, 50) + '...')
    return token
  }
  
  // Try X-Auth-Token header
  const xAuthToken = request.headers.get('X-Auth-Token')
  console.log('[TOKEN] 🔍 Checking X-Auth-Token header:', xAuthToken ? 'Found' : 'Not found')
  if (xAuthToken) {
    console.log('[TOKEN] ✅ Token extracted from X-Auth-Token header')
    return xAuthToken
  }
  
  // Try cookie
  const cookieHeader = request.headers.get('Cookie')
  console.log('[TOKEN] 🔍 Checking Cookie header:', cookieHeader ? 'Found' : 'Not found')
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {})
    
    if (cookies.token) {
      console.log('[TOKEN] ✅ Token extracted from Cookie')
      return cookies.token
    }
  }
  
  console.log('[TOKEN] ❌ No token found in request')
  return null
}

/**
 * Middleware function to verify token from request
 * @param {Request} request - Next.js request object
 * @returns {Object} { user: decodedToken, error: null } or { user: null, error: Error }
 */
export function verifyTokenFromRequest(request) {
  console.log('[TOKEN] 🛡️ verifyTokenFromRequest() called')
  
  try {
    const token = extractTokenFromRequest(request)
    
    if (!token) {
      console.log('[TOKEN] ❌ No token provided in request')
      return {
        user: null,
        error: new Error('No token provided'),
      }
    }
    
    const decoded = verifyToken(token)
    
    console.log('[TOKEN] ✅ Token verified from request')
    console.log('[TOKEN] 📤 Returning user:', { userId: decoded.userId, username: decoded.username, role: decoded.role })
    return {
      user: decoded,
      error: null,
    }
  } catch (error) {
    console.error('[TOKEN] ❌ Token verification from request failed:', error.message)
    return {
      user: null,
      error: error,
    }
  }
}

/**
 * Verify token and retrieve full user information from database
 * @param {Request} request - Next.js request object
 * @returns {Promise<Object>} { user: fullUserData, error: null } or { user: null, error: Error }
 */
export async function verifyTokenAndGetUser(request) {
  console.log('[TOKEN] 🔍 verifyTokenAndGetUser() called')
  
  try {
    // First verify the token
    const { user: tokenUser, error: tokenError } = verifyTokenFromRequest(request)
    
    if (tokenError || !tokenUser) {
      console.log('[TOKEN] ❌ Token validation failed:', tokenError?.message)
      return {
        user: null,
        error: tokenError || new Error('Token validation failed'),
      }
    }
    
    // Import database functions dynamically to avoid circular dependencies
    const { getUserById } = await import('@/lib/db')
    
    // Retrieve full user information from database
    const fullUser = getUserById(tokenUser.userId)
    
    if (!fullUser) {
      console.log('[TOKEN] ❌ User not found in database:', tokenUser.userId)
      return {
        user: null,
        error: new Error('User not found'),
      }
    }
    
    // Remove sensitive information
    const { password_hash, ...userWithoutPassword } = fullUser
    
    console.log('[TOKEN] ✅ Token validated and user retrieved')
    console.log('[TOKEN] 📤 Returning user:', { id: userWithoutPassword.id, username: userWithoutPassword.username, email: userWithoutPassword.email, role: userWithoutPassword.role })
    
    return {
      user: userWithoutPassword,
      error: null,
    }
  } catch (error) {
    console.error('[TOKEN] ❌ Error verifying token and getting user:', error.message)
    return {
      user: null,
      error: error,
    }
  }
}

