# Secret Keys - How They Work

## What is a Secret Key?

A **secret key** is a piece of information (usually a random string) used to:
- **Encrypt/decrypt data**
- **Sign/verify tokens** (like JWT)
- **Authenticate API requests**
- **Protect sensitive information**

Think of it like a **password** that your application uses, not a user.

---

## Why Do We Need Secret Keys?

### The Problem:

```javascript
// ❌ Without secret key - anyone can create tokens
function createToken(userId) {
  return `${userId}-signed`  // Anyone can fake this!
}

// Anyone can create: "123-signed" and pretend to be user 123
```

### The Solution:

```javascript
// ✅ With secret key - only you can create valid tokens
function createToken(userId, secretKey) {
  return sign(`${userId}`, secretKey)  // Cryptographically signed
}

// Others can't fake it without the secret key!
```

---

## How Secret Keys Work

### Concept:

```
┌─────────────────────────────────┐
│   Secret Key                     │
│   "my-super-secret-key-123"      │
│   (Only your app knows this)     │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│   Your Application               │
│                                  │
│   Uses secret key to:            │
│   • Sign tokens                  │
│   • Encrypt data                 │
│   • Verify requests              │
└─────────────────────────────────┘
```

---

## Common Use Cases

### 1. JWT (JSON Web Tokens) - Authentication

**How it works:**

```javascript
// Creating a JWT token
const jwt = require('jsonwebtoken')

const secretKey = process.env.JWT_SECRET  // Your secret key
const user = { id: 123, name: 'John' }

// Sign (create) token
const token = jwt.sign(user, secretKey)
// Result: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Verify (check) token
const decoded = jwt.verify(token, secretKey)
// Result: { id: 123, name: 'John' }
```

**What happens:**
1. **Signing:** Secret key + user data → Encrypted token
2. **Verification:** Token + secret key → Original user data
3. **Security:** Without secret key, token can't be verified

**Example:**

```javascript
// app/api/auth/login/route.js
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET  // Secret key from .env

export async function POST(request) {
  const { username, password } = await request.json()
  
  // Verify user credentials...
  if (username === 'admin' && password === 'correct') {
    // Create token using secret key
    const token = jwt.sign(
      { userId: 123, username: 'admin' },
      JWT_SECRET,  // ← Secret key used here
      { expiresIn: '1h' }
    )
    
    return NextResponse.json({ token })
  }
}

// app/api/auth/verify/route.js
export async function GET(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  
  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, JWT_SECRET)  // ← Secret key used here
    return NextResponse.json({ user: decoded })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
```

---

### 2. API Authentication

**How it works:**

```javascript
// Server generates API key using secret
const apiKey = generateApiKey(secretKey)

// Client sends API key with requests
fetch('/api/data', {
  headers: {
    'X-API-Key': apiKey
  }
})

// Server verifies API key using secret
if (verifyApiKey(apiKey, secretKey)) {
  // Allow access
}
```

**Example:**

```javascript
// app/api/data/route.js
const API_SECRET_KEY = process.env.API_SECRET_KEY

export async function GET(request) {
  const apiKey = request.headers.get('X-API-Key')
  
  // Verify API key matches secret
  if (apiKey !== API_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Return data
  return NextResponse.json({ data: 'secret data' })
}
```

---

### 3. Encryption/Decryption

**How it works:**

```javascript
const crypto = require('crypto')

const secretKey = process.env.ENCRYPTION_KEY

// Encrypt data
function encrypt(text, secretKey) {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

// Decrypt data
function decrypt(encrypted, secretKey) {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// Usage
const encrypted = encrypt('sensitive data', secretKey)
const decrypted = decrypt(encrypted, secretKey)
```

---

### 4. Session Management

**How it works:**

```javascript
// Create session ID using secret
const sessionId = createSession(userId, secretKey)

// Store session ID in cookie
response.setHeader('Set-Cookie', `session=${sessionId}`)

// Verify session using secret
const userId = verifySession(sessionId, secretKey)
```

---

## How Secret Keys Work in Practice

### Step-by-Step: JWT Token Example

#### Step 1: User Logs In

```javascript
// User provides credentials
POST /api/login
{
  "username": "john",
  "password": "password123"
}
```

#### Step 2: Server Creates Token

