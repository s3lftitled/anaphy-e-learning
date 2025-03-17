import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import api from '../../utils/api'
import './Register.css'

const Register = () => {
  const [registrationData, setRegistrationData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [captchaValue, setCaptchaValue] = useState(null)
  const navigate = useNavigate()

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setRegistrationData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleCaptcha = (value) => {
    setCaptchaValue(value) // Save reCAPTCHA token
  }

  const handleRegistration = async (e) => {
    e.preventDefault()

    if (!registrationData.email || !registrationData.password || !registrationData.name) {
      alert('Please fill in all required fields')
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
        recaptcha: captchaValue, // Send reCAPTCHA token to backend
      })

      console.log(response)
      if (response.status === 201) {
        alert('Registration successful, please verify your email')
        navigate(`/verification/${registrationData.email}`)
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 429) {
            alert('Too many requests. Please try again after 5 minutes');
        } else {
            alert(error.response.data?.message || 'An error occurred. Please try again.');
        }
      } else {
          alert('An error occurred. Please check your network connection and try again.');
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register">
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      <div className="glow glow-3"></div>

      <div className="register-img-container">
        <img className="register-img" src="skull.png" alt="Register" />
      </div>

      <nav className="register-nav">
        <Link className="login-btn" to="/login">Login</Link>
        <Link className="nav-link">About</Link>
        <Link className="nav-link">Contact</Link>
        <Link className="nav-link">Home</Link>
      </nav>

      <div className="form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleRegistration}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" placeholder="e.g., John Doe" required onChange={handleFieldChange} />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="yourname@panpacificu.edu.ph" required onChange={handleFieldChange} />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required onChange={handleFieldChange} />
          </div>

          <div className="input-group">
            <label htmlFor="password-confirmation">Confirm Password</label>
            <input type="password" id="password-confirmation" name="passwordConfirmation" placeholder="••••••••" required onChange={handleFieldChange} />
          </div>

          {/* Google reCAPTCHA */}
          <div className="captcha-container">
            <ReCAPTCHA
              sitekey="6Lfl_9QqAAAAAAFX9cr264UKhJVVRXlawTuXD-y0" // Your reCAPTCHA site key
              onChange={handleCaptcha}
            />
          </div>

          <button type="submit">{isLoading ? 'Registering...' : 'Register'}</button>
        </form>
      </div>
    </div>
  )
}

export default Register
