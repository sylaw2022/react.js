'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ApiKeysPage() {
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [newKeyName, setNewKeyName] = useState('')
  const [newApiKey, setNewApiKey] = useState(null)
  const [testKey, setTestKey] = useState('')
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/api-keys', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      const data = await response.json()
      if (data.success) {
        setApiKeys(data.apiKeys)
      }
    } catch (error) {
      console.error('Error loading API keys:', error)
      setMessage({ type: 'error', text: 'Failed to load API keys' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateKey = async (e) => {
    e.preventDefault()
    setCreating(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key_name: newKeyName || null,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setNewApiKey(data.apiKey)
        setNewKeyName('')
        setMessage({ type: 'success', text: 'API key created successfully!' })
        await loadApiKeys()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create API key' })
      }
    } catch (error) {
      console.error('Error creating API key:', error)
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteKey = async (id) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/api-keys?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'API key deleted successfully' })
        await loadApiKeys()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete API key' })
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    }
  }

  const handleTestKey = async (e) => {
    e.preventDefault()
    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/api-keys/test', {
        method: 'GET',
        headers: {
          'X-API-Key': testKey.trim(),
        },
      })

      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      console.error('Error testing API key:', error)
      setTestResult({ valid: false, error: 'Network error. Please try again.' })
    } finally {
      setTesting(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setMessage({ type: 'success', text: 'Copied to clipboard!' })
    setTimeout(() => setMessage({ type: '', text: '' }), 2000)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.5rem',
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{ margin: 0, color: '#333', fontSize: '2rem' }}>
            API Key Management
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

        {message.text && (
          <div style={{
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '4px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          }}>
            {message.text}
          </div>
        )}

        {/* Create New API Key */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px',
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
            Create New API Key
          </h2>
          <form onSubmit={handleCreateKey}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
              }}>
                Key Name (Optional)
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production Key, Development Key"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              style={{
                padding: '12px 24px',
                backgroundColor: creating ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: creating ? 'not-allowed' : 'pointer',
              }}
            >
              {creating ? 'Creating...' : 'Create API Key'}
            </button>
          </form>

          {newApiKey && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              backgroundColor: '#e7f3ff',
              border: '1px solid #b3d9ff',
              borderRadius: '4px',
            }}>
              <h3 style={{ marginTop: 0, color: '#004085' }}>
                ⚠️ Save Your API Key
              </h3>
              <p style={{ color: '#004085', marginBottom: '15px' }}>
                This is the only time you'll see this key. Copy it now!
              </p>
              <div style={{
                position: 'relative',
                backgroundColor: 'white',
                border: '1px solid #b3d9ff',
                borderRadius: '4px',
                padding: '12px',
              }}>
                <textarea
                  readOnly
                  value={newApiKey.api_key}
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    border: 'none',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    resize: 'vertical',
                    backgroundColor: 'transparent',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => copyToClipboard(newApiKey.api_key)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '6px 12px',
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
            </div>
          )}
        </div>

        {/* Test API Key */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px',
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
            Test API Key
          </h2>
          <form onSubmit={handleTestKey}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
              }}>
                API Key
              </label>
              <input
                type="text"
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
                placeholder="Enter API key to test"
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
            <button
              type="submit"
              disabled={testing || !testKey.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: testing || !testKey.trim() ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: testing || !testKey.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {testing ? 'Testing...' : 'Test Key'}
            </button>
          </form>

          {testResult && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              backgroundColor: testResult.valid ? '#d4edda' : '#f8d7da',
              border: `1px solid ${testResult.valid ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '4px',
            }}>
              {testResult.valid ? (
                <div>
                  <h3 style={{ marginTop: 0, color: '#155724' }}>
                    ✅ API Key is Valid
                  </h3>
                  {testResult.user && (
                    <div style={{ marginTop: '10px', color: '#155724' }}>
                      <p><strong>User:</strong> {testResult.user.username}</p>
                      <p><strong>Email:</strong> {testResult.user.email || 'N/A'}</p>
                      <p><strong>Role:</strong> {testResult.user.role}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 style={{ marginTop: 0, color: '#721c24' }}>
                    ❌ API Key is Invalid
                  </h3>
                  <p style={{ color: '#721c24' }}>
                    {testResult.error || 'Invalid API key'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* List API Keys */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
            Your API Keys ({apiKeys.length})
          </h2>
          {apiKeys.length === 0 ? (
            <p style={{ color: '#666' }}>No API keys found. Create one above.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  style={{
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: key.is_active ? 'white' : '#f8f9fa',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>{key.key_name || 'Unnamed Key'}</strong>
                      {!key.is_active && (
                        <span style={{
                          marginLeft: '10px',
                          padding: '2px 8px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                        }}>
                          Inactive
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                      {key.api_key}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      Created: {new Date(key.created_at).toLocaleString()}
                      {key.last_used_at && (
                        <> | Last used: {new Date(key.last_used_at).toLocaleString()}</>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteKey(key.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

