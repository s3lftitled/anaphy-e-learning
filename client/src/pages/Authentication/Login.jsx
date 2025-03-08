import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import api from '../../utils/api'
import useAuth from '../../hooks/useAuth'
import './Login.css'


const Login = () => {
  const [ loginData, setLoginData ] = useState({})
  const [captchaToken, setCaptchaToken] = useState(null)
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    try {
      formattedValue = JSON.parse(value)
    } catch (error) {
      // Ignore parsing errors and keep the value as a string
    }

    setLoginData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }))
  }

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token)
    //store captcha
  }

  
  const handleLogin = async (e) => {
    if (!loginData.email || !loginData.password || !captchaToken) {
      alert('Please fill in all the required fields and complete the Captcha')
      return
    }
    e.preventDefault()
    try {
      const response = await api.post('auth/api/v1/login', { email: loginData.email, password: loginData.password },
        { withCredentials: true }
      )

      if (response.status === 200) {
        alert(response.data.message)
        console.log(response.data.accessToken)
        setAuth({ accessToken: response.data.accessToken})
        navigate('/home')
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message)
      } else {
        alert('An error occurred. Please try again.')
      }
    }
  }

  return (
    <div className="login">
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      <div className="glow glow-3"></div>

      <img className="login-img" src="skull1.png" alt="Skull Logo" />

      <nav className="login-nav">
        <button className="login-button" href="">Login</button>
        <Link className='nav-link' href="">About</Link>
        <Link className='nav-link' href="">Contact</Link>
        <Link className='nav-link' href="">Home</Link>
      </nav>

      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="yourname@panpacificu.edu.ph" 
              required 
              onChange={handleFieldChange}
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="••••••••" 
              required 
              onChange={handleFieldChange}
            />
          </div>

          <div className="recaptcha-container">
            <ReCAPTCHA
              sitekey="6Lfl_9QqAAAAAAFX9cr264UKhJVVRXlawTuXD-y0"
              onChange={handleCaptchaChange}
            />
          </div>

          <div className='login-options'>
            <button type="submit">Login</button>
            <Link className='signup-prompt' to='/register'>Don't have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login