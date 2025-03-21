import { useState, useEffect } from "react"
import usePrivateApi from "../../hooks/usePrivateApi"
import { useNavigate, useLocation } from 'react-router-dom'
import "./ConfirmationForm.css" // Import the CSS file for styling

const ConfirmationForm = () => { 
  const location = useLocation() // Get the current location (URL)
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const privateAxios = usePrivateApi()

  // Extract id and token from query parameters
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id')
  const token = queryParams.get('token')

  const handleSubmit = async (e) => {
    console.log(id, token)
    e.preventDefault()

    if (!name || !password || !confirmPassword) {
      setError("All fields are required.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
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
      setSuccess(response.data.message)
      setError("") // Reset error
      setName("")
      setPassword("")
      setConfirmPassword("")

      // Optionally, redirect to login or dashboard page
      setTimeout(() => {
        navigate('/login') // Adjust route as needed
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
      setSuccess("") // Reset success message
    }
  }

  return (
    <div className="confirmation-container">
      <nav className="confirmation-nav">
        <h1 className="logo">Teacher Confirmation</h1>
      </nav>

      <div className="confirmation-content">
        <div className="form-box">
          <h2>Complete Your Registration</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
            <button type="submit" className="submit-btn">Activate Account</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationForm
