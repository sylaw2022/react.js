import { NextResponse } from 'next/server'
import { 
  encrypt, decrypt, encryptObject, decryptObject, hash, createHMAC, verifyHMAC,
  encryptForUser, decryptForUser, encryptObjectForUser, decryptObjectForUser,
  deriveUserEncryptionKey, generateUserEncryptionKey
} from '@/lib/encryption'

/**
 * OPTIONS /api/encryption/test
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

/**
 * POST /api/encryption/test
 * Test encryption/decryption functions
 * 
 * Body: { 
 *   action: 'encrypt' | 'decrypt' | 'encryptObject' | 'decryptObject' | 'hash' | 'hmac' | 
 *          'encryptForUser' | 'decryptForUser' | 'encryptObjectForUser' | 'decryptObjectForUser' |
 *          'deriveUserKey' | 'generateUserKey',
 *   data: string | object,
 *   userId?: number | string (for per-user operations),
 *   encryptedData?: { iv: string, encrypted: string } (for decrypt operations),
 *   secret?: string (for HMAC operations)
 * }
 */
export async function POST(request) {
  console.log('[API] 🔐 POST /api/encryption/test - Encryption test request received')
  
  try {
    const body = await request.json()
    const { action, data, encryptedData, secret } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required. Supported: encrypt, decrypt, encryptObject, decryptObject, hash, hmac, encryptForUser, decryptForUser, encryptObjectForUser, decryptObjectForUser, deriveUserKey, generateUserKey' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'encrypt':
        if (!data || typeof data !== 'string') {
          return NextResponse.json(
            { error: 'Data must be a string for encryption' },
            { status: 400 }
          )
        }
        result = encrypt(data)
        return NextResponse.json({
          success: true,
          action: 'encrypt',
          encrypted: result,
          message: 'Data encrypted successfully',
        }, { status: 200 })

      case 'decrypt':
        if (!encryptedData || !encryptedData.iv || !encryptedData.encrypted) {
          return NextResponse.json(
            { error: 'Invalid encrypted data format. Expected { iv: string, encrypted: string }' },
            { status: 400 }
          )
        }
        result = decrypt(encryptedData)
        return NextResponse.json({
          success: true,
          action: 'decrypt',
          decrypted: result,
          message: 'Data decrypted successfully',
        }, { status: 200 })

      case 'encryptObject':
        if (!data || typeof data !== 'object') {
          return NextResponse.json(
            { error: 'Data must be an object for object encryption' },
            { status: 400 }
          )
        }
        result = encryptObject(data)
        return NextResponse.json({
          success: true,
          action: 'encryptObject',
          encrypted: result,
          message: 'Object encrypted successfully',
        }, { status: 200 })

      case 'decryptObject':
        if (!encryptedData || !encryptedData.iv || !encryptedData.encrypted) {
          return NextResponse.json(
            { error: 'Invalid encrypted data format. Expected { iv: string, encrypted: string }' },
            { status: 400 }
          )
        }
        result = decryptObject(encryptedData)
        return NextResponse.json({
          success: true,
          action: 'decryptObject',
          decrypted: result,
          message: 'Object decrypted successfully',
        }, { status: 200 })

      case 'hash':
        if (!data || typeof data !== 'string') {
          return NextResponse.json(
            { error: 'Data must be a string for hashing' },
            { status: 400 }
          )
        }
        result = hash(data)
        return NextResponse.json({
          success: true,
          action: 'hash',
          hash: result,
          message: 'Data hashed successfully',
        }, { status: 200 })

      case 'hmac':
        if (!data || typeof data !== 'string' || !secret) {
          return NextResponse.json(
            { error: 'Data and secret are required for HMAC' },
            { status: 400 }
          )
        }
        const hmac = createHMAC(data, secret)
        return NextResponse.json({
          success: true,
          action: 'hmac',
          hmac: hmac,
          message: 'HMAC created successfully',
        }, { status: 200 })

      case 'verifyHmac':
        if (!data || typeof data !== 'string' || !secret || !encryptedData) {
          return NextResponse.json(
            { error: 'Data, secret, and hmac are required for HMAC verification' },
            { status: 400 }
          )
        }
        const isValid = verifyHMAC(data, secret, encryptedData)
        return NextResponse.json({
          success: true,
          action: 'verifyHmac',
          valid: isValid,
          message: isValid ? 'HMAC is valid' : 'HMAC is invalid',
        }, { status: 200 })

      case 'encryptForUser':
        if (!data || typeof data !== 'string' || !body.userId) {
          return NextResponse.json(
            { error: 'Data (string) and userId are required for user encryption' },
            { status: 400 }
          )
        }
        result = encryptForUser(body.userId, data)
        return NextResponse.json({
          success: true,
          action: 'encryptForUser',
          userId: body.userId,
          encrypted: result,
          message: 'Data encrypted for user successfully',
        }, { status: 200 })

      case 'decryptForUser':
        if (!encryptedData || !encryptedData.iv || !encryptedData.encrypted || !body.userId) {
          return NextResponse.json(
            { error: 'Invalid encrypted data format and userId are required for user decryption' },
            { status: 400 }
          )
        }
        result = decryptForUser(body.userId, encryptedData)
        return NextResponse.json({
          success: true,
          action: 'decryptForUser',
          userId: body.userId,
          decrypted: result,
          message: 'Data decrypted for user successfully',
        }, { status: 200 })

      case 'encryptObjectForUser':
        if (!data || typeof data !== 'object' || !body.userId) {
          return NextResponse.json(
            { error: 'Data (object) and userId are required for user object encryption' },
            { status: 400 }
          )
        }
        result = encryptObjectForUser(body.userId, data)
        return NextResponse.json({
          success: true,
          action: 'encryptObjectForUser',
          userId: body.userId,
          encrypted: result,
          message: 'Object encrypted for user successfully',
        }, { status: 200 })

      case 'decryptObjectForUser':
        if (!encryptedData || !encryptedData.iv || !encryptedData.encrypted || !body.userId) {
          return NextResponse.json(
            { error: 'Invalid encrypted data format and userId are required for user object decryption' },
            { status: 400 }
          )
        }
        result = decryptObjectForUser(body.userId, encryptedData)
        return NextResponse.json({
          success: true,
          action: 'decryptObjectForUser',
          userId: body.userId,
          decrypted: result,
          message: 'Object decrypted for user successfully',
        }, { status: 200 })

      case 'deriveUserKey':
        if (!body.userId) {
          return NextResponse.json(
            { error: 'userId is required to derive user encryption key' },
            { status: 400 }
          )
        }
        result = deriveUserEncryptionKey(body.userId)
        return NextResponse.json({
          success: true,
          action: 'deriveUserKey',
          userId: body.userId,
          userKey: result,
          message: 'User encryption key derived successfully',
        }, { status: 200 })

      case 'generateUserKey':
        if (!body.userId) {
          return NextResponse.json(
            { error: 'userId is required to generate user encryption key' },
            { status: 400 }
          )
        }
        result = generateUserEncryptionKey(body.userId)
        return NextResponse.json({
          success: true,
          action: 'generateUserKey',
          userId: body.userId,
          userKey: result,
          message: 'User encryption key generated successfully',
          warning: 'Save this key securely. It should be encrypted and stored in the database.',
        }, { status: 200 })

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Supported: encrypt, decrypt, encryptObject, decryptObject, hash, hmac, verifyHmac, encryptForUser, decryptForUser, encryptObjectForUser, decryptObjectForUser, deriveUserKey, generateUserKey` },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('[API] ❌ Encryption test error:', error)
    return NextResponse.json(
      { 
        error: 'Encryption operation failed',
        message: error.message 
      },
      { status: 500 }
    )
  }
}

