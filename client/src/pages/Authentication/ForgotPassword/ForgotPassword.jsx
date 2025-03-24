import { useState, useEffect } from 'react'
import api from '../../../utils/api'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Page title
    document.title = `AnaphyVerse - Forgot Password`
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await api.post('auth/api/v1/forgot-password', { email: email })

      if (response.status === 200) {
        setIsSubmitted(true)
      }
    } catch (error) {
      setError(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="forgot-password-container">
        <div className="form-container success">
          <div className="cosmic-circle"></div>
          <div className="cosmic-circle secondary"></div>
          
          <div className="success-content">
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>Check Your Email</h2>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
            <p className="instruction-text">Please check your inbox and follow the instructions to reset your password.</p>
            <button className="back-button" onClick={() => setIsSubmitted(false)}>
              Back to Reset Form
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form-container">
        <div className="cosmic-circle"></div>
        <div className="cosmic-circle secondary"></div>
        
        <div className="forgot-password-form-content">
          <div className="forgot-password-form-header">
            <h1>Recover Your Password</h1>
            <div className="title-accent"></div>
            <p>Enter your email address and we'll send you instructions to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="forgot-password-form-group">
              <label htmlFor="email">Email Address</label>
              <div className="forgot-password-input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                'Send Reset Link'
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

export default ForgotPassword