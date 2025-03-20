import React, { useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import './SystemModel.css'

const SystemModelPage = () => {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useUser()
  
  // Get the topic data passed from the homepage
  const { topic } = location.state || {}
  
  useEffect(() => {
    // If there's no topic data, redirect back to homepage
    if (!topic) {
      navigate('/')
    }
    
    // Page title
    document.title = `${topic?.name || 'System'} - Human Anatomy Explorer`
    
    // Scroll to top on page load
    window.scrollTo(0, 0)
  }, [topic, navigate])
  
  const handleBackClick = () => {
    navigate('/home')
  }
  
  if (!topic) {
    return null // Will redirect via useEffect
  }
  
  return (
    <div className="system-model-page">
      <main className="model-page-content">
        <div className="model-page-header">
          <button className="back-button" onClick={handleBackClick}>
            ← Back to Systems
          </button>
          <h1>{topic.name}</h1>
        </div>
        
        <div className="model-container">
          <iframe
            id="embedded-human"
            frameBorder="0"
            allowFullScreen={true}
            loading="lazy"
            src={topic.modelSrc}
            title={`${topic.name} 3D Model`}
          ></iframe>
        </div>
      </main>
    </div>
  )
}

export default SystemModelPage