import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './NotFound.css'

const NotFound = () => {
  const navigate = useNavigate()

  useEffect(() => {
      // Page title
      document.title = `AnaphyVerse - Not Found`
    }, [])
    

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">
          4<span className="hero-highlight">0</span>4
        </h1>
        <div className="pulse-effect"></div>
        <div className="not-found-icon-cont">
          <img  className="not-found-icon" src='sad-icon.png' />
        </div>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you are looking for might have been removed, doesn't exists, had its name changed, 
          or is temporarily unavailable.
        </p>
        <button onClick={() => navigate('/home')} className="hero-button not-found-button">
          Return Home
        </button>
      </div>
    </div>
  )
}

export default NotFound