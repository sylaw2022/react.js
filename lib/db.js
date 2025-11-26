import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Database file path
const dbPath = join(__dirname, '..', 'data', 'users.db')
const dbDir = join(__dirname, '..', 'data')

// Ensure data directory exists
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
  console.log('[DB] 📁 Created data directory')
}

// Initialize database connection
let db = null

/**
 * Get database connection (singleton pattern)
 * @returns {Database} SQLite database instance
 */
export function getDb() {
  if (!db) {
    console.log('[DB] 🔌 Connecting to SQLite database:', dbPath)
    db = new Database(dbPath)
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON')
    
    // Initialize schema
    initializeSchema()
    
    console.log('[DB] ✅ Database connected successfully')
  }
  return db
}

/**
 * Initialize database schema
 */
function initializeSchema() {
  console.log('[DB] 📋 Initializing database schema...')
  
  const db = getDb()
  
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Create index on username for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_username ON users(username)
  `)
  
  // Create index on email for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_email ON users(email)
  `)
  
  // Create API keys table
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      key_name TEXT,
      api_key TEXT UNIQUE NOT NULL,
      key_hash TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      last_used_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)
  
  // Create index on api_key for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_api_key ON api_keys(api_key)
  `)
  
  // Create index on key_hash for verification
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_key_hash ON api_keys(key_hash)
  `)
  
  // Create index on user_id for user lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_api_key_user_id ON api_keys(user_id)
  `)
  
  console.log('[DB] ✅ Schema initialized')
}

/**
 * Close database connection
 */
export function closeDb() {
  if (db) {
    console.log('[DB] 🔌 Closing database connection')
    db.close()
    db = null
  }
}

/**
 * Get user by username
 * @param {string} username - Username to search for
 * @returns {Object|null} User object or null if not found
 */
export function getUserByUsername(username) {
  console.log('[DB] 🔍 getUserByUsername() called:', username)
  
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?')
  const user = stmt.get(username)
  
  if (user) {
    console.log('[DB] ✅ User found:', { id: user.id, username: user.username, role: user.role })
  } else {
    console.log('[DB] ❌ User not found:', username)
  }
  
  return user || null
}

/**
 * Get user by email
 * @param {string} email - Email to search for
 * @returns {Object|null} User object or null if not found
 */
export function getUserByEmail(email) {
  console.log('[DB] 🔍 getUserByEmail() called:', email)
  
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
  const user = stmt.get(email)
  
  if (user) {
    console.log('[DB] ✅ User found by email:', { id: user.id, username: user.username, email: user.email })
  } else {
    console.log('[DB] ❌ User not found by email:', email)
  }
  
  return user || null
}

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Object|null} User object or null if not found
 */
export function getUserById(id) {
  console.log('[DB] 🔍 getUserById() called:', id)
  
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
  const user = stmt.get(id)
  
  if (user) {
    console.log('[DB] ✅ User found by ID:', { id: user.id, username: user.username })
  } else {
    console.log('[DB] ❌ User not found by ID:', id)
  }
  
  return user || null
}

/**
 * Create a new user
 * @param {Object} userData - User data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email (optional)
 * @param {string} userData.password_hash - Hashed password
 * @param {string} userData.role - User role (default: 'user')
 * @returns {Object} Created user object (without password_hash)
 */
export function createUser(userData) {
  console.log('[DB] ➕ createUser() called:', { username: userData.username, email: userData.email, role: userData.role })
  
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO users (username, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `)
  
  try {
    const result = stmt.run(
      userData.username,
      userData.email || null,
      userData.password_hash,
      userData.role || 'user'
    )
    
    console.log('[DB] ✅ User created with ID:', result.lastInsertRowid)
    
    // Return user without password_hash
    const user = getUserById(result.lastInsertRowid)
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error('[DB] ❌ Error creating user:', error.message)
    throw error
  }
}

/**
 * Update user
 * @param {number} id - User ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated user or null if not found
 */
export function updateUser(id, updates) {
  console.log('[DB] ✏️ updateUser() called:', { id, updates })
  
  const db = getDb()
  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ')
  const values = [...Object.values(updates), id]
  
  const stmt = db.prepare(`
    UPDATE users 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  
  try {
    const result = stmt.run(...values)
    
    if (result.changes === 0) {
      console.log('[DB] ❌ User not found for update:', id)
      return null
    }
    
    console.log('[DB] ✅ User updated:', id)
    const user = getUserById(id)
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error('[DB] ❌ Error updating user:', error.message)
    throw error
  }
}

/**
 * Delete user
 * @param {number} id - User ID
 * @returns {boolean} True if user was deleted, false if not found
 */
export function deleteUser(id) {
  console.log('[DB] 🗑️ deleteUser() called:', id)
  
  const db = getDb()
  const stmt = db.prepare('DELETE FROM users WHERE id = ?')
  
  try {
    const result = stmt.run(id)
    
    if (result.changes === 0) {
      console.log('[DB] ❌ User not found for deletion:', id)
      return false
    }
    
    console.log('[DB] ✅ User deleted:', id)
    return true
  } catch (error) {
    console.error('[DB] ❌ Error deleting user:', error.message)
    throw error
  }
}

/**
 * Create a new API key
 * @param {Object} keyData - API key data
 * @param {number} keyData.user_id - User ID
 * @param {string} keyData.api_key - The API key string
 * @param {string} keyData.key_hash - Hashed version of the API key
 * @param {string} keyData.key_name - Optional name for the key
 * @param {Date} keyData.expires_at - Optional expiration date
 * @returns {Object} Created API key object
 */
export function createApiKey(keyData) {
  console.log('[DB] ➕ createApiKey() called:', { user_id: keyData.user_id, key_name: keyData.key_name })
  
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO api_keys (user_id, key_name, api_key, key_hash, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `)
  
  try {
    const result = stmt.run(
      keyData.user_id,
      keyData.key_name || null,
      keyData.api_key,
      keyData.key_hash,
      keyData.expires_at || null
    )
    
    console.log('[DB] ✅ API key created with ID:', result.lastInsertRowid)
    return getApiKeyById(result.lastInsertRowid)
  } catch (error) {
    console.error('[DB] ❌ Error creating API key:', error.message)
    throw error
  }
}

