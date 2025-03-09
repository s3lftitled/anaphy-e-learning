import { useState } from 'react'
import axios from 'axios'
import './styles.css'

const CreateTopic = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      // Validate inputs according to backend requirements
      if (!name || !description) {
        return setError('Name and description are required')
      }
      
      if (name.length >= 80) {
        return setError('Topic name cannot be longer than 80 characters')
      }
      
      if (description.length >= 600) {
        return setError('Topic description cannot be longer than 600 characters')
      }
      
      const response = await axios.post('http://localhost:5000/topics/api/v1/create-topic', { name, description })
      
      if (response.status === 201) {
        setSuccess('Topic created successfully!')
        setName('')
        setDescription('')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating topic')
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Create New Topic</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Topic Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            maxLength={79}
          />
          <small className="char-count">{name.length}/80 characters</small>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            rows={4}
            maxLength={599}
          />
          <small className="char-count">{description.length}/600 characters</small>
        </div>
        
        <button type="submit" className="submit-button">
          Create Topic
        </button>
      </form>
    </div>
  )
}

export default CreateTopic