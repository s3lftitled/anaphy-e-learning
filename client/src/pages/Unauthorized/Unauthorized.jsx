import { Link } from 'react-router-dom'
import './Unauthorized.css'

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div className="unauthorized-title">
          <h1>Access Restricted</h1>
          <div className="title-underline"></div>
        </div>
        <p className="unauthorized-message">
          You don't have permission to access this page.
        </p>
        <div className="unauthorized-actions">
          <Link to="/home" className="primary-button">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage