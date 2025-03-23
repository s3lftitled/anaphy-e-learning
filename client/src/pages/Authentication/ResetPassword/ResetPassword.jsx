import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './ResetPassword.css'
import api from '../../../utils/api'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [tokenValid, setTokenValid] = useState(true)
  const { resetToken } = useParams()

  useEffect(() => {
    console.log(resetToken)
    setToken(resetToken || '')
    
    if (!resetToken) {
      setTokenValid(false)
    }
  }, [])

  useEffect(() => {
    // Check if passwords match and are not empty
    setIsValid(password === confirmPassword && password.length > 0)
  }, [password, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isValid) {
      return
    }
    
    setError('')
    
    try {
      setIsLoading(true)
      const response = await api.put(`auth/api/v1/reset-password/${resetToken}`, { newPassword: password, newPasswordConfirmation: confirmPassword })
    
      if (response.status == 200) {
        setIsSubmitted(true)
      }
    } catch (error) {
      setError(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="reset-password-container">
        <div className="form-container error-container">
          <div className="cosmic-circle"></div>
          <div className="cosmic-circle secondary"></div>
          
          <div className="error-content">
            <div className="error-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2>Invalid or Expired Link</h2>
            <p>The password reset link is invalid or has expired.</p>
            <a href="/forgot-password" className="action-button">
              Request New Reset Link
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="reset-password-container">
        <div className="form-container success-container">
          <div className="cosmic-circle"></div>
          <div className="cosmic-circle secondary"></div>
          
          <div className="success-content">
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>Password Reset Complete</h2>
            <p>Your password has been successfully reset.</p>
            <p className="instruction-text">You can now use your new password to log in to your account.</p>
            <a href="/login" className="action-button">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reset-password-container">
      <div className="form-container">
        <div className="cosmic-circle"></div>
        <div className="cosmic-circle secondary"></div>
        
        <div className="form-content">
          <div className="form-header">
            <h1>Reset Your Password</h1>
            <div className="title-accent"></div>
            <p>Create a new password for your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              {confirmPassword && password !== confirmPassword && 
                <div className="error-message">Passwords do not match</div>
              }
              {error && <div className="error-message">{error}</div>}
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''} ${!isValid ? 'disabled' : ''}`}
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="form-footer">
            <a href="/login" className="back-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword