import crypto from 'crypto'

// Get encryption key from environment
// Should be a 64-character hex string (32 bytes = 256 bits)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'default-encryption-key-change-in-production-please-use-strong-key'
const ALGORITHM = 'aes-256-cbc'
const KEY_LENGTH = 32 // 32 bytes = 256 bits for AES-256
const IV_LENGTH = 16 // 16 bytes for AES block size

/**
 * Generate a random encryption key
 * @param {number} length - Key length in bytes (default: 32 for AES-256)
 * @returns {string} Hexadecimal string representation of the key
 */
export function generateEncryptionKey(length = KEY_LENGTH) {
  console.log('[ENCRYPTION] 🔑 generateEncryptionKey() called')
  
  const key = crypto.randomBytes(length).toString('hex')
  console.log('[ENCRYPTION] ✅ Encryption key generated')
  return key
}

/**
 * Derive encryption key from password using PBKDF2
 * @param {string} password - Password to derive key from
 * @param {Buffer} salt - Salt for key derivation (optional, will generate if not provided)
 * @param {number} iterations - Number of iterations (default: 100000)
 * @param {number} keyLength - Key length in bytes (default: 32)
 * @returns {Object} { key: string, salt: string } - Derived key and salt
 */
export function deriveKeyFromPassword(password, salt = null, iterations = 100000, keyLength = KEY_LENGTH) {
  console.log('[ENCRYPTION] 🔐 deriveKeyFromPassword() called')
  
  const saltBuffer = salt || crypto.randomBytes(16)
  const key = crypto.pbkdf2Sync(
    password,
    saltBuffer,
    iterations,
    keyLength,
    'sha256'
  )
  
  console.log('[ENCRYPTION] ✅ Key derived from password')
  return {
    key: key.toString('hex'),
    salt: saltBuffer.toString('hex'),
    iterations,
  }
}

/**
 * Get encryption key (from env or generate fallback)
 * @returns {Buffer} Encryption key as Buffer
 */
function getEncryptionKey() {
  // If ENCRYPTION_KEY is a hex string, use it directly
  // Otherwise, derive a key from the string
  if (ENCRYPTION_KEY.length === 64 && /^[0-9a-f]+$/i.test(ENCRYPTION_KEY)) {
    // It's a hex string, use it directly
    return Buffer.from(ENCRYPTION_KEY, 'hex')
  } else {
    // Derive a key from the string using SHA-256
    return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest()
  }
}

/**
 * Encrypt data using AES-256-CBC
 * @param {string} text - Plain text to encrypt
 * @param {string} customKey - Optional custom encryption key (hex string)
 * @returns {Object} { iv: string, encrypted: string } - IV and encrypted data
 */
export function encrypt(text, customKey = null) {
  console.log('[ENCRYPTION] 🔒 encrypt() called')
  
  if (!text) {
    throw new Error('Text to encrypt cannot be empty')
  }
  
  try {
    // Generate random IV for each encryption
    const iv = crypto.randomBytes(IV_LENGTH)
    
    // Use custom key if provided, otherwise use default
    const key = customKey 
      ? (customKey.length === 64 && /^[0-9a-f]+$/i.test(customKey) 
          ? Buffer.from(customKey, 'hex')
          : crypto.createHash('sha256').update(customKey).digest())
      : getEncryptionKey()
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    console.log('[ENCRYPTION] ✅ Data encrypted successfully')
    return {
      iv: iv.toString('hex'),
      encrypted: encrypted,
      algorithm: ALGORITHM,
    }
  } catch (error) {
    console.error('[ENCRYPTION] ❌ Encryption failed:', error.message)
    throw new Error(`Encryption failed: ${error.message}`)
  }
}

/**
 * Decrypt data using AES-256-CBC
 * @param {Object} encryptedData - { iv: string, encrypted: string }
 * @param {string} customKey - Optional custom encryption key (hex string)
 * @returns {string} Decrypted plain text
 */
