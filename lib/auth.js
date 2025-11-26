import bcrypt from 'bcryptjs'

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  console.log('[AUTH] 🔐 hashPassword() called')
  
  try {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('[AUTH] ✅ Password hashed successfully')
    return hash
  } catch (error) {
    console.error('[AUTH] ❌ Password hashing failed:', error.message)
    throw new Error('Password hashing failed')
  }
}

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export async function comparePassword(password, hash) {
  console.log('[AUTH] 🔍 comparePassword() called')
  
  try {
    const match = await bcrypt.compare(password, hash)
    console.log('[AUTH]', match ? '✅ Password matches' : '❌ Password does not match')
    return match
  } catch (error) {
    console.error('[AUTH] ❌ Password comparison failed:', error.message)
    throw new Error('Password comparison failed')
  }
}

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateUsername(username) {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'Username is required' }
  }
  
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' }
  }
  
  if (username.length > 30) {
    return { valid: false, error: 'Username must be less than 30 characters' }
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' }
  }
  
  return { valid: true }
}

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' }
  }
  
  return { valid: true }
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validatePassword(password) {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' }
  }
  
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' }
  }
  
  if (password.length > 100) {
    return { valid: false, error: 'Password must be less than 100 characters' }
  }
  
  return { valid: true }
}

