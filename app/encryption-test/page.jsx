'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function EncryptionTestPage() {
  const [action, setAction] = useState('encrypt')
  const [inputData, setInputData] = useState('')
  const [secret, setSecret] = useState('')
  const [encryptedData, setEncryptedData] = useState('')
  const [userId, setUserId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let body = { action }

      if (action === 'encrypt' || action === 'hash' || action === 'hmac' || action === 'encryptForUser') {
        if (!inputData.trim()) {
          setError('Input data is required')
          setLoading(false)
          return
        }
        body.data = inputData
      }

      if (action === 'encryptObject' || action === 'encryptObjectForUser') {
        try {
          body.data = JSON.parse(inputData)
        } catch (e) {
          setError('Invalid JSON format')
          setLoading(false)
          return
        }
      }

      if (action === 'decrypt' || action === 'decryptObject' || action === 'decryptForUser' || action === 'decryptObjectForUser') {
        try {
          body.encryptedData = JSON.parse(encryptedData)
        } catch (e) {
          setError('Invalid encrypted data format. Expected JSON: { "iv": "...", "encrypted": "..." }')
          setLoading(false)
          return
        }
      }

      if (action === 'hmac' || action === 'verifyHmac') {
        if (!secret.trim()) {
          setError('Secret is required for HMAC operations')
          setLoading(false)
          return
        }
        body.secret = secret
      }

      if (action === 'verifyHmac') {
        body.encryptedData = encryptedData
      }

      // Per-user encryption operations
      if (action.includes('User') || action === 'deriveUserKey' || action === 'generateUserKey') {
        if (!userId.trim()) {
          setError('User ID is required for per-user operations')
          setLoading(false)
          return
        }
        body.userId = parseInt(userId) || userId
      }

      const response = await fetch('/api/encryption/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        if (action === 'encrypt' || action === 'encryptObject') {
          setEncryptedData(JSON.stringify(data.encrypted, null, 2))
        }
      } else {
        setError(data.error || 'Operation failed')
      }
    } catch (err) {
      console.error('Encryption test error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{ margin: 0, color: '#333', fontSize: '2rem' }}>
            Encryption Test Tool
          </h1>
          <Link href="/" style={{
            padding: '8px 16px',
            color: '#666',
            textDecoration: 'none',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}>
            ← Back to Home
          </Link>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
              }}>
                Operation
              </label>
              <select
                value={action}
                onChange={(e) => {
                  setAction(e.target.value)
                  setResult(null)
                  setError(null)
                  setEncryptedData('')
                  setUserId('')
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                }}
              >
                <option value="encrypt">Encrypt Text</option>
                <option value="decrypt">Decrypt Text</option>
                <option value="encryptObject">Encrypt Object</option>
                <option value="decryptObject">Decrypt Object</option>
                <option value="hash">Hash (SHA-256)</option>
                <option value="hmac">Create HMAC</option>
                <option value="verifyHmac">Verify HMAC</option>
                <option value="encryptForUser">Encrypt Text (Per-User)</option>
                <option value="decryptForUser">Decrypt Text (Per-User)</option>
                <option value="encryptObjectForUser">Encrypt Object (Per-User)</option>
                <option value="decryptObjectForUser">Decrypt Object (Per-User)</option>
                <option value="deriveUserKey">Derive User Encryption Key</option>
                <option value="generateUserKey">Generate User Encryption Key</option>
              </select>
            </div>

            {(action === 'encrypt' || action === 'hash' || action === 'hmac' || 
              action === 'encryptObject' || action === 'encryptForUser' || action === 'encryptObjectForUser') && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500',
                }}>
                  {action === 'encryptObject' || action === 'encryptObjectForUser' ? 'JSON Object' : 'Input Data'}
                </label>
                <textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder={
                    action === 'encryptObject' || action === 'encryptObjectForUser'
                      ? '{"name": "John", "email": "john@example.com"}' 
                      : 'Enter text to encrypt/hash'
                  }
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '10px',
                    border: `1px solid ${error ? '#dc3545' : '#ddd'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: (action === 'encryptObject' || action === 'encryptObjectForUser') ? 'monospace' : 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {(action === 'decrypt' || action === 'decryptObject' || action === 'verifyHmac' ||
              action === 'decryptForUser' || action === 'decryptObjectForUser') && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500',
                }}>
                  Encrypted Data (JSON)
                </label>
                <textarea
                  value={encryptedData}
                  onChange={(e) => setEncryptedData(e.target.value)}
                  placeholder='{"iv": "...", "encrypted": "..."}'
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '10px',
                    border: `1px solid ${error ? '#dc3545' : '#ddd'}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {(action === 'hmac' || action === 'verifyHmac') && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500',
                }}>
                  Secret Key
                </label>
                <input
                  type="text"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter secret key for HMAC"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {(action.includes('User') || action === 'deriveUserKey' || action === 'generateUserKey') && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500',
                }}>
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user ID (e.g., 1, 2, 3)"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{
                  marginTop: '5px',
                  fontSize: '12px',
                  color: '#666',
                  fontStyle: 'italic',
                }}>
                  {action === 'deriveUserKey' 
                    ? 'Derives a unique key from master key + user ID (no storage needed)'
                    : action === 'generateUserKey'
                    ? 'Generates a random key for the user (should be stored encrypted)'
                    : 'Each user gets a unique encryption key derived from their user ID'}
                </p>
              </div>
            )}

            {error && (
              <div style={{
                padding: '12px',
                marginBottom: '20px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb',
                borderRadius: '4px',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Processing...' : `Execute ${action}`}
            </button>
          </form>

          {result && (
            <div style={{
              marginTop: '30px',
              padding: '20px',
              backgroundColor: '#e7f3ff',
              border: '1px solid #b3d9ff',
              borderRadius: '4px',
            }}>
              <h3 style={{ marginTop: 0, color: '#004085' }}>
                ✅ {result.message}
              </h3>
              
              {result.encrypted && (
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: '#004085' }}>Encrypted Data:</strong>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(result.encrypted, null, 2))}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <pre style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}>
                    {JSON.stringify(result.encrypted, null, 2)}
                  </pre>
                </div>
              )}

              {result.decrypted && (
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: '#004085' }}>Decrypted Data:</strong>
                    <button
                      onClick={() => copyToClipboard(typeof result.decrypted === 'object' 
                        ? JSON.stringify(result.decrypted, null, 2) 
                        : result.decrypted)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <pre style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}>
                    {typeof result.decrypted === 'object' 
                      ? JSON.stringify(result.decrypted, null, 2) 
                      : result.decrypted}
                  </pre>
                </div>
              )}

              {result.userKey && (
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: '#004085' }}>User Encryption Key:</strong>
                    <button
                      onClick={() => copyToClipboard(result.userKey)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    wordBreak: 'break-all',
                  }}>
                    {result.userKey}
                  </div>
                  {result.warning && (
                    <p style={{
                      marginTop: '10px',
                      padding: '10px',
                      backgroundColor: '#fff3cd',
                      color: '#856404',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}>
                      ⚠️ {result.warning}
                    </p>
                  )}
                </div>
              )}

              {result.hash && (
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: '#004085' }}>Hash:</strong>
                    <button
                      onClick={() => copyToClipboard(result.hash)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    wordBreak: 'break-all',
                  }}>
                    {result.hash}
                  </div>
                </div>
              )}

              {result.hmac && (
                <div style={{ marginTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: '#004085' }}>HMAC:</strong>
                    <button
                      onClick={() => copyToClipboard(result.hmac)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    wordBreak: 'break-all',
                  }}>
                    {result.hmac}
                  </div>
                </div>
              )}

              {result.valid !== undefined && (
                <div style={{ marginTop: '15px' }}>
                  <strong style={{ color: '#004085' }}>HMAC Verification:</strong>
                  <div style={{
                    marginTop: '8px',
                    padding: '12px',
                    backgroundColor: result.valid ? '#d4edda' : '#f8d7da',
                    color: result.valid ? '#155724' : '#721c24',
                    borderRadius: '4px',
                  }}>
                    {result.valid ? '✅ Valid' : '❌ Invalid'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

