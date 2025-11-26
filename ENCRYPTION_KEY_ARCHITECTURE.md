# Encryption Key Architecture: Per-User vs Shared Keys

## Quick Answer

**It depends on your use case:**

- ✅ **Per-User Keys**: Better for user-specific sensitive data (emails, personal info, private documents)
- ✅ **Shared Keys**: Acceptable for system-level encryption (logs, general data)
- ✅ **Hybrid Approach**: Best of both worlds (derived keys from master + user ID)

---

## Comparison

### 1. **Shared Encryption Key** (Current Implementation)

```javascript
// One key for all users
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

// All users' data encrypted with same key
encrypt(userData, ENCRYPTION_KEY)
```

**Pros:**
- ✅ Simple to manage
- ✅ One key to store/backup
- ✅ Fast (no key lookup needed)
- ✅ Good for system-level encryption

**Cons:**
- ❌ If compromised, ALL user data is at risk
- ❌ Cannot revoke access for individual users
- ❌ All users can decrypt each other's data (if they have the key)
- ❌ Compliance issues (GDPR, HIPAA) may require per-user encryption

**Best for:**
- System logs
- General application data
- Non-sensitive user data
- Development/testing

---

### 2. **Per-User Encryption Keys**

```javascript
// Each user has their own encryption key
User 1 → encryption_key: "a1b2c3d4..."
User 2 → encryption_key: "x9y8z7w6..."
User 3 → encryption_key: "m5n6o7p8..."

// Encrypt with user's specific key
encrypt(userData, user.encryption_key)
```

**Pros:**
- ✅ **Security Isolation**: If one key is compromised, others are safe
- ✅ **User Control**: Can revoke/rotate keys per user
- ✅ **Compliance**: Meets GDPR, HIPAA requirements
- ✅ **Privacy**: Users cannot decrypt each other's data
- ✅ **Key Rotation**: Rotate keys per user without affecting others

**Cons:**
- ❌ More complex to manage
- ❌ Need to store keys securely (encrypted with master key)
- ❌ Slightly slower (key lookup required)
- ❌ More storage needed

**Best for:**
- Personal information (emails, addresses)
- Private documents
- Financial data
- Healthcare records
- Any user-specific sensitive data

---

### 3. **Hybrid Approach** (Derived Keys)

```javascript
// Master key + User ID = Unique per-user key
function getUserEncryptionKey(userId) {
  return crypto
    .createHmac('sha256', MASTER_KEY)
    .update(userId.toString())
    .digest('hex')
}

// Each user gets unique key, but derived from master
User 1 → getUserEncryptionKey(1) → "a1b2c3d4..."
User 2 → getUserEncryptionKey(2) → "x9y8z7w6..."
```

**Pros:**
- ✅ **Unique per user**: Each user has different key
- ✅ **No storage needed**: Keys are derived on-the-fly
- ✅ **Simple management**: Only need master key
- ✅ **Security isolation**: Different keys per user

**Cons:**
- ❌ Cannot rotate individual user keys easily
- ❌ If master key changes, all user keys change
- ❌ Less flexible than stored per-user keys

**Best for:**
- When you want per-user encryption without storing keys
- Medium security requirements
- When key rotation is not critical

---

## When to Use Each Approach

### Use **Shared Key** When:
- Encrypting system logs
- General application data
- Non-sensitive user data
- Development/testing environments
- Simple applications with low security requirements

### Use **Per-User Keys** When:
- Encrypting personal information (PII)
- Healthcare data (HIPAA compliance)
- Financial data
- Private documents/files
- GDPR compliance required
- High security requirements
- Need individual key rotation

### Use **Derived Keys** When:
- Want per-user encryption without storage overhead
- Medium security requirements
- Don't need individual key rotation
- Balance between security and simplicity

---

## Implementation Examples

### Example 1: Per-User Stored Keys

```javascript
// Database: users table
// id | username | encryption_key (encrypted with master key)
// 1  | john     | "encrypted_key_for_john"
// 2  | jane     | "encrypted_key_for_jane"

// Generate and store per-user key
function createUserEncryptionKey(userId) {
  const userKey = generateEncryptionKey() // Random key
  const encryptedKey = encrypt(userKey, MASTER_KEY) // Encrypt with master
  // Store encryptedKey in database
  return userKey // Return plain key (only shown once)
}

// Encrypt user data
function encryptUserData(userId, data) {
  const user = getUserById(userId)
  const userKey = decrypt(user.encryption_key, MASTER_KEY) // Decrypt user's key
  return encrypt(data, userKey) // Encrypt data with user's key
}
```

### Example 2: Derived Keys

```javascript
// No storage needed - derive from master key + user ID
function getUserEncryptionKey(userId) {
  return crypto
    .createHmac('sha256', MASTER_KEY)
    .update(`encryption-${userId}`)
    .digest('hex')
}

// Encrypt user data
function encryptUserData(userId, data) {
  const userKey = getUserEncryptionKey(userId)
  return encrypt(data, userKey)
}
```

---

## Security Considerations

### Shared Key Risks:
```
If shared key is compromised:
❌ ALL user data can be decrypted
❌ Cannot isolate the breach
❌ Must re-encrypt ALL data with new key
```

### Per-User Key Benefits:
```
If one user's key is compromised:
✅ Only that user's data is at risk
✅ Other users unaffected
✅ Can rotate just that user's key
✅ Better breach containment
```

---

## Recommendation

**For most applications, use a hybrid approach:**

1. **System-level data**: Shared key
2. **User-specific sensitive data**: Per-user derived keys
3. **Highly sensitive data**: Stored per-user keys (encrypted with master)

This gives you:
- ✅ Security isolation for user data
- ✅ Simplicity for system data
- ✅ Flexibility for different security levels

---

## Compliance Requirements

### GDPR (General Data Protection Regulation)
- ✅ **Requires**: Per-user encryption for personal data
- ✅ **Benefit**: Can delete user data by deleting their key

### HIPAA (Healthcare)
- ✅ **Requires**: Per-user encryption for health records
- ✅ **Benefit**: Audit trail per user

### PCI DSS (Payment Cards)
- ✅ **Requires**: Strong encryption, key management
- ✅ **Benefit**: Per-user keys help with compliance

---

## Summary

| Approach | Security | Complexity | Compliance | Use Case |
|----------|----------|------------|------------|----------|
| **Shared Key** | Low | Low | ❌ | System data, logs |
| **Derived Keys** | Medium | Medium | ✅ | General user data |
| **Per-User Keys** | High | High | ✅✅ | Sensitive PII, healthcare |

**Answer: For user-specific sensitive data, YES - use per-user encryption keys!**

