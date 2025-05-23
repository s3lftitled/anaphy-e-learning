import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import api from '../../../utils/api'
import './Register.css'

const RECAPTCHA_PROD = import.meta.env.VITE_RECAPTCHA

const Register = () => {
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [captchaValue, setCaptchaValue] = useState(null)
  const [error, setError] = useState('') 
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const navigate = useNavigate()

  const recaptchaRef = useRef(null)

  useEffect(() => {
    // Page title
    document.title = `AnaphyVerse - Register`
  }, [])

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setRegistrationData((prevData) => ({ ...prevData, [name]: value }))
    
    // Clear error when user starts typing again
    if (error) {
      setError('')
    }
  }

  const handleCaptcha = (value) => {
    setCaptchaValue(value)
  }

  const resetCaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
      setCaptchaValue(null)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    // If there was no error, navigate after closing
    if (!error) {
      navigate(`/verification/${registrationData.email}`)
    }
  }

  const handleRegistration = async (e) => {
    e.preventDefault()
    setError('')

    if (!registrationData.email || !registrationData.password || !registrationData.name) {
      setError('Please fill in all required fields')
      return
    }

    if (registrationData.password !== registrationData.passwordConfirmation) {
      setError('Passwords do not match')
      return
    }

    if (!captchaValue) {
      setError('Please complete the reCAPTCHA')
      return
    }

    try {
      setIsLoading(true)
      const response = await api.post('auth/api/v1/registration', {
        name: registrationData.name,
        email: registrationData.email,
        password: registrationData.password,
        passwordConfirmation: registrationData.passwordConfirmation,
        recaptcha: captchaValue,
      })

      if (response.status === 201) {
        // Show success modal instead of alert
        setModalMessage(response.data.message || 'Registration successful! Please check your email to verify your account.')
        setShowModal(true)
      }
    } catch (error) {
      resetCaptcha()
      if (error.response) {
        if (error.response.status === 429) {
          setError('Too many requests. Please try again after 5 minutes')
        } else {
          setError(error.response.data?.message || 'An error occurred. Please try again.')
        }
      } else {
        setError('An error occurred. Please check your network connection and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register">
      <div className="background-glows">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
        <div className="glow glow-3"></div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Registration Status</h3>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body success">
              <div className="success-icon"></div>
              <p>{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn" onClick={closeModal}>Continue</button>
            </div>
          </div>
        </div>
      )}

      <div className="register-content">
        <div className="register-img-container">
          <img className="register-img" src="registration-image.png" alt="Register" />
        </div>

        <nav className="register-nav">
          <Link className="login-btn" to="/login">Login</Link>
          <Link className='nav-link' to="/">Home</Link>  
        </nav>

        <div className="register-form-container">
          <h2>Sign Up</h2>
          
          {/* Display error message if exists */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleRegistration}>
            <div className="register-input-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="e.g., John Doe" 
                value={registrationData.name}
                required 
                onChange={handleFieldChange} 
              />
            </div>

            <div className="register-input-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="yourname@panpacificu.edu.ph" 
                value={registrationData.email}
                required 
                onChange={handleFieldChange} 
              />
            </div>

            <div className="register-input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                value={registrationData.password}
                required 
                onChange={handleFieldChange} 
              />
            </div>

            <div className="register-input-group">
              <label htmlFor="passwordConfirmation">Confirm Password</label>
              <input 
                type="password" 
                id="passwordConfirmation" 
                name="passwordConfirmation" 
                placeholder="••••••••" 
                value={registrationData.passwordConfirmation}
                required 
                onChange={handleFieldChange} 
              />
            </div>

            <div className="captcha-container">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_PROD}
                onChange={handleCaptcha}
              />
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register