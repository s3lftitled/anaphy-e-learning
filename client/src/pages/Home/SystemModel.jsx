import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import './SystemModel.css'

const SystemModelPage = () => {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useUser()
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Get the topic data passed from the homepage
  const { topic } = location.state || {}
  
  useEffect(() => {
    // If there's no topic data, redirect back to homepage
    if (!topic) {
      navigate('/')
    }
    
    // Page title
    document.title = `${topic?.name || 'System'} - AnaphyVerse`
    
    // Scroll to top on page load
    window.scrollTo(0, 0)
    
    // Add event listener for screen orientation changes
    const handleOrientationChange = () => {
      // Adjust UI based on orientation
      const isLandscape = window.matchMedia("(orientation: landscape)").matches
      document.documentElement.setAttribute('data-orientation', isLandscape ? 'landscape' : 'portrait')
    };
    
    window.addEventListener('resize', handleOrientationChange)
    handleOrientationChange() // Initial check
    
    return () => {
      window.removeEventListener('resize', handleOrientationChange)
    }
  }, [topic, navigate])
  
  const handleBackClick = () => {
    navigate('/home')
  }
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }
  
  if (!topic) {
    return null // Will redirect via useEffect
  }
  
  return (
    <div className={`system-model-page ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="mobile-header">
        <button className="back-button mobile" onClick={handleBackClick}>
          <span className="back-icon">←</span>
        </button>
        <h2 className="mobile-title">{topic.name}</h2>
        <button className="fullscreen-toggle" onClick={toggleFullscreen}>
          {isFullscreen ? '↙' : '↗'}
        </button>
      </div>
      
      <main className="model-page-content">
        <div className="model-page-header">
          <button className="back-button desktop" onClick={handleBackClick}>
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
          
          <div className="model-controls">
            <button className="fullscreen-button" onClick={toggleFullscreen}>
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
            </button>
          </div>
        </div>
        
        <div className="model-info-panel">
          <h3>About {topic.name}</h3>
          <p className="model-description">{topic.description || 'Explore this 3D model to learn more about human anatomy.'}</p>
        </div>
      </main>
    </div>
  )
}

export default SystemModelPage