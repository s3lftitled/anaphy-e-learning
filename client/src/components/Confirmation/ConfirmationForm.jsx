import { useState } from "react"
import usePrivateApi from "../../hooks/usePrivateApi"
import { useNavigate, useLocation } from 'react-router-dom'
import "./ConfirmationForm.css"

const ConfirmationForm = () => { 
  const location = useLocation()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const privateAxios = usePrivateApi()

  // Extract id and token from query parameters
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id')
  const token = queryParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!name || !password || !confirmPassword) {
      setError("All fields are required.")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    try {
      // Call the API to complete teacher account registration
      const response = await privateAxios.put(
        `teacher-management/api/v1/complete-teacher/${id}/${token}`,
        {
          name,
          password,
        }, {
          withCredentials: true
        }
      )

      // On success
      setSuccess(response.data.message || "Account activated successfully!");
      setError("") // Reset error
      setName("")
      setPassword("")
      setConfirmPassword("")

      // Redirect to login page after success
      setTimeout(() => {
        navigate('/login')
      }, 3000)

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
      setSuccess("") // Reset success message
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="confirmation-container">
      <nav className="confirmation-nav">
        <div className="nav-content">
          <h1 className="logo">Teacher Account Activation</h1>
        </div>
      </nav>

      <div className="confirmation-content">
        <div className="form-box">
          <div className="form-header">
            <h2>Complete Your Registration</h2>
            <p className="form-subtitle">Create your account to access the AnaphyVerse</p>
          </div>
          
          {error && <div className="alert error-alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>}
          
          {success && <div className="alert success-alert">
            <span className="alert-icon">✓</span>
            <span>{success}</span>
          </div>}
          
          <form onSubmit={handleSubmit}>
            <div className="teacher-input-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <input 
                  id="name"
                  type="text" 
                  placeholder="Enter your full name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
                <span className="input-icon">👤</span>
              </div>
            </div>
            
            <div className="teacher-input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input 
                  id="password"
                  type="password" 
                  placeholder="Create a strong password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <span className="input-icon">🔒</span>
              </div>
              <span className="input-hint">Must be at least 8 characters</span>
            </div>
            
            <div className="teacher-input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input 
                  id="confirmPassword"
                  type="password" 
                  placeholder="Confirm your password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                <span className="input-icon">🔒</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Activating...' : 'Activate Account'}
            </button>
          </form>
          
          <div className="form-footer">
            <p>Already have an account? <a href="/login">Sign in</a></p>
          </div>
        </div>
      </div>
      
      <footer className="confirmation-footer">
        <p>&copy; {new Date().getFullYear()} AnaphyVerse. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ConfirmationForm