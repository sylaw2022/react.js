# Token Security - Quick Start Guide

## ✅ What Was Added

Token security functions have been added to your project:

1. **`lib/token.js`** - Token utility functions
2. **`app/api/auth/login/route.js`** - Login endpoint
3. **`app/api/auth/verify/route.js`** - Token verification
4. **`app/api/auth/refresh/route.js`** - Token refresh
5. **`app/api/protected/route.js`** - Protected endpoint example

---

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
npm install jsonwebtoken
```

### Step 2: Generate JWT Secret Key

```bash
# Generate a secure secret key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Create `.env.local`

```bash
# Create .env.local file
cat > .env.local << EOF
JWT_SECRET=your-generated-secret-key-here
EOF
```

**Important:** Replace `your-generated-secret-key-here` with the key from Step 2!

### Step 4: Restart Server

```bash
npm run dev
```

---

## 📝 API Endpoints

### 1. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
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
  }
}
```

### 2. Verify Token

```bash
GET /api/auth/verify
Authorization: Bearer <token>
```

### 3. Protected Endpoint

```bash
GET /api/protected
Authorization: Bearer <token>
```

---

## 🧪 Test It

### Test Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Test Protected Endpoint:

```bash
# First, get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | \
  grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Then use token
curl http://localhost:3000/api/protected \
  -H "Authorization: Bearer $TOKEN"
```

---

## 👤 Demo Users

- **admin** / **admin123** (role: admin)
- **user** / **user123** (role: user)
- **john** / **password123** (role: user)

---

## 🔧 Available Functions

### Generate Token

```javascript
import { generateToken } from '../../../lib/token.js'

const token = generateToken({
  userId: 123,
  username: 'john',
  role: 'user'
}, '24h')
```

### Verify Token

```javascript
import { verifyToken } from '../../../lib/token.js'

const decoded = verifyToken(token)
```

### Verify from Request

```javascript
import { verifyTokenFromRequest } from '../../../lib/token.js'

const { user, error } = verifyTokenFromRequest(request)
```

---

## 📚 Full Documentation

See `TOKEN_SECURITY_USAGE.md` for complete documentation.

---

## ⚠️ Important Notes

1. **Generate JWT_SECRET** - Don't use the default!
2. **Add to .env.local** - Never commit secrets
3. **Restart server** - After adding environment variables
4. **Use HTTPS in production** - Tokens should be sent over HTTPS

---

## ✅ Done!

Your token security functions are ready to use! 🔐


