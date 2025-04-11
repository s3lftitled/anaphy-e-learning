import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../../utils/api'
import './Verification.css'

const Verification = () => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [error, setError] = useState('') 
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [resendMessage, setResendMessage ] = useState('')
  const { email } = useParams()
  const inputRefs = useRef([])
  const navigate = useNavigate()

  // Initialize refs array
  if (inputRefs.current.length === 0) {
    inputRefs.current = Array(6).fill(null).map(() => React.createRef())
  }

  // Focus first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  // Handle resend timer
  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prevTimer => prevTimer - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      setResendDisabled(false)
    }

    return () => clearInterval(interval)
  }, [resendTimer])

  const handleChange = (index, e) => {

    setResendMessage('')

    const value = e.target.value
    
    // Only proceed if the input is empty or a single alphanumeric character
    if (value === '' || /^[a-zA-Z0-9]$/.test(value)) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Auto-focus next input if a character was entered
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1].focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // If current input is empty, move to previous input
        inputRefs.current[index - 1].focus()
      } else {
        // Clear current input
        const newCode = [...code]
        newCode[index] = ''
        setCode(newCode)
      }
      e.preventDefault()
    }

    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus()
    }

    // Handle right arrow
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    // Check if pasted content contains only alphanumeric characters
    if (/^[a-zA-Z0-9]+$/.test(pastedData)) {
      const pastedArray = pastedData.slice(0, 6).split('')
      const newCode = [...code]
      
      pastedArray.forEach((char, index) => {
        if (index < 6) {
          newCode[index] = char
        }
      })
      
      setCode(newCode)
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newCode.findIndex(char => char === '')
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        inputRefs.current[nextEmptyIndex].focus()
      } else {
        inputRefs.current[5].focus()
      }
    }
  }

  const closeModal = () => {
    setShowModal(false)
    navigate('/login')
  }

  const handleVerify = async () => {
    const verificationCode = code.join('')
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setError('')
    
    try {
      setIsLoading(true)
      const response = await api.post(`auth/api/v1/verify-email/${email}`, { verificationCode: verificationCode })
      
      if (response.status === 200) {
        setModalMessage(response.data.message || 'Your account has been successfully verified! You can now log in.')
        setShowModal(true)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message)
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      setResendDisabled(true)
      setResendTimer(60) // 60 second cooldown
      
      const response = await api.post(`auth/api/v1/resend-verification/${email}`)
      
      if (response.status === 200) {
        setResendMessage(response.data.message)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message)
      } else {
        setError('An error occurred. Please try again.')
      }
      setResendDisabled(false)
      setResendTimer(0)
    }
  }

  // Format email for display (obscure middle part)
  const formatEmail = (email) => {
    if (!email) return '';
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    
    const name = parts[0];
    const domain = parts[1];
    
    if (name.length <= 3) return email;
    
    return `${name.substring(0, 3)}${'*'.repeat(Math.min(5, name.length - 3))}@${domain}`;
  }

  return (
    <div className="verification-container">
      {/* Success Modal */}
      {showModal && (
        <div className="verification-modal-overlay">
          <div className="verification-modal-content">
            <div className="verification-modal-header">
              <h3>Verification Status</h3>
              <button className="verification-modal-close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="verification-modal-body success">
              <div className="verification-success-icon"></div>
              <p>{modalMessage}</p>
            </div>
            <div className="verification-modal-footer">
              <button className="verification-modal-btn" onClick={closeModal}>
                Continue to Login
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="verification-card">
        <div className="icon-container">
          <svg 
            className="verification-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <h2 className="verification-title">Verify Your Account</h2>
        
        <p className="verification-email">{formatEmail(email)}</p>
        
        <p className="verification-message">
          We've sent a 6-character code to your email. 
          Enter the code below to verify your account.
        </p>

        <div className="input-group">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              ref={(ref) => inputRefs.current[index] = ref}
              className="verification-input"
              autoComplete="off"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Display error message if exists */}
        {error && (
          <div className="verification-error-message">
            {error}
          </div>
        )}

        <button
          onClick={handleVerify}
          className={`verify-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || code.some(digit => digit === '')}
        >
          {isLoading ? '' : 'Verify Account'}
        </button>
        
        <div className="resend-container">
          <p className="resend-text">Didn't receive a code?</p>
          <button 
            className="resend-button" 
            onClick={handleResendCode}
            disabled={resendDisabled}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
          </button>
          { resendMessage && <p className='resend-text'>{resendMessage}</p> }
        </div>
      </div>
    </div>
  )
}

export default Verification