import { useState, useEffect } from 'react'
import usePrivateApi from '../../hooks/usePrivateApi'
import './styles.css'

const CreateLesson = () => {
  const [title, setTitle] = useState('')
  const [topicId, setTopicId] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState(1)
  const [topics, setTopics] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const privateAxios = usePrivateApi()

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await privateAxios.get('http://localhost:5000/topics/api/v1/fetch-all-topics', {}, {
          withCredentials: true
        })
        console.log(response)
        setTopics(response.data.data)
      } catch (err) {
        setError('Error fetching topics')
      }
    }
    
    fetchTopics()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      // Validate inputs
      if (!title || !topicId || !description) {
        return setError('All fields are required')
      }
      
      const response = await privateAxios.post(`http://localhost:5000/lessons/api/v1/create-lesson/${topicId}`, {
        title,
        topicId,
        description,
        order: parseInt(order)
      }, { withCredentials: true })
      
      setSuccess('Lesson created successfully!');
      setTitle('')
      setDescription('')
      setOrder(1)
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating lesson')
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Create New Lesson</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Lesson Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Topic</label>
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="form-select"
          >
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic._id} value={topic._id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            rows={4}
          />
        </div>
        
        <div className="form-group">
          <label>Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="form-input"
            min="1"
          />
        </div>
        
        <button type="submit" className="submit-button">
          Create Lesson
        </button>
      </form>
    </div>
  )
}

export default CreateLesson