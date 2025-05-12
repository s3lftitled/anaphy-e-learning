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
  const [activeModel, setActiveModel] = useState('main') // 'main' or 'heart'
  
  // Get the topic data passed from the homepage
  const { topic } = location.state || {}
  
  // Define heart model data
  const heartModel = {
    name: "Anatomy of Heart",
    backgroundImage: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExenN5Mzc2ZTk4bWxxMWlmeGVmdzg2d2gxbnZ4NXN3MzY5aXZib3ZuYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8f0y3p7TpvWFO/giphy.gif",
    modelSrc: "https://human.biodigital.com/viewer/?id=68Zg&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M3QMd&paid=o_1b172637",
    description: "The heart is a muscular organ that pumps blood around the body by circulating it through the circulatory/vascular system. It is found in the middle mediastinum, wrapped in a two-layered serous sac called the pericardium."
  }
  
  useEffect(() => {
    // If there's no topic data, redirect back to homepage
    if (!topic) {
      navigate('/')
    }
    
    // Reset to main model when topic changes
    setActiveModel('main')
    
    // Page title
    document.title = `${topic?.name || 'System'} - AnaphyVerse`
    
    // Scroll to top on page load
    window.scrollTo(0, 0)
    
    // Add event listener for screen orientation changes
    const handleOrientationChange = () => {
      // Adjust UI based on orientation
      const isLandscape = window.matchMedia("(orientation: landscape)").matches
      document.documentElement.setAttribute('data-orientation', isLandscape ? 'landscape' : 'portrait')
    }
    
    window.addEventListener('resize', handleOrientationChange)
    handleOrientationChange() // Initial check
    
    return () => {
      window.removeEventListener('resize', handleOrientationChange)
    }
  }, [topic, navigate])
  
  const handleBackClick = () => {
    if (activeModel === 'heart') {
      // If we're viewing the heart model, go back to main cardiovascular model
      setActiveModel('main')
    } else {
      // Otherwise, go back to homepage
      navigate('/home')
    }
  }
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }
  
  const switchToHeartModel = () => {
    setActiveModel('heart')
  }
  
  if (!topic) {
    return null // Will redirect via useEffect
  }
  
  // Determine which model and info to display based on activeModel state
  const currentModel = activeModel === 'main' ? topic : heartModel
  const backButtonText = activeModel === 'main' ? '← Back to Systems' : '← Back to Cardiovascular System'
  
  // Only show the heart component for the cardiovascular system
  const showHeartComponent = slug === 'cardiovascular' && activeModel === 'main'
  
  return (
    <div className={`system-model-page ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="mobile-header">
        <button className="model-back-button mobile" onClick={handleBackClick}>
          <span className="back-icon">←</span>
        </button>
        <h2 className="mobile-title">{currentModel.name}</h2>
        <button className="fullscreen-toggle" onClick={toggleFullscreen}>
          {isFullscreen ? '↙' : '↗'}
        </button>
      </div>
      
      <main className="model-page-content">
        <div className="model-page-header">
          <button className="model-back-button desktop" onClick={handleBackClick}>
            {backButtonText}
          </button>
          <h1>{currentModel.name}</h1>
        </div>
        
        <div className="model-container">
          <iframe
            id="embedded-human"
            frameBorder="0"
            allowFullScreen={true}
            loading="lazy"
            src={currentModel.modelSrc}
            title={`${currentModel.name} 3D Model`}
          ></iframe>
          
          <div className="model-controls">
            <button className="fullscreen-button" onClick={toggleFullscreen}>
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
            </button>
          </div>
        </div>
        
        <div className="model-info-panel">
          <h3>About {currentModel.name}</h3>
          <p className="model-description">{currentModel.description || 'Explore this 3D model to learn more about human anatomy.'}</p>
          
          {/* Heart component - only shown for cardiovascular system main view */}
          {showHeartComponent && (
            <div className="sub-component-container">
              <h3>Explore Heart Anatomy</h3>
              <div 
                className="heart-model-card"
                onClick={switchToHeartModel}
                style={{
                  backgroundImage: `url(${heartModel.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '180px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  marginTop: '20px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              >
                <div className="heart-overlay" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    Anatomy of Heart
                  </span>
                </div>
              </div>
              <p className="sub-model-description">
                Click to explore the detailed anatomy of the human heart, the central pump of the cardiovascular system.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SystemModelPage