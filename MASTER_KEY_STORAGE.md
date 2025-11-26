# Where is the Master Encryption Key Stored?

## Quick Answer

**The master encryption key is stored in environment variables**, specifically in a `.env.local` file (or other environment files).

---

## Current Implementation

### In Your Code (`lib/encryption.js`):

```javascript
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 
                       process.env.JWT_SECRET || 
                       'default-encryption-key-change-in-production-please-use-strong-key'
```

**Priority Order:**
1. ✅ `process.env.ENCRYPTION_KEY` (from `.env.local`)
2. ⚠️ `process.env.JWT_SECRET` (fallback - uses JWT secret)
3. ❌ Hardcoded default (insecure - only for development)

---

## Where to Store the Master Key

### ✅ **Recommended: `.env.local` File**

**Location:** `/home/sylaw/react.js/.env.local`

```bash
# .env.local (in project root)
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Why `.env.local`?**
- ✅ Not committed to Git (secure)
- ✅ Local overrides (highest priority)
- ✅ Different per environment
- ✅ Easy to manage

---

## How to Set Up the Master Key

### Step 1: Generate a Strong Encryption Key

```bash
# Generate a 64-character hex key (32 bytes = 256 bits)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output example:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Step 2: Create `.env.local` File

```bash
# In project root
touch .env.local
```

### Step 3: Add the Key

```bash
# .env.local
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_SECRET=x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8t7s6
```

### Step 4: Ensure `.env.local` is in `.gitignore`

```bash
# .gitignore
.env.local
.env*.local
.env
```

**Important:** Never commit `.env.local` to Git!

---

## Where the Key is Loaded From

### Priority Order:

```
1. .env.local (highest priority)
   ↓
2. .env.development / .env.production
   ↓
3. .env (lowest priority)
   ↓
4. System environment variables
   ↓
5. Hardcoded fallback (insecure!)
```

### How Next.js Loads It:

```javascript
// When server starts:
// 1. Next.js reads .env.local
// 2. Sets process.env.ENCRYPTION_KEY
// 3. Your code reads: process.env.ENCRYPTION_KEY
```

---

## Current Status

### ❌ **Problem: No `.env.local` File**

Currently, your master key is likely using:
- The hardcoded default (insecure!)
- Or `JWT_SECRET` if it's set

### ✅ **Solution: Create `.env.local`**

You need to:
1. Generate a strong key
2. Create `.env.local` file
3. Add `ENCRYPTION_KEY=...`
4. Restart the server

---

## Security Considerations

### ✅ **Secure Storage:**

```bash
# .env.local (not in Git)
ENCRYPTION_KEY=strong-random-key-here
```

**Benefits:**
- ✅ Not in code
- ✅ Not in Git
- ✅ Different per environment
- ✅ Easy to rotate

### ❌ **Insecure Storage:**

```javascript
// ❌ In code (BAD!)
const ENCRYPTION_KEY = 'my-secret-key'

// ❌ In Git (BAD!)
// .env file committed to repository

// ❌ Hardcoded default (BAD!)
const ENCRYPTION_KEY = 'default-encryption-key...'
```

---

## Production Deployment

### For Production:

**Option 1: Environment Variables (Recommended)**
```bash
# Set in hosting platform
# Vercel, AWS, Heroku, etc.
ENCRYPTION_KEY=your-production-key
```

**Option 2: Secret Management Services**
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- Google Secret Manager

**Option 3: CI/CD Secrets**
- GitHub Secrets
- GitLab CI Variables
- Jenkins Credentials

---

## Key Management Best Practices

### 1. **Generate Strong Keys**

```bash
# 32 bytes (256 bits) - Recommended
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. **Store Securely**

```bash
# ✅ Good
.env.local (not in Git)

# ❌ Bad
In code, in Git, hardcoded
```

### 3. **Rotate Periodically**

```bash
# Old key
ENCRYPTION_KEY=old-key-123

# New key (after re-encrypting data)
ENCRYPTION_KEY=new-key-456
```

### 4. **Backup Securely**

- Store in password manager
- Use secret management service
- Never lose the key (can't decrypt data!)

---

## How to Check Current Key

### Check What Key is Being Used:

```javascript
// Add to any API route temporarily
console.log('ENCRYPTION_KEY set:', !!process.env.ENCRYPTION_KEY)
console.log('JWT_SECRET set:', !!process.env.JWT_SECRET)
console.log('Using default:', !process.env.ENCRYPTION_KEY && !process.env.JWT_SECRET)
```

---

## Summary

**Where is the master key stored?**

1. **Primary:** `.env.local` file (project root)
   ```bash
   ENCRYPTION_KEY=your-64-character-hex-key
   ```

2. **Fallback:** `JWT_SECRET` from environment
   ```bash
   JWT_SECRET=your-jwt-secret
   ```

3. **Last Resort:** Hardcoded default (insecure!)

**To set it up:**
1. Generate key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Create `.env.local` in project root
3. Add: `ENCRYPTION_KEY=generated-key-here`
4. Restart server

**Security:**
- ✅ Store in `.env.local` (not in Git)
- ✅ Use strong random keys (64 hex characters)
- ✅ Rotate periodically
- ✅ Backup securely

