# Token Security Functions - Usage Guide

## Overview

Token security functions have been added to your project for JWT-based authentication.

---

## Files Created

1. **`lib/token.js`** - Token utility functions
2. **`app/api/auth/login/route.js`** - Login endpoint
3. **`app/api/auth/verify/route.js`** - Token verification endpoint
4. **`app/api/auth/refresh/route.js`** - Token refresh endpoint
5. **`app/api/protected/route.js`** - Protected endpoint example

---

## Setup

### Step 1: Generate JWT Secret Key

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env.local
JWT_SECRET=generated-key-here
```

### Step 2: Create `.env.local`

```bash
# .env.local
JWT_SECRET=your-generated-secret-key-here
```

### Step 3: Restart Server

```bash
npm run dev
```

---

## API Endpoints

### 1. Login - Get Token

**Endpoint:** `POST /api/auth/login`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "username": "admin",
    "role": "admin"
  },
  "expiresIn": "24h"
}
```

**Demo Users:**
- `admin` / `admin123` (role: admin)
- `user` / `user123` (role: user)
- `john` / `password123` (role: user)

---

### 2. Verify Token

**Endpoint:** `GET /api/auth/verify`

**Request:**
```bash
curl http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "userId": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

---

### 3. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

---

### 4. Protected Endpoint

**Endpoint:** `GET /api/protected`

**Request:**
```bash
curl http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "message": "This is protected data",
  "user": {
    "userId": 1,
    "username": "admin",
    "role": "admin"
  },
  "timestamp": "2024-11-24T10:00:00.000Z"
}
```

**Without Token:**
```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

---

## Token Functions

### Generate Token

```javascript
import { generateToken } from '@/lib/token'

const token = generateToken({
  userId: 123,
  username: 'john',
  role: 'user',
}, '24h') // Expires in 24 hours
```

### Verify Token

```javascript
import { verifyToken } from '@/lib/token'

try {
  const decoded = verifyToken(token)
  console.log(decoded) // { userId: 123, username: 'john', role: 'user', ... }
} catch (error) {
  console.error('Invalid token:', error.message)
}
```

### Verify from Request

```javascript
import { verifyTokenFromRequest } from '@/lib/token'

export async function GET(request) {
  const { user, error } = verifyTokenFromRequest(request)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
  
  // User is authenticated
  return NextResponse.json({ user })
}
```

### Refresh Token

```javascript
import { refreshToken } from '@/lib/token'

const newToken = refreshToken(oldToken, '24h')
```

---

## Complete Example Flow

### Step 1: Login

```javascript
// Client
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
})

const { token, user } = await response.json()
localStorage.setItem('token', token)
```

### Step 2: Use Token

```javascript
// Client - Make authenticated request
const token = localStorage.getItem('token')

const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const data = await response.json()
```

### Step 3: Verify Token

```javascript
// Client - Check if token is still valid
const token = localStorage.getItem('token')

const response = await fetch('/api/auth/verify', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const { valid, user } = await response.json()
if (!valid) {
  // Token expired or invalid, redirect to login
}
```

### Step 4: Refresh Token

```javascript
// Client - Refresh token before it expires
const token = localStorage.getItem('token')

const response = await fetch('/api/auth/refresh', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const { token: newToken } = await response.json()
localStorage.setItem('token', newToken)
```

---

## Protecting Your API Routes

### Example: Protected API Route

```javascript
// app/api/users/route.js
import { NextResponse } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/token'

export async function GET(request) {
  // Verify token
  const { user, error } = verifyTokenFromRequest(request)
  
  if (error) {
    return NextResponse.json(
      { error: 'Unauthorized', message: error.message },
      { status: 401 }
    )
  }
  
  // Check permissions (optional)
  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden', message: 'Admin access required' },
      { status: 403 }
    )
  }
  
  // Return protected data
  return NextResponse.json({
    users: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]
  })
}
```

---

## Security Features

### ✅ Implemented:

1. **JWT Token Generation** - Secure token creation
2. **Token Verification** - Validate tokens
3. **Token Expiration** - Tokens expire after 24h
4. **Token Refresh** - Extend token lifetime
5. **Request Extraction** - Extract token from headers/cookies
6. **Error Handling** - Proper error messages
7. **Protected Routes** - Example protected endpoint

### 🔒 Security Best Practices:

- ✅ Secret key in environment variables
- ✅ Token expiration
- ✅ Token verification on every request
- ✅ Secure token extraction
- ✅ Error handling for invalid tokens

---

## Testing

### Test Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Test Protected Endpoint:

```bash
# Get token first
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Use token
curl http://localhost:3000/api/protected \
  -H "Authorization: Bearer $TOKEN"
```

---

## Next Steps

1. **Add Database** - Replace demo users with database lookup
2. **Add Password Hashing** - Use bcrypt for passwords
3. **Add Rate Limiting** - Prevent brute force attacks
4. **Add Token Blacklist** - For logout functionality
5. **Add Refresh Token Rotation** - Enhanced security

---

## Summary

Token security functions are now available:

- ✅ **Login** - `/api/auth/login`
- ✅ **Verify** - `/api/auth/verify`
- ✅ **Refresh** - `/api/auth/refresh`
- ✅ **Protected** - `/api/protected`

**Remember to:**
1. Generate JWT_SECRET and add to `.env.local`
2. Restart server after adding environment variable
3. Use tokens in Authorization header: `Bearer <token>`

Your API is now secured with JWT tokens! 🔐


