import React, { useState, useEffect } from 'react'
import usePrivateApi from '../../hooks/usePrivateApi'
import './styles.css'

const CreateMultiplePages = () => {
  const [topics, setTopics] = useState([])
  const [topicId, setTopicId] = useState('')
  const [lessons, setLessons] = useState([])
  const [lessonId, setLessonId] = useState('')
  const [pages, setPages] = useState([{ title: '', content: '', link: '', order: 1 }])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const privateAxios = usePrivateApi()

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await privateAxios.get('http://localhost:5000/topics/api/v1/fetch-all-topics', {}, {
          withCredentials: true
        })
        setTopics(response.data.data)
      } catch (err) {
        setError('Error fetching topics')
      }
    }
    fetchTopics()
  }, [])

  useEffect(() => {
    if (!topicId) return
    const fetchLessons = async () => {
      try {
        const response = await privateAxios.get(`http://localhost:5000/topics/api/v1/fetch-topic-lessons/${topicId}`, {}, {
          withCredentials: true
        })
        setLessons(response.data.topicLessons)
      } catch (err) {
        setError('Error fetching lessons')
      }
    }
    fetchLessons()
  }, [topicId])

  const handlePageChange = (index, field, value) => {
    const updatedPages = [...pages]
    updatedPages[index] = { ...updatedPages[index], [field]: value }
    setPages(updatedPages)
  }

  const addPage = () => {
    setPages([...pages, { title: '', content: '', link: '', order: pages.length + 1 }])
  }

  const removePage = (index) => {
    if (pages.length > 1) {
      const updatedPages = pages.filter((_, i) => i !== index);
      const reorderedPages = updatedPages.map((page, i) => ({ ...page, order: i + 1 }))
      setPages(reorderedPages)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      if (!lessonId) {
        return setError('Lesson is required')
      }
      
      const invalidPages = pages.filter(page => !page.title || !page.content || !page.link)
      if (invalidPages.length > 0) {
        return setError('All page fields are required')
      }
      
      const response = await privateAxios.post(`http://localhost:5000/pages/api/v1/create-multiple-pages/${lessonId}`, { pages, lessonId }, {
        withCredentials: true
      })
      if (response.status)
        setSuccess('Pages created successfully!');
        setPages([{ title: '', content: '', link: '', order: 1 }])
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating pages')
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Create Multiple Pages</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Topic</label>
          <select value={topicId} onChange={(e) => setTopicId(e.target.value)} className="form-select">
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic._id} value={topic._id}>{topic.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Lesson</label>
          <select value={lessonId} onChange={(e) => setLessonId(e.target.value)} className="form-select">
            <option value="">Select a lesson</option>
            {lessons.map((lesson) => (
              <option key={lesson._id} value={lesson._id}>{lesson.title}</option>
            ))}
          </select>
        </div>
        
        <div className="pages-container">
          <h3>Pages</h3>
          {pages.map((page, index) => (
            <div key={index} className="page-form">
              <h4>Page {index + 1}</h4>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={page.title} onChange={(e) => handlePageChange(index, 'title', e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea value={page.content} onChange={(e) => handlePageChange(index, 'content', e.target.value)} className="form-textarea" rows={4} />
              </div>
              <div className="form-group">
                <label>Link</label>
                <input type="text" value={page.link} onChange={(e) => handlePageChange(index, 'link', e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input type="number" value={page.order} onChange={(e) => handlePageChange(index, 'order', parseInt(e.target.value))} className="form-input" min="1" />
              </div>
              <button type="button" className="remove-button" onClick={() => removePage(index)}>Remove Page</button>
            </div>
          ))}
          <button type="button" className="add-button" onClick={addPage}>Add Another Page</button>
        </div>
        <button type="submit" className="submit-button">Create Pages</button>
      </form>
    </div>
  )
}

export default CreateMultiplePages