export function decrypt(encryptedData, customKey = null) {
  console.log('[ENCRYPTION] 🔓 decrypt() called')
  
  if (!encryptedData || !encryptedData.iv || !encryptedData.encrypted) {
    throw new Error('Invalid encrypted data format. Expected { iv: string, encrypted: string }')
  }
  
  try {
    // Convert IV from hex
    const iv = Buffer.from(encryptedData.iv, 'hex')
    
    // Use custom key if provided, otherwise use default
    const key = customKey 
      ? (customKey.length === 64 && /^[0-9a-f]+$/i.test(customKey) 
          ? Buffer.from(customKey, 'hex')
          : crypto.createHash('sha256').update(customKey).digest())
      : getEncryptionKey()
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    console.log('[ENCRYPTION] ✅ Data decrypted successfully')
    return decrypted
  } catch (error) {
    console.error('[ENCRYPTION] ❌ Decryption failed:', error.message)
    throw new Error(`Decryption failed: ${error.message}`)
  }
}

/**
 * Encrypt an object (converts to JSON first)
 * @param {Object} data - Object to encrypt
 * @param {string} customKey - Optional custom encryption key
 * @returns {Object} { iv: string, encrypted: string } - Encrypted object
 */
export function encryptObject(data, customKey = null) {
  console.log('[ENCRYPTION] 🔒 encryptObject() called')
  
  try {
    const jsonString = JSON.stringify(data)
    return encrypt(jsonString, customKey)
  } catch (error) {
    console.error('[ENCRYPTION] ❌ Object encryption failed:', error.message)
    throw new Error(`Object encryption failed: ${error.message}`)
  }
}

/**
 * Decrypt an object (converts from JSON after decryption)
 * @param {Object} encryptedData - { iv: string, encrypted: string }
 * @param {string} customKey - Optional custom encryption key
 * @returns {Object} Decrypted object
 */
export function decryptObject(encryptedData, customKey = null) {
  console.log('[ENCRYPTION] 🔓 decryptObject() called')
  
  try {
    const decryptedString = decrypt(encryptedData, customKey)
    return JSON.parse(decryptedString)
  } catch (error) {
    console.error('[ENCRYPTION] ❌ Object decryption failed:', error.message)
    throw new Error(`Object decryption failed: ${error.message}`)
  }
}

/**
 * Hash data using SHA-256 (one-way, cannot be decrypted)
 * @param {string} data - Data to hash
 * @returns {string} Hexadecimal hash
 */
export function hash(data) {
  console.log('[ENCRYPTION] 🔐 hash() called')
  
  if (!data) {
    throw new Error('Data to hash cannot be empty')
  }
  
  const hash = crypto.createHash('sha256').update(data).digest('hex')
  console.log('[ENCRYPTION] ✅ Data hashed successfully')
  return hash
}

/**
 * Create HMAC (Hash-based Message Authentication Code)
 * @param {string} data - Data to create HMAC for
 * @param {string} secret - Secret key for HMAC
 * @returns {string} Hexadecimal HMAC
 */
export function createHMAC(data, secret) {
  console.log('[ENCRYPTION] 🔐 createHMAC() called')
  
  if (!data || !secret) {
    throw new Error('Data and secret are required for HMAC')
  }
  
  const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex')
  console.log('[ENCRYPTION] ✅ HMAC created successfully')
  return hmac
}

/**
 * Verify HMAC
 * @param {string} data - Original data
 * @param {string} secret - Secret key
 * @param {string} hmac - HMAC to verify
 * @returns {boolean} True if HMAC is valid
 */
export function verifyHMAC(data, secret, hmac) {
  console.log('[ENCRYPTION] 🔍 verifyHMAC() called')
  
  const expectedHMAC = createHMAC(data, secret)
  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedHMAC, 'hex'),
    Buffer.from(hmac, 'hex')
  )
  
  console.log('[ENCRYPTION]', isValid ? '✅ HMAC verified' : '❌ HMAC verification failed')
  return isValid
}

/**
 * Encrypt sensitive fields in an object
 * @param {Object} data - Object with data to encrypt
 * @param {Array<string>} fields - Array of field names to encrypt
 * @param {string} customKey - Optional custom encryption key
 * @returns {Object} Object with specified fields encrypted
 */
export function encryptFields(data, fields, customKey = null) {
  console.log('[ENCRYPTION] 🔒 encryptFields() called')
  
  const encrypted = { ...data }
  
  for (const field of fields) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      const encryptedData = encrypt(encrypted[field], customKey)
      encrypted[field] = JSON.stringify(encryptedData)
    }
  }
  
  console.log('[ENCRYPTION] ✅ Fields encrypted successfully')
  return encrypted
}

