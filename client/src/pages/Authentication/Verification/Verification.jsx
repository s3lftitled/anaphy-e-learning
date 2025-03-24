import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../../utils/api'
import './Verification.css'

const Verification = () => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const { email } = useParams()
  const inputRefs = useRef([])
  const navigate = useNavigate()

  useEffect(() => {
    // Page title
    document.title = `AnaphyVerse - Email Verification`
  }, [])

  // Initialize refs array
  if (inputRefs.current.length === 0) {
    inputRefs.current = Array(6).fill(null).map(() => React.createRef())
  }

  const handleChange = (index, e) => {
    const value = e.target.value
    
    // Only proceed if the input is empty or a number
    if (value === '' || /^[a-zA-Z0-9]$/.test(value)) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Auto-focus next input if a number was entered
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
    
    // Check if pasted content contains only numbers
    if (/^\d+$/.test(pastedData)) {
      const pastedArray = pastedData.slice(0, 6).split('')
      const newCode = [...code]
      
      pastedArray.forEach((digit, index) => {
        if (index < 6) {
          newCode[index] = digit
        }
      })
      
      setCode(newCode)
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newCode.findIndex(digit => digit === '')
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        inputRefs.current[nextEmptyIndex].focus()
      } else {
        inputRefs.current[5].focus()
      }
    }
  }

  const handleVerify = async () => {
    const verificationCode = code.join('')
    if (verificationCode.length !== 6) {
      alert('Please enter all 6 digits')
      return
    }

    try {
      setIsLoading(true)
      const response = await api.post(`auth/api/v1/verify-email/${email}`, { verificationCode: verificationCode })
      
      if (response.status === 200) {
        alert(response.data.message)
        navigate('/login')
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message)
      } else {
        alert('An error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="verification-container">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="verification-title">Please Verify Account</h2>

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
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="verify-button"
          disabled={isLoading || code.some(digit => digit === '')}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  )
}

export default Verification