/**
 * Get API key by ID
 * @param {number} id - API key ID
 * @returns {Object|null} API key object or null if not found
 */
export function getApiKeyById(id) {
  console.log('[DB] 🔍 getApiKeyById() called:', id)
  
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM api_keys WHERE id = ?')
  const apiKey = stmt.get(id)
  
  if (apiKey) {
    console.log('[DB] ✅ API key found:', { id: apiKey.id, user_id: apiKey.user_id, key_name: apiKey.key_name })
  } else {
    console.log('[DB] ❌ API key not found:', id)
  }
  
  return apiKey || null
}

/**
 * Get API key by key hash (for verification)
 * @param {string} keyHash - Hashed API key
 * @returns {Object|null} API key object or null if not found
 */
export function getApiKeyByHash(keyHash) {
  console.log('[DB] 🔍 getApiKeyByHash() called')
  
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM api_keys WHERE key_hash = ? AND is_active = 1')
  const apiKey = stmt.get(keyHash)
  
  if (apiKey) {
    console.log('[DB] ✅ API key found by hash:', { id: apiKey.id, user_id: apiKey.user_id })
  } else {
    console.log('[DB] ❌ API key not found by hash')
  }
  
  return apiKey || null
}

/**
 * Get all API keys for a user
 * @param {number} userId - User ID
 * @returns {Array} Array of API key objects
 */
export function getApiKeysByUserId(userId) {
  console.log('[DB] 🔍 getApiKeysByUserId() called:', userId)
  
  const db = getDb()
  const stmt = db.prepare(`
    SELECT id, user_id, key_name, api_key, is_active, last_used_at, created_at, expires_at
    FROM api_keys 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `)
  const apiKeys = stmt.all(userId)
  
  console.log('[DB] ✅ Found', apiKeys.length, 'API keys for user:', userId)
  return apiKeys
}

/**
 * Update API key last used timestamp
 * @param {number} id - API key ID
 * @returns {boolean} True if updated
 */
export function updateApiKeyLastUsed(id) {
  console.log('[DB] 🔄 updateApiKeyLastUsed() called:', id)
  
  const db = getDb()
  const stmt = db.prepare('UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?')
  
  try {
    const result = stmt.run(id)
    console.log('[DB] ✅ API key last used updated:', id)
    return result.changes > 0
  } catch (error) {
    console.error('[DB] ❌ Error updating API key last used:', error.message)
    throw error
  }
}

/**
 * Deactivate API key
 * @param {number} id - API key ID
 * @param {number} userId - User ID (for verification)
 * @returns {boolean} True if deactivated
 */
export function deactivateApiKey(id, userId) {
  console.log('[DB] 🚫 deactivateApiKey() called:', { id, userId })
  
  const db = getDb()
  const stmt = db.prepare('UPDATE api_keys SET is_active = 0 WHERE id = ? AND user_id = ?')
  
  try {
    const result = stmt.run(id, userId)
    
    if (result.changes === 0) {
      console.log('[DB] ❌ API key not found or not owned by user:', { id, userId })
      return false
    }
    
    console.log('[DB] ✅ API key deactivated:', id)
    return true
  } catch (error) {
    console.error('[DB] ❌ Error deactivating API key:', error.message)
    throw error
  }
}

/**
 * Delete API key
 * @param {number} id - API key ID
 * @param {number} userId - User ID (for verification)
 * @returns {boolean} True if deleted
 */
export function deleteApiKey(id, userId) {
  console.log('[DB] 🗑️ deleteApiKey() called:', { id, userId })
  
  const db = getDb()
  const stmt = db.prepare('DELETE FROM api_keys WHERE id = ? AND user_id = ?')
  
  try {
    const result = stmt.run(id, userId)
    
    if (result.changes === 0) {
      console.log('[DB] ❌ API key not found or not owned by user:', { id, userId })
      return false
    }
    
    console.log('[DB] ✅ API key deleted:', id)
    return true
  } catch (error) {
    console.error('[DB] ❌ Error deleting API key:', error.message)
    throw error
  }
}