/**
 * Decrypt sensitive fields in an object
 * @param {Object} data - Object with encrypted fields
 * @param {Array<string>} fields - Array of field names to decrypt
 * @param {string} customKey - Optional custom encryption key
 * @returns {Object} Object with specified fields decrypted
 */
export function decryptFields(data, fields, customKey = null) {
  console.log('[ENCRYPTION] 🔓 decryptFields() called')
  
  const decrypted = { ...data }
  
  for (const field of fields) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      try {
        const encryptedData = JSON.parse(decrypted[field])
        decrypted[field] = decrypt(encryptedData, customKey)
      } catch (error) {
        // If parsing fails, field might not be encrypted, leave as is
        console.warn(`[ENCRYPTION] ⚠️ Field ${field} might not be encrypted`)
      }
    }
  }
  
  console.log('[ENCRYPTION] ✅ Fields decrypted successfully')
  return decrypted
}

/**
 * Generate a secure random string
 * @param {number} length - Length of the string in bytes (default: 32)
 * @param {string} encoding - Encoding format ('hex', 'base64', 'base64url') (default: 'hex')
 * @returns {string} Random string
 */
export function generateRandomString(length = 32, encoding = 'hex') {
  console.log('[ENCRYPTION] 🎲 generateRandomString() called')
  
  const randomBytes = crypto.randomBytes(length)
  
  let result
  switch (encoding) {
    case 'hex':
      result = randomBytes.toString('hex')
      break
    case 'base64':
      result = randomBytes.toString('base64')
      break
    case 'base64url':
      result = randomBytes.toString('base64url')
      break
    default:
      result = randomBytes.toString('hex')
  }
  
  console.log('[ENCRYPTION] ✅ Random string generated')
  return result
}

/**
 * Compare two strings in constant time (prevents timing attacks)
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} True if strings are equal
 */
export function constantTimeCompare(a, b) {
  if (a.length !== b.length) {
    return false
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(a, 'utf8'),
    Buffer.from(b, 'utf8')
  )
}

// ============================================================================
// PER-USER ENCRYPTION KEY FUNCTIONS
// ============================================================================

/**
 * Derive a per-user encryption key from master key and user ID
 * This creates a unique key for each user without storing it
 * @param {number|string} userId - User ID
 * @param {string} masterKey - Master encryption key (optional, uses default if not provided)
 * @returns {string} Hexadecimal user-specific encryption key
 */
export function deriveUserEncryptionKey(userId, masterKey = null) {
  console.log('[ENCRYPTION] 🔑 deriveUserEncryptionKey() called for user:', userId)
  
  const master = masterKey || getEncryptionKey()
  const userKey = crypto
    .createHmac('sha256', master)
    .update(`user-encryption-${userId}`)
    .digest('hex')
  
  console.log('[ENCRYPTION] ✅ User encryption key derived')
  return userKey
}

/**
 * Generate a random encryption key for a specific user
 * This creates a unique key that should be stored (encrypted) in the database
 * @param {number} userId - User ID
 * @returns {string} Hexadecimal user-specific encryption key
 */
export function generateUserEncryptionKey(userId) {
  console.log('[ENCRYPTION] 🔑 generateUserEncryptionKey() called for user:', userId)
  
  // Generate unique key using user ID + random data
  const randomData = crypto.randomBytes(32).toString('hex')
  const userKey = crypto
    .createHmac('sha256', randomData)
    .update(`user-${userId}-${Date.now()}`)
    .digest('hex')
  
  console.log('[ENCRYPTION] ✅ User encryption key generated')
  return userKey
}

/**
 * Encrypt data for a specific user using derived key
 * @param {number|string} userId - User ID
 * @param {string} text - Plain text to encrypt
 * @param {string} masterKey - Master encryption key (optional)
 * @returns {Object} { iv: string, encrypted: string } - Encrypted data
 */
export function encryptForUser(userId, text, masterKey = null) {
  console.log('[ENCRYPTION] 🔒 encryptForUser() called for user:', userId)
  
  const userKey = deriveUserEncryptionKey(userId, masterKey)
  return encrypt(text, userKey)
}

