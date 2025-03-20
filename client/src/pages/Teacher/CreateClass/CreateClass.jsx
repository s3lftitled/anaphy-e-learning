import React, { useState } from 'react'
import usePrivateApi from '../../../hooks/usePrivateApi'
import { useUser } from '../../../context/UserContext'
import './CreateClass.css'

const CreateClassPage = () => {
  const [className, setClassName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [classCode, setClassCode] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const privateAxios = usePrivateApi()
  const { user } = useUser()

  const handleCreateClass = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
  
    // Validate class name
    if (className.length < 6 || className.length > 14) {
      setError('Class name must be between 6 and 14 characters')
      setIsLoading(false)
      return
    }
    
    try {
        const response = await privateAxios.post(`class/api/v1/create-class/teacher/${user.id}`, { className }, {
          withCredentials: true
        })

        if (response.status === 201) {
          setTimeout(() => {
            setClassCode(response.data.code)
            setSuccessMessage('Class created successfully!')
            setShowSuccess(true)
            setClassName('')
            setIsLoading(false)
          }, 1500) 
        }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the class')
      setIsLoading(false)
    }
  }
  
  const handleCloseSuccess = () => {
    setShowSuccess(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(classCode)
    const copyBtn = document.getElementById('copy-btn')
    copyBtn.innerText = 'Copied!'
    setTimeout(() => {
      copyBtn.innerText = 'Copy'
    }, 2000)
  }

  return (
    <div className="create-class-container">
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      <div className="glow glow-3"></div>
      
      <div className="create-class-card">
        <div className="card-header">
          <h1>Create New Class</h1>
          <p>Set up a virtual classroom for your students</p>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleCreateClass}>
            <div className="form-group">
              <label htmlFor="className">Class Name</label>
              <div className="input-container">
                <input
                  type="text"
                  id="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Enter class name (6-14 characters)"
                  required
                />
                <span className="char-count" style={{ color: className.length > 14 ? 'red' : 'white' }}>
                  {className.length}/14
                </span>
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
            
            <button 
              type="submit" 
              className={`create-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loader"></span>
                  <span>Creating...</span>
                </>
              ) : (
                'Create Class'
              )}
            </button>
          </form>
          
          <div className="tips-section">
            <h3>Tips for Class Creation</h3>
            <ul>
              <li>Choose a descriptive name that students can easily identify</li>
              <li>You'll be able to add students after creating the class</li>
              <li>Class codes can be shared with students directly</li>
            </ul>
          </div>
        </div>
      </div>
      
      {showSuccess && (
        <div className="success-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{successMessage}</h2>
              <button className="close-btn" onClick={handleCloseSuccess}>×</button>
            </div>
            <div className="modal-body">
              <p>Your class has been created successfully. Share this code with your students:</p>
              <div className="code-container">
                <span className="class-code">{classCode}</span>
                <button id="copy-btn" className="copy-btn" onClick={copyToClipboard}>Copy</button>
              </div>
              <div className="next-steps">
                <h4>Next Steps:</h4>
                <ul>
                  <li>Invite students using the class code</li>
                  <li>Manage student grades and performances</li>
                  <li>Configure class settings from your dashboard</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-btn" onClick={handleCloseSuccess}>Close</button>
              <button className="primary-btn" onClick={() => window.location.href = '/teacher-dashboard'}>Go to Class Dashboard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateClassPage