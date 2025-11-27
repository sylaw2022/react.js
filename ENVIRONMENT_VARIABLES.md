# Environment Variables - Complete Guide

## What are Environment Variables?

**Environment variables** are key-value pairs that store configuration settings outside your code. They allow you to change settings without modifying your code.

---

## Why Use Environment Variables?

### 1. **Security** 🔒
Store sensitive information (API keys, passwords, secrets) without committing them to code.

### 2. **Configuration** ⚙️
Different settings for development, staging, and production.

### 3. **Flexibility** 🔄
Change settings without code changes.

### 4. **Best Practice** ✅
Industry standard for managing configuration.

---

## The Problem They Solve

### ❌ Without Environment Variables (BAD):

```javascript
// app/api/status/route.js
const API_KEY = 'sk_live_1234567890abcdef'  // ❌ Exposed in code!
const DATABASE_URL = 'postgres://user:password@localhost/db'  // ❌ In code!
const SECRET = 'my-secret-key'  // ❌ Anyone can see this!

// Problems:
// 1. Committed to Git (security risk!)
// 2. Same for all environments
// 3. Hard to change
```

### ✅ With Environment Variables (GOOD):

```javascript
// app/api/status/route.js
const API_KEY = process.env.API_KEY  // ✅ From environment
const DATABASE_URL = process.env.DATABASE_URL  // ✅ From environment
const SECRET = process.env.SECRET  // ✅ From environment

// Benefits:
// 1. Not in code (secure!)
// 2. Different per environment
// 3. Easy to change
```

---

## How Environment Variables Work

### Concept:

```
┌─────────────────────────────────┐
│   Environment Variables          │
│   (Stored outside code)          │
│                                  │
│   API_KEY=abc123                │
│   DATABASE_URL=postgres://...   │
│   NODE_ENV=production           │
└─────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│   Your Code                      │
│                                  │
│   process.env.API_KEY            │
│   → "abc123"                    │
└─────────────────────────────────┘
```

---

## Next.js Environment Variables

### File Naming Convention:

Next.js automatically loads these files (in order of priority):

1. `.env.local` - **Local overrides** (highest priority, not committed to Git)
2. `.env.development` - Development environment
3. `.env.production` - Production environment
4. `.env` - Default values (lowest priority)

### File Priority:

```
.env.local (highest)
    ↓
.env.development / .env.production
    ↓
.env (lowest)
```

---

## Setting Up Environment Variables

### Step 1: Create `.env.local` File

```bash
# Create file in project root
touch .env.local
```

### Step 2: Add Variables

```bash
# .env.local
API_KEY=your-api-key-here
DATABASE_URL=postgres://user:pass@localhost/db
SECRET_KEY=your-secret-key
NODE_ENV=development
PORT=3000
```

### Step 3: Add to `.gitignore`

```bash
# .gitignore
.env.local
.env*.local
.env
```

**Important:** Never commit `.env.local` to Git!

---

## Using Environment Variables in Next.js

### Server-Side (API Routes, Server Components)

```javascript
// app/api/status/route.js
export async function GET() {
  // Access directly - works on server
  const apiKey = process.env.API_KEY
  const dbUrl = process.env.DATABASE_URL
  const secret = process.env.SECRET_KEY
  
  return NextResponse.json({
    apiKey: apiKey,  // ✅ Works
    // ...
  })
}
```

**Works in:**
- ✅ API routes (`app/api/*`)
- ✅ Server components
- ✅ `getServerSideProps`
- ✅ `getStaticProps`
- ✅ `next.config.js`

### Client-Side (Browser)

For client-side access, prefix with `NEXT_PUBLIC_`:

```javascript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=My App
```

```javascript
// app/page.jsx (client component)
'use client'

export default function Home() {
  // ✅ Works - prefixed with NEXT_PUBLIC_
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const appName = process.env.NEXT_PUBLIC_APP_NAME
  
  // ❌ Won't work - not prefixed
  const secret = process.env.SECRET_KEY  // undefined in browser!
  
  return <div>{appName}</div>
}
```

**Rule:** 
- `NEXT_PUBLIC_*` → Available in browser
- Regular variables → Server-side only

---

## Common Use Cases

### 1. API Keys

```bash
# .env.local
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
GOOGLE_MAPS_API_KEY=AIza...
```

```javascript
// app/api/payment/route.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
```

### 2. Database URLs

```bash
# .env.local
DATABASE_URL=postgres://user:password@localhost:5432/mydb
MONGODB_URI=mongodb://localhost:27017/mydb
REDIS_URL=redis://localhost:6379
```

```javascript
// lib/db.js
import { Pool } from 'pg'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
```

### 3. Environment-Specific Settings

```bash
# .env.development
API_URL=http://localhost:3000
DEBUG=true
LOG_LEVEL=debug

# .env.production
API_URL=https://api.myapp.com
DEBUG=false
LOG_LEVEL=error
```

```javascript
// app/api/status/route.js
const apiUrl = process.env.API_URL
const isDebug = process.env.DEBUG === 'true'
```

### 4. Feature Flags

```bash
# .env.local
ENABLE_NEW_FEATURE=true
ENABLE_BETA=false
```

```javascript
// app/page.jsx
if (process.env.NEXT_PUBLIC_ENABLE_NEW_FEATURE === 'true') {
  // Show new feature
}
```

### 5. Port Configuration

```bash
# .env.local
PORT=3000
```

```javascript
// next.config.js
const port = process.env.PORT || 3000
```

---

## Real-World Examples

### Example 1: API Route with Environment Variables

```javascript
// app/api/status/route.js
import { NextResponse } from 'next/server'

export async function GET() {
  const status = {
    status: 'online',
    environment: process.env.NODE_ENV || 'development',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    // Secret keys are server-side only
    hasApiKey: !!process.env.API_SECRET_KEY,  // Don't expose the key!
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(status, { status: 200 })
}
```

### Example 2: Database Connection

```javascript
// lib/database.js
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export default pool
```

### Example 3: External API Call

```javascript
// app/api/users/route.js
export async function GET() {
  const apiKey = process.env.EXTERNAL_API_KEY
  
  const response = await fetch('https://api.example.com/users', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })
  
  const data = await response.json()
  return NextResponse.json(data)
}
```

---

## Environment Variables in Your Project

### Current Usage:

Looking at your `app/api/status/route.js`:

```javascript
// Currently using:
process.env.NODE_ENV || 'development'
process.env.npm_package_version || '1.0.0'
```

### Recommended Setup:

```bash
# .env.local (create this file)
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
API_SECRET_KEY=your-secret-key-here
DATABASE_URL=postgres://localhost:5432/mydb
PORT=3000
```

```javascript
// app/api/status/route.js
export async function GET() {
  const status = {
    status: 'online',
    environment: process.env.NODE_ENV,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    port: process.env.PORT || 3000,
    timestamp: new Date().toISOString(),
    // ... rest of your code
  }
  
  return NextResponse.json(status, { status: 200 })
}
```

---

## Best Practices

### 1. **Never Commit Secrets**

```bash
# .gitignore
.env
.env.local
.env*.local
*.key
*.pem
secrets/
```

### 2. **Use `.env.local` for Secrets**

```bash
# .env.local - NOT committed to Git
API_SECRET_KEY=secret123
DATABASE_PASSWORD=password123
```

### 3. **Use `.env.example` for Documentation**

```bash
# .env.example - Committed to Git (no secrets!)
API_SECRET_KEY=your-api-key-here
DATABASE_URL=postgres://user:pass@localhost/db
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. **Prefix Client Variables**

```bash
# Client-side (browser)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Server-side only
API_SECRET_KEY=secret123
```

### 5. **Validate Environment Variables**

```javascript
// lib/env.js
function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const API_KEY = requireEnv('API_KEY')
export const DATABASE_URL = requireEnv('DATABASE_URL')
```

---

## Common Environment Variables

### Next.js Built-in:

- `NODE_ENV` - Environment (development, production, test)
- `PORT` - Server port
- `VERCEL_URL` - Vercel deployment URL (if deployed)

### Common Custom Variables:

```bash
# API Keys
API_KEY=...
STRIPE_SECRET_KEY=...
OPENAI_API_KEY=...

# Database
DATABASE_URL=...
MONGODB_URI=...
REDIS_URL=...

# URLs
NEXT_PUBLIC_API_URL=...
NEXT_PUBLIC_APP_URL=...

# Feature Flags
NEXT_PUBLIC_ENABLE_FEATURE=true
ENABLE_BETA=false

# Secrets
JWT_SECRET=...
SESSION_SECRET=...
ENCRYPTION_KEY=...

# Third-party Services
SENDGRID_API_KEY=...
AWS_ACCESS_KEY_ID=...
CLOUDINARY_URL=...
```

---

## Accessing in Different Files

### API Routes:

```javascript
// app/api/status/route.js
const apiKey = process.env.API_KEY  // ✅ Works
```

### Server Components:

```javascript
// app/page.jsx (server component)
export default function Page() {
  const apiKey = process.env.API_KEY  // ✅ Works
  return <div>{apiKey}</div>
}
```

### Client Components:

```javascript
// app/page.jsx (client component)
'use client'
export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL  // ✅ Works
  const secret = process.env.API_KEY  // ❌ undefined
  return <div>{apiUrl}</div>
}
```

### next.config.js:

```javascript
// next.config.js
const apiUrl = process.env.NEXT_PUBLIC_API_URL  // ✅ Works
```

---

## Troubleshooting

### Problem: Variable is `undefined`

**Solution:**
1. Check file name (`.env.local`)
2. Restart dev server after adding variables
3. Check spelling (case-sensitive!)
4. For client-side, use `NEXT_PUBLIC_` prefix

### Problem: Variable not updating

**Solution:**
1. Restart Next.js dev server
2. Clear `.next` cache: `rm -rf .next`
3. Check file priority (`.env.local` overrides others)

### Problem: Variable exposed in browser

**Solution:**
1. Remove `NEXT_PUBLIC_` prefix for secrets
2. Only use `NEXT_PUBLIC_` for public values
3. Never put secrets in client-side code

---

## Quick Setup for Your Project

### Step 1: Create `.env.local`

```bash
cd /home/sylaw/react.js
cat > .env.local << EOF
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
API_SECRET_KEY=your-secret-key-change-this
PORT=3000
EOF
```

### Step 2: Update `.gitignore`

```bash
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore
```

### Step 3: Use in Code

```javascript
// app/api/status/route.js
const apiUrl = process.env.NEXT_PUBLIC_API_URL
const secret = process.env.API_SECRET_KEY
```

### Step 4: Restart Server

```bash
npm run dev
```

---

## Summary

### What are Environment Variables?
- Key-value pairs stored outside code
- Used for configuration and secrets

### Why Use Them?
- ✅ Security (don't commit secrets)
- ✅ Flexibility (different per environment)
- ✅ Best practice

### How to Use in Next.js:
1. Create `.env.local` file
2. Add variables: `KEY=value`
3. Access: `process.env.KEY`
4. Client-side: Use `NEXT_PUBLIC_` prefix
5. Add to `.gitignore`

### Key Rules:
- ✅ Server-side: Any variable works
- ✅ Client-side: Must use `NEXT_PUBLIC_` prefix
- ✅ Never commit `.env.local` to Git
- ✅ Restart server after adding variables

---

## Next Steps

1. Create `.env.local` file
2. Add your environment variables
3. Update your code to use them
4. Add `.env.local` to `.gitignore`
5. Create `.env.example` for documentation

Environment variables are essential for secure, flexible applications!