/**
 * Decrypt data for a specific user using derived key
 * @param {number|string} userId - User ID
 * @param {Object} encryptedData - { iv: string, encrypted: string }
 * @param {string} masterKey - Master encryption key (optional)
 * @returns {string} Decrypted plain text
 */
export function decryptForUser(userId, encryptedData, masterKey = null) {
  console.log('[ENCRYPTION] 🔓 decryptForUser() called for user:', userId)
  
  const userKey = deriveUserEncryptionKey(userId, masterKey)
  return decrypt(encryptedData, userKey)
}

/**
 * Encrypt an object for a specific user using derived key
 * @param {number|string} userId - User ID
 * @param {Object} data - Object to encrypt
 * @param {string} masterKey - Master encryption key (optional)
 * @returns {Object} { iv: string, encrypted: string } - Encrypted object
 */
export function encryptObjectForUser(userId, data, masterKey = null) {
  console.log('[ENCRYPTION] 🔒 encryptObjectForUser() called for user:', userId)
  
  const userKey = deriveUserEncryptionKey(userId, masterKey)
  return encryptObject(data, userKey)
}

/**
 * Decrypt an object for a specific user using derived key
 * @param {number|string} userId - User ID
 * @param {Object} encryptedData - { iv: string, encrypted: string }
 * @param {string} masterKey - Master encryption key (optional)
 * @returns {Object} Decrypted object
 */
export function decryptObjectForUser(userId, encryptedData, masterKey = null) {
  console.log('[ENCRYPTION] 🔓 decryptObjectForUser() called for user:', userId)
  
  const userKey = deriveUserEncryptionKey(userId, masterKey)
  return decryptObject(encryptedData, userKey)
}

/**
 * Encrypt data using a stored user encryption key
 * Use this when you have per-user keys stored in the database
 * @param {string} userEncryptionKey - User's encryption key (hex string)
 * @param {string} text - Plain text to encrypt
 * @returns {Object} { iv: string, encrypted: string } - Encrypted data
 */
export function encryptWithUserKey(userEncryptionKey, text) {
  console.log('[ENCRYPTION] 🔒 encryptWithUserKey() called')
  
  return encrypt(text, userEncryptionKey)
}

/**
 * Decrypt data using a stored user encryption key
 * Use this when you have per-user keys stored in the database
 * @param {string} userEncryptionKey - User's encryption key (hex string)
 * @param {Object} encryptedData - { iv: string, encrypted: string }
 * @returns {string} Decrypted plain text
 */
export function decryptWithUserKey(userEncryptionKey, encryptedData) {
  console.log('[ENCRYPTION] 🔓 decryptWithUserKey() called')
  
  return decrypt(encryptedData, userEncryptionKey)
}

/**
 * Encrypt a user's encryption key with the master key for storage
 * @param {string} userKey - User's plain encryption key
 * @param {string} masterKey - Master encryption key (optional)
 * @returns {Object} { iv: string, encrypted: string } - Encrypted user key
 */
export function encryptUserKeyForStorage(userKey, masterKey = null) {
  console.log('[ENCRYPTION] 🔐 encryptUserKeyForStorage() called')
  
  const master = masterKey ? 
    (masterKey.length === 64 && /^[0-9a-f]+$/i.test(masterKey) 
      ? Buffer.from(masterKey, 'hex')
      : crypto.createHash('sha256').update(masterKey).digest())
    : getEncryptionKey()
  
  return encrypt(userKey, master.toString('hex'))
}

/**
 * Decrypt a user's encryption key from storage
 * @param {Object} encryptedUserKey - { iv: string, encrypted: string }
 * @param {string} masterKey - Master encryption key (optional)
 * @returns {string} Decrypted user encryption key
 */
export function decryptUserKeyFromStorage(encryptedUserKey, masterKey = null) {
  console.log('[ENCRYPTION] 🔓 decryptUserKeyFromStorage() called')
  
  const master = masterKey ? 
    (masterKey.length === 64 && /^[0-9a-f]+$/i.test(masterKey) 
      ? Buffer.from(masterKey, 'hex')
      : crypto.createHash('sha256').update(masterKey).digest())
    : getEncryptionKey()
  
  return decrypt(encryptedUserKey, master.toString('hex'))
}

