# When Are Encryption Keys Created for Each User?

## Current Implementation

### **Derived Keys (On-Demand) - Currently Available**

**When created:** Keys are **computed on-the-fly** when needed (not stored)

```javascript
// Key is derived when you call encryptForUser()
encryptForUser(userId, "data")
  ↓
deriveUserEncryptionKey(userId)  // Computed from master key + user ID
  ↓
Key is used immediately (not stored)
```

**Characteristics:**
- ✅ **No creation step needed** - Keys are computed when needed
- ✅ **No storage required** - Derived from master key + user ID
- ✅ **Always available** - Can encrypt/decrypt for any user immediately
- ✅ **Automatic** - Works as soon as user is registered

**Example:**
```javascript
// User registers → User ID = 1
// Immediately can encrypt:
encryptForUser(1, "data")  // Key derived automatically
```

---

### **Stored Keys (Not Currently Created)**

**When created:** Currently **NOT automatically created** during registration

**What would need to happen:**
1. User registers
2. Generate random encryption key for user
3. Encrypt the key with master key
4. Store encrypted key in database
5. Use stored key for encryption/decryption

**Current status:** ❌ **Not implemented** - Keys are not created during registration

---

## Two Approaches Compared

### Approach 1: Derived Keys (Current - On-Demand)

```javascript
// Registration
User registers → User ID = 1

// Encryption (key computed on-the-fly)
encryptForUser(1, "data")
  → deriveUserEncryptionKey(1)  // Computed now
  → Use key to encrypt

// No storage needed!
```

**When key is "created":**
- **Computed on-demand** when `encryptForUser()` or `decryptForUser()` is called
- **Not stored** - Always derived from master key + user ID
- **Available immediately** after user registration

**Pros:**
- ✅ No storage needed
- ✅ No key creation step
- ✅ Works immediately after registration
- ✅ Simple to manage

**Cons:**
- ❌ Cannot rotate individual user keys
- ❌ If master key changes, all user keys change

---

### Approach 2: Stored Keys (Not Currently Implemented)

```javascript
// Registration
User registers → User ID = 1
  ↓
Generate random key: "a1b2c3d4..."
  ↓
Encrypt key with master: { iv: "...", encrypted: "..." }
  ↓
Store in database: users.encryption_key = "{ iv: ..., encrypted: ... }"

// Encryption (key retrieved from database)
encryptWithUserKey(userKey, "data")
  → Get user from database
  → Decrypt user's stored key
  → Use key to encrypt
```

**When key is "created":**
- **During registration** (would need to be added)
- **Stored in database** (encrypted with master key)
- **Retrieved when needed** for encryption/decryption

**Pros:**
- ✅ Can rotate individual user keys
- ✅ More flexible key management
- ✅ Better for high-security requirements

**Cons:**
- ❌ Requires storage
- ❌ More complex to manage
- ❌ Need to handle key creation during registration

---

## Current Behavior

### For Derived Keys (What You Have Now):

**Key Creation:** ✅ **Automatic and On-Demand**

```javascript
// User registers (ID = 1)
POST /api/auth/register
  → User created with ID = 1
  → No encryption key created/stored

// Later, when encrypting:
encryptForUser(1, "data")
  → deriveUserEncryptionKey(1)  // Key computed NOW
  → Key = HMAC(master_key, "user-encryption-1")
  → Use key to encrypt
```

**Timeline:**
1. User registers → User ID assigned
2. **Key is NOT created yet** (not needed)
3. When `encryptForUser(1, ...)` is called → Key is **computed on-the-fly**
4. Key is used immediately (not stored)

---

## If You Want Stored Keys

To create stored keys during registration, you would need to:

1. **Add encryption_key column to users table**
2. **Generate key during registration**
3. **Encrypt and store the key**

**Example implementation:**

```javascript
// During registration:
const userKey = generateUserEncryptionKey(user.id)
const encryptedKey = encryptUserKeyForStorage(userKey)
// Store encryptedKey in users.encryption_key
```

---

## Summary

### Current Implementation (Derived Keys):

| Question | Answer |
|----------|--------|
| **When is key created?** | On-demand when `encryptForUser()` is called |
| **Where is key stored?** | Not stored - computed from master key + user ID |
| **Available after registration?** | ✅ Yes - immediately available |
| **Need to create during registration?** | ❌ No - computed when needed |

### If Using Stored Keys:

| Question | Answer |
|----------|--------|
| **When is key created?** | During user registration (would need to add) |
| **Where is key stored?** | In database (encrypted with master key) |
| **Available after registration?** | ✅ Yes - stored in database |
| **Need to create during registration?** | ✅ Yes - must be added to registration flow |

---

## Recommendation

**For most use cases, derived keys (current implementation) are sufficient:**

- ✅ Keys are "created" automatically when needed
- ✅ No storage overhead
- ✅ Works immediately after registration
- ✅ Simple to manage

**Use stored keys only if you need:**
- Individual key rotation per user
- Different key management policies per user
- Compliance requirements for stored keys

---

## Answer to Your Question

**"When is the encryption key created for each user?"**

**Current answer:** 
- **Derived keys:** Created **on-demand** when you first call `encryptForUser(userId, ...)` or `decryptForUser(userId, ...)`
- **Stored keys:** **Not currently created** - would need to be added to registration

**In practice:**
- User registers → User ID = 1
- Key is **computed** the first time you encrypt/decrypt for that user
- No explicit "creation" step needed for derived keys

