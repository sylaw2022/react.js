'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [registrationToken, setRegistrationToken] = useState(null)
  const [userData, setUserData] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email || undefined,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Registration successful!' })
        
        // Store token and user data to display
        if (data.token) {
          setRegistrationToken(data.token)
          setUserData(data.user)
          // Also store in localStorage
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Registration failed' })
      }
    } catch (error) {
      console.error('Registration error:', error)
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
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
        maxWidth: '400px',
      }}>
        <h1 style={{
          marginBottom: '30px',
          textAlign: 'center',
          color: '#333',
          fontSize: '2rem',
        }}>
          Register
        </h1>

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

        {registrationToken && (
          <div style={{
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d9ff',
            borderRadius: '4px',
          }}>
            <h2 style={{
              marginTop: 0,
              marginBottom: '15px',
              color: '#004085',
              fontSize: '1.2rem',
            }}>
              ✅ Registration Successful!
            </h2>
            
            {userData && (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '0 0 10px 0', color: '#004085', fontWeight: '500' }}>
                  Welcome, <strong>{userData.username}</strong>!
                </p>
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#004085',
                fontWeight: '500',
                fontSize: '0.9rem',
              }}>
                Your JWT Token:
              </label>
              <div style={{
                position: 'relative',
                backgroundColor: 'white',
                border: '1px solid #b3d9ff',
                borderRadius: '4px',
                padding: '12px',
              }}>
                <textarea
                  readOnly
                  value={registrationToken}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    border: 'none',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    resize: 'vertical',
                    backgroundColor: 'transparent',
                    color: '#333',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(registrationToken)
                    setMessage({ type: 'success', text: 'Token copied to clipboard!' })
                    setTimeout(() => setMessage({ type: '', text: '' }), 2000)
                  }}
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
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '0.75rem',
                color: '#666',
                fontStyle: 'italic',
              }}>
                Save this token securely. You'll need it to access protected endpoints.
              </p>
            </div>

            <button
              onClick={() => {
                router.push('/')
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Continue to Home
            </button>
          </div>
        )}

        {!registrationToken && (
          <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
            }}>
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.username ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder="Enter username"
            />
            {errors.username && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                {errors.username}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
            }}>
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.email ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder="Enter email"
            />
            {errors.email && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
            }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.password ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder="Enter password"
            />
            {errors.password && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                {errors.password}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
            }}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.confirmPassword ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <span style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                {errors.confirmPassword}
              </span>
            )}
          </div>

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
              marginBottom: '20px',
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        )}

        <div style={{ textAlign: 'center', color: '#666' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
            Login here
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}


