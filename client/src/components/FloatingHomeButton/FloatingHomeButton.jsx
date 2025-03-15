import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import './FloatingHomeButton.css'

const FloatingHomeButton = () => {
  const navigate = useNavigate()
  
  const handleHomeClick = () => {
    navigate('/home')
  }

  return (
    <div className="floating-home-button" onClick={handleHomeClick}>
      <Home size={24} strokeWidth={2} />
      <span className="tooltip">Back to Home</span>
    </div>
  )
}

export default FloatingHomeButton