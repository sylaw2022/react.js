'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.5rem',
        fontFamily: 'Arial, sans-serif'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <nav style={{
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '40px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>
            React App
          </h1>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ color: '#666' }}>
                  Welcome, <strong>{user.username}</strong>!
                </span>
                <Link 
                  href="/api-keys"
                  style={{
                    padding: '8px 16px',
                    color: '#007bff',
                    textDecoration: 'none',
                    border: '1px solid #007bff',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  API Keys
                </Link>
                <button
                  onClick={handleLogout}
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
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  style={{
                    padding: '8px 16px',
                    color: '#007bff',
                    textDecoration: 'none',
                    border: '1px solid #007bff',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  Register
                </Link>
                <Link 
                  href="/validate-token"
                  style={{
                    padding: '8px 16px',
                    color: '#6c757d',
                    textDecoration: 'none',
                    border: '1px solid #6c757d',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  Validate Token
                </Link>
                <Link 
                  href="/encryption-test"
                  style={{
                    padding: '8px 16px',
                    color: '#6c757d',
                    textDecoration: 'none',
                    border: '1px solid #6c757d',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  Encryption Test
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          {user ? (
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                color: '#333',
                marginBottom: '20px',
              }}>
                Welcome, <strong>{user.username}</strong>!
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
                You are successfully logged in
              </p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link 
                  href="/api-keys"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: '500',
                  }}
                >
                  Manage API Keys
                </Link>
                <div style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}>
                  ✅ Authentication Active
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
                Welcome! Please register or login to continue.
              </p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <Link 
                  href="/register"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: '500',
                  }}
                >
                  Get Started
                </Link>
                <Link 
                  href="/login"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    color: '#007bff',
                    textDecoration: 'none',
                    border: '2px solid #007bff',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: '500',
                  }}
                >
                  Login
                </Link>
              </div>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link 
                  href="/validate-token"
                  style={{
                    color: '#6c757d',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                  }}
                >
                  Validate Token →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