```javascript
// app/api/login/route.js
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET  // "my-secret-key-123"

export async function POST(request) {
  const { username, password } = await request.json()
  
  // Verify credentials...
  if (isValidUser(username, password)) {
    // Create token using secret key
    const token = jwt.sign(
      { userId: 123, username: 'john' },
      JWT_SECRET  // ← Secret key used to sign
    )
    
    return NextResponse.json({ token })
  }
}
```

**What happens internally:**
```
User Data + Secret Key → Algorithm → Encrypted Token
{userId: 123} + "my-secret-key-123" → HMAC-SHA256 → "eyJhbGc..."
```

#### Step 3: Client Stores Token

```javascript
// Client receives token
const { token } = await response.json()
localStorage.setItem('token', token)
```

#### Step 4: Client Sends Token with Requests

```javascript
// Client sends token
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

#### Step 5: Server Verifies Token

```javascript
// app/api/protected/route.js
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export async function GET(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  
  try {
    // Verify token using same secret key
    const decoded = jwt.verify(token, JWT_SECRET)  // ← Secret key used to verify
    
    // Token is valid, return protected data
    return NextResponse.json({ 
      message: 'Protected data',
      user: decoded 
    })
  } catch (error) {
    // Token is invalid (wrong secret key or tampered)
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}
```

**What happens internally:**
```
Token + Secret Key → Algorithm → Original Data (if valid)
"eyJhbGc..." + "my-secret-key-123" → HMAC-SHA256 → {userId: 123}
```

---

## Why Secret Keys Must Be Secret

### What Happens if Secret Key is Exposed?

```javascript
// ❌ Secret key exposed in code (committed to Git)
const JWT_SECRET = 'my-secret-key-123'  // Anyone can see this!

// Attacker can:
// 1. Create fake tokens
const fakeToken = jwt.sign({ userId: 999, admin: true }, JWT_SECRET)

// 2. Impersonate any user
// 3. Gain admin access
// 4. Access protected resources
```

### How to Keep Secret Keys Safe:

```javascript
// ✅ Secret key in environment variable
const JWT_SECRET = process.env.JWT_SECRET  // Not in code!

// .env.local (not committed to Git)
JWT_SECRET=my-super-secret-key-123
```

---

## Types of Secret Keys

### 1. **Symmetric Keys** (Same key for encrypt/decrypt)

```javascript
// Same key used for both operations
const secretKey = 'my-secret-key'

encrypt(data, secretKey)  // Uses secretKey
decrypt(encrypted, secretKey)  // Uses same secretKey
```

**Examples:**
- JWT signing/verification
- AES encryption
- Session tokens

### 2. **Asymmetric Keys** (Different keys for encrypt/decrypt)

```javascript
// Different keys
const publicKey = 'public-key-123'  // Can be shared
const privateKey = 'private-key-456'  // Must be secret

encrypt(data, publicKey)  // Uses publicKey
decrypt(encrypted, privateKey)  // Uses privateKey
```

**Examples:**
- RSA encryption
- SSH keys
- SSL/TLS certificates

---

## Secret Key Best Practices

### 1. **Generate Strong Keys**

```javascript
// ❌ Weak key
const secret = 'password123'  // Too simple!

// ✅ Strong key (use crypto)
const crypto = require('crypto')
const secret = crypto.randomBytes(32).toString('hex')
// Result: "a1b2c3d4e5f6..." (64 characters, random)
```

### 2. **Store in Environment Variables**

```bash
# .env.local
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
API_SECRET_KEY=another-random-secret-key-here
ENCRYPTION_KEY=yet-another-secret-key
```

### 3. **Never Commit to Git**

```bash
# .gitignore
.env
.env.local
.env*.local
*.key
*.pem
secrets/
```

### 4. **Use Different Keys for Different Purposes**

```bash
# .env.local
JWT_SECRET=key-for-jwt-tokens
API_SECRET_KEY=key-for-api-auth
ENCRYPTION_KEY=key-for-data-encryption
SESSION_SECRET=key-for-sessions
```

### 5. **Rotate Keys Regularly**

```bash
# Change keys periodically
# Old: JWT_SECRET=old-key-123
# New: JWT_SECRET=new-key-456
```

---

## Real-World Example: Complete Authentication Flow

### Setup:

```bash
# .env.local
JWT_SECRET=my-super-secret-jwt-key-123456789
```

### Login Endpoint:

```javascript
// app/api/auth/login/route.js
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request) {
  const { username, password } = await request.json()
  
  // Verify credentials (in real app, check database)
  if (username === 'admin' && password === 'password123') {
    // Create token using secret key
    const token = jwt.sign(
      { 
        userId: 1, 
        username: 'admin',
        role: 'admin'
      },
      JWT_SECRET,  // ← Secret key used here
      { expiresIn: '24h' }
    )
    
    return NextResponse.json({ 
      success: true,
      token 
    })
  }
  
  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  )
}
```

### Protected Endpoint:

```javascript
// app/api/user/profile/route.js
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET

export async function GET(request) {
  // Get token from header
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'No token provided' },
      { status: 401 }
    )
  }
  
  const token = authHeader.replace('Bearer ', '')
  
  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, JWT_SECRET)  // ← Secret key used here
    
    // Token is valid, return user profile
    return NextResponse.json({
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role
    })
  } catch (error) {
    // Token is invalid (wrong secret or expired)
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}
```

### Client Usage:

```javascript
// Client-side code
async function login(username, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  
  const { token } = await response.json()
  localStorage.setItem('token', token)
}

async function getProfile() {
  const token = localStorage.getItem('token')
  
  const response = await fetch('/api/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  
  const profile = await response.json()
  return profile
}
```

---

## How Secret Keys Work: Summary

### The Process:

1. **Generate Secret Key**
   ```bash
   # Create a random, strong secret key
   JWT_SECRET=random-64-character-string
   ```

2. **Use Secret Key to Sign**
   ```javascript
   // Create token
   const token = jwt.sign(data, JWT_SECRET)
   ```

3. **Store Secret Key Securely**
   ```bash
   # In .env.local (not in code!)
   JWT_SECRET=your-secret-key
   ```

4. **Use Secret Key to Verify**
   ```javascript
   // Verify token
   const decoded = jwt.verify(token, JWT_SECRET)
   ```

### Key Points:

- ✅ **Same key** used for signing and verification
- ✅ **Secret key** must be kept secret (environment variables)
- ✅ **Without secret key**, tokens can't be verified
- ✅ **If secret key is exposed**, security is compromised

---

## Common Algorithms

### HMAC (Hash-based Message Authentication Code)

```javascript
// Used by JWT
jwt.sign(data, secretKey, { algorithm: 'HS256' })
// HS256 = HMAC with SHA-256
```

### AES (Advanced Encryption Standard)

```javascript
// Used for encryption
const cipher = crypto.createCipher('aes-256-cbc', secretKey)
```

---

## Security Considerations

### 1. **Key Length**

```javascript
// ❌ Too short
const key = '123'  // Easy to guess

// ✅ Long and random
const key = crypto.randomBytes(32).toString('hex')  // 64 characters
```

### 2. **Key Storage**

```javascript
// ❌ In code
const key = 'my-secret-key'  // Exposed!

// ✅ In environment
const key = process.env.JWT_SECRET  // Secure
```

### 3. **Key Rotation**

```bash
# Change keys periodically
# Old: JWT_SECRET=old-key
# New: JWT_SECRET=new-key
# Users need to re-login
```

---

## Quick Example for Your Project

### Step 1: Install JWT Library

```bash
npm install jsonwebtoken
```

### Step 2: Create Secret Key

```bash
# Generate random key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env.local
JWT_SECRET=generated-key-here
```

### Step 3: Use in Code

```javascript
// app/api/auth/login/route.js
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request) {
  const { username, password } = await request.json()
  
  // Verify user...
  if (isValidUser(username, password)) {
    const token = jwt.sign(
      { userId: 123 },
      JWT_SECRET  // ← Secret key
    )
    return NextResponse.json({ token })
  }
}
```

---

## Summary

### What is a Secret Key?
- A random string used for encryption, signing, and authentication

### How Does It Work?
1. **Signing:** Data + Secret Key → Encrypted Token
2. **Verification:** Token + Secret Key → Original Data (if valid)
3. **Security:** Without secret key, tokens can't be created or verified

### Key Principles:
- ✅ **Keep it secret** - Never commit to Git
- ✅ **Use environment variables** - Store in `.env.local`
- ✅ **Make it strong** - Use random, long strings
- ✅ **Use different keys** - Different purposes, different keys
- ✅ **Rotate regularly** - Change keys periodically

### Common Uses:
- JWT token signing/verification
- API authentication
- Data encryption
- Session management

**Secret keys are the foundation of application security!** 🔐



