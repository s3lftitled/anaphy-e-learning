import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
  const navigate = useNavigate()

  useEffect(() => {
    // Page title
    document.title = `AnaphyVerse - Register`
  }, [])

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setRegistrationData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleCaptcha = (value) => {
    setCaptchaValue(value)
  }

  const handleRegistration = async (e) => {
    e.preventDefault()

    if (!registrationData.email || !registrationData.password || !registrationData.name) {
      alert('Please fill in all required fields')
      return
    }

    if (registrationData.password !== registrationData.passwordConfirmation) {
      alert('Passwords do not match')
      return
    }

    if (!captchaValue) {
      alert('Please complete the reCAPTCHA')
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
        alert(response.data.message)
        navigate(`/verification/${registrationData.email}`)
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 429) {
          alert('Too many requests. Please try again after 5 minutes')
        } else {
          alert(error.response.data?.message || 'An error occurred. Please try again.')
        }
      } else {
        alert('An error occurred. Please check your network connection and try again.')
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