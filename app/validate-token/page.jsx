'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ValidateTokenPage() {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleTokenChange = (e) => {
    setToken(e.target.value)
    // Clear previous results when token changes
    if (result || error) {
      setResult(null)
      setError(null)
    }
  }

  const handleValidate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    if (!token.trim()) {
      setError('Please enter a token')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          valid: true,
          user: data.user,
          timestamp: data.timestamp,
        })
      } else {
        setError(data.message || data.error || 'Token validation failed')
      }
    } catch (err) {
      console.error('Token validation error:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setToken('')
    setResult(null)
    setError(null)
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '600px',
      }}>
        <h1 style={{
          marginBottom: '10px',
          textAlign: 'center',
          color: '#333',
          fontSize: '2rem',
        }}>
          Validate Token
        </h1>
        
        <p style={{
          marginBottom: '30px',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem',
        }}>
          Enter a JWT token to validate and retrieve user information
        </p>

        <form onSubmit={handleValidate}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
            }}>
              JWT Token
            </label>
            <textarea
              value={token}
              onChange={handleTokenChange}
              placeholder="Paste your JWT token here (Bearer prefix optional)"
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                border: `1px solid ${error ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'monospace',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              disabled={loading}
            />
            {error && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                {error}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              type="submit"
              disabled={loading || !token.trim()}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: loading || !token.trim() ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading || !token.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Validating...' : 'Validate Token'}
            </button>
            
            {(token || result || error) && (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {result && result.valid && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
          }}>
            <h2 style={{
              marginTop: 0,
              marginBottom: '15px',
              color: '#155724',
              fontSize: '1.2rem',
            }}>
              ✅ Token Valid
            </h2>
            
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{
                margin: '0 0 10px 0',
                color: '#155724',
                fontSize: '1rem',
                fontWeight: '600',
              }}>
                User Information:
              </h3>
              <div style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '14px',
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>ID:</strong> {result.user.id}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Username:</strong> {result.user.username}
                </div>
                {result.user.email && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Email:</strong> {result.user.email}
                  </div>
                )}
                <div style={{ marginBottom: '8px' }}>
                  <strong>Role:</strong> {result.user.role}
                </div>
                {result.user.created_at && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Created:</strong> {new Date(result.user.created_at).toLocaleString()}
                  </div>
                )}
                {result.user.updated_at && (
                  <div>
                    <strong>Updated:</strong> {new Date(result.user.updated_at).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {result.timestamp && (
              <div style={{
                fontSize: '0.85rem',
                color: '#155724',
                fontStyle: 'italic',
              }}>
                Validated at: {new Date(result.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        )}

        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #eee',
        }}>
          <Link href="/" style={{ 
            color: '#666', 
            textDecoration: 'none', 
            fontSize: '14px',
            marginRight: '20px',
          }}>
            ← Back to Home
          </Link>
          <Link href="/login" style={{ 
            color: '#007bff', 
            textDecoration: 'none', 
            fontSize: '14px',
          }